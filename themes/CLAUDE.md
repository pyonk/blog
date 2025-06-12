# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a Hugo blog repository with a themes directory containing:
- `hello-friend`: A legacy Hugo theme (no longer maintained but functional)
- `pyonk`: A modern custom theme with Preact components (currently active)

The main blog configuration is at `config.toml` which currently uses the "pyonk" theme.

## Common Development Commands

### Hugo Commands
- `hugo server -D`: Run development server including draft posts
- `hugo server --port 1314`: Run on alternate port if 1313 is busy
- `hugo`: Build the site for production

### Pyonk Theme Development (Preact-based)
The active pyonk theme uses modern web technologies:

**Build Commands (run from `/themes/pyonk/`):**
- `npm install`: Install dependencies (Preact, esbuild)
- `npm run build`: Build Preact components for production (minified)
- `npm run build:dev`: Build with sourcemaps for development
- `npm run watch`: Watch mode - auto-rebuild on file changes

**Architecture:**
- Preact components in `assets/js/main.jsx` compiled via esbuild
- CSS in `assets/css/style.css` with CSS custom properties for theming
- Hugo layouts in `layouts/` directory with Preact component containers
- JavaScript bundle output to `static/js/main.js`

### Content Structure
- Main blog content is in `content/posts/`
- Each post can be either a single markdown file or a directory with `index.md` + assets
- Images and assets are stored alongside posts in bundle format

## Pyonk Theme Features

**Interactive Preact Components:**
- Theme toggle (dark/light) with localStorage persistence and system preference detection
- Mobile menu toggle with responsive behavior
- Reading progress bar for article pages

**Hugo Integration:**
- Complete layouts for single posts, list pages, and taxonomy pages
- Japanese language support with i18n translations
- Responsive design with mobile-first approach
- Modern CSS with custom properties for theming

**Key Configuration (config.toml):**
- `theme = "pyonk"`: Active theme
- `defaultTheme`: "light" or "dark"
- `contentTypeName = "posts"`: Content directory for posts
- `showReadingTime = true`: Display reading time estimates
- Google Analytics configured via `services.googleAnalytics.ID`

## Development Workflow

1. **Theme Development:** Work in `/themes/pyonk/` directory
2. **Component Changes:** Edit `assets/js/main.jsx`, then run `npm run build`
3. **Style Changes:** Edit `assets/css/style.css` (no build step needed)
4. **Layout Changes:** Edit Hugo templates in `layouts/` (no build step needed)
5. **Testing:** Use `hugo server -D` from blog root directory

## Important Notes

- Preact components must be built before Hugo can serve them
- Theme uses modern Hugo template syntax (e.g., `.Site.Config.Services.GoogleAnalytics.ID`)
- Blog is configured for GitHub Pages deployment with Japanese as primary language
- CSS custom properties enable seamless dark/light theme switching