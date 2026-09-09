package main

import (
	"net/url"
	"strings"
	"testing"
)

func TestFormatOrderDate(t *testing.T) {
	// ISO 8601 en UTC: 2026-09-08T22:30:00Z -> Hora Colombia (UTC-5): 17:30
	raw := "2026-09-08T22:30:00Z"
	got := formatOrderDate(raw)
	expected := "8 de septiembre de 2026, 17:30"
	if got != expected {
		t.Errorf("formatOrderDate(%q) = %q, want %q", raw, got, expected)
	}

	// Manejo de cadena vacía
	if formatOrderDate("") != "" {
		t.Errorf("formatOrderDate(\"\") debe ser vacío, obtuve %q", formatOrderDate(""))
	}

	// Manejo de fecha inválida
	if formatOrderDate("invalid-date") != "" {
		t.Errorf("formatOrderDate(\"invalid-date\") debe ser vacío, obtuve %q", formatOrderDate("invalid-date"))
	}
}

func TestBuildCustomerOrderEmailHTML(t *testing.T) {
	order := StoredOrder{
		ID:     "ORD-99881",
		Status: "APPROVED",
		Customer: OrderCustomer{
			FirstName: "Carlos",
			LastName:  "Restrepo",
			Email:     "carlos@example.com",
			Phone:     "3001234567",
			City:      "Medellín",
			Address:   "Carrera 43A # 1-50 (Apto 302)",
		},
		Items: []OrderItem{
			{
				ID:       int64(101),
				Name:     "Pomada Nishman Matte 01",
				Qty:      2,
				Price:    35000,
				Subtotal: 70000,
			},
		},
		Subtotal:       70000,
		SubtotalFormat: "70.000",
		ShippingCost:   0,
		ShippingFormat: "0",
		Total:          70000,
		TotalFormat:    "70.000",
		PaymentMethod:  "wompi",
	}

	wompiUUID := "wompi-internal-uuid-9999-sec"
	tx := WompiTransaction{
		ID:            wompiUUID,
		Status:        "APPROVED",
		Reference:     "ORD-99881",
		AmountInCents: 7000000,
		Currency:      "COP",
		FinalizedAt:   "2026-09-08T20:15:00Z",
	}

	htmlContent := buildCustomerOrderEmailHTML(order, tx)

	// 1. Título y saludo con nombre
	if !strings.Contains(htmlContent, "¡Gracias por tu compra, Carlos!") {
		t.Errorf("El correo debe contener saludo personalizado con nombre")
	}

	// 2. Mensaje exacto requerido
	if !strings.Contains(htmlContent, "Hemos recibido correctamente tu pago y tu pedido ya fue confirmado.") {
		t.Errorf("El correo debe indicar que el pago fue recibido y el pedido confirmado")
	}
	if !strings.Contains(htmlContent, "Te avisaremos cuando avance el proceso de despacho.") {
		t.Errorf("El correo debe incluir frase de avance del despacho")
	}

	// 3. Número de pedido y estado
	if !strings.Contains(htmlContent, "#ORD-99881") {
		t.Errorf("El correo debe mostrar el número de pedido #ORD-99881")
	}
	if !strings.Contains(htmlContent, "Pedido confirmado · Pago recibido") {
		t.Errorf("El correo debe mostrar el estado 'Pedido confirmado · Pago recibido'")
	}

	// 4. Fecha formateada
	if !strings.Contains(htmlContent, "8 de septiembre de 2026") {
		t.Errorf("El correo debe contener la fecha de compra formateada")
	}

	// 5. Productos y valores
	if !strings.Contains(htmlContent, "Pomada Nishman Matte 01") {
		t.Errorf("El correo debe listar el producto")
	}
	if !strings.Contains(htmlContent, "70.000 COP") {
		t.Errorf("El correo debe mostrar el total formateado")
	}

	// 6. Envío 100% GRATIS $0 COP
	if !strings.Contains(htmlContent, "100% GRATIS a todo Colombia 🇨🇴") {
		t.Errorf("El correo debe destacar el envío 100%% GRATIS")
	}
	if !strings.Contains(htmlContent, "$0 COP") {
		t.Errorf("El envío debe marcar $0 COP")
	}

	// 7. Medio de pago
	if !strings.Contains(htmlContent, "Medio de pago: <strong style=\"color:#ffffff;\">Wompi</strong>") {
		t.Errorf("El correo debe indicar 'Medio de pago: Wompi'")
	}

	// 8. Datos de entrega
	if !strings.Contains(htmlContent, "Carrera 43A # 1-50 (Apto 302)") {
		t.Errorf("El correo debe contener la dirección completa con apartamento")
	}
	if !strings.Contains(htmlContent, "Medellín") {
		t.Errorf("El correo debe contener la ciudad")
	}
	if !strings.Contains(htmlContent, "3001234567") {
		t.Errorf("El correo debe contener el teléfono")
	}

	// 9. CTA WhatsApp
	if !strings.Contains(htmlContent, "Dar seguimiento por WhatsApp") {
		t.Errorf("El botón de WhatsApp debe tener el CTA 'Dar seguimiento por WhatsApp'")
	}

	// 10. Enlace de WhatsApp con mensaje precargado decodificable
	expectedPrefix := "https://wa.me/573337518070?text="
	if !strings.Contains(htmlContent, expectedPrefix) {
		t.Errorf("El correo debe enlazar directamente a https://wa.me/573337518070")
	}

	expectedMsg := "Hola, soy Carlos. Quiero hacer seguimiento a mi pedido #ORD-99881. ¿Me pueden ayudar?"
	encodedMsg := url.QueryEscape(expectedMsg)
	if !strings.Contains(htmlContent, encodedMsg) {
		t.Errorf("El mensaje de WhatsApp no coincide con el URL encoding esperado.\nEsperado: %s\nEn HTML: %s", encodedMsg, htmlContent)
	}

	// 11. INFORMACIÓN QUE NO DEBERÍA APARECER: Wompi UUID
	if strings.Contains(htmlContent, wompiUUID) {
		t.Errorf("Vulnerabilidad de fuga técnica: El UUID interno de Wompi (%s) NO debe aparecer en el correo del cliente", wompiUUID)
	}
}

func TestBuildCustomerOrderEmailHTML_XSSPrevention(t *testing.T) {
	maliciousOrder := StoredOrder{
		ID:     "ORD-XSS",
		Status: "APPROVED",
		Customer: OrderCustomer{
			FirstName: "<script>alert('xss-name')</script>",
			LastName:  "Hacker",
			Email:     "attacker@example.com",
			Phone:     "12345",
			City:      "<img src=x onerror=alert('xss-city')>",
			Address:   "<b onmouseover=alert('xss-addr')>Calle 1</b>",
		},
		Items: []OrderItem{
			{
				ID:       int64(1),
				Name:     "<h1>Malicious Product</h1>",
				Qty:      1,
				Price:    10000,
				Subtotal: 10000,
			},
		},
		Subtotal:       10000,
		SubtotalFormat: "10.000",
		ShippingCost:   0,
		ShippingFormat: "0",
		Total:          10000,
		TotalFormat:    "10.000",
		PaymentMethod:  "wompi",
	}

	tx := WompiTransaction{
		ID:     "tx-123",
		Status: "APPROVED",
	}

	htmlContent := buildCustomerOrderEmailHTML(maliciousOrder, tx)

	// Comprobar que no existan etiquetas peligrosas sin escapar
	unwantedTags := []string{
		"<script>",
		"</script>",
		"<img src=x onerror=",
		"<b onmouseover=",
		"<h1>Malicious Product</h1>",
	}

	for _, tag := range unwantedTags {
		if strings.Contains(htmlContent, tag) {
			t.Errorf("Fallo de seguridad: La etiqueta peligrosa %q no fue debidamente escapada en el correo", tag)
		}
	}
}
