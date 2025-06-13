# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site blog with a custom theme called "pyonk". The blog is bilingual (Japanese/English) and features both regular blog posts and a photography gallery. The site is deployed to GitHub Pages at `https://pyonk.github.io/blog/`.

## Architecture

### Hugo Site Structure
- **Custom Theme**: Located in `themes/pyonk/` - a completely custom Hugo theme built from scratch
- **Bilingual Support**: Japanese (default) and English with language-specific content and menus
- **Content Types**: 
  - Blog posts in `content/posts/`
  - Gallery photos in `content/gallery/`
- **Asset Pipeline**: Uses Hugo Pipes for CSS and JavaScript processing

### Theme Architecture
The theme was originally designed for Preact but was converted to vanilla JavaScript:

- **Layouts**: 
  - `_default/baseof.html` - Base template with Hugo Pipes integration
  - `gallery/` - Custom gallery layouts for photo display
  - `tags/` and `categories/` - Taxonomy pages
- **Assets**: 
  - `assets/css/style.css` - Single comprehensive CSS file with CSS custom properties
  - `assets/js/main.js` - Vanilla JavaScript with ES6+ classes
- **Partials**: Modular components (header, footer, menu, etc.)

### JavaScript Architecture
The theme uses vanilla JavaScript with class-based components:
- `ThemeToggle` - Dark/light mode switching with localStorage persistence
- `MobileMenu` - Responsive navigation
- `ReadingProgress` - Article reading progress indicator
- `SmoothScroll` - Enhanced scrolling behavior

### CSS Architecture
- **CSS Custom Properties**: Extensive use of CSS variables for theming
- **Theme System**: Light/dark themes with automatic system preference detection
- **Component-based**: Each UI component has dedicated CSS sections
- **Responsive**: Mobile-first design with breakpoints at 684px and 900px

## Development Commands

### Local Development
```bash
# Start Hugo development server (from project root)
hugo server --buildDrafts --buildFuture

# Start with specific port and bind to all interfaces
hugo server --port 1313 --bind 0.0.0.0 --buildDrafts --buildFuture
```

### Building
```bash
# Build static site for production
hugo

# Build with minification
hugo --minify
```

### Content Management
```bash
# Create new blog post
hugo new posts/post-name/index.md

# Create new gallery entry
hugo new gallery/photo-name/index.md
```

## Language Configuration

The site uses Hugo's multilingual features:
- **Default Language**: Japanese (`ja`)
- **Available Languages**: Japanese (`ja`) and English (`en`)
- **Language-specific menus**: Gallery links display as "わいがとった" (Japanese) or "waigatotta" (English)
- **Content Structure**: Use `.ja.md` suffix for Japanese-specific content

## Gallery System

The custom gallery system supports:
- **EXIF Data Extraction**: Automatically reads camera settings from image files
- **Image Processing**: Hugo's image processing for responsive images
- **Grid Layout**: Full-width responsive grid with hover overlays
- **Single Photo Pages**: Detailed view with EXIF data display

### Gallery Content Structure
```markdown
---
title: "Photo Title"
date: 2024-01-15
image: "gallery/photo-folder/image.jpg"
location: "Location Name"
camera: "Camera Model" # Optional, can be read from EXIF
caption: "Photo description"
---
```

## Styling Guidelines

- **CSS Variables**: Always use CSS custom properties for colors, spacing, and other design tokens
- **Theme Consistency**: Ensure all new components support both light and dark themes
- **Responsive Design**: Test at mobile (684px), tablet (900px), and desktop breakpoints
- **Animation**: Use existing transition variables (`--transition-fast`, `--transition-normal`, `--transition-slow`)

## Asset Processing

- **CSS**: Single file at `themes/pyonk/assets/css/style.css` processed by Hugo Pipes
- **JavaScript**: Main file at `themes/pyonk/assets/js/main.js` with minification
- **Static Assets**: Place in `static/` for direct copying or `assets/` for processing

## Important Configuration

### Social Links
Configure in `config.toml`:
```toml
[params]
  github = "https://github.com/username"
  linkedin = "https://linkedin.com/in/username"
```

### Theme Settings
```toml
[params]
  defaultTheme = "light"  # or "dark"
  showReadingTime = true
  contentTypeName = "posts"
```

## Common Issues

1. **EXIF Data Display**: Aperture and focal length values are stored as fractions in EXIF (e.g., "14/5" for f/2.8) and require calculation for proper display
2. **CSS Syntax Errors**: Ensure CSS custom property definitions don't have syntax errors (e.g., trailing text after values)
3. **Image Sizing**: Gallery images use different sizing rules than regular post images
4. **Language Switching**: Menu items and page titles must have corresponding language-specific configurations

## File Organization

- **Content**: All content in `content/` with language-specific files using `.ja.md` suffix
- **Static Assets**: Images and other static files in `static/` or `assets/` depending on processing needs
- **Theme Development**: All theme code in `themes/pyonk/`
- **Public**: Generated site output (ignored in git)