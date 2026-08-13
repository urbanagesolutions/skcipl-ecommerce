import { buildTrackingWidgetHtml } from '@/lib/tracking-widget-html';

export interface OrderNotificationPayload {
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  total: number;
  status: string;
}

export interface ShipmentNotificationPayload extends OrderNotificationPayload {
  shipments: {
    carrierName: string;
    trackingNumber: string;
    trackingUrl?: string;
  }[];
}

export interface TrackingEventNotificationPayload {
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  eventDescription: string;
  shipmentStatus: string;
  trackingNumber: string;
  trackingUrl?: string;
  carrierName?: string;
}

export async function sendOrderNotification(payload: OrderNotificationPayload): Promise<boolean> {
  const msg91Key = process.env.MSG91_AUTH_KEY;

  const subject = `Order ${payload.status} - #${payload.orderId.substring(0, 8).toUpperCase()}`;
  const body = `Dear ${payload.customerName || 'Customer'},\n\nYour order #${payload.orderId.substring(0, 8).toUpperCase()} is now ${payload.status}.\nTotal: ₹${payload.total}\n\nThank you for shopping with Sabari Krishna Consumables.`;

  console.log(`[NOTIFICATION] ${subject}`);
  console.log(body);

  if (payload.customerPhone && msg91Key) {
    try {
      const phone = payload.customerPhone.replace(/\D/g, '');
      const formatted = phone.length === 10 ? '91' + phone : phone;
      await fetch('https://control.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: msg91Key,
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_ORDER_TEMPLATE_ID || 'order_update',
          recipients: [{ mobiles: formatted, var: payload.status, var1: payload.orderId.substring(0, 8) }],
        }),
      });
    } catch (err) {
      console.error('SMS notification failed:', err);
    }
  }

  if (process.env.RESEND_API_KEY && payload.customerEmail) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'orders@sabarikrishna.in',
          to: payload.customerEmail,
          subject,
          text: body,
        }),
      });
    } catch (err) {
      console.error('Email notification failed:', err);
    }
  }

  return true;
}

export async function sendShipmentNotification(payload: ShipmentNotificationPayload): Promise<boolean> {
  const shortId = payload.orderId.substring(0, 8).toUpperCase();
  const subject = `Your order #${shortId} has been shipped!`;
  const trackingHtml = buildTrackingWidgetHtml(
    payload.shipments.map((s) => ({
      carrierName: s.carrierName,
      trackingNumber: s.trackingNumber,
      trackingUrl: s.trackingUrl,
      status: payload.status,
    }))
  );

  const textBody = `Dear ${payload.customerName || 'Customer'},\n\nGreat news! Your order #${shortId} is now ${payload.status}.\n\n${payload.shipments.map((s) => `${s.carrierName}: ${s.trackingNumber}${s.trackingUrl ? ` — ${s.trackingUrl}` : ''}`).join('\n')}\n\nThank you for shopping with Sabari Krishna Consumables.`;

  console.log(`[SHIPMENT NOTIFICATION] ${subject}`);

  if (payload.customerPhone && process.env.MSG91_AUTH_KEY) {
    try {
      const phone = payload.customerPhone.replace(/\D/g, '');
      const formatted = phone.length === 10 ? '91' + phone : phone;
      await fetch('https://control.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: process.env.MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_SHIPMENT_TEMPLATE_ID || process.env.MSG91_ORDER_TEMPLATE_ID || 'shipment_update',
          recipients: [{
            mobiles: formatted,
            var: payload.shipments[0]?.trackingNumber || '',
            var1: shortId,
          }],
        }),
      });
    } catch (err) {
      console.error('Shipment SMS failed:', err);
    }
  }

  if (process.env.RESEND_API_KEY && payload.customerEmail) {
    try {
      const htmlBody = `
        <p>Dear ${payload.customerName || 'Customer'},</p>
        <p>Great news! Your order <strong>#${shortId}</strong> is now <strong>${payload.status}</strong>.</p>
        ${trackingHtml}
        <p style="margin-top:16px;font-size:13px;color:#666;">Thank you for shopping with Sabari Krishna Consumables.</p>
      `;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'orders@sabarikrishna.in',
          to: payload.customerEmail,
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });
    } catch (err) {
      console.error('Shipment email failed:', err);
    }
  }

  return true;
}

export async function sendTrackingEventNotification(payload: TrackingEventNotificationPayload): Promise<boolean> {
  const shortId = payload.orderId.substring(0, 8).toUpperCase();
  const subject = `Shipment update — Order #${shortId}: ${payload.shipmentStatus}`;
  const textBody = `Dear ${payload.customerName || 'Customer'},\n\nUpdate on your shipment (${payload.carrierName || 'Courier'}):\n${payload.eventDescription}\n\nTracking: ${payload.trackingNumber}${payload.trackingUrl ? `\nTrack: ${payload.trackingUrl}` : ''}`;

  if (payload.customerPhone && process.env.MSG91_AUTH_KEY) {
    try {
      const phone = payload.customerPhone.replace(/\D/g, '');
      const formatted = phone.length === 10 ? '91' + phone : phone;
      await fetch('https://control.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: process.env.MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
          template_id: process.env.MSG91_SHIPMENT_TEMPLATE_ID || process.env.MSG91_ORDER_TEMPLATE_ID || 'tracking_event',
          recipients: [{ mobiles: formatted, var: payload.shipmentStatus, var1: shortId }],
        }),
      });
    } catch (err) {
      console.error('Tracking event SMS failed:', err);
    }
  }

  if (process.env.RESEND_API_KEY && payload.customerEmail) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'orders@sabarikrishna.in',
          to: payload.customerEmail,
          subject,
          text: textBody,
        }),
      });
    } catch (err) {
      console.error('Tracking event email failed:', err);
    }
  }

  return true;
}
