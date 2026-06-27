import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';

export default function Home() {
  const { posts, filteredPosts, categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useBlog();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') || '';
  const searchRef = useRef(null);

  // Sort & view from localStorage
  const [sortMode, setSortMode] = useState(() => localStorage.getItem('inkwell_sort') || 'newest');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('inkwell_view_mode') || 'grid');

  // Local search with debounce
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(localSearch), 300);
    return () => clearTimeout(debounceRef.current);
  }, [localSearch, setSearchQuery]);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setLocalSearch('');
        setSearchQuery('');
        searchRef.current.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSearchQuery]);

  useEffect(() => { localStorage.setItem('inkwell_sort', sortMode); }, [sortMode]);
  useEffect(() => { localStorage.setItem('inkwell_view_mode', viewMode); }, [viewMode]);

  const clearTag = () => {
    searchParams.delete('tag');
    setSearchParams(searchParams);
  };

  // Tag filter → then context filter → then sort
  let displayPosts = activeTag
    ? filteredPosts.filter(p => (p.tags || []).some(t => t.toLowerCase() === activeTag.toLowerCase()))
    : filteredPosts;

  // Sort
  const getLikes = useCallback(() => {
    try { return JSON.parse(localStorage.getItem('inkwell_likes')) || {}; } catch { return {}; }
  }, []);

  displayPosts = useMemo(() => {
    const arr = [...displayPosts];
    if (sortMode === 'oldest') arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortMode === 'most_liked') {
      const likes = getLikes();
      arr.sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0));
    } else {
      arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return arr;
  }, [displayPosts, sortMode, getLikes]);

  // All tags across posts for sidebar
  const tagCounts = useMemo(() => {
    const counts = {};
    posts.forEach(p => (p.tags || []).forEach(t => {
      const lower = t.toLowerCase();
      counts[lower] = (counts[lower] || 0) + 1;
    }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutHint = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <>
      {!searchQuery && !activeTag && (
        <div className="hero">
          <div className="hero-inner">
            <span className="hero-label">Your personal blog</span>
            <h1 className="hero-title">Ideas worth writing down</h1>
            <p className="hero-sub">Create, edit, and share posts on any topic that moves you.</p>
          </div>
        </div>
      )}

      <div className="page-container home-layout">
        <div className="home-main">
          {/* Search */}
          <div className="home-search-bar">
            <span className="search-icon">🔍</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search posts..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="home-search-input"
            />
            {localSearch && (
              <button onClick={() => { setLocalSearch(''); setSearchQuery(''); }} className="search-clear">✕</button>
            )}
            <span className="search-shortcut">{shortcutHint}</span>
          </div>

          {/* Tag filter indicator */}
          {activeTag && (
            <div className="filter-indicator">
              Showing posts tagged: <strong>#{activeTag}</strong>
              <button onClick={clearTag} className="filter-clear">✕</button>
            </div>
          )}

          {!searchQuery && !activeTag && (
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
              <p className="page-subtitle">"{searchQuery}" — {displayPosts.length} post{displayPosts.length !== 1 ? 's' : ''} found</p>
            </div>
          )}

          {/* Sort + View controls */}
          <div className="controls-row">
            {displayPosts.length > 0 && !searchQuery && (
              <div className="posts-count">{displayPosts.length} post{displayPosts.length !== 1 ? 's' : ''}</div>
            )}
            <div className="controls-right">
              <select className="sort-select" value={sortMode} onChange={e => setSortMode(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="most_liked">Most liked</option>
              </select>
              <div className="view-toggle">
                <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                </button>
                <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className={viewMode === 'list' ? 'posts-list' : 'posts-grid'}>
            {displayPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{searchQuery ? '🔍' : '📭'}</div>
                <div className="empty-title">{searchQuery ? `No posts found for "${searchQuery}"` : activeTag ? `No posts tagged #${activeTag}` : 'No posts yet'}</div>
                <div className="empty-text">
                  {searchQuery
                    ? <button className="btn btn-ghost" onClick={() => { setLocalSearch(''); setSearchQuery(''); }}>Clear search</button>
                    : activeTag
                    ? <button className="btn btn-ghost" onClick={clearTag}>Clear filter</button>
                    : 'Be the first to write something great.'}
                </div>
                {!searchQuery && !activeTag && (
                  <a className="btn btn-primary" href="/new">Write your first post</a>
                )}
              </div>
            ) : (
              displayPosts.map(post => (
                <PostCard key={post.id} post={post} searchQuery={searchQuery} viewMode={viewMode} />
              ))
            )}
          </div>
        </div>

        {/* Tags Sidebar — desktop only */}
        {tagCounts.length > 0 && (
          <aside className="tags-sidebar">
            <h3 className="sidebar-title">Popular Tags</h3>
            <div className="tag-cloud">
              {tagCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  className={`tag tag-link ${activeTag === tag ? 'tag-active' : ''}`}
                  onClick={() => {
                    if (activeTag === tag) clearTag();
                    else setSearchParams({ tag });
                  }}
                >
                  #{tag} ({count})
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
