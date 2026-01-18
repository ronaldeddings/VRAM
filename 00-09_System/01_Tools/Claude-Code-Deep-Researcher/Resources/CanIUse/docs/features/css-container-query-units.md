# CSS Container Query Units

## Overview

Container Query Units specify a length relative to the dimensions of a query container. These units enable responsive component design by allowing elements to scale based on their container's dimensions rather than the viewport. The units include: `cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, and `cqmax`.

## Description

CSS Container Query Units represent a powerful addition to CSS that complements Container Queries (the `@container` rule). These units allow developers to define lengths and dimensions that respond dynamically to container sizes, enabling truly component-based responsive design without viewport media queries.

### Available Units

| Unit | Description |
|------|-------------|
| `cqw` | 1% of the query container's width |
| `cqh` | 1% of the query container's height |
| `cqi` | 1% of the query container's inline size |
| `cqb` | 1% of the query container's block size |
| `cqmin` | 1% of the smaller dimension (width or height) of the query container |
| `cqmax` | 1% of the larger dimension (width or height) of the query container |

## Specification

- **Status**: Working Draft (WD)
- **W3C Specification**: [CSS Containment Module Level 3 - Container Lengths](https://www.w3.org/TR/css-contain-3/#container-lengths)
- **Feature ID**: `6525308435955712`

## Category

- **CSS** - Styling and Layout

## Benefits and Use Cases

### Key Benefits

1. **Component-Centric Responsive Design**
   - Design components that adapt to their container size, not just viewport
   - Enables true modular component architecture
   - Improves reusability across different layout contexts

2. **Reduced Media Query Complexity**
   - Eliminates the need for multiple viewport-based breakpoints
   - Simplifies CSS for complex, multi-column layouts
   - Reduces specificity wars and CSS overrides

3. **Better Performance**
   - Fewer media query evaluations
   - More efficient rendering of responsive layouts
   - Simplified layout calculations in JavaScript

4. **Modern Design Patterns**
   - Supports fluid component sizing
   - Enables scalable typography within components
   - Facilitates adaptive spacing and padding

### Common Use Cases

- **Card Components**: Scale content and spacing based on card width
- **Sidebar Layouts**: Adjust typography and spacing when sidebar width changes
- **Grid Systems**: Create adaptive columns that respond to container size
- **Modular Typography**: Font sizes that scale with component dimensions
- **Adaptive Navigation**: Menu items that resize based on header width
- **Content Containers**: Flexible layouts for different container widths

## Browser Support

### First Version with Full Support

| Browser | Version | Release Date |
|---------|---------|--------------|
| Chrome | 105 | September 2022 |
| Edge | 105 | September 2022 |
| Firefox | 110 | February 2023 |
| Safari | 16.0 | September 2022 |
| Opera | 91 | September 2022 |
| iOS Safari | 16.0 | September 2022 |
| Android Chrome | 142 | January 2025 |
| Samsung Internet | 20 | March 2024 |
| Opera Mobile | 80 | March 2024 |

### Current Support Status

**Global Usage**: 90.87%

| Browser Family | Support Level |
|---|---|
| Chrome/Edge | ✅ Supported since v105 |
| Firefox | ✅ Supported since v110 |
| Safari/iOS Safari | ✅ Supported since v16.0 |
| Opera | ✅ Supported since v91 |
| Mobile Browsers | ✅ Mostly supported (v80+) |
| Internet Explorer | ❌ No support |
| Opera Mini | ❌ No support |

### Mobile Platform Support

| Platform | Status | Version |
|---|---|---|
| Android Browser | ✅ Supported | v142+ |
| Android Chrome | ✅ Supported | v142+ |
| Android Firefox | ✅ Supported | v144+ |
| iOS Safari | ✅ Supported | v16.0+ |
| Opera Mobile | ✅ Supported | v80+ |
| Samsung Internet | ✅ Supported | v20+ |
| Opera Mini | ❌ Not supported | N/A |
| IE Mobile | ❌ Not supported | N/A |

## Implementation Notes

### Chrome Implementation History

**Important**: Early Chrome versions (93-104) supported Container Query Units through a **different syntax**:

- Chrome 93-104: Required feature flag and used earlier spec syntax (`q*` units instead of `cq*`)
  - Can be enabled: `chrome://flags` → "Enable CSS Container Queries"
  - Used older syntax: `qw`, `qh`, `qi`, `qb`, `qmin`, `qmax`

- Chrome 105+: Full support with correct `cq*` unit syntax

### Progressive Enhancement

For projects needing to support older browsers, implement fallback patterns:

```css
/* Fallback for older browsers */
.component {
  padding: 1rem;
}

/* Modern container query units */
@supports (width: 1cqw) {
  .component {
    padding: 2cqw 2cqh;
    font-size: 4cqmin;
  }
}
```

### Feature Detection

```javascript
// Check if browser supports container query units
const supportsContainerUnits = CSS.supports('width: 1cqw');
```

## Known Issues and Bugs

Currently, no known bugs are reported in the CanIUse database for Container Query Units.

### Firefox Implementation Note

Firefox users can track the implementation status:
- [Firefox Support Bug #1744231](https://bugzilla.mozilla.org/show_bug.cgi?id=1744231)

## Related Resources

### Learning & Articles

- [Blog Post: CSS Container Query Units](https://ishadeed.com/article/container-query-units/) - Ahmad Shadeed's comprehensive guide
- [CSS Tricks: Container Units Should Be Pretty Handy](https://css-tricks.com/container-units-should-be-pretty-handy/) - CSS Tricks article on practical applications

### Specification & Standards

- [W3C CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) - Full specification
- [MDN Web Docs: Container Query Units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#container_query_lengths) - Comprehensive documentation

### Related Features

- **CSS Container Queries** (`@container`) - The parent feature enabling container-relative sizing
- **CSS Custom Properties** - Often used in combination with container units for dynamic theming
- **CSS Grid** - Works well with container units for responsive grid layouts
- **CSS Flexbox** - Pairs with container units for fluid component sizing

## Browser Compatibility Table

### Desktop Browsers

```
IE:        ❌ Never supported
Edge:      ✅ 105+
Firefox:   ✅ 110+
Chrome:    ✅ 105+ (93-104 with flag & older syntax)
Safari:    ✅ 16.0+
Opera:     ✅ 91+
```

### Mobile Browsers

```
iOS Safari:    ✅ 16.0+
Android:       ✅ 142+
Samsung:       ✅ 20+
Opera Mobile:  ✅ 80+
Firefox Mobile:✅ 144+
```

## Code Examples

### Basic Usage

```css
/* Container with query context */
.card {
  container-type: inline-size;
  max-width: 100%;
}

/* Responsive typography based on container */
.card h2 {
  font-size: clamp(1rem, 4cqw, 2rem);
}

/* Responsive spacing */
.card-content {
  padding: 2cqh;
  gap: 1cqmin;
}
```

### Fluid Scaling Example

```css
.component {
  container-type: inline-size;
}

@container (min-width: 20cqw) {
  .component-title {
    font-size: 3cqw;
    margin: 2cqw 0;
  }

  .component-body {
    padding: 2cqw;
  }
}
```

### Combined with Container Queries

```css
@container (min-width: 400px) {
  /* Apply styles when container is at least 400px wide */
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2cqw; /* Gap scales with container width */
  }
}

@container (min-width: 800px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3cqw;
  }
}
```

## Recommended Usage Timeline

- **No legacy browser support needed**: Use immediately (90%+ coverage)
- **IE11 or older browser support required**: Use with `@supports` fallbacks
- **Enterprise environments**: Check compatibility with mandatory supported browsers
- **Mobile-first projects**: Safe to use, excellent mobile coverage

## Notes

- Container Query Units require the `@container` rule or parent with `container-type` to function
- Units are relative to the query container's dimensions, not the viewport
- Safari was an early adopter with support from v16.0
- Chrome 93-104 users with feature flag enabled should use older `q*` syntax
- Firefox support arrived later (v110) but is now complete

---

**Last Updated**: December 2025
**Data Source**: CanIUse Browser Compatibility Database
