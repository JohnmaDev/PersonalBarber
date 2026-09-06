package main

import (
	"context"
	"crypto/subtle"
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
// Consulta el estado actual de una orden.
// Protegido: Requiere el token temporal emitido al crear la orden
// o el PIN de administrador.
//
// GET /api/order_status?id=ORD-12345&token=<orderToken>
// ──────────────────────────────────────────

type OrderResponse struct {
	ID                 string  `json:"id"`
	Status             string  `json:"status"`
	Total              float64 `json:"total"`
	TotalFormat        string  `json:"total_format"`
	ShippingMethod     string  `json:"shippingMethod"`
	PaymentMethod      string  `json:"paymentMethod"`
	WompiTransactionID string  `json:"wompiTransactionId,omitempty"`
	WompiStatus        string  `json:"wompiStatus,omitempty"`
}

type StoredOrderInternal struct {
	ID                 string  `bson:"id"`
	Status             string  `bson:"status"`
	Total              float64 `bson:"total"`
	TotalFormat        string  `bson:"total_format"`
	ShippingMethod     string  `bson:"shippingMethod"`
	PaymentMethod      string  `bson:"paymentMethod"`
	WompiTransactionID string  `bson:"wompiTransactionId,omitempty"`
	WompiStatus        string  `bson:"wompiStatus,omitempty"`
	OrderToken         string  `bson:"orderToken,omitempty"`
}

func corsHeaders() map[string]string {
	return map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Headers": "Content-Type, X-Order-Token, Authorization",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Content-Type":                 "application/json",
	}
}

// extractToken extrae el token de autorización de la orden desde headers o query
func extractToken(request events.APIGatewayProxyRequest) string {
	// 1. Header específico X-Order-Token
	for k, v := range request.Headers {
		if strings.EqualFold(k, "x-order-token") && strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}

	// 2. Header Authorization estándar
	for k, v := range request.Headers {
		if strings.EqualFold(k, "authorization") && strings.TrimSpace(v) != "" {
			token := strings.TrimSpace(v)
			if strings.HasPrefix(strings.ToLower(token), "bearer ") {
				return strings.TrimSpace(token[7:])
			}
			return token
		}
	}

	// 3. Query string parameter 'token' (enlace de retorno de pasarela o checkout)
	if token := request.QueryStringParameters["token"]; strings.TrimSpace(token) != "" {
		return strings.TrimSpace(token)
	}

	return ""
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

	// ── 1. Obtener el ID de la orden ──
	orderID := strings.TrimSpace(request.QueryStringParameters["id"])
	if orderID == "" {
		body, _ := json.Marshal(map[string]interface{}{
			"ok":    false,
			"error": "El parámetro 'id' es requerido",
		})
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Headers:    corsHeaders(),
			Body:       string(body),
		}, nil
	}

	// Validar formato del ID (prevenir inyecciones o longitudes anómalas)
	if len(orderID) > 30 {
		body, _ := json.Marshal(map[string]interface{}{
			"ok":    false,
			"error": "ID inválido",
		})
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Headers:    corsHeaders(),
			Body:       string(body),
		}, nil
	}

	// ── 2. Conectar a MongoDB ──
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers:    corsHeaders(),
			Body:       `{"ok": false, "error": "config"}`,
		}, nil
	}

	client, err := mongo.Connect(options.Client().ApplyURI(mongoURI))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers:    corsHeaders(),
			Body:       `{"ok": false, "error": "db_connect"}`,
		}, nil
	}
	defer client.Disconnect(ctx)

	// ── 3. Buscar la orden en la base de datos ──
	db := client.Database("personalbarber")
	var storedOrder StoredOrderInternal
	err = db.Collection("orders").FindOne(ctx, bson.M{"id": orderID}).Decode(&storedOrder)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			body, _ := json.Marshal(map[string]interface{}{
				"ok":    false,
				"error": "Orden no encontrada",
			})
			return events.APIGatewayProxyResponse{
				StatusCode: 404,
				Headers:    corsHeaders(),
				Body:       string(body),
			}, nil
		}
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers:    corsHeaders(),
			Body:       fmt.Sprintf(`{"ok": false, "error": "%v"}`, err),
		}, nil
	}

	// ── 4. Verificación de Autorización (Evitar BOLA / Scraping de Órdenes) ──
	providedToken := extractToken(request)
	adminPin := os.Getenv("NUXT_ADMIN_PIN")
	if adminPin == "" {
		adminPin = os.Getenv("VUE_APP_ADMIN_PIN")
	}

	isAuthorized := false

	// A) Autorizado si el token coincide con el OrderToken criptográfico emitido al cliente
	if storedOrder.OrderToken != "" && providedToken != "" {
		if subtle.ConstantTimeCompare([]byte(providedToken), []byte(storedOrder.OrderToken)) == 1 {
			isAuthorized = true
		}
	}

	// B) Autorizado si es el administrador consultando con el PIN de administración
	if adminPin != "" && providedToken != "" {
		if subtle.ConstantTimeCompare([]byte(providedToken), []byte(adminPin)) == 1 {
			isAuthorized = true
		}
	}

	if !isAuthorized {
		body, _ := json.Marshal(map[string]interface{}{
			"ok":    false,
			"error": "Acceso no autorizado para consultar esta orden.",
		})
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Headers:    corsHeaders(),
			Body:       string(body),
		}, nil
	}

	// ── 5. Responder con los datos de la orden (sin exponer el token interno) ──
	orderResponse := OrderResponse{
		ID:                 storedOrder.ID,
		Status:             storedOrder.Status,
		Total:              storedOrder.Total,
		TotalFormat:        storedOrder.TotalFormat,
		ShippingMethod:     storedOrder.ShippingMethod,
		PaymentMethod:      storedOrder.PaymentMethod,
		WompiTransactionID: storedOrder.WompiTransactionID,
		WompiStatus:        storedOrder.WompiStatus,
	}

	body, _ := json.Marshal(map[string]interface{}{
		"ok":    true,
		"order": orderResponse,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    corsHeaders(),
		Body:       string(body),
	}, nil
}

func main() {
	lambda.Start(handler)
}
