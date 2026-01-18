# CSS3 text-align-last

## Overview

The `text-align-last` property is a CSS feature that controls how the last line of a block element is aligned when the `text-align` property is set to `justify`. This property also applies to lines that appear right before a forced line break.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **W3C Specification**: [CSS Text Level 3 - text-align-last Property](https://www.w3.org/TR/css3-text/#text-align-last-property)

## Categories

- CSS3

## Description

When text is justified in a block container, the last line typically aligns to the left (or the start direction in RTL languages). The `text-align-last` property provides control over the alignment of this final line and lines preceding forced breaks, enabling developers to create more polished and controlled text layouts.

## Use Cases & Benefits

### Common Use Cases

- **Justified Text Blocks**: Control the alignment of the last line in justified paragraphs
- **Professional Typography**: Achieve polished layouts in print-like document designs
- **Multilingual Content**: Handle alignment of the last line in different text directions
- **Form Labels**: Align the last line of multi-line labels consistently
- **Right-to-Left (RTL) Text**: Properly justify text in Arabic, Hebrew, and other RTL languages

### Benefits

- **Improved Text Appearance**: Fine-grained control over justified text layouts
- **Consistency**: Ensures consistent alignment patterns across documents
- **Print-Like Quality**: Enables web layouts that match professional printed documents
- **Accessibility**: Better control over readability in justified text
- **Internationalization**: Proper support for RTL and other writing systems

## Browser Support

### Support Legend

- **y** = Supported
- **a** = Partially supported (limited implementation)
- **x** = Requires vendor prefix or flag
- **n** = Not supported
- **d** = Disabled by default
- **#N** = See notes section for specific limitations

### Current Browser Support Matrix

| Browser | Supported Since | Current Status | Notes |
|---------|-----------------|---|---------|
| **Chrome** | v47 | ✅ Full Support | - |
| **Edge** | v79 | ✅ Full Support | Previous versions (12-78) had experimental support |
| **Firefox** | v49 | ✅ Full Support | Versions 12-48 required vendor prefix (`-moz-`) |
| **Safari** | v16 | ✅ Full Support | - |
| **Opera** | v34 | ✅ Full Support | Versions 22-33 required experimental flag |
| **iOS Safari** | v16 | ✅ Full Support | - |
| **Android Browser** | v142 | ✅ Full Support | - |
| **Samsung Internet** | v5.0 | ✅ Full Support | - |
| **Opera Mobile** | v80 | ✅ Full Support | - |
| **Android Chrome** | v142 | ✅ Full Support | - |
| **Android Firefox** | v144 | ✅ Full Support | - |
| **IE / IE Mobile** | ❌ Not Supported | - | IE 5.5-11 supported partial implementation with limitations (see Note #1) |
| **Opera Mini** | ❌ Not Supported | - | - |
| **Blackberry Browser** | ❌ Not Supported | - | - |

### Legacy Browser Notes

1. **Internet Explorer (Note #1)**: Start and end alignment values are not supported in IE 5.5-11
2. **Chrome (Note #2)**: Versions 35-46 required experimental flag via `chrome://flags` ("Enable Experimental Web Platform Features")
3. **Opera (Note #3)**: Versions 22-33 required experimental flag via `opera://flags` ("Enable Experimental Web Platform Features")

## Browser Coverage Statistics

- **Full Support (y)**: 92.3% of users
- **Partial Support (a)**: 0.42% of users
- **No Support**: 7.28% of users

## Implementation Notes

### Vendor Prefixes

- **No vendor prefix required** for modern browsers
- **Firefox 12-48**: Required `-moz-text-align-last` prefix

### Experimental Flags

Earlier versions of Chrome and Opera required enabling experimental web platform features:
- Chrome: `chrome://flags` → "Enable Experimental Web Platform Features"
- Opera: `opera://flags` → "Enable Experimental Web Platform Features"

### Internet Explorer Limitations

Internet Explorer and IE Mobile support only partial functionality:
- The `start` and `end` alignment values are not supported
- Supported values: `left`, `right`, `center`, `justify`, `auto`, `inherit`

## Syntax & Values

```css
text-align-last: auto | start | end | left | right | center | justify | match-parent;
```

### Property Values

- **auto**: Default browser behavior (typically left in LTR, right in RTL)
- **start**: Aligns to the start of the line direction
- **end**: Aligns to the end of the line direction
- **left**: Aligns to the left
- **right**: Aligns to the right
- **center**: Centers the text
- **justify**: Stretches the line to fill the container width
- **match-parent**: Inherits from parent element's text direction

## Example Usage

```css
/* Justify all text, align last line to center */
p {
  text-align: justify;
  text-align-last: center;
}

/* Professional document layout */
article {
  text-align: justify;
  text-align-last: justify;
}

/* RTL text support */
[dir="rtl"] {
  text-align: justify;
  text-align-last: end;
}
```

## Related Resources

- [MDN Web Docs - CSS text-align-last](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align-last)
- [WebKit Support Bug Tracker](https://bugs.webkit.org/show_bug.cgi?id=146772)
- [W3C CSS Text Level 3 Specification](https://www.w3.org/TR/css3-text/#text-align-last-property)

## Compatibility Recommendations

### Safe Implementation

For maximum compatibility, consider:

1. **Modern Applications**: Safe to use in production without fallbacks (92.3% coverage)
2. **Enterprise/Legacy Support**: Implement graceful degradation for IE users
3. **Mobile-First**: Excellent support across mobile browsers
4. **Fallback Strategy**: Use JavaScript feature detection if supporting IE is required

### Progressive Enhancement

```javascript
// Feature detection
if (CSS.supports('text-align-last', 'justify')) {
  // Use text-align-last
  element.style.textAlignLast = 'justify';
} else {
  // Fallback behavior
  // IE users will get standard text-align behavior
}
```

## Browser-Specific Considerations

### Safari/iOS Safari
- Full support available from version 16 onwards
- Consider polyfill or fallback for users on iOS 15 and below

### Android
- Excellent support across Android browsers
- Android Browser 142+ and Chrome for Android support the feature

### Desktop
- Near-universal support across modern browsers
- Only IE/legacy browsers lack support

---

**Last Updated**: Based on current browser compatibility data
**Recommendation**: Safe for production use in modern web applications
