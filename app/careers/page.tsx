import { StaticPageLayout } from '@/components/StaticPageLayout';
import Link from 'next/link';

export const metadata = { title: 'Careers | Sabari Krishna Consumables' };

export default function CareersPage() {
  const openings = [
    { title: 'Sales Executive — FMCG', location: 'Chennai', type: 'Full-time' },
    { title: 'Warehouse Operations Associate', location: 'Coimbatore', type: 'Full-time' },
    { title: 'Digital Marketing Specialist', location: 'Remote', type: 'Full-time' },
  ];

  return (
    <StaticPageLayout title="Careers">
      <p>Join our growing team and help bring authentic Indian consumables to households across the country.</p>
      <div className="space-y-4 mt-6 not-prose">
        {openings.map((job) => (
          <div key={job.title} className="p-4 border border-border-subtle rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-on-surface">{job.title}</h3>
              <p className="text-sm text-warm-gray">{job.location} · {job.type}</p>
            </div>
            <Link href="/contact" className="text-primary text-sm font-bold hover:underline">Apply</Link>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}
