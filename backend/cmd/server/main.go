package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/handlers"
	"kala-vaibhav/internal/middleware"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

func main() {
	// Setup data directory and store
	dataDir := os.Getenv("DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "uploads"
	}

	store, err := storage.NewStore(dataDir)
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	// Initialize Gin router
	r := gin.Default()

	// CORS configuration allowing Next.js frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000", "*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Demo-User"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Static files serving for uploaded craft imagery
	_ = os.MkdirAll(uploadDir, 0755)
	r.Static("/uploads", filepath.Clean(uploadDir))

	// Global auth middleware (extracts token or demo user without blocking public routes)
	r.Use(middleware.AuthMiddleware(store))

	// Handlers
	authHandler := handlers.NewAuthHandler(store)
	productHandler := handlers.NewProductHandler(store)
	passportHandler := handlers.NewPassportHandler(store)
	journeyHandler := handlers.NewJourneyHandler(store)
	customHandler := handlers.NewCustomRequestHandler(store)
	orderHandler := handlers.NewOrderHandler(store)
	paymentHandler := handlers.NewPaymentHandler(store)
	aiHandler := handlers.NewAIHandler(store)
	adminHandler := handlers.NewAdminHandler(store)
	uploadHandler := handlers.NewUploadHandler(uploadDir)

	// Health Check
	healthCheck := func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"app":       "Kala Vaibhav REST API",
			"version":   "1.0.0",
			"timestamp": time.Now(),
		})
	}
	r.GET("/health", healthCheck)
	r.GET("/api/health", healthCheck)

	// API Routes Group
	api := r.Group("/api")
	{
		// Authentication & Profiles
		auth := api.Group("/auth")
		{
			auth.POST("/demo-login", authHandler.DemoLogin)
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
			auth.GET("/me", authHandler.Me)
			auth.GET("/demo-accounts", authHandler.GetDemoAccounts)
		}

		// Marketplace Products
		products := api.Group("/products")
		{
			products.GET("", productHandler.GetProducts)
			products.GET("/:id", productHandler.GetProductByID)
			products.POST("", middleware.RequireAuth(), middleware.RequireRole(models.RoleArtisan, models.RoleAdmin), productHandler.CreateProduct)
			products.PUT("/:id", middleware.RequireAuth(), productHandler.UpdateProduct)
			products.DELETE("/:id", middleware.RequireAuth(), productHandler.DeleteProduct)
		}

		// Digital Craft Passports
		passports := api.Group("/passports")
		{
			passports.GET("/:productId", passportHandler.GetPassport)
			passports.POST("/:id/verify", middleware.RequireAuth(), middleware.RequireRole(models.RoleAdmin), passportHandler.VerifyPassport)
		}

		// Craft Journey (Making process storytelling)
		journey := api.Group("/journey")
		{
			journey.GET("/:productId", journeyHandler.GetJourney)
			journey.POST("", middleware.RequireAuth(), middleware.RequireRole(models.RoleArtisan), journeyHandler.AddJourneyItem)
		}

		// CreateConnect: Design & Commission
		custom := api.Group("/custom-requests")
		{
			custom.GET("", customHandler.GetCustomRequests)
			custom.GET("/:id", customHandler.GetCustomRequestByID)
			custom.POST("", middleware.RequireAuth(), customHandler.CreateCustomRequest)
			custom.POST("/:id/proposals", middleware.RequireAuth(), middleware.RequireRole(models.RoleArtisan), customHandler.CreateProposal)
			custom.POST("/:id/accept", middleware.RequireAuth(), customHandler.AcceptProposal)
			custom.PUT("/:id/status", middleware.RequireAuth(), middleware.RequireRole(models.RoleArtisan), customHandler.UpdateMilestone)
		}

		// Orders & Fulfillment
		orders := api.Group("/orders")
		{
			orders.POST("", middleware.RequireAuth(), orderHandler.CreateOrder)
			orders.GET("/my-orders", middleware.RequireAuth(), orderHandler.GetMyOrders)
			orders.GET("/:id", middleware.RequireAuth(), orderHandler.GetOrder)
			orders.PUT("/:id/status", middleware.RequireAuth(), orderHandler.UpdateOrderStatus)
		}

		// Payments (Razorpay Test Mode & Mock Checkout)
		payments := api.Group("/payments")
		{
			payments.POST("/create-order", paymentHandler.CreatePaymentOrder)
			payments.POST("/verify", paymentHandler.VerifyPayment)
		}

		// AI Services (Kala Mitra, Pricing Guidance, Buyer Assistant)
		ai := api.Group("/ai")
		{
			ai.POST("/extract-listing", aiHandler.ExtractListing)
			ai.POST("/pricing-guidance", aiHandler.PricingGuidance)
			ai.POST("/buyer-assistant", aiHandler.BuyerAssistant)
		}

		// Admin Moderation & Metrics
		admin := api.Group("/admin")
		admin.Use(middleware.RequireAuth(), middleware.RequireRole(models.RoleAdmin))
		{
			admin.GET("/metrics", adminHandler.GetMetrics)
			admin.GET("/audit-logs", adminHandler.GetAuditLogs)
			admin.GET("/passports/pending", adminHandler.GetPendingPassports)
			admin.GET("/users", adminHandler.GetUsers)
		}

		// File Uploads
		api.POST("/uploads", uploadHandler.UploadFile)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Kala Vaibhav Go API server on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
