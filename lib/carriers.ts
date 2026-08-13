export interface ShippingCarrier {
  id?: string;
  name: string;
  slug: string;
  tracking_url_template: string;
  logo_url?: string | null;
  is_enabled?: boolean;
  is_custom?: boolean;
}

/** Built-in India-focused carrier registry (fallback when DB unavailable) */
export const DEFAULT_CARRIERS: ShippingCarrier[] = [
  { name: 'Delhivery', slug: 'delhivery', tracking_url_template: 'https://www.delhivery.com/track/package/{tracking_number}' },
  { name: 'BlueDart', slug: 'bluedart', tracking_url_template: 'https://www.bluedart.com/web/guest/trackdartresult?trackNo={tracking_number}' },
  { name: 'DTDC', slug: 'dtdc', tracking_url_template: 'https://www.dtdc.in/tracking/tracking_results.asp?Ttype=awb_no&strCnno={tracking_number}' },
  { name: 'India Post', slug: 'india-post', tracking_url_template: 'https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?consignmentnumber={tracking_number}' },
  { name: 'Shiprocket', slug: 'shiprocket', tracking_url_template: 'https://shiprocket.co/tracking/{tracking_number}' },
  { name: 'Ekart', slug: 'ekart', tracking_url_template: 'https://ekartlogistics.com/track/{tracking_number}' },
  { name: 'FedEx', slug: 'fedex', tracking_url_template: 'https://www.fedex.com/fedextrack/?trknbr={tracking_number}' },
  { name: 'DHL Express', slug: 'dhl', tracking_url_template: 'https://www.dhl.com/in-en/home/tracking.html?tracking-id={tracking_number}' },
  { name: 'Ecom Express', slug: 'ecom-express', tracking_url_template: 'https://ecomexpress.in/tracking/?awb_field={tracking_number}' },
  { name: 'XpressBees', slug: 'xpressbees', tracking_url_template: 'https://www.xpressbees.com/track/{tracking_number}' },
  { name: 'Shadowfax', slug: 'shadowfax', tracking_url_template: 'https://track.shadowfax.in/track/{tracking_number}' },
  { name: 'Professional Couriers', slug: 'professional-couriers', tracking_url_template: 'https://www.tpcindia.com/track/{tracking_number}' },
  { name: 'Gati', slug: 'gati', tracking_url_template: 'https://www.gati.com/track-by-docket?docketNo={tracking_number}' },
  { name: 'Amazon Shipping', slug: 'amazon-shipping', tracking_url_template: 'https://track.amazon.in/tracking/{tracking_number}' },
  { name: 'Speed Post', slug: 'speed-post', tracking_url_template: 'https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?consignmentnumber={tracking_number}' },
  { name: 'Aramex', slug: 'aramex', tracking_url_template: 'https://www.aramex.com/in/en/track/results?ShipmentNumber={tracking_number}' },
  { name: 'UPS', slug: 'ups', tracking_url_template: 'https://www.ups.com/track?tracknum={tracking_number}' },
  { name: 'Other / Custom', slug: 'other', tracking_url_template: '' },
];

export function buildTrackingUrl(template: string, trackingNumber: string): string {
  if (!template || !trackingNumber) return '';
  return template.replace(/\{tracking_number\}/g, encodeURIComponent(trackingNumber.trim()));
}

export function findCarrierBySlug(slug: string, carriers: ShippingCarrier[] = DEFAULT_CARRIERS): ShippingCarrier | undefined {
  return carriers.find((c) => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
}

export function findCarrierByName(name: string, carriers: ShippingCarrier[] = DEFAULT_CARRIERS): ShippingCarrier | undefined {
  const lower = name.toLowerCase();
  return carriers.find((c) => c.name.toLowerCase() === lower || c.slug === lower.replace(/\s+/g, '-'));
}

export function resolveTrackingUrl(
  carrierName: string | null | undefined,
  trackingNumber: string,
  explicitUrl?: string | null,
  carriers: ShippingCarrier[] = DEFAULT_CARRIERS
): string {
  if (explicitUrl) return explicitUrl;
  if (!carrierName || !trackingNumber) return '';
  const carrier = findCarrierByName(carrierName, carriers);
  if (!carrier?.tracking_url_template) return '';
  return buildTrackingUrl(carrier.tracking_url_template, trackingNumber);
}
