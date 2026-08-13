import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase-server';
import { deleteShipment, updateShipment, verifyAdminKey } from '@/lib/shipment-utils';

async function isStaff(token: string): Promise<boolean> {
  const auth = await getAuthUser(token);
  if (!auth) return false;
  const { data } = await auth.supabase.from('staff').select('role').eq('user_id', auth.user.id).maybeSingle();
  return Boolean(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminKey = verifyAdminKey(request);
    if (!adminKey) {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const token = authHeader.split(' ')[1];
      if (!(await isStaff(token))) {
        return NextResponse.json({ success: false, error: 'Staff access required' }, { status: 403 });
      }
    }

    const body = await request.json();
    const shipment = await updateShipment(params.id, body);
    return NextResponse.json({ success: true, shipment });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminKey = verifyAdminKey(request);
    if (!adminKey) {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      const token = authHeader.split(' ')[1];
      if (!(await isStaff(token))) {
        return NextResponse.json({ success: false, error: 'Staff access required' }, { status: 403 });
      }
    }

    await deleteShipment(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
