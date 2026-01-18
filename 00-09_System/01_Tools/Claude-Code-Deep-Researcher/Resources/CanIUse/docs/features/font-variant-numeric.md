# CSS font-variant-numeric

## Overview

The `font-variant-numeric` CSS property provides control over the usage of alternate glyphs for numbers, fractions, and ordinal markers. This property enables typographic refinement by allowing developers to select different numeral styles supported by the font, such as lining numbers, oldstyle numbers, tabular figures, and special fraction representations.

## Description

`font-variant-numeric` is a CSS property that provides different ways of displaying numbers, fractions, and ordinal markers. It allows fine-grained control over numeric typography, enabling designers to select the most appropriate numeral presentation for their content and design needs.

This property works in conjunction with OpenType font features and requires fonts that include support for the desired numeric variants.

## Specification Status

**Status**: Recommendation (Rec)

**W3C Specification**: [CSS Fonts Module Level 3 - font-variant-numeric](https://w3c.github.io/csswg-drafts/css-fonts-3/#propdef-font-variant-numeric)

The property is part of the W3C CSS Fonts Module Level 3 specification, which has achieved W3C Recommendation status.

## Categories

- **CSS** - Cascading Style Sheets
- **Typography** - Font and text rendering
- **Fonts** - Font variation features

## Use Cases & Benefits

### Primary Use Cases

1. **Financial & Data-Heavy Content**
   - Tabular numbers (`tabular-nums`) for columns that need to align vertically
   - Lining numbers for statistical displays and reports
   - Ordinal numbers for rankings and numbered lists

2. **Editorial Design**
   - Oldstyle numbers (`oldstyle-nums`) for body text and long-form content
   - Improved readability and visual flow in classic typography
   - Fractions (`diagonal-fractions`, `stacked-fractions`) for recipes and measurements

3. **Professional Documentation**
   - Consistent numeric presentation across different document sections
   - Support for multiple language-specific numeric formats
   - Accessibility improvements for number-heavy content

4. **Web Design & UI**
   - Fine-tuned number display in charts and graphs
   - Improved number rendering in UI components
   - Better visual hierarchy and design consistency

### Key Benefits

- **Enhanced Readability**: Proper numeral styling improves content comprehension
- **Professional Appearance**: Offers sophisticated typography control
- **Font Feature Support**: Leverages OpenType font capabilities
- **Responsive Typography**: Enables context-aware numeric presentation
- **Accessibility**: Supports better visual presentation for numeric content
- **Design Flexibility**: Multiple options for numeric display styles

## Syntax & Values

```css
/* Keyword values */
font-variant-numeric: normal;
font-variant-numeric: lining-nums;
font-variant-numeric: oldstyle-nums;
font-variant-numeric: proportional-nums;
font-variant-numeric: tabular-nums;
font-variant-numeric: diagonal-fractions;
font-variant-numeric: stacked-fractions;
font-variant-numeric: slashed-zero;
font-variant-numeric: ordinal;

/* Multiple values can be combined */
font-variant-numeric: oldstyle-nums tabular-nums slashed-zero;
```

### Common Values

| Value | Description |
|-------|-------------|
| `normal` | Default numeric glyphs (resets to initial state) |
| `lining-nums` | Figures that align to the baseline with uniform height |
| `oldstyle-nums` | Figures with varying heights, some descending below baseline |
| `proportional-nums` | Numerals with varying widths |
| `tabular-nums` | Numerals with uniform width (monospaced) |
| `diagonal-fractions` | Fractions displayed on a single line with diagonal slash |
| `stacked-fractions` | Fractions displayed with stacked numerator and denominator |
| `slashed-zero` | Zero glyph with a diagonal slash to distinguish from letter O |
| `ordinal` | Special glyphs for ordinal markers (1st, 2nd, 3rd) |

## Practical Examples

### Example 1: Financial Data Display

```css
.financial-data {
  font-variant-numeric: tabular-nums lining-nums;
}
```

This displays financial figures with fixed widths and lining style, perfect for aligning numbers in columns.

### Example 2: Readable Body Text

```css
body {
  font-variant-numeric: oldstyle-nums;
}

.sidebar {
  font-variant-numeric: tabular-nums;
}
```

The main text uses oldstyle figures for improved readability, while sidebar elements use tabular figures for alignment.

### Example 3: Recipe Instructions

```css
.ingredient-amount {
  font-variant-numeric: diagonal-fractions slashed-zero;
}
```

Displays fractions (1/2, 1/4) properly and ensures zero is clearly distinguished from the letter O.

### Example 4: Modern UI Numbers

```css
.counter {
  font-variant-numeric: tabular-nums ordinal;
}
```

Combines tabular numbers for consistency with ordinal formatting for ranked lists.

## Browser Support

### Support Summary

As of 2025, `font-variant-numeric` has excellent global browser support with **93.11% usage coverage** across major browsers.

### Desktop Browsers

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| **Chrome** | 52 (Mar 2016) | Yes (all versions 52+) |
| **Edge** | 79 (Jan 2020) | Yes (all versions 79+) |
| **Firefox** | 34 (Dec 2014) | Yes (all versions 34+) |
| **Safari** | 9.1 (May 2016) | Yes (all versions 9.1+) |
| **Opera** | 39 (Aug 2016) | Yes (all versions 39+) |

### Mobile Browsers

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| **iOS Safari** | 9.3 (Mar 2016) | Yes (all versions 9.3+) |
| **Chrome Android** | 52 | Yes (current versions) |
| **Firefox Mobile** | 34 | Yes (current versions) |
| **Opera Mobile** | 80 | Yes (current versions) |
| **Samsung Internet** | 6.2 (2017) | Yes (all versions 6.2+) |
| **Android Browser** | 4.4.3+ | Limited support |
| **Opera Mini** | No | Not supported |

### Legacy Browser Support

- **Internet Explorer**: Not supported (versions 5.5 - 11)
- **Internet Explorer Mobile**: Not supported (versions 10 - 11)
- **BlackBerry**: Not supported (versions 7 - 10)

### Global Usage

- **93.11%** of users have browsers that support `font-variant-numeric`
- **0%** partial/prefixed support
- Widespread adoption across modern browsers

## Implementation Recommendations

### Safe Implementation Strategies

1. **Progressive Enhancement**
   ```css
   .numbers {
     /* Fallback */
     font-variant-numeric: normal;
   }

   @supports (font-variant-numeric: tabular-nums) {
     .numbers {
       font-variant-numeric: tabular-nums;
     }
   }
   ```

2. **Feature Detection**
   ```javascript
   const supportsNumericVariants = CSS.supports('font-variant-numeric', 'tabular-nums');
   if (supportsNumericVariants) {
     // Apply numeric variant styling
   }
   ```

3. **Fallback for Older Browsers**
   - Use system default numeric glyphs in non-supporting browsers
   - Content remains readable even without variant support
   - No need for polyfills or JavaScript workarounds

## Font Requirements

To use `font-variant-numeric`, your selected font must:

1. **Include OpenType Features**: Font must support the desired numeric OpenType features
2. **Feature Availability**: Not all fonts include all numeric variants
3. **Popular Fonts with Support**:
   - Google Fonts: Lora, Crimson Text, EB Garamond, Playfair Display
   - System Fonts: Georgia, Cambria, Times New Roman
   - Modern Web Fonts: Inter, Source Serif Pro, IBM Plex

### Checking Font Support

Many font repositories (like Google Fonts, Adobe Fonts) indicate which OpenType features are supported. Test the property in your target font before implementation.

## Notes

- The property is well-supported across modern browsers
- Support may vary depending on the font file being used
- Some fonts may not include all numeric variants
- This is a non-critical feature that degrades gracefully
- Desktop browser support is nearly universal among current versions
- Mobile support is similarly strong, except for Opera Mini

## Related Resources

### Official Documentation

- [MDN Web Docs - font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
- [W3C CSS Fonts Module Level 3](https://w3c.github.io/csswg-drafts/css-fonts-3/#propdef-font-variant-numeric)
- [OpenType Font Feature Tags](https://docs.microsoft.com/en-us/typography/opentype/spec/featuretags)

### Related CSS Properties

- `font-variant` - Shorthand for all font variant properties
- `font-variant-alternates` - Control alternate glyphs
- `font-variant-caps` - Control capital letter variants
- `font-variant-east-asian` - East Asian typography variants
- `font-variant-ligatures` - Control ligature rendering
- `font-feature-settings` - Low-level control of OpenType features
- `font-language-override` - Override language-specific typographic conventions

### Tools & Resources

- [caniuse.com - font-variant-numeric](https://caniuse.com/font-variant-numeric)
- [Google Fonts](https://fonts.google.com) - Free fonts with OpenType feature support
- [Adobe Fonts](https://fonts.adobe.com) - Professional fonts with variant support
- [Font File Inspection Tools](https://fonttools.readthedocs.io/) - Check font feature support

## Browser Compatibility Quick Reference

| Timeframe | Desktop | Mobile |
|-----------|---------|--------|
| **Current (2025)** | Excellent | Excellent |
| **3 Years Old (2022)** | Excellent | Very Good |
| **5 Years Old (2020)** | Very Good | Very Good |
| **10+ Years Old (2015)** | Limited | Limited |

## Summary

`font-variant-numeric` is a well-supported, non-critical CSS property that provides powerful typographic control for numeric content. With 93.11% browser support and no need for polyfills, it's safe to use in modern web projects. The property gracefully degrades in unsupported browsers, making it an excellent choice for enhancing typography in data-heavy, editorial, or design-focused content.

For projects targeting modern browsers (2016 and later), this property can be used with confidence. Always test with your specific font files to ensure the desired numeric variants are available.

---

*Last Updated: 2025*
*Source: caniuse.com - font-variant-numeric*
