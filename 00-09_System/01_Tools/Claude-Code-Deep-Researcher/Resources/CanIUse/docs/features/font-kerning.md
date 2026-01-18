# CSS3 font-kerning

## Overview

The `font-kerning` CSS property controls the usage of kerning information stored in fonts. Kerning adjusts the spacing between specific letter pairs to improve the visual appearance and readability of text. This property allows developers to enable, disable, or let the browser auto-detect kerning for OpenType fonts.

## Description

The `font-kerning` property controls whether kerning—the automatic adjustment of space between letters in a font—is applied to text. Kerning information is stored in certain fonts (particularly OpenType fonts) as predefined spacing adjustments between specific character pairs to achieve better visual harmony.

**Important:** This property only affects OpenType fonts that contain kerning information. It has no effect on fonts that do not include kerning data.

## Specification Status

- **Status:** Candidate Recommendation (CR)
- **W3C Specification:** [CSS Fonts Module Level 3 - font-kerning](https://www.w3.org/TR/css3-fonts/#font-kerning-prop)

## Categories

- CSS3 (Typography & Fonts)

## Use Cases & Benefits

### Benefits

1. **Improved Typography** - Enables professional-quality text rendering with proper letter spacing
2. **Better Readability** - Optimizes visual spacing for improved reading experience
3. **Fine-tuned Control** - Developers can enable or disable kerning based on design requirements
4. **Performance Optimization** - Ability to disable kerning when not needed reduces rendering overhead

### Common Use Cases

- **Display Typography** - Headlines, logos, and prominent text that benefits from precise spacing
- **Accessible Text** - Disabling kerning when readability at small sizes is a concern
- **Print-like Web Design** - Replicating print-quality typography on the web
- **Variable Fonts** - Working with modern font technologies that include extensive kerning data
- **Performance-critical Sites** - Disabling kerning on less critical text elements

## Syntax

```css
/* Keyword values */
font-kerning: auto;      /* Default - browser decides */
font-kerning: normal;    /* Enable kerning */
font-kerning: none;      /* Disable kerning */

/* Global values */
font-kerning: inherit;
font-kerning: initial;
font-kerning: revert;
font-kerning: unset;
```

## Browser Support

### Support Status Summary

- **Global Support:** 93.2% (as of latest data)
- **Full Support:** Modern versions of all major browsers
- **Partial Support:** Some older versions with vendor prefixes (`-webkit-`)

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 29 (with prefix) | ✅ 33+ | Prefix: `-webkit-font-kerning` (v29-32)<br>Full support from v33 onwards |
| **Firefox** | 34 | ✅ 34+ | Initially disabled by default (v24-33)<br>Enabled by default from v34 |
| **Safari** | 7 (with prefix) | ✅ 9.1+ | Prefix: `-webkit-font-kerning` (v7-9)<br>Full support from v9.1 onwards |
| **Edge** | 79 | ✅ 79+ | Full support from launch (Chromium-based) |
| **Opera** | 16 (with prefix) | ✅ 20+ | Prefix: `-webkit-font-kerning` (v16-19)<br>Full support from v20 onwards |
| **Internet Explorer** | ❌ Not supported | ❌ No support | Not supported in any version |

### Mobile & Tablet Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **iOS Safari** | 8 (with prefix) | ✅ 12+ | Prefix: `-webkit-font-kerning` (v8-11)<br>Full support from v12 onwards |
| **Android Chrome** | 4.4 (with prefix) | ✅ Full support | Prefix: `-webkit-font-kerning` (v4.4)<br>Full support from v4.4.3+ |
| **Android Firefox** | Latest | ✅ Full support | Support follows desktop Firefox |
| **Samsung Internet** | 4 | ✅ Full support | Full support across all versions |
| **Opera Mobile** | 80 | ✅ Full support | Earlier versions not supported |
| **Opera Mini** | ❌ Not supported | ❌ No support | Not supported |

### Feature Detection Status

```
✅ = Fully supported
⚠️ = Supported with vendor prefix
❌ = Not supported
```

## Implementation Guide

### Basic Usage

```css
/* Enable kerning (default behavior in modern browsers) */
p {
  font-kerning: normal;
}

/* Disable kerning for better performance */
.performance-critical {
  font-kerning: none;
}

/* Let browser decide (default) */
body {
  font-kerning: auto;
}
```

### With Vendor Prefixes (for older browsers)

```css
/* Support for Safari 7-8, iOS Safari 8-11, Chrome 29-32, Opera 16-19 */
h1 {
  -webkit-font-kerning: normal;
  font-kerning: normal;
}
```

### Modern Best Practice

```css
/* Use unprefixed version for modern browsers */
/* Provide fallback with @supports for safety */
@supports (font-kerning: normal) {
  body {
    font-kerning: normal;
  }
}

/* Fallback for non-supporting browsers */
body {
  -webkit-font-kerning: normal;
  font-kerning: normal;
}
```

## Important Notes

### Font Requirements

- **OpenType Fonts Only:** The `font-kerning` property only affects fonts with embedded kerning information
- **Fallback Behavior:** Browsers will display text without kerning adjustments if the font doesn't contain kerning data
- **No Effect on All Fonts:** Web-safe fonts or fonts without kerning data will not be affected

### Firefox-Specific Behavior

Firefox disabled this feature by default in versions 24-33. Users could enable it through the preference:
```
layout.css.font-features.enabled
```

This setting defaults to `true` on Nightly and Aurora builds only.

### Alternative: font-feature-settings

Browsers that support the [`font-feature-settings`](https://caniuse.com/#feat=font-feature) property can also control kerning:

```css
/* Disable kerning via font-feature-settings */
p {
  font-feature-settings: 'kern' 0;
}

/* Enable kerning via font-feature-settings */
p {
  font-feature-settings: 'kern' 1;
}
```

### Performance Considerations

- Disabling kerning (`font-kerning: none`) can slightly improve rendering performance
- The performance impact is minimal on modern hardware
- Consider using `font-kerning: none` only for performance-critical scenarios

## Browser Compatibility Code

### Progressive Enhancement Pattern

```html
<style>
  /* Fallback: vendor prefix version */
  h1, p {
    -webkit-font-kerning: normal;
  }

  /* Modern: unprefixed version */
  h1, p {
    font-kerning: normal;
  }

  /* Feature detection */
  @supports not (font-kerning: normal) {
    /* Fallback styles for non-supporting browsers */
  }
</style>
```

### JavaScript Feature Detection

```javascript
// Check if font-kerning is supported
function isFontKerningSupported() {
  const element = document.createElement('div');
  element.style.fontKerning = 'normal';
  return element.style.fontKerning !== '';
}

if (isFontKerningSupported()) {
  document.documentElement.classList.add('font-kerning-supported');
}
```

## Property Values

| Value | Description |
|-------|-------------|
| `auto` | The browser decides whether to apply kerning |
| `normal` | Kerning is applied (enabled) |
| `none` | Kerning is disabled |

## Inherited

No - the `font-kerning` property is not inherited. It applies only to the element and its descendants as specified.

## Related Resources

### External Documentation

- [MDN Web Docs - CSS font-kerning](https://developer.mozilla.org/en-US/docs/Web/CSS/font-kerning)
- [W3C CSS Fonts Module Level 3](https://www.w3.org/TR/css3-fonts/#font-kerning-prop)
- [Related Feature: font-feature-settings](https://caniuse.com/#feat=font-feature)

### Related CSS Properties

- `font-feature-settings` - Low-level control of advanced typography features
- `font-variant` - High-level control of variant font forms
- `font-variant-position` - Controls use of alternate glyphs
- `font-synthesis` - Control of bold/italic synthesis

## Summary

The `font-kerning` CSS property has excellent modern browser support with 93.2% global usage coverage. It is fully supported in all current versions of major browsers (Chrome 33+, Firefox 34+, Safari 9.1+, Edge 79+, Opera 20+). While Internet Explorer has no support, this is not a concern for modern web development.

For optimal compatibility with older browsers (pre-2015), use the vendor-prefixed `-webkit-font-kerning` version. The property is essential for typography-focused web design and is particularly valuable when using quality fonts with comprehensive kerning data.

---

**Last Updated:** Based on CanIUse data
**Global Support:** 93.2% of users
