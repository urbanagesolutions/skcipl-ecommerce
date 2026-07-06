import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-[500px] mx-auto px-4 py-20 text-center space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-primary bg-opacity-5 text-primary rounded-full flex items-center justify-center">
          <Compass size={44} className="animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <h1 className="text-display-lg font-bold text-on-surface">404</h1>
        <h2 className="text-headline-lg text-on-surface">Page Not Found</h2>
        <p className="text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
          The page you are looking for does not exist or has been moved to another category listing.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/">
          <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
            Return to Homepage <ArrowRight size={16} />
          </Button>
        </Link>
        <Link href="/admin">
          <Button variant="outline" fullWidth>
            Go to Admin Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
