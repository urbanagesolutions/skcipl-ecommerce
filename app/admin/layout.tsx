import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Grid
} from 'lucide-react';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = [
    { label: 'Dashboard Overview', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Products & Inventory', href: '/admin/products', icon: <Grid size={18} /> },
    { label: 'Order Processing', href: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { label: 'Marketplace Sync', href: '/admin/marketplace', icon: <Store size={18} /> },
  ];

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
              SK
            </div>
            <div>
              <span className="block text-xs font-bold text-on-surface">Sabari Krishna</span>
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
