# CSS 2.1 Selectors

## Overview

CSS 2.1 Selectors represent the foundational selector syntax that powers modern CSS styling. This specification includes basic and intermediate selectors that are widely supported across all modern browsers and many legacy browsers.

## Description

CSS 2.1 selectors include a comprehensive set of basic CSS selectors for targeting HTML elements:

- **Universal Selector** (`*`) - Selects all elements
- **Child Selector** (`>`) - Selects direct children
- **Pseudo-classes**:
  - `:first-child` - First child element
  - `:link` - Unvisited links
  - `:visited` - Visited links
  - `:active` - Element being activated
  - `:hover` - Element being hovered
  - `:focus` - Element with focus
  - `:lang()` - Elements in specified language
- **Adjacent Sibling Selector** (`+`) - Selects adjacent sibling elements
- **Attribute Selectors**:
  - `[attr]` - Elements with attribute
  - `[attr="val"]` - Exact attribute match
  - `[attr~="val"]` - Attribute contains word
  - `[attr|="bar"]` - Attribute starts with value
- **Class Selector** (`.foo`) - Selects elements with specific class
- **ID Selector** (`#foo`) - Selects elements with specific ID

## Specification Status

- **Status**: W3C Recommendation (REC)
- **Specification URL**: [W3C CSS 2.1 Selectors](https://www.w3.org/TR/CSS21/selector.html)

## Categories

- CSS2

## Use Cases & Benefits

### Responsive & Dynamic Styling
- Style elements based on user interaction (`:hover`, `:focus`, `:active`)
- Target different document states (`:visited` for links)
- Adapt content language with `:lang()`

### Semantic Markup
- Use ID and class selectors for precise element targeting
- Leverage structural selectors (`:first-child`, adjacent sibling)
- Build maintainable stylesheets with meaningful selectors

### Form Enhancement
- Apply styles based on element relationships
- Create dependent element styling
- Build accessible interactive components

### Content Organization
- Style first items in lists or sections
- Create visual relationships between adjacent elements
- Apply language-specific styling rules

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| **Chrome** | 4+ | Full (Y) |
| **Edge** | 12+ | Full (Y) |
| **Firefox** | 2+ | Full (Y) |
| **Safari** | 3.1+ | Full (Y) |
| **Opera** | 9+ | Full (Y) |
| **IE** | 5.5 - 11 | Partial - Full |
| **iOS Safari** | 3.2+ | Full (Y) |
| **Android** | 2.1+ | Full (Y) |
| **Opera Mini** | All | Full (Y) |
| **Samsung Browser** | 4+ | Full (Y) |
| **UC Browser** | 15.5+ | Full (Y) |

### Historical Support Timeline

**Internet Explorer:**
- IE 5.5: Not Supported (N)
- IE 6-7: Partial Support (P) - Some pseudo-classes and combinations not fully supported
- IE 8+: Full Support (Y)

**Modern Browsers:**
- All current versions of Chrome, Firefox, Safari, Edge, and Opera have full support
- Full support in all modern mobile browsers

## Browser-Specific Notes & Known Issues

### Internet Explorer Issues

1. **IE 7**: Does not support all pseudo-classes (`:focus`, `:before`, `:after`) or certain pseudo-elements
2. **IE 7**: `:first-child` pseudo-class fails if the first child is a comment node
   - Reference: [How to solve :first-child CSS bug in IE7](http://robertnyman.com/2009/02/04/how-to-solve-first-child-css-bug-in-ie-7/)
3. **IE 6**: Does not properly support combinations of pseudo-classes like `:link`, `:active`, and `:visited`
4. **IE 8-11**: Does not update an element's `:hover` status when scrolling without moving the pointer
   - Reference: [Microsoft Connect Feedback](https://web.archive.org/web/20150507025047/https://connect.microsoft.com/IE/feedback/details/926665)
5. **IE 10**: Adjacent sibling selector doesn't work with pseudo-class in cases like `E:active F`

### Safari & Mobile Issues

- **Safari 5.1 & Android Browsers**: Do not support the adjacent sibling selector (`+`) if the adjacent element is a `<nav>` element

### Security Considerations

- **Styling `:visited` links**: Support for styling visited links varies across browsers due to security and privacy concerns
  - Reference: [The Strange Behavior of the CSS :visited Pseudo-class](https://www.webfx.com/blog/web-design/visited-pseudo-class-strange/)

## Related Resources

- [Quirks Mode: Detailed Support Information](https://www.quirksmode.org/css/contents.html)
- [Your HTML Source: Examples of Advanced Selectors](https://www.yourhtmlsource.com/stylesheets/advancedselectors.html)
- [Selectivizr: Polyfill for IE6-8](http://selectivizr.com)
- [WebPlatform Docs: CSS Selectors](https://webplatform.github.io/docs/css/selectors)

## Implementation Notes

### Best Practices

1. **Avoid Internet Explorer 6-7 Specific Selectors**: If supporting legacy IE, test pseudo-class combinations thoroughly
2. **Use `:visited` Carefully**: Remember that `:visited` styling limitations exist for security
3. **Test Adjacent Sibling Selector**: On older Safari and Android devices, ensure proper testing
4. **Performance**: CSS selectors are highly optimized in modern browsers; use them freely

### Polyfills & Fallbacks

- **Selectivizr.com**: Provides JavaScript-based polyfill support for IE6-8, enabling more advanced CSS selectors

## Global Usage Statistics

- **Global Support**: 93.72% (as of latest data)
- **Partial Support**: 0% (no partial implementations in modern usage)

## Summary

CSS 2.1 selectors are the foundation of modern CSS and have near-universal support across all browsers and devices. While legacy Internet Explorer versions had partial support and various quirks, all modern browsers provide full support. This makes CSS 2.1 selectors safe to use in contemporary web development without requiring fallbacks or polyfills for current browser versions.
