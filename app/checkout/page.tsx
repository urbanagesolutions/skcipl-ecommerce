'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  MapPin, Plus, Check, Loader2, CreditCard, ArrowLeft, 
  AlertCircle, Ticket, CheckCircle, Info, Phone, Mail 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

interface Address {
  id: string;
  label: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface AuthUser {
  id: string;
  email?: string;
}

interface CustomerProfile {
  user_id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: 'Percentage' | 'Fixed';
  discount_value: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

interface CompanySettings {
  brand_name?: string;
  fssai_license_number?: string;
  gst_number?: string;
  cin?: string;
  support_email?: string;
  support_phone?: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, loading: cartLoading, refreshCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  
  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Address Form Fields
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressPincode, setAddressPincode] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Payment/Fulfillment State
  const [paymentError, setPaymentError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  // Check auth status & fetch addresses + settings
  useEffect(() => {
    async function initCheckout() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/auth?redirectTo=/checkout');
          return;
        }
        setUser(session.user);

        // Fetch customer profile
        const { data: customerProfile } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        setProfile(customerProfile);

        // Fetch addresses
        await fetchAddresses(session.user.id);

        // Fetch company settings
        const { data: settings } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        setCompanySettings(settings);

      } catch (err) {
        console.error('Error initializing checkout:', err);
      } finally {
        setLoadingAddresses(false);
      }
    }
    initCheckout();
  }, [router]);

  const fetchAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('customer_id', userId)
      .order('is_default', { ascending: false });

    if (!error && data) {
      setAddresses(data);
      if (data.length > 0) {
        const defaultAddr = data.find(a => a.is_default) || data[0];
        setSelectedAddressId(defaultAddr.id);
      }
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!addressLine || !addressCity || !addressState || !addressPincode) {
      alert('Please fill out all address fields.');
      return;
    }

    try {
      setSavingAddress(true);
      const isDefault = addresses.length === 0;

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          customer_id: user.id,
          label: addressLabel,
          address_line: addressLine,
          city: addressCity,
          state: addressState,
          pincode: addressPincode,
          is_default: isDefault
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAddresses(prev => [data, ...prev]);
        setSelectedAddressId(data.id);
        setShowAddressForm(false);
        // Clear form
        setAddressLine('');
        setAddressCity('');
        setAddressState('');
        setAddressPincode('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save address. Please try again.';
      console.error('Error saving address:', err);
      alert(msg);
    } finally {
      setSavingAddress(false);
    }
  };

  // Coupon Verification
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      setApplyingCoupon(true);
      setCouponError('');
      setAppliedCoupon(null);

      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        setCouponError('Invalid coupon code.');
        return;
      }

      const now = new Date();
      const from = new Date(coupon.valid_from);
      const until = new Date(coupon.valid_until);

      if (now < from || now > until) {
        setCouponError('This coupon code has expired.');
        return;
      }

      setAppliedCoupon(coupon);
    } catch {
      setCouponError('Could not verify coupon.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Computations
  const getItemPrice = (item: { products: { price: number }; product_variants?: { price_override: number | null } | null; quantity: number }) => {
    if (item.product_variants && item.product_variants.price_override !== null) {
      return Number(item.product_variants.price_override);
    }
    return Number(item.products.price);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (getItemPrice(item) * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'Percentage') {
      discount = Number(((subtotal * Number(appliedCoupon.discount_value)) / 100).toFixed(2));
    } else if (appliedCoupon.discount_type === 'Fixed') {
      discount = Number(Number(appliedCoupon.discount_value).toFixed(2));
    }
    discount = Math.min(discount, subtotal);
  }

  // flat ₹50, free if subtotal >= 999
  const shippingFee = subtotal >= 999 ? 0 : 50;

  // 5% GST
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.05).toFixed(2));

  // Grand total
  const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

  // Step 3 Payment Handler
  const handlePayment = async () => {
    if (!selectedAddressId) {
      setPaymentError('Please select a delivery address first.');
      setStep(1);
      return;
    }

    try {
      setPlacingOrder(true);
      setPaymentError('');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      // 1. Create Razorpay order server-side
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          couponCode: appliedCoupon?.code || null
        })
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order.');
      }

      const { razorpayOrderId, amount, keyId } = orderData;

      // Check if Razorpay script is loaded
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).Razorpay) {
        throw new Error('Payment gateway not loaded yet. Please wait a moment and try again.');
      }

      // 2. Open Razorpay Popup
      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'Sabari Krishna',
        description: 'Pure Organic Consumables order',
        order_id: razorpayOrderId,
        handler: async function (response: RazorpayResponse) {
          try {
            setPlacingOrder(true);
            // Verify payment signature server-side
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address_id: selectedAddressId,
                coupon_code: appliedCoupon?.code || null
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await refreshCart();
              router.push(`/order-success?orderId=${verifyData.orderId}`);
            } else {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (verifyErr: unknown) {
            const msg = verifyErr instanceof Error ? verifyErr.message : 'Payment verification failed. Please contact support.';
            setPaymentError(msg);
            setPlacingOrder(false);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        prefill: {
          name: profile?.name || user?.email?.split('@')[0] || '',
          email: user?.email || '',
          contact: profile?.phone ?? ''
        },
        theme: {
          color: '#8B5A2B' // Elegant brand color
        },
        modal: {
          ondismiss: function() {
            setPlacingOrder(false);
            setPaymentError('Payment was cancelled. You can try again.');
          }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: { error: { description?: string } }) {
        setPaymentError(response.error.description || 'Payment transaction failed.');
        setPlacingOrder(false);
      });
      rzp.open();

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      console.error('Error placing order:', err);
      setPaymentError(msg);
      setPlacingOrder(false);
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  if (cartLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary animate-duration-1000" size={40} />
        <p className="text-body-sm text-warm-gray">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Page Title */}
      <h1 className="text-headline-lg text-on-surface mb-8">Checkout Securely</h1>

      {/* Steps Stepper */}
      <div className="flex items-center justify-between max-w-2xl mb-10 bg-[#FAF8F5] p-4 rounded-xl border border-border-subtle">
        <button 
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 text-xs font-bold uppercase transition-all ${
            step === 1 ? 'text-primary' : 'text-warm-gray hover:text-on-surface'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step >= 1 ? 'bg-primary text-white' : 'bg-warm-gray bg-opacity-20 text-warm-gray'
          }`}>1</span>
          Delivery Address
        </button>
        <div className="flex-1 h-[2px] bg-border-subtle mx-4"></div>
        <button 
          onClick={() => selectedAddressId && setStep(2)}
          disabled={!selectedAddressId}
          className={`flex items-center gap-2 text-xs font-bold uppercase transition-all ${
            step === 2 ? 'text-primary' : 'text-warm-gray hover:text-on-surface'
          } disabled:opacity-50`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step >= 2 ? 'bg-primary text-white' : 'bg-warm-gray bg-opacity-20 text-warm-gray'
          }`}>2</span>
          Review Order
        </button>
        <div className="flex-1 h-[2px] bg-border-subtle mx-4"></div>
        <button 
          onClick={() => selectedAddressId && cartItems.length > 0 && setStep(3)}
          disabled={!selectedAddressId || cartItems.length === 0}
          className={`flex items-center gap-2 text-xs font-bold uppercase transition-all ${
            step === 3 ? 'text-primary' : 'text-warm-gray hover:text-on-surface'
          } disabled:opacity-50`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 3 ? 'bg-primary text-white' : 'bg-warm-gray bg-opacity-20 text-warm-gray'
          }`}>3</span>
          Payment Options
        </button>
      </div>

      {paymentError && (
        <div className="max-w-4xl mb-6 bg-error-container text-on-error-container p-4 rounded-xl border border-error border-opacity-20 flex items-start gap-3">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <span className="font-bold text-body-sm block">Checkout Issue</span>
            <span className="text-xs">{paymentError}</span>
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <Card elevation={1} className="py-16 text-center space-y-6 max-w-xl mx-auto">
          <div className="text-display-sm text-warm-gray">Your cart is empty</div>
          <p className="text-body-sm text-warm-gray max-w-md mx-auto">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link href="/">
            <Button variant="primary">Browse Storefront</Button>
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Checkout Column */}
          <div className="flex-1 space-y-6">
            
            {/* STEP 1: DELIVERY ADDRESS */}
            {step === 1 && (
              <Card elevation={1} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                    <MapPin className="text-primary" size={20} />
                    Choose Delivery Address
                  </h2>
                  {!showAddressForm && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Address
                    </Button>
                  )}
                </div>

                {loadingAddresses ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                ) : showAddressForm ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4 bg-[#FAF8F5] p-5 rounded-xl border border-border-subtle">
                    <h3 className="text-body-sm font-bold text-primary">New Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-warm-gray uppercase">Address Label</label>
                        <select 
                          value={addressLabel} 
                          onChange={(e) => setAddressLabel(e.target.value)}
                          className="w-full border border-border-subtle rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-primary"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-warm-gray uppercase">Pincode (6 digits)</label>
                        <Input 
                          required 
                          placeholder="e.g. 600002" 
                          maxLength={6} 
                          value={addressPincode}
                          onChange={(e) => setAddressPincode(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-warm-gray uppercase">Street / Flat / Apartment Address</label>
                        <Input 
                          required 
                          placeholder="House No, Road name, Area" 
                          value={addressLine}
                          onChange={(e) => setAddressLine(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-warm-gray uppercase">Town/City</label>
                        <Input 
                          required 
                          placeholder="e.g. Chennai" 
                          value={addressCity}
                          onChange={(e) => setAddressCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-warm-gray uppercase">State</label>
                        <Input 
                          required 
                          placeholder="e.g. Tamil Nadu" 
                          value={addressState}
                          onChange={(e) => setAddressState(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2 border-t border-border-subtle">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="sm" 
                        disabled={savingAddress}
                      >
                        {savingAddress ? 'Saving...' : 'Save & Select'}
                      </Button>
                    </div>
                  </form>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-body-sm text-warm-gray">No shipping addresses found.</p>
                    <Button variant="primary" size="sm" onClick={() => setShowAddressForm(true)}>
                      Add Delivery Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 border rounded-xl cursor-pointer relative transition-all flex flex-col justify-between ${
                            isSelected 
                              ? 'border-primary bg-primary bg-opacity-5' 
                              : 'border-border-subtle hover:border-primary'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary uppercase bg-[#EFEFEF] px-2 py-0.5 rounded">
                                {addr.label}
                              </span>
                              {isSelected && (
                                <span className="bg-primary text-white rounded-full p-0.5">
                                  <Check size={12} />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-on-surface font-semibold pt-1 leading-relaxed">
                              {addr.address_line}
                            </p>
                            <p className="text-[11px] text-warm-gray">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedAddressId && !showAddressForm && (
                  <div className="flex justify-end pt-4 border-t border-border-subtle">
                    <Button 
                      variant="primary" 
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1.5"
                    >
                      Next: Review Order
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {/* STEP 2: ORDER REVIEW */}
            {step === 2 && (
              <Card elevation={1} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                    Review Ordered Items
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <ArrowLeft size={12} /> Edit Address
                  </Button>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const price = getItemPrice(item);
                    const displayName = item.product_variants?.variant_name 
                      ? `${item.products.name} (${item.product_variants.variant_name})` 
                      : item.products.name;

                    return (
                      <div key={item.id} className="flex justify-between items-start gap-4 py-2 border-b border-border-subtle last:border-0">
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{displayName}</h4>
                          <span className="text-[10px] text-warm-gray">Qty: {item.quantity} x ₹{price}</span>
                        </div>
                        <span className="text-xs font-bold text-on-surface">₹{price * item.quantity}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code block */}
                <div className="pt-4 border-t border-border-subtle space-y-3">
                  <h3 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <Ticket className="text-primary" size={14} /> Coupon Discount
                  </h3>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-secondary bg-opacity-5 p-3 rounded-lg border border-secondary border-opacity-10 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-secondary" size={16} />
                        <div>
                          <span className="font-bold text-on-surface">Code: {appliedCoupon.code}</span>
                          <p className="text-[10px] text-warm-gray">
                            Saved ₹{discount} ({appliedCoupon.discount_type === 'Percentage' ? `${appliedCoupon.discount_value}%` : `Flat ₹${appliedCoupon.discount_value}`})
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-[10px] font-bold text-sale-red hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input 
                          placeholder="e.g. WELCOME100" 
                          value={couponCode} 
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError('');
                          }}
                        />
                        {couponError && <p className="text-[10px] text-sale-red mt-1 font-semibold">{couponError}</p>}
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode}
                      >
                        {applyingCoupon ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-border-subtle">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="primary" onClick={() => setStep(3)}>
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* STEP 3: PAYMENT DETAILS */}
            {step === 3 && (
              <Card elevation={1} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                    <CreditCard className="text-primary" size={20} />
                    Secure Billing & Payment
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Address Summary */}
                  {selectedAddress && (
                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-border-subtle space-y-1.5 text-xs">
                      <div className="flex justify-between items-center pb-1 border-b border-border-subtle mb-1">
                        <span className="font-bold text-primary text-[10px] uppercase">DELIVERING TO</span>
                        <button onClick={() => setStep(1)} className="text-[10px] text-primary font-bold hover:underline">Change</button>
                      </div>
                      <p className="font-bold text-on-surface">{selectedAddress.address_line}</p>
                      <p className="text-warm-gray">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                    </div>
                  )}

                  {/* Payment instruction */}
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-border-subtle flex items-start gap-3">
                    <Info className="text-primary flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-[11px] text-warm-gray leading-relaxed">
                      You are executing a secure transaction via Razorpay. We support Credit/Debit Cards, UPI, Netbanking, and Wallets. Do not refresh this page once payment starts.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-border-subtle">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handlePayment}
                    disabled={placingOrder}
                    className="flex items-center gap-2"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Verifying Transaction...
                      </>
                    ) : (
                      <>
                        Proceed to Pay ₹{total}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}

          </div>

          {/* Right Sidebar - Checkout Details */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <Card elevation={1} className="space-y-6 sticky top-6">
              <h3 className="text-title-md font-bold text-on-surface pb-3 border-b border-border-subtle">
                Review Pricing
              </h3>

              <div className="space-y-3 text-xs text-warm-gray">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-on-surface">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sale-red font-semibold">
                    <span>Coupon Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fees</span>
                  {shippingFee === 0 ? (
                    <span className="text-secondary font-semibold uppercase">FREE</span>
                  ) : (
                    <span className="font-semibold text-on-surface">₹{shippingFee}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>GST (5% tax)</span>
                  <span className="font-semibold text-on-surface">₹{tax}</span>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4 flex justify-between items-baseline">
                <span className="font-bold text-on-surface text-body-lg">Total Amount</span>
                <span className="text-display-sm text-price-green font-bold">₹{total}</span>
              </div>

              {/* FSSAI details */}
              {companySettings && (
                <div className="bg-[#FAF8F5] p-3 rounded-lg border border-border-subtle space-y-1.5 text-[9px] text-warm-gray">
                  <p><strong>Merchant:</strong> {companySettings.brand_name || 'Sabari Krishna'}</p>
                  {companySettings.fssai_license_number && (
                    <p><strong>FSSAI Lic. No:</strong> {companySettings.fssai_license_number}</p>
                  )}
                  {companySettings.gst_number && (
                    <p><strong>GSTIN:</strong> {companySettings.gst_number}</p>
                  )}
                  {companySettings.cin && (
                    <p><strong>CIN:</strong> {companySettings.cin}</p>
                  )}
                  <div className="flex items-center gap-3 pt-1 border-t border-border-subtle mt-1 text-[8px]">
                    {companySettings.support_email && (
                      <span className="flex items-center gap-0.5">
                        <Mail size={10} /> {companySettings.support_email}
                      </span>
                    )}
                    {companySettings.support_phone && (
                      <span className="flex items-center gap-0.5">
                        <Phone size={10} /> {companySettings.support_phone}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </aside>

        </div>
      )}
    </div>
  );
}
