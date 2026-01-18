# CSS position:sticky

## Overview

**CSS position:sticky** allows elements to be positioned as "fixed" or "relative" depending on how they appear in the viewport. As content scrolls, the element is "stuck" in place when necessary, creating a sticky behavior that's useful for headers, navigation, and other persistent UI elements.

## Description

The sticky positioning model combines aspects of relative and fixed positioning. An element with `position: sticky` remains in the document flow like a relatively positioned element, but when scrolling would cause it to move outside the viewport, it becomes "stuck" and behaves like a fixed positioned element relative to its nearest scrolling ancestor.

## Specification

- **Current Status**: Working Draft (WD)
- **Official Spec**: [CSS Positioned Layout Module Level 3](https://w3c.github.io/csswg-drafts/css-position/#sticky-pos)

## Category

- CSS

## Use Cases & Benefits

### Common Use Cases

- **Sticky Headers**: Keep table headers, section headers, or navigation bars visible while scrolling
- **Persistent Navigation**: Maintain navigation menus at the top of the viewport
- **Sidebar Navigation**: Fix sidebar menus in place while content scrolls
- **Price Tags**: Display pricing information at the top of product lists
- **Filter Panels**: Keep filtering options visible in e-commerce applications
- **Timeline Markers**: Highlight current dates/times in scrollable timelines

### Key Benefits

- **Native Solution**: No JavaScript required for basic sticky behavior
- **Performance**: Better performance than JavaScript-based alternatives
- **Accessibility**: Works with standard HTML/CSS, no special handling needed
- **Flexibility**: Works with any element type (div, section, tr, etc.)
- **Responsive**: Adapts naturally to responsive layouts

## Browser Support

### Support Legend

- **y** = Full support
- **a** = Partial support / Has limitations
- **n** = No support
- **x** = Prefix required (legacy support)
- **d** = Disabled by default (requires flag/preference)

### Desktop Browsers

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 56 | Partial support (56-90); Full support from 91+ |
| **Firefox** | 59 | Partial support (32-58); Full support from 59+ |
| **Safari** | 13 | Partial support (6.1-12); Full support from 13+ |
| **Edge** | 91 | Partial support (16-90); Full support from 91+ |
| **Opera** | 78 | Partial support (42-77); Full support from 78+ |
| **Internet Explorer** | Not Supported | All versions (5.5-11) lack support |

### Mobile & Tablet Browsers

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **iOS Safari** | 13 | Partial support (6.0-12); Full support from 13+ |
| **Android Chrome** | 56+ | Modern versions fully supported |
| **Android Firefox** | 59+ | Modern versions fully supported |
| **Samsung Internet** | 6.2 | Full support from 6.2+ |
| **Opera Mobile** | 80 | Full support from 80+ |
| **UC Browser** | 15.5 | Full support |
| **Android UC** | 15.5 | Full support |
| **KaiOS** | 3.0 | Full support from 3.0+ |
| **Opera Mini** | Not Supported | All versions lack support |
| **Blackberry** | Not Supported | All versions (7, 10) lack support |
| **IE Mobile** | Not Supported | All versions (10, 11) lack support |

## Known Limitations & Bugs

### Critical Limitations

1. **Sticky Table Headers**
   - Firefox 58 and below do not support sticky table headers
   - Chrome 63 and below do not support sticky table headers
   - Safari 7 and below do not support sticky table headers
   - Modern browsers support sticky `th` elements, but not `thead` or `tr` elements

2. **Overflow Parent Issue (Safari)**
   - A parent element with `overflow: auto` will prevent `position: sticky` from working
   - **Workaround**: Ensure the nearest scrolling ancestor doesn't have overflow properties that conflict

3. **Scrolling Container Requirement**
   - An element with `position: sticky` sticks to its nearest ancestor that has a scrolling mechanism
   - This means the element must be inside a container with `overflow: hidden`, `overflow: scroll`, `overflow: auto`, or `overflow: overlay`
   - The ancestor itself doesn't need to be the actual scrolling ancestor, just have the overflow property set

## Basic Usage

### Simple Example

```css
/* Basic sticky header */
.header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
}
```

### Key Properties

- `top`, `bottom`, `left`, `right`: Define the position where the element sticks
- `z-index`: Control stacking order when multiple sticky elements overlap

### Important Notes

- The element must have at least one of `top`, `bottom`, `left`, or `right` defined
- Sticky positioning works within the bounds of its parent container
- The element remains in the document flow, affecting layout
- Works best in scrollable containers (not fixed-size viewports)

## Browser Compatibility Summary

### Overall Support Status

- **Global Support**: 92.57% (browsers with full support)
- **Partial Support**: 0.52% (browsers with limitations)
- **No Support**: ~7% (primarily older browsers and Opera Mini)

### Practical Considerations

**Safe to Use For:**
- Modern browser applications (Chrome 91+, Firefox 59+, Safari 13+, Edge 91+)
- Mobile applications (iOS 13+, Android 5.0+)
- Enterprise applications with modern browser requirements

**Requires Fallback/Polyfill For:**
- Internet Explorer (all versions)
- Legacy Safari versions (< 13)
- Legacy Chrome versions (< 91)
- Opera Mini (all versions)
- Older Firefox versions (< 59)

## Progressive Enhancement Strategy

### Using @supports Rule

```css
/* Feature detection */
@supports (position: sticky) {
  .header {
    position: sticky;
    top: 0;
  }
}

/* Fallback for non-supporting browsers */
@supports not (position: sticky) {
  .header {
    position: relative;
    /* Provide alternative styling */
  }
}
```

### JavaScript Polyfills

Several polyfills are available for browsers that don't support sticky positioning:

- [Stickybits](https://github.com/dollarshaveclub/stickybits) - Lightweight sticky positioning polyfill
- [Stickyfill](https://github.com/wilddeer/stickyfill) - Another robust sticky polyfill option

## Related Resources

### Official Documentation

- [MDN Web Docs - CSS position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [WebPlatform Docs - CSS position](https://webplatform.github.io/docs/css/properties/position)

### Articles & Guides

- [HTML5 Rocks - Stick your landings: position:sticky lands in WebKit](https://developers.google.com/web/updates/2012/08/Stick-your-landings-position-sticky-lands-in-WebKit)
- [geddski article: Examples and Gotchas](https://mastery.games/post/position-sticky/)

### Polyfills

- [Stickybits GitHub](https://github.com/dollarshaveclub/stickybits)
- [Stickyfill GitHub](https://github.com/wilddeer/stickyfill)

## Special Notes

### Key Implementation Detail

The sticky element sticks to its nearest ancestor that has a scrolling mechanism (created when overflow is set to `hidden`, `scroll`, `auto`, or `overlay`), even if that ancestor isn't the nearest actually scrolling ancestor. This is important for understanding where sticky elements will attach.

### Cross-Browser Gotchas

1. **Safari's Overflow Issue**: If a sticky element's parent has `overflow: auto` or similar, it may not work as expected in Safari
2. **Table Element Limitations**: While modern browsers support sticky `th` elements, `thead` and `tr` are not supported
3. **Containment**: The element can only stick within the bounds of its containing block
4. **Transform Context**: Applying transforms to parent elements can affect sticky positioning behavior

## Last Updated

This documentation is based on CanIUse data current as of late 2024. Browser support continues to improve, and you should verify current support at [caniuse.com/css-sticky](https://caniuse.com/css-sticky).
