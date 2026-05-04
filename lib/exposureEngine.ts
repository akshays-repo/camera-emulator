// Reference: ISO 400, 1/125s, f/5.6 → exposure multiplier = 1.0 (image looks natural)
const ISO_REF = 400;
const SHUTTER_REF = 1 / 125;
const APERTURE_REF = 5.6;
const REF = (ISO_REF * SHUTTER_REF) / (APERTURE_REF * APERTURE_REF);

// Returns linear exposure multiplier: 1.0 = correct, >1 = overexposed, <1 = underexposed
export function computeExposure(iso: number, shutter: number, aperture: number): number {
  const ev = (iso * shutter) / (aperture * aperture);
  return ev / REF;
}

// Returns EV stops deviation from reference (-∞ to +∞, clamped for display to ±3)
export function computeEVStops(iso: number, shutter: number, aperture: number): number {
  return Math.log2(computeExposure(iso, shutter, aperture));
}
