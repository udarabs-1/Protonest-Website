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
	BlogCollection         *mongo.Collection
	ResearchCollection     *mongo.Collection
	JobCollection          *mongo.Collection
	CVCollection           *mongo.Collection
)

const (
	DatabaseName               = "protonest"
	UserCollectionName         = "users"
	AdminCollectionName        = "admins"
	SubscriptionCollectionName = "subscriptions"
	ContactCollectionName      = "contacts"
	BlogCollectionName         = "blogs"
	ResearchCollectionName     = "research"
	JobCollectionName          = "jobs"
	CVCollectionName           = "cvs"
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
	BlogCollection = db.Collection(BlogCollectionName)
	ResearchCollection = db.Collection(ResearchCollectionName)
	JobCollection = db.Collection(JobCollectionName)
	CVCollection = db.Collection(CVCollectionName)

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

	// Create index for blog slugs
	_, err = BlogCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"slug": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Fatalf("❌ Failed to create blog slug index: %v", err)
	}

	// Create index for research slugs
	_, err = ResearchCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"slug": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Fatalf("❌ Failed to create research slug index: %v", err)
	}

	// Create indexes for jobs
	jobIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{{Key: "status", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "category", Value: 1}},
		},
		{
			Keys: bson.D{{Key: "job_type", Value: 1}},
		},
		{
			Keys: bson.D{
				{Key: "location", Value: "text"},
				{Key: "title", Value: "text"},
				{Key: "description", Value: "text"},
			},
		},
		{
			Keys:    bson.D{{Key: "schedule_at", Value: 1}},
			Options: options.Index().SetExpireAfterSeconds(0),
		},
	}

	for _, index := range jobIndexes {
		_, err := JobCollection.Indexes().CreateOne(ctx, index)
		if err != nil {
			log.Fatalf("❌ Failed to create job index: %v", err)
		}
	}

	// Create index for CVs
	_, err = CVCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.M{"user_id": 1},
	})
	if err != nil {
		log.Fatalf("❌ Failed to create CV index: %v", err)
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
