import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

const lookupAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = lookupAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    lookupAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests. Try again later.' }, { status: 429 });
    }

    const { email, orderId } = await request.json();
    if (!email?.trim() || !orderId?.trim()) {
      return NextResponse.json({ success: false, error: 'Email and order ID required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: customer } = await supabase
      .from('customers')
      .select('user_id')
      .ilike('email', email.trim())
      .maybeSingle();

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const { data: order } = await supabase
      .from('orders')
      .select('id, created_at, status, payment_status, total, address_snapshot')
      .eq('id', orderId.trim())
      .eq('customer_id', customer.user_id)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const { data: shipments } = await supabase
      .from('shipments')
      .select(`
        id, carrier_name, tracking_number, tracking_url, status, shipped_at, delivered_at,
        tracking_events(id, event_code, description, location, occurred_at)
      `)
      .eq('order_id', order.id)
      .order('created_at', { ascending: true });

    const { data: items } = await supabase
      .from('order_items')
      .select('id, quantity, price_at_purchase, products(name, images), product_variants(variant_name)')
      .eq('order_id', order.id);

    return NextResponse.json({
      success: true,
      order,
      shipments: shipments || [],
      items: items || [],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
