import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useBlog } from '../context/BlogContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useBlog();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">Ink<span>well</span></Link>

        <div className="search-bar">
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
