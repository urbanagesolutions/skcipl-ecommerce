import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase-server';

const FAQ: Record<string, string> = {
  ghee: 'Our Sabari GKS Ghee is hand-churned, FSSAI certified, and available in 500ml and 1L packs. Browse /category/ghee for all options.',
  fssai: 'Our FSSAI License No. is displayed in the website footer. All food products comply with FSSAI regulations.',
  oil: 'We offer cold-pressed coconut, mustard, and groundnut oils. Visit /category/oils to explore.',
  track: 'You can track your order from My Account → Recent Orders → Track button, or visit /account directly.',
  cod: 'Cash on Delivery is available with SMS OTP verification at checkout for orders across India.',
  shipping: 'Free shipping on orders above ₹999. Standard delivery takes 2-7 business days depending on your pincode.',
  return: 'You can request a return from My Account within 7 days of delivery. Visit /account/returns.',
  wholesale: 'For bulk/wholesale orders, visit our B2B page at /b2b to submit an inquiry.',
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, answer] of Object.entries(FAQ)) {
    if (lower.includes(key)) return answer;
  }
  if (lower.includes('order') && (lower.includes('status') || lower.includes('track'))) {
    return FAQ.track;
  }
  if (lower.includes('hello') || lower.includes('hi')) {
    return 'Hello! Welcome to Sabari Krishna Consumables. Ask me about ghee, oils, FSSAI details, order tracking, COD, shipping, or wholesale orders.';
  }
  return `Thanks for your question about "${message}". For detailed assistance, email support@sabarikrishna.in or call our support line. You can also browse our catalog at /category/ghee.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, token } = body;

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Message required' }, { status: 400 });
    }

    if (token) {
      const auth = await getAuthUser(token);
      if (auth) {
        const lower = message.toLowerCase();
        if (lower.includes('track') || lower.includes('order status')) {
          const { data: orders } = await auth.supabase
            .from('orders')
            .select('id, status, total, created_at')
            .eq('customer_id', auth.user.id)
            .order('created_at', { ascending: false })
            .limit(3);

          if (orders?.length) {
            const list = orders.map((o) =>
              `#${o.id.substring(0, 8).toUpperCase()} — ${o.status} — ₹${o.total}`
            ).join('\n');
            return NextResponse.json({
              success: true,
              reply: `Your recent orders:\n${list}\n\nTrack any order at /account`,
            });
          }
          return NextResponse.json({
            success: true,
            reply: 'You have no orders yet. Start shopping at /category/ghee!',
          });
        }
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant for Sabari Krishna Consumables, an Indian FMCG e-commerce store selling ghee, oils, and groceries. Be concise and friendly. Mention relevant page paths when helpful.',
              },
              { role: 'user', content: message },
            ],
            max_tokens: 200,
          }),
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return NextResponse.json({ success: true, reply });
      } catch {
        // fall through to rule-based
      }
    }

    return NextResponse.json({ success: true, reply: getBotResponse(message) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Chat error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
