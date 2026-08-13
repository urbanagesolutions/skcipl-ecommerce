import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { sendOrderNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('Authorization');

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: staleCarts } = await supabase
      .from('cart_items')
      .select('customer_id, session_id, products(name), customers(email, name, phone)')
      .not('customer_id', 'is', null)
      .lt('updated_at', cutoff);

    if (!staleCarts?.length) {
      return NextResponse.json({ success: true, notified: 0 });
    }

    const notifiedCustomers = new Set<string>();
    let count = 0;

    for (const item of staleCarts) {
      if (!item.customer_id || notifiedCustomers.has(item.customer_id)) continue;
      notifiedCustomers.add(item.customer_id);

      const customer = item.customers as { email?: string; name?: string; phone?: string } | null;
      if (customer?.email) {
        await sendOrderNotification({
          orderId: 'CART-REMINDER',
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerName: customer.name,
          total: 0,
          status: 'Items waiting in your cart — complete checkout today!',
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, notified: count });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
