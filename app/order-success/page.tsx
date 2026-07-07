export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center space-y-8">
      {/* Visual Success Indicator */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-secondary bg-opacity-10 text-secondary rounded-full flex items-center justify-center">
          <CheckCircle size={48} />
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1">Order Confirmed</Badge>
        <h1 className="text-headline-lg text-on-surface">Thank You for Your Order!</h1>
        <p className="text-body-sm text-on-surface-variant max-w-sm">
          Your order has been received successfully and is being prepared for fulfillment.
        </p>
      </div>

      {/* Transaction billing summary details */}
      <Card elevation={1} className="text-left space-y-4">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3">
          <span className="text-xs text-warm-gray">Order ID: <strong className="text-on-surface">#SK-120539</strong></span>
          <span className="text-xs text-warm-gray">Date: <strong>06 July 2026</strong></span>
        </div>

        <div className="space-y-2.5 text-body-sm text-on-surface-variant">
          <div className="flex justify-between font-semibold text-on-surface">
            <span>Desi Cow Ghee (500 ml)</span>
            <span>₹599</span>
          </div>
          <div className="flex justify-between font-semibold text-on-surface">
            <span>Virgin Coconut Oil (1 Litre) x 2</span>
            <span>₹598</span>
          </div>
          <div className="border-t border-border-subtle pt-2.5 flex justify-between font-bold text-on-surface">
            <span>Total Paid</span>
            <span className="text-price-green text-title-md">₹1147</span>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-3 text-xs text-warm-gray space-y-1">
          <p><strong>Shipping To:</strong> No. 12, Sabari Towers, Anna Salai, Chennai, TN, 600002</p>
          <p><strong>Fulfillment Method:</strong> BlueDart Express (2-3 business days)</p>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/track/120539">
          <Button variant="primary" className="flex items-center gap-2 w-full sm:w-auto">
            Track Shipment <ArrowRight size={16} />
          </Button>
        </Link>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} /> Download Invoice
        </Button>
      </div>

      <Link href="/" className="block text-body-sm text-primary font-bold hover:underline">
        Back to Storefront
      </Link>
    </div>
  );
}
