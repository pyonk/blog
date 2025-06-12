// Theme Toggle Functionality
class ThemeToggle {
  constructor() {
    this.currentTheme = this.getInitialTheme();
    this.init();
  }

  getInitialTheme() {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme';
  }

  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Create theme toggle button
    this.createToggleButton();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark-theme' : 'light-theme';
        this.applyTheme(this.currentTheme);
        this.updateToggleIcon();
      }
    });
  }

  createToggleButton() {
    const containers = document.querySelectorAll('.theme-toggle-container');
    containers.forEach(container => {
      const button = document.createElement('button');
      button.className = 'theme-toggle';
      button.setAttribute('aria-label', 'Toggle theme');
      button.innerHTML = this.getToggleIcon();
      button.addEventListener('click', () => this.toggle());
      container.appendChild(button);
    });
  }

  getToggleIcon() {
    if (this.currentTheme === 'light-theme') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>`;
    }
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.applyTheme(this.currentTheme);
    this.updateToggleIcon();
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    document.body.className = document.body.className.replace(/(light|dark)-theme/g, '');
    document.body.classList.add(theme);
  }

  updateToggleIcon() {
    const buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(button => {
      button.innerHTML = this.getToggleIcon();
    });
  }
}

// Mobile Menu Toggle
class MobileMenu {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createMenuToggle();
  }

  createMenuToggle() {
    const containers = document.querySelectorAll('.menu-toggle-container');
    containers.forEach(container => {
      const button = document.createElement('button');
      button.className = 'menu-trigger';
      button.setAttribute('aria-label', 'Toggle menu');
      button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      `;
      button.addEventListener('click', () => this.toggle());
      container.appendChild(button);
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('menu--active', this.isOpen);
    }
  }
}

// Reading Progress Bar
class ReadingProgress {
  constructor() {
    this.progress = 0;
    this.init();
  }

  init() {
    // Only initialize on post pages
    if (document.querySelector('article') || document.querySelector('.post')) {
      this.createProgressBar();
      this.bindScrollEvent();
    }
  }

  createProgressBar() {
    const container = document.createElement('div');
    container.className = 'reading-progress-container';
    
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    
    const fill = document.createElement('div');
    fill.className = 'reading-progress__bar';
    
    bar.appendChild(fill);
    container.appendChild(bar);
    document.body.appendChild(container);
    
    this.progressBar = fill;
  }

  bindScrollEvent() {
    let ticking = false;
    
    const updateProgress = () => {
      const article = document.querySelector('article') || document.querySelector('.post');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const current = Math.max(0, -rect.top);
      const percentage = Math.min(100, Math.max(0, (current / total) * 100));
      
      this.progress = percentage;
      this.progressBar.style.width = `${percentage}%`;
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    updateProgress(); // Initial calculation
  }
}

// Smooth Scroll for Anchor Links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }
}

// Enhanced animations and interactions
class EnhancedUI {
  constructor() {
    this.init();
  }

  init() {
    this.addHoverEffects();
    this.addFocusEffects();
    this.addLoadAnimations();
  }

  addHoverEffects() {
    // Add subtle hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .post-entry');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      });
    });
  }

  addFocusEffects() {
    // Improve keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea');
    focusableElements.forEach(el => {
      el.addEventListener('focus', () => {
        el.style.outline = '2px solid var(--accent)';
        el.style.outlineOffset = '2px';
      });
      el.addEventListener('blur', () => {
        el.style.outline = '';
        el.style.outlineOffset = '';
      });
    });
  }

  addLoadAnimations() {
    // Fade in content on load
    const content = document.querySelector('.content');
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 100);
    }
  }
}

// Initialize everything when DOM is ready
function initializeTheme() {
  console.log('Initializing pyonk theme...');
  
  // Initialize all components
  new ThemeToggle();
  new MobileMenu();
  new ReadingProgress();
  new SmoothScroll();
  new EnhancedUI();
  
  console.log('Theme initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
  initializeTheme();
}