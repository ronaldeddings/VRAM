# Fetch API

## Overview

The **Fetch API** provides a modern, promise-based replacement for XMLHttpRequest. It offers a cleaner and more powerful interface for making HTTP requests and handling responses in JavaScript.

## Description

A modern replacement for XMLHttpRequest that provides a standards-based way to fetch resources asynchronously across the network. The Fetch API is built on top of Promises, making it easier to work with asynchronous operations and chain multiple requests.

## Specification Status

**Status:** Living Standard
**Specification URL:** [https://fetch.spec.whatwg.org/](https://fetch.spec.whatwg.org/)

## Categories

- JavaScript API

## Key Benefits & Use Cases

### Core Benefits

- **Promise-based**: Native Promise support eliminates callback hell
- **Modern API**: Simpler, cleaner syntax compared to XMLHttpRequest
- **Standards-based**: Part of the WHATWG Living Standard
- **Streaming support**: Built-in support for response streaming
- **Headers API**: Easy manipulation of request/response headers
- **Cleaner error handling**: Better separation of network errors from HTTP error codes

### Common Use Cases

1. **API calls**: Fetching data from REST APIs
2. **Form submissions**: Sending form data asynchronously
3. **File uploads**: Uploading files using FormData
4. **Service Workers**: Core networking API for service worker applications
5. **Real-time updates**: Polling or streaming data from servers
6. **Resource loading**: Loading images, scripts, stylesheets dynamically
7. **Cross-origin requests**: CORS-enabled data fetching

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully Supported |
| ⚠️ | Partial Support (with notes) |
| ❌ | Not Supported |

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | v42 | ✅ Fully Supported | Experimental in v40-41 |
| **Edge** | v14 | ✅ Fully Supported | All versions 14+ |
| **Firefox** | v39 | ✅ Fully Supported | Partial/experimental in v34-38 |
| **Safari** | v10.1 | ✅ Fully Supported | |
| **Opera** | v29 | ✅ Fully Supported | Experimental in v27-28 |
| **Internet Explorer** | ❌ Not Supported | ❌ No support in any version | Use polyfill |

### Mobile & Tablet Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **iOS Safari** | 10.3+ | ✅ Supported | Earlier versions (prior to 10.3) not supported |
| **Android Browser** | 4.4.3+ | ✅ Supported | |
| **Chrome (Android)** | v142+ | ✅ Supported | |
| **Firefox (Android)** | v144+ | ✅ Supported | |
| **Samsung Internet** | v4+ | ✅ Supported | All versions supported |
| **Opera Mobile** | v80+ | ✅ Supported | Earlier versions not supported |
| **Opera Mini** | All versions | ❌ Not Supported | No support |
| **UC Browser** | v15.5+ | ✅ Supported | |
| **Baidu Browser** | v13.52+ | ✅ Supported | |
| **QQ Browser** | v14.9+ | ✅ Supported | |
| **KaiOS** | v2.5+ | ✅ Supported | |
| **BlackBerry** | All versions | ❌ Not Supported | |

### Global Usage Statistics

- **Fully Supported (y):** 93.18% of global browsers
- **Partial Support (a):** 0.01% of global browsers
- **Not Supported (n):** 6.81% of global browsers

## Important Notes

### Firefox Considerations

- **Firefox 34-38**: Partial support with `dom.fetch.enabled` flag in about:config
- **Firefox 39+**: Complete support with full conformance to specification
- **Important**: Firefox versions below 40 do not properly respect the `<base>` tag for relative URIs in fetch requests (see [Bug 1161625](https://bugzilla.mozilla.org/show_bug.cgi?id=1161625))

### Chrome and Opera Limitations

- **Chrome 40-41 / Opera 27-28**: Only available within ServiceWorkers and with the "Experimental Web Platform Features" flag enabled in `chrome://flags`
- **Chrome 42+ / Opera 29+**: Available in all contexts (Window and Workers)

### Legacy Browser Support

For Internet Explorer and older browser versions, polyfills are available:

- **GitHub Fetch Polyfill** - Full-featured, standards-compliant
- **Unfetch** - Lightweight minimal implementation (~500 bytes)

## Key API Features

### Basic Syntax

```javascript
fetch(resource, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Request Methods

- `GET` - Retrieve data (default)
- `POST` - Submit data
- `PUT` - Update resources
- `DELETE` - Remove resources
- `PATCH` - Partial updates
- `HEAD` - Like GET but without response body

### Response Handling

- Response object with status codes and headers
- `.json()` - Parse response as JSON
- `.text()` - Get response as text
- `.blob()` - Get response as binary blob
- `.formData()` - Parse form data
- `.arrayBuffer()` - Get raw binary data

### Advanced Features

- **CORS support**: Built-in cross-origin request handling
- **Request/Response interceptors**: Via Service Workers
- **Request cancellation**: Via AbortController
- **Streaming responses**: Progressive data handling
- **Custom headers**: Full header manipulation
- **Request modes**: same-origin, cors, no-cors, navigate

## Recommended Migration Path

### From XMLHttpRequest to Fetch

```javascript
// Old way (XMLHttpRequest)
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data');
xhr.onload = () => console.log(xhr.responseText);
xhr.onerror = () => console.error('Error');
xhr.send();

// New way (Fetch API)
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error', error));
```

## Fallback Strategy

For projects requiring broad browser compatibility:

1. **Detect Fetch support**: Check for `window.fetch` availability
2. **Use polyfills**: Conditionally load fetch polyfills for unsupported browsers
3. **Alternative libraries**: Consider axios or jQuery.ajax for older environments
4. **Service Worker considerations**: Always provide fallback strategies for offline support

## Related Resources

### Official Documentation

- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [WHATWG Fetch Specification](https://fetch.spec.whatwg.org/)
- [Can I Use - Fetch](https://caniuse.com/fetch)

### Polyfills & Tools

- [GitHub Fetch Polyfill](https://github.com/github/fetch) - Full-featured polyfill
- [Unfetch](https://github.com/developit/unfetch) - Minimal polyfill (~500 bytes)
- [Demo](https://addyosmani.com/demos/fetch-api/) - Interactive examples

### Related Topics

- Service Workers
- XMLHttpRequest (Legacy)
- Promises
- AbortController
- CORS (Cross-Origin Resource Sharing)

## Summary

The Fetch API is the modern standard for HTTP requests in JavaScript, with excellent browser support across all major platforms (93%+ global coverage). It provides a cleaner, promise-based alternative to XMLHttpRequest and is essential for modern web development. Projects requiring support for older browsers like Internet Explorer should use the available polyfills.

---

**Last Updated:** 2025
**Data Source:** [caniuse.com](https://caniuse.com/fetch)
