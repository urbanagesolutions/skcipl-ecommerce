'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, ShieldAlert, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface KpiData {
  label: string;
  value: string;
  change: string;
  type: string;
}

interface LowStockItem {
  name: string;
  stock: string;
  min: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [weeklySales, setWeeklySales] = useState<number[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }

      const { data: orders } = await supabase
        .from('orders')
        .select('total, status, created_at, payment_status')
        .order('created_at', { ascending: false });

      const allOrders = orders || [];
      const paidOrders = allOrders.filter((o) => o.payment_status === 'Paid' || o.payment_status === 'Pending');
      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
      const pendingCount = allOrders.filter((o) => ['Pending', 'Processing'].includes(o.status)).length;

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const lastWeekOrders = paidOrders.filter((o) => new Date(o.created_at) >= weekAgo);
      const lastWeekRevenue = lastWeekOrders.reduce((sum, o) => sum + Number(o.total), 0);

      const { data: products } = await supabase
        .from('products')
        .select('name, stock_quantity')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true });

      const lowStockItems = (products || [])
        .filter((p) => p.stock_quantity <= 15)
        .slice(0, 5)
        .map((p) => ({
          name: p.name,
          stock: p.stock_quantity <= 0 ? 'Out of Stock' : `${p.stock_quantity} units left`,
          min: '15 units min',
        }));

      const { data: shipments } = await supabase
        .from('shipments')
        .select('status, shipped_at, delivered_at');

      const allShipments = shipments || [];
      const inTransit = allShipments.filter((s) => s.status === 'In Transit').length;
      const deliveredShipments = allShipments.filter((s) => s.status === 'Delivered');
      const avgTransitDays = deliveredShipments.length
        ? Math.round(
            deliveredShipments.reduce((sum, s) => {
              if (!s.shipped_at || !s.delivered_at) return sum;
              return sum + (new Date(s.delivered_at).getTime() - new Date(s.shipped_at).getTime()) / 86400000;
            }, 0) / deliveredShipments.length
          )
        : 0;

      setKpiData([
        {
          label: 'Total Revenue',
          value: `₹${totalRevenue.toLocaleString('en-IN')}`,
          change: `₹${lastWeekRevenue.toLocaleString('en-IN')} this week`,
          type: 'revenue',
        },
        {
          label: 'Pending Orders',
          value: `${pendingCount} Orders`,
          change: `${allOrders.length} total orders`,
          type: 'orders',
        },
        {
          label: 'Stock Alerts',
          value: `${lowStockItems.length} Items Low`,
          change: lowStockItems[0]?.name ? `${lowStockItems[0].name} needs restock` : 'All stocked',
          type: 'stock',
        },
        {
          label: 'Active Products',
          value: `${(products || []).length} Listed`,
          change: `${(products || []).filter((p) => p.stock_quantity > 0).length} in stock`,
          type: 'channels',
        },
        {
          label: 'Shipments In Transit',
          value: `${inTransit}`,
          change: `${allShipments.length} total shipments`,
          type: 'shipments',
        },
        {
          label: 'Avg Delivery Time',
          value: avgTransitDays ? `${avgTransitDays} days` : '—',
          change: `${deliveredShipments.length} delivered`,
          type: 'delivery',
        },
      ]);

      setLowStock(lowStockItems);

      const dailySales = Array(7).fill(0);
      for (let i = 0; i < 7; i++) {
        const dayStart = new Date();
        dayStart.setDate(dayStart.getDate() - (6 - i));
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        dailySales[i] = paidOrders
          .filter((o) => {
            const d = new Date(o.created_at);
            return d >= dayStart && d <= dayEnd;
          })
          .reduce((sum, o) => sum + Number(o.total), 0);
      }
      const maxSale = Math.max(...dailySales, 1);
      setWeeklySales(dailySales.map((v) => Math.round((v / maxSale) * 110)));
      setLoading(false);
    }
    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-lg text-on-surface">Console Dashboard Overview</h1>
        <p className="text-body-sm text-warm-gray mt-1">Live data from Supabase — fulfillments and inventory.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, idx) => (
          <Card key={idx} elevation={1} className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-warm-gray font-bold">{kpi.label}</span>
            <div className="text-headline-lg font-bold text-on-surface">{kpi.value}</div>
            <span className={`block text-xs font-semibold ${idx === 2 ? 'text-sale-red' : 'text-secondary'}`}>
              {kpi.change}
            </span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card elevation={1} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">
              <TrendingUp size={18} /> Weekly Sales (₹)
            </h3>
            <Badge variant="primary">Live</Badge>
          </div>
          <div className="h-64 flex items-end justify-between pt-6 px-4">
            {weeklySales.map((val, idx) => (
              <div key={idx} className="w-8 sm:w-12 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary rounded-t-md hover:bg-primary-container transition-all"
                  style={{ height: `${Math.max(val, 4)}px` }}
                />
                <span className="text-[10px] text-warm-gray font-bold">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card elevation={1} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">
              <ShieldAlert size={18} /> Low Stock Alerts
            </h3>
            {lowStock.length > 0 && <Badge variant="sale">Urgent</Badge>}
          </div>
          <div className="space-y-4">
            {lowStock.length === 0 ? (
              <p className="text-sm text-warm-gray">All products are well stocked.</p>
            ) : lowStock.map((alert, idx) => (
              <div key={idx} className="p-3 border border-border-subtle rounded-lg bg-gray-50/50 space-y-1">
                <span className="block font-bold text-body-sm text-on-surface">{alert.name}</span>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-sale-red">{alert.stock}</span>
                  <span className="text-warm-gray">{alert.min}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
