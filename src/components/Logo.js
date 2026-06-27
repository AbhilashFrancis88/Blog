import React from 'react';

export default function Logo({ size = 28 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      style={{ display: 'block' }}
    >
      <path
        d="M20 4 L28 18 C28 18 30 22 30 26 C30 31.5 25.5 36 20 36 C14.5 36 10 31.5 10 26 C10 22 12 18 12 18 Z"
        fill="var(--accent)"
      />
      <ellipse cx="20" cy="27" rx="5" ry="4.5" fill="var(--accent-hover)" opacity="0.5" />
      <line x1="20" y1="4" x2="20" y2="22" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
