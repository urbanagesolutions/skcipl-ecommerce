import { DEFAULT_CARRIERS, type ShippingCarrier } from './carriers';

/** Heuristic carrier detection from AWB/tracking number format */
const PATTERNS: { slug: string; test: RegExp }[] = [
  { slug: 'bluedart', test: /^\d{11,12}$/ },
  { slug: 'delhivery', test: /^\d{14,16}$/ },
  { slug: 'dtdc', test: /^[A-Z0-9]{10,12}$/i },
  { slug: 'fedex', test: /^\d{12,15}$/ },
  { slug: 'dhl', test: /^\d{10,11}$/ },
  { slug: 'india-post', test: /^[A-Z]{2}\d{9}IN$/i },
  { slug: 'speed-post', test: /^[A-Z]{2}\d{9}IN$/i },
  { slug: 'ecom-express', test: /^\d{12,14}$/ },
  { slug: 'xpressbees', test: /^XB\d+/i },
  { slug: 'ekart', test: /^[A-Z]{2,4}\d{10,}$/i },
  { slug: 'shiprocket', test: /^SR\d+/i },
  { slug: 'ups', test: /^1Z[A-Z0-9]{16}$/i },
  { slug: 'usps', test: /^(94|93|92|94)\d{20}$/ },
];

export function detectCarrierFromTrackingNumber(
  trackingNumber: string,
  carriers: ShippingCarrier[] = DEFAULT_CARRIERS
): ShippingCarrier | null {
  const trimmed = trackingNumber.trim();
  if (!trimmed) return null;

  for (const { slug, test } of PATTERNS) {
    if (test.test(trimmed)) {
      const carrier = carriers.find((c) => c.slug === slug);
      if (carrier) return carrier;
    }
  }

  // Keyword hints in the number prefix
  if (/^BD/i.test(trimmed)) return carriers.find((c) => c.slug === 'bluedart') ?? null;
  if (/^DL/i.test(trimmed)) return carriers.find((c) => c.slug === 'delhivery') ?? null;

  return null;
}
