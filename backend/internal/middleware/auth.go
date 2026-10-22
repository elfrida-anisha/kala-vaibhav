package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

const UserContextKey = "current_user"

// AuthMiddleware inspects Bearer tokens or Demo User headers
func AuthMiddleware(store *storage.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Check for demo header (useful for rapid evaluation & testing)
		demoUserID := c.GetHeader("X-Demo-User")
		if demoUserID != "" {
			user, err := store.GetUserByID(demoUserID)
			if err == nil {
				c.Set(UserContextKey, user)
				c.Next()
				return
			}
		}

		// 2. Check for Bearer token
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) == 2 && strings.EqualFold(parts[0], "Bearer") {
				token := strings.TrimSpace(parts[1])
				// Token may be a user ID or email in demo mode
				user, err := store.GetUserByID(token)
				if err != nil {
					user, err = store.GetUserByEmail(token)
				}
				if err == nil {
					c.Set(UserContextKey, user)
					c.Next()
					return
				}
			}
		}

		c.Next()
	}
}

// RequireAuth ensures that the request has an authenticated user
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		val, exists := c.Get(UserContextKey)
		if !exists || val == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authentication required. Please log in or select a demo account.",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

// RequireRole ensures that the user has one of the required roles
func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		val, exists := c.Get(UserContextKey)
		if !exists || val == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authentication required.",
			})
			c.Abort()
			return
		}

		user := val.(*models.User)
		allowed := false
		for _, r := range allowedRoles {
			if strings.EqualFold(user.Role, r) {
				allowed = true
				break
			}
		}

		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Access forbidden: you do not have the required permissions for this action.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// GetCurrentUser is a helper to retrieve the authenticated user
func GetCurrentUser(c *gin.Context) *models.User {
	val, exists := c.Get(UserContextKey)
	if !exists || val == nil {
		return nil
	}
	return val.(*models.User)
}
