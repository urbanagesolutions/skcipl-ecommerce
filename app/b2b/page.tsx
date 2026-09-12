'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Package, 
  Truck, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { CORPORATE_INFO } from '@/lib/data';

export default function B2BPage() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    businessType: 'Sweet Manufacturer',
    productInterest: 'Sabari GKS Pure Desi Cow Ghee (15L Tin)',
    estimatedMonthlyVolume: '10 - 25 Tins',
    deliveryLocation: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const businessTypes = [
    'Sweet & Confectionery Manufacturer',
    'Commercial Bakery & Snacks Unit',
    'Hotel / Restaurant / Catering (HoReCa)',
    'Temple Trust / Devasthanam',
    'Wholesale FMCG Distributor',
    'Supermarket / Retail Chain (GKS Mart Partner)',
    'Exporter / Overseas Distributor'
  ];

  const handleWhatsAppDispatch = () => {
    const text = `*New Wholesale / B2B Inquiry - SKCIPL*%0A%0A` +
      `*Company:* ${form.companyName || 'Not specified'}%0A` +
      `*Contact Person:* ${form.contactName || 'Not specified'}%0A` +
      `*Phone:* ${form.phone || 'Not specified'}%0A` +
      `*Email:* ${form.email || 'Not specified'}%0A` +
      `*Business Sector:* ${form.businessType}%0A` +
      `*Product Interest:* ${form.productInterest}%0A` +
      `*Estimated Volume:* ${form.estimatedMonthlyVolume}%0A` +
      `*Delivery City:* ${form.deliveryLocation || 'Tamil Nadu / India'}%0A` +
      `*Requirements / Notes:* ${form.notes || 'None'}`;

    window.open(`https://wa.me/919842228484?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const handleEmailDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`B2B Wholesale Inquiry: ${form.companyName || form.contactName}`);
    const body = encodeURIComponent(
      `Company Name: ${form.companyName}\n` +
      `Contact Name: ${form.contactName}\n` +
      `Phone: ${form.phone}\n` +
      `Email: ${form.email}\n` +
      `Business Type: ${form.businessType}\n` +
      `Product Interest: ${form.productInterest}\n` +
      `Estimated Monthly Volume: ${form.estimatedMonthlyVolume}\n` +
      `Delivery Location: ${form.deliveryLocation}\n\n` +
      `Additional Notes:\n${form.notes}`
    );

    window.location.href = `mailto:${CORPORATE_INFO.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white py-16 border-b border-[#2d4054]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-amber-300 text-xs font-semibold">
            <Building2 size={14} />
            <span>Institutional Supply Division of SKCIPL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight">
            Wholesale & Institutional Bulk Supply
          </h1>
          <p className="text-base text-gray-300 max-w-2xl font-light leading-relaxed">
            Direct factory dispatch of <strong>Sabari GKS</strong> Pure Cow Ghee, Buffalo Ghee, and Cold-Pressed Oils in 5L, 15L tins, and 200L barrels for sweet makers, hotels, and FMCG distributors across India.
          </p>
        </div>
      </section>

      {/* 2. Key Pillars */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">Factory Direct Pricing</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tiered volume pricing designed for commercial sweet makers, restaurants, and cloud kitchen chains with transparent batch invoicing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Package size={24} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">15L Tins & Bulk Packs</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Heavy-gauge food-grade 15-litre tins, 5L cans, and 200L drums engineered to withstand transit with zero aroma loss or leakage.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Truck size={24} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">Scheduled Pan-India Logistics</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Reliable freight partnerships ensuring prompt recurring deliveries across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and all India.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Interactive B2B Quote & Inquiry Form */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 bg-white rounded-3xl border border-border-subtle p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-border-subtle pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Instant Request
              </span>
              <h2 className="text-2xl font-bold font-serif text-on-surface">
                Institutional Bulk Quotation Builder
              </h2>
              <p className="text-xs text-on-surface-variant">
                Fill in your enterprise details below. You can send this quotation request directly through WhatsApp or Email for prioritized review.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>Thank you! Your institutional inquiry was generated. Our wholesale desk will respond within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleEmailDispatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Company / Entity Name *</label>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="e.g. Sri Krishna Sweets / Hotel Heritage"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Authorized Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="e.g. S. Ramanathan (Purchase Head)"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98422 XXXXX"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="purchase@yourcompany.com"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Industry Sector</label>
                  <select
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    {businessTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Product of Interest</label>
                  <select
                    value={form.productInterest}
                    onChange={(e) => setForm({ ...form, productInterest: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    <option value="Sabari GKS Pure Desi Cow Ghee (15L Tin)">Sabari GKS Pure Desi Cow Ghee (15L Tin)</option>
                    <option value="Sabari GKS Pure Buffalo Ghee (15L Tin)">Sabari GKS Pure Buffalo Ghee (15L Tin)</option>
                    <option value="Wood Pressed Groundnut Oil (15L Tin)">Wood Pressed Groundnut Oil (15L Tin)</option>
                    <option value="Cold Pressed Sesame / Gingelly Oil (15L Tin)">Cold Pressed Sesame / Gingelly Oil (15L Tin)</option>
                    <option value="Extra Virgin Coconut Oil (15L / Bulk)">Extra Virgin Coconut Oil (15L / Bulk)</option>
                    <option value="GKS Mart Rice & Staples Bulk Sacks (25kg)">GKS Mart Rice & Staples Bulk Sacks (25kg)</option>
                    <option value="Multiple Products / Complete HoReCa Supply">Multiple Products / Complete HoReCa Supply</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Estimated Monthly Requirement</label>
                  <input
                    type="text"
                    value={form.estimatedMonthlyVolume}
                    onChange={(e) => setForm({ ...form, estimatedMonthlyVolume: e.target.value })}
                    placeholder="e.g. 15 to 30 Tins per month"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Delivery Destination / City</label>
                  <input
                    type="text"
                    value={form.deliveryLocation}
                    onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })}
                    placeholder="e.g. Coimbatore, Chennai, Bangalore"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Additional Specifications / GST Details</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Mention delivery frequency, GSTIN number, packaging preferences, or test certificate requests..."
                  className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppDispatch}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <span>Dispatch via WhatsApp</span>
                  <ExternalLink size={14} />
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <Send size={14} />
                  <span>Send via Corporate Email</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Institutional Contacts & Specifications */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-5 text-xs">
              <h3 className="font-bold font-serif text-base text-on-surface border-b border-border-subtle pb-3">
                Institutional Help Desk
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-warm-gray block text-[11px]">Direct Wholesale Hotline:</span>
                    <a href={`tel:${CORPORATE_INFO.phone}`} className="font-bold text-on-surface hover:text-primary text-sm">
                      {CORPORATE_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-warm-gray block text-[11px]">Institutional Desk Email:</span>
                    <a href={`mailto:${CORPORATE_INFO.email}`} className="font-bold text-on-surface hover:text-primary text-sm">
                      {CORPORATE_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <span className="text-warm-gray block text-[11px]">Factory Dispatch Center:</span>
                    <span className="font-semibold text-on-surface">Puliyamarathottam Processing Unit, Karuvampalayam, Tiruppur</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle space-y-2">
                <span className="font-bold text-on-surface block">Commercial Invoicing Details:</span>
                <p className="text-on-surface-variant">
                  • CIN: {CORPORATE_INFO.cin}<br />
                  • GSTIN: {CORPORATE_INFO.gstin}<br />
                  • FSSAI Central Lic: {CORPORATE_INFO.fssai}
                </p>
              </div>
            </div>

            {/* Packaging Preview Card */}
            <div className="bg-[#1c2a38] text-white rounded-3xl p-6 space-y-3 text-xs">
              <span className="text-amber-300 font-bold uppercase tracking-wider block text-[10px]">
                Bulk Packaging Standards
              </span>
              <h4 className="font-bold font-serif text-sm">
                15-Litre Tin Specifications
              </h4>
              <p className="text-gray-300 leading-relaxed">
                Our 15-litre tins are manufactured from virgin electrolytic tinplate (ETP) with food-grade epoxy inner lining, sealed tamper-evident pouring spouts, and reinforced corner embossing to ensure zero transport denting.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
