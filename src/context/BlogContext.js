import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BlogContext = createContext();

const POST_IDS = [
  'demo-react-2024',
  'demo-minimalist-writing',
  'demo-kerala-monsoon',
  'demo-coffee-science',
  'demo-city-night-photography',
];

const SAMPLE_POSTS = [
  {
    id: POST_IDS[0],
    title: 'Getting Started with React in 2024',
    excerpt: 'React continues to evolve. In this post, we explore hooks, context, and the patterns that make modern React development a joy.',
    content: `React has come a long way since its introduction in 2013. Today, with hooks and functional components at the center, writing React feels more intuitive than ever.

## Key Patterns to Master

### 1. Custom Hooks

Extract and reuse stateful logic across components without changing the component hierarchy.

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

### 2. Context API

Manage global state without heavy libraries for small to medium applications.

### 3. Server Components

With Next.js leading the way, React Server Components are changing how we think about data fetching.

> Diving into these patterns will make your React code cleaner, more maintainable, and far easier to test.

Start small — refactor one component at a time. Here's a quick checklist:

- [ ] Convert class components to functional
- [ ] Replace HOCs with custom hooks
- [x] Use \`useReducer\` for complex state
- [x] Add error boundaries

| Pattern | Difficulty | Impact |
|---------|-----------|--------|
| Custom Hooks | Medium | High |
| Context API | Easy | Medium |
| Server Components | Hard | High |`,
    author: 'Arjun Menon',
    category: 'Technology',
    tags: ['react', 'javascript', 'frontend'],
    date: new Date('2024-03-10').toISOString(),
    readTime: 5,
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
  {
    id: POST_IDS[1],
    title: 'The Art of Minimalist Writing',
    excerpt: "Good writing isn't about using more words. It's about using the right ones. Here's how to say more with less.",
    content: `Every word in a sentence earns its place, or it doesn't belong there.

Minimalist writing isn't sparse — it's **precise**. Hemingway called it the *Iceberg Theory*: the dignity of movement of an iceberg is due to only one-eighth of it being above water.

## Practical Rules to Write With Less

### Cut Adverbs Ruthlessly

If your verb needs an adverb to be effective, find a stronger verb.

> "Don't tell me the moon is shining; show me the glint of light on broken glass." — Anton Chekhov

### One Idea Per Paragraph

When a paragraph holds two ideas, split it. Breathing room is not wasted space.

### Read Aloud

Your ear catches what your eye misses. If you stumble, so will your reader.

---

Writing is rewriting. The first draft is just thinking out loud. The magic happens in revision:

1. Write freely — don't edit as you go
2. Step away for at least an hour
3. Cut 20% of the words on second pass
4. Read it aloud on the third pass
5. Ship it before perfectionism wins`,
    author: 'Priya Nair',
    category: 'Writing',
    tags: ['writing', 'craft', 'minimalism'],
    date: new Date('2024-03-05').toISOString(),
    readTime: 4,
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  },
  {
    id: POST_IDS[2],
    title: 'Kerala Monsoon: A Travel Diary',
    excerpt: "June in Kerala is not for the faint-hearted. It's for those who find magic in rain-soaked backwaters and misty hill stations.",
    content: `The first thing that hits you is the smell. Wet earth, jasmine, and something unnameable — the collective exhale of a landscape finally getting what it needed.

The Kerala monsoon arrives like a promise kept. The Arabian Sea turns iron-grey. Coconut palms bend without breaking. And everywhere, green — impossible, insistent green.

## Alleppey Backwaters

Take a houseboat not in August when it's crowded, but in **June** when the rain pelts the roof and you're the only boat on the canal. The silence between rain bursts is extraordinary.

![Backwaters](https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80)

## Munnar

At 1600 metres, the mist doesn't lift until 10 AM. Drink your tea before it does. The tea estates vanishing into cloud is worth every wet sock.

### Packing List for Monsoon Travel

- Waterproof bag covers (not optional)
- Quick-dry clothing
- Waterproof phone pouch
- Extra socks — at least 4 pairs
- A good book for the indoor hours

> Travel in monsoon is an act of faith. Pack light, carry layers, and leave the itinerary loose.`,
    author: 'Rahul Krishnan',
    category: 'Travel',
    tags: ['travel', 'kerala', 'nature'],
    date: new Date('2024-02-28').toISOString(),
    readTime: 6,
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  },
  {
    id: POST_IDS[3],
    title: 'The Science Behind Your Morning Coffee',
    excerpt: 'From bean chemistry to brain receptors — why that first cup works, and how to make it work better.',
    content: `That first sip of coffee in the morning isn't just a ritual — it's a biochemical event. Here's what happens in the 20 minutes after your first cup.

## Caffeine and Adenosine

Caffeine works by **blocking adenosine receptors** in your brain. Adenosine is the molecule that makes you feel sleepy — it accumulates throughout the day. Caffeine doesn't remove adenosine; it just blocks the receptors so your brain can't "hear" the tiredness signal.

### The Half-Life Problem

Caffeine has a half-life of about **5-6 hours**. That means if you drink a cup at 3 PM with 200mg of caffeine, you still have ~100mg in your system at 9 PM.

\`\`\`
Morning cup:    ████████████████████░░░░░░ (peak at 45 min)
After 5 hours:  ██████████░░░░░░░░░░░░░░░ (half remaining)
After 10 hours: █████░░░░░░░░░░░░░░░░░░░░ (quarter remaining)
\`\`\`

## Brewing for Flavour

The extraction rate depends on:

| Variable | Impact | Sweet Spot |
|----------|--------|------------|
| Temperature | High | 92-96°C |
| Grind size | High | Medium for drip |
| Brew time | Medium | 4-5 minutes |
| Water ratio | Medium | 1:16 |

> "Coffee is a lot more than just a drink; it's something happening." — Gertrude Stein

### Quick Tips

1. Grind beans fresh — flavour degrades within 30 minutes
2. Use filtered water (tap water minerals affect taste)
3. Don't boil the water — it burns the grounds
4. Wait 15-20 minutes after waking before your first cup`,
    author: 'Meera Iyer',
    category: 'Science',
    tags: ['coffee', 'science', 'health'],
    date: new Date('2024-03-15').toISOString(),
    readTime: 5,
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  },
  {
    id: POST_IDS[4],
    title: 'Night Photography in the City',
    excerpt: 'Long exposures, neon reflections, and the art of finding light after dark — a practical guide for urban night photography.',
    content: `The city transforms after sunset. Harsh midday light gives way to neon, streetlamps, and the warm glow of windows. For photographers, this is when things get interesting.

## Gear You Actually Need

You don't need expensive gear. Here's the minimum:

- **Any camera with manual mode** (even a phone with a pro mode)
- **A tripod** — non-negotiable for long exposures
- A remote shutter release (or use the self-timer)

### Camera Settings for Night

\`\`\`
Aperture:     f/8 - f/11 (sharp across the frame)
Shutter:      2-30 seconds (experiment!)
ISO:          100-400 (keep it low)
White balance: Tungsten or manual ~3500K
\`\`\`

## Techniques

### Light Trails

Find a busy intersection. Set your shutter to **15-30 seconds**. The cars disappear, but their headlights and taillights paint the road in rivers of red and white.

### Rain Reflections

The best night photos happen *after* rain. Wet streets become mirrors, doubling every light source. Shoot low — get the camera near ground level.

### The Blue Hour

The 20-30 minutes after sunset when the sky is deep blue — not yet black. This is the **single best time** for city photography because you get both artificial lights and a coloured sky.

> The best camera is the one you have with you. The best time is right now.

## Post-Processing Tips

1. Shoot RAW — always
2. Reduce highlights, boost shadows
3. Add a slight **blue-orange split tone** for that cinematic look
4. Straighten your horizons — nothing ruins a cityscape faster than a tilted horizon`,
    author: 'Vikram Das',
    category: 'Arts',
    tags: ['photography', 'city', 'creative'],
    date: new Date('2024-03-18').toISOString(),
    readTime: 7,
    cover: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
  },
];

const INITIAL_LIKES = {
  [POST_IDS[0]]: 12,
  [POST_IDS[1]]: 8,
  [POST_IDS[2]]: 15,
  [POST_IDS[3]]: 6,
  [POST_IDS[4]]: 10,
};

function seedLikes() {
  const existing = localStorage.getItem('inkwell_likes');
  if (!existing) {
    localStorage.setItem('inkwell_likes', JSON.stringify(INITIAL_LIKES));
  }
}

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('blog-posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) { /* fall through */ }
    }
    return SAMPLE_POSTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    seedLikes();
  }, []);

  useEffect(() => {
    localStorage.setItem('blog-posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (postData) => {
    const tagList = typeof postData.tags === 'string'
      ? postData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : (postData.tags || []);
    const uniqueTags = [...new Set(tagList)];
    const newPost = {
      ...postData,
      tags: uniqueTags,
      id: uuidv4(),
      date: new Date().toISOString(),
      readTime: Math.max(1, Math.ceil(postData.content.split(' ').length / 200)),
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id, postData) => {
    const tagList = typeof postData.tags === 'string'
      ? postData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : (postData.tags || []);
    const uniqueTags = [...new Set(tagList)];
    setPosts(prev => prev.map(p =>
      p.id === id
        ? { ...p, ...postData, tags: uniqueTags, readTime: Math.max(1, Math.ceil(postData.content.split(' ').length / 200)) }
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
