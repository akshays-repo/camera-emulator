import type { Metadata } from 'next';
import Link from 'next/link';
import { POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Photography & Dev Blog',
  description: 'Guides on ISO, aperture, shutter speed, and how Camera Simulator is built — for photographers and developers.',
  alternates: { canonical: 'https://camerasimulator.online/blog/' },
};

export default function BlogIndex() {
  const photo = POSTS.filter(p => p.category === 'Photography');
  const dev   = POSTS.filter(p => p.category === 'Developer');

  return (
    <div className="blog-root">
      {/* Header */}
      <header className="blog-site-header">
        <Link href="/" className="blog-logo">
          <span className="blog-logo-dot">●</span>
          CAMERA SIM
        </Link>
        <nav className="blog-nav">
          <Link href="/emulator" className="blog-nav-link">Emulator</Link>
          <Link href="/blog"     className="blog-nav-link blog-nav-active">Blog</Link>
        </nav>
      </header>

      <main className="blog-main">
        {/* Hero */}
        <div className="blog-hero">
          <div className="blog-hero-badge">GUIDES &amp; TUTORIALS</div>
          <h1 className="blog-hero-title">Photography &amp; Dev Blog</h1>
          <p className="blog-hero-sub">
            Learn how cameras work, how to read light, and how the simulator is built under the hood.
          </p>
        </div>

        {/* Photography posts */}
        <section className="blog-section">
          <h2 className="blog-section-title">
            <span className="blog-section-icon">📷</span>
            Photography Guides
          </h2>
          <div className="blog-grid">
            {photo.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>

        {/* Developer posts */}
        <section className="blog-section">
          <h2 className="blog-section-title">
            <span className="blog-section-icon">⚙️</span>
            Developer Deep Dives
          </h2>
          <div className="blog-grid">
            {dev.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      </main>

      <footer className="blog-footer">
        <Link href="/" className="blog-footer-logo">● CAMERA SIM</Link>
        <p className="blog-footer-copy">© 2026 camerasimulator.online · Free photography learning tool</p>
      </footer>
    </div>
  );
}

function PostCard({ post }: { post: (typeof POSTS)[number] }) {
  const isPhoto = post.category === 'Photography';
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <div className={`blog-card-badge ${isPhoto ? 'badge-photo' : 'badge-dev'}`}>
        {post.category}
      </div>
      <h3 className="blog-card-title">{post.title}</h3>
      <p className="blog-card-desc">{post.description}</p>
      <div className="blog-card-meta">
        <span>{post.date}</span>
        <span>{post.readTime} min read</span>
      </div>
      <div className="blog-card-cta">Read article →</div>
    </Link>
  );
}
