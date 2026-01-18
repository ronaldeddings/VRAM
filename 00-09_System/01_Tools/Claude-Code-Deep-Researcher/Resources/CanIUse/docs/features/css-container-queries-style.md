# CSS Container Style Queries

## Overview

CSS Container Style Queries provide a way to query the current styling of a container and conditionally apply additional CSS to the contents of that container. This feature is part of the broader CSS Container Queries specification and enables developers to create responsive, component-based designs that adapt based on the computed styles of their container elements.

**Category:** CSS
**Specification Status:** Working Draft (WD)

---

## Specification

- **W3C Specification:** [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/)

### What are Style Queries?

Style queries allow you to use the `@container` rule with a `style()` function to apply styles based on the computed styles of a parent container. This is complementary to size container queries, enabling more granular control over responsive layouts.

```css
@container style(--my-theme: dark) {
  /* Styles applied when --my-theme equals 'dark' */
  color: white;
  background: #333;
}
```

---

## Browser Support Summary

### Full Support Status

| Browser | Minimum Version | Status |
|---------|---|---|
| **Chrome/Chromium** | 111+ | Full Support (Partial support note) |
| **Edge** | 111+ | Full Support (Partial support note) |
| **Safari** | 18.0+ | Partial Support |
| **Opera** | 98+ | Partial Support |
| **Firefox** | Not Yet | No Support |
| **Mobile (iOS Safari)** | 18.0+ | Partial Support |
| **Mobile (Android Chrome)** | 142+ | Partial Support |
| **Mobile (Samsung Internet)** | 22+ | Partial Support |

### Legend

- **Full Support (a):** Fully supported, though with limitations noted below
- **Partial Support (a):** Limited functionality with specific constraints
- **Development (d):** Available through experimental flags
- **No Support (n):** Not yet implemented

---

## Browser Support Table

### Desktop Browsers

| Browser | Support Since | Notes |
|---------|---|---|
| Chrome | 111 (Partial) | Full support from v111; queries work with CSS custom properties |
| Edge | 111 (Partial) | Aligned with Chrome; experimental in v107-110 |
| Safari | 18.0 (Partial) | Limited support; see known issues below |
| Opera | 98 (Partial) | Support aligned with Chrome-based versions |
| Firefox | Not Supported | No implementation yet; [tracking bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1795622) |
| Internet Explorer | Not Supported | Legacy browser; no implementation |

### Mobile Browsers

| Browser | Support Since | Notes |
|---|---|---|
| Safari (iOS) | 18.0 (Partial) | Same limitations as desktop Safari |
| Chrome (Android) | 142 (Partial) | Limited custom property support |
| Samsung Internet | 22.0 (Partial) | Support aligned with Chromium versions |
| Opera Mini | Not Supported | No container query support |
| Firefox (Android) | Not Supported | No implementation |

---

## Feature Details

### Current Implementation Status

**Global Usage:** 85.64% of users have access to at least partial support

### What Works

- **CSS Custom Property Queries:** The primary supported use case is querying CSS custom property values using the `style()` function
- **Container Styling:** Containers can have custom properties set that child elements can query
- **Partial Support:** Browsers with partial support work with CSS custom properties in style queries

### Current Limitations

1. **Partial Support Only:** Current implementations have limited support, primarily for CSS custom property values in `style()` queries
2. **Root Element Constraint (Safari 18):** In Safari 18, the root element cannot be used as a container
3. **Experimental Features:** Some browsers require experimental flags to enable full functionality

---

## Experimental / Development Status

### Chrome and Chromium-Based Browsers (v107-110)

Container Style Queries were available as an experimental feature through the **"Experimental Web Platform features" flag**:

```
chrome://flags#enable-experimental-web-platform-features
```

From Chrome 111 onward, the feature is enabled by default with partial support.

---

## Known Issues and Bugs

### 1. Safari 18 Root Element Limitation

**Issue:** The root element cannot be used as a container in Safari 18.

**Impact:** You cannot query the styling of the document root element using `@container` style queries.

**Workaround:** Use a non-root container element for style queries.

**Tracking:** [WebKit Bug 271040](https://webkit.org/b/271040)

---

## Use Cases and Benefits

### 1. Theme Management

Use style queries to adapt components based on theme values stored in CSS custom properties:

```css
:root {
  --color-scheme: light;
}

.card {
  container-type: style;
}

@container style(--color-scheme: dark) {
  .card {
    background: #222;
    color: #fff;
  }
}
```

### 2. Component Customization

Enable components to respond to parent styling without JavaScript:

```css
.button-group {
  --button-size: small;
  container-type: style;
}

@container style(--button-size: large) {
  button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
  }
}
```

### 3. Dynamic Feature Flags

Control feature visibility based on CSS custom property flags:

```css
@container style(--show-beta-features: true) {
  .beta-feature {
    display: block;
  }
}
```

### 4. Configuration-Based Layouts

Adjust layouts based on parent configuration:

```css
.grid-container {
  --layout-mode: compact;
  container-type: style;
}

@container style(--layout-mode: expanded) {
  .grid-container {
    --gap: 2rem;
    --columns: 3;
  }
}
```

---

## Browser Compatibility Details

### Chrome/Chromium (v111+)

- Shipped with default enabled status
- Supports querying CSS custom properties
- Full implementation expected in upcoming releases

### Edge (v111+)

- Aligned with Chromium version
- Same support level as Chrome

### Safari (18.0+)

- Initial support with limitations
- Works with CSS custom properties
- Root element cannot be a container
- Marked as "Partial support"

### Firefox

- No implementation yet
- Active development tracked in [Firefox Bug 1795622](https://bugzilla.mozilla.org/show_bug.cgi?id=1795622)

### Opera (98+)

- Chromium-based support aligned with Chrome v111+
- Partial support with custom properties

---

## Technical Specifications

### Container Type Declaration

```css
.container {
  container-type: style;
  /* Also supports 'size' and 'layout' for size queries */
}
```

### Style Query Syntax

```css
@container style(--custom-prop: value) {
  /* Styles applied when condition is true */
}
```

### Chaining and Complex Queries

Multiple conditions can be combined:

```css
@container style(--theme: dark) and style(--accessibility: high-contrast) {
  /* Applied when both conditions are true */
}
```

---

## Feature Keywords

- Style queries
- Style query
- Container queries
- Container query
- CSS containment
- CSS custom properties
- Dynamic styling

---

## Related Documentation

### W3C and Standards

- [W3C CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/)

### Browser-Specific Resources

- [Chrome Developers: Getting Started with Style Queries](https://developer.chrome.com/blog/style-queries/)
- [WebKit Bug Tracking: Style Queries Support](https://bugs.webkit.org/show_bug.cgi?id=246605)

### Educational Articles

- [Una Kravets: Style Queries](https://una.im/style-queries/)
- [Bram.us: Container Queries: Style Queries](https://www.bram.us/2022/10/14/container-queries-style-queries/)
- [Ahmad Shadeed: CSS Style Queries](https://ishadeed.com/article/css-container-style-queries/)

### Bug Tracking

- [Firefox Support Bug 1795622](https://bugzilla.mozilla.org/show_bug.cgi?id=1795622)
- [WebKit Support Bug 246605](https://bugs.webkit.org/show_bug.cgi?id=246605)
- [Safari Root Element Bug 271040](https://webkit.org/b/271040)

---

## Implementation Examples

### Basic Theme Toggle

```css
html {
  --theme: light;
  container-type: style;
}

body {
  background: white;
  color: black;
}

@container style(--theme: dark) {
  body {
    background: #1a1a1a;
    color: #f5f5f5;
  }
}
```

### Responsive Card Component

```css
.card {
  --card-layout: column;
  container-type: style;
}

.card-content {
  display: flex;
  flex-direction: column;
}

@container style(--card-layout: row) {
  .card-content {
    flex-direction: row;
    gap: 1rem;
  }
}
```

### Accessibility Adaptations

```css
:root {
  --prefer-reduced-motion: false;
  container-type: style;
}

.interactive {
  transition: all 0.3s ease;
}

@container style(--prefer-reduced-motion: true) {
  .interactive {
    transition: none;
  }
}
```

---

## Recommendations for Developers

### When to Use Style Queries

1. **Theme Management:** Best for theme-based styling variations
2. **Component Configuration:** Useful for customizing component behavior
3. **Feature Flags:** Great for beta or experimental feature control
4. **Accessibility Adaptations:** Can handle accessibility-related styling adjustments

### Browser Support Considerations

- **Progressive Enhancement:** Use style queries as an enhancement; provide fallbacks for unsupported browsers
- **Feature Detection:** Test for support before relying on style queries
- **Polyfills:** Currently no reliable polyfills available; consider JavaScript alternatives for older browsers

### Best Practices

1. Use semantic custom property names that reflect their purpose
2. Combine with size container queries for comprehensive responsive design
3. Test across multiple browsers, especially Safari and Chrome
4. Provide fallback styles for browsers without support
5. Avoid nested container queries beyond one or two levels for maintainability

---

## Current Limitations and Workarounds

| Limitation | Workaround |
|-----------|-----------|
| Firefox lacks support | Use JavaScript-based media queries or CSS class toggles |
| Safari root element constraint | Use a wrapper element instead of the root |
| Limited browser adoption | Progressive enhancement with fallback styles |
| Partial support only | Stick to CSS custom property queries, avoid future extensions |

---

## Migration Path

If upgrading from JavaScript-based theming:

```javascript
// Old: JavaScript-based
document.documentElement.classList.toggle('dark-mode', isDark);

// New: CSS custom property
document.documentElement.style.setProperty('--theme', isDark ? 'dark' : 'light');
```

Then use style queries instead of CSS class selectors.

---

## Future Compatibility

As the specification evolves, expect:

- Full support in Firefox and other engines
- Removal of current limitations in Safari
- Possible extensions to query other CSS properties beyond custom properties
- Better integration with cascade and inheritance mechanisms

Monitor the [W3C CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) specification for updates.

---

**Last Updated:** December 2025
**Data Source:** CanIUse CSS Container Style Queries Feature Database
