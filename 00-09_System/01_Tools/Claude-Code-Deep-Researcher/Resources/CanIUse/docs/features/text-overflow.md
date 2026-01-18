# CSS3 Text-Overflow

## Overview

The `text-overflow` CSS property controls how text content that overflows its containing element is displayed. It allows you to append ellipsis or other indicators to show that text has been truncated.

## Description

The `text-overflow` property specifies whether text should be clipped, display ellipsis (`...`), or display a custom string when text content exceeds the boundaries of its container. This is particularly useful for creating clean, readable layouts when space is limited, such as in dropdown menus, navigation items, or data tables.

## Specification

- **Status**: Recommended (REC)
- **Spec URL**: [W3C CSS3 UI Module - Text Overflow](https://www.w3.org/TR/css3-ui/#text-overflow)

## Categories

- CSS3

## Use Cases & Benefits

### Practical Applications

1. **Navigation Menus**: Truncate long menu item labels with ellipsis
2. **Breadcrumbs**: Display truncated paths in breadcrumb navigation
3. **Data Tables**: Handle long text in table cells gracefully
4. **User Profiles**: Display truncated usernames or email addresses
5. **File Names**: Show truncated file names in file explorers
6. **Search Results**: Present results that may exceed available width
7. **Dropdowns**: Display truncated options in select lists
8. **Tooltips & Cards**: Manage content overflow in UI components

### Key Benefits

- **Improved UX**: Prevents text overflow from breaking layouts
- **Clean Design**: Creates professional, polished appearance
- **Accessibility**: Clear visual indicator when content is truncated
- **Performance**: CSS-based solution without JavaScript overhead
- **Responsive**: Works seamlessly across different screen sizes

## Browser Support

Text-overflow has excellent browser support across all modern and legacy browsers.

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Chrome** | v4+ | ✅ Full Support | Supported since early versions |
| **Firefox** | v7+ | ✅ Full Support | Partial support in v2-6, full from v7 |
| **Safari** | v3.1+ | ✅ Full Support | Supported across all versions |
| **Edge** | v12+ | ✅ Full Support | All versions supported |
| **Opera** | v11+ | ✅ Full Support | Partial support in v9-10.5, full from v11 |
| **IE** | v6+ | ✅ Full Support | IE5.5 not supported, v6+ supported |
| **iOS Safari** | v3.2+ | ✅ Full Support | All versions supported |
| **Android Browser** | v2.1+ | ✅ Full Support | All versions supported |
| **Opera Mini** | All | ✅ Full Support | All versions supported |
| **Opera Mobile** | v12.1+ | ✅ Full Support | Partial support in v10-12, full from v12.1 |
| **Samsung Internet** | v4+ | ✅ Full Support | All versions supported |
| **UC Browser** | v15.5+ | ✅ Supported | |

### Support Legend

- ✅ **Full Support (`y`)**: Property fully supported and working as expected
- 🟡 **Partial Support (`y x`)**: Supported with limitations or prefix
- ❌ **No Support (`n`)**: Not supported

### Desktop Browser Coverage

- **Chrome**: 100% (v4 and later)
- **Firefox**: 100% (v7 and later)
- **Safari**: 100% (v3.1 and later)
- **Edge**: 100% (v12 and later)
- **Opera**: 100% (v11 and later)
- **IE**: 99% (v6-11)

### Mobile Browser Coverage

- **iOS Safari**: 100% (v3.2 and later)
- **Android Browser**: 100% (v2.1 and later)
- **Chrome Mobile**: 100% (v142)
- **Firefox Mobile**: 100% (v144)
- **Samsung Internet**: 100% (v4 and later)

## Known Issues & Limitations

### Browser-Specific Bugs

1. **Select Elements**: Does not work on `<select>` elements in Chrome and IE; only Firefox supports this
   - **Workaround**: Use custom dropdown components for cross-browser support

2. **Text Rendering Issues**: Some Samsung-based browsers have bugs with overflowing text when ellipsis is set and `text-rendering` is not set to `auto`
   - **Workaround**: Ensure `text-rendering: auto` is specified in CSS

3. **Input Elements**: Does not work in IE8 and IE9 on `<input type="text">` elements
   - **Workaround**: Use polyfills for older IE versions or accept the limitation

### Current Usage

- **Global Support**: 93.72% of users can see the property working as expected
- **Partial Support**: 0% (no browsers with partial support)

## Implementation Notes

### Basic Usage

```css
/* Show ellipsis for overflowed text */
.truncated-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Required Properties

The `text-overflow` property requires the following CSS properties to work:

- `overflow: hidden;` - Hide the overflowing text
- `white-space: nowrap;` - Prevent text wrapping

### Multi-line Truncation

Note: `text-overflow` only works with single-line text truncation. For multi-line text truncation, consider using:

- CSS `-webkit-line-clamp` (webkit-based browsers)
- JavaScript solutions for cross-browser compatibility

## Related Resources

- [MDN Web Docs - text-overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)
- [W3C CSS3 UI Module](https://www.w3.org/TR/css3-ui/#text-overflow)
- [WebPlatform Docs](https://webplatform.github.io/docs/css/properties/text-overflow)
- [Feature Detection - has.js](https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-text-overflow)

## Polyfills

For older browsers that don't support `text-overflow`, the following polyfill is available:

- [jQuery AutoEllipsis](https://github.com/rmorse/AutoEllipsis) - jQuery polyfill for Firefox

## See Also

- [CSS `white-space` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
- [CSS `overflow` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- [CSS `-webkit-line-clamp` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp) (for multi-line truncation)
- [CSS `text-decoration` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration)

---

**Last Updated**: Based on CanIUse data
**Status**: Recommended (W3C)
**Keywords**: `text-overflow`, `ellipsis`, `truncation`
