# CSS unicode-bidi Property

## Overview

The `unicode-bidi` CSS property, used in conjunction with the `direction` property, controls the handling of bidirectional text in web documents. This property is essential for properly displaying text that mixes left-to-right (LTR) and right-to-left (RTL) languages, such as English mixed with Arabic, Hebrew, or other RTL scripts.

## Description

The `unicode-bidi` property relates to the handling of bidirectional text in a document. It works alongside the `direction` property to ensure proper text rendering and layout in multilingual documents. This is particularly important for internationalization (i18n) in web applications that serve audiences speaking languages with different text directions.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [CSS Writing Modes Level 3](https://w3c.github.io/csswg-drafts/css-writing-modes-3/#unicode-bidi)

## Categories

- CSS
- Writing and Direction
- Internationalization (i18n)

## Use Cases & Benefits

### Primary Use Cases

1. **Multilingual Content**: Display documents containing both LTR and RTL text seamlessly
2. **Text Direction Control**: Override default text direction based on content context
3. **Bidirectional Isolation**: Isolate portions of text to prevent directional conflicts
4. **Internationalization**: Support for Arabic, Hebrew, Persian, and other RTL languages
5. **Mixed Language Documents**: Properly render documents mixing multiple writing systems

### Key Benefits

- Ensures correct text rendering for RTL languages without relying solely on HTML markup
- Provides fine-grained control over bidirectional text behavior at the CSS level
- Enables consistent styling across different content scenarios
- Improves accessibility and user experience for multilingual audiences
- Reduces reliance on directional HTML elements and attributes

## Browser Support

### Support Legend

- **y** = Fully supported
- **a** = Partially supported (with limitations)
- **x** = Partial support with specific issues
- **u** = Unsupported

### Modern Browser Support (Current Versions)

| Browser | Status | Version | Notes |
|---------|--------|---------|-------|
| Chrome | Full | 48+ | Fully supported from v48 onwards |
| Firefox | Full | 50+ | Fully supported from v50 onwards |
| Safari | Partial | 9+ | Partial support with limitations |
| Edge | Full | 79+ | Fully supported from v79 onwards |
| Opera | Partial | 9+ | Limited value support |
| Android Browser | Full | 4.4+ | Full support in modern versions |
| iOS Safari | Partial | 9+ | Partial support with limitations |
| Samsung Internet | Full | 5.0+ | Full support from v5.0 onwards |

### Desktop Browser Coverage

#### Chrome
- **Full Support**: v48+ (all versions from 48 to 146)
- **Partial Support**: v4-47 (marked as "a x #3")

#### Firefox
- **Full Support**: v50+ (all versions from 50 to 148)
- **Partial Support**: v2-49 (marked as "a", "a x #2")

#### Safari
- **Partial Support**: v3.1+ (consistently marked as "a x #3")
- Limited value set support across all versions

#### Edge
- **Full Support**: v79+ (all versions from 79 to 143)
- **Partial Support**: v12-18 (marked as "a #1")

#### Opera
- **Partial Support**: v9+ (consistently marked as "a #1")
- Only supports: normal, embed, bidi-override

### Mobile Browser Coverage

#### iOS Safari
- **Partial Support**: v3.2+ (marked as "a #1" through "a x #3")
- Version 9+ shows "a x #3" limitation

#### Android Browser
- **Unsupported**: v2.1-4.3 ("u" status)
- **Full Support**: v4.4+ and v142

#### Opera Mobile
- **Unsupported**: v10-12.1 ("u" status)
- **Full Support**: v80+

#### Samsung Internet
- **Unsupported**: v4
- **Full Support**: v5.0+

#### Other Mobile Browsers
- **Android Chrome**: v142+ (full support)
- **Android Firefox**: v144+ (full support)
- **UC Browser (Android)**: v15.5+ (full support)
- **Baidu Browser**: v13.52+ (full support)
- **QQ Browser (Android)**: v14.9+ (full support)
- **KaiOS**: v2.5+ (with partial support)
- **Opera Mini**: Not supported

### Global Browser Usage

Based on global usage statistics:
- **Full Support**: 82.05% of browsers
- **Partial Support**: 11.63% of browsers
- **No Support**: ~6% of browsers

## Property Values

The `unicode-bidi` property accepts the following values, with varying browser support:

### Universally Supported Values
- `normal` - Default behavior (text direction determined by HTML markup)
- `embed` - Creates a new level of bidirectional embedding
- `bidi-override` - Forces left-to-right or right-to-left override

### Limited Support Values
- `isolate` - Isolates text to prevent bidirectional effects on surrounding content
- `isolate-override` - Combines isolation with directional override (limited support)

## Browser Support Notes

### Note #1: Limited Value Support (IE, Edge 12-18, Opera, Safari, iOS Safari)
Only the following values are supported: `normal`, `embed`, and `bidi-override`. Advanced values like `isolate` and `isolate-override` are not available.

### Note #2: Firefox 10-49 Workaround
The `isolate` keyword could be used together with `bidi-override` instead of the `isolate-override` value as a workaround for partial support.

### Note #3: Limited Value Support (Chrome 17-47, Safari, iOS Safari)
Only the following values are supported: `normal`, `embed`, `bidi-override`, and `isolate`. The `isolate-override` value is not available.

## Implementation Recommendations

### For Maximum Compatibility

When targeting a broad audience, use only the universally supported values:

```css
/* Full support across all browsers */
.ltr-text {
  direction: ltr;
  unicode-bidi: normal;
}

.rtl-override {
  direction: rtl;
  unicode-bidi: bidi-override;
}
```

### For Modern Browsers

When targeting modern browsers (Chrome 48+, Firefox 50+, Edge 79+, Safari 9+), you can use extended values:

```css
/* Use isolate for better text separation */
.mixed-content {
  unicode-bidi: isolate;
  direction: auto; /* or explicit ltr/rtl */
}
```

### Progressive Enhancement

Combine CSS properties with HTML attributes for maximum compatibility:

```html
<div class="arabic-content" dir="rtl">
  <!-- Content here -->
</div>
```

```css
.arabic-content {
  unicode-bidi: embed;
  direction: rtl;
}
```

## Related Properties

- `direction` - Specifies text direction (ltr, rtl, auto)
- `writing-mode` - Controls block flow direction
- `text-orientation` - Controls character orientation in vertical text

## Related Resources

- [MDN Web Docs - CSS unicode-bidi](https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi)
- [W3C CSS Writing Modes Level 3 Specification](https://w3c.github.io/csswg-drafts/css-writing-modes-3/#unicode-bidi)
- [Unicode Bidirectional Algorithm (UBA)](https://unicode.org/reports/tr9/)

## Key Considerations

### Internationalization
This property is critical for applications serving multilingual audiences, especially those mixing RTL and LTR content. Proper implementation ensures accessibility and correct text rendering across all major browsers.

### Browser Support Strategy
While modern browsers have nearly complete support, consider fallback strategies for older browsers and devices using limited value sets. Test thoroughly with actual RTL language content.

### Performance
The `unicode-bidi` property has minimal performance impact and should not cause rendering issues even with complex bidirectional content.

### Testing
When implementing bidirectional text support, test with:
- Native RTL speakers and content
- Mixed language documents
- Various browser and device combinations
- Accessibility tools to ensure proper screen reader support

## Summary

The `unicode-bidi` CSS property enjoys strong support across modern browsers (82% global coverage with full support). While older browsers support only a limited set of values, the property provides essential functionality for any web application serving multilingual audiences. For production applications, use a combination of HTML `dir` attributes and CSS `unicode-bidi` properties with appropriate fallbacks to ensure consistent rendering across all browsers.
