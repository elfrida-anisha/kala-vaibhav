package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"kala-vaibhav/internal/models"
	"kala-vaibhav/internal/storage"
)

type AIHandler struct {
	store      *storage.Store
	ollamaHost string
}

func NewAIHandler(store *storage.Store) *AIHandler {
	host := os.Getenv("OLLAMA_HOST")
	if host == "" {
		host = "http://localhost:11434"
	}
	return &AIHandler{
		store:      store,
		ollamaHost: host,
	}
}

// ExtractListing is Kala Mitra's Voice-to-Listing signature engine
func (h *AIHandler) ExtractListing(c *gin.Context) {
	var req models.VoiceListingExtractRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Transcript is required for voice-to-listing extraction."})
		return
	}

	transcript := strings.TrimSpace(req.Transcript)
	if transcript == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Transcript cannot be empty."})
		return
	}

	// First try Ollama if available
	extracted, err := h.tryOllamaExtraction(transcript)
	if err != nil || extracted == nil {
		// Use deterministic, robust NLP extraction fallback
		extracted = h.RuleBasedExtraction(transcript)
	}

	c.JSON(http.StatusOK, gin.H{
		"transcript": transcript,
		"extracted":  extracted,
		"engine":     "kala_mitra_hybrid_v1",
	})
}

// RuleBasedExtraction is a deterministic NLP parser that extracts structured fields from artisan spoken sentences
func (h *AIHandler) RuleBasedExtraction(text string) *models.ExtractedProductDetails {
	lower := strings.ToLower(text)

	// Defaults
	productName := "Handcrafted Artisan Item"
	craftType := "Traditional Craft"
	category := "Crafts & Living"
	var price float64 = 500.0
	var materials *string = nil
	timeToMake := "2-3 days"
	stockQuantity := 1

	// 1. Detect Craft and Category
	if strings.Contains(lower, "kasuti") || strings.Contains(lower, "embroidery") || strings.Contains(lower, "needle") {
		craftType = "Kasuti Embroidery"
		category = "Textiles & Embroidery"
		if strings.Contains(lower, "bag") || strings.Contains(lower, "tote") {
			productName = "Handmade Kasuti Embroidery Bag"
		} else if strings.Contains(lower, "sari") || strings.Contains(lower, "saree") {
			productName = "Kasuti Handloom Saree"
		} else if strings.Contains(lower, "dupatta") {
			productName = "Kasuti Temple Border Dupatta"
		} else {
			productName = "Handmade Kasuti Craft Item"
		}
	} else if strings.Contains(lower, "pottery") || strings.Contains(lower, "blue pottery") || strings.Contains(lower, "ceramic") || strings.Contains(lower, "vase") {
		craftType = "Blue Pottery"
		category = "Pottery & Ceramics"
		if strings.Contains(lower, "vase") {
			productName = "Handcrafted Blue Pottery Ceramic Vase"
		} else if strings.Contains(lower, "plate") {
			productName = "Blue Pottery Decorative Plate"
		} else {
			productName = "Jaipur Blue Pottery Glazed Ware"
		}
	} else if strings.Contains(lower, "channapatna") || strings.Contains(lower, "toy") || strings.Contains(lower, "wood") || strings.Contains(lower, "lacquer") {
		craftType = "Channapatna Lacquerware"
		category = "Toys & Living"
		if strings.Contains(lower, "toy") || strings.Contains(lower, "rings") {
			productName = "Hand-turned Wooden Lacquer Toy"
		} else {
			productName = "Channapatna Wooden Handcraft"
		}
	} else if strings.Contains(lower, "dhokra") || strings.Contains(lower, "brass") || strings.Contains(lower, "metal") {
		craftType = "Dhokra Metalcraft"
		category = "Metalcraft & Brass"
		productName = "Lost-wax Cast Dhokra Figurine"
	} else if strings.Contains(lower, "pattachitra") || strings.Contains(lower, "painting") || strings.Contains(lower, "art") {
		craftType = "Pattachitra Painting"
		category = "Paintings & Folk Art"
		productName = "Traditional Pattachitra Folk Art"
	}

	// 2. Extract Price (Look for ₹, rupees, rs, or numeric amount)
	priceRegex := regexp.MustCompile(`(?i)(?:price\s+is|costs?|rs\.?|inr|rupees?|₹)\s*(\d+(?:,\d+)*(?:\.\d+)?)`)
	if match := priceRegex.FindStringSubmatch(text); len(match) > 1 {
		cleanNum := strings.ReplaceAll(match[1], ",", "")
		if p, err := strconv.ParseFloat(cleanNum, 64); err == nil {
			price = p
		}
	} else {
		// Fallback: look for any freestanding 3 or 4 digit numbers
		numRegex := regexp.MustCompile(`\b(\d{2,5})\b`)
		if matches := numRegex.FindAllStringSubmatch(text, -1); len(matches) > 0 {
			cleanNum := matches[0][1]
			if p, err := strconv.ParseFloat(cleanNum, 64); err == nil && p >= 50 {
				price = p
			}
		}
	}

	// 3. Extract Time to Make (e.g. "three days", "3 days", "2 weeks", "4 hours")
	timeRegex := regexp.MustCompile(`(?i)(?:took\s+(?:me\s+)?|takes\s+|made\s+in\s+)(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*(days?|weeks?|hours?|months?)`)
	if match := timeRegex.FindStringSubmatch(text); len(match) > 2 {
		numStr := match[1]
		wordToNum := map[string]string{
			"one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
			"six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
		}
		if n, ok := wordToNum[strings.ToLower(numStr)]; ok {
			numStr = n
		}
		timeToMake = fmt.Sprintf("%s %s", numStr, match[2])
	} else if strings.Contains(lower, "three days") {
		timeToMake = "3 days"
	} else if strings.Contains(lower, "two days") {
		timeToMake = "2 days"
	} else if strings.Contains(lower, "one week") || strings.Contains(lower, "a week") {
		timeToMake = "7 days"
	}

	// 4. Extract Materials if mentioned
	if strings.Contains(lower, "silk") {
		mat := "Pure Silk, Cotton thread"
		materials = &mat
	} else if strings.Contains(lower, "cotton") {
		mat := "Pure Handloom Cotton"
		materials = &mat
	} else if strings.Contains(lower, "wood") || strings.Contains(lower, "hale") {
		mat := "Natural seasoned Hale Wood, Non-toxic Lacquer"
		materials = &mat
	} else if strings.Contains(lower, "quartz") || strings.Contains(lower, "clay") {
		mat := "Crushed Quartz, Katira Gum, Natural Mineral Oxides"
		materials = &mat
	}

	// 5. Build friendly artisan clarification and questions
	clarification := fmt.Sprintf("Your %s is priced at ₹%.0f, and took %s to make. Is this correct?", productName, price, timeToMake)

	var missingQuestions []string
	if materials == nil {
		missingQuestions = append(missingQuestions, "Would you like to specify the natural materials used (e.g. Pure Silk, Clay, Teak Wood)?")
	}

	return &models.ExtractedProductDetails{
		ProductName:      productName,
		CraftType:        craftType,
		Category:         category,
		Price:            price,
		Currency:         "INR",
		Materials:        materials,
		TimeToMake:       timeToMake,
		Description:      fmt.Sprintf("%s, lovingly handcrafted using authentic %s heritage techniques over %s.", productName, craftType, timeToMake),
		StockQuantity:    stockQuantity,
		ConfidenceScore:  0.94,
		Status:           "awaiting_confirmation",
		MissingQuestions: missingQuestions,
		Clarification:    clarification,
	}
}

// tryOllamaExtraction calls local Ollama if running
func (h *AIHandler) tryOllamaExtraction(transcript string) (*models.ExtractedProductDetails, error) {
	prompt := fmt.Sprintf(`You are Kala Mitra, an AI assistant for traditional Indian artisans.
Extract product details from this spoken sentence: "%s"
Respond strictly with a valid JSON object matching this schema:
{
  "productName": "string",
  "craftType": "string",
  "category": "string",
  "price": number,
  "currency": "INR",
  "materials": "string or null",
  "timeToMake": "string",
  "description": "string",
  "stockQuantity": number
}
Do not include any Markdown ticks or comments. Output JSON only.`, transcript)

	payload := map[string]interface{}{
		"model":  "llama3.2",
		"prompt": prompt,
		"stream": false,
		"format": "json",
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	client := http.Client{Timeout: 3 * time.Second}
	resp, err := client.Post(h.ollamaHost+"/api/generate", "application/json", bytes.NewReader(data))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ollama status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var ollamaResp struct {
		Response string `json:"response"`
	}
	if err := json.Unmarshal(body, &ollamaResp); err != nil {
		return nil, err
	}

	var extracted models.ExtractedProductDetails
	if err := json.Unmarshal([]byte(ollamaResp.Response), &extracted); err != nil {
		return nil, err
	}

	extracted.ConfidenceScore = 0.98
	extracted.Status = "awaiting_confirmation"
	extracted.Clarification = fmt.Sprintf("Your %s is priced at ₹%.0f, and took %s to make. Is this correct?", extracted.ProductName, extracted.Price, extracted.TimeToMake)

	return &extracted, nil
}

// PricingGuidance calculates transparent fair-trade price recommendations for artisans
func (h *AIHandler) PricingGuidance(c *gin.Context) {
	var req models.PricingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pricing parameters: " + err.Error()})
		return
	}

	// Fallback sensible rates if not provided
	if req.HourlyRate <= 0 {
		req.HourlyRate = 120.0 // ₹120/hr standard dignified artisan wage
	}
	if req.PackagingCost <= 0 {
		req.PackagingCost = 60.0 // standard eco-friendly packaging
	}

	labourCost := req.LabourHours * req.HourlyRate
	baseProductionCost := req.MaterialCost + labourCost + req.OverheadsCost + req.PackagingCost

	// Fair margin calculation based on complexity
	var marginMultiplier float64 = 0.25 // 25% fair trade margin
	switch req.ComplexityTier {
	case "masterpiece":
		marginMultiplier = 0.40 // 40% margin for rare master heritage crafts
	case "moderate":
		marginMultiplier = 0.30
	default:
		marginMultiplier = 0.20
	}

	fairArtisanMargin := baseProductionCost * marginMultiplier
	recommendedFairPrice := baseProductionCost + fairArtisanMargin
	recommendedMinPrice := baseProductionCost + (baseProductionCost * 0.12)
	recommendedMaxPrice := baseProductionCost + (baseProductionCost * (marginMultiplier + 0.15))

	notes := fmt.Sprintf(
		"Based on %.1f hours of skilled labour at ₹%.0f/hr and ₹%.0f in materials, your fair price is ₹%.0f. You maintain 100%% control over the final marketplace price.",
		req.LabourHours, req.HourlyRate, req.MaterialCost, recommendedFairPrice,
	)

	breakdown := models.PricingBreakdown{
		MaterialCost:        req.MaterialCost,
		LabourCost:          labourCost,
		OverheadsCost:       req.OverheadsCost,
		PackagingCost:       req.PackagingCost,
		BaseProductionCost:  baseProductionCost,
		FairArtisanMargin:   fairArtisanMargin,
		RecommendedMinPrice: recommendedMinPrice,
		RecommendedFairPrice: recommendedFairPrice,
		RecommendedMaxPrice: recommendedMaxPrice,
		GuidanceNotes:       notes,
	}

	c.JSON(http.StatusOK, gin.H{
		"pricing": breakdown,
	})
}

// BuyerAssistant provides helpful answers, technique explanations, and real catalogue recommendations
func (h *AIHandler) BuyerAssistant(c *gin.Context) {
	type BuyerAssistantRequest struct {
		Message string `json:"message" binding:"required"`
	}
	var req BuyerAssistantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message is required"})
		return
	}

	query := strings.ToLower(req.Message)
	var answer string
	var suggestions []*models.Product

	// Craft knowledge matching
	if strings.Contains(query, "channapatna") || strings.Contains(query, "toy") || strings.Contains(query, "safe") || strings.Contains(query, "child") {
		answer = "Channapatna toys are renowned for being 100% natural and child-safe. Hand-turned from seasoned Hale wood (Wrightia tinctoria), their brilliant colors come exclusively from natural vegetable dyes like turmeric, indigo, and katha, finished with tree lacquer polished by screw pine leaf."
		suggestions = h.store.GetProducts("Toys & Living", "Channapatna", 0, 0, "newest", "")
	} else if strings.Contains(query, "kasuti") || strings.Contains(query, "embroidery") || strings.Contains(query, "karnataka") {
		answer = "Kasuti is an ancient counted-thread needlecraft dating back to Karnataka's Chalukya dynasty. Master artisans count each warp and weft thread by hand without tracing, creating intricate temple gopurams and peacocks using Gavanti and Muragi stitches that look identical on both front and back."
		suggestions = h.store.GetProducts("Textiles & Embroidery", "Kasuti", 0, 0, "newest", "")
	} else if strings.Contains(query, "blue pottery") || strings.Contains(query, "jaipur") || strings.Contains(query, "ceramic") {
		answer = "Jaipur Blue Pottery is unique because it uses zero clay! Instead, it is molded from crushed quartz stone powder, Fuller's earth, and natural gum, hand-painted with cobalt oxide, and fired once in traditional wood kilns to achieve its translucent glaze."
		suggestions = h.store.GetProducts("Pottery & Ceramics", "Blue Pottery", 0, 0, "newest", "")
	} else if strings.Contains(query, "custom") || strings.Contains(query, "commission") || strings.Contains(query, "order") {
		answer = "You can commission unique custom heirlooms directly with master artisans through our 'CreateConnect' feature! Simply upload an inspiration photo, set your budget range, and master artisans will send you bespoke proposals with timelines and transparent pricing."
	} else if strings.Contains(query, "passport") || strings.Contains(query, "provenance") || strings.Contains(query, "authentic") {
		answer = "Every piece on Kala Vaibhav has a Digital Craft Passport certifying its origin, artisan lineage, verified materials, and GI tag affiliation, ensuring you receive authentic heritage craftsmanship."
	} else {
		answer = "Namaste! I am Kala Saathi, your craft guide. I can tell you about traditional GI-certified crafts like Kasuti embroidery, Channapatna wooden toys, and Jaipur Blue Pottery, or help you find authentic handcrafted products."
		suggestions = h.store.GetProducts("", "", 0, 0, "newest", "")
		if len(suggestions) > 2 {
			suggestions = suggestions[:2]
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"response":    answer,
		"suggestions": suggestions,
	})
}
