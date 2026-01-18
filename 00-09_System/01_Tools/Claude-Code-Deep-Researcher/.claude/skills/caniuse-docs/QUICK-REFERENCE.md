# CanIUse Quick Reference

Fast lookup for commonly queried browser compatibility information.

## Most Commonly Queried Features

### Layout & Display

| Feature | File | Modern Support |
|---------|------|----------------|
| Flexbox | `flexbox.md` | All modern browsers |
| CSS Grid | `css-grid.md` | All modern browsers |
| Subgrid | `css-subgrid.md` | Firefox, Safari, Chrome 117+ |
| Container Queries | `css-container-queries.md` | Chrome 105+, Safari 16+, Firefox 110+ |
| Aspect Ratio | `mdn-css_properties_aspect-ratio.md` | All modern browsers |

### CSS Properties

| Feature | File | Modern Support |
|---------|------|----------------|
| CSS Variables | `css-variables.md` | All modern browsers |
| CSS Nesting | `css-nesting.md` | Chrome 112+, Safari 17.2+, Firefox 117+ |
| :has() Selector | `css-has.md` | Chrome 105+, Safari 15.4+, Firefox 121+ |
| @layer | `css-cascade-layers.md` | All modern browsers |
| gap (flexbox) | `flexbox-gap.md` | All modern browsers |

### JavaScript Features

| Feature | File | Modern Support |
|---------|------|----------------|
| ES6 Classes | `es6-class.md` | All modern browsers |
| Async/Await | `async-functions.md` | All modern browsers |
| Fetch API | `fetch.md` | All modern browsers |
| ES Modules | `es6-module.md` | All modern browsers |
| Optional Chaining | `mdn-javascript_operators_optional_chaining.md` | All modern browsers |
| Nullish Coalescing | `mdn-javascript_operators_nullish_coalescing.md` | All modern browsers |

### APIs

| Feature | File | Modern Support |
|---------|------|----------------|
| Service Workers | `serviceworkers.md` | All modern browsers |
| Web Workers | `webworkers.md` | All modern browsers |
| WebSockets | `websockets.md` | All modern browsers |
| WebGL | `webgl.md` | All modern browsers |
| WebGL2 | `webgl2.md` | All modern browsers |
| WebGPU | `webgpu.md` | Chrome 113+, Firefox behind flag |
| Geolocation | `geolocation.md` | All modern browsers |
| IndexedDB | `indexeddb.md` | All modern browsers |

### Media & Graphics

| Feature | File | Modern Support |
|---------|------|----------------|
| WebP Images | `webp.md` | All modern browsers |
| AVIF Images | `avif.md` | Chrome 85+, Firefox 93+, Safari 16+ |
| SVG | `svg.md` | All modern browsers |
| Canvas | `canvas.md` | All modern browsers |
| Picture Element | `picture.md` | All modern browsers |

### Forms & Input

| Feature | File | Modern Support |
|---------|------|----------------|
| Date Input | `input-datetime.md` | Varies by browser |
| Color Input | `input-color.md` | All modern browsers |
| Datalist | `datalist.md` | All modern browsers |
| Form Validation | `form-validation.md` | All modern browsers |

## Browser Market Share Considerations

### Tier 1: Must Support (>5% global usage)
- Chrome (desktop & mobile)
- Safari (desktop & iOS)
- Edge
- Firefox
- Samsung Internet

### Tier 2: Should Support (1-5% usage)
- Opera
- UC Browser
- Android Browser

### Tier 3: Consider (declining/regional)
- Internet Explorer (EOL)
- Opera Mini
- QQ Browser
- Baidu Browser
- KaiOS

## Feature Detection Patterns

### CSS Feature Detection

```css
/* @supports query */
@supports (display: grid) {
  .container { display: grid; }
}

/* Fallback pattern */
.container {
  display: flex; /* Fallback */
  display: grid; /* Modern */
}
```

### JavaScript Feature Detection

```javascript
// API existence check
if ('serviceWorker' in navigator) {
  // Service Workers supported
}

// Method existence check
if (typeof Array.prototype.flat === 'function') {
  // Array.flat() supported
}

// CSS feature from JS
if (CSS.supports('display', 'grid')) {
  // CSS Grid supported
}
```

## Polyfill Recommendations

### Layout
- **Flexbox**: Generally not needed for IE11+
- **CSS Grid**: css-grid-polyfill (limited)

### JavaScript
- **Fetch**: whatwg-fetch, unfetch
- **Promises**: es6-promise
- **ES6 Features**: core-js, babel-polyfill
- **IntersectionObserver**: intersection-observer

### HTML
- **Picture/srcset**: picturefill
- **Details/Summary**: details-polyfill
- **Dialog**: dialog-polyfill

## IE11 Compatibility Checklist

Features NOT supported in IE11:
- CSS Grid (partial with -ms- prefix)
- CSS Variables
- ES6 Modules
- Fetch API
- Service Workers
- WebP images
- Flexbox gap property
- CSS :is(), :where(), :has()

Features WITH support in IE11:
- Flexbox (with some bugs)
- ES5 JavaScript
- Canvas
- SVG (mostly)
- XMLHttpRequest
- localStorage/sessionStorage

## Safari iOS Gotchas

Watch out for these Safari-specific issues:
- **100vh**: Doesn't account for browser chrome
- **Position: fixed**: Issues in scrolling containers
- **PWA**: Limited compared to Android
- **Web Push**: Not supported until Safari 16+
- **Background Sync**: Not supported

## File Naming Conventions

Feature files follow these patterns:
- Hyphenated names: `css-grid.md`, `web-share.md`
- MDN prefixed: `mdn-css_properties_aspect-ratio.md`
- API names: `geolocation.md`, `websockets.md`
- Numbered versions: `webgl2.md`, `es6.md`

## Search Strategies

### Find all CSS features
```
Glob "Resources/CanIUse/docs/features/*css*.md"
```

### Find features by keyword
```
rg "WebKit" Resources/CanIUse/docs/features/
```

### Find partially supported features
```
rg -l "Partial" Resources/CanIUse/docs/features/
```

### Find features added in specific Chrome version
```
rg "Chrome 100" Resources/CanIUse/docs/features/
```
