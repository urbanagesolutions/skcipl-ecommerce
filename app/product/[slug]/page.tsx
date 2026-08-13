'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Truck, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface CompanySettings {
  fssai_license_number: string;
  fssai_valid_until: string;
  cin: string;
  gst_number: string;
  brand_name?: string;
  support_email?: string;
  support_phone?: string;
}

interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  price_override: number | null;
  stock_quantity: number;
}

interface DBCategory {
  id: string;
  name: string;
  slug: string;
  requires_fssai_display: boolean;
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
  batch_number: string | null;
  expiry_date: string | null;
  sku: string | null;
  images: string[];
  is_active: boolean;
  categories?: DBCategory;
  product_variants?: ProductVariant[];
}

interface CustomerInfo {
  name: string;
  email: string;
}

interface ReviewWithCustomer {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  customers: CustomerInfo | null;
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { addToCart, syncing } = useCart();
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [category, setCategory] = useState<DBCategory | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  
  // UI logic states
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductDetails() {
      try {
        setLoading(true);
        
        // 1. Fetch product with joined category and variants
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*, categories:category_id(*), product_variants(*)')
          .eq('slug', params.slug)
          .eq('is_active', true)
          .maybeSingle();

        if (prodError) throw prodError;
        
        if (!prodData) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const typedProd = prodData as unknown as DBProduct;
        setProduct(typedProd);
        setCategory(typedProd.categories || null);
        
        const listVariants = typedProd.product_variants || [];
        setVariants(listVariants);
        if (listVariants.length > 0) {
          setSelectedVariant(listVariants[0]);
        }

        // 2. Fetch company settings for FSSAI number
        const { data: settingsData } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        setSettings(settingsData as CompanySettings | null);

        // 3. Fetch reviews joined with customer name/email
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, customers(name, email)')
          .eq('product_id', typedProd.id)
          .order('created_at', { ascending: false });

        if (!reviewsError && reviewsData) {
          setReviews(reviewsData as unknown as ReviewWithCustomer[]);
        }

        // 4. Fetch related products (same category, active, not current)
        if (typedProd.category_id) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', typedProd.category_id)
            .eq('is_active', true)
            .neq('id', typedProd.id)
            .limit(4);

          if (relatedData) {
            setRelatedProducts(relatedData as DBProduct[]);
          }
        }
      } catch (err) {
        console.error('Error fetching product data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProductDetails();
  }, [params.slug]);

  // Handle Pincode check via API
  const handlePincodeCheck = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeResult('Please enter a valid 6-digit PIN code.');
      return;
    }
    try {
      const res = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await res.json();
      setPincodeResult(data.message || 'Unable to check delivery.');
    } catch {
      setPincodeResult('Unable to check delivery. Please try again.');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, selectedVariant?.id || null, 1);
      const name = selectedVariant 
        ? `${product.name} (${selectedVariant.variant_name})`
        : product.name;
      alert(`Success: Added ${name} to your Cart!`);
    } catch (err) {
      console.error(err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, selectedVariant?.id || null, 1);
      router.push('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to proceed to buy. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-10 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="h-20 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Proper 404 state if product doesn't exist
  if (!product) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center space-y-6">
        <div className="text-display-lg text-sale-red font-black">404</div>
        <h1 className="text-headline-lg text-on-surface">Product Not Found</h1>
        <p className="text-body-sm text-warm-gray">
          The product you are looking for does not exist in our system or is currently out of stock.
        </p>
        <Link href="/">
          <Button variant="primary">Return to Storefront</Button>
        </Link>
      </div>
    );
  }

  // Aggregate ratings
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
    : 0;

  // Determine pricing based on selected variant or base product
  const displayedPrice = selectedVariant?.price_override !== null && selectedVariant?.price_override !== undefined
    ? Number(selectedVariant.price_override)
    : Number(product.price);
  
  const displayedMRP = Number(product.mrp);
  const discountAmount = Math.max(0, displayedMRP - displayedPrice);

  // Determine stock based on selected variant or base product
  const stockQty = selectedVariant
    ? selectedVariant.stock_quantity
    : product.stock_quantity;

  const stockStatus = stockQty === 0 
    ? 'Out of Stock' 
    : stockQty <= 10 
    ? 'Low Stock' 
    : 'In Stock';

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['/assets/placeholder-product.png'];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-10">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column - Product Gallery */}
        <div className="flex-1 space-y-4">
          <Card elevation={1} className="h-96 flex items-center justify-center bg-[#faf8f5] overflow-hidden p-4">
            <img 
              src={productImages[activeImageIdx]} 
              alt={product.name} 
              className="object-contain max-h-full max-w-full"
            />
          </Card>
          
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-20 border rounded-md bg-[#faf8f5] flex items-center justify-center p-2 cursor-pointer transition-all ${
                    idx === activeImageIdx ? 'border-primary ring-2 ring-primary bg-opacity-20' : 'border-border-subtle hover:border-primary'
                  }`}
                >
                  <img src={img} alt="" className="object-contain max-h-full max-w-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Purchase panel */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            {category && (
              <span className="text-body-sm text-primary font-bold uppercase tracking-wider">
                {category.name}
              </span>
            )}
            <h1 className="text-headline-lg text-on-surface">{product.name}</h1>
            
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-sm">
                {avgRating > 0 ? Array(Math.round(avgRating)).fill('★').join('') : '☆☆☆☆☆'}
              </span>
              <span className="text-body-sm text-on-surface-variant font-semibold">
                {avgRating > 0 ? `${avgRating} (${reviewCount} reviews)` : 'No reviews yet'}
              </span>
            </div>
          </div>

          <div className="border-y border-border-subtle py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-display-lg text-price-green font-bold">₹{displayedPrice}</span>
              {displayedMRP > displayedPrice && (
                <>
                  <span className="text-body-lg line-through text-warm-gray">₹{displayedMRP}</span>
                  <Badge variant="sale">Save ₹{discountAmount}</Badge>
                </>
              )}
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-warm-gray">Availability:</span>
              <Badge variant={stockStatus === 'Out of Stock' ? 'sale' : stockStatus === 'Low Stock' ? 'pending' : 'secondary'}>
                {stockStatus} ({stockQty} left)
              </Badge>
            </div>
          </div>

          {/* Size Variant Selector */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-body-sm font-bold text-on-surface">Select Packaging Option</h4>
              <div className="flex flex-wrap gap-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 border rounded-md text-body-sm font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-primary bg-primary bg-opacity-5 text-primary ring-1 ring-primary'
                        : 'border-border-subtle hover:border-primary'
                    }`}
                  >
                    {v.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button 
              variant="secondary" 
              fullWidth 
              size="lg" 
              disabled={stockQty === 0 || syncing}
              onClick={handleAddToCart}
            >
              {stockQty === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </Button>
            
            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              disabled={stockQty === 0 || syncing}
              onClick={handleBuyNow}
            >
              BUY NOW
            </Button>
          </div>

          {/* Pincode Checker */}
          <Card elevation={0} className="p-4 space-y-3 bg-gray-50/50">
            <h4 className="text-body-sm font-bold text-on-surface flex items-center gap-2">
              <Truck size={16} /> Delivery Availability
            </h4>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter 6-digit Pincode" 
                maxLength={6} 
                className="py-2" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={handlePincodeCheck}>CHECK</Button>
            </div>
            {pincodeResult && (
              <p className="text-xs text-secondary flex items-center gap-1.5 font-semibold">
                <Clock size={12} /> {pincodeResult}
              </p>
            )}
          </Card>

          {/* Dynamic FSSAI license requirements display */}
          {category?.requires_fssai_display && (
            <Card elevation={0} className="p-4 bg-green-50/50 border border-green-200/50 space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold text-body-sm">
                <ShieldCheck size={18} /> Food Safety Compliance
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                As a standard registered food product under dairy/groceries, this item is compliant with the Food Safety and Standards Authority of India licensing guidelines.
              </p>
              <div className="text-xs text-secondary font-semibold">
                FSSAI License No. {settings?.fssai_license_number || '12422027001241'}
              </div>
            </Card>
          )}

        </div>
      </div>

      {/* Description Accordions */}
      <div className="border-t border-border-subtle pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-headline-sm font-bold text-on-surface">Product Details</h3>
          <p className="text-body-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {product.description || 'No description provided for this product.'}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl">
            <div>
              <span className="text-warm-gray block">SKU Code</span>
              <span className="font-bold text-on-surface">{product.sku || 'SK-UNKNOWN'}</span>
            </div>
            <div>
              <span className="text-warm-gray block">Batch Number</span>
              <span className="font-bold text-on-surface">{product.batch_number || 'BT-BATCH'}</span>
            </div>
            {product.expiry_date && (
              <div className="col-span-2">
                <span className="text-warm-gray block">Expiry Date / Best Before</span>
                <span className="font-bold text-on-surface">
                  {new Date(product.expiry_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Real Customer Reviews Section */}
        <div className="space-y-4">
          <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
            <MessageSquare size={20} /> Reviews
          </h3>
          
          {reviews.length === 0 ? (
            <Card elevation={0} className="p-6 text-center text-warm-gray text-xs italic bg-gray-50/50">
              No reviews yet. Be the first to buy and leave feedback!
            </Card>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <Card key={rev.id} elevation={0} className="p-3 border border-border-subtle space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-on-surface">
                      {rev.customers?.name || rev.customers?.email || 'Verified Buyer'}
                    </span>
                    <span className="text-[10px] text-warm-gray">
                      {new Date(rev.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="text-yellow-500 text-xs">
                    {Array(rev.rating).fill('★').join('')}
                  </div>
                  {rev.comment && (
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {rev.comment}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently bought together / Related products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border-subtle pt-10 space-y-6">
          <h3 className="text-title-lg font-bold text-on-surface">You May Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Card key={p.id} className="p-3 flex flex-col justify-between hover:border-primary transition-all duration-200">
                <Link href={`/product/${p.slug}`}>
                  <div className="h-32 bg-[#faf8f5] rounded-lg overflow-hidden flex items-center justify-center mb-3">
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="object-contain max-h-full max-w-full" />
                    ) : (
                      <span className="text-[10px] text-warm-gray">No image</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-on-surface line-clamp-2 hover:text-primary min-h-[32px]">
                    {p.name}
                  </h4>
                </Link>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-price-green">₹{p.price}</span>
                  <Link href={`/product/${p.slug}`}>
                    <Button variant="outline" size="sm" className="text-[10px] px-2 py-1">View</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
