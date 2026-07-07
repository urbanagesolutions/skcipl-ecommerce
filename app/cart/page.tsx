'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, loading, updateQuantity, removeFromCart, syncing } = useCart();

  const getItemPrice = (item: CartItem) => {
    if (item.product_variants && item.product_variants.price_override !== null) {
      return Number(item.product_variants.price_override);
    }
    return Number(item.products.price);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (getItemPrice(item) * item.quantity), 0);
  const discount = subtotal > 500 ? 50 : 0; // Simple conditional coupon mock
  const shipping = 0; // free shipping
  const total = Math.max(0, subtotal - discount + shipping);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-body-sm text-warm-gray">Loading your shopping cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-headline-lg text-on-surface mb-8 flex items-center gap-2">
        <ShoppingBag size={28} /> Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        {syncing && <Loader2 className="animate-spin text-warm-gray" size={18} />}
      </h1>

      {cartItems.length === 0 ? (
        <Card elevation={1} className="py-16 text-center space-y-6 max-w-xl mx-auto">
          <div className="text-display-sm text-warm-gray">Your cart is empty</div>
          <p className="text-body-sm text-warm-gray max-w-md mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Explore our pure cow ghee and organic consumables catalog to get started.
          </p>
          <Link href="/">
            <Button variant="primary">Shop Our Catalogue</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Cart Items List */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => {
              const price = getItemPrice(item);
              const productName = item.products.name;
              const variantName = item.product_variants?.variant_name;
              const displayName = variantName ? `${productName} (${variantName})` : productName;
              const productImage = item.products.images && item.products.images[0]
                ? item.products.images[0]
                : '/assets/placeholder-product.png';

              return (
                <Card key={item.id} elevation={1} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#faf8f5] border border-border-subtle rounded-md flex items-center justify-center p-1.5">
                      <img src={productImage} alt={productName} className="object-contain max-h-full max-w-full" />
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface text-body-lg">
                        <Link href={`/product/${item.products.slug}`} className="hover:text-primary transition-colors">
                          {displayName}
                        </Link>
                      </h3>
                      <span className="text-body-sm text-price-green font-semibold">₹{price} each</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    {/* Quantity Modifier */}
                    <div className="flex items-center border border-border-subtle rounded-md bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-on-surface-variant hover:text-primary font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 text-body-sm font-semibold min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-on-surface-variant hover:text-primary font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block font-bold text-on-surface text-body-lg">₹{price * item.quantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-sale-red hover:underline flex items-center gap-1 mt-1 justify-end transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}

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
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="font-semibold text-on-surface">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sale-red">
                    <span>Promo Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fees</span>
                  <span className="text-secondary font-semibold">FREE</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4 flex justify-between items-baseline">
                <span className="font-bold text-on-surface text-body-lg">Grand Total</span>
                <span className="text-display-lg text-price-green font-bold">₹{total}</span>
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
      )}
    </div>
  );
}
