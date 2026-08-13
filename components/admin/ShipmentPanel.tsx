'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_CARRIERS } from '@/lib/carriers';
import { detectCarrierFromTrackingNumber } from '@/lib/carrier-detect';

interface ShipmentRow {
  id: string;
  carrier_name: string | null;
  tracking_number: string;
  tracking_url: string | null;
  status: string;
  shipped_at: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  products: { name: string } | null;
  product_variants: { variant_name: string } | null;
}

interface AddShipmentFormProps {
  orderId: string;
  orderItems: OrderItem[];
  onAdded: () => void;
}

export function AddShipmentForm({ orderId, orderItems, onAdded }: AddShipmentFormProps) {
  const [carriers, setCarriers] = useState(DEFAULT_CARRIERS);
  const [carrierSlug, setCarrierSlug] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [markOrderAs, setMarkOrderAs] = useState<'Shipped' | 'Partially Shipped' | 'none'>('Shipped');
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCarriers() {
      const { data } = await supabase.from('shipping_carriers').select('name, slug').eq('is_enabled', true);
      if (data?.length) setCarriers(data as typeof DEFAULT_CARRIERS);
    }
    loadCarriers();
  }, []);

  const handleAwbBlur = () => {
    if (!trackingNumber || carrierSlug) return;
    const detected = detectCarrierFromTrackingNumber(trackingNumber, carriers);
    if (detected) setCarrierSlug(detected.slug);
  };

  const handleSubmit = async () => {
    if (!trackingNumber.trim()) {
      setError('Tracking number is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const items = Object.entries(selectedItems)
        .filter(([, qty]) => qty > 0)
        .map(([orderItemId, quantity]) => ({ orderItemId, quantity }));

      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          orderId,
          trackingNumber: trackingNumber.trim(),
          carrierSlug: carrierSlug || undefined,
          markOrderAs,
          items: items.length ? items : undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to add shipment');

      setTrackingNumber('');
      setCarrierSlug('');
      setSelectedItems({});
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 border-t border-border-subtle pt-4">
      <h4 className="text-[10px] font-bold text-warm-gray uppercase tracking-wider">Add Shipment</h4>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-warm-gray">Carrier</label>
        <select
          value={carrierSlug}
          onChange={(e) => setCarrierSlug(e.target.value)}
          className="w-full border border-border-subtle rounded-md px-3 py-2 text-xs bg-white"
        >
          <option value="">Auto-detect or select…</option>
          {carriers.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-warm-gray">Tracking Number / AWB</label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          onBlur={handleAwbBlur}
          placeholder="Enter AWB number"
          className="w-full border border-border-subtle rounded-md px-3 py-2 text-xs bg-white"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-warm-gray">Mark Order As</label>
        <select
          value={markOrderAs}
          onChange={(e) => setMarkOrderAs(e.target.value as typeof markOrderAs)}
          className="w-full border border-border-subtle rounded-md px-3 py-2 text-xs bg-white"
        >
          <option value="Shipped">Shipped</option>
          <option value="Partially Shipped">Partially Shipped</option>
          <option value="none">Do not change status</option>
        </select>
      </div>

      {orderItems.length > 1 && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-warm-gray">Items in this shipment (optional)</label>
          {orderItems.map((item) => {
            const name = item.product_variants?.variant_name
              ? `${item.products?.name} (${item.product_variants.variant_name})`
              : (item.products?.name ?? 'Product');
            return (
              <div key={item.id} className="flex items-center gap-2 text-xs">
                <span className="flex-1 truncate">{name}</span>
                <input
                  type="number"
                  min={0}
                  max={item.quantity}
                  value={selectedItems[item.id] ?? 0}
                  onChange={(e) =>
                    setSelectedItems((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                  }
                  className="w-16 border border-border-subtle rounded px-2 py-1 text-xs"
                />
                <span className="text-warm-gray">/ {item.quantity}</span>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-sale-red">{error}</p>}

      <Button variant="primary" fullWidth onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 justify-center">
        {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
        Add Shipment & Notify Customer
      </Button>
    </div>
  );
}

interface ShipmentListProps {
  orderId: string;
  refreshKey: number;
}

export function ShipmentList({ orderId, refreshKey }: ShipmentListProps) {
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`/api/shipments?orderId=${orderId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      setShipments(data.shipments || []);
      setLoading(false);
    }
    load();
  }, [orderId, refreshKey]);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this shipment?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`/api/shipments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setShipments((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <Loader2 className="animate-spin text-primary mx-auto" size={20} />;
  if (!shipments.length) return <p className="text-xs text-warm-gray">No shipments yet.</p>;

  return (
    <div className="space-y-2">
      {shipments.map((s) => (
        <div key={s.id} className="flex items-start justify-between gap-2 p-2 bg-gray-50 rounded-lg text-xs">
          <div>
            <p className="font-bold">{s.carrier_name || 'Courier'}</p>
            <p className="text-warm-gray font-mono">{s.tracking_number}</p>
            <p className="text-[10px] text-primary mt-0.5">{s.status}</p>
            {s.tracking_url && (
              <a href={s.tracking_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary underline">
                Track link
              </a>
            )}
          </div>
          <button onClick={() => handleDelete(s.id)} className="text-warm-gray hover:text-sale-red p-1">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
