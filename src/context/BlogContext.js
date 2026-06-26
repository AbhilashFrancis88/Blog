import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BlogContext = createContext();

const SAMPLE_POSTS = [
  {
    id: uuidv4(),
    title: 'Getting Started with React in 2024',
    excerpt: 'React continues to evolve. In this post, we explore hooks, context, and the patterns that make modern React development a joy.',
    content: `React has come a long way since its introduction in 2013. Today, with hooks and functional components at the center, writing React feels more intuitive than ever.\n\nThe key patterns to master in 2024 are:\n\n**1. Custom Hooks** — Extract and reuse stateful logic across components without changing the component hierarchy.\n\n**2. Context API** — Manage global state without heavy libraries for small to medium applications.\n\n**3. Server Components** — With Next.js leading the way, React Server Components are changing how we think about data fetching.\n\nDiving into these patterns will make your React code cleaner, more maintainable, and far easier to test. Start small — refactor one component at a time.`,
    author: 'Arjun Menon',
    category: 'Technology',
    tags: ['React', 'JavaScript', 'Frontend'],
    date: new Date('2024-03-10').toISOString(),
    readTime: 5,
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
  {
    id: uuidv4(),
    title: 'The Art of Minimalist Writing',
    excerpt: 'Good writing isn\'t about using more words. It\'s about using the right ones. Here\'s how to say more with less.',
    content: `Every word in a sentence earns its place, or it doesn't belong there.\n\nMinimalist writing isn't sparse — it's precise. Hemingway called it the Iceberg Theory: the dignity of movement of an iceberg is due to only one-eighth of it being above water.\n\nPractical rules to write with less:\n\n**Cut adverbs ruthlessly.** If your verb needs an adverb to be effective, find a stronger verb.\n\n**One idea per paragraph.** When a paragraph holds two ideas, split it. Breathing room is not wasted space.\n\n**Read aloud.** Your ear catches what your eye misses. If you stumble, so will your reader.\n\nWriting is rewriting. The first draft is just thinking out loud.`,
    author: 'Priya Nair',
    category: 'Writing',
    tags: ['Writing', 'Craft', 'Minimalism'],
    date: new Date('2024-03-05').toISOString(),
    readTime: 4,
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  },
  {
    id: uuidv4(),
    title: 'Kerala Monsoon: A Travel Diary',
    excerpt: 'June in Kerala is not for the faint-hearted. It\'s for those who find magic in rain-soaked backwaters and misty hill stations.',
    content: `The first thing that hits you is the smell. Wet earth, jasmine, and something unnameable — the collective exhale of a landscape finally getting what it needed.\n\nThe Kerala monsoon arrives like a promise kept. The Arabian Sea turns iron-grey. Coconut palms bend without breaking. And everywhere, green — impossible, insistent green.\n\n**Alleppey Backwaters** — Take a houseboat not in August when it's crowded, but in June when the rain pelts the roof and you're the only boat on the canal. The silence between rain bursts is extraordinary.\n\n**Munnar** — At 1600 metres, the mist doesn't lift until 10 AM. Drink your tea before it does. The tea estates vanishing into cloud is worth every wet sock.\n\nTravel in monsoon is an act of faith. Pack light, carry layers, and leave the itinerary loose.`,
    author: 'Rahul Krishnan',
    category: 'Travel',
    tags: ['Kerala', 'Travel', 'Monsoon'],
    date: new Date('2024-02-28').toISOString(),
    readTime: 6,
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  },
];

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('blog-posts');
    return saved ? JSON.parse(saved) : SAMPLE_POSTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('blog-posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (postData) => {
    const newPost = {
      ...postData,
      id: uuidv4(),
      date: new Date().toISOString(),
      readTime: Math.max(1, Math.ceil(postData.content.split(' ').length / 200)),
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id, postData) => {
    setPosts(prev => prev.map(p =>
      p.id === id
        ? { ...p, ...postData, readTime: Math.max(1, Math.ceil(postData.content.split(' ').length / 200)) }
        : p
    ));
  };

  const deletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const getPost = (id) => posts.find(p => p.id === id);

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <BlogContext.Provider value={{
      posts, filteredPosts, categories, activeCategory, setActiveCategory,
      searchQuery, setSearchQuery, addPost, updatePost, deletePost, getPost,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
