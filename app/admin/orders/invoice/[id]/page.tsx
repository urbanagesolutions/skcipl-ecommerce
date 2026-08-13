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
  products: {
    name: string;
  } | null;
  product_variants: {
    variant_name: string;
  } | null;
}

interface OrderDetails {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  customer_id: string;
  customers: {
    name: string;
    email: string;
    phone: string;
  } | null;
  cod_verified?: boolean;
}

interface DeliveryAddress {
  label: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

const MOCK_COMPANY_SETTINGS: CompanySettings = {
  brand_name: 'Sabari Krishna Consumables',
  fssai_license_number: '12422027001241',
  fssai_valid_until: '2029-08-28',
  cin: 'U15400TZ2022PTC038516',
  gst_number: '33ABICS1176M1Z1',
  support_email: 'support@sabarikrishnaconsumables.in',
  support_phone: '+91 422 2700124'
};

const getMockOrder = (id: string): OrderDetails => ({
  id,
  created_at: new Date().toISOString(),
  status: 'Processing',
  payment_status: 'Paid',
  subtotal: 1250.00,
  discount: 150.00,
  shipping_fee: 50.00,
  tax: 225.00,
  total: 1375.00,
  customer_id: 'mock-customer-id',
  customers: {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98765 43210'
  }
});

const MOCK_ITEMS: OrderItem[] = [
  {
    id: 'item-1',
    quantity: 2,
    price_at_purchase: 600.00,
    products: { name: 'Pure Cow Ghee (1L)' },
    product_variants: { variant_name: 'Premium Glass Jar' }
  },
  {
    id: 'item-2',
    quantity: 1,
    price_at_purchase: 200.00,
    products: { name: 'Cold-Pressed Coconut Oil' },
    product_variants: { variant_name: '500ml Pet Bottle' }
  }
];

const MOCK_ADDRESS: DeliveryAddress = {
  label: 'Home',
  address_line: '12, Park Street, Near Metro Station',
  city: 'Kolkata',
  state: 'West Bengal',
  pincode: '700016'
};

export default function PrintInvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const orderId = typeof id === 'string' ? id : '';

  const [loading, setLoading] = useState(true);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState<DeliveryAddress | null>(null);

  // Set invoice mode to hide general layout headers/footers
  useEffect(() => {
    document.body.classList.add('invoice-mode');
    return () => {
      document.body.classList.remove('invoice-mode');
    };
  }, []);

  useEffect(() => {
    if (!orderId) return;

    async function loadData() {
      try {
        const isDev = process.env.NODE_ENV === 'development';
        const hasBypass = typeof window !== 'undefined' && window.location.search.includes('bypass=true');

        // Fetch company settings
        const { data: settingsData } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        const formattedSettings: CompanySettings = settingsData ? {
          brand_name: settingsData.brand_name || 'Sabari Krishna Consumables',
          fssai_license_number: settingsData.fssai_license_number || '12422027001241',
          fssai_valid_until: settingsData.fssai_valid_until || '2029-08-28',
          cin: settingsData.cin || 'U15400TZ2022PTC038516',
          gst_number: settingsData.gst_number || '33ABICS1176M1Z1',
          support_email: settingsData.support_email || 'support@sabarikrishnaconsumables.in',
          support_phone: settingsData.support_phone || '+91 422 2700124'
        } : MOCK_COMPANY_SETTINGS;

        setCompanySettings(formattedSettings);

        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('id, created_at, status, payment_status, subtotal, discount, shipping_fee, tax, total, customer_id, cod_verified, customers(name, email, phone)')
          .eq('id', orderId)
          .maybeSingle();

        if (orderError || !orderData) {
          // If bypass is active or we fail to fetch (RLS, empty DB, etc.) in dev environment, use mock fallback
          if (hasBypass || isDev) {
            setOrder(getMockOrder(orderId));
            setItems(MOCK_ITEMS);
            setAddress(MOCK_ADDRESS);
            setLoading(false);
            return;
          }
          throw orderError || new Error('Order not found');
        }

        const formattedOrder: OrderDetails = {
          id: orderData.id,
          created_at: orderData.created_at,
          status: orderData.status,
          payment_status: orderData.payment_status,
          subtotal: Number(orderData.subtotal),
          discount: Number(orderData.discount),
          shipping_fee: Number(orderData.shipping_fee),
          tax: Number(orderData.tax),
          total: Number(orderData.total),
          customer_id: orderData.customer_id,
          cod_verified: orderData.cod_verified || false,
          customers: orderData.customers ? (() => {
            const cust = (Array.isArray(orderData.customers) 
              ? orderData.customers[0] 
              : orderData.customers) as { name?: string | null; email?: string | null; phone?: string | null } | null;
            return {
              name: cust?.name || 'Unknown',
              email: cust?.email || '',
              phone: cust?.phone || ''
            };
          })() : null
        };

        setOrder(formattedOrder);

        // Fetch order items
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('id, quantity, price_at_purchase, products(name), product_variants(variant_name)')
          .eq('order_id', orderId);

        if (itemsData && itemsData.length > 0) {
          setItems(itemsData as unknown as OrderItem[]);
        } else if (hasBypass || isDev) {
          setItems(MOCK_ITEMS);
        }

        // Fetch delivery address
        if (formattedOrder.customer_id) {
          const { data: addrData } = await supabase
            .from('addresses')
            .select('label, address_line, city, state, pincode')
            .eq('customer_id', formattedOrder.customer_id)
            .order('is_default', { ascending: false })
            .limit(1);

          if (addrData && addrData.length > 0) {
            setAddress(addrData[0] as DeliveryAddress);
          } else if (hasBypass || isDev) {
            setAddress(MOCK_ADDRESS);
          }
        } else if (hasBypass || isDev) {
          setAddress(MOCK_ADDRESS);
        }

      } catch (err) {
        console.error('Error fetching invoice details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [orderId]);

  // Auto trigger browser print dialog once data is loaded
  useEffect(() => {
    if (!loading && order) {
      const timer = setTimeout(() => {
        window.print();
      }, 800); // short delay to ensure rendering has finished
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <Loader2 className="animate-spin text-primary mb-4" size={36} />
        <p className="text-body-md text-warm-gray font-semibold">Generating invoice details...</p>
      </div>
    );
  }

  if (!order || !companySettings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 space-y-4">
        <h2 className="text-headline-md text-sale-red font-bold">Error Generating Invoice</h2>
        <p className="text-body-md text-warm-gray">We could not load details for order ID: {orderId}</p>
        <button
          onClick={() => router.back()}
          className="text-body-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-95 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 max-w-[800px] mx-auto flex flex-col justify-between font-sans">
      
      {/* Top action bar (hidden on print) */}
      <div className="no-print flex items-center justify-between border-b border-border-subtle pb-4 mb-8 bg-gray-50 p-4 rounded-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-body-sm font-semibold text-warm-gray hover:text-on-surface transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary text-white text-body-sm font-bold px-4 py-2 rounded-md hover:bg-opacity-95 transition-all shadow-sm"
        >
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      <div className="flex-1 space-y-8">
        
        {/* Company and Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between gap-6 border-b-2 border-black pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary uppercase">{companySettings.brand_name}</h1>
            <div className="text-xs text-gray-600 space-y-0.5 font-medium">
              <p className="font-bold text-gray-800 flex items-center gap-1">
                FSSAI Lic No: <span className="font-extrabold text-secondary">{companySettings.fssai_license_number}</span>
              </p>
              {companySettings.gst_number && <p>GSTIN: {companySettings.gst_number}</p>}
              {companySettings.cin && <p>CIN: {companySettings.cin}</p>}
              <p>Email: {companySettings.support_email}</p>
              <p>Phone: {companySettings.support_phone}</p>
            </div>
          </div>
          <div className="text-left md:text-right space-y-1">
            <h2 className="text-2xl font-bold tracking-wider text-gray-800 uppercase">Tax Invoice</h2>
            <div className="text-xs text-gray-600 font-medium">
              <p>Invoice No: <span className="font-bold text-black uppercase">{order.id.substring(0, 13)}</span></p>
              <p>Order ID: <span className="font-mono text-[10px] text-black">{order.id}</span></p>
              <p>Date: {fmtDate(order.created_at)}</p>
              <p>Payment: <span className="font-bold text-black uppercase">{order.cod_verified ? 'Cash on Delivery' : 'Online'} ({order.payment_status})</span></p>
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs border-b border-gray-200 pb-6">
          <div>
            <h3 className="font-bold text-gray-800 uppercase tracking-wide mb-2">Billed To:</h3>
            <div className="space-y-1 font-medium text-gray-600">
              <p className="text-sm font-bold text-black">{order.customers?.name || 'Valued Customer'}</p>
              <p>{order.customers?.email}</p>
              {order.customers?.phone && <p>Phone: {order.customers.phone}</p>}
            </div>
          </div>
          {address ? (
            <div>
              <h3 className="font-bold text-gray-800 uppercase tracking-wide mb-2">Delivery Address:</h3>
              <div className="space-y-1 font-medium text-gray-600">
                <p className="font-semibold text-black">{address.label}</p>
                <p>{address.address_line}</p>
                <p>{address.city}, {address.state} — <span className="font-bold text-black">{address.pincode}</span></p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-gray-800 uppercase tracking-wide mb-2">Delivery Address:</h3>
              <p className="text-gray-400 italic">No delivery address specified.</p>
            </div>
          )}
        </div>

        {/* Itemized Table */}
        <div className="space-y-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-black font-bold text-gray-800">
                <th className="py-2.5">Product Description</th>
                <th className="py-2.5 text-right w-16">Price</th>
                <th className="py-2.5 text-center w-16">Qty</th>
                <th className="py-2.5 text-right w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400 italic">No items listed.</td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const name = item.product_variants?.variant_name
                    ? `${item.products?.name} (${item.product_variants.variant_name})`
                    : (item.products?.name ?? 'Product');
                  return (
                    <tr key={item.id || idx} className="border-b border-gray-100 font-medium text-gray-700">
                      <td className="py-3 font-semibold text-black">{name}</td>
                      <td className="py-3 text-right">₹{Number(item.price_at_purchase).toFixed(2)}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right font-semibold text-black">
                        ₹{(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Breakdown Summary */}
        <div className="flex justify-end pt-4">
          <div className="w-full md:w-72 text-xs space-y-2 border-t-2 border-black pt-4 font-medium text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-black">₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>- ₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="text-black">{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (Included):</span>
              <span className="text-black">₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm border-t border-black pt-2 text-black">
              <span>Total Paid:</span>
              <span className="text-primary text-base">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Invoice Footer / Compliance */}
      <div className="border-t border-gray-300 pt-8 mt-12 text-center text-[10px] text-gray-500 space-y-2">
        <p className="font-semibold text-gray-700">
          This is a computer generated invoice and does not require a physical signature.
        </p>
        <p>
          Thank you for choosing {companySettings.brand_name}!
        </p>
        <p>
          For support or inquiries, email <span className="font-bold text-black">{companySettings.support_email}</span> or call <span className="font-bold text-black">{companySettings.support_phone}</span>.
        </p>
      </div>

    </div>
  );
}
