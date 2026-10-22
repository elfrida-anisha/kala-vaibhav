package main

import (
	"os"
	"testing"

	"kala-vaibhav/internal/handlers"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

func TestStoreInitializationAndSeed(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "kala_test_*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	store, err := storage.NewStore(tempDir)
	if err != nil {
		t.Fatalf("Failed to initialize store: %v", err)
	}

	// Verify seed data
	products := store.GetProducts("", "", 0, 0, "newest", "")
	if len(products) < 3 {
		t.Errorf("Expected at least 3 seeded products, got %d", len(products))
	}

	// Verify users
	artisan, err := store.GetUserByEmail("sunita.devi@kalavaibhav.demo")
	if err != nil || artisan.Role != models.RoleArtisan {
		t.Errorf("Expected Sunita Devi artisan profile, got error: %v", err)
	}

	// Verify Craft Passports
	passport, err := store.GetPassportByProductID(products[0].ID)
	if err != nil {
		t.Errorf("Expected passport for product %s, got error: %v", products[0].ID, err)
	}
	if passport.ProvenanceStatus == "" {
		t.Errorf("Passport has empty provenance status")
	}
}

func TestProductFiltering(t *testing.T) {
	tempDir, _ := os.MkdirTemp("", "kala_test_*")
	defer os.RemoveAll(tempDir)
	store, _ := storage.NewStore(tempDir)

	// Filter by Category
	textiles := store.GetProducts("Textiles & Embroidery", "", 0, 0, "newest", "")
	for _, p := range textiles {
		if p.Category != "Textiles & Embroidery" && p.CraftType != "Textiles & Embroidery" {
			t.Errorf("Unexpected product in textiles filter: %s", p.Category)
		}
	}

	// Search by keyword
	kasutiResults := store.GetProducts("", "Kasuti", 0, 0, "newest", "")
	if len(kasutiResults) == 0 {
		t.Errorf("Expected search results for 'Kasuti'")
	}
}

func TestKalaMitraVoiceListingExtraction(t *testing.T) {
	tempDir, _ := os.MkdirTemp("", "kala_test_*")
	defer os.RemoveAll(tempDir)
	store, _ := storage.NewStore(tempDir)
	aiHandler := handlers.NewAIHandler(store)

	transcript := "This is a handmade Kasuti bag. The price is 800 rupees. It took me three days to make."
	extracted := aiHandler.RuleBasedExtraction(transcript)

	if extracted.Price != 800 {
		t.Errorf("Expected extracted price 800, got %f", extracted.Price)
	}
	if extracted.CraftType != "Kasuti Embroidery" {
		t.Errorf("Expected Kasuti Embroidery, got %s", extracted.CraftType)
	}
	if extracted.TimeToMake != "3 days" {
		t.Errorf("Expected 3 days, got %s", extracted.TimeToMake)
	}
	if extracted.Status != "awaiting_confirmation" {
		t.Errorf("Expected awaiting_confirmation status, got %s", extracted.Status)
	}
}

func TestOrderCreationWithServerPricing(t *testing.T) {
	tempDir, _ := os.MkdirTemp("", "kala_test_*")
	defer os.RemoveAll(tempDir)
	store, _ := storage.NewStore(tempDir)

	products := store.GetProducts("", "", 0, 0, "newest", "")
	targetProd := products[0]
	initialStock := targetProd.StockQuantity

	order := &models.Order{
		BuyerID: "44444444-4444-4444-4444-444444444444",
		Items: []models.OrderItem{
			{
				ProductID: &targetProd.ID,
				Quantity:  1,
				UnitPrice: 1.0, // Attempt client price manipulation
			},
		},
		ShippingAddress: models.ShippingAddress{
			FullName:     "Anamika Sharma",
			AddressLine1: "14B Heritage Palms",
			City:         "Bengaluru",
			State:        "Karnataka",
			PostalCode:   "560034",
		},
	}

	err := store.CreateOrder(order)
	if err != nil {
		t.Fatalf("Failed to create order: %v", err)
	}

	// Verify server enforced product price instead of manipulated 1.0
	if order.TotalAmount != targetProd.Price {
		t.Errorf("Expected server to enforce true price %f, but got %f", targetProd.Price, order.TotalAmount)
	}

	// Verify stock decremented
	updatedProd, _ := store.GetProductByID(targetProd.ID)
	if updatedProd.StockQuantity != initialStock-1 {
		t.Errorf("Expected stock to decrement from %d to %d, got %d", initialStock, initialStock-1, updatedProd.StockQuantity)
	}
}
