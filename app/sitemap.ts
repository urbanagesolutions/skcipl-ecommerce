import { MetadataRoute } from 'next';
import { STATIC_PRODUCTS } from '@/lib/data';

export const dynamic = 'force-static';

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

  const productPages: MetadataRoute.Sitemap = STATIC_PRODUCTS.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
