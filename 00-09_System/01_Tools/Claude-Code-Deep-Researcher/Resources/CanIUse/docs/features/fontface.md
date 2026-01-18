# @font-face Web Fonts

## Overview

**@font-face** is a CSS at-rule that enables the use of custom fonts on web pages. It allows developers to download and use font files from web servers instead of relying on system-installed fonts, providing consistent typography across all browsers and devices.

## Feature Description

The `@font-face` rule allows web developers to specify custom font files that browsers should download and use for rendering text. This is the foundational technology for web typography, enabling designers and developers to use any font they choose rather than being limited to a small set of "web-safe" fonts.

### Current Specification Status

**Status:** W3C Recommendation (REC)
**Specification:** [CSS Fonts Module Level 3](https://www.w3.org/TR/css3-webfonts/)

The feature has reached the Recommendation stage, indicating it is a stable, mature standard with broad industry consensus.

## Categories

- **CSS3** - Part of the CSS Fonts Module Level 3 specification

## Use Cases and Benefits

### Primary Benefits

1. **Typography Control** - Use custom fonts that match brand identity and design requirements
2. **Consistent Rendering** - Ensure fonts appear consistently across all browsers and operating systems
3. **Design Freedom** - Access to thousands of fonts instead of being limited to system fonts
4. **Web Typography** - Enable sophisticated typography with proper font weights, styles, and variants
5. **Improved User Experience** - Create visually distinctive and professional-looking websites
6. **Accessibility** - Combine with proper font selection to improve readability for all users

### Common Use Cases

- Branding and corporate identity websites
- Professional typography in editorial content
- Custom icon fonts
- Web applications requiring specific visual design
- Multi-language support with specialized fonts
- Display and headline fonts for visual impact

## Browser Support

### Support Legend

- **Y** - Fully Supported
- **A** - Partially Supported (limitations apply)
- **N** - Not Supported

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|---|-------|
| **Chrome** | 4.0 | Fully Supported | Full support since Chrome 4 |
| **Firefox** | 3.5 | Fully Supported | Full support since Firefox 3.5 |
| **Safari** | 3.1 | Fully Supported | Full support since Safari 3.1 |
| **Opera** | 10.0-10.1 | Fully Supported | Full support since Opera 10 |
| **Edge** | 12 | Fully Supported | Full support in all versions |
| **Internet Explorer** | 5.5 | Partial/Limited | IE 5.5-8: EOT format only; IE 9+: Full support |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|---|-------|
| **iOS Safari** | 3.2 | Mostly Supported | iOS 3.2-4.1: SVG fonts only; iOS 4.2+: Full support |
| **Android** | 2.2 | Mostly Supported | Android 2.2-3.x: Partial support (no local() support); Android 4.0+: Full support |
| **Chrome Mobile** | Latest | Fully Supported | Full support |
| **Firefox Mobile** | Latest | Fully Supported | Full support |
| **Samsung Internet** | 4.0 | Fully Supported | Full support |
| **Opera Mobile** | 10 | Fully Supported | Full support |

### Unsupported Browsers

- **Opera Mini** - Not supported (all versions)
- **IE Mobile 9 and below** - Not supported

## Global Usage

- **Fully Supported (Y):** 93.65% of global browser usage
- **Partial Support (A):** 0.03% of global browser usage

This indicates nearly universal support across modern browsers, making @font-face a reliable choice for web projects targeting contemporary audiences.

## Important Notes and Limitations

### Known Issues

1. **Cross-Origin Font Requests**
   - Internet Explorer, Firefox, and newer versions of Chrome enforce the same-origin policy
   - Fonts served from different domains require CORS (Cross-Origin Resource Sharing) headers
   - Configure your server properly to allow font requests from different origins

2. **Android Local Font Support**
   - Android 2.2 - 3.0 do not support the `local()` value in @font-face declarations
   - Workaround: Always provide external font file URLs for maximum compatibility

3. **Partial Support Details**
   - **#1 (IE 5.5-8):** Only EOT (Embedded OpenType) format is supported
   - **#2 (iOS 3.2-4.1):** Only SVG (Scalable Vector Graphics) fonts are supported

### Legacy Browser Considerations

If supporting older browsers is necessary:
- IE 5.5-8: Use EOT format or provide fallback system fonts
- iOS 3.2-4.1: Use SVG format as the primary font source
- Android 2.2-3.0: Provide external font URLs without local() references

## Implementation Best Practices

### Recommended Font Formats

For modern web development, use these formats with fallbacks:

```css
@font-face {
  font-family: 'Custom Font';
  src: url('font.woff2') format('woff2'),
       url('font.woff') format('woff'),
       url('font.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

### CORS Configuration

Ensure your server includes appropriate CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

### Performance Optimization

- Use modern formats (WOFF2) to reduce file size
- Implement font-display strategies (swap, fallback, optional)
- Consider subsetting fonts to include only needed characters
- Use font loading libraries for optimal performance

### Font File Selection

- **WOFF2** - Modern, best compression (primary choice)
- **WOFF** - Widely supported, good compression (fallback)
- **TTF/OTF** - Full compatibility (legacy fallback)
- **EOT** - Only for IE 5.5-8 support (rarely needed)

## Related Resources

### Official Documentation

- [W3C CSS Fonts Module Level 3](https://www.w3.org/TR/css3-webfonts/) - Official specification
- [WebPlatform.org @font-face Documentation](https://webplatform.github.io/docs/css/atrules/font-face) - Community documentation with examples

### Further Reading

- [Wikipedia: Web Typography](https://en.wikipedia.org/wiki/Web_typography) - Comprehensive overview of web typography concepts and history

## Summary

The @font-face rule is a mature, universally-supported web standard that has become essential for modern web design. With 93.65% global support and only minor considerations for legacy browsers and cross-origin scenarios, it should be the default approach for custom font implementation in contemporary web projects.

---

*Documentation generated from caniuse data. Last updated: 2025-12-13*
