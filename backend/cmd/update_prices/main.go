package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"net/url"
	"os"
	"regexp"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type CatalogProduct struct {
	ID            int64
	Name          string
	ExpectedPrice int64
	NewPrice      int64
}

type ValidatedProduct struct {
	ObjectID     bson.ObjectID
	ID           int64
	Name         string
	CurrentPrice int64
	NewPrice     int64
	Difference   int64
	PctChange    float64
}

type RollbackProduct struct {
	ObjectID      bson.ObjectID
	ID            int64
	Name          string
	CurrentPrice  int64
	OriginalPrice int64
}

// 58 productos del catálogo comercial con sus precios actuales esperados y los nuevos precios aprobados (.900)
var approvedCatalog = []CatalogProduct{
	{ID: 19, Name: "Aceite para Máquina Wahl 30 ml", ExpectedPrice: 9900, NewPrice: 10900},
	{ID: 20, Name: "Aceite para Máquina Wahl 60 ml", ExpectedPrice: 12900, NewPrice: 13900},
	{ID: 18, Name: "Aceite para Máquina Wahl 118.3 ml", ExpectedPrice: 16900, NewPrice: 17900},
	{ID: 58, Name: "Tratamiento Capilar Minoxidil 5% Nishman con Aplicador", ExpectedPrice: 24900, NewPrice: 27900},
	{ID: 1, Name: "Cera Aqua Sport 02 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 3, Name: "Cera Aqua Gold One 07 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 4, Name: "NishMan Hair Styling Wax Keratin 05", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 15, Name: "Polvo Voluminizador Mattifying P1 Nishman 20 g", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 21, Name: "Cera Aqua Gum Gum 01 / 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 22, Name: "Cera Aqua Flaming 03 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 23, Name: "Cera Aqua Rugby 04 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 24, Name: "Cera Aqua Mystic 06 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 25, Name: "Cera Aqua Looking 08 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 26, Name: "Cera Aqua Cola 09 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 30, Name: "Gel en Crema Fijación Extra N.5 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 31, Name: "Gel en Crema Fijación Media N.6 Nishman 150 ml", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 40, Name: "Cera en Polvo X1 Extra Hold Nishman 20 g", ExpectedPrice: 39900, NewPrice: 42900},
	{ID: 2, Name: "Cera Matte Keratin M2 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 27, Name: "Cera Matte Styling M10 Nishman 150 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 28, Name: "Cera Aqua Spider Black Widow S1 Nishman 150 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 29, Name: "Cera Aqua Spider Tarantula S2 Nishman 150 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 32, Name: "Cera Matte Argan M1 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 33, Name: "Cera Matte Mess Up M3 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 34, Name: "Cera Matte Fibre Look M5 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 35, Name: "Cera Matte Inca Inchi M6 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 36, Name: "Cera Matte Fixing M7 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 37, Name: "Cera Matte Strong Fixing M9 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 38, Name: "Crema de Fibra Fiber Cream F1 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 39, Name: "Cera Pigmentada Dark Black C3 Nishman 100 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 44, Name: "Colonia After Shave Lemon N°4 Nishman 400 ml", ExpectedPrice: 42900, NewPrice: 45900},
	{ID: 14, Name: "Rolda Professional - Styling Powder (By Luigi D.)", ExpectedPrice: 48000, NewPrice: 51900},
	{ID: 42, Name: "Gel para Afeitar Shaving Gel N.2 Energizing Nishman 1500 ml (1.5 L)", ExpectedPrice: 49900, NewPrice: 53900},
	{ID: 43, Name: "Gel para Afeitar Shaving Gel N.6 Easy Shave Nishman 1500 ml (1.5 L)", ExpectedPrice: 49900, NewPrice: 53900},
	{ID: 11, Name: "Minoxidil Kirkland x1", ExpectedPrice: 50000, NewPrice: 54900},
	{ID: 16, Name: "Pistola de Masaje Muscular Pro - Edición Red Satin", ExpectedPrice: 65000, NewPrice: 69900},
	{ID: 57, Name: "Cera Capilar Newmen Gloss Acabado Brillante", ExpectedPrice: 65900, NewPrice: 70900},
	{ID: 13, Name: "Rasuradora Kemei", ExpectedPrice: 70000, NewPrice: 74900},
	{ID: 12, Name: "Minoxidil Kirkland x3", ExpectedPrice: 120000, NewPrice: 126900},
	{ID: 41, Name: "Cera en Polvo Mattifying P1 Nishman 160 g (Formato Barber XL)", ExpectedPrice: 129900, NewPrice: 136900},
	{ID: 53, Name: "Afeitadora Remington F1 Style Series (Láminas Flexibles)", ExpectedPrice: 154900, NewPrice: 161900},
	{ID: 17, Name: "Masajeador Ocular Inteligente RelaxVision con Calor y Compresión", ExpectedPrice: 160000, NewPrice: 166900},
	{ID: 54, Name: "Kit de Corte Todo en 1 Remington (Grooming Kit)", ExpectedPrice: 174900, NewPrice: 181900},
	{ID: 52, Name: "Afeitadora Rotativa Remington Recargable USB con Indicador LED", ExpectedPrice: 179900, NewPrice: 186900},
	{ID: 55, Name: "Cortadora Personal Indestructible Remington (Kit Patillera)", ExpectedPrice: 189900, NewPrice: 196900},
	{ID: 50, Name: "Plancha Alisadora Remington Shine Therapy (Aceite de Argán y Vitamina E)", ExpectedPrice: 199900, NewPrice: 206900},
	{ID: 45, Name: "Plancha Alisadora Remington Shine Therapy Aguacate & Macadamia", ExpectedPrice: 206900, NewPrice: 214900},
	{ID: 46, Name: "Plancha Alisadora Remington Keratin Therapy con Aceite de Argán", ExpectedPrice: 206900, NewPrice: 214900},
	{ID: 47, Name: "Plancha Alisadora Remington Triple Infusión", ExpectedPrice: 206900, NewPrice: 214900},
	{ID: 48, Name: "Plancha Alisadora Remington Frizz Control", ExpectedPrice: 206900, NewPrice: 214900},
	{ID: 49, Name: "Plancha Alisadora Remington Collagen & Biotin Therapy", ExpectedPrice: 206900, NewPrice: 214900},
	{ID: 61, Name: "Patillera Profesional WMark NG-8288 (Trimmer Outer Rotor)", ExpectedPrice: 219900, NewPrice: 226900},
	{ID: 56, Name: "Máquina Cortadora Indestructible Remington", ExpectedPrice: 234900, NewPrice: 241900},
	{ID: 62, Name: "Máquina de Corte Profesional WMark NG-8088 (Motor Outer Rotor)", ExpectedPrice: 259900, NewPrice: 266900},
	{ID: 51, Name: "Plancha Alisadora Remington Sapphire Luxe", ExpectedPrice: 269900, NewPrice: 276900},
	{ID: 63, Name: "Máquina de Corte Profesional WMark NG-V2 Infinity (Edición Negro)", ExpectedPrice: 339900, NewPrice: 346900},
	{ID: 64, Name: "Máquina de Corte Profesional WMark NG-V2 Infinity (Edición Morada)", ExpectedPrice: 339900, NewPrice: 346900},
	{ID: 59, Name: "Patillera Profesional WMark NG-XT1 (Motor Maglev 10.000 RPM)", ExpectedPrice: 349000, NewPrice: 355900},
	{ID: 60, Name: "Máquina de Corte Profesional WMark NG-X1 (Motor Maglev 10.000 RPM)", ExpectedPrice: 349000, NewPrice: 355900},
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSERS SEGUROS (Previenen panics por tipos inesperados o valores nulos)
// ─────────────────────────────────────────────────────────────────────────────

func parseRawObjectID(v interface{}) (bson.ObjectID, error) {
	if v == nil {
		return bson.NilObjectID, fmt.Errorf("el campo '_id' no existe o es nulo")
	}
	oid, ok := v.(bson.ObjectID)
	if !ok {
		return bson.NilObjectID, fmt.Errorf("el campo '_id' no es de tipo bson.ObjectID (%T: %v)", v, v)
	}
	return oid, nil
}

func parseRawID(v interface{}) (int64, error) {
	if v == nil {
		return 0, fmt.Errorf("el campo 'id' no existe o es nulo")
	}
	switch val := v.(type) {
	case int64:
		return val, nil
	case int32:
		return int64(val), nil
	case int:
		return int64(val), nil
	case float64:
		if val != float64(int64(val)) {
			return 0, fmt.Errorf("el campo 'id' contiene decimales: %v", val)
		}
		return int64(val), nil
	default:
		return 0, fmt.Errorf("tipo inesperado para 'id': %T (valor: %v)", v, v)
	}
}

func parseRawPrice(v interface{}) (int64, error) {
	if v == nil {
		return 0, fmt.Errorf("el campo 'price' no existe o es nulo")
	}
	switch val := v.(type) {
	case int64:
		return val, nil
	case int32:
		return int64(val), nil
	case int:
		return int64(val), nil
	case float64:
		if val != float64(int64(val)) {
			return 0, fmt.Errorf("el campo 'price' contiene decimales: %v", val)
		}
		return int64(val), nil
	default:
		return 0, fmt.Errorf("tipo inesperado para 'price': %T (valor: %v)", v, v)
	}
}

func parseRawString(v interface{}) (string, error) {
	if v == nil {
		return "", fmt.Errorf("el valor es nulo")
	}
	s, ok := v.(string)
	if !ok {
		return "", fmt.Errorf("tipo inesperado para campo de texto: %T (valor: %v)", v, v)
	}
	return s, nil
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDACIÓN ESTRICTA DEL CONJUNTO DE DOCUMENTOS DEL CATÁLOGO
// ─────────────────────────────────────────────────────────────────────────────

// validateCatalogDocuments ejecuta una comprobación bidireccional y exhaustiva:
// 1. Exactamente N documentos.
// 2. Extracción segura y preservación del _id (bson.ObjectID) primario.
// 3. Unicidad estricta de IDs comerciales.
// 4. Ausencia de IDs inesperados.
// 5. Coincidencia exacta de nombres carácter por carácter (sin TrimSpace).
// 6. Coincidencia exacta de precios actuales esperados.
// 7. Validación de is_active (no puede ser false).
// 8. Ausencia de IDs faltantes en el conjunto completo.
func validateCatalogDocuments(docs []bson.M, rules []CatalogProduct, ruleMap map[int64]CatalogProduct) ([]ValidatedProduct, error) {
	expectedCount := len(rules)
	if len(docs) != expectedCount {
		return nil, fmt.Errorf("conteo total de documentos no coincide: esperados %d, encontrados %d", expectedCount, len(docs))
	}

	seenIDs := make(map[int64]int, expectedCount)
	validated := make([]ValidatedProduct, 0, len(docs))

	for idx, doc := range docs {
		// 1. Parse seguro de _id primario
		objID, oErr := parseRawObjectID(doc["_id"])
		if oErr != nil {
			return nil, fmt.Errorf("documento en índice %d tiene _id inválido: %w", idx, oErr)
		}

		// 2. Parse seguro de ID comercial
		idVal, err := parseRawID(doc["id"])
		if err != nil {
			return nil, fmt.Errorf("documento en índice %d tiene ID inválido: %w", idx, err)
		}

		// 3. Unicidad de ID comercial: abortar de inmediato si hay duplicados
		seenIDs[idVal]++
		if seenIDs[idVal] > 1 {
			return nil, fmt.Errorf("ID duplicado detectado en base de datos: %d (conteo: %d)", idVal, seenIDs[idVal])
		}

		// 4. ID esperado
		rule, exists := ruleMap[idVal]
		if !exists {
			return nil, fmt.Errorf("ID inesperado en base de datos: %d (no pertenece al catálogo comercial aprobado)", idVal)
		}

		// 5. Parse seguro y validación exacta de nombre (carácter por carácter)
		nameVal, err := parseRawString(doc["name"])
		if err != nil {
			return nil, fmt.Errorf("producto ID %d tiene formato de nombre inválido: %w", idVal, err)
		}
		if nameVal != rule.Name {
			return nil, fmt.Errorf("discrepancia exacta de nombre en ID %d: en base de datos '%s' != esperado '%s'", idVal, nameVal, rule.Name)
		}

		// 6. Parse seguro y validación de precio actual
		curPrice, err := parseRawPrice(doc["price"])
		if err != nil {
			return nil, fmt.Errorf("producto ID %d tiene formato de precio inválido: %w", idVal, err)
		}
		if curPrice != rule.ExpectedPrice {
			return nil, fmt.Errorf("discrepancia de precio en ID %d (%s): actual $%d != esperado $%d", idVal, rule.Name, curPrice, rule.ExpectedPrice)
		}

		// 7. Validación estricta de estado activo (no puede ser booleano false)
		if activeVal, hasActive := doc["is_active"]; hasActive {
			boolVal, ok := activeVal.(bool)
			if !ok {
				return nil, fmt.Errorf("producto ID %d tiene campo 'is_active' no booleano (%T: %v)", idVal, activeVal, activeVal)
			}
			if !boolVal {
				return nil, fmt.Errorf("producto inactivo detectado dentro del catálogo activo: ID %d (is_active: false)", idVal)
			}
		}

		diff := rule.NewPrice - curPrice
		pct := (float64(diff) / float64(curPrice)) * 100.0

		validated = append(validated, ValidatedProduct{
			ObjectID:     objID,
			ID:           idVal,
			Name:         rule.Name,
			CurrentPrice: curPrice,
			NewPrice:     rule.NewPrice,
			Difference:   diff,
			PctChange:    pct,
		})
	}

	// 8. Validación de conjunto completo (garantiza que ningún ID del catálogo aprobado falte)
	var missingIDs []int64
	for _, rule := range rules {
		if seenIDs[rule.ID] == 0 {
			missingIDs = append(missingIDs, rule.ID)
		}
	}
	if len(missingIDs) > 0 {
		return nil, fmt.Errorf("los siguientes IDs aprobados faltan en la base de datos: %v", missingIDs)
	}

	// 9. Validación de cardinalidad estricta
	if len(seenIDs) != expectedCount {
		return nil, fmt.Errorf("cardinalidad de IDs única inconsistente: esperados %d, únicos en DB %d", expectedCount, len(seenIDs))
	}

	return validated, nil
}

// ─────────────────────────────────────────────────────────────────────────────
// SANITIZACIÓN Y VERIFICACIÓN SEGURA DE ENTORNO
// ─────────────────────────────────────────────────────────────────────────────

func sanitizeMongoURI(rawURI string) (string, string) {
	u, err := url.Parse(rawURI)
	if err != nil {
		re := regexp.MustCompile(`://([^:]+):([^@]+)@`)
		masked := re.ReplaceAllString(rawURI, "://$1:***@")
		return "desconocido", masked
	}
	host := u.Host
	if u.User != nil {
		username := u.User.Username()
		u.User = url.UserPassword(username, "***")
	}
	return host, u.Redacted()
}

func printEnvironmentBanner(rawURI string, dbName string, collName string, expectedCount int, mode string, isDryRun bool) {
	host, sanitizedURI := sanitizeMongoURI(rawURI)
	fmt.Println("================================================================================")
	fmt.Println("                      VERIFICACIÓN DE ENTORNO Y CONEXIÓN                        ")
	fmt.Println("================================================================================")
	fmt.Printf("• Base de datos:        %s\n", dbName)
	fmt.Printf("• Colección objetivo:   %s\n", collName)
	fmt.Printf("• Catálogo esperado:    %d productos comerciales activos\n", expectedCount)
	fmt.Printf("• Clúster / Servidor:   %s\n", host)
	fmt.Printf("• URI (sanitizado):     %s\n", sanitizedURI)

	modeDesc := "MIGRACIÓN DE PRECIOS"
	if mode == "rollback" {
		modeDesc = "RESTAURACIÓN (ROLLBACK)"
	}

	if isDryRun {
		fmt.Printf("• Modo de ejecución:    [%s - DRY-RUN (SIMULACIÓN)]\n", modeDesc)
		fmt.Println("• Nivel de seguridad:   SOLO LECTURA. Ninguna escritura ni respaldo será ejecutado.")
	} else {
		fmt.Printf("• Modo de ejecución:    [%s - REAL (ESCRITURA TRANSACCIONAL)]\n", modeDesc)
		fmt.Println("• Nivel de seguridad:   TRANSACCIÓN ACID MULTIDOCUMENTO. Requiere respaldo previo.")
	}
	fmt.Println("================================================================================")
	fmt.Println()
}

// ─────────────────────────────────────────────────────────────────────────────
// GUARDIÁN OBLIGATORIO DE CONFIRMACIÓN PARA ESCRITURA EN PRODUCCIÓN
// ─────────────────────────────────────────────────────────────────────────────

const requiredProductionConfirmation = "APLICAR_PRECIOS_PRODUCCION"

func assertProductionGuard(isDryRun bool, mode string) {
	if isDryRun {
		return
	}

	confirmVal := strings.TrimSpace(os.Getenv("CONFIRM_PRODUCTION"))
	if confirmVal != requiredProductionConfirmation {
		log.Fatalf("\n"+
			"================================================================================\n"+
			"ERROR DE SEGURIDAD CRÍTICO (ESCRITURA NO AUTORIZADA):\n"+
			"================================================================================\n"+
			"Se solicitó la ejecución en modo REAL (DRY_RUN=false) para [%s],\n"+
			"pero NO se proporcionó la variable de confirmación obligatoria.\n\n"+
			"Para autorizar modificaciones reales en la base de datos de producción,\n"+
			"debe configurar explícitamente la siguiente variable de entorno:\n\n"+
			"  CONFIRM_PRODUCTION=%s\n\n"+
			"OPERACIÓN CANCELADA INMEDIATAMENTE:\n"+
			"• No se creó ninguna colección de respaldo.\n"+
			"• No se inició ninguna transacción.\n"+
			"• Ningún dato fue modificado en MongoDB.\n"+
			"================================================================================\n",
			strings.ToUpper(mode), requiredProductionConfirmation)
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

func main() {
	ctx := context.Background()

	// 1. Leer Variables de Control con validación estricta
	mode := strings.ToLower(strings.TrimSpace(os.Getenv("MODE"))) // "migrate" o "rollback"
	if mode == "" {
		mode = "migrate"
	}
	if mode != "migrate" && mode != "rollback" {
		log.Fatalf("ERROR DE CONFIGURACIÓN: Modo desconocido '%s'. Modos permitidos: 'migrate' o 'rollback'.", mode)
	}

	dryRunEnv := strings.ToLower(strings.TrimSpace(os.Getenv("DRY_RUN")))
	var isDryRun bool
	switch dryRunEnv {
	case "", "true", "1", "yes":
		isDryRun = true
	case "false", "0", "no":
		isDryRun = false
	default:
		log.Fatalf("ERROR DE CONFIGURACIÓN: Valor inválido para variable DRY_RUN='%s'. Valores válidos: 'true' (o vacía) para simulación segura, 'false' para ejecución real.", dryRunEnv)
	}

	uri := strings.TrimSpace(os.Getenv("MONGODB_URI"))
	if uri == "" {
		log.Fatal("ERROR FATAL: Variable MONGODB_URI no configurada.")
	}

	// 2. Guardián de Confirmación de Producción
	assertProductionGuard(isDryRun, mode)

	const dbName = "personalbarber"
	const collName = "products"

	// 3. Banner de Verificación Segura del Entorno
	printEnvironmentBanner(uri, dbName, collName, len(approvedCatalog), mode, isDryRun)

	// 4. Conexión a MongoDB
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("ERROR FATAL conectando a MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database(dbName)
	productsColl := db.Collection(collName)

	// 5. Delegación de Modo
	if mode == "rollback" {
		executeRollback(ctx, client, db, productsColl, isDryRun)
		return
	}

	executeMigration(ctx, client, db, productsColl, isDryRun)
}

// ─────────────────────────────────────────────────────────────────────────────
// MIGRACIÓN (DRY-RUN o REAL)
// ─────────────────────────────────────────────────────────────────────────────

func executeMigration(ctx context.Context, client *mongo.Client, db *mongo.Database, productsColl *mongo.Collection, isDryRun bool) {
	// 1. Validar Conteo de Productos Activos del Catálogo (excluye archivados is_active: false)
	activeFilter := bson.M{"is_active": bson.M{"$ne": false}}
	count, err := productsColl.CountDocuments(ctx, activeFilter)
	if err != nil {
		log.Fatalf("ERROR consultando conteo de productos: %v", err)
	}

	expectedCount := int64(len(approvedCatalog))
	if count != expectedCount {
		log.Fatalf("ABORTANDO: Se esperaban exactamente %d productos activos en MongoDB, pero se encontraron %d.", expectedCount, count)
	}
	fmt.Printf("✓ Conteo de productos activos verificado: exactamente %d productos en catálogo.\n\n", count)

	// 2. Construir mapa de reglas por ID
	ruleMap := make(map[int64]CatalogProduct, len(approvedCatalog))
	for _, r := range approvedCatalog {
		ruleMap[r.ID] = r
	}

	// 3. Consultar los 58 productos activos actuales
	cursor, err := productsColl.Find(ctx, activeFilter)
	if err != nil {
		log.Fatalf("ERROR consultando productos: %v", err)
	}
	defer cursor.Close(ctx)

	var existingDocs []bson.M
	if err := cursor.All(ctx, &existingDocs); err != nil {
		log.Fatalf("ERROR leyendo productos: %v", err)
	}

	// 4. Validación Estricta de Conjunto, Unicidad, Nombres y Precios
	validatedList, valErr := validateCatalogDocuments(existingDocs, approvedCatalog, ruleMap)
	if valErr != nil {
		log.Fatalf("\nABORTANDO POR FALLO DE VALIDACIÓN:\n  %v\nNingún dato fue modificado.", valErr)
	}

	// 5. Mostrar Tabla Completa de Comparación
	fmt.Printf("%-4s | %-45s | %-13s | %-13s | %-12s | %-7s\n", "ID", "Producto", "Precio actual", "Precio nuevo", "Diferencia", "%")
	fmt.Println(strings.Repeat("-", 106))

	var totalDiff int64 = 0
	for _, vp := range validatedList {
		totalDiff += vp.Difference
		fmt.Printf("%-4d | %-45s | $%-12s | $%-12s | +$%-10s | +%4.1f%%\n",
			vp.ID, truncateString(vp.Name, 45), formatCOP(vp.CurrentPrice), formatCOP(vp.NewPrice), formatCOP(vp.Difference), vp.PctChange)
	}
	fmt.Println(strings.Repeat("-", 106))

	// Resumen Estadístico
	avgDiff := float64(totalDiff) / float64(len(validatedList))
	fmt.Println("\nRESUMEN DE VALIDACIÓN:")
	fmt.Printf("• Total productos analizados: %d\n", len(validatedList))
	fmt.Printf("• Total productos validados (IDs, Nombres, Precios): %d / %d (100%%)\n", len(validatedList), len(validatedList))
	fmt.Printf("• Unicidad y cardinalidad de IDs: Verificada (sin duplicados, sin faltantes, sin inesperados)\n")
	fmt.Printf("• Ajuste total acumulado del catálogo: +$%s COP\n", formatCOP(totalDiff))
	fmt.Printf("• Ajuste promedio por producto: +$%s COP\n", formatCOP(int64(avgDiff)))

	// 6. Rama de DRY-RUN: Salida limpia sin escribir
	if isDryRun {
		fmt.Println("\n================================================================================")
		fmt.Println("DRY-RUN: no se realizaron modificaciones.")
		fmt.Println("• No se creó ninguna colección de respaldo.")
		fmt.Println("• No se ejecutó ningún UpdateOne ni operación de escritura en la base de datos.")
		fmt.Println("• Para ejecutar la migración REAL y aplicar los cambios:")
		fmt.Printf("  DRY_RUN=false CONFIRM_PRODUCTION=%s go run backend/cmd/update_prices/main.go\n", requiredProductionConfirmation)
		fmt.Println("================================================================================")
		return
	}

	// 7. MIGRACIÓN REAL: Crear Colección de Respaldo Histórica (Snapshot con Sufijo de Alta Precisión)
	nonceBytes := make([]byte, 2)
	rand.Read(nonceBytes)
	backupCollName := fmt.Sprintf("products_backup_%s_%s", time.Now().Format("20060102_150405"), hex.EncodeToString(nonceBytes))

	// Validar que la colección no exista previamente
	existingCols, cErr := db.ListCollectionNames(ctx, bson.M{"name": backupCollName})
	if cErr != nil || len(existingCols) > 0 {
		log.Fatalf("ABORTANDO: La colección de respaldo '%s' ya existe o no pudo validarse.", backupCollName)
	}

	backupColl := db.Collection(backupCollName)

	var backupDocs []interface{}
	for _, d := range existingDocs {
		backupDocs = append(backupDocs, d)
	}

	insertRes, err := backupColl.InsertMany(ctx, backupDocs)
	if err != nil || len(insertRes.InsertedIDs) != len(approvedCatalog) {
		log.Fatalf("ERROR FATAL creando colección de respaldo en %s: %v. Abortando sin modificar productos.", backupCollName, err)
	}
	fmt.Printf("\n✓ COLECCIÓN DE RESPALDO (SNAPSHOT) CREADA: '%s' (%d documentos respaldados).\n", backupCollName, len(insertRes.InsertedIDs))

	// 8. MIGRACIÓN REAL: Transacción ACID Multidocumento en MongoDB Atlas
	// Inicia una sesión lógica mediante client.StartSession().
	// session.WithTransaction() ejecuta la función con garantías ACID completas:
	// todas las operaciones se confirman conjuntamente o se descartan si ocurre un error,
	// gestionando reintentos transitorios (TransientTransactionError / UnknownTransactionCommitResult).
	fmt.Println("\nIniciando Transacción ACID en MongoDB Atlas...")
	session, err := client.StartSession()
	if err != nil {
		log.Fatalf("ERROR iniciando sesión para transacción: %v", err)
	}
	defer session.EndSession(ctx)

	txnOpts := options.Transaction()

	_, err = session.WithTransaction(ctx, func(sessCtx context.Context) (interface{}, error) {
		// Re-validación estricta dentro del contexto transaccional antes de cualquier escritura
		fmt.Println("  [Tx] Re-validando estado, unicidad y _id de los 58 productos dentro de la sesión transaccional...")
		innerCursor, fErr := productsColl.Find(sessCtx, activeFilter)
		if fErr != nil {
			return nil, fmt.Errorf("error leyendo productos dentro de la transacción: %w", fErr)
		}
		defer innerCursor.Close(sessCtx)

		var innerDocs []bson.M
		if aErr := innerCursor.All(sessCtx, &innerDocs); aErr != nil {
			return nil, fmt.Errorf("error decodificando productos en la transacción: %w", aErr)
		}

		// Reutiliza la misma función de validación estricta (retiene los _id validados)
		innerValidatedList, vErr := validateCatalogDocuments(innerDocs, approvedCatalog, ruleMap)
		if vErr != nil {
			return nil, fmt.Errorf("fallo de validación concurrente dentro de la transacción: %w", vErr)
		}

		// Ejecución de las 58 actualizaciones atómicas usando _id primario verificado
		fmt.Println("  [Tx] Aplicando 58 actualizaciones atómicas indexadas por _id...")
		for _, vp := range innerValidatedList {
			// Filtro exacto por _id primario + id comercial + estado activo
			filter := bson.M{
				"_id":       vp.ObjectID,
				"id":        vp.ID,
				"is_active": bson.M{"$ne": false},
			}
			update := bson.M{"$set": bson.M{"price": vp.NewPrice}}

			res, uErr := productsColl.UpdateOne(sessCtx, filter, update)
			if uErr != nil {
				return nil, fmt.Errorf("fallo al actualizar producto ID %d (_id %s): %w", vp.ID, vp.ObjectID.Hex(), uErr)
			}
			if res.MatchedCount != 1 {
				return nil, fmt.Errorf("producto ID %d (_id %s) no coincidió (MatchedCount != 1)", vp.ID, vp.ObjectID.Hex())
			}
			if res.ModifiedCount != 1 {
				return nil, fmt.Errorf("producto ID %d (_id %s) no fue modificado (ModifiedCount != 1)", vp.ID, vp.ObjectID.Hex())
			}
		}

		fmt.Println("  [Tx] Las 58 actualizaciones por _id fueron verificadas. Confirmando transacción (Commit)...")
		return nil, nil
	}, txnOpts)

	if err != nil {
		log.Fatalf("FALLO EN TRANSACCIÓN: %v.\n"+
			"NOTA: Si el fallo ocurrió durante la ejecución de updates, MongoDB realizó rollback automático.\n"+
			"Si el fallo fue por UnknownTransactionCommitResult (desconexión de red durante commit), verifique el estado en MongoDB antes de reintentar.", err)
	}
	fmt.Println("✓ Transacción confirmada exitosamente (CommitTransaction completado).")

	// 9. Verificación Post-Ejecución (Lectura directa de confirmación en base de datos)
	fmt.Println("\nRealizando verificación post-migración en base de datos...")
	verifyCursor, err := productsColl.Find(ctx, activeFilter)
	if err != nil {
		log.Fatalf("ERROR leyendo productos para verificación post: %v", err)
	}
	defer verifyCursor.Close(ctx)

	var verifiedDocs []bson.M
	if err := verifyCursor.All(ctx, &verifiedDocs); err != nil {
		log.Fatalf("ERROR decodificando productos en verificación post: %v", err)
	}

	postDiscrepancies := 0
	for _, doc := range verifiedDocs {
		idVal, idErr := parseRawID(doc["id"])
		if idErr != nil {
			log.Printf("ERROR CRÍTICO: Documento post-migración con ID inválido: %v", idErr)
			postDiscrepancies++
			continue
		}
		rule := ruleMap[idVal]
		price, pErr := parseRawPrice(doc["price"])
		if pErr != nil {
			log.Printf("ERROR CRÍTICO: ID %d tiene precio inválido post-migración: %v", idVal, pErr)
			postDiscrepancies++
			continue
		}
		if price != rule.NewPrice {
			log.Printf("ERROR CRÍTICO: ID %d tiene precio $%d y debía ser $%d", idVal, price, rule.NewPrice)
			postDiscrepancies++
		}
	}

	if postDiscrepancies > 0 {
		log.Fatalf("ALERTA: Se detectaron %d discrepancias en la verificación post-migración.", postDiscrepancies)
	}

	fmt.Println("================================================================================")
	fmt.Println("✓ MIGRACIÓN 100% EXITOSA Y VERIFICADA.")
	fmt.Printf("✓ Los 58 productos ahora tienen sus precios nuevos terminados en .900.\n")
	fmt.Printf("✓ Colección de respaldo para recuperación histórica: '%s'\n", backupCollName)
	fmt.Println("================================================================================")
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDACIÓN Y EJECUCIÓN DE ROLLBACK
// ─────────────────────────────────────────────────────────────────────────────

func validateRollbackDocuments(backupDocs []bson.M, currentDocs []bson.M, rules []CatalogProduct, ruleMap map[int64]CatalogProduct) ([]RollbackProduct, map[int64]int64, error) {
	expectedCount := len(rules)
	if len(backupDocs) != expectedCount {
		return nil, nil, fmt.Errorf("la colección de respaldo tiene %d documentos (se esperaban %d)", len(backupDocs), expectedCount)
	}
	if len(currentDocs) != expectedCount {
		return nil, nil, fmt.Errorf("la colección actual 'products' tiene %d documentos activos (se esperaban %d)", len(currentDocs), expectedCount)
	}

	// 1. Validar documentos de respaldo
	seenBackupIDs := make(map[int64]int, expectedCount)
	backupPrices := make(map[int64]int64, expectedCount)

	for idx, bDoc := range backupDocs {
		bID, err := parseRawID(bDoc["id"])
		if err != nil {
			return nil, nil, fmt.Errorf("documento en respaldo (índice %d) con ID inválido: %w", idx, err)
		}
		seenBackupIDs[bID]++
		if seenBackupIDs[bID] > 1 {
			return nil, nil, fmt.Errorf("ID duplicado detectado en colección de respaldo: %d", bID)
		}
		rule, exists := ruleMap[bID]
		if !exists {
			return nil, nil, fmt.Errorf("ID inesperado en colección de respaldo: %d", bID)
		}
		bName, nErr := parseRawString(bDoc["name"])
		if nErr != nil {
			return nil, nil, fmt.Errorf("nombre inválido en respaldo para ID %d: %w", bID, nErr)
		}
		if bName != rule.Name {
			return nil, nil, fmt.Errorf("discrepancia exacta de nombre en respaldo para ID %d: '%s' != esperado '%s'", bID, bName, rule.Name)
		}

		bPrice, err := parseRawPrice(bDoc["price"])
		if err != nil {
			return nil, nil, fmt.Errorf("precio inválido en respaldo para ID %d: %w", bID, err)
		}

		// Comprobar que el backup NO contenga ya los precios nuevos (.900)
		if bPrice == rule.NewPrice {
			return nil, nil, fmt.Errorf("INCONSISTENCIA: El backup para ID %d ya tiene el precio nuevo ($%d). Este snapshot parece ser posterior a la migración", bID, bPrice)
		}
		// Comprobar que el precio a restaurar coincida con el precio original esperado
		if bPrice != rule.ExpectedPrice {
			return nil, nil, fmt.Errorf("INCONSISTENCIA: El backup para ID %d tiene precio $%d pero se esperaba $%d", bID, bPrice, rule.ExpectedPrice)
		}

		backupPrices[bID] = bPrice
	}

	// Comprobar que no falte ningún ID en el respaldo
	for _, r := range rules {
		if seenBackupIDs[r.ID] == 0 {
			return nil, nil, fmt.Errorf("ID faltante en la colección de respaldo: %d (%s)", r.ID, r.Name)
		}
	}

	// 2. Validar documentos actuales de 'products'
	seenCurrentIDs := make(map[int64]int, expectedCount)
	currentProducts := make(map[int64]RollbackProduct, expectedCount)

	for idx, cDoc := range currentDocs {
		objID, oErr := parseRawObjectID(cDoc["_id"])
		if oErr != nil {
			return nil, nil, fmt.Errorf("documento actual (índice %d) con _id inválido: %w", idx, oErr)
		}
		cID, err := parseRawID(cDoc["id"])
		if err != nil {
			return nil, nil, fmt.Errorf("documento actual (índice %d) con ID inválido: %w", idx, err)
		}
		seenCurrentIDs[cID]++
		if seenCurrentIDs[cID] > 1 {
			return nil, nil, fmt.Errorf("ID duplicado detectado en colección actual: %d", cID)
		}
		rule, exists := ruleMap[cID]
		if !exists {
			return nil, nil, fmt.Errorf("ID inesperado en colección actual: %d", cID)
		}
		cPrice, err := parseRawPrice(cDoc["price"])
		if err != nil {
			return nil, nil, fmt.Errorf("precio inválido en colección actual para ID %d: %w", cID, err)
		}
		cName, err := parseRawString(cDoc["name"])
		if err != nil {
			return nil, nil, fmt.Errorf("nombre inválido en colección actual para ID %d: %w", cID, err)
		}
		if cName != rule.Name {
			return nil, nil, fmt.Errorf("discrepancia de nombre en colección actual ID %d: '%s' != '%s'", cID, cName, rule.Name)
		}

		currentProducts[cID] = RollbackProduct{
			ObjectID:      objID,
			ID:            cID,
			Name:          cName,
			CurrentPrice:  cPrice,
			OriginalPrice: backupPrices[cID],
		}
	}

	// Comprobar que no falte ningún ID en la colección actual
	for _, r := range rules {
		if seenCurrentIDs[r.ID] == 0 {
			return nil, nil, fmt.Errorf("ID faltante en colección actual: %d (%s)", r.ID, r.Name)
		}
	}

	// 3. Construir lista ordenada de restauración verificada
	pairs := make([]RollbackProduct, 0, expectedCount)
	for _, r := range rules {
		pairs = append(pairs, currentProducts[r.ID])
	}

	return pairs, backupPrices, nil
}

func executeRollback(ctx context.Context, client *mongo.Client, db *mongo.Database, productsColl *mongo.Collection, isDryRun bool) {
	backupName := strings.TrimSpace(os.Getenv("BACKUP_COLL"))
	fmt.Println("================================================================================")
	if isDryRun {
		fmt.Println("MODO: [ROLLBACK DRY-RUN] SIMULACIÓN DE RESTAURACIÓN DE PRECIOS")
	} else {
		fmt.Println("MODO: [ROLLBACK REAL] RESTAURACIÓN TRANSACCIONAL DE PRECIOS HISTÓRICOS")
	}
	fmt.Printf("COLECCIÓN DE RESPALDO ORIGEN: '%s'\n", backupName)
	fmt.Println("================================================================================")

	if backupName == "" {
		log.Fatal("ERROR FATAL: Debe indicar la variable BACKUP_COLL (ejemplo: BACKUP_COLL=products_backup_20260906_224500_abcd).")
	}
	if !strings.HasPrefix(backupName, "products_backup_") {
		log.Fatalf("ERROR DE SEGURIDAD: La colección de respaldo debe comenzar con 'products_backup_'. Se recibió: '%s'", backupName)
	}
	if backupName == "products" {
		log.Fatal("ERROR DE SEGURIDAD: No puede especificar la colección activa 'products' como respaldo.")
	}

	backupColl := db.Collection(backupName)

	// 1. Leer documentos de respaldo
	bCursor, err := backupColl.Find(ctx, bson.M{})
	if err != nil {
		log.Fatalf("ERROR consultando colección de respaldo '%s': %v", backupName, err)
	}
	defer bCursor.Close(ctx)

	var bDocs []bson.M
	if err := bCursor.All(ctx, &bDocs); err != nil {
		log.Fatalf("ERROR leyendo documentos de respaldo: %v", err)
	}

	// 2. Leer documentos actuales de products
	activeFilter := bson.M{"is_active": bson.M{"$ne": false}}
	cCursor, err := productsColl.Find(ctx, activeFilter)
	if err != nil {
		log.Fatalf("ERROR leyendo productos actuales: %v", err)
	}
	defer cCursor.Close(ctx)

	var cDocs []bson.M
	if err := cCursor.All(ctx, &cDocs); err != nil {
		log.Fatalf("ERROR decodificando productos actuales: %v", err)
	}

	ruleMap := make(map[int64]CatalogProduct, len(approvedCatalog))
	for _, r := range approvedCatalog {
		ruleMap[r.ID] = r
	}

	// 3. Validación Estricta Bidireccional de Rollback (retiene _id de cada documento)
	pairs, backupPrices, valErr := validateRollbackDocuments(bDocs, cDocs, approvedCatalog, ruleMap)
	if valErr != nil {
		log.Fatalf("\nABORTANDO ROLLBACK POR ERROR DE VALIDACIÓN:\n  %v\nNingún dato fue modificado.", valErr)
	}

	// 4. Mostrar Tabla de Restauración
	fmt.Printf("%-4s | %-42s | %-14s | %-14s | %s\n", "ID", "Producto", "Precio actual", "Restaurar a", "Acción")
	fmt.Println(strings.Repeat("-", 100))
	for _, p := range pairs {
		fmt.Printf("%-4d | %-42s | $%-13s | $%-13s | Solo campo 'price'\n",
			p.ID, truncateString(p.Name, 42), formatCOP(p.CurrentPrice), formatCOP(p.OriginalPrice))
	}
	fmt.Println(strings.Repeat("-", 100))

	if isDryRun {
		fmt.Println("\n================================================================================")
		fmt.Println("DRY-RUN: no se realizaron modificaciones.")
		fmt.Println("• Simulación de rollback completada al 100%.")
		fmt.Println("• Todos los 58 IDs y precios de la colección de respaldo fueron validados.")
		fmt.Println("• No se modificó ningún dato en MongoDB.")
		fmt.Println("• Para ejecutar el ROLLBACK REAL:")
		fmt.Printf("  MODE=rollback BACKUP_COLL=%s DRY_RUN=false CONFIRM_PRODUCTION=%s go run backend/cmd/update_prices/main.go\n",
			backupName, requiredProductionConfirmation)
		fmt.Println("================================================================================")
		return
	}

	// 5. Ejecutar Rollback Transaccional actualizando ÚNICAMENTE el campo 'price' usando _id
	fmt.Println("\nIniciando Transacción ACID para Rollback en MongoDB Atlas...")
	session, err := client.StartSession()
	if err != nil {
		log.Fatalf("ERROR iniciando sesión para rollback: %v", err)
	}
	defer session.EndSession(ctx)

	txnOpts := options.Transaction()

	_, err = session.WithTransaction(ctx, func(sessCtx context.Context) (interface{}, error) {
		// Re-validación dentro de la sesión transaccional
		innerCursor, fErr := productsColl.Find(sessCtx, activeFilter)
		if fErr != nil {
			return nil, fmt.Errorf("error leyendo productos en rollback: %w", fErr)
		}
		defer innerCursor.Close(sessCtx)

		var innerCDocs []bson.M
		if aErr := innerCursor.All(sessCtx, &innerCDocs); aErr != nil {
			return nil, fmt.Errorf("error decodificando productos en transacción de rollback: %w", aErr)
		}

		innerPairs, _, vErr := validateRollbackDocuments(bDocs, innerCDocs, approvedCatalog, ruleMap)
		if vErr != nil {
			return nil, fmt.Errorf("fallo de validación concurrente en rollback: %w", vErr)
		}

		fmt.Println("  [Tx-Rollback] Aplicando 58 restauraciones quirúrgicas indexadas por _id...")
		for _, pair := range innerPairs {
			// Filtro exacto por _id primario + id comercial
			filter := bson.M{
				"_id":       pair.ObjectID,
				"id":        pair.ID,
				"is_active": bson.M{"$ne": false},
			}
			// Modifica ÚNICAMENTE el campo price
			update := bson.M{"$set": bson.M{"price": pair.OriginalPrice}}

			res, uErr := productsColl.UpdateOne(sessCtx, filter, update)
			if uErr != nil {
				return nil, fmt.Errorf("fallo al restaurar ID %d (_id %s): %w", pair.ID, pair.ObjectID.Hex(), uErr)
			}
			if res.MatchedCount != 1 {
				return nil, fmt.Errorf("producto ID %d no encontrado para restaurar", pair.ID)
			}
		}

		fmt.Println("  [Tx-Rollback] Todas las operaciones por _id verificadas. Confirmando transacción...")
		return nil, nil
	}, txnOpts)

	if err != nil {
		log.Fatalf("FALLO EN TRANSACCIÓN DE ROLLBACK: %v.\n"+
			"NOTA: Si el fallo ocurrió durante la ejecución de updates, MongoDB realizó rollback automático.\n"+
			"Si el fallo fue por UnknownTransactionCommitResult (desconexión de red durante commit), verifique el estado en MongoDB antes de reintentar.", err)
	}
	fmt.Println("✓ Transacción de rollback confirmada exitosamente.")

	// 6. Verificación Post-Rollback en Base de Datos (confirmación exhaustiva)
	fmt.Println("\nRealizando verificación post-rollback en MongoDB Atlas...")
	verifyCursor, err := productsColl.Find(ctx, activeFilter)
	if err != nil {
		log.Fatalf("ERROR leyendo productos para verificación post-rollback: %v", err)
	}
	defer verifyCursor.Close(ctx)

	var verifiedDocs []bson.M
	if err := verifyCursor.All(ctx, &verifiedDocs); err != nil {
		log.Fatalf("ERROR decodificando productos en verificación post-rollback: %v", err)
	}

	if len(verifiedDocs) != len(approvedCatalog) {
		log.Fatalf("ALERTA CRÍTICA: Conteo inconsistente post-rollback: esperados %d, encontrados %d", len(approvedCatalog), len(verifiedDocs))
	}

	postDiscrepancies := 0
	for _, doc := range verifiedDocs {
		idVal, err := parseRawID(doc["id"])
		if err != nil {
			log.Printf("ERROR CRÍTICO post-rollback: ID inválido: %v", err)
			postDiscrepancies++
			continue
		}
		expectedOrigPrice, exists := backupPrices[idVal]
		if !exists {
			log.Printf("ERROR CRÍTICO post-rollback: ID %d no existía en el backup", idVal)
			postDiscrepancies++
			continue
		}
		curPrice, err := parseRawPrice(doc["price"])
		if err != nil {
			log.Printf("ERROR CRÍTICO post-rollback: precio inválido en ID %d: %v", idVal, err)
			postDiscrepancies++
			continue
		}
		if curPrice != expectedOrigPrice {
			log.Printf("ERROR CRÍTICO post-rollback: ID %d tiene precio $%d y debía ser restaurado a $%d", idVal, curPrice, expectedOrigPrice)
			postDiscrepancies++
		}
	}

	if postDiscrepancies > 0 {
		log.Fatalf("ALERTA MÁXIMA: Se detectaron %d discrepancias en la verificación final post-rollback.", postDiscrepancies)
	}

	fmt.Println("================================================================================")
	fmt.Println("✓ ROLLBACK TRANSACCIONAL COMPLETADO Y VERIFICADO AL 100%.")
	fmt.Println("✓ Se restauró ÚNICAMENTE el campo 'price' de los 58 productos a sus valores originales.")
	fmt.Println("✓ Ningún otro campo (nombre, stock, imágenes, descripción) fue tocado.")
	fmt.Println("================================================================================")
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES DE FORMATO Y CADENAS (100% Seguras para UTF-8 Multibyte)
// ─────────────────────────────────────────────────────────────────────────────

func truncateString(s string, max int) string {
	runes := []rune(s)
	if len(runes) <= max {
		return s
	}
	if max <= 3 {
		return string(runes[:max])
	}
	return string(runes[:max-3]) + "..."
}

func formatCOP(num int64) string {
	if num == 0 {
		return "0"
	}
	isNegative := num < 0
	if isNegative {
		num = -num
	}
	s := fmt.Sprintf("%d", num)
	n := len(s)
	if n <= 3 {
		if isNegative {
			return "-" + s
		}
		return s
	}
	var res []string
	for i := n; i > 0; i -= 3 {
		if i-3 >= 0 {
			res = append([]string{s[i-3 : i]}, res...)
		} else {
			res = append([]string{s[0:i]}, res...)
		}
	}
	formatted := strings.Join(res, ".")
	if isNegative {
		return "-" + formatted
	}
	return formatted
}
