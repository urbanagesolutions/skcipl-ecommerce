'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrackingWidget } from '@/components/TrackingWidget';
import { Loader2, AlertCircle, Package, MapPin } from 'lucide-react';

interface TrackingEvent {
  id: string;
  event_code: string;
  description: string;
  location: string | null;
  occurred_at: string;
}

interface Shipment {
  id: string;
  carrier_name: string | null;
  tracking_number: string;
  tracking_url: string | null;
  status: string;
  shipped_at: string | null;
  tracking_events?: TrackingEvent[];
}

interface OrderData {
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

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: { name: string; images: string[] } | null;
  product_variants: { variant_name: string } | null;
}

function GuestTrackContent() {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch('/api/track/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), orderId: orderId.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Order not found');
      setOrder(data.order);
      setShipments(data.shipments || []);
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const allEvents = shipments
    .flatMap((s) => (s.tracking_events || []).map((e) => ({ ...e, carrier: s.carrier_name })))
    .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());

  const address = order?.address_snapshot;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-headline-lg text-on-surface">Track Your Order</h1>
        <p className="text-body-sm text-warm-gray">Enter your email and order ID to view shipment status.</p>
      </div>

      <Card elevation={1} className="p-6">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-warm-gray">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-border-subtle rounded-lg px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-warm-gray">Order ID</label>
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full mt-1 border border-border-subtle rounded-lg px-3 py-2 text-sm font-mono"
              placeholder="Paste your order UUID"
            />
          </div>
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Track Order'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-sale-red text-sm justify-center">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {order && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-title-md font-bold">Order #{order.id.substring(0, 8).toUpperCase()}</h2>
              <p className="text-xs text-warm-gray">
                Placed {new Date(order.created_at).toLocaleDateString('en-IN')}
              </p>
            </div>
            <Badge variant={order.status === 'Delivered' ? 'secondary' : 'primary'}>{order.status}</Badge>
          </div>

          <TrackingWidget
            shipments={shipments.map((s) => ({
              id: s.id,
              carrierName: s.carrier_name || 'Courier',
              trackingNumber: s.tracking_number,
              trackingUrl: s.tracking_url || undefined,
              status: s.status,
              shippedAt: s.shipped_at || undefined,
            }))}
          />

          {address && (
            <Card elevation={1} className="p-4">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
                <MapPin size={16} /> Delivery Address
              </h3>
              <p className="text-sm text-warm-gray">
                {address.address_line}, {address.city}, {address.state} — {address.pincode}
              </p>
            </Card>
          )}

          {allEvents.length > 0 && (
            <Card elevation={1} className="p-6">
              <h3 className="text-title-md font-bold mb-4">Tracking Timeline</h3>
              <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                {allEvents.map((ev) => (
                  <div key={ev.id} className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary" />
                    <p className="text-sm font-semibold">{ev.description}</p>
                    {ev.location && <p className="text-xs text-warm-gray">{ev.location}</p>}
                    <p className="text-[10px] text-warm-gray">
                      {new Date(ev.occurred_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {items.length > 0 && (
            <Card elevation={1} className="p-4 space-y-3">
              <h3 className="font-bold flex items-center gap-2"><Package size={16} /> Items</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.products?.name} × {item.quantity}</span>
                  <span className="font-bold">₹{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </Card>
          )}
        </>
      )}

      <div className="text-center">
        <Link href="/auth" className="text-sm text-primary font-bold hover:underline">
          Log in for full order history
        </Link>
      </div>
    </div>
  );
}

export default function GuestTrackPage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin mx-auto mt-20" size={32} />}>
      <GuestTrackContent />
    </Suspense>
  );
}
