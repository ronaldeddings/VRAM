# Unhandled Promise Rejection Events

## Overview

The `unhandledrejection` and `rejectionhandled` events provide a mechanism for detecting and handling Promise rejections at the global level. These events fire when a Promise is rejected without an immediate rejection handler, allowing developers to implement global error handling strategies for async operations.

## Description

The `unhandledrejection` event is fired when a Promise is rejected but there is no rejection handler to deal with the rejection. The `rejectionhandled` event is fired when a Promise is rejected, and after the rejection is handled by the promise's rejection handling code.

These events enable developers to:
- Catch unhandled promise rejections that would otherwise cause silent failures
- Implement global error logging and monitoring
- Provide user feedback for critical failures
- Prevent application crashes from unhandled async errors

## Specification

- **Status**: Living Standard (LS)
- **Specification URL**: [WHATWG HTML Living Standard - Unhandled Promise Rejections](https://html.spec.whatwg.org/multipage/webappapis.html#unhandled-promise-rejections:event-unhandledrejection)

## Categories

- JavaScript (JS)
- JavaScript API

## Use Cases & Benefits

### 1. Global Error Handling
Implement centralized error handling for promise rejections without explicit try-catch blocks:

```javascript
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error logging service
});
```

### 2. Error Logging & Monitoring
Track and log unhandled rejections for debugging and monitoring purposes:

```javascript
window.addEventListener('unhandledrejection', event => {
  logErrorToService({
    type: 'unhandledRejection',
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date()
  });
});
```

### 3. Dynamic Error Recovery
Implement recovery strategies for specific types of failures:

```javascript
window.addEventListener('unhandledrejection', event => {
  if (event.reason instanceof NetworkError) {
    event.preventDefault(); // Prevent error propagation
    retryOperation();
  }
});
```

### 4. Detecting Late Handlers
Monitor when previously unhandled rejections become handled:

```javascript
window.addEventListener('rejectionhandled', event => {
  console.log('Previously unhandled rejection was handled:', event.reason);
});
```

## Browser Support

| Browser | Supported From | Status |
|---------|---|---|
| **Chrome** | v49 | ✅ Full support |
| **Firefox** | v69 | ✅ Full support |
| **Safari** | v11 | ✅ Full support |
| **Edge** | v79 | ✅ Full support |
| **Opera** | v36 | ✅ Full support |
| **Internet Explorer** | — | ❌ Not supported |
| **iOS Safari** | v11.3+ | ✅ Full support (v11.0-11.2: Partial) |
| **Android Browser** | v4.4.3+ | ✅ Full support |
| **Opera Mobile** | v80+ | ✅ Full support |
| **Samsung Internet** | v5.0+ | ✅ Full support |
| **UC Browser** | v15.5+ | ✅ Full support |

### Browser Version Details

#### Desktop Browsers

**Chrome**: Supported from version 49 onwards (100% coverage for v49-146)

**Firefox**: Supported from version 69 onwards (100% coverage for v69-148)

**Safari**: Supported from version 11 onwards (100% coverage for v11-18.5+)

**Edge**: Supported from version 79 onwards (100% coverage for v79-143)

**Opera**: Supported from version 36 onwards (100% coverage for v36-122)

#### Mobile Browsers

**iOS Safari**:
- v11.0-11.2: Partial support (marked as "u")
- v11.3+: Full support

**Android Chrome**: Latest versions fully supported (v142+)

**Samsung Internet**: Supported from v5.0 onwards

**Android Firefox**: Latest versions fully supported (v144+)

**Opera Mobile**: Supported from v80 onwards

#### Legacy & Unsupported

- **Internet Explorer**: All versions (5.5-11) unsupported
- **Opera Mini**: All versions unsupported
- **BlackBerry**: Not supported
- **KaiOS**: Supported from v3.0 onwards

## Global Support Statistics

- **Full Support**: 92.81% of global browser usage
- **Partial Support**: No browsers with partial support in current versions
- **No Support**: 7.19% of global browser usage

## Polyfill & Compatibility

A polyfill for this feature is available in the **core-js** library for environments that require support in older browsers.

**Polyfill Reference**: [core-js - Unhandled Rejection Tracking](https://github.com/zloirock/core-js#unhandled-rejection-tracking)

## Event Properties

### PromiseRejectionEvent

The events that fire are `PromiseRejectionEvent` objects with the following properties:

- **`promise`** (Promise): The Promise that was rejected
- **`reason`** (any): The reason for the rejection (typically an Error object)

### Method

- **`preventDefault()`**: When called on the `unhandledrejection` event, prevents the rejection from being reported

## Usage Example

```javascript
// Listen for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled rejection detected:', {
    reason: event.reason,
    promise: event.promise
  });

  // Log to error tracking service
  if (event.reason instanceof Error) {
    captureException(event.reason);
  }

  // Optionally prevent the rejection from causing issues
  event.preventDefault();
});

// Listen for rejections that were initially unhandled but later handled
window.addEventListener('rejectionhandled', event => {
  console.log('Rejection was eventually handled:', event.reason);
});

// Example that triggers unhandledrejection
Promise.reject(new Error('Something went wrong')).catch(() => {
  // This catch will be called after a microtask,
  // but unhandledrejection may fire before this
});
```

## Notes

No additional notes on compatibility issues or implementation details at this time.

## Related Resources

- [MDN: rejectionhandled Event](https://developer.mozilla.org/en-US/docs/Web/Events/rejectionhandled)
- [MDN: unhandledrejection Event](https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection)
- [Chrome Samples: Promise Rejection Events](https://googlechrome.github.io/samples/promise-rejection-events/)
- [core-js: Unhandled Rejection Tracking](https://github.com/zloirock/core-js#unhandled-rejection-tracking)

## References

- **Specification**: WHATWG HTML Living Standard
- **Keywords**: `onunhandledrejection`, `onrejectionhandled`, `promiserejectionevent`
- **Usage Statistics**: 92.81% of tracked browsers with full support
