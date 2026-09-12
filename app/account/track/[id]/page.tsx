import TrackClient from './TrackClient';

export async function generateStaticParams() {
  return [{ id: 'demo' }, { id: 'ORD-2026-001' }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackPageWrapper({ params }: PageProps) {
  await params;
  return <TrackClient />;
}
