import React from 'react';
import { Card } from '@/components/ui/Card';

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

export function StaticPageLayout({ title, children }: StaticPageProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-headline-lg text-on-surface mb-6">{title}</h1>
      <Card elevation={1} className="prose prose-sm max-w-none space-y-4 text-body-sm text-on-surface-variant">
        {children}
      </Card>
    </div>
  );
}
