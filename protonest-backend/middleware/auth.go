package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/models"
	"github.com/shafeekms10/protonest-backend/utils"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip middleware for OPTIONS requests
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Authorization header is required"))
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid authorization header format"))
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid token: "+err.Error()))
			c.Abort()
			return
		}

		// Set all claims in context
		c.Set("user_email", claims.Email)
		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		c.Set("jwt_claims", claims) // Store full claims object

		c.Next()
	}
}
