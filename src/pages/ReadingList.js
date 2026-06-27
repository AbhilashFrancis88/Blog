import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';

export default function ReadingList() {
  const { posts } = useBlog();
  const [viewMode] = useState(() => localStorage.getItem('inkwell_view_mode') || 'grid');

  const bookmarks = (() => {
    try { return JSON.parse(localStorage.getItem('inkwell_bookmarks')) || []; } catch { return []; }
  })();

  const bookmarkedPosts = posts.filter(p => bookmarks.includes(p.id));

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Reading List ({bookmarkedPosts.length})</h2>
        <p className="page-subtitle">Posts you've saved for later</p>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          </div>
          <div className="empty-title">Your reading list is empty</div>
          <div className="empty-text">Bookmark posts to save them here for later reading.</div>
          <Link to="/" className="btn btn-primary">Browse Posts</Link>
        </div>
      ) : (
        <div className={viewMode === 'list' ? 'posts-list' : 'posts-grid'}>
          {bookmarkedPosts.map(post => (
            <PostCard key={post.id} post={post} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}
