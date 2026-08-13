import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { addTrackingEvent } from '@/lib/shipment-utils';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('X-Shiprocket-Secret') || request.headers.get('x-webhook-secret');
    const expected = process.env.SHIPROCKET_WEBHOOK_SECRET;
    if (expected && secret !== expected) {
      return NextResponse.json({ success: false, error: 'Invalid webhook secret' }, { status: 401 });
    }

    const body = await request.json();
    const awb = body.awb || body.tracking_number || body.shipment?.awb;
    if (!awb) {
      return NextResponse.json({ success: false, error: 'AWB not found in payload' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: shipment } = await supabase
      .from('shipments')
      .select('id')
      .eq('tracking_number', String(awb))
      .maybeSingle();

    if (!shipment) {
      return NextResponse.json({ success: false, error: 'Shipment not found' }, { status: 404 });
    }

    const scans = body.scans || body.tracking_data?.shipment_track || [body];
    const events = Array.isArray(scans) ? scans : [scans];

    for (const scan of events) {
      const description = scan.activity || scan.status || scan.remark || scan.description || 'Status update';
      const location = scan.location || scan.city || null;
      const occurredAt = scan.date || scan.timestamp || new Date().toISOString();
      const eventCode = (scan.status_code || scan.activity || description).toString().toUpperCase().replace(/\s+/g, '_');

      await addTrackingEvent(shipment.id, {
        eventCode,
        description,
        location: location || undefined,
        occurredAt,
        rawPayload: scan,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
