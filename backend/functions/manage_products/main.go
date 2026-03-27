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

type Product struct {
	ID          int64    `json:"id" bson:"id"`
	Name        string   `json:"name" bson:"name"`
	Brand       string   `json:"brand" bson:"brand"`
	Category    string   `json:"category" bson:"category"`
	Description string   `json:"description" bson:"description"`
	Price       int64    `json:"price" bson:"price"`
	Images      []string `json:"images" bson:"images"`
	Stock       int      `json:"stock" bson:"stock"`
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

	collection := client.Database("personalbarber").Collection("products")

	switch request.HTTPMethod {
	case "POST": // Create or Update
		var p Product
		if err := json.Unmarshal([]byte(request.Body), &p); err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 400, Body: `{"error": "Invalid body"}`}, nil
		}

		// Si es nuevo (ID auto-increment o similar, por ahora usamos el ID enviado)
		opts := options.Update().SetUpsert(true)
		filter := bson.M{"id": p.ID}
		update := bson.M{"$set": p}

		_, err := collection.UpdateOne(ctx, filter, update, opts)
		if err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "Update failed: %v"}`, err)}, nil
		}
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Body:       `{"ok": true, "message": "Product saved successfully"}`,
		}, nil

	case "DELETE": // Delete
		idStr := request.QueryStringParameters["id"]
		var id int64
		fmt.Sscanf(idStr, "%d", &id)

		_, err := collection.DeleteOne(ctx, bson.M{"id": id})
		if err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "Delete failed: %v"}`, err)}, nil
		}
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Body:       `{"ok": true, "message": "Product deleted"}`,
		}, nil

	default:
		return events.APIGatewayProxyResponse{StatusCode: 405, Body: `{"error": "Method not allowed"}`}, nil
	}
}

func main() {
	lambda.Start(handler)
}
