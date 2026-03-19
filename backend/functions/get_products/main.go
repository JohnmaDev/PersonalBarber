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
	"regexp"
	"strconv"
	"strings"
)

type Product struct {
	ID          int64    `json:"id" bson:"id"`
	Name        string   `json:"name" bson:"name"`
	Brand       string   `json:"brand" bson:"brand"`
	Category    string   `json:"category" bson:"category"`
	Description string   `json:"description" bson:"description"`
	Price       int64    `json:"price" bson:"price"`
	Images      []string `json:"images" bson:"images"`
	Image       string   `json:"image,omitempty" bson:"image,omitempty"` // For backward compatibility
}

// Para manejar la migración de datos viejos (strings) a nuevos (ints)
type flexibleProduct struct {
	ID          int64       `bson:"id"`
	Name        string      `bson:"name"`
	Brand       string      `bson:"brand"`
	Category    string      `bson:"category"`
	Description string      `bson:"description"`
	Price       interface{} `bson:"price"`
	Images      []string    `bson:"images"`
	Image       string      `bson:"image,omitempty"`
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

	var rawProducts []flexibleProduct
	if err = cursor.All(ctx, &rawProducts); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Decode failed: %v"}`, err),
		}, nil
	}

	re := regexp.MustCompile(`[0-9]+`)
	products := make([]Product, 0, len(rawProducts))

	for _, rp := range rawProducts {
		p := Product{
			ID:          rp.ID,
			Name:        rp.Name,
			Brand:       rp.Brand,
			Category:    rp.Category,
			Description: rp.Description,
			Images:      rp.Images,
			Image:       rp.Image,
		}

		// Parse de precio flexible
		switch v := rp.Price.(type) {
		case string:
			digits := re.FindAllString(v, -1)
			allDigits := strings.Join(digits, "")
			p.Price, _ = strconv.ParseInt(allDigits, 10, 64)
		case int32:
			p.Price = int64(v)
		case int64:
			p.Price = v
		case float64:
			p.Price = int64(v)
		}

		// Migración dinámica de imágenes
		if len(p.Images) == 0 && p.Image != "" {
			p.Images = []string{p.Image}
		}
		if p.Images == nil {
			p.Images = []string{}
		}

		products = append(products, p)
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
