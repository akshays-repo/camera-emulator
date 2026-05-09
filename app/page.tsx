import Link from 'next/link';
import SeoContent from '@/components/SeoContent';

export default function Home() {
  return (
    <div className="landing-root">
      <div className="landing-grain" aria-hidden />

      <header className="landing-header">
        <div className="landing-logo-mark">&#9679;</div>
        <span className="landing-logo-text">CAMERA SIM</span>
        <Link href="/blog" className="landing-blog-link">Blog</Link>
      </header>

      <main className="landing-hero">
        <div className="landing-badge">FREE · INTERACTIVE · NO SIGNUP</div>

        <h1 className="landing-h1">
          <span className="landing-h1-thin">Master</span>
          <span className="landing-h1-bold">Exposure</span>
        </h1>

        <p className="landing-sub">
          Turn real dials. See real results. ISO, aperture, and shutter speed
          across five animated scenes. No camera required.
        </p>

        <Link href="/emulator" className="landing-cta">
          <span className="landing-cta-inner">
            <span className="landing-cta-icon">&#9654;</span>
            Launch Simulator
          </span>
        </Link>

        <div className="landing-hint">works on mobile &amp; desktop</div>
      </main>

      <div className="landing-features">
        <div className="landing-feat">
          <span className="landing-feat-icon">◉</span>
          <span className="landing-feat-label">ISO</span>
          <span className="landing-feat-desc">Grain &amp; sensitivity</span>
        </div>
        <div className="landing-feat-div" />
        <div className="landing-feat">
          <span className="landing-feat-icon">⌀</span>
          <span className="landing-feat-label">Aperture</span>
          <span className="landing-feat-desc">Light &amp; depth</span>
        </div>
        <div className="landing-feat-div" />
        <div className="landing-feat">
          <span className="landing-feat-icon">⏱</span>
          <span className="landing-feat-label">Shutter</span>
          <span className="landing-feat-desc">Motion &amp; blur</span>
        </div>
      </div>

      <SeoContent />

      <footer className="landing-footer">
        Camera Simulator &mdash; Free photography learning tool
      </footer>
    </div>
  );
}
