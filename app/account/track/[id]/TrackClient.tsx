'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrackingWidget } from '@/components/TrackingWidget';
import {
  Truck, MapPin, Loader2, AlertCircle, Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrderDetail {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total: number;
  address_snapshot?: {
    label?: string;
    address_line?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
}

interface Shipment {
  id: string;
  carrier_name: string | null;
  tracking_number: string;
  tracking_url: string | null;
  status: string;
  shipped_at: string | null;
  tracking_events?: {
    id: string;
    event_code: string;
    description: string;
    location: string | null;
    occurred_at: string;
  }[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: { name: string; images: string[] } | null;
  product_variants: { variant_name: string } | null;
}

function TrackingContent() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [widgetSettings, setWidgetSettings] = useState({ primaryColor: '#2D5016', accentColor: '#4A7C23' });

  useEffect(() => {
    if (!id) return;

    async function loadOrder() {
      try {
        setLoading(true);
        setError('');

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Please log in to track your order.');
          setLoading(false);
          return;
        }

        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('id, created_at, status, payment_status, total, address_snapshot')
          .eq('id', id)
          .maybeSingle();

        if (orderErr) throw orderErr;
        if (!orderData) {
          setError('Order not found or you do not have permission to view it.');
          setLoading(false);
          return;
        }
        setOrder(orderData as OrderDetail);

        const { data: itemsData } = await supabase
          .from('order_items')
          .select('id, quantity, price_at_purchase, products(name, images), product_variants(variant_name)')
          .eq('order_id', id);
        setItems((itemsData as unknown as OrderItem[]) ?? []);

        // Fallback for static export / missing api route
        setShipments([]);

        const { data: settings } = await supabase.from('tracking_settings').select('primary_color, accent_color').limit(1).maybeSingle();
        if (settings) {
          setWidgetSettings({
            primaryColor: settings.primary_color || '#2D5016',
            accentColor: settings.accent_color || '#4A7C23',
          });
        }
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
  const address = order.address_snapshot;

  const allEvents = shipments
    .flatMap((s) => (s.tracking_events || []).map((e) => ({ ...e, carrier: s.carrier_name })))
    .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());

  const hasLiveEvents = allEvents.length > 0;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 space-y-8">
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
            order.status.includes('Ship') ? 'primary' : 'pending'
          }>
            {order.status}
          </Badge>
          <Link href="/account">
            <Button variant="outline" size="sm">Back to Account</Button>
          </Link>
        </div>
      </div>

      <Card elevation={1} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Shipments</span>
          <span className="font-bold text-title-md text-on-surface mt-1">{shipments.length || 'Pending'}</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Payment</span>
          <span className="font-bold text-title-md text-price-green mt-1">₹{order.total}</span>
          <span className="text-xs text-warm-gray mt-1 block">{order.payment_status}</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Delivery Location</span>
          {address?.city ? (
            <span className="font-bold text-body-sm text-on-surface mt-1 flex items-start gap-1.5">
              <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <span>{address.city}, {address.state} — {address.pincode}</span>
            </span>
          ) : (
            <span className="font-semibold text-body-sm text-warm-gray mt-1 block">{order.status}</span>
          )}
        </div>
      </Card>

      {!isCancelled && (
        <Card elevation={1} className="p-6">
          <h2 className="text-title-md font-bold text-on-surface mb-4 flex items-center gap-2">
            <Truck size={18} /> Tracking Information
          </h2>
          <TrackingWidget
            shipments={shipments.map((s) => ({
              id: s.id,
              carrierName: s.carrier_name || 'Courier',
              trackingNumber: s.tracking_number,
              trackingUrl: s.tracking_url || undefined,
              status: s.status,
              shippedAt: s.shipped_at || undefined,
            }))}
            primaryColor={widgetSettings.primaryColor}
            accentColor={widgetSettings.accentColor}
          />
        </Card>
      )}

      {isCancelled ? (
        <Card elevation={1} className="p-8 text-center space-y-3">
          <AlertCircle className="mx-auto text-sale-red" size={36} />
          <h2 className="text-title-md font-bold text-on-surface">Order Cancelled</h2>
          <p className="text-body-sm text-warm-gray">This order has been cancelled.</p>
        </Card>
      ) : hasLiveEvents ? (
        <Card elevation={1} className="p-8">
          <h2 className="text-title-md font-bold text-on-surface mb-6">Live Tracking Timeline</h2>
          <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
            {allEvents.map((ev, idx) => (
              <div key={ev.id} className="relative">
                <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 ${
                  idx === 0 ? 'border-primary bg-primary text-white' : 'border-secondary bg-secondary text-white'
                }`}>
                  {idx === 0 ? '●' : '✓'}
                </div>
                <div>
                  <span className="block font-bold text-body-sm text-on-surface">{ev.description}</span>
                  {ev.location && <span className="text-xs text-warm-gray">{ev.location}</span>}
                  <span className="text-[10px] text-warm-gray block mt-0.5">
                    {new Date(ev.occurred_at).toLocaleString('en-IN')}
                    {ev.carrier && ` · ${ev.carrier}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : shipments.length > 0 ? (
        <Card elevation={1} className="p-6 text-center text-sm text-warm-gray">
          Live scan updates will appear here once the carrier reports progress.
        </Card>
      ) : null}

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

      <div className="text-center space-y-2">
        <Link href="/track" className="text-body-sm text-primary font-bold hover:underline block">
          Track without logging in
        </Link>
        <Link href="/" className="text-body-sm text-warm-gray hover:underline block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function TrackClient() {
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
