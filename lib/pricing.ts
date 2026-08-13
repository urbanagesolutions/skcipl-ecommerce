import { SupabaseClient } from '@supabase/supabase-js';

export interface CartItemRow {
  quantity: number;
  product_id: string;
  variant_id: string | null;
  products: { price: number | string; stock_quantity?: number; name?: string };
  product_variants: { price_override: number | string | null; stock_quantity?: number } | null;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export function getItemPrice(item: CartItemRow): number {
  if (item.product_variants && item.product_variants.price_override !== null) {
    return Number(item.product_variants.price_override);
  }
  return Number(item.products.price);
}

export function calculateSubtotal(cartItems: CartItemRow[]): number {
  return cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
}

export async function calculateDiscount(
  supabase: SupabaseClient,
  couponCode: string | null | undefined,
  subtotal: number
): Promise<number> {
  if (!couponCode) return 0;

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', couponCode.trim().toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (!coupon) return 0;

  const now = new Date();
  const from = new Date(coupon.valid_from);
  const until = new Date(coupon.valid_until);
  if (now < from || now > until) return 0;

  let discount = 0;
  if (coupon.discount_type === 'Percentage') {
    discount = Number(((subtotal * Number(coupon.discount_value)) / 100).toFixed(2));
  } else if (coupon.discount_type === 'Fixed') {
    discount = Number(Number(coupon.discount_value).toFixed(2));
  }
  return Math.min(discount, subtotal);
}

export function calculateShippingFee(subtotal: number): number {
  return subtotal >= 999 ? 0 : 50;
}

export function calculateTax(subtotal: number, discount: number): number {
  const taxableAmount = Math.max(0, subtotal - discount);
  return Number((taxableAmount * 0.05).toFixed(2));
}

export function calculateTotals(subtotal: number, discount: number): OrderTotals {
  const shippingFee = calculateShippingFee(subtotal);
  const tax = calculateTax(subtotal, discount);
  const total = Number((Math.max(0, subtotal - discount) + shippingFee + tax).toFixed(2));
  return { subtotal, discount, shippingFee, tax, total };
}

export async function computeOrderTotals(
  supabase: SupabaseClient,
  cartItems: CartItemRow[],
  couponCode?: string | null
): Promise<OrderTotals> {
  const subtotal = calculateSubtotal(cartItems);
  const discount = await calculateDiscount(supabase, couponCode, subtotal);
  return calculateTotals(subtotal, discount);
}
