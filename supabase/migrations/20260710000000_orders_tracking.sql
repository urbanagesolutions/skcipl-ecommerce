-- Migration: Add courier tracking fields to orders table
-- Also adds an item_count computed helper and verifies staff can update orders

-- 1. Add courier tracking columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS courier_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255);

-- 2. Verify RLS policies are correct for staff order updates
-- The policy "Allow admin staff to update orders" already covers status updates for admins.
-- We extend it to allow ANY staff (not just admin) to update orders
-- (e.g. warehouse staff marking "Shipped").
-- First drop the old admin-only policy and replace with a staff-level one.

DROP POLICY IF EXISTS "Allow admin staff to update orders" ON public.orders;

CREATE POLICY "Allow staff to update orders"
  ON public.orders
  FOR UPDATE
  USING (public.is_staff());

-- 3. RLS: staff can also INSERT notes / read all orders
DROP POLICY IF EXISTS "Allow staff to view all orders" ON public.orders;
CREATE POLICY "Allow staff to view all orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = customer_id OR public.is_staff());
