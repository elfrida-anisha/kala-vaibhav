package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/middleware"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type ProductHandler struct {
	store *storage.Store
}

func NewProductHandler(store *storage.Store) *ProductHandler {
	return &ProductHandler{store: store}
}

// GetProducts returns filtered list of products
func (h *ProductHandler) GetProducts(c *gin.Context) {
	category := c.Query("category")
	search := c.Query("search")
	sortOrder := c.Query("sort")
	artisanID := c.Query("artisanId")

	var minPrice, maxPrice float64
	if minStr := c.Query("minPrice"); minStr != "" {
		minPrice, _ = strconv.ParseFloat(minStr, 64)
	}
	if maxStr := c.Query("maxPrice"); maxStr != "" {
		maxPrice, _ = strconv.ParseFloat(maxStr, 64)
	}

	products := h.store.GetProducts(category, search, minPrice, maxPrice, sortOrder, artisanID)
	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"count":    len(products),
	})
}

// GetProductByID returns single product with passport and journey items
func (h *ProductHandler) GetProductByID(c *gin.Context) {
	id := c.Param("id")
	p, err := h.store.GetProductByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Fetch linked passport and journey items
	passport, _ := h.store.GetPassportByProductID(id)
	journeyItems := h.store.GetJourneyItems(id)

	c.JSON(http.StatusOK, gin.H{
		"product":      p,
		"passport":     passport,
		"journeyItems": journeyItems,
	})
}

type CreateProductRequest struct {
	Title         string   `json:"title" binding:"required"`
	CraftType     string   `json:"craftType" binding:"required"`
	Category      string   `json:"category" binding:"required"`
	Description   string   `json:"description" binding:"required"`
	Price         float64  `json:"price" binding:"required,gt=0"`
	Materials     string   `json:"materials"`
	TimeToMake    string   `json:"timeToMake"`
	StockQuantity int      `json:"stockQuantity" binding:"gte=1"`
	Region        string   `json:"region"`
	ImageURLs     []string `json:"imageUrls"`
}

// CreateProduct creates a new artisan product
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	if user == nil || user.Role != models.RoleArtisan {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only artisans can create product listings."})
		return
	}

	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product input: " + err.Error()})
		return
	}

	region := req.Region
	if region == "" {
		region = user.Region
	}

	p := &models.Product{
		ArtisanID:     user.ID,
		ArtisanName:   user.FullName,
		ArtisanRegion: user.Region,
		ArtisanAvatar: user.AvatarURL,
		Title:         req.Title,
		CraftType:     req.CraftType,
		Category:      req.Category,
		Description:   req.Description,
		Price:         req.Price,
		Currency:      "INR",
		Materials:     req.Materials,
		TimeToMake:    req.TimeToMake,
		StockQuantity: req.StockQuantity,
		Status:        models.ProductStatusActive,
		Region:        region,
	}

	// Attach image objects
	for i, url := range req.ImageURLs {
		p.Images = append(p.Images, models.ProductImage{
			ID:           strconv.Itoa(i + 1),
			ProductID:    p.ID,
			ImageURL:     url,
			IsPrimary:    i == 0,
			DisplayOrder: i + 1,
		})
	}

	// Fallback image if none provided
	if len(p.Images) == 0 {
		p.Images = append(p.Images, models.ProductImage{
			ID:           "default-img",
			ImageURL:     "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
			IsPrimary:    true,
			DisplayOrder: 1,
		})
	}

	if err := h.store.CreateProduct(p); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Product published successfully to Kala Vaibhav marketplace.",
		"product": p,
	})
}

// UpdateProduct updates product details
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	id := c.Param("id")

	existing, err := h.store.GetProductByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if user == nil || (existing.ArtisanID != user.ID && user.Role != models.RoleAdmin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to update this product"})
		return
	}

	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	existing.Title = req.Title
	existing.CraftType = req.CraftType
	existing.Category = req.Category
	existing.Description = req.Description
	existing.Price = req.Price
	existing.Materials = req.Materials
	existing.TimeToMake = req.TimeToMake
	existing.StockQuantity = req.StockQuantity
	if req.Region != "" {
		existing.Region = req.Region
	}

	if err := h.store.UpdateProduct(existing); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
		"product": existing,
	})
}

// DeleteProduct deletes or archives a product
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	user := middleware.GetCurrentUser(c)
	id := c.Param("id")

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	if err := h.store.DeleteProduct(id, user.ID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
