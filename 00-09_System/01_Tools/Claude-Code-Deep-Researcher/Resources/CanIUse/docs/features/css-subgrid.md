# CSS Subgrid

## Overview

CSS Subgrid is a feature of the CSS Grid Layout Module Level 2 that allows a grid item with its own grid to align in one or both dimensions with its parent grid. This enables more sophisticated multi-level grid layouts where nested grid items can inherit and align to their parent's grid structure.

## Specification

- **Spec Status**: Candidate Recommendation (CR)
- **Specification URL**: [W3C CSS Grid Layout Module Level 2](https://www.w3.org/TR/css-grid-2/#subgrids)
- **Category**: CSS

## Description

Subgrid extends the power of CSS Grid by allowing child grid containers to participate in their parent grid's layout structure. Instead of creating an independent grid system, a subgrid element can align its own grid tracks with its parent's grid, creating cohesive multi-level layouts without the need for complex calculations or manual alignment.

### Key Concepts

- **Parent Grid Integration**: Subgrid items inherit grid track dimensions from their parent
- **Dual Dimension Support**: Subgrid can be applied to columns, rows, or both
- **Simplified Layout**: Eliminates the need for wrapper elements to align nested content
- **Responsive Design**: Works seamlessly with responsive grid layouts

## Benefits & Use Cases

### Benefits

- **Simplified Markup**: Reduces the need for extra wrapper elements
- **Consistent Alignment**: Child elements automatically align with parent grid structure
- **Cleaner Code**: More intuitive CSS for complex nested layouts
- **Better Maintenance**: Easier to modify grid structure without restructuring HTML
- **Responsive Flexibility**: Adapts grid alignment across different breakpoints

### Common Use Cases

1. **Card Layouts**: Aligning content within cards to the overall page grid
2. **Form Layouts**: Creating multi-column forms with aligned input fields
3. **Data Tables**: Structuring complex tabular data with proper alignment
4. **Component Libraries**: Building reusable components that respect grid constraints
5. **Dashboard Layouts**: Creating dashboard widgets that align to a base grid system
6. **Magazine Layouts**: Multi-column article layouts with consistent gutters
7. **Modal Dialogs**: Ensuring dialog content aligns with page grid structure

## Current Support Status

CSS Subgrid has achieved strong browser support across modern browsers, with a current usage percentage of **86.61%** globally.

### Browser Support Table

| Browser | Support Level | First Support | Latest Status |
|---------|--------------|---------------|---------------|
| **Firefox** | Full | 71+ | Supported in all versions from 71+ |
| **Chrome/Chromium** | Full | 117+ | Supported in all versions from 117+ |
| **Edge** | Full | 117+ | Supported in all versions from 117+ |
| **Safari** | Full | 16.0+ | Supported in all versions from 16.0+ |
| **Opera** | Full | 103+ | Supported in all versions from 103+ |
| **iOS Safari** | Full | 16.0+ | Supported in all versions from 16.0+ |
| **Android Chrome** | Full | 142+ | Supported in latest versions |
| **Android Firefox** | Full | 144+ | Supported in latest versions |
| **Samsung Internet** | Full | 24+ | Supported in all versions from 24+ |
| **Opera Mini** | No Support | - | Not supported |
| **IE 11** | No Support | - | Not supported |
| **Internet Explorer** | No Support | - | Not supported |

### Version Details

#### Major Browsers - Full Support

- **Firefox**: 71+
- **Chrome**: 117+
- **Edge**: 117+
- **Safari**: 16.0+
- **Opera**: 103+

#### Mobile Browsers

- **Safari iOS**: 16.0+
- **Chrome Android**: 142+
- **Firefox Android**: 144+
- **Samsung Internet**: 24+
- **Opera Mobile**: 80+

#### No Support / Limited Support

- **Opera Mini**: No support (all versions)
- **Internet Explorer**: No support
- **IE Mobile**: No support
- **Android Browser**: No support (older versions)

### Feature Flags

**Chrome 114-116**: Available behind the `Experimental Web Platform features` flag
- To enable: Navigate to `chrome://flags/#enable-experimental-web-platform-features`
- **Fully released in Chrome 117**

**Edge 114-116**: Available behind the `Experimental Web Platform features` flag
- Fully released in Edge 117

## Syntax & Basic Usage

```css
/* Enable subgrid for columns */
.subgrid-item {
  grid-template-columns: subgrid;
}

/* Enable subgrid for rows */
.subgrid-item {
  grid-template-rows: subgrid;
}

/* Enable subgrid for both dimensions */
.subgrid-item {
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}

/* With named grid lines */
.subgrid-item {
  grid-template-columns: subgrid [line-name];
}
```

## HTML Example

```html
<div class="container">
  <!-- Parent grid -->
  <div class="grid-parent">
    <div class="subgrid-child">
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
      <div class="item">Item 3</div>
    </div>
  </div>
</div>
```

## CSS Example

```css
/* Parent grid */
.grid-parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

/* Child becomes a subgrid */
.subgrid-child {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1; /* Span all columns */
}

/* Items align to parent grid structure */
.item {
  background: lightblue;
  padding: 20px;
}
```

## Fallback Considerations

For browsers that don't support subgrid (primarily IE and Opera Mini), consider:

1. **Graceful Degradation**: Use fallback grid layout without subgrid
2. **Feature Detection**: Use JavaScript or `@supports` CSS feature queries
3. **Progressive Enhancement**: Enhance experience for supporting browsers

```css
/* Fallback for unsupporting browsers */
.subgrid-child {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* Enhanced for subgrid support */
@supports (grid-template-columns: subgrid) {
  .subgrid-child {
    grid-template-columns: subgrid;
  }
}
```

## Related Resources

### Articles & Tutorials
- [CSS Grid Level 2: Here Comes Subgrid](https://www.smashingmagazine.com/2018/07/css-grid-2/) - Smashing Magazine
- [Why we need CSS subgrid](https://dev.to/kenbellows/why-we-need-css-subgrid-53mh) - Dev.to

### Implementation Tracking
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1240834) - Mozilla Bugzilla
- [Chromium Support Bug](https://crbug.com/618969) - Chromium Issue Tracker
- [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=202115) - WebKit Bugzilla

### Official Documentation
- [MDN: CSS Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/subgrid)
- [W3C Specification](https://www.w3.org/TR/css-grid-2/#subgrids)

## Notes & Considerations

- **Wide Modern Support**: Subgrid is now supported in all major browsers except Internet Explorer, making it safe for production use in most scenarios
- **IE Fallback**: If supporting Internet Explorer is required, implement fallback grid layouts using standard CSS Grid
- **Experimental Phase Complete**: The feature has graduated from experimental status (Chrome/Edge 114-116) to stable release
- **Mobile Ready**: Full support across modern mobile browsers makes subgrid suitable for responsive mobile layouts
- **Performance**: Subgrid layouts are performant and have no negative impact on rendering compared to regular grids

## Browser Compatibility Summary

### Full Support (2024+)
- All modern versions of Firefox, Chrome, Edge, Safari, and Opera
- All major mobile browsers except Opera Mini

### Legacy Browser Compatibility
- No support in Internet Explorer (all versions)
- No support in Opera Mini (all versions)
- Older Android devices may require upgrading browser version

### Progressive Enhancement
For maximum compatibility, use the `@supports` CSS feature query to provide fallbacks for older browsers while leveraging subgrid in modern browsers.

---

**Last Updated**: December 2025
**Data Source**: CanIUse.com
**Global Support**: 86.61%
