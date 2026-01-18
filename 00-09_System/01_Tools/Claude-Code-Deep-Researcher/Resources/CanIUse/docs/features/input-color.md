# Color Input Type

## Overview

The `<input type="color">` element is an HTML5 form field that provides a user-friendly interface for selecting colors. When users interact with a color input field, browsers typically display a native color picker (or a fallback mechanism), allowing them to choose and input color values directly.

## Description

The color input type allows users to select a color through the browser's native color picker interface. This input type returns a valid color value in hexadecimal format (e.g., `#RRGGBB`), providing a standardized way to handle color selection in web forms without requiring third-party libraries or custom JavaScript implementations.

## Specification Status

**Status:** Living Standard (LS)

**Official Specification:** [HTML Standard - Color State (type=color)](https://html.spec.whatwg.org/multipage/forms.html#color-state-(type=color))

## Categories

- HTML5

## Benefits & Use Cases

- **Simplified User Experience:** Native color pickers provide an intuitive, platform-consistent interface for color selection
- **Reduced Development Overhead:** No need for custom JavaScript or jQuery plugins to implement color selection
- **Mobile-Friendly:** Leverages native mobile color pickers on supported devices
- **Accessibility:** Built-in form input semantics support assistive technologies
- **Standard Format:** Returns color values in a standardized hexadecimal format
- **No External Dependencies:** Eliminates the need for third-party libraries or polyfills for most modern browsers
- **Form Validation:** Integrated with HTML5 form validation mechanisms

## Browser Support

### Summary

- **Excellent Support:** Chrome, Edge, Firefox, Opera, Safari, and most modern browsers
- **Limited Mobile Support:** Opera Mini (no support), iOS Safari with limitations (WKWebView support only)
- **Legacy Browser Issues:** Internet Explorer (all versions) and older Safari versions do not support this feature

### Detailed Browser Support Table

| Browser | First Support | Latest Support | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 20 | 146 | Full support from Chrome 20 onwards |
| **Edge** | 14 | 143 | Full support from Edge 14 onwards (Chromium-based) |
| **Firefox** | 29 | 148 | Full support from Firefox 29 onwards |
| **Safari (macOS)** | 12.1 | 18.5-18.6 | Support began with Safari 12.1 |
| **Safari (iOS)** | 12.2 | 18.5-18.7 | Supported through WKWebView and Safari (see notes below) |
| **Opera** | 11 | 122 | Full support from Opera 11 onwards (with a gap in versions 15-16) |
| **Android Browser** | 4.4 | 142 | Full support from Android 4.4 onwards |
| **Opera Mini** | All versions | All versions | Not supported |
| **Internet Explorer** | 5.5-11 | 11 | No support |
| **Samsung Internet** | 4.0 | 29 | Full support from Samsung Internet 4.0 onwards |
| **UC Browser (Android)** | 15.5 | 15.5 | Supported |
| **Android Chrome** | - | 142 | Full support |
| **Android Firefox** | - | 144 | Full support |
| **Opera Mobile** | 10 | 80 | Full support from Opera Mobile 10 onwards |
| **BlackBerry** | 7-10 | 10 | Supported |
| **Baidu** | 13.52 | 13.52 | Supported |
| **QQ Browser** | 14.9 | 14.9 | Supported |
| **KaiOS** | - | 3.0-3.1 | Supported from KaiOS 3.0 onwards |

### Global Usage

- **Users with Support:** 92.92% of global browser usage
- **Users with Partial Support:** 0%
- **Users without Support:** 7.08% of global browser usage

## Implementation Notes

### iOS Limitations

On iOS devices, the color input type is supported through **WKWebView and Safari**, but **not through UIWebView**. This is an important distinction for developers building hybrid applications or using embedded web views on iOS.

### No Prefixes Required

The `color` input type does not require vendor prefixes (such as `-webkit-` or `-moz-`) across any browser.

### Fallback Behavior

Browsers that do not support the `<input type="color">` element will fall back to a standard text input field (`<input type="text">`), allowing users to manually enter color values as hexadecimal strings.

### Format

The color input always returns and accepts values in the following formats:
- **Hexadecimal format:** `#RRGGBB` (e.g., `#FF5733`)
- Case-insensitive in most implementations
- Always six digits plus the hash symbol

## Related Resources

### Polyfills & Alternatives

- [Color Polyfill](https://github.com/jonstipe/color-polyfill) - A polyfill for browsers without native support

### Documentation

- [MDN Web Docs - input type="color"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color) - Comprehensive documentation with examples and API details
- [WebPlatform Docs - input type="color"](https://webplatform.github.io/docs/html/elements/input/type/color) - Alternative documentation reference

## Example Usage

```html
<form>
  <label for="favcolor">Select your favorite color:</label>
  <input type="color" id="favcolor" name="favcolor" value="#ff0000">
  <button type="submit">Submit</button>
</form>
```

```javascript
// Access the color value
const colorInput = document.getElementById('favcolor');
console.log(colorInput.value); // Returns color in #RRGGBB format

// Listen for changes
colorInput.addEventListener('input', (e) => {
  console.log('Selected color:', e.target.value);
});
```

## Recommendations

### When to Use

- Modern web applications targeting current browsers
- Forms that require color selection (design tools, customization features, etc.)
- Progressive enhancement scenarios where fallback to text input is acceptable

### When to Consider Alternatives

- If supporting Internet Explorer is a requirement, use a JavaScript color picker library
- For older browser support, implement a polyfill or JavaScript-based color picker
- For advanced color manipulation, consider libraries like `color.js` or `TinyColor`

### Best Practices

1. Always provide a label associated with the color input for accessibility
2. Set a reasonable default value using the `value` attribute
3. Use CSS to style the input element appropriately for your design
4. Consider implementing a polyfill for older browsers if necessary
5. Test on target browsers and devices, particularly iOS devices

---

**Last Updated:** 2024
**Data Source:** CanIUse (input-color.json)
