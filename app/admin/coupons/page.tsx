'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  usage_limit: number | null;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: '', discount_type: 'Fixed', discount_value: 100,
    valid_from: '', valid_until: '', usage_limit: 1000,
  });

  const load = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons((data as Coupon[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      valid_from: form.valid_from || new Date().toISOString(),
      valid_until: form.valid_until || new Date(Date.now() + 365 * 86400000).toISOString(),
      is_active: true,
      usage_limit: form.usage_limit,
    });
    setForm({ code: '', discount_type: 'Fixed', discount_value: 100, valid_from: '', valid_until: '', usage_limit: 1000 });
    load();
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from('coupons').update({ is_active: !is_active }).eq('id', id);
    load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" /></div>;

  return (
    <div className="space-y-8">
      <h1 className="text-headline-lg text-on-surface">Coupon Management</h1>

      <Card className="p-6 space-y-4">
        <h2 className="font-bold">Create Coupon</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Code (e.g. SAVE50)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          <select className="border border-border-subtle rounded-lg p-3 text-sm" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
            <option value="Fixed">Fixed (₹)</option>
            <option value="Percentage">Percentage (%)</option>
          </select>
          <Input type="number" placeholder="Discount Value" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} required />
          <Input type="datetime-local" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} />
          <Input type="datetime-local" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
          <Button type="submit" variant="primary"><Plus size={16} className="mr-1" /> Create</Button>
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-bold">Active Coupons</h2>
        {coupons.map((c) => (
          <div key={c.id} className="flex justify-between items-center p-4 border border-border-subtle rounded-xl">
            <div>
              <span className="font-bold text-primary">{c.code}</span>
              <span className="ml-2 text-sm">
                {c.discount_type === 'Percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`} off
              </span>
              <p className="text-xs text-warm-gray mt-1">
                Valid: {new Date(c.valid_from).toLocaleDateString()} — {new Date(c.valid_until).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={c.is_active ? 'secondary' : 'gray'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
              <Button size="sm" variant="outline" onClick={() => toggleActive(c.id, c.is_active)}>
                {c.is_active ? 'Disable' : 'Enable'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
