# High-Quality Kerning Pairs & Ligatures

## Overview

Kerning pairs and ligatures are advanced typography features that enhance text rendering quality. When used in HTML, the unofficial `text-rendering: optimizeLegibility` CSS property enables high-quality kerning and ligatures in certain browsers. Newer browsers have this behavior enabled by default.

### Description

The `text-rendering` CSS property provides hints to the browser about what to optimize when rendering text. With the value `optimizeLegibility`, browsers apply sophisticated text rendering algorithms that include:

- **Kerning Pairs**: Automatic adjustment of spacing between specific character pairs (e.g., "Av", "To") for better visual appearance
- **Ligatures**: Automatic replacement of character sequences with specialized glyphs when available (e.g., "fi" → "ﬁ", "fl" → "ﬂ")

These features are particularly valuable for high-quality typography in headlines, body text, and branding applications.

## Specification Status

- **Status**: Unofficial (unoff)
- **Specification**: [W3C SVG 2 - Text Rendering](https://www.w3.org/TR/SVG2/painting.html#TextRendering)

**Note**: While `text-rendering` is specified in the SVG specification, the behavior for kerning and ligatures in SVG differs from its use in HTML/CSS contexts.

## Categories

- CSS

## Benefits & Use Cases

### Visual Quality
- Enhanced typography creates a more professional, polished appearance
- Improved readability through better character spacing
- Sophisticated text rendering matching traditional print quality

### Design Applications
- **Headlines & Display Text**: Perfect for marketing materials, blog headers, and announcements
- **Branding**: Logo text and brand-critical typography benefit greatly
- **Body Text**: Long-form content in editorial publications gains improved readability
- **Web Typography**: Custom web fonts combined with kerning and ligatures create premium experiences

### User Experience
- Better visual hierarchy and information hierarchy
- Professional appearance increases user confidence
- Enhanced readability reduces cognitive load

## Browser Support

### Support Key
- **Y** (Yes): Supported
- **N** (No): Not supported
- **A** (Partial): Partially supported
- **U** (Unknown): Unknown support status

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|--------------|---|
| **Chrome** | 4.0 | ✅ Supported (v4+) |
| **Firefox** | 3.0 | ✅ Supported (v3+) |
| **Safari** | 5.0 | ✅ Supported (v5+) |
| **Edge** | 18 | ✅ Supported (v18+) |
| **Opera** | 15.0 | ✅ Supported (v15+) |
| **Internet Explorer** | Not supported | ❌ No support (IE 5.5-11) |

### Mobile & Alternative Browsers

| Browser | Support Status |
|---------|---|
| **iOS Safari** | ✅ Supported (v4.2+, v3.2 unknown) |
| **Android Browser** | ⚠️ Partial (v4.4+, with noted bug in v3-4.3) |
| **Samsung Internet** | ✅ Supported (v4+) |
| **Opera Mobile** | ✅ Supported (v80+) |
| **Chrome for Android** | ✅ Supported (v142) |
| **Firefox for Android** | ✅ Supported (v144) |
| **UC Browser** | ✅ Supported (v15.5+) |
| **Opera Mini** | ❌ Not supported (all versions) |
| **BlackBerry** | ✅ Supported (v10) |
| **IE Mobile** | ❌ Not supported (v10-11) |

### Regional Browsers

| Browser | Support |
|---------|---------|
| **Baidu Browser** | ✅ v13.52+ |
| **QQ Browser (Android)** | ✅ v14.9+ |
| **Kaios Browser** | ✅ v2.5+ |

## Global Support Statistics

- **Supported**: 93.27% of global users
- **Partial Support**: 0% of global users
- **Not Supported**: 6.73% of global users

## Implementation Notes

### Important Considerations

1. **Not Universally Supported**: While most modern browsers support this feature, Internet Explorer and Opera Mini do not. Always consider fallbacks for older environments.

2. **Android Browser Bug**: Android browser versions 3-4.3 show partial support but contain a serious bug where `text-rendering: optimizeLegibility` can cause custom web fonts to render incorrectly or fail to display entirely.

3. **Undefined Behavior in Older Versions**: iOS Safari and Android browser in early versions may have undefined or unpredictable behavior with this property.

4. **SVG vs HTML**: The `text-rendering` property behaves differently in SVG contexts compared to HTML. This documentation focuses on HTML/CSS usage.

### Recommended Usage

```css
/* Basic usage for enhanced typography */
h1, h2, h3 {
  text-rendering: optimizeLegibility;
}

/* Use with custom web fonts */
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-feature-settings: 'liga', 'dlig'; /* Ligature support */
}

body {
  font-family: 'MyFont', serif;
  text-rendering: optimizeLegibility;
}
```

### Browser-Specific Notes

#### Chrome & Firefox
Full support since early versions. Modern stable implementations with predictable behavior.

#### Safari
Full support since v5.0. Particularly good implementation for professional typography.

#### Edge
Support added in v18. Inherits Chromium's implementation for consistency with Chrome.

#### Opera
Support from v15 onwards. Consistent with Chromium-based Opera releases.

#### Internet Explorer
No support across all versions (5.5 through 11). Consider progressive enhancement for IE users.

### Performance Considerations

Using `text-rendering: optimizeLegibility` enables more sophisticated text rendering algorithms, which may have minor performance implications on devices with limited resources. For optimal performance:

- Apply selectively to important text (headings, branding)
- Avoid applying globally to all text
- Test on target devices for performance impact
- Consider using `text-rendering: optimizeSpeed` for high-frequency updates

## Related CSS Properties

- **`text-rendering`**: The property that enables this feature
  - `auto` - Default browser behavior
  - `optimizeSpeed` - Prioritize speed over quality
  - `optimizeLegibility` - Prioritize quality and legibility
  - `geometricPrecision` - Precise geometric rendering

- **`font-feature-settings`**: Fine-grained control over OpenType features (ligatures, kerning, etc.)
  - `'liga'` - Standard ligatures
  - `'dlig'` - Discretionary ligatures
  - `'kern'` - Kerning pairs

## References & Resources

### Official Documentation
- [MDN Web Docs - CSS text-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering)
- [W3C SVG 2 Specification - Text Rendering](https://www.w3.org/TR/SVG2/painting.html#TextRendering)

### Articles & Guides
- [CSS Tricks - text-rendering Property](https://css-tricks.com/almanac/properties/t/text-rendering/)

### Related Topics
- OpenType Feature Tags
- Web Typography Best Practices
- Custom Font Implementation
- Accessibility in Typography

## Keywords

`optimizeLegibility`, `optimizeSpeed`, `geometricPrecision`, `text-rendering`, `ligatures`, `kerning`, `typography`, `CSS`

## Last Updated

December 2025 (based on CanIUse data)

---

**Usage Percentage**: 93.27% of tracked browsers support this feature, making it a viable option for most modern web applications with consideration for the remaining user base.
