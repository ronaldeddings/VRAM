# requestIdleCallback

## Overview

The **requestIdleCallback** API allows developers to schedule JavaScript callbacks to execute during the browser's idle time—either at the end of a frame when the main thread is free or when the user is inactive. This API is similar to `requestAnimationFrame` but optimized for non-urgent, background tasks that shouldn't interfere with critical user interactions.

## Description

The requestIdleCallback API provides a standard way to execute low-priority JavaScript tasks without blocking the main thread or impacting user experience. It also includes the complementary `cancelIdleCallback` method for canceling scheduled callbacks.

This is particularly useful for:
- Analytics and telemetry
- Non-critical feature initialization
- Data processing and indexing
- DOM updates that can be deferred
- Background maintenance tasks

## Specification Status

- **Status**: Working Draft (WD)
- **Specification URL**: https://w3c.github.io/requestidlecallback/

## Categories

- JavaScript API

## Benefits & Use Cases

### Primary Benefits

1. **Performance Optimization**: Executes tasks during browser idle time, minimizing impact on user interactions
2. **Better User Experience**: Prevents blocking of critical user-facing operations
3. **Deadline Management**: Provides deadline information to help prioritize work
4. **Efficient Resource Utilization**: Makes better use of browser resources during low-activity periods

### Common Use Cases

| Use Case | Description |
|----------|-------------|
| **Analytics & Telemetry** | Send usage data and metrics without impacting page performance |
| **Non-critical DOM Updates** | Defer UI updates that don't require immediate rendering |
| **Data Processing** | Process or index data in the background |
| **Prefetching** | Preload resources when the browser is idle |
| **Cleanup Tasks** | Remove obsolete cache entries or temporary data |
| **Logging & Monitoring** | Send diagnostic information when resources are available |
| **Feature Initialization** | Initialize non-essential features after critical path is complete |

## Browser Support

### Support Matrix

| Browser | Support Status | Version | Notes |
|---------|---|---------|-------|
| **Chrome** | ✅ Supported | 47+ | Full support from version 47 onwards |
| **Edge** | ✅ Supported | 79+ | Chromium-based Edge supports from v79 |
| **Firefox** | ✅ Supported | 55+ | Full support from version 55 onwards |
| **Safari** | ⚠️ Limited | Tech Preview | Available in Safari Technology Preview; experimental feature |
| **Opera** | ✅ Supported | 34+ | Full support from version 34 onwards |
| **iOS Safari** | ⚠️ Limited | 13.4+ | Experimental feature in WebKit (can be enabled) |
| **Android Browser** | ✅ Supported | 142+ | Full support from version 142 onwards |
| **Android Chrome** | ✅ Supported | 142+ | Full support from version 142 onwards |
| **Android Firefox** | ✅ Supported | 144+ | Full support from version 144 onwards |
| **Samsung Internet** | ✅ Supported | 5.0+ | Full support from version 5.0 onwards |
| **Opera Mobile** | ✅ Supported | 80+ | Full support from version 80 onwards |
| **Opera Mini** | ❌ Not Supported | All | No support in Opera Mini |
| **IE/IE Mobile** | ❌ Not Supported | All | No support in Internet Explorer versions |
| **Blackberry** | ❌ Not Supported | All | No support |

### Global Coverage

- **Global Support**: 82.4% of users have requestIdleCallback support
- **Known Issues**: None reported

### Experimental Support Notes

- **Firefox**: Can be enabled via the `dom.requestIdleCallback.enabled` flag (versions 53-54)
- **Safari/iOS Safari**: Can be enabled in Experimental (WebKit) Features

## API Reference

### Syntax

```javascript
// Schedule an idle callback
const callbackId = requestIdleCallback(callback, options);

// Cancel a scheduled callback
cancelIdleCallback(callbackId);
```

### Parameters

#### requestIdleCallback()

- **callback** (function): Function to execute during idle time
  - Receives an `IdleDeadline` object with:
    - `timeRemaining()`: Returns time in milliseconds until deadline
    - `didTimeout` (boolean): Whether the callback is being invoked after timeout

- **options** (object, optional):
  - `timeout` (number): Maximum time (in milliseconds) to wait before executing callback

#### cancelIdleCallback()

- **id** (number): The callback ID returned by `requestIdleCallback()`

### Return Value

- Returns a numeric ID that can be used to cancel the callback with `cancelIdleCallback()`

## Basic Examples

### Simple Idle Task

```javascript
function offloadWork() {
  requestIdleCallback((deadline) => {
    // Do non-urgent work here
    console.log('Browser is idle');
  });
}
```

### Task with Timeout

```javascript
function sendAnalytics() {
  requestIdleCallback((deadline) => {
    // Send analytics data
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }, { timeout: 2000 }); // Execute within 2 seconds
}
```

### Checking Time Remaining

```javascript
function processData(items) {
  requestIdleCallback((deadline) => {
    while (items.length > 0 && deadline.timeRemaining() > 1) {
      processItem(items.pop());
    }
  });
}
```

### Canceling a Callback

```javascript
const id = requestIdleCallback(() => {
  console.log('This might not run');
});

// Cancel before it executes
cancelIdleCallback(id);
```

## Polyfill/Shim

For browsers without native support, a shim is available:
- **Shim URL**: https://gist.github.com/paullewis/55efe5d6f05434a96c36

## Important Notes

1. **Not a Promise**: Unlike `requestAnimationFrame`, `requestIdleCallback` doesn't guarantee when the callback will execute—only that it will run during idle time.

2. **Deadline May Change**: The deadline can be influenced by user interactions or high-priority tasks.

3. **Timeout Consideration**: Using a `timeout` option can force execution but may still block if the main thread is busy.

4. **Best for Non-Critical Work**: Use for analytics, logging, prefetching, and other non-essential tasks. Don't use for critical UI updates.

5. **Check Browser Support**: Implement feature detection and fallbacks for unsupported browsers:
   ```javascript
   if ('requestIdleCallback' in window) {
     requestIdleCallback(myTask);
   } else {
     // Fallback: use setTimeout
     setTimeout(myTask, 1);
   }
   ```

## Comparison with Similar APIs

| Feature | requestIdleCallback | requestAnimationFrame | setTimeout |
|---------|---|---|---|
| **Execution Time** | Browser idle time | Before next frame | Specified delay |
| **Priority** | Low priority | High priority | Medium priority |
| **Use Case** | Non-critical work | Animations/visual updates | Delayed execution |
| **Deadline Info** | Yes | No | No |
| **Browser Support** | ~82% | 99%+ | 100% |

## Related Resources

### Official Documentation
- [MDN Web Docs - requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

### Articles & Guides
- [Google Developers - Using requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)

### Implementation Resources
- [Polyfill/Shim](https://gist.github.com/paullewis/55efe5d6f05434a96c36)

## Best Practices

1. **Prioritize User Experience**: Always ensure critical path work completes before idle tasks
2. **Use Timeouts Wisely**: Only use timeouts when necessary to avoid blocking
3. **Monitor Performance**: Verify that idle callbacks don't negatively impact performance
4. **Implement Fallbacks**: Provide alternative execution paths for unsupported browsers
5. **Batch Work**: Combine multiple idle tasks into single callbacks when possible
6. **Check Time Remaining**: Use `deadline.timeRemaining()` to avoid exceeding available idle time

## Support Summary

- **Modern Browsers**: Excellent support in Chrome, Firefox, Edge, and Opera
- **Mobile**: Good coverage on Android, Samsung Internet, and modern mobile browsers
- **Legacy**: No support in IE, older versions of Safari, or IE Mobile
- **Experimental**: Available in Safari and iOS Safari through experimental features

---

**Last Updated**: 2025
**Feature Coverage**: 82.4% of global users

