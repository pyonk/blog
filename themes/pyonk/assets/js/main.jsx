import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Theme Toggle Component
function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme';
    }
    return 'light-theme';
  });

  useEffect(() => {
    document.body.className = document.body.className.replace(/(light|dark)-theme/g, '');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light-theme' ? 'dark-theme' : 'light-theme');
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {theme === 'light-theme' ? (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        ) : (
          <circle cx="12" cy="12" r="5" />
        )}
      </svg>
    </button>
  );
}

// Menu Toggle Component
function MenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('menu--active', isOpen);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <button 
      className="menu-trigger" 
      onClick={toggleMenu}
      aria-label="Toggle menu"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

// Reading Progress Component
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article') || document.querySelector('.post');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const current = Math.max(0, -rect.top);
      const percentage = Math.min(100, Math.max(0, (current / total) * 100));
      
      setProgress(percentage);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="reading-progress">
      <div 
        className="reading-progress__bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Initialize components when DOM is ready
function initializeComponents() {
  console.log('Initializing Preact components...');
  
  // Theme toggle
  const themeContainer = document.querySelector('.theme-toggle-container');
  if (themeContainer) {
    console.log('Rendering ThemeToggle');
    render(<ThemeToggle />, themeContainer);
  } else {
    console.warn('Theme toggle container not found');
  }

  // Menu toggle
  const menuContainer = document.querySelector('.menu-toggle-container');
  if (menuContainer) {
    console.log('Rendering MenuToggle');
    render(<MenuToggle />, menuContainer);
  } else {
    console.log('Menu toggle container not found (expected if no menu items)');
  }

  // Reading progress (only on post pages)
  if (document.querySelector('article') || document.querySelector('.post')) {
    console.log('Rendering ReadingProgress');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    document.body.appendChild(progressContainer);
    render(<ReadingProgress />, progressContainer);
  }
  
  console.log('Preact components initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
  initializeComponents();
}