'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Store, 
  Building2, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { CORPORATE_INFO } from '@/lib/data';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Corporate Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = encodeURIComponent(`Inquiry from Website: ${form.subject} (${form.name})`);
    const mailtoBody = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${CORPORATE_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    const text = `*Website Contact Inquiry*%0A%0A` +
      `*Name:* ${form.name || 'Not provided'}%0A` +
      `*Phone:* ${form.phone || 'Not provided'}%0A` +
      `*Subject:* ${form.subject}%0A` +
      `*Message:* ${form.message || 'I would like more information about Sabari Krishna Consumables and GKS Mart.'}`;

    window.open(`https://wa.me/919842228484?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white py-16 border-b border-[#2d4054]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-amber-300 text-xs font-semibold">
            <MapPin size={14} />
            <span>Tiruppur, Tamil Nadu Headquarters</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight">
            Contact & Operations Hub
          </h1>
          <p className="text-base text-gray-300 max-w-2xl font-light leading-relaxed">
            Connect directly with the management, wholesale distribution desk, and <strong>GKS Mart (gksmart.in)</strong> retail coordinators at Sabari Krishna Consumables India Private Limited.
          </p>
        </div>
      </section>

      {/* 2. Key Location & Hotline Cards */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">Registered Headquarters</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong>Sabari Krishna Consumables India Pvt Ltd</strong><br />
              {CORPORATE_INFO.registeredOffice}
            </p>
            <span className="text-[11px] font-mono text-warm-gray block pt-1">
              CIN: {CORPORATE_INFO.cin}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Store size={24} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">GKS Mart Retail & Web</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Supermarket store in Tiruppur and digital grocery shopping platform at <strong>gksmart.in</strong>.<br />
              Open all 7 days: 7:30 AM – 9:30 PM.
            </p>
            <Link
              href="/gks-mart"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Explore GKS Mart Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Phone size={24} />
            </div>
            <h3 className="font-bold font-serif text-lg text-on-surface">Helpline & WhatsApp</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Customer Support & Order Assistance:<br />
              <strong className="text-sm text-on-surface">{CORPORATE_INFO.phone}</strong><br />
              Email: {CORPORATE_INFO.email}
            </p>
            <a
              href="https://wa.me/919842228484?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Open WhatsApp Chat</span>
              <ExternalLink size={13} />
            </a>
          </div>

        </div>
      </section>

      {/* 3. Inquiry Form & Management Info */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 bg-white rounded-3xl border border-border-subtle p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-border-subtle pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Reach Out
              </span>
              <h2 className="text-2xl font-bold font-serif text-on-surface">
                Send Us a Direct Message
              </h2>
              <p className="text-xs text-on-surface-variant">
                Whether you have product queries, distribution proposals, or franchise inquiries for GKS Mart, we welcome your communication.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>Message generated! We will be in touch shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98422 XXXXX"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Inquiry Purpose</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    <option value="General Corporate Inquiry">General Corporate Inquiry</option>
                    <option value="GKS Mart Supermarket & Order">GKS Mart Supermarket & Order</option>
                    <option value="GKS Mart Franchise / Partnership">GKS Mart Franchise / Partnership</option>
                    <option value="Wholesale Ghee & Oil Purchase (B2B)">Wholesale Ghee & Oil Purchase (B2B)</option>
                    <option value="Farmer / Supply Tie-up">Farmer / Supply Tie-up</option>
                    <option value="Export & Overseas Distribution">Export & Overseas Distribution</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Message Details</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Please describe your requirement or question..."
                  className="w-full p-2.5 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-xs transition-colors"
                >
                  <span>Connect via WhatsApp</span>
                  <ExternalLink size={14} />
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-colors"
                >
                  <Send size={14} />
                  <span>Send via Email</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Governance & Factory Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-4 text-xs">
              <h3 className="font-bold font-serif text-base text-on-surface border-b border-border-subtle pb-3">
                Corporate Governance
              </h3>

              <div className="space-y-2 text-on-surface-variant">
                <p>
                  <strong>Company:</strong> Sabari Krishna Consumables India Private Limited
                </p>
                <p>
                  <strong>Managing Director:</strong> Karuppusamy Dhandapani
                </p>
                <p>
                  <strong>Director:</strong> Dhandapani Bhuvaneswari
                </p>
                <p>
                  <strong>Incorporation Date:</strong> 24 March 2022
                </p>
                <p>
                  <strong>Registrar of Companies:</strong> RoC Coimbatore
                </p>
                <p>
                  <strong>Central FSSAI Lic:</strong> 12423018000000
                </p>
              </div>
            </div>

            <div className="bg-[#1c2a38] text-white rounded-3xl p-6 space-y-3 text-xs">
              <h4 className="font-bold font-serif text-sm text-yellow-300">
                Factory & Mill Operations
              </h4>
              <p className="text-gray-300 leading-relaxed">
                Our automated butter churners, slow simmering ghee vats, and Vaagai wood expellers are located at Puliyamarathottam, Tiruppur. We strictly welcome business visitors and wholesale clients by prior appointment.
              </p>
              <div className="pt-1">
                <a
                  href={`tel:${CORPORATE_INFO.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-white font-bold underline"
                >
                  <span>Schedule a Facility Visit</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
