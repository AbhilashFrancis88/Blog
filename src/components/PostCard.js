import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { calculateReadTime } from '../utils/readTime';

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

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
  );
}

export default function PostCard({ post, onDeleted, searchQuery, viewMode }) {
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

  // Likes from localStorage
  let likeCount = 0;
  try { likeCount = (JSON.parse(localStorage.getItem('inkwell_likes')) || {})[post.id] || 0; } catch {}

  // Bookmarks
  let bookmarks = [];
  try { bookmarks = JSON.parse(localStorage.getItem('inkwell_bookmarks')) || []; } catch {}
  const [isBookmarked, setIsBookmarked] = useState(bookmarks.includes(post.id));

  const toggleBookmark = (e) => {
    e.stopPropagation();
    let current = [];
    try { current = JSON.parse(localStorage.getItem('inkwell_bookmarks')) || []; } catch {}
    const next = isBookmarked ? current.filter(b => b !== post.id) : [...current, post.id];
    localStorage.setItem('inkwell_bookmarks', JSON.stringify(next));
    setIsBookmarked(!isBookmarked);
  };

  if (viewMode === 'list') {
    return (
      <>
        <article className="post-card post-card-list" onClick={() => navigate(`/post/${post.id}`)}>
          {post.cover && (
            <img className="post-card-list-thumb" src={post.cover} alt={post.title} loading="lazy" />
          )}
          <div className="post-card-list-body">
            <div className="post-card-meta">
              <span className="post-category">{post.category}</span>
              <span className="dot">·</span>
              <span className="post-date">{formatDate(post.date)}</span>
              <span className="dot">·</span>
              <span className="post-readtime">{calculateReadTime(post.content)}</span>
            </div>
            <h2 className="post-card-title">{highlightText(post.title, searchQuery)}</h2>
            <p className="post-card-excerpt">{post.excerpt}</p>
            <div className="post-card-list-footer">
              <span className="post-author">by {post.author}</span>
              {post.tags?.length > 0 && (
                <div className="tags tags-inline">
                  {post.tags.slice(0, 3).map(t => (
                    <Link key={t} to={`/?tag=${encodeURIComponent(t)}`} className="tag tag-link" onClick={e => e.stopPropagation()}>{t}</Link>
                  ))}
                </div>
              )}
              <div className="post-card-stats">
                <span className="stat-like">❤️ {likeCount}</span>
              </div>
            </div>
          </div>
          <button className={`bookmark-btn bookmark-btn-card ${isBookmarked ? 'active' : ''}`} onClick={toggleBookmark} title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
            {isBookmarked ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            )}
          </button>
        </article>
        {showConfirm && (
          <ConfirmModal title="Delete this post?" text={`"${post.title}" will be permanently removed.`} onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <article className="post-card">
        <button className={`bookmark-btn bookmark-btn-card ${isBookmarked ? 'active' : ''}`} onClick={toggleBookmark} title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
          {isBookmarked ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          )}
        </button>

        {post.cover ? (
          <img className="post-card-cover" src={post.cover} alt={post.title} loading="lazy" />
        ) : (
          <div className="post-card-cover-placeholder">📝</div>
        )}
        <div className="post-card-body">
          <div className="post-card-meta">
            <span className="post-category">{post.category}</span>
            <span className="dot">·</span>
            <span className="post-readtime">{calculateReadTime(post.content)}</span>
            <span className="dot">·</span>
            <span className="post-date">{formatDate(post.date)}</span>
          </div>

          <h2
            className="post-card-title"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            {highlightText(post.title, searchQuery)}
          </h2>

          <p className="post-card-excerpt">{post.excerpt}</p>

          {post.tags?.length > 0 && (
            <div className="tags">
              {post.tags.slice(0, 3).map(t => (
                <Link key={t} to={`/?tag=${encodeURIComponent(t)}`} className="tag tag-link">{t}</Link>
              ))}
            </div>
          )}

          <div className="post-card-footer">
            <span className="post-author">by {post.author}</span>
            <div className="post-card-actions">
              <span className="stat-like">❤️ {likeCount}</span>
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
