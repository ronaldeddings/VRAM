# Shadow DOM (V1)

## Overview

Shadow DOM v1 is a web standard that provides a method of establishing and maintaining functional boundaries between DOM trees, enabling better functional encapsulation within the DOM and CSS. It allows developers to create self-contained web components with isolated styling and markup.

## Specification

- **Official Specification**: [W3C Shadow DOM Specification](https://www.w3.org/TR/shadow-dom/)
- **Specification Status**: Working Draft (WD)
- **Keywords**: `webcomponents`, `shadow dom`, `attachShadow`

## What is Shadow DOM?

Shadow DOM encapsulates a separate DOM tree within a host element. This encapsulation provides:

- **Style Isolation**: CSS styles defined inside a shadow DOM don't leak to the main document
- **DOM Encapsulation**: The shadow DOM tree is hidden from the main document's DOM traversal
- **DOM/CSS Boundaries**: Clean separation between the light DOM (main document) and shadow DOM (component internals)
- **Reusability**: Components can be created with self-contained styles and structure

## Categories

- DOM

## Use Cases & Benefits

### Primary Benefits

1. **Component Encapsulation**
   - Create self-contained web components
   - Avoid CSS naming conflicts with global styles
   - Encapsulate component implementation details

2. **Web Components**
   - Build reusable custom elements
   - Hide internal implementation from users
   - Provide clean public APIs

3. **Style Scoping**
   - Prevent style leakage between components
   - Use simple class names without collision risk
   - Define component-specific styles

4. **DOM Isolation**
   - Hide internal DOM structure
   - Prevent accidental DOM manipulation
   - Maintain component integrity

### Common Applications

- Custom form elements
- Design system components
- Third-party embeddable widgets
- UI library implementations
- Theme-able component systems

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| **y** | Fully supported |
| **a** | Partially supported |
| **n** | Not supported |
| **d** | Supported with flag/preference |

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 53+ | ✅ Full Support | Starting from Chrome 53 |
| **Edge** | 79+ | ✅ Full Support | Starting from Edge 79 (Chromium-based) |
| **Firefox** | 63+ | ✅ Full Support | Starting from Firefox 63 |
| **Safari** | 10+ | ✅ Full Support | Starting from Safari 10 |
| **Opera** | 40+ | ✅ Full Support | Starting from Opera 40 |
| **Internet Explorer** | All versions | ❌ Not Supported | No support in IE 11 or earlier |

### Mobile Browsers

| Platform | Browser | Version | Status | Notes |
|----------|---------|---------|--------|-------|
| **iOS Safari** | iOS Safari | 10.0-10.2 | ⚠️ Partial | Limited support, CSS selectors and slotted styling buggy |
| **iOS Safari** | iOS Safari | 10.3+ | ✅ Full Support | Complete support from iOS 10.3+ |
| **iOS Safari** | iOS Safari | 11.0+ | ✅ Full Support | |
| **Android** | Android Browser | 4.4 | ❌ Not Supported | |
| **Android** | Android Browser | 142+ | ✅ Full Support | Recent versions fully supported |
| **Android Chrome** | Chrome Android | 142+ | ✅ Full Support | |
| **Android Firefox** | Firefox Android | 144+ | ✅ Full Support | |
| **Samsung Internet** | Samsung | 5.0-5.4 | ⚠️ Partial | Limited support |
| **Samsung Internet** | Samsung | 6.2+ | ✅ Full Support | Complete support from 6.2+ |
| **Opera Mobile** | Opera Mobile | 80+ | ✅ Full Support | Starting from Opera Mobile 80 |
| **UC Browser** | UC Browser Android | 15.5+ | ✅ Full Support | |
| **KaiOS** | KaiOS | 2.5 | ❌ Not Supported | |
| **KaiOS** | KaiOS | 3.0-3.1 | ✅ Full Support | |
| **Opera Mini** | Opera Mini | All | ❌ Not Supported | No support in Opera Mini |

### Global Usage Statistics

- **Full Support (y)**: 92.99% of users
- **Partial Support (a)**: 0.02% of users
- **No Support (n)**: ~7% of users

## Implementation Notes

### Firefox Implementation Details

Shadow DOM v1 support in Firefox can be controlled through preferences:

- **Firefox 58**: Disabled by default via `dom.webcomponents.enabled` preference in `about:config`
- **Firefox 59-62**: Disabled by default via `dom.webcomponents.shadowdom.enabled` preference in `about:config`
- **Firefox 63+**: Enabled by default

### Safari/iOS Safari Limitations

**Known Issues (iOS Safari 10.0-10.3)**:
- Certain CSS selectors do not work correctly, specifically `:host > .local-child`
- Styling slotted content via `::slotted` pseudo-element has bugs

These issues were resolved in iOS Safari 11.0+.

## API Reference Summary

Shadow DOM is accessed primarily through the `attachShadow()` method on HTML elements:

```javascript
const element = document.querySelector('#my-element');
const shadow = element.attachShadow({ mode: 'open' });

// Add content to shadow DOM
shadow.innerHTML = '<style>:host { color: blue; }</style><p>Hello Shadow DOM</p>';
```

### Key Methods & Properties

- `Element.attachShadow(init)` - Create a shadow root
- `Element.shadowRoot` - Access the shadow root (if mode is 'open')
- `ShadowRoot.host` - Reference to the host element
- `::slotted()` - CSS pseudo-element for styling distributed content

## Related Standards

- **Web Components**: The broader web platform standard that includes Shadow DOM
- **Custom Elements**: Define custom HTML elements (requires Shadow DOM for full encapsulation)
- **HTML Templates**: Provide template content for use with Shadow DOM
- **Slots**: Allow distribution of light DOM content into shadow DOM

## Related Links

- [Google Developers - Shadow DOM v1: Self-contained Web Components](https://developers.google.com/web/fundamentals/primers/shadowdom/?hl=en)
- [Safari Implementation Bug](https://bugs.webkit.org/show_bug.cgi?id=148695)
- [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1205323)

## Feature Support Summary

### Recommended Support Level

Shadow DOM v1 has achieved excellent browser coverage with 92.99% of users on fully supporting browsers. Modern web development can safely use Shadow DOM with minimal polyfill requirements.

### Migration Considerations

- **Legacy Browser Support**: Internet Explorer 11 and older require polyfills
- **Mobile Considerations**: Ensure testing on iOS 10-10.3 due to known limitations
- **Progressive Enhancement**: Consider shadow DOM as a progressive enhancement for optimal compatibility

## Additional Resources

- [MDN Web Docs: Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Web Components Introduction](https://www.webcomponents.org/)
- [Can I Use Shadow DOM v1](https://caniuse.com/shadowdomv1)
