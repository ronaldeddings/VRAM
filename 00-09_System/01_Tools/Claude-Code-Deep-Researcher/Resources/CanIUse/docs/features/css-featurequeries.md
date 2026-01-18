# CSS Feature Queries

## Overview

CSS Feature Queries (`@supports`) allow web authors to condition CSS rules based on whether particular property declarations are supported in the browser using the `@supports` at-rule. This enables graceful degradation and progressive enhancement strategies by detecting CSS feature support at runtime.

**Current Support:** 93.24% global coverage
**Last Updated:** 2025

---

## Specification

- **Status:** Candidate Recommendation (CR)
- **W3C Specification:** [CSS Conditional Rules Module Level 3 - @supports](https://www.w3.org/TR/css3-conditional/#at-supports)

---

## Categories

- CSS3

---

## What is CSS Feature Queries?

### Key Concepts

CSS Feature Queries provide a native CSS mechanism to test whether specific CSS properties and values are supported by the browser. Unlike browser detection or user-agent sniffing, feature queries test actual CSS support dynamically.

### Syntax

```css
@supports (property: value) {
  /* CSS rules applied if property is supported */
}

/* Using logical operators */
@supports (property1: value1) and (property2: value2) {
  /* Both features must be supported */
}

@supports (property1: value1) or (property2: value2) {
  /* At least one feature must be supported */
}

@supports not (property: value) {
  /* Applied if property is NOT supported */
}
```

### JavaScript API

Feature detection is also available through the DOM API:

```javascript
// Basic feature detection
const supportsGrid = CSS.supports('display', 'grid');

// Supports method can also take a complete declaration
const supportsCustomProps = CSS.supports('--custom-property: value');

// Logical operations
const supportsFlexOrGrid = CSS.supports('display', 'flex') ||
                           CSS.supports('display', 'grid');
```

---

## Benefits and Use Cases

### 1. Progressive Enhancement

Serve advanced CSS features to supporting browsers while providing fallback styles for older browsers:

```css
/* Base styles for all browsers */
.container {
  display: flex;
  flex-wrap: wrap;
}

/* Enhanced layout for browsers with CSS Grid */
@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
```

### 2. Feature-Specific Styling

Adjust styling based on specific CSS feature support without JavaScript:

```css
/* Fallback for older browsers */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

/* Enhanced styling with CSS backdrop filter */
@supports (backdrop-filter: blur(10px)) {
  .card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: none;
  }
}
```

### 3. Avoiding CSS Parse Errors

Isolate experimental or new CSS syntax to prevent parsing errors in unsupporting browsers:

```css
@supports (display: flex) {
  .flex-layout {
    display: flex;
  }
}

@supports (display: grid) {
  .grid-layout {
    display: grid;
    gap: 1rem;
  }
}
```

### 4. Conditional Font Features

Test support for advanced font features:

```css
@supports (font-feature-settings: "smcp") {
  .small-caps {
    font-feature-settings: "smcp";
  }
}
```

### 5. Layout Method Selection

Choose optimal layout methods based on browser capabilities:

```css
/* Default flexbox layout */
.layout {
  display: flex;
  flex-direction: row;
}

/* Upgrade to subgrid if available */
@supports (grid-template-columns: subgrid) {
  .layout {
    display: grid;
    grid-template-columns: subgrid;
  }
}
```

### 6. Animation and Transform Support

Apply advanced animations only where supported:

```css
@supports (animation-timeline: view()) {
  .scroll-animation {
    animation: slide-in linear;
    animation-timeline: view();
  }
}
```

---

## Browser Support

### Summary Table

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Chrome** | 28 | Full support |
| **Firefox** | 22 | Full support |
| **Safari** | 9 | Full support |
| **Edge** | 12 | Full support |
| **Opera** | 12.1 | Full support |
| **iOS Safari** | 9.0+ | Full support |
| **Android Browser** | 4.4 | Full support |
| **Internet Explorer** | None | Not supported |

### Detailed Browser Versions

#### Desktop Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 28+ | ✅ Supported |
| Firefox | 22+ | ✅ Supported |
| Safari | 9+ | ✅ Supported |
| Edge | 12+ | ✅ Supported |
| Opera | 12.1+ | ✅ Supported |
| Internet Explorer | 5.5-11 | ❌ Not supported |

#### Mobile Browsers

| Platform | Version | Status |
|----------|---------|--------|
| iOS Safari | 9.0+ | ✅ Supported |
| Android Browser | 4.4+ | ✅ Supported |
| Chrome Mobile | All recent | ✅ Supported |
| Firefox Mobile | All recent | ✅ Supported |
| Samsung Internet | 4+ | ✅ Supported |
| Opera Mobile | 80+ | ✅ Supported |
| UC Browser | 15.5+ | ✅ Supported |
| Opera Mini | All versions | ✅ Supported |

#### Legacy/Unsupported Browsers

| Browser | Status |
|---------|--------|
| IE 5.5-11 | ❌ Not supported |
| BlackBerry 7, 10 | ❌ Not supported |
| Mobile IE 10, 11 | ❌ Not supported |

---

## Known Issues and Bugs

### 1. Chrome 28-29 and Opera 15-16 Bug

**Issue:** Using `@supports` on Chrome 28-29 and Opera 15-16 breaks following `:not` selectors.

**Impact:** Selectors that come after an `@supports` rule may not function correctly in these versions.

**Workaround:** Avoid using `:not` selectors immediately after `@supports` blocks in stylesheets.

**Reference:** [Chromium Bug #257695](https://bugs.chromium.org/p/chromium/issues/detail?id=257695)

### 2. Safari Font Feature Detection

**Issue:** Safari incorrectly claims to support certain `font-feature-settings` values that it does not actually support.

**Impact:** Feature detection may report support for font features that don't work in Safari.

**Workaround:** Use the JavaScript module [font-feature-fibbing](https://github.com/kennethormandy/font-feature-fibbing) to provide accurate feature detection for font features in Safari.

**Example:**
```javascript
// Unreliable in Safari without workaround
const supportsSmallCaps = CSS.supports('font-feature-settings', '"smcp"');

// Use font-feature-fibbing for accurate detection
import { supports } from 'font-feature-fibbing';
const actuallySupported = supports('smcp');
```

---

## Implementation Guidelines

### Best Practices

1. **Use Feature Queries Instead of Browser Detection**
   ```javascript
   // Good
   if (CSS.supports('display', 'grid')) {
     // Apply grid-based layout
   }

   // Avoid
   if (navigator.userAgent.includes('Chrome')) {
     // Browser detection is unreliable
   }
   ```

2. **Combine with Fallback Styles**
   ```css
   /* Always provide base styles */
   .container {
     display: flex;
   }

   /* Then enhance if supported */
   @supports (display: grid) {
     .container {
       display: grid;
     }
   }
   ```

3. **Test Complex Declarations**
   ```css
   /* Test complete property-value pairs */
   @supports (background: linear-gradient(to right, red, blue)) {
     .gradient {
       background: linear-gradient(to right, red, blue);
     }
   }
   ```

4. **Use Logical Operators for Multiple Features**
   ```css
   /* Require multiple features */
   @supports (display: grid) and (gap: 1rem) {
     .grid {
       display: grid;
       gap: 1rem;
     }
   }
   ```

5. **Document Feature Requirements**
   ```javascript
   // Document which features your styles depend on
   const requiredFeatures = {
     gridLayout: 'display: grid',
     cssVariables: '--variable: value',
     backdropFilter: 'backdrop-filter: blur(1px)'
   };
   ```

### Common Use Cases

#### Progressive Grid Layout

```css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

@supports (display: grid) {
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
```

#### Conditional Variables

```css
:root {
  --primary-color: blue;
}

@supports (--css: variables) {
  :root {
    --primary-color: #007bff;
  }
}

.button {
  background-color: var(--primary-color, blue);
}
```

#### Modern Backdrop Effects

```css
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

@supports (backdrop-filter: blur(10px)) {
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }
}
```

---

## Related Features

- **[CSS.supports() DOM API](css-supports-api)** - JavaScript API for feature detection
- **[CSS Grid Layout](css-grid)** - Modern layout system often detected with @supports
- **[CSS Flexbox](css-flexbox)** - Flexible layout method
- **[CSS Custom Properties (Variables)](css-variables)** - Dynamic values that can be feature-detected
- **[CSS Conditional Rules](css-conditional)** - Base specification for @supports

---

## Resources

### Official Documentation

- [MDN Web Docs - CSS @supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)
- [WebPlatform Documentation](https://webplatform.github.io/docs/css/atrules/supports)
- [W3C CSS Conditional Rules Specification](https://www.w3.org/TR/css3-conditional/)

### Articles and Tutorials

- [@supports in Firefox](https://mcc.id.au/blog/2012/08/supports)
- [Test case and examples](https://dabblet.com/gist/3895764)

### Tools and Polyfills

- [font-feature-fibbing](https://github.com/kennethormandy/font-feature-fibbing) - Accurate font feature detection for Safari
- [Can I use - CSS Feature Queries](https://caniuse.com/css-featurequeries)

---

## Migration Notes

### From Browser Detection to Feature Queries

If you have legacy code using browser detection, migrate to `@supports`:

```javascript
// Legacy approach (avoid)
const isChrome = /Chrome/.test(navigator.userAgent);
if (isChrome) {
  applyGridStyles();
}

// Modern approach (preferred)
if (CSS.supports('display', 'grid')) {
  applyGridStyles();
}
```

### Fallback Consideration for IE

Since Internet Explorer does not support feature queries, ensure your base styles work without them:

```css
/* Works in all browsers */
.container {
  display: flex;
}

/* Enhanced layout, ignored by IE */
@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
```

---

## Summary

CSS Feature Queries (`@supports`) provide a robust, standards-based mechanism for feature detection in CSS and JavaScript. With 93.24% global browser support and adoption across all modern browsers, it's the recommended approach for progressive enhancement and graceful degradation strategies. The few remaining edge cases and quirks are well-documented and have established workarounds.

**Recommendation:** Use CSS Feature Queries as your primary method for handling browser capability differences in modern web applications.
