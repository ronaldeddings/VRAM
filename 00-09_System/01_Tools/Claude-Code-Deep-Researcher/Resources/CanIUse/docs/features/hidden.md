# HTML `hidden` Attribute

## Overview

The `hidden` attribute is an HTML5 boolean attribute that can be applied to any element to hide it from the user interface. Elements with the `hidden` attribute are removed from the document flow and are not displayed, similar to applying `display: none` in CSS.

## Description

The `hidden` attribute effectively hides elements from visual rendering. When applied to an element, the attribute instructs the browser to not display that element or its children. This is semantically meaningful in HTML and provides a declarative way to hide content without requiring CSS.

## Specification Status

- **Status:** Living Standard (ls)
- **Specification URL:** [HTML Living Standard - The hidden attribute](https://html.spec.whatwg.org/multipage/interaction.html#the-hidden-attribute)

## Categories

- HTML5

## Use Cases & Benefits

### Common Use Cases
- **Progressive Enhancement:** Hide elements that require JavaScript functionality until the script loads
- **Conditional Content:** Hide sections of a page based on user preferences or application state
- **Template Content:** Hide template elements that will be cloned or used dynamically via JavaScript
- **Accessibility:** Semantically hide content that should not be presented to users without relying solely on CSS
- **Tabbed Interfaces:** Hide inactive tabs or panels that will be revealed through interaction
- **Modal Overlays:** Hide modal dialogs and overlays when they are not active

### Key Benefits
- **Semantic HTML:** Provides meaningful markup indicating content is hidden by intent, not just styled hidden
- **Default Behavior:** Works out-of-the-box without requiring CSS or JavaScript
- **Universal Support:** Well-supported across modern browsers with fallback CSS options
- **JavaScript Integration:** Easy to toggle visibility via JavaScript for dynamic applications
- **Search Engine Friendly:** Search engines understand the hidden attribute and may exclude hidden content from indexing
- **Cleaner Code:** Reduces reliance on CSS for visibility management

## Browser Support

The `hidden` attribute has excellent browser support across all major modern browsers. Support began appearing in 2010-2011 for most major browsers.

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **Chrome** | 6+ | ✅ Full Support | Supported since v6 (2010) |
| **Firefox** | 4+ | ✅ Full Support | Supported since v4 (2011) |
| **Safari** | 5.1+ | ✅ Full Support | Supported since v5.1 (2011) |
| **Edge** | 12+ | ✅ Full Support | Supported since v12 (2015) |
| **Opera** | 11.1+ | ✅ Full Support | Supported since v11.1 (2011) |
| **Internet Explorer** | 11 | ✅ IE11 Only | IE 10 and below: Not supported |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **iOS Safari** | 5.0+ | ✅ Full Support | Supported since iOS 5.0 |
| **Android Browser** | 4.0+ | ✅ Full Support | Supported since Android 4.0 (2011) |
| **Chrome Mobile** | All | ✅ Full Support | Full support on all versions |
| **Firefox Mobile** | All | ✅ Full Support | Full support on all versions |
| **Samsung Internet** | 4.0+ | ✅ Full Support | Supported since v4 |
| **Opera Mobile** | 11.1+ | ✅ Full Support | Supported since v11.1 |
| **UC Browser** | 15.5+ | ✅ Full Support | Supported since v15.5 |
| **QQ Browser** | 14.9+ | ✅ Full Support | Supported since v14.9 |
| **Baidu Browser** | 13.52+ | ✅ Full Support | Supported since v13.52 |
| **KaiOS** | 2.5+ | ✅ Full Support | Supported on KaiOS devices |
| **Opera Mini** | All | ✅ Full Support | Full support on all versions |
| **IE Mobile** | 11 | ✅ IE11 Only | IE Mobile 10 and below: Not supported |
| **Blackberry** | 10+ | ✅ Full Support | Supported since BB10 |

### Support Summary

**Overall Global Usage: 93.64%**

- **Modern Browsers:** Nearly universal support
- **Legacy Browsers:** Internet Explorer versions below 11 do not support the attribute
- **Mobile Browsers:** Excellent support across all major mobile platforms
- **Alternatives:** For IE10 and below, use CSS `display: none` as a fallback

## Technical Details

### Syntax

```html
<element hidden>
  Content that should be hidden
</element>
```

The `hidden` attribute is a boolean attribute, meaning it requires no value to be effective.

### JavaScript Integration

```javascript
// Hide an element
element.hidden = true;

// Show an element
element.hidden = false;

// Toggle visibility
element.toggleAttribute('hidden');

// Check if element is hidden
if (element.hidden) {
  console.log('Element is hidden');
}
```

### CSS Interaction

```css
/* Default browser style for hidden attribute */
[hidden] {
  display: none;
}
```

## Important Notes

### CSS Override Behavior

The `hidden` attribute can be easily overridden with CSS. If a CSS rule sets `display` to any value other than `none`, the element will be visible despite having the `hidden` attribute:

```css
/* This will make the element visible, overriding the hidden attribute */
[hidden] {
  display: block !important;
}
```

**Best Practice:** Avoid overriding the `hidden` attribute with CSS unless absolutely necessary. If you need conditional visibility, consider using CSS classes or the `display` property directly rather than mixing approaches.

### Semantics vs. Styling

The `hidden` attribute provides semantic meaning that content should be hidden intentionally. Use it when:
- Content is not relevant to the current context
- Content will be revealed through user interaction or JavaScript
- Progressive enhancement is desired

Do not use it when:
- You want content to be in the document but visually hidden (use `visibility: hidden` or CSS classes instead)
- You're implementing responsive design (use media queries and CSS classes)

### Accessibility Considerations

- Elements with `hidden` attribute are excluded from the accessibility tree
- Screen readers will not read hidden content
- Hidden elements do not receive keyboard focus
- Use ARIA attributes cautiously in conjunction with `hidden`

## Fallback for Legacy Browsers

For Internet Explorer 10 and earlier support, provide CSS fallback:

```html
<style>
  [hidden] {
    display: none;
  }
</style>

<div hidden>This content is hidden</div>
```

Or use a JavaScript polyfill for IE10:

```javascript
// Simple polyfill for IE10
if (!('hidden' in document.documentElement)) {
  var style = document.createElement('style');
  style.textContent = '[hidden] { display: none; }';
  document.head.appendChild(style);

  Object.defineProperty(HTMLElement.prototype, 'hidden', {
    get: function() {
      return this.getAttribute('hidden') !== null;
    },
    set: function(value) {
      if (value) {
        this.setAttribute('hidden', '');
      } else {
        this.removeAttribute('hidden');
      }
    }
  });
}
```

## Related Resources

- [Article on hidden attribute](https://davidwalsh.name/html5-hidden) - David Walsh's comprehensive guide
- [MDN Web Docs - hidden attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden)
- [HTML Specification](https://html.spec.whatwg.org/multipage/interaction.html#the-hidden-attribute) - Official specification
- [WHATWG HTML Standard](https://html.spec.whatwg.org/) - Full HTML Living Standard

## Summary

The `hidden` attribute is a well-supported, semantic way to hide HTML elements. With support in 93.64% of browsers globally and excellent coverage across modern browsers (including IE11), it can be safely used in most web applications with minimal fallback requirements. For projects requiring Internet Explorer 10 support, CSS fallbacks or polyfills can bridge the gap.
