package main

import (
	"context"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"html"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/resend/resend-go/v2"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// ──────────────────────────────────────────
// Webhook de Wompi — recibe eventos transaction.updated
//
// Verifica la firma del evento, actualiza la orden en MongoDB,
// descuenta stock y envía correos de confirmación vía Resend
// cuando el pago es aprobado.
//
// POST /api/wompi_webhook
// ──────────────────────────────────────────

// ── Tipos del payload de Wompi ──

type WebhookPayload struct {
	Event     string        `json:"event"`
	Data      WebhookData   `json:"data"`
	Signature WebhookSig    `json:"signature"`
	Timestamp int64         `json:"timestamp"`
	SentAt    string        `json:"sent_at"`
}

type WebhookData struct {
	Transaction WompiTransaction `json:"transaction"`
}

type WompiTransaction struct {
	ID            string      `json:"id"`
	Status        string      `json:"status"`
	Reference     string      `json:"reference"`
	AmountInCents int64       `json:"amount_in_cents"`
	Currency      string      `json:"currency"`
	PaymentMethod interface{} `json:"payment_method"`
	CreatedAt     string      `json:"created_at"`
	FinalizedAt   string      `json:"finalized_at"`
}

type WebhookSig struct {
	Checksum   string   `json:"checksum"`
	Properties []string `json:"properties"`
}

// ── Tipos para la orden en MongoDB ──

type OrderCustomer struct {
	FirstName string `bson:"firstName" json:"firstName"`
	LastName  string `bson:"lastName" json:"lastName"`
	Email     string `bson:"email" json:"email"`
	Phone     string `bson:"phone" json:"phone"`
	City      string `bson:"city" json:"city"`
	Address   string `bson:"address" json:"address"`
}

type OrderItem struct {
	ID       interface{} `bson:"id" json:"id"`
	Name     string      `bson:"name" json:"name"`
	Qty      int         `bson:"qty" json:"qty"`
	Price    float64     `bson:"price" json:"price"`
	Subtotal float64     `bson:"subtotal" json:"subtotal"`
}

type StoredOrder struct {
	ID             string        `bson:"id" json:"id"`
	Status         string        `bson:"status" json:"status"`
	Customer       OrderCustomer `bson:"customer" json:"customer"`
	Items          []OrderItem   `bson:"items" json:"items"`
	Subtotal       float64       `bson:"subtotal" json:"subtotal"`
	SubtotalFormat string        `bson:"subtotal_format" json:"subtotal_format"`
	ShippingCost   float64       `bson:"shippingCost" json:"shippingCost"`
	ShippingFormat string        `bson:"shipping_format" json:"shipping_format"`
	ShippingMethod string        `bson:"shippingMethod" json:"shippingMethod"`
	Total          float64       `bson:"total" json:"total"`
	TotalFormat    string        `bson:"total_format" json:"total_format"`
	PaymentMethod  string        `bson:"paymentMethod" json:"paymentMethod"`
}

// corsHeaders devuelve las cabeceras CORS
func corsHeaders() map[string]string {
	return map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Headers": "Content-Type, X-Event-Checksum",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Content-Type":                 "application/json",
	}
}

// getNestedValue navega las propiedades del payload siguiendo la notación de punto
func getNestedValue(data WebhookData, path string) string {
	parts := strings.Split(path, ".")
	if len(parts) < 2 || parts[0] != "transaction" {
		return ""
	}

	tx := data.Transaction
	switch parts[1] {
	case "id":
		return tx.ID
	case "status":
		return tx.Status
	case "amount_in_cents":
		return fmt.Sprintf("%d", tx.AmountInCents)
	case "reference":
		return tx.Reference
	case "currency":
		return tx.Currency
	default:
		return ""
	}
}

// verifySignature valida la firma del webhook de Wompi
func verifySignature(payload WebhookPayload, eventsSecret string) bool {
	var concat string
	for _, prop := range payload.Signature.Properties {
		concat += getNestedValue(payload.Data, prop)
	}
	concat += fmt.Sprintf("%d", payload.Timestamp)
	concat += eventsSecret

	hash := sha256.Sum256([]byte(concat))
	calculated := hex.EncodeToString(hash[:])

	return subtle.ConstantTimeCompare([]byte(calculated), []byte(payload.Signature.Checksum)) == 1
}

// formatAmount formatea un valor numérico a moneda colombiana con separadores de miles
func formatAmount(val float64, fallbackFormatted string) string {
	if fallbackFormatted != "" {
		return fallbackFormatted
	}
	intVal := int64(val)
	str := fmt.Sprintf("%d", intVal)
	if len(str) <= 3 {
		return str
	}
	var res []string
	count := 0
	for i := len(str) - 1; i >= 0; i-- {
		res = append([]string{string(str[i])}, res...)
		count++
		if count%3 == 0 && i != 0 {
			res = append([]string{"."}, res...)
		}
	}
	return strings.Join(res, "")
}

// cleanPhoneForWhatsApp normaliza el teléfono para enlaces de WhatsApp
func cleanPhoneForWhatsApp(phone string) string {
	var digits strings.Builder
	for _, ch := range phone {
		if ch >= '0' && ch <= '9' {
			digits.WriteRune(ch)
		}
	}
	d := digits.String()
	if strings.HasPrefix(d, "57") {
		return d
	}
	return "57" + d
}

// formatOrderDate formatea una fecha ISO/RFC3339 de Wompi al formato local de Colombia (UTC-5)
func formatOrderDate(rawDate string) string {
	rawDate = strings.TrimSpace(rawDate)
	if rawDate == "" {
		return ""
	}
	t, err := time.Parse(time.RFC3339Nano, rawDate)
	if err != nil {
		t, err = time.Parse(time.RFC3339, rawDate)
		if err != nil {
			t, err = time.Parse("2006-01-02T15:04:05", rawDate)
			if err != nil {
				return ""
			}
		}
	}
	loc := time.FixedZone("COT", -5*60*60)
	t = t.In(loc)

	meses := []string{"", "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"}
	mes := meses[t.Month()]
	return fmt.Sprintf("%d de %s de %d, %02d:%02d", t.Day(), mes, t.Year(), t.Hour(), t.Minute())
}

// buildCustomerOrderEmailHTML genera la plantilla HTML del correo para el cliente
func buildCustomerOrderEmailHTML(order StoredOrder, tx WompiTransaction) string {
	var itemsHTML strings.Builder
	for _, item := range order.Items {
		itemName := html.EscapeString(item.Name)
		itemPrice := formatAmount(item.Price, "")
		itemSubtotal := formatAmount(item.Subtotal, "")

		itemsHTML.WriteString(fmt.Sprintf(`
			<tr>
				<td style="padding:12px 16px;border-bottom:1px solid #1a1d28;color:#ffffff;font-size:14px;">
					<strong>%s</strong>
					<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Cantidad: %d &times; $%s COP</div>
				</td>
				<td align="right" style="padding:12px 16px;border-bottom:1px solid #1a1d28;color:#22c55e;font-size:14px;font-weight:600;white-space:nowrap;">
					$%s COP
				</td>
			</tr>`, itemName, item.Qty, itemPrice, itemSubtotal))
	}

	// Extraer primer nombre del cliente para saludo amigable
	displayName := strings.TrimSpace(order.Customer.FirstName)
	if displayName == "" {
		fullName := strings.TrimSpace(order.Customer.FirstName + " " + order.Customer.LastName)
		parts := strings.Fields(fullName)
		if len(parts) > 0 {
			displayName = parts[0]
		} else {
			displayName = "Cliente"
		}
	}
	escapedDisplayName := html.EscapeString(displayName)

	fullCustomerName := strings.TrimSpace(order.Customer.FirstName + " " + order.Customer.LastName)
	if fullCustomerName == "" {
		fullCustomerName = displayName
	}
	escapedFullCustomerName := html.EscapeString(fullCustomerName)

	customerAddress := html.EscapeString(order.Customer.Address)
	customerCity := html.EscapeString(order.Customer.City)
	customerPhone := html.EscapeString(order.Customer.Phone)

	subtotalStr := formatAmount(order.Subtotal, order.SubtotalFormat)
	totalStr := formatAmount(order.Total, order.TotalFormat)

	// Envío: Política PersonalBarber 100% GRATIS a todo Colombia
	shippingTitle := "Envío (100% GRATIS a todo Colombia 🇨🇴)"
	shippingVal := "$0 COP"
	shippingColor := "#22c55e"
	if order.ShippingCost > 0 {
		shippingTitle = "Envío"
		if order.ShippingMethod != "" {
			shippingTitle = fmt.Sprintf("Envío (%s)", html.EscapeString(order.ShippingMethod))
		}
		shippingVal = fmt.Sprintf("$%s COP", formatAmount(order.ShippingCost, order.ShippingFormat))
		shippingColor = "#ffffff"
	}

	// Fecha de compra a partir de los datos existentes en la transacción
	orderDate := formatOrderDate(tx.FinalizedAt)
	if orderDate == "" {
		orderDate = formatOrderDate(tx.CreatedAt)
	}
	var dateHTML string
	if orderDate != "" {
		dateHTML = fmt.Sprintf(`<div style="font-size:13px;color:#94a3b8;margin-top:4px;"><strong style="color:#ffffff;">Fecha:</strong> %s</div>`, html.EscapeString(orderDate))
	}

	// Construcción segura del enlace de WhatsApp con mensaje precargado
	waMessage := fmt.Sprintf("Hola, soy %s. Quiero hacer seguimiento a mi pedido #%s. ¿Me pueden ayudar?", displayName, order.ID)
	waURL := fmt.Sprintf("https://wa.me/573337518070?text=%s", url.QueryEscape(waMessage))
	escapedWaURL := html.EscapeString(waURL)

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido - Personal Barber</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0b0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table width="100%%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0a0b0f" style="background-color:#0a0b0f;padding:24px 8px;">
    <tr>
      <td align="center">
        <table width="100%%" border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#13151c" style="background-color:#13151c;border-radius:16px;overflow:hidden;border:1px solid #1e2130;max-width:600px;">
          
          <!-- HEADER -->
          <tr>
            <td bgcolor="#0d0f16" style="background-color:#0d0f16;padding:32px 24px 24px;text-align:center;border-bottom:1px solid #1a231a;">
              <img src="https://personalbarber.co/icon-512.png" alt="Personal Barber" width="60" height="60"
                style="border-radius:14px;border:1px solid rgba(34,197,94,0.3);display:block;margin:0 auto 12px;" />
              <h2 style="margin:0 0 4px;font-size:24px;font-weight:800;letter-spacing:2px;color:#ffffff;text-transform:uppercase;">
                PERSONAL <span style="color:#22c55e;">BARBER</span>
              </h2>
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:1.5px;color:#94a3b8;text-transform:uppercase;">
                Tienda Online Oficial
              </p>
              <span style="display:inline-block;background-color:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);color:#22c55e;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 16px;border-radius:50px;">
                ✓ Pedido confirmado · Pago recibido
              </span>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 24px;">
              <h1 style="margin:0 0 10px;font-size:22px;font-weight:800;color:#ffffff;text-align:center;">
                ¡Gracias por tu compra, %s!
              </h1>
              <p style="font-size:14px;color:#94a3b8;margin:0 0 24px;line-height:1.6;text-align:center;">
                Hemos recibido correctamente tu pago y tu pedido ya fue confirmado.<br>
                Te avisaremos cuando avance el proceso de despacho.
              </p>

              <!-- ORDER INFO CARD -->
              <table width="100%%" cellpadding="0" cellspacing="0" bgcolor="#0d0f16" style="background-color:#0d0f16;border-radius:12px;border:1px solid #1e2130;margin-bottom:24px;padding:16px;">
                <tr>
                  <td>
                    <div style="font-size:14px;color:#ffffff;margin-bottom:2px;">
                      <strong style="color:#94a3b8;">Pedido:</strong> <span style="color:#22c55e;font-weight:700;">#%s</span>
                    </div>
                    %s
                    <div style="font-size:13px;color:#94a3b8;margin-top:4px;">
                      <strong style="color:#ffffff;">Estado:</strong> Pedido confirmado · Pago recibido
                    </div>
                  </td>
                </tr>
              </table>

              <!-- PRODUCT BREAKDOWN -->
              <table width="100%%" cellpadding="0" cellspacing="0" bgcolor="#0d0f16" style="background-color:#0d0f16;border-radius:12px;border:1px solid #1e2130;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="padding:12px 16px;background-color:#161922;border-bottom:1px solid #1e2130;color:#22c55e;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                    Resumen de Productos
                  </td>
                </tr>
                %s
              </table>

              <!-- FINANCIAL SUMMARY -->
              <table width="100%%" cellpadding="0" cellspacing="0" bgcolor="#0d0f16" style="background-color:#0d0f16;border-radius:12px;border:1px solid #1e2130;overflow:hidden;margin-bottom:24px;padding:16px;">
                <tr>
                  <td style="padding:6px 16px;color:#94a3b8;font-size:14px;">Subtotal</td>
                  <td align="right" style="padding:6px 16px;color:#ffffff;font-size:14px;font-weight:600;">$%s COP</td>
                </tr>
                <tr>
                  <td style="padding:6px 16px;color:#94a3b8;font-size:14px;">%s</td>
                  <td align="right" style="padding:6px 16px;color:%s;font-size:14px;font-weight:600;">%s</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:10px 16px 6px;"><hr style="border:none;border-top:1px solid #1e2130;margin:0;" /></td>
                </tr>
                <tr>
                  <td style="padding:8px 16px;color:#ffffff;font-size:16px;font-weight:700;">TOTAL PAGADO</td>
                  <td align="right" style="padding:8px 16px;color:#22c55e;font-size:18px;font-weight:800;">$%s COP</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:6px 16px 2px;color:#94a3b8;font-size:12px;">
                    Medio de pago: <strong style="color:#ffffff;">Wompi</strong>
                  </td>
                </tr>
              </table>

              <!-- SHIPPING ADDRESS -->
              <table width="100%%" cellpadding="0" cellspacing="0" bgcolor="#0d0f16" style="background-color:#0d0f16;border-radius:12px;border:1px solid #1e2130;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#161922;border-bottom:1px solid #1e2130;color:#22c55e;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                    📍 Datos de Entrega
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px;">
                    <div style="font-size:14px;color:#ffffff;font-weight:600;margin-bottom:4px;">%s</div>
                    <div style="font-size:13px;color:#94a3b8;margin-bottom:3px;"><strong style="color:#cbd5e1;">Ciudad:</strong> %s</div>
                    <div style="font-size:13px;color:#94a3b8;margin-bottom:3px;"><strong style="color:#cbd5e1;">Dirección:</strong> %s</div>
                    <div style="font-size:13px;color:#94a3b8;"><strong style="color:#cbd5e1;">Teléfono:</strong> %s</div>
                  </td>
                </tr>
              </table>

              <!-- WHATSAPP SUPPORT CTA -->
              <table width="100%%" cellpadding="0" cellspacing="0" bgcolor="#0d0f16" style="background-color:#0d0f16;border-radius:12px;border:1px solid #1e2130;padding:22px 18px;margin-bottom:24px;text-align:center;">
                <tr>
                  <td>
                    <h3 style="margin:0 0 6px;color:#ffffff;font-size:16px;font-weight:700;">
                      ¿Quieres consultar el estado de tu pedido?
                    </h3>
                    <p style="margin:0 0 16px;color:#94a3b8;font-size:13px;line-height:1.5;">
                      Estamos listos para atenderte por WhatsApp y darte información sobre tu despacho.
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
                      <tr>
                        <td align="center" bgcolor="#25D366" style="border-radius:10px;">
                          <a href="%s" target="_blank"
                            style="display:inline-block;background-color:#25D366;color:#040605;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:800;font-size:14px;line-height:20px;text-align:center;box-sizing:border-box;">
                            💬 Dar seguimiento por WhatsApp
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="text-align:center;font-size:12px;color:#94a3b8;margin:0 0 8px;line-height:1.5;">
                ¿Tienes alguna pregunta sobre tu compra? Responde a este correo o escríbenos a <a href="mailto:ayuda@personalbarber.co" style="color:#25D366;text-decoration:none;font-weight:600;">ayuda@personalbarber.co</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="text-align:center;padding:22px 30px;background-color:#0a0b0f;border-top:1px solid #1a1d28;">
              <p style="margin:0 0 6px;font-size:12px;color:#64748b;">
                Personal Barber · Medellín, Colombia
              </p>
              <p style="margin:0;font-size:11px;color:#475569;">
                <a href="https://personalbarber.co" style="color:#25D366;text-decoration:none;">personalbarber.co</a> · Tu tienda y barbería de confianza
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
		escapedDisplayName,
		order.ID,
		dateHTML,
		itemsHTML.String(),
		subtotalStr,
		shippingTitle,
		shippingColor,
		shippingVal,
		totalStr,
		escapedFullCustomerName,
		customerCity,
		customerAddress,
		customerPhone,
		escapedWaURL)
}

// buildAdminOrderEmailHTML genera la plantilla HTML de alerta de venta para los administradores
func buildAdminOrderEmailHTML(order StoredOrder, tx WompiTransaction) string {
	var itemsHTML strings.Builder
	for _, item := range order.Items {
		itemsHTML.WriteString(fmt.Sprintf(`
			<li style="margin-bottom:6px;color:#ffffff;font-size:14px;">
				<strong>%d &times; %s</strong> — $%s COP
			</li>`, item.Qty, html.EscapeString(item.Name), formatAmount(item.Subtotal, "")))
	}

	customerName := html.EscapeString(strings.TrimSpace(order.Customer.FirstName + " " + order.Customer.LastName))
	totalStr := formatAmount(order.Total, order.TotalFormat)
	cleanPhone := cleanPhoneForWhatsApp(order.Customer.Phone)

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="background-color:#0a0b0f;color:#e2e8f0;font-family:sans-serif;padding:20px;">
  <table width="100%%" max-width="600" style="background:#13151c;border:1px solid #1e2130;border-radius:16px;padding:24px;">
    <tr>
      <td>
        <h2 style="color:#39FF14;margin:0 0 10px;">🛍️ ¡Nueva Venta Aprobada en Personal Barber!</h2>
        <p style="font-size:15px;color:#ffffff;margin:0 0 16px;">
          Se acaba de confirmar el pago de la orden <strong>#%s</strong> por <strong>$%s COP</strong> en Wompi.
        </p>

        <div style="background:#0d0f16;padding:16px;border-radius:12px;margin-bottom:20px;border:1px solid #1e2130;">
          <h4 style="color:#39FF14;margin:0 0 8px;text-transform:uppercase;font-size:12px;">Datos del Comprador</h4>
          <p style="margin:0 0 4px;font-size:14px;"><strong>Cliente:</strong> %s</p>
          <p style="margin:0 0 4px;font-size:14px;"><strong>Teléfono:</strong> %s</p>
          <p style="margin:0 0 4px;font-size:14px;"><strong>Email:</strong> %s</p>
          <p style="margin:0;font-size:14px;"><strong>Destino:</strong> %s, %s</p>
        </div>

        <div style="background:#0d0f16;padding:16px;border-radius:12px;margin-bottom:24px;border:1px solid #1e2130;">
          <h4 style="color:#39FF14;margin:0 0 8px;text-transform:uppercase;font-size:12px;">Productos a Despachar</h4>
          <ul style="margin:0;padding-left:20px;">
            %s
          </ul>
        </div>

        <table width="100%%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="https://wa.me/%s" style="background:#25D366;color:#ffffff;text-decoration:none;padding:12px 26px;border-radius:50px;font-weight:bold;font-size:14px;display:inline-block;">
                Abrir WhatsApp con el Cliente →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`, order.ID, totalStr, customerName, html.EscapeString(order.Customer.Phone), html.EscapeString(order.Customer.Email),
		html.EscapeString(order.Customer.Address), html.EscapeString(order.Customer.City), itemsHTML.String(), cleanPhone)
}

// sendOrderConfirmationEmails envía los correos de confirmación tanto al comprador como al equipo
func sendOrderConfirmationEmails(order StoredOrder, tx WompiTransaction) {
	resendKey := os.Getenv("RESEND_API_KEY")
	if resendKey == "" {
		fmt.Println("[WEBHOOK RESEND WARN] No se encontró RESEND_API_KEY. Saltando el envío de correos.")
		return
	}

	client := resend.NewClient(resendKey)

	// 1. Correo de confirmación al cliente (si ingresó email)
	if order.Customer.Email != "" && strings.Contains(order.Customer.Email, "@") {
		customerReq := &resend.SendEmailRequest{
			From:    "Personal Barber Store <pedidos@personalbarber.co>",
			To:      []string{order.Customer.Email},
			Subject: fmt.Sprintf("✓ Confirmación de tu Pedido #%s - Personal Barber", order.ID),
			Html:    buildCustomerOrderEmailHTML(order, tx),
		}

		_, err := client.Emails.Send(customerReq)
		if err != nil {
			fmt.Printf("[WEBHOOK RESEND ERROR] No se pudo enviar correo al cliente (%s): %v\n", order.Customer.Email, err)
		} else {
			fmt.Printf("[WEBHOOK RESEND OK] Correo de confirmación enviado exitosamente al cliente: %s\n", order.Customer.Email)
		}
	}

	// 2. Alerta para los administradores
	adminEmails := []string{"jhonechavarria0506@gmail.com", "Calatrava7000@gmail.com"}
	adminReq := &resend.SendEmailRequest{
		From:    "Personal Barber Store <pedidos@personalbarber.co>",
		To:      adminEmails,
		Subject: fmt.Sprintf("🛍️ ¡Nueva Venta Aprobada! Pedido #%s - $%s COP", order.ID, formatAmount(order.Total, order.TotalFormat)),
		Html:    buildAdminOrderEmailHTML(order, tx),
	}

	_, errAdmin := client.Emails.Send(adminReq)
	if errAdmin != nil {
		fmt.Printf("[WEBHOOK RESEND ERROR] No se pudo enviar alerta al admin: %v\n", errAdmin)
	} else {
		fmt.Println("[WEBHOOK RESEND OK] Alerta de nueva venta enviada a administradores")
	}
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

	// ── 1. Validar configuración ──
	mongoURI := os.Getenv("MONGODB_URI")
	eventsSecret := os.Getenv("WOMPI_EVENTS_SECRET")

	if mongoURI == "" || eventsSecret == "" {
		fmt.Println("[WEBHOOK ERROR] Variables de entorno faltantes (MONGODB_URI o WOMPI_EVENTS_SECRET)")
		// Responder 200 para que Wompi no reintente infinitamente
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       `{"ok": false, "error": "config"}`,
		}, nil
	}

	// ── 2. Parsear el payload ──
	var payload WebhookPayload
	if err := json.Unmarshal([]byte(request.Body), &payload); err != nil {
		fmt.Printf("[WEBHOOK ERROR] JSON inválido: %v\n", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       `{"ok": false, "error": "invalid_json"}`,
		}, nil
	}

	// ── 3. Verificar la firma ──
	if !verifySignature(payload, eventsSecret) {
		fmt.Printf("[WEBHOOK SECURITY] Firma inválida para evento %s ref=%s\n",
			payload.Event, payload.Data.Transaction.Reference)
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Headers:    corsHeaders(),
			Body:       `{"ok": false, "error": "invalid_signature"}`,
		}, nil
	}

	// ── 4. Solo procesar transaction.updated ──
	if payload.Event != "transaction.updated" {
		fmt.Printf("[WEBHOOK] Evento ignorado: %s\n", payload.Event)
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       `{"ok": true, "action": "ignored"}`,
		}, nil
	}

	tx := payload.Data.Transaction
	fmt.Printf("[WEBHOOK] Procesando transacción %s ref=%s status=%s amount=%d\n",
		tx.ID, tx.Reference, tx.Status, tx.AmountInCents)

	// ── 5. Conectar a MongoDB ──
	client, err := mongo.Connect(options.Client().ApplyURI(mongoURI))
	if err != nil {
		fmt.Printf("[WEBHOOK ERROR] MongoDB connect: %v\n", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       `{"ok": false, "error": "db_connect"}`,
		}, nil
	}
	defer client.Disconnect(ctx)

	db := client.Database("personalbarber")
	ordersColl := db.Collection("orders")

	// ── 6. Buscar la orden por referencia ──
	var order StoredOrder
	err = ordersColl.FindOne(ctx, bson.M{
		"id": tx.Reference,
	}).Decode(&order)

	if err != nil {
		fmt.Printf("[WEBHOOK WARN] Orden no encontrada: %s\n", tx.Reference)
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       `{"ok": true, "action": "order_not_found"}`,
		}, nil
	}

	// Evitar reprocesar órdenes ya finalizadas
	if order.Status == "APPROVED" || order.Status == "DECLINED" || order.Status == "VOIDED" {
		fmt.Printf("[WEBHOOK] Orden %s ya en estado final: %s (ignorando)\n", order.ID, order.Status)
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders(),
			Body:       `{"ok": true, "action": "already_processed"}`,
		}, nil
	}

	// ── 7. Actualizar la orden según el estado de la transacción ──
	now := time.Now()

	updateFields := bson.M{
		"wompiTransactionId": tx.ID,
		"wompiStatus":        tx.Status,
		"updatedAt":          now,
	}

	switch tx.Status {
	case "APPROVED":
		updateFields["status"] = "APPROVED"
		updateFields["paidAt"] = now
		updateFields["paymentConfirmed"] = true
	case "DECLINED":
		updateFields["status"] = "DECLINED"
		updateFields["declinedAt"] = now
	case "VOIDED":
		updateFields["status"] = "VOIDED"
		updateFields["voidedAt"] = now
	case "ERROR":
		updateFields["status"] = "ERROR"
		updateFields["errorAt"] = now
	default:
		// Estados intermedios (PENDING, etc.) — solo guardar el ID de transacción
		updateFields["status"] = tx.Status
	}

	_, err = ordersColl.UpdateOne(ctx,
		bson.M{"id": order.ID},
		bson.M{"$set": updateFields},
	)
	if err != nil {
		fmt.Printf("[WEBHOOK ERROR] No se pudo actualizar orden %s: %v\n", order.ID, err)
	}

	// ── 8. Si fue aprobada, descontar stock y enviar correos ──
	if tx.Status == "APPROVED" {
		productsColl := db.Collection("products")
		for _, item := range order.Items {
			if item.Qty > 0 {
				_, err := productsColl.UpdateOne(ctx,
					bson.M{"id": item.ID},
					bson.M{"$inc": bson.M{"stock": -item.Qty}},
				)
				if err != nil {
					fmt.Printf("[WEBHOOK WARN] Error descontando stock de producto %v: %v\n", item.ID, err)
				}
			}
		}
		fmt.Printf("[WEBHOOK OK] Orden %s APROBADA — stock descontado\n", order.ID)

		// Enviar correos de confirmación vía Resend
		sendOrderConfirmationEmails(order, tx)
	} else {
		fmt.Printf("[WEBHOOK OK] Orden %s actualizada a %s\n", order.ID, tx.Status)
	}

	// ── 9. Siempre responder 200 a Wompi ──
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    corsHeaders(),
		Body:       fmt.Sprintf(`{"ok": true, "action": "processed", "status": "%s"}`, tx.Status),
	}, nil
}

func main() {
	lambda.Start(handler)
}
