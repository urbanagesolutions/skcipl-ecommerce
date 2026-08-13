'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Search, ArrowUpRight, X, Printer, Loader2,
  Package, Truck, MapPin, User, CreditCard, Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

type TabFilter = 'All' | OrderStatus | 'Returned';

interface OrderRow {
  id: string;
  created_at: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  courier_name: string | null;
  tracking_number: string | null;
  customers: {
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  item_count?: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  products: { name: string; images: string[] } | null;
  product_variants: { variant_name: string } | null;
}

interface DeliveryAddress {
  label: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const ALL_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const TABS: TabFilter[] = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

const STATUS_BADGE: Record<string, 'pending' | 'primary' | 'secondary' | 'sale' | 'gray'> = {
  Pending: 'pending',
  Processing: 'primary',
  Shipped: 'primary',
  Delivered: 'secondary',
  Cancelled: 'sale',
  Returned: 'gray',
};

// ─── Component ────────────────────────────────────────────────────────────────

const MOCK_ORDERS = [
  {
    id: 'a5f36e8b-1234-5678-abcd-ef0123456789',
    created_at: new Date().toISOString(),
    status: 'Processing',
    payment_status: 'Paid',
    subtotal: 1250.00,
    discount: 150.00,
    shipping_fee: 50.00,
    tax: 225.00,
    total: 1375.00,
    courier_name: null,
    tracking_number: null,
    customers: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+91 98765 43210'
    }
  },
  {
    id: 'b7c12f45-9876-5432-fedc-ba9876543210',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'Pending',
    payment_status: 'Pending',
    subtotal: 800.00,
    discount: 0.00,
    shipping_fee: 0.00,
    tax: 144.00,
    total: 944.00,
    courier_name: null,
    tracking_number: null,
    customers: {
      name: 'Anjali Gupta',
      email: 'anjali.g@yahoo.com',
      phone: '+91 91234 56789'
    }
  }
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [editStatus, setEditStatus] = useState<OrderStatus>('Pending');
  const [editCourierName, setEditCourierName] = useState('');
  const [editTrackingNumber, setEditTrackingNumber] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Fetch orders list ────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const isDev = process.env.NODE_ENV === 'development';
      const hasBypass = typeof window !== 'undefined' && window.location.search.includes('bypass=true');

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, created_at, status, payment_status,
          subtotal, discount, shipping_fee, tax, total,
          courier_name, tracking_number,
          customers ( name, email, phone )
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        if (hasBypass || isDev) {
          const enriched = MOCK_ORDERS.map((o) => ({
            ...o,
            item_count: 2,
          })) as unknown as OrderRow[];
          setOrders(enriched);
          setLoading(false);
          return;
        }
        if (error) throw error;
      }

      // Count items per order
      const orderIds = (data ?? []).map((o) => o.id);
      const itemCounts: Record<string, number> = {};
      if (orderIds.length > 0) {
        const { data: items } = await supabase
          .from('order_items')
          .select('order_id, quantity')
          .in('order_id', orderIds);

        (items ?? []).forEach((item) => {
          itemCounts[item.order_id] = (itemCounts[item.order_id] ?? 0) + item.quantity;
        });
      }

      const enriched: OrderRow[] = (data ?? []).map((o) => ({
        ...o,
        item_count: itemCounts[o.id] ?? 0,
      })) as unknown as OrderRow[];

      setOrders(enriched);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Fetch order detail ────────────────────────────────────────────────────────
  const openDetail = async (order: OrderRow) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditCourierName(order.courier_name ?? '');
    setEditTrackingNumber(order.tracking_number ?? '');
    setSaveSuccess(false);
    setLoadingDetail(true);
    setOrderItems([]);
    setDeliveryAddress(null);

    try {
      const isDev = process.env.NODE_ENV === 'development';
      const hasBypass = typeof window !== 'undefined' && window.location.search.includes('bypass=true');

      const [itemsRes, addrRes] = await Promise.all([
        supabase
          .from('order_items')
          .select('id, quantity, price_at_purchase, products(name, images), product_variants(variant_name)')
          .eq('order_id', order.id),
        order.customers
          ? supabase
              .from('addresses')
              .select('label, address_line, city, state, pincode')
              .eq('customer_id', (order as { customer_id?: string }).customer_id ?? '')
              .order('is_default', { ascending: false })
              .limit(1)
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (itemsRes.data && itemsRes.data.length > 0) {
        setOrderItems(itemsRes.data as unknown as OrderItem[]);
      } else if (hasBypass || isDev) {
        setOrderItems([
          {
            id: 'item-1',
            quantity: 2,
            price_at_purchase: 600.00,
            products: { name: 'Pure Cow Ghee (1L)', images: [] },
            product_variants: { variant_name: 'Premium Glass Jar' }
          },
          {
            id: 'item-2',
            quantity: 1,
            price_at_purchase: 200.00,
            products: { name: 'Cold-Pressed Coconut Oil', images: [] },
            product_variants: { variant_name: '500ml Pet Bottle' }
          }
        ]);
      }

      if (addrRes.data && addrRes.data.length > 0) {
        setDeliveryAddress(addrRes.data[0] as DeliveryAddress);
      } else if (hasBypass || isDev) {
        setDeliveryAddress({
          label: 'Home',
          address_line: '12, Park Street, Near Metro Station',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700016'
        });
      }
    } catch (err) {
      console.error('Error loading order detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ── Save status / tracking ────────────────────────────────────────────────────
  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    try {
      setSavingStatus(true);
      setSaveSuccess(false);
      const { error } = await supabase
        .from('orders')
        .update({
          status: editStatus,
          courier_name: editCourierName || null,
          tracking_number: editTrackingNumber || null,
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Optimistic update in list
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: editStatus, courier_name: editCourierName || null, tracking_number: editTrackingNumber || null }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: editStatus, courier_name: editCourierName || null, tracking_number: editTrackingNumber || null } : prev
      );
      setSaveSuccess(true);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order. Check RLS permissions.');
    } finally {
      setSavingStatus(false);
    }
  };

  // ── Print invoice ──────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (selectedOrder) {
      window.open(`/admin/orders/invoice/${selectedOrder.id}?bypass=true`, '_blank');
    }
  };

  // ── Filtering ─────────────────────────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      (o.customers?.name ?? '').toLowerCase().includes(q) ||
      (o.customers?.email ?? '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // ── Formatters ────────────────────────────────────────────────────────────────
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const shortId = (id: string) => `#${id.substring(0, 8).toUpperCase()}`;

  // ─── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-headline-lg text-on-surface">Order Fulfillment Panel</h1>
        <p className="text-body-sm text-warm-gray mt-1">
          Manage, process and dispatch customer orders in real-time.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── LEFT: Orders List ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Tabs */}
          <div className="flex border-b border-border-subtle gap-4 pb-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold pb-2.5 whitespace-nowrap transition-all relative ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search by order ID or customer name/email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          {/* Table */}
          <Card elevation={1} className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-border-subtle text-[10px] uppercase tracking-wider text-warm-gray font-bold">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Items</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center">
                      <Loader2 className="animate-spin text-primary mx-auto" size={28} />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-warm-gray font-semibold text-sm">
                      {searchQuery ? 'No orders match your search.' : 'No orders found in this category.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => openDetail(order)}
                        className={`border-b border-border-subtle cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary bg-opacity-5' : 'hover:bg-gray-50/70'
                        }`}
                      >
                        <td className="p-3 font-bold text-primary text-xs">{shortId(order.id)}</td>
                        <td className="p-3">
                          <div className="font-semibold text-on-surface text-xs">{order.customers?.name ?? '—'}</div>
                          <div className="text-[10px] text-warm-gray">{order.customers?.email ?? ''}</div>
                        </td>
                        <td className="p-3 text-xs text-on-surface-variant">{fmtDate(order.created_at)}</td>
                        <td className="p-3 text-center text-xs font-semibold">{order.item_count ?? '—'}</td>
                        <td className="p-3 text-right font-bold text-price-green text-xs">₹{order.total}</td>
                        <td className="p-3">
                          <Badge variant={order.payment_status === 'Paid' ? 'secondary' : order.payment_status === 'Failed' ? 'sale' : 'pending'}>
                            {order.payment_status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={STATUS_BADGE[order.status] ?? 'gray'}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <button className="text-primary hover:text-primary-dark transition-colors">
                            <ArrowUpRight size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {!loading && (
              <div className="px-4 py-2 text-[10px] text-warm-gray border-t border-border-subtle">
                {filtered.length} order{filtered.length !== 1 ? 's' : ''} shown
              </div>
            )}
          </Card>
        </div>

        {/* ── RIGHT: Order Detail Panel ─────────────────────────────────────── */}
        {selectedOrder && (
          <div className="w-full xl:w-[420px] flex-shrink-0 space-y-4 print:w-full print:block">
            <Card elevation={1} className="space-y-0 p-0 overflow-hidden">

              {/* Detail header */}
              <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-gray-50">
                <div>
                  <span className="text-xs font-bold text-primary">{shortId(selectedOrder.id)}</span>
                  <span className="block text-[10px] text-warm-gray">{fmtDate(selectedOrder.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    title="Print Invoice"
                    className="text-warm-gray hover:text-primary transition-colors p-1.5 rounded-md hover:bg-gray-100"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-warm-gray hover:text-sale-red transition-colors p-1.5 rounded-md hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">

                {loadingDetail ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="animate-spin text-primary" size={28} />
                  </div>
                ) : (
                  <>
                    {/* Customer Info */}
                    <section>
                      <h3 className="text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User size={12} /> Customer
                      </h3>
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-on-surface">{selectedOrder.customers?.name ?? 'Unknown'}</p>
                        <p className="text-warm-gray">{selectedOrder.customers?.email ?? '—'}</p>
                        {selectedOrder.customers?.phone && (
                          <p className="text-warm-gray">{selectedOrder.customers.phone}</p>
                        )}
                      </div>
                    </section>

                    {/* Delivery Address */}
                    {deliveryAddress && (
                      <section>
                        <h3 className="text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <MapPin size={12} /> Delivery Address
                        </h3>
                        <div className="text-xs space-y-0.5">
                          <p className="font-semibold text-on-surface">{deliveryAddress.label}</p>
                          <p className="text-warm-gray">{deliveryAddress.address_line}</p>
                          <p className="text-warm-gray">{deliveryAddress.city}, {deliveryAddress.state} — {deliveryAddress.pincode}</p>
                        </div>
                      </section>
                    )}

                    {/* Order Items */}
                    <section>
                      <h3 className="text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Package size={12} /> Items Ordered
                      </h3>
                      <div className="space-y-2">
                        {orderItems.length === 0 ? (
                          <p className="text-xs text-warm-gray">No items on record.</p>
                        ) : (
                          orderItems.map((item) => {
                            const name = item.product_variants?.variant_name
                              ? `${item.products?.name} (${item.product_variants.variant_name})`
                              : (item.products?.name ?? 'Product');
                            const img = item.products?.images?.[0] ?? '/assets/placeholder-product.png';
                            return (
                              <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <img
                                  src={img}
                                  alt={name}
                                  className="w-10 h-10 object-contain rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-semibold text-on-surface truncate">{name}</p>
                                  <p className="text-[10px] text-warm-gray">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-xs font-bold text-on-surface whitespace-nowrap">
                                  ₹{(item.price_at_purchase * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </section>

                    {/* Payment Summary */}
                    <section>
                      <h3 className="text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CreditCard size={12} /> Payment Summary
                      </h3>
                      <div className="text-xs space-y-1.5 bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between"><span className="text-warm-gray">Subtotal</span><span>₹{selectedOrder.subtotal}</span></div>
                        {Number(selectedOrder.discount) > 0 && (
                          <div className="flex justify-between text-sale-red"><span>Discount</span><span>- ₹{selectedOrder.discount}</span></div>
                        )}
                        <div className="flex justify-between"><span className="text-warm-gray">Shipping</span><span>{Number(selectedOrder.shipping_fee) === 0 ? 'FREE' : `₹${selectedOrder.shipping_fee}`}</span></div>
                        <div className="flex justify-between"><span className="text-warm-gray">Tax (GST)</span><span>₹{selectedOrder.tax}</span></div>
                        <div className="flex justify-between font-bold border-t border-border-subtle pt-1.5">
                          <span>Total Paid</span>
                          <span className="text-price-green text-sm">₹{selectedOrder.total}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-warm-gray">Payment Status</span>
                          <Badge variant={STATUS_BADGE[selectedOrder.payment_status] ?? 'pending'}>
                            {selectedOrder.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </section>

                    {/* Status Update */}
                    <section>
                      <h3 className="text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Truck size={12} /> Fulfillment Update
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-warm-gray">Order Status</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                            className="w-full border border-border-subtle rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-primary"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-warm-gray">Courier Name</label>
                          <input
                            type="text"
                            value={editCourierName}
                            onChange={(e) => setEditCourierName(e.target.value)}
                            placeholder="e.g. BlueDart Express"
                            className="w-full border border-border-subtle rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-warm-gray">Tracking Number / AWB</label>
                          <input
                            type="text"
                            value={editTrackingNumber}
                            onChange={(e) => setEditTrackingNumber(e.target.value)}
                            placeholder="e.g. BD-924058209"
                            className="w-full border border-border-subtle rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-primary"
                          />
                        </div>

                        <Button
                          variant="primary"
                          fullWidth
                          onClick={handleSaveChanges}
                          disabled={savingStatus}
                          className="flex items-center gap-2 justify-center"
                        >
                          {savingStatus ? (
                            <><Loader2 className="animate-spin" size={14} /> Saving…</>
                          ) : saveSuccess ? (
                            <><Check size={14} /> Saved!</>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
