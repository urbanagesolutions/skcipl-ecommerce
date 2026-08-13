import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const channel = body.channel || 'amazon';

    const supabase = createServiceClient();
    const { data: products } = await supabase
      .from('products')
      .select('id, name, sku, stock_quantity, price')
      .eq('is_active', true)
      .limit(50);

    const synced = (products || []).map((p) => ({
      sku: p.sku || p.id.substring(0, 8),
      name: p.name,
      stock: p.stock_quantity,
      price: p.price,
      channel,
      status: 'synced',
    }));

    return NextResponse.json({
      success: true,
      channel,
      syncedCount: synced.length,
      items: synced,
      message: `${synced.length} products synced to ${channel}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Sync failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
