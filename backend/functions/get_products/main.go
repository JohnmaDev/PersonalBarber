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

type Product struct {
	ID          int64    `json:"id" bson:"id"`
	Name        string   `json:"name" bson:"name"`
	Brand       string   `json:"brand" bson:"brand"`
	Category    string   `json:"category" bson:"category"`
	Description string   `json:"description" bson:"description"`
	Price       string   `json:"price" bson:"price"`
	Images      []string `json:"images" bson:"images"`
	Image       string   `json:"image,omitempty" bson:"image,omitempty"` // For backward compatibility
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "MONGODB_URI not configured in environment"}`,
		}, nil
	}

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Failed to connect: %v"}`, err),
		}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("products")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Query failed: %v"}`, err),
		}, nil
	}
	defer cursor.Close(ctx)

	var products []Product = []Product{} // Initialize as empty slice to avoid 'null' in JSON
	if err = cursor.All(ctx, &products); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Decode failed: %v"}`, err),
		}, nil
	}

	// Dynamic migration: if Images is empty but Image exists, populate Images
	for i := range products {
		if len(products[i].Images) == 0 && products[i].Image != "" {
			products[i].Images = []string{products[i].Image}
		}
		// Always ensure Images is at least an empty slice, never null
		if products[i].Images == nil {
			products[i].Images = []string{}
		}
	}

	body, _ := json.Marshal(map[string]interface{}{
		"ok":       true,
		"count":    len(products),
		"products": products,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(body),
	}, nil
}

func main() {
	lambda.Start(handler)
}
