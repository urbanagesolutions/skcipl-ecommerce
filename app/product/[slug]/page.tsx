import { STATIC_PRODUCTS } from '@/lib/data';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  return STATIC_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPageWrapper({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductDetailClient slug={resolvedParams.slug} />;
}
