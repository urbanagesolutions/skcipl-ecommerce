import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { COMPANY_PLATFORMS } from '@/lib/data';

export const metadata = {
  title: 'Platforms & Divisions | Sabari Krishna Consumables India Private Limited',
  description: 'Explore the diverse business platforms of SKCIPL, including GKS Mart (gksmart.in) supermarkets, Sabari GKS manufacturing, B2B wholesale, and international exports.',
};

export default function PlatformsPage() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white py-16 border-b border-[#2d4054]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-amber-300 text-xs font-semibold">
            <Layers size={14} />
            <span>The SKCIPL Multi-Platform Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight">
            Integrated Platforms & Business Ecosystem
          </h1>
          <p className="text-base text-gray-300 max-w-2xl font-light leading-relaxed">
            Sabari Krishna Consumables India Private Limited operates an interconnected ecosystem spanning artisanal dairy and oil processing, regional hyper-local retail through <strong>GKS Mart (gksmart.in)</strong>, large-scale commercial wholesale, and global trade.
          </p>
        </div>
      </section>

      {/* 2. Detailed Platforms List */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-12">
        {COMPANY_PLATFORMS.map((platform) => {
          const isGks = platform.id === 'gks-mart';
          return (
            <div
              key={platform.id}
              id={platform.id}
              className={`rounded-3xl border p-8 sm:p-12 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isGks
                  ? 'border-emerald-300 bg-gradient-to-br from-white via-emerald-50/20 to-emerald-50/50 shadow-md'
                  : 'border-border-subtle bg-white shadow-xs'
              }`}
            >
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isGks ? 'bg-emerald-600 text-white' : 'bg-primary text-white'
                  }`}>
                    {platform.badge}
                  </span>
                  {platform.domain && (
                    <span className="text-xs font-mono font-bold text-gray-500 bg-surface px-2.5 py-1 rounded border border-border-subtle">
                      {platform.domain}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                    {platform.name}
                  </h2>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {platform.tagline}
                  </p>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {platform.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <span className="text-xs uppercase font-bold tracking-wider text-warm-gray block">
                    Strategic Capabilities:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant">
                    {platform.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className={isGks ? "text-emerald-600 shrink-0 mt-0.5" : "text-primary shrink-0 mt-0.5"} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href={platform.ctaUrl}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      isGks
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    <span>{platform.ctaLabel}</span>
                    <ArrowRight size={16} />
                  </Link>

                  {isGks && (
                    <a
                      href="https://wa.me/919842228484?text=Hello%20GKS%20Mart%2C%20I%20want%20to%20place%20an%20order."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-300 text-emerald-800 bg-white font-semibold text-sm hover:bg-emerald-50 transition-all"
                    >
                      <span>WhatsApp Direct Order</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-border-subtle shadow-sm bg-surface">
                  <img
                    src={platform.image}
                    alt={platform.name}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4 bg-white border-t border-border-subtle">
                    <span className="text-[11px] text-warm-gray block mb-1">Key Focus Sectors:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {platform.categories.map((cat, cIdx) => (
                        <span key={cIdx} className="text-[11px] px-2 py-0.5 rounded bg-surface border border-border-subtle font-medium text-on-surface">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Synergy Callout */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-[#1b2633] text-white rounded-3xl p-8 sm:p-12 border border-[#2d4054] text-center max-w-4xl mx-auto space-y-4">
          <ShieldCheck size={36} className="text-secondary mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-bold font-serif">
            One Unified Commitment: Zero Adulteration
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Whether a customer purchases a 100ml jar of Sabari GKS Vedic Ghee, a family orders daily groceries from GKS Mart (gksmart.in), or an industrial bakery receives 50 tins of wood-pressed oil, every single item complies with FSSAI standards and passes rigorous laboratory purity checks.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all"
            >
              <span>Connect with Our Management Team</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
