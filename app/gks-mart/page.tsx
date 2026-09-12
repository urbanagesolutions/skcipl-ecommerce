import React from 'react';
import Link from 'next/link';
import { 
  Store, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Phone, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  Sparkles, 
  Award,
  PackageCheck,
  Clock,
  Send
} from 'lucide-react';
import { CORPORATE_INFO, STATIC_PRODUCTS } from '@/lib/data';

export const metadata = {
  title: 'GKS Mart (gksmart.in) | Retail Supermarket & Grocery Platform by SKCIPL',
  description: 'GKS Mart (gksmart.in) is the modern grocery and supermarket division of Sabari Krishna Consumables India Private Limited, delivering fresh staples, cold-pressed oils, pure ghee, and FMCG essentials.',
};

export default function GKSMartPage() {
  const gksMartProducts = STATIC_PRODUCTS.filter(p => p.brand === 'GKS Mart' || p.category_name.includes('Groceries') || p.bestseller);

  const categories = [
    {
      title: 'Heritage Rice & Native Millets',
      desc: 'Naturally aged Seeraga Samba, Deluxe Ponni, Kuthiraivali, Varagu, and traditional grains free from chemical whitening.',
      icon: Leaf,
      items: '12+ Varieties'
    },
    {
      title: 'Unpolished Pulses & Dal',
      desc: 'Laser-sorted Toor Dal, Urad Dal, and Moong Dal without water, oil, or leather polishing, preserving pure natural protein.',
      icon: PackageCheck,
      items: '15+ Varieties'
    },
    {
      title: 'Sabari GKS Pure Ghee & Oils',
      desc: 'Authentic A2 Vedic Bilona Cow Ghee, Cultured Buffalo Ghee, and Chekku wood-pressed oils fresh from our Tiruppur factory.',
      icon: Sparkles,
      items: 'Full Dairy & Oil Line'
    },
    {
      title: 'Spices, Masalas & Seasonings',
      desc: 'Sun-dried high-Curcumin Salem turmeric, Guntur red chillies, coriander seeds, and whole regional whole spices.',
      icon: Award,
      items: '20+ Spices'
    },
    {
      title: 'Natural Sweeteners & Honey',
      desc: 'Western Ghats unpasteurized raw forest honey, authentic palm jaggery (Karupatti), and unrefined country cane sugar.',
      icon: ShieldCheck,
      items: '8+ Natural Sweets'
    },
    {
      title: 'Daily FMCG & Household Essentials',
      desc: 'Pantry consumables, dry snacks, breakfast staples, and everyday family care items selected for hygiene and value.',
      icon: ShoppingBag,
      items: 'Full Store Range'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. GKS Mart Hero Header */}
      <section className="bg-gradient-to-r from-[#0d4d38] via-[#0f5c43] to-[#0a3e2d] text-white py-16 md:py-20 border-b border-emerald-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <Store size={420} />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Store size={14} />
            <span>Retail & Supermarket Arm of Sabari Krishna Consumables India Pvt Ltd</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight">
              GKS Mart <br />
              <span className="text-yellow-300 text-2xl sm:text-3xl md:text-4xl font-mono font-bold">
                (gksmart.in)
              </span>
            </h1>
            <p className="text-base sm:text-lg text-emerald-100 font-light leading-relaxed">
              Your neighborhood daily grocery store and omnichannel supermarket platform. Bringing farm-fresh staples, unpolished pulses, pure spices, and signature Sabari GKS dairy directly to kitchens across Tiruppur, Coimbatore, and Tamil Nadu.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="https://wa.me/919842228484?text=Hello%20GKS%20Mart%2C%20I%20would%20like%20to%20place%20an%20order%20for%20groceries."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm transition-all shadow-md"
            >
              <span>Quick Order on WhatsApp</span>
              <ExternalLink size={15} />
            </a>

            <a
              href={`tel:${CORPORATE_INFO.phone}`}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all"
            >
              <Phone size={16} />
              <span>Call Store: {CORPORATE_INFO.phone}</span>
            </a>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/40 font-semibold text-sm transition-all"
            >
              <ShoppingBag size={16} />
              <span>Browse All Products</span>
            </Link>
          </div>

          {/* Value Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-emerald-600/30 text-xs">
            <div>
              <span className="text-xl font-bold text-yellow-300 block">500+</span>
              <span className="text-emerald-200">Grocery Items & Staples</span>
            </div>
            <div>
              <span className="text-xl font-bold text-yellow-300 block">100%</span>
              <span className="text-emerald-200">FSSAI Batch Tested</span>
            </div>
            <div>
              <span className="text-xl font-bold text-yellow-300 block">Same Day</span>
              <span className="text-emerald-200">Doorstep Delivery</span>
            </div>
            <div>
              <span className="text-xl font-bold text-yellow-300 block">Kongu Region</span>
              <span className="text-emerald-200">Farm-Gate Procurement</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What is GKS Mart (gksmart.in)? */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                The Retail Vision of SKCIPL
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                Fresh, Unadulterated Essentials for Modern Households
              </h2>
            </div>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              <strong>GKS Mart</strong> was founded by <strong>Sabari Krishna Consumables India Private Limited</strong> to solve a fundamental consumer dilemma: the prevalence of adulterated oils, chemically polished lentils, and synthetic food additives in conventional retail markets.
            </p>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              By controlling the entire chain—from direct contracts with regional farmers and in-house cold-pressing at our Tiruppur facility, to running modern brick-and-mortar stores and our digital ordering platform at <strong>gksmart.in</strong>—GKS Mart delivers unmatched freshness at honest, factory-direct prices.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Zero Adulteration & Chemical Polish Policy</h4>
                  <p className="text-xs text-on-surface-variant">Our dals and grains are packed raw and unpolished, retaining their wholesome bran and essential dietary fiber.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Transparent Weighing & Clear Batch Labelling</h4>
                  <p className="text-xs text-on-surface-variant">Every bag and container features clear batch numbers, manufacturing dates, and verified FSSAI compliance.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Integrated with Sabari GKS Dairy & Oils</h4>
                  <p className="text-xs text-on-surface-variant">Instant access to our award-winning A2 Vedic Bilona Cow Ghee and cold-pressed cooking oils straight off the press.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-surface rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Store size={26} />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-lg text-on-surface">GKS Mart Service Hub</h3>
                  <span className="text-xs text-emerald-700 font-mono">gksmart.in / Tiruppur Hub</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-on-surface block">Primary Retail Store & Fulfillment:</span>
                    <span className="text-on-surface-variant">{CORPORATE_INFO.registeredOffice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-on-surface block">Store Hours:</span>
                    <span className="text-on-surface-variant">7:30 AM – 9:30 PM (All 7 Days)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-on-surface block">Grocery Order Hotline:</span>
                    <span className="text-on-surface-variant">{CORPORATE_INFO.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Truck size={16} className="text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-on-surface block">Express Delivery Zones:</span>
                    <span className="text-on-surface-variant">Karuvampalayam, Kumaran Road, Avinashi Road, Tiruppur & Coimbatore</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/919842228484?text=Hello%20GKS%20Mart%2C%20please%20send%20me%20today's%20grocery%20price%20list%20and%20offers."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  <Send size={14} />
                  <span>Get Daily Price List on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Grocery Categories Offered at GKS Mart */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            A Complete Grocery Assortment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
            Core Departments at GKS Mart
          </h2>
          <p className="text-sm text-on-surface-variant">
            Everything your kitchen requires for healthy, authentic, and nutritious cooking every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-border-subtle p-6 hover:border-emerald-500/40 hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon size={24} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold font-serif text-lg text-on-surface">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {cat.items}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. GKS Mart Featured Staples Showcase */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
              Featured GKS Mart Groceries & Pantry Items
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>View Full Catalogue</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gksMartProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-border-subtle overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-surface relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                    {product.brand}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-emerald-700 font-semibold">{product.category_name}</span>
                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{product.description}</p>
                  <div className="text-xs font-bold text-on-surface pt-1">
                    ₹{product.price} <span className="text-[11px] text-warm-gray font-normal line-through">₹{product.mrp}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={`https://wa.me/919842228484?text=Hello%20GKS%20Mart%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <ShoppingBag size={13} />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GKS Mart Franchise & Vendor Partnership Plan */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-[#192736] text-white rounded-3xl p-8 sm:p-12 border border-[#2d4054] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300 bg-yellow-400/10 px-3 py-1 rounded-full">
              Partner with GKS Mart
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif">
              Become a GKS Mart Franchise Partner or Local Farm Supplier
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              We are expanding our retail footprint across Tamil Nadu. If you are an agricultural producer of organic millets, cold-pressed oils, or spices, or an entrepreneur seeking to launch a high-volume neighborhood supermarket backed by the manufacturing muscle of Sabari Krishna Consumables India Private Limited, get in touch with our operations desk.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm transition-all"
              >
                Franchise & Partner Inquiries
              </Link>
              <a
                href={`mailto:${CORPORATE_INFO.email}`}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Send size={15} />
                <span>Email Business Proposal</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#213243] rounded-2xl p-6 border border-white/10 space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white border-b border-white/10 pb-2">
              Franchise Benefits
            </h4>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Direct factory supply margins</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Full brand identity & POS setup</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Marketing & digital portal integration (gksmart.in)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-200">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Continuous inventory replenishment</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
