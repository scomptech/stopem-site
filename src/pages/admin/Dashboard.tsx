import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, ShieldAlert } from 'lucide-react';
import './Dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

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
                <div className="stat-number">1,248</div>
                <div className="stat-trend positive">+12 today</div>
              </div>
              <div className="stat-card">
                <h3>Page Views</h3>
                <div className="stat-number">8,592</div>
                <div className="stat-trend positive">+430 today</div>
              </div>
              <div className="stat-card">
                <h3>Blog Posts</h3>
                <div className="stat-number">3</div>
                <div className="stat-action">Manage posts &rarr;</div>
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
                      <td>Why the New Maps Fail Us</td>
                      <td><span className="status-badge published">Published</span></td>
                      <td>Mar 10, 2026</td>
                      <td><button className="btn-outline btn-sm">Edit</button></td>
                    </tr>
                    <tr>
                      <td>Rally Details: What to Bring</td>
                      <td><span className="status-badge draft">Draft</span></td>
                      <td>Mar 12, 2026</td>
                      <td><button className="btn-outline btn-sm">Edit</button></td>
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
                <div className="form-group">
                  <label>Main Headline</label>
                  <input type="text" defaultValue="Stop the Radical Redistricting Law in Virginia" />
                </div>
                <div className="form-group">
                  <label>Subtitle</label>
                  <textarea rows={3} defaultValue="They are trying to pick their voters. We demand fair representation. Stand with us to stop partisan gerrymandering before it's too late."></textarea>
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}