import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus, 
  ExternalLink, 
  FileText,
  Clock
} from 'lucide-react';

interface NewsManagerProps {
  posts: any[];
  onEdit: (post: any) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  loading: boolean;
}

export default function NewsManager({ posts, onEdit, onDelete, onCreate, loading }: NewsManagerProps) {
  const [searchQuery, setSearchSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="news-manager">
      <div className="manager-stats">
        <div className="stat-mini">
          <FileText size={16} />
          <span>{posts.length} Total Posts</span>
        </div>
        <div className="stat-mini success">
          <div className="dot" />
          <span>{publishedCount} Published</span>
        </div>
        <div className="stat-mini warning">
          <div className="dot" />
          <span>{draftCount} Drafts</span>
        </div>
      </div>

      <div className="manager-actions">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchQuery}
            onChange={(e) => setSearchSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={18} className="filter-icon" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={onCreate}>
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="mock-table-container">
        <table className="mock-table">
          <thead>
            <tr>
              <th>Post Title</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center">Loading posts...</td></tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center empty-state">
                  <FileText size={48} />
                  <p>No posts found. Try a different search or create one!</p>
                </td>
              </tr>
            ) : (
              filteredPosts.map(post => (
                <tr key={post.id} className="post-row">
                  <td>
                    <div className="post-title-cell">
                      <span className="title-text">{post.title}</span>
                      <span className="slug-text">/{post.slug}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Clock size={14} />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn" title="Edit" onClick={() => onEdit(post)}>
                        <Edit size={16} />
                      </button>
                      <a href={`/blog/${post.slug}`} target="_blank" className="icon-btn" title="View Live">
                        <ExternalLink size={16} />
                      </a>
                      <button className="icon-btn text-red" title="Delete" onClick={() => onDelete(post.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
