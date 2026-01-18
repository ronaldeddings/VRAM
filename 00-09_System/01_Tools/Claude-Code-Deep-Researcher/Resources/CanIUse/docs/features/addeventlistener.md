# EventTarget.addEventListener()

## Overview

**addEventListener()** is the modern standard API for attaching event handlers to DOM elements. Introduced in the DOM Level 2 Events specification, it provides a robust and flexible mechanism for listening to browser events with support for both bubbling and capturing phases.

This API also encompasses related functionality:
- `removeEventListener()` - Remove previously attached event listeners
- **Event capture phase** - Handle events during the capturing phase of event dispatch
- `stopPropagation()` - Prevent event from propagating to parent elements
- `preventDefault()` - Prevent the browser's default action for an event

## Specification

- **Status**: Living Standard
- **Specification Link**: [DOM - addEventListener()](https://dom.spec.whatwg.org/#dom-eventtarget-addeventlistener)
- **Standards Body**: WHATWG

## Categories

- **DOM** (Document Object Model)

## Key Benefits & Use Cases

### Event-Driven Programming
- Establish responsive user interactions without inline event attributes
- Decouple event handling logic from HTML markup
- Implement sophisticated event delegation patterns

### Advanced Event Handling
- Capture events during the capturing phase before they reach target elements
- Dynamically add or remove event listeners based on application state
- Handle events with options like `once`, `passive`, and `signal` parameters

### Flexible Listener Management
- Add multiple listeners to the same event on a single element
- Remove specific listeners without affecting others
- Implement cleanup strategies for memory management

### Modern Web Applications
- Build interactive single-page applications (SPAs)
- Create responsive user interfaces with immediate feedback
- Implement complex user interactions and gestures

## Browser Support

### Current Status
**Global Support: 93.69%** - Universally supported across modern browsers

### First Full Support by Browser

| Browser | First Version | Notes |
|---------|---------------|-------|
| **Chrome** | 4 | Full support from Chrome's initial release |
| **Firefox** | 7 | Versions 2-6 supported with limitations (see notes) |
| **Safari** | 3.1 | Full support from Safari 3.1 onwards |
| **Edge** | 12 | Full support in all versions |
| **Internet Explorer** | 9 | IE 5.5-8 use `attachEvent()` instead |
| **Opera** | 9 | Full support from Opera 9 onwards |
| **iOS Safari** | 3.2 | Full support from iOS 3.2 onwards |
| **Android** | 2.1 | Full support from Android 2.1 onwards |
| **Samsung Internet** | 4 | Full support from Samsung Internet 4 onwards |

### Detailed Browser Compatibility

#### Desktop Browsers

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 4+ | ✅ Full Support |
| Firefox | 7+ | ✅ Full Support |
| Safari | 3.1+ | ✅ Full Support |
| Edge | 12+ | ✅ Full Support |
| Opera | 9+ | ✅ Full Support |
| Internet Explorer | 9-11 | ✅ Full Support |
| Internet Explorer | 5.5-8 | ⚠️ Partial (see notes) |

#### Mobile Browsers

| Browser | Version | Support |
|---------|---------|---------|
| iOS Safari | 3.2+ | ✅ Full Support |
| Android Browser | 2.1+ | ✅ Full Support |
| Samsung Internet | 4+ | ✅ Full Support |
| Opera Mobile | 10+ | ✅ Full Support |
| Opera Mini | All versions | ✅ Full Support |
| UC Browser | 15.5+ | ✅ Full Support |
| Baidu Browser | 13.52+ | ✅ Full Support |
| KaiOS | 2.5+ | ✅ Full Support |

## Known Issues & Limitations

### Internet Explorer 5.5-8

**Issue #1**: Legacy Event API Limitation
- **Impact**: IE 5.5-8 do not support `addEventListener()` at all
- **Workaround**: Use the proprietary [`attachEvent()` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/attachEvent)
- **Limitation**: `attachEvent()` does not support the **capturing phase** of DOM event dispatch - only event bubbling is supported
- **Recommendation**: Use polyfills for cross-browser compatibility (see related resources)

### Firefox 2-6

**Issue #2**: Non-Optional useCapture Parameter
- **Impact**: The `useCapture` parameter is required and cannot be omitted
- **Behavior**: Modern Firefox versions (7+) made this parameter optional with a default value of `false`
- **Note**: This is a minor limitation affecting legacy Firefox versions

## Code Example

```javascript
// Basic event listener
const button = document.getElementById('myButton');

button.addEventListener('click', function(event) {
  console.log('Button clicked!');
  event.preventDefault();
});

// Event listener with options
button.addEventListener('click', handleClick, {
  capture: false,      // Bubbling phase (default)
  once: false,         // Listener fires every time
  passive: false       // Can call preventDefault()
});

// Remove listener
function handleClick(event) {
  console.log('Handling click...');
}

button.removeEventListener('click', handleClick);

// Listen during capturing phase
document.addEventListener('click', handleCapture, true);

function handleCapture(event) {
  console.log('Capturing phase event');
}
```

## Related Resources

### Documentation
- **[MDN Web Docs - addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)** - Comprehensive documentation and examples

### Polyfills for Legacy Browsers
- **[Financial Times IE8 Polyfill](https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Event/polyfill.js)** - Production-ready polyfill for IE8 support
- **[WebReflection IE8 Polyfill](https://github.com/WebReflection/ie8)** - Alternative polyfill solution for IE8

## Migration Guide

### From HTML Event Attributes

❌ **Avoid** - Inline event handlers
```html
<button onclick="handleClick()">Click Me</button>
```

✅ **Prefer** - addEventListener()
```html
<button id="myButton">Click Me</button>
```
```javascript
const button = document.getElementById('myButton');
button.addEventListener('click', handleClick);
```

### From attachEvent() (IE Legacy)

❌ **Old** - IE-only attachEvent()
```javascript
element.attachEvent('onclick', handler);
```

✅ **Modern** - addEventListener() with polyfill for IE8
```javascript
element.addEventListener('click', handler);
```

## Summary

EventTarget.addEventListener() is a fundamental, universally-supported API for event handling in modern web development. With 93.69% global support and polyfills available for legacy Internet Explorer versions, it should be your standard choice for attaching event listeners to DOM elements. The API supports both the capturing and bubbling phases of event dispatch, making it suitable for sophisticated event handling patterns in complex applications.

**Recommendation**: Use `addEventListener()` for all new code. For legacy IE8 support, include the Financial Times polyfill.
