'use client';

import React from 'react';
import { ExternalLink, Truck } from 'lucide-react';

export interface TrackingWidgetShipment {
  id?: string;
  carrierName: string;
  trackingNumber: string;
  trackingUrl?: string;
  status?: string;
  shippedAt?: string;
}

export interface TrackingWidgetProps {
  shipments: TrackingWidgetShipment[];
  primaryColor?: string;
  accentColor?: string;
  showCarrierLogo?: boolean;
  compact?: boolean;
}

export function TrackingWidget({
  shipments,
  primaryColor = '#2D5016',
  accentColor = '#4A7C23',
  compact = false,
}: TrackingWidgetProps) {
  if (!shipments.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-warm-gray">
        Tracking information will appear here once your order is shipped.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {shipments.map((s, idx) => (
        <div
          key={s.id || idx}
          className={`rounded-xl border border-border-subtle overflow-hidden ${compact ? 'p-3' : 'p-4'}`}
          style={{ borderLeftWidth: 4, borderLeftColor: primaryColor }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <Truck size={18} style={{ color: primaryColor }} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-on-surface">{s.carrierName}</p>
                <p className="text-xs text-warm-gray mt-0.5">
                  AWB: <span className="font-mono font-semibold text-on-surface">{s.trackingNumber}</span>
                </p>
                {s.status && (
                  <span
                    className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${accentColor}20`, color: primaryColor }}
                  >
                    {s.status}
                  </span>
                )}
                {s.shippedAt && (
                  <p className="text-[10px] text-warm-gray mt-1">
                    Shipped {new Date(s.shippedAt).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            </div>
            {s.trackingUrl && (
              <a
                href={s.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-bold whitespace-nowrap flex-shrink-0 hover:underline"
                style={{ color: primaryColor }}
              >
                Track <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
