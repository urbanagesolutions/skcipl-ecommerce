import InvoiceClient from './InvoiceClient';

export async function generateStaticParams() {
  return [{ id: 'demo' }, { id: 'ORD-2026-001' }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePageWrapper({ params }: PageProps) {
  await params;
  return <InvoiceClient />;
}
