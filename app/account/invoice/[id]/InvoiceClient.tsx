'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function InvoiceClient() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }

      const { data: orderData } = await supabase
        .from('orders')
        .select('*, customers(name, email, phone)')
        .eq('id', orderId)
        .eq('customer_id', session.user.id)
        .maybeSingle();

      if (!orderData) { router.push('/account'); return; }

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*, products(name), product_variants(variant_name)')
        .eq('order_id', orderId);

      setOrder(orderData);
      setItems(itemsData || []);
      setLoading(false);
    }
    load();
  }, [orderId, router]);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  const addr = order?.address_snapshot as Record<string, string> | null;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6 no-print">
        <Link href="/account" className="flex items-center gap-2 text-primary text-sm font-bold hover:underline">
          <ArrowLeft size={16} /> Back to Account
        </Link>
        <Button variant="primary" size="sm" onClick={() => window.print()}>
          <Printer size={16} className="mr-2" /> Print Invoice
        </Button>
      </div>

      <div className="bg-white border border-border-subtle rounded-xl p-8 space-y-6">
        <div className="flex justify-between border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Sabari Krishna Consumables</h1>
            <p className="text-xs text-warm-gray">Tax Invoice</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">Invoice #{String(order?.id).substring(0, 8).toUpperCase()}</p>
            <p className="text-warm-gray">{new Date(String(order?.created_at)).toLocaleDateString()}</p>
          </div>
        </div>

        {addr && (
          <div>
            <p className="text-xs font-bold uppercase text-warm-gray mb-1">Ship To</p>
            <p className="text-sm">{addr.label}: {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</p>
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const product = item.products as { name: string } | null;
              const variant = item.product_variants as { variant_name: string } | null;
              return (
                <tr key={String(item.id)} className="border-b border-border-subtle">
                  <td className="py-2">{product?.name}{variant ? ` (${variant.variant_name})` : ''}</td>
                  <td className="py-2">{String(item.quantity)}</td>
                  <td className="py-2 text-right">₹{Number(item.price_at_purchase) * Number(item.quantity)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-right space-y-1 text-sm">
          <p>Subtotal: ₹{order?.subtotal as number}</p>
          <p>Discount: -₹{order?.discount as number}</p>
          <p>Shipping: ₹{order?.shipping_fee as number}</p>
          <p>Tax: ₹{order?.tax as number}</p>
          <p className="font-bold text-lg">Total: ₹{order?.total as number}</p>
        </div>
      </div>
    </div>
  );
}
