package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"kala-vaibhav/internal/models"
)

type Store struct {
	mu                  sync.RWMutex
	filePath            string
	Users               map[string]*models.User               `json:"users"`
	Artisans            map[string]*models.ArtisanProfile      `json:"artisans"`
	Products            map[string]*models.Product             `json:"products"`
	Passports           map[string]*models.CraftPassport       `json:"passports"`
	JourneyItems        map[string]*models.CraftJourneyItem    `json:"journeyItems"`
	CustomRequests      map[string]*models.CustomRequest       `json:"customRequests"`
	CommissionProposals map[string]*models.CommissionProposal  `json:"commissionProposals"`
	Orders              map[string]*models.Order               `json:"orders"`
	Payments            map[string]*models.Payment             `json:"payments"`
	AuditLogs           []*models.AuditLog                     `json:"auditLogs"`
	VerificationReviews []*models.VerificationReview           `json:"verificationReviews"`
}

func NewStore(dataDir string) (*Store, error) {
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, err
	}
	dataPath := filepath.Join(dataDir, "kala_data.json")

	s := &Store{
		filePath:            dataPath,
		Users:               make(map[string]*models.User),
		Artisans:            make(map[string]*models.ArtisanProfile),
		Products:            make(map[string]*models.Product),
		Passports:           make(map[string]*models.CraftPassport),
		JourneyItems:        make(map[string]*models.CraftJourneyItem),
		CustomRequests:      make(map[string]*models.CustomRequest),
		CommissionProposals: make(map[string]*models.CommissionProposal),
		Orders:              make(map[string]*models.Order),
		Payments:            make(map[string]*models.Payment),
		AuditLogs:           make([]*models.AuditLog, 0),
		VerificationReviews: make([]*models.VerificationReview, 0),
	}

	// Try loading from file
	if _, err := os.Stat(dataPath); err == nil {
		data, err := os.ReadFile(dataPath)
		if err == nil {
			if err := json.Unmarshal(data, s); err == nil {
				// Successfully loaded existing data
				return s, nil
			}
		}
	}

	// Otherwise, seed initial demo data
	s.SeedInitialData()
	_ = s.saveUnlocked()
	return s, nil
}

func (s *Store) Save() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.saveUnlocked()
}

func (s *Store) saveUnlocked() error {
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filePath, data, 0644)
}

// SeedInitialData loads culturally authentic demonstration artisans, crafts, journeys, passports
func (s *Store) SeedInitialData() {
	now := time.Now()

	// Users
	sunita := &models.User{
		ID:        "11111111-1111-1111-1111-111111111111",
		Email:     "sunita.devi@kalavaibhav.demo",
		FullName:  "Sunita Devi",
		Role:      models.RoleArtisan,
		Phone:     "+91 98450 12345",
		AvatarURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
		Bio:       "Master artisan in GI-tagged Kasuti embroidery from Dharwad, Karnataka. Practicing traditional geometric needlework for over 18 years.",
		Region:    "Dharwad, Karnataka",
		CreatedAt: now.Add(-30 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Users[sunita.ID] = sunita

	rameshwar := &models.User{
		ID:        "22222222-2222-2222-2222-222222222222",
		Email:     "rameshwar.soni@kalavaibhav.demo",
		FullName:  "Rameshwar Soni",
		Role:      models.RoleArtisan,
		Phone:     "+91 98290 67890",
		AvatarURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
		Bio:       "Third-generation Blue Pottery ceramist from Kot Jeweler, Jaipur. Preserving quartz stone and natural cobalt oxide glazing techniques.",
		Region:    "Jaipur, Rajasthan",
		CreatedAt: now.Add(-25 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Users[rameshwar.ID] = rameshwar

	manju := &models.User{
		ID:        "33333333-3333-3333-3333-333333333333",
		Email:     "manju.gowda@kalavaibhav.demo",
		FullName:  "Manju Gowda",
		Role:      models.RoleArtisan,
		Phone:     "+91 94480 34567",
		AvatarURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
		Bio:       "Dedicated turner and carver of Channapatna GI-certified lacquer toys using natural vegetable dyes and Hale wood.",
		Region:    "Channapatna, Karnataka",
		CreatedAt: now.Add(-20 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Users[manju.ID] = manju

	buyerAnamika := &models.User{
		ID:        "44444444-4444-4444-4444-444444444444",
		Email:     "anamika.buyer@kalavaibhav.demo",
		FullName:  "Anamika Sharma",
		Role:      models.RoleBuyer,
		Phone:     "+91 98110 55555",
		AvatarURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
		Bio:       "Architect & folk art collector passionate about handcrafted heirloom textiles and ethical living.",
		Region:    "Bengaluru, Karnataka",
		CreatedAt: now.Add(-15 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Users[buyerAnamika.ID] = buyerAnamika

	adminVikram := &models.User{
		ID:        "55555555-5555-5555-5555-555555555555",
		Email:     "curator.admin@kalavaibhav.demo",
		FullName:  "Vikramaditya Rao",
		Role:      models.RoleAdmin,
		Phone:     "+91 99000 99999",
		AvatarURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
		Bio:       "Platform Curator & Provenance Verification Officer at Kala Vaibhav.",
		Region:    "New Delhi",
		CreatedAt: now.Add(-40 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Users[adminVikram.ID] = adminVikram

	// Artisan Profiles
	s.Artisans[sunita.ID] = &models.ArtisanProfile{
		ID:                 "aa111111-1111-1111-1111-111111111111",
		ProfileID:          sunita.ID,
		CraftSpecialty:     "Kasuti Embroidery",
		ExperienceYears:    18,
		StudioAddress:      "Gokul Road, Dharwad",
		State:              "Karnataka",
		VerificationStatus: models.ProvenanceIndependentlyVerified,
		VerificationNotes:  "Karnataka Handloom Development Board certified master artisan. Verified on-site audit.",
		PhonePublic:        true,
		GITagAffiliated:    true,
		CreatedAt:          now.Add(-30 * 24 * time.Hour),
		UpdatedAt:          now,
	}

	s.Artisans[rameshwar.ID] = &models.ArtisanProfile{
		ID:                 "aa222222-2222-2222-2222-222222222222",
		ProfileID:          rameshwar.ID,
		CraftSpecialty:     "Jaipur Blue Pottery",
		ExperienceYears:    24,
		StudioAddress:      "Kukas Artisan Cluster, Jaipur",
		State:              "Rajasthan",
		VerificationStatus: models.ProvenanceIndependentlyVerified,
		VerificationNotes:  "National awardee heritage lineage; authentic lead-free quartz glaze audit.",
		PhonePublic:        true,
		GITagAffiliated:    true,
		CreatedAt:          now.Add(-25 * 24 * time.Hour),
		UpdatedAt:          now,
	}

	s.Artisans[manju.ID] = &models.ArtisanProfile{
		ID:                 "aa333333-3333-3333-3333-333333333333",
		ProfileID:          manju.ID,
		CraftSpecialty:     "Channapatna Lacquerware",
		ExperienceYears:    12,
		StudioAddress:      "Craft Complex, Channapatna",
		State:              "Karnataka",
		VerificationStatus: models.ProvenanceCommunityReviewed,
		VerificationNotes:  "Member of Karnataka Channapatna Crafts Guild; non-toxic natural dye certification.",
		PhonePublic:        true,
		GITagAffiliated:    true,
		CreatedAt:          now.Add(-20 * 24 * time.Hour),
		UpdatedAt:          now,
	}

	// Products
	prod1 := &models.Product{
		ID:            "p1010101-1010-1010-1010-101010101010",
		ArtisanID:     sunita.ID,
		ArtisanName:   sunita.FullName,
		ArtisanRegion: sunita.Region,
		ArtisanAvatar: sunita.AvatarURL,
		Title:         "Hand-Embroidered Kasuti Silk Tote Bag",
		CraftType:     "Kasuti Embroidery",
		Category:      "Textiles & Embroidery",
		Description:   "A heritage tote bag crafted in pure mulberry raw silk featuring intricate Gavanti (double running stitch) and Muragi (zigzag) motifs of temple towers (Gopuram) and sacred peacocks. No knot is visible on either side.",
		Price:         1450.00,
		Currency:      "INR",
		Materials:     "Pure Mulberry Silk, Hand-spun Cotton Thread",
		TimeToMake:    "5 days",
		StockQuantity: 6,
		Status:        models.ProductStatusActive,
		Region:        "Karnataka",
		Images: []models.ProductImage{
			{ID: "img1-1", ProductID: "p1010101-1010-1010-1010-101010101010", ImageURL: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80", IsPrimary: true, DisplayOrder: 1},
			{ID: "img1-2", ProductID: "p1010101-1010-1010-1010-101010101010", ImageURL: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80", IsPrimary: false, DisplayOrder: 2},
		},
		CreatedAt: now.Add(-10 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Products[prod1.ID] = prod1

	prod2 := &models.Product{
		ID:            "p2020202-2020-2020-2020-202020202020",
		ArtisanID:     rameshwar.ID,
		ArtisanName:   rameshwar.FullName,
		ArtisanRegion: rameshwar.Region,
		ArtisanAvatar: rameshwar.AvatarURL,
		Title:         "Handcrafted Cobalt Blue Quartz Vase",
		CraftType:     "Blue Pottery",
		Category:      "Pottery & Ceramics",
		Description:   "Traditional Jaipur Blue Pottery vase crafted from crushed quartz stone powder, Fuller's earth, and natural gum, adorned with royal Mughal botanical motifs painted by squirrel-hair brush in cobalt and turquoise.",
		Price:         2200.00,
		Currency:      "INR",
		Materials:     "Quartz Stone Powder, Glass, Katira Gum, Natural Cobalt Oxide",
		TimeToMake:    "7 days",
		StockQuantity: 4,
		Status:        models.ProductStatusActive,
		Region:        "Rajasthan",
		Images: []models.ProductImage{
			{ID: "img2-1", ProductID: "p2020202-2020-2020-2020-202020202020", ImageURL: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80", IsPrimary: true, DisplayOrder: 1},
			{ID: "img2-2", ProductID: "p2020202-2020-2020-2020-202020202020", ImageURL: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80", IsPrimary: false, DisplayOrder: 2},
		},
		CreatedAt: now.Add(-8 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Products[prod2.ID] = prod2

	prod3 := &models.Product{
		ID:            "p3030303-3030-3030-3030-303030303030",
		ArtisanID:     manju.ID,
		ArtisanName:   manju.FullName,
		ArtisanRegion: manju.Region,
		ArtisanAvatar: manju.AvatarURL,
		Title:         "GI-Certified Channapatna Wooden Stacking Rings",
		CraftType:     "Woodwork & Toys",
		Category:      "Toys & Living",
		Description:   "Safe, eco-friendly Montessori stacking toy hand-turned on traditional lathe from seasoned Wrightia tinctoria (Aale Mara) softwood. Lustrous finish achieved solely with natural tree lacquer and vegetable turmeric/indigo dyes.",
		Price:         780.00,
		Currency:      "INR",
		Materials:     "Seasoned Hale Wood, Natural Lac Resin, Turmeric, Indigo",
		TimeToMake:    "2 days",
		StockQuantity: 15,
		Status:        models.ProductStatusActive,
		Region:        "Karnataka",
		Images: []models.ProductImage{
			{ID: "img3-1", ProductID: "p3030303-3030-3030-3030-303030303030", ImageURL: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", IsPrimary: true, DisplayOrder: 1},
		},
		CreatedAt: now.Add(-6 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Products[prod3.ID] = prod3

	prod4 := &models.Product{
		ID:            "p4040404-4040-4040-4040-404040404040",
		ArtisanID:     sunita.ID,
		ArtisanName:   sunita.FullName,
		ArtisanRegion: sunita.Region,
		ArtisanAvatar: sunita.AvatarURL,
		Title:         "Kasuti Temple Border Handloom Dupatta",
		CraftType:     "Kasuti Embroidery",
		Category:      "Textiles & Embroidery",
		Description:   "Fine handwoven Chanderi cotton-silk dupatta adorned with traditional chariot (Ratha) and lotus (Kamala) Kasuti needlework on borders and pallu. Each geometric motif requires over 1,200 counted threads.",
		Price:         3600.00,
		Currency:      "INR",
		Materials:     "Chanderi Cotton-Silk, Resham Threads",
		TimeToMake:    "12 days",
		StockQuantity: 3,
		Status:        models.ProductStatusActive,
		Region:        "Karnataka",
		Images: []models.ProductImage{
			{ID: "img4-1", ProductID: "p4040404-4040-4040-4040-404040404040", ImageURL: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", IsPrimary: true, DisplayOrder: 1},
		},
		CreatedAt: now.Add(-5 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Products[prod4.ID] = prod4

	// Digital Craft Passports
	pass1 := &models.CraftPassport{
		ID:               "pass-1",
		ProductID:        prod1.ID,
		PassportNumber:   "KV-PASSPORT-KTK-2026-0041",
		ArtisanID:        sunita.ID,
		ArtisanName:      sunita.FullName,
		CraftName:        "Kasuti Needlecraft of Karnataka",
		Region:           "Dharwad, Karnataka (GI Registry 2006)",
		Materials:        "Pure Raw Silk, Organic dyed cotton thread",
		Techniques:       "Counted-thread embroidery with Gavanti, Muragi, Negi, and Menthi stitches without frame or tracings",
		TimeAndEffort:    "5 working days (approx 34 hours of fine hand-needlework)",
		CulturalStory:    "Kasuti has been practiced since the Chalukya dynasty (6th-12th century). Women traditionally stitched cradle covers and wedding saris with symbols of divine protection and sacred architecture.",
		ProvenanceStatus: models.ProvenanceIndependentlyVerified,
		VerificationDetails: map[string]interface{}{
			"verifiedBy":  "Karnataka Handloom Development Board Audit",
			"auditDate":   "2026-04-12",
			"giCertified": true,
		},
		CreatedAt: now.Add(-10 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Passports[prod1.ID] = pass1

	pass2 := &models.CraftPassport{
		ID:               "pass-2",
		ProductID:        prod2.ID,
		PassportNumber:   "KV-PASSPORT-RAJ-2026-0118",
		ArtisanID:        rameshwar.ID,
		ArtisanName:      rameshwar.FullName,
		CraftName:        "Jaipur Blue Pottery Glazed Ware",
		Region:           "Jaipur, Rajasthan (GI Registry 2008)",
		Materials:        "Ground quartz powder, cullet glass, katira gond, Multani mitti",
		Techniques:       "Low-fire ceramic casting without clay, manual hand-painting with mineral oxides, and lead-free quartz glazing",
		TimeAndEffort:    "7 days including curing, drying, detailing and 800°C kiln firing",
		CulturalStory:    "Brought to Jaipur under Sawai Ram Singh II in the 19th century, this unique pottery uses no clay and produces a characteristic translucent, semi-porcelain finish prized worldwide.",
		ProvenanceStatus: models.ProvenanceIndependentlyVerified,
		VerificationDetails: map[string]interface{}{
			"verifiedBy":  "Jaipur Handicrafts Association",
			"auditDate":   "2026-05-19",
			"giCertified": true,
		},
		CreatedAt: now.Add(-8 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Passports[prod2.ID] = pass2

	pass3 := &models.CraftPassport{
		ID:               "pass-3",
		ProductID:        prod3.ID,
		PassportNumber:   "KV-PASSPORT-KTK-2026-0205",
		ArtisanID:        manju.ID,
		ArtisanName:      manju.FullName,
		CraftName:        "Channapatna Ivory-Wood Lacquerware",
		Region:           "Channapatna (Gombegala Ooru), Karnataka",
		Materials:        "Wrightia tinctoria softwood, natural button lac, vegetable turmeric, indigo",
		Techniques:       "Hand lathe-turning, friction-burnishing with dry screw pine leaf (Talegari) for natural high gloss",
		TimeAndEffort:    "2 days handcrafting and seasoning",
		CulturalStory:    "Originating during Tipu Sultan's reign, who invited Persian artisans to train locals in lathe woodworking. Today it is celebrated globally as India's safest, non-toxic eco-toy heritage.",
		ProvenanceStatus: models.ProvenanceCommunityReviewed,
		VerificationDetails: map[string]interface{}{
			"reviewedBy":         "Channapatna Artisans Welfare Guild",
			"communityConsensus": "Authentic Hale Wood and Non-toxic Lacquer",
		},
		CreatedAt: now.Add(-6 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Passports[prod3.ID] = pass3

	pass4 := &models.CraftPassport{
		ID:               "pass-4",
		ProductID:        prod4.ID,
		PassportNumber:   "KV-PASSPORT-KTK-2026-0312",
		ArtisanID:        sunita.ID,
		ArtisanName:      sunita.FullName,
		CraftName:        "Kasuti Chanderi Temple Dupatta",
		Region:           "Dharwad, Karnataka (GI Registry 2006)",
		Materials:        "Chanderi Cotton-Silk, Resham Threads",
		Techniques:       "Intricate geometric counted-thread embroidery depicting sacred chariot motifs",
		TimeAndEffort:    "12 days handcrafting (over 1,200 counted threads per motif)",
		CulturalStory:    "Heritage bridal and festive wrap symbolizing prosperity, stitched with auspicious temple architecture motifs.",
		ProvenanceStatus: models.ProvenanceIndependentlyVerified,
		VerificationDetails: map[string]interface{}{
			"verifiedBy":  "Karnataka Handloom Development Board Audit",
			"auditDate":   "2026-04-12",
			"giCertified": true,
		},
		CreatedAt: now.Add(-5 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Passports[prod4.ID] = pass4

	// Craft Journey Items
	items := []*models.CraftJourneyItem{
		{
			ID:            "cj1-1",
			ProductID:     prod1.ID,
			ArtisanID:     sunita.ID,
			Title:         "Selecting Handloom Silk Fabric",
			Description:   "Carefully inspecting the warp and weft density of pure raw silk to ensure each warp thread can be accurately counted by eye.",
			MediaURL:      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
			MediaType:     "image",
			StepOrder:     1,
			MilestoneDate: "2026-09-01",
			CreatedAt:     now.Add(-10 * 24 * time.Hour),
		},
		{
			ID:            "cj1-2",
			ProductID:     prod1.ID,
			ArtisanID:     sunita.ID,
			Title:         "Executing Gavanti (Double-Running) Stitch",
			Description:   "Executing the sacred temple chariot motif. No pencil marks are drawn; the pattern emerges through patient mathematical thread counting.",
			MediaURL:      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
			MediaType:     "image",
			StepOrder:     2,
			MilestoneDate: "2026-09-03",
			CreatedAt:     now.Add(-9 * 24 * time.Hour),
		},
		{
			ID:            "cj1-3",
			ProductID:     prod1.ID,
			ArtisanID:     sunita.ID,
			Title:         "Lining and Finishing with Brass Hardware",
			Description:   "Hand-stitching interior pocket compartments and reinforcing dual-density cotton strap handles with antique brass rivets.",
			MediaURL:      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
			MediaType:     "image",
			StepOrder:     3,
			MilestoneDate: "2026-09-05",
			CreatedAt:     now.Add(-8 * 24 * time.Hour),
		},
		{
			ID:            "cj2-1",
			ProductID:     prod2.ID,
			ArtisanID:     rameshwar.ID,
			Title:         "Preparing Quartz Stone Dough",
			Description:   "Pulverizing pure white quartz pebbles from the Aravalli hills, mixing with Katira gum and water into a smooth clay-free dough.",
			MediaURL:      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
			MediaType:     "image",
			StepOrder:     1,
			MilestoneDate: "2026-09-10",
			CreatedAt:     now.Add(-8 * 24 * time.Hour),
		},
		{
			ID:            "cj2-2",
			ProductID:     prod2.ID,
			ArtisanID:     rameshwar.ID,
			Title:         "Freehand Floral Painting with Cobalt Oxide",
			Description:   "Painting traditional leafy creepers and lotuses using a fine camel hair brush loaded with natural cobalt oxide mineral pigment.",
			MediaURL:      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
			MediaType:     "image",
			StepOrder:     2,
			MilestoneDate: "2026-09-14",
			CreatedAt:     now.Add(-7 * 24 * time.Hour),
		},
		{
			ID:            "cj2-3",
			ProductID:     prod2.ID,
			ArtisanID:     rameshwar.ID,
			Title:         "Firing in Traditional Wood Kiln",
			Description:   "Carefully stacking within the muffle kiln and firing at 800°C for 72 hours of gradual heat and slow cooling.",
			MediaURL:      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
			MediaType:     "image",
			StepOrder:     3,
			MilestoneDate: "2026-09-17",
			CreatedAt:     now.Add(-6 * 24 * time.Hour),
		},
	}
	for _, item := range items {
		s.JourneyItems[item.ID] = item
	}

	// Custom Request (CreateConnect)
	customReq := &models.CustomRequest{
		ID:                "cr-100",
		BuyerID:           buyerAnamika.ID,
		BuyerName:         buyerAnamika.FullName,
		Title:             "Custom Wedding Kasuti Wall Hanging with Family Tree",
		Description:       "Looking for a bespoke 24x36 inch Kasuti wall panel on natural tussar silk incorporating our ancestral village temple tower and initials.",
		CraftType:         "Kasuti Embroidery",
		Preferences: map[string]interface{}{
			"size":       "24x36 inches",
			"baseFabric": "Raw Tussar Silk",
			"colors":     []string{"Indigo", "Madder Red", "Mustard"},
		},
		ReferenceImageURL: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
		IsPrivate:         false,
		BudgetMin:         4500.00,
		BudgetMax:         7000.00,
		DesiredDate:       "2026-12-15",
		Status:            models.CustomRequestProposalReceived,
		ProposalsCount:    1,
		CreatedAt:         now.Add(-4 * 24 * time.Hour),
		UpdatedAt:         now,
	}
	s.CustomRequests[customReq.ID] = customReq

	prop := &models.CommissionProposal{
		ID:              "prop-100",
		CustomRequestID: customReq.ID,
		ArtisanID:       sunita.ID,
		ArtisanName:     sunita.FullName,
		ArtisanAvatar:   sunita.AvatarURL,
		ProposedPrice:   5800.00,
		EstimatedDays:   18,
		Message:         "Namaste Anamika ji. I would love to create this heritage heirloom for you. I have authentic hand-spun Tussar silk from Karnataka Sericulture. We will use traditional Muragi and Gavanti stitches for the family temple motif. I will provide work-in-progress photos every 5 days.",
		Status:          "pending",
		CreatedAt:       now.Add(-3 * 24 * time.Hour),
		UpdatedAt:       now,
	}
	s.CommissionProposals[prop.ID] = prop
	customReq.Proposals = []models.CommissionProposal{*prop}

	// Demo Order
	order1 := &models.Order{
		ID:          "ord-9001",
		OrderNumber: "KV-ORD-2026-9001",
		BuyerID:     buyerAnamika.ID,
		BuyerName:   buyerAnamika.FullName,
		TotalAmount: 1450.00,
		Currency:    "INR",
		Status:      models.OrderStatusPaid,
		ShippingAddress: models.ShippingAddress{
			FullName:     "Anamika Sharma",
			Phone:        "+91 98110 55555",
			AddressLine1: "14B, Heritage Palms, Koramangala 4th Block",
			City:         "Bengaluru",
			State:        "Karnataka",
			PostalCode:   "560034",
		},
		IsDemo: true,
		Items: []models.OrderItem{
			{
				ID:           "item-1",
				OrderID:      "ord-9001",
				ProductID:    &prod1.ID,
				ProductTitle: prod1.Title,
				ProductImage: prod1.Images[0].ImageURL,
				Quantity:     1,
				UnitPrice:    prod1.Price,
				CreatedAt:    now.Add(-2 * 24 * time.Hour),
			},
		},
		CreatedAt: now.Add(-2 * 24 * time.Hour),
		UpdatedAt: now,
	}
	s.Orders[order1.ID] = order1

	// Audit Log
	s.AuditLogs = append(s.AuditLogs, &models.AuditLog{
		ID:         uuid.New().String(),
		ActorID:    adminVikram.ID,
		ActorName:  adminVikram.FullName,
		Action:     "VERIFIED_PASSPORT",
		TargetType: "craft_passport",
		TargetID:   pass1.ID,
		Details: map[string]interface{}{
			"status": models.ProvenanceIndependentlyVerified,
			"notes":  "Verified by Karnataka Handloom Development Board",
		},
		CreatedAt: now.Add(-5 * 24 * time.Hour),
	})
}

// Store queries and actions

func (s *Store) GetProducts(category, search string, minPrice, maxPrice float64, sortOrder string, artisanID string) []*models.Product {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*models.Product
	searchLower := strings.ToLower(strings.TrimSpace(search))

	for _, p := range s.Products {
		if artisanID != "" && p.ArtisanID != artisanID {
			continue
		}
		if artisanID == "" && p.Status != models.ProductStatusActive {
			continue
		}
		if category != "" && !strings.EqualFold(p.Category, category) && !strings.EqualFold(p.CraftType, category) {
			continue
		}
		if minPrice > 0 && p.Price < minPrice {
			continue
		}
		if maxPrice > 0 && p.Price > maxPrice {
			continue
		}
		if searchLower != "" {
			matchesTitle := strings.Contains(strings.ToLower(p.Title), searchLower)
			matchesCraft := strings.Contains(strings.ToLower(p.CraftType), searchLower)
			matchesDesc := strings.Contains(strings.ToLower(p.Description), searchLower)
			matchesRegion := strings.Contains(strings.ToLower(p.Region), searchLower)
			if !matchesTitle && !matchesCraft && !matchesDesc && !matchesRegion {
				continue
			}
		}
		result = append(result, p)
	}

	// Sorting
	switch sortOrder {
	case "price_asc":
		sort.Slice(result, func(i, j int) bool { return result[i].Price < result[j].Price })
	case "price_desc":
		sort.Slice(result, func(i, j int) bool { return result[i].Price > result[j].Price })
	default: // "newest"
		sort.Slice(result, func(i, j int) bool { return result[i].CreatedAt.After(result[j].CreatedAt) })
	}

	return result
}

func (s *Store) GetProductByID(id string) (*models.Product, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	p, ok := s.Products[id]
	if !ok {
		return nil, fmt.Errorf("product not found")
	}
	return p, nil
}

func (s *Store) CreateProduct(p *models.Product) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	s.Products[p.ID] = p

	// Create default artisan-declared craft passport for the new product
	passportID := uuid.New().String()
	passportNumber := fmt.Sprintf("KV-PASSPORT-%s-%d", strings.ToUpper(p.Region[:min(3, len(p.Region))]), time.Now().Unix()%10000)
	passport := &models.CraftPassport{
		ID:               passportID,
		ProductID:        p.ID,
		PassportNumber:   passportNumber,
		ArtisanID:        p.ArtisanID,
		ArtisanName:      p.ArtisanName,
		CraftName:        p.CraftType,
		Region:           p.Region,
		Materials:        p.Materials,
		Techniques:       "Traditional handcrafted technique",
		TimeAndEffort:    p.TimeToMake,
		CulturalStory:    p.Description,
		ProvenanceStatus: models.ProvenanceArtisanDeclared,
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}
	s.Passports[p.ID] = passport

	return s.saveUnlocked()
}

func (s *Store) UpdateProduct(p *models.Product) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existing, ok := s.Products[p.ID]
	if !ok {
		return fmt.Errorf("product not found")
	}
	if existing.ArtisanID != p.ArtisanID {
		return fmt.Errorf("unauthorized to edit this product")
	}

	p.UpdatedAt = time.Now()
	s.Products[p.ID] = p
	return s.saveUnlocked()
}

func (s *Store) DeleteProduct(id, artisanID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	p, ok := s.Products[id]
	if !ok {
		return fmt.Errorf("product not found")
	}
	if p.ArtisanID != artisanID {
		return fmt.Errorf("unauthorized to delete this product")
	}

	delete(s.Products, id)
	delete(s.Passports, id)
	return s.saveUnlocked()
}

func (s *Store) GetPassportByProductID(productID string) (*models.CraftPassport, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	pass, ok := s.Passports[productID]
	if !ok {
		return nil, fmt.Errorf("passport not found")
	}
	return pass, nil
}

func (s *Store) UpdatePassportStatus(passportID, status, notes, reviewerID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	var target *models.CraftPassport
	for _, p := range s.Passports {
		if p.ID == passportID {
			target = p
			break
		}
	}
	if target == nil {
		return fmt.Errorf("passport not found")
	}

	prevStatus := target.ProvenanceStatus
	target.ProvenanceStatus = status
	target.UpdatedAt = time.Now()

	s.VerificationReviews = append(s.VerificationReviews, &models.VerificationReview{
		ID:             uuid.New().String(),
		PassportID:     passportID,
		ReviewerID:     reviewerID,
		PreviousStatus: prevStatus,
		NewStatus:      status,
		Notes:          notes,
		CreatedAt:      time.Now(),
	})

	s.AuditLogs = append(s.AuditLogs, &models.AuditLog{
		ID:         uuid.New().String(),
		ActorID:    reviewerID,
		Action:     "UPDATE_PASSPORT_PROVENANCE",
		TargetType: "craft_passport",
		TargetID:   passportID,
		Details: map[string]interface{}{
			"previous": prevStatus,
			"new":      status,
			"notes":    notes,
		},
		CreatedAt: time.Now(),
	})

	return s.saveUnlocked()
}

func (s *Store) GetJourneyItems(productID string) []*models.CraftJourneyItem {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*models.CraftJourneyItem
	for _, item := range s.JourneyItems {
		if item.ProductID == productID {
			result = append(result, item)
		}
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].StepOrder < result[j].StepOrder
	})
	return result
}

func (s *Store) AddJourneyItem(item *models.CraftJourneyItem) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if item.ID == "" {
		item.ID = uuid.New().String()
	}
	item.CreatedAt = time.Now()
	s.JourneyItems[item.ID] = item
	return s.saveUnlocked()
}

func (s *Store) GetCustomRequests(buyerID string) []*models.CustomRequest {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*models.CustomRequest
	for _, r := range s.CustomRequests {
		if buyerID != "" && r.BuyerID != buyerID {
			continue
		}
		// Attach matching proposals
		var props []models.CommissionProposal
		for _, p := range s.CommissionProposals {
			if p.CustomRequestID == r.ID {
				props = append(props, *p)
			}
		}
		r.Proposals = props
		r.ProposalsCount = len(props)
		result = append(result, r)
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})
	return result
}

func (s *Store) GetCustomRequestByID(id string) (*models.CustomRequest, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	r, ok := s.CustomRequests[id]
	if !ok {
		return nil, fmt.Errorf("custom request not found")
	}

	var props []models.CommissionProposal
	for _, p := range s.CommissionProposals {
		if p.CustomRequestID == r.ID {
			props = append(props, *p)
		}
	}
	r.Proposals = props
	r.ProposalsCount = len(props)
	return r, nil
}

func (s *Store) CreateCustomRequest(req *models.CustomRequest) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if req.ID == "" {
		req.ID = uuid.New().String()
	}
	req.CreatedAt = time.Now()
	req.UpdatedAt = time.Now()
	req.Status = models.CustomRequestSubmitted
	s.CustomRequests[req.ID] = req
	return s.saveUnlocked()
}

func (s *Store) CreateProposal(prop *models.CommissionProposal) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	req, ok := s.CustomRequests[prop.CustomRequestID]
	if !ok {
		return fmt.Errorf("custom request not found")
	}

	if prop.ID == "" {
		prop.ID = uuid.New().String()
	}
	prop.Status = "pending"
	prop.CreatedAt = time.Now()
	prop.UpdatedAt = time.Now()

	s.CommissionProposals[prop.ID] = prop
	req.Status = models.CustomRequestProposalReceived
	req.UpdatedAt = time.Now()

	return s.saveUnlocked()
}

func (s *Store) AcceptProposal(requestID, proposalID, buyerID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	req, ok := s.CustomRequests[requestID]
	if !ok {
		return fmt.Errorf("custom request not found")
	}
	if req.BuyerID != buyerID {
		return fmt.Errorf("unauthorized: only the request owner can accept proposals")
	}

	prop, ok := s.CommissionProposals[proposalID]
	if !ok {
		return fmt.Errorf("proposal not found")
	}

	// Update proposal status
	prop.Status = "accepted"
	prop.UpdatedAt = time.Now()

	// Reject other proposals
	for _, p := range s.CommissionProposals {
		if p.CustomRequestID == requestID && p.ID != proposalID {
			p.Status = "rejected"
		}
	}

	req.Status = models.CustomRequestAccepted
	req.UpdatedAt = time.Now()

	return s.saveUnlocked()
}

func (s *Store) UpdateCustomRequestStatus(requestID, status string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	req, ok := s.CustomRequests[requestID]
	if !ok {
		return fmt.Errorf("custom request not found")
	}
	req.Status = status
	req.UpdatedAt = time.Now()
	return s.saveUnlocked()
}

func (s *Store) CreateOrder(order *models.Order) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Server-side validation of products and stock
	var total float64
	for i := range order.Items {
		item := &order.Items[i]
		if item.ProductID != nil && *item.ProductID != "" {
			prod, ok := s.Products[*item.ProductID]
			if !ok {
				return fmt.Errorf("product %s not found", *item.ProductID)
			}
			if prod.StockQuantity < item.Quantity {
				return fmt.Errorf("insufficient stock for %s: available %d, requested %d", prod.Title, prod.StockQuantity, item.Quantity)
			}
			// Enforce server-side price
			item.UnitPrice = prod.Price
			item.ProductTitle = prod.Title
			if len(prod.Images) > 0 {
				item.ProductImage = prod.Images[0].ImageURL
			}
			total += item.UnitPrice * float64(item.Quantity)

			// Decrement stock
			prod.StockQuantity -= item.Quantity
			if prod.StockQuantity == 0 {
				prod.Status = models.ProductStatusOutOfStock
			}
		} else if item.CustomRequestID != nil && *item.CustomRequestID != "" {
			total += item.UnitPrice * float64(item.Quantity)
		}
	}

	order.TotalAmount = total
	order.Currency = "INR"
	if order.ID == "" {
		order.ID = uuid.New().String()
	}
	order.OrderNumber = fmt.Sprintf("KV-ORD-%d", time.Now().UnixNano()%1000000)
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	s.Orders[order.ID] = order
	return s.saveUnlocked()
}

func (s *Store) GetOrderByID(id string) (*models.Order, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	order, ok := s.Orders[id]
	if !ok {
		return nil, fmt.Errorf("order not found")
	}
	return order, nil
}

func (s *Store) GetUserOrders(userID string) []*models.Order {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*models.Order
	for _, o := range s.Orders {
		if o.BuyerID == userID {
			result = append(result, o)
		}
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})
	return result
}

func (s *Store) UpdateOrderStatus(orderID, status string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	o, ok := s.Orders[orderID]
	if !ok {
		return fmt.Errorf("order not found")
	}
	o.Status = status
	o.UpdatedAt = time.Now()
	return s.saveUnlocked()
}

func (s *Store) CreatePayment(payment *models.Payment) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if payment.ID == "" {
		payment.ID = uuid.New().String()
	}
	payment.CreatedAt = time.Now()
	s.Payments[payment.ID] = payment

	if order, ok := s.Orders[payment.OrderID]; ok {
		order.PaymentID = payment.ID
		if payment.Status == "completed" {
			order.Status = models.OrderStatusPaid
		}
		order.UpdatedAt = time.Now()
	}

	return s.saveUnlocked()
}

func (s *Store) GetAdminMetrics() *models.AdminMetrics {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var totalVol float64
	for _, o := range s.Orders {
		if o.Status == models.OrderStatusPaid || o.Status == models.OrderStatusDelivered {
			totalVol += o.TotalAmount
		}
	}

	var pendingPassports int
	for _, p := range s.Passports {
		if p.ProvenanceStatus == models.ProvenanceArtisanDeclared {
			pendingPassports++
		}
	}

	var artisanCount int
	var buyerCount int
	for _, u := range s.Users {
		if u.Role == models.RoleArtisan {
			artisanCount++
		} else if u.Role == models.RoleBuyer {
			buyerCount++
		}
	}

	return &models.AdminMetrics{
		TotalArtisans:       artisanCount,
		TotalBuyers:         buyerCount,
		TotalProducts:       len(s.Products),
		TotalOrders:         len(s.Orders),
		TotalVolumeINR:      totalVol,
		CustomRequestsCount: len(s.CustomRequests),
		PendingPassports:    pendingPassports,
	}
}

func (s *Store) GetAuditLogs() []*models.AuditLog {
	s.mu.RLock()
	defer s.mu.RUnlock()

	logs := make([]*models.AuditLog, len(s.AuditLogs))
	copy(logs, s.AuditLogs)
	sort.Slice(logs, func(i, j int) bool {
		return logs[i].CreatedAt.After(logs[j].CreatedAt)
	})
	return logs
}

func (s *Store) GetUserByEmail(email string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, u := range s.Users {
		if strings.EqualFold(u.Email, email) {
			return u, nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func (s *Store) GetUserByID(id string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	u, ok := s.Users[id]
	if !ok {
		return nil, fmt.Errorf("user not found")
	}
	return u, nil
}

func (s *Store) CreateUser(u *models.User) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	s.Users[u.ID] = u

	if u.Role == models.RoleArtisan {
		s.Artisans[u.ID] = &models.ArtisanProfile{
			ID:                 uuid.New().String(),
			ProfileID:          u.ID,
			CraftSpecialty:     "Traditional Craft",
			ExperienceYears:    1,
			State:              u.Region,
			VerificationStatus: models.ProvenanceArtisanDeclared,
			CreatedAt:          time.Now(),
			UpdatedAt:          time.Now(),
		}
	}

	return s.saveUnlocked()
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
