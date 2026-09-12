'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';

interface CompanySettings {
  brand_name: string;
  fssai_license_number: string;
  fssai_valid_until: string;
  cin: string;
  gst_number: string;
  support_email: string;
  support_phone: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: { name: string; sku: string } | null;
  product_variants: { variant_name: string } | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  address_snapshot: {
    label?: string;
    address_line?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    email?: string;
  } | null;
  customers: { name: string; email: string; phone: string } | null;
}

export default function AdminInvoiceClient() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [company, setCompany] = useState<CompanySettings>({
    brand_name: 'Sabari Krishna Consumables India Pvt Ltd',
    fssai_license_number: '12423008000123',
    fssai_valid_until: '2028-12-31',
    cin: 'U15142TZ2023PTC045612',
    gst_number: '33AAECS1234F1Z8',
    support_email: 'support@skcipl.com',
    support_phone: '+91 98422 28484',
  });

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }

        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*, customers(name, email, phone)')
          .eq('id', orderId)
          .maybeSingle();

        if (orderErr || !orderData) {
          router.push('/admin/orders');
          return;
        }
        setOrder(orderData as Order);

        const { data: itemsData } = await supabase
          .from('order_items')
          .select('id, quantity, price_at_purchase, products(name, sku), product_variants(variant_name)')
          .eq('order_id', orderId);
        setItems((itemsData as unknown as OrderItem[]) ?? []);

        const { data: compData } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (compData) {
          setCompany({
            brand_name: compData.brand_name || 'Sabari Krishna Consumables India Pvt Ltd',
            fssai_license_number: compData.fssai_license_number || '12423008000123',
            fssai_valid_until: compData.fssai_valid_until || '2028-12-31',
            cin: compData.cin || 'U15142TZ2023PTC045612',
            gst_number: compData.gst_number || '33AAECS1234F1Z8',
            support_email: compData.support_email || 'support@skcipl.com',
            support_phone: compData.support_phone || '+91 98422 28484',
          });
        }
      } catch (err) {
        console.error('Error loading admin invoice:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!order) return null;

  const addr = order.address_snapshot;
  const custName = order.customers?.name || addr?.label || 'Valued Customer';
  const custPhone = order.customers?.phone || addr?.phone || '-';
  const custEmail = order.customers?.email || addr?.email || '-';

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="max-w-[850px] mx-auto px-4 mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-primary hover:underline bg-white px-4 py-2 rounded-xl shadow-xs border border-border-subtle"
        >
          <ArrowLeft size={16} /> Back to Admin
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-xl shadow-md hover:bg-primary/90 transition-all"
        >
          <Printer size={16} /> Print Tax Invoice / Challan
        </button>
      </div>

      <div className="max-w-[850px] mx-auto bg-white p-8 md:p-12 shadow-md rounded-2xl print:shadow-none print:p-0 print:max-w-none space-y-8 border border-border-subtle">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold font-serif text-gray-900 tracking-tight">
              {company.brand_name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Registered Office: Puliyamarathottam, Kangeyam Road, Tiruppur, Tamil Nadu — 641604
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-[11px] font-medium text-gray-600">
              <span>FSSAI Lic. No: <strong className="text-gray-900">{company.fssai_license_number}</strong></span>
              <span>GSTIN: <strong className="text-gray-900">{company.gst_number}</strong></span>
              <span>CIN: <strong className="text-gray-900">{company.cin}</strong></span>
            </div>
          </div>
          <div className="text-right bg-gray-50 p-4 rounded-xl border border-gray-200 w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded block mb-1">
              ORIGINAL FOR RECIPIENT
            </span>
            <p className="text-sm font-bold text-gray-900">Tax Invoice #{order.id.substring(0, 8).toUpperCase()}</p>
            <p className="text-xs text-gray-500">Date: {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
            <p className="text-xs text-gray-500">Payment: <span className="font-semibold text-gray-800">{order.payment_method} ({order.payment_status})</span></p>
          </div>
        </div>

        {/* Customer & Shipping Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-gray-400 block mb-2">Billed To / Customer:</span>
            <p className="font-bold text-sm text-gray-900">{custName}</p>
            <p className="text-gray-600">Phone: {custPhone}</p>
            <p className="text-gray-600">Email: {custEmail}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-gray-400 block mb-2">Shipped To Address:</span>
            {addr ? (
              <>
                <p className="font-bold text-sm text-gray-900">{addr.label || 'Delivery Address'}</p>
                <p className="text-gray-600">{addr.address_line}</p>
                <p className="text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
              </>
            ) : (
              <p className="text-gray-600">Standard Fulfillment Address</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-gray-700 bg-gray-50">
                <th className="py-3 px-3 font-bold">#</th>
                <th className="py-3 px-3 font-bold">Item Description & SKU</th>
                <th className="py-3 px-3 font-bold text-center">Qty</th>
                <th className="py-3 px-3 font-bold text-right">Unit Price (₹)</th>
                <th className="py-3 px-3 font-bold text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, idx) => {
                const prodName = item.products?.name || 'Consumable Item';
                const varName = item.product_variants?.variant_name;
                const sku = item.products?.sku || 'SKCI-PROD';
                const lineTotal = item.price_at_purchase * item.quantity;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 text-gray-500 font-medium">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900">{prodName} {varName ? `(${varName})` : ''}</p>
                      <span className="text-[11px] text-gray-400 font-mono">SKU: {sku}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-gray-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-gray-700">₹{item.price_at_purchase.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">₹{lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t border-gray-200 gap-6">
          <div className="text-[11px] text-gray-500 space-y-1 max-w-sm">
            <p className="font-bold text-gray-700">Terms & Conditions:</p>
            <p>1. Goods once sold will only be taken back as per return policy.</p>
            <p>2. Subject to Tiruppur jurisdiction only.</p>
            <p className="italic font-semibold text-emerald-800">Produced with Vedic Bilona / Marachekku traditional standards.</p>
          </div>

          <div className="w-full md:w-72 space-y-2 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">₹{order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied</span>
                <span className="font-semibold">-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping & Logistics</span>
              <span className="font-semibold text-gray-900">₹{order.shipping_fee?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST / Taxes</span>
              <span className="font-semibold text-gray-900">₹{order.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-300">
              <span>Grand Total</span>
              <span className="text-emerald-700">₹{order.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="pt-10 flex justify-between items-end border-t border-gray-200 mt-8">
          <div className="text-xs text-gray-500">
            <p>Authorized Signatory</p>
            <p className="font-bold text-gray-800 mt-1">{company.brand_name}</p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>Computer Generated Tax Invoice</p>
            <p>Valid without physical signature</p>
          </div>
        </div>

      </div>
    </div>
  );
}
