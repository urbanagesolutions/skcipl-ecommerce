-- Platform enhancements: order address, payment idempotency, loyalty, returns, banners, reviews moderation

-- Order address & payment tracking
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS address_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id
  ON orders(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;

-- Review moderation
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT true;

-- Loyalty program
ALTER TABLE customers ADD COLUMN IF NOT EXISTS loyalty_points INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(user_id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('earn', 'redeem', 'adjust')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_loyalty_customer ON loyalty_transactions(customer_id);

-- Return requests
CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(user_id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Refunded')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_returns_order ON return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_customer ON return_requests(customer_id);

-- Promotional banners / flash sales
CREATE TABLE IF NOT EXISTS promotional_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B2B wholesale inquiries
CREATE TABLE IF NOT EXISTS b2b_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  gst_number VARCHAR(50),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'New'
    CHECK (status IN ('New', 'Contacted', 'Converted', 'Closed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Full-text search index on products
CREATE INDEX IF NOT EXISTS idx_products_search ON products
  USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(sku, '')));

-- RLS for new tables
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own loyalty transactions" ON loyalty_transactions
  FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Staff view all loyalty transactions" ON loyalty_transactions
  FOR SELECT USING (public.is_staff());

CREATE POLICY "Users manage own return requests" ON return_requests
  FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Staff manage all return requests" ON return_requests
  FOR ALL USING (public.is_staff());

CREATE POLICY "Public view active banners" ON promotional_banners
  FOR SELECT USING (is_active = true AND starts_at <= now() AND ends_at >= now());
CREATE POLICY "Admin manage banners" ON promotional_banners
  FOR ALL USING (public.is_staff_admin());

CREATE POLICY "Anyone can submit B2B inquiry" ON b2b_inquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff view B2B inquiries" ON b2b_inquiries
  FOR SELECT USING (public.is_staff());
CREATE POLICY "Staff update B2B inquiries" ON b2b_inquiries
  FOR UPDATE USING (public.is_staff());

-- Seed a default promotional banner
INSERT INTO promotional_banners (title, subtitle, link_url, discount_percent, starts_at, ends_at, display_order)
VALUES (
  'Monsoon Sale',
  'Up to 15% off on premium ghee & cold-pressed oils',
  '/category/ghee',
  15,
  '2026-01-01'::timestamptz,
  '2030-12-31'::timestamptz,
  1
) ON CONFLICT DO NOTHING;
