import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, ShieldAlert, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import BlogEditor from './BlogEditor';
import NewsManager from './NewsManager';
import './Dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dashboard Stats
  const [totalSignatures, setTotalSignatures] = useState(0);
  const [recentSignatures, setRecentSignatures] = useState(0);
  
  // Site Settings
  const [headline, setHeadline] = useState('Stop the Radical Redistricting Law in Virginia');
  const [subtitle, setSubtitle] = useState('They are trying to pick their voters. We demand fair representation. Stand with us to stop partisan gerrymandering before it\'s too late.');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // Blog Management
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchSettings();
    fetchPosts();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: totalCount, error: totalError } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true });
        
      if (!totalError && totalCount !== null) {
        setTotalSignatures(totalCount);
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: recentCount, error: recentError } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());
        
      if (!recentError && recentCount !== null) {
        setRecentSignatures(recentCount);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (data && !error) {
        const h = data.find(s => s.id === 'hero_headline');
        const sub = data.find(s => s.id === 'hero_subtitle');
        if (h) setHeadline(h.value);
        if (sub) setSubtitle(sub.value);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleExportSignatures = async () => {
    setExporting(true);
    try {
      const { data, error } = await supabase
        .from('signatures')
        .select('email, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('No signatures to export yet.');
        return;
      }

      const headers = ['Email', 'Signed At'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => `${row.email},"${new Date(row.created_at).toLocaleString()}"`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `stopem-signatures-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export signatures.');
    } finally {
      setExporting(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsMessage('');
    
    try {
      const updates = [
        { id: 'hero_headline', value: headline, updated_at: new Date().toISOString() },
        { id: 'hero_subtitle', value: subtitle, updated_at: new Date().toISOString() }
      ];
      
      const { error } = await supabase.from('site_settings').upsert(updates);
      
      if (error) throw error;
      setSettingsMessage('Settings saved successfully!');
      setTimeout(() => setSettingsMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSettingsMessage('Error saving settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      fetchPosts();
    } catch (err) {
      alert('Error deleting post');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (isEditing) {
    return (
      <div className="admin-layout">
        <main className="admin-main" style={{padding: '2rem'}}>
          <BlogEditor 
            post={currentPost} 
            onBack={() => { setIsEditing(false); setCurrentPost(null); }} 
            onSave={() => { setIsEditing(false); setCurrentPost(null); fetchPosts(); }} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <ShieldAlert className="logo-icon text-dark" size={28} />
          <span className="text-dark font-bold">Admin<span className="logo-accent">Panel</span></span>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            Overview
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={20} />
            Blog & Content
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            Site Settings
          </button>
        </nav>

        <div className="admin-footer">
          <button className="admin-nav-item text-red" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'overview' ? 'Dashboard Overview' : 
               activeTab === 'content' ? 'Manage Content' : 'Site Settings'}</h1>
          <div className="admin-user-badge">
            Admin User
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Total Signatures</h3>
                <div className="stat-number">{totalSignatures.toLocaleString()}</div>
                <div className="stat-trend positive">+{recentSignatures} in last 24h</div>
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{marginTop: '1rem', width: '100%'}}
                  onClick={handleExportSignatures}
                  disabled={exporting}
                >
                  <Download size={14} /> {exporting ? 'Exporting...' : 'Export to CSV'}
                </button>
              </div>
              <div className="stat-card">
                <h3>Page Views</h3>
                <div className="stat-number">--</div>
                <div className="stat-trend">Set up Google Analytics</div>
              </div>
              <div className="stat-card">
                <h3>Blog Posts</h3>
                <div className="stat-number">{posts.length}</div>
                <div className="stat-action" onClick={() => setActiveTab('content')}>Manage posts &rarr;</div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <NewsManager 
              posts={posts}
              loading={loadingPosts}
              onCreate={() => { setCurrentPost(null); setIsEditing(true); }}
              onEdit={(post) => { setCurrentPost(post); setIsEditing(true); }}
              onDelete={handleDeletePost}
            />
          )}

          {activeTab === 'settings' && (
            <div className="settings-panel">
              <div className="settings-card">
                <h3>Hero Section Content</h3>
                <div className="form-group" style={{marginBottom: '1.5rem'}}>
                  <label>Main Headline</label>
                  <input 
                    type="text" 
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{marginBottom: '1.5rem'}}>
                  <label>Subtitle</label>
                  <textarea 
                    rows={4} 
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  ></textarea>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                  >
                    {savingSettings ? 'Saving...' : 'Save Changes'}
                  </button>
                  {settingsMessage && (
                    <span style={{color: settingsMessage.includes('Error') ? '#dc2626' : '#10b981', fontWeight: 500}}>
                      {settingsMessage}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
