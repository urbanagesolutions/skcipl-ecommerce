import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { addTrackingEvent, verifyCronSecret } from '@/lib/shipment-utils';

async function fetchShiprocketTracking(awb: string): Promise<{ activity: string; location?: string; date?: string }[]> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) return [];

  try {
    const loginRes = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!loginRes.ok) return [];
    const { token } = await loginRes.json();

    const trackRes = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(awb)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!trackRes.ok) return [];
    const data = await trackRes.json();
    return data?.tracking_data?.shipment_track || data?.scans || [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const staleDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data: shipments } = await supabase
      .from('shipments')
      .select('id, tracking_number, status, updated_at')
      .in('status', ['Label Created', 'In Transit', 'Out for Delivery'])
      .lt('updated_at', staleDate)
      .limit(50);

    let synced = 0;
    for (const shipment of shipments || []) {
      const scans = await fetchShiprocketTracking(shipment.tracking_number);
      if (!scans.length) continue;

      const latest = scans[scans.length - 1];
      await addTrackingEvent(shipment.id, {
        eventCode: (latest.activity || 'UPDATE').toUpperCase().replace(/\s+/g, '_'),
        description: latest.activity || 'Tracking update',
        location: latest.location,
        occurredAt: latest.date || new Date().toISOString(),
        rawPayload: latest,
      });
      synced++;
    }

    return NextResponse.json({ success: true, synced, checked: (shipments || []).length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
