import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShoppingBag, MapPin, Award, User, LogOut } from 'lucide-react';

export default function AccountPage() {
  const loyaltyPoints = 340;
  
  const mockOrders = [
    { id: '#SK-120539', date: 'July 6, 2026', total: 1147, status: 'Processing' },
    { id: '#SK-119421', date: 'June 18, 2026', total: 599, status: 'Delivered' }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-headline-lg text-on-surface mb-8">My Account</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
          <Card elevation={0} className="p-4 space-y-2">
            <Link href="/account" className="flex items-center gap-3 p-2 bg-primary bg-opacity-5 text-primary rounded-md font-bold text-body-sm">
              <User size={18} /> Profile Overview
            </Link>
            <Link href="/account" className="flex items-center gap-3 p-2 text-on-surface-variant hover:bg-gray-50 rounded-md text-body-sm">
              <ShoppingBag size={18} /> My Orders
            </Link>
            <Link href="/account" className="flex items-center gap-3 p-2 text-on-surface-variant hover:bg-gray-50 rounded-md text-body-sm">
              <MapPin size={18} /> Saved Addresses
            </Link>
            <button className="w-full flex items-center gap-3 p-2 text-sale-red hover:bg-red-50 rounded-md text-body-sm mt-4 text-left">
              <LogOut size={18} /> Logout
            </button>
          </Card>
        </aside>

        {/* Dashboard Panels */}
        <div className="flex-1 space-y-6">
          {/* Metadata rewards banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card elevation={1} className="bg-primary bg-opacity-5 flex items-center gap-4 border border-primary border-opacity-20">
              <div className="w-12 h-12 bg-primary-container text-primary rounded-full flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Loyalty Rewards</span>
                <span className="text-headline-lg font-bold text-on-surface">{loyaltyPoints} Points</span>
                <span className="block text-[10px] text-primary mt-0.5">Use points to claim discounts at checkout</span>
              </div>
            </Card>

            <Card elevation={1} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-secondary rounded-full flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Primary Address</span>
                <span className="block font-semibold text-body-sm text-on-surface">Anna Salai, Chennai</span>
                <Link href="/account" className="text-xs text-primary hover:underline">Manage Addresses</Link>
              </div>
            </Card>
          </div>

          {/* Orders History list */}
          <Card elevation={1} className="space-y-4">
            <h2 className="text-title-md font-bold text-on-surface pb-3 border-b border-border-subtle">
              Recent Orders
            </h2>
            <div className="space-y-4">
              {mockOrders.map((o) => (
                <div key={o.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border-subtle rounded-xl gap-4 hover:bg-gray-50/50">
                  <div className="space-y-1">
                    <span className="font-bold text-primary">{o.id}</span>
                    <span className="block text-xs text-warm-gray">Placed on {o.date}</span>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="text-left sm:text-right">
                      <span className="text-body-sm font-semibold text-on-surface">Grand Total</span>
                      <span className="block font-bold text-on-surface">₹{o.total}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={o.status === 'Processing' ? 'pending' : 'secondary'}>
                        {o.status}
                      </Badge>
                      <Link href={`/account/track/120539`}>
                        <Button variant="outline" size="sm">Track</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
