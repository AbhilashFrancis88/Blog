export function calculateReadTime(content) {
  const stripped = content.replace(/[#*_`>\[\]()!~|\\-]/g, '');
  const words = stripped.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
