import React from 'react';
import Link from 'next/link';
import { fetchCategories } from '@/lib/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HomeProductList } from '@/components/HomeProductList';
import { PromotionalBanner } from '@/components/PromotionalBanner';

export default async function Home() {
  const categories = await fetchCategories();

  // 1. Fetch live active products joined with category names
  const { data: prodsData } = await supabase
    .from('products')
    .select('*, categories:category_id(name)')
    .eq('is_active', true)
    .limit(6);

  // 2. Fetch all reviews to compute actual ratings
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('product_id, rating');

  const bestSellers = (prodsData || []).map(p => {
    const productReviews = (reviewsData || []).filter(r => r.product_id === p.id);
    const avgRating = productReviews.length > 0
      ? Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1))
      : 5.0; // default fallback rating

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.categories?.name || 'Category',
      price: Number(p.mrp),
      discount_price: Number(p.price),
      rating: avgRating,
      image: p.images && p.images[0] ? p.images[0] : null,
      badge: p.stock_quantity <= 0 ? 'Out of Stock' : p.stock_quantity <= 10 ? 'Low Stock' : 'Bestseller'
    };
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 space-y-12">
      {/* 1. Hero Block (Premium Storefront Preview) */}
      <section className="bg-primary-container text-on-primary-container rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-elevation-2">
        <div className="max-w-2xl relative z-10 space-y-4">
          <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-2">
            Indian FMCG Excellence
          </Badge>
          <h1 className="text-display-lg font-bold leading-tight">
            Heritage Ghee & Consumables
          </h1>
          <p className="text-body-lg text-on-primary-container opacity-90 max-w-lg">
            Sabari Krishna offers 100% pure, hand-churned Vedic cow ghee and organic cold-pressed oils. Nurtured with care, packaged with absolute hygiene.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/category/ghee">
              <Button variant="primary" className="flex items-center gap-2">
                Shop Pure Ghee <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-on-primary-container text-on-primary-container hover:bg-white hover:bg-opacity-10">
                Our Legacy
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:flex items-center justify-center opacity-20">
          <Sparkles size={180} />
        </div>
      </section>

      <PromotionalBanner />

      {/* 2. Data-driven Category Selection (Manifest Target 2) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-lg text-on-surface">Explore Categories</h2>
          <span className="text-body-sm text-warm-gray">Fetched live from Supabase db</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card
                elevation={1}
                roundedSize="2xl"
                className="group flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span className="font-bold text-lg">{category.name[0]}</span>
                </div>
                <h3 className="text-title-md font-bold text-on-surface group-hover:text-primary">
                  {category.name}
                </h3>
                {category.requires_fssai_display && (
                  <span className="mt-2 text-[10px] text-secondary font-semibold bg-secondary bg-opacity-10 px-2 py-0.5 rounded">
                    FSSAI Mandate
                  </span>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Product Grid Card Mockups (Manifest Target 3) */}
      <section className="space-y-6">
        <h2 className="text-headline-lg text-on-surface">Best Sellers</h2>
        <HomeProductList products={bestSellers} />
      </section>

      {/* 4. Design System Tokens Interactive Sandbox */}
      <section className="bg-white rounded-2xl border border-border-subtle p-8 space-y-8">
        <div>
          <h2 className="text-headline-lg text-on-surface">Design System Sandbox</h2>
          <p className="text-body-sm text-warm-gray">Interactive visual verification of Section 2 tokens</p>
        </div>

        {/* Buttons variants */}
        <div className="space-y-4">
          <h3 className="text-title-md font-bold text-on-surface">Buttons & Interactive States</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Amber Button</Button>
            <Button variant="secondary">Secondary Green Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Red Button</Button>
            <Button variant="coming-soon">Coming Soon Button</Button>
          </div>
        </div>

        {/* Badges Variants */}
        <div className="space-y-4">
          <h3 className="text-title-md font-bold text-on-surface">Badges & Statuses</h3>
          <div className="flex flex-wrap gap-4">
            <Badge variant="primary">Primary Accent</Badge>
            <Badge variant="secondary">Active Badge</Badge>
            <Badge variant="sale">Sale Sticker</Badge>
            <Badge variant="pending">Pending State</Badge>
            <Badge variant="gray">Utility Info</Badge>
            <Badge variant="coming-soon">Coming Soon</Badge>
          </div>
        </div>

        {/* Input Variants */}
        <div className="space-y-4">
          <h3 className="text-title-md font-bold text-on-surface">Input Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Standard Input (Medium Rounded)</label>
              <Input placeholder="Enter details..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Search Input (Pill Rounded)</label>
              <Input roundedSize="full" placeholder="Search product catalogue..." />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Flows Navigation Sitemap */}
      <section className="space-y-6">
        <div className="border-t border-border-subtle pt-8">
          <h2 className="text-headline-lg text-on-surface">Application Sitemap & Scaffold Links</h2>
          <p className="text-body-sm text-warm-gray">Explore the 10 consumer journeys & panels scaffolded in the app directory</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link href="/category/ghee">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">1. Category Listing</h3>
              <p className="text-body-sm text-on-surface-variant">Browse dynamic items filter sidebar & ratings.</p>
            </Card>
          </Link>
          
          <Link href="/product/pure-desi-cow-ghee">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">2. Product Detail</h3>
              <p className="text-body-sm text-on-surface-variant">Verify options selectors & FSSAI dynamic disclaimer.</p>
            </Card>
          </Link>
          
          <Link href="/cart">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">3. Shopping Cart</h3>
              <p className="text-body-sm text-on-surface-variant">Quantity adjusters & cross-sale checkout prompts.</p>
            </Card>
          </Link>
          
          <Link href="/checkout">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">4. Checkout Funnel</h3>
              <p className="text-body-sm text-on-surface-variant">Review steps: slot choosing, payment mode selectors.</p>
            </Card>
          </Link>

          <Link href="/order-success">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">5. Order Success</h3>
              <p className="text-body-sm text-on-surface-variant">Receipt details, blue success validation badges.</p>
            </Card>
          </Link>

          <Link href="/account">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">6. Account Dashboard</h3>
              <p className="text-body-sm text-on-surface-variant">User order history lists, address records.</p>
            </Card>
          </Link>

          <Link href="/account/track/1001">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">7. Order Tracking</h3>
              <p className="text-body-sm text-on-surface-variant">Track package shipment path via BlueDart courier.</p>
            </Card>
          </Link>

          <Link href="/admin">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">8. Admin Console Dashboard</h3>
              <p className="text-body-sm text-on-surface-variant">Sales sparklines, stock alerts, operations portal.</p>
            </Card>
          </Link>

          <Link href="/admin/marketplace">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">9. Marketplace Sync</h3>
              <p className="text-body-sm text-on-surface-variant">Connect channel sync widgets (Amazon/Flipkart) and grayed out channels.</p>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">10. Category Manager</h3>
              <p className="text-body-sm text-on-surface-variant">Manage categories table dynamically (inside Inventory screen).</p>
            </Card>
          </Link>

          <Link href="/auth">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">11. Authentication Portal</h3>
              <p className="text-body-sm text-on-surface-variant">Login split screen pane & OTP triggers mockup.</p>
            </Card>
          </Link>

          <Link href="/unknown-page-test">
            <Card elevation={0} className="hover:border-primary cursor-pointer h-full">
              <h3 className="font-bold text-primary text-title-md mb-2">12. Custom 404 Error</h3>
              <p className="text-body-sm text-on-surface-variant">Trigger custom not-found missing pages layout.</p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
