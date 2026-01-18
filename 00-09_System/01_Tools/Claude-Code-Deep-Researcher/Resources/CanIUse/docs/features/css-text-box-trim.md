# CSS Text Box Trim

## Overview

CSS Text Box Trim provides the ability to adjust text spacing using the `text-box` property and its longhands (`text-box-trim` and `text-box-edge`). This feature allows developers to trim extra space above and below text glyphs at the start and end of blocks, enabling more precise alignment and positioning of text to match specific font-provided metrics.

## Description

The CSS `text-box` property suite addresses a long-standing challenge in digital typography: the invisible space that fonts include above and below characters. These metrics (ascenders, descenders, and leading) often result in unintended whitespace around text elements.

Text Box Trim provides fine-grained control over:
- **Trimming** extra space over and under text glyphs
- **Positioning** text at the start and end of blocks
- **Aligning** text to specific font-provided metrics
- **Achieving** pixel-perfect typography layouts

This is particularly valuable for:
- Design systems requiring precise spacing
- Headings and display typography
- Components with tight layout requirements
- Brand-consistent text presentation

## Specification Status

- **Current Status**: Working Draft (WD)
- **Spec URL**: [CSS Inline Layout Module Level 3](https://w3c.github.io/csswg-drafts/css-inline-3/#propdef-leading-trim)
- **Standards Body**: W3C CSS Working Group

## Categories

- **CSS** - Cascading Style Sheets

## Key Benefits & Use Cases

### Benefits
- **Precise Text Alignment** - Eliminate unwanted whitespace for pixel-perfect layouts
- **Improved Typography Control** - Better management of font metrics and glyph positioning
- **Consistent Component Design** - Achieve uniform spacing across design systems
- **Better Visual Alignment** - Align text with other design elements more accurately
- **Reduced Layout Workarounds** - Replace hacky CSS workarounds with standard properties

### Ideal Use Cases
1. **Design Systems** - Ensure consistent typography across component libraries
2. **Heading Typography** - Perfect alignment of headings and display text
3. **Logo & Brand Text** - Precise positioning of logotype elements
4. **Card-Based Layouts** - Align text consistently in cards and containers
5. **Tight Grid Layouts** - Achieve predictable spacing in complex layouts

## Browser Support

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Chrome** | ✅ Yes | 133+ | Full support; Behind flag in 128-132 |
| **Edge** | ✅ Yes | 132+ | Full support; Behind flag in 128-131 |
| **Safari** | ✅ Yes | 18.2+ | Full support in 18.2+; Behind feature flag in 16.4+ |
| **Firefox** | ❌ No | — | Not yet supported (as of v148) |
| **Opera** | 🚩 In Development | 117+ | Behind feature flag |
| **iOS Safari** | ✅ Yes | 18.2+ | Full support in 18.2+; Behind flag in 16.4+ |
| **Android Chrome** | ✅ Yes | 142+ | Full support |
| **Opera Mini** | ❌ No | All | Not supported |
| **Android Firefox** | ❌ No | 144 | Not supported |

### Platform Support Summary

**Full Support:**
- Chrome/Edge 132+
- Safari/iOS Safari 18.2+
- Android Chrome 142+

**Limited/In Development:**
- Chrome 128-132 (behind `#text-box-trim` flag)
- Edge 128-131 (behind `#text-box-trim` flag)
- Safari 16.4+ (behind feature flag)
- iOS Safari 16.4+ (behind feature flag)
- Opera 117+ (behind `#text-box-trim` flag)

**Not Supported:**
- Firefox
- Internet Explorer
- Opera Mini
- Older Safari versions

## Implementation Notes

### Feature Flags

When testing or using this feature in development builds:

**Chrome/Edge:**
- Enable via `chrome://flags` and search for `#text-box-trim`
- Currently available behind this experimental flag for versions 128-131

**Safari:**
- Enable via Safari Developer Settings under Feature Flags
- Currently available behind feature flag for versions 16.4+

**Opera:**
- Enable via `opera://flags` and search for `#text-box-trim`
- Currently available behind this experimental flag for versions 117+

### Usage Percentage

- Global usage (support): **75.88%** of browsers
- Partial support: **0%**
- No support: Remaining percentage

### Related Keywords

- `leading-trim`
- `text-edge`

## Relevant Resources

### Examples & Documentation
- [Text Box Trim Examples](https://github.com/jantimon/text-box-trim-examples) - Document with comprehensive examples of text-box-trim uses and patterns

### Articles & Guides
- [CSS Tricks: Leading Trim - The Future of Digital Typesetting](https://css-tricks.com/leading-trim-the-future-of-digital-typesetting/) - In-depth article exploring the implications and usage of leading trim in modern CSS

## Implementation Checklist

- [ ] Check browser support requirements for your project
- [ ] Test in Chrome 133+ or enable flag in 128-132
- [ ] Test in Safari 18.2+ or enable feature flag in 16.4+
- [ ] Provide fallback styles for unsupported browsers
- [ ] Validate typography improvements in design system
- [ ] Document usage patterns for team consistency
- [ ] Monitor support status as specification evolves

## References

| Reference | URL |
|-----------|-----|
| Official Specification | https://w3c.github.io/csswg-drafts/css-inline-3/#propdef-leading-trim |
| Chrome Issue Tracker | https://bugs.chromium.org/p/chromium/issues/detail?id=5174589850648576 |

---

**Last Updated**: December 2024
**Feature Status**: Emerging (Working Draft) - Expect continued evolution and changes before standardization
