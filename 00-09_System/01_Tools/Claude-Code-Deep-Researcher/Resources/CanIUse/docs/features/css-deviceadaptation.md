# CSS Device Adaptation

## Overview

The `@viewport` CSS rule provides a method for overriding the viewport size in web pages, offering an alternative to the widely-used `<meta>` viewport tag. It includes support for the `extend-to-zoom` width value, enabling developers to define viewport behavior directly in CSS rather than HTML metadata.

## Description

CSS Device Adaptation replaces Apple's popular `<meta name="viewport">` implementation with a CSS-based approach through the `@viewport` rule. This specification was designed to provide more consistent and flexible viewport configuration across different browsers and devices.

## Specification

**Status:** Working Draft (WD)
**Link:** [CSS Device Adaptation - W3C](https://www.w3.org/TR/css-device-adapt/)

**Note:** Due to lack of implementation, this specification [is slated to be retired](https://github.com/w3c/csswg-drafts/issues/4766).

## Category

- CSS

## Benefits & Use Cases

### Primary Benefits
- **CSS-Based Configuration:** Define viewport properties directly in stylesheets instead of HTML meta tags
- **Standardized Approach:** W3C standard alternative to proprietary meta viewport implementations
- **Consistent Behavior:** Intent to provide uniform viewport handling across browsers
- **Extended Features:** Support for `extend-to-zoom` and other advanced viewport properties

### Intended Use Cases
1. **Responsive Design:** Configure how pages scale on mobile and tablet devices
2. **Device Adaptation:** Automatically adjust layout based on device characteristics
3. **Zoom Control:** Manage user zoom behavior through CSS rules
4. **Mobile Optimization:** Define viewport width, height, and scaling properties

## Browser Support

### Support Status Legend
- **Supported (y):** Full support for the feature
- **Partial (a):** Partial or limited support
- **Not Supported (n):** No support
- **Deprecated (d):** Deprecated or removed support
- **Note Markers:** Check notes section for implementation details

### Support Summary by Browser

| Browser | First Full Support | Latest Status | Notes |
|---------|-------------------|---------------|-------|
| **Internet Explorer** | None | Not Supported | Limited partial support in IE 10-11 (#1) |
| **Edge (Chromium)** | None | Not Supported | Legacy Edge (12-18) had partial support (#1); Chromium Edge unsupported |
| **Firefox** | None | Not Supported | No support across all versions |
| **Chrome** | None | Not Supported | No support since v4; marked deprecated since v29 |
| **Safari** | None | Not Supported | No support across all versions |
| **Opera** | None | Not Supported | No support since v9; marked deprecated since v40 |
| **iOS Safari** | None | Not Supported | No support across all versions |
| **Android** | None | Not Supported | No support across all versions |
| **Samsung Internet** | None | Not Supported | No support across all versions |
| **Opera Mobile** | None | Partial Support (#2) | Limited support for 'orientation' property only (v11-12.1) |
| **Opera Mini** | None | Partial Support (#2) | Limited support for 'orientation' property only |

### Detailed Browser Support

#### Desktop Browsers
- **Internet Explorer:** Partial support (v10-11) - width and height properties only
- **Edge (Legacy):** Partial support (v12-18) - width and height properties only
- **Edge (Chromium):** No support since v79
- **Firefox:** No support in any version
- **Chrome:** No support; deprecated since v29
- **Safari:** No support in any version
- **Opera:** No support; deprecated since v40

#### Mobile Browsers
- **iOS Safari:** No support in any version
- **Android Browser:** No support in any version
- **Samsung Internet:** No support in any version
- **Opera Mobile:** Limited support (v11-12.1) for orientation property only
- **Opera Mini:** Limited support for orientation property only
- **IE Mobile:** Partial support (v10-11) - width and height properties only

## Implementation Notes

### Browser-Specific Limitations

**#1 - Internet Explorer and Edge Legacy Limited Support**
Internet Explorer 10-11 and Edge Legacy (v12-18) only support the `width` and `height` properties of the `@viewport` rule. Other properties like `zoom`, `user-zoom`, and `orientation` are not supported.

**#2 - Opera Mobile/Mini Limited Support**
Opera Mobile (v11-12.1) and Opera Mini only support the `orientation` property of the `@viewport` rule, with no support for viewport width, height, or zoom-related properties.

## Known Issues & Status

### Specification Retirement

The CSS Device Adaptation specification is **slated to be retired** due to lack of implementation across major browsers. Rather than replacing the `<meta name="viewport">` tag, browsers have standardized support for the meta tag approach instead.

### Current Situation
- **Zero adoption** in modern browsers (Chrome, Firefox, Safari, modern Edge)
- **Legacy support** only in older Internet Explorer and Edge versions
- **Alternative:** The `<meta name="viewport">` tag remains the standard for viewport configuration
- **Recommendation:** Continue using `<meta name="viewport">` for all modern web development

## Related Resources

### Official Documentation
- [Introduction to meta viewport and @viewport in Opera Mobile](https://dev.opera.com/articles/view/an-introduction-to-meta-viewport-and-viewport/) - Opera Developer Documentation
- [Device adaptation in Internet Explorer 10](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/dev-guides/hh708740(v=vs.85)) - Microsoft Documentation

### Browser Tracking Issues
- [Chrome Tracking Bug](https://code.google.com/p/chromium/issues/detail?id=155477)
- [WebKit Tracking Bug](https://bugs.webkit.org/show_bug.cgi?id=95959)
- [Mozilla Tracking Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=747754)

### Standards
- [W3C CSS Device Adaptation Specification](https://www.w3.org/TR/css-device-adapt/)
- [W3C CSSWG Retirement Discussion](https://github.com/w3c/csswg-drafts/issues/4766)

## Migration Guide

### Why `@viewport` Isn't Recommended

Due to the lack of browser support and the impending retirement of the specification, **using `@viewport` in production is not recommended**. Instead:

### Use the Standard Approach

```html
<!-- Recommended: Use meta viewport tag -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Meta Viewport Advantages
- Widely supported across all modern and legacy browsers
- Simple, proven, and standardized approach
- Better documented across all platforms
- No browser compatibility issues

## Statistics

**Global Usage:** Less than 0.37% of websites use any form of the `@viewport` rule, with nearly all usage being partial/limited implementations.

**Partial Support:** 0.37% (primarily legacy IE and Opera browsers)
**Full Support:** 0% (no modern browsers)

---

*Last Updated: 2025*
*Data Source: Can I Use*
