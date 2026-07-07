import { supabase } from './supabase';
import { Category, CompanySettings } from '@/types';

// Fallback seed categories kept for documented backup/reference
export const FALLBACK_CATEGORIES_UNUSED: Category[] = [
  { id: '1', name: 'Ghee', slug: 'ghee', is_active: true, display_order: 1, icon_or_image_url: '/assets/icons/ghee.png', requires_fssai_display: true },
  { id: '2', name: 'Oils', slug: 'oils', is_active: true, display_order: 2, icon_or_image_url: '/assets/icons/oils.png', requires_fssai_display: true },
  { id: '3', name: 'Groceries', slug: 'groceries', is_active: true, display_order: 3, icon_or_image_url: '/assets/icons/groceries.png', requires_fssai_display: true },
  { id: '4', name: 'Fashion', slug: 'fashion', is_active: true, display_order: 4, icon_or_image_url: '/assets/icons/fashion.png', requires_fssai_display: false }
];

// Fallback seed settings kept for documented backup/reference
export const FALLBACK_SETTINGS_UNUSED: CompanySettings = {
  id: '1',
  fssai_license_number: '12422027001241',
  fssai_valid_until: '2029-08-28',
  cin: 'U15400TN2023PTC159000',
  gst_number: '33AACCS1242E1Z1'
};

// ----------------------------------------------------
// Categories CRUD
// ----------------------------------------------------

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
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error('Error adding category:', error);
    throw error;
  }
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export async function reorderCategories(updates: { id: string; display_order: number }[]): Promise<void> {
  const promises = updates.map(update => 
    supabase
      .from('categories')
      .update({ display_order: update.display_order })
      .eq('id', update.id)
  );
  const results = await Promise.all(promises);
  for (const r of results) {
    if (r.error) {
      console.error('Error in reordering categories:', r.error);
      throw r.error;
    }
  }
}

// ----------------------------------------------------
// Company Settings
// ----------------------------------------------------

export async function fetchCompanySettings(): Promise<CompanySettings> {
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching company settings:', error);
    throw error;
  }
  if (!data) {
    throw new Error('No company settings row found in database.');
  }
  return data as CompanySettings;
}

// ----------------------------------------------------
// Products CRUD & Interfaces
// ----------------------------------------------------

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
  categories: {
    name: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
     console.error('Error fetching products from database:', error);
     throw error;
  }

  const rows = (data || []) as unknown as DatabaseProductRow[];
  return rows.map((p) => ({
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
     updated_at: p.updated_at
  }));
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
      is_active: product.is_active
    })
    .select('*, categories(name)')
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  const row = data as unknown as DatabaseProductRow;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category_id: row.category_id,
    description: row.description || '',
    price: Number(row.price),
    mrp: Number(row.mrp),
    stock_quantity: row.stock_quantity,
    batch_number: row.batch_number || '',
    expiry_date: row.expiry_date || '',
    sku: row.sku || '',
    images: row.images || [],
    is_active: row.is_active,
    category_name: row.categories?.name || 'Uncategorized',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
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
      is_active: updates.is_active
    })
    .eq('id', id)
    .select('*, categories(name)')
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  const row = data as unknown as DatabaseProductRow;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category_id: row.category_id,
    description: row.description || '',
    price: Number(row.price),
    mrp: Number(row.mrp),
    stock_quantity: row.stock_quantity,
    batch_number: row.batch_number || '',
    expiry_date: row.expiry_date || '',
    sku: row.sku || '',
    images: row.images || [],
    is_active: row.is_active,
    category_name: row.categories?.name || 'Uncategorized',
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function bulkUpdateProductStatus(ids: string[], is_active: boolean): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ is_active })
    .in('id', ids);

  if (error) {
    console.error('Error in bulk update products status:', error);
    throw error;
  }
}
