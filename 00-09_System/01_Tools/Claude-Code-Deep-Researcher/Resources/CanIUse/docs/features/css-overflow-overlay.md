# CSS overflow: overlay

## Overview

The `overlay` value for the CSS `overflow` property is a **non-standard, deprecated feature** that makes scrollbars appear on top of content rather than taking up space in the layout. This property was originally introduced as a webkit-specific extension but is no longer recommended for new development.

## Status & Specification

**Specification Status:** Unofficial / Deprecated

**Related Standard:** This feature's functionality is being standardized through the [`scrollbar-gutter` property](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter), which is the recommended modern approach for controlling scrollbar layout behavior.

**Spec Reference:** [W3C CSSWG GitHub Issue #92](https://github.com/w3c/csswg-drafts/issues/92)

## Description

The `overflow: overlay` CSS value was designed to overlay scrollbars on top of content without affecting the element's layout. Unlike `overflow: auto`, which reserves space for scrollbars and can cause layout shifts when scrollbars appear or disappear, `overlay` intended to keep the scrollbar floating above the content.

### Why It's Deprecated

Due to inconsistent implementation across browsers and the potential for content to be obscured by scrollbars, this feature is deprecated. Modern web development should use the standardized `scrollbar-gutter` property instead, which provides better control and more predictable behavior across browsers.

## Categories

- **CSS** - Cascading Style Sheets

## Use Cases & Benefits

### Original Intended Benefits

- **Layout Stability:** Prevent layout shifts caused by scrollbar appearance/disappearance
- **Cleaner Aesthetics:** Scrollbars overlay content without taking up dedicated space
- **Space Efficiency:** Maximize available space for content on smaller screens
- **Smoother Transitions:** Avoid reflows when scrollbars become visible/hidden

### Modern Alternative

Developers should use the [`scrollbar-gutter` property](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter) instead, which provides:
- Stable layout guarantee
- Standard specification support
- Better cross-browser compatibility
- Explicit control over scrollbar space reservation

## Browser Support

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 15 | ✅ 4-113 | Unsupported with note from v114+ |
| **Edge** | 79 | ✅ 79-113 | Unsupported with note from v114+ |
| **Safari** | 4 | ✅ 4-11.1 | No longer supported from v12+ |
| **Firefox** | N/A | ❌ Never supported | Not implemented in any version |
| **Opera** | 15 | ✅ 15-99 | Unsupported with note from v100+ |
| **iOS Safari** | 4.0 | ✅ 4.0-11.4 | No longer supported from v12+ |
| **Android** | 2.1 | ✅ 2.1-4.4.3+ | Unsupported from v142+ |
| **Samsung Internet** | 4 | ✅ 4-99+ | Shows note behavior from v100+ |
| **Opera Mobile** | N/A | ❌ Not supported (until v80) | Supported v80 only, then dropped |
| **Opera Mini** | N/A | ❌ Never supported | Not implemented |
| **IE / IE Mobile** | N/A | ❌ Never supported | Not implemented |

### Support Legend

- ✅ **Supported (y)** - Feature fully supported
- ⚠️ **Unsupported with Note (#1)** - Feature recognized but behaves the same as "auto"
- 🔶 **Unknown Support (u)** - Support status unclear or partially supported
- ❌ **Not Supported (n)** - Feature not implemented

### Critical Note

As of **Chrome 114, Edge 114, Opera 100, and Safari 12**, the `overlay` value is recognized by the browser but **behaves identically to `overflow: auto`**. This means:

- Scrollbars take up space in the layout (not overlaid)
- The original intent of the `overlay` value is lost
- Using this property provides no practical advantage over `auto`

## Historical Support Timeline

### Wide Support Period (2012-2019)
- Chrome 15+ (2012): Full support
- Safari 4+ (2009): Full support
- Opera 15+ (2013): Full support
- Android 2.1+ (2010): Full support

### Deprecation Period (2020-2024)
- Safari 12+ (2018): Dropped support
- iOS Safari 12+ (2018): Dropped support
- Chrome 114+ (2024): Recognized but behaves as "auto"
- Edge 114+ (2024): Recognized but behaves as "auto"
- Opera 100+ (2024): Recognized but behaves as "auto"

### Never Adopted
- Firefox: No implementation
- Internet Explorer: No implementation
- Opera Mini: No implementation

## Usage Statistics

- **Global Support:** 8.29% of users on browsers with support
- **Active Development:** Not recommended; use modern alternatives instead

## Examples

### Legacy Code (Not Recommended)

```css
/* This no longer works as originally intended */
.scrollable-container {
  overflow: overlay;
  height: 300px;
}
```

### Modern Alternative (Recommended)

```css
/* Use scrollbar-gutter instead */
.scrollable-container {
  scrollbar-gutter: stable;
  height: 300px;
}
```

The `scrollbar-gutter: stable` property:
- Reserves space for scrollbars to prevent layout shift
- Works consistently across all modern browsers
- Is part of the official CSS specification
- Provides predictable, documented behavior

## Migration Guide

### From overflow: overlay

If you have existing code using `overflow: overlay`, consider these options:

1. **For layout stability:** Use `scrollbar-gutter: stable`
2. **For no reserved space:** Migrate to `overflow: auto` (note: this will cause layout shifts)
3. **For custom scrollbars:** Use JavaScript to control scrollbar visibility and layout

### Browser Compatibility Check

Before migrating:
- Test in Chrome 114+ where `overlay` now behaves as `auto`
- Test in Safari 12+ where `overlay` is no longer supported
- Consider your target browser versions

## Related Properties

- [`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) - Main CSS property
- [`scrollbar-gutter`](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter) - Modern replacement (Recommended)
- [`overflow-x`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x) - Horizontal overflow control
- [`overflow-y`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-y) - Vertical overflow control

## References & Links

### Official Resources
- [MDN: CSS overflow property values](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#values)
- [MDN: CSS scrollbar-gutter property](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)
- [W3C CSSWG Issue #92: Standardize overlay scrollbars](https://github.com/w3c/csswg-drafts/issues/92)

### Implementation Details
- [WebKit Change: Make "overflow: overlay" a synonym for "overflow: auto"](https://trac.webkit.org/changeset/236341/webkit)

## Notes & Considerations

### For Developers

1. **Avoid Using This Property** - `overflow: overlay` is deprecated and no longer provides intended functionality in modern browsers
2. **Use `scrollbar-gutter` Instead** - This is the standardized solution for layout stability with scrollbars
3. **Browser Compatibility Varies** - Recent versions treat `overlay` as `auto`, removing the overlay behavior
4. **Layout Shifts** - If using `overflow: auto` or `overlay`, expect potential layout shifts when scrollbars appear/disappear

### Accessibility Considerations

- Overlay scrollbars can obscure content
- Users may miss important information if scrollbars cover text or interactive elements
- Use `scrollbar-gutter: stable` for better content visibility

### Performance

- Using `overflow: overlay` no longer provides performance benefits
- Modern browsers handle `auto` and `overlay` identically
- Focus on content optimization rather than scrollbar styling

## Summary

`CSS overflow: overlay` is a deprecated, non-standard property that is no longer recommended for use. While it was supported in Chromium-based browsers and Safari for many years, it has been superseded by the `scrollbar-gutter` CSS property, which is now the standardized approach for controlling scrollbar layout behavior. Modern browsers treat `overlay` as equivalent to `auto`, meaning the intended overlay behavior is no longer available.

**Recommendation:** Use `scrollbar-gutter: stable` for modern browsers to achieve layout stability with scrollbars, or implement custom scrollbar solutions using modern CSS and JavaScript techniques.
