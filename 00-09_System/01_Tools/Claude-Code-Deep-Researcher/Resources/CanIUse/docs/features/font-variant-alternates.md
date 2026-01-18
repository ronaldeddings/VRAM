# CSS font-variant-alternates

## Overview

The `font-variant-alternates` CSS property controls the usage of alternate glyphs associated with alternative names defined in `@font-feature-values` for certain types of OpenType fonts. This property enables fine-grained control over stylistic variants and alternate character forms within OpenType font families.

## Description

`font-variant-alternates` is a CSS property that allows developers to specify which alternate glyphs to use for specific text. When used in conjunction with `@font-feature-values`, it provides a way to reference named alternate glyph sets defined in the font itself, making it easier to apply consistent typographic variations across a document.

This is particularly useful for:
- Accessing stylistic sets (ss01-ss20) defined in OpenType fonts
- Using character variants (cv01-cv99) for alternative character forms
- Applying swashes and contextual swashes
- Using ornamental or alternate character glyphs

## Specification Status

**Status:** Working Draft (WD)
**Specification URL:** [CSS Fonts Level 4 - font-variant-alternates](https://w3c.github.io/csswg-drafts/css-fonts-4/#propdef-font-variant-alternates)
**Category:** CSS3

## Related Properties

- [`font-variant`](/features/css-font-variant) - Shorthand for font variant properties
- [`font-variant-ligatures`](/features/font-variant-ligatures) - Controls ligature usage
- [`font-variant-caps`](/features/font-variant-caps) - Controls capitalization variants
- [`font-variant-numeric`](/features/font-variant-numeric) - Controls numeric character styles
- [`font-variant-east-asian`](/features/font-variant-east-asian) - Controls East Asian typography
- [`font-feature-settings`](/features/font-feature) - Low-level font feature control

## Benefits and Use Cases

### Design and Typography
- **Stylistic Consistency:** Apply predefined stylistic variations consistently across documents
- **Font Feature Access:** Unlock OpenType features without relying on low-level font feature settings
- **Ornamental Typography:** Access decorative and swash variants for enhanced visual design
- **Character Variants:** Use alternative forms of specific characters for better typography

### Developer Experience
- **Semantic Control:** Named alternates are more maintainable than numeric OpenType feature codes
- **Font-Specific Variants:** Leverage font designers' intended stylistic sets
- **Fallback Handling:** Browsers that don't support the feature fall back to standard glyphs gracefully
- **Readable Code:** CSS is more semantic compared to `font-feature-settings`

### Use Cases
- Display typography with stylistic variants for headlines
- Decorative text with swash variants
- Alternative character forms for improved readability
- OpenType feature demonstration and documentation
- Web typography design patterns

## Syntax

```css
/* Keyword values */
font-variant-alternates: normal;
font-variant-alternates: historical-forms;

/* Functional notation */
font-variant-alternates: stylistic(feature-value-name);
font-variant-alternates: styleset(feature-value-name);
font-variant-alternates: character-variant(feature-value-name);
font-variant-alternates: swash(feature-value-name);
font-variant-alternates: ornaments(feature-value-name);
font-variant-alternates: annotation(feature-value-name);

/* Global values */
font-variant-alternates: inherit;
font-variant-alternates: initial;
font-variant-alternates: revert;
font-variant-alternates: unset;
```

## Example Usage

```css
/* Enable historical forms */
.historical-text {
  font-variant-alternates: historical-forms;
}

/* Use a stylistic set defined in the font */
.decorated-headline {
  font-variant-alternates: styleset(dramatic-numerals);
}

/* Access specific character variant */
.special-ampersand {
  font-variant-alternates: character-variant(stylized-ampersand);
}

/* Use swash variants */
.decorative-text {
  font-variant-alternates: swash(flowing);
}

/* Use ornamental characters */
.ornate-decoration {
  font-variant-alternates: ornaments(fleurons);
}
```

## Browser Support

### Support Key
- **Y** - Supported
- **N** - Not supported
- **#1** - Partial support with low-level font-feature-settings
- **#2** - Experimental support (requires flag)

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 111+ | ✅ | Full support from Chrome 111 onward |
| **Firefox** | 34+ | ✅ | Full support from Firefox 34 onward |
| **Safari** | 9.1+ | ✅ | Full support from Safari 9.1 onward |
| **Edge** | 111+ | ✅ | Full support from Edge 111 onward (Chromium-based) |
| **Opera** | 98+ | ✅ | Full support from Opera 98 onward |
| **iOS Safari** | 9.3+ | ✅ | Full support from iOS Safari 9.3 onward |
| **Android Chrome** | 142+ | ✅ | Full support |
| **Android Firefox** | 144+ | ✅ | Full support |

### Partial/Limited Support

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Internet Explorer** | 10-11 | ❌ | Not supported; can use `font-feature-settings` as alternative |
| **Edge (Legacy)** | 12-110 | ❌ | Not supported; use `font-feature-settings` as alternative |
| **Firefox** | 24-33 | 🔧 | Experimental support available (requires `layout.css.font-features.enabled` flag) |
| **Chrome** | 4-110 | ❌ | Not supported; use `font-feature-settings` as alternative |
| **Safari** | 4-9.0 | ❌ | Not supported |
| **Opera** | 9-97 | ❌ | Not supported; use `font-feature-settings` as alternative |
| **Opera Mini** | All | ❌ | Not supported |
| **Samsung Internet** | 4-21 | ❌ | Not supported |
| **UC Browser** | 15.5 | ❌ | Not supported |

### Global Usage Statistics
- **Full Support:** 90.36% of users
- **Partial Support:** 0%
- **No Support:** ~10%

## Implementation Notes

### Font-Feature-Settings as Alternative
For browsers that don't support `font-variant-alternates`, you can use the low-level `font-feature-settings` property as an alternative. This provides equivalent functionality through OpenType feature codes:

```css
/* Using font-variant-alternates (preferred) */
.text {
  font-variant-alternates: styleset(ss01);
}

/* Using font-feature-settings (fallback) */
.text {
  font-feature-settings: "ss01";
}

/* Fallback pattern */
.text {
  font-feature-settings: "ss01";
  font-variant-alternates: styleset(ss01);
}
```

### Available OpenType Features
The following OpenType features can be controlled:
- `salt` - Stylistic alternates
- `ss01` through `ss20` - Stylistic sets
- `cv01` through `cv99` - Character variants
- `swsh` - Swashes
- `cswh` - Contextual swashes
- `ornm` - Ornaments
- `nalt` - Alternate annotation forms

### Font Requirements
To use `font-variant-alternates`, the font must:
1. Include OpenType features
2. Have `@font-feature-values` defined
3. Provide named alternate glyphs for the specified feature

## Cross-Browser Compatibility Strategy

```css
/* Complete fallback strategy */
.fancy-heading {
  /* Fallback for older browsers */
  font-feature-settings: "ss01";

  /* Modern standard property */
  font-variant-alternates: styleset(ss01);
}

/* Feature detection with CSS supports() */
@supports (font-variant-alternates: stylistic(test)) {
  .fancy-heading {
    font-variant-alternates: styleset(ss01);
  }
}

@supports not (font-variant-alternates: stylistic(test)) {
  .fancy-heading {
    font-feature-settings: "ss01";
  }
}
```

## Comparison with Similar Features

| Feature | Purpose | Browser Support | Complexity |
|---------|---------|-----------------|------------|
| `font-variant-alternates` | Named alternate glyphs | 90.36% | Medium |
| `font-feature-settings` | Low-level OpenType control | Wider (legacy support) | High |
| `font-variant-ligatures` | Ligature control | High | Low |
| `font-variant-caps` | Capitalization variants | High | Low |
| `font-variant-numeric` | Numeric styles | High | Low |

## Related Resources

### Official Documentation
- [MDN Web Docs - font-variant-alternates](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates)
- [W3C CSS Fonts Level 4 Specification](https://w3c.github.io/csswg-drafts/css-fonts-4/#propdef-font-variant-alternates)

### Implementation Tracking
- [Chromium Support Bug #716567](https://bugs.chromium.org/p/chromium/issues/detail?id=716567)

### Related Topics
- [font-feature-settings](/features/font-feature) - Low-level font feature control
- [@font-feature-values](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-feature-values) - Defining named font features
- [OpenType Features](https://www.microsoft.com/typography/OpenTypeFeatures.mspx) - Microsoft OpenType documentation

## Best Practices

1. **Always provide fallbacks** - Use `font-feature-settings` for older browsers
2. **Use @font-feature-values** - Define named features at the top of your stylesheet for maintainability
3. **Test with actual fonts** - Not all fonts include all features; test with your specific font files
4. **Document feature names** - Keep track of which features your fonts support
5. **Consider performance** - Loading fonts with extensive OpenType features may impact performance
6. **Progressive enhancement** - Layer features so the design works without them

## Performance Considerations

- Minimal performance impact when used appropriately
- No additional HTTP requests required
- Font files with extensive OpenType features may be larger
- Feature activation is handled by the font rendering engine

## Accessibility Notes

- Alternate glyphs should not impair readability or accessibility
- Ensure sufficient contrast when using stylistic variants
- Be cautious with decorative swashes on important text
- Consider screen reader interactions with stylized text
- Test readability across different devices and lighting conditions

## Notes and Observations

### Historical Forms
The `historical-forms` keyword enables the use of historical character forms, which can be useful for period-specific typography or decorative purposes.

### Experimental Support
Firefox versions 24-33 provided experimental support under the `layout.css.font-features.enabled` flag, which was later replaced by full standardized support.

### Vendor Adoption
- **Webkit/Safari:** Early adopter with support since Safari 9.1
- **Firefox:** Provided early experimental support before full standardization
- **Blink/Chrome:** Added support in Chrome 111 alongside Edge
- **Legacy browsers:** Internet Explorer and early Edge versions do not support this feature

## Summary

`font-variant-alternates` is a modern CSS property that enables semantic access to OpenType font features. With 90.36% global browser support and full coverage in modern browsers (Chrome, Firefox, Safari, Edge), it's suitable for most contemporary web projects. For projects requiring older browser support, `font-feature-settings` provides a compatible alternative with slightly different syntax.

The property is particularly valuable for typography-focused designs, where access to stylistic sets, character variants, and ornamental glyphs can significantly enhance visual design while maintaining clean, maintainable CSS.
