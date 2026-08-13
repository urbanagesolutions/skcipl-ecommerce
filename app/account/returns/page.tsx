'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReturnRequest {
  id: string;
  reason: string;
  status: string;
  created_at: string;
  orders: { id: string; total: number; status: string; created_at: string };
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export default function ReturnsPage() {
  const router = useRouter();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [eligibleOrders, setEligibleOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }

      const token = session.access_token;
      const retRes = await fetch('/api/returns', { headers: { Authorization: `Bearer ${token}` } });
      const retData = await retRes.json();
      setReturns(retData.returns || []);

      const { data: orders } = await supabase
        .from('orders')
        .select('id, total, status, created_at')
        .eq('customer_id', session.user.id)
        .in('status', ['Delivered', 'Shipped'])
        .order('created_at', { ascending: false });

      setEligibleOrders((orders as Order[]) || []);
    }
    load();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch('/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ orderId: selectedOrder, reason }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Return request submitted successfully.');
      setReason('');
      setSelectedOrder('');
      const retRes = await fetch('/api/returns', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const retData = await retRes.json();
      setReturns(retData.returns || []);
    } else {
      setMessage(data.error || 'Failed to submit return.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <Link href="/account" className="flex items-center gap-2 text-primary text-sm font-bold mb-6 hover:underline">
        <ArrowLeft size={16} /> Back to Account
      </Link>
      <h1 className="text-headline-lg text-on-surface mb-6">Returns & Refunds</h1>

      <Card className="p-6 mb-8 space-y-4">
        <h2 className="font-bold text-on-surface">Request a Return</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full border border-border-subtle rounded-lg p-3 text-sm"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            required
          >
            <option value="">Select an order</option>
            {eligibleOrders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.id.substring(0, 8).toUpperCase()} — ₹{o.total} — {o.status}
              </option>
            ))}
          </select>
          <textarea
            className="w-full border border-border-subtle rounded-lg p-3 text-sm min-h-[100px]"
            placeholder="Reason for return..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Return Request'}
          </Button>
          {message && <p className="text-sm font-semibold text-secondary">{message}</p>}
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-bold text-on-surface">Return History</h2>
        {returns.length === 0 ? (
          <p className="text-warm-gray text-sm">No return requests yet.</p>
        ) : returns.map((r) => (
          <div key={r.id} className="p-4 border border-border-subtle rounded-xl flex justify-between items-start">
            <div>
              <span className="font-bold">Order #{r.orders?.id?.substring(0, 8).toUpperCase()}</span>
              <p className="text-sm text-warm-gray mt-1">{r.reason}</p>
              <p className="text-xs text-warm-gray">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
            <Badge variant={r.status === 'Approved' ? 'secondary' : r.status === 'Rejected' ? 'sale' : 'pending'}>
              {r.status}
            </Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}
