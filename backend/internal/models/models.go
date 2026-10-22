package models

import "time"

// User Roles
const (
	RoleArtisan = "artisan"
	RoleBuyer   = "buyer"
	RoleAdmin   = "admin"
)

// Provenance statuses
const (
	ProvenanceArtisanDeclared    = "artisan-declared"
	ProvenanceCommunityReviewed  = "community-reviewed"
	ProvenanceIndependentlyVerified = "independently-verified"
)

// Product statuses
const (
	ProductStatusDraft      = "draft"
	ProductStatusActive     = "active"
	ProductStatusOutOfStock = "out_of_stock"
	ProductStatusArchived   = "archived"
)

// Custom Request statuses
const (
	CustomRequestSubmitted       = "submitted"
	CustomRequestReviewing       = "reviewing"
	CustomRequestProposalReceived = "proposal_received"
	CustomRequestAccepted        = "accepted"
	CustomRequestInProduction    = "in_production"
	CustomRequestReadyToShip     = "ready_to_ship"
	CustomRequestShipped         = "shipped"
	CustomRequestDelivered       = "delivered"
	CustomRequestCancelled       = "cancelled"
)

// Order statuses
const (
	OrderStatusPending      = "pending"
	OrderStatusPaid         = "paid"
	OrderStatusInProduction = "in_production"
	OrderStatusShipped      = "shipped"
	OrderStatusDelivered    = "delivered"
	OrderStatusCancelled    = "cancelled"
)

// User represents a platform user (Artisan, Buyer, Admin)
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	FullName  string    `json:"fullName"`
	Role      string    `json:"role"`
	Phone     string    `json:"phone,omitempty"`
	AvatarURL string    `json:"avatarUrl,omitempty"`
	Bio       string    `json:"bio,omitempty"`
	Region    string    `json:"region,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ArtisanProfile holds specific details for artisans
type ArtisanProfile struct {
	ID                 string    `json:"id"`
	ProfileID          string    `json:"profileId"`
	CraftSpecialty     string    `json:"craftSpecialty"`
	ExperienceYears    int       `json:"experienceYears"`
	StudioAddress      string    `json:"studioAddress,omitempty"`
	State              string    `json:"state"`
	VerificationStatus string    `json:"verificationStatus"`
	VerificationNotes  string    `json:"verificationNotes,omitempty"`
	PhonePublic        bool      `json:"phonePublic"`
	GITagAffiliated    bool      `json:"giTagAffiliated"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
}

// ProductImage
type ProductImage struct {
	ID           string    `json:"id"`
	ProductID    string    `json:"productId"`
	ImageURL     string    `json:"imageUrl"`
	IsPrimary    bool      `json:"isPrimary"`
	DisplayOrder int       `json:"displayOrder"`
	CreatedAt    time.Time `json:"createdAt"`
}

// Product
type Product struct {
	ID            string         `json:"id"`
	ArtisanID     string         `json:"artisanId"`
	ArtisanName   string         `json:"artisanName,omitempty"`
	ArtisanRegion string         `json:"artisanRegion,omitempty"`
	ArtisanAvatar string         `json:"artisanAvatar,omitempty"`
	Title         string         `json:"title"`
	CraftType     string         `json:"craftType"`
	Category      string         `json:"category"`
	Description   string         `json:"description"`
	Price         float64        `json:"price"`
	Currency      string         `json:"currency"`
	Materials     string         `json:"materials,omitempty"`
	TimeToMake    string         `json:"timeToMake,omitempty"`
	StockQuantity int            `json:"stockQuantity"`
	Status        string         `json:"status"`
	Region        string         `json:"region,omitempty"`
	Images        []ProductImage `json:"images,omitempty"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
}

// CraftPassport represents provenance certification
type CraftPassport struct {
	ID                  string                 `json:"id"`
	ProductID           string                 `json:"productId"`
	PassportNumber      string                 `json:"passportNumber"`
	ArtisanID           string                 `json:"artisanId"`
	ArtisanName         string                 `json:"artisanName,omitempty"`
	CraftName           string                 `json:"craftName"`
	Region              string                 `json:"region"`
	Materials           string                 `json:"materials"`
	Techniques          string                 `json:"techniques"`
	TimeAndEffort       string                 `json:"timeAndEffort"`
	CulturalStory       string                 `json:"culturalStory"`
	ProvenanceStatus    string                 `json:"provenanceStatus"`
	VerificationDetails map[string]interface{} `json:"verificationDetails,omitempty"`
	CreatedAt           time.Time              `json:"createdAt"`
	UpdatedAt           time.Time              `json:"updatedAt"`
}

// CraftJourneyItem represents a step in making a product
type CraftJourneyItem struct {
	ID            string    `json:"id"`
	ProductID     string    `json:"productId"`
	ArtisanID     string    `json:"artisanId"`
	Title         string    `json:"title"`
	Description   string    `json:"description,omitempty"`
	MediaURL      string    `json:"mediaUrl"`
	MediaType     string    `json:"mediaType"` // "image" or "video"
	StepOrder     int       `json:"stepOrder"`
	MilestoneDate string    `json:"milestoneDate,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
}

// CustomRequest for CreateConnect design commissions
type CustomRequest struct {
	ID                string                 `json:"id"`
	BuyerID           string                 `json:"buyerId"`
	BuyerName         string                 `json:"buyerName,omitempty"`
	Title             string                 `json:"title"`
	Description       string                 `json:"description"`
	CraftType         string                 `json:"craftType"`
	Preferences       map[string]interface{} `json:"preferences,omitempty"`
	ReferenceImageURL string                 `json:"referenceImageUrl,omitempty"`
	IsPrivate         bool                   `json:"isPrivate"`
	BudgetMin         float64                `json:"budgetMin"`
	BudgetMax         float64                `json:"budgetMax"`
	DesiredDate       string                 `json:"desiredDate,omitempty"`
	Status            string                 `json:"status"`
	ProposalsCount    int                    `json:"proposalsCount,omitempty"`
	Proposals         []CommissionProposal   `json:"proposals,omitempty"`
	CreatedAt         time.Time              `json:"createdAt"`
	UpdatedAt         time.Time              `json:"updatedAt"`
}

// CommissionProposal
type CommissionProposal struct {
	ID              string    `json:"id"`
	CustomRequestID string    `json:"customRequestId"`
	ArtisanID       string    `json:"artisanId"`
	ArtisanName     string    `json:"artisanName,omitempty"`
	ArtisanAvatar   string    `json:"artisanAvatar,omitempty"`
	ProposedPrice   float64   `json:"proposedPrice"`
	EstimatedDays   int       `json:"estimatedDays"`
	Message         string    `json:"message"`
	Status          string    `json:"status"` // "pending", "accepted", "rejected"
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// ShippingAddress
type ShippingAddress struct {
	FullName     string `json:"fullName"`
	Phone        string `json:"phone"`
	AddressLine1 string `json:"addressLine1"`
	AddressLine2 string `json:"addressLine2,omitempty"`
	City         string `json:"city"`
	State        string `json:"state"`
	PostalCode   string `json:"postalCode"`
}

// OrderItem
type OrderItem struct {
	ID              string   `json:"id"`
	OrderID         string   `json:"orderId"`
	ProductID       *string  `json:"productId,omitempty"`
	ProductTitle    string   `json:"productTitle,omitempty"`
	ProductImage    string   `json:"productImage,omitempty"`
	CustomRequestID *string  `json:"customRequestId,omitempty"`
	Quantity        int      `json:"quantity"`
	UnitPrice       float64  `json:"unitPrice"`
	CreatedAt       time.Time `json:"createdAt"`
}

// Order
type Order struct {
	ID              string          `json:"id"`
	OrderNumber     string          `json:"orderNumber"`
	BuyerID         string          `json:"buyerId"`
	BuyerName       string          `json:"buyerName,omitempty"`
	TotalAmount     float64         `json:"totalAmount"`
	Currency        string          `json:"currency"`
	Status          string          `json:"status"`
	ShippingAddress ShippingAddress `json:"shippingAddress"`
	IsDemo          bool            `json:"isDemo"`
	Items           []OrderItem     `json:"items"`
	PaymentID       string          `json:"paymentId,omitempty"`
	CreatedAt       time.Time       `json:"createdAt"`
	UpdatedAt       time.Time       `json:"updatedAt"`
}

// Payment
type Payment struct {
	ID                string    `json:"id"`
	OrderID           string    `json:"orderId"`
	RazorpayOrderID   string    `json:"razorpayOrderId,omitempty"`
	RazorpayPaymentID string    `json:"razorpayPaymentId,omitempty"`
	RazorpaySignature string    `json:"razorpaySignature,omitempty"`
	Amount            float64   `json:"amount"`
	Currency          string    `json:"currency"`
	Status            string    `json:"status"`
	IsMock            bool      `json:"isMock"`
	CreatedAt         time.Time `json:"createdAt"`
}

// Kala Mitra Voice-to-Listing structs
type VoiceListingExtractRequest struct {
	Transcript string `json:"transcript" binding:"required"`
	Language   string `json:"language,omitempty"`
}

type ExtractedProductDetails struct {
	ProductName      string   `json:"productName"`
	CraftType        string   `json:"craftType"`
	Category         string   `json:"category"`
	Price            float64  `json:"price"`
	Currency         string   `json:"currency"`
	Materials        *string  `json:"materials"`
	TimeToMake       string   `json:"timeToMake"`
	Description      string   `json:"description"`
	StockQuantity    int      `json:"stockQuantity"`
	ConfidenceScore  float64  `json:"confidenceScore"`
	Status           string   `json:"status"`
	MissingQuestions []string `json:"missingQuestions,omitempty"`
	Clarification    string   `json:"clarification,omitempty"`
}

// Pricing Assistance structs
type PricingRequest struct {
	CraftType      string  `json:"craftType"`
	MaterialCost   float64 `json:"materialCost"`
	LabourHours    float64 `json:"labourHours"`
	HourlyRate     float64 `json:"hourlyRate"`
	OverheadsCost  float64 `json:"overheadsCost"`
	PackagingCost  float64 `json:"packagingCost"`
	ComplexityTier string  `json:"complexityTier"` // "simple", "moderate", "masterpiece"
}

type PricingBreakdown struct {
	MaterialCost        float64 `json:"materialCost"`
	LabourCost          float64 `json:"labourCost"`
	OverheadsCost       float64 `json:"overheadsCost"`
	PackagingCost       float64 `json:"packagingCost"`
	BaseProductionCost  float64 `json:"baseProductionCost"`
	FairArtisanMargin   float64 `json:"fairArtisanMargin"`
	RecommendedMinPrice float64 `json:"recommendedMinPrice"`
	RecommendedFairPrice float64 `json:"recommendedFairPrice"`
	RecommendedMaxPrice float64 `json:"recommendedMaxPrice"`
	GuidanceNotes       string  `json:"guidanceNotes"`
}

// Admin Metrics
type AdminMetrics struct {
	TotalArtisans      int     `json:"totalArtisans"`
	TotalBuyers        int     `json:"totalBuyers"`
	TotalProducts      int     `json:"totalProducts"`
	TotalOrders        int     `json:"totalOrders"`
	TotalVolumeINR     float64 `json:"totalVolumeINR"`
	CustomRequestsCount int    `json:"customRequestsCount"`
	PendingPassports   int     `json:"pendingPassports"`
}

// AuditLog
type AuditLog struct {
	ID         string                 `json:"id"`
	ActorID    string                 `json:"actorId"`
	ActorName  string                 `json:"actorName,omitempty"`
	Action     string                 `json:"action"`
	TargetType string                 `json:"targetType"`
	TargetID   string                 `json:"targetId"`
	Details    map[string]interface{} `json:"details,omitempty"`
	CreatedAt  time.Time              `json:"createdAt"`
}

// VerificationReview
type VerificationReview struct {
	ID             string    `json:"id"`
	PassportID     string    `json:"passportId"`
	ReviewerID     string    `json:"reviewerId"`
	PreviousStatus string    `json:"previousStatus"`
	NewStatus      string    `json:"newStatus"`
	Notes          string    `json:"notes"`
	CreatedAt      time.Time `json:"createdAt"`
}
