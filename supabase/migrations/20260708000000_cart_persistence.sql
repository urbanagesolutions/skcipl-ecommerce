-- Migration: Add cart_items table and policies
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(user_id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure product/variant combo is unique per session_id (guests) or customer_id (logged in)
    -- We'll handle upserts carefully in the client code
    CONSTRAINT unique_cart_item_session UNIQUE (session_id, product_id, variant_id)
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Allow select cart_items" ON public.cart_items
    FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR 
        (customer_id IS NULL)
    );

CREATE POLICY "Allow insert cart_items" ON public.cart_items
    FOR INSERT
    WITH CHECK (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR 
        (customer_id IS NULL)
    );

CREATE POLICY "Allow update cart_items" ON public.cart_items
    FOR UPDATE
    USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR 
        (customer_id IS NULL)
    );

CREATE POLICY "Allow delete cart_items" ON public.cart_items
    FOR DELETE
    USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR 
        (customer_id IS NULL)
    );

-- Trigger to automatically update updated_at on modify
CREATE OR REPLACE FUNCTION public.handle_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_cart_items_update
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_cart_updated_at();
