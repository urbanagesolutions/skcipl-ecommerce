'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Filter, Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types';

interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  price_override: number | null;
  stock_quantity: number;
}

interface DBProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price: number;
  mrp: number;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  product_variants?: ProductVariant[];
}

interface ClientProduct extends Omit<DBProduct, 'description'> {
  description: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ClientProduct[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'priceAsc' | 'priceDesc' | 'popularity' | 'newest'>('relevance');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        setLoading(true);
        setErrorMsg(null);

        // 1. Fetch categories
        const { data: allCategories, error: catsError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (catsError) throw catsError;
        setCategories(allCategories || []);

        // 2. Find target category
        const targetCategory = (allCategories || []).find(
          c => c.slug === params.slug && c.is_active === true
        );

        if (!targetCategory) {
          setCategory(null);
          setLoading(false);
          return;
        }
        setCategory(targetCategory);

        // 3. Fetch products in this category
        const { data: prodsData, error: prodsError } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .eq('category_id', targetCategory.id)
          .eq('is_active', true);

        if (prodsError) throw prodsError;

        // 4. Fetch all reviews to calculate ratings
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('product_id, rating');

        if (reviewsError) throw reviewsError;

        // 5. Aggregate reviews and build ClientProduct list
        const dbProducts = (prodsData || []) as unknown as DBProduct[];
        const clientProducts: ClientProduct[] = dbProducts.map(p => {
          const productReviews = (reviewsData || []).filter(r => r.product_id === p.id);
          const reviewCount = productReviews.length;
          const avgRating = reviewCount > 0 
            ? Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
            : 0;

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            category_id: p.category_id,
            description: p.description || '',
            price: Number(p.price),
            mrp: Number(p.mrp),
            stock_quantity: p.stock_quantity,
            images: p.images || [],
            is_active: p.is_active,
            created_at: p.created_at,
            rating: avgRating,
            reviewCount,
            variants: p.product_variants || []
          };
        });

        setProducts(clientProducts);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'An error occurred loading category.');
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [params.slug]);

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating(null);
    setInStockOnly(false);
    setSortBy('relevance');
  };

  const handleAddToCartMock = (prodName: string) => {
    alert(`Success: Added ${prodName} to Cart!`);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minRating !== null && p.rating < minRating) return false;
    if (inStockOnly && p.stock_quantity <= 0) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'popularity') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0; // relevance / default
  });

  // Render Skeletons during fetch
  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-8 animate-pulse">
        <div className="h-10 w-1/3 bg-gray-200 rounded-lg"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 h-96 bg-gray-200 rounded-xl"></aside>
          <div className="flex-1 space-y-6">
            <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Proper 404 Category Not Found State
  if (!category) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center space-y-6">
        <div className="text-display-lg text-sale-red">404</div>
        <h1 className="text-headline-lg text-on-surface">Category Not Found</h1>
        <p className="text-body-sm text-warm-gray">
          The collection category you are looking for does not exist or has been disabled.
        </p>
        <Link href="/">
          <Button variant="primary">Return to Storefront</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      {/* Category header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-headline-lg text-on-surface flex items-center gap-3">
            {category.name} Collection
          </h1>
          <p className="text-body-sm text-warm-gray mt-1">
            Browse through our premium natural quality range.
          </p>
        </div>
        {category.requires_fssai_display && (
          <div className="mt-2 sm:mt-0">
            <Badge variant="secondary" className="text-xs">
              Requires FSSAI Compliance
            </Badge>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-sale-red text-sm p-4 rounded-xl border border-red-200 mb-6 font-semibold">
          Error: {errorMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Filter Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <Card elevation={1} className="p-5 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="font-bold text-on-surface text-title-md flex items-center gap-2">
                <Filter size={16} /> Filters
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-xs text-primary font-bold hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <h4 className="text-body-sm font-bold text-on-surface">Price Range</h4>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  className="py-1 text-xs" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-warm-gray text-xs">to</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  className="py-1 text-xs" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <h4 className="text-body-sm font-bold text-on-surface">Customer Rating</h4>
              <div className="space-y-2">
                {[4, 3].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 text-body-sm text-on-surface-variant cursor-pointer">
                    <input 
                      type="radio" 
                      name="ratingFilter"
                      checked={minRating === stars}
                      onChange={() => setMinRating(stars)}
                      className="rounded text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span className="flex items-center gap-0.5 text-yellow-500 font-semibold">
                      {Array(stars).fill('★').join('')}
                      <span className="text-warm-gray text-xs font-normal"> & up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <h4 className="text-body-sm font-bold text-on-surface">Availability</h4>
              <label className="flex items-center gap-2 text-body-sm text-on-surface-variant cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4" 
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Active Categories Shortcut */}
            <div className="space-y-2 border-t border-border-subtle pt-4">
              <h4 className="text-body-sm font-bold text-on-surface">Other Categories</h4>
              <div className="flex flex-col gap-1.5">
                {categories.map(c => (
                  <Link 
                    key={c.id} 
                    href={`/category/${c.slug}`} 
                    className={`text-body-sm hover:underline ${
                      c.slug === params.slug ? 'text-primary font-bold' : 'text-on-surface-variant'
                    }`}
                  >
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
            <span className="text-body-sm text-warm-gray">{sortedProducts.length} items found</span>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 font-semibold"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              >
                Sort By: {
                  sortBy === 'relevance' ? 'Relevance' :
                  sortBy === 'priceAsc' ? 'Price: Low to High' :
                  sortBy === 'priceDesc' ? 'Price: High to Low' :
                  sortBy === 'popularity' ? 'Popularity' : 'Newest'
                } <ChevronDown size={14} />
              </Button>
              
              {isSortDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-border-subtle rounded-lg shadow-lg z-20 min-w-[160px] py-1">
                  {[
                    { id: 'relevance', name: 'Relevance' },
                    { id: 'priceAsc', name: 'Price: Low to High' },
                    { id: 'priceDesc', name: 'Price: High to Low' },
                    { id: 'popularity', name: 'Popularity' },
                    { id: 'newest', name: 'Newest' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as typeof sortBy);
                        setIsSortDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-xs font-semibold text-on-surface"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Empty State */}
          {sortedProducts.length === 0 ? (
            <Card elevation={0} className="p-12 text-center space-y-3 bg-[#faf8f5]">
              <h3 className="text-title-lg font-bold text-on-surface">No Products Match Your Filters</h3>
              <p className="text-body-sm text-warm-gray max-w-md mx-auto">
                Try widening your price range or clearing selected rating checkboxes to view our items in {category.name}.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Reset All Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <Card key={p.id} className="flex flex-col justify-between h-full p-4 hover:border-primary transition-all duration-200">
                  <div className="space-y-3">
                    <Link href={`/product/${p.slug}`} className="block">
                      <div className="h-44 bg-[#faf8f5] rounded-xl flex items-center justify-center overflow-hidden">
                        {p.images && p.images[0] ? (
                          <img 
                            src={p.images[0]} 
                            alt={p.name} 
                            className="object-contain max-h-full max-w-full hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <span className="text-warm-gray text-xs font-semibold">Image Not Available</span>
                        )}
                      </div>
                    </Link>
                    <span className="text-[10px] text-warm-gray uppercase tracking-wider font-bold">
                      {category.name}
                    </span>
                    <Link href={`/product/${p.slug}`} className="block hover:text-primary transition-colors">
                      <h3 className="font-bold text-on-surface text-body-md line-clamp-2 min-h-[40px]">
                        {p.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 text-yellow-500 text-xs">
                      {p.rating > 0 ? (
                        <>
                          <Star size={14} fill="currentColor" />
                          <span className="text-on-surface font-bold">{p.rating}</span>
                          <span className="text-warm-gray">({p.reviewCount} reviews)</span>
                        </>
                      ) : (
                        <span className="text-warm-gray font-normal italic">No reviews yet</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-4">
                    <div>
                      <span className="text-price-display text-price-green font-bold block text-body-lg">
                        ₹{p.price}
                      </span>
                      {p.mrp > p.price && (
                        <span className="text-xs text-warm-gray line-through">₹{p.mrp}</span>
                      )}
                    </div>
                    
                    {p.stock_quantity > 0 ? (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleAddToCartMock(p.name)}
                      >
                        ADD +
                      </Button>
                    ) : (
                      <Badge variant="gray">Out of Stock</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
