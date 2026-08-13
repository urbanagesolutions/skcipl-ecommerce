import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { fetchRecommendedProducts } from '@/lib/data';

interface ProductRecommendationsProps {
  categoryId?: string | null;
  excludeProductId?: string;
  title?: string;
}

export async function ProductRecommendations({
  categoryId,
  excludeProductId,
  title = 'You May Also Like',
}: ProductRecommendationsProps) {
  const products = await fetchRecommendedProducts(categoryId, excludeProductId);
  if (!products.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-headline-lg text-on-surface">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`}>
            <Card className="p-3 hover:border-primary transition-all h-full">
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="object-contain max-h-full" />
                ) : null}
              </div>
              <h3 className="font-bold text-sm line-clamp-2">{p.name}</h3>
              <span className="text-price-green font-bold text-sm">₹{p.price}</span>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
