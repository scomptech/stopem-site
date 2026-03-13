import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, ShieldAlert, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
  }

  if (!post) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
        <h1>Post not found</h1>
        <Link to="/blog" className="btn btn-primary">Back to News</Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar navbar-scrolled">
        <div className="nav-content">
          <Link to="/" className="logo">
            <ShieldAlert className="logo-icon" />
            <span className="text-dark">StopEm<span className="logo-accent">.org</span></span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="text-dark">Home</Link>
            <Link to="/blog" className="text-dark">News</Link>
            <Link to="/#petition" className="btn btn-nav">Sign Petition</Link>
          </div>
        </div>
      </nav>

      <main className="section" style={{paddingTop: '8rem'}}>
        <div className="container" style={{maxWidth: '800px'}}>
          <Link to="/blog" className="back-link" style={{marginBottom: '2rem'}}>
            <ArrowLeft size={18} /> Back to News
          </Link>

          <header style={{marginBottom: '3rem'}}>
            <div className="preview-meta" style={{marginBottom: '1rem'}}>
              <Calendar size={16} />
              <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 style={{fontSize: '3rem', fontWeight: 800, color: 'var(--c-secondary)', lineHeight: 1.1}}>{post.title}</h1>
          </header>

          <article className="blog-content-rendering" style={{fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--c-text-main)'}}>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          <div style={{marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button className="btn btn-outline btn-sm">
                <Share2 size={14} /> Share on X
              </button>
              <button className="btn btn-outline btn-sm">
                Share on Facebook
              </button>
            </div>
            <p style={{fontSize: '0.875rem', color: '#9CA3AF'}}>Last updated: {new Date(post.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} StopEm.org. All rights reserved.</p>
            <div className="paid-for">Paid for by Virginians for Fair Maps</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
