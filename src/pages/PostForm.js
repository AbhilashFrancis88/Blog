import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../components/Toast';

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

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);

    const tagList = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const data = { ...form, tags: tagList };

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
        <label className="form-label">Tags</label>
        <input className="form-input" placeholder="React, JavaScript, Frontend" value={form.tags} onChange={set('tags')} />
        <div className="form-hint">Comma-separated. Up to 5 tags recommended.</div>
      </div>

      <div className="form-group">
        <label className="form-label">Cover image URL</label>
        <input className="form-input" placeholder="https://images.unsplash.com/..." value={form.cover} onChange={set('cover')} />
        <div className="form-hint">Optional. Paste any direct image URL.</div>
        {form.cover && (
          <img
            src={form.cover}
            alt="Cover preview"
            style={{ marginTop: 10, maxHeight: 180, borderRadius: 8, objectFit: 'cover', width: '100%' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Content *</label>
        <textarea
          className="form-textarea"
          placeholder="Write your post here... Use **bold text** for emphasis."
          value={form.content}
          onChange={set('content')}
        />
        {errors.content && <div className="form-error">{errors.content}</div>}
        <div className="form-hint">
          {form.content.split(' ').filter(Boolean).length} words · ~{Math.max(1, Math.ceil(form.content.split(' ').filter(Boolean).length / 200))} min read
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? '⏳ Saving...' : isEdit ? '💾 Save changes' : '🚀 Publish'}
        </button>
      </div>
    </div>
  );
}
