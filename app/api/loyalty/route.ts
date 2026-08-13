import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const auth = await getAuthUser(token);
  if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data: customer } = await auth.supabase
    .from('customers')
    .select('loyalty_points')
    .eq('user_id', auth.user.id)
    .maybeSingle();

  const { data: transactions } = await auth.supabase
    .from('loyalty_transactions')
    .select('*')
    .eq('customer_id', auth.user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json({
    success: true,
    points: customer?.loyalty_points ?? 0,
    transactions: transactions || [],
  });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const auth = await getAuthUser(token);
  if (!auth) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const pointsToRedeem = Number(body.points) || 0;

  if (pointsToRedeem < 100) {
    return NextResponse.json({ success: false, error: 'Minimum 100 points to redeem' }, { status: 400 });
  }

  const { data: customer } = await auth.supabase
    .from('customers')
    .select('loyalty_points')
    .eq('user_id', auth.user.id)
    .maybeSingle();

  const current = customer?.loyalty_points ?? 0;
  if (pointsToRedeem > current) {
    return NextResponse.json({ success: false, error: 'Insufficient points' }, { status: 400 });
  }

  const discountValue = Math.floor(pointsToRedeem / 10);
  await auth.supabase
    .from('customers')
    .update({ loyalty_points: current - pointsToRedeem })
    .eq('user_id', auth.user.id);

  await auth.supabase.from('loyalty_transactions').insert({
    customer_id: auth.user.id,
    points: -pointsToRedeem,
    type: 'redeem',
    description: `Redeemed for ₹${discountValue} discount`,
  });

  return NextResponse.json({
    success: true,
    discountValue,
    remainingPoints: current - pointsToRedeem,
  });
}
