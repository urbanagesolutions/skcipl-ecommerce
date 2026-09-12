import AdminInvoiceClient from './AdminInvoiceClient';

export async function generateStaticParams() {
  return [{ id: 'demo' }, { id: 'ORD-2026-001' }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInvoicePageWrapper({ params }: PageProps) {
  await params;
  return <AdminInvoiceClient />;
}
