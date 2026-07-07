export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Truck, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface TrackingPageProps {
  params: {
    id: string;
  };
}

export default function TrackingPage({ params }: TrackingPageProps) {
  // Stepper tracker checkpoints
  const steps = [
    { label: 'Order Placed', date: 'July 6, 2026 10:30 AM', completed: true },
    { label: 'Confirmed', date: 'July 6, 2026 11:15 AM', completed: true },
    { label: 'Packed & Dispatched', date: 'July 6, 2026 04:30 PM', completed: true },
    { label: 'In Transit', date: 'July 7, 2026 09:00 AM (BlueDart Hub)', completed: false, active: true },
    { label: 'Out for Delivery', date: 'Pending', completed: false },
    { label: 'Delivered', date: 'Pending', completed: false }
  ];

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-border-subtle pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">Track Shipment</h1>
          <p className="text-body-sm text-warm-gray mt-1">
            Tracking order <strong className="text-on-surface">#{params.id}</strong>
          </p>
        </div>
        <Link href="/account">
          <Button variant="outline" size="sm">Back to Account</Button>
        </Link>
      </div>

      {/* BlueDart shipping partner card */}
      <Card elevation={1} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Courier Partner</span>
          <span className="font-bold text-title-md text-on-surface flex items-center gap-1.5 mt-1">
            BlueDart Express <ExternalLink size={14} className="text-primary" />
          </span>
          <span className="text-xs text-warm-gray mt-1 block">AWB: BD-924058209</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Estimated Delivery</span>
          <span className="font-bold text-title-md text-secondary mt-1 flex items-center gap-1.5">
            <Calendar size={16} /> July 9, 2026
          </span>
          <span className="text-xs text-warm-gray mt-1 block">By End of Day</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wider text-warm-gray font-bold">Delivery Location</span>
          <span className="font-bold text-body-sm text-on-surface mt-1 flex items-center gap-1.5">
            <MapPin size={16} className="text-primary" /> Anna Salai, Chennai, 600002
          </span>
        </div>
      </Card>

      {/* Transit steps timeline */}
      <Card elevation={1} className="p-8">
        <h2 className="text-title-md font-bold text-on-surface mb-6 flex items-center gap-2">
          <Truck size={18} /> Transit Timeline
        </h2>

        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col sm:flex-row sm:justify-between items-start gap-1">
              
              {/* Stepper Dot */}
              <div
                className={`absolute -left-8 top-1 w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 ${
                  step.completed
                    ? 'border-secondary bg-secondary text-white'
                    : step.active
                    ? 'border-primary bg-primary text-white animate-pulse'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {step.completed ? '✓' : idx + 1}
              </div>

              <div>
                <span className={`block font-bold text-body-sm ${step.active ? 'text-primary' : 'text-on-surface'}`}>
                  {step.label}
                </span>
                <span className="text-xs text-warm-gray mt-0.5 block">{step.date}</span>
              </div>

              {step.active && (
                <Badge variant="secondary" className="text-[10px] mt-1 sm:mt-0">Live Update</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
export async function generateStaticParams() {
  return [
    { id: '1001' },
    { id: '120539' }
  ];
}
