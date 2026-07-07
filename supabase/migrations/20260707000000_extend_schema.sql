-- Migration: Extend Schema with Launch Tables, RLS, and Seed Data

-- 1. Helper Functions for RLS (avoiding circular dependency on staff)
CREATE OR REPLACE FUNCTION public.is_staff_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.staff
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Extend company_settings table
ALTER TABLE company_settings 
ADD COLUMN IF NOT EXISTS brand_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS support_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS support_phone VARCHAR(50);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    batch_number VARCHAR(100),
    expiry_date DATE,
    sku VARCHAR(100) UNIQUE,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- 4. Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    variant_name VARCHAR(255) NOT NULL,
    price_override NUMERIC(10, 2) CHECK (price_override >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- 5. Create customers table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS customers (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(user_id) ON DELETE CASCADE NOT NULL,
    label VARCHAR(100) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses(customer_id);

-- 7. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(user_id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0),
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);

-- 8. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 9. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(user_id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);

-- 10. Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('Percentage', 'Fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 11. Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    customer_id UUID REFERENCES customers(user_id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (customer_id, product_id)
);

-- 12. Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_staff_user ON staff(user_id);

-- 13. Enable RLS on every table
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- 14. Define RLS Policies

-- company_settings Policies
CREATE POLICY "Allow public read access to company settings" ON company_settings
  FOR SELECT USING (true);
CREATE POLICY "Allow admin staff to modify company settings" ON company_settings
  FOR ALL USING (public.is_staff_admin());

-- categories Policies
CREATE POLICY "Allow public read active categories" ON categories
  FOR SELECT USING (is_active = true OR public.is_staff());
CREATE POLICY "Allow admin staff to modify categories" ON categories
  FOR ALL USING (public.is_staff_admin());

-- products Policies
CREATE POLICY "Allow public read active products" ON products
  FOR SELECT USING (is_active = true OR public.is_staff());
CREATE POLICY "Allow admin staff to modify products" ON products
  FOR ALL USING (public.is_staff_admin());

-- product_variants Policies
CREATE POLICY "Allow public read active variants" ON product_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.is_active = true)
    OR public.is_staff()
  );
CREATE POLICY "Allow admin staff to modify variants" ON product_variants
  FOR ALL USING (public.is_staff_admin());

-- customers Policies
CREATE POLICY "Allow user to view own customer profile" ON customers
  FOR SELECT USING (auth.uid() = user_id OR public.is_staff());
CREATE POLICY "Allow user to create/update own customer profile" ON customers
  FOR ALL USING (auth.uid() = user_id OR public.is_staff_admin());

-- addresses Policies
CREATE POLICY "Allow user to manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Allow staff to view addresses" ON addresses
  FOR SELECT USING (public.is_staff());

-- orders Policies
CREATE POLICY "Allow customer to view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id OR public.is_staff());
CREATE POLICY "Allow customer to insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Allow admin staff to update orders" ON orders
  FOR UPDATE USING (public.is_staff_admin());

-- order_items Policies
CREATE POLICY "Allow user to view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR public.is_staff()))
  );
CREATE POLICY "Allow customer to insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
  );
CREATE POLICY "Allow admin staff to modify order items" ON order_items
  FOR UPDATE USING (public.is_staff_admin());

-- reviews Policies
CREATE POLICY "Allow public read reviews" ON reviews
  FOR SELECT USING (true);
CREATE POLICY "Allow customer to manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = customer_id);

-- coupons Policies
CREATE POLICY "Allow public read coupons" ON coupons
  FOR SELECT USING (is_active = true OR public.is_staff());
CREATE POLICY "Allow admin to manage coupons" ON coupons
  FOR ALL USING (public.is_staff_admin());

-- wishlist Policies
CREATE POLICY "Allow customer to manage own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = customer_id);

-- staff Policies (Prevent recursion by using is_staff_admin() or basic checks)
CREATE POLICY "Allow user to view own staff record" ON staff
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow admin to manage all staff" ON staff
  FOR ALL USING (public.is_staff_admin());

-- 15. Create Customer Auto-Sync Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (user_id, name, email, phone)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.phone
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. Seed Data
-- Update/insert the target company settings
TRUNCATE TABLE company_settings CASCADE;
INSERT INTO company_settings (fssai_license_number, fssai_valid_until, cin, gst_number, brand_name, support_email, support_phone)
VALUES (
  '12422027001241',
  '2029-08-28',
  'U15400TZ2022PTC038516',
  '33ABICS1176M1Z1',
  'Sabari Krishna Consumables',
  'support@sabarikrishnaconsumables.in',
  '+91 422 2700124'
);
