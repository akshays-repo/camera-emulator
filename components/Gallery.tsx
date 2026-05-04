'use client';

import { useState } from 'react';
import { useCameraStore, Photo } from '@/lib/cameraStore';
import { SHUTTER_LABELS, SHUTTER_VALUES } from '@/lib/cameraStore';

function shutterLabel(v: number) {
  const idx = SHUTTER_VALUES.findIndex((s) => Math.abs(s - v) < 0.0001);
  return SHUTTER_LABELS[idx] ?? '?';
}

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
}

function Lightbox({ photo, onClose }: LightboxProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 16, backdropFilter: 'blur(6px)',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', maxWidth: 900, marginBottom: 8, padding: '0 4px',
      }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--lcd-text)', letterSpacing: 2 }}>
          ISO {photo.iso} · {shutterLabel(photo.shutter)} · f/{photo.aperture}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={photo.dataUrl}
            download={`shot-${photo.id}.jpg`}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11,
              letterSpacing: 2, color: 'var(--accent)', textDecoration: 'none',
              border: '1px solid var(--accent)', padding: '4px 10px', borderRadius: 2,
              textTransform: 'uppercase',
            }}
          >Save</a>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid #333', color: '#888',
              cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontSize: 11,
              letterSpacing: 2, padding: '4px 10px', borderRadius: 2, textTransform: 'uppercase',
            }}
          >Close ✕</button>
        </div>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900, width: '100%',
          boxShadow: 'inset 0 0 0 1px #2a2a2a, 0 8px 40px rgba(0,0,0,0.9)',
          borderRadius: 4, overflow: 'hidden', background: '#000',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.dataUrl} alt="Shot" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
}

interface GalleryProps {
  onClose: () => void;
}

export default function Gallery({ onClose }: GalleryProps) {
  const { photos, removePhoto } = useCameraStore();
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: 'rgba(0,0,0,0.97)',
        display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(4px)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #1e1e1e',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14,
            letterSpacing: 3, color: '#888', textTransform: 'uppercase',
          }}>
            Camera Roll — {photos.length} shot{photos.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid #333', color: '#888',
              cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontSize: 11,
              letterSpacing: 2, padding: '4px 12px', borderRadius: 2, textTransform: 'uppercase',
            }}
          >Close ✕</button>
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 8,
          alignContent: 'start',
        }}>
          {photos.length === 0 && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0',
              fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
              color: '#333', letterSpacing: 2,
            }}>
              No shots yet — press the shutter button to capture
            </div>
          )}
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{ position: 'relative', borderRadius: 3, overflow: 'hidden', background: '#111', cursor: 'pointer' }}
              onClick={() => setLightbox(photo)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.dataUrl}
                alt="Shot thumbnail"
                style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                padding: '8px 5px 4px',
              }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#aaa', letterSpacing: 1 }}>
                  {shutterLabel(photo.shutter)} · f/{photo.aperture}
                </div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 7, color: '#666' }}>
                  ISO {photo.iso}
                </div>
              </div>
              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: 'rgba(0,0,0,0.7)', border: '1px solid #444',
                  color: '#888', borderRadius: '50%', width: 20, height: 20,
                  cursor: 'pointer', fontSize: 10, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
              {/* Save */}
              <a
                href={photo.dataUrl}
                download={`shot-${photo.id}.jpg`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute', top: 4, left: 4,
                  background: 'rgba(0,0,0,0.7)', border: '1px solid #444',
                  color: 'var(--accent)', borderRadius: 2, padding: '2px 5px',
                  fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 8,
                  letterSpacing: 1, textDecoration: 'none', textTransform: 'uppercase',
                }}
              >Save</a>
            </div>
          ))}
        </div>
      </div>

      {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}
