# CSS `justify-content: space-evenly`

## Overview

The `space-evenly` value for the CSS `justify-content` property distributes free space evenly between flex or grid items. It provides equal spacing on all sides, including the edges, making it distinct from `space-around` which allocates half-sized spaces on the edges.

## Description

`justify-content: space-evenly` is a CSS alignment property that works in both CSS Flexbox and CSS Grid layouts. It distributes items along the main axis (or inline axis) with equal space between items and equal space at the start and end of the container.

### Key Differences from Related Values

- **`space-around`**: Places equal space around each item (items at edges have only one side with space)
- **`space-between`**: Distributes items with space between them but no space at the edges
- **`space-evenly`**: Distributes items and edges equally

## Specification Status

- **Specification URL**: [CSS Box Alignment Module Level 3](https://w3c.github.io/csswg-drafts/css-align-3/#valdef-align-content-space-evenly)
- **Status**: Working Draft (WD)

## Categories

- CSS

## Benefits & Use Cases

### UI Layout Benefits
- **Consistent Spacing**: Achieves uniform distribution across the entire container
- **Flexible Design**: Automatically adapts spacing to container width or height
- **Simplified Code**: Reduces need for manual margin calculations

### Common Use Cases
- Navigation menus with evenly distributed items
- Button groups with uniform spacing
- Card layouts in grid systems
- Toolbar designs with distributed controls
- Badge or tag distributions
- Icon rows with equal spacing

### Design Advantages
- Improved visual balance and symmetry
- Better responsive design without breakpoint tweaking
- Professional appearance with minimal CSS
- Accessibility-friendly layouts with predictable spacing

## Browser Support

### Support Legend
- ✅ **Full Support (y)**: Feature fully supported
- ⚠️ **Partial Support (a)**: Partial support with limitations
- ❌ **No Support (n)**: Feature not supported

### Desktop Browsers

| Browser | First Support | Latest Status | Notes |
|---------|--------------|---------------|-------|
| **Chrome** | 60 | ✅ v146+ | Partial support in v57-59 (grid only) |
| **Firefox** | 52 | ✅ v148+ | Full support from v52 onwards |
| **Safari** | 11 | ✅ v18.5+ | Partial support in v10.1 (grid only) |
| **Edge** | 79 | ✅ v143+ | Partial support in v16-18 (grid only) |
| **Opera** | 47 | ✅ v122+ | Partial support in v44-46 (grid only) |
| **Internet Explorer** | — | ❌ No Support | Not supported in any version |

### Mobile Browsers

| Browser | First Support | Latest Status | Notes |
|---------|--------------|---------------|-------|
| **iOS Safari** | 11.0 | ✅ v18.5+ | Partial support in v10.3 (grid only) |
| **Android Browser** | 142+ | ✅ v142+ | Recent versions only |
| **Chrome Android** | 142+ | ✅ v142+ | Recent versions only |
| **Firefox Android** | 144+ | ✅ v144+ | Recent versions only |
| **Samsung Internet** | 8.2 | ✅ v29+ | Partial support in v7.2-7.4 (grid only) |
| **Opera Mobile** | 80+ | ✅ v80+ | Support starting from v80 |
| **Opera Mini** | — | ❌ No Support | Not supported |
| **UC Browser** | 15.5+ | ✅ v15.5+ | Limited support |
| **Android UC** | 15.5+ | ✅ v15.5+ | Limited support |

### Global Coverage

- **Full Support Coverage**: 92.96% of users
- **Partial Support Coverage**: 0.06% of users
- **Total Coverage**: 93.02% of users

## Important Notes

### Limitation: Grid vs. Flexbox Support

**Note #1**: Supported in CSS Grid, but not in Flexbox in older browser versions.

This is a critical distinction for older browser versions:
- **Early Chrome versions (57-59)**: Only works with CSS Grid
- **Early Safari versions (10.1)**: Only works with CSS Grid
- **Early Edge versions (16-18)**: Only works with CSS Grid
- **Early Opera versions (44-46)**: Only works with CSS Grid
- **Early Samsung Internet (7.2-7.4)**: Only works with CSS Grid
- **Early KaiOS (2.5)**: Only works with CSS Grid

Modern browser versions fully support `space-evenly` in both Flexbox and Grid.

## Related Resources

### Official Documentation
- [MDN: CSS `justify-content` property](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)

### Bug Reports & Tracking
- [Edge Support Bug Report (Archive)](https://web.archive.org/web/20190401105606/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15947692/)

## Code Examples

### Flexbox Example
```css
.flex-container {
  display: flex;
  justify-content: space-evenly;
}
```

### Grid Example
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  justify-content: space-evenly;
}
```

## Recommendation

`justify-content: space-evenly` is **safe to use** for modern web applications. With 92.96% global coverage, it's suitable for:
- Production websites targeting modern browsers
- Applications without legacy browser support requirements
- Progressive enhancement strategies where older browsers use fallback layouts

For legacy browser support (IE11 and early mobile browsers), consider using `space-around` or manual flexbox gap techniques as fallbacks.
