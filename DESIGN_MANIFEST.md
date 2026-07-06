# DESIGN MANIFEST

This design manifest document provides a comprehensive mapping of all design mockups and UI screens exported from Google Stitch for the **Sabari Krishna Consumables India Private Limited** e-commerce store. It details each flow page layout, frame size, and documents the unified visual design system rules extracted from the mockups. This file acts as the primary layout inventory and is structured to directly map to the frontend Tailwind theme configuration.

---

## 1. Directory Inventory

This section lists the original mockup directories from the Stitch export, classifying each frame by page flow, device viewport size, and detailing their visual layouts.

| Mockup Folder / Filename | Flow / Page Category | Frame Size | Layout Description |
| :--- | :--- | :--- | :--- |
| [`sabari_krishna_404_error_desktop`](./design-reference/sabari_krishna_404_error_desktop/screen.png) | **Error Page (404)** | `Desktop` | Custom error page with a Clean aesthetic. Features a large warning/error illustration, text warning indicating 'Goodness Missing', a search input field to guide lost users, a button redirecting back to home, and a brief footer link section. |
| [`sabari_krishna_account_dashboard_desktop`](./design-reference/sabari_krishna_account_dashboard_desktop/screen.png) | **Account / Order History** | `Desktop` | User profile administration dashboard. Features account sidebar links (Orders, Addresses, Wishlist, Profile, Loyalty, Logout), user metadata summary showing loyalty points, and a grid showing recent orders with tracking links or saved shipping addresses with edit triggers. |
| [`sabari_krishna_account_dashboard_mobile`](./design-reference/sabari_krishna_account_dashboard_mobile/screen.png) | **Account / Order History** | `Mobile` | User profile administration dashboard. Features account sidebar links (Orders, Addresses, Wishlist, Profile, Loyalty, Logout), user metadata summary showing loyalty points, and a grid showing recent orders with tracking links or saved shipping addresses with edit triggers. |
| [`sabari_krishna_addresses_wishlist_desktop`](./design-reference/sabari_krishna_addresses_wishlist_desktop/screen.png) | **Account / Addresses & Wishlist** | `Desktop` | User profile administration dashboard. Features account sidebar links (Orders, Addresses, Wishlist, Profile, Loyalty, Logout), user metadata summary showing loyalty points, and a grid showing recent orders with tracking links or saved shipping addresses with edit triggers. |
| [`sabari_krishna_admin_dashboard_desktop`](./design-reference/sabari_krishna_admin_dashboard_desktop/screen.png) | **Admin Panel / Dashboard** | `Desktop` | Administrative console dashboard with a multi-item left sidebar navigation panel, top search bar, KPI summary cards (Sales, Pending Orders, Low Stock Alerts, New Customers) showing sparkline charts, and a dual-column dashboard showing a sales trend bar chart and critical low stock alerts. Features a bottom section for top-selling products, recent activity logs, and a recent orders status table. |
| [`sabari_krishna_admin_dashboard_mobile`](./design-reference/sabari_krishna_admin_dashboard_mobile/screen.png) | **Admin Panel / Dashboard** | `Mobile` | Administrative console dashboard with a multi-item sidebar, top search bar, KPI summary cards (Sales, Pending Orders, Low Stock Alerts, New Customers) showing sparkline charts, and a dual-column dashboard showing a sales trend bar chart and critical low stock alerts. Features a bottom section for top-selling products, recent activity logs, and a recent orders status table. |
| [`sabari_krishna_admin_marketplace_sync_desktop`](./design-reference/sabari_krishna_admin_marketplace_sync_desktop/screen.png) | **Admin Panel / Marketplace Sync** | `Desktop` | Admin operations layout for linking multi-channel marketplaces. Features channel status widgets for Amazon, Flipkart, ONDC, Meesho, and Blinkit, displaying active sync switches, order numbers, and latency rates. Includes a synchronization log table showing status, timestamp, and payload metadata. |
| [`sabari_krishna_admin_order_management_desktop`](./design-reference/sabari_krishna_admin_order_management_desktop/screen.png) | **Admin Panel / Order Management** | `Desktop` | Order processing grid showing detailed order transactions, client details, payment statuses, and fulfillment actions. Features custom filter tabs (All, Pending, Processing, Shipped, Delivered, Cancelled) and order timeline tracking detailing shipping partner info and shipping updates. |
| [`sabari_krishna_admin_order_management_mobile`](./design-reference/sabari_krishna_admin_order_management_mobile/screen.png) | **Admin Panel / Order Management** | `Mobile` | Order processing grid showing detailed order transactions, client details, payment statuses, and fulfillment actions. Features custom filter tabs (All, Pending, Processing, Shipped, Delivered, Cancelled) and order timeline tracking detailing shipping partner info and shipping updates. |
| [`sabari_krishna_admin_products_inventory_desktop`](./design-reference/sabari_krishna_admin_products_inventory_desktop/screen.png) | **Admin Panel / Products & Inventory** | `Desktop` | Inventory control dashboard displaying current product catalogs, pricing, stock levels, and distribution channels. Features quick search, category filtering (Dairy, Spices, Grains, etc.), stock alerts (Low Stock, Out of Stock), bulk upload action buttons, and detailed product table rows with edit actions. |
| [`sabari_krishna_ai_chatbot_desktop`](./design-reference/sabari_krishna_ai_chatbot_desktop/screen.png) | **Chatbot Widget** | `Desktop` | Interactive chatbot widget layout. Superimposed over a user account dashboard, it displays an overlay interface simulating an AI assistant dialog. Supports quick-reply prompts, text inputs, and customer order context lookup. |
| [`sabari_krishna_authentication_desktop`](./design-reference/sabari_krishna_authentication_desktop/screen.png) | **Login / Signup** | `Desktop` | Authentication screen showing login options. Desktop split-pane layout displays a beautiful brand image on the left promoting natural ghee quality, and a credentials input form on the right supporting both Email/Password login and OTP verification. |
| [`sabari_krishna_authentication_mobile`](./design-reference/sabari_krishna_authentication_mobile/screen.png) | **Login / Signup** | `Mobile` | Authentication screen showing login options. Mobile layout displays OTP entry or social sign-in (Google/Apple) in a sleek full-screen view. |
| [`sabari_krishna_category_listing_desktop`](./design-reference/sabari_krishna_category_listing_desktop/screen.png) | **Category Listing** | `Desktop` | Catalog browsing page. Desktop features a multi-column layout with a left filter sidebar (price slider, brand selectors, rating filters, size checkboxes) and a right responsive grid displaying product cards with image hover scaling, ratings, and primary/secondary action triggers. |
| [`sabari_krishna_category_listing_mobile`](./design-reference/sabari_krishna_category_listing_mobile/screen.png) | **Category Listing** | `Mobile` | Catalog browsing page. Mobile view lists items in a fluid single or double column scroll with sticky top search and bottom sort/filter bar. |
| [`sabari_krishna_checkout_desktop`](./design-reference/sabari_krishna_checkout_desktop/screen.png) | **Cart / Checkout** | `Desktop` | A multi-step checkout funnel. Displays steps sequentially: Delivery Address Selection, Delivery Slot scheduling, Payment Method choices (UPI, Card, COD), and Order Review. The right side features a sticky Order Summary showing item subtotals, coupon deductions, taxes, and final grand totals. |
| [`sabari_krishna_checkout_mobile`](./design-reference/sabari_krishna_checkout_mobile/screen.png) | **Cart / Checkout** | `Mobile` | A multi-step checkout funnel. Displays steps sequentially: Delivery Address Selection, Delivery Slot scheduling, Payment Method choices (UPI, Card, COD), and Order Review. The right side features a sticky Order Summary showing item subtotals, coupon deductions, taxes, and final grand totals. |
| [`sabari_krishna_order_success_desktop`](./design-reference/sabari_krishna_order_success_desktop/screen.png) | **Order Confirmation** | `Desktop` | Post-purchase conversion page confirming transaction success. Features a green check badge, estimated delivery timer, invoice download trigger, shipping destination details, payment methods, and receipt summary. |
| [`sabari_krishna_order_success_mobile`](./design-reference/sabari_krishna_order_success_mobile/screen.png) | **Order Confirmation** | `Mobile` | Post-purchase conversion page confirming transaction success. Features a green check badge, estimated delivery timer, invoice download trigger, shipping destination details, payment methods, and receipt summary. |
| [`sabari_krishna_order_tracking_desktop`](./design-reference/sabari_krishna_order_tracking_desktop/screen.png) | **Account / Order Tracking** | `Desktop` | Delivery tracing interface showing order timelines. Features progress trackers (Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered) detailing shipping agency info (e.g. BlueDart), package items breakdown, and customer service helper shortcuts. |
| [`sabari_krishna_order_tracking_mobile`](./design-reference/sabari_krishna_order_tracking_mobile/screen.png) | **Account / Order Tracking** | `Mobile` | Delivery tracing interface showing order timelines. Features progress trackers (Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered) detailing shipping agency info (e.g. BlueDart), package items breakdown, and customer service helper shortcuts. |
| [`sabari_krishna_premium_storefront_desktop`](./design-reference/sabari_krishna_premium_storefront_desktop/screen.png) | **Homepage / Storefront** | `Desktop` | Premium homepage layout featuring a sticky blurred transparent glass header, a dynamic hero carousel promoting ghee and cold-pressed oils, a circular category quick-links section, and a best-sellers grid showing product cards with hover animations. Includes a brand trust section ("Our Heritage"), customer reviews carousel, and an organic styled email newsletter footer. |
| [`sabari_krishna_premium_storefront_mobile`](./design-reference/sabari_krishna_premium_storefront_mobile/screen.png) | **Homepage / Storefront** | `Mobile` | Premium homepage layout featuring a sticky blurred transparent glass header, a dynamic hero carousel promoting ghee and cold-pressed oils, a circular category quick-links section, and a best-sellers grid showing product cards with hover animations. Includes a brand trust section ("Our Heritage"), customer reviews carousel, and an organic styled email newsletter footer. |
| [`sabari_krishna_product_detail_desktop`](./design-reference/sabari_krishna_product_detail_desktop/screen.png) | **Product Detail** | `Desktop` | Rich product detail view. Features a high-resolution image gallery (with discount stickers), product options selector (size/pack variants), primary call-to-actions ("ADD TO CART" & "BUY NOW"), delivery pincode checker, nutritional information accordion, a frequently bought together pack bundle widget, and a related products carousel. |
| [`sabari_krishna_product_detail_mobile`](./design-reference/sabari_krishna_product_detail_mobile/screen.png) | **Product Detail** | `Mobile` | Rich product detail view. Features a high-resolution image gallery (with discount stickers), product options selector (size/pack variants), primary call-to-actions ("ADD TO CART" & "BUY NOW"), delivery pincode checker, nutritional information accordion, a frequently bought together pack bundle widget, and a related products carousel. |
| [`sabari_krishna_search_results_desktop`](./design-reference/sabari_krishna_search_results_desktop/screen.png) | **Search Results** | `Desktop` | Standard page mockup containing brand header, main content containers, and standard footer. Headings present: Showing 24 results for "Pure Ghee", Pure Desi Cow Ghee - Hand-Churned Bilona Method, Organic Pure Buffalo Ghee - Grass-Fed &amp; Non-GMO |
| [`sabari_krishna_search_results_mobile`](./design-reference/sabari_krishna_search_results_mobile/screen.png) | **Search Results** | `Mobile` | Standard page mockup containing brand header, main content containers, and standard footer. Headings present: Sabari Krishna, 'Oils' (12 items), Virgin Coconut Oil |
| [`sabari_krishna_shopping_cart_desktop`](./design-reference/sabari_krishna_shopping_cart_desktop/screen.png) | **Shopping Cart** | `Desktop` | Cart details manager. Displays a list of items currently added, supporting quantity adjustments, item removal, and add-to-wishlist triggers. Includes a dedicated "Add these too" upsell cross-promotion strip, and a complete checkout breakdown displaying order totals and coupon code discount options. |
| [`sabari_krishna_shopping_cart_mobile`](./design-reference/sabari_krishna_shopping_cart_mobile/screen.png) | **Shopping Cart** | `Mobile` | Cart details manager. Displays a list of items currently added, supporting quantity adjustments, item removal, and add-to-wishlist triggers. Includes a dedicated "Add these too" upsell cross-promotion strip, and a complete checkout breakdown displaying order totals and coupon code discount options. |
| [`sabari_krishna_wishlist_mobile`](./design-reference/sabari_krishna_wishlist_mobile/screen.png) | **Account / Wishlist** | `Mobile` | User profile administration dashboard. Features account sidebar links (Orders, Addresses, Wishlist, Profile, Loyalty, Logout), user metadata summary showing loyalty points, and a grid showing recent orders with tracking links or saved shipping addresses with edit triggers. |
| `image_from_...500_ml` | **Legacy Assets** | `Image` | Legacy product photo of Sabari GKS 500ml Ghee Bottle. |
| `image_from_...1_ltr_1` | **Legacy Assets** | `Image` | Legacy product photo of Sabari GKS 1 Litre Ghee Bottle. |
| `image_from_...cow_1` | **Legacy Assets** | `Image` | Legacy source image featuring dairy cows on a pasture. |
| `image_from_...cow_2` | **Legacy Assets** | `Image` | Second legacy source image featuring cows on a pasture. |
| `image_from_...cows` | **Legacy Assets** | `Image` | Legacy photo of cows in a dairy farming setting. |
| `image_from_...cropped` | **Legacy Assets** | `Image` | Legacy cropped image asset from the previous website. |
| `image_from_...img` | **Legacy Assets** | `Image` | Legacy image asset from the website media directory. |
| `image_from_...2` | **Legacy Assets** | `Image` | Legacy ghee tin packaging detail image. |
| `image_from_...3_1` | **Legacy Assets** | `Image` | Legacy ghee bottle and tin product line banner. |
| `image_from_...1_1` | **Legacy Assets** | `Image` | Legacy product lineup image. |

---

## 2. Extracted Design System (Tailwind CSS Theme Configuration)

The design system follows the **"Premium Vitality"** brand guidelines. It is centered around health, hygiene, and modern commerce. The following design tokens have been compiled from the mockups' Tailwind configurations and are ready to be integrated directly into the `tailwind.config.js` file:

### 2.1 Color Tokens

The palette employs a **Warm Neutral Base** to ensure a premium, organic look while avoiding clean, sterile, clinical white backgrounds.

| Tailwind Token | Hex Code | Brand Classification / Usage |
| :--- | :--- | :--- |
| `surface` / `background` | `#FDF9F0` / `#f9f9fc` | Main canvas background. Evokes milk purity and natural grains. |
| `primary` | `#835500` | Golden Amber. Used for brand titles, primary actions, and sticky headers. |
| `primary-container` | `#f5a623` | Warm Gold. Accent background, promotional sections, and active selectors. |
| `on-primary` | `#ffffff` | Text color on primary highlights. |
| `on-primary-container` | `#644000` | Deep gold text for alerts or containers. |
| `secondary` | `#006e2f` | Trust Green (Emerald). Highlights organic certifications, stock statuses, and checkout. |
| `secondary-container` | `#91f9a2` | Light green background pill. Highlights active buttons or selection chips. |
| `on-secondary-container` | `#007432` | High-contrast green text for stock badges. |
| `on-surface` / `on-background` | `#1a1c1e` | Deep Charcoal. Primary body typography. Avoids harsh black. |
| `on-surface-variant` | `#524534` | Warm Brown-Gray. Secondary descriptions, icons, and deactivated tabs. |
| `border-subtle` | `#E5E7EB` | Standard grey borders for grids, cards, and text lines. |
| `sale-red` | `#E02020` | Crimson. Exclusive sale stickers and price slashings. |
| `price-green` | `#1D8B42` | Deep emerald. Used exclusively for displaying product price figures. |
| `warm-gray` | `#636B74` | Neutral gray for utility details and footer copyrights. |

### 2.2 Typography Scale

Default typeface: **Public Sans** (Google Fonts).

| Text Style / Token | Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `display-lg` | `48px (3rem)` | `56px` | `700` (Bold) | Hero headlines, large welcome statements |
| `headline-lg` | `32px (2rem)` | `40px` | `700` (Bold) | Main page titles, main category headings |
| `headline-lg-mobile` | `24px (1.5rem)` | `32px` | `700` (Bold) | Mobile hero text, section heads |
| `title-md` | `18px (1.125rem)` | `24px` | `600` (Semibold) | Card titles, category labels |
| `price-display` | `20px (1.25rem)` | `24px` | `700` (Bold) | Product pricing layout text |
| `body-lg` | `16px (1rem)` | `24px` | `400` (Regular) | Primary paragraphs, description copy |
| `body-sm` | `14px (0.875rem)` | `20px` | `400` (Regular) | Product metadata details, subheadings |
| `label-caps` | `12px (0.75rem)` | `16px` | `700` (Bold) | Badges, overlines, buttons (uppercase) |

### 2.3 Corner Radius System

Rounded elements indicate friendly, organic design aesthetics.

- `sm`: `0.25rem` (4px) - For small badges or indicators.
- `DEFAULT` / `md`: `0.5rem` (8px) - For standard inputs, text fields, and primary buttons.
- `lg` / `xl`: `0.75rem` (12px) - Used for small sub-components or filters.
- `2xl` / `xl-large`: `16px` (1rem) - Used for product grid cards and main layout panels.
- `full`: `9999px` - Circular styling for search bars, cart count pills, and profile buttons.

### 2.4 Spacing Scale

Based on an 8px (base 4px) increments grid system.

- `stack-sm`: `8px` - Internal element layouts (e.g. title to rating spacing).
- `stack-md`: `16px` - Medium item gaps, grid columns gap on mobile view.
- `stack-lg`: `32px` - Main layout components gaps, block margins.
- `gutter`: `24px` - Layout horizontal margins for grids on desktop.
- `margin-mobile`: `16px` - Horizontal outer margins for mobile viewport edges.
- `section-gap`: `80px` - Generous vertical space between landing sections.
- `container-max`: `1280px` - Max container width for desktop layouts.

### 2.5 Depth & Elevation

- **Elevation Level 0**: Flat surface, default `#FDF9F0` body canvas.
- **Elevation Level 1**: Soft cards. White background with a 15% opacity drop shadow: `box-shadow: 0px 4px 20px rgba(26, 28, 30, 0.15)`.
- **Elevation Level 2**: Prominent blocks (popups, floating carts, sticky headers). White background with a 25% opacity drop shadow: `box-shadow: 0px 8px 30px rgba(26, 28, 30, 0.25)`.
- **Glassmorphism Layer**: Sticky navigation bars. Uses `background: rgba(255, 255, 255, 0.8)` with a backdrop blur filter: `backdrop-filter: blur(20px)`.

### 2.6 Interactive Button States

- **Primary Button (Amber)**: Gold fill (`#835500`), white text, `rounded-md` (8px). On hover, drops a slight shadow and has a brief color darkening. On active click, transitions with a scale transformation (`scale-95`).
- **Secondary Button (Green)**: Emerald Green fill (`#006e2f`), white text, `rounded-md` (8px). Used for high-conversion `ADD` triggers.
- **Ghost/Outline Button**: Transparent center, 1px solid primary outline (`#835500`), gold text color. On hover, fills with 5% primary opacity.

---

## 3. Verified Flow Mapping & Next Steps

This inventory covers the **10 core consumer journeys and panels**:
1. **Homepage/Storefront**: High-aesthetic presentation of brand quality.
2. **Category Listing**: Advanced filtering & catalog grid views.
3. **Product Detail**: Multi-pack selector, description drawer, pincode checker, & bundle builder.
4. **Shopping Cart**: Item listing, quantity modifiers, cross-sales, and billing cards.
5. **Checkout Funnel**: Step-by-step slot select, shipping options, and payment triggers.
6. **Order Success**: Order details, invoice downloads, and delivery ETA.
7. **Account / Order History**: Loyalty rewards metrics and item list reordering.
8. **Account / Order Tracking**: Detailed step-by-step courier sync (BlueDart).
9. **Admin Panel**: Multi-channel marketplace synchronization (Amazon, Flipkart, ONDC, Blinkit, Meesho), product catalog inventory manager, and live order dashboard.
10. **Authentication**: Mobile number verification and social OAuth credentials.

This manifest establishes a solid blueprint. **Once confirmed, we are ready to scaffold the Next.js 14 codebase.**
