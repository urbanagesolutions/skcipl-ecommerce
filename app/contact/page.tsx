'use client';

import React, { useState } from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <StaticPageLayout title="Contact Us">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-primary" />
            <span>support@sabarikrishna.in</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-primary" />
            <span>+91 422 2700124</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-primary" />
            <span>Chennai, Tamil Nadu, India</span>
          </div>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          <Input placeholder="Your Name" required />
          <Input type="email" placeholder="Email Address" required />
          <Input placeholder="Subject" required />
          <textarea
            className="w-full border border-border-subtle rounded-lg p-3 text-sm min-h-[120px]"
            placeholder="Your message..."
            required
          />
          <Button type="submit" variant="primary">Send Message</Button>
          {submitted && (
            <p className="text-secondary text-sm font-semibold">Thank you! We will respond within 24 hours.</p>
          )}
        </form>
      </div>
    </StaticPageLayout>
  );
}
