package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// ──────────────────────────────────────────
// Genera los datos necesarios para abrir el Widget Wompi
// de forma segura: hash de integridad calculado en servidor.
//
// POST /api/create_transaction
// Body: { "orderId": "ORD-12345" }
// ──────────────────────────────────────────

type TransactionRequest struct {
	OrderID string `json:"orderId"`
}

type Order struct {
	ID         string  `bson:"id" json:"id"`
	Total      float64 `bson:"total" json:"total"`
	OrderToken string  `bson:"orderToken" json:"orderToken"`
}

// corsHeaders devuelve las cabeceras CORS estándar
func corsHeaders() map[string]string {
	return map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Content-Type":                 "application/json",
	}
}

// jsonError devuelve una respuesta de error formateada
func jsonError(status int, msg string) events.APIGatewayProxyResponse {
	body, _ := json.Marshal(map[string]interface{}{
		"ok":    false,
		"error": msg,
	})
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers:    corsHeaders(),
		Body:       string(body),
	}
}

// getWompiBaseURL devuelve la URL base de Wompi según el ambiente configurado
func getWompiBaseURL() string {
	env := os.Getenv("WOMPI_ENVIRONMENT")
	if env == "production" {
		return "https://production.wompi.co/v1"
	}
	return "https://sandbox.wompi.co/v1"
}

// generateIntegrityHash genera la firma de integridad SHA256
// Wompi requiere concatenacion directa SIN separadores:
// SHA256(referencia + montoEnCentavos + moneda + llaveIntegridad)
func generateIntegrityHash(reference string, amountInCents int64, currency string, integrityKey string) string {
	concat := reference + fmt.Sprintf("%d", amountInCents) + currency + integrityKey
	hash := sha256.Sum256([]byte(concat))
	return hex.EncodeToString(hash[:])
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Preflight CORS
	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       "OK",
		}, nil
	}

	// ── 1. Validar variables de entorno ──
	mongoURI := os.Getenv("MONGODB_URI")
	publicKey := os.Getenv("WOMPI_PUBLIC_KEY")
	integrityKey := os.Getenv("WOMPI_INTEGRITY_KEY")
	wompiEnv := os.Getenv("WOMPI_ENVIRONMENT")

	if mongoURI == "" || publicKey == "" || integrityKey == "" {
		return jsonError(500, "Configuración de pago incompleta. Contacta soporte."), nil
	}

	if wompiEnv == "" {
		wompiEnv = "sandbox" // Default seguro
	}

	// ── 2. Parsear body ──
	var body TransactionRequest
	if err := json.Unmarshal([]byte(request.Body), &body); err != nil || body.OrderID == "" {
		return jsonError(400, "orderId es requerido"), nil
	}

	// Validar formato del orderId para evitar inyecciones
	if len(body.OrderID) > 20 || !isAlphanumericDash(body.OrderID) {
		return jsonError(400, "orderId inválido"), nil
	}

	// ── 3. Conectar a MongoDB y buscar la orden ──
	client, err := mongo.Connect(options.Client().ApplyURI(mongoURI))
	if err != nil {
		return jsonError(500, "Error de conexión"), nil
	}
	defer client.Disconnect(ctx)

	db := client.Database("personalbarber")
	var order Order
	err = db.Collection("orders").FindOne(ctx, bson.M{
		"id":     body.OrderID,
		"status": "PENDING",
	}).Decode(&order)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return jsonError(404, "Orden no encontrada o ya procesada"), nil
		}
		return jsonError(500, "Error buscando la orden"), nil
	}

	// ── 4. Calcular monto en centavos ──
	// Wompi requiere el monto en centavos (entero)
	amountInCents := int64(order.Total * 100)

	if amountInCents < 100 {
		return jsonError(400, "El monto mínimo de pago es $1 COP"), nil
	}

	// ── 5. Generar hash de integridad ──
	integrityHash := generateIntegrityHash(order.ID, amountInCents, "COP", integrityKey)

	// ── 6. Construir la URL de redirección ──
	siteURL := os.Getenv("NUXT_PUBLIC_SITE_URL")
	if siteURL == "" {
		siteURL = "https://personalbarber.co"
	}
	redirectURL := fmt.Sprintf("%s/checkout/resultado", strings.TrimRight(siteURL, "/"))

	// ── 7. Marcar la orden como AWAITING_PAYMENT ──
	db.Collection("orders").UpdateOne(ctx,
		bson.M{"id": order.ID},
		bson.M{"$set": bson.M{"status": "AWAITING_PAYMENT"}},
	)

	// ── 8. Responder con los datos para el Widget ──
	responseBody, _ := json.Marshal(map[string]interface{}{
		"ok":               true,
		"publicKey":        publicKey,
		"amountInCents":    amountInCents,
		"currency":         "COP",
		"reference":        order.ID,
		"integrityHash":    integrityHash,
		"redirectUrl":      redirectURL,
		"wompiEnvironment": wompiEnv,
		"orderToken":       order.OrderToken,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    corsHeaders(),
		Body:       string(responseBody),
	}, nil
}

// isAlphanumericDash valida que un string solo contenga letras, números y guiones
func isAlphanumericDash(s string) bool {
	for _, c := range s {
		if !((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '-') {
			return false
		}
	}
	return true
}

func main() {
	lambda.Start(handler)
}
