'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  ExternalLink, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { STATIC_PRODUCTS, CORPORATE_INFO } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const product = STATIC_PRODUCTS.find((p) => p.slug === slug) || STATIC_PRODUCTS[0];
  const [selectedPack, setSelectedPack] = useState(product.pack_sizes[0] || 'Default Pack');
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const relatedProducts = STATIC_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  const isGks = product.brand === 'GKS Mart';

  const handleWhatsAppOrder = () => {
    const text = `*Order / Inquiry from Website:*%0A` +
      `*Product:* ${encodeURIComponent(product.name)}%0A` +
      `*Selected Pack Size:* ${encodeURIComponent(selectedPack)}%0A` +
      `*Price:* ₹${product.price}%0A` +
      `*Brand:* ${encodeURIComponent(product.brand)}%0A` +
      `Please provide delivery details and payment options.`;

    window.open(`https://wa.me/919842228484?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Breadcrumb Bar */}
      <div className="bg-surface border-b border-border-subtle py-3">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex items-center gap-2 text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          {isGks ? (
            <Link href="/gks-mart" className="hover:text-emerald-700 font-semibold">GKS Mart (gksmart.in)</Link>
          ) : (
            <span className="font-semibold text-primary">Sabari GKS</span>
          )}
          <span>/</span>
          <span className="text-on-surface font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* 2. Main Product Display */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl border border-border-subtle overflow-hidden shadow-xs relative aspect-square max-h-[480px] flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-xs ${
                  isGks ? 'bg-emerald-600' : 'bg-primary'
                }`}>
                  {product.brand}
                </span>
                {product.bestseller && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail List */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-primary scale-105' : 'border-border-subtle hover:border-warm-gray'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Badges */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="space-y-1">
                <ShieldCheck size={20} className="mx-auto text-primary" />
                <span className="font-bold text-on-surface block text-[11px]">FSSAI Central</span>
                <span className="text-[10px] text-warm-gray">{CORPORATE_INFO.fssai}</span>
              </div>
              <div className="space-y-1 border-x border-border-subtle">
                <Sparkles size={20} className="mx-auto text-primary" />
                <span className="font-bold text-on-surface block text-[11px]">100% Vedic Pure</span>
                <span className="text-[10px] text-warm-gray">No Chemicals</span>
              </div>
              <div className="space-y-1">
                <Truck size={20} className="mx-auto text-primary" />
                <span className="font-bold text-on-surface block text-[11px]">Direct Dispatch</span>
                <span className="text-[10px] text-warm-gray">Tiruppur Plant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Ordering */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2 border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {product.category_name}
                </span>
                <span>•</span>
                <span className="text-xs text-warm-gray">SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-on-surface">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-surface rounded-2xl p-4 border border-border-subtle flex items-center justify-between">
              <div>
                <span className="text-xs text-warm-gray block">Consumer Price (MRP Incl. all taxes)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-on-surface font-serif">₹{product.price}</span>
                  <span className="text-sm text-warm-gray line-through">₹{product.mrp}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save ₹{product.mrp - product.price}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                  <CheckCircle2 size={14} />
                  <span>In Stock</span>
                </span>
                <span className="text-warm-gray text-[11px]">Batch: {product.batch_number}</span>
              </div>
            </div>

            {/* Pack Size Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                Select Pack Size / Quantity:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.pack_sizes.map((pack, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPack(pack)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedPack === pack
                        ? 'bg-on-surface text-white border-on-surface shadow-xs'
                        : 'bg-white text-on-surface border-border-subtle hover:border-warm-gray'
                    }`}
                  >
                    {pack}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Order Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-sm transition-all shadow-md"
              >
                <ShoppingBag size={18} />
                <span>Order via WhatsApp Direct (Sabari GKS / GKS Mart)</span>
                <ExternalLink size={15} />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${CORPORATE_INFO.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface hover:bg-border-subtle text-on-surface border border-border-subtle font-semibold text-xs transition-colors"
                >
                  <Phone size={15} />
                  <span>Call: {CORPORATE_INFO.phone}</span>
                </a>

                <Link
                  href="/b2b"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface hover:bg-border-subtle text-primary border border-border-subtle font-bold text-xs transition-colors"
                >
                  <span>Wholesale 15L Tins</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Regulatory & Purity Accordion-like Info */}
            <div className="space-y-3 pt-4 border-t border-border-subtle text-xs">
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-warm-gray">Manufacturer</span>
                <span className="font-semibold text-on-surface text-right">Sabari Krishna Consumables India Pvt Ltd</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-warm-gray">Central FSSAI Lic. No.</span>
                <span className="font-mono font-bold text-emerald-700">{CORPORATE_INFO.fssai}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-warm-gray">Processing Facility</span>
                <span className="text-on-surface text-right">Puliyamarathottam, Tiruppur, TN</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-warm-gray">Retail & Delivery Arm</span>
                <span className="text-emerald-700 font-bold text-right">GKS Mart (gksmart.in)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-warm-gray">Dietary Info</span>
                <span className="text-on-surface text-right">100% Vegetarian • Pure Natural Product</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Related Products */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-6 pt-8 border-t border-border-subtle">
        <h3 className="text-xl font-bold font-serif text-on-surface">
          Explore Other Consumables & Groceries
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <div
              key={rel.id}
              className="bg-white rounded-2xl border border-border-subtle overflow-hidden p-4 space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-36 bg-surface rounded-xl overflow-hidden">
                  <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover" />
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-primary">{rel.brand}</span>
                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">{rel.name}</h4>
                  <p className="text-xs text-warm-gray line-clamp-1">{rel.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                <span className="text-sm font-bold text-on-surface">₹{rel.price}</span>
                <Link
                  href={`/product/${rel.slug}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
