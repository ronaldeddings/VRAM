# COLR/CPAL(v1) Font Formats

## Overview

COLRv1 is an improved version of COLRv0, part of the OpenType specification. It enables rich color fonts with advanced graphic capabilities beyond simple solid colors.

**Key Features:**
- Gradient fills for smoother color transitions
- Complex fills using advanced graphic operations
- Affine transformations and various blending modes
- Scalable, lightweight color font solutions

---

## Specification

| Attribute | Details |
|-----------|---------|
| **Status** | Other (OpenType Standard) |
| **Specification URL** | [OpenType COLR Specification](https://docs.microsoft.com/en-us/typography/opentype/spec/colr) |
| **Related Standard** | OpenType Font Format |

---

## Categories

- **Other** (Font Technology)

---

## Benefits & Use Cases

### Primary Benefits

1. **Rich Visual Content in Fonts**
   - Embed complex graphics and designs directly in font files
   - Reduce asset payload by combining glyphs with visual data
   - Maintain scalability while providing sophisticated visuals

2. **Gradient & Advanced Effects**
   - Apply gradient fills to individual glyphs
   - Use blending modes for sophisticated color layering
   - Support transformation operations for dynamic glyph rendering

3. **Web Performance**
   - Compress visual assets into font files
   - Reduce HTTP requests for icon systems and emoji
   - Faster rendering compared to SVG or image-based alternatives

4. **Design Flexibility**
   - Create multi-colored emoji and icon fonts
   - Support brand colors without additional assets
   - Enable animations through font variations

### Typical Use Cases

- **Emoji and Symbol Fonts**: Multi-colored emoji rendering (e.g., Noto Emoji COLRv1)
- **Icon Systems**: Colored icon fonts for UI design systems
- **Custom Typography**: Brand-specific color fonts and decorative typefaces
- **International Content**: Rich character support with proper coloring
- **Material Design**: Google Material Design color fonts

---

## Browser Support

### Support Summary

| Browser | First Full Support | Current Status |
|---------|-------------------|-----------------|
| **Chrome** | v98+ | ✅ Fully Supported |
| **Edge** | v98+ | ✅ Fully Supported |
| **Firefox** | v107+ | ✅ Fully Supported |
| **Opera** | v86+ | ✅ Fully Supported |
| **Safari** | Not Supported | ❌ No Support |
| **iOS Safari** | Not Supported | ❌ No Support |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 90-97 | ⚙️ Behind Flag | Can be enabled with "COLR v1 Fonts" feature flag at `chrome://flags` |
| **Chrome** | 98+ | ✅ Full Support | |
| **Edge** | 12-97 | ❌ Not Supported | |
| **Edge** | 98+ | ✅ Full Support | |
| **Firefox** | 2-104 | ❌ Not Supported | |
| **Firefox** | 105-106 | ⚙️ Behind Preference | Can be enabled via `gfx.font_rendering.colr_v1.enabled` setting |
| **Firefox** | 107+ | ✅ Full Support | |
| **Opera** | 9-85 | ❌ Not Supported | |
| **Opera** | 86+ | ✅ Full Support | |
| **Safari** | 3.1-26.2 | ❌ Not Supported | |
| **IE** | 5.5-11 | ❌ Not Supported | |

#### Mobile Browsers

| Platform | Browser | Version | Status |
|----------|---------|---------|--------|
| **Android Chrome** | Chrome | 142+ | ✅ Full Support |
| **Android Firefox** | Firefox | 144+ | ✅ Full Support |
| **Android UC Browser** | UC Browser | 15.5+ | ✅ Full Support |
| **Opera Mobile** | Opera | 80+ | ✅ Full Support |
| **Samsung Internet** | Samsung | 18.0+ | ✅ Full Support |
| **iOS Safari** | Safari | All versions | ❌ Not Supported |
| **Opera Mini** | Opera Mini | All versions | ❌ Not Supported |
| **BlackBerry** | Default | 7-10 | 🤔 Unknown Support |
| **IE Mobile** | IE | 10-11 | 🤔 Unknown Support |

### Global Usage Statistics

- **Full Support**: 81.81% of global users
- **Partial Support**: 0% of global users
- **No Support**: 18.19% of global users

---

## Implementation Notes

### Feature Flags & Preferences

**Chrome (v90-97):**
- Enable via `chrome://flags` → Search "COLR v1 Fonts" → Set to "Enabled"
- Automatically enabled in Chrome 98+

**Firefox (v105-106):**
- Enable via `about:config` → Set `gfx.font_rendering.colr_v1.enabled` to `true`
- Automatically enabled in Firefox 107+

### Firefox Future Support

- **Status**: Firefox actively supports this format and will consider implementing it in the future
- **Reference**: [Mozilla Standards Position](https://mozilla.github.io/standards-positions/#font-colrv1)

### Safari & WebKit

- **WebKit Position**: Currently no support for COLRv1
- **Reference**: [WebKit Mailing List Discussion](https://lists.webkit.org/pipermail/webkit-dev/2021-March/031765.html)

---

## Related Features

- **Parent Feature**: Font Face (`@font-face` rule)
- **Related Standards**: OpenType Variable Fonts, SVG Fonts, COLR v0

---

## Known Issues & Bug Tracking

### Firefox Support Bug
- **Issue**: [Mozilla Firefox Bug Report #1740525](https://bugzilla.mozilla.org/show_bug.cgi?id=1740525)
- **Status**: Open - Community discussion on implementation timeline

---

## Resources & References

### Official Documentation

1. **[OpenType COLR Specification](https://docs.microsoft.com/en-us/typography/opentype/spec/colr)**
   - Official specification document from Microsoft Typography

### Browser Implementation

2. **[COLRv1 Color Gradient Vector Fonts in Chrome 98](https://developer.chrome.com/blog/colrv1-fonts/)**
   - Google Chrome official announcement and implementation guide

### Font Collections

3. **[COLRv1 Version of Noto Emoji](https://github.com/googlefonts/color-fonts)**
   - Google Fonts reference implementation with Noto Emoji in COLRv1 format

4. **[First Batch of Color Fonts Arrives on Google Fonts](https://material.io/blog/color-fonts-are-here)**
   - Material Design announcement of color font availability

### Testing & Compatibility

5. **[Chroma Check - Color Format Support Tool](https://pixelambacht.nl/chromacheck/)**
   - Browser compatibility checker for OpenType color formats
   - Test whether your browser supports COLR/CPAL, SBIX, COLR v1, etc.

6. **[Color Fonts Usage Guide](https://www.colorfonts.wtf/#w-node-85d8080e63a6-0134536f)**
   - Comprehensive guide on implementing and using color fonts across browsers

---

## Implementation Guide

### Basic Usage

```css
/* Define color font with @font-face */
@font-face {
    font-family: 'Noto Color Emoji';
    src: url('NotoColorEmoji.otf') format('opentype');
}

/* Apply to text */
body {
    font-family: 'Noto Color Emoji', sans-serif;
}
```

### Fallback Strategy

Due to limited browser support (especially on Safari/iOS), use graceful degradation:

```css
/* Color font with fallback to regular emoji */
body {
    font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
}
```

### Feature Detection

```javascript
// Check COLRv1 support
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function supportsColorFonts() {
    try {
        ctx.font = '12px "MyColorFont"';
        ctx.fillText('test', 0, 0);
        const imageData = ctx.getImageData(0, 0, 1, 1);
        // If pixels are colored, support is likely present
        return imageData.data[3] > 0;
    } catch (e) {
        return false;
    }
}
```

---

## Migration from COLRv0

**Key Improvements in COLRv1:**

| Feature | COLRv0 | COLRv1 |
|---------|--------|--------|
| Solid Colors | ✅ | ✅ |
| Gradients | ❌ | ✅ |
| Blending Modes | ❌ | ✅ |
| Transformations | ❌ | ✅ |
| File Size Efficiency | Good | Excellent |

---

## Support Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully Supported |
| ⚙️ | Behind Feature Flag/Preference |
| ❌ | Not Supported |
| 🤔 | Unknown/Uncertain Support |
| 📦 | Partial Support |

---

## See Also

- [Web Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/FontFace)
- [OpenType Specification](https://docs.microsoft.com/en-us/typography/opentype/)
- [Variable Fonts](https://variablefonts.io/)
- [Google Fonts](https://fonts.google.com/) - Color fonts library
