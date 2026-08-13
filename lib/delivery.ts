// Pincode-based delivery serviceability (India postal zones)
// Uses a simplified zone model; replace with Shiprocket/Delhivery API in production.

const METRO_PINCODES = new Set([
  '600001', '600002', '600003', '600004', '600005', '600006', '600007', '600008',
  '110001', '110002', '400001', '400002', '560001', '560002', '700001', '500001',
]);

const TIER2_PREFIXES = ['60', '11', '40', '56', '70', '50', '41', '45', '38', '36'];

export interface DeliveryInfo {
  serviceable: boolean;
  standardDays: string;
  expressDays: string;
  shippingCost: number;
  zone: string;
  message: string;
}

export function checkPincodeDelivery(pincode: string): DeliveryInfo {
  if (!/^\d{6}$/.test(pincode)) {
    return {
      serviceable: false,
      standardDays: '',
      expressDays: '',
      shippingCost: 0,
      zone: 'invalid',
      message: 'Please enter a valid 6-digit PIN code.',
    };
  }

  if (METRO_PINCODES.has(pincode)) {
    return {
      serviceable: true,
      standardDays: '2-3 business days',
      expressDays: '1-2 business days',
      shippingCost: 0,
      zone: 'metro',
      message: 'Delivery available: Standard (2-3 days), Express (1-2 days). Free shipping on orders above ₹999.',
    };
  }

  const prefix = pincode.substring(0, 2);
  if (TIER2_PREFIXES.includes(prefix)) {
    return {
      serviceable: true,
      standardDays: '3-5 business days',
      expressDays: '2-3 business days',
      shippingCost: 50,
      zone: 'tier2',
      message: 'Delivery available: Standard (3-5 days), Express (2-3 days). ₹50 shipping fee applies.',
    };
  }

  return {
    serviceable: true,
    standardDays: '5-7 business days',
    expressDays: '3-5 business days',
    shippingCost: 80,
    zone: 'remote',
    message: 'Delivery available to your area: Standard (5-7 days). ₹80 shipping fee applies.',
  };
}
