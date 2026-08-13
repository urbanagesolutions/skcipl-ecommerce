'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  images: string[];
  categories: { name: string } | null;
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (initialQ) doSearch(initialQ);
  }, [initialQ]);

  const doSearch = async (q: string) => {
    if (q.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
    window.history.replaceState(null, '', `/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-headline-lg text-on-surface mb-6">Search Products</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-xl">
        <Input
          roundedSize="full"
          placeholder="Search ghee, oils, groceries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search size={18} />}
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
        </Button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      )}

      {!loading && products.length === 0 && query.length >= 2 && (
        <p className="text-warm-gray text-center py-8">No products found for &quot;{query}&quot;</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Card key={p.id} className="p-4 space-y-3">
            <Link href={`/product/${p.slug}`}>
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="object-contain max-h-full" />
                ) : (
                  <span className="text-warm-gray text-sm">No image</span>
                )}
              </div>
              <h3 className="font-bold text-on-surface mt-2 line-clamp-2 hover:text-primary">{p.name}</h3>
            </Link>
            <span className="text-xs text-warm-gray">{p.categories?.name}</span>
            <div className="flex justify-between items-center">
              <span className="font-bold text-price-green">₹{p.price}</span>
              <Button size="sm" variant="secondary" onClick={() => addToCart(p.id, null, 1)}>
                Add
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
