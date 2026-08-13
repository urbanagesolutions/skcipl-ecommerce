export interface OrderNotificationPayload {
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  total: number;
  status: string;
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
