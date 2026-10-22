package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/middleware"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type OrderHandler struct {
	store *storage.Store
}

func NewOrderHandler(store *storage.Store) *OrderHandler {
	return &OrderHandler{store: store}
}

type CreateOrderItemInput struct {
	ProductID       *string `json:"productId"`
	CustomRequestID *string `json:"customRequestId"`
	Quantity        int     `json:"quantity" binding:"required,gte=1"`
	UnitPrice       float64 `json:"unitPrice"` // Note: server overrides this for products to avoid manipulation
}

type CreateOrderInput struct {
	Items           []CreateOrderItemInput `json:"items" binding:"required,min=1"`
	ShippingAddress models.ShippingAddress `json:"shippingAddress" binding:"required"`
	IsDemo          bool                   `json:"isDemo"`
}

// CreateOrder places an order with server-side stock and price validation
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in to place an order."})
		return
	}

	var req CreateOrderInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order input: " + err.Error()})
		return
	}

	var items []models.OrderItem
	for _, it := range req.Items {
		items = append(items, models.OrderItem{
			ProductID:       it.ProductID,
			CustomRequestID: it.CustomRequestID,
			Quantity:        it.Quantity,
			UnitPrice:       it.UnitPrice,
		})
	}

	order := &models.Order{
		BuyerID:         user.ID,
		BuyerName:       user.FullName,
		ShippingAddress: req.ShippingAddress,
		IsDemo:          req.IsDemo,
		Items:           items,
		Status:          models.OrderStatusPending,
	}

	if err := h.store.CreateOrder(order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order created successfully. Please complete payment to confirm your order.",
		"order":   order,
	})
}

// GetOrder returns single order details
func (h *OrderHandler) GetOrder(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	id := c.Param("id")

	order, err := h.store.GetOrderByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Security: Only order owner or admin can view order
	if user == nil || (order.BuyerID != user.ID && user.Role != models.RoleAdmin && user.Role != models.RoleArtisan) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to view this order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"order": order})
}

// GetMyOrders lists buyer's orders
func (h *OrderHandler) GetMyOrders(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	orders := h.store.GetUserOrders(user.ID)
	c.JSON(http.StatusOK, gin.H{
		"orders": orders,
		"count":  len(orders),
	})
}

// UpdateOrderStatus updates order fulfillment status
func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil || (user.Role != models.RoleArtisan && user.Role != models.RoleAdmin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only artisans or admins can update order fulfillment status."})
		return
	}

	id := c.Param("id")
	type UpdateStatusInput struct {
		Status string `json:"status" binding:"required"`
	}
	var req UpdateStatusInput
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.store.UpdateOrderStatus(id, req.Status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Order status updated successfully",
		"newStatus": req.Status,
	})
}
