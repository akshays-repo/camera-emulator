'use client';

import { useCameraStore } from '@/lib/cameraStore';
import { SCENES } from '@/lib/animatedScene';

const ICONS: Record<string, string> = {
  helicopter: '🚁',
  racing:     '🏎',
  waterfall:  '💧',
  city:       '🌃',
  fan:        '🌀',
};

export default function ScenePicker() {
  const { sceneId, setSceneId } = useCameraStore();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '5px 10px',
      background: '#111',
      borderTop: '1px solid #1e1e1e',
      borderBottom: '1px solid #1e1e1e',
      overflowX: 'auto',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: 9,
        color: '#444',
        letterSpacing: 2,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        marginRight: 4,
        flexShrink: 0,
      }}>
        Scene
      </span>
      {SCENES.map((scene) => {
        const active = scene.id === sceneId;
        return (
          <button
            key={scene.id}
            onClick={() => setSceneId(scene.id)}
            title={scene.hint}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              padding: '4px 10px',
              background: active ? 'rgba(232,160,32,0.12)' : 'rgba(255,255,255,0.03)',
              border: active ? '1px solid rgba(232,160,32,0.5)' : '1px solid #252525',
              borderRadius: 3,
              cursor: 'pointer',
              outline: 'none',
              flexShrink: 0,
              transition: 'all 120ms ease',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{ICONS[scene.id]}</span>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: active ? 700 : 400,
              fontSize: 9,
              color: active ? 'var(--accent)' : '#555',
              letterSpacing: 1,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {scene.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
