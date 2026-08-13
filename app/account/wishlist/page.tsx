'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface WishlistProduct {
  product_id: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }

      const { data } = await supabase
        .from('wishlist')
        .select('product_id, products(id, name, slug, price, images)')
        .eq('customer_id', session.user.id);

      setItems((data as unknown as WishlistProduct[]) || []);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <Link href="/account" className="flex items-center gap-2 text-primary text-sm font-bold mb-6 hover:underline">
        <ArrowLeft size={16} /> Back to Account
      </Link>
      <h1 className="text-headline-lg text-on-surface mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <Heart size={48} className="mx-auto text-warm-gray mb-4" />
          <p className="text-warm-gray mb-4">Your wishlist is empty</p>
          <Link href="/"><Button variant="primary">Start Shopping</Button></Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.product_id} className="p-4 space-y-3">
              <Link href={`/product/${item.products.slug}`}>
                <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                  {item.products.images?.[0] ? (
                    <img src={item.products.images[0]} alt={item.products.name} className="object-contain max-h-full" />
                  ) : null}
                </div>
                <h3 className="font-bold mt-2 hover:text-primary">{item.products.name}</h3>
              </Link>
              <span className="font-bold text-price-green">₹{item.products.price}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => addToCart(item.products.id, null, 1)}>
                  <ShoppingBag size={14} className="mr-1" /> Add to Cart
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleWishlist(item.product_id)}>
                  <Heart size={14} fill={isWishlisted(item.product_id) ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
