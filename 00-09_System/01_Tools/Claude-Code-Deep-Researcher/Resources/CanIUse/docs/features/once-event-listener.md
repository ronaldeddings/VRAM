# "once" Event Listener Option

## Overview

The `once` event listener option provides a convenient way to automatically remove an event listener after it has been invoked exactly once. This feature eliminates the need for manual cleanup code and reduces boilerplate when you need an event handler to execute only on the first occurrence of an event.

## Description

When the `once` option is set to `true` in the `addEventListener()` options object, the event listener will be automatically removed after it fires for the first time. This is functionally equivalent to jQuery's `$.one()` method and provides a cleaner, more declarative way to handle one-time events.

### Basic Usage

```javascript
// Without once option (manual removal required)
const handler = (event) => {
  console.log('Event fired!');
  element.removeEventListener('click', handler);
};
element.addEventListener('click', handler);

// With once option (automatic removal)
element.addEventListener('click', (event) => {
  console.log('Event fired!');
}, { once: true });
```

## Specification

- **Status**: Living Standard (ls)
- **Specification**: [DOM - AddEventListenerOptions.once](https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-once)

## Categories

- **DOM** - Document Object Model

## Benefits & Use Cases

### Key Benefits

1. **Cleaner Code**: Eliminates the need for manual event listener removal
2. **Less Memory Overhead**: Automatically cleans up after execution
3. **Reduced Boilerplate**: Declarative approach is more intuitive
4. **Fewer Bugs**: Prevents accidental multiple executions or forgotten cleanup

### Common Use Cases

- **Modal Dialogs**: Execute code only when a modal is first opened
- **Page Initialization**: One-time setup events that should only fire on first interaction
- **Transaction Completion**: Handle success/error callbacks that should only execute once
- **User Onboarding**: Show tutorials or help only on first visit
- **Gesture Recognition**: Detect initial swipe, tap, or keyboard event once
- **Resource Loading**: Execute callback after first resource loads

## Browser Support

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 55 | ✅ Full Support |
| Edge | 16 | ✅ Full Support |
| Firefox | 50 | ✅ Full Support |
| Safari | 10 | ✅ Full Support |
| Opera | 42 | ✅ Full Support |
| iOS Safari | 10.0 | ✅ Full Support |
| Android Chrome | 55+ | ✅ Full Support |
| Android Firefox | 50+ | ✅ Full Support |
| Samsung Internet | 6.2+ | ✅ Full Support |
| Opera Mini | All versions | ❌ Not Supported |

### Overall Usage

- **Global Support**: 93.01% of users have browser support
- **Partial Support**: 0%
- **No Support**: ~6.99%

### Important Notes on Support

- **Internet Explorer**: Not supported in any version (5.5-11)
- **Edge**: Full support from version 16 onward (legacy Edge versions 12-15 not supported)
- **Opera Mini**: Not supported
- **Mobile Browsers**: Well-supported across modern iOS Safari, Android Chrome, Firefox, and Samsung Internet
- **Legacy Devices**: BlackBerry and older Android versions do not support this feature

## Implementation Examples

### Simple Click Handler

```javascript
// Show a welcome message only once
document.querySelector('#welcome-btn').addEventListener('click', () => {
  console.log('Welcome! This message appears only once.');
}, { once: true });
```

### Modal First-Open Handler

```javascript
// Execute setup code when modal is opened for the first time
const modal = document.getElementById('my-modal');
const openBtn = document.getElementById('open-modal');

openBtn.addEventListener('click', () => {
  modal.style.display = 'block';

  // Initialize modal content only on first open
  modal.addEventListener('transitionend', () => {
    console.log('Modal fully displayed for the first time');
    // Perform initialization tasks
  }, { once: true });
});
```

### Loading Completion Handler

```javascript
// Execute callback when image finishes loading (first time only)
const image = new Image();
image.addEventListener('load', () => {
  console.log('Image loaded successfully');
}, { once: true });
image.src = 'image.jpg';
```

### Combining with Other Options

```javascript
// once can be combined with other addEventListener options
element.addEventListener('click', handleClick, {
  once: true,
  capture: false,
  passive: true
});
```

## Comparison with Manual Removal

### Without `once` option

```javascript
function handleEvent(event) {
  console.log('Handling event...');
  event.target.removeEventListener('click', handleEvent);
}

element.addEventListener('click', handleEvent);
```

### With `once` option

```javascript
element.addEventListener('click', (event) => {
  console.log('Handling event...');
}, { once: true });
```

## Polyfill/Fallback Considerations

For legacy browser support, you can implement a simple wrapper:

```javascript
function addOnceListener(element, event, handler, options = {}) {
  const wrappedHandler = (e) => {
    handler(e);
    element.removeEventListener(event, wrappedHandler, options);
  };
  element.addEventListener(event, wrappedHandler, options);
}

// Usage
addOnceListener(element, 'click', () => {
  console.log('This fires once');
});
```

## Related Resources

### Official References
- [WHATWG DOM Specification](https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-once)
- [MDN Web Docs - addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

### Related Issues & Discussions
- [Chromium Issue 615384: Support "once" event listener option](https://bugs.chromium.org/p/chromium/issues/detail?id=615384)
- [JS Bin Test Case](https://jsbin.com/zigiru/edit?html,js,output)

## Notes

- This feature is widely supported in modern browsers
- Legacy browsers and Internet Explorer do not support this feature
- The feature has zero known bugs in implementations
- Opera Mini does not support this feature
- For applications requiring IE support, consider using the polyfill approach or jQuery's `$.one()` method as an alternative

## See Also

- `removeEventListener()` - Manual event listener removal
- `addEventListener()` - Standard event listener registration
- AbortSignal and `abortController` - Modern alternative for event listener cleanup
- Event delegation patterns for efficient event handling
