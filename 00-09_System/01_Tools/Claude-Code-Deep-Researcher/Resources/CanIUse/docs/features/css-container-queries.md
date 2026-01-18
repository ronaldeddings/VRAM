# CSS Container Queries (Size)

## Overview

CSS Container Queries provide a way to query the size of a container and conditionally apply CSS styles to the content within that container. This is a powerful feature that enables truly responsive component design, allowing elements to adapt their appearance based on the size of their parent container rather than just the viewport size.

Size queries specifically allow developers to write responsive styles that react to container dimensions, creating more modular and reusable components that work in various layout contexts.

---

## Specification

- **Specification**: [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/)
- **Status**: Working Draft (WD)
- **Current Version**: CSS Containment Level 3

---

## Categories

- **CSS** - CSS language feature

---

## Use Cases & Benefits

### Key Benefits

1. **Component-Level Responsiveness**
   - Components adapt based on their container size, not viewport size
   - Build truly modular, reusable components
   - Avoid breaking changes when components are used in different contexts

2. **Simplified Media Query Logic**
   - Replace complex, viewport-based media queries with container-aware styles
   - Reduce CSS duplication and complexity
   - Easier to maintain responsive designs

3. **Better Component Encapsulation**
   - Style components independently without global media query coordination
   - Components work seamlessly at any container size
   - Improved code organization and maintainability

4. **Progressive Enhancement**
   - Build responsive designs without JavaScript
   - Cleaner, more semantic CSS
   - Better performance than JavaScript-based solutions

### Common Use Cases

- **Card Layouts**: Adapt card layout based on available space
- **Navigation Components**: Show/hide nav items based on container width
- **Product Cards**: Change image and text layout for different container sizes
- **Sidebar Content**: Reflow content based on sidebar dimensions
- **Dashboard Widgets**: Create flexible, responsive dashboard widgets
- **Grid Components**: Adjust grid columns based on container constraints
- **Form Layouts**: Reorganize form fields for different container widths

---

## Syntax Overview

### Basic Container Setup

```css
/* Define a container */
.sidebar {
  container-type: size;
  container-name: sidebar;
}

/* Query the container */
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### Container Size Units

Container queries support the following units:
- `cqw` - Container query width (1% of container width)
- `cqh` - Container query height (1% of container height)
- `cqi` - Container query inline size
- `cqb` - Container query block size
- `cqmin` - Smaller of width or height
- `cqmax` - Larger of width or height

### Named Containers

```css
.parent {
  container-type: size;
  container-name: my-container;
}

/* Query by name for specificity */
@container my-container (min-width: 500px) {
  .child {
    /* Styles applied when my-container is ≥500px */
  }
}
```

---

## Browser Support

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome/Edge** | 106+ | ✅ Full Support | Stable release |
| **Firefox** | 110+ | ✅ Full Support | Stable release |
| **Safari** | 16.0+ | ✅ Full Support | Stable release |
| **Opera** | 94+ | ✅ Full Support | Chromium-based |
| **iOS Safari** | 16.0+ | ✅ Full Support | Stable release |
| **Samsung Internet** | 20+ | ✅ Full Support | Chromium-based |
| **Android Chrome** | 142+ | ✅ Full Support | Mobile support |
| **Android Firefox** | 144+ | ✅ Full Support | Mobile support |
| **Opera Mobile** | 80+ | ✅ Full Support | Mobile support |
| **IE 11** | — | ❌ No Support | End of life |
| **Opera Mini** | All | ❌ No Support | Limited engine |

### Support Timeline

- **Early Access**: Chrome 92-105 (behind feature flag)
- **Full Release**: Chrome/Edge 106+, Firefox 110+, Safari 16+
- **Current Coverage**: ~90.6% global browser usage

### Feature Flag Availability

**Chrome 92-105**: Can be enabled via `chrome://flags` under "Enable CSS Container Queries" feature flag

---

## Known Limitations & Bugs

### Limitation #1: Feature Flag Required (Chrome 92-105)
- Container queries require manual enablement in early Chrome versions via the feature flag
- Automatic support starting Chrome 106

### Limitation #2: Early Syntax (Chrome 92-94)
- Initial Chrome prototype used an earlier draft syntax based on the `contain` property
- This was replaced with the standardized `@container` syntax
- Older demos may not work with current implementations

### Limitation #3: Multicolumn + Table Layout + Container Query Interaction
- **Issue**: Combining size container queries and table layout inside a multicolumn layout doesn't work correctly
- **Workaround**: Avoid nesting table layouts within multicolumn containers that use container queries
- **Status**: Known compatibility issue with specific layout combinations

---

## Implementation Notes

### Enabling Container Context

Before using `@container` queries, establish a container context:

```css
.container {
  container-type: size;  /* Required to enable querying */
}
```

### Units in Container Queries

Container query units (`cqw`, `cqh`, etc.) provide relative sizing:

```css
@container (min-width: 400px) {
  .heading {
    font-size: 2cqw;  /* 2% of container width */
  }

  .content {
    padding: 1cqw 0.5cqw;
  }
}
```

### Avoiding Circular Dependencies

Container queries can't create circular sizing dependencies:

```css
/* Don't do this - can create infinite loops */
.container {
  container-type: size;
  width: 100cqw;  /* Based on its own container */
}
```

---

## Progressive Enhancement Strategy

### For Older Browsers

```css
/* Base styles that work everywhere */
.card {
  display: block;
  padding: 1rem;
}

/* Container query enhancement */
@supports (container-type: size) {
  .card-parent {
    container-type: size;
  }

  @container (min-width: 500px) {
    .card {
      display: grid;
      grid-template-columns: 1fr 2fr;
    }
  }
}
```

### Polyfill Option

For projects requiring broader browser support:
- **[Container Query Polyfill](https://github.com/GoogleChromeLabs/container-query-polyfill)** - Google Chrome Labs polyfill with good feature coverage

---

## Related Resources

### Official Documentation
- [MDN Web Docs - CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [W3C Specification](https://www.w3.org/TR/css-contain-3/)

### Guides & Tutorials
- [Container Queries: a Quick Start Guide](https://www.oddbird.net/2021/04/05/containerqueries/) - OddBird comprehensive guide
- [Collection of Container Query Demos](https://codepen.io/collection/XQrgJo) - CodePen examples

### Implementation Tracking
- [Chromium Support Bug](https://crbug.com/1145970) - Chrome implementation tracking
- [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=229659) - Safari/WebKit implementation
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1744221) - Firefox implementation

### Tools
- [Container Query Polyfill](https://github.com/GoogleChromeLabs/container-query-polyfill) - Google Chrome Labs official polyfill

---

## Global Usage Statistics

- **Full Support (y)**: 90.61%
- **Partial Support (a)**: 0.26%
- **No Support (n)**: 9.13%

This high adoption rate reflects the modern browser landscape and makes container queries a viable choice for most web projects targeting contemporary browsers.

---

## Quick Reference

### Key CSS Properties

| Property | Values | Purpose |
|----------|--------|---------|
| `container-type` | `size` \| `inline-size` \| `normal` | Establishes container context |
| `container-name` | `<custom-ident>` | Names container for targeted queries |
| `@container` | Query syntax | Applies styles based on container size |

### Common Query Conditions

```css
@container (width >= 400px) { }
@container (width < 800px) { }
@container (width >= 400px) and (height >= 600px) { }
@container (aspect-ratio > 1) { }
```

### Browser-Specific Notes

- **Safari**: Full support from 16.0 (March 2022)
- **Chrome/Edge**: Stable from 106 (October 2022)
- **Firefox**: Full support from 110 (February 2024)
- **Mobile**: Excellent coverage across iOS Safari, Android Chrome, and Samsung Internet

---

*Last Updated: 2024*
*Based on CanIUse Data*
