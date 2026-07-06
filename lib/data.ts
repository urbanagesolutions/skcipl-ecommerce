import { supabase } from './supabase';
import { Category, CompanySettings } from '@/types';

// Standard fallback seed categories
const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Ghee', slug: 'ghee', is_active: true, display_order: 1, icon_or_image_url: '/assets/icons/ghee.png', requires_fssai_display: true },
  { id: '2', name: 'Oils', slug: 'oils', is_active: true, display_order: 2, icon_or_image_url: '/assets/icons/oils.png', requires_fssai_display: true },
  { id: '3', name: 'Groceries', slug: 'groceries', is_active: true, display_order: 3, icon_or_image_url: '/assets/icons/groceries.png', requires_fssai_display: true },
  { id: '4', name: 'Fashion', slug: 'fashion', is_active: true, display_order: 4, icon_or_image_url: '/assets/icons/fashion.png', requires_fssai_display: false }
];

// Standard fallback seed settings
const FALLBACK_SETTINGS: CompanySettings = {
  id: '1',
  fssai_license_number: '12422027001241',
  fssai_valid_until: '2029-08-28',
  cin: 'U15400TN2023PTC159000',
  gst_number: '33AACCS1242E1Z1'
};

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      // Use fallback if table doesn't exist or is empty
      return FALLBACK_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchCompanySettings(): Promise<CompanySettings> {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_SETTINGS;
    }
    return data as CompanySettings;
  } catch {
    return FALLBACK_SETTINGS;
  }
}
