import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { computeOrderTotals, CartItemRow } from '@/lib/pricing';
import { getAuthUser } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const auth = await getAuthUser(token);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { user, supabase } = auth;

    const body = await request.json();
    const { couponCode } = body;

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, products(*), product_variants(*)')
      .eq('customer_id', user.id);

    if (cartError || !cartItems?.length) {
      return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    }

    const totals = await computeOrderTotals(supabase, cartItems as CartItemRow[], couponCode);

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ success: false, error: 'Razorpay not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totals.total * 100),
      currency: 'INR',
      receipt: `rcpt_${user.id.substring(0, 8)}_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: razorpayKeyId,
      totals,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
