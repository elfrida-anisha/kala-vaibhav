package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/middleware"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type PassportHandler struct {
	store *storage.Store
}

func NewPassportHandler(store *storage.Store) *PassportHandler {
	return &PassportHandler{store: store}
}

// GetPassport returns the Digital Craft Passport for a product
func (h *PassportHandler) GetPassport(c *gin.Context) {
	productID := c.Param("productId")
	passport, err := h.store.GetPassportByProductID(productID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Craft passport not found for this product"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"passport": passport})
}

type VerifyPassportRequest struct {
	Status string `json:"status" binding:"required"` // "artisan-declared", "community-reviewed", "independently-verified"
	Notes  string `json:"notes"`
}

// VerifyPassport allows admin or designated reviewer to update verification status with audit trail
func (h *PassportHandler) VerifyPassport(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil || user.Role != models.RoleAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can perform provenance verification audits."})
		return
	}

	passportID := c.Param("id")
	var req VerifyPassportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.store.UpdatePassportStatus(passportID, req.Status, req.Notes, user.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Craft passport verification status updated successfully.",
		"newStatus": req.Status,
	})
}
