import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BlogProvider } from './context/BlogContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <BlogProvider>
        <ToastProvider>
          <BrowserRouter>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/new" element={<PostForm />} />
                <Route path="/edit/:id" element={<PostForm />} />
              </Routes>
            </main>
          </BrowserRouter>
        </ToastProvider>
      </BlogProvider>
    </ThemeProvider>
  );
}
