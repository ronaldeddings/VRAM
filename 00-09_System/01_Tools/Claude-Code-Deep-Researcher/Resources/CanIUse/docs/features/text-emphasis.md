# CSS Text Emphasis Styling

## Overview

Text emphasis is a CSS feature that allows you to apply small symbols (called emphasis marks) next to each glyph to emphasize a run of text. This capability is commonly used in East Asian languages (such as Chinese, Japanese, and Korean) to highlight or stress important text.

## Description

The `text-emphasis` feature provides a comprehensive set of CSS properties for adding emphasis marks to text:

- **`text-emphasis`**: A shorthand property that combines style and color settings
- **`text-emphasis-style`**: Defines the type of emphasis mark (dot, circle, double-circle, triangle, wavy, etc.)
- **`text-emphasis-color`**: Sets the color of the emphasis marks
- **`text-emphasis-position`**: Controls the position of emphasis marks relative to the text (over/under, before/after)

This feature is particularly valuable for East Asian typography where emphasis marks serve important semantic and stylistic purposes.

## Specification Status

**Status**: Candidate Recommendation (CR)

**Specification URL**: [CSS Text Decoration Module Level 3 - text-emphasis-property](https://w3c.github.io/csswg-drafts/css-text-decor-3/#text-emphasis-property)

## Categories

- CSS3

## Usage & Benefits

### Use Cases

1. **East Asian Typography**: Emphasize important words and phrases in CJK (Chinese, Japanese, Korean) text
2. **Language Learning**: Highlight key vocabulary or pronunciation guides in educational content
3. **Accessibility**: Provide visual emphasis alternative to styling for better text hierarchy
4. **Semantic Highlighting**: Mark important sections without altering document structure
5. **Cultural Content**: Respect typography conventions in multilingual web applications

### Benefits

- **Semantic Enhancement**: Emphasize text without using additional markup elements
- **Language Support**: Native support for East Asian emphasis conventions
- **Flexible Styling**: Control both the mark style and color independently
- **Positioning Options**: Place marks above/below or before/after text
- **CSS-Based**: No JavaScript fallback required for modern browsers

## Browser Support

### Support Key

- **y** - Full support
- **a** - Partial support (with limitations noted)
- **n** - No support

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 25-98 | Partial | Webkit prefix only, limited position support |
| **Chrome** | 99+ | Full | Complete implementation |
| **Edge** | 12-98 | Partial | Webkit prefix only, limited position support |
| **Edge** | 99+ | Full | Complete implementation |
| **Firefox** | 2-44 | None | Not supported |
| **Firefox** | 45 | Partial | Behind feature flag |
| **Firefox** | 46+ | Full | Complete implementation |
| **Safari** | 3.1-6 | None | Not supported |
| **Safari** | 6.1-7 | Partial | Webkit prefix only, limited position support |
| **Safari** | 7.1+ | Full | Complete implementation |
| **Opera** | 9-14 | None | Not supported |
| **Opera** | 15-85 | Partial | Webkit prefix only, limited position support |
| **Opera** | 86+ | Full | Complete implementation |

### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **iOS Safari** | 3.2-6.1 | None | Not supported |
| **iOS Safari** | 7.0+ | Full | Complete implementation |
| **Chrome (Android)** | 142+ | Full | Complete implementation |
| **Firefox (Android)** | 144+ | Full | Complete implementation |
| **Opera Mobile** | 12.1-79 | None | Not supported |
| **Opera Mobile** | 80+ | Full | Complete implementation |
| **Android Browser** | 4.0-4.3 | None | Not supported |
| **Android Browser** | 4.4+ | Partial | Webkit prefix only, limited position support |
| **Samsung Internet** | 4.0-17.0 | Partial | Webkit prefix only, limited position support |
| **Samsung Internet** | 18.0+ | Full | Complete implementation |
| **UC Browser (Android)** | 15.5+ | Full | Complete implementation |

### Global Usage

- **Full Support**: 92.49%
- **Partial Support**: 0.67%
- **No Support**: Remaining browsers

## Implementation Notes

### Prefixing Requirements

Early implementations require vendor prefixes:

```css
/* Old WebKit browsers (partial support) */
-webkit-text-emphasis-style: dot;
-webkit-text-emphasis-color: red;
```

```css
/* Modern browsers (no prefix needed) */
text-emphasis-style: dot;
text-emphasis-color: red;
```

### Partial Support Limitations

Some browsers have partial support with limitations:

- **Partial Support Reference (#1)**: Some browsers support the basic `over` and `under` position values but do not support the CSS spec's `left` and `right` values for RTL text positioning
- **Chrome/Edge/Opera/Safari 6.1-7**: Use `-webkit-` prefix and have limited `text-emphasis-position` support

### Firefox Feature Flag

Firefox requires a feature flag to enable text-emphasis:

- **Firefox 45**: Supports text-emphasis behind the `layout.css.text-emphasis.enabled` flag
- **Firefox 46+**: Enabled by default in all versions

### Known Issues

- **Chrome on Android**: Occasionally has rendering issues with emphasis glyphs, particularly in certain device configurations
- **Older WebKit browsers (Chrome 24)**: Support `-webkit-text-emphasis` but lack proper CJK language support, considered unsupported for practical use

## Examples

### Basic Usage

```css
/* Simple dot emphasis above text */
p {
  text-emphasis-style: dot;
  text-emphasis-position: over;
}

/* Using shorthand */
p {
  text-emphasis: dot red;
}
```

### East Asian Text

```css
/* Ruby-like emphasis for Japanese text */
.ruby-style {
  text-emphasis-style: open-dot;
  text-emphasis-color: #ff0000;
  text-emphasis-position: over;
}

/* Chinese emphasis pattern */
.chinese-emphasis {
  text-emphasis-style: circle;
  text-emphasis-color: currentColor;
  text-emphasis-position: under;
}
```

### Style Variations

```css
/* Different emphasis styles */
.dot-emphasis { text-emphasis-style: dot; }
.circle-emphasis { text-emphasis-style: circle; }
.double-circle-emphasis { text-emphasis-style: double-circle; }
.triangle-emphasis { text-emphasis-style: triangle; }
.wavy-emphasis { text-emphasis-style: wavy; }

/* Custom character emphasis */
.custom-emphasis {
  text-emphasis-style: "※";
  text-emphasis-color: blue;
}
```

## Fallback Strategies

For broader browser compatibility, consider:

1. **Feature Detection**:
```javascript
const supportsEmphasis = CSS.supports('text-emphasis', 'dot');
```

2. **JavaScript Polyfill**:
   - [jquery.emphasis](https://github.com/zmmbreeze/jquery.emphasis/) - A JavaScript fallback implementation

3. **Graceful Degradation**:
   - Use text-emphasis for supported browsers
   - Fall back to other styling (bold, color, background) for unsupported browsers

## Related Resources

- **MDN Web Docs**: [text-emphasis](https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis)
- **CSS Spec Repository**: [W3C CSS Text Decoration Module Level 3](https://w3c.github.io/csswg-drafts/css-text-decor-3/)
- **GitHub Issue**: [Chromium bug to unprefix `-webkit-text-emphasis`](https://bugs.chromium.org/p/chromium/issues/detail?id=666433)
- **jQuery Polyfill**: [jquery.emphasis](https://github.com/zmmbreeze/jquery.emphasis/)

## Browser Compatibility Timeline

### Full Support Achievement

- **Safari**: 7.1 (2013)
- **Firefox**: 46 (2016)
- **Chrome**: 99 (2022)
- **Edge**: 99 (2022)
- **Opera**: 86 (2020)

### Mobile Support

- **iOS Safari**: 7.0+ (2013)
- **Android**: 4.4+ (partial, 2013)
- **Modern Android browsers**: 2022-2024

## Recommendations

### When to Use

- Projects targeting primarily East Asian audiences
- Multilingual content with CJK text emphasis requirements
- Modern browsers (2020+)
- Cases where native CSS solution is preferred over JavaScript

### When to Avoid or Provide Fallbacks

- Legacy browser support requirements (IE, old Chrome/Firefox)
- Projects with broader non-CJK audience focus
- Cases where graceful degradation is critical

### Best Practices

1. Use feature detection before applying as critical styling
2. Provide fallback styling for older browsers
3. Test emphasis mark rendering across devices
4. Consider performance impact on lower-end devices
5. Use semantic emphasis values that match content intent
