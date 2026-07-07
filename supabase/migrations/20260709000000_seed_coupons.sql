-- Migration: Seed coupons table
INSERT INTO public.coupons (code, discount_type, discount_value, valid_from, valid_until, is_active, usage_limit)
VALUES 
  ('WELCOME100', 'Fixed', 100.00, '2026-01-01 00:00:00+00', '2030-12-31 23:59:59+00', true, 1000),
  ('SABARI10', 'Percentage', 10.00, '2026-01-01 00:00:00+00', '2030-12-31 23:59:59+00', true, 1000)
ON CONFLICT (code) DO UPDATE 
SET 
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  valid_from = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  is_active = EXCLUDED.is_active,
  usage_limit = EXCLUDED.usage_limit;
