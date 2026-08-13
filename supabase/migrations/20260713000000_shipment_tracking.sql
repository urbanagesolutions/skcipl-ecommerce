-- Phase 5: Advanced Shipment Tracking schema

-- 1. Extend order status enum
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('Pending', 'Processing', 'Partially Shipped', 'Shipped', 'Delivered', 'Cancelled', 'Returned'));

-- 2. Shipping carriers registry
CREATE TABLE IF NOT EXISTS public.shipping_carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  tracking_url_template TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  country_code VARCHAR(10) DEFAULT 'IN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Shipments (multiple per order)
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  carrier_id UUID REFERENCES public.shipping_carriers(id) ON DELETE SET NULL,
  carrier_name VARCHAR(255),
  tracking_number VARCHAR(255) NOT NULL,
  tracking_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Label Created'
    CHECK (status IN ('Label Created', 'In Transit', 'Out for Delivery', 'Delivered', 'Exception', 'Returned')),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_delivery TIMESTAMPTZ,
  shiprocket_awb TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);

-- 4. Item-level tracking (PRO)
CREATE TABLE IF NOT EXISTS public.shipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_shipment_items_shipment ON public.shipment_items(shipment_id);

-- 5. Tracking events (live scan feed)
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  event_code VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  occurred_at TIMESTAMPTZ NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment ON public.tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_occurred ON public.tracking_events(occurred_at DESC);

-- 6. Tracking widget settings
CREATE TABLE IF NOT EXISTS public.tracking_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color VARCHAR(20) DEFAULT '#2D5016',
  accent_color VARCHAR(20) DEFAULT '#4A7C23',
  show_carrier_logo BOOLEAN DEFAULT true,
  show_estimated_delivery BOOLEAN DEFAULT true,
  notify_in_transit BOOLEAN DEFAULT true,
  notify_out_for_delivery BOOLEAN DEFAULT true,
  notify_delivered BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.tracking_settings (primary_color, accent_color)
SELECT '#2D5016', '#4A7C23'
WHERE NOT EXISTS (SELECT 1 FROM public.tracking_settings LIMIT 1);

-- 7. Seed India-focused carriers
INSERT INTO public.shipping_carriers (name, slug, tracking_url_template, is_enabled) VALUES
  ('Delhivery', 'delhivery', 'https://www.delhivery.com/track/package/{tracking_number}', true),
  ('BlueDart', 'bluedart', 'https://www.bluedart.com/web/guest/trackdartresult?trackNo={tracking_number}', true),
  ('DTDC', 'dtdc', 'https://www.dtdc.in/tracking/tracking_results.asp?Ttype=awb_no&strCnno={tracking_number}', true),
  ('India Post', 'india-post', 'https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?consignmentnumber={tracking_number}', true),
  ('Shiprocket', 'shiprocket', 'https://shiprocket.co/tracking/{tracking_number}', true),
  ('Ekart', 'ekart', 'https://ekartlogistics.com/track/{tracking_number}', true),
  ('FedEx', 'fedex', 'https://www.fedex.com/fedextrack/?trknbr={tracking_number}', true),
  ('DHL Express', 'dhl', 'https://www.dhl.com/in-en/home/tracking.html?tracking-id={tracking_number}', true),
  ('Ecom Express', 'ecom-express', 'https://ecomexpress.in/tracking/?awb_field={tracking_number}', true),
  ('XpressBees', 'xpressbees', 'https://www.xpressbees.com/track/{tracking_number}', true),
  ('Shadowfax', 'shadowfax', 'https://track.shadowfax.in/track/{tracking_number}', true),
  ('Professional Couriers', 'professional-couriers', 'https://www.tpcindia.com/track/{tracking_number}', true),
  ('Gati', 'gati', 'https://www.gati.com/track-by-docket?docketNo={tracking_number}', true),
  ('Amazon Shipping', 'amazon-shipping', 'https://track.amazon.in/tracking/{tracking_number}', true),
  ('Flipkart Ekart', 'flipkart-ekart', 'https://ekartlogistics.com/track/{tracking_number}', true),
  ('Speed Post', 'speed-post', 'https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?consignmentnumber={tracking_number}', true),
  ('Aramex', 'aramex', 'https://www.aramex.com/in/en/track/results?ShipmentNumber={tracking_number}', true),
  ('UPS', 'ups', 'https://www.ups.com/track?tracknum={tracking_number}', true),
  ('USPS', 'usps', 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking_number}', true),
  ('Rivigo', 'rivigo', 'https://www.rivigo.com/track/{tracking_number}', true),
  ('Smartr Logistics', 'smartr', 'https://smartr.in/track/{tracking_number}', true),
  ('Porter', 'porter', 'https://porter.in/track/{tracking_number}', true),
  ('Other / Custom', 'other', '', true)
ON CONFLICT (slug) DO NOTHING;

-- 8. Backfill existing order tracking into shipments
INSERT INTO public.shipments (order_id, carrier_name, tracking_number, status, shipped_at)
SELECT
  o.id,
  o.courier_name,
  o.tracking_number,
  CASE WHEN o.status = 'Delivered' THEN 'Delivered' ELSE 'In Transit' END,
  o.updated_at
FROM public.orders o
WHERE o.tracking_number IS NOT NULL
  AND o.tracking_number != ''
  AND NOT EXISTS (
    SELECT 1 FROM public.shipments s WHERE s.order_id = o.id AND s.tracking_number = o.tracking_number
  );

-- 9. RLS policies
ALTER TABLE public.shipping_carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_settings ENABLE ROW LEVEL SECURITY;

-- Carriers: public read enabled, staff write
CREATE POLICY "Anyone can read enabled carriers" ON public.shipping_carriers
  FOR SELECT USING (is_enabled = true OR public.is_staff());
CREATE POLICY "Staff manage carriers" ON public.shipping_carriers
  FOR ALL USING (public.is_staff());

-- Shipments: customer reads own order shipments, staff full access
CREATE POLICY "Customers read own order shipments" ON public.shipments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
    OR public.is_staff()
  );
CREATE POLICY "Staff manage shipments" ON public.shipments
  FOR ALL USING (public.is_staff());

-- Shipment items
CREATE POLICY "Customers read own shipment items" ON public.shipment_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shipments s
      JOIN public.orders o ON o.id = s.order_id
      WHERE s.id = shipment_id AND (o.customer_id = auth.uid() OR public.is_staff())
    )
  );
CREATE POLICY "Staff manage shipment items" ON public.shipment_items
  FOR ALL USING (public.is_staff());

-- Tracking events
CREATE POLICY "Customers read own tracking events" ON public.tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shipments s
      JOIN public.orders o ON o.id = s.order_id
      WHERE s.id = shipment_id AND (o.customer_id = auth.uid() OR public.is_staff())
    )
  );
CREATE POLICY "Staff manage tracking events" ON public.tracking_events
  FOR ALL USING (public.is_staff());

-- Tracking settings: public read, staff write
CREATE POLICY "Anyone read tracking settings" ON public.tracking_settings FOR SELECT USING (true);
CREATE POLICY "Staff manage tracking settings" ON public.tracking_settings FOR ALL USING (public.is_staff());
