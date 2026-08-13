'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, MapPin, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Address {
  id: string;
  label: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', address_line: '', city: '', state: '', pincode: '' });

  const loadAddresses = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/auth'); return; }
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('customer_id', session.user.id)
      .order('is_default', { ascending: false });
    setAddresses((data as Address[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadAddresses(); }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from('addresses').insert({
      customer_id: session.user.id,
      ...form,
      is_default: addresses.length === 0,
    });
    setShowForm(false);
    setForm({ label: 'Home', address_line: '', city: '', state: '', pincode: '' });
    loadAddresses();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    loadAddresses();
  };

  const setDefault = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from('addresses').update({ is_default: false }).eq('customer_id', session.user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    loadAddresses();
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" /></div>;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <Link href="/account" className="flex items-center gap-2 text-primary text-sm font-bold mb-6 hover:underline">
        <ArrowLeft size={16} /> Back to Account
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-headline-lg text-on-surface">Saved Addresses</h1>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Address'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6 space-y-4">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Label (Home/Office)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
            <Input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} required />
            <Input placeholder="Address Line" value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} className="md:col-span-2" required />
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
            <Button type="submit" variant="primary" className="md:col-span-2">Save Address</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <Card className="p-8 text-center text-warm-gray">No saved addresses yet.</Card>
        ) : addresses.map((addr) => (
          <Card key={addr.id} className="p-4 flex justify-between items-start">
            <div className="flex gap-3">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <span className="font-bold">{addr.label}</span>
                {addr.is_default && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                <p className="text-sm text-warm-gray mt-1">{addr.address_line}</p>
                <p className="text-sm text-warm-gray">{addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!addr.is_default && (
                <Button size="sm" variant="outline" onClick={() => setDefault(addr.id)}>Set Default</Button>
              )}
              <Button size="sm" variant="outline" onClick={() => handleDelete(addr.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
