import { SupabaseClient } from '@supabase/supabase-js';
import { CartItemRow, getItemPrice, computeOrderTotals } from './pricing';

export interface AddressSnapshot {
  label: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
}

export async function fetchAddressSnapshot(
  supabase: SupabaseClient,
  userId: string,
  addressId?: string | null
): Promise<{ address_id: string | null; address_snapshot: AddressSnapshot | null }> {
  if (!addressId) return { address_id: null, address_snapshot: null };

  const { data: addr } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', addressId)
    .eq('customer_id', userId)
    .maybeSingle();

  if (!addr) return { address_id: null, address_snapshot: null };

  return {
    address_id: addr.id,
    address_snapshot: {
      label: addr.label,
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    },
  };
}

export function validateStock(cartItems: CartItemRow[]): string | null {
  for (const item of cartItems) {
    const stock = item.product_variants?.stock_quantity ?? item.products.stock_quantity ?? 0;
    if (stock < item.quantity) {
      return `Insufficient stock for ${item.products.name || 'a product'}. Available: ${stock}`;
    }
  }
  return null;
}

export async function decrementStock(
  supabase: SupabaseClient,
  cartItems: CartItemRow[]
): Promise<void> {
  for (const item of cartItems) {
    if (item.variant_id && item.product_variants) {
      const newQty = Math.max(0, (item.product_variants.stock_quantity ?? 0) - item.quantity);
      await supabase.from('product_variants').update({ stock_quantity: newQty }).eq('id', item.variant_id);
    } else {
      const newQty = Math.max(0, (item.products.stock_quantity ?? 0) - item.quantity);
      await supabase.from('products').update({ stock_quantity: newQty }).eq('id', item.product_id);
    }
  }
}

export async function createOrderFromCart(
  supabase: SupabaseClient,
  userId: string,
  cartItems: CartItemRow[],
  options: {
    couponCode?: string | null;
    addressId?: string | null;
    paymentStatus: string;
    status?: string;
    codVerified?: boolean;
    codOtpVerifiedAt?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    loyaltyPointsRedeemed?: number;
  }
): Promise<{ orderId: string } | { error: string }> {
  const stockError = validateStock(cartItems);
  if (stockError) return { error: stockError };

  const totals = await computeOrderTotals(supabase, cartItems, options.couponCode);
  const { address_id, address_snapshot } = await fetchAddressSnapshot(supabase, userId, options.addressId);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: userId,
      status: options.status || 'Processing',
      payment_status: options.paymentStatus,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping_fee: totals.shippingFee,
      tax: totals.tax,
      total: totals.total,
      address_id,
      address_snapshot,
      cod_verified: options.codVerified ?? false,
      cod_otp_verified_at: options.codOtpVerifiedAt ?? null,
      razorpay_order_id: options.razorpayOrderId ?? null,
      razorpay_payment_id: options.razorpayPaymentId ?? null,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('Order creation failed:', orderError);
    return { error: 'Failed to create order' };
  }

  const orderItemsData = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    price_at_purchase: getItemPrice(item),
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
  if (itemsError) console.error('Order items insert failed:', itemsError);

  await decrementStock(supabase, cartItems);

  await supabase.from('cart_items').delete().eq('customer_id', userId);

  const pointsEarned = Math.floor(totals.total / 10);
  if (pointsEarned > 0) {
    const { data: cust } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('user_id', userId)
      .maybeSingle();
    const current = cust?.loyalty_points ?? 0;
    const net = Math.max(0, current + pointsEarned - (options.loyaltyPointsRedeemed ?? 0));
    await supabase.from('customers').update({ loyalty_points: net }).eq('user_id', userId);
    await supabase.from('loyalty_transactions').insert({
      customer_id: userId,
      order_id: order.id,
      points: pointsEarned,
      type: 'earn',
      description: `Earned from order #${order.id.substring(0, 8)}`,
    });
  }

  return { orderId: order.id };
}
