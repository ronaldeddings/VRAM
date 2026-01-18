# CSS `all` Property

## Overview

The CSS `all` property is a shorthand that resets all CSS properties to their initial or inherited values. It provides a powerful mechanism for clearing CSS styles except for the `direction` and `unicode-bidi` properties, which are not affected by this shorthand.

**Quick Stats:**
- Global browser support: **93.2%**
- Status: W3C Recommendation
- First supported: Chrome 37 (2014), Firefox 27 (2014)

## Specification

- **Status:** ![REC](https://img.shields.io/badge/status-Recommendation-brightgreen)
- **Specification URL:** [CSS Cascade Module Level 3 - All Shorthand](https://www.w3.org/TR/css-cascade-3/#all-shorthand)
- **Editor's Draft:** Part of the CSS Cascade specification family

## Categories

- **CSS** - Cascading Style Sheets

## Syntax

```css
/* Reset to initial values */
all: initial;

/* Reset to inherited values */
all: inherit;

/* Reset to unset (use initial if not inherited, inherit if inherited) */
all: unset;

/* Revert to user agent stylesheet or authored default */
all: revert;
```

## Values

| Value | Description |
|-------|-------------|
| `initial` | Sets all properties to their initial (default) values as defined by CSS specification |
| `inherit` | Sets all properties to their inherited values from parent element |
| `unset` | Uses `initial` for non-inherited properties, `inherit` for inherited properties |
| `revert` | Reverts cascade to user agent stylesheet or previous author-defined value |

## Benefits & Use Cases

### 1. Component Isolation
Create isolated, self-contained components that aren't affected by parent styles:

```css
/* Reset third-party widget to clean slate */
.widget {
  all: initial;
  /* Now define your component styles */
  color: blue;
  font-size: 14px;
}
```

### 2. Scoped Styling
Prevent style leakage in iframes or sandboxed content:

```css
/* Ensure iframe content isn't affected by outer styles */
iframe {
  all: initial;
}
```

### 3. Design System Consistency
Reset elements before applying design system tokens:

```css
/* Start with clean slate before applying token-based styles */
.ds-button {
  all: unset;
  display: inline-block;
  padding: var(--spacing-md);
  background: var(--color-primary);
}
```

### 4. Style Cascade Reset
Clean up inherited styles for specific sections:

```css
/* Legacy code cleanup - reset specific sections */
.legacy-reset {
  all: initial;
}
```

### 5. CSS-in-JS Integration
Helpful for CSS-in-JS libraries that need clean component boundaries:

```javascript
const Button = styled.button`
  all: unset;
  /* Define fresh styles */
`;
```

## Browser Support

### Current Support Status

| Browser | First Support | Notes |
|---------|---------------|-------|
| ![Chrome](https://img.shields.io/badge/Chrome-37+-brightgreen) | **37** (2014) | Full support |
| ![Firefox](https://img.shields.io/badge/Firefox-27+-brightgreen) | **27** (2014) | Full support |
| ![Safari](https://img.shields.io/badge/Safari-9.1+-brightgreen) | **9.1** (2015) | Full support |
| ![Edge](https://img.shields.io/badge/Edge-79+-brightgreen) | **79** (2020) | Full support (Chromium-based) |
| ![Opera](https://img.shields.io/badge/Opera-24+-brightgreen) | **24** (2014) | Full support |
| ![iOS Safari](https://img.shields.io/badge/iOS%20Safari-9.3+-brightgreen) | **9.3** (2016) | Full support |
| ![Android](https://img.shields.io/badge/Android-4.4.3+-brightgreen) | **4.4.3** (2014) | Full support |
| ![IE/IE Mobile](https://img.shields.io/badge/IE%2FIE%20Mobile-×-red) | **Not Supported** | No support in any IE version |
| ![Opera Mini](https://img.shields.io/badge/Opera%20Mini-×-red) | **Not Supported** | No support |

### Detailed Support Timeline

<details>
<summary><strong>Expanded Browser Support Details</strong></summary>

#### Desktop Browsers

**Chrome**
- ✅ Supported since version 37 (April 2014)
- Full support in all current versions (146+)

**Firefox**
- ✅ Supported since version 27 (February 2014)
- Full support in all current versions (148+)

**Safari**
- ✅ Supported since version 9.1 (March 2015)
- Full support in all current versions (18.5+)

**Edge (Chromium)**
- ✅ Supported since version 79 (January 2020)
- Full support in all current versions (143+)
- ❌ Legacy Edge (EdgeHTML) versions 12-18: No support

**Opera**
- ✅ Supported since version 24 (April 2014)
- Full support in all current versions (122+)

**Internet Explorer**
- ❌ Not supported in any version (5.5-11)

#### Mobile Browsers

**iOS Safari**
- ✅ Supported since version 9.3 (March 2016)
- Full support in all current versions (18.5+)

**Android Browser**
- ✅ Supported since version 4.4.3 (2014)
- Full support in all current versions

**Opera Mobile**
- ✅ Supported since version 80 (2020)
- Full support in current versions

**Opera Mini**
- ❌ Not supported in any version

**Samsung Internet**
- ✅ Supported since version 4 (2016)
- Full support in all current versions (29+)

**Other Mobile Browsers**
- ✅ Android Chrome: Supported (version 142+)
- ✅ Android Firefox: Supported (version 144+)
- ✅ UC Browser: Supported (version 15.5+)
- ✅ Baidu Browser: Supported (version 13.52+)
- ✅ QQ Browser: Supported (version 14.9+)
- ✅ KaiOS: Supported (version 2.5+)

</details>

### Support by Region

```
Global: 93.2% ✅ (Excellent coverage)

Gap: Primarily Internet Explorer (all versions) and Opera Mini
```

## Implementation Examples

### Basic Reset

```css
/* Reset all properties for an element */
.reset-element {
  all: initial;
}
```

### Selective Component Styling

```css
/* Create isolated component */
.modal {
  all: initial;

  /* Define modal styles from scratch */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  z-index: 1000;
}
```

### CSS-in-JS Library Pattern

```javascript
// Using styled-components
const StyledButton = styled.button`
  all: unset;

  display: inline-block;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;
```

### Third-party Widget Isolation

```css
/* Isolate third-party widget from page styles */
.external-widget {
  all: initial;
  all: revert; /* Use browser defaults */
  font: system-ui, -apple-system, sans-serif;
}
```

### Design System Reset

```css
/* Reset before applying design tokens */
.ds-component {
  all: unset;
  display: block;

  /* Apply design system variables */
  --color-primary: #007bff;
  --spacing: 1rem;

  color: var(--color-primary);
  padding: var(--spacing);
}
```

## Inheritance Behavior

The `all` property itself is **not inherited**, but its effects propagate through the cascade:

```css
.parent {
  all: unset;
}

.child {
  /* Inherits unset effect from parent's cascade changes */
  color: blue; /* Must be explicitly set */
}
```

## Known Behaviors & Considerations

### What `all` Resets

- All CSS properties listed in the specification
- Includes less common properties like `tab-size`, `text-align-last`, etc.
- Affects custom properties (CSS variables) - they become unset

### What `all` Does NOT Reset

- ❌ `direction` property
- ❌ `unicode-bidi` property
- ❌ Element default display behavior (use `display` property separately)

### Performance Notes

- No significant performance impact
- Generally faster than manually resetting individual properties
- Minimal rendering impact since it's a single cascading operation

### Compatibility Workarounds

For IE 11 and older browsers that don't support `all`:

```css
/* Fallback: Reset common properties individually */
.reset-fallback {
  /* Fallback for older browsers */
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  color: inherit;
  background: transparent;

  /* Modern browsers use this */
  all: unset;
}
```

## Related Resources

### Official Documentation
- **[MDN Web Docs - CSS all](https://developer.mozilla.org/en-US/docs/Web/CSS/all)**
  - Comprehensive guide with examples and specifications
  - Contains live interactive examples

### Related Reading
- **[Resetting Styles Using `all: unset`](https://mcc.id.au/blog/2013/10/all-unset)**
  - Deep dive into practical use cases
  - Compares different reset approaches

### Bug Reports & Issues
- **[WebKit Bug 116966: Add support for `all` shorthand property](https://bugs.webkit.org/show_bug.cgi?id=116966)**
  - Historical bug tracker for WebKit implementation

## Related CSS Properties

| Property | Purpose |
|----------|---------|
| `initial` | Global keyword for initial value |
| `inherit` | Global keyword for inherited value |
| `unset` | Global keyword combining initial/inherit |
| `revert` | Global keyword for user agent value |
| `display` | Control element layout (not affected by `all`) |
| `direction` | Text direction (not affected by `all`) |
| `unicode-bidi` | Unicode text direction (not affected by `all`) |

## Changelog

### Browser Support Milestones

| Date | Event | Browsers |
|------|-------|----------|
| April 2014 | Initial implementation | Chrome 37, Firefox 27, Opera 24 |
| January 2015 | Mobile support arrives | Android 4.4.3+ |
| March 2015 | Safari support | Safari 9.1 |
| March 2016 | iOS support | iOS Safari 9.3 |
| January 2020 | Modern Edge support | Edge 79+ (Chromium) |

## Summary

The CSS `all` property is a well-supported, modern CSS feature available in **93.2% of browsers globally**. It's particularly valuable for:

- Component library developers
- CSS-in-JS framework users
- Creating style boundaries in complex applications
- Resetting styles for third-party integrations

While it has excellent desktop support across Chrome, Firefox, Safari, and modern Edge, note that Internet Explorer has **no support**. For projects requiring IE support, manual property resets or polyfills may be necessary.

---

*Last updated: 2024-12-13*
*Data source: CanIUse.com CSS all property database*
