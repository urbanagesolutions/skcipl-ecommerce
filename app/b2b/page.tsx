'use client';

import React, { useState } from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building2, Package, Truck } from 'lucide-react';

export default function B2BPage() {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '', gst_number: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/b2b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setSubmitted(true);
    } else {
      setError(data.error || 'Submission failed');
    }
  };

  return (
    <StaticPageLayout title="Wholesale & B2B Orders">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 not-prose">
        <div className="p-4 border border-border-subtle rounded-xl text-center">
          <Building2 size={32} className="mx-auto text-primary mb-2" />
          <h3 className="font-bold">Bulk Pricing</h3>
          <p className="text-sm text-warm-gray">Special rates for orders above ₹25,000</p>
        </div>
        <div className="p-4 border border-border-subtle rounded-xl text-center">
          <Package size={32} className="mx-auto text-primary mb-2" />
          <h3 className="font-bold">GST Invoices</h3>
          <p className="text-sm text-warm-gray">Full tax-compliant documentation</p>
        </div>
        <div className="p-4 border border-border-subtle rounded-xl text-center">
          <Truck size={32} className="mx-auto text-primary mb-2" />
          <h3 className="font-bold">Pan-India Delivery</h3>
          <p className="text-sm text-warm-gray">Dedicated logistics for bulk shipments</p>
        </div>
      </div>

      {submitted ? (
        <p className="text-secondary font-bold">Thank you! Our B2B team will contact you within 24 hours.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 not-prose max-w-lg">
          <Input placeholder="Company Name *" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required />
          <Input placeholder="Contact Name *" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required />
          <Input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input placeholder="GST Number" value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} />
          <textarea
            className="w-full border border-border-subtle rounded-lg p-3 text-sm min-h-[100px]"
            placeholder="Tell us about your requirements..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {error && <p className="text-sale-red text-sm">{error}</p>}
          <Button type="submit" variant="primary">Submit Inquiry</Button>
        </form>
      )}
    </StaticPageLayout>
  );
}
