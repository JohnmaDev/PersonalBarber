package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Seguridad básica: Verificar PIN en el query string o header
	adminPin := os.Getenv("VUE_APP_ADMIN_PIN")
	providedPin := request.QueryStringParameters["token"]
	if providedPin == "" {
		providedPin = request.Headers["Authorization"]
	}

	if adminPin == "" || providedPin != adminPin {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusUnauthorized,
			Body:       `{"error": "Unauthorized"}`,
		}, nil
	}

	uri := os.Getenv("MONGODB_URI")
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
	}
	defer client.Disconnect(ctx)

	collection := client.Database("personalbarber").Collection("products")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: fmt.Sprintf(`{"error": "%v"}`, err)}, nil
	}
	defer cursor.Close(ctx)

	re := regexp.MustCompile(`[0-9]+`)
	updatedCount := 0

	for cursor.Next(ctx) {
		var doc bson.M
		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		priceVal, ok := doc["price"]
		if !ok {
			continue
		}

		var numericPrice int64
		needsUpdate := false

		switch v := priceVal.(type) {
		case string:
			digits := re.FindAllString(v, -1)
			allDigits := strings.Join(digits, "")
			if allDigits != "" {
				numericPrice, _ = strconv.ParseInt(allDigits, 10, 64)
				needsUpdate = true
			}
		}

		if needsUpdate {
			_, err := collection.UpdateOne(
				ctx,
				bson.M{"_id": doc["_id"]},
				bson.M{"$set": bson.M{"price": numericPrice}},
			)
			if err == nil {
				updatedCount++
			}
		}
	}

	body, _ := json.Marshal(map[string]interface{}{
		"ok":      true,
		"message": "Migración completada con éxito",
		"updated": updatedCount,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(body),
	}, nil
}

func main() {
	lambda.Start(handler)
}
