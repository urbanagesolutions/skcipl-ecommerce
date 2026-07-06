---
name: Premium Vitality System
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#524534'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#857462'
  outline-variant: '#d7c3ae'
  surface-tint: '#835500'
  primary: '#835500'
  on-primary: '#ffffff'
  primary-container: '#f5a623'
  on-primary-container: '#644000'
  inverse-primary: '#ffb955'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#91f9a2'
  on-secondary-container: '#007432'
  tertiary: '#605e58'
  on-tertiary: '#ffffff'
  tertiary-container: '#b9b6ae'
  on-tertiary-container: '#494741'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb4'
  primary-fixed-dim: '#ffb955'
  on-primary-fixed: '#291800'
  on-primary-fixed-variant: '#633f00'
  secondary-fixed: '#91f9a2'
  secondary-fixed-dim: '#75dc88'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#e6e2d9'
  tertiary-fixed-dim: '#c9c6be'
  on-tertiary-fixed: '#1c1c17'
  on-tertiary-fixed-variant: '#484741'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
  sale-red: '#E02020'
  price-green: '#1D8B42'
  warm-gray: '#636B74'
  border-subtle: '#E5E7EB'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  price-display:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

This design system embodies a **Modern Quick-Commerce** aesthetic, prioritizing speed, health, and hygiene. The visual narrative is built on the "Quick-commerce polish" movement—blending the high-efficiency UX of delivery platforms with a premium, organic feel.

The style is characterized by **Refined Modernism**: it utilizes generous whitespace and a "warm-clean" atmosphere to build consumer trust. By moving away from the purely utilitarian look of traditional wholesale, it adopts a high-contrast, polished interface that feels both technologically advanced and grounded in natural quality. The emotional response is one of reliability, freshness, and effortless convenience.

## Colors

The palette is anchored by a **Warm Neutral Base** (#FDF9F0) to evoke freshness and organic quality, moving away from "clinical" whites. 

*   **Primary Accent**: A vibrant Golden Amber derived from the logo, used for high-intent actions and brand expression.
*   **Trust Green**: A crisp, deep emerald used specifically for health-focused messaging, organic markers, and final conversion (checkout).
*   **Deep Charcoal**: Replaces pure black for typography to maintain a premium feel while ensuring high readability.
*   **Semantic Colors**: Sale badges use a high-chroma red, while price discounts leverage the Trust Green to associate savings with positive health choices.

## Typography

Using **Public Sans**, the typography system is institutional yet accessible. It prioritizes a clear information hierarchy essential for quick browsing.

- **Scale**: We use a tight scale to keep density high but legible. 
- **Emphasis**: Product titles use `title-md` for punchy visibility in grid views. 
- **Numerical Treatment**: Prices are given a dedicated weight (`price-display`) to ensure they stand out as the primary data point for consumers.
- **Micro-copy**: `label-caps` is used for category tags and "Sale" indicators to create a distinct visual rhythm compared to body text.

## Layout & Spacing

The design system employs a **Fixed Grid** on desktop (12 columns) and a **Fluid Grid** on mobile (4 columns).

- **Grid Logic**: Content is centered within a 1280px container. Product grids use a 24px gutter to maintain a clean "airway" between items.
- **Rhythm**: Vertical rhythm is managed through a "Stack" system. `stack-sm` for internal component spacing (e.g., price to title), and `stack-lg` for separating component blocks.
- **Density**: Unlike traditional e-commerce, we use "Generous Density"—items are packed closely for efficiency, but surrounded by large 80px section gaps to allow the brand story to breathe.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

1.  **Level 0 (Surface)**: The warm background base (#FDF9F0).
2.  **Level 1 (Cards)**: White (#FFFFFF) surfaces with a subtle, 15% opacity charcoal shadow (0px 4px 20px). This "floats" the product above the warm background.
3.  **Level 2 (Navigation/Modals)**: High-contrast white surfaces with a more pronounced, 25% opacity shadow to indicate functional interrupts and high priority.
4.  **Glassmorphism**: Sticky navigation headers use a 20px backdrop blur with 80% opacity white to maintain context while the user scrolls.

## Shapes

The shape language is defined as **Rounded (0.5rem base)**.

- **Product Cards**: Utilize `rounded-lg` (16px) to appear friendly and safe, mirroring the organic nature of the consumables.
- **Action Buttons**: Standard buttons use the 8px base, while search bars and specific quick-add triggers use `rounded-xl` (24px) for a "pill" feel that invites touch.
- **Inputs**: Form fields maintain the 8px standard for a professional, structured appearance.

## Components

### Buttons
- **Primary**: High-contrast Golden Amber with white text. No border. Soft shadow on hover.
- **Secondary**: Trust Green background for "Add to Cart" or "Success" actions.
- **Ghost**: Deep Charcoal outline (1px) for "Know More" or "Bulk Order" inquiries.

### Cards
Product cards are the core unit. They must include:
- A top-aligned `label-caps` Sale badge (if applicable).
- A 1:1 aspect ratio product image on a pure white background.
- Left-aligned title and price stack.
- A full-width "Quick Add" button at the bottom.

### Inputs & Forms
Form fields use a `warm-gray` 1px border that shifts to `primary` on focus. Labels are always visible above the input in `body-sm` bold.

### Navigation
The header is minimal. It features the logo on the left, a centered search bar with high roundedness, and a right-aligned cart trigger with a numeric Trust Green badge.

### Status Indicators
- **Sale Ribbons**: Located top-left of cards, using `sale-red`.
- **In Stock**: Small Trust Green dot next to the "Incl. GST" metadata.
- **Required Fields**: Indicated by a Golden Amber asterisk.