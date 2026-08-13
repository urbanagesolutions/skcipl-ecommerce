import { StaticPageLayout } from '@/components/StaticPageLayout';

export const metadata = { title: 'Privacy Policy | Sabari Krishna Consumables' };

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p><strong>Last updated:</strong> August 2026</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Information We Collect</h2>
      <p>We collect information you provide during account registration, checkout (name, email, phone, address), and when you contact us.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">How We Use Your Data</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Process and deliver your orders</li>
        <li>Send order updates via SMS and email</li>
        <li>Improve our products and services</li>
        <li>Comply with legal obligations (GST, FSSAI)</li>
      </ul>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Data Security</h2>
      <p>We use industry-standard encryption and secure payment gateways (Razorpay). We never store card details on our servers.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Contact</h2>
      <p>For privacy concerns, email support@sabarikrishna.in</p>
    </StaticPageLayout>
  );
}
