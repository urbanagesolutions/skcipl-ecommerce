import { NextResponse } from 'next/server';
import { CartItemRow } from '@/lib/pricing';
import { createOrderFromCart } from '@/lib/order-utils';
import { sendOrderNotification } from '@/lib/notifications';
import { getAuthUser } from '@/lib/supabase-server';

function standardizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? '91' + digits : digits;
}

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
    const { phone, otp, couponCode, addressId } = body;

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: 'Phone and OTP required' }, { status: 400 });
    }

    const standardized = standardizePhone(phone);
    const { data: otpRow } = await supabase
      .from('phone_otps')
      .select('*')
      .eq('customer_id', user.id)
      .eq('phone', standardized)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRow) {
      return NextResponse.json({ success: false, error: 'OTP expired or not found' }, { status: 400 });
    }
    if (new Date(otpRow.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'OTP expired' }, { status: 400 });
    }
    if (otpRow.attempts >= 5) {
      return NextResponse.json({ success: false, error: 'Maximum attempts reached' }, { status: 400 });
    }
    if (otpRow.otp !== otp.trim()) {
      await supabase.from('phone_otps').update({ attempts: otpRow.attempts + 1 }).eq('id', otpRow.id);
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 });
    }

    await supabase.from('phone_otps').delete().eq('id', otpRow.id);

    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('*, products(*), product_variants(*)')
      .eq('customer_id', user.id);

    if (!cartItems?.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const result = await createOrderFromCart(supabase, user.id, cartItems as CartItemRow[], {
      couponCode,
      addressId,
      paymentStatus: 'Pending',
      status: 'Processing',
      codVerified: true,
      codOtpVerifiedAt: new Date().toISOString(),
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
      status: 'Confirmed (COD)',
    });

    return NextResponse.json({ success: true, orderId: result.orderId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
