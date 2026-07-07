'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    images: string[];
    stock_quantity: number;
  };
  product_variants?: {
    id: string;
    variant_name: string;
    price_override: number | null;
    stock_quantity: number;
  } | null;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  syncing: boolean;
  addToCart: (productId: string, variantId: string | null, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = 'guest-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Load cart items from Supabase
  const refreshCart = async () => {
    try {
      setSyncing(true);
      const { data: { session } } = await supabase.auth.getSession();
      const sessionId = getOrCreateSessionId();

      let query = supabase
        .from('cart_items')
        .select('*, products(*), product_variants(*)');

      if (session?.user) {
        query = query.eq('customer_id', session.user.id);
      } else {
        query = query.is('customer_id', null).eq('session_id', sessionId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setCartItems((data as unknown as CartItem[]) || []);
    } catch (err) {
      console.error('Error refreshing cart:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  // Merge guest cart items into customer cart
  const mergeGuestCartToCustomer = async (userId: string) => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    try {
      // 1. Fetch guest items
      const { data: guestItems, error: guestError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId)
        .is('customer_id', null);

      if (guestError || !guestItems || guestItems.length === 0) return;

      // 2. Fetch customer items
      const { data: customerItems, error: custError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('customer_id', userId);

      if (custError) return;

      for (const guestItem of guestItems) {
        const match = customerItems?.find(
          c => c.product_id === guestItem.product_id && c.variant_id === guestItem.variant_id
        );

        if (match) {
          // Update customer quantity
          const newQty = match.quantity + guestItem.quantity;
          await supabase
            .from('cart_items')
            .update({ quantity: newQty })
            .eq('id', match.id);

          // Delete guest item
          await supabase
            .from('cart_items')
            .delete()
            .eq('id', guestItem.id);
        } else {
          // Convert guest item to customer item
          await supabase
            .from('cart_items')
            .update({ customer_id: userId })
            .eq('id', guestItem.id);
        }
      }
    } catch (err) {
      console.error('Error merging cart:', err);
    }
  };

  // Initial fetch and subscribe to auth state changes
  useEffect(() => {
    refreshCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await mergeGuestCartToCustomer(session.user.id);
      }
      await refreshCart();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Add Item to Cart
  const addToCart = async (productId: string, variantId: string | null, quantity = 1) => {
    try {
      setSyncing(true);
      const { data: { session } } = await supabase.auth.getSession();
      const sessionId = getOrCreateSessionId();

      // Check if item already exists in current context
      let checkQuery = supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('product_id', productId);

      if (variantId) {
        checkQuery = checkQuery.eq('variant_id', variantId);
      } else {
        checkQuery = checkQuery.is('variant_id', null);
      }

      if (session?.user) {
        checkQuery = checkQuery.eq('customer_id', session.user.id);
      } else {
        checkQuery = checkQuery.is('customer_id', null).eq('session_id', sessionId);
      }

      const { data: existing } = await checkQuery.maybeSingle();

      if (existing) {
        // Increment quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert new item
        const insertData: any = {
          product_id: productId,
          variant_id: variantId,
          quantity,
          session_id: sessionId
        };
        if (session?.user) {
          insertData.customer_id = session.user.id;
        }
        const { error } = await supabase
          .from('cart_items')
          .insert(insertData);
        if (error) throw error;
      }

      await refreshCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Update Item Quantity
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      setSyncing(true);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

      if (error) throw error;
      await refreshCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (cartItemId: string) => {
    try {
      setSyncing(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      await refreshCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        syncing,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
