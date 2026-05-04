'use client';

import { useEffect } from 'react';

interface Props {
  dataUrl: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ dataUrl, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 900,
        marginBottom: 8,
        padding: '0 4px',
      }}>
        <span style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 10,
          color: 'var(--lcd-text)',
          letterSpacing: 2,
          textShadow: '0 0 8px rgba(168,255,96,0.4)',
        }}>
          ● REC PREVIEW
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a
            href={dataUrl}
            download="camera-simulator-shot.jpg"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 2,
              color: 'var(--accent)',
              textDecoration: 'none',
              border: '1px solid var(--accent)',
              padding: '4px 10px',
              borderRadius: 2,
              textTransform: 'uppercase',
            }}
          >
            Save
          </a>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid #333',
              color: '#888',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 11,
              letterSpacing: 2,
              padding: '4px 10px',
              borderRadius: 2,
              textTransform: 'uppercase',
            }}
          >
            Close ✕
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 900,
          width: '100%',
          boxShadow: 'inset 0 0 0 1px #2a2a2a, 0 8px 40px rgba(0,0,0,0.9)',
          borderRadius: 4,
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* Corner brackets */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          backgroundImage: `
            linear-gradient(to right,rgba(255,255,255,0.2) 1px,transparent 1px),
            linear-gradient(to bottom,rgba(255,255,255,0.2) 1px,transparent 1px),
            linear-gradient(to left,rgba(255,255,255,0.2) 1px,transparent 1px),
            linear-gradient(to bottom,rgba(255,255,255,0.2) 1px,transparent 1px),
            linear-gradient(to right,rgba(255,255,255,0.2) 1px,transparent 1px),
            linear-gradient(to top,rgba(255,255,255,0.2) 1px,transparent 1px),
            linear-gradient(to left,rgba(255,255,255,0.2) 1px,transparent 1px),
            linear-gradient(to top,rgba(255,255,255,0.2) 1px,transparent 1px)
          `,
          backgroundSize: '16px 1px,1px 16px,16px 1px,1px 16px,16px 1px,1px 16px,16px 1px,1px 16px',
          backgroundPosition: '10px 10px,10px 10px,right 10px top 10px,right 10px top 10px,10px bottom 10px,10px bottom 10px,right 10px bottom 10px,right 10px bottom 10px',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt="Camera preview"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>

      <span style={{
        marginTop: 10,
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: 9,
        color: '#333',
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}>
        Tap outside or press ESC to dismiss
      </span>
    </div>
  );
}
