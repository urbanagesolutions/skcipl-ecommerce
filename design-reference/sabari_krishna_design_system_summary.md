# Premium Vitality Design System Summary
## Sabari Krishna Consumables India Private Limited

### 1. Color Palette
- **Primary:** #8B5E02 (Deep Gold/Ochre) - Used for primary CTAs, active states, and brand accents.
- **Secondary:** #F5A623 (Warm Amber) - Used for secondary CTAs, highlights, and promotional banners.
- **Surface:** #FDFCF8 (Warm Off-White) - Main background color to evoke a sense of purity.
- **Surface-Container:** #F3F3F6 (Light Gray-Blue) - Used for cards, sections, and input backgrounds.
- **Semantic Colors:**
  - **Success:** #2D6A4F (Forest Green) - Badges (Delivered, Shipped, In Stock) and 'Quick Add' buttons.
  - **Error:** #B91C1C (Crimson) - 404 text, error alerts, 'Remove' actions.
  - **Warning:** #D97706 (Amber) - 'Processing' status, low stock alerts.
  - **Info:** #2563EB (Royal Blue) - Information tooltips, 'Shipped' secondary status.

### 2. Typography (Public Sans)
- **Display Large:** 3.5rem (56px) - Hero headlines.
- **Headline Large:** 2rem (32px) - Section titles.
- **Title Medium:** 1.25rem (20px) - Subheadings and card titles.
- **Body Large:** 1rem (16px) - Default body copy.
- **Label Caps:** 0.75rem (12px) - Overlines, badges, and button text.

### 3. Button States
- **Primary:** Background: Primary color, Text: White, Border-radius: 8px.
  - *Hover:* Slight darkening/opacity shift.
  - *Active:* 95% scale transform.
  - *Disabled:* 40% opacity, grayscale.
- **Secondary/Outline:** Border: 1px Solid Primary, Text: Primary color.
- **Ghost/Text:** Transparent background, Text: Primary or On-Surface-Variant.

### 4. Components & Standards
- **Corner Radius:** `ROUND_EIGHT` (8px for buttons/small cards) and `ROUND_TWELVE` to `ROUND_SIXTEEN` (12-16px for main content cards).
- **Shadows:** Soft, low-blur shadows (`shadow-sm`) for depth on surfaces; `shadow-md` for floating elements (Cart, Chatbot).
- **Spacing Scale:** Base 4px system (4, 8, 16, 24, 32, 48, 64).
- **Input Fields:** Soft gray background, 8px rounding, subtle border on focus, 16px horizontal padding.
- **Status Badges:** 4px rounding, uppercase label, semantic background-tint with dark-colored text.
