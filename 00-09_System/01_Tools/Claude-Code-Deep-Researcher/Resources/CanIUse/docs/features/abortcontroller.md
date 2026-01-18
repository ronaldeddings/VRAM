# AbortController & AbortSignal

## Overview

Controller object that allows you to abort one or more DOM requests made with the Fetch API. The `AbortController` interface represents a controller object that can be used to abort one or more web requests as and when desired.

## Specification

**Status:** Living Standard
**Specification Link:** [WHATWG DOM Specification - AbortSignal](https://dom.spec.whatwg.org/#abortsignal)

## Categories

- JavaScript API

## Benefits and Use Cases

### Primary Benefits

- **Request Cancellation**: Abort fetch requests when they are no longer needed, preventing unnecessary network traffic and processing
- **Resource Management**: Free up resources by stopping long-running operations before completion
- **User Experience**: Improve responsiveness by allowing users to cancel operations (e.g., file uploads, data fetches)
- **Timeout Handling**: Implement custom timeouts for requests without relying on server-side solutions
- **Cleanup Operations**: Properly clean up event listeners and abort ongoing async operations when components unmount

### Common Use Cases

1. **Search as You Type**: Abort previous search requests when user types new query
2. **File Uploads**: Allow users to cancel ongoing file uploads
3. **Dependent Requests**: Chain requests where later requests can be canceled if earlier ones fail
4. **Component Lifecycle**: Abort fetch operations when React/Vue components unmount
5. **Navigation Cancellation**: Abort data fetching when user navigates away from a page
6. **Timeout Implementation**: Cancel requests that exceed a specified time threshold
7. **Batch Operations**: Cancel multiple related operations with a single abort signal

## Browser Support

### Summary

| Browser | First Version with Full Support |
|---------|--------------------------------|
| Chrome | 66 |
| Edge | 16 |
| Firefox | 57 |
| Safari | 12.1 |
| Opera | 53 |
| iOS Safari | 11.3+ |
| Android Chrome | Latest |
| Samsung Internet | 9.2 |

### Detailed Support Table

| Browser | Version | Support | Status |
|---------|---------|---------|--------|
| **Chrome** | 66+ | ✅ Yes | Full Support |
| **Edge** | 16+ | ✅ Yes | Full Support |
| **Firefox** | 57+ | ✅ Yes | Full Support |
| **Safari** | 12.1+ | ✅ Yes | Full Support |
| **Opera** | 53+ | ✅ Yes | Full Support |
| **iOS Safari** | 11.3+ | ✅ Yes | Full Support |
| **Android Browser** | 142+ | ✅ Yes | Recent Support |
| **Samsung Internet** | 9.2+ | ✅ Yes | Full Support |
| **Android Chrome** | Latest | ✅ Yes | Full Support |
| **Android Firefox** | 144+ | ✅ Yes | Full Support |
| **Opera Mini** | All | ❌ No | Not Supported |
| **Internet Explorer** | All | ❌ No | Not Supported |
| **BlackBerry** | All | ❌ No | Not Supported |

### Global Usage

- **Global Support**: 92.72% of users

### Important Notes

1. **Safari Issue (v11.1-12.0)**: Safari has `window.AbortController` defined in the DOM as a stub, but it does not actually abort requests. This also affects:
   - Chrome on iOS (uses WebKit)
   - Firefox on iOS (uses WebKit)

2. **Legacy Browser Support**: Internet Explorer has no support. Consider using a polyfill for older browsers if needed.

## Implementation Example

### Basic Usage

```javascript
// Create an AbortController
const controller = new AbortController();
const signal = controller.signal;

// Pass signal to fetch
fetch('/api/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request was aborted');
    } else {
      console.error('Fetch error:', error);
    }
  });

// Abort the request
setTimeout(() => {
  controller.abort();
}, 5000); // Abort after 5 seconds
```

### React Component with Cleanup

```javascript
import { useEffect, useRef } from 'react';

function SearchResults({ query }) {
  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    // Create fresh controller for each request
    controllerRef.current = new AbortController();

    fetch(`/api/search?q=${query}`, {
      signal: controllerRef.current.signal
    })
      .then(res => res.json())
      .then(data => {
        // Handle data
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
        }
      });

    // Cleanup: abort request on unmount or query change
    return () => controllerRef.current.abort();
  }, [query]);

  return <div>{/* Results */}</div>;
}
```

### Timeout Implementation

```javascript
// Helper function for fetch with timeout
function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, {
    ...options,
    signal: controller.signal
  })
    .then(response => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch(error => {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeoutMs}ms`);
      }
      throw error;
    });
}

// Usage
fetchWithTimeout('/api/data', {}, 3000)
  .then(res => res.json())
  .catch(error => console.error(error));
```

## Related Resources

- [Abortable Fetch - Google Developers](https://developers.google.com/web/updates/2017/09/abortable-fetch) - Comprehensive guide on using AbortController
- [AbortController - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) - Complete API reference
- [AbortSignal - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) - AbortSignal interface documentation

## Key API Methods and Properties

### AbortController

| Method/Property | Description |
|-----------------|-------------|
| `new AbortController()` | Constructor that creates a new controller instance |
| `controller.signal` | Returns the AbortSignal object associated with the controller |
| `controller.abort()` | Aborts all fetch requests associated with the signal |

### AbortSignal

| Property | Description |
|----------|-------------|
| `signal.aborted` | Read-only boolean indicating if abort was called |
| `signal.addEventListener('abort', callback)` | Listen for abort event |
| `signal.onabort` | Event handler for abort event |

## Known Limitations

1. **No Multiple Abort Reasons**: Some older implementations may not support abort reason parameter (added later)
2. **iOS WebKit Limitation**: Stub implementation in Safari 11.1-12.0 and iOS browsers using WebKit engine
3. **Cross-Origin Limitations**: Normal CORS restrictions still apply to fetch requests
4. **Worker Threads**: Support varies in Web Workers depending on browser version

## Migration Guide from Other Patterns

### From Simple Timeouts

```javascript
// Old way - Less efficient
let timeoutId = null;
const promise = fetch('/api/data')
  .finally(() => clearTimeout(timeoutId));
timeoutId = setTimeout(() => promise.reject(), 5000);

// New way - Using AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
fetch('/api/data', { signal: controller.signal })
  .finally(() => clearTimeout(timeoutId));
```

### From Multiple Fetch Handling

```javascript
// Old way - Tracking multiple requests
let activeRequest = null;

function newSearch(query) {
  if (activeRequest) {
    // Can't actually cancel, just ignore results
    activeRequest.ignore = true;
  }
  activeRequest = fetch(`/search?q=${query}`);
}

// New way - With AbortController
let controller = null;

function newSearch(query) {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();
  return fetch(`/search?q=${query}`, { signal: controller.signal });
}
```

## Browser Compatibility Notes

- **Evergreen Support**: Fully supported in all modern browsers
- **IE Requires Polyfill**: Use a polyfill for Internet Explorer 11
- **Consistent API**: Implementation is consistent across all supporting browsers (except Safari 11.1-12.0)
- **Performance**: Minimal overhead; aborting is nearly instant

## See Also

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Promises & Async/Await Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [XMLHttpRequest.abort()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort) - Legacy alternative for older code
