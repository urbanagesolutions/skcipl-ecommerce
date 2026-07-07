'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Shipped' | 'Delivered'>('All');

  const [orders, setOrders] = useState([
    { id: '#SK-120539', name: 'Ramanathan K.', date: 'July 6, 2026', amount: 1147, status: 'Pending' },
    { id: '#SK-119421', name: 'Priya Sundar', date: 'June 18, 2026', amount: 599, status: 'Delivered' },
    { id: '#SK-118320', name: 'Anish Rajan', date: 'June 15, 2026', amount: 899, status: 'Shipped' },
    { id: '#SK-117512', name: 'Meenakshi N.', date: 'June 12, 2026', amount: 2490, status: 'Delivered' }
  ]);

  const updateStatus = (id: string, nextStatus: 'Shipped' | 'Delivered') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-lg text-on-surface">Order Fulfillment Panel</h1>
        <p className="text-body-sm text-warm-gray mt-1">Manage, process and dispatch customer orders.</p>
      </div>

      {/* Tabs / Filters */}
      <div className="flex border-b border-border-subtle gap-6 pb-2 overflow-x-auto">
        {(['All', 'Pending', 'Shipped', 'Delivered'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-body-sm font-semibold pb-2 transition-all relative ${
              activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab} List
          </button>
        ))}
      </div>

      {/* Search orders */}
      <div className="max-w-md">
        <Input placeholder="Search orders by ID or customer name..." icon={<Search size={16} />} />
      </div>

      {/* Orders Table */}
      <Card elevation={1} className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-body-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border-subtle text-xs uppercase tracking-wider text-warm-gray font-bold">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-border-subtle hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-primary">{order.id}</td>
                <td className="p-4 font-semibold text-on-surface">{order.name}</td>
                <td className="p-4 text-on-surface-variant">{order.date}</td>
                <td className="p-4 font-bold text-price-green">₹{order.amount}</td>
                <td className="p-4">
                  <Badge variant={order.status === 'Pending' ? 'pending' : order.status === 'Shipped' ? 'primary' : 'secondary'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-2">
                  {order.status === 'Pending' && (
                    <Button variant="secondary" size="sm" onClick={() => updateStatus(order.id, 'Shipped')}>
                      Mark Shipped
                    </Button>
                  )}
                  {order.status === 'Shipped' && (
                    <Button variant="primary" size="sm" onClick={() => updateStatus(order.id, 'Delivered')}>
                      Mark Delivered
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="p-2">
                    <ArrowUpRight size={14} />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-warm-gray font-semibold">
                  No orders found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
