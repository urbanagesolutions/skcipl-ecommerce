import { StaticPageLayout } from '@/components/StaticPageLayout';

export const metadata = { title: 'About Us | Sabari Krishna Consumables' };

export default function AboutPage() {
  return (
    <StaticPageLayout title="About Us">
      <p>
        Sabari Krishna Consumables India Private Limited is a pioneering FMCG company dedicated to delivering
        pure, authentic, and high-quality consumables across India. Founded with a vision to bring traditional
        Indian food products to modern households, we specialize in premium ghee, cold-pressed oils, and
        carefully sourced groceries.
      </p>
      <h2 className="text-title-md font-bold text-on-surface mt-6">Our Mission</h2>
      <p>
        To provide every Indian household with FSSAI-certified, traceable, and ethically produced food products
        that honor traditional methods while meeting modern quality standards.
      </p>
      <h2 className="text-title-md font-bold text-on-surface mt-6">Quality Commitment</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>All products are FSSAI licensed and batch-tracked</li>
        <li>Cold-pressed oils with no chemical extraction</li>
        <li>Hand-churned desi cow ghee using traditional bilona method</li>
        <li>Transparent sourcing from verified farms and suppliers</li>
      </ul>
    </StaticPageLayout>
  );
}
