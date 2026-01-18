# CSS Exclusions Level 1

## Overview

CSS Exclusions defines how inline content flows around elements. It extends the content wrapping ability of floats to any block-level element, providing advanced layout control for complex document designs.

**Status Badge:** ![Working Draft](https://img.shields.io/badge/Status-Working%20Draft-orange)

---

## Specification

| Property | Details |
|----------|---------|
| **Official Title** | CSS Exclusions Level 1 |
| **Status** | Working Draft (WD) |
| **Specification URL** | https://www.w3.org/TR/css3-exclusions/ |
| **Last Updated** | [See W3C page for latest updates] |

---

## Categories

- **CSS** - Cascading Style Sheets

---

## What is CSS Exclusions?

### Definition

CSS Exclusions extend the float concept to allow content to flow around any block-level element, not just floated elements. This provides designers and developers with more powerful and flexible layout capabilities for complex document designs.

### Key Features

- **Wrapping Control**: Define how inline content wraps around block-level elements
- **Advanced Layouts**: Enables magazine-style and newspaper-like layouts on the web
- **Flexible Positioning**: Beyond traditional float behavior with greater control
- **Content Flow Management**: Define exclusion areas that shape how text and inline content flows

---

## Benefits and Use Cases

### Primary Use Cases

1. **Magazine & Newspaper Layouts**
   - Create sophisticated print-like layouts with text flowing around images and content boxes
   - Achieve complex multi-column designs with shaped content regions

2. **Advanced Typography**
   - Wrap text around non-rectangular shapes
   - Create visually interesting document presentations
   - Design elegant article layouts with sidebar exclusions

3. **Complex Document Design**
   - More control than traditional floats allow
   - Shape-based content flow
   - Precise layout specifications for publishing

4. **Interactive Content**
   - Define exclusion zones for interactive elements
   - Control how content flows around dynamic elements
   - Create sophisticated responsive layouts

### Benefits

- **Design Flexibility**: Much greater control over content flow than floats
- **Semantic HTML**: Can apply wrapping to any block-level element
- **Professional Layouts**: Enables publication-quality page layouts on the web
- **Future-Proof**: Part of the CSS specification standard

---

## Browser Support

### Support Legend

- **✅ Full Support** (`y`) - Feature fully implemented
- **⚠️ Partial Support** (`y x`) - Implemented with vendor prefix required
- **❌ No Support** (`n`) - Feature not implemented

### Browser Support Table

| Browser | First Support | Support Status | Notes |
|---------|---------------|---|---------|
| **Internet Explorer** | 10 | ⚠️ Partial (`-ms-`) | IE 10-11 with prefix |
| **Edge (Legacy)** | 12 | ⚠️ Partial (`-ms-`) | Edge 12-18 with prefix; Chromium Edge (79+) has no support |
| **Edge (Chromium)** | 79+ | ❌ None | Not supported in modern Chromium-based Edge |
| **Firefox** | — | ❌ None | No support in any version up to 148 |
| **Chrome** | — | ❌ None | No support in any version up to 146 |
| **Safari** | — | ❌ None | No support in any version including Technical Preview |
| **Safari iOS** | — | ❌ None | No support in any version up to 26.1 |
| **Opera** | — | ❌ None | No support in any version up to 122 |
| **Opera Mobile** | — | ❌ None | No support in any version |
| **Opera Mini** | — | ❌ None | Not supported |
| **Android Browser** | — | ❌ None | No support |
| **Chrome Android** | — | ❌ None | No support |
| **Firefox Android** | — | ❌ None | No support |
| **Samsung Internet** | — | ❌ None | No support in any version |
| **IE Mobile** | 10 | ⚠️ Partial (`-ms-`) | Windows Phone only |

### Global Support Summary

- **Full Support**: < 1% of global users (IE 10, IE 11, Edge Legacy 12-18)
- **Partial Support**: Requires vendor prefix (`-ms-`)
- **Overall Browser Support**: Extremely Limited
- **Current Usage**: 0.33% of global web traffic

---

## Implementation Details

### Vendor Prefixes

CSS Exclusions require vendor prefixes in browsers that support them:

- **Internet Explorer**: `-ms-wrap-flow`, `-ms-wrap-through`
- **Edge Legacy**: `-ms-wrap-flow`, `-ms-wrap-through`

### CSS Properties

Key properties related to CSS Exclusions:

```css
/* Define exclusion element */
.element {
  -ms-wrap-flow: auto | both | start | end | maximum | clear;
  -ms-wrap-through: wrap | none;
}
```

**Property Details:**

- `wrap-flow`: Controls how content wraps around the element
- `wrap-through`: Controls whether content passes through the element

---

## Known Issues & Limitations

### Current Status

1. **Very Limited Implementation**: Only Internet Explorer and legacy Edge have partial support
2. **Stalled Specification**: This feature is a Working Draft with minimal industry adoption
3. **No Modern Browser Support**: Current versions of Chrome, Firefox, Safari, and modern Edge do not support this feature
4. **Not Recommended for Production**: Not suitable for modern web development due to lack of support

### Tracked Issues

| Browser | Tracking Issue | Status |
|---------|---|---|
| **Firefox** | [Bug 674804](https://bugzilla.mozilla.org/show_bug.cgi?id=674804) | Open - No activity |
| **WebKit/Safari** | [Bug 57311](https://bugs.webkit.org/show_bug.cgi?id=57311) | Open - No activity |
| **Chromium** | [Bug 700838](https://crbug.com/700838) | Open - No activity |

### Alternatives

Since CSS Exclusions have minimal support, consider these alternatives:

1. **CSS Grid** - Modern, well-supported layout system
2. **CSS Flexbox** - For flexible, responsive layouts
3. **Float + Shape Properties** - `shape-outside` provides some wrapping capabilities
4. **CSS Columns** - For multi-column text layouts
5. **JavaScript Solutions** - For complex wrapping requirements

---

## Specification Status

### Working Draft (WD)

CSS Exclusions Level 1 is a W3C Working Draft, meaning:

- It is still in development and subject to change
- Not recommended for production use
- Browser vendors are not prioritizing implementation
- The specification is not finalized

### Why Stalled?

Several factors have contributed to the lack of adoption:

1. **Complex Specification**: Difficult to implement across different engines
2. **Limited Use Cases**: Most layout needs addressed by Grid and Flexbox
3. **Alternative Solutions**: CSS Grid provides similar layout capabilities
4. **Industry Priority Shift**: Focus moved to Grid/Flexbox as primary layout tools

---

## Related Specifications and Links

### W3C Documentation

- **[CSS Exclusions Level 1 Specification](https://www.w3.org/TR/css3-exclusions/)** - Official W3C specification

### Browser Documentation

- **[Microsoft: CSS Exclusions](https://msdn.microsoft.com/en-us/library/ie/hh673558(v=vs.85).aspx)** - MSDN documentation for IE implementation

### Issue Tracking

- **[Firefox Bug 674804](https://bugzilla.mozilla.org/show_bug.cgi?id=674804)** - Mozilla Firefox tracking issue
- **[WebKit Bug 57311](https://bugs.webkit.org/show_bug.cgi?id=57311)** - Safari/WebKit tracking issue
- **[Chromium Bug 700838](https://crbug.com/700838)** - Google Chrome tracking issue

### Related CSS Features

- [CSS Shapes Module Level 1](https://www.w3.org/TR/css-shapes/) - `shape-outside` for content wrapping
- [CSS Grid Layout](https://www.w3.org/TR/css-grid-1/) - Modern layout alternative
- [CSS Flexible Box Layout](https://www.w3.org/TR/css-flexbox-1/) - Flexible layout system
- [CSS Columns](https://www.w3.org/TR/css-multicol-1/) - Multi-column text layout

---

## Keywords

`floats`, `exclusions`, `wrap-flow`, `wrap-through`

---

## Summary

CSS Exclusions represents an advanced layout feature that was designed to provide powerful content wrapping capabilities. However, due to limited browser adoption and the emergence of superior layout alternatives like CSS Grid, it remains a Working Draft with minimal real-world usage (0.33% of websites).

For modern web development, CSS Grid and Flexbox are recommended as primary layout solutions, with CSS Shapes' `shape-outside` property available for content wrapping needs on currently supported browsers.

**Recommendation**: Do not rely on CSS Exclusions for production websites. Use CSS Grid, Flexbox, or CSS Shapes as alternatives.
