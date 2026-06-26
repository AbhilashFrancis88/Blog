# Inkwell — React Blog App

A full-featured blog application with CRUD functionality, dark/light theme, and search.

## Features

- **Create** posts with title, excerpt, content, author, category, tags, and cover image
- **Read** all posts on the home page or open individual post detail pages
- **Update** any post via the Edit button
- **Delete** posts with a confirmation modal
- **Search** posts by title, excerpt, author, or tag
- **Filter** by category
- **Dark / Light theme** toggle (persisted to localStorage)
- Data persisted to **localStorage** — survives page refresh

## Setup & Run

Make sure you have **Node.js 16+** installed.

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

The app opens at **http://localhost:3000**

## Project Structure

```
src/
  context/
    ThemeContext.js   — Dark/light theme provider
    BlogContext.js    — CRUD state, search, filter
  components/
    Navbar.js         — Top navigation bar
    PostCard.js       — Blog card with edit/delete
    Toast.js          — Toast notification system
  pages/
    Home.js           — Post grid with hero + filters
    PostDetail.js     — Full post view
    PostForm.js       — Create / Edit form
  App.js              — Routes
  index.css           — All styles (CSS variables for theming)
```

## Tech Stack

- React 18 + React Router v6
- No UI library — pure CSS with CSS variables
- localStorage for persistence
- UUID for post IDs
- Google Fonts: Lora (serif) + Inter (sans)
