import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useBlog } from '../context/BlogContext';
import Logo from './Logo';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useBlog();
  const navigate = useNavigate();

  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const b = JSON.parse(localStorage.getItem('inkwell_bookmarks')) || [];
        setBookmarkCount(b.length);
      } catch { setBookmarkCount(0); }
    };
    update();
    window.addEventListener('storage', update);
    const interval = setInterval(update, 1000);
    return () => { window.removeEventListener('storage', update); clearInterval(interval); };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo"><Logo /> Ink<span>well</span></Link>

        <div className="search-bar navbar-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1 }}>✕</button>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/reading-list" className="btn-icon nav-bookmark-btn" title="Reading List">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            {bookmarkCount > 0 && <span className="nav-badge">{bookmarkCount}</span>}
          </Link>
          <button className="btn-icon" onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/new')}>
            <span>✏️</span> Write
          </button>
        </div>
      </div>
    </nav>
  );
}
