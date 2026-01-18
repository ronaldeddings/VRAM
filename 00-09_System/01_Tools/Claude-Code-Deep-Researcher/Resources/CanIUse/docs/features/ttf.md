# TTF/OTF - TrueType and OpenType Font Support

## Overview

Support for the TrueType (.ttf) and OpenType (.otf) outline font formats in CSS `@font-face` declarations. These formats enable developers to embed custom fonts in web applications, providing greater typographic control and design consistency across browsers.

## Description

TrueType and OpenType are mature font formats that have been industry standards for decades. TrueType fonts (.ttf) use quadratic bezier curves for glyph outlines, while OpenType (.otf) is a superset format that can contain either TrueType or PostScript outlines and includes advanced typography features.

When supported via `@font-face`, these fonts can be embedded directly in web pages, allowing designers and developers to use custom typefaces without relying on system-installed fonts or web-safe alternatives.

## Specification Status

**Status:** Other (Standard Reference)
**Specification Reference:** [Apple TrueType Reference Manual](https://developer.apple.com/fonts/TrueType-Reference-Manual)

## Categories

- CSS3

## Benefits & Use Cases

### Primary Benefits

1. **Custom Typography** - Use any typeface for brand-consistent design
2. **Design Control** - Precise font rendering without system font limitations
3. **Established Format** - Widely supported, mature, and reliable
4. **Fallback Compatibility** - Works alongside other font formats (WOFF, WOFF2)
5. **Extended Features** - OpenType includes advanced typography features (ligatures, alternate glyphs, etc.)

### Ideal Use Cases

- Brand-specific custom fonts
- Display typography and headings
- Serif and decorative fonts
- Complex multilingual typographic needs
- Legacy font format requirements
- When WOFF/WOFF2 support isn't required

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full support |
| ⚠️ | Partial support (see notes) |
| ❌ | No support |

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 4 | ✅ Full support | All versions from 4 onwards |
| **Firefox** | 3.5 | ✅ Full support | Full support from 3.5 onwards |
| **Safari** | 3.1 | ✅ Full support | Supported since 3.1 |
| **Edge** | 12 | ✅ Full support | All versions |
| **Opera** | 10.0-10.1 | ✅ Full support | Supported from 10.0+ |
| **Internet Explorer** | 9+ | ⚠️ Partial | Fonts must be marked "installable" (see notes below) |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **iOS Safari** | 4.2-4.3 | ✅ Full support |
| **Android Browser** | 2.2 | ✅ Full support |
| **Chrome Mobile** | 142+ | ✅ Full support |
| **Firefox Mobile** | 144+ | ✅ Full support |
| **Samsung Internet** | 4+ | ✅ Full support |
| **Opera Mobile** | 10+ | ✅ Full support |
| **BlackBerry Browser** | 7+ | ✅ Full support |
| **Opera Mini** | All versions | ❌ Not supported |

### Detailed Version Table

#### Chrome & Chromium-Based
- **4-146+**: Full support across all versions

#### Firefox
- **3.5-148+**: Full support from 3.5 onwards

#### Safari / iOS Safari
- **3.1-18.5+**: Full support from 3.1 onwards
- **iOS Safari 4.2-4.3**: Initial support
- **iOS Safari 5.0+**: Consistent support

#### Opera & Opera Mobile
- **10.0-10.1+**: Full support
- **Opera Mobile 10+**: Full support

#### Internet Explorer
- **5.5-8**: Not supported
- **9-11**: Partial support (#1)

#### Android Ecosystem
- **2.2+**: Full support
- **Android Chrome 142+**: Full support
- **Android Firefox 144+**: Full support

## Important Notes

### Internet Explorer Partial Support

Partial support in IE9+ refers to fonts only working when set to be "installable". More details:
- [IE Blog Post: Better Web Typography](http://blogs.msdn.com/b/ie/archive/2010/07/15/the-css-corner-better-web-typography-for-better-design.aspx)
- [Cross-Domain Font Loading Status](https://status.modern.ie/crossdomainfontloading)

To ensure compatibility with IE9+, verify that your TTF/OTF files are embedded with the appropriate font embedding permissions.

### Script Support Limitations

Some scripts are reported to have rendering issues in Android 4.2 and 4.3:
- Lao
- Burmese
- Syriac
- Khmer

Consider alternative approaches or font substitution strategies if targeting these specific Android versions with these script types.

### Opera Mini

Opera Mini does not support TTF/OTF fonts. Consider providing fallback fonts or alternative typography solutions for this browser.

## Usage Statistics

- **Full Support**: 93.27% of global usage
- **Partial Support**: 0.38% of global usage
- **No Support**: ~6.35% of global usage

## CSS Example

```css
/* Define a custom TTF font */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.ttf') format('truetype');
}

/* Define an OpenType font */
@font-face {
  font-family: 'CustomOTF';
  src: url('/fonts/custom-font.otf') format('opentype');
}

/* Apply the font */
body {
  font-family: 'CustomFont', 'CustomOTF', Arial, sans-serif;
}
```

## Best Practices

1. **Use Font Variants** - Include separate files for bold, italic, etc.
   ```css
   @font-face {
     font-family: 'CustomFont';
     src: url('/fonts/custom-regular.ttf') format('truetype');
     font-weight: normal;
   }

   @font-face {
     font-family: 'CustomFont';
     src: url('/fonts/custom-bold.ttf') format('truetype');
     font-weight: bold;
   }
   ```

2. **Provide Fallback Fonts** - Always include system font fallbacks
   ```css
   font-family: 'CustomFont', Georgia, serif;
   ```

3. **Consider Font Loading** - TTF files can be large; consider compression alternatives
   ```css
   /* Modern approach: Use WOFF2 for modern browsers */
   @font-face {
     font-family: 'CustomFont';
     src: url('/fonts/custom.woff2') format('woff2');
     font-display: swap;
   }
   ```

4. **Use font-display** - Control how fonts render while loading
   ```css
   @font-face {
     font-family: 'CustomFont';
     src: url('/fonts/custom.ttf') format('truetype');
     font-display: swap; /* Show fallback immediately */
   }
   ```

5. **CORS Configuration** - Ensure proper CORS headers for cross-domain font loading

6. **Font File Size** - TTF files are uncompressed; consider WOFF/WOFF2 alternatives for web

## Related Formats

- **WOFF (Web Open Font Format)** - Compressed TTF/OTF with better web performance
- **WOFF2** - Improved compression over WOFF, recommended for modern browsers
- **EOT (Embedded OpenType)** - Microsoft's proprietary format (legacy IE support)

## Relevant Links

- [Apple TrueType Reference Manual](https://developer.apple.com/fonts/TrueType-Reference-Manual)
- [Microsoft OpenType Specification](https://docs.microsoft.com/en-us/typography/opentype/spec)
- [StackOverflow: TTF Support in IE](https://stackoverflow.com/questions/17694143/what-is-the-status-of-ttf-support-in-internet-explorer)
- [CSS @font-face on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [Web Fonts Best Practices](https://web.dev/fonts/)

## See Also

- TTF.md (this document)
- Feature: WOFF
- Feature: WOFF2
- Feature: @font-face

---

**Document Generated:** Based on CanIUse data
**Last Updated:** 2024
**Usage Data Current As Of:** Latest statistics
