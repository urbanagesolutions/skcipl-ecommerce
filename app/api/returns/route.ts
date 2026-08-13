import { NextResponse } from 'next/server';
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

    const body = await request.json();
    const { orderId, reason } = body;

    if (!orderId || !reason?.trim()) {
      return NextResponse.json({ success: false, error: 'Order ID and reason required' }, { status: 400 });
    }

    const { data: order } = await auth.supabase
      .from('orders')
      .select('id, status, customer_id')
      .eq('id', orderId)
      .eq('customer_id', auth.user.id)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (!['Delivered', 'Shipped'].includes(order.status)) {
      return NextResponse.json({ success: false, error: 'Returns only available for shipped/delivered orders' }, { status: 400 });
    }

    const { data: existing } = await auth.supabase
      .from('return_requests')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error: 'Return already requested for this order' }, { status: 400 });
    }

    const { data: returnReq, error } = await auth.supabase
      .from('return_requests')
      .insert({
        order_id: orderId,
        customer_id: auth.user.id,
        reason: reason.trim(),
        status: 'Pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, returnRequest: returnReq });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const auth = await getAuthUser(token);
  if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data } = await auth.supabase
    .from('return_requests')
    .select('*, orders(id, total, status, created_at)')
    .eq('customer_id', auth.user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ success: true, returns: data || [] });
}
