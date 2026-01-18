# CSS3 word-break

## Overview

The `word-break` CSS property controls how words are broken when text overflows its container. It specifies whether to break between letters within a word to prevent text overflow.

## Description

The `word-break` property prevents or allows words to be broken over multiple lines between letters. This is particularly useful for handling long words, URLs, or content in constrained containers. The property controls the behavior of text wrapping when words exceed the available width.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [CSS Text Module Level 3](https://www.w3.org/TR/css3-text/#word-break)
- **Last Updated**: W3C CSS Text Module Level 3

## Categories

- CSS3
- Text Layout
- Text Properties

## Use Cases & Benefits

### Common Use Cases

- **Long URLs**: Prevent URLs from breaking container boundaries
- **Code Snippets**: Break long code or technical terms at appropriate points
- **International Text**: Handle languages like CJK (Chinese, Japanese, Korean) with different word-breaking rules
- **Email Addresses**: Allow proper display of long email addresses
- **Constrained Layouts**: Manage text overflow in narrow containers like sidebars or cards
- **Mobile Responsive Design**: Ensure text fits properly on small screens

### Key Benefits

- **Improved Text Flow**: Better control over how text wraps in constrained spaces
- **Better UX**: Prevents text from overflowing and creating layout issues
- **Language Support**: Essential for proper display of languages with different word-breaking conventions
- **Cross-browser Compatibility**: Wide support across modern browsers
- **Better Mobile Experience**: Ensures responsive designs work properly on small devices

## Property Values

| Value | Description |
|-------|-------------|
| `normal` | Use default word-break rules (default value) |
| `break-all` | Allow breaking at any character to fill the width |
| `keep-all` | Prevent breaking in CJK text; for non-CJK text behaves like `normal` |
| `break-word` | (Unofficial) Treated like `word-wrap: break-word` |

## Browser Support

### Support Legend

- **Y** - Full support
- **A** - Partial support (see notes)
- **N** - No support

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4-43 | A | Partial: `break-all` only |
| **Chrome** | 44+ | Y | Full support |
| **Edge** | 12+ | Y | Full support (all versions) |
| **Firefox** | 2-14 | N | No support |
| **Firefox** | 15+ | Y | Full support |
| **Safari** | 3.1-8 | A | Partial: `break-all` only |
| **Safari** | 9+ | Y | Full support |
| **Opera** | 9-12.1 | N | No support |
| **Opera** | 15-30 | A | Partial: `break-all` only |
| **Opera** | 31+ | Y | Full support |
| **Internet Explorer** | 5.5-11 | Y | Full support |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 3.2-8.4 | A | Partial: `break-all` only |
| **iOS Safari** | 9.0+ | Y | Full support |
| **Android Browser** | 2.1-4.4 | A | Partial: `break-all` only |
| **Android Browser** | 4.4.3+ | Y | Full support |
| **Chrome Android** | 142 | Y | Full support |
| **Firefox Android** | 144 | Y | Full support |
| **Opera Mini** | All | N | No support |
| **Opera Mobile** | 10-12.1 | N | No support |
| **Opera Mobile** | 80+ | Y | Full support |
| **Samsung Internet** | 4+ | Y | Full support |
| **UC Browser** | 15.5+ | Y | Full support |
| **Baidu Browser** | 13.52+ | Y | Full support |
| **QQ Browser** | 14.9+ | Y | Full support |
| **KaiOS** | 2.5+ | Y | Full support |
| **BlackBerry** | 7, 10 | A | Partial: `break-all` only |
| **IE Mobile** | 10-11 | Y | Full support |

## Support Summary

### Global Support Coverage

- **Full Support**: 93.59% of users
- **Partial Support**: 0.03% of users (older browser versions)
- **No Support**: ~6.4% of users (primarily Opera Mini and some legacy browsers)

### Key Takeaways

1. **Excellent Overall Support**: The feature has nearly universal support across modern browsers
2. **Legacy Browsers**: Internet Explorer (5.5+) and older mobile browsers support the property
3. **Progressive Enhancement**: Older browsers with partial support still handle `break-all` correctly
4. **Safe to Use**: Can be used in production with minimal fallback concerns

## Important Notes

### Partial Support Details

**Partial support** (marked as "A" in compatibility tables) refers to browsers that support the `break-all` value but not the `keep-all` value. This includes:
- Chrome/Chromium versions 4-43
- Safari versions 3.1-8
- Opera versions 15-30
- Mobile browsers (Android, iOS Safari) up to certain versions

### Unofficial Values

Chrome, Safari, and other WebKit/Blink-based browsers also support the unofficial `break-word` value. This value is treated identically to `word-wrap: break-word` and provides similar functionality to `overflow-wrap: break-word`.

### CJK Text Handling

The `keep-all` value is particularly important for proper handling of CJK (Chinese, Japanese, Korean) text, where words don't have spaces and different breaking rules apply.

## CSS Syntax

### Basic Usage

```css
/* Use default word-break rules */
word-break: normal;

/* Break lines at any character to prevent overflow */
word-break: break-all;

/* Prevent breaking in CJK text */
word-break: keep-all;

/* Unofficial: Alternative to word-wrap */
word-break: break-word;
```

### Common Examples

```css
/* Long URLs in constrained containers */
.url-display {
  word-break: break-all;
}

/* CJK text handling */
.cjk-content {
  word-break: keep-all;
}

/* Code blocks or monospace text */
code {
  word-break: break-all;
  overflow-wrap: break-word;
}
```

## Related Properties

For comprehensive text wrapping control, consider using these properties together:

- **`word-wrap` / `overflow-wrap`**: Controls whether words can break if they would otherwise overflow
- **`hyphens`**: Enables or disables hyphenation for better breaking
- **`white-space`**: Controls whitespace handling and line breaking
- **`text-overflow`**: Specifies how overflow text should be indicated

## Fallback & Progressive Enhancement

Since support is nearly universal (93.59%), fallback strategies are minimal. However, for legacy browser support:

```css
.text-container {
  /* Fallback for very old browsers */
  word-wrap: break-word;

  /* Modern approach */
  word-break: break-all;
  overflow-wrap: break-word;
}
```

## References

- **MDN Documentation**: [CSS word-break on MDN Web Docs](https://developer.mozilla.org/en/CSS/word-break)
- **WebPlatform Docs**: [CSS word-break](https://webplatform.github.io/docs/css/properties/word-break)
- **W3C Specification**: [CSS Text Module Level 3 - word-break](https://www.w3.org/TR/css3-text/#word-break)

## Browser Release Dates

### Full Support Timeline

- **Internet Explorer**: 5.5 (2000)
- **Firefox**: 15.0 (2012)
- **Chrome**: 44.0 (2015)
- **Safari**: 9.0 (2015)
- **Opera**: 31.0 (2015)
- **iOS Safari**: 9.0 (2015)
- **Android Browser**: 4.4.3 (2014)

## Testing Recommendations

1. **Test with long words**: URLs, email addresses, technical terms
2. **Test CJK text**: If targeting international audiences, especially East Asian markets
3. **Test responsive design**: Verify behavior on mobile and narrow viewports
4. **Test with different containers**: Tables, sidebars, cards with constrained widths
5. **Combine with `overflow-wrap`**: Test interaction with overflow-wrap property

## Conclusion

The `word-break` property provides essential control over text breaking behavior in CSS and enjoys nearly universal browser support. It's safe to use in production environments with minimal fallback requirements, making it an excellent choice for handling text overflow in modern web applications.
