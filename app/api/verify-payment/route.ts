import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { CartItemRow } from '@/lib/pricing';
import { createOrderFromCart } from '@/lib/order-utils';
import { sendOrderNotification } from '@/lib/notifications';
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, coupon_code, address_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json({ success: true, orderId: existingOrder.id, duplicate: true });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ success: false, error: 'Razorpay not configured' }, { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 });
    }

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, products(*), product_variants(*)')
      .eq('customer_id', user.id);

    if (cartError || !cartItems?.length) {
      return NextResponse.json({ success: false, error: 'No items in cart' }, { status: 400 });
    }

    const result = await createOrderFromCart(supabase, user.id, cartItems as CartItemRow[], {
      couponCode: coupon_code,
      addressId: address_id,
      paymentStatus: 'Paid',
      status: 'Processing',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('name, email, phone')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: order } = await supabase
      .from('orders')
      .select('total')
      .eq('id', result.orderId)
      .single();

    await sendOrderNotification({
      orderId: result.orderId,
      customerEmail: customer?.email || user.email || '',
      customerPhone: customer?.phone,
      customerName: customer?.name,
      total: order?.total ?? 0,
      status: 'Confirmed',
    });

    return NextResponse.json({ success: true, orderId: result.orderId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
