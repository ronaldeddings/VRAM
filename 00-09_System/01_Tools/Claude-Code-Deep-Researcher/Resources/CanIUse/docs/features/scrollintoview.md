# scrollIntoView

## Overview

The `Element.scrollIntoView()` method scrolls the current element into the visible area of the browser window. Parameters can be provided to set the position inside the visible area as well as whether scrolling should be instant or smooth.

## Description

`scrollIntoView()` is a DOM API method that automatically scrolls a parent element or the entire page to ensure that a specified element is visible within the viewport. This is particularly useful for:

- Focusing on relevant content programmatically
- Improving user experience when dealing with long lists or forms
- Implementing "scroll to" functionality for navigation
- Managing focus within modal dialogs or expanded sections

## Specification Status

**Status:** Working Draft (WD)
**Specification:** [CSSOM View Module - Element.scrollIntoView()](https://w3c.github.io/csswg-drafts/cssom-view/#dom-element-scrollintoview)

## Categories

- DOM
- JS API

## Benefits & Use Cases

### Primary Use Cases

1. **Form Validation & Focus Management**
   - Automatically scroll to the first invalid form field to draw user attention
   - Improve accessibility for keyboard navigation

2. **Dynamic Content Navigation**
   - Scroll to a newly loaded element in infinite scroll implementations
   - Navigate to specific items in a large list or table

3. **Accessibility Features**
   - Ensure focused elements are visible on screen
   - Support users with keyboard-only navigation

4. **User Experience Enhancement**
   - Smooth scrolling to anchor links
   - Progressive revelation of content
   - Guided user experience in multi-step processes

### Key Benefits

- **Native API**: No external libraries required for basic functionality
- **Cross-browser Compatibility**: Well-supported in modern browsers
- **Flexible Options**: Can specify alignment and behavior (instant vs. smooth)
- **Improved Accessibility**: Helps ensure important content is visible to all users

## Browser Support

### Support Legend

- **✅ Full Support (y)**: Full implementation including smooth scrolling behavior
- **⚠️ Partial Support (a)**: Basic `scrollIntoView()` supported, but smooth behavior option not available (see notes)
- **❌ No Support (n)**: Method not available
- **❓ Unknown (u)**: Support status unclear

### Desktop Browsers

| Browser | First Full Support | Current Status |
|---------|------------------|-----------------|
| **Chrome** | 61 | ✅ Full Support |
| **Edge** | 79 | ✅ Full Support |
| **Firefox** | 36 | ✅ Full Support |
| **Safari** | 16.0 | ✅ Full Support |
| **Opera** | 48 | ✅ Full Support |
| **Internet Explorer** | - | ❌ Not Supported |

### Mobile Browsers

| Browser | First Full Support | Current Status |
|---------|------------------|-----------------|
| **iOS Safari** | 16.0 | ✅ Full Support |
| **Android Browser** | 4.4+ | ⚠️ Partial Support |
| **Chrome for Android** | Current | ✅ Full Support |
| **Firefox for Android** | Current | ✅ Full Support |
| **Samsung Internet** | 8.2 | ✅ Full Support |
| **Opera Mobile** | 80+ | ✅ Full Support |
| **Opera Mini** | - | ❌ Not Supported |

### Legacy Browser Support

- **Internet Explorer (8-11)**: ⚠️ Partial support only
- **Chrome (4-60)**: ⚠️ Partial support only
- **Firefox (2-35)**: ⚠️ Partial support only
- **Safari (5.1-15.x)**: ⚠️ Partial support only
- **Edge (12-78)**: ⚠️ Partial support only

## Global Usage Statistics

- **Full Support (y)**: 92.18% of users
- **Partial Support (a)**: 1.5% of users
- **No Support (n)**: ~6% of users

## API Usage & Examples

### Basic Syntax

```javascript
// Simple scroll into view
element.scrollIntoView();

// Align to top
element.scrollIntoView(true);  // equivalent to { block: 'start' }

// Align to bottom
element.scrollIntoView(false); // equivalent to { block: 'end' }

// With options (smooth scroll)
element.scrollIntoView({
  behavior: 'smooth', // or 'auto' for instant
  block: 'start',      // or 'end', 'center', 'nearest'
  inline: 'nearest'    // or 'start', 'end', 'center'
});
```

### Practical Examples

#### Form Validation

```javascript
function scrollToFirstInvalidField() {
  const invalidField = document.querySelector('input:invalid');
  if (invalidField) {
    invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalidField.focus();
  }
}
```

#### Scroll to Anchor

```javascript
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Usage: scrollToElement('section-2');
```

#### Table Row Selection

```javascript
function focusTableRow(rowElement) {
  rowElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
  });
  rowElement.classList.add('active');
}
```

## Important Notes

### Smooth Behavior Limitation

**Note #1 (from caniuse):** Supports `scrollIntoView()` with boolean parameter, but not the `smooth` behavior option.

- Browsers marked with `a #1` support the basic method with boolean parameters
- The `smooth` behavior option (for smooth scrolling animation) is not supported in these browsers
- For older browsers, use the boolean parameter: `element.scrollIntoView(true)` or `element.scrollIntoView(false)`
- Use a [smooth scroll polyfill](#polyfills) if smooth behavior is required for older browsers

### Partial Support Affected Browsers

The following browsers support only the basic `scrollIntoView()` with boolean parameters:

- Internet Explorer 8-11
- Chrome 4-60
- Firefox 2-35
- Safari 5.1-15.x
- Edge 12-78
- Opera 11.6-47
- Opera Mini (all versions)
- Android Browser
- Older mobile browsers

### Progressive Enhancement Strategy

For maximum compatibility:

```javascript
// Check for smooth scroll support
function scrollToElement(element, smooth = true) {
  if (smooth && CSS.supports('scroll-behavior', 'smooth')) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else if (smooth && element.scrollIntoView.length >= 1) {
    // Fallback for partial support
    element.scrollIntoView(true);
  } else {
    // Legacy support
    element.scrollIntoView();
  }
}
```

## Polyfills

### Smooth Scroll Polyfill

For browsers that don't support the `smooth` behavior option:

- **[Smooth Scroll Polyfill](http://iamdustan.com/smoothscroll/)** - Provides polyfill for smooth behavior option across all browsers

Installation and usage:

```html
<!-- Include polyfill -->
<script src="smoothscroll.min.js"></script>

<!-- Now smooth scrolling works in all browsers -->
<script>
  element.scrollIntoView({ behavior: 'smooth' });
</script>
```

## References & Resources

### Official Documentation

- **[MDN Web Docs - Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)** - Comprehensive API documentation and examples

### Specifications

- **[W3C CSSOM View Module](https://w3c.github.io/csswg-drafts/cssom-view/#dom-element-scrollintoview)** - Official W3C specification

### Related APIs

- [Element.scrollIntoViewIfNeeded()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded) - Non-standard but useful variant
- [Window.scroll()](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll) - Low-level scroll control
- [CSS scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) - CSS-level smooth scrolling

## Browser Compatibility Table Summary

### Modern Browsers (Current Versions)

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 100+ | ✅ Full |
| Firefox | 100+ | ✅ Full |
| Edge | 100+ | ✅ Full |
| Safari | 15.4+ | ✅ Full |
| Opera | 80+ | ✅ Full |

### Mobile (Current Versions)

| Platform | Status |
|----------|--------|
| iOS Safari 15.4+ | ✅ Full |
| Android Chrome | ✅ Full |
| Samsung Internet 8.2+ | ✅ Full |

## Recommendations

### When to Use scrollIntoView

1. **Forms**: Scroll to validation errors or required fields
2. **Navigation**: Implement smooth scroll-to-section functionality
3. **Accessibility**: Ensure focused elements are always visible
4. **User Feedback**: Direct attention to newly loaded or updated content

### Best Practices

1. Always provide fallback styling for browsers that don't support the method
2. Consider using CSS `scroll-behavior: smooth` as a CSS-only alternative
3. Test smooth scrolling behavior across target browsers
4. Use polyfills for older browsers if smooth scrolling is critical
5. Combine with focus management for better accessibility
6. Consider performance impact of multiple simultaneous scroll operations

### For Legacy Support

If you need to support Internet Explorer or very old browsers:

1. Use the boolean parameter: `element.scrollIntoView(true/false)`
2. Implement a smooth scroll polyfill for older browsers
3. Consider CSS-only scroll solutions as alternatives
4. Thoroughly test on target platforms

## See Also

- [Smooth Scroll Polyfill](http://iamdustan.com/smoothscroll/)
- [Can I Use - scrollIntoView](https://caniuse.com/scrollintoview)
- [MDN - scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
