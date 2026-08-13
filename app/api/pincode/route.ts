import { NextResponse } from 'next/server';
import { checkPincodeDelivery } from '@/lib/delivery';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode') || '';

  const info = checkPincodeDelivery(pincode);
  return NextResponse.json({ success: true, ...info });
}
