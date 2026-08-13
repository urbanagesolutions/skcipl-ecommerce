import { supabase } from './supabase';
import { Category, CompanySettings } from '@/types';

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  discount_percent: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  display_order: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories from database:', error);
    throw error;
  }
  return data as Category[];
}

export async function addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(category).select().single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderCategories(updates: { id: string; display_order: number }[]): Promise<void> {
  const results = await Promise.all(
    updates.map((u) => supabase.from('categories').update({ display_order: u.display_order }).eq('id', u.id))
  );
  for (const r of results) {
    if (r.error) throw r.error;
  }
}

export async function fetchCompanySettings(): Promise<CompanySettings> {
  const { data, error } = await supabase.from('company_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('No company settings row found in database.');
  return data as CompanySettings;
}

export async function fetchActiveBanners(): Promise<PromotionalBanner[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('promotional_banners')
    .select('*')
    .eq('is_active', true)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
  return (data as PromotionalBanner[]) || [];
}

export async function fetchRecommendedProducts(categoryId?: string | null, excludeId?: string) {
  let query = supabase
    .from('products')
    .select('id, name, slug, price, mrp, images, categories(name)')
    .eq('is_active', true)
    .gt('stock_quantity', 0)
    .limit(4);

  if (categoryId) query = query.eq('category_id', categoryId);
  if (excludeId) query = query.neq('id', excludeId);

  const { data } = await query;
  return data || [];
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string;
  price: number;
  mrp: number;
  stock_quantity: number;
  batch_number: string;
  expiry_date: string;
  sku: string;
  images: string[];
  is_active: boolean;
  category_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface DatabaseProductRow {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price: number | string;
  mrp: number | string;
  stock_quantity: number;
  batch_number: string | null;
  expiry_date: string | null;
  sku: string | null;
  images: string[] | null;
  is_active: boolean;
  categories: { name: string } | null;
  created_at?: string;
  updated_at?: string;
}

function mapProductRow(p: DatabaseProductRow): AdminProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category_id: p.category_id,
    description: p.description || '',
    price: Number(p.price),
    mrp: Number(p.mrp),
    stock_quantity: p.stock_quantity,
    batch_number: p.batch_number || '',
    expiry_date: p.expiry_date || '',
    sku: p.sku || '',
    images: p.images || [],
    is_active: p.is_active,
    category_name: p.categories?.name || 'Uncategorized',
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data || []) as unknown as DatabaseProductRow[]).map(mapProductRow);
}

export async function addProduct(product: Omit<AdminProduct, 'id' | 'category_name' | 'created_at' | 'updated_at'>): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      stock_quantity: product.stock_quantity,
      batch_number: product.batch_number,
      expiry_date: product.expiry_date || null,
      sku: product.sku || null,
      images: product.images,
      is_active: product.is_active,
    })
    .select('*, categories(name)')
    .single();

  if (error) throw error;
  return mapProductRow(data as unknown as DatabaseProductRow);
}

export async function updateProduct(id: string, updates: Partial<Omit<AdminProduct, 'id' | 'category_name' | 'created_at' | 'updated_at'>>): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: updates.name,
      slug: updates.slug,
      category_id: updates.category_id,
      description: updates.description,
      price: updates.price,
      mrp: updates.mrp,
      stock_quantity: updates.stock_quantity,
      batch_number: updates.batch_number,
      expiry_date: updates.expiry_date || null,
      sku: updates.sku || null,
      images: updates.images,
      is_active: updates.is_active,
    })
    .eq('id', id)
    .select('*, categories(name)')
    .single();

  if (error) throw error;
  return mapProductRow(data as unknown as DatabaseProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function bulkUpdateProductStatus(ids: string[], is_active: boolean): Promise<void> {
  const { error } = await supabase.from('products').update({ is_active }).in('id', ids);
  if (error) throw error;
}
