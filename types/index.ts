export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_category_id?: string | null;
  is_active: boolean;
  display_order: number;
  icon_or_image_url?: string | null;
  requires_fssai_display: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompanySettings {
  id: string;
  fssai_license_number: string;
  fssai_valid_until: string;
  cin?: string;
  gst_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  image_url: string;
  category_id: string;
  stock: number;
  rating: number;
  is_active: boolean;
}

export interface Order {
  id: string;
  customer_name: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}
