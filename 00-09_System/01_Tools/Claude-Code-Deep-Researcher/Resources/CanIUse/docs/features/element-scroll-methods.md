# Scroll Methods on Elements (`scroll`, `scrollTo`, `scrollBy`)

## Overview

The Element scroll methods provide a modern, standardized way to programmatically change the scroll position of an element in the DOM. These methods offer significant advantages over manually setting `scrollTop` and `scrollLeft` properties, including support for smooth scrolling behavior and a cleaner API.

## Description

Methods to change the scroll position of an element. Similar to setting `scrollTop` & `scrollLeft` properties, but also allows options to be passed to define the scroll behavior.

The three main methods are:

- **`Element.prototype.scroll()`** - Scrolls the element to a specified position
- **`Element.prototype.scrollTo()`** - Alias for `scroll()`, scrolls to a specified position
- **`Element.prototype.scrollBy()`** - Scrolls the element by a specified amount relative to its current position

## Specification Status

**Status:** Working Draft (WD)

**Specification:** [CSSOM View Module - Extension to the Element Interface](https://www.w3.org/TR/cssom-view-1/#extension-to-the-element-interface)

## Categories

- DOM
- JS API

## Key Features & Benefits

### Advantages Over Legacy Properties

1. **Smooth Scrolling Support**: Both methods support a `behavior` option with `auto` (instant) or `smooth` values
2. **Cleaner API**: More intuitive method-based approach compared to property assignment
3. **Flexible Parameters**: Accept either coordinate objects or individual x/y parameters
4. **Standard Compliance**: W3C standardized interface across all modern browsers

### Use Cases

- **Smooth page navigation**: Implement smooth scrolling to specific sections
- **Auto-scroll features**: Programmatically scroll containers to content
- **Infinite scroll implementations**: Scroll to load more content
- **Accessibility enhancements**: Support keyboard navigation with smooth scrolling
- **Custom scroll interactions**: Build dynamic scroll behaviors based on user actions
- **Content highlighting**: Smoothly scroll elements into view with context

## Browser Support

### Support Legend

- ✅ **Fully supported** - The feature is fully implemented and working
- ⚠️ **Partial support** - The feature is implemented but with limitations (see notes)
- ❌ **Not supported** - The feature is not available

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|---------------|---|
| Chrome | 61 | ✅ Full support (v61+) |
| Firefox | 36 | ✅ Full support (v36+) |
| Safari | 14 | ✅ Full support (v14+) |
| Edge | 79 | ✅ Full support (v79+) |
| Opera | 48 | ✅ Full support (v48+) |
| Internet Explorer 5.5-11 | — | ❌ Not supported |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|---|
| iOS Safari | 14.5 | ✅ Full support (v14.5+) |
| Android Browser | 142 | ✅ Full support (v142+) |
| Chrome for Android | 142 | ✅ Full support (v142+) |
| Firefox for Android | 144 | ✅ Full support (v144+) |
| Samsung Internet | 8.2 | ✅ Full support (v8.2+) |
| Opera Mobile | 80 | ✅ Full support (v80+) |
| UC Browser | 15.5 | ✅ Full support (v15.5+) |
| QQ Browser | 14.9 | ✅ Full support (v14.9+) |
| Baidu Browser | 13.52 | ✅ Full support (v13.52+) |
| KaiOS | 2.5 | ✅ Full support (v2.5+) |
| Opera Mini | All versions | ❌ Not supported |
| BlackBerry | 7-10 | ❌ Not supported |
| IE Mobile | 10-11 | ❌ Not supported |

### Partial Support Details

**Safari 10-13, iOS Safari 10.0-14.4**: ⚠️ Partial support

- These versions do not support the `smooth` behavior option
- Only the `auto` (instant) scroll behavior is available
- The methods themselves work, but smooth scrolling is not possible

## Implementation Examples

### Basic Scroll To Position

```javascript
// Scroll to coordinates (x, y)
element.scrollTo(0, 100);

// Scroll to coordinates with options
element.scrollTo({
  left: 0,
  top: 100,
  behavior: 'auto' // or 'smooth'
});
```

### Smooth Scrolling

```javascript
// Smooth scroll to a specific position
element.scrollTo({
  left: 0,
  top: 500,
  behavior: 'smooth'
});
```

### Relative Scrolling

```javascript
// Scroll by 100px down and 50px to the right
element.scrollBy({
  left: 50,
  top: 100,
  behavior: 'smooth'
});
```

## Notes

- **Related Feature**: See also the support for the [`scrollIntoView` method](https://caniuse.com/#feat=scrollintoview), which is complementary and well-supported across browsers.

- **Smooth Behavior Limitation (Safari 10-13, iOS Safari 10.0-14.4)**: These versions do not support the `smooth` behavior option. When using these methods on Safari versions 10-13, smooth scrolling will fall back to instant scrolling. Consider using a polyfill or CSS-based alternatives for these older versions if smooth scrolling is critical to your application.

- **Progressive Enhancement**: Since older browsers don't support these methods, consider providing fallback implementations using `scrollTop`/`scrollLeft` property assignment for maximum compatibility.

## Related Resources

- [MDN: Element.scrollTo()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo)
- [MDN: Element.scrollBy()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy)
- [CSSOM View Module Specification](https://www.w3.org/TR/cssom-view-1/)
- [MDN: Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)

## Usage Statistics

- **Full Support**: 92.67% of users
- **Partial Support**: 0.36% of users
- **Total Coverage**: 93.03% of global users

---

**Last Updated**: Based on CanIUse data as of December 2025

*Note: This documentation is generated from the CanIUse database and reflects current browser support information. For the most up-to-date compatibility data, visit [caniuse.com](https://caniuse.com).*
