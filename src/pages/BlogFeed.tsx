import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BlogFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

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
            <Link to="/blog" className="text-dark font-bold">News</Link>
            <Link to="/#petition" className="btn btn-nav">Sign Petition</Link>
          </div>
        </div>
      </nav>

      <main className="section bg-light" style={{minHeight: '80vh', paddingTop: '8rem'}}>
        <div className="container">
          <div className="section-header text-center">
            <h1 className="section-title">Latest Updates</h1>
            <p className="section-description">Stay informed about the fight for fair representation in Virginia.</p>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '4rem'}}>Loading news...</div>
          ) : posts.length === 0 ? (
            <div style={{textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px'}}>
              <h3>No updates yet.</h3>
              <p>Check back soon for the latest news and rally details.</p>
            </div>
          ) : (
            <div className="features-grid">
              {posts.map((post) => (
                <article key={post.id} className="feature-card" style={{display: 'flex', flexDirection: 'column'}}>
                  <div className="preview-meta" style={{marginBottom: '1rem'}}>
                    <Calendar size={14} />
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--c-secondary)'}}>{post.title}</h2>
                  <div 
                    className="post-excerpt" 
                    style={{
                      color: 'var(--c-text-muted)', 
                      marginBottom: '2rem', 
                      flex: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }}
                  />
                  <Link to={`/blog/${post.slug}`} className="action-link">
                    Read Full Story <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          )}
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
