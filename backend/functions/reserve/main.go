package main

import (
	"context"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/resend/resend-go/v2"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Reservation struct {
	Nombre      string    `json:"nombre" bson:"nombre"`
	Telefono    string    `json:"telefono" bson:"telefono"`
	Servicio    string    `json:"servicio" bson:"servicio"`
	FechaRaw    string    `json:"fechaRaw" bson:"fechaRaw"`
	HoraRaw     string    `json:"horaRaw" bson:"horaRaw"`
	Direccion   string    `json:"direccion" bson:"direccion"`
	WhatsappUrl string    `json:"whatsappUrl" bson:"whatsappUrl"`
	ClientIP    string    `json:"clientIp,omitempty" bson:"clientIp,omitempty"`
	CreatedAt   time.Time `json:"createdAt" bson:"createdAt"`
}

func buildEmailHTML(res Reservation) string {
	nombre := html.EscapeString(res.Nombre)
	servicio := html.EscapeString(res.Servicio)
	fechaRaw := html.EscapeString(res.FechaRaw)
	horaRaw := html.EscapeString(res.HoraRaw)
	telefono := html.EscapeString(res.Telefono)
	direccion := html.EscapeString(res.Direccion)

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nueva Reserva - Personal Barber</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0b0f;font-family:'Arial Narrow','Impact','Helvetica Neue',Helvetica,Arial,sans-serif;color:#ffffff;">

  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0a0b0f;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background-color:#13151c;border-radius:20px;overflow:hidden;border:1px solid #1e2130;max-width:580px;width:100%%;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(160deg,#0d0f16 0%%,#0d1a10 100%%);padding:36px 30px 28px;text-align:center;border-bottom:1px solid #1a3d1a;">
              <img src="https://personalbarber.co/icon-512.png" alt="Personal Barber" width="72" height="72"
                style="border-radius:18px;border:2px solid rgba(57,255,20,0.25);display:block;margin:0 auto 16px;" />
              <h1 style="margin:0 0 4px;font-size:28px;font-weight:700;letter-spacing:4px;color:#ffffff;text-transform:uppercase;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">
                PERSONAL <span style="color:#39FF14;">BARBER</span>
              </h1>
              <p style="margin:0 0 16px;font-size:12px;letter-spacing:3px;color:rgba(57,255,20,0.5);text-transform:uppercase;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;">
                Tu barbería de confianza
              </p>
              <span style="display:inline-block;background-color:rgba(57,255,20,0.08);border:1px solid rgba(57,255,20,0.2);color:#39FF14;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:6px 18px;border-radius:50px;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">
                💈 Nueva reserva confirmada
              </span>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 30px;">

              <p style="font-size:16px;color:#94a3b8;margin:0 0 24px;line-height:1.7;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;letter-spacing:0.5px;">
                ¡Hola! Tienes una nueva cita en tu sistema. <strong style="color:#ffffff;font-weight:600;">%s</strong> ha agendado
                un servicio. Aquí tienes todos los detalles:
              </p>

              <!-- DETAILS CARD -->
              <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0d0f16;border-radius:14px;border:1px solid #1e2130;overflow:hidden;margin-bottom:28px;">

                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #1a1d28;">
                    <p style="margin:0 0 5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#39FF14;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">👤 Cliente</p>
                    <p style="margin:0;font-size:17px;font-weight:500;color:#e2e8f0;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">%s</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #1a1d28;">
                    <p style="margin:0 0 5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#39FF14;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">✂️ Servicio</p>
                    <p style="margin:0;font-size:17px;font-weight:500;color:#e2e8f0;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">%s</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #1a1d28;">
                    <p style="margin:0 0 5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#39FF14;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">📅 Fecha</p>
                    <p style="margin:0;font-size:17px;font-weight:500;color:#e2e8f0;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">%s</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #1a1d28;">
                    <p style="margin:0 0 5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#39FF14;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">🕐 Hora</p>
                    <p style="margin:0;font-size:17px;font-weight:500;color:#e2e8f0;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">%s</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #1a1d28;">
                    <p style="margin:0 0 5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#39FF14;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">📞 Teléfono</p>
                    <p style="margin:0;font-size:17px;font-weight:500;color:#e2e8f0;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">%s</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 20px;">
                    <p style="margin:0 0 5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#39FF14;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;">📍 Dirección</p>
                    <p style="margin:0;font-size:17px;font-weight:500;color:#e2e8f0;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0.5px;">%s</p>
                  </td>
                </tr>

              </table>

              <!-- DIVIDER -->
              <table width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(to right,transparent,rgba(57,255,20,0.12),transparent);"></td>
                </tr>
              </table>

              <!-- CTA BUTTON -->
              <table width="100%%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <a href="https://personalbarber.co/wa"
                      style="display:inline-block;background-color:#39FF14;color:#040605;text-decoration:none;padding:15px 38px;border-radius:50px;font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:2px;font-family:'Arial Narrow','Impact','Helvetica Neue',Helvetica,Arial,sans-serif;">
                      Abrir Chat en WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="text-align:center;padding:20px 30px;background-color:#0a0b0f;border-top:1px solid #1a1d28;">
              <p style="margin:0;font-size:11px;color:#374151;line-height:1.7;font-family:'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">
                Notificación automática · <a href="https://personalbarber.co" style="color:rgba(57,255,20,0.4);text-decoration:none;">personalbarber.co</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`, nombre, nombre, servicio, fechaRaw, horaRaw, telefono, direccion)
}

func getClientIP(req events.APIGatewayProxyRequest) string {
	for k, v := range req.Headers {
		lower := strings.ToLower(k)
		if lower == "x-nf-client-connection-ip" && v != "" {
			return v
		}
	}
	for k, v := range req.Headers {
		lower := strings.ToLower(k)
		if lower == "x-forwarded-for" && v != "" {
			parts := strings.Split(v, ",")
			return strings.TrimSpace(parts[0])
		}
	}
	if req.RequestContext.Identity.SourceIP != "" {
		return req.RequestContext.Identity.SourceIP
	}
	return "desconocida"
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Solo aceptamos POST
	if request.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusMethodNotAllowed,
			Body:       `{"error": "Method not allowed"}`,
		}, nil
	}

	// Parsear el body
	var res Reservation
	err := json.Unmarshal([]byte(request.Body), &res)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       `{"error": "Invalid request body"}`,
		}, nil
	}

	// Sanitización y Validación de Longitud Estricta (Anti Spam/Dos Data)
	if len(res.Nombre) > 100 || len(res.Telefono) > 30 || len(res.Servicio) > 100 ||
		len(res.Direccion) > 200 || len(res.FechaRaw) > 50 || len(res.HoraRaw) > 50 {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       `{"error": "Payload excedió longitud máxima permitida por seguridad"}`,
		}, nil
	}

	res.CreatedAt = time.Now()
	res.ClientIP = getClientIP(request)

	// Conectar a MongoDB
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"error": "Database configuration missing"}`,
		}, nil
	}

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Failed to connect to DB: %v"}`, err),
		}, nil
	}
	defer client.Disconnect(ctx)

	// Ping a la base de datos para verificar conexión
	err = client.Ping(ctx, nil)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Failed to ping DB: %v"}`, err),
		}, nil
	}

	collection := client.Database("personalbarber").Collection("reservations")

	// Verificar si ya existe una reserva para la misma fecha y hora
	var existing Reservation
	filter := map[string]string{
		"fechaRaw": res.FechaRaw,
		"horaRaw":  res.HoraRaw,
	}
	err = collection.FindOne(ctx, filter).Decode(&existing)
	if err == nil {
		// Si no hay error, significa que encontró una reserva coincidente
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusConflict,
			Body:       `{"error": "Este turno ya ha sido reservado por otra persona. Por favor elige otro."}`,
		}, nil
	} else if err != mongo.ErrNoDocuments {
		// Si hubo un error que no sea "No se encontró el documento"
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Error al verificar disponibilidad: %v"}`, err),
		}, nil
	}

	// Si no existe, procedemos a insertar
	_, err = collection.InsertOne(ctx, res)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Failed to save reservation: %v"}`, err),
		}, nil
	}

	// === ENVÍO DE NOTIFICACIÓN POR CORREO (RESEND) ===
	resendKey := os.Getenv("RESEND_API_KEY")
	if resendKey != "" {
		clienteResend := resend.NewClient(resendKey)

		parametrosCorreo := &resend.SendEmailRequest{
			From:    "Personal Barber <reservas@personalbarber.co>",
			To:      []string{"jhonechavarria0506@gmail.com", "Calatrava7000@gmail.com"},
			Subject: "💈 ¡Nueva Reserva de " + res.Nombre + "!",
			Html:    buildEmailHTML(res),
		}

		_, errResend := clienteResend.Emails.Send(parametrosCorreo)
		if errResend != nil {
			fmt.Printf("Error al enviar correo con Resend: %v\n", errResend)
		} else {
			fmt.Println("Correo de notificación enviado con éxito")
		}
	} else {
		fmt.Println("No se encontró RESEND_API_KEY. Saltando el envío de correo.")
	}
	// =================================================

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: `{"message": "Reserva guardada con éxito en MongoDB Atlas!"}`,
	}, nil
}

func main() {
	lambda.Start(handler)
}
