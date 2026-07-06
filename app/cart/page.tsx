import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  // Mock shopping cart items
  const cartItems = [
    { id: 'c1', name: 'Pure Desi Cow Ghee (Bilona Method) - 500 ml', price: 599, qty: 1 },
    { id: 'c2', name: 'Cold Pressed Virgin Coconut Oil - 1 Litre', price: 299, qty: 2 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discount = 50;
  const shipping = 0; // free shipping
  const total = subtotal - discount + shipping;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-headline-lg text-on-surface mb-8 flex items-center gap-2">
        <ShoppingBag size={28} /> Shopping Cart ({cartItems.length} items)
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left - Cart Items List */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} elevation={1} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xs text-warm-gray font-bold">
                  Img
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-body-lg">{item.name}</h3>
                  <span className="text-body-sm text-price-green font-semibold">₹{item.price} each</span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                {/* Quantity Modifier */}
                <div className="flex items-center border border-border-subtle rounded-md">
                  <button className="px-3 py-1 text-on-surface-variant hover:text-primary font-bold">-</button>
                  <span className="px-3 text-body-sm font-semibold">{item.qty}</span>
                  <button className="px-3 py-1 text-on-surface-variant hover:text-primary font-bold">+</button>
                </div>

                <div className="text-right">
                  <span className="block font-bold text-on-surface text-body-lg">₹{item.price * item.qty}</span>
                  <button className="text-xs text-sale-red hover:underline flex items-center gap-1 mt-1 justify-end">
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {/* Cross promotion recommendation strip */}
          <div className="bg-[#eeeef0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-body-sm text-on-surface-variant">
              <span className="font-bold text-on-surface">Add organic turmeric pack</span> for only ₹149 to support healthy daily immunity.
            </div>
            <Button variant="outline" size="sm">Add Recommendation</Button>
          </div>
        </div>

        {/* Right - Order totals */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <Card elevation={1} className="space-y-6">
            <h3 className="text-title-md font-bold text-on-surface pb-3 border-b border-border-subtle">
              Order Summary
            </h3>

            <div className="space-y-3 text-body-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span className="font-semibold text-on-surface">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sale-red">
                <span>Promo Discount</span>
                <span>- ₹{discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                <span className="text-secondary font-semibold">FREE</span>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4 flex justify-between items-baseline">
              <span className="font-bold text-on-surface text-body-lg">Grand Total</span>
              <span className="text-display-lg text-price-green font-bold">₹{total}</span>
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase">Apply Promo Code</label>
              <div className="flex gap-2">
                <Input placeholder="Enter Coupon" className="py-2" />
                <Button variant="outline" size="sm">APPLY</Button>
              </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" className="block w-full">
              <Button variant="primary" fullWidth size="lg" className="flex items-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </Button>
            </Link>

            <Link href="/" className="block text-center text-xs text-primary font-bold hover:underline">
              Continue Shopping
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
