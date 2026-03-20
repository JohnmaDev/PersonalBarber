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
		{ID: "ceras", Label: "Ceras & Pomadas", Cover: "/products/Reuzel_Blue_Strong_Hold_Water_Soluble_Azul.webp", Accent: "#facc15", Style: "default"},
		{ID: "tratamientos", Label: "Tratamientos", Cover: "/products/Minoxidil_Kirkland_Remaster.webp", Accent: "#34d399", Style: "default"},
		{ID: "maquinas", Label: "Equipos & Tecnología", Cover: "/products/Rasuradora_Kemei.webp", Accent: "#a78bfa", Icon: "fas fa-plug", Style: "default"},
		{ID: "boutique", Label: "Boutique (Merch)", Subtitle: "Próximamente", Accent: "#ec4899", ComingSoon: true, Icon: "fas fa-tshirt", Style: "premium"},
		{ID: "cepillos", Label: "Cepillos & Peines", Subtitle: "Próximamente", Accent: "#fb923c", ComingSoon: true, Icon: "fas fa-brush", Style: "default"},
		{ID: "capas", Label: "Capas de Barbería", Subtitle: "Próximamente", Accent: "#f472b6", ComingSoon: true, Icon: "fas fa-tshirt", Style: "default"},
		{ID: "atomizadores", Label: "Atomizadores", Subtitle: "Próximamente", Accent: "#38bdf8", ComingSoon: true, Icon: "fas fa-spray-can", Style: "default"},
		{ID: "navajas", Label: "Navajas & Tijeras", Subtitle: "Próximamente", Accent: "#e2e8f0", ComingSoon: true, Icon: "fas fa-scissors", Style: "default"},
		{ID: "barba", Label: "Cuidado de Barba", Subtitle: "Próximamente", Accent: "#c084fc", ComingSoon: true, Icon: "fas fa-user", Style: "default"},
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
