import React from 'react';
import { fetchCompanySettings, fetchCategories } from '@/lib/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Truck, Clock } from 'lucide-react';
import Link from 'next/link';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({}: ProductPageProps) {
  const settings = await fetchCompanySettings();
  const categories = await fetchCategories();

  // Find dynamic category or default to Ghee
  const currentCategory = categories.find(c => c.slug === 'ghee') || categories[0];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-10">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column - Product Gallery */}
        <div className="flex-1 space-y-4">
          <Card elevation={1} className="h-96 flex items-center justify-center bg-[#faf8f5]">
            <span className="text-warm-gray font-bold">[ High Resolution Ghee Product Image ]</span>
          </Card>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-20 border border-border-subtle rounded-md bg-[#faf8f5] flex items-center justify-center text-[10px] text-warm-gray font-semibold cursor-pointer hover:border-primary">
                Thumb {idx}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Purchase panel */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <span className="text-body-sm text-primary font-bold uppercase tracking-wider">{currentCategory.name}</span>
            <h1 className="text-headline-lg text-on-surface">Pure Desi Cow Ghee (Bilona Method)</h1>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-sm">★★★★★</span>
              <span className="text-body-sm text-on-surface-variant font-semibold">4.8 (124 reviews)</span>
            </div>
          </div>

          <div className="border-y border-border-subtle py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-display-lg text-price-green font-bold">₹599</span>
              <span className="text-body-lg line-through text-warm-gray">₹649</span>
              <Badge variant="sale">Save ₹50</Badge>
            </div>
            <p className="text-xs text-warm-gray mt-1">Inclusive of all taxes</p>
          </div>

          {/* Size Variant Selector */}
          <div className="space-y-2">
            <h4 className="text-body-sm font-bold text-on-surface">Select Packaging Size</h4>
            <div className="flex gap-4">
              {['250 ml', '500 ml', '1 Litre'].map((sz, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 border rounded-md text-body-sm font-semibold transition-all ${
                    idx === 1
                      ? 'border-primary bg-primary bg-opacity-5 text-primary'
                      : 'border-border-subtle hover:border-primary'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/cart" className="flex-1">
              <Button variant="secondary" fullWidth size="lg">
                ADD TO CART
              </Button>
            </Link>
            <Link href="/checkout" className="flex-1">
              <Button variant="primary" fullWidth size="lg">
                BUY NOW
              </Button>
            </Link>
          </div>

          {/* Pincode checker mockup */}
          <Card elevation={0} className="p-4 space-y-3">
            <h4 className="text-body-sm font-bold text-on-surface flex items-center gap-2">
              <Truck size={16} /> Delivery Availability
            </h4>
            <div className="flex gap-2">
              <Input placeholder="Enter your 6-digit Pincode (e.g. 600001)" maxLength={6} className="py-2" />
              <Button variant="outline" size="sm">CHECK</Button>
            </div>
            <p className="text-xs text-secondary flex items-center gap-1.5 font-semibold">
              <Clock size={12} /> Standard delivery: 2-3 business days.
            </p>
          </Card>

          {/* Dynamic FSSAI license requirements display (Requirement 3) */}
          {currentCategory.requires_fssai_display && (
            <Card elevation={0} className="p-4 bg-green-50/50 border border-green-200/50 space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold text-body-sm">
                <ShieldCheck size={18} /> Food Safety Compliance
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                As a standard registered food product under dairy, this item is compliant with the Food Safety and Standards Authority of India licensing guidelines.
              </p>
              <div className="text-xs text-secondary font-semibold">
                FSSAI License No. {settings.fssai_license_number}
              </div>
            </Card>
          )}

        </div>
      </div>

      {/* Description accordions */}
      <div className="border-t border-border-subtle pt-8">
        <h3 className="text-headline-lg text-on-surface mb-4">Product Details & Nutrition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-body-sm text-on-surface-variant leading-relaxed">
          <div className="space-y-3">
            <p>
              Our ghee is hand-churned using the traditional Bilona method. Fresh cow milk is boiled and set to curd overnight, then slowly churned using a wooden churner to separate butter fat which is then slow-cooked to golden purity.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>100% natural, free of preservatives or color additives.</li>
              <li>A rich source of butyric acid which supports gut health.</li>
              <li>Sourced from local organic Indian dairy farms.</li>
            </ul>
          </div>
          <Card elevation={0} className="p-4 bg-white">
            <h4 className="font-bold text-on-surface mb-2">Nutritional Values (Per 100g)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border-b border-gray-100 py-1">Energy</div>
              <div className="border-b border-gray-100 py-1 font-bold text-right">897 kcal</div>
              <div className="border-b border-gray-100 py-1">Total Fat</div>
              <div className="border-b border-gray-100 py-1 font-bold text-right">99.7 g</div>
              <div className="border-b border-gray-100 py-1">Saturated Fat</div>
              <div className="border-b border-gray-100 py-1 font-bold text-right">65.2 g</div>
              <div className="border-b border-gray-100 py-1">Protein / Carbs</div>
              <div className="border-b border-gray-100 py-1 font-bold text-right">0.0 g</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export async function generateStaticParams() {
  return [
    { slug: 'pure-desi-cow-ghee' },
    { slug: 'virgin-coconut-oil' }
  ];
}
