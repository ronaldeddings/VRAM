# URL API

## Overview

The **URL API** provides a standardized interface to retrieve and manipulate the various components of a URL. Instead of parsing URL strings manually with regular expressions or other string manipulation techniques, developers can create URL objects that automatically parse and provide access to individual URL components like protocol, hostname, pathname, search parameters, and hash.

## Description

The URL API allows developers to construct URL objects from URL strings and access the various parts (protocol, hostname, port, pathname, search, hash, etc.) through convenient properties. This eliminates the need for manual URL parsing and provides a consistent, standards-based approach to working with URLs in JavaScript.

## Specification Status

**Status:** Living Standard (LS)

**Specification:** [WHATWG URL Standard](https://url.spec.whatwg.org/#api)

The URL API is part of the WHATWG URL Standard, which is actively maintained and continuously evolving.

## Categories

- **JavaScript API**

## Use Cases & Benefits

The URL API is useful for a variety of scenarios:

- **URL Parsing**: Automatically parse URL strings into their component parts without regex
- **URL Manipulation**: Modify URL components and reconstruct URLs programmatically
- **Query Parameter Handling**: Work with search parameters through the `URLSearchParams` API
- **URL Validation**: Create URL objects to validate whether strings are valid URLs
- **Routing**: Extract path segments and search parameters for client-side routing
- **API Development**: Build URL objects dynamically for API calls
- **Form Processing**: Extract and manipulate query parameters from form submissions
- **Navigation**: Programmatically create and navigate to URLs with specific components

## Browser Support

| Browser | Initial Support | Current Support | Notes |
|---------|-----------------|-----------------|-------|
| **Chrome** | v32 | v146 | Full support from v32 onwards |
| **Edge** | v12 | v143 | Full support since initial release |
| **Firefox** | v26 | v148 | Full support from v26 onwards |
| **Safari** | v7.1 | v18.5+ | Full support from v7.1 onwards; v7 with limitations |
| **Opera** | v19 | v122 | Full support from v19 onwards |
| **iOS Safari** | v8 | v18.5+ | Full support from v8 onwards |
| **Android Browser** | v4.4.3+ | v142+ | Partial support in v4.4; full support from v4.4.3 |
| **Opera Mobile** | v80 | v80+ | Full support from v80 onwards |
| **Samsung Internet** | v4 | v29 | Full support from v4 onwards |
| **Internet Explorer** | — | Not Supported | Not supported in any version |
| **Opera Mini** | — | Not Supported | Not supported in any version |

### Detailed Browser Matrix

#### Desktop Browsers
- **Chrome**: Full support from v32 (2014)
- **Edge**: Full support from v12 (2015)
- **Firefox**: Full support from v26 (2013)
- **Safari**: Full support from v7.1 (2014)
- **Opera**: Full support from v19 (2013)

#### Mobile Browsers
- **iOS Safari**: Full support from v8 (2014)
- **Android Browser**: Full support from v4.4.3 (2013)
- **Opera Mobile**: Full support from v80 (2016)
- **Samsung Internet**: Full support from v4.0 (2015)
- **Android Chrome**: Full support (v142+)
- **Android Firefox**: Full support (v144+)

#### No Support
- **Internet Explorer**: All versions (5.5-11)
- **Opera Mini**: All versions
- **BlackBerry Browser**: Limited support; throws error on v10

## Browser Compatibility Notes

### Known Issues

1. **Safari 14 and below**: Safari versions 14 and earlier throw an error when the `base` parameter is `undefined` in the URL constructor. [See WebKit bug report](https://bugs.webkit.org/show_bug.cgi?id=216841)

   ```javascript
   // This throws in Safari 14 and below:
   new URL('https://example.com', undefined);

   // Workaround: Use a default value or check first
   new URL('https://example.com', null);
   // or
   new URL('https://example.com'); // without base parameter
   ```

2. **Chrome 23-31**: Objects can be created via the `URL` constructor, but instances do not have the expected URL properties.

3. **BlackBerry 10**: Limited support; throws an error similar to Safari.

## API Overview

The URL API consists primarily of the `URL` constructor and the `URL` object interface:

### URL Constructor

```javascript
new URL(url[, base])
```

- **url** (string): The URL string to parse
- **base** (optional): A base URL to resolve relative URLs against

### Common URL Properties

```javascript
const url = new URL('https://example.com:8080/path/to/page?id=123&sort=desc#section');

url.protocol    // 'https:'
url.hostname    // 'example.com'
url.port        // '8080'
url.host        // 'example.com:8080'
url.pathname    // '/path/to/page'
url.search      // '?id=123&sort=desc'
url.hash        // '#section'
url.origin      // 'https://example.com:8080'
url.href        // full URL string
```

### URLSearchParams

The `search` property works with `URLSearchParams` for easy query parameter handling:

```javascript
const url = new URL('https://example.com?id=123&sort=desc');
const params = new URLSearchParams(url.search);

params.get('id');        // '123'
params.get('sort');      // 'desc'
params.has('id');        // true
params.set('id', '456'); // modify parameter
```

## Code Examples

### Basic URL Parsing

```javascript
const url = new URL('https://user:pass@example.com:8080/path?query=value#hash');

console.log(url.protocol);   // 'https:'
console.log(url.username);   // 'user'
console.log(url.password);   // 'pass'
console.log(url.hostname);   // 'example.com'
console.log(url.port);       // '8080'
console.log(url.pathname);   // '/path'
console.log(url.search);     // '?query=value'
console.log(url.hash);       // '#hash'
```

### Modifying URL Components

```javascript
const url = new URL('https://example.com/search');

// Modify individual components
url.pathname = '/api/users';
url.search = '?page=1&limit=10';
url.hash = '#results';

console.log(url.href); // 'https://example.com/api/users?page=1&limit=10#results'
```

### Working with Query Parameters

```javascript
const url = new URL('https://example.com/search');

// Add query parameters
url.searchParams.set('q', 'javascript');
url.searchParams.set('sort', 'date');
url.searchParams.append('filter', 'tutorial');

console.log(url.search); // '?q=javascript&sort=date&filter=tutorial'

// Get query parameters
const query = url.searchParams.get('q');      // 'javascript'
const filters = url.searchParams.getAll('filter'); // ['tutorial']

// Remove parameters
url.searchParams.delete('sort');
```

### Resolving Relative URLs

```javascript
// Using a base URL to resolve relative URLs
const baseUrl = 'https://example.com/docs/api/';
const relativeUrl = '../guide/';

const resolvedUrl = new URL(relativeUrl, baseUrl);
console.log(resolvedUrl.href); // 'https://example.com/docs/guide/'
```

### URL Validation

```javascript
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

isValidUrl('https://example.com');        // true
isValidUrl('not a url');                  // false
isValidUrl('https://');                   // false
```

## Polyfills

For older browsers, a polyfill is available:

- **[core-js](https://github.com/zloirock/core-js#url-and-urlsearchparams)**: Provides polyfills for both the URL and URLSearchParams APIs

## Related Features

- **[URLSearchParams](caniuse.com/feat/urlsearchparams)**: API for working with URL search parameters
- **[Fetch API](caniuse.com/feat/fetch)**: Uses URL strings for network requests
- **[Web History API](caniuse.com/feat/history)**: Works with URL paths for browser navigation

## Resources & References

- [MDN Web Docs - URL Interface](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [MDN Web Docs - URL Constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
- [WHATWG URL Standard Specification](https://url.spec.whatwg.org/#api)
- [core-js Polyfill Library](https://github.com/zloirock/core-js#url-and-urlsearchparams)

## Summary

The URL API is widely supported across modern browsers and provides a standardized, convenient way to parse and manipulate URLs. With 93.2% global usage, it's a reliable feature for modern web development. For applications that need to support older browsers like Internet Explorer or Opera Mini, a polyfill from the core-js library can provide compatibility.
