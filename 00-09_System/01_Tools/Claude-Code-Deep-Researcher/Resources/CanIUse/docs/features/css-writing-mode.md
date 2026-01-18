# CSS Writing-Mode Property

## Overview

The `writing-mode` CSS property defines whether lines of text are laid out horizontally or vertically and the direction in which blocks progress. This property is essential for supporting languages and scripts that use vertical text layouts, such as Chinese, Japanese, Korean, and other East Asian languages.

## Description

The `writing-mode` property controls the block flow direction and text layout orientation on a web page. It enables developers to create interfaces that naturally support vertical writing systems and various text directions, improving accessibility and usability for international audiences.

**Use Cases:**
- Creating layouts for East Asian languages with vertical writing systems
- Implementing magazine-style layouts with vertical text
- Designing headers or labels with vertical orientation
- Supporting right-to-left (RTL) and bidirectional text layouts
- Building responsive typography systems for multilingual content

## Specification Status

**Status:** Recommendation (REC)

**W3C Specification:** [CSS Writing Modes Level 3](https://w3c.github.io/csswg-drafts/css-writing-modes-3/#block-flow)

The `writing-mode` property is fully standardized and has reached the Recommendation stage at the W3C, indicating it is a stable, mature feature ready for production use.

## Categories

- **CSS** - Core Cascading Style Sheets specification

## Browser Support Summary

**Global Usage:** 93.21% of users have full support

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| Edge | Version 12+ | Full Support |
| Firefox | Version 41+ | Full Support |
| Chrome | Version 48+ | Full Support (since v48, with prefix v8-47) |
| Safari | Version 11+ | Full Support (since v11, with prefix v5.1-10) |
| Opera | Version 35+ | Full Support (since v35, with prefix v15-34) |
| iOS Safari | Version 11.0+ | Full Support (since v11, with prefix v5.0-10) |
| Chrome Android | Version 142+ | Full Support |
| Firefox Android | Version 144+ | Full Support |
| Samsung Internet | Version 4+ | Full Support (since v5.0, with prefix v4) |
| UC Browser | Version 15.5+ | Full Support |
| Opera Mini | None | Not Supported |

## Detailed Browser Support Table

### Desktop Browsers

| Browser | Version | Support Status |
|---------|---------|----------------|
| **Chrome** | 4-7 | Not Supported |
| | 7 | Unknown |
| | 8-47 | Supported with prefix (-webkit-) |
| | 48+ | Fully Supported |
| **Firefox** | 2-40 | Not Supported |
| | 36-40 | Supported (behind flag: `layout.css.vertical-text.enabled`) |
| | 41+ | Fully Supported |
| **Safari** | 3.1-5 | Not Supported |
| | 5 | Unknown |
| | 5.1-10 | Supported with prefix (-webkit-) |
| | 11+ | Fully Supported |
| **Edge** | 12+ | Fully Supported |
| **Opera** | 9-14.1 | Not Supported |
| | 15-34 | Supported with prefix (-webkit-) |
| | 35+ | Fully Supported |
| **Internet Explorer** | All versions | Alternative implementation (earlier spec version) |

### Mobile Browsers

| Browser | Version | Support Status |
|---------|---------|----------------|
| **iOS Safari** | 3.2-4.3 | Unknown |
| | 5.0-5.1 | Supported with prefix (-webkit-) |
| | 6.0-10 | Supported with prefix (-webkit-) |
| | 11.0+ | Fully Supported |
| **Android Browser** | 2.1-2.3 | Not Supported |
| | 3-4.4.4 | Supported with prefix (-webkit-) |
| | 4.4+ | Fully Supported |
| **Chrome Mobile** | Version 142+ | Fully Supported |
| **Firefox Mobile** | Version 144+ | Fully Supported |
| **Samsung Internet** | 4 | Supported with prefix (-webkit-) |
| | 5.0+ | Fully Supported |
| **Opera Mobile** | 10-12.1 | Not Supported |
| | 80+ | Fully Supported |
| **Opera Mini** | All versions | Not Supported |

## Implementation Notes

### Known Issues

- **Internet Explorer:** Supports different values from an [earlier version of the specification](https://www.w3.org/TR/2003/CR-css3-text-20030514/#Progression), which originated from SVG. Legacy IE support should not be relied upon for modern implementations.

- **Firefox (Pre-41):** The feature is supported in Firefox versions 36-40 under the `layout.css.vertical-text.enabled` flag. This flag must be enabled in `about:config` for support in those versions.

### Prefix Support

- **Chrome 8-47:** Requires `-webkit-` prefix
- **Safari 5.1-10:** Requires `-webkit-` prefix
- **Opera 15-34:** Requires `-webkit-` prefix
- **iOS Safari 5.0-10:** Requires `-webkit-` prefix
- **Android 3-4.4.4:** Requires `-webkit-` prefix
- **Samsung Internet 4:** Requires `-webkit-` prefix

### Vendor Prefixes Example

```css
/* Modern browsers (no prefix needed) */
.vertical-text {
  writing-mode: vertical-rl;
}

/* Older WebKit-based browsers */
.vertical-text {
  -webkit-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
}
```

## Related Resources

- **[MDN Web Docs - CSS writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)** - Comprehensive documentation with examples and specifications
- **[Chrome Platform Status](https://www.chromestatus.com/feature/5707470202732544)** - Chrome's implementation status and timeline

## Implementation Guidelines

### When to Use Vendor Prefixes

If you need to support:
- Chrome < 48
- Safari < 11
- Firefox < 41
- Opera < 35

Then include the `-webkit-` prefix in your CSS:

```css
.vertical {
  -webkit-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
}
```

### Progressive Enhancement

For maximum compatibility, always include the non-prefixed version after the prefixed version:

```css
.vertical {
  -webkit-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
}
```

### Feature Detection

Use CSS feature detection or JavaScript to check for support:

```javascript
const supportsWritingMode = CSS.supports('writing-mode', 'vertical-rl');
if (supportsWritingMode) {
  // Use writing-mode
} else {
  // Provide fallback
}
```

## Recommendation

With **93.21% global browser support** and an official W3C Recommendation status, `writing-mode` is safe for production use in modern applications. For legacy browser support (< 5% of users), consider using feature detection and graceful fallbacks.

---

**Last Updated:** December 2025
**Data Source:** CanIUse database
