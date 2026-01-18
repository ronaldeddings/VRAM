# HTML `<ol>` Reversed Attribute

## Overview

The `reversed` attribute on ordered lists (`<ol>`) allows web developers to create descending (large to small) numbered lists instead of the default ascending (small to large) numbering. This attribute has been part of the HTML specification and enjoys excellent modern browser support.

## Description

The `reversed` attribute makes an ordered list number its items in descending order (large to small), instead of the default ascending order (small to large). The actual order that the list items are displayed in the HTML document is not affected—only the numbering changes.

### Example Usage

Without the `reversed` attribute, an ordered list numbers items 1, 2, 3, etc. With the `reversed` attribute, the same list items will be numbered in reverse order based on the total count.

```html
<!-- Default ascending numbering -->
<ol>
  <li>First item (numbered 1)</li>
  <li>Second item (numbered 2)</li>
  <li>Third item (numbered 3)</li>
</ol>

<!-- Reversed descending numbering -->
<ol reversed>
  <li>First item (numbered 3)</li>
  <li>Second item (numbered 2)</li>
  <li>Third item (numbered 1)</li>
</ol>
```

## Specification

- **Status**: Living Standard (ls)
- **Official Specification**: [HTML Living Standard - `<ol>` reversed attribute](https://html.spec.whatwg.org/multipage/semantics.html#attr-ol-reversed)
- **WHATWG Standard**: Maintained by the Web Hypertext Application Technology Working Group

## Categories

- HTML5

## Use Cases & Benefits

### Common Use Cases

1. **Countdowns & Timelines**: Display step-by-step processes in reverse order (e.g., "10 steps to launch").
2. **Reverse Priority Lists**: Show items ranked from highest to lowest priority or importance.
3. **Descending Ratings**: Display top-rated items or leaderboards in descending order.
4. **Reverse Chronological Events**: List events from most recent to oldest without reordering HTML elements.
5. **Top N Lists**: Show "Top 10" lists that naturally count down from 10 to 1.

### Benefits

- **No Additional DOM Manipulation**: Achieves reverse numbering with a simple HTML attribute instead of requiring JavaScript or CSS counter manipulation.
- **Semantic HTML**: Maintains semantic meaning while providing visual numbering preferences.
- **Accessibility**: Screen readers and semantic parsers recognize the list structure correctly.
- **Performance**: No computational overhead compared to JavaScript-based solutions.
- **Simplicity**: Cleaner and more maintainable than custom numbering workarounds.

## Browser Support

### Summary Statistics
- **Global Support**: 93.25% of users have browser support
- **Full Support**: Widely supported across all modern browsers
- **No Support**: Older browsers (IE, early versions of other browsers)

### Detailed Browser Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4-19 | ❌ No | Unsupported in early versions |
| **Chrome** | 16-19 | ⚠️ Partial | Partial/unreliable support |
| **Chrome** | 20+ | ✅ Yes | Full support from v20 onwards |
| **Edge** | 12-78 | ❌ No | Not supported in EdgeHTML versions |
| **Edge** | 79+ | ✅ Yes | Full support from Chromium-based Edge v79 onwards |
| **Firefox** | 2-17 | ❌ No | Not supported |
| **Firefox** | 18+ | ✅ Yes | Full support from v18 onwards |
| **Safari** | 3.1-5.1 | ❌ No | Not supported |
| **Safari** | 6 | ⚠️ Partial | Partial support |
| **Safari** | 6.1+ | ✅ Yes | Full support from v6.1 onwards |
| **Opera** | 9-11.6 | ❌ No | Not supported |
| **Opera** | 12 | ⚠️ Partial | Partial support |
| **Opera** | 12.1+ | ✅ Yes | Full support from v12.1 onwards |
| **iOS Safari** | 3.2-5.1 | ❌ No | Not supported |
| **iOS Safari** | 6.0+ | ✅ Yes | Full support from iOS 6.0 onwards |
| **Android Browser** | 2.1-4.3 | ❌ No | Not supported |
| **Android Browser** | 4.4+ | ✅ Yes | Full support from Android 4.4 onwards |
| **Opera Mobile** | 10-79 | ❌ No | Not supported in older versions |
| **Opera Mobile** | 80+ | ✅ Yes | Full support from v80 onwards |
| **Android Chrome** | Latest | ✅ Yes | Full support |
| **Android Firefox** | Latest | ✅ Yes | Full support |
| **Samsung Internet** | 4+ | ✅ Yes | Full support |
| **Opera Mini** | All | ✅ Yes | Full support in all versions |
| **BlackBerry** | 7 | ❌ No | Not supported |
| **BlackBerry** | 10+ | ✅ Yes | Full support from v10 onwards |
| **Internet Explorer** | 5.5-11 | ❌ No | Not supported in any version |

### Legend
- ✅ **Yes** - Full support for the reversed attribute
- ⚠️ **Partial (u)** - Unreliable or incomplete support
- ❌ **No** - Not supported

### Modern Browser Landscape

**Excellent Support (>90% coverage)**:
- All current versions of Chrome, Firefox, Safari, Edge, and Opera fully support the feature
- Mobile browsers (iOS Safari, Android Chrome, Samsung Internet) have widespread support
- Only Internet Explorer and very outdated browsers lack support

## Important Notes

### Specification Behavior
- The `reversed` attribute is a boolean attribute—its presence alone is sufficient; no value is required.
- The DOM property `HTMLOListElement.reversed` can be accessed and modified via JavaScript.
- The attribute affects only the visual numbering display, not the actual DOM order.

### Fallback Considerations
- **IE Support**: For Internet Explorer compatibility, use CSS counters as a fallback:
  ```css
  ol[reversed] {
    counter-reset: item;
    list-style: none;
  }

  ol[reversed] li:before {
    content: counters(item, ".") ". ";
    counter-increment: item;
  }
  ```

### Performance
- Zero performance impact compared to alternatives
- No JavaScript execution required
- No additional rendering overhead

## Related Resources

- **HTML5 Doctor**: [HTML5 Doctor article on `<ol>` element attributes](https://html5doctor.com/ol-element-attributes/) - Comprehensive guide on ordered list attributes including `reversed`
- **MDN Web Docs**: [MDN documentation on the `<ol>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
- **WHATWG HTML Standard**: [Complete HTML standard reference](https://html.spec.whatwg.org/)

## Implementation Guide

### Basic Syntax
```html
<ol reversed>
  <li>Item</li>
  <li>Item</li>
  <li>Item</li>
</ol>
```

### With Start Attribute
```html
<!-- Start numbering from 50 and count down -->
<ol reversed start="50">
  <li>Item 50</li>
  <li>Item 49</li>
  <li>Item 48</li>
</ol>
```

### JavaScript Manipulation
```javascript
// Get the reversed state
const list = document.querySelector('ol');
console.log(list.reversed); // true or false

// Set reversed state
list.reversed = true;

// Toggle reversed state
list.reversed = !list.reversed;
```

---

**Last Updated**: December 2024
**Feature Coverage**: 93.25% of global users
**Specification Status**: Living Standard (WHATWG)
