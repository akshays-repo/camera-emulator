'use client';

import { useEffect, useRef, useState } from 'react';

interface DialProps {
  label: string;
  value: string;
  onUp: () => void;
  onDown: () => void;
}

export default function Dial({ label, value, onUp, onDown }: DialProps) {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 120);
      return () => clearTimeout(t);
    }
  }, [value]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) onDown();
    else onUp();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 20) onUp();
    else if (delta < -20) onDown();
    touchStartY.current = null;
  };

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        background: 'var(--brushed-v)',
        border: '1px solid #1a1a1a',
        borderRadius: 4,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.8), 0 1px 0 #333',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Label */}
      <span style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 600,
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#555',
        textShadow: '0px 1px 0px #3a3a3a, 0px -1px 0px #0a0a0a',
        padding: '4px 0 2px',
      }}>
        {label}
      </span>

      {/* Up button */}
      <button
        onClick={onUp}
        style={{
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)',
          border: 'none',
          borderTop: '1px solid #333',
          borderBottom: '1px solid #111',
          color: '#666',
          cursor: 'pointer',
          width: '100%',
          padding: '5px 0',
          fontSize: 10,
          transition: 'background 80ms ease',
          fontFamily: 'inherit',
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(180deg, #141414 0%, #222 100%)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.8)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
          (e.currentTarget as HTMLButtonElement).style.color = '#666';
        }}
      >
        ▲
      </button>

      {/* LCD Value */}
      <div style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: 16,
        color: flash ? '#e8a020' : 'var(--lcd-text)',
        background: 'var(--lcd-bg)',
        padding: '6px 4px',
        textAlign: 'center',
        border: '1px solid #1a2a1a',
        borderRadius: 2,
        textShadow: flash
          ? '0 0 8px rgba(232,160,32,0.6)'
          : '0 0 8px rgba(168,255,96,0.4)',
        letterSpacing: 1,
        width: '100%',
        boxShadow: 'inset 0 0 12px rgba(0,20,0,0.8)',
        transition: 'color 60ms ease, text-shadow 60ms ease',
        minHeight: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {value}
      </div>

      {/* Down button */}
      <button
        onClick={onDown}
        style={{
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)',
          border: 'none',
          borderTop: '1px solid #333',
          borderBottom: '1px solid #111',
          color: '#666',
          cursor: 'pointer',
          width: '100%',
          padding: '5px 0',
          fontSize: 10,
          transition: 'background 80ms ease',
          fontFamily: 'inherit',
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(180deg, #141414 0%, #222 100%)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.8)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
          (e.currentTarget as HTMLButtonElement).style.color = '#666';
        }}
      >
        ▼
      </button>
    </div>
  );
}
