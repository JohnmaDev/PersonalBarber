package main

import (
	"context"
	"encoding/json"
	"fmt"
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
	uri := os.Getenv("MONGODB_URI")
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("categories")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
	}
	defer cursor.Close(ctx)

	var categories []Category
	if err := cursor.All(ctx, &categories); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
	}

	res, _ := json.Marshal(map[string]interface{}{"ok": true, "categories": categories})
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
		Body:       string(res),
	}, nil
}

func main() {
	lambda.Start(handler)
}
