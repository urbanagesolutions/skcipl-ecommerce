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

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Partially Shipped'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface Order {
  id: string;
  customer_name: string;
  date: string;
  amount: number;
  status: OrderStatus;
  courier_name?: string | null;
  tracking_number?: string | null;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  slug: string;
  tracking_url_template: string;
  logo_url?: string | null;
  is_enabled: boolean;
  is_custom: boolean;
}

export interface Shipment {
  id: string;
  order_id: string;
  carrier_id?: string | null;
  carrier_name: string | null;
  tracking_number: string;
  tracking_url: string | null;
  status: 'Label Created' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception' | 'Returned';
  shipped_at: string | null;
  delivered_at: string | null;
  estimated_delivery: string | null;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  event_code: string;
  description: string;
  location: string | null;
  occurred_at: string;
}

export interface TrackingSettings {
  primary_color: string;
  accent_color: string;
  show_carrier_logo: boolean;
  show_estimated_delivery: boolean;
  notify_in_transit: boolean;
  notify_out_for_delivery: boolean;
  notify_delivered: boolean;
}

export interface PlatformInfo {
  id: string;
  name: string;
  tagline: string;
  domain?: string;
  url?: string;
  badge: string;
  description: string;
  features: string[];
  image: string;
  categories: string[];
  ctaLabel: string;
  ctaUrl: string;
}

export interface CorporateProfile {
  name: string;
  legalName: string;
  shortName: string;
  cin: string;
  gstin: string;
  fssai: string;
  fssaiValidUntil: string;
  incorporatedDate: string;
  registeredOffice: string;
  factoryAddress: string;
  email: string;
  phone: string;
  whatsapp: string;
  directors: { name: string; designation: string }[];
  platforms: PlatformInfo[];
}

