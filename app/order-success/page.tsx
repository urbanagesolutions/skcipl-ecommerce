'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Download, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
  } | null;
  product_variants: {
    variant_name: string;
  } | null;
}

interface OrderDetails {
  id: string;
  created_at: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  customer_id: string;
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-body-sm text-warm-gray">Loading order details...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch Order
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .maybeSingle();

        if (orderErr) throw orderErr;
        if (!orderData) {
          setError('Order details could not be found.');
          setLoading(false);
          return;
        }

        setOrder(orderData);

        // Fetch Order Items
        const { data: itemsData, error: itemsErr } = await supabase
          .from('order_items')
          .select('*, products(name), product_variants(variant_name)')
          .eq('order_id', orderId);

        if (itemsErr) throw itemsErr;
        setItems(itemsData || []);

        // Fetch Customer Shipping Address (first available or default)
        if (orderData.customer_id) {
          const { data: addrData } = await supabase
            .from('addresses')
            .select('*')
            .eq('customer_id', orderData.customer_id)
            .order('is_default', { ascending: false })
            .limit(1);

          if (addrData && addrData.length > 0) {
            const addr = addrData[0];
            setShippingAddress(`${addr.address_line}, ${addr.city}, ${addr.state} - ${addr.pincode}`);
          }
        }

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch order summary.';
        console.error('Error fetching order for success screen:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-body-sm text-warm-gray">Retrieving order receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center">
            <AlertCircle size={48} />
          </div>
          <Badge variant="gray" className="text-sm px-4 py-1">Order Status Unavailable</Badge>
          <h1 className="text-headline-lg text-on-surface">Order Summary Not Found</h1>
          <p className="text-body-sm text-on-surface-variant max-w-sm">
            {error || 'No active order ID was detected in your checkout session.'}
          </p>
        </div>
        <Link href="/" className="block text-body-sm text-primary font-bold hover:underline">
          Back to Storefront
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center space-y-8">
      {/* Visual Success Indicator */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-secondary bg-opacity-10 text-secondary rounded-full flex items-center justify-center">
          <CheckCircle size={48} />
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1">Order Confirmed</Badge>
        <h1 className="text-headline-lg text-on-surface">Thank You for Your Order!</h1>
        <p className="text-body-sm text-on-surface-variant max-w-sm">
          Your order has been received successfully and is being prepared for fulfillment.
        </p>
      </div>

      {/* Transaction billing summary details */}
      <Card elevation={1} className="text-left space-y-4">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3">
          <span className="text-xs text-warm-gray">Order ID: <strong className="text-on-surface">#{order.id.substring(0, 8).toUpperCase()}</strong></span>
          <span className="text-xs text-warm-gray">Date: <strong>{formattedDate}</strong></span>
        </div>

        <div className="space-y-2.5 text-body-sm text-on-surface-variant">
          {items.map((item) => {
            const displayName = item.product_variants?.variant_name
              ? `${item.products?.name} (${item.product_variants.variant_name})`
              : (item.products?.name || 'Product');
            return (
              <div key={item.id} className="flex justify-between font-semibold text-on-surface">
                <span>{displayName} x {item.quantity}</span>
                <span>₹{item.price_at_purchase * item.quantity}</span>
              </div>
            );
          })}

          <div className="border-t border-border-subtle pt-2.5 flex justify-between font-bold text-on-surface">
            <span>Total Paid</span>
            <span className="text-price-green text-title-md">₹{order.total}</span>
          </div>
        </div>

        {(shippingAddress || order.shipping_fee === 0) && (
          <div className="border-t border-border-subtle pt-3 text-xs text-warm-gray space-y-1">
            {shippingAddress && <p><strong>Shipping To:</strong> {shippingAddress}</p>}
            <p><strong>Fulfillment Method:</strong> BlueDart Express (2-3 business days)</p>
          </div>
        )}
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={`/account/track/${order.id}`}>
          <Button variant="primary" className="flex items-center gap-2 w-full sm:w-auto">
            Track Shipment <ArrowRight size={16} />
          </Button>
        </Link>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} /> Download Invoice
        </Button>
      </div>

      <Link href="/" className="block text-body-sm text-primary font-bold hover:underline">
        Back to Storefront
      </Link>
    </div>
  );
}
