import { MetadataRoute } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sabarikrishna.in';

  const staticPages = [
    '', '/about', '/contact', '/careers', '/b2b', '/search',
    '/privacy-policy', '/terms-of-service', '/shipping-policy', '/refund-policy',
    '/category/ghee', '/category/oils', '/category/groceries',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  let productPages: MetadataRoute.Sitemap = [];

  if (isSupabaseConfigured()) {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true);

      productPages = (products || []).map((p) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: new Date(p.updated_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    } catch {
      productPages = [];
    }
  }

  return [...staticPages, ...productPages];
}
