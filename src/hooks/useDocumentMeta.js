import { useEffect } from 'react';

const DEFAULTS = {
  title: 'Inkwell — Where Ideas Find Their Voice',
  description: 'Inkwell is a minimal blog for reading and writing ideas.',
  image: 'https://inkwellbogs.vercel.app/og-image.png',
  url: 'https://inkwellbogs.vercel.app',
};

function setMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`) ||
           document.querySelector(`meta[name="${property}"]`);
  if (el) el.setAttribute('content', content);
}

export default function useDocumentMeta({ title, description, image, url }) {
  useEffect(() => {
    document.title = title || DEFAULTS.title;
    setMeta('og:title', title || DEFAULTS.title);
    setMeta('og:description', description || DEFAULTS.description);
    setMeta('og:image', image || DEFAULTS.image);
    setMeta('og:url', url || DEFAULTS.url);
    setMeta('twitter:title', title || DEFAULTS.title);
    setMeta('twitter:description', description || DEFAULTS.description);

    return () => {
      document.title = DEFAULTS.title;
      setMeta('og:title', DEFAULTS.title);
      setMeta('og:description', DEFAULTS.description);
      setMeta('og:image', DEFAULTS.image);
      setMeta('og:url', DEFAULTS.url);
      setMeta('twitter:title', DEFAULTS.title);
      setMeta('twitter:description', DEFAULTS.description);
    };
  }, [title, description, image, url]);
}
