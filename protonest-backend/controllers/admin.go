// controllers/admin.go
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
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// AdminLogin handles admin authentication
func AdminLogin(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var loginReq models.AdminLoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	// Find admin by email
	var admin models.Admin
	err := database.AdminCollection.FindOne(ctx, bson.M{"email": loginReq.Email}).Decode(&admin)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid email or password"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database query failed"))
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(loginReq.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid email or password"))
		return
	}

	// Generate JWT token with admin role
	token, err := utils.GenerateAdminJWT(admin.Email, admin.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to generate authentication token"))
		return
	}

	// Prepare response
	loginResponse := models.AdminLoginResponse{
		Token: token,
		Admin: admin.ToResponse(),
	}

	c.JSON(http.StatusOK, models.SuccessResponse("Login successful", loginResponse))
}
