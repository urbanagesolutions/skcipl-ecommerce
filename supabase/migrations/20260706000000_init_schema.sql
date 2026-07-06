-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    icon_or_image_url TEXT,
    requires_fssai_display BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for slug lookups and display ordering
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- 2. Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fssai_license_number VARCHAR(100) NOT NULL,
    fssai_valid_until DATE NOT NULL,
    cin VARCHAR(100),
    gst_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Seed data
-- Seed categories
INSERT INTO categories (name, slug, display_order, icon_or_image_url, requires_fssai_display)
VALUES 
('Ghee', 'ghee', 1, '/assets/icons/ghee.png', true),
('Oils', 'oils', 2, '/assets/icons/oils.png', true),
('Groceries', 'groceries', 3, '/assets/icons/groceries.png', true),
('Fashion', 'fashion', 4, '/assets/icons/fashion.png', false)
ON CONFLICT (slug) DO UPDATE 
SET 
    name = EXCLUDED.name,
    display_order = EXCLUDED.display_order,
    icon_or_image_url = EXCLUDED.icon_or_image_url,
    requires_fssai_display = EXCLUDED.requires_fssai_display;

-- Seed company settings
INSERT INTO company_settings (fssai_license_number, fssai_valid_until, cin, gst_number)
VALUES ('12422027001241', '2029-08-28', 'U15400TN2023PTC159000', '33AACCS1242E1Z1')
ON CONFLICT DO NOTHING;
