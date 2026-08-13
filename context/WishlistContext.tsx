'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface WishlistContextType {
  wishlistIds: Set<string>;
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set(),
  loading: true,
  toggleWishlist: async () => {},
  isWishlisted: () => false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('customer_id', session.user.id);
    setWishlistIds(new Set((data || []).map((w) => w.product_id)));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => refresh());
    return () => subscription.unsubscribe();
  }, [refresh]);

  const toggleWishlist = async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/auth';
      return;
    }
    const isIn = wishlistIds.has(productId);
    if (isIn) {
      await supabase.from('wishlist').delete()
        .eq('customer_id', session.user.id)
        .eq('product_id', productId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    } else {
      await supabase.from('wishlist').insert({
        customer_id: session.user.id,
        product_id: productId,
      });
      setWishlistIds((prev) => new Set(prev).add(productId));
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, loading, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
