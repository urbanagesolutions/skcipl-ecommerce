/** Push shipment tracking to Razorpay to reduce disputes and release payment holds */

export interface RazorpayTrackingPayload {
  razorpayOrderId: string;
  trackingNumber: string;
  carrierName: string;
  shippedAt?: string;
}

export async function syncTrackingToRazorpay(payload: RazorpayTrackingPayload): Promise<boolean> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !payload.razorpayOrderId) return false;

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const res = await fetch(`https://api.razorpay.com/v1/orders/${payload.razorpayOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        notes: {
          tracking_number: payload.trackingNumber,
          carrier: payload.carrierName,
          shipped_at: payload.shippedAt || new Date().toISOString(),
        },
      }),
    });
    if (!res.ok) {
      console.error('[Razorpay tracking sync] failed:', await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Razorpay tracking sync] error:', err);
    return false;
  }
}
