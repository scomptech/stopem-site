import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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

  useEffect(() => {
    fetchStats();
    fetchSettings();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total signatures
      const { count: totalCount, error: totalError } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true });
        
      if (!totalError && totalCount !== null) {
        setTotalSignatures(totalCount);
      }

      // Get recent signatures (last 24 hours)
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

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
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

      {/* Main Content */}
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
              </div>
              <div className="stat-card">
                <h3>Page Views</h3>
                <div className="stat-number">--</div>
                <div className="stat-trend">Set up Google Analytics</div>
              </div>
              <div className="stat-card">
                <h3>Blog Posts</h3>
                <div className="stat-number">0</div>
                <div className="stat-action" onClick={() => setActiveTab('content')}>Manage posts &rarr;</div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="content-manager">
              <div className="content-header-actions">
                <h2>Blog Posts</h2>
                <button className="btn btn-primary">Create New Post</button>
              </div>
              <div className="mock-table-container">
                <table className="mock-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                        No blog posts yet. Connection to Supabase required to store posts.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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