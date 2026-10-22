package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/middleware"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type AuthHandler struct {
	store *storage.Store
}

func NewAuthHandler(store *storage.Store) *AuthHandler {
	return &AuthHandler{store: store}
}

type DemoLoginRequest struct {
	Role string `json:"role" binding:"required"` // "artisan", "buyer", "admin"
	ID   string `json:"id,omitempty"`
}

type LoginRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	FullName string `json:"fullName" binding:"required"`
	Role     string `json:"role" binding:"required"`
	Phone    string `json:"phone,omitempty"`
	Region   string `json:"region,omitempty"`
	Bio      string `json:"bio,omitempty"`
}

// DemoLogin quickly logs into a preset demo account
func (h *AuthHandler) DemoLogin(c *gin.Context) {
	var req DemoLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid demo login payload: " + err.Error()})
		return
	}

	var matchedUser *models.User

	// If ID is specified, pick exact user
	if req.ID != "" {
		u, err := h.store.GetUserByID(req.ID)
		if err == nil {
			matchedUser = u
		}
	}

	// Otherwise match by role
	if matchedUser == nil {
		for _, u := range h.store.Users {
			if strings.EqualFold(u.Role, req.Role) {
				matchedUser = u
				break
			}
		}
	}

	if matchedUser == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No demo account found for role: " + req.Role})
		return
	}

	// For artisans, also return artisan profile details
	var artisanProfile *models.ArtisanProfile
	if matchedUser.Role == models.RoleArtisan {
		artisanProfile = h.store.Artisans[matchedUser.ID]
	}

	c.JSON(http.StatusOK, gin.H{
		"token":          matchedUser.ID,
		"user":           matchedUser,
		"artisanProfile": artisanProfile,
		"isDemo":         true,
	})
}

// Login
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := h.store.GetUserByEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found with this email."})
		return
	}

	var artisanProfile *models.ArtisanProfile
	if u.Role == models.RoleArtisan {
		artisanProfile = h.store.Artisans[u.ID]
	}

	c.JSON(http.StatusOK, gin.H{
		"token":          u.ID,
		"user":           u,
		"artisanProfile": artisanProfile,
	})
}

// Register
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := h.store.GetUserByEmail(req.Email); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "A user with this email already exists."})
		return
	}

	newUser := &models.User{
		Email:    req.Email,
		FullName: req.FullName,
		Role:     req.Role,
		Phone:    req.Phone,
		Region:   req.Region,
		Bio:      req.Bio,
	}

	if err := h.store.CreateUser(newUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": newUser.ID,
		"user":  newUser,
	})
}

// Me returns the current authenticated user
func (h *AuthHandler) Me(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	var artisanProfile *models.ArtisanProfile
	if user.Role == models.RoleArtisan {
		artisanProfile = h.store.Artisans[user.ID]
	}

	c.JSON(http.StatusOK, gin.H{
		"user":           user,
		"artisanProfile": artisanProfile,
	})
}

// GetDemoAccounts lists available demo accounts for easy switching
func (h *AuthHandler) GetDemoAccounts(c *gin.Context) {
	type DemoAccountItem struct {
		ID             string `json:"id"`
		FullName       string `json:"fullName"`
		Role           string `json:"role"`
		Region         string `json:"region"`
		CraftSpecialty string `json:"craftSpecialty,omitempty"`
		AvatarURL      string `json:"avatarUrl"`
	}

	var list []DemoAccountItem
	for _, u := range h.store.Users {
		item := DemoAccountItem{
			ID:        u.ID,
			FullName:  u.FullName,
			Role:      u.Role,
			Region:    u.Region,
			AvatarURL: u.AvatarURL,
		}
		if ap, ok := h.store.Artisans[u.ID]; ok {
			item.CraftSpecialty = ap.CraftSpecialty
		}
		list = append(list, item)
	}

	c.JSON(http.StatusOK, gin.H{
		"accounts": list,
	})
}
