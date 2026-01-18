# CSS3 Overflow-wrap

## Overview

The `overflow-wrap` CSS property allows lines to be broken within words if an otherwise unbreakable string is too long to fit. This property is currently widely supported across modern browsers, though some older browsers require the legacy `word-wrap` property name.

## Description

When text content exceeds the width of its container and cannot be broken at normal word boundaries (such as very long URLs or compound words without hyphens), the `overflow-wrap` property determines whether the browser should break the word to prevent overflow.

**Legacy Property Name**: `word-wrap`
The `overflow-wrap` property was previously known as `word-wrap`. Both names are still widely used, with partial browser support requiring the legacy `word-wrap` naming convention.

## Specification

- **Spec URL**: [W3C CSS Text Module Level 3](https://www.w3.org/TR/css3-text/#overflow-wrap)
- **Status**: Candidate Recommendation (CR)

## Category

- CSS3

## Use Cases & Benefits

### Primary Use Cases

1. **Long URL Prevention**: Break excessively long URLs that would overflow their containers
2. **Email Address Handling**: Ensure email addresses and contact information wrap appropriately
3. **User Generated Content**: Safely handle text from users that may contain unbreakable strings
4. **Code Display**: Display code snippets or technical content without horizontal scrolling
5. **Responsive Design**: Ensure text adapts gracefully to constrained container widths
6. **Chat Applications**: Prevent long usernames or messages from breaking layouts
7. **Search Results**: Display search queries or matches that may be very long

### Benefits

- **Improved Layout Stability**: Prevents text overflow and layout breaking
- **Better Responsive Design**: Content adapts to smaller screens and containers
- **Enhanced User Experience**: Text remains readable without horizontal scrolling
- **No JavaScript Required**: Pure CSS solution for text wrapping behavior
- **Backward Compatibility**: Works with legacy `word-wrap` property for older browsers

## Browser Support

### Support Status Legend

- **Full Support (y)**: Property is fully supported with the standard `overflow-wrap` name
- **Partial Support (a)**: Property requires the legacy `word-wrap` name to function
- **Not Supported (n)**: Property is not supported

### Desktop Browsers

| Browser | Version Range | Support Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 4-22 | Partial (a) | Requires `word-wrap` |
| **Chrome** | 23+ | Full (y) | Standard `overflow-wrap` support |
| **Edge** | 12-17 | Partial (a) | Requires `word-wrap` |
| **Edge** | 18+ | Full (y) | Standard `overflow-wrap` support |
| **Firefox** | 2-3 | Not Supported (n) | - |
| **Firefox** | 3.5-48 | Partial (a) | Requires `word-wrap` |
| **Firefox** | 49+ | Full (y) | Standard `overflow-wrap` support |
| **Safari** | 3.1-6 | Partial (a) | Requires `word-wrap` |
| **Safari** | 6.1+ | Full (y) | Standard `overflow-wrap` support |
| **Opera** | 9-10.1 | Not Supported (n) | - |
| **Opera** | 10.5-12 | Partial (a) | Requires `word-wrap` |
| **Opera** | 12.1+ | Full (y) | Standard `overflow-wrap` support |

### Mobile Browsers

| Browser | Version Range | Support Status | Notes |
|---------|---------------|----------------|-------|
| **iOS Safari** | 3.2-6.0-6.1 | Partial (a) | Requires `word-wrap` |
| **iOS Safari** | 7.0-7.1+ | Full (y) | Standard `overflow-wrap` support |
| **Android Browser** | 2.1-4.3 | Partial (a) | Requires `word-wrap` |
| **Android Browser** | 4.4+ | Full (y) | Standard `overflow-wrap` support |
| **Opera Mobile** | 10-12.1 | Partial (a) | Requires `word-wrap` |
| **Opera Mobile** | 80+ | Full (y) | Standard `overflow-wrap` support |
| **Chrome Android** | 142 | Full (y) | Standard `overflow-wrap` support |
| **Firefox Android** | 144 | Full (y) | Standard `overflow-wrap` support |
| **Samsung Internet** | 4-29 | Full (y) | Standard `overflow-wrap` support |
| **UC Browser** | 15.5+ | Full (y) | Standard `overflow-wrap` support |
| **Opera Mini** | All versions | Partial (a) | Requires `word-wrap` |
| **BlackBerry** | 7 | Partial (a) | Requires `word-wrap` |
| **BlackBerry** | 10+ | Full (y) | Standard `overflow-wrap` support |
| **IE Mobile** | 10-11 | Partial (a) | Requires `word-wrap` |
| **KaiOS** | 2.5 | Partial (a) | Requires `word-wrap` |
| **KaiOS** | 3.0-3.1+ | Full (y) | Standard `overflow-wrap` support |

### Overall Support Statistics

- **Full Support**: 93.15% of users
- **Partial Support**: 0.58% of users (requires `word-wrap` fallback)
- **Total Coverage**: 93.73% of users

## Implementation Notes

### Important Considerations

**Partial Support Requirement**: Partial support (marked as "a" in browser statistics) refers to browsers that require the legacy `word-wrap` property name instead of the standard `overflow-wrap` property.

**Recommended Implementation Pattern**:

```css
.text-content {
  /* Use the legacy property name for broader compatibility */
  word-wrap: break-word;
  /* Standard property name for modern browsers */
  overflow-wrap: break-word;
}
```

This dual-property approach ensures maximum compatibility across all browsers, including:
- Older versions of Chrome (before v23)
- Older versions of Safari (before v6.1)
- Internet Explorer (all versions)
- Firefox versions before 49
- Older Opera versions

### Common Usage Scenarios

**For unbreakable strings that should break if necessary**:
```css
overflow-wrap: break-word;
```

**To prevent any word breaking (default behavior)**:
```css
overflow-wrap: normal;
```

**For anywhere breaking (more aggressive than break-word)**:
```css
word-break: break-all; /* Consider using with overflow-wrap */
```

### Browser-Specific Behavior

Internet Explorer (all versions) only supports the `word-wrap` property name and does not recognize `overflow-wrap`. Always include the `word-wrap` fallback for IE compatibility if supporting older browsers is required.

## Related Resources

### Official Documentation

- [MDN Web Docs - CSS overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)
- [WebPlatform Docs](https://webplatform.github.io/docs/css/properties/word-wrap)

### Bug Reports & Issues

- [Firefox Bug Report on overflow-wrap Support](https://bugzilla.mozilla.org/show_bug.cgi?id=955857)

## Quick Reference

| Property | Value | Effect |
|----------|-------|--------|
| `overflow-wrap` | `normal` | Only breaks at allowed break points (default) |
| `overflow-wrap` | `break-word` | Breaks words to prevent overflow |
| `word-wrap` | `break-word` | Legacy property name (required for older browsers) |

## Summary

The CSS3 `overflow-wrap` property is now well-supported across modern browsers with 93.15% of global users having full support. For projects targeting broader browser support, the legacy `word-wrap` property should be included as a fallback. This property is essential for creating robust, responsive layouts that handle long unbreakable text strings gracefully.
