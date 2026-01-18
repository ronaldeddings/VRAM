# Phase 2: Revolutionary CSS Architecture

Execute Phase 2 of Implementation Plan 9 - Modern CSS with browser compatibility verification.

## Pre-Checks

### Browser Compatibility Verification

Before using any CSS feature, verify support using caniuse-docs skill:

```
Read Resources/CanIUse/docs/features/css-cascade-layers.md
Read Resources/CanIUse/docs/features/css-container-queries.md
Read Resources/CanIUse/docs/features/css-has.md
Read Resources/CanIUse/docs/features/css-nesting.md
Read Resources/CanIUse/docs/features/css-subgrid.md
Read Resources/CanIUse/docs/features/backdrop-filter.md
```

Target browsers: Chrome 106+, Safari 16+, iOS Safari 16+, Brave

## Implementation Checklist

### 2.1 CSS Cascade Layers (`css/layers.css`)

Create `src/web/public/css/layers.css`:

```css
/*
 * CSS Cascade Layers
 * Browser Support: 92%+ (Chrome 99+, Safari 15.4+, iOS 15.4+)
 * Verified via caniuse-docs skill
 */

/* Layer order determines priority (later = higher priority) */
@layer reset, base, theme, layout, components, utilities, states;

/* Reset layer - Browser normalization */
@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    min-height: 100dvh;
    line-height: 1.5;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  button, input, select, textarea {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }
}

/* Base layer - Element defaults */
@layer base {
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                 Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.25;
  }

  code, pre {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Code',
                 'Fira Code', Consolas, monospace;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  ::selection {
    background-color: var(--accent-primary);
    color: var(--color-bg-primary);
  }
}
```

### 2.2 Design Token System (`css/theme.css`)

Create `src/web/public/css/theme.css`:

```css
/*
 * Design Token System with CSS Custom Properties
 * Browser Support: 93%+ (Chrome 49+, Safari 10+, iOS 10+)
 * Uses oklch() for perceptually uniform colors
 */

@layer theme {
  :root {
    /* Color Palette - Dark Mode First */
    --color-bg-primary: oklch(15% 0.02 280);
    --color-bg-secondary: oklch(20% 0.03 280);
    --color-bg-elevated: oklch(25% 0.04 280);
    --color-bg-hover: oklch(28% 0.04 280);

    /* Text Colors */
    --color-text-primary: oklch(95% 0.01 280);
    --color-text-secondary: oklch(75% 0.02 280);
    --color-text-muted: oklch(55% 0.02 280);

    /* Glass Morphism */
    --glass-bg: oklch(20% 0.02 280 / 0.7);
    --glass-blur: 20px;
    --glass-border: oklch(100% 0 0 / 0.1);

    /* Accent Colors */
    --accent-primary: oklch(70% 0.2 250);
    --accent-primary-hover: oklch(75% 0.22 250);
    --accent-success: oklch(75% 0.2 150);
    --accent-warning: oklch(80% 0.2 80);
    --accent-error: oklch(65% 0.25 25);
    --accent-info: oklch(70% 0.15 220);

    /* Typography Scale - Fluid with clamp() */
    --font-size-xs: clamp(0.7rem, 0.65rem + 0.25vw, 0.8rem);
    --font-size-sm: clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem);
    --font-size-base: clamp(0.9rem, 0.85rem + 0.25vw, 1rem);
    --font-size-lg: clamp(1.1rem, 1rem + 0.5vw, 1.25rem);
    --font-size-xl: clamp(1.3rem, 1.1rem + 1vw, 1.5rem);
    --font-size-2xl: clamp(1.8rem, 1.5rem + 1.5vw, 2.5rem);
    --font-size-3xl: clamp(2.2rem, 1.8rem + 2vw, 3.5rem);

    /* Spacing Scale */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;

    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-2xl: 24px;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.1);
    --shadow-md: 0 4px 6px oklch(0% 0 0 / 0.15);
    --shadow-lg: 0 8px 16px oklch(0% 0 0 / 0.2);
    --shadow-xl: 0 16px 48px oklch(0% 0 0 / 0.25);

    /* Animation */
    --transition-fast: 150ms ease-out;
    --transition-medium: 300ms ease-out;
    --transition-slow: 500ms ease-out;
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Light Theme Override */
  @media (prefers-color-scheme: light) {
    :root {
      --color-bg-primary: oklch(98% 0.01 280);
      --color-bg-secondary: oklch(95% 0.02 280);
      --color-bg-elevated: oklch(100% 0 0);
      --color-bg-hover: oklch(92% 0.02 280);

      --color-text-primary: oklch(15% 0.02 280);
      --color-text-secondary: oklch(35% 0.02 280);
      --color-text-muted: oklch(50% 0.02 280);

      --glass-bg: oklch(100% 0 0 / 0.7);
      --glass-border: oklch(0% 0 0 / 0.1);

      --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
      --shadow-md: 0 4px 6px oklch(0% 0 0 / 0.08);
      --shadow-lg: 0 8px 16px oklch(0% 0 0 / 0.1);
      --shadow-xl: 0 16px 48px oklch(0% 0 0 / 0.12);
    }
  }

  /* Manual theme toggle support */
  [data-theme="light"] {
    --color-bg-primary: oklch(98% 0.01 280);
    --color-bg-secondary: oklch(95% 0.02 280);
    --color-bg-elevated: oklch(100% 0 0);
    --color-text-primary: oklch(15% 0.02 280);
    --color-text-secondary: oklch(35% 0.02 280);
    --glass-bg: oklch(100% 0 0 / 0.7);
  }
}
```

### 2.3 Layout with Container Queries (`css/layout.css`)

Create `src/web/public/css/layout.css`:

```css
/*
 * Layout System with Container Queries, Subgrid, and CSS Nesting
 * Container Queries: 90.6% (Chrome 106+, Safari 16+, iOS 16+)
 * Subgrid: 86.6% (Chrome 117+, Safari 16+, iOS 16+)
 * CSS Nesting: 85% (Chrome 120+, Safari 17.2+, iOS 17.2+)
 */

@layer layout {
  /* Main App Layout */
  .app-layout {
    display: grid;
    grid-template-columns: minmax(200px, 280px) 1fr;
    min-height: 100dvh;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  /* Sidebar */
  .sidebar {
    position: sticky;
    top: 0;
    height: 100dvh;
    padding: var(--space-4);
    border-right: 1px solid var(--glass-border);
    overflow-y: auto;

    @media (max-width: 768px) {
      position: fixed;
      left: 0;
      width: 280px;
      transform: translateX(-100%);
      transition: transform var(--transition-medium);
      z-index: 100;

      &.open {
        transform: translateX(0);
      }
    }
  }

  /* Main Content */
  .main-content {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .page-header {
    position: sticky;
    top: 0;
    z-index: 50;
    padding: var(--space-4) var(--space-6);
    border-bottom: 1px solid var(--glass-border);

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);

    h1 {
      font-size: var(--font-size-xl);
      font-weight: 600;
    }
  }

  .content-area {
    flex: 1;
    padding: var(--space-6);
  }

  /* Container Query Card Layout */
  .card-container {
    container-type: inline-size;
    container-name: card;
  }

  /* Responsive card based on container, not viewport */
  @container card (width < 400px) {
    .card-content {
      flex-direction: column;
      gap: var(--space-3);
    }

    .card-stats {
      grid-template-columns: 1fr 1fr;
    }
  }

  @container card (width >= 400px) {
    .card-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--space-4);
    }

    .card-stats {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Session Grid with Subgrid */
  .sessions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-4);
  }

  .session-card {
    display: grid;
    grid-template-rows: auto 1fr auto;
    /* Use subgrid when available for perfect alignment */
  }

  @supports (grid-template-rows: subgrid) {
    .sessions-grid {
      grid-template-rows: repeat(auto-fill, subgrid);
    }

    .session-card {
      grid-row: span 3;
      grid-template-rows: subgrid;
    }
  }

  /* Analysis Grid */
  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-4);

    .analysis-card {
      grid-column: span 4;

      @media (max-width: 1200px) {
        grid-column: span 6;
      }

      @media (max-width: 768px) {
        grid-column: span 12;
      }
    }
  }
}
```

### 2.4 Components with CSS :has() and Nesting (`css/components.css`)

Create `src/web/public/css/components.css`:

```css
/*
 * Component Styles with :has() and Glass Morphism
 * :has(): 91% (Chrome 105+, Safari 15.4+, iOS 15.4+)
 * Backdrop-filter: 92.8% (Chrome 76+, Safari 18+, iOS 18+)
 */

@layer components {
  /* Glass Panel Base */
  .glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(180%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
  }

  /* Session Card */
  .session-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    transition: transform var(--transition-fast),
                box-shadow var(--transition-fast);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    /* CSS Nesting for internal elements */
    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);

      h3 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text-primary);
      }

      time {
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
      }
    }

    .session-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: var(--space-2);
      margin-bottom: var(--space-3);

      .stat {
        text-align: center;
        padding: var(--space-2);
        background: var(--color-bg-secondary);
        border-radius: var(--radius-md);

        dt {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        dd {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-text-primary);
        }
      }
    }

    .session-actions {
      display: flex;
      gap: var(--space-2);
      justify-content: flex-end;
    }
  }

  /* CSS :has() for State-Based Styling */
  .form-group:has(input:focus) {
    --border-color: var(--accent-primary);
  }

  .form-group:has(input:invalid) {
    --border-color: var(--accent-error);
  }

  .validation-card:has(.error) {
    border-left: 4px solid var(--accent-error);
  }

  .validation-card:has(.warning) {
    border-left: 4px solid var(--accent-warning);
  }

  .sessions-list:has(:not(.session-item)) {
    display: grid;
    place-items: center;
    min-height: 200px;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    transition: all var(--transition-fast);

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    background: var(--accent-primary);
    color: var(--color-bg-primary);

    &:hover:not(:disabled) {
      background: var(--accent-primary-hover);
    }
  }

  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--glass-border);

    &:hover:not(:disabled) {
      background: var(--color-bg-hover);
    }
  }

  .btn-icon {
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-secondary);

    &:hover {
      background: var(--color-bg-hover);
      color: var(--color-text-primary);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  /* Navigation */
  .main-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);

    &:hover {
      background: var(--color-bg-hover);
      color: var(--color-text-primary);
    }

    &.active {
      background: var(--accent-primary);
      color: var(--color-bg-primary);
    }
  }

  /* Loading States */
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--color-bg-secondary) 0%,
      var(--color-bg-hover) 50%,
      var(--color-bg-secondary) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-md);
  }

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
}

/* Utilities Layer */
@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* States Layer - Highest Priority */
@layer states {
  .loading {
    opacity: 0.7;
    pointer-events: none;
  }

  .error {
    color: var(--accent-error);
  }

  .success {
    color: var(--accent-success);
  }

  [aria-busy="true"] {
    cursor: wait;
  }
}
```

## Quality Gates

### Gate 1: CSS Syntax Validation
Open in browser and check DevTools console for CSS errors.

### Gate 2: Browser Compatibility
Verify all features have 85%+ support using caniuse-docs.

### Gate 3: Visual Inspection
```bash
bun run src/web/server.ts
# Open http://localhost:3000 in Chrome, Safari, Brave
```

### Gate 4: Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Completion Criteria

- [ ] layers.css created with 7 cascade layers
- [ ] theme.css created with design tokens and light/dark themes
- [ ] layout.css created with container queries and subgrid
- [ ] components.css created with :has() and glass morphism
- [ ] All CSS validates without errors
- [ ] Works in Chrome, Safari, iOS Safari, Brave
- [ ] Reduced motion preferences respected

## Next Phase

After completing Phase 2, proceed to:
`/plan9:phase3` - View Transitions
