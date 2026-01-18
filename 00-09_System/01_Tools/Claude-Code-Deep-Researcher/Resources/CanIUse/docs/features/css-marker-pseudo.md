# CSS ::marker Pseudo-Element

## Overview

The `::marker` pseudo-element allows list item markers to be styled or have their content value customized. This powerful CSS feature enables developers to take full control over the appearance and behavior of list markers (bullet points, numbers, etc.) without relying on complex workarounds or JavaScript solutions.

## Specification

- **Status**: Working Draft (WD)
- **Specification Link**: [CSS Pseudo-Elements Module Level 4 - ::marker](https://w3c.github.io/csswg-drafts/css-pseudo-4/#marker-pseudo)
- **Category**: CSS3

## What is ::marker?

The `::marker` pseudo-element targets the marker of a list item. It can be used with any element that generates a marker, including:
- `<li>` elements (ordered and unordered lists)
- Any element with `display: list-item`

### Example Usage

```css
/* Style list markers */
li::marker {
  color: #e74c3c;
  font-weight: bold;
}

/* Customize ordered list markers */
ol li::marker {
  color: #3498db;
  font-size: 1.2em;
}

/* Customize unordered list markers */
ul li::marker {
  color: #27ae60;
}

/* Change marker content */
li::marker {
  content: "✓ ";
}
```

## Benefits and Use Cases

### 1. **Visual Customization**
- Change marker color independently from list text
- Adjust marker font size and weight
- Create visually distinctive list styling

### 2. **Content Customization**
- Replace default markers with custom symbols or emojis
- Use `content` property to modify marker appearance
- Create branded list experiences

### 3. **Accessibility**
- Style markers for improved readability
- Create high-contrast lists for visibility
- Maintain semantic HTML structure

### 4. **Design Flexibility**
- Implement sophisticated list designs without nested elements
- Create multi-level list styling without complex selectors
- Maintain clean, semantic HTML

### 5. **Reduced Complexity**
- No need for pseudo-elements or wrapper divs
- Simplify CSS compared to previous workarounds
- Keep DOM structure clean and semantic

## Browser Support

| Browser | First Version | Status | Notes |
|---------|---------------|--------|-------|
| Chrome | 86+ | ✅ Full Support | Stable support from version 86 onwards |
| Edge | 86+ | ✅ Full Support | Chromium-based, same support as Chrome |
| Firefox | 68+ | ✅ Full Support | Stable support from version 68 onwards |
| Safari | 11.1+ | ⚠️ Partial Support | Limited to `color` and `font-size` properties ([Bug #204163](https://bugs.webkit.org/show_bug.cgi?id=204163)) |
| Safari TP | Latest | ✅ Full Support | Full support in Safari Technology Preview |
| iOS Safari | 11.3+ | ⚠️ Partial Support | Limited to `color` and `font-size` properties |
| Opera | 72+ | ✅ Full Support | Full support from version 72 onwards |
| Opera Mobile | 80+ | ✅ Full Support | Mobile support available |
| Samsung Internet | 14.0+ | ✅ Full Support | Full support from version 14.0 onwards |
| Android Browser | 142+ | ✅ Full Support | Recent Android browsers fully supported |

### Global Support Summary

```
Usage Stats:
- Full Support: 81.93%
- Partial Support: 10.44%
- No Support: ~7.63%
```

## Known Limitations and Bugs

### Safari/iOS Safari Limitation

Safari and iOS Safari have **limited support** for the `::marker` pseudo-element:

- ✅ **Supported properties**: `color`, `font-size`
- ❌ **Unsupported features**: Most other CSS properties, `content` property
- **Bug Reference**: [WebKit Bug #204163](https://bugs.webkit.org/show_bug.cgi?id=204163)

**Workaround**: For full `::marker` support on Safari, consider using fallback techniques or waiting for broader implementation.

### Browser-Specific Implementation Notes

- **Internet Explorer / Legacy Edge (versions < 86)**: No support
- **Opera Mini**: Not supported
- **Android UC Browser**: Limited versions
- **QQ Browser**: No support reported

## Implementation Considerations

### Progressive Enhancement Strategy

When implementing `::marker`, consider a progressive enhancement approach:

```css
/* Base styling (works everywhere) */
li {
  color: #333;
}

/* Enhanced styling with ::marker (modern browsers) */
li::marker {
  color: #e74c3c;
  font-weight: bold;
}
```

### Testing Across Browsers

Always test marker styling across:
1. Desktop browsers (Chrome, Firefox, Safari, Edge)
2. Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
3. Verify degradation gracefully on unsupported browsers

### CSS Properties You Can Use with ::marker

Common properties that work with `::marker`:
- `color` - Text color of the marker
- `font-size` - Size of the marker
- `font-family` - Font of the marker
- `font-weight` - Weight of the marker
- `text-transform` - Transform marker text
- `white-space` - Whitespace handling
- `word-spacing` - Spacing between words
- `content` - Customize marker content (limited browser support)

## Related CSS Features

- [CSS Pseudo-Elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [list-style Property](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style)
- [::before and ::after](https://developer.mozilla.org/en-US/docs/Web/CSS/::before)
- [Content Property](https://developer.mozilla.org/en-US/docs/Web/CSS/content)

## External Resources

### Official Documentation
- [MDN Web Docs - CSS ::marker](https://developer.mozilla.org/en-US/docs/Web/CSS/::marker)
- [CSS-Tricks - ::marker Selector](https://css-tricks.com/almanac/selectors/m/marker/)

### Implementation Tracking
- [Chrome Support Bug #457718](https://bugs.chromium.org/p/chromium/issues/detail?id=457718)
- [Firefox Support Bug #205202](https://bugzilla.mozilla.org/show_bug.cgi?id=205202)
- [WebKit Support Bug #141477](https://bugs.webkit.org/show_bug.cgi?id=141477)
- [Safari Support Bug #204163](https://bugs.webkit.org/show_bug.cgi?id=204163) - Limited support tracking

## Summary

The CSS `::marker` pseudo-element is a modern and powerful way to style list markers without resorting to complex workarounds. With strong support across all major modern browsers (except Safari's limitations), it's an excellent choice for contemporary web development.

**Recommendation**: Use `::marker` for new projects targeting modern browsers, but maintain fallback styles for Safari to ensure consistent appearance across all platforms.
