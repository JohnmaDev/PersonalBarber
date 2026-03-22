package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Category struct {
	ID         string `bson:"id" json:"id"`
	Label      string `bson:"label" json:"label"`
	Subtitle   string `bson:"subtitle" json:"subtitle"`
	Cover      string `bson:"cover" json:"cover"`
	Accent     string `bson:"accent" json:"accent"`
	ComingSoon bool   `bson:"comingSoon" json:"comingSoon"`
	Icon       string `bson:"icon" json:"icon"`
	Style      string `bson:"style" json:"style"`
	Department string `bson:"department" json:"department"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	adminPin := os.Getenv("VUE_APP_ADMIN_PIN")
	providedPin := request.QueryStringParameters["token"]

	if adminPin == "" || providedPin != adminPin {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusUnauthorized, Body: `{"error": "Unauthorized"}`}, nil
	}

	uri := os.Getenv("MONGODB_URI")
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("categories")
	_, _ = collection.DeleteMany(ctx, bson.M{})

	initialCategories := []Category{
		// PARA ÉL (8)
		{ID: "ceras", Label: "Ceras & Pomadas", Cover: "/products/Reuzel_Blue_Strong_Hold_Water_Soluble_Azul.webp", Accent: "#39FF14", Style: "default", Department: "men"},
		{ID: "tratamientos", Label: "Tratamientos", Cover: "/products/Minoxidil_Kirkland_Remaster.webp", Accent: "#06B6D4", Style: "default", Department: "men"},
		{ID: "maquinas", Label: "Equipos & Tecnología", Cover: "/products/Rasuradora_Kemei.webp", Accent: "#8B5CF6", Icon: "fas fa-plug", Style: "default", Department: "men"},
		{ID: "cepillos", Label: "Cepillos & Peines", Subtitle: "Próximamente", Accent: "#FF4500", ComingSoon: true, Icon: "fas fa-brush", Style: "default", Department: "men"},
		{ID: "capas", Label: "Capas de Barbería", Subtitle: "Próximamente", Accent: "#71717A", ComingSoon: true, Icon: "fas fa-tshirt", Style: "default", Department: "men"},
		{ID: "atomizadores", Label: "Atomizadores", Subtitle: "Próximamente", Accent: "#39FFA4", ComingSoon: true, Icon: "fas fa-spray-can", Style: "default", Department: "men"},
		{ID: "navajas", Label: "Navajas & Tijeras", Subtitle: "Próximamente", Accent: "#E2E8F0", ComingSoon: true, Icon: "fas fa-scissors", Style: "default", Department: "men"},
		{ID: "barba", Label: "Cuidado de Barba", Subtitle: "Próximamente", Accent: "#F97316", ComingSoon: true, Icon: "fas fa-user", Style: "default", Department: "men"},

		// PARA ELLA (8)
		{ID: "skincare", Label: "Skincare", Subtitle: "Próximamente", Accent: "#EC4899", ComingSoon: true, Icon: "fas fa-spa", Style: "default", Department: "women"},
		{ID: "labios", Label: "Labios & Gloss", Subtitle: "Próximamente", Accent: "#FF1493", ComingSoon: true, Icon: "fas fa-kiss-wink-heart", Style: "default", Department: "women"},
		{ID: "cejas-pestanas", Label: "Cejas & Pestañas", Subtitle: "Próximamente", Accent: "#D946EF", ComingSoon: true, Icon: "fas fa-eye", Style: "default", Department: "women"},
		{ID: "sombras", Label: "Sombras & Paletas", Subtitle: "Próximamente", Accent: "#8B5CF6", ComingSoon: true, Icon: "fas fa-palette", Style: "default", Department: "women"},
		{ID: "maquillaje-facial", Label: "Maquillaje Facial", Subtitle: "Próximamente", Accent: "#F472B6", ComingSoon: true, Icon: "fas fa-magic", Style: "default", Department: "women"},
		{ID: "capilar-mujer", Label: "Cuidado Capilar", Subtitle: "Próximamente", Accent: "#FDA4AF", ComingSoon: true, Icon: "fas fa-pump-soap", Style: "default", Department: "women"},
		{ID: "brochas", Label: "Brochas & Accesorios", Subtitle: "Próximamente", Accent: "#E2E8F0", ComingSoon: true, Icon: "fas fa-paint-brush", Style: "default", Department: "women"},
		{ID: "delineadores", Label: "Delineadores", Subtitle: "Próximamente", Accent: "#000000", ComingSoon: true, Icon: "fas fa-pen-nib", Style: "default", Department: "women"},

		// UNISEX / PREMIUM
		{ID: "boutique", Label: "Boutique (Merch)", Subtitle: "Próximamente", Accent: "#EC4899", ComingSoon: true, Icon: "fas fa-tshirt", Style: "premium", Department: "unisex"},
	}

	for _, cat := range initialCategories {
		collection.InsertOne(ctx, cat)
	}

	res, _ := json.Marshal(map[string]interface{}{"ok": true, "message": "Categorías inicializadas correctamente"})
	return events.APIGatewayProxyResponse{StatusCode: 200, Body: string(res), Headers: map[string]string{"Content-Type": "application/json"}}, nil
}

func main() {
	lambda.Start(handler)
}
