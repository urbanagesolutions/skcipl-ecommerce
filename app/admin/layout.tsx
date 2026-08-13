'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Grid,
  Ticket,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [staffInfo, setStaffInfo] = useState<{ name: string } | null>(null);

  const sidebarLinks = [
    { label: 'Dashboard Overview', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Products & Inventory', href: '/admin/products', icon: <Grid size={18} /> },
    { label: 'Order Processing', href: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { label: 'Coupon Management', href: '/admin/coupons', icon: <Ticket size={18} /> },
    { label: 'Marketplace Sync', href: '/admin/marketplace', icon: <Store size={18} /> },
  ];

  useEffect(() => {
    async function checkAdmin() {
      try {
        const isDev = process.env.NODE_ENV === 'development';
        const hasBypass = typeof window !== 'undefined' && window.location.search.includes('bypass=true');

        if (isDev && hasBypass) {
          setStaffInfo({ name: 'Test Admin Bypass' });
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }

        // Query the staff table to verify if the user has role 'admin'
        const { data: staffMember, error } = await supabase
          .from('staff')
          .select('name, role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error || !staffMember || staffMember.role !== 'admin') {
          // Non-admin user, redirect away
          console.warn('Unauthorized access attempt to admin console.');
          router.push('/');
          return;
        }

        setStaffInfo({ name: staffMember.name });
        setIsAdmin(true);
      } catch (err) {
        console.error('Error validating admin access:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-[#f3f3f6]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-solid"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (pathname.includes('/invoice')) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px]">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#f3f3f6] border-r border-border-subtle p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-warm-gray font-bold">FMCG Operations Center</span>
            <h2 className="text-title-md font-bold text-on-surface mt-1">Management Suite</h2>
          </div>
          
          <nav className="space-y-1">
            {sidebarLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex items-center gap-3 p-3 hover:bg-primary hover:bg-opacity-5 hover:text-primary rounded-lg text-body-sm font-semibold text-on-surface-variant transition-all"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Administrator profile shortcut */}
        <Card elevation={0} className="p-3 bg-white border border-border-subtle mt-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              {staffInfo?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div>
              <span className="block text-xs font-bold text-on-surface">{staffInfo?.name || 'Administrator'}</span>
              <span className="text-[10px] text-warm-gray font-semibold">System Administrator</span>
            </div>
          </div>
        </Card>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 md:p-8 bg-surface">
        {children}
      </main>
    </div>
  );
}
