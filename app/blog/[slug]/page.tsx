import type { Metadata } from 'next';
import Link from 'next/link';
import { POSTS, getPost } from '@/lib/blog';
import type { Block } from '@/lib/blog';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://camerasimulator.online/blog/${post.slug}/` },
    openGraph: { title: post.title, description: post.description, type: 'article' },
  };
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const isPhoto = post.category === 'Photography';
  const others  = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

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
          <Link href="/blog"     className="blog-nav-link">Blog</Link>
        </nav>
      </header>

      <main className="post-main">
        {/* Breadcrumb */}
        <nav className="post-breadcrumb">
          <Link href="/blog">Blog</Link>
          <span>›</span>
          <span>{post.category}</span>
        </nav>

        {/* Article header */}
        <div className="post-header">
          <div className={`blog-card-badge ${isPhoto ? 'badge-photo' : 'badge-dev'}`} style={{ marginBottom: 20 }}>
            {post.category}
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span>{post.date}</span>
            <span className="post-meta-dot">·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Article body */}
        <article className="post-body">
          {post.blocks.map((block, i) => <RenderBlock key={i} block={block} />)}
        </article>

        {/* CTA */}
        <div className="post-cta-box">
          <div className="post-cta-label">Try it yourself</div>
          <p className="post-cta-text">
            Everything described in this article is visible in real time in the free Camera Simulator.
            No signup, no install — works in any browser.
          </p>
          <Link href="/emulator" className="post-cta-btn">Launch Simulator →</Link>
        </div>

        {/* More posts */}
        {others.length > 0 && (
          <section className="post-more">
            <h2 className="blog-section-title" style={{ marginBottom: 24 }}>More articles</h2>
            <div className="blog-grid">
              {others.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
                  <div className={`blog-card-badge ${p.category === 'Photography' ? 'badge-photo' : 'badge-dev'}`}>
                    {p.category}
                  </div>
                  <h3 className="blog-card-title">{p.title}</h3>
                  <p className="blog-card-desc">{p.description}</p>
                  <div className="blog-card-meta">
                    <span>{p.readTime} min read</span>
                  </div>
                  <div className="blog-card-cta">Read →</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="blog-footer">
        <Link href="/" className="blog-footer-logo">● CAMERA SIM</Link>
        <p className="blog-footer-copy">© 2026 camerasimulator.online · Free photography learning tool</p>
      </footer>
    </div>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="post-h2">{block.text}</h2>;
    case 'h3':
      return <h3 className="post-h3">{block.text}</h3>;
    case 'p':
      return <p className="post-p">{block.text}</p>;
    case 'ul':
      return (
        <ul className="post-ul">
          {block.items.map((item, i) => <li key={i} className="post-li">{item}</li>)}
        </ul>
      );
    case 'code':
      return (
        <div className="post-code-wrap">
          <div className="post-code-lang">{block.lang}</div>
          <pre className="post-code"><code>{block.text}</code></pre>
        </div>
      );
    case 'table':
      return (
        <div className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return <div className="post-callout">{block.text}</div>;
    default:
      return null;
  }
}
