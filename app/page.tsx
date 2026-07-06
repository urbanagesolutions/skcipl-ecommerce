import React from 'react';
import Link from 'next/link';
import { fetchCategories } from '@/lib/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export default async function Home() {
  const categories = await fetchCategories();

  // Seed some mock best sellers for layout showcase
  const mockProducts = [
    {
      id: 'p1',
      name: 'Pure Desi Cow Ghee (Bilona Method)',
      slug: 'pure-desi-cow-ghee',
      category: 'Ghee',
      price: 649,
      discount_price: 599,
      rating: 4.8,
      image: '/design-reference/image_from_https_sabarikrishnaconsumables.in_wp_content_uploads_2023_05_cropped/screen.png',
      badge: 'Bestseller'
    },
    {
      id: 'p2',
      name: 'Cold Pressed Virgin Coconut Oil',
      slug: 'virgin-coconut-oil',
      category: 'Oils',
      price: 349,
      discount_price: 299,
      rating: 4.7,
      image: '/design-reference/image_from_https_sabarikrishnaconsumables.in_wp_content_uploads_2023_05_500_ml/screen.png',
      badge: '100% Organic'
    }
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <Card key={product.id} className="group relative flex flex-col h-full overflow-hidden hover:border-primary transition-all p-0">
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="sale">{product.badge}</Badge>
              </div>

              {/* Wishlist Icon */}
              <button className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow hover:text-sale-red text-warm-gray transition-colors">
                <Heart size={18} />
              </button>

              {/* Image Container */}
              <div className="h-64 bg-gray-100 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full flex items-center justify-center text-warm-gray font-bold text-sm bg-[#faf8f5]">
                  [ Ghee / Oil Bottle Mockup ]
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-body-sm text-warm-gray">{product.category}</span>
                  <h3 className="text-title-md font-bold text-on-surface line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-500 font-bold">★</span>
                    <span className="text-body-sm font-semibold">{product.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-body-sm line-through text-warm-gray mr-2">₹{product.price}</span>
                    <span className="text-price-display text-price-green">₹{product.discount_price}</span>
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <Button variant="secondary" size="sm">
                      ADD +
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
