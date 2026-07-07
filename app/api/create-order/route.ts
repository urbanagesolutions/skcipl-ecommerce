import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';

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

    // Initialize Supabase Client with the user's token so RLS is applied correctly
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
    const { couponCode } = body;

    // Fetch user's cart items from the database (fully joined)
    const { data: cartItems, error: cartError } = await supabaseServer
      .from('cart_items')
      .select('*, products(*), product_variants(*)')
      .eq('customer_id', user.id);

    if (cartError) {
      console.error('Error fetching cart items:', cartError);
      return NextResponse.json({ success: false, error: 'Failed to retrieve cart items' }, { status: 500 });
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    }

    // Calculate totals server-side (never trust client amounts)
    let subtotal = 0;
    for (const item of cartItems) {
      const price = item.product_variants && item.product_variants.price_override !== null
        ? Number(item.product_variants.price_override)
        : Number(item.products.price);
      subtotal += price * item.quantity;
    }

    // Check discount from coupon in DB
    let discount = 0;
    if (couponCode) {
      const { data: coupon, error: couponError } = await supabaseServer
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon && !couponError) {
        const now = new Date();
        const from = new Date(coupon.valid_from);
        const until = new Date(coupon.valid_until);

        if (now >= from && now <= until) {
          if (coupon.discount_type === 'Percentage') {
            discount = Number(((subtotal * Number(coupon.discount_value)) / 100).toFixed(2));
          } else if (coupon.discount_type === 'Fixed') {
            discount = Number(Number(coupon.discount_value).toFixed(2));
          }
          // Ensure discount does not exceed subtotal
          discount = Math.min(discount, subtotal);
        }
      }
    }

    // Calculate shipping fee: flat ₹50, free if subtotal >= 999
    const shippingFee = subtotal >= 999 ? 0 : 50;

    // Calculate tax: 5% of (subtotal - discount)
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.05).toFixed(2));

    // Calculate grand total
    const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

    // Initialize Razorpay
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ success: false, error: 'Razorpay keys not configured on server' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret
    });

    // Create a Razorpay order (amount is in paise, so multiply by 100)
    const amountInPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${user.id.substring(0, 8)}_${Date.now()}`
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: razorpayKeyId,
      totals: {
        subtotal,
        discount,
        shippingFee,
        tax,
        total
      }
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error creating Razorpay order:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
