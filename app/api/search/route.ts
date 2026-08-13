import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (q.length < 2) {
    return NextResponse.json({ success: true, products: [] });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ success: false, error: 'Not configured' }, { status: 500 });
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price, mrp, images, stock_quantity, categories(name)')
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,description.ilike.%${q}%,sku.ilike.%${q}%`)
    .limit(24);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, products: data || [] });
}
