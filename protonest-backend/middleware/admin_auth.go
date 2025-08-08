// middleware/admin_auth.go
package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/models"
	"github.com/shafeekms10/protonest-backend/utils"
)

// AdminAuthMiddleware validates JWT tokens for admin routes
func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Authorization header is required"))
			c.Abort()
			return
		}

		// Check if the header starts with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid authorization header format"))
			c.Abort()
			return
		}

		// Extract the token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Validate the token
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, models.FailResponse("Invalid or expired token"))
			c.Abort()
			return
		}

		// Check if the user has admin role
		if claims.Role != "admin" && claims.Role != "super_admin" {
			c.JSON(http.StatusForbidden, models.FailResponse("Access denied. Admin privileges required"))
			c.Abort()
			return
		}

		// Set user email and role in context for use in handlers
		c.Set("admin_email", claims.Email)
		c.Set("admin_role", claims.Role)
		c.Next()
	}
}
