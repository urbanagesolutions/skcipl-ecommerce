'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Truck, MapPin, ExternalLink,
  Loader2, AlertCircle, Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderDetail {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total: number;
  courier_name: string | null;
  tracking_number: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: { name: string; images: string[] } | null;
  product_variants: { variant_name: string } | null;
}

interface DeliveryAddress {
  label: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

// ─── Status → stepper mapping ─────────────────────────────────────────────────

const STEPS = [
  { label: 'Order Placed', statuses: ['Pending', 'Processing', 'Shipped', 'Delivered'] },
  { label: 'Processing', statuses: ['Processing', 'Shipped', 'Delivered'] },
  { label: 'Packed & Dispatched', statuses: ['Shipped', 'Delivered'] },
  { label: 'In Transit', statuses: ['Shipped', 'Delivered'] },
  { label: 'Out for Delivery', statuses: ['Delivered'] },
  { label: 'Delivered', statuses: ['Delivered'] },
];


// ─── Main Component ───────────────────────────────────────────────────────────

function TrackingContent() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState<DeliveryAddress | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadOrder() {
      try {
        setLoading(true);
        setError('');

        // Verify user owns this order
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Please log in to track your order.');
          setLoading(false);
          return;
        }

        // Fetch the order (RLS ensures customer can only read their own)
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('id, created_at, status, payment_status, total, courier_name, tracking_number')
          .eq('id', id)
          .maybeSingle();

        if (orderErr) throw orderErr;
        if (!orderData) {
          setError('Order not found or you do not have permission to view it.');
          setLoading(false);
          return;
        }
        setOrder(orderData as OrderDetail);

        // Fetch order items
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('id, quantity, price_at_purchase, products(name, images), product_variants(variant_name)')
          .eq('order_id', id);
        setItems((itemsData as unknown as OrderItem[]) ?? []);

        // Fetch delivery address (first/default address for this customer)
        const { data: addrData } = await supabase
          .from('addresses')
          .select('label, address_line, city, state, pincode')
          .eq('customer_id', session.user.id)
          .order('is_default', { ascending: false })
          .limit(1);
        if (addrData && addrData.length > 0) setAddress(addrData[0] as DeliveryAddress);

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load order.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="text-body-sm text-warm-gray">Loading shipment details…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto text-sale-red" size={40} />
        <h1 className="text-headline-lg text-on-surface">Order Not Found</h1>
        <p className="text-body-sm text-warm-gray">{error || 'This order ID could not be located.'}</p>
        <Link href="/account">
          <Button variant="primary">Back to My Account</Button>
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'Cancelled';

  // Build stepper from current status
  const stepStates = STEPS.map((step) => {
    const isDone = step.statuses.includes(order.status);
    const isActive = step.label === 'In Transit' && order.status === 'Shipped';
    return { ...step, completed: isDone && !isActive, active: isActive };
  });

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 space-y-8">

      {/* Page Header */}
      <div className="border-b border-border-subtle pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Track Shipment</h1>
          <p className="text-body-sm text-warm-gray mt-1">
            Order <strong className="text-on-surface">#{order.id.substring(0, 8).toUpperCase()}</strong>
            {' '}· Placed on {fmtDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={
            order.status === 'Delivered' ? 'secondary' :
            order.status === 'Cancelled' ? 'sale' :
            order.status === 'Shipped' ? 'primary' : 'pending'
          }>
            {order.status}
          </Badge>
          <Link href="/account">
            <Button variant="outline" size="sm">Back to Account</Button>
          </Link>
        </div>
      </div>

      {/* Carrier info card */}
      <Card elevation={1} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Courier Partner</span>
          <span className="font-bold text-title-md text-on-surface flex items-center gap-1.5 mt-1">
            {order.courier_name ?? '—'}
            {order.courier_name && <ExternalLink size={14} className="text-primary" />}
          </span>
          <span className="text-xs text-warm-gray mt-1 block">
            AWB: {order.tracking_number ?? 'Not yet assigned'}
          </span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Payment</span>
          <span className="font-bold text-title-md text-price-green mt-1 flex items-center gap-1.5">
            ₹{order.total}
          </span>
          <span className="text-xs text-warm-gray mt-1 block">Status: {order.payment_status}</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">
            {address ? 'Delivery Location' : 'Shipment Status'}
          </span>
          {address ? (
            <span className="font-bold text-body-sm text-on-surface mt-1 flex items-start gap-1.5">
              <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>{address.city}, {address.state} — {address.pincode}</span>
            </span>
          ) : (
            <span className="font-semibold text-body-sm text-warm-gray mt-1 block">{order.status}</span>
          )}
        </div>
      </Card>

      {/* Stepper timeline */}
      {isCancelled ? (
        <Card elevation={1} className="p-8 text-center space-y-3">
          <AlertCircle className="mx-auto text-sale-red" size={36} />
          <h2 className="text-title-md font-bold text-on-surface">Order Cancelled</h2>
          <p className="text-body-sm text-warm-gray">This order has been cancelled. If you have questions, please contact support.</p>
        </Card>
      ) : (
        <Card elevation={1} className="p-8">
          <h2 className="text-title-md font-bold text-on-surface mb-6 flex items-center gap-2">
            <Truck size={18} /> Transit Timeline
          </h2>
          <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
            {stepStates.map((step, idx) => (
              <div key={idx} className="relative flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                {/* Dot */}
                <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 ${
                  step.completed
                    ? 'border-secondary bg-secondary text-white'
                    : step.active
                    ? 'border-primary bg-primary text-white animate-pulse'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}>
                  {step.completed ? '✓' : idx + 1}
                </div>
                <div>
                  <span className={`block font-bold text-body-sm ${step.active ? 'text-primary' : step.completed ? 'text-on-surface' : 'text-warm-gray'}`}>
                    {step.label}
                  </span>
                  <span className="text-xs text-warm-gray mt-0.5 block">
                    {step.completed ? '✓ Completed' : step.active ? 'In progress…' : 'Pending'}
                  </span>
                </div>
                {step.active && (
                  <Badge variant="secondary" className="text-[10px] mt-1 sm:mt-0">Live Update</Badge>
                )}
              </div>
            ))}
          </div>
          {order.tracking_number && order.courier_name && (
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <p className="text-xs text-warm-gray">
                Track directly with <strong>{order.courier_name}</strong> using AWB: <strong className="text-on-surface">{order.tracking_number}</strong>
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Items Summary */}
      {items.length > 0 && (
        <Card elevation={1} className="space-y-4">
          <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-border-subtle">
            <Package size={18} /> Items in this Order
          </h2>
          <div className="space-y-3">
            {items.map((item) => {
              const name = item.product_variants?.variant_name
                ? `${item.products?.name} (${item.product_variants.variant_name})`
                : (item.products?.name ?? 'Product');
              const img = item.products?.images?.[0] ?? '/assets/placeholder-product.png';
              return (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <img src={img} alt={name} className="w-12 h-12 object-contain rounded-md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">{name}</p>
                    <p className="text-[11px] text-warm-gray">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-on-surface">₹{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="text-center">
        <Link href="/" className="text-body-sm text-primary font-bold hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// Suspense wrapper required for useParams in Next.js 14
export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[800px] mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="text-body-sm text-warm-gray">Loading shipment details…</p>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
