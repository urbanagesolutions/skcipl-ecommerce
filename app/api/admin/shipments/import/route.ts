import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase-server';
import { importShipmentsFromCsv, verifyAdminKey } from '@/lib/shipment-utils';

async function isStaff(token: string): Promise<boolean> {
  const auth = await getAuthUser(token);
  if (!auth) return false;
  const { data } = await auth.supabase.from('staff').select('role').eq('user_id', auth.user.id).maybeSingle();
  return Boolean(data);
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

export async function POST(request: Request) {
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

    const contentType = request.headers.get('content-type') || '';
    let rows: Record<string, string>[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) return NextResponse.json({ success: false, error: 'CSV file required' }, { status: 400 });
      const text = await file.text();
      rows = parseCsv(text);
    } else {
      const body = await request.json();
      rows = body.rows || [];
    }

    if (!rows.length) {
      return NextResponse.json({ success: false, error: 'No rows to import' }, { status: 400 });
    }

    const results = await importShipmentsFromCsv(rows);
    const successCount = results.filter((r) => r.success).length;
    const errorCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      imported: successCount,
      errors: errorCount,
      results,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
