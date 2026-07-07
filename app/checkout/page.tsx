export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CheckoutPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-headline-lg text-on-surface mb-8">Checkout Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Columns - Steps */}
        <div className="flex-1 space-y-6">
          
          {/* Step 1: Shipping Address */}
          <Card elevation={1} className="space-y-4">
            <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">1</span>
              Delivery Address Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Full Name" />
              <Input placeholder="Mobile Number (10 digits)" />
              <div className="md:col-span-2">
                <Input placeholder="Flat, House no., Building, Company, Apartment" />
              </div>
              <Input placeholder="Town/City" />
              <Input placeholder="State" />
              <Input placeholder="Pincode (6 digits)" maxLength={6} />
              <Input placeholder="Landmark (Optional)" />
            </div>
          </Card>

          {/* Step 2: Delivery Slot */}
          <Card elevation={1} className="space-y-4">
            <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">2</span>
              Preferred Delivery Slot
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Standard Delivery', 'Express (Next-day)', 'Scheduled Morning'].map((slot, idx) => (
                <button
                  key={idx}
                  className={`p-3 border rounded-md text-left transition-all ${
                    idx === 0
                      ? 'border-primary bg-primary bg-opacity-5 text-primary'
                      : 'border-border-subtle hover:border-primary'
                  }`}
                >
                  <span className="block font-bold text-body-sm text-on-surface">{slot}</span>
                  <span className="text-[10px] text-warm-gray mt-1 block">
                    {idx === 0 ? 'Free Delivery' : idx === 1 ? '₹49 extra' : '₹29 extra'}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Step 3: Payment Options */}
          <Card elevation={1} className="space-y-4">
            <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-3">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">3</span>
              Choose Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { name: 'UPI (PhonePe, GPay, Paytm)', desc: 'Scan and pay instantly using any UPI app.' },
                { name: 'Credit / Debit Card', desc: 'Secure payments using Visa, MasterCard, RuPay.' },
                { name: 'Cash on Delivery (COD)', desc: 'Pay with cash or UPI at the time of delivery.' }
              ].map((pay, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-4 p-4 border rounded-md cursor-pointer transition-all ${
                    idx === 0
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-border-subtle hover:border-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked={idx === 0}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="block font-bold text-body-sm text-on-surface">{pay.name}</span>
                    <span className="text-xs text-warm-gray mt-1 block">{pay.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Overview Summary */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <Card elevation={1} className="space-y-6">
            <h3 className="text-title-md font-bold text-on-surface pb-3 border-b border-border-subtle">
              Review Order
            </h3>

            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface font-semibold">Desi Cow Ghee (500 ml) x 1</span>
                <span className="font-bold text-on-surface">₹599</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface font-semibold">Virgin Coconut Oil (1L) x 2</span>
                <span className="font-bold text-on-surface">₹598</span>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4 space-y-2 text-xs text-warm-gray">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹1197</span>
              </div>
              <div className="flex justify-between text-sale-red">
                <span>Discount Applied</span>
                <span>- ₹50</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-secondary font-semibold">FREE</span>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4 flex justify-between items-baseline">
              <span className="font-bold text-on-surface text-body-lg">Grand Total</span>
              <span className="text-headline-lg text-price-green font-bold">₹1147</span>
            </div>

            {/* FSSAI Disclaimer validation */}
            <p className="text-[10px] text-warm-gray leading-relaxed">
              By clicking Place Order, you confirm your shipping address and agree to Sabari Krishna terms of sale. FSSAI registration verified.
            </p>

            <Link href="/order-success" className="block w-full">
              <Button variant="secondary" fullWidth size="lg">
                PLACE ORDER
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
