import TopBar from '@/components/TopBar';
import DialRow from '@/components/DialRow';
import ViewfinderHUD from '@/components/ViewfinderHUD';
import CameraPreviewLoader from '@/components/CameraPreviewLoader';
import ScenePicker from '@/components/ScenePicker';
import SeoContent from '@/components/SeoContent';

export default function Home() {
  return (
    <>
      {/* ── Camera widget ── */}
      <div className="camera-shell">
        <main className="camera-body">
          <TopBar />

          {/* Viewfinder shell */}
          <div style={{
            flex: 1,
            padding: 6,
            background: '#0d0d0d',
            position: 'relative',
            boxShadow: 'inset 0 0 0 1px #2a2a2a, inset 0 0 0 2px #111, 0 4px 20px rgba(0,0,0,0.9)',
            borderRadius: 4,
            margin: '0 4px',
            minHeight: 0,
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #0a0a0a',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
            }}>
              {/* Corner brackets */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(to left, rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(to top, rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(to left, rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(to top, rgba(255,255,255,0.15) 1px, transparent 1px)
                `,
                backgroundSize: '12px 1px, 1px 12px, 12px 1px, 1px 12px, 12px 1px, 1px 12px, 12px 1px, 1px 12px',
                backgroundPosition: '8px 8px, 8px 8px, right 8px top 8px, right 8px top 8px, 8px bottom 8px, 8px bottom 8px, right 8px bottom 8px, right 8px bottom 8px',
                backgroundRepeat: 'no-repeat',
              }} />

              <CameraPreviewLoader />
              <ViewfinderHUD />
            </div>
          </div>

          {/* Scene picker */}
          <ScenePicker />

          {/* Control deck */}
          <div style={{
            backgroundImage: `
              repeating-linear-gradient(180deg, transparent 0px, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 3px),
              var(--brushed-h)
            `,
            borderTop: '1px solid #2e2e2e',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.8)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            flexShrink: 0,
          }}>
            <DialRow />
          </div>
        </main>
      </div>

      {/* ── SEO content (desktop only, below the camera) ── */}
      <SeoContent />
    </>
  );
}
