-- Kala Vaibhav Database Schema
-- Production PostgreSQL / Supabase Migration
-- Includes RLS policies, indexes, foreign keys, and integrity constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Artisans, Buyers, Admins)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('artisan', 'buyer', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    region TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Artisan Profiles (Extended artisan credentials)
CREATE TABLE IF NOT EXISTS artisan_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    craft_specialty TEXT NOT NULL,
    experience_years INT DEFAULT 1,
    studio_address TEXT,
    state TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'artisan-declared' CHECK (verification_status IN ('artisan-declared', 'community-reviewed', 'independently-verified')),
    verification_notes TEXT,
    phone_public BOOLEAN DEFAULT false,
    gi_tag_affiliated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_artisan_profile UNIQUE (profile_id)
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    craft_type TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    materials TEXT,
    time_to_make TEXT,
    stock_quantity INT NOT NULL DEFAULT 1 CHECK (stock_quantity >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'out_of_stock', 'archived')),
    region TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Images
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Digital Craft Passports
CREATE TABLE IF NOT EXISTS craft_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    passport_number TEXT UNIQUE NOT NULL,
    artisan_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    craft_name TEXT NOT NULL,
    region TEXT NOT NULL,
    materials TEXT NOT NULL,
    techniques TEXT NOT NULL,
    time_and_effort TEXT NOT NULL,
    cultural_story TEXT NOT NULL,
    provenance_status TEXT NOT NULL DEFAULT 'artisan-declared' CHECK (provenance_status IN ('artisan-declared', 'community-reviewed', 'independently-verified')),
    verification_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_product_passport UNIQUE (product_id)
);

-- 6. Craft Journey Items (Chronological process storytelling)
CREATE TABLE IF NOT EXISTS craft_journey_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    artisan_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    step_order INT NOT NULL DEFAULT 1,
    milestone_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Custom Requests (CreateConnect)
CREATE TABLE IF NOT EXISTS custom_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    craft_type TEXT NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb,
    reference_image_url TEXT,
    is_private BOOLEAN DEFAULT false,
    budget_min NUMERIC(10, 2) NOT NULL CHECK (budget_min >= 0),
    budget_max NUMERIC(10, 2) NOT NULL CHECK (budget_max >= budget_min),
    desired_date DATE,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
        'submitted', 'reviewing', 'proposal_received', 'accepted', 
        'in_production', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Commission Proposals
CREATE TABLE IF NOT EXISTS commission_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    custom_request_id UUID NOT NULL REFERENCES custom_requests(id) ON DELETE CASCADE,
    artisan_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    proposed_price NUMERIC(10, 2) NOT NULL CHECK (proposed_price > 0),
    estimated_days INT NOT NULL CHECK (estimated_days > 0),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Shipping Addresses
CREATE TABLE IF NOT EXISTS shipping_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    custom_request_id UUID REFERENCES custom_requests(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    is_mock BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Verification Reviews (Audit trail for passport verification)
CREATE TABLE IF NOT EXISTS verification_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passport_id UUID NOT NULL REFERENCES craft_passports(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_artisan ON products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_custom_requests_buyer ON custom_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_requests(status);
CREATE INDEX IF NOT EXISTS idx_proposals_request ON commission_proposals(custom_request_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_passports_product ON craft_passports(product_id);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE craft_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE craft_journey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read active products; Artisans can create & modify their own
CREATE POLICY products_public_read ON products FOR SELECT USING (status = 'active' OR auth.uid() = artisan_id);
CREATE POLICY products_artisan_insert ON products FOR INSERT WITH CHECK (auth.uid() = artisan_id);
CREATE POLICY products_artisan_update ON products FOR UPDATE USING (auth.uid() = artisan_id);

-- Custom Requests: Public if not private; Owners can read all their own
CREATE POLICY custom_requests_read ON custom_requests FOR SELECT USING (is_private = false OR auth.uid() = buyer_id);
CREATE POLICY custom_requests_buyer_insert ON custom_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Passports: Public read
CREATE POLICY passports_public_read ON craft_passports FOR SELECT USING (true);
