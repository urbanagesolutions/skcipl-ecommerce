import { createServiceClient } from './supabase-server';
import { buildTrackingUrl, findCarrierByName, findCarrierBySlug } from './carriers';
import { detectCarrierFromTrackingNumber } from './carrier-detect';
import { sendShipmentNotification, sendTrackingEventNotification } from './notifications';
import { syncTrackingToRazorpay } from './razorpay-tracking';

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Partially Shipped'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type ShipmentStatus =
  | 'Label Created'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Exception'
  | 'Returned';

export interface CreateShipmentInput {
  orderId: string;
  trackingNumber: string;
  carrierSlug?: string;
  carrierName?: string;
  shippedAt?: string;
  markOrderAs?: 'Shipped' | 'Partially Shipped' | 'none';
  trackingUrl?: string;
  items?: { orderItemId: string; quantity: number }[];
  notifyCustomer?: boolean;
}

export interface ShipmentRecord {
  id: string;
  order_id: string;
  carrier_id: string | null;
  carrier_name: string | null;
  tracking_number: string;
  tracking_url: string | null;
  status: ShipmentStatus;
  shipped_at: string | null;
  delivered_at: string | null;
  estimated_delivery: string | null;
  created_at: string;
}

function mapShipmentStatusToOrderStatus(
  shipmentStatuses: ShipmentStatus[],
  currentOrderStatus: string
): OrderStatus {
  if (shipmentStatuses.every((s) => s === 'Delivered')) return 'Delivered';
  if (shipmentStatuses.some((s) => s === 'Delivered') && shipmentStatuses.some((s) => s !== 'Delivered')) {
    return 'Partially Shipped';
  }
  if (shipmentStatuses.some((s) => ['In Transit', 'Out for Delivery', 'Delivered'].includes(s))) {
    return shipmentStatuses.length > 1 && shipmentStatuses.some((s) => s === 'Label Created')
      ? 'Partially Shipped'
      : 'Shipped';
  }
  return (currentOrderStatus as OrderStatus) || 'Processing';
}

export async function createShipment(input: CreateShipmentInput) {
  const supabase = createServiceClient();

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, status, customer_id, total, razorpay_order_id, courier_name, tracking_number')
    .eq('id', input.orderId)
    .maybeSingle();

  if (orderErr || !order) throw new Error('Order not found');

  const { data: carriers } = await supabase
    .from('shipping_carriers')
    .select('*')
    .eq('is_enabled', true);

  const carrierList = carriers || [];
  let carrier = input.carrierSlug
    ? findCarrierBySlug(input.carrierSlug, carrierList)
    : input.carrierName
    ? findCarrierByName(input.carrierName, carrierList)
    : null;

  if (!carrier) {
    carrier = detectCarrierFromTrackingNumber(input.trackingNumber, carrierList);
  }

  const carrierName = carrier?.name || input.carrierName || 'Other / Custom';
  const carrierId = carrierList.find((c) => c.slug === carrier?.slug)?.id ?? null;
  const trackingUrl =
    input.trackingUrl ||
    (carrier?.tracking_url_template
      ? buildTrackingUrl(carrier.tracking_url_template, input.trackingNumber)
      : '');

  const shippedAt = input.shippedAt || new Date().toISOString();

  const { data: shipment, error: shipErr } = await supabase
    .from('shipments')
    .insert({
      order_id: input.orderId,
      carrier_id: carrierId,
      carrier_name: carrierName,
      tracking_number: input.trackingNumber.trim(),
      tracking_url: trackingUrl || null,
      status: 'In Transit',
      shipped_at: shippedAt,
    })
    .select()
    .single();

  if (shipErr) throw new Error(shipErr.message);

  if (input.items?.length) {
    await supabase.from('shipment_items').insert(
      input.items.map((item) => ({
        shipment_id: shipment.id,
        order_item_id: item.orderItemId,
        quantity: item.quantity,
      }))
    );
  }

  // Initial tracking event
  await supabase.from('tracking_events').insert({
    shipment_id: shipment.id,
    event_code: 'SHIPPED',
    description: `Shipment dispatched via ${carrierName}`,
    location: null,
    occurred_at: shippedAt,
  });

  // Update order status
  let newOrderStatus: OrderStatus = order.status as OrderStatus;
  if (input.markOrderAs && input.markOrderAs !== 'none') {
    newOrderStatus = input.markOrderAs;
  } else {
    const { data: allShipments } = await supabase
      .from('shipments')
      .select('status')
      .eq('order_id', input.orderId);
    newOrderStatus = mapShipmentStatusToOrderStatus(
      (allShipments || []).map((s) => s.status as ShipmentStatus),
      order.status
    );
  }

  await supabase
    .from('orders')
    .update({
      status: newOrderStatus,
      courier_name: carrierName,
      tracking_number: input.trackingNumber.trim(),
    })
    .eq('id', input.orderId);

  // Customer notification
  if (input.notifyCustomer !== false) {
    const { data: customer } = await supabase
      .from('customers')
      .select('name, email, phone')
      .eq('user_id', order.customer_id)
      .maybeSingle();

    if (customer) {
      await sendShipmentNotification({
        orderId: input.orderId,
        customerEmail: customer.email || '',
        customerPhone: customer.phone || undefined,
        customerName: customer.name || undefined,
        total: Number(order.total),
        status: newOrderStatus,
        shipments: [{
          carrierName,
          trackingNumber: input.trackingNumber.trim(),
          trackingUrl: trackingUrl || undefined,
        }],
      });
    }
  }

  // Razorpay sync
  if (order.razorpay_order_id) {
    await syncTrackingToRazorpay({
      razorpayOrderId: order.razorpay_order_id,
      trackingNumber: input.trackingNumber.trim(),
      carrierName,
      shippedAt,
    });
  }

  return shipment as ShipmentRecord;
}

export async function getShipmentsForOrder(orderId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('shipments')
    .select(`
      *,
      shipment_items(id, order_item_id, quantity),
      tracking_events(id, event_code, description, location, occurred_at)
    `)
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addTrackingEvent(
  shipmentId: string,
  event: { eventCode: string; description: string; location?: string; occurredAt?: string; rawPayload?: unknown }
) {
  const supabase = createServiceClient();

  const { data: shipment } = await supabase
    .from('shipments')
    .select('*, orders(id, status, customer_id, total, razorpay_order_id)')
    .eq('id', shipmentId)
    .maybeSingle();

  if (!shipment) throw new Error('Shipment not found');

  const occurredAt = event.occurredAt || new Date().toISOString();

  await supabase.from('tracking_events').insert({
    shipment_id: shipmentId,
    event_code: event.eventCode,
    description: event.description,
    location: event.location || null,
    occurred_at: occurredAt,
    raw_payload: event.rawPayload || null,
  });

  // Map event to shipment status
  let newShipmentStatus: ShipmentStatus = shipment.status as ShipmentStatus;
  const code = event.eventCode.toUpperCase();
  if (code.includes('DELIVER')) newShipmentStatus = 'Delivered';
  else if (code.includes('OUT_FOR') || code.includes('OFD')) newShipmentStatus = 'Out for Delivery';
  else if (code.includes('TRANSIT') || code.includes('INTRANSIT')) newShipmentStatus = 'In Transit';
  else if (code.includes('EXCEPTION')) newShipmentStatus = 'Exception';

  const updates: Record<string, unknown> = { status: newShipmentStatus };
  if (newShipmentStatus === 'Delivered') updates.delivered_at = occurredAt;

  await supabase.from('shipments').update(updates).eq('id', shipmentId);

  // Update order status from all shipments
  const { data: allShipments } = await supabase
    .from('shipments')
    .select('status')
    .eq('order_id', shipment.order_id);

  const orderStatus = mapShipmentStatusToOrderStatus(
    (allShipments || []).map((s) => s.status as ShipmentStatus),
    shipment.orders?.status || 'Processing'
  );

  await supabase.from('orders').update({ status: orderStatus }).eq('id', shipment.order_id);

  // Notify on key events
  const { data: settings } = await supabase.from('tracking_settings').select('*').limit(1).maybeSingle();
  const shouldNotify =
    (newShipmentStatus === 'In Transit' && settings?.notify_in_transit !== false) ||
    (newShipmentStatus === 'Out for Delivery' && settings?.notify_out_for_delivery !== false) ||
    (newShipmentStatus === 'Delivered' && settings?.notify_delivered !== false);

  if (shouldNotify && shipment.orders?.customer_id) {
    const { data: customer } = await supabase
      .from('customers')
      .select('name, email, phone')
      .eq('user_id', shipment.orders.customer_id)
      .maybeSingle();

    if (customer?.email) {
      await sendTrackingEventNotification({
        orderId: shipment.order_id,
        customerEmail: customer.email,
        customerPhone: customer.phone || undefined,
        customerName: customer.name || undefined,
        eventDescription: event.description,
        shipmentStatus: newShipmentStatus,
        trackingNumber: shipment.tracking_number,
        trackingUrl: shipment.tracking_url || undefined,
        carrierName: shipment.carrier_name || undefined,
      });
    }
  }

  return { shipmentStatus: newShipmentStatus, orderStatus };
}

export async function deleteShipment(shipmentId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('shipments').delete().eq('id', shipmentId);
  if (error) throw new Error(error.message);
}

export async function updateShipment(
  shipmentId: string,
  updates: Partial<{ trackingNumber: string; carrierName: string; carrierSlug: string; status: ShipmentStatus; trackingUrl: string }>
) {
  const supabase = createServiceClient();
  const patch: Record<string, unknown> = {};

  if (updates.trackingNumber) patch.tracking_number = updates.trackingNumber;
  if (updates.carrierName) patch.carrier_name = updates.carrierName;
  if (updates.status) patch.status = updates.status;
  if (updates.trackingUrl) patch.tracking_url = updates.trackingUrl;

  if (updates.carrierSlug || updates.trackingNumber) {
    const { data: carriers } = await supabase.from('shipping_carriers').select('*').eq('is_enabled', true);
    const carrier = updates.carrierSlug
      ? findCarrierBySlug(updates.carrierSlug, carriers || [])
      : updates.carrierName
      ? findCarrierByName(updates.carrierName, carriers || [])
      : null;
    if (carrier) {
      patch.carrier_name = carrier.name;
      patch.carrier_id = (carriers || []).find((c) => c.slug === carrier.slug)?.id;
      if (updates.trackingNumber && carrier.tracking_url_template) {
        patch.tracking_url = buildTrackingUrl(carrier.tracking_url_template, updates.trackingNumber);
      }
    }
  }

  const { data, error } = await supabase
    .from('shipments')
    .update(patch)
    .eq('id', shipmentId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function importShipmentsFromCsv(rows: Record<string, string>[]) {
  const results: { row: number; success: boolean; error?: string; orderId?: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const orderId = row.order_id?.trim();
    const trackingNumber = row.tracking_number?.trim();
    const provider = row.tracking_provider?.trim();

    if (!orderId || !trackingNumber) {
      results.push({ row: i + 1, success: false, error: 'Missing order_id or tracking_number' });
      continue;
    }

    const statusShipped = row.status_shipped?.trim() || '1';
    let markOrderAs: CreateShipmentInput['markOrderAs'] = 'Shipped';
    if (statusShipped === '0') markOrderAs = 'none';
    else if (statusShipped === '2') markOrderAs = 'Partially Shipped';

    try {
      await createShipment({
        orderId,
        trackingNumber,
        carrierName: provider,
        shippedAt: row.date_shipped ? parseCsvDate(row.date_shipped) : undefined,
        markOrderAs,
      });
      results.push({ row: i + 1, success: true, orderId });
    } catch (err) {
      results.push({
        row: i + 1,
        success: false,
        error: err instanceof Error ? err.message : 'Import failed',
        orderId,
      });
    }
  }

  return results;
}

function parseCsvDate(dateStr: string): string {
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    // Try DD-MM-YYYY then MM-DD-YYYY
    const [a, b, c] = parts.map(Number);
    if (a > 12) return new Date(c, b - 1, a).toISOString();
    return new Date(c, a - 1, b).toISOString();
  }
  return new Date(dateStr).toISOString();
}

export function verifyAdminKey(request: Request): boolean {
  const key = request.headers.get('X-Admin-Key');
  const expected = process.env.ADMIN_API_KEY;
  return Boolean(expected && key === expected);
}

export function verifyCronSecret(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && auth === `Bearer ${secret}`);
}
