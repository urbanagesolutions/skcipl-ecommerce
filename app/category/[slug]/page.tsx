import { FALLBACK_CATEGORIES } from '@/lib/data';
import CategoryClient from './CategoryClient';

export async function generateStaticParams() {
  return FALLBACK_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPageWrapper({ params }: PageProps) {
  const resolvedParams = await params;
  return <CategoryClient slug={resolvedParams.slug} />;
}
