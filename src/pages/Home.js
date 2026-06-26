import React from 'react';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';

export default function Home() {
  const { filteredPosts, categories, activeCategory, setActiveCategory, searchQuery } = useBlog();

  return (
    <>
      {!searchQuery && (
        <div className="hero">
          <div className="hero-inner">
            <span className="hero-label">Your personal blog</span>
            <h1 className="hero-title">Ideas worth writing down</h1>
            <p className="hero-sub">Create, edit, and share posts on any topic that moves you.</p>
          </div>
        </div>
      )}

      <div className="page-container">
        {!searchQuery && (
          <div className="category-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {searchQuery && (
          <div className="page-header">
            <h2 className="page-title">Search results</h2>
            <p className="page-subtitle">"{searchQuery}" — {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found</p>
          </div>
        )}

        {filteredPosts.length > 0 && !searchQuery && (
          <div className="posts-count">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</div>
        )}

        <div className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{searchQuery ? '🔍' : '📭'}</div>
              <div className="empty-title">{searchQuery ? 'No results found' : 'No posts yet'}</div>
              <div className="empty-text">
                {searchQuery
                  ? `Try a different search term.`
                  : 'Be the first to write something great.'}
              </div>
              {!searchQuery && (
                <a className="btn btn-primary" href="/new">Write your first post</a>
              )}
            </div>
          ) : (
            filteredPosts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </>
  );
}
