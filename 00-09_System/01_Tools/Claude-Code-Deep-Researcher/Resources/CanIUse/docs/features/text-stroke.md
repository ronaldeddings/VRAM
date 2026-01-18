# CSS text-stroke and text-fill

## Overview

Method of declaring the outline (stroke) width and color for text. This feature allows developers to add decorative strokes or outlines to text content, providing enhanced visual styling capabilities for typography.

## Feature Status

**Specification Status:** Unofficial (unoff)
**Specification URL:** [WHATWG Compat Spec](https://compat.spec.whatwg.org/#text-fill-and-stroking)

### Notes on Standardization

Does not yet appear in any W3C specification. Was briefly included in a spec as the "text-outline" property, but this was removed. The feature exists as a vendor-prefixed implementation across multiple browsers.

## Categories

- CSS

## Use Cases & Benefits

### Visual Enhancement
- Create outlined or stroked text effects for branding and visual design
- Improve text legibility on complex backgrounds
- Add decorative text styling to headings and titles
- Create artistic text effects for creative designs

### Design Applications
- Logo and branding text styling
- Header and hero section typography
- Special event or promotional text effects
- Artistic web design implementations
- Improved contrast in certain scenarios

### Common Scenarios
- Adding visual emphasis to important text elements
- Creating unique typography styles
- Enhancing accessibility through visual layering
- Stylizing navigation and UI text

## Syntax

```css
.text-stroke {
  -webkit-text-stroke: 2px #000;
  -webkit-text-fill-color: #fff;
}
```

### Properties

- **-webkit-text-stroke:** Combined property for stroke width and color
- **-webkit-text-stroke-width:** Defines the stroke width
- **-webkit-text-stroke-color:** Defines the stroke color
- **-webkit-text-fill-color:** Defines the fill color of the text

## Browser Support

### Support Key

| Symbol | Meaning |
|--------|---------|
| y | Supported |
| n | Not supported |
| a | Partially supported |
| d | Disabled by default |
| x | Vendor prefix required |

### Summary by Browser

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | 4+ | Full support with `-webkit-` prefix |
| Safari | 3.1+ | Full support with `-webkit-` prefix |
| Firefox | 49+ | Requires `-webkit-` prefix only |
| Edge | 15+ | Requires `-webkit-` prefix |
| Opera | 15+ | Full support with `-webkit-` prefix |
| iOS Safari | 4.0+ | Full support (3.2 partial) with `-webkit-` prefix |
| Android Browser | 2.1+ | Full support with `-webkit-` prefix |
| Samsung Internet | 4.0+ | Full support with `-webkit-` prefix |

### Desktop Browsers

#### Chrome
Full support from version 4 and onwards (requires `-webkit-` prefix)

#### Safari
Full support from version 3.1 and onwards (requires `-webkit-` prefix)

#### Firefox
- Firefox 48: Disabled by default (requires `layout.css.prefixes.webkit` flag)
- Firefox 49+: Full support with `-webkit-` prefix

#### Edge
- Edge 12-14: Not supported
- Edge 15+: Full support with `-webkit-` prefix

#### Opera
- Opera 9-12.1: Not supported
- Opera 15+: Full support with `-webkit-` prefix

### Internet Explorer
Not supported in any version (IE 5.5 through 11)

### Mobile Browsers

#### iOS Safari
- iOS Safari 3.2: Partial support
- iOS Safari 4.0+: Full support with `-webkit-` prefix
- Latest versions (26+): Full support

#### Android Browser
Full support from Android 2.1 onwards with `-webkit-` prefix

#### Android Chrome
Full support (Chrome for Android 142+)

#### Android Firefox
Full support from Firefox for Android 144+ (with `-webkit-` prefix)

#### Samsung Internet
Full support from version 4.0 onwards with `-webkit-` prefix

#### Opera Mobile
- Opera Mobile 10-12.1: Not supported
- Opera Mobile 80+: Full support with `-webkit-` prefix

#### Opera Mini
Not supported in any version

### Other Browsers

| Browser | Status |
|---------|--------|
| BlackBerry | Supported (BB 7, BB 10) |
| UC Browser | Supported (Android 15.5+) |
| QQ Browser | Supported (14.9+) |
| Baidu | Supported (13.52+) |
| KaiOS | Supported (2.5+, 3.0-3.1+) |

## Global Usage

**Global Browser Support:** 93.17% of users
**Partial Support:** 0%

This indicates strong global adoption of the feature across modern browsers.

## Known Issues & Limitations

### Bug: Pseudo-Element Support
Chrome and Safari do not support `-webkit-text-stroke` in the `::first-letter` pseudo-element. This is a notable limitation for developers who need to style only the first letter of text with a stroke effect.

### Implementation Notes

1. **Prefix Requirement:** All browsers require the `-webkit-` vendor prefix. Neither Firefox nor Edge use `-moz-` or `-ms-` prefixes; they only support the `-webkit-` version.

2. **Firefox Configuration:** Firefox users need to enable the `layout.css.prefixes.webkit` flag to use this feature.

3. **No Standard Specification:** The feature is not part of any official W3C or WHATWG standard, making it a proprietary vendor extension.

4. **Text Fill vs Text Color:** The `-webkit-text-fill-color` property overrides the `color` property and is necessary when using text stroke for proper text rendering.

## Implementation Best Practices

### Basic Implementation

```css
/* Simple text stroke */
h1 {
  -webkit-text-stroke: 1px #000;
  -webkit-text-fill-color: #fff;
}
```

### With Fallback

```css
/* Fallback for browsers without support */
h1 {
  color: #fff; /* Fallback */
  -webkit-text-stroke: 1px #000;
  -webkit-text-fill-color: #fff;
}
```

### Responsive Adjustment

```css
/* Adjust stroke width for responsiveness */
h1 {
  -webkit-text-stroke: 1.5px #000;
  -webkit-text-fill-color: #fff;
}

@media (max-width: 768px) {
  h1 {
    -webkit-text-stroke: 1px #000;
  }
}
```

### Combined Properties

```css
/* Using shorthand and individual properties */
.styled-text {
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #333;
  -webkit-text-fill-color: #fff;
}
```

## Workarounds & Alternatives

For browsers that don't support text-stroke or for non-WebKit implementations, consider these alternatives:

1. **Text Shadow:** Use multiple text shadows to create outline effects
   ```css
   h1 {
     text-shadow:
       -1px -1px 0 #000,
       1px -1px 0 #000,
       -1px 1px 0 #000,
       1px 1px 0 #000;
   }
   ```

2. **SVG Text:** Use SVG elements with stroke for full cross-browser support
   ```svg
   <text x="10" y="20" fill="white" stroke="black" stroke-width="1">
     Stroked Text
   </text>
   ```

3. **Canvas:** Render text with strokes using the Canvas API for dynamic text

## References & Resources

### Official Documentation
- [MDN Web Docs - text-stroke](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-stroke)

### Guides & Tutorials
- [CSS-Tricks: Adding Stroke to Web Text](https://css-tricks.com/adding-stroke-to-web-text/)

### Tools
- [Live Editor - Westciv Text Stroke Tool](https://www.westciv.com/tools/textStroke/)

## Related Properties

- `-webkit-text-fill-color` - Sets the text fill color
- `-webkit-text-stroke-width` - Sets the stroke width
- `-webkit-text-stroke-color` - Sets the stroke color
- `color` - Standard text color (overridden by text-fill-color)
- `text-shadow` - Alternative outline technique

## Browser Compatibility Table

### Full Desktop & Mobile Coverage

| Browser | Version | Support | Prefix |
|---------|---------|---------|--------|
| Chrome | 4+ | Yes | -webkit- |
| Firefox | 49+ | Yes | -webkit- |
| Safari | 3.1+ | Yes | -webkit- |
| Edge | 15+ | Yes | -webkit- |
| Opera | 15+ | Yes | -webkit- |
| IE | All | No | N/A |
| iOS Safari | 4.0+ | Yes | -webkit- |
| Android | 2.1+ | Yes | -webkit- |

---

**Last Updated:** December 2025
**Feature Status:** Widely Supported (93.17% global coverage)
