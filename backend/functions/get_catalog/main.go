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
	"sync"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// ──────────────────────────────────────────
// Product types
// ──────────────────────────────────────────

type Product struct {
	ID           int64    `json:"id" bson:"id"`
	Name         string   `json:"name" bson:"name"`
	Brand        string   `json:"brand" bson:"brand"`
	Category     string   `json:"category" bson:"category"`
	ProductType  string   `json:"product_type,omitempty" bson:"product_type,omitempty"`
	Description  string   `json:"description" bson:"description"`
	Price        int64    `json:"price" bson:"price"`
	ComparePrice int64    `json:"comparePrice,omitempty" bson:"comparePrice,omitempty"`
	Images       []string `json:"images" bson:"images"`
	Image        string   `json:"image,omitempty" bson:"image,omitempty"`
	Stock        int      `json:"stock" bson:"stock"`
	Benefits     []string `json:"benefits,omitempty" bson:"benefits,omitempty"`
	Usage        string   `json:"usage,omitempty" bson:"usage,omitempty"`
	Specs        string   `json:"specs,omitempty" bson:"specs,omitempty"`
	Variants     []string `json:"variants,omitempty" bson:"variants,omitempty"`
	IsActive     bool     `json:"is_active" bson:"is_active"`
}

// flexibleProduct handles legacy price formats (string vs int)
type flexibleProduct struct {
	ID           int64       `bson:"id"`
	Name         string      `bson:"name"`
	Brand        string      `bson:"brand"`
	Category     string      `bson:"category"`
	ProductType  string      `bson:"product_type,omitempty"`
	Description  string      `bson:"description"`
	Price        interface{} `bson:"price"`
	ComparePrice interface{} `bson:"comparePrice,omitempty"`
	Images       []string    `bson:"images"`
	Image        string      `bson:"image,omitempty"`
	Stock        int         `bson:"stock"`
	Benefits     []string    `bson:"benefits,omitempty"`
	Usage        string      `bson:"usage,omitempty"`
	Specs        string      `bson:"specs,omitempty"`
	Variants     []string    `bson:"variants,omitempty"`
	IsActive     *bool       `bson:"is_active,omitempty"`
}

// ──────────────────────────────────────────
// Category type
// ──────────────────────────────────────────

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

// ──────────────────────────────────────────
// Handler
// ──────────────────────────────────────────

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "MONGODB_URI not configured"}`,
		}, nil
	}

	// Single connection shared between both queries
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Failed to connect: %v"}`, err),
		}, nil
	}
	defer client.Disconnect(ctx)

	db := client.Database("personalbarber")

	var (
		products   []Product
		categories []Category
		prodErr    error
		catErr     error
		wg         sync.WaitGroup
	)

	// Query both collections simultaneously using goroutines
	wg.Add(2)

	go func() {
		defer wg.Done()
		products, prodErr = fetchProducts(ctx, db)
	}()

	go func() {
		defer wg.Done()
		categories, catErr = fetchCategories(ctx, db)
	}()

	wg.Wait()

	if prodErr != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Products query failed: %v"}`, prodErr),
		}, nil
	}
	if catErr != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Categories query failed: %v"}`, catErr),
		}, nil
	}

	body, _ := json.Marshal(map[string]interface{}{
		"ok":         true,
		"products":   products,
		"categories": categories,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "*",
			"Cache-Control":                "no-cache, no-store, must-revalidate",
		},
		Body: string(body),
	}, nil
}

// ──────────────────────────────────────────
// fetchProducts — reuses price migration logic
// ──────────────────────────────────────────

func fetchProducts(ctx context.Context, db *mongo.Database) ([]Product, error) {
	cursor, err := db.Collection("products").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var raw []flexibleProduct
	if err = cursor.All(ctx, &raw); err != nil {
		return nil, err
	}

	re := regexp.MustCompile(`[0-9]+`)
	products := make([]Product, 0, len(raw))

	for _, rp := range raw {
		isActive := true
		if rp.IsActive != nil {
			isActive = *rp.IsActive
		}
		if !isActive {
			continue
		}

		p := Product{
			ID:          rp.ID,
			Name:        rp.Name,
			Brand:       rp.Brand,
			Category:    rp.Category,
			ProductType: rp.ProductType,
			Description: rp.Description,
			Images:      rp.Images,
			Image:       rp.Image,
			Stock:       rp.Stock,
			Benefits:    rp.Benefits,
			Usage:       rp.Usage,
			Specs:       rp.Specs,
			Variants:    rp.Variants,
			IsActive:    isActive,
		}

		// Parse comparePrice flexible
		switch cv := rp.ComparePrice.(type) {
		case float64:
			p.ComparePrice = int64(cv)
		case int32:
			p.ComparePrice = int64(cv)
		case int64:
			p.ComparePrice = cv
		}

		switch v := rp.Price.(type) {
		case string:
			digits := re.FindAllString(v, -1)
			p.Price, _ = strconv.ParseInt(strings.Join(digits, ""), 10, 64)
		case int32:
			p.Price = int64(v)
		case int64:
			p.Price = v
		case float64:
			p.Price = int64(v)
		}

		if len(p.Images) == 0 && p.Image != "" {
			p.Images = []string{p.Image}
		}
		if p.Images == nil {
			p.Images = []string{}
		}

		products = append(products, p)
	}

	return products, nil
}

// ──────────────────────────────────────────
// fetchCategories
// ──────────────────────────────────────────

func fetchCategories(ctx context.Context, db *mongo.Database) ([]Category, error) {
	cursor, err := db.Collection("categories").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var categories []Category
	if err = cursor.All(ctx, &categories); err != nil {
		return nil, err
	}
	return categories, nil
}

func main() {
	lambda.Start(handler)
}
