package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/models"
	"github.com/shafeekms10/protonest-backend/utils"
)

func PythonServiceAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip middleware for OPTIONS requests
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		// Get service token from header
		serviceToken := c.GetHeader("X-Service-Token")
		if serviceToken == "" {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Service token required"))
			c.Abort()
			return
		}

		// Validate service token (compare with environment variable)
		expectedToken := os.Getenv("PYTHON_SERVICE_TOKEN")
		if expectedToken == "" || serviceToken != expectedToken {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid service token"))
			c.Abort()
			return
		}

		// If we need to validate a JWT as well (for user context)
		if authHeader := c.GetHeader("Authorization"); authHeader != "" {
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenString := strings.TrimPrefix(authHeader, "Bearer ")
				if claims, err := utils.ValidateJWT(tokenString); err == nil {
					c.Set("user_email", claims.Email)
					c.Set("user_id", claims.UserID)
				}
			}
		}

		c.Next()
	}
}
