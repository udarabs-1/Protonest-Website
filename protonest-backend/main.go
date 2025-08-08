package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/shafeekms10/protonest-backend/database"
	"github.com/shafeekms10/protonest-backend/routes"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("./.env"); err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// Initialize database
	database.InitDatabase()

	// Setup router
	router := gin.Default()

	// Setup routes
	routes.SetupRoutes(router)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
