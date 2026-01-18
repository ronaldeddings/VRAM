# DOMContentLoaded

## Overview

The **DOMContentLoaded** event is a fundamental JavaScript event that fires when the DOM (Document Object Model) has been fully loaded and parsed by the browser, but before all page assets such as CSS stylesheets, images, and other external resources have finished loading. This event is critical for optimizing web application startup performance and executing initialization code at the right moment in the page load lifecycle.

## Description

JavaScript event that fires when the DOM is loaded, but before all page assets are loaded (CSS, images, etc.).

## Specification Status

- **Status**: Living Standard (ls)
- **Specification Link**: [WHATWG HTML Living Standard - Stop Parsing](https://html.spec.whatwg.org/multipage/syntax.html#stop-parsing)

The DOMContentLoaded event is part of the WHATWG HTML Living Standard and represents a stable, standardized feature that is defined in the HTML specification.

## Categories

- **DOM** - Document Object Model

## Use Cases & Benefits

### Primary Use Cases

1. **DOM Initialization**: Execute JavaScript code that manipulates the DOM immediately after all HTML elements are available.

2. **Early Script Execution**: Run initialization routines before images and stylesheets have loaded, improving perceived performance.

3. **Performance Optimization**: Place heavy computations or DOM manipulations after DOMContentLoaded rather than waiting for the full page load (window.onload).

4. **Event Listener Attachment**: Attach event listeners to DOM elements once they are guaranteed to exist.

5. **Progressive Enhancement**: Load and execute core functionality before secondary assets, providing a better user experience.

### Key Benefits

- Faster Time to Interactive (TTI)
- Reduced perceived page load time
- Better resource utilization (execute code while other assets load)
- Reliable DOM element access
- Foundation for modern Single Page Applications (SPAs)

## Browser Support

### Support Status Summary

DOMContentLoaded has excellent browser support across all major modern browsers and has been supported for many years. The feature has a global usage percentage of **93.69%**.

### Desktop Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **Internet Explorer** | IE 9+ | No support in IE 5.5-8 |
| | IE 9 | Full support |
| | IE 10+ | Full support |
| **Edge (Chromium)** | 12+ | Full support in all versions |
| **Firefox** | 2+ | Full support since early versions |
| **Chrome** | 4+ | Full support since version 4 |
| **Safari** | 3.1+ | Full support since version 3.1 |
| **Opera** | 9+ | Full support since version 9 |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | 3.2+ | Full support since version 3.2 |
| **Android Browser** | 2.1+ | Full support since version 2.1 |
| **Chrome Mobile** | All versions | Full support |
| **Firefox Mobile** | All modern versions | Full support |
| **Samsung Internet** | All versions | Full support |
| **Opera Mobile** | 10+ | Full support since version 10 |
| **Opera Mini** | All versions | Full support |
| **BlackBerry Browser** | 7+ | Full support |
| **UC Browser** | 15.5+ | Full support |
| **Baidu Browser** | 13.52+ | Full support |
| **QQ Browser** | 14.9+ | Full support |
| **KaiOS Browser** | 2.5+ | Full support |

## Implementation

### Basic Usage

```javascript
// Listen for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM is fully loaded and parsed');
  // Perform initialization here
});
```

### Common Pattern

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize your application
  initializeUI();
  attachEventListeners();
  loadConfiguration();
});

function initializeUI() {
  // DOM elements are guaranteed to exist here
  const mainContainer = document.getElementById('main');
  // ... DOM manipulation code
}

function attachEventListeners() {
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', handleClick);
  });
}
```

### Modern Async Approach

```javascript
// Using async/await pattern
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const config = await fetchConfiguration();
    initializeApp(config);
  } catch (error) {
    console.error('Initialization failed:', error);
  }
});
```

## Event Lifecycle

Understanding when DOMContentLoaded fires in the page load lifecycle:

1. **HTML Parsing Begins** - Browser starts parsing the HTML document
2. **DOM Construction** - HTML elements are added to the DOM
3. **Stylesheets Parsed** (concurrent with HTML parsing)
4. **HTML Parsing Completes**
5. **DOMContentLoaded Event Fires** ← You are here
6. **Images Load** (and other external resources)
7. **Stylesheets Render**
8. **Window Load Event Fires** (after all resources loaded)

## Key Differences from Other Events

### DOMContentLoaded vs. window.load

| Aspect | DOMContentLoaded | window.load |
|--------|------------------|------------|
| **Timing** | When DOM is ready | When all resources loaded |
| **Stylesheets** | Parsed but may not be applied | Fully loaded |
| **Images** | Not yet loaded | Fully loaded |
| **Performance** | Fires sooner (better for TTI) | Fires later |
| **Use Case** | DOM initialization | Final page setup |

### DOMContentLoaded vs. window.onload

- **DOMContentLoaded**: Fires when DOM is parsed
- **window.onload**: Fires after all resources (images, stylesheets, etc.) are loaded
- **DOMContentLoaded is faster** and should be preferred for initialization

## Related Events

- **load** - Fires when the entire page is loaded including all resources
- **beforeunload** - Fires before the page is unloaded
- **unload** - Fires when the page is unloaded

## Notes

- The DOMContentLoaded event only fires on the document, not on individual elements
- This event cannot be cancelled
- Multiple event listeners can be attached to the same element
- For script execution that doesn't require DOM access, consider using inline scripts in the `<head>` or defer/async attributes
- Modern frameworks and libraries often wrap initialization logic in DOMContentLoaded handlers

## Polyfills & Alternatives

### For Very Old Browsers

If you need to support Internet Explorer 8 and below, you may need fallback mechanisms:

```javascript
function ready(callback) {
  if (document.readyState !== 'loading') {
    // Document already loaded
    callback();
  } else {
    // Modern browsers
    document.addEventListener('DOMContentLoaded', callback);
  }
}

ready(() => {
  console.log('DOM is ready');
});
```

### Using document.readyState

```javascript
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already ready
  initApp();
}
```

## Performance Considerations

### Best Practices

1. **Place scripts at the end of body** - Minimizes blocking during page parsing
2. **Use async/defer attributes** - For external scripts that don't need to block rendering
3. **Keep DOMContentLoaded handlers lightweight** - Avoid heavy computations
4. **Defer non-critical initialization** - Move heavy tasks to after DOMContentLoaded
5. **Monitor with Web Vitals** - Track Time to Interactive (TTI) and First Input Delay (FID)

### Performance Impact

- DOMContentLoaded firing time is a key metric for page performance
- Earlier DOMContentLoaded = faster Time to Interactive
- Use it as a checkpoint in your performance monitoring strategy

## Browser Compatibility Timeline

| Era | Status | Details |
|-----|--------|---------|
| **2000-2005** | Limited support | Only newer browsers |
| **2006-2010** | Widespread | Most modern browsers support it |
| **2010-Present** | Universal | All modern browsers + mobile |
| **Legacy IE (≤8)** | No support | Requires workarounds |

## References & Further Reading

- [MDN Web Docs - DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Reference/Events/DOMContentLoaded)
- [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/syntax.html#stop-parsing)
- [Web.dev - Optimizing Web Vitals](https://web.dev/vitals/)
- [Google Developers - Page Lifecycle API](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)

## Keywords

- DOM
- domready
- onload
- contentloaded
- document
- page load
- initialization
- performance
- TTI (Time to Interactive)

---

**Last Updated**: 2025
**Global Usage**: 93.69%
**Stability**: Living Standard
