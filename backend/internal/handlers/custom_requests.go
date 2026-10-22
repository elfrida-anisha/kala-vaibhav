package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/middleware"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type CustomRequestHandler struct {
	store *storage.Store
}

func NewCustomRequestHandler(store *storage.Store) *CustomRequestHandler {
	return &CustomRequestHandler{store: store}
}

// GetCustomRequests lists custom requests
func (h *CustomRequestHandler) GetCustomRequests(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	var buyerID string
	if c.Query("mine") == "true" && user != nil {
		buyerID = user.ID
	}

	requests := h.store.GetCustomRequests(buyerID)
	c.JSON(http.StatusOK, gin.H{
		"requests": requests,
		"count":    len(requests),
	})
}

// GetCustomRequestByID
func (h *CustomRequestHandler) GetCustomRequestByID(c *gin.Context) {
	id := c.Param("id")
	r, err := h.store.GetCustomRequestByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Custom commission request not found"})
		return
	}

	user := middleware.GetCurrentUser(c)
	// Privacy check: if private, only owner or artisans or admins can view
	if r.IsPrivate && (user == nil || (user.ID != r.BuyerID && user.Role != models.RoleArtisan && user.Role != models.RoleAdmin)) {
		c.JSON(http.StatusForbidden, gin.H{"error": "This custom commission request is private to the client and invited artisans."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"request": r})
}

type CreateCustomRequestInput struct {
	Title             string                 `json:"title" binding:"required"`
	Description       string                 `json:"description" binding:"required"`
	CraftType         string                 `json:"craftType" binding:"required"`
	Preferences       map[string]interface{} `json:"preferences"`
	ReferenceImageURL string                 `json:"referenceImageUrl"`
	IsPrivate         bool                   `json:"isPrivate"`
	BudgetMin         float64                `json:"budgetMin" binding:"required,gte=0"`
	BudgetMax         float64                `json:"budgetMax" binding:"required,gte=0"`
	DesiredDate       string                 `json:"desiredDate"`
}

// CreateCustomRequest creates a new design commission request by a buyer
func (h *CustomRequestHandler) CreateCustomRequest(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in to submit a custom craft request."})
		return
	}

	var req CreateCustomRequestInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request parameters: " + err.Error()})
		return
	}

	if req.BudgetMax < req.BudgetMin {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum budget cannot be less than minimum budget."})
		return
	}

	customReq := &models.CustomRequest{
		BuyerID:           user.ID,
		BuyerName:         user.FullName,
		Title:             req.Title,
		Description:       req.Description,
		CraftType:         req.CraftType,
		Preferences:       req.Preferences,
		ReferenceImageURL: req.ReferenceImageURL,
		IsPrivate:         req.IsPrivate,
		BudgetMin:         req.BudgetMin,
		BudgetMax:         req.BudgetMax,
		DesiredDate:       req.DesiredDate,
	}

	if err := h.store.CreateCustomRequest(customReq); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Custom commission request submitted successfully. Traditional artisans will review and provide proposals.",
		"request": customReq,
	})
}

type CreateProposalInput struct {
	ProposedPrice float64 `json:"proposedPrice" binding:"required,gt=0"`
	EstimatedDays int     `json:"estimatedDays" binding:"required,gt=0"`
	Message       string  `json:"message" binding:"required"`
}

// CreateProposal allows artisan to submit a quotation/proposal
func (h *CustomRequestHandler) CreateProposal(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil || user.Role != models.RoleArtisan {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only registered artisans can submit commission proposals."})
		return
	}

	requestID := c.Param("id")
	var req CreateProposalInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prop := &models.CommissionProposal{
		CustomRequestID: requestID,
		ArtisanID:       user.ID,
		ArtisanName:     user.FullName,
		ArtisanAvatar:   user.AvatarURL,
		ProposedPrice:   req.ProposedPrice,
		EstimatedDays:   req.EstimatedDays,
		Message:         req.Message,
	}

	if err := h.store.CreateProposal(prop); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Proposal submitted to buyer successfully.",
		"proposal": prop,
	})
}

type AcceptProposalInput struct {
	ProposalID string `json:"proposalId" binding:"required"`
}

// AcceptProposal allows buyer to accept an artisan proposal
func (h *CustomRequestHandler) AcceptProposal(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	requestID := c.Param("id")
	var req AcceptProposalInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.store.AcceptProposal(requestID, req.ProposalID, user.ID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Proposal accepted! You can now proceed to payment and track production milestones.",
	})
}

type UpdateMilestoneInput struct {
	Status string `json:"status" binding:"required"` // "in_production", "ready_to_ship", "shipped", "delivered"
}

// UpdateMilestone allows artisan to advance commission production milestones
func (h *CustomRequestHandler) UpdateMilestone(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil || user.Role != models.RoleArtisan {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only artisans can update production milestones."})
		return
	}

	requestID := c.Param("id")
	var req UpdateMilestoneInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.store.UpdateCustomRequestStatus(requestID, req.Status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Production milestone updated successfully.",
		"newStatus": req.Status,
	})
}
