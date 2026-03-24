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

type Cut struct {
	ID    int64  `json:"id" bson:"id"`
	Image string `json:"image" bson:"image"`
	Style string `json:"style" bson:"style"`
	Alt   string `json:"alt" bson:"alt"`
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

	collection := client.Database("personalbarber").Collection("cuts")
	
	// Limpiamos lo que haya para evitar duplicados en el seed inicial
	_, _ = collection.DeleteMany(ctx, bson.M{})

	initialCuts := []Cut{
		{ID: 1, Image: "/customers/BuzzCut_HighFade_Limpio_01.webp", Alt: "Buzz Cut High Fade limpio", Style: "Buzz Cut · High Fade"},
		{ID: 2, Image: "/customers/CropTop_MidFade_Lineas_01.webp", Alt: "Crop Top con Mid Fade y líneas", Style: "Crop Top · Mid Fade"},
		{ID: 3, Image: "/customers/SidePart_LowFade_Barba_Spa_01.webp", Alt: "Side Part Low Fade con barba", Style: "Side Part · Barba"},
		{ID: 4, Image: "/customers/SlickBack_TaperBajo_Brillo_01.webp", Alt: "Slick Back Taper bajo con brillo", Style: "Slick Back · Taper"},
	}

	for _, cut := range initialCuts {
		_, err := collection.InsertOne(ctx, cut)
		if err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "Insert failed: %v"}`, err)}, nil
		}
	}

	res, _ := json.Marshal(map[string]interface{}{"ok": true, "message": "Galería de cortes migrada correctamente", "count": len(initialCuts)})
	return events.APIGatewayProxyResponse{
		StatusCode: 200, 
		Headers: map[string]string{"Content-Type": "application/json"},
		Body: string(res),
	}, nil
}

func main() {
	lambda.Start(handler)
}
