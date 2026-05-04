'use client';

import { useCameraStore } from '@/lib/cameraStore';
import { computeEVStops } from '@/lib/exposureEngine';

export default function ViewfinderHUD() {
  const { aperture, shutter, iso } = useCameraStore();

  const evStops = computeEVStops(iso, shutter, aperture);
  const clampedEV = Math.max(-3, Math.min(3, evStops));
  const needleLeft = `${((clampedEV + 3) / 6) * 90 + 5}%`;
  const needleColor = evStops < -0.5 ? '#3b82f6' : evStops > 0.5 ? '#ef4444' : '#e8a020';

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {/* AF crosshair — center */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 20, height: 20,
        border: '1px solid rgba(232,160,32,0.5)',
        opacity: 0.6,
      }}>
        <div style={{ position: 'absolute', top: '50%', left: -6, right: -6, height: 1, background: 'rgba(232,160,32,0.5)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', left: '50%', top: -6, bottom: -6, width: 1, background: 'rgba(232,160,32,0.5)', transform: 'translateX(-50%)' }} />
      </div>

      {/* EV Meter — bottom center */}
      <div style={{
        position: 'absolute',
        bottom: 10, left: '50%',
        transform: 'translateX(-50%)',
        width: '80%', height: 20,
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 2,
        backdropFilter: 'blur(2px)',
      }}>
        {[-3,-2,-1,0,1,2,3].map((ev) => (
          <div key={ev} style={{
            position: 'absolute',
            left: `${((ev + 3) / 6) * 90 + 5}%`,
            top: ev === 0 ? 5 : 7,
            width: 1,
            height: ev === 0 ? 10 : 6,
            background: ev === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
            transform: 'translateX(-50%)',
          }} />
        ))}
        {[-3, 0, 3].map((ev) => (
          <span key={ev} style={{
            position: 'absolute',
            left: `${((ev + 3) / 6) * 90 + 5}%`,
            top: 1,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 7,
            color: '#555',
            transform: 'translateX(-50%)',
          }}>
            {ev > 0 ? `+${ev}` : ev}
          </span>
        ))}
        <div style={{
          position: 'absolute',
          left: needleLeft,
          top: 4, width: 2, height: 12,
          background: needleColor,
          boxShadow: `0 0 6px ${needleColor}`,
          transform: 'translateX(-50%)',
          transition: 'left 150ms ease',
        }} />
      </div>
    </div>
  );
}
