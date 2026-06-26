import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

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

export default function PostCard({ post, onDeleted }) {
  const { deletePost } = useBlog();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleDelete = () => {
    deletePost(post.id);
    setShowConfirm(false);
    onDeleted && onDeleted();
  };

  return (
    <>
      <article className="post-card">
        {post.cover
          ? <img className="post-card-cover" src={post.cover} alt={post.title} loading="lazy" />
          : <div className="post-card-cover-placeholder">📝</div>
        }
        <div className="post-card-body">
          <div className="post-card-meta">
            <span className="post-category">{post.category}</span>
            <span className="dot">·</span>
            <span className="post-readtime">{post.readTime} min read</span>
            <span className="dot">·</span>
            <span className="post-date">{formatDate(post.date)}</span>
          </div>

          <h2
            className="post-card-title"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            {post.title}
          </h2>

          <p className="post-card-excerpt">{post.excerpt}</p>

          {post.tags?.length > 0 && (
            <div className="tags">
              {post.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}

          <div className="post-card-footer">
            <span className="post-author">by {post.author}</span>
            <div className="post-card-actions">
              <button className="action-btn action-edit" onClick={() => navigate(`/edit/${post.id}`)}>Edit</button>
              <button className="action-btn action-delete" onClick={() => setShowConfirm(true)}>Delete</button>
            </div>
          </div>
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
