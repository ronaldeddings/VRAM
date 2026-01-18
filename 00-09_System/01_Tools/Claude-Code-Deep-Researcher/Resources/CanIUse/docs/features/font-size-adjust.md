# CSS font-size-adjust

## Overview

**CSS font-size-adjust** is a CSS property that provides a method of adjusting font size in relation to the height of lowercase (x-height) versus uppercase letters. This property is particularly useful for setting the size of fallback fonts to match the visual appearance of primary fonts, ensuring better typography consistency across font substitutions.

## Description

The `font-size-adjust` property helps solve a common typography problem: when a web font fails to load and a fallback font is used, the visual rendering can change significantly because different fonts have different x-heights (the height of lowercase letters like 'x').

This property allows developers to specify an adjustment factor so that fallback fonts appear visually similar in size to the intended primary font, providing a better user experience and more consistent typography even when font loading fails.

## Specification Status

- **Status**: Recommendation (REC)
- **Spec URL**: [W3C CSS Fonts Module Level 3](https://www.w3.org/TR/css-fonts-3/#font-size-adjust-prop)
- **Category**: CSS (Typography & Fonts)

## Syntax

The `font-size-adjust` property accepts the following values:

```css
font-size-adjust: none;           /* Default: no adjustment */
font-size-adjust: 0.5;            /* Adjustment factor */
font-size-adjust: from-font;      /* Use aspect ratio from font file */
font-size-adjust: 0.5 from-font;  /* Factor with from-font keyword */
```

## Use Cases & Benefits

### 1. **Font Fallback Consistency**
Ensure that fallback fonts maintain visual consistency with primary fonts when web fonts don't load.

### 2. **Typography Stability**
Prevent jarring visual shifts when fonts are swapped due to loading delays or failures (Font Loading Optimization).

### 3. **Improved Readability**
Maintain optimal font sizing for legibility across multiple font choices.

### 4. **Better Web Font Strategy**
Enable more confident font stacking by ensuring fallback fonts render at appropriate sizes.

### 5. **Global Font Scaling**
Apply consistent visual sizing across variable font families and font substitutions.

## Browser Support

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4-126 | ❌ Not Supported | |
| **Chrome** | 127+ | ✅ Fully Supported | Standard support |
| **Firefox** | 2 | ❌ Not Supported | |
| **Firefox** | 3-91 | ⚠️ Partial | Has limitations (#2, #3) |
| **Firefox** | 92-117 | ⚠️ Partial | Issue with `from-font` (#3) |
| **Firefox** | 118+ | ✅ Fully Supported | Full support |
| **Safari** | 3.1-16.3 | ❌ Not Supported | |
| **Safari** | 16.4-16.6 | ⚠️ Partial | Has limitations (#2, #3) |
| **Safari** | 17.0+ | ✅ Fully Supported | Full support |
| **Edge** | 12-78 | ❌ Not Supported | |
| **Edge** | 79-116 | ⚠️ Partial | Behind flag + limitations (#1, #2, #3) |
| **Edge** | 117+ | ✅ Fully Supported | Full support |
| **Opera** | 9-29 | ❌ Not Supported | |
| **Opera** | 30-101 | ⚠️ Partial | Behind flag + limitations (#1, #2, #3) |
| **Opera** | 102-112 | ⚠️ Partial | Behind flag (#1) |
| **Opera** | 113+ | ✅ Fully Supported | Full support |
| **iOS Safari** | 3.2-16.3 | ❌ Not Supported | |
| **iOS Safari** | 16.4-16.6 | ⚠️ Partial | Has limitations (#2, #3) |
| **iOS Safari** | 17.0+ | ✅ Fully Supported | Full support |
| **Android Browser** | 2.1-4.4.3 | ❌ Not Supported | |
| **Android Browser** | 142+ | ✅ Fully Supported | Full support |
| **Chrome Android** | 142+ | ✅ Fully Supported | Full support |
| **Firefox Android** | 144+ | ✅ Fully Supported | Full support |
| **Samsung Internet** | 4-29 | ❌ Not Supported | |
| **Opera Mobile** | 10-80 | ❌ Not Supported | |
| **Opera Mini** | All | ❌ Not Supported | No support |
| **IE** | 5.5-11 | ❌ Not Supported | |
| **BlackBerry** | 7, 10 | ❌ Not Supported | |

### Global Support Summary
- **Full Support**: 81.05% of global users
- **Partial Support**: 0.8% of global users
- **No Support**: 18.15% of global users

## Known Limitations & Issues

### Note #1
Enabled through the "experimental Web Platform features" flag in `chrome://flags` (for versions with partial support)

### Note #2
Missing support for two-value syntax

**Related Issue**: [Chromium Bug #1219875](https://bugs.chromium.org/p/chromium/issues/detail?id=1219875)

### Note #3
Missing support for `from-font` value

**Related Issue**: [Chromium Bug #1219875](https://bugs.chromium.org/p/chromium/issues/detail?id=1219875)

## Implementation Example

```css
/* Basic usage with adjustment factor */
body {
  font-family: 'Desired Font', 'Fallback Font', sans-serif;
  font-size: 16px;
  font-size-adjust: 0.5;
}

/* Using from-font value (modern approach) */
h1 {
  font-family: 'Custom Heading Font', Georgia, serif;
  font-size-adjust: from-font;
}
```

## Feature Timeline

### Adoption History
- **2003-2020**: Limited support, primarily Firefox with partial implementation
- **2024**: Significant increase in adoption with Chrome and Safari full support
- **Current**: Modern implementations now support both basic values and two-value syntax

### Recent Milestones
- **Safari 17.0** (September 2023): Full support introduced
- **Chrome 127** (September 2024): Full support for font-size-adjust
- **Firefox 118** (October 2023): Full support implemented

## Related Resources

### Official Documentation
- [MDN Web Docs - CSS font-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust)
- [W3C CSS Fonts Module Level 3 Spec](https://www.w3.org/TR/css-fonts-3/#font-size-adjust-prop)

### Additional Information
- [Web Designer Notebook - The Little-Known font-size-adjust CSS Property](https://webdesignernotebook.com/css/the-little-known-font-size-adjust-css3-property/)
- [WebKit Support Issue #15257](https://bugs.webkit.org/show_bug.cgi?id=15257)

## Compatibility Notes

### Recommended Fallback Strategy
For projects requiring broad compatibility, consider:

1. **Progressive Enhancement**: Use `font-size-adjust` for modern browsers while maintaining readable font sizes for older browsers
2. **Feature Detection**: Implement feature detection to provide optimal fallback strategies
3. **Font Loading Strategy**: Combine with web font loading strategies (font-display, preload hints)

### Current Best Practice
Given the adoption rate of 81.05% global support as of 2024, `font-size-adjust` can now be used in production for modern web applications with appropriate fallbacks for legacy browsers.

## References

- **CanIUse Data**: Based on caniuse.com browser compatibility database
- **Usage Percentages**: 81.05% with full support, 0.8% with partial support
- **Last Updated**: Reflects current browser landscape as of late 2024
