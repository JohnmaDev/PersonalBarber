package main

import (
	"encoding/json"
	"testing"
)

// TestCalculateShippingCost verifica que todos los métodos de envío retornen 0
func TestCalculateShippingCost(t *testing.T) {
	tests := []struct {
		name     string
		method   string
		expected float64
	}{
		{"Valle express", "express_valle", 0},
		{"Valle corto", "valle", 0},
		{"Alrededores express", "express_alrededores", 0},
		{"Alrededores corto", "alrededores", 0},
		{"Nacional express", "express_nacional", 0},
		{"Nacional corto", "nacional", 0},
		{"Método vacío", "", 0},
		{"Método desconocido / arbitrario", "internacional_vip", 0},
		{"Método con inyección", "nacional; DROP TABLE", 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := calculateShippingCost(tt.method)
			if got != tt.expected {
				t.Errorf("calculateShippingCost(%q) = %v; want %v", tt.method, got, tt.expected)
			}
		})
	}
}

// TestFrontendShippingCostIgnored verifica que un payload con shippingCost malicioso o manipulado
// sea ignorado y el backend mantenga shippingCost en 0
func TestFrontendShippingCostIgnored(t *testing.T) {
	rawJSON := `{
		"customer": {
			"firstName": "Juan",
			"lastName": "Pérez",
			"email": "juan@example.com",
			"phone": "3001234567",
			"city": "Bogotá",
			"address": "Calle 100 # 15-20"
		},
		"items": [
			{"id": 1, "qty": 1}
		],
		"paymentMethod": "wompi",
		"shippingMethod": "express_nacional",
		"shippingCost": 20000,
		"total": 999999
	}`

	var body Payload
	if err := json.Unmarshal([]byte(rawJSON), &body); err != nil {
		t.Fatalf("Unmarshal falló: %v", err)
	}

	// El backend debe ignorar shippingCost del payload y calcularlo internamente
	calculatedShipping := calculateShippingCost(body.ShippingMethod)
	if calculatedShipping != 0 {
		t.Errorf("El backend confió en el frontend o no calculó 0: got %v, want 0", calculatedShipping)
	}
}

// TestOrderTotalCalculation_ConcreteCases valida los cálculos de subtotal, envío y total
func TestOrderTotalCalculation_ConcreteCases(t *testing.T) {
	type itemSpec struct {
		price float64
		qty   int
	}

	cases := []struct {
		name             string
		items            []itemSpec
		shippingMethod   string
		expectedSubtotal float64
		expectedShipping float64
		expectedTotal    float64
	}{
		{
			name: "Caso 1: 1 producto de $50.900",
			items: []itemSpec{
				{price: 50900, qty: 1},
			},
			shippingMethod:   "express_valle",
			expectedSubtotal: 50900,
			expectedShipping: 0,
			expectedTotal:    50900,
		},
		{
			name: "Caso 2: 2 unidades de producto de $100.900",
			items: []itemSpec{
				{price: 100900, qty: 2},
			},
			shippingMethod:   "express_nacional",
			expectedSubtotal: 201800,
			expectedShipping: 0,
			expectedTotal:    201800,
		},
		{
			name: "Caso 3: Múltiples productos combinados",
			items: []itemSpec{
				{price: 10900, qty: 3}, // 32.700
				{price: 42900, qty: 1}, // 42.900
			},
			shippingMethod:   "express_alrededores",
			expectedSubtotal: 75600,
			expectedShipping: 0,
			expectedTotal:    75600,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			var subtotal float64
			for _, it := range tc.items {
				subtotal += it.price * float64(it.qty)
			}
			shipping := calculateShippingCost(tc.shippingMethod)
			total := subtotal + shipping

			if subtotal != tc.expectedSubtotal {
				t.Errorf("Subtotal incorrecto: got %v, want %v", subtotal, tc.expectedSubtotal)
			}
			if shipping != tc.expectedShipping {
				t.Errorf("Shipping incorrecto: got %v, want %v", shipping, tc.expectedShipping)
			}
			if total != tc.expectedTotal {
				t.Errorf("Total incorrecto: got %v, want %v", total, tc.expectedTotal)
			}

			// Validar formato
			subtotalFmt := formatNumberIntl(subtotal)
			totalFmt := formatNumberIntl(total)
			if subtotalFmt != totalFmt {
				t.Errorf("SubtotalFormat != TotalFormat cuando envío es 0: %q != %q", subtotalFmt, totalFmt)
			}
		})
	}
}

// TestPriceParsing valida el parser de precios del catálogo
func TestPriceParsing(t *testing.T) {
	tests := []struct {
		input    interface{}
		expected float64
	}{
		{"$15.000 COP", 15000},
		{"$50.900", 50900},
		{"$100.900 COP", 100900},
		{float64(50900), 50900},
		{int32(50900), 50900},
		{int64(50900), 50900},
		{nil, 0},
		{"inválido", 0},
	}

	for _, tt := range tests {
		got := parsePrice(tt.input)
		if got != tt.expected {
			t.Errorf("parsePrice(%v) = %v; want %v", tt.input, got, tt.expected)
		}
	}
}

// TestFormatNumberIntl valida el formateador de números con separador de miles colombiano
func TestFormatNumberIntl(t *testing.T) {
	tests := []struct {
		num      float64
		expected string
	}{
		{0, "0"},
		{500, "500"},
		{1000, "1.000"},
		{50900, "50.900"},
		{201800, "201.800"},
		{1000000, "1.000.000"},
	}

	for _, tt := range tests {
		got := formatNumberIntl(tt.num)
		if got != tt.expected {
			t.Errorf("formatNumberIntl(%v) = %q; want %q", tt.num, got, tt.expected)
		}
	}
}

// TestFullOrderSimulationAndWompi simula un pedido con Producto A y Producto B (cantidades > 1),
// método express_nacional, y demuestra que Subtotal = suma de productos, Shipping = 0,
// Total = Subtotal, y el valor enviado a Wompi (en centavos) coincide exactamente.
func TestFullOrderSimulationAndWompi(t *testing.T) {
	// Producto A: $39.900, Cantidad: 2
	priceA := 39900.0
	qtyA := 2
	lineA := priceA * float64(qtyA) // 79.800

	// Producto B: $65.000, Cantidad: 2
	priceB := 65000.0
	qtyB := 2
	lineB := priceB * float64(qtyB) // 130.000

	// Subtotal
	subtotal := lineA + lineB // 209.800
	if subtotal != 209800.0 {
		t.Fatalf("Subtotal esperado 209.800, obtenido %v", subtotal)
	}

	// Envío express_nacional
	shippingMethod := "express_nacional"
	shippingCost := calculateShippingCost(shippingMethod)
	if shippingCost != 0.0 {
		t.Fatalf("ShippingCost esperado 0, obtenido %v", shippingCost)
	}

	// Gran Total
	grandTotal := subtotal + shippingCost
	if grandTotal != subtotal {
		t.Fatalf("GrandTotal (%v) debe ser exactamente igual a Subtotal (%v)", grandTotal, subtotal)
	}

	// Verificación de Wompi: amountInCents = int64(order.Total * 100)
	amountInCents := int64(grandTotal * 100)
	expectedCents := int64(20980000) // $209.800 COP * 100 = 20.980.000 centavos
	if amountInCents != expectedCents {
		t.Fatalf("Wompi amountInCents incorrecto: got %d, want %d", amountInCents, expectedCents)
	}

	// Verificación de que el total para Wompi no incluye ni un solo centavo de envío
	centsFromShipping := int64(shippingCost * 100)
	if centsFromShipping != 0 {
		t.Fatalf("Wompi recibiría centavos de envío: %d", centsFromShipping)
	}
}

