import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase-server';
import { createServiceClient } from '@/lib/supabase-server';
import {
  createShipment,
  getShipmentsForOrder,
  verifyAdminKey,
  type CreateShipmentInput,
} from '@/lib/shipment-utils';

async function isStaff(token: string): Promise<boolean> {
  const auth = await getAuthUser(token);
  if (!auth) return false;
  const { data } = await auth.supabase
    .from('staff')
    .select('role')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  return Boolean(data);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId required' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const adminKey = verifyAdminKey(request);

    if (adminKey) {
      const shipments = await getShipmentsForOrder(orderId);
      return NextResponse.json({ success: true, shipments });
    }

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const auth = await getAuthUser(token);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: order } = await auth.supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .eq('customer_id', auth.user.id)
      .maybeSingle();

    const staff = await isStaff(token);
    if (!order && !staff) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const supabase = staff ? createServiceClient() : auth.supabase;
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        shipment_items(id, order_item_id, quantity),
        tracking_events(id, event_code, description, location, occurred_at)
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, shipments: data || [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const adminKey = verifyAdminKey(request);

    if (!adminKey) {
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const token = authHeader.split(' ')[1];
      const staff = await isStaff(token);
      if (!staff) {
        return NextResponse.json({ success: false, error: 'Staff access required' }, { status: 403 });
      }
    }

    const body = await request.json();
    const input: CreateShipmentInput = {
      orderId: body.orderId,
      trackingNumber: body.trackingNumber,
      carrierSlug: body.carrierSlug,
      carrierName: body.carrierName,
      shippedAt: body.shippedAt,
      markOrderAs: body.markOrderAs || 'Shipped',
      trackingUrl: body.trackingUrl,
      items: body.items,
      notifyCustomer: body.notifyCustomer !== false,
    };

    if (!input.orderId || !input.trackingNumber) {
      return NextResponse.json({ success: false, error: 'orderId and trackingNumber required' }, { status: 400 });
    }

    const shipment = await createShipment(input);
    return NextResponse.json({ success: true, shipment });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
