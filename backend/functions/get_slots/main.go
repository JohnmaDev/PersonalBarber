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

// Solo expone horaRaw — sin datos privados del cliente
type SlotInfo struct {
	HoraRaw string `bson:"horaRaw"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fecha := request.QueryStringParameters["date"]
	if fecha == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       `{"error": "Parámetro 'date' requerido (YYYY-MM-DD)"}`,
		}, nil
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"error": "Database configuration missing"}`,
		}, nil
	}

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Failed to connect: %v"}`, err),
		}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("reservations")

	cursor, err := collection.Find(ctx, bson.M{"fechaRaw": fecha}, options.Find().SetProjection(bson.M{"horaRaw": 1, "_id": 0}))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Query failed: %v"}`, err),
		}, nil
	}
	defer cursor.Close(ctx)

	var slots []SlotInfo
	if err = cursor.All(ctx, &slots); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Decode failed: %v"}`, err),
		}, nil
	}

	horas := make([]string, 0, len(slots))
	for _, s := range slots {
		horas = append(horas, s.HoraRaw)
	}

	body, _ := json.Marshal(map[string]interface{}{
		"ok":    true,
		"date":  fecha,
		"horas": horas,
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
