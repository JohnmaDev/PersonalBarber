package auth

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// VerifyTokenWithRateLimit comprueba el PIN de administrador y bloquea permanentemente IPs con múltiples fallos (Fuerza Bruta)
func VerifyTokenWithRateLimit(ctx context.Context, request events.APIGatewayProxyRequest, client *mongo.Client) (bool, error) {
	adminPin := os.Getenv("VUE_APP_ADMIN_PIN")
	if adminPin == "" {
		return false, fmt.Errorf("Admin PIN missing")
	}

	ip := request.Headers["x-forwarded-for"]
	if ip == "" {
		ip = request.Headers["x-nf-client-connection-ip"]
	}
	if ip == "" {
		ip = request.RequestContext.Identity.SourceIP
	}
	if ip == "" {
		ip = "unknown"
	}

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

	providedToken := request.Headers["Authorization"]
	if providedToken == "" {
		providedToken = request.Headers["authorization"]
	}
	if providedToken == "" {
		providedToken = request.QueryStringParameters["token"]
	}

	// Éxito. Borrar historial negativo si lo hubiera.
	if providedToken == adminPin {
		if record.Attempts > 0 {
			collection.DeleteOne(ctx, bson.M{"ip": ip})
		}
		return true, nil
	}

	// Fallo. Incrementar contador en Base de Datos.
	opts := options.Update().SetUpsert(true)
	update := bson.M{
		"$inc": bson.M{"attempts": 1},
		"$setOnInsert": bson.M{"firstFailAt": time.Now()},
	}
	if record.Attempts == 4 { // Este es el quinto intento, quedará bloqueado
		update["$set"] = bson.M{"blockedAt": time.Now()}
	}

	collection.UpdateOne(ctx, bson.M{"ip": ip}, update, opts)
	
	// Tarpit delay (ralentizar scripts)
	time.Sleep(3 * time.Second)
	return false, nil
}
