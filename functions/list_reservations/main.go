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

type Reservation struct {
	Nombre    string `json:"nombre" bson:"nombre"`
	Telefono  string `json:"telefono" bson:"telefono"`
	Servicio  string `json:"servicio" bson:"servicio"`
	FechaRaw  string `json:"fechaRaw" bson:"fechaRaw"`
	HoraRaw   string `json:"horaRaw" bson:"horaRaw"`
	Direccion string `json:"direccion" bson:"direccion"`
	Estado    string `json:"estado" bson:"estado"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Conectar a MongoDB
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
			Body:       fmt.Sprintf(`{"error": "Failed to connect to DB: %v"}`, err),
		}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("reservations")

	// Consultar todas las reservas (podríamos filtrar por fecha futura en el futuro)
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Failed to fetch reservations: %v"}`, err),
		}, nil
	}
	defer cursor.Close(ctx)

	var reservations []Reservation
	if err = cursor.All(ctx, &reservations); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       fmt.Sprintf(`{"error": "Failed to decode reservations: %v"}`, err),
		}, nil
	}

	body, _ := json.Marshal(map[string]interface{}{
		"ok":        true,
		"reservas": reservations,
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
