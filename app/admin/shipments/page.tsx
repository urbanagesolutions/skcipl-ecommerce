'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Truck, Upload, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ShipmentRow {
  id: string;
  order_id: string;
  carrier_name: string | null;
  tracking_number: string;
  status: string;
  shipped_at: string | null;
  orders?: { id: string; status: string; customers?: { name: string } | null };
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('shipments')
        .select(`
          id, order_id, carrier_name, tracking_number, status, shipped_at,
          orders(id, status, customers(name))
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      setShipments((data as unknown as ShipmentRow[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = shipments.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'open') return !['Delivered', 'Returned'].includes(s.status);
    return s.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Fulfillment Dashboard</h1>
          <p className="text-body-sm text-warm-gray mt-1">Manage all shipments across orders.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/shipments/import" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">
            <Upload size={16} /> CSV Import
          </Link>
          <Link href="/admin/settings/carriers" className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm font-bold">
            <Settings size={16} /> Carriers
          </Link>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'In Transit', 'Out for Delivery', 'Delivered'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-on-surface-variant'
            }`}
          >
            {f === 'all' ? 'All' : f === 'open' ? 'Open' : f}
          </button>
        ))}
      </div>

      <Card elevation={1} className="p-0 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-[10px] uppercase tracking-wider text-warm-gray font-bold">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Carrier</th>
              <th className="p-3">AWB</th>
              <th className="p-3">Status</th>
              <th className="p-3">Shipped</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-warm-gray">No shipments found.</td></tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs text-primary">
                    <Link href="/admin/orders">#{s.order_id.substring(0, 8).toUpperCase()}</Link>
                  </td>
                  <td className="p-3 text-xs">{s.orders?.customers?.name || '—'}</td>
                  <td className="p-3 text-xs">{s.carrier_name || '—'}</td>
                  <td className="p-3 font-mono text-xs">{s.tracking_number}</td>
                  <td className="p-3"><Badge variant="primary">{s.status}</Badge></td>
                  <td className="p-3 text-xs text-warm-gray">
                    {s.shipped_at ? new Date(s.shipped_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card elevation={1} className="p-4 text-center">
          <Truck className="mx-auto text-primary mb-2" size={24} />
          <p className="text-2xl font-bold">{shipments.length}</p>
          <p className="text-xs text-warm-gray">Total Shipments</p>
        </Card>
        <Card elevation={1} className="p-4 text-center">
          <p className="text-2xl font-bold">{shipments.filter((s) => s.status === 'In Transit').length}</p>
          <p className="text-xs text-warm-gray">In Transit</p>
        </Card>
        <Card elevation={1} className="p-4 text-center">
          <p className="text-2xl font-bold">{shipments.filter((s) => s.status === 'Delivered').length}</p>
          <p className="text-xs text-warm-gray">Delivered</p>
        </Card>
        <Card elevation={1} className="p-4 text-center">
          <p className="text-2xl font-bold">
            {shipments.filter((s) => !['Delivered', 'Returned'].includes(s.status)).length}
          </p>
          <p className="text-xs text-warm-gray">Open</p>
        </Card>
      </div>
    </div>
  );
}
