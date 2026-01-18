# COLR/CPAL(v0) Font Formats

## Overview

The **COLR/CPAL (Color/Palette) table** is an OpenType font format extension that enables multi-colored glyphs in a way that integrates seamlessly with existing text engines and rasterizers. This format allows designers to create visually rich, colorful fonts without requiring specialized rendering infrastructure.

### Key Characteristics

- **Multi-colored glyphs**: Supports multiple colors within individual font characters
- **Pure colors only**: COLRv0 does not support gradients, transformations, or advanced blending modes
- **Native integration**: Works with existing text rendering engines without special handling
- **Compact format**: Efficient storage of color information using palette references

---

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Standardized (Other) |
| **Specification** | [OpenType COLR Table Specification](https://docs.microsoft.com/en-us/typography/opentype/spec/colr) |
| **Parent Feature** | Font Face (@font-face) |
| **Official Support** | Microsoft DirectWrite |

---

## Categories

- **Typography**
- **Web Fonts**
- **OpenType Features**

---

## Benefits and Use Cases

### Primary Benefits

1. **Rich Visual Expression**: Create visually distinctive branded fonts with integrated color information
2. **Lightweight Alternative**: More efficient than using separate SVG fonts or image-based approaches for colored typography
3. **Scalable Design**: Colors scale naturally with text size, maintaining quality at any resolution
4. **Consistent Rendering**: Native support across platforms ensures consistent appearance across browsers and systems
5. **Performance**: Eliminates the need for multiple font files or fallback strategies for basic color support

### Common Use Cases

- **Brand Identity**: Companies can embed brand colors directly into custom fonts
- **Emoji and Symbol Fonts**: Color support enhances visual communication through decorative characters
- **Icon Fonts**: Create more expressive icon sets with color already embedded
- **Creative Typography**: Design-focused projects requiring stylized, colorful text
- **International Applications**: Enhanced support for culturally specific typography with embedded colors
- **Accessibility**: Color information can be leveraged to improve visual distinction and readability

---

## Browser Support

### Modern Browser Support Summary

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| **Chrome** | 71 | With limitations on older Windows/macOS (#3) |
| **Edge** | 12 | Consistent support across all versions |
| **Firefox** | 32 | Full and consistent support |
| **Safari** | 11 | macOS High Sierra (10.13+) only (#1); regression in 17.0-17.1 (#4) |
| **Opera** | 58 | With limitations on older Windows/macOS (#3) |
| **iOS Safari** | 11.0 | Consistent support; regression in 17.0-17.1 (#4) |
| **Android Chrome** | 142 | Full support in latest versions |
| **Samsung Internet** | 10.1 | Full support from version 10.1+ |

### Support by Browser (Desktop)

#### Chromium-based Browsers
- **Chrome**: v71+ (with note #3 for older systems)
- **Edge**: v12+ (with note #3 for versions before 110)
- **Opera**: v58+ (with note #3 for versions before 96)

#### Mozilla Firefox
- **Firefox**: v32+ (full support across all recent versions)

#### Apple Safari
- **Safari**: v11+ on macOS High Sierra (10.13+)
- **Note**: Regression in v17.0-17.1 (Issue #4), resolved in v17.2+

#### Internet Explorer
- **IE**: v9-11 with limitations (Windows 8.1+ only, note #2)

### Support by Device/Browser (Mobile & Tablet)

| Platform | Minimum Version | Notes |
|----------|-----------------|-------|
| **iOS Safari** | 11.0-11.2+ | Regression in 17.0-17.1; resolved in 17.2+ |
| **Android Native** | 142+ | Full support in latest |
| **Android Chrome** | 142+ | Full support in latest |
| **Android Firefox** | 144+ | Full support in latest |
| **Samsung Internet** | 10.1+ | Full support from 10.1 onwards |
| **Opera Mobile** | 80+ | Full support in modern versions |
| **UC Browser** | 15.5+ | Full support in modern versions |
| **Opera Mini** | Not Supported | No support in any version |

### Global Usage

- **With support**: 93.2% of users
- **Partial/Unknown support**: 0%

---

## Known Issues and Limitations

### Issue #1: macOS System Requirements (Safari)
COLR/CPAL support in Safari is limited to **macOS High Sierra (10.13) and later**. Earlier macOS versions do not support this feature.

### Issue #2: Windows System Requirements (Internet Explorer)
Internet Explorer versions 9-11 require **Windows 8.1 or later** for COLR/CPAL support.

### Issue #3: Fallback on Older Systems (Chrome, Edge, Opera)
On Windows versions prior to 8.1 and macOS Sierra (10.12) and below, Chromium-based browsers (Chrome, Edge, Opera) fall back to using FreeType for font rendering, which may result in degraded color font support.

**Reference**: [Chromium Bug 882844](https://bugs.chromium.org/p/chromium/issues/detail?id=882844#c3)

### Issue #4: Regression in Safari 17.0-17.1
COLRv0 support was temporarily disabled in Safari 17.0 and 17.1 due to a regression bug. This was resolved in Safari 17.2.

**Reference**: [WebKit Bug 262223](https://bugs.webkit.org/show_bug.cgi?id=262223)

### Format Limitations
- **COLRv0 only**: Does not support gradients, advanced transformations, or blending modes
- **Color-only**: Pure color rendering without gradient or effect capabilities
- **Platform dependency**: Full support depends on underlying operating system font rendering capabilities

---

## Feature Support Details

### What Works Across All Major Browsers

1. **Basic multi-color glyphs**: Simple color layers work consistently
2. **Font loading**: COLR fonts load and render like standard web fonts
3. **Text sizing**: Colors scale appropriately with font size
4. **CSS integration**: Works with standard `@font-face` CSS declarations

### What Doesn't Work

1. **Gradients**: COLRv0 does not support gradient fills
2. **Transformations**: Rotation, scaling, or skewing of individual color layers
3. **Blending modes**: Advanced blend operations are not supported in COLRv0
4. **Dynamic color changes**: Colors are pre-defined in the font and cannot be changed via CSS on COLRv0 fonts

### Forward Compatibility

The specification includes **COLRv1** (not covered in this document), which extends COLRv0 with:
- Gradients and advanced fills
- Transformations and geometric operations
- Blending modes and compositing

---

## Implementation Examples

### Basic CSS Usage

```css
@font-face {
  font-family: 'MyColorFont';
  src: url('my-color-font.ttf') format('truetype');
}

.colored-text {
  font-family: 'MyColorFont', sans-serif;
  font-size: 2rem;
}
```

### Web Font Declaration

```css
@font-face {
  font-family: 'ColorEmoji';
  src: url('color-emoji.woff2') format('woff2');
  font-display: swap;
}
```

### Fallback Strategy for Older Browsers

```css
@supports (font-feature-settings: 'COLR') {
  .emoji-text {
    font-family: 'ColorEmoji', sans-serif;
  }
}

/* Fallback for browsers without support */
.emoji-text {
  font-family: 'Arial', sans-serif;
}
```

---

## Feature Detection and Testing

### Detection Tools

- **ChromaCheck**: [A tool to check whether the browser supports OpenType color formats](https://pixelambacht.nl/chromacheck/)
- **Browser DevTools**: Most modern browsers can inspect font properties to verify COLR support

### Programmatic Detection

```javascript
// Check if browser supports COLR fonts
const supports_colr = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '12px "ColorFontName"';
  // Test would require loading font and checking rendering
};
```

---

## Related Technologies

### Similar/Complementary Features

1. **SVG Fonts**: Alternative approach using SVG for colored glyphs (less efficient but more flexible)
2. **CBDT/CBLC**: Bitmap-based color fonts (alternative to COLR for raster-style fonts)
3. **Variable Fonts**: Can be combined with COLR for dynamic, colorful typography
4. **COLRv1**: Extended specification supporting gradients and transformations
5. **Font Features**: OpenType features can be combined with color fonts for enhanced typography

### Related Font Technologies

- **OpenType Font Features**: Enable advanced typography control
- **Web Font Loading APIs**: Manage font loading and fallback strategies
- **Font Display**: Control how fonts render during loading (`font-display` property)

---

## Related Links

### Official Resources

- [OpenType COLR/CPAL Table Specification](https://docs.microsoft.com/en-us/typography/opentype/spec/colr) - Official specification document
- [DirectWrite Color Fonts Documentation](https://docs.microsoft.com/en-us/windows/win32/directwrite/color-fonts) - Microsoft DirectWrite implementation guide

### Tools and Resources

- [Color Fonts Reference Site](https://www.colorfonts.wtf/#w-node-85d8080e63a6-0134536f) - Comprehensive guide on color font usage
- [ChromaCheck Tool](https://pixelambacht.nl/chromacheck/) - Browser compatibility checker for OpenType color formats
- [Rocher Color Font Example](https://www.harbortype.com/fonts/rocher-color/) - Example of a variable color font
- [Creating Color Fonts in Glyphs](https://glyphsapp.com/learn/creating-a-microsoft-color-font) - Tutorial for creating COLR/CPAL fonts using Glyphs app

### Further Reading

- [Color Fonts Explained](https://www.colorfonts.wtf/) - Educational resource about color font formats and usage
- [OpenType Font Technology Overview](https://docs.microsoft.com/en-us/typography/opentype/) - Broader OpenType specification documentation

---

## Browser Compatibility Matrix (Detailed)

### Desktop Browsers

| Version | Chrome | Firefox | Safari | Edge | Opera | IE |
|---------|--------|---------|--------|------|-------|-----|
| Latest | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| 2023 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| 2022 | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| 2020 | ✓ | ✓ | ✓ | ✓ | ✓ | ⚠ |
| 2018 | ⚠ | ✓ | ⚠ | ✓ | ✓ | ⚠ |

**Legend**: ✓ Full support | ⚠ Partial/Limited support | ✗ No support

### Mobile Browsers

| Version | iOS Safari | Android Chrome | Samsung | Opera Mobile |
|---------|-----------|-----------------|---------|--------------|
| Latest | ✓ | ✓ | ✓ | ✓ |
| 2023 | ✓ | ✓ | ✓ | ✓ |
| 2022 | ✓ | ✓ | ✓ | ✓ |
| 2020 | ⚠ | ✓ | ✓ | ✓ |

---

## Summary

COLR/CPAL(v0) is a well-established OpenType font format standard that enables multi-colored glyphs. With 93.2% global browser support and consistent implementation across modern browsers, it's a reliable choice for projects requiring color fonts. While limited to pure colors without gradients or advanced effects, it provides an efficient and lightweight solution for colored typography across all platforms.

For projects requiring advanced features like gradients and transformations, consider exploring COLRv1 or evaluating the trade-offs with alternative approaches such as SVG fonts.

---

**Last Updated**: 2025
**Feature Status**: Standardized
**Parent Feature**: Font Face (@font-face)
**Chrome Feature ID**: 5897235770376192
