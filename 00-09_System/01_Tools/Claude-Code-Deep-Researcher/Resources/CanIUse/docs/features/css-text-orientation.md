# CSS text-orientation

## Overview

The CSS `text-orientation` property specifies the orientation of text within a line in vertical writing contexts. This property only has an effect in vertical typographic modes (defined with the `writing-mode` property) and is essential for proper text rendering in languages and contexts that use vertical text layouts.

## Description

The `text-orientation` property controls how text characters are oriented when they appear in a vertical writing mode. It determines whether characters should be displayed upright or rotated within vertical text flows. This is particularly important for proper support of:

- Japanese and Chinese vertical text layouts
- Mongolian vertical writing
- Rotated text designs
- International typography with vertical scripts

## Specification Status

- **Status**: Recommendation (REC)
- **Specification**: [CSS Writing Modes Level 3 - text-orientation](https://w3c.github.io/csswg-drafts/css-writing-modes-3/#text-orientation)
- **W3C Status**: This property is part of the official W3C CSS Writing Modes specification and is stable for production use.

## Categories

- **CSS** - Core CSS specification

## Use Cases & Benefits

### Primary Use Cases

1. **International Typography**
   - Support for East Asian languages (Japanese, Chinese, Korean) with vertical text
   - Proper rendering of vertical script layouts
   - Authentic typography for cultural and linguistic contexts

2. **Design & Layout**
   - Vertical text designs in web applications
   - Print-like vertical layouts on the web
   - Creative text orientation effects
   - Magazine and book-style layouts

3. **Localization**
   - Multi-language support with vertical writing systems
   - Proper international content presentation
   - Culturally appropriate text rendering

### Benefits

- **Standards Compliance**: Implements W3C standard for vertical text handling
- **User Experience**: Enables proper display of vertical text layouts for global audiences
- **Design Flexibility**: Allows creative text orientation without JavaScript workarounds
- **Accessibility**: Proper semantic handling of vertical text improves screen reader support
- **Performance**: CSS-native solution without performance overhead

## Browser Support

### Support Legend
- **Y** - Fully supported
- **Y x** - Supported with vendor prefix (requires `-webkit-` prefix)
- **N** - Not supported
- **U** - Unsupported/Unknown status
- **N d** - Supported with flag/preference enabled

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| Chrome | Version 48 | Fully supported (v48+) | Stable support across all modern versions |
| Firefox | Version 41 | Fully supported (v41+) | Available with flag in v38-40 |
| Safari | Version 10.1 | Fully supported (v10.1+) | Required `-webkit-` prefix in v10.1-13 |
| Edge | Version 79 | Fully supported (v79+) | Full support from initial Chromium-based release |
| Opera | Version 35 | Fully supported (v35+) | Supports via shared Chromium engine |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| iOS Safari | Version 10.0-10.2 | Fully supported (v10+) |
| Android Chrome | Version 142 | Fully supported |
| Android Firefox | Version 144 | Fully supported |
| Samsung Internet | Version 5.0 | Fully supported (v5.0+) |
| Opera Mobile | Version 80 | Fully supported (v80+) |
| UC Browser | Version 15.5 | Supported |
| Android UC | Version 15.5 | Supported |
| Baidu | Version 13.52 | Supported |
| QQ Browser | Version 14.9 | Supported |
| KaiOS | Version 2.5 | Supported |

### Legacy Browsers (No Support)

- **Internet Explorer** - All versions (5.5-11) - No support
- **Opera Mini** - All versions - No support
- **BlackBerry Browser** - All versions (7, 10) - No support
- **Android Browser** - Early versions (2.1-4.4) - No support
- **IE Mobile** - All versions (10-11) - No support

## Implementation Notes

### Vendor Prefixes

Safari versions 10.1 through 13 require the `-webkit-` vendor prefix:

```css
/* For Safari 10.1-13 */
-webkit-text-orientation: mixed;
text-orientation: mixed;

/* For all other browsers */
text-orientation: mixed;
```

### Feature Detection

Firefox requires a flag to be enabled in early versions (38-40). Use feature detection to check support:

```javascript
const isSupported = CSS.supports('text-orientation', 'mixed');
```

### Dependency on writing-mode

The `text-orientation` property only applies in vertical writing contexts. It must be used in combination with `writing-mode`:

```css
.vertical-text {
  writing-mode: vertical-rl; /* or vertical-lr */
  text-orientation: mixed;
}
```

## Usage Statistics

- **Global Support**: 93.14% of users have browsers with support
- **Partial Support**: 0% with limited/partial support
- **Widespread Adoption**: The feature is widely supported across modern browsers

## Common Implementation Patterns

### Basic Vertical Text

```css
.vertical-container {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
```

### Mixed Orientation (East Asian Text)

```css
.asian-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
```

### Japanese Vertical Text

```css
.japanese-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: 'Hiragino Mincho Pro', 'SimSun', serif;
}
```

## Browser-Specific Notes

### Firefox (Versions 38-40)
- Can be enabled via the `layout.css.vertical-text.enabled` flag in `about:config`
- Automatically enabled from version 41 onwards
- Full support without additional configuration from v41+

### Safari
- Requires `-webkit-` prefix for versions 10.1 through 13
- Supports both `-webkit-text-orientation` and standard `text-orientation`
- Full unprefixed support from version 14 onwards

### Opera
- Full support from version 35
- No vendor prefix needed
- Consistent with Chromium engine implementation

## Fallback Strategies

For maximum compatibility with older browsers:

```css
.vertical-text {
  writing-mode: vertical-rl;
  -webkit-text-orientation: mixed;  /* Safari 10.1-13 */
  text-orientation: mixed;
}

/* Graceful degradation */
@supports not (text-orientation: mixed) {
  .vertical-text {
    /* Fallback styling for unsupported browsers */
    writing-mode: horizontal-tb;
    transform: rotate(-90deg);
    transform-origin: left top;
  }
}
```

## Related Resources

- [MDN Documentation: CSS text-orientation](https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation)
- [W3C CSS Writing Modes Module Level 3](https://w3c.github.io/csswg-drafts/css-writing-modes-3/)
- [CSS writing-mode property](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)

## Compatibility Summary

The CSS `text-orientation` property is production-ready for modern web applications with excellent cross-browser support (93.14% global coverage). For applications requiring support for older browsers (Internet Explorer, legacy Android), consider implementing CSS-based or JavaScript-based fallbacks. For most contemporary projects targeting modern browsers, direct use of the property without vendor prefixes is recommended.
