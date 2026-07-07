export const dynamic = 'force-dynamic';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const kpiData = [
    { label: 'Total Revenue', value: '₹4,52,900', change: '+12.4% vs last week', type: 'revenue' },
    { label: 'Pending Orders', value: '48 Orders', change: '8 require immediate dispatch', type: 'orders' },
    { label: 'Stock Alerts', value: '3 Items Low', change: 'Ghee 500ml is at 10% safety margin', type: 'stock' },
    { label: 'Active Channels', value: '2 Connected', change: 'Amazon, Flipkart syncing live', type: 'channels' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-headline-lg text-on-surface">Console Dashboard Overview</h1>
        <p className="text-body-sm text-warm-gray mt-1">Fulfillments, channels sync, and inventory overview.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, idx) => (
          <Card key={idx} elevation={1} className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-warm-gray font-bold">{kpi.label}</span>
            <div className="text-headline-lg font-bold text-on-surface">{kpi.value}</div>
            <span className={`block text-xs font-semibold ${
              idx === 2 ? 'text-sale-red' : 'text-secondary'
            }`}>
              {kpi.change}
            </span>
          </Card>
        ))}
      </div>

      {/* Graph Mockup & System status split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly sales graph mock */}
        <Card elevation={1} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">
              <TrendingUp size={18} /> Weekly Sales Distribution
            </h3>
            <Badge variant="primary">July 2026</Badge>
          </div>
          
          <div className="h-64 flex items-end justify-between pt-6 px-4">
            {[45, 80, 55, 90, 70, 110, 85].map((val, idx) => (
              <div key={idx} className="w-8 sm:w-12 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary rounded-t-md hover:bg-primary-container transition-all"
                  style={{ height: `${val * 1.5}px` }}
                />
                <span className="text-[10px] text-warm-gray font-bold">Day {idx + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card elevation={1} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">
              <ShieldAlert size={18} /> Safety Warnings
            </h3>
            <Badge variant="sale">Urgent</Badge>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Desi Cow Ghee (500 ml)', stock: '12 units left', min: '50 units min' },
              { name: 'Coconut Oil (1L)', stock: '4 units left', min: '20 units min' },
              { name: 'Mustard Oil (500 ml)', stock: '0 units (Out of Stock)', min: '15 units min' }
            ].map((alert, idx) => (
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
