# CSS font-feature-settings

## Overview

**font-feature-settings** is a CSS property that enables the application of advanced typographic and language-specific font features to supported OpenType fonts. This property provides low-level control over OpenType feature rendering, allowing developers to access specialized font capabilities for enhanced typography.

## Description

The `font-feature-settings` property allows you to apply advanced typographic features defined in OpenType font files, such as ligatures, small caps, alternate character forms, and language-specific glyph substitutions. While modern CSS provides more semantic alternatives through dedicated properties, `font-feature-settings` remains useful for accessing specialized features not covered by higher-level properties.

## Specification Status

- **Status**: Recommendation (REC)
- **Specification**: [W3C CSS Fonts Module Level 3](https://w3.org/TR/css3-fonts/#font-rend-props)

## Categories

- CSS3

## Use Cases & Benefits

### Primary Benefits

- **Advanced Typography**: Enable ligatures, small caps, stylistic alternates, and other OpenType features
- **Language Support**: Apply language-specific font features for proper text rendering across different locales
- **Design Control**: Precise control over font appearance for specialized design requirements
- **Fallback Solution**: Access features not available through dedicated `font-variant-*` properties

### Common Use Cases

1. **Ligatures**: Connect characters for improved readability (e.g., "fi", "fl")
2. **Stylistic Alternates**: Apply alternative glyph forms for unique design aesthetics
3. **Small Caps**: Render uppercase text in smaller capital letters
4. **Tabular Numbers**: Enable fixed-width numbers for better alignment in tables
5. **Ordinal Numbers**: Apply proper formatting for ordinal numbers (1st, 2nd, 3rd)
6. **Language-Specific Features**: Enable features required for proper typography in specific languages

### Recommended Alternatives

For most use cases, the following properties should be preferred:

- `font-variant-ligatures`: Control ligatures
- `font-variant-caps`: Control capital letter rendering
- `font-variant-east-asian`: Control East Asian glyph variants
- `font-variant-alternates`: Control glyph alternates
- `font-variant-numeric`: Control numeric presentation forms
- `font-variant-position`: Control positional variants
- `font-variant`: Shorthand property for all font variant features

## Browser Support

| Browser | Status | Version | Notes |
|---------|--------|---------|-------|
| **Chrome** | Full Support | 21+ | Partial support (Mac OS X limitation) in versions 16-20 |
| **Edge** | Full Support | 12+ | Supported from initial release |
| **Firefox** | Full Support | 15+ | Older syntax in versions 4-14; modern syntax from 15+ |
| **Safari** | Full Support | 9.1+ | Supported from Safari 9.1 onwards |
| **Opera** | Full Support | 15+ | Partial support in versions 15-34; full from 35+ |
| **Internet Explorer** | Limited Support | 10-11 | Known bugs; can hide text under certain circumstances (Windows 7) |
| **iOS Safari** | Full Support | 9.3+ | Supported from iOS 9.3 onwards |
| **Android Browser** | Full Support | 4.4+ | Supported from Android 4.4 (KitKat) onwards |
| **Opera Mini** | Not Supported | All | No support in any version |
| **Opera Mobile** | Full Support | 80+ | Modern support available |
| **Samsung Internet** | Full Support | 4+ | Partial support in version 4; full from 5+ |
| **BlackBerry Browser** | Full Support | 10+ | Partial support in version 10 |

### Global Support

- **Full Support**: 93.53% of users
- **Partial Support**: 0.06% of users
- **No Support**: 6.41% of users

## Implementation Example

```css
/* Enable common ligatures */
h1 {
  font-feature-settings: "liga" 1;
}

/* Enable small caps */
.small-caps {
  font-feature-settings: "smcp" 1;
}

/* Enable multiple features */
.fancy-text {
  font-feature-settings: "liga" 1, "dlig" 1, "ss01" 1;
}

/* Disable ligatures */
code {
  font-feature-settings: "liga" 0;
}

/* Combine with font-variant (preferred method for standard features) */
.heading {
  font-variant: small-caps;
  font-feature-settings: "ss01" 1; /* custom feature fallback */
}
```

## OpenType Feature Tags

Common OpenType feature tags that can be used with `font-feature-settings`:

| Feature | Tag | Description |
|---------|-----|-------------|
| Ligatures | `liga` | Standard typographic ligatures |
| Discretionary Ligatures | `dlig` | Less common, discretionary ligatures |
| Small Capitals | `smcp` | Small capital letters |
| All Small Capitals | `c2sc` | Small capitals for uppercase letters |
| Stylistic Sets | `ss01`, `ss02`, ... `ss20` | Alternative stylistic designs |
| Ordinal | `ordn` | Ordinal number formatting |
| Proportional Figures | `pnum` | Proportional-width numbers |
| Tabular Figures | `tnum` | Fixed-width numbers |
| Old Style Figures | `onum` | Numbers with descenders |
| Slashed Zero | `zero` | Slashed zero for clarity |
| Historical Ligatures | `hlig` | Historical typographic ligatures |
| Contextual Alternates | `calt` | Context-based alternate forms |
| Superscript | `sups` | Superscript formatting |
| Subscript | `subs` | Subscript formatting |

## Important Notes

### Best Practices

1. **Use Semantic Properties**: Whenever possible, use `font-variant` shorthand or specific `font-variant-*` properties rather than `font-feature-settings` for standard features.

2. **Feature Availability**: Not all fonts support all OpenType features. Test with your specific fonts to ensure desired features are available.

3. **Fallback Strategy**: Provide fallback styling for browsers without support or fonts without feature support.

4. **Performance**: Consider performance implications when applying font features to large amounts of text.

5. **Accessibility**: Ensure font features don't negatively impact readability or accessibility. Small caps, for example, may affect screen reader behavior.

### Known Issues

#### Internet Explorer (10-11)
- IE 10 and 11 do not correctly support the `ss01` value in some cases
- IE 10 and 11 on Windows 7 may hide text when using `font-feature-settings` with certain web fonts under specific circumstances
- **Workaround**: Test thoroughly in IE 10/11 and provide fallback styling

#### Firefox (4-14)
- Older syntax support differs from modern CSS specification
- Upgrade to Firefox 15+ for full standards compliance

## Related Resources

### Official Documentation
- [MDN Web Docs - font-feature-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings)
- [W3C CSS Fonts Module Level 3 Specification](https://w3.org/TR/css3-fonts/#font-rend-props)
- [WebPlatform Docs](https://webplatform.github.io/docs/css/properties/font-feature-settings)

### OpenType References
- [OpenType Layout Feature Tag Registry](https://www.microsoft.com/typography/otspec/featuretags.htm) - Complete reference of OpenType feature tags
- [Adobe Typekit Help - OpenType Syntax](https://helpx.adobe.com/fonts/using/open-type-syntax.html#salt) - Syntax for OpenType features in CSS

### Learning & Demos
- [Demo Pages (Internet Explorer and Firefox)](https://testdrive-archive.azurewebsites.net/Graphics/opentype/) - Historical demo content
- [Mozilla Hacks - Firefox 4 Font Feature Support](https://hacks.mozilla.org/2010/11/firefox-4-font-feature-support/) - Deep dive into font features
- [HTML5 Accessibility - Font Features Support](https://html5accessibility.com/) - Detailed tables on accessibility support for font features

## Browser Compatibility Notes

- **Chrome**: Full support from version 21. Versions 16-20 have partial support limited by Mac OS X platform constraints.
- **Firefox**: Modern syntax fully supported from version 15 onwards. Earlier versions (4-14) used alternative syntax.
- **Safari**: Support introduced in version 9.1; consistent support across all versions since then.
- **Mobile Browsers**: Strong support across modern mobile browsers (iOS 9.3+, Android 4.4+).

## Summary

The `font-feature-settings` property has achieved broad cross-browser support and is suitable for production use with appropriate fallbacks for older browsers. However, developers should prefer semantic font-variant properties when available, reserving `font-feature-settings` for advanced use cases and features not covered by higher-level CSS properties.

---

*Last Updated: 2024*
*Data Source: Can I Use - font-feature-settings*
