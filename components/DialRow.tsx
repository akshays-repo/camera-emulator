'use client';

import Dial from './Dial';
import { useCameraStore, APERTURE_VALUES, SHUTTER_VALUES, SHUTTER_LABELS, ISO_VALUES } from '@/lib/cameraStore';

function fmtAperture(v: number) {
  return `f / ${v}`.replace('.', ' . ');
}

function fmtShutter(idx: number) {
  const label = SHUTTER_LABELS[idx] ?? '1/125';
  // Add spaces inside the number for LCD feel
  return label.replace(/(\d)/g, '$1 ').trim();
}

function fmtISO(v: number) {
  return String(v).split('').join(' ');
}

export default function DialRow() {
  const { aperture, shutter, iso, setAperture, setShutter, setISO } = useCameraStore();

  const aIdx = APERTURE_VALUES.indexOf(aperture);
  const sIdx = SHUTTER_VALUES.findIndex((v) => Math.abs(v - shutter) < 0.0001);
  const iIdx = ISO_VALUES.indexOf(iso);

  return (
    <div style={{
      display: 'flex',
      gap: 6,
      padding: '8px 10px',
    }}>
      <Dial
        label="Aperture"
        value={fmtAperture(aperture)}
        onUp={() => setAperture(APERTURE_VALUES[Math.max(0, aIdx - 1)])}
        onDown={() => setAperture(APERTURE_VALUES[Math.min(APERTURE_VALUES.length - 1, aIdx + 1)])}
      />
      <div style={{ width: 1, background: '#1a1a1a', flexShrink: 0 }} />
      <Dial
        label="Shutter"
        value={fmtShutter(sIdx)}
        onUp={() => setShutter(SHUTTER_VALUES[Math.max(0, sIdx - 1)])}
        onDown={() => setShutter(SHUTTER_VALUES[Math.min(SHUTTER_VALUES.length - 1, sIdx + 1)])}
      />
      <div style={{ width: 1, background: '#1a1a1a', flexShrink: 0 }} />
      <Dial
        label="ISO"
        value={fmtISO(iso)}
        onUp={() => setISO(ISO_VALUES[Math.max(0, iIdx - 1)])}
        onDown={() => setISO(ISO_VALUES[Math.min(ISO_VALUES.length - 1, iIdx + 1)])}
      />
    </div>
  );
}
