import { Category, CompanySettings, PlatformInfo, CorporateProfile } from '@/types';

export const CORPORATE_INFO: CorporateProfile = {
  name: 'Sabari Krishna Consumables India Private Limited',
  legalName: 'Sabari Krishna Consumables India Private Limited',
  shortName: 'SKCIPL',
  cin: 'U15400TZ2022PTC038484',
  gstin: '33AACCS1242E1Z1',
  fssai: '12423018000000',
  fssaiValidUntil: '2029-08-28',
  incorporatedDate: '24th March 2022',
  registeredOffice: '15/10, 1st Floor, Karuvampalayam Extension 4th Street, Puliyamarathottam, Tiruppur, Tamil Nadu - 641604, India',
  factoryAddress: 'SF No. 342/2, Puliyamarathottam Processing Unit, Karuvampalayam, Tiruppur, Tamil Nadu - 641604',
  email: 'sabarikrishnaconsumables@gmail.com',
  phone: '+91 98422 28484',
  whatsapp: '+91 98422 28484',
  directors: [
    { name: 'Karuppusamy Dhandapani', designation: 'Managing Director' },
    { name: 'Dhandapani Bhuvaneswari', designation: 'Director' },
    { name: 'Kabelesabinav Dhandapani', designation: 'Executive Director & Operations' }
  ],
  platforms: []
};

export const COMPANY_PLATFORMS: PlatformInfo[] = [
  {
    id: 'gks-mart',
    name: 'GKS Mart',
    tagline: 'Fresh Groceries, Staples & FMCG Supermarket Platform',
    domain: 'gksmart.in',
    url: 'https://gksmart.in',
    badge: 'Retail & Quick Mart',
    description: 'The modern consumer retail and omnichannel grocery platform of Sabari Krishna Consumables. Providing households with fresh groceries, daily staples, organic pulses, spices, pantry essentials, and farm-fresh consumables with guaranteed purity and rapid doorstep delivery across Tiruppur and surrounding regions.',
    features: [
      'Omnichannel supermarkets and digital ordering portal (gksmart.in)',
      'Direct farm-to-kitchen sourcing for authentic taste and maximum freshness',
      'Extensive assortment: daily dairy, grains, pulses, spices, and household essentials',
      'Hyperlocal express delivery with transparent billing and batch traceability',
      'Neighborhood store presence with warm hospitality and value combo offers'
    ],
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=900&auto=format&fit=crop&q=80',
    categories: ['Daily Groceries', 'Farm Produce', 'Organic Grains & Pulses', 'Spices & Masalas', 'Household FMCG'],
    ctaLabel: 'Explore GKS Mart',
    ctaUrl: '/gks-mart'
  },
  {
    id: 'sabari-gks',
    name: 'Sabari GKS',
    tagline: 'Flagship Vedic Bilona Ghee & Wood-Pressed Oils',
    domain: 'sabarikrishnaconsumables.com',
    url: '/category/ghee',
    badge: 'Manufacturing & Brand',
    description: 'Our signature food processing and manufacturing division. Renowned across South India for authentic A2 Vedic Bilona Cow Ghee, pure Buffalo Ghee, and unrefined wood-pressed edible oils extracted on traditional Marachekku wooden expellers below 45°C to preserve vital nutrients.',
    features: [
      '100% Traditional Vedic Bilona method: curd churning, never industrial cream separation',
      'Cold-pressed Marachekku oils (Groundnut, Gingelly, Virgin Coconut) with zero chemical refining',
      'Agmark Grade-A compliance with rigorous in-house NABL certified lab quality checks',
      'Aroma-sealed food-grade glass jars, leak-proof PET, and industrial bulk tins'
    ],
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=900&auto=format&fit=crop&q=80',
    categories: ['Pure Cow Ghee', 'Buffalo Ghee', 'Cold-Pressed Oils', 'Raw Forest Honey'],
    ctaLabel: 'View Sabari GKS Range',
    ctaUrl: '/products'
  },
  {
    id: 'skcipl-b2b',
    name: 'SKCIPL Institutional & Wholesale',
    tagline: 'Bulk Supply for Sweets, Bakeries, HoReCa & Retailers',
    domain: 'skcipl.co.in',
    url: '/b2b',
    badge: 'B2B & Institutional',
    description: 'A dedicated bulk supply wing powering South India’s premier sweet manufacturers, commercial bakeries, temple trusts, cloud kitchens, and 5-star hotel catering chains with consistent bulk shipments of certified pure ghee and high-smoke-point wood-pressed cooking oils.',
    features: [
      'Supply in 5-Litre cans, 15-Litre tins, and 200-Litre food-grade food barrels',
      'Dedicated supply chain with guaranteed batch-level certificates of analysis (CoA)',
      'Tailored GST compliant invoicing, contract pricing, and credit terms for partners',
      'Scheduled recurring logistics across Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh'
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80',
    categories: ['Sweet Manufacturers', 'HoReCa Sector', 'Wholesale Distributors', 'Temple Devasthanams'],
    ctaLabel: 'Wholesale Inquiries',
    ctaUrl: '/b2b'
  },
  {
    id: 'skcipl-exports',
    name: 'SKCIPL Global Exports',
    tagline: 'Traditional Indian Purity for International Markets',
    domain: 'skcipl.co.in/exports',
    url: '/contact',
    badge: 'International Trade',
    description: 'Bringing the rich culinary heritage of Kongu Nadu and traditional Indian dairy craftsmanship to diaspora communities and gourmet markets globally, meeting strict international export standards and phytosanitary protocols.',
    features: [
      'Export-grade tamper-evident packaging engineered for extended international shelf life',
      'Compliant with APEDA, FSSAI Export Regulations, and destination country food standards',
      'Private labeling and customized packaging solutions for global retail distributors',
      'Temperature-controlled container shipping through major ports (Tuticorin & Chennai)'
    ],
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
    categories: ['Middle East / GCC', 'Southeast Asia', 'North America', 'Europe'],
    ctaLabel: 'Export Partnerships',
    ctaUrl: '/contact'
  }
];

CORPORATE_INFO.platforms = COMPANY_PLATFORMS;

export const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Pure Ghee', slug: 'ghee', is_active: true, display_order: 1, requires_fssai_display: true },
  { id: '2', name: 'Cold-Pressed Oils', slug: 'oils', is_active: true, display_order: 2, requires_fssai_display: true },
  { id: '3', name: 'GKS Mart Groceries', slug: 'groceries', is_active: true, display_order: 3, requires_fssai_display: true },
  { id: '4', name: 'Honey & Essentials', slug: 'honey-essentials', is_active: true, display_order: 4, requires_fssai_display: true },
];

export const FALLBACK_COMPANY_SETTINGS: CompanySettings = {
  id: 'skcipl-settings',
  fssai_license_number: '12423018000000',
  fssai_valid_until: '2029-08-28',
  cin: 'U15400TZ2022PTC038484',
  gst_number: '33AACCS1242E1Z1',
};

export interface StaticProductItem {
  id: string;
  name: string;
  brand: 'Sabari GKS' | 'GKS Mart';
  slug: string;
  category_id: string;
  category_name: string;
  description: string;
  benefits: string[];
  pack_sizes: string[];
  price: number;
  mrp: number;
  stock_quantity: number;
  batch_number: string;
  expiry_date: string;
  sku: string;
  images: string[];
  is_active: boolean;
  bestseller?: boolean;
  fssai_certified: boolean;
  nutritional_facts: { label: string; value: string }[];
}

export const STATIC_PRODUCTS: StaticProductItem[] = [
  {
    id: 'prod-1',
    name: 'Sabari GKS Pure Desi Cow Ghee (A2 Vedic Bilona)',
    brand: 'Sabari GKS',
    slug: 'pure-desi-cow-ghee',
    category_id: '1',
    category_name: 'Pure Ghee',
    description: 'Crafted using the revered Vedic Bilona tradition. Fresh A2 milk from indigenous free-grazing desi cows is boiled, set into thick curd, and hand-churned with a wooden bilona to separate cultured makkhan, which is gently clarified over slow flame. Rich in golden granular texture (daanedar), authentic village aroma, and fat-soluble vitamins A, D, E, and K.',
    benefits: [
      'Made from whole A2 curd, never raw cream separation',
      'Enhances Agni (digestive fire) and supports cellular rejuvenation',
      'Naturally rich in CLA (Conjugated Linoleic Acid) and Butyric acid',
      'High smoke point (250°C) making it ideal for pure cooking and traditional sweets'
    ],
    pack_sizes: ['100 ml', '200 ml', '500 ml Glass Jar', '1 Litre Pet Bottle', '5 Litre Tin', '15 Litre Bulk Tin'],
    price: 650,
    mrp: 750,
    stock_quantity: 120,
    batch_number: 'SGKS-GH-2026-08',
    expiry_date: '2027-08-31',
    sku: 'SGKS-GHEE-500ML',
    images: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: true,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '897 kcal / 100g' },
      { label: 'Milk Fat', value: '99.7%' },
      { label: 'Saturated Fatty Acids', value: '62g' },
      { label: 'Monounsaturated', value: '26g' },
      { label: 'Omega-3 Fatty Acids', value: '1.2g' },
      { label: 'Added Preservatives', value: '0.0%' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Sabari GKS Wood-Pressed Groundnut Oil (Marachekku Kadalai Ennai)',
    brand: 'Sabari GKS',
    slug: 'cold-pressed-groundnut-oil',
    category_id: '2',
    category_name: 'Cold-Pressed Oils',
    description: 'Cold-pressed at room temperature in traditional Vaagai (wooden) chekku churners using farm-sourced premium sun-dried groundnuts. Free from heat treatment, chemicals, and refining agents. Retains natural nutty fragrance, plant phytosterols, and natural vitamin E.',
    benefits: [
      'Wood-pressed below 45°C to preserve fragile antioxidants',
      'Unrefined, unbleached, and completely hexane-free',
      'Rich in monounsaturated fats (MUFA) for a healthy heart',
      'High thermal stability suitable for everyday Indian curries, tadkas, and frying'
    ],
    pack_sizes: ['500 ml Bottle', '1 Litre Bottle', '5 Litre Can', '15 Litre Tin'],
    price: 340,
    mrp: 390,
    stock_quantity: 85,
    batch_number: 'SGKS-GN-2026-03',
    expiry_date: '2027-03-31',
    sku: 'SGKS-OIL-GN-1L',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: true,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '884 kcal / 100g' },
      { label: 'Total Fats', value: '100g' },
      { label: 'MUFA', value: '48g' },
      { label: 'PUFA', value: '32g' },
      { label: 'Trans Fat', value: '0g' },
      { label: 'Vitamin E', value: '15.7 mg' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Sabari GKS Extra Virgin Coconut Oil (Wood-Pressed Thengai Ennai)',
    brand: 'Sabari GKS',
    slug: 'virgin-coconut-oil',
    category_id: '2',
    category_name: 'Cold-Pressed Oils',
    description: 'Extracted from mature, sulfur-free sun-dried coconut copra harvested from lush groves in Pollachi and Tiruppur. Wood-pressed gently to preserve the pristine aroma, lauric acid, and natural moisture.',
    benefits: [
      'Rich in Lauric Acid (Medium Chain Triglycerides - MCTs)',
      'Boosts natural metabolism, immunity, and gut balance',
      'Multi-purpose: Ideal for coastal cuisine, hair nourishment, and baby skin massage',
      'Zero mineral oil, artificial scents, or chemical bleaches'
    ],
    pack_sizes: ['250 ml Bottle', '500 ml Bottle', '1 Litre Bottle', '5 Litre Can'],
    price: 280,
    mrp: 320,
    stock_quantity: 90,
    batch_number: 'SGKS-CO-2026-05',
    expiry_date: '2027-05-31',
    sku: 'SGKS-OIL-VCO-500ML',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: true,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '890 kcal / 100g' },
      { label: 'Lauric Acid', value: '51.4%' },
      { label: 'MCTs', value: '64%' },
      { label: 'Cholesterol', value: '0 mg' },
      { label: 'Chemical Additives', value: 'Nil' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Sabari GKS Pure Buffalo Ghee (Cultured Traditional Butter Churned)',
    brand: 'Sabari GKS',
    slug: 'pure-buffalo-ghee',
    category_id: '1',
    category_name: 'Pure Ghee',
    description: 'Pure, snowy-white cultured buffalo ghee hand-prepared from grass-fed Murrah buffalo milk. Known for its distinct creamy aroma, rich texture, and elevated smoking temperature, making it the supreme choice for authentic South Indian Halwas, Mysore Pak, and celebratory delicacies.',
    benefits: [
      'Wholesome cultured butter churning gives classic snow-white grains',
      'Favored by master sweet confectioners for luscious texture and long preservation',
      'Rich source of healthy fats promoting stamina and nourishment',
      'Zero hydrogenated vegetable fats (vanaspati) or animal body fats'
    ],
    pack_sizes: ['200 ml', '500 ml Glass Jar', '1 Litre Bottle', '15 Litre Bulk Tin'],
    price: 580,
    mrp: 650,
    stock_quantity: 65,
    batch_number: 'SGKS-BG-2026-02',
    expiry_date: '2027-07-31',
    sku: 'SGKS-GHEE-BUF-500ML',
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: false,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '900 kcal / 100g' },
      { label: 'Fat Content', value: '99.8%' },
      { label: 'Moisture', value: 'Max 0.2%' },
      { label: 'FFA (Free Fatty Acids)', value: '< 0.4%' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Sabari GKS Cold-Pressed Sesame / Gingelly Oil (Chekku Nallennai)',
    brand: 'Sabari GKS',
    slug: 'cold-pressed-sesame-oil',
    category_id: '2',
    category_name: 'Cold-Pressed Oils',
    description: 'Prepared by slowly grinding premier black sesame seeds with authentic country palm jaggery (Karupatti) in traditional wooden chekku. Palm jaggery neutralizes natural seed bitterness and delivers the legendary authentic taste and cooling properties treasured in Tamil traditions.',
    benefits: [
      'Traditional combination with pure palm jaggery',
      'Packed with Sesamol and Sesamolin antioxidants',
      'Celebrated in Siddha and Ayurveda for oil pulling, bone strength, and body balance',
      'Essential for authentic Idli Podi, Kuzhambu, and traditional temple offerings'
    ],
    pack_sizes: ['500 ml Bottle', '1 Litre Bottle', '5 Litre Can'],
    price: 360,
    mrp: 410,
    stock_quantity: 50,
    batch_number: 'SGKS-SES-2026-04',
    expiry_date: '2027-04-15',
    sku: 'SGKS-OIL-SES-1L',
    images: [
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: false,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '884 kcal / 100g' },
      { label: 'Polyunsaturated Fats', value: '41g' },
      { label: 'Monounsaturated Fats', value: '40g' },
      { label: 'Calcium & Zinc traces', value: 'Present' }
    ]
  },
  {
    id: 'prod-6',
    name: 'GKS Mart Organic Raw Wild Forest Honey',
    brand: 'GKS Mart',
    slug: 'raw-wild-forest-honey',
    category_id: '4',
    category_name: 'Honey & Essentials',
    description: 'Sourced responsibly by tribal honey hunters from pristine Western Ghats forest biomes. Unheated, micro-filtered to retain live enzymes, wild bee pollen, and diverse botanical phytonutrients. 100% free from corn syrup, rice syrup, or sugar syrup adulteration.',
    benefits: [
      'Unpasteurized raw wild honey with active natural bio-enzymes',
      'Natural immune enhancer, cough suppressant, and daily wellness tonic',
      'Rich multi-floral amber color and complex herbal nectar undertones',
      'Tested under stringent NMR and C4 carbon isotope standards'
    ],
    pack_sizes: ['250g Glass Jar', '500g Glass Jar', '1 kg Family Pack'],
    price: 420,
    mrp: 480,
    stock_quantity: 75,
    batch_number: 'GKSM-HNY-2026-01',
    expiry_date: '2028-09-30',
    sku: 'GKSM-GROC-HNY-500G',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: true,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '304 kcal / 100g' },
      { label: 'Natural Carbohydrates', value: '82g' },
      { label: 'Natural Fructose', value: '38%' },
      { label: 'Natural Glucose', value: '31%' },
      { label: 'Added Invert Sugars', value: '0%' }
    ]
  },
  {
    id: 'prod-7',
    name: 'GKS Mart Heritage Traditional Rice - Seeraga Samba & Ponni',
    brand: 'GKS Mart',
    slug: 'gks-mart-heritage-rice',
    category_id: '3',
    category_name: 'GKS Mart Groceries',
    description: 'Cleaned, de-stoned, and aged grain harvested from delta farmers. Seeraga Samba is celebrated for its exquisite tiny grains and heavenly aroma, the undisputed soul of authentic Tamil Biryani, while aged Ponni delivers fluffy, soft daily meals.',
    benefits: [
      'Aged naturally for over 12 months for fluffiness and non-sticky cooking',
      'Zero chemical polishing or artificial coloring agents',
      'High digestive tolerance and wholesome natural fiber',
      'Direct farm packaging ensuring zero moisture spoilage'
    ],
    pack_sizes: ['1 kg Pack', '5 kg Cotton Bag', '25 kg Institutional Sack'],
    price: 180,
    mrp: 210,
    stock_quantity: 110,
    batch_number: 'GKSM-RC-2026-07',
    expiry_date: '2027-12-31',
    sku: 'GKSM-RICE-SS-1KG',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: true,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '350 kcal / 100g' },
      { label: 'Protein', value: '7.8g' },
      { label: 'Carbohydrates', value: '77g' },
      { label: 'Dietary Fiber', value: '2.8g' }
    ]
  },
  {
    id: 'prod-8',
    name: 'GKS Mart Unpolished Native Pulses & Dal (Toor, Urad, Moong)',
    brand: 'GKS Mart',
    slug: 'gks-mart-unpolished-pulses',
    category_id: '3',
    category_name: 'GKS Mart Groceries',
    description: 'Cleaned and unpolished lentils procured directly from regional farm cooperatives. Without water, oil, or leather polishing, ensuring you receive the natural protein layer, vibrant authentic yellow color, and fast cooking tenderness.',
    benefits: [
      '100% unpolished: No chemical polish or synthetic glaze',
      'Rich plant protein essential for daily South Indian sambar and rasam',
      'Hygienically triple-cleaned with laser sorters to eliminate impurities',
      'Superior taste and aromatic froth during traditional pressure cooking'
    ],
    pack_sizes: ['500g Pouch', '1 kg Pouch', '5 kg Saver Pack'],
    price: 175,
    mrp: 200,
    stock_quantity: 95,
    batch_number: 'GKSM-PUL-2026-03',
    expiry_date: '2027-09-30',
    sku: 'GKSM-DAL-TOOR-1KG',
    images: [
      'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: false,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Energy', value: '343 kcal / 100g' },
      { label: 'Protein', value: '22.3g' },
      { label: 'Dietary Fiber', value: '15g' },
      { label: 'Iron', value: '5.2 mg' }
    ]
  },
  {
    id: 'prod-9',
    name: 'GKS Mart Hand-Pounded Organic Turmeric Powder (Erode Salem Variety)',
    brand: 'GKS Mart',
    slug: 'organic-turmeric-powder',
    category_id: '3',
    category_name: 'GKS Mart Groceries',
    description: 'Harvested from fertile soils along the Bhavani river belt. Sun-dried whole fingers slow-crushed to preserve maximum Curcumin potency (>3.8%). Natural deep golden hue and earthy fragrance without lead chromate, chalk, or foreign starch.',
    benefits: [
      'High natural Curcumin content verified by lab assay',
      'Potent anti-inflammatory and natural antioxidant spice',
      'Purity guaranteed: Zero artificial dyes or sawdust adulteration',
      'Essential for auspicious cooking, herbal decoctions, and golden milk'
    ],
    pack_sizes: ['100g Pack', '250g Jar', '500g Jar', '1 kg Bulk Pouch'],
    price: 95,
    mrp: 120,
    stock_quantity: 140,
    batch_number: 'GKSM-TRM-2026-01',
    expiry_date: '2027-11-30',
    sku: 'GKSM-SPICE-TURM-250G',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: false,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Curcumin Content', value: '> 3.8%' },
      { label: 'Total Ash', value: '< 6.5%' },
      { label: 'Heavy Metals', value: 'Below Detectable Limit' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Sabari GKS Sacred Temple & Pooja Pure Ghee (Special Batch)',
    brand: 'Sabari GKS',
    slug: 'temple-pooja-pure-ghee',
    category_id: '1',
    category_name: 'Pure Ghee',
    description: 'Specially churned and consecrated batches prepared in strict adherence to agamic purity norms for sacred havan, deepam (oil lamp illumination), and temple offerings. Pure, smoke-free flame with long-burning duration and uplifting natural fragrance.',
    benefits: [
      'Churned under pristine, devotional hygienic conditions',
      'Sattvic energy for daily home pooja, temple abhishekham, and yagnas',
      'Creates auspicious aroma and clean burning without soot',
      'Trusted by major temples and mutts across South India'
    ],
    pack_sizes: ['500 ml Bottle', '1 Litre Can', '5 Litre Can', '15 Litre Tin'],
    price: 490,
    mrp: 550,
    stock_quantity: 80,
    batch_number: 'SGKS-TP-2026-09',
    expiry_date: '2027-10-31',
    sku: 'SGKS-GHEE-POOJA-1L',
    images: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80'
    ],
    is_active: true,
    bestseller: false,
    fssai_certified: true,
    nutritional_facts: [
      { label: 'Purity Level', value: '100% Natural Dairy Fat' },
      { label: 'Soot Level', value: 'Zero Soot Burn' },
      { label: 'Synthetic Fragrance', value: '0%' }
    ]
  }
];

export const FALLBACK_PRODUCTS = STATIC_PRODUCTS;

// Static Helper Functions (No Database Required!)
export async function fetchCategories(): Promise<Category[]> {
  return FALLBACK_CATEGORIES;
}

export async function fetchCompanySettings(): Promise<CompanySettings> {
  return FALLBACK_COMPANY_SETTINGS;
}

export async function fetchAllProducts(): Promise<StaticProductItem[]> {
  return STATIC_PRODUCTS;
}

export async function fetchProductBySlug(slug: string): Promise<StaticProductItem | undefined> {
  return STATIC_PRODUCTS.find(p => p.slug === slug);
}

export async function fetchProductsByCategory(categorySlug: string): Promise<StaticProductItem[]> {
  const category = FALLBACK_CATEGORIES.find(c => c.slug === categorySlug);
  if (!category) return [];
  return STATIC_PRODUCTS.filter(p => p.category_id === category.id || p.category_name.toLowerCase().includes(category.name.toLowerCase()));
}

export async function fetchRecommendedProducts(categoryId?: string | null, excludeId?: string) {
  return STATIC_PRODUCTS
    .filter(p => (!categoryId || p.category_id === categoryId) && (!excludeId || p.id !== excludeId))
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      mrp: p.mrp,
      images: p.images,
      categories: { name: p.category_name }
    }));
}

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

export async function fetchActiveBanners(): Promise<PromotionalBanner[]> {
  return [
    {
      id: 'banner-gksmart',
      title: 'Introducing GKS Mart (gksmart.in)',
      subtitle: 'Your neighborhood grocery and consumables supermarket. Pure food delivered directly to your doorstep.',
      image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80',
      link_url: '/gks-mart',
      discount_percent: null,
      starts_at: '2026-01-01',
      ends_at: '2027-12-31',
      is_active: true,
      display_order: 1
    },
    {
      id: 'banner-bilona-ghee',
      title: 'Sabari GKS A2 Vedic Bilona Ghee',
      subtitle: 'Pure cultured butter hand-churned using traditional wooden bilona. FSSAI & Agmark Grade-A certified.',
      image_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1200&auto=format&fit=crop&q=80',
      link_url: '/product/pure-desi-cow-ghee',
      discount_percent: 15,
      starts_at: '2026-01-01',
      ends_at: '2027-12-31',
      is_active: true,
      display_order: 2
    }
  ];
}

// Static admin helpers for headless compatibility
export interface AdminProduct extends StaticProductItem {
  cost_price?: number;
  low_stock_threshold?: number;
  categories?: { name: string; requires_fssai_display?: boolean };
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  return STATIC_PRODUCTS.map((p) => ({
    ...p,
    cost_price: Math.round(p.price * 0.7),
    low_stock_threshold: 10,
    categories: { name: p.category_name, requires_fssai_display: true }
  }));
}

export async function addProduct(productData: Record<string, unknown>) {
  return { success: true, id: `prod-${Date.now()}`, ...productData };
}

export async function updateProduct(id: string, updates: Record<string, unknown>) {
  return { success: true, id, ...updates };
}

export async function deleteProduct(id: string) {
  return { success: true, id };
}

export async function bulkUpdateProductStatus(ids: string[], isActive: boolean) {
  return { success: true, count: ids.length, isActive };
}

export async function addCategory(categoryData: Record<string, unknown>) {
  return { success: true, id: `cat-${Date.now()}`, ...categoryData };
}

export async function updateCategory(id: string, updates: Record<string, unknown>) {
  return { success: true, id, ...updates };
}

export async function deleteCategory(id: string) {
  return { success: true, id };
}

export async function reorderCategories(updates: Array<{ id: string; display_order: number }> | string[]) {
  return { success: true, updates };
}

