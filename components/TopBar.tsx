'use client';

import { useState } from 'react';
import { useCameraStore, SHUTTER_VALUES, SHUTTER_LABELS } from '@/lib/cameraStore';
import Gallery from './Gallery';

export default function TopBar() {
  const shutter    = useCameraStore((s) => s.shutter);
  const photoCount = useCameraStore((s) => s.photos.length);
  const shutterIdx = SHUTTER_VALUES.findIndex((v) => Math.abs(v - shutter) < 0.0001);
  const shutterLabel = SHUTTER_LABELS[shutterIdx] ?? '1/125';

  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', height: 48,
        background: 'var(--brushed-h)', borderBottom: '1px solid #0a0a0a', flexShrink: 0,
      }}>
        {/* Rubber grip */}
        <div style={{
          width: 8, height: '100%',
          background: 'repeating-linear-gradient(135deg, #0d0d0d 0px, #0d0d0d 3px, #151515 3px, #151515 6px)',
          borderRight: '1px solid #222', flexShrink: 0,
        }} />

        {/* Brand */}
        <span style={{
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: '#333',
          textShadow: '0px 1px 0px #3a3a3a, 0px -1px 0px #0a0a0a', paddingLeft: 12, letterSpacing: 2,
        }}>
          CAMERA SIMULATOR
        </span>

        <div style={{ flex: 1 }} />

        {/* Gallery button */}
        <button
          onClick={() => setGalleryOpen(true)}
          style={{
            position: 'relative',
            background: 'none',
            border: '1px solid #2a2a2a',
            borderRadius: 2,
            padding: '2px 8px',
            marginRight: 8,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            outline: 'none',
          }}
        >
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: '#555', letterSpacing: 1 }}>
            ROLL
          </span>
          {photoCount > 0 && (
            <span style={{
              background: 'var(--accent)', color: '#000',
              fontFamily: 'Share Tech Mono, monospace', fontSize: 8,
              borderRadius: 2, padding: '1px 4px', lineHeight: 1.4,
            }}>
              {photoCount}
            </span>
          )}
        </button>

        {/* Mode badge */}
        <div style={{
          border: '1px solid #333', borderRadius: 2, padding: '2px 5px',
          fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--accent)', marginRight: 8,
        }}>M</div>

        {/* Record dot */}
        <div style={{
          width: 6, height: 6, borderRadius: '50%', background: '#cc2200', marginRight: 8,
          animation: 'rec-pulse 2s ease-in-out infinite',
        }} />

        {/* Live shutter */}
        <span style={{
          fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#555', marginRight: 12,
        }}>
          {shutterLabel}
        </span>
      </div>

      {galleryOpen && <Gallery onClose={() => setGalleryOpen(false)} />}
    </>
  );
}
