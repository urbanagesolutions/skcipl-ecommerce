import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  Flame, 
  Leaf, 
  Truck, 
  Building2, 
  ExternalLink, 
  Phone, 
  MapPin, 
  Award, 
  ChevronRight, 
  ShoppingBag,
  Layers,
  Clock
} from 'lucide-react';
import { 
  CORPORATE_INFO, 
  COMPANY_PLATFORMS, 
  STATIC_PRODUCTS 
} from '@/lib/data';

export const metadata = {
  title: 'Sabari Krishna Consumables India Private Limited | Corporate Portal & Platforms',
  description: 'Official corporate website of Sabari Krishna Consumables India Private Limited. Explore Sabari GKS pure ghee & cold-pressed oils, GKS Mart (gksmart.in) supermarkets, and B2B institutional supplies.',
};

export default function HomePage() {
  const featuredProducts = STATIC_PRODUCTS.slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Corporate Hero Section */}
      <section className="relative bg-gradient-to-b from-[#14202d] via-[#1a2938] to-[#121c27] text-white overflow-hidden py-16 md:py-24 border-b border-[#263748]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f4c053_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Mission & Vision */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-amber-300 text-xs font-semibold tracking-wide">
                <Award size={14} className="text-primary" />
                <span>Incorporated under Govt. of India • FSSAI Central Certified</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif leading-[1.15] text-white">
                  Pure Consumables, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                    Vedic Heritage
                  </span> & Modern Retail
                </h1>
                <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal">
                  <strong>Sabari Krishna Consumables India Private Limited</strong> is a leading food manufacturing and omnichannel retail conglomerate headquartered in Tiruppur, Tamil Nadu. Dedicated to unadulterated Vedic Bilona cow ghee, traditional wood-pressed oils, and our consumer supermarket network <strong>GKS Mart (<span className="text-emerald-400">gksmart.in</span>)</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/gks-mart"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <Store size={18} />
                  <span>Discover GKS Mart (gksmart.in)</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-md"
                >
                  <ShoppingBag size={18} />
                  <span>View Sabari GKS Catalogue</span>
                </Link>

                <Link
                  href="/b2b"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all"
                >
                  <Building2 size={16} />
                  <span>Wholesale & HoReCa</span>
                </Link>
              </div>

              {/* Key Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>100% Vedic Bilona</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Chekku Cold Pressed</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Zero Preservatives</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Pan-India Supply</span>
                </div>
              </div>
            </div>

            {/* Right Column: Corporate Highlights Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#1f2e3e]/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block">Company Snapshot</span>
                    <h3 className="text-lg font-bold text-white font-serif">Corporate Credentials</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg">
                    SK
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-gray-300">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Legal Entity</span>
                    <span className="font-semibold text-white text-right">Sabari Krishna Consumables India Pvt Ltd</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Corporate Identity (CIN)</span>
                    <span className="font-mono font-medium text-amber-200">{CORPORATE_INFO.cin}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">FSSAI Central License</span>
                    <span className="font-mono font-semibold text-emerald-400">{CORPORATE_INFO.fssai}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">GSTIN</span>
                    <span className="font-mono text-white">{CORPORATE_INFO.gstin}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Board of Directors</span>
                    <span className="text-white text-right">K. Dhandapani (MD) & D. Bhuvaneswari</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Headquarters</span>
                    <span className="text-white text-right">Karuvampalayam, Tiruppur, TN</span>
                  </div>
                </div>

                {/* Direct Connect */}
                <div className="bg-[#172330] rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Direct Assistance</span>
                    <span className="text-sm font-bold text-white">{CORPORATE_INFO.phone}</span>
                  </div>
                  <a
                    href="https://wa.me/919842228484?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20would%20like%20to%20connect%20with%20your%20team."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold bg-secondary hover:bg-secondary/90 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Chat Now</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platforms Ecosystem Spotlight (The Core Multi-Platform Architecture) */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full">
            <Layers size={14} />
            <span>Integrated Business Wings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-on-surface">
            The Multi-Platform Ecosystem of SKCIPL
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant">
            From farm-gate sourcing and artisanal manufacturing to hyper-local supermarket retail with <strong>GKS Mart</strong> and pan-India institutional distribution.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COMPANY_PLATFORMS.map((platform) => {
            const isGksMart = platform.id === 'gks-mart';
            return (
              <div
                key={platform.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isGksMart 
                    ? 'border-emerald-300 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-50/60 shadow-lg hover:shadow-xl' 
                    : 'border-border-subtle bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isGksMart 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-primary-container text-primary font-bold'
                    }`}>
                      {platform.badge}
                    </span>
                    {platform.domain && (
                      <span className="text-xs font-mono font-bold text-gray-500 bg-surface px-2.5 py-1 rounded border border-border-subtle flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {platform.domain}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold font-serif text-on-surface flex items-center gap-2">
                      {isGksMart && <Store className="text-emerald-600" size={26} />}
                      <span>{platform.name}</span>
                    </h3>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {platform.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {platform.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-2 border-t border-border-subtle">
                    <span className="text-xs uppercase font-bold tracking-wider text-warm-gray block">
                      Core Strengths:
                    </span>
                    <ul className="space-y-1.5 text-xs text-on-surface-variant">
                      {platform.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className={isGksMart ? "text-emerald-600 shrink-0 mt-0.5" : "text-primary shrink-0 mt-0.5"} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {platform.categories.map((cat, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-border-subtle text-on-surface-variant font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Platform Footer CTA */}
                <div className={`p-6 pt-0 mt-auto`}>
                  <Link
                    href={platform.ctaUrl}
                    className={`inline-flex items-center justify-between w-full px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                      isGksMart
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-on-surface hover:bg-on-surface/90 text-white'
                    }`}
                  >
                    <span>{platform.ctaLabel}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Deep Dive Feature: GKS Mart (gksmart.in) Showcase */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
            <Store size={360} />
          </div>

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
              <Store size={14} />
              <span>Consumer Retail Supermarket & Quick Delivery Platform</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                GKS Mart (<span className="text-yellow-300">gksmart.in</span>)
              </h2>
              <p className="text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
                Sabari Krishna Consumables brings everyday grocery shopping directly to families across Tiruppur and Tamil Nadu. Offering wholesome farm-fresh commodities, authentic regional spices, unpolished pulses, and pure pantry consumables through modern retail supermarkets and an intuitive digital platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
                <Leaf className="text-emerald-300 mb-2" size={24} />
                <h4 className="font-bold text-sm">Farm-Fresh Sourcing</h4>
                <p className="text-xs text-emerald-100 mt-1">Directly procured from Kongu region farmers with guaranteed quality.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
                <Truck className="text-emerald-300 mb-2" size={24} />
                <h4 className="font-bold text-sm">Express Doorstep Delivery</h4>
                <p className="text-xs text-emerald-100 mt-1">Prompt local delivery across Tiruppur, Coimbatore & Tamil Nadu.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10">
                <ShieldCheck className="text-emerald-300 mb-2" size={24} />
                <h4 className="font-bold text-sm">100% Purity Guarantee</h4>
                <p className="text-xs text-emerald-100 mt-1">FSSAI certified staples, no synthetic food polishes or adulterants.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/gks-mart"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm transition-all shadow-md"
              >
                <span>Explore Full GKS Mart Catalog</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/919842228484?text=Hello%20GKS%20Mart%2C%20I%20would%20like%20to%20place%20a%20grocery%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm border border-white/30 transition-all"
              >
                <span>Order via WhatsApp Direct</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Signature Consumables Catalogue (Static Pure Products Showcase) */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Artisanal Manufacturing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
              Signature Consumables by Sabari GKS & GKS Mart
            </h2>
            <p className="text-sm text-on-surface-variant max-w-2xl">
              Strictly batch-tested products meeting FSSAI standards. Pack sizes available from 100ml trial packs to 15-litre commercial bulk tins.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            <span>View All 10+ Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-border-subtle overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Product Image Header */}
                <div className="h-52 bg-surface relative overflow-hidden flex items-center justify-center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-on-surface shadow-xs">
                      {product.brand}
                    </span>
                    {product.bestseller && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary text-white shadow-xs">
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

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-primary">
                    {product.category_name}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Pack Sizes */}
                  <div className="pt-2 border-t border-border-subtle">
                    <span className="text-[11px] text-warm-gray block mb-1">Available Pack Sizes:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.pack_sizes.slice(0, 3).map((pack, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle text-on-surface font-medium">
                          {pack}
                        </span>
                      ))}
                      {product.pack_sizes.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-warm-gray">
                          +{product.pack_sizes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
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

      {/* 5. Traditional Manufacturing Heritage: Vedic Bilona & Marachekku */}
      <section className="bg-[#f9f8f5] border-y border-[#ece8df] py-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Heritage Food Craftsmanship
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-on-surface">
              The Vedic Bilona & Wood-Pressed Processing Method
            </h2>
            <p className="text-sm text-on-surface-variant">
              Unlike industrial dairy refineries that heat-separate cream or use high-temperature chemical solvents, Sabari Krishna preserves centuries-old Indian culinary wisdom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#ece8df] space-y-3 relative">
              <span className="text-4xl font-serif font-black text-amber-100 absolute top-4 right-4">
                01
              </span>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Leaf size={20} />
              </div>
              <h3 className="font-bold font-serif text-base text-on-surface">
                Ethical Sourcing
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Direct procurement of milk from grass-fed Kangayam and indigenous cows, and sun-dried organic seeds from verified regional farming collectives.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#ece8df] space-y-3 relative">
              <span className="text-4xl font-serif font-black text-amber-100 absolute top-4 right-4">
                02
              </span>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <h3 className="font-bold font-serif text-base text-on-surface">
                Curd Culturing
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Whole milk is boiled slowly in open pans, allowed to naturally cool, and inoculated with traditional probiotic curd culture overnight.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#ece8df] space-y-3 relative">
              <span className="text-4xl font-serif font-black text-amber-100 absolute top-4 right-4">
                03
              </span>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Flame size={20} />
              </div>
              <h3 className="font-bold font-serif text-base text-on-surface">
                Bi-Directional Churning
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Curd is churned clockwise and counter-clockwise with a wooden bilona to separate cultured makkhan, leaving nutrient-dense buttermilk.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#ece8df] space-y-3 relative">
              <span className="text-4xl font-serif font-black text-amber-100 absolute top-4 right-4">
                04
              </span>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold font-serif text-base text-on-surface">
                Gentle Slow Clarification
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Cultured butter is gently simmered over slow heat until golden granules form, infused with curry leaves and naturally packaged warm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Institutional B2B & Wholesale Supply Banner */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-[#1c2a38] text-white rounded-3xl p-8 sm:p-12 border border-[#2d4054] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
              B2B Institutional Supply
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif">
              Supplying South India’s Leading Sweet Manufacturers, Bakeries & Caterers
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
              We provide dependable, bulk supplies of pure cow ghee, buffalo ghee, and wood-pressed cooking oils in 15-litre commercial tins with batch-wise lab test certificates (CoA), GST invoices, and scheduled dispatch.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/b2b"
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-md"
              >
                Inquire for Institutional Bulk Rates
              </Link>
              <a
                href="tel:+919842228484"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Phone size={16} />
                <span>Call Wholesale Desk: +91 98422 28484</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#233446] rounded-2xl p-6 border border-white/10 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white border-b border-white/10 pb-2">
              Institutional Guarantees
            </h4>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Standardized RM Value & Purity</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Full GST Tax Compliance & E-Way Bills</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Flexible 15L, 200L & Custom Pack Sizes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Direct Factory-Gate Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Corporate Headquarters & Contact Callout */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-white rounded-3xl border border-border-subtle p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MapPin size={22} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">Registered Headquarters</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong>Sabari Krishna Consumables India Pvt Ltd</strong><br />
              {CORPORATE_INFO.registeredOffice}
            </p>
            <span className="text-[11px] text-warm-gray block">
              Factory Unit: Puliyamarathottam, Tiruppur
            </span>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Phone size={22} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">Corporate Hotline</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Monday to Saturday: 9:00 AM – 7:00 PM IST<br />
              <strong className="text-sm text-on-surface">{CORPORATE_INFO.phone}</strong>
            </p>
            <span className="text-[11px] text-warm-gray block">
              Official Email: {CORPORATE_INFO.email}
            </span>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Store size={22} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">GKS Mart Outlets & Web</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Supermarket store network in Tiruppur and digital grocery portal at <strong className="text-emerald-700">gksmart.in</strong>.
            </p>
            <Link
              href="/gks-mart"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
            >
              <span>Explore GKS Mart Store Locator</span>
              <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
