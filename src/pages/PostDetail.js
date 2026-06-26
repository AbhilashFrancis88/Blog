import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../components/Toast';

function ConfirmModal({ title, text, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="modal-text">{text}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function PostDetail() {
  const { id } = useParams();
  const { getPost, deletePost } = useBlog();
  const navigate = useNavigate();
  const showToast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const post = getPost(id);

  if (!post) {
    return (
      <div className="post-detail">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Post not found</div>
          <div className="empty-text">This post may have been deleted or moved.</div>
          <Link to="/" className="btn btn-primary">Go home</Link>
        </div>
      </div>
    );
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDelete = () => {
    deletePost(post.id);
    showToast('Post deleted');
    navigate('/');
  };

  const renderContent = (text) =>
    text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      // Bold **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    });

  return (
    <>
      <article className="post-detail">
        <button className="post-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {post.cover && (
          <img className="post-detail-cover" src={post.cover} alt={post.title} />
        )}

        <header className="post-detail-header">
          <span className="post-detail-category">{post.category}</span>
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <span>By <strong>{post.author}</strong></span>
            <span className="dot">·</span>
            <span>{formatDate(post.date)}</span>
            <span className="dot">·</span>
            <span>{post.readTime} min read</span>
          </div>
          {post.tags?.length > 0 && (
            <div className="tags" style={{ marginTop: 14 }}>
              {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </header>

        <hr className="post-detail-divider" />

        <div className="post-detail-content">
          {renderContent(post.content)}
        </div>

        <div className="post-detail-actions">
          <button className="btn btn-ghost" onClick={() => navigate(`/edit/${post.id}`)}>
            ✏️ Edit Post
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}>
            🗑 Delete
          </button>
        </div>
      </article>

      {showConfirm && (
        <ConfirmModal
          title="Delete this post?"
          text={`"${post.title}" will be permanently removed.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
