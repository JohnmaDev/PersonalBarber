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
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "MONGODB_URI not configured"}`,
		}, nil
	}

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "%v"}`, err),
		}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("cuts")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Query failed: %v"}`, err),
		}, nil
	}
	defer cursor.Close(ctx)

	var cuts []Cut
	if err = cursor.All(ctx, &cuts); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Decode failed: %v"}`, err),
		}, nil
	}

	// Ensure empty slice instead of null
	if cuts == nil {
		cuts = []Cut{}
	}

	body, _ := json.Marshal(map[string]interface{}{
		"ok":    true,
		"count": len(cuts),
		"cuts":  cuts,
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
