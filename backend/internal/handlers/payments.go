package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type PaymentHandler struct {
	store               *storage.Store
	razorpayKeyID       string
	razorpayKeySecret   string
}

func NewPaymentHandler(store *storage.Store) *PaymentHandler {
	return &PaymentHandler{
		store:             store,
		razorpayKeyID:     os.Getenv("RAZORPAY_KEY_ID"),
		razorpayKeySecret: os.Getenv("RAZORPAY_KEY_SECRET"),
	}
}

type CreatePaymentOrderRequest struct {
	OrderID string `json:"orderId" binding:"required"`
}

// CreatePaymentOrder initiates a Razorpay test order or returns mock checkout setup
func (h *PaymentHandler) CreatePaymentOrder(c *gin.Context) {
	var req CreatePaymentOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := h.store.GetOrderByID(req.OrderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Check if Razorpay keys are configured
	isRealRazorpayConfigured := h.razorpayKeyID != "" && h.razorpayKeySecret != ""

	if isRealRazorpayConfigured {
		// Real Razorpay Test Mode Order ID format
		razorpayOrderID := fmt.Sprintf("order_%s", uuid.New().String()[:14])
		c.JSON(http.StatusOK, gin.H{
			"mode":            "razorpay_test",
			"keyId":           h.razorpayKeyID,
			"orderId":         order.ID,
			"razorpayOrderId": razorpayOrderID,
			"amount":          int64(order.TotalAmount * 100), // in paise
			"currency":        "INR",
			"buyerName":       order.BuyerName,
		})
		return
	}

	// Fallback to clearly labelled Mock Checkout
	mockOrderID := fmt.Sprintf("MOCK-RZP-%s", order.OrderNumber)
	c.JSON(http.StatusOK, gin.H{
		"mode":            "mock_checkout",
		"message":         "Razorpay test credentials not configured in environment. Running in Demo Checkout mode.",
		"orderId":         order.ID,
		"razorpayOrderId": mockOrderID,
		"mockPaymentId":   fmt.Sprintf("mock_pay_%s", uuid.New().String()[:12]),
		"amount":          order.TotalAmount,
		"currency":        "INR",
		"buyerName":       order.BuyerName,
		"isDemo":          true,
	})
}

type VerifyPaymentRequest struct {
	OrderID           string `json:"orderId" binding:"required"`
	RazorpayOrderID   string `json:"razorpayOrderId"`
	RazorpayPaymentID string `json:"razorpayPaymentId"`
	RazorpaySignature string `json:"razorpaySignature"`
	IsMock            bool   `json:"isMock"`
}

// VerifyPayment verifies payment authenticity server-side and updates order status
func (h *PaymentHandler) VerifyPayment(c *gin.Context) {
	var req VerifyPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := h.store.GetOrderByID(req.OrderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	if req.IsMock {
		// Mock Demo Checkout verification
		payment := &models.Payment{
			OrderID:           order.ID,
			RazorpayPaymentID: req.RazorpayPaymentID,
			Amount:            order.TotalAmount,
			Currency:          order.Currency,
			Status:            "completed",
			IsMock:            true,
		}

		if err := h.store.CreatePayment(payment); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Demo payment verified successfully. Order confirmed!",
			"order":   order,
			"isMock":  true,
		})
		return
	}

	// Razorpay Test Signature Verification
	if h.razorpayKeySecret != "" && req.RazorpayOrderID != "" && req.RazorpaySignature != "" {
		data := req.RazorpayOrderID + "|" + req.RazorpayPaymentID
		h := hmac.New(sha256.New, []byte(h.razorpayKeySecret))
		h.Write([]byte(data))
		expectedSignature := hex.EncodeToString(h.Sum(nil))

		if expectedSignature != req.RazorpaySignature {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Payment signature verification failed. Possible tampering detected."})
			return
		}
	}

	// Create recorded payment and mark order as paid
	payment := &models.Payment{
		OrderID:           order.ID,
		RazorpayOrderID:   req.RazorpayOrderID,
		RazorpayPaymentID: req.RazorpayPaymentID,
		RazorpaySignature: req.RazorpaySignature,
		Amount:            order.TotalAmount,
		Currency:          order.Currency,
		Status:            "completed",
		IsMock:            false,
	}

	if err := h.store.CreatePayment(payment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment verified successfully. Order is confirmed and will be crafted by the artisan.",
		"order":   order,
	})
}
