import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ArrowLeft, Save, Send, Image as ImageIcon, Globe, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './BlogEditor.css';

interface BlogEditorProps {
  post?: any;
  onBack: () => void;
  onSave: () => void;
}

export default function BlogEditor({ post, onBack, onSave }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [status, setStatus] = useState(post?.status || 'draft');
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && title) {
      setSlug(title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  }, [title, post]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // Append image to content
      setContent((prev: string) => prev + `<p><img src="${publicUrl}" alt="Blog Image" style="max-width: 100%" /></p>`);
      setMessage({ type: 'success', text: 'Image uploaded and inserted!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error uploading image' });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSave = async (isPublishing: boolean = false) => {
    if (!title || !slug || !content) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsSaving(true);
    const newStatus = isPublishing ? 'published' : status;

    const postData = {
      title,
      slug,
      content,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    try {
      let error;
      if (post?.id) {
        ({ error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id));
      } else {
        ({ error } = await supabase
          .from('blog_posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }]));
      }

      if (error) throw error;

      setMessage({ type: 'success', text: isPublishing ? 'Post published!' : 'Post saved successfully!' });
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving post' });
    } finally {
      setIsSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'list': '+1'}],
      ['link', 'clean'],
      ['code-block']
    ],
  };

  return (
    <div className="blog-editor-container">
      <div className="editor-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Posts
        </button>
        <div className="header-actions">
          {message.text && (
            <span className={`message-toast ${message.type}`}>
              {message.text}
            </span>
          )}
          <button 
            className="btn btn-secondary" 
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            <Save size={18} /> Save Draft
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            <Send size={18} /> {status === 'published' ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>

      <div className="editor-main">
        <div className="editor-left">
          <input 
            type="text" 
            className="input-title" 
            placeholder="Post Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <div className="quill-wrapper">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              modules={modules}
              placeholder="Start writing your post..."
            />
          </div>
        </div>

        <aside className="editor-right">
          <div className="sidebar-card">
            <h3>Post Settings</h3>
            
            <div className="form-group">
              <label>URL Slug</label>
              <div className="slug-input-wrapper">
                <Globe size={14} />
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="form-group">
              <label>Media</label>
              <div className="media-upload-area">
                <label className="upload-label">
                  <ImageIcon size={24} />
                  <span>{uploading ? 'Uploading...' : 'Upload & Insert Image'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    hidden 
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="sidebar-card preview-card">
            <h3>Quick Preview</h3>
            <div className="preview-content">
              <h4>{title || 'Untitiled Post'}</h4>
              <div className="preview-meta">
                <span className={`status-badge ${status}`}>{status}</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <p>Click "Preview" for full view</p>
              <button className="btn-outline btn-full btn-sm">
                <Eye size={14} /> Full Preview
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
