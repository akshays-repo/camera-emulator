'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useRef } from 'react';
import type { WebGLRenderer } from 'three';
import { useCameraStore } from '@/lib/cameraStore';
import ImagePreviewModal from './ImagePreviewModal';

const CameraPreview = dynamic(() => import('./CameraPreview'), { ssr: false });

export default function CameraPreviewLoader() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const rendererRef = useRef<WebGLRenderer | null>(null);

  const { iso, shutter, aperture, sceneId, addPhoto } = useCameraStore();

  const handleCapture = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    setCapturing(true);
    setTimeout(() => {
      const dataUrl = renderer.domElement.toDataURL('image/jpeg', 0.95);
      addPhoto({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        dataUrl,
        sceneId,
        iso,
        shutter,
        aperture,
        timestamp: Date.now(),
      });
      setPreviewUrl(dataUrl);
      setCapturing(false);
    }, 120);
  }, [iso, shutter, aperture, sceneId, addPhoto]);

  return (
    <>
      <CameraPreview rendererRef={rendererRef} />

      {/* Shutter button */}
      <button
        onClick={handleCapture}
        aria-label="Capture"
        style={{
          position: 'absolute', bottom: 14, right: 14, zIndex: 20,
          width: 44, height: 44, borderRadius: '50%',
          background: capturing
            ? 'radial-gradient(circle at 40% 35%, #fff 0%, #ccc 60%, #999 100%)'
            : 'radial-gradient(circle at 40% 35%, #f0f0f0 0%, #c0c0c0 55%, #888 100%)',
          border: '2px solid #555',
          boxShadow: capturing
            ? 'inset 0 2px 6px rgba(0,0,0,0.6), 0 0 0 3px rgba(232,160,32,0.4)'
            : '0 2px 8px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 3px #2a2a2a',
          cursor: 'pointer',
          transform: capturing ? 'translateY(1px) scale(0.96)' : 'none',
          transition: 'all 80ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none',
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: capturing ? '#ff2200' : '#cc2200',
          boxShadow: capturing ? '0 0 8px rgba(255,34,0,0.8)' : '0 0 4px rgba(204,34,0,0.4)',
          transition: 'all 80ms ease',
        }} />
      </button>

      {capturing && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.12)',
          pointerEvents: 'none', zIndex: 15, borderRadius: 2,
        }} />
      )}

      {previewUrl && (
        <ImagePreviewModal dataUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </>
  );
}
