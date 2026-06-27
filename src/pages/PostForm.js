import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../components/Toast';
import { calculateReadTime } from '../utils/readTime';

const CATEGORIES = ['Technology', 'Writing', 'Travel', 'Lifestyle', 'Business', 'Health', 'Science', 'Arts', 'Other'];

const EMPTY = { title: '', excerpt: '', content: '', author: '', category: 'Technology', tags: '', cover: '' };

export default function PostForm() {
  const { id } = useParams();
  const { getPost, addPost, updatePost } = useBlog();
  const navigate = useNavigate();
  const showToast = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [editorTab, setEditorTab] = useState('write');

  useEffect(() => {
    if (isEdit) {
      const post = getPost(id);
      if (post) {
        setForm({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          tags: (post.tags || []).join(', '),
          cover: post.cover || '',
        });
      }
    }
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.excerpt.trim()) e.excerpt = 'Excerpt is required';
    if (!form.content.trim()) e.content = 'Content is required';
    if (!form.author.trim()) e.author = 'Author name is required';
    return e;
  };

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const parsedTags = form.tags
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
  const uniqueTags = [...new Set(parsedTags)];

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);

    const data = { ...form, tags: uniqueTags };

    setTimeout(() => {
      if (isEdit) {
        updatePost(id, data);
        showToast('Post updated!');
        navigate(`/post/${id}`);
      } else {
        const newPost = addPost(data);
        showToast('Post published!');
        navigate(`/post/${newPost.id}`);
      }
      setSaving(false);
    }, 400);
  };

  return (
    <div className="form-page">
      <h1 className="form-title">{isEdit ? 'Edit post' : 'New post'}</h1>

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className="form-input" placeholder="An engaging headline..." value={form.title} onChange={set('title')} />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Cover image URL</label>
        <input className="form-input" placeholder="https://images.unsplash.com/..." value={form.cover} onChange={set('cover')} />
        <div className="form-hint">Optional. Paste any direct image URL.</div>
        {form.cover && (
          <img
            src={form.cover}
            alt="Cover preview"
            className="form-cover-preview"
            onError={e => { e.target.style.display = 'none'; }}
            onLoad={e => { e.target.style.display = 'block'; }}
          />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Excerpt *</label>
        <input className="form-input" placeholder="A short summary shown on the card..." value={form.excerpt} onChange={set('excerpt')} />
        {errors.excerpt && <div className="form-error">{errors.excerpt}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Author *</label>
          <input className="form-input" placeholder="Your name" value={form.author} onChange={set('author')} />
          {errors.author && <div className="form-error">{errors.author}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Content * <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>— Markdown supported</span></label>

        <div className="split-editor">
          <div className="split-tabs">
            <button
              className={`split-tab ${editorTab === 'write' ? 'active' : ''}`}
              onClick={() => setEditorTab('write')}
            >
              Write
            </button>
            <button
              className={`split-tab ${editorTab === 'preview' ? 'active' : ''}`}
              onClick={() => setEditorTab('preview')}
            >
              Preview
            </button>
          </div>

          <div className="split-panes">
            <div className={`split-pane split-pane-write ${editorTab === 'write' ? 'active' : ''}`}>
              <textarea
                className="form-textarea split-textarea"
                placeholder="Write your post in Markdown..."
                value={form.content}
                onChange={set('content')}
              />
            </div>
            <div className={`split-pane split-pane-preview ${editorTab === 'preview' ? 'active' : ''}`}>
              <div className="prose">
                {form.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
                ) : (
                  <p style={{ color: 'var(--text-light)' }}>Preview will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {errors.content && <div className="form-error">{errors.content}</div>}
        <div className="form-hint">
          {form.content.split(' ').filter(Boolean).length} words · {calculateReadTime(form.content)}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tags (comma separated)</label>
        <input className="form-input" placeholder="react, javascript, frontend" value={form.tags} onChange={set('tags')} />
        <div className="form-hint">Up to 5 tags recommended.</div>
        {uniqueTags.length > 0 && (
          <div className="tags" style={{ marginTop: 8 }}>
            {uniqueTags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
