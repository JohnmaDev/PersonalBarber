package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Product struct {
	ID          int    `json:"id" bson:"id"`
	Name        string `json:"name" bson:"name"`
	Brand       string `json:"brand" bson:"brand"`
	Category    string `json:"category" bson:"category"`
	Description string `json:"description" bson:"description"`
	Price       string `json:"price" bson:"price"`
	Image       string `json:"image" bson:"image"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Seguridad básica: solo permitir si se pasa un query param secreto o similar
	// Para este caso, lo haremos simple pero advertiremos al usuario de borrarlo luego.
	
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"error": "MONGODB_URI not set"}`,
		}, nil
	}

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "%v"}`, err),
		}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("products")

	// Datos a migrar
	products := []interface{}{
		Product{1, "Cera Naranja Nishman", "Nishman", "ceras", "Fijación fuerte con brillo medio, ideal para un look dinámico y fresco.", "$45.000 COP", "/products/cera_naranja_nishman.webp"},
		Product{2, "Cera Verde Nishman", "Nishman", "ceras", "A base de keratina, ofrece una fijación alta sin dejar residuos grasos.", "$45.000 COP", "/products/cera_verde_nishman.webp"},
		Product{3, "Cera Gold Nishman", "Nishman", "ceras", "Edición especial Gold One, brillo medio y formulación elaborada.", "$45.000 COP", "/products/cera_gold_nishman.webp"},
		Product{4, "Cera Verde y Morado Nishman", "Nishman", "ceras", "Acabado mate a brillante, fijación flexible y textura ligera.", "$45.000 COP", "/products/cera_verde_y_morado_nishman.webp"},
		Product{5, "Reuzel Blue – Strong Hold", "Reuzel", "ceras", "Pomada water-soluble de fijación fuerte con brillo alto. Fácil de lavar.", "$85.000 COP", "/products/Reuzel_Blue_Strong_Hold_Water_Soluble_Azul.webp"},
		Product{6, "Reuzel Clay Matte", "Reuzel", "ceras", "Pomada de arcilla con acabado mate y fijación media-alta. Textura ligera.", "$85.000 COP", "/products/Reuzel_Clay_Matte_Pomade_Blanca.webp"},
		Product{7, "Reuzel Concrete Hold Matte", "Reuzel", "ceras", "Fijación máxima con acabado mate. Estilos estructurados que duran todo el día.", "$85.000 COP", "/products/Reuzel_Concrete_Hold_Matte_Pomade_Plateada.webp"},
		Product{8, "Reuzel Extreme Hold Matte", "Reuzel", "ceras", "Control extremo sin brillo. Perfecta para cabello rebelde.", "$85.000 COP", "/products/Reuzel_Extreme_Hold_Matte_Pomade_Gris.webp"},
		Product{9, "Reuzel Pink – Heavy Hold", "Reuzel", "ceras", "Pomada grease de fijación fuerte con brillo alto. El clásico estilo vintage.", "$85.000 COP", "/products/Reuzel_Pink_Grease_Heavy_Hold_Rosa.webp"},
		Product{10, "Reuzel Red – High Sheen", "Reuzel", "ceras", "Brillo altísimo con fijación media-fuerte. Look lustroso y clásico.", "$85.000 COP", "/products/Reuzel_Red_High_Sheen_Pomade_Roja.webp"},
		Product{11, "Minoxidil Kirkland x1", "Kirkland", "tratamientos", "Minoxidil al 5%. Estimula el crecimiento del cabello y detiene la caída.", "$50.000 COP", "/products/Minoxidil_Kirkland_Remaster.webp"},
		Product{12, "Minoxidil Kirkland x3", "Kirkland", "tratamientos", "Pack triple al 5%. Mejor precio por unidad, tratamiento completo.", "$120.000 COP", "/products/Minoxidil_Kirkland_2_Remaster.webp"},
		Product{13, "Rasuradora Kemei", "Kemei", "maquinas", "Rasuradora profesional para hombres.", "$70.000 COP", "/products/Rasuradora_Kemei.webp"},
	}

	// Limpiar antes si se desea un fresh start
	collection.Drop(ctx)

	result, err := collection.InsertMany(ctx, products)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "InsertMany fail: %v"}`, err),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       fmt.Sprintf(`{"message": "¡Misión cumplida! Se migraron %v productos a MongoDB Atlas."}`, len(result.InsertedIDs)),
	}, nil
}

func main() {
	lambda.Start(handler)
}
