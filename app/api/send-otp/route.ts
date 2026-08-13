import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function standardizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required.' }, { status: 400 });
    }

    const standardized = standardizePhone(phone);

    // Fetch latest OTP entry for this user
    const { data: existingOtp } = await supabaseServer
      .from('phone_otps')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingOtp) {
      // Cooldown check (30 seconds)
      const lastCreated = new Date(existingOtp.created_at).getTime();
      const timePassed = (Date.now() - lastCreated) / 1000;
      if (timePassed < 30) {
        const cooldownRemaining = Math.ceil(30 - timePassed);
        return NextResponse.json({
          success: false,
          error: `Please wait ${cooldownRemaining} seconds before requesting a new OTP.`,
          cooldownRemaining
        }, { status: 429 });
      }

      // Max attempts check (5 attempts)
      if (existingOtp.attempts >= 5) {
        return NextResponse.json({
          success: false,
          error: 'Maximum OTP request attempts reached for this session.'
        }, { status: 429 });
      }
    }

    const attempts = existingOtp ? existingOtp.attempts + 1 : 1;
    if (attempts > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum OTP request attempts reached for this session.'
      }, { status: 429 });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiry

    // Delete existing OTP record(s) for this user to keep it clean
    await supabaseServer
      .from('phone_otps')
      .delete()
      .eq('customer_id', user.id);

    // Insert new OTP record
    const { error: insertError } = await supabaseServer
      .from('phone_otps')
      .insert({
        customer_id: user.id,
        phone: standardized,
        otp,
        attempts,
        expires_at: expiresAt
      });

    if (insertError) {
      console.error('Error inserting OTP:', insertError);
      return NextResponse.json({ success: false, error: 'Failed to generate OTP' }, { status: 500 });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    let smsSent = false;
    let smsError = '';

    if (authKey) {
      try {
        const msg91Url = `https://control.msg91.com/api/v5/otp?template_id=64abced123456789abcde&mobile=${standardized}&authkey=${authKey}&otp=${otp}`;
        const response = await fetch(msg91Url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const resData = await response.json().catch(() => ({}));
        if (response.ok && (resData.type === 'success' || resData.success === true)) {
          smsSent = true;
        } else {
          smsError = resData.message || response.statusText || 'Unknown MSG91 response';
        }
      } catch (err: unknown) {
        smsError = err instanceof Error ? err.message : 'Network error';
      }
    } else {
      smsError = 'MSG91_AUTH_KEY not configured';
    }

    // Console logging is mandatory for sandbox/agent testing
    console.log(`\n=============================================`);
    console.log(`[MSG91 SMS OTP]`);
    console.log(`Phone: ${standardized}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Attempts: ${attempts}/5`);
    console.log(`Status: ${smsSent ? 'SENT' : 'MOCKED/FAILED (' + smsError + ')'}`);
    console.log(`=============================================\n`);

    return NextResponse.json({
      success: true,
      message: smsSent ? 'OTP sent successfully.' : 'OTP generated (Mocked/Sandbox mode).',
      mocked: !smsSent
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Error sending OTP:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
