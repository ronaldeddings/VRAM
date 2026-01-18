# CSS `user-select: none`

## Overview

The `user-select: none` CSS property prevents text and element selection using CSS. This feature allows developers to disable text selection on specific elements, which is useful for UI components that shouldn't be selectable by users.

## Description

`user-select: none` is a CSS method of preventing text/element selection. When applied to an element, it disables the default user ability to select the element's content by clicking and dragging or other selection methods. This property is commonly used for:

- Preventing accidental text selection on buttons and interactive elements
- Creating cleaner interfaces where certain text isn't meant to be copied
- Improving user experience in web applications with custom UI controls

## Specification Status

**Status:** Working Draft (WD)

**Specification URL:** [W3C CSS UI Level 4 - user-select](https://w3c.github.io/csswg-drafts/css-ui-4/#valdef-user-select-none)

## Categories

- **CSS** - CSS User Interface Module

## Use Cases & Benefits

### Primary Use Cases

1. **Button Text Protection** - Prevent selection when users click interactive buttons
2. **Navigation Elements** - Disable selection on menu items and navigation links
3. **UI Components** - Keep custom UI components from being accidentally selected
4. **Drag-and-Drop Interfaces** - Prevent text selection during drag operations
5. **Touchscreen Optimization** - Improve experience on mobile devices where selection can interfere

### Key Benefits

- **Enhanced User Experience** - Reduces accidental selection during interactions
- **Professional Interface** - Creates cleaner, more polished-looking applications
- **Mobile-Friendly** - Particularly useful on touchscreen devices
- **Pure CSS Solution** - No JavaScript required for basic functionality
- **Wide Browser Support** - Supported across all modern browsers

## Browser Support

| Browser | Supported Version | Prefix | Notes |
|---------|-------------------|--------|-------|
| **Chrome** | 4+ | `-webkit-` (4-53), unprefixed (54+) | Full support from v54 onwards |
| **Firefox** | 2+ | `-moz-` (2-68), unprefixed (69+) | Full support from v69 onwards |
| **Safari** | 3.1+ | `-webkit-` (3.1-18.5) | All versions with webkit prefix |
| **Edge** | 12+ | `-webkit-` (12-78), unprefixed (79+) | Full support from v79 onwards |
| **Opera** | 15+ | `-webkit-` (15-40), unprefixed (41+) | Full support from v41 onwards |
| **IE** | 10-11 | `-ms-` prefix only | Partial support with vendor prefix |
| **iOS Safari** | 3.2+ | `-webkit-` prefix | All versions require webkit prefix |
| **Android** | 2.1+ | `-webkit-` (2.1-4.4), unprefixed (4.4+) | Full support from v4.4 onwards |
| **Samsung Internet** | 4+ | `-webkit-` (4-6.4), unprefixed (6.2+) | Full support from v6.2 onwards |
| **Opera Mobile** | 80+ | unprefixed | Modern versions fully supported |
| **UC Browser** | 15.5+ | unprefixed | Full support |
| **Baidu Browser** | 13.52+ | unprefixed | Full support |
| **KaiOS** | 2.5+ | `-webkit-` (2.5), unprefixed (3.0+) | Support from v3.0 onwards |

### Summary

- **Current Usage:** 93.6% of users globally
- **IE 10-11 Support:** Requires `-ms-user-select: none` prefix
- **Mobile Support:** Excellent across all major mobile browsers
- **Legacy Support:** Early versions require `-webkit-` or `-moz-` prefixes

## Implementation Examples

### Basic Usage

```css
/* Unprefixed (modern browsers) */
.no-select {
  user-select: none;
}

/* For maximum compatibility */
.no-select {
  -webkit-user-select: none;  /* Safari, Chrome, Opera */
  -moz-user-select: none;     /* Firefox */
  -ms-user-select: none;      /* IE 10+ and Edge */
  user-select: none;          /* Standard syntax */
}
```

### Real-World Examples

```css
/* Disable selection on buttons */
button {
  user-select: none;
}

/* Disable selection on navigation */
nav {
  -webkit-user-select: none;
  user-select: none;
}

/* Keep selection enabled on interactive inputs */
input,
textarea {
  user-select: text;
}

/* Disable selection on headers but allow on content */
h1, h2, h3 {
  user-select: none;
}

p {
  user-select: text;
}
```

## Known Issues & Limitations

### iOS Safari Bug

**Issue:** iOS Safari does not allow input elements to be focused (preventing text input) when the element has `-webkit-user-select: none` set.

**Workaround:** Avoid applying `user-select: none` to input fields on iOS. Use targeted selectors for specific elements that don't require focus.

### Android 4.0 and Below

**Issue:** Some manufacturer-specific versions of Android 4.0 and earlier have reported issues with the property, though other versions work correctly.

**Note:** This is a legacy issue and unlikely to affect modern development.

## Related Properties

- `user-select: auto` - Default behavior
- `user-select: text` - Allow text selection
- `user-select: all` - Select all content with a single click
- `user-select: contain` - Selection is contained within the element

## References & Additional Resources

### Official Documentation

- [MDN Web Docs - CSS user-select](https://developer.mozilla.org/en-US/docs/CSS/user-select)
- [W3C CSS UI Level 4 Specification](https://w3c.github.io/csswg-drafts/css-ui-4/#valdef-user-select-none)
- [MSDN Documentation](https://docs.microsoft.com/en-us/previous-versions/hh781492(v=vs.85))

### Community Resources

- [CSS-Tricks - user-select Almanac](https://css-tricks.com/almanac/properties/u/user-select/)

### Bug Reports

- [WebKit Bug - Unprefixing `-webkit-user-select`](https://bugs.webkit.org/show_bug.cgi?id=208677)
- [WebKit Bug - iOS Input Focus Issue](https://bugs.webkit.org/show_bug.cgi?id=82692)

## Browser Compatibility

**Global Support:** 93.6% of users globally have browsers supporting `user-select: none`

For projects requiring support for older browsers:

- **IE 9 and below:** Not supported, consider a fallback or polyfill
- **IE 10-11:** Use `-ms-user-select: none` with the standard property
- **Early mobile browsers:** Use `-webkit-` prefix alongside standard syntax

## Recommendation

The `user-select: none` property is production-ready and can be safely used in modern web applications. For maximum compatibility with older browsers and mobile platforms, use vendor prefixes:

```css
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

Always test on target browsers and devices, especially iOS, to ensure text input functionality is not affected.
