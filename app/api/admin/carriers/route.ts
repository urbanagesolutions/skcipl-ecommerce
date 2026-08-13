import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { getAuthUser } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from('shipping_carriers')
      .select('*')
      .order('name');
    return NextResponse.json({ success: true, carriers: data || [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const auth = await getAuthUser(token);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: staff } = await auth.supabase.from('staff').select('role').eq('user_id', auth.user.id).maybeSingle();
    if (!staff) return NextResponse.json({ success: false, error: 'Staff required' }, { status: 403 });

    const body = await request.json();
    const supabase = createServiceClient();

    if (body.action === 'toggle') {
      const { error } = await supabase
        .from('shipping_carriers')
        .update({ is_enabled: body.is_enabled })
        .eq('id', body.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (body.action === 'create') {
      const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-');
      const { data, error } = await supabase
        .from('shipping_carriers')
        .insert({
          name: body.name,
          slug,
          tracking_url_template: body.tracking_url_template || '',
          is_custom: true,
          is_enabled: true,
        })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, carrier: data });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const auth = await getAuthUser(token);
    if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: staff } = await auth.supabase.from('staff').select('role').eq('user_id', auth.user.id).maybeSingle();
    if (!staff) return NextResponse.json({ success: false, error: 'Staff required' }, { status: 403 });

    const body = await request.json();
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('tracking_settings')
      .update(body)
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select()
      .limit(1);

    if (error) throw error;
    return NextResponse.json({ success: true, settings: data?.[0] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
