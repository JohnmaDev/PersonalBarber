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

	"github.com/JohnmaDev/PersonalBarber/backend/pkg/auth"
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
	// 1. Conexión a DB
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: `{"error": "Missing URI"}`}, nil
	}
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
	}
	defer client.Disconnect(ctx)

	// 2. Verificación de Seguridad Anti-Fuerza Bruta
	ok, _ := auth.VerifyTokenWithRateLimit(ctx, request, client)
	if !ok {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusUnauthorized,
			Body:       `{"error": "Unauthorized or IP Blocked"}`,
		}, nil
	}

	collection := client.Database("personalbarber").Collection("categories")

	switch request.HTTPMethod {
	case "POST":
		var cat Category
		if err := json.Unmarshal([]byte(request.Body), &cat); err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 400, Body: `{"error": "Invalid body"}`}, nil
		}

		filter := bson.M{"id": cat.ID}
		update := bson.M{"$set": cat}
		opts := options.Update().SetUpsert(true)

		_, err := collection.UpdateOne(ctx, filter, update, opts)
		if err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
		}

		return events.APIGatewayProxyResponse{StatusCode: 200, Body: `{"ok": true, "message": "Category saved"}`}, nil

	case "DELETE":
		id := request.QueryStringParameters["id"]
		if id == "" {
			return events.APIGatewayProxyResponse{StatusCode: 400, Body: `{"error": "Missing id"}`}, nil
		}

		_, err := collection.DeleteOne(ctx, bson.M{"id": id})
		if err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
		}

		return events.APIGatewayProxyResponse{StatusCode: 200, Body: `{"ok": true, "message": "Category deleted"}`}, nil

	default:
		return events.APIGatewayProxyResponse{StatusCode: 405, Body: `{"error": "Method not allowed"}`}, nil
	}
}

func main() {
	lambda.Start(handler)
}
