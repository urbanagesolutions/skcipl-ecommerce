'use client';

import React from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { STATIC_PRODUCTS, FALLBACK_CATEGORIES } from '@/lib/data';

interface ClientProps {
  slug: string;
}

export default function CategoryClient({ slug }: ClientProps) {
  const currentCategory = FALLBACK_CATEGORIES.find((c) => c.slug === slug) || {
    id: slug,
    name: slug.replace(/-/g, ' ').toUpperCase(),
    slug: slug,
    description: 'Authentic consumables produced with traditional care by Sabari Krishna Consumables India Private Limited.',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    requires_fssai_display: true
  };

  // Find matching products
  const matchingProducts = STATIC_PRODUCTS.filter(
    (p) => p.category_name.toLowerCase().includes(currentCategory.name.toLowerCase()) ||
           currentCategory.slug.includes('all') ||
           (slug.includes('ghee') && p.category_name.toLowerCase().includes('ghee')) ||
           (slug.includes('oil') && p.category_name.toLowerCase().includes('oil')) ||
           (slug.includes('grocer') && p.category_name.toLowerCase().includes('grocer'))
  );

  const displayProducts = matchingProducts.length > 0 ? matchingProducts : STATIC_PRODUCTS;

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white py-14 border-b border-[#2d4054]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-amber-300 font-semibold">{currentCategory.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif leading-tight">
            {currentCategory.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl font-light leading-relaxed">
            {'description' in currentCategory && typeof (currentCategory as Record<string, unknown>).description === 'string'
              ? ((currentCategory as Record<string, unknown>).description as string)
              : 'Authentic consumables and staples produced with traditional care by Sabari Krishna Consumables India Private Limited.'}
          </p>
        </div>
      </section>

      {/* 2. Category Navigation Tabs */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap gap-2 pb-2 border-b border-border-subtle">
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface transition-colors"
          >
            All Products
          </Link>
          {FALLBACK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                cat.slug === slug
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-border-subtle text-on-surface-variant hover:bg-surface'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/gks-mart"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Store size={13} />
            <span>GKS Mart (gksmart.in)</span>
          </Link>
        </div>
      </section>

      {/* 3. Products Grid */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-border-subtle overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-52 bg-surface relative overflow-hidden flex items-center justify-center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-xs ${
                      product.brand === 'GKS Mart' ? 'bg-emerald-600' : 'bg-primary'
                    }`}>
                      {product.brand}
                    </span>
                    {product.bestseller && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-xs font-semibold text-primary block">
                    {product.category_name}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="pt-2 border-t border-border-subtle">
                    <span className="text-[11px] text-warm-gray block mb-1">Available Sizes:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.pack_sizes.map((pack, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle text-on-surface font-medium">
                          {pack}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-border-subtle/50 mt-4 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-warm-gray block">Pricing Guide</span>
                  <span className="text-base font-bold text-on-surface">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-warm-gray line-through ml-1.5">
                    ₹{product.mrp}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="px-3 py-2 rounded-lg border border-border-subtle text-xs font-semibold text-on-surface hover:bg-surface transition-colors"
                  >
                    Details
                  </Link>

                  <a
                    href={`https://wa.me/919842228484?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20am%20interested%20in%20ordering%20${encodeURIComponent(product.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Inquire</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
