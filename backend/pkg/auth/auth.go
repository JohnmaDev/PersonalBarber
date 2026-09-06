package auth

import (
	"context"
	"crypto/subtle"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// getTrustedClientIP extrae la IP real del cliente evitando spoofing mediante X-Forwarded-For
func getTrustedClientIP(request events.APIGatewayProxyRequest) string {
	// 1. Prioridad: Netlify inyecta x-nf-client-connection-ip directamente desde su borde
	for k, v := range request.Headers {
		if strings.EqualFold(k, "x-nf-client-connection-ip") && strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}

	// 2. Segunda opción confiable: IP de la conexión directa de AWS Lambda / API Gateway
	if strings.TrimSpace(request.RequestContext.Identity.SourceIP) != "" {
		return strings.TrimSpace(request.RequestContext.Identity.SourceIP)
	}

	// 3. Fallback: En proxies estándar, tomar la última IP confiable (la más cercana al proxy)
	// NUNCA tomar la primera IP de X-Forwarded-For porque es completamente falsificable por el cliente
	for k, v := range request.Headers {
		if strings.EqualFold(k, "x-forwarded-for") && strings.TrimSpace(v) != "" {
			parts := strings.Split(v, ",")
			return strings.TrimSpace(parts[len(parts)-1])
		}
	}

	return "unknown"
}

// VerifyTokenWithRateLimit comprueba el PIN de administrador y bloquea permanentemente IPs con múltiples fallos (Fuerza Bruta)
func VerifyTokenWithRateLimit(ctx context.Context, request events.APIGatewayProxyRequest, client *mongo.Client) (bool, error) {
	adminPin := os.Getenv("NUXT_ADMIN_PIN")
	if adminPin == "" {
		adminPin = os.Getenv("VUE_APP_ADMIN_PIN")
	}
	if adminPin == "" {
		return false, fmt.Errorf("Admin PIN missing")
	}

	ip := getTrustedClientIP(request)

	collection := client.Database("personalbarber").Collection("blocked_ips")

	var record struct {
		IP        string    `bson:"ip"`
		Attempts  int       `bson:"attempts"`
		BlockedAt time.Time `bson:"blockedAt,omitempty"`
	}

	err := collection.FindOne(ctx, bson.M{"ip": ip}).Decode(&record)

	// Si tiene 5 o más intentos fallidos
	if err == nil && record.Attempts >= 5 {
		// Calcular si ya pasaron 30 minutos desde el bloqueo
		if !record.BlockedAt.IsZero() && time.Since(record.BlockedAt) < 30*time.Minute {
			time.Sleep(5 * time.Second) // Tarpit para desesperar bots
			return false, fmt.Errorf("IP bloqueada temporalmente por seguridad. Inténtalo de nuevo en unos minutos.")
		}

		// Si ya pasó el tiempo, reseteamos el contador para permitir nuevos intentos
		collection.DeleteOne(ctx, bson.M{"ip": ip})
		record.Attempts = 0
	}

	// Extraer el token ÚNICAMENTE desde el encabezado Authorization (o cuerpo JSON en verify_pin)
	// NUNCA desde la Query String (?token=...)
	var providedToken string
	for k, v := range request.Headers {
		if strings.EqualFold(k, "authorization") && strings.TrimSpace(v) != "" {
			providedToken = strings.TrimSpace(v)
			break
		}
	}

	if strings.HasPrefix(strings.ToLower(providedToken), "bearer ") {
		providedToken = strings.TrimSpace(providedToken[7:])
	}

	// Permitir envío en el body únicamente para el login inicial en verify_pin
	if providedToken == "" && len(request.Body) > 0 {
		var body map[string]interface{}
		if err := json.Unmarshal([]byte(request.Body), &body); err == nil {
			if val, ok := body["pin"].(string); ok && val != "" {
				providedToken = strings.TrimSpace(val)
			}
		}
	}

	// Comparación de tiempo constante (Anti-Timing Attack)
	isAuthorized := subtle.ConstantTimeCompare([]byte(providedToken), []byte(adminPin)) == 1

	// Éxito. Borrar historial negativo si lo hubiera.
	if isAuthorized {
		if record.Attempts > 0 {
			collection.DeleteOne(ctx, bson.M{"ip": ip})
		}
		return true, nil
	}

	// Fallo. Incrementar contador en Base de Datos.
	opts := options.Update().SetUpsert(true)
	update := bson.M{
		"$inc":         bson.M{"attempts": 1},
		"$setOnInsert": bson.M{"firstFailAt": time.Now()},
	}
	if record.Attempts == 4 { // Este es el quinto intento, quedará bloqueado
		update["$set"] = bson.M{"blockedAt": time.Now()}
	}

	collection.UpdateOne(ctx, bson.M{"ip": ip}, update, opts)

	// Tarpit delay (ralentizar scripts de fuerza bruta)
	time.Sleep(3 * time.Second)
	return false, nil
}
