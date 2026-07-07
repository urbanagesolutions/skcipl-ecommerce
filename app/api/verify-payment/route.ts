import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // Initialize Supabase Client with the user's token
    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Verify token and retrieve user
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      coupon_code
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature using Razorpay Key Secret
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ success: false, error: 'Razorpay secret not configured' }, { status: 500 });
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 });
    }

    // Payment is verified! Now create the order inside Supabase
    // 1. Fetch user's cart items
    const { data: cartItems, error: cartError } = await supabaseServer
      .from('cart_items')
      .select('*, products(*), product_variants(*)')
      .eq('customer_id', user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'No items found in cart to order' }, { status: 400 });
    }

    // 2. Recalculate totals
    let subtotal = 0;
    for (const item of cartItems) {
      const price = item.product_variants && item.product_variants.price_override !== null
        ? Number(item.product_variants.price_override)
        : Number(item.products.price);
      subtotal += price * item.quantity;
    }

    // Check discount from coupon in DB
    let discount = 0;
    if (coupon_code) {
      const { data: coupon } = await supabaseServer
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        const now = new Date();
        const from = new Date(coupon.valid_from);
        const until = new Date(coupon.valid_until);

        if (now >= from && now <= until) {
          if (coupon.discount_type === 'Percentage') {
            discount = Number(((subtotal * Number(coupon.discount_value)) / 100).toFixed(2));
          } else if (coupon.discount_type === 'Fixed') {
            discount = Number(Number(coupon.discount_value).toFixed(2));
          }
          discount = Math.min(discount, subtotal);
        }
      }
    }

    // Shipping fee
    const shippingFee = subtotal >= 999 ? 0 : 50;

    // Tax
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.05).toFixed(2));

    // Grand total
    const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

    // 3. Insert order
    // Note: status is set to 'Processing' because 'confirmed' violates DB check constraint
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        customer_id: user.id,
        status: 'Processing',
        payment_status: 'Paid',
        subtotal,
        discount,
        shipping_fee: shippingFee,
        tax,
        total
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order in DB:', orderError);
      return NextResponse.json({ success: false, error: 'Failed to record purchase order' }, { status: 500 });
    }

    // 4. Insert order items
    const orderItemsData = cartItems.map(item => {
      const price = item.product_variants && item.product_variants.price_override !== null
        ? Number(item.product_variants.price_override)
        : Number(item.products.price);
      return {
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase: price
      };
    });

    const { error: itemsError } = await supabaseServer
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Error recording order items:', itemsError);
      // Even if order items fail, the order itself has been logged as paid. We return orderId.
    }

    // 5. Clear cart items
    const { error: clearError } = await supabaseServer
      .from('cart_items')
      .delete()
      .eq('customer_id', user.id);

    if (clearError) {
      console.error('Error clearing cart items after checkout:', clearError);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error verifying payment:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
