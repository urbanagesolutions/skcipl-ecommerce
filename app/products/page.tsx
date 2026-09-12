'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  Store, 
  ShoppingBag
} from 'lucide-react';
import { STATIC_PRODUCTS, FALLBACK_CATEGORIES, CORPORATE_INFO } from '@/lib/data';

export default function ProductsCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = STATIC_PRODUCTS.filter((product) => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.category_name.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesBrand = 
      selectedBrand === 'all' || 
      product.brand === selectedBrand;

    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white py-14 border-b border-[#2d4054]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-amber-300 text-xs font-semibold">
            <ShoppingBag size={14} />
            <span>Official Catalogue • Sabari GKS & GKS Mart (gksmart.in)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif leading-tight">
            Pure Consumables & Grocery Catalogue
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl font-light leading-relaxed">
            Every product is manufactured or curated by <strong>Sabari Krishna Consumables India Private Limited</strong> with strict adherence to FSSAI guidelines, authentic traditional methods, and zero chemical additives.
          </p>
        </div>
      </section>

      {/* 2. Filter & Search Controls */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ghee, groundnut oil, turmeric, rice, honey..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Brand Filter */}
            <div className="md:col-span-6 flex flex-wrap items-center gap-2 justify-start md:justify-end">
              <span className="text-xs font-bold text-warm-gray uppercase tracking-wider mr-1">Brand:</span>
              <button
                onClick={() => setSelectedBrand('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedBrand === 'all' 
                    ? 'bg-on-surface text-white' 
                    : 'bg-surface text-on-surface-variant hover:bg-border-subtle'
                }`}
              >
                All Brands ({STATIC_PRODUCTS.length})
              </button>

              <button
                onClick={() => setSelectedBrand('Sabari GKS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedBrand === 'Sabari GKS' 
                    ? 'bg-primary text-white' 
                    : 'bg-surface text-on-surface-variant hover:bg-border-subtle'
                }`}
              >
                <Sparkles size={12} />
                <span>Sabari GKS</span>
              </button>

              <button
                onClick={() => setSelectedBrand('GKS Mart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedBrand === 'GKS Mart' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-surface text-on-surface-variant hover:bg-border-subtle'
                }`}
              >
                <Store size={12} />
                <span>GKS Mart (gksmart.in)</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-3 border-t border-border-subtle flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-primary-container text-primary font-bold border border-primary/30' 
                  : 'text-on-surface-variant hover:bg-surface border border-transparent'
              }`}
            >
              All Categories
            </button>
            {FALLBACK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.name 
                    ? 'bg-primary-container text-primary font-bold border border-primary/30' 
                    : 'text-on-surface-variant hover:bg-surface border border-transparent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Products Grid */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border-subtle space-y-3">
            <ShoppingBag size={48} className="mx-auto text-warm-gray" />
            <h3 className="font-bold text-lg text-on-surface">No products found</h3>
            <p className="text-xs text-warm-gray max-w-sm mx-auto">
              We couldn’t find products matching your query. Try resetting your search or filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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
                    <div className="absolute bottom-2 right-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1c2a38]/80 text-emerald-300 backdrop-blur-xs">
                        FSSAI Lic. {CORPORATE_INFO.fssai}
                      </span>
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

                    {/* Pack Sizes */}
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
        )}
      </section>

      {/* 4. Bulk / Wholesale Inquiry Callout */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-surface rounded-2xl border border-border-subtle p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-serif text-on-surface">Require Commercial Bulk Packaging?</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              We supply 15-litre tins and barrels for sweet makers, catering contractors, restaurants, and wholesale traders.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/b2b"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-colors"
            >
              Wholesale Pricing
            </Link>
            <a
              href={`tel:${CORPORATE_INFO.phone}`}
              className="px-4 py-2.5 rounded-xl border border-border-subtle text-xs font-semibold hover:bg-white transition-colors"
            >
              Call {CORPORATE_INFO.phone}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
