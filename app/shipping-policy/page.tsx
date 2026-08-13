import { StaticPageLayout } from '@/components/StaticPageLayout';

export const metadata = { title: 'Shipping Policy | Sabari Krishna Consumables' };

export default function ShippingPolicyPage() {
  return (
    <StaticPageLayout title="Shipping Policy">
      <h2 className="text-title-md font-bold text-on-surface">Delivery Areas</h2>
      <p>We deliver across India. Enter your pincode on any product page to check serviceability.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Shipping Charges</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Free shipping on orders above ₹999</li>
        <li>₹50 flat shipping fee for orders below ₹999 (metro/tier-2 cities)</li>
        <li>₹80 for remote areas</li>
      </ul>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Delivery Timeline</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Metro cities: 2-3 business days (standard), 1-2 days (express)</li>
        <li>Tier-2 cities: 3-5 business days</li>
        <li>Remote areas: 5-7 business days</li>
      </ul>
    </StaticPageLayout>
  );
}
