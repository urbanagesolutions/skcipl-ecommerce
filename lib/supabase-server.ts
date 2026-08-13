import { createClient } from '@supabase/supabase-js';

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase not configured');
  return createClient(url, key);
}

export function createUserClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase not configured');
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function getAuthUser(token: string) {
  const supabase = createUserClient(token);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return { user, supabase };
}
