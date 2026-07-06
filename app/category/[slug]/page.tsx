import React from 'react';
import { fetchCategories } from '@/lib/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Filter, Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await fetchCategories();
  const currentCategory = categories.find(c => c.slug === params.slug) || categories[0];

  // Dummy catalog items filtered by slug
  const mockProducts = [
    { id: '1', name: `Premium Pure ${currentCategory.name} - Pack A`, price: 499, rating: 4.9, img: '/assets/p1.png' },
    { id: '2', name: `Organic Pure ${currentCategory.name} - Pack B`, price: 899, rating: 4.8, img: '/assets/p2.png' },
    { id: '3', name: `Farm Fresh ${currentCategory.name} - Bottle C`, price: 299, rating: 4.6, img: '/assets/p3.png' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      {/* Category header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-headline-lg text-on-surface flex items-center gap-3">
            {currentCategory.name} Collection
          </h1>
          <p className="text-body-sm text-warm-gray mt-1">
            Browse through our premium natural quality range.
          </p>
        </div>
        {currentCategory.requires_fssai_display && (
          <div className="mt-2 sm:mt-0">
            <Badge variant="secondary" className="text-xs">
              Requires FSSAI Compliance
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Filter Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <Card elevation={0} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="font-bold text-on-surface text-title-md flex items-center gap-2">
                <Filter size={16} /> Filters
              </span>
              <button className="text-xs text-primary hover:underline">Clear All</button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <h4 className="text-body-sm font-bold text-on-surface">Price Range</h4>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" className="py-1 text-xs" />
                <span className="text-warm-gray text-xs">to</span>
                <Input type="number" placeholder="Max" className="py-1 text-xs" />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <h4 className="text-body-sm font-bold text-on-surface">Customer Rating</h4>
              <div className="space-y-1.5">
                {[4, 3].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 text-body-sm text-on-surface-variant cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                    <span className="flex items-center gap-0.5 text-yellow-500 font-semibold">
                      {Array(stars).fill('★').join('')}
                      <span className="text-warm-gray text-xs font-normal"> & up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active Categories Shortcut */}
            <div className="space-y-2">
              <h4 className="text-body-sm font-bold text-on-surface">Categories</h4>
              <div className="flex flex-col gap-1.5">
                {categories.map(c => (
                  <Link key={c.id} href={`/category/${c.slug}`} className={`text-body-sm hover:underline ${c.slug === params.slug ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Right Product Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-warm-gray">{mockProducts.length} items found</span>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              Sort By: Relevance <ChevronDown size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((p) => (
              <Card key={p.id} className="flex flex-col justify-between h-full p-4 hover:border-primary transition-all">
                <div className="space-y-3">
                  <div className="h-44 bg-[#faf8f5] rounded-xl flex items-center justify-center text-warm-gray text-xs font-semibold">
                    Product image preview
                  </div>
                  <span className="text-xs text-warm-gray uppercase tracking-wider font-bold">{currentCategory.name}</span>
                  <h3 className="font-bold text-on-surface text-body-lg">{p.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={14} fill="currentColor" />
                    <span className="text-on-surface font-semibold text-xs">{p.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-4">
                  <span className="text-price-display text-price-green font-bold">₹{p.price}</span>
                  <Link href={`/product/pure-desi-cow-ghee`}>
                    <Button variant="secondary" size="sm">
                      ADD +
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export async function generateStaticParams() {
  return [
    { slug: 'ghee' },
    { slug: 'oils' },
    { slug: 'groceries' },
    { slug: 'fashion' }
  ];
}
