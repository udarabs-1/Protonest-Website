package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/shafeekms10/protonest-backend/database"
	"github.com/shafeekms10/protonest-backend/models"
	"github.com/shafeekms10/protonest-backend/utils"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/term"
)

func main() {
	// Load environment variables from root .env file
	if err := loadEnv(); err != nil {
		log.Println("Note:", err)
	}

	// Initialize database
	database.InitDatabase()
	defer database.CloseDatabase()

	// Get admin credentials
	email, password := getAdminCredentials()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if super admin exists
	if adminExists(ctx, email) {
		log.Fatal("❌ Super admin with this email already exists")
	}

	// Create super admin
	if err := createSuperAdmin(ctx, email, password); err != nil {
		log.Fatal("❌ Failed to create super admin:", err)
	}

	log.Println("✅ Super admin created successfully")
	log.Println("Email:", email)
}

func loadEnv() error {
	// Get the absolute path to the root directory
	rootDir, err := filepath.Abs(filepath.Join())
	if err != nil {
		return fmt.Errorf("could not determine root directory: %v", err)
	}

	envPath := filepath.Join(rootDir, ".env")
	if err := godotenv.Load(envPath); err != nil {
		return fmt.Errorf("no .env file found at %s - using environment variables", envPath)
	}
	return nil
}

func getAdminCredentials() (string, string) {
	reader := bufio.NewReader(os.Stdin)

	// Get email
	email := os.Getenv("SUPER_ADMIN_EMAIL")
	if email == "" {
		fmt.Print("Enter super admin email: ")
		input, err := reader.ReadString('\n')
		if err != nil {
			log.Fatal("Failed to read email:", err)
		}
		email = strings.TrimSpace(input)
	}

	// Get password
	password := os.Getenv("SUPER_ADMIN_PASSWORD")
	if password == "" {
		fmt.Print("Enter super admin password: ")
		bytePassword, err := term.ReadPassword(int(os.Stdin.Fd()))
		if err != nil {
			log.Fatal("Failed to read password:", err)
		}
		password = strings.TrimSpace(string(bytePassword))
		fmt.Println() // Add newline after password input
	}

	// Validate password
	if len(password) < 8 {
		log.Fatal("Password must be at least 8 characters long")
	}

	return email, password
}

func adminExists(ctx context.Context, email string) bool {
	count, err := database.AdminCollection.CountDocuments(ctx, bson.M{"email": email})
	if err != nil {
		log.Fatal("Failed to check for existing super admin:", err)
	}
	return count > 0
}

func createSuperAdmin(ctx context.Context, email, password string) error {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	superAdmin := models.Admin{
		FirstName: "Protonest",
		LastName:  "Admin",
		Email:     email,
		Password:  hashedPassword,
		Role:      "super_admin",
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	_, err = database.AdminCollection.InsertOne(ctx, superAdmin)
	return err
}
