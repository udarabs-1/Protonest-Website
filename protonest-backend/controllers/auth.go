// controllers/auth.go
package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/database"
	"github.com/shafeekms10/protonest-backend/models"
	"github.com/shafeekms10/protonest-backend/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

const (
	RequestTimeout = 10 * time.Second
)

// SignUp handles user registration
func SignUp(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), RequestTimeout)
	defer cancel()

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	// Check if user already exists
	count, err := database.UserCollection.CountDocuments(ctx, bson.M{"email": user.Email})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database query failed"))
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, models.FailResponse("User with this email already exists"))
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to process password"))
		return
	}

	// Prepare user data
	user.Password = hashedPassword
	user.CreatedAt = time.Now().Format(time.RFC3339)

	// Insert user
	result, err := database.UserCollection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to create user"))
		return
	}

	// Set the ID from insert result
	user.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, models.SuccessResponse(
		"User created successfully",
		gin.H{"user": user.ToResponse()},
	))
}

// Login handles user authentication
func Login(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), RequestTimeout)
	defer cancel()

	var loginReq models.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	// Find user by email
	var user models.User
	err := database.UserCollection.FindOne(ctx, bson.M{"email": loginReq.Email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid email or password"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database query failed"))
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginReq.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid email or password"))
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to generate authentication token"))
		return
	}

	// Prepare response
	loginResponse := models.LoginResponse{
		Token: token,
		User:  user.ToResponse(),
	}

	c.JSON(http.StatusOK, models.SuccessResponse("Login successful", loginResponse))
}
