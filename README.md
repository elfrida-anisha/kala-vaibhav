# Kala Vaibhav (कला वैभव)
### Inclusive AI-Powered Heritage Artisan Marketplace
> *"Speak to sell. Buy what exists. Commission what you imagine. Discover the story behind every craft."*

Kala Vaibhav is an inclusive artisan marketplace empowering traditional Indian craftspeople with voice-first product listing, cryptographically structured **Digital Craft Passports**, transparent pricing assistance, bespoke design commissions (**CreateConnect**), and chronological **Craft Journeys**.

---

## 🌟 Key Highlights & Innovations

1. **Kala Mitra (Voice-to-Listing):** Artisans describe their craft naturally via microphone. A structured AI pipeline extracts product specifications, price in ₹, materials, and time-to-make, offering voice confirmation and an explicit approval workflow before publishing.
2. **Digital Craft Passport:** Every handcrafted item carries an authenticated provenance record with GI-tag registry details, certified materials, handcraft hours, and multi-tier provenance statuses (*Artisan-declared*, *Community-reviewed*, *Independently verified*).
3. **CreateConnect (Design & Commission):** Buyers upload inspiration photos and budget constraints to commission bespoke heirlooms; master artisans submit detailed proposals, and production is tracked across 7 sequential milestones.
4. **Transparent Pricing Assistance:** Fair-trade wage calculator computing materials + labour hours × hourly rate + workshop overheads + fair artisan margin (20–40%), leaving 100% final price control with the artisan.
5. **Kala Saathi (AI Buyer Assistant):** Interactive craft guide answering technique questions, toddler safety details, and recommending authentic catalogue pieces.
6. **Robust Multi-Role Architecture:** Role-specific portals for **Artisan**, **Buyer**, and **Curator/Admin** with server-enforced authorization and immutable audit logs.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 15 (App Router), TypeScript (Strict), Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend:** Go 1.26 / 1.24 REST API (Gin Web Framework, CORS, UUID, SHA256 HMAC verification).
- **Persistence & Database:** Thread-safe persistent JSON store with automatic demonstration seeding + Supabase PostgreSQL migration scripts with Row Level Security (RLS) policies.
- **AI & Voice:** Web Speech API voice capture, Ollama LLM integration, hybrid deterministic JSON schema NLP extractor.
- **Payments:** Razorpay Test Mode with server signature verification & labelled Demo Checkout fallback.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v20+ & pnpm (or npm)
- Go 1.23+

### 1. Launch the Go Backend Server
```powershell
# In a terminal window:
Set-Location -Path "kala-vaibhav\backend"
go run ./cmd/server
```
*The backend API will start on `http://localhost:8080` (health check at `http://localhost:8080/health`).*

### 2. Launch the Next.js Frontend
```powershell
# In a second terminal window:
Set-Location -Path "kala-vaibhav\frontend"
pnpm dev
# (or pnpm start for the compiled production build)
```
*The web app will open at `http://localhost:3000`.*

---

## 👥 Demo Personas (1-Click Switcher Available on Header)

For seamless hackathon evaluation, click **"Switch Persona"** in the top navigation banner:

| Persona | Role | Craft / Specialization | Cluster Location |
| :--- | :--- | :--- | :--- |
| **Sunita Devi** | Artisan | GI-Certified Kasuti Embroidery (18 yrs) | Dharwad, Karnataka |
| **Rameshwar Soni** | Artisan | Clay-Free Jaipur Blue Pottery (24 yrs) | Jaipur, Rajasthan |
| **Manju Gowda** | Artisan | GI Channapatna Lacquerware (12 yrs) | Channapatna, Karnataka |
| **Anamika Sharma** | Buyer | Heritage Textile Connoisseur & Architect | Bengaluru, Karnataka |
| **Vikramaditya Rao** | Admin | Chief Curator & Provenance Officer | New Delhi |

---

## 🧪 Automated End-to-End Test Suite

Run the comprehensive automated verification script testing all required journeys:
```powershell
powershell -ExecutionPolicy Bypass -File "kala-vaibhav\test-e2e.ps1"
```
### Test Coverage Results:
- **TEST A (Artisan Listing):** Login, Kala Mitra AI extraction, publication, catalogue search.
- **TEST B (Explore & Buy):** Buyer authentication, anti-tamper server price enforcement, payment verification.
- **TEST C (Custom Commission):** Custom request creation, artisan quotation, buyer proposal acceptance.
- **TEST D (Craft Passport):** Auto-linked passport verification with provenance status.
- **TEST E (Security & RBAC):** Unauthorized buyer blocked from admin routes (403 Forbidden).
- **TEST F (Pricing Guidance):** Fair margin & dignified wage calculation.
- **Result:** **13 PASSED, 0 FAILED (100% Passing)**.

---

## 🎬 Recommended 4-Minute Hackathon Demonstration Script

- **0:00–0:25 — The Problem & Vision:** Introduce Kala Vaibhav and why India's 7M traditional artisans are locked out of digital commerce by keyboards, English forms, and middleman markups.
- **0:25–1:20 — Kala Mitra (Voice-to-Listing):** Open "Sell Your Craft". Tap the microphone and speak: *"This is a handmade Kasuti bag. The price is 800 rupees. It took me three days to make."* Show Kala Mitra extract structured fields, present voice confirmation, and publish with one click.
- **1:20–2:00 — Provenance & Storytelling:** Open the newly published Kasuti bag. Show the **Digital Craft Passport** (GI tag, materials, 34 hours needlework) and the **Craft Journey** timeline.
- **2:00–2:45 — Explore & Buy:** Switch to Buyer persona (Anamika). Browse crafts, filter by Karnataka textiles, view transparent pricing breakdown, add to cart, and complete the labelled Demo Checkout with celebratory confetti.
- **2:45–3:30 — CreateConnect (Custom Commission):** Submit a bespoke bridal request. Switch to artisan to send a proposal. Return to buyer, accept proposal, and view live production milestone progression.
- **3:30–4:00 — Platform Admin & Metrics:** Switch to Admin (Vikramaditya). Inspect GMV volume, audit logs, and approve a pending Craft Passport in the audit queue.
