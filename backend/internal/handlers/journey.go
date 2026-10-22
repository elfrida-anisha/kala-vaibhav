package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/middleware"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type JourneyHandler struct {
	store *storage.Store
}

func NewJourneyHandler(store *storage.Store) *JourneyHandler {
	return &JourneyHandler{store: store}
}

// GetJourney returns chronological craft journey milestone items
func (h *JourneyHandler) GetJourney(c *gin.Context) {
	productID := c.Param("productId")
	items := h.store.GetJourneyItems(productID)
	c.JSON(http.StatusOK, gin.H{
		"items": items,
		"count": len(items),
	})
}

type AddJourneyItemRequest struct {
	ProductID     string `json:"productId" binding:"required"`
	Title         string `json:"title" binding:"required"`
	Description   string `json:"description"`
	MediaURL      string `json:"mediaUrl" binding:"required"`
	MediaType     string `json:"mediaType" binding:"required"` // "image" or "video"
	StepOrder     int    `json:"stepOrder" binding:"gte=1"`
	MilestoneDate string `json:"milestoneDate"`
}

// AddJourneyItem allows artisan to add a making-process photo/video milestone
func (h *JourneyHandler) AddJourneyItem(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil || user.Role != models.RoleArtisan {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only artisans can add Craft Journey milestones."})
		return
	}

	var req AddJourneyItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify product ownership
	prod, err := h.store.GetProductByID(req.ProductID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	if prod.ArtisanID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not own this product"})
		return
	}

	item := &models.CraftJourneyItem{
		ProductID:     req.ProductID,
		ArtisanID:     user.ID,
		Title:         req.Title,
		Description:   req.Description,
		MediaURL:      req.MediaURL,
		MediaType:     req.MediaType,
		StepOrder:     req.StepOrder,
		MilestoneDate: req.MilestoneDate,
	}

	if err := h.store.AddJourneyItem(item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Craft journey milestone added successfully.",
		"item":    item,
	})
}
