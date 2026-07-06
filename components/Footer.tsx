import React from 'react';
import Link from 'next/link';
import { Category, CompanySettings } from '@/types';

interface FooterProps {
  categories: Category[];
  companySettings: CompanySettings;
}

export const Footer: React.FC<FooterProps> = ({ categories, companySettings }) => {
  const activeCategories = categories.filter(c => c.is_active);

  return (
    <footer className="w-full bg-[#eeeef0] text-on-surface-variant border-t border-border-subtle pt-12 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Company Info */}
        <div className="flex flex-col gap-4">
          <span className="text-xl font-bold text-primary">Sabari Krishna</span>
          <p className="text-body-sm text-on-surface-variant">
            Pioneering premium consumables across India. Dedicated to delivering pure, authentic, and high-quality ghee, oils, and groceries.
          </p>
          <div className="text-xs text-warm-gray flex flex-col gap-1 mt-2">
            {companySettings.cin && <span>CIN: {companySettings.cin}</span>}
            {companySettings.gst_number && <span>GSTIN: {companySettings.gst_number}</span>}
            <span className="font-semibold text-secondary flex items-center gap-1.5 mt-1">
              FSSAI Lic. No. {companySettings.fssai_license_number}
            </span>
            <span className="text-[10px]">Valid until: {companySettings.fssai_valid_until}</span>
          </div>
        </div>

        {/* Categories (Dynamic) */}
        <div>
          <h4 className="text-title-md font-bold text-on-surface mb-4">Our Categories</h4>
          <ul className="flex flex-col gap-2.5">
            {activeCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-body-sm hover:text-primary hover:underline transition-all"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Quick Links */}
        <div>
          <h4 className="text-title-md font-bold text-on-surface mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href="/about" className="text-body-sm hover:text-primary hover:underline transition-all">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-body-sm hover:text-primary hover:underline transition-all">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-body-sm hover:text-primary hover:underline transition-all">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-body-sm hover:text-primary hover:underline transition-all">
                Merchant Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-title-md font-bold text-on-surface mb-4">Support</h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href="/privacy-policy" className="text-body-sm hover:text-primary hover:underline transition-all">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="text-body-sm hover:text-primary hover:underline transition-all">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="text-body-sm hover:text-primary hover:underline transition-all">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="text-body-sm hover:text-primary hover:underline transition-all">
                Refund & Cancellation
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-6 border-t border-border-subtle text-center text-xs text-warm-gray">
        <p>© 2026 Sabari Krishna Consumables India Private Limited. All Rights Reserved.</p>
        <p className="mt-1 text-[10px]">All food products are verified under the Food Safety and Standards Authority of India (FSSAI).</p>
      </div>
    </footer>
  );
};
export default Footer;
