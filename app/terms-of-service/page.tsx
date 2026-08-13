import { StaticPageLayout } from '@/components/StaticPageLayout';

export const metadata = { title: 'Terms of Service | Sabari Krishna Consumables' };

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms of Service">
      <p>By using sabarikrishna.in, you agree to these terms.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Orders & Payment</h2>
      <p>All orders are subject to product availability. We accept online payments via Razorpay and Cash on Delivery with OTP verification.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Pricing</h2>
      <p>Prices are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Limitation of Liability</h2>
      <p>Sabari Krishna Consumables India Private Limited shall not be liable for indirect or consequential damages arising from use of our platform.</p>
    </StaticPageLayout>
  );
}
