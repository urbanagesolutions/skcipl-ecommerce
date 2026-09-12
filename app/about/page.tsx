import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Award, 
  Store, 
  ShieldCheck, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CORPORATE_INFO } from '@/lib/data';
import TraditionalCraftFaq from '@/components/TraditionalCraftFaq';

export const metadata = {
  title: 'About Us | Sabari Krishna Consumables India Private Limited',
  description: 'Learn about the history, leadership, vision, and multi-platform operations of Sabari Krishna Consumables India Private Limited, based in Tiruppur, Tamil Nadu.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white py-16 border-b border-[#2d4054]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-amber-300 text-xs font-semibold">
            <Building2 size={14} />
            <span>Corporate Profile & Heritage</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight">
            Sabari Krishna Consumables <br />
            <span className="text-amber-300">India Private Limited</span>
          </h1>
          <p className="text-base text-gray-300 max-w-2xl font-light leading-relaxed">
            Bridging ancient Vedic food traditions with modern food safety and omnichannel supermarket convenience through <strong>Sabari GKS</strong> and <strong>GKS Mart (gksmart.in)</strong>.
          </p>
        </div>
      </section>

      {/* 2. Corporate Story & Mission */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Our Roots in Tiruppur
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                Crafting Food as Medicine Since Inception
              </h2>
            </div>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Incorporated on <strong>March 24, 2022</strong> under the Ministry of Corporate Affairs, Government of India, <strong>Sabari Krishna Consumables India Private Limited (SKCIPL)</strong> was conceived with a clear and uncompromising goal: to liberate Indian households and culinary masters from industrial, chemically adulterated food commodities.
            </p>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              Operating out of Tiruppur, the historic textile and agricultural hub of Tamil Nadu, our founders recognized that modern industrial shortcuts—such as chemical solvent oil extraction, high-speed heat centrifuges for ghee, and synthetic food waxing—had eroded the health and nutritional integrity of daily meals.
            </p>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              We revived the time-honored <strong>Vedic Bilona</strong> hand-churning process for curd-churned cow ghee and set up traditional <strong>Vaagai Marachekku (wooden cold-press)</strong> expellers for cold-pressed groundnut, gingelly, and coconut oils. Building on this manufacturing excellence, we inaugurated our retail supermarket network and digital e-grocery platform, <strong>GKS Mart (<span className="text-emerald-700 font-semibold">gksmart.in</span>)</strong>, directly connecting local organic farmers to consumers.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <ShieldCheck size={18} />
                  <span>Absolute Purity</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Zero chemical refining, artificial flavors, preservatives, or synthetic bleaching agents.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Sparkles size={18} />
                  <span>Vedic Wisdom</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Culturing milk into curd before bi-directional wooden churning to retain living bio-enzymes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <Store size={18} />
                  <span>GKS Mart Access</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Accessible everyday supermarket retail and fast doorstep delivery at honest farm-gate prices.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <Users size={18} />
                  <span>Farmer First</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Direct procurement from over 500+ indigenous dairy rearers and Kongu oilseed growers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Corporate Credentials Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-bold font-serif text-lg text-on-surface border-b border-border-subtle pb-3 flex items-center justify-between">
                <span>Corporate Registration</span>
                <Award className="text-primary" size={20} />
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-warm-gray block text-[11px]">Company Name:</span>
                  <span className="font-bold text-on-surface text-sm">Sabari Krishna Consumables India Private Limited</span>
                </div>

                <div>
                  <span className="text-warm-gray block text-[11px]">Corporate Identification Number (CIN):</span>
                  <span className="font-mono font-bold text-on-surface bg-surface px-2 py-1 rounded inline-block">
                    {CORPORATE_INFO.cin}
                  </span>
                </div>

                <div>
                  <span className="text-warm-gray block text-[11px]">GST Identification Number (GSTIN):</span>
                  <span className="font-mono font-bold text-on-surface bg-surface px-2 py-1 rounded inline-block">
                    {CORPORATE_INFO.gstin}
                  </span>
                </div>

                <div>
                  <span className="text-warm-gray block text-[11px]">FSSAI Central Food Safety License:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                    {CORPORATE_INFO.fssai}
                  </span>
                  <span className="text-[10px] text-warm-gray block mt-0.5">Valid until: {CORPORATE_INFO.fssaiValidUntil}</span>
                </div>

                <div>
                  <span className="text-warm-gray block text-[11px]">Date of Incorporation:</span>
                  <span className="font-semibold text-on-surface">{CORPORATE_INFO.incorporatedDate}</span>
                </div>

                <div>
                  <span className="text-warm-gray block text-[11px]">Registered Office:</span>
                  <span className="text-on-surface leading-relaxed block mt-0.5">{CORPORATE_INFO.registeredOffice}</span>
                </div>
              </div>

              {/* Leadership & Board */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-warm-gray block">
                  Board of Directors:
                </span>
                <div className="space-y-2">
                  {CORPORATE_INFO.directors.map((director, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-surface text-xs">
                      <span className="font-bold text-on-surface">{director.name}</span>
                      <span className="text-primary font-medium text-[11px]">{director.designation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Link Card to GKS Mart */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Store size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-base font-serif">Visit GKS Mart (gksmart.in)</h4>
                  <span className="text-xs text-emerald-200">Our Consumer Retail Division</span>
                </div>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Experience our curated grocery store in Tiruppur or place an online order for farm-to-table delivery.
              </p>
              <Link
                href="/gks-mart"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs transition-colors"
              >
                <span>Discover GKS Mart</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Heritage Science & Process FAQ: Vedic Bilona & Marachekku */}
      <TraditionalCraftFaq />

    </div>
  );
}
