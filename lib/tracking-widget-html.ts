import type { TrackingWidgetShipment } from '@/components/TrackingWidget';

export function buildTrackingWidgetHtml(
  shipments: TrackingWidgetShipment[],
  primaryColor = '#2D5016'
): string {
  if (!shipments.length) return '';
  const items = shipments
    .map(
      (s) => `
    <div style="border:1px solid #e5e7eb;border-left:4px solid ${primaryColor};border-radius:8px;padding:16px;margin-bottom:12px;">
      <p style="margin:0;font-weight:bold;color:#111;">${s.carrierName}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#666;">AWB: <strong>${s.trackingNumber}</strong></p>
      ${s.trackingUrl ? `<a href="${s.trackingUrl}" style="display:inline-block;margin-top:8px;color:${primaryColor};font-weight:bold;text-decoration:none;">Track Shipment →</a>` : ''}
    </div>`
    )
    .join('');
  return `<div style="font-family:sans-serif;max-width:480px;">${items}</div>`;
}
