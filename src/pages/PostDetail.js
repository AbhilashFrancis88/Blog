import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../components/Toast';
import { calculateReadTime } from '../utils/readTime';
import useDocumentMeta from '../hooks/useDocumentMeta';

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

function ProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="progress-bar" style={{ width: `${width}%` }} />;
}

function getNameColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#C2622D', '#2D6BC2', '#2DAA6B', '#9B59B6', '#E07840', '#3498DB', '#E74C3C', '#1ABC9C'];
  return colors[Math.abs(hash) % colors.length];
}

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

export default function PostDetail() {
  const { id } = useParams();
  const { getPost, deletePost, posts } = useBlog();
  const navigate = useNavigate();
  const showToast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const post = getPost(id);

  // Likes
  const [likes, setLikes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inkwell_likes')) || {}; } catch { return {}; }
  });
  const [likedPosts, setLikedPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inkwell_liked_posts')) || []; } catch { return []; }
  });
  const isLiked = likedPosts.includes(id);
  const likeCount = likes[id] || 0;

  const toggleLike = () => {
    const newLiked = isLiked ? likedPosts.filter(p => p !== id) : [...likedPosts, id];
    const newCount = isLiked ? Math.max(0, likeCount - 1) : likeCount + 1;
    const newLikes = { ...likes, [id]: newCount };
    setLikedPosts(newLiked);
    setLikes(newLikes);
    localStorage.setItem('inkwell_liked_posts', JSON.stringify(newLiked));
    localStorage.setItem('inkwell_likes', JSON.stringify(newLikes));
  };

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inkwell_bookmarks')) || []; } catch { return []; }
  });
  const isBookmarked = bookmarks.includes(id);
  const toggleBookmark = () => {
    const next = isBookmarked ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem('inkwell_bookmarks', JSON.stringify(next));
    showToast(isBookmarked ? 'Removed from reading list' : 'Added to reading list');
  };

  // Comments
  const [allComments, setAllComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inkwell_comments')) || {}; } catch { return {}; }
  });
  const comments = (allComments[id] || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const [commentName, setCommentName] = useState('');
  const [commentBody, setCommentBody] = useState('');

  const commentValid = commentName.trim().length > 0 && commentName.length <= 40 &&
    commentBody.trim().length >= 10 && commentBody.length <= 500;

  const submitComment = () => {
    if (!commentValid) return;
    const comment = {
      id: Date.now().toString(),
      name: commentName.trim(),
      body: commentBody.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = { ...allComments, [id]: [...(allComments[id] || []), comment] };
    setAllComments(updated);
    localStorage.setItem('inkwell_comments', JSON.stringify(updated));
    setCommentName('');
    setCommentBody('');
  };

  // Share
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;
  const canNativeShare = typeof navigator.share === 'function';

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentUrl]);

  const nativeShare = () => {
    navigator.share({ title: post?.title, url: currentUrl }).catch(() => {});
  };

  // Dynamic meta
  const strippedDesc = post
    ? post.content.replace(/[#*_`>\[\]()!~|\\-]/g, '').slice(0, 160)
    : '';

  useDocumentMeta({
    title: post ? `${post.title} — Inkwell` : undefined,
    description: strippedDesc || undefined,
    image: post?.cover || undefined,
    url: currentUrl,
  });

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

  // Prev/Next — by date descending (newest first)
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentIdx = sorted.findIndex(p => p.id === id);
  const prevPost = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;
  const nextPost = currentIdx > 0 ? sorted[currentIdx - 1] : null;

  // Related posts — share at least one tag
  const postTags = (post.tags || []).map(t => t.toLowerCase());
  let related = posts
    .filter(p => p.id !== id && (p.tags || []).some(t => postTags.includes(t.toLowerCase())))
    .slice(0, 3);
  if (related.length === 0) {
    related = [...posts].filter(p => p.id !== id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }

  const truncate = (s, n) => s.length > n ? s.slice(0, n) + '...' : s;

  return (
    <>
      <ProgressBar />
      <article className="post-detail">
        <button className="post-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {post.cover && (
          <img className="post-detail-cover" src={post.cover} alt={post.title} />
        )}

        <header className="post-detail-header">
          <span className="post-detail-category">{post.category}</span>
          <div className="post-detail-title-row">
            <h1 className="post-detail-title">{post.title}</h1>
            <button
              className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
              onClick={toggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
            >
              {isBookmarked ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              )}
            </button>
          </div>
          <div className="post-detail-meta">
            <span>By <strong>{post.author}</strong></span>
            <span className="dot">·</span>
            <span>{formatDate(post.date)}</span>
            <span className="dot">·</span>
            <span>{calculateReadTime(post.content)}</span>
          </div>
          {post.tags?.length > 0 && (
            <div className="tags" style={{ marginTop: 14 }}>
              {post.tags.map(t => (
                <Link key={t} to={`/?tag=${encodeURIComponent(t)}`} className="tag tag-link">{t}</Link>
              ))}
            </div>
          )}
        </header>

        <hr className="post-detail-divider" />

        <div className="post-detail-content prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {/* Share */}
        <div className="share-section">
          <div className="share-label">Share this post</div>
          <div className="share-strip">
            {canNativeShare ? (
              <button className="share-btn" onClick={nativeShare}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            ) : (
              <>
                <a
                  className="share-btn"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Post
                </a>
                <a
                  className="share-btn"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </>
            )}
            <button className="share-btn" onClick={copyLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>

        {/* Likes */}
        <div className="like-section">
          <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={toggleLike}>
            <span className={`like-icon ${isLiked ? 'bounce' : ''}`}>
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="like-count">{likeCount}</span>
          </button>
        </div>

        <div className="post-detail-actions">
          <button className="btn btn-ghost" onClick={() => navigate(`/edit/${post.id}`)}>
            Edit Post
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}>
            Delete
          </button>
        </div>

        {/* Comments */}
        <div className="comments-section">
          <h3 className="comments-heading">Comments ({comments.length})</h3>

          <div className="comment-form">
            <input
              className="form-input"
              placeholder="Your name"
              value={commentName}
              onChange={e => setCommentName(e.target.value.slice(0, 40))}
              maxLength={40}
            />
            <textarea
              className="form-textarea comment-textarea"
              placeholder="Share your thoughts (min 10 characters)..."
              value={commentBody}
              onChange={e => setCommentBody(e.target.value.slice(0, 500))}
              maxLength={500}
            />
            <div className="comment-form-footer">
              <span className="comment-char-count">{commentBody.length} / 500</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={submitComment}
                disabled={!commentValid}
              >
                Post Comment
              </button>
            </div>
          </div>

          <div className="comment-thread">
            {comments.length === 0 ? (
              <div className="comment-empty">No comments yet. Be the first to share your thoughts!</div>
            ) : (
              comments.map(c => (
                <div key={c.id} className="comment">
                  <div className="comment-avatar" style={{ backgroundColor: getNameColor(c.name) }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <strong>{c.name}</strong>
                      <span className="comment-time">{relativeTime(c.createdAt)}</span>
                    </div>
                    <p>{c.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="related-section">
            <h3 className="related-heading">You might also like</h3>
            <div className="related-grid">
              {related.map(r => (
                <Link key={r.id} to={`/post/${r.id}`} className="related-card">
                  {r.cover && (
                    <img className="related-thumb" src={r.cover} alt={r.title} loading="lazy" />
                  )}
                  <div className="related-info">
                    <div className="related-title">{truncate(r.title, 60)}</div>
                    <div className="related-meta">{calculateReadTime(r.content)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next */}
        {(prevPost || nextPost) && (
          <div className="post-nav">
            {prevPost ? (
              <Link to={`/post/${prevPost.id}`} className="post-nav-link post-nav-prev">
                <span className="post-nav-label">← Previous</span>
                <span className="post-nav-title">{truncate(prevPost.title, 50)}</span>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link to={`/post/${nextPost.id}`} className="post-nav-link post-nav-next">
                <span className="post-nav-label">Next →</span>
                <span className="post-nav-title">{truncate(nextPost.title, 50)}</span>
              </Link>
            ) : <div />}
          </div>
        )}
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
