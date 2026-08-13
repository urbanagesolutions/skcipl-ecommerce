-- Migration: Add COD OTP columns to orders and create phone_otps table

-- 1. Add COD verification columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS cod_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cod_otp_verified_at TIMESTAMP WITH TIME ZONE;

-- 2. Create a phone_otps table to track verification SMS/OTP
CREATE TABLE IF NOT EXISTS public.phone_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(user_id) ON DELETE CASCADE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    attempts INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Index for fast lookup by customer_id and phone
CREATE INDEX IF NOT EXISTS idx_phone_otps_customer ON public.phone_otps(customer_id);
CREATE INDEX IF NOT EXISTS idx_phone_otps_phone ON public.phone_otps(phone);

-- Enable RLS on phone_otps
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS Policies for phone_otps
CREATE POLICY "Allow users to manage their own OTPs"
  ON public.phone_otps
  FOR ALL
  USING (auth.uid() = customer_id);
