package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoClient            *mongo.Client
	UserCollection         *mongo.Collection
	AdminCollection        *mongo.Collection
	SubscriptionCollection *mongo.Collection
	ContactCollection      *mongo.Collection
)

const (
	DatabaseName               = "protonest"
	UserCollectionName         = "users"
	AdminCollectionName        = "admins"
	SubscriptionCollectionName = "subscriptions"
	ContactCollectionName      = "contacts"
	ConnectionTimeout          = 10 * time.Second
	PingTimeout                = 5 * time.Second
)

// InitDatabase initializes MongoDB connection and collections
func InitDatabase() {
	ctx, cancel := context.WithTimeout(context.Background(), ConnectionTimeout)
	defer cancel()

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("❌ MONGODB_URI environment variable is required")
	}

	// Configure client options
	clientOptions := options.Client().
		ApplyURI(mongoURI).
		SetServerSelectionTimeout(PingTimeout).
		SetConnectTimeout(ConnectionTimeout)

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("❌ Failed to create MongoDB client: %v", err)
	}

	// Ping the database
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("❌ Cannot connect to MongoDB: %v", err)
	}

	log.Println("✅ Successfully connected to MongoDB")

	// Initialize collections
	MongoClient = client
	db := client.Database(DatabaseName)

	UserCollection = db.Collection(UserCollectionName)
	AdminCollection = db.Collection(AdminCollectionName)
	SubscriptionCollection = db.Collection(SubscriptionCollectionName)
	ContactCollection = db.Collection(ContactCollectionName)

	// Create indexes
	createIndexes(ctx)
}

// createIndexes sets up all required database indexes
func createIndexes(ctx context.Context) {
	// Unique index for admin emails
	_, err := AdminCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Fatalf("❌ Failed to create admin email index: %v", err)
	}

	// Unique index for user emails
	_, err = UserCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Fatalf("❌ Failed to create user email index: %v", err)
	}

	// Unique index for subscription emails
	_, err = SubscriptionCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Fatalf("❌ Failed to create subscription email index: %v", err)
	}

	log.Println("✅ Database indexes created successfully")
}

// CloseDatabase closes the MongoDB connection
func CloseDatabase() {
	if MongoClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := MongoClient.Disconnect(ctx); err != nil {
			log.Printf("❌ Error disconnecting from MongoDB: %v", err)
		} else {
			log.Println("✅ Disconnected from MongoDB")
		}
	}
}
