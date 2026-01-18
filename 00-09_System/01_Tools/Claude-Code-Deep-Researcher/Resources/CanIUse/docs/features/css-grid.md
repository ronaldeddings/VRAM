# CSS Grid Layout (Level 1)

## Overview

CSS Grid Layout is a powerful layout method that divides available space into columns and rows using a predictable grid system. It provides authors with a comprehensive mechanism to create complex, responsive layouts with minimal markup and maximum flexibility.

**Description:** Method of using a grid concept to lay out content, providing a mechanism for authors to divide available space for layout into columns and rows using a set of predictable sizing behaviors. Includes support for all `grid-*` properties and the `fr` unit.

## Specification Status

- **Status:** Candidate Recommendation (CR)
- **W3C Specification:** [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/)
- **Latest W3C Draft:** [CSS Grid Layout Module Level 1 - Editor's Draft](https://drafts.csswg.org/css-grid-1/)

## Categories

- **CSS**

## Benefits and Use Cases

### Layout Flexibility
- Create complex, multi-dimensional layouts with ease
- Define both rows and columns simultaneously
- Establish responsive grids without media queries
- Support nested grids for modular component layouts

### Development Efficiency
- Reduce HTML markup needed for layout purposes
- Simplify responsive design patterns
- Enable CSS-based alignment and spacing
- Eliminate the need for layout polyfills and workarounds

### Visual Design Control
- Precise control over item placement and sizing
- Support for both explicit and implicit grids
- Automatic gap management between grid items
- Named grid lines and areas for semantic layout

### Real-World Applications
- Dashboard and admin panel layouts
- E-commerce product grids and card layouts
- Publication and magazine-style layouts
- Form layouts with complex field arrangements
- Navigation menus and header structures
- Image galleries and portfolio layouts
- Responsive design systems

## Key Features

### Core Grid Properties
- `display: grid` - Creates a grid container
- `display: inline-grid` - Creates an inline grid container
- `grid-template-columns` - Defines column tracks
- `grid-template-rows` - Defines row tracks
- `grid-template-areas` - Defines named grid areas
- `gap` (shorthand for `grid-gap`) - Sets spacing between grid items
- `grid-column-gap` - Sets horizontal spacing
- `grid-row-gap` - Sets vertical spacing
- `grid-auto-flow` - Controls automatic placement direction
- `grid-auto-columns` / `grid-auto-rows` - Defines implicit track sizing

### Item Placement
- `grid-column-start` / `grid-column-end` - Places items across columns
- `grid-row-start` / `grid-row-end` - Places items across rows
- `grid-column` - Shorthand for column placement
- `grid-row` - Shorthand for row placement
- `grid-area` - Places items in named areas or using line numbers

### Alignment and Distribution
- `justify-items` / `justify-content` - Horizontal alignment
- `align-items` / `align-content` - Vertical alignment
- `justify-self` / `align-self` - Individual item alignment

### Advanced Features
- **Fractional Units (`fr`)** - Relative sizing of grid tracks
- **Minmax Function** - Dynamic sizing with `minmax(min, max)`
- **Auto-Fit/Auto-Fill** - Responsive column counts without queries
- **Named Lines and Areas** - Semantic grid structure

## Browser Support Summary

CSS Grid Layout enjoys excellent browser support across modern browsers, with 93.02% global usage for full support.

### First Version with Full Support (y)

| Browser | Version | Release Year |
|---------|---------|--------------|
| **Chrome** | 57 | 2017 |
| **Firefox** | 52 | 2017 |
| **Safari** | 10.1 | 2017 |
| **Edge** | 16 | 2017 |
| **Opera** | 44 | 2017 |
| **iOS Safari** | 10.3 | 2017 |

### Mobile & Other Browsers

| Browser | Version | Status |
|---------|---------|--------|
| **Android Browser** | 142+ | Full Support (y) |
| **Android Chrome** | 142+ | Full Support (y) |
| **Android Firefox** | 144+ | Full Support (y) |
| **Opera Mobile** | 80+ | Full Support (y) |
| **Samsung Internet** | 6.2+ | Full Support (y) |
| **Opera Mini** | All versions | Not Supported (n) |

### Legacy Browser Notes

| Browser | Status | Notes |
|---------|--------|-------|
| **Internet Explorer** | Partial (IE 9) / Prefixed (IE 10-11) | Older spec implementation; not recommended for production |
| **IE Mobile 10-11** | Partial with prefix | Only older spec version supported |
| **Chrome 29-56** | Partial (behind flag) | Requires "experimental Web Platform features" flag |
| **Firefox 19-51** | Partial (behind flag) | Requires `layout.css.grid.enabled` flag |

## Global Usage Statistics

- **Full Support (y):** 93.02%
- **Partial Support (a):** 0.33%
- **No Support (n):** 6.65%

## Known Issues and Limitations

### Safari Limitations
- **Intrinsic and Extrinsic Sizing:** Safari does not yet support intrinsic and extrinsic sizing with grid properties such as `grid-template-rows` (e.g., `minmax(auto, 1fr)`)
- **Recommendation:** Use explicit values or workarounds for Safari compatibility

### Edge 18 and Below (Legacy)
- **calc() in Grid Properties:** Versions 18 and below have various problems supporting `calc()` within grid properties
  - Issue [18676405](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/18676405/)
  - Issue [18675657](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/18675657/)
- **Recommendation:** Use current Edge versions (79+) which have full support

### General Bugs and Issues
- **GridBugs Repository:** [GridBugs](https://github.com/rachelandrew/gridbugs) - Community-curated list of CSS Grid Layout bugs across browsers
- **Overflow Issues in Firefox:** Some older Firefox versions (40-51 with flag) had overflow bugs:
  - [Bug 1356820](https://bugzilla.mozilla.org/show_bug.cgi?id=1356820)
  - [Bug 1348857](https://bugzilla.mozilla.org/show_bug.cgi?id=1348857)
  - [Bug 1350925](https://bugzilla.mozilla.org/show_bug.cgi?id=1350925)

## Implementation Notes

### Backward Compatibility Strategy
- **Feature Detection:** Use CSS `@supports` rule for feature detection
- **Fallback Layouts:** Provide fallback layouts using flexbox or float for legacy browsers
- **Progressive Enhancement:** Build layouts progressively, starting with fallbacks

### Progressive Enhancement Example
```css
/* Fallback for older browsers */
.grid-container {
  display: flex;
  flex-wrap: wrap;
}

/* Modern grid layout */
@supports (display: grid) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
}
```

### Performance Considerations
- Grid layout is performant on modern browsers
- Avoid excessive nesting of grid containers
- Use `grid-auto-flow: dense` judiciously as it can impact performance
- Consider using `will-change` for animated grid items

## Related Features and Links

### Related CSS Features
- [CSS Subgrid](https://caniuse.com/css-subgrid) - Nested grids that inherit parent track sizes
- [CSS Flexbox](https://caniuse.com/flexbox) - One-dimensional layout alternative
- [CSS Box Alignment](https://caniuse.com/css-boxalign) - Alignment properties used by Grid

### Learning Resources
- **[CSS Grid by Example](https://gridbyexample.com/)** - Comprehensive guide covering all CSS Grid features with interactive examples
- **[Mozilla: Introduction to CSS Grid Layout](https://mozilladevelopers.github.io/playground/css-grid)** - Interactive introduction and playground
- **[WebKit Blog Post](https://webkit.org/blog/7434/css-grid-layout-a-new-layout-module-for-the-web/)** - Historical overview and implementation details

### Polyfills
- **[Grid Layout Polyfill (Old Spec)](https://github.com/codler/Grid-Layout-Polyfill)** - Based on older CSS Grid specification (not recommended for new projects)
- **[CSS Grid Polyfill (New Spec)](https://github.com/FremyCompany/css-grid-polyfill/)** - Based on current specification (better support but limited functionality)
- **Note:** Modern browsers have sufficient support that polyfills are rarely necessary

## Common Grid Patterns

### Auto-Fit Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### CSS Grid with Named Areas
```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-areas:
    "header header header"
    "sidebar main sidebar"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### Grid with Asymmetric Layout
```css
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1.5rem;
}
```

## Test Coverage

To test CSS Grid support in your browser:
```css
.test-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

If three equal-width columns appear with spacing, your browser supports CSS Grid.

## Summary

CSS Grid Layout is a mature, well-supported standard for creating complex layouts on the web. With 93% global support and no significant limitations in modern browsers, it is safe to use as a primary layout mechanism for contemporary web applications. For applications requiring support of older browsers (IE 11 and earlier), progressive enhancement strategies with fallback layouts are recommended.

---

**Last Updated:** 2024
**Status:** Production Ready
**Recommendation:** Safe for production use in modern browser environments
