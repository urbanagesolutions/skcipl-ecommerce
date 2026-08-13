import { StaticPageLayout } from '@/components/StaticPageLayout';

export const metadata = { title: 'Refund Policy | Sabari Krishna Consumables' };

export default function RefundPolicyPage() {
  return (
    <StaticPageLayout title="Refund & Return Policy">
      <h2 className="text-title-md font-bold text-on-surface">Return Window</h2>
      <p>You may request a return within 7 days of delivery for unopened, sealed FMCG products.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Eligible Items</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Damaged or defective products (with photo evidence)</li>
        <li>Wrong item delivered</li>
        <li>Expired products received</li>
      </ul>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Non-Returnable</h2>
      <p>Opened food products, items without original packaging, and products past the return window.</p>
      <h2 className="text-title-md font-bold text-on-surface mt-4">Refund Process</h2>
      <p>Submit a return request from My Account. Once approved, refunds are processed within 5-7 business days to the original payment method.</p>
    </StaticPageLayout>
  );
}
