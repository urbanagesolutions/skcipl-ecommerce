import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company_name, contact_name, email, phone, gst_number, message } = body;

    if (!company_name || !contact_name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from('b2b_inquiries').insert({
      company_name,
      contact_name,
      email,
      phone,
      gst_number: gst_number || null,
      message: message || null,
      status: 'New',
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Inquiry submitted. Our team will contact you within 24 hours.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
