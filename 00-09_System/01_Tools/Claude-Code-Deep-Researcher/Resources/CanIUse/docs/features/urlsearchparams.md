# URLSearchParams

## Overview

The **URLSearchParams** interface defines utility methods to work with the query string of a URL. It provides a standardized way to parse, build, and manipulate URL query parameters in JavaScript applications.

## Specification Status

- **Status**: Living Standard (LS)
- **Specification**: [WHATWG URL Standard](https://url.spec.whatwg.org/#urlsearchparams)

## Category

- **JavaScript API**

## Use Cases & Benefits

URLSearchParams is essential for modern web applications that need to:

- **Parse Query Strings**: Easily extract parameters from URL query strings without manual string manipulation
- **Build Query Parameters**: Programmatically construct URL query strings with proper encoding
- **Modify Parameters**: Add, remove, or update individual query parameters without affecting others
- **Iterate Over Parameters**: Loop through all parameters using iteration methods (`entries()`, `keys()`, `values()`)
- **Handle Multiple Values**: Manage parameters with multiple values efficiently
- **Encode Parameters Properly**: Automatically handle URL encoding/decoding of parameter names and values

### Common Applications

- Search functionality (building and parsing search queries)
- Filter management in data tables and listings
- Navigation with state parameters
- API request building (especially for GET requests)
- Form data serialization

## Browser Support

### Desktop Browsers

| Browser | First Support | Status |
|---------|--------------|--------|
| **Chrome** | 49 | Full Support |
| **Firefox** | 44 | Full Support (with partial support from v29-43) |
| **Safari** | 10.1 | Full Support |
| **Edge (Chromium)** | 17 | Full Support |
| **Opera** | 36 | Full Support |
| **Internet Explorer** | None | Not Supported |

### Mobile Browsers

| Browser | First Support | Status |
|---------|--------------|--------|
| **iOS Safari** | 10.3 | Full Support |
| **Android Chrome** | 49+ | Full Support |
| **Android Firefox** | 44+ | Full Support |
| **Samsung Internet** | 5.0 | Full Support |
| **Opera Mobile** | 80 | Full Support |
| **UC Browser (Android)** | 15.5 | Full Support |
| **Opera Mini** | None | Not Supported |

### Partial Support Notice

Firefox versions 29-43 provided **partial support**, supporting only:
- `entries()` method
- `keys()` method
- `values()` method
- `for...of` iteration

Modern versions of Firefox have full support.

## Global Coverage

- **Global Usage**: 93.09%
- **With Prefix**: 0.04%
- **Not Supported**: ~6.87%

This feature has excellent global support across modern browsers, making it safe for use in most modern web applications.

## Key Methods

URLSearchParams provides several useful methods:

### Query Methods
- `get(name)` - Returns the first value of a parameter
- `getAll(name)` - Returns all values for a parameter
- `has(name)` - Checks if a parameter exists

### Modification Methods
- `append(name, value)` - Adds a new parameter
- `set(name, value)` - Sets a parameter (replaces if exists)
- `delete(name)` - Removes a parameter
- `sort()` - Sorts parameters by name

### Iteration Methods
- `entries()` - Returns an iterator of [key, value] pairs
- `keys()` - Returns an iterator of parameter names
- `values()` - Returns an iterator of parameter values
- `forEach(callback)` - Executes callback for each parameter

### Serialization
- `toString()` - Returns the serialized query string

## Code Examples

### Basic Usage

```javascript
// Create from URL
const url = new URL('https://example.com?name=John&age=30');
const params = url.searchParams;

// Access parameters
console.log(params.get('name')); // "John"
console.log(params.get('age'));  // "30"
```

### Creating URLSearchParams

```javascript
// From string
const params = new URLSearchParams('name=John&age=30');

// From object (via entries)
const params = new URLSearchParams([
  ['name', 'John'],
  ['age', '30']
]);

// Empty constructor
const params = new URLSearchParams();
params.append('name', 'John');
params.set('age', '30');
```

### Modifying Parameters

```javascript
const params = new URLSearchParams('foo=1&bar=2');

// Add parameter
params.append('baz', '3');

// Update parameter
params.set('foo', '10');

// Check existence
if (params.has('bar')) {
  console.log('bar exists');
}

// Remove parameter
params.delete('bar');

// Iterate
params.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
```

### Building URLs

```javascript
const params = new URLSearchParams();
params.append('search', 'javascript');
params.append('limit', '10');

const url = `https://api.example.com/search?${params.toString()}`;
// https://api.example.com/search?search=javascript&limit=10
```

## Polyfill Support

For projects that need to support older browsers (IE 11 and earlier), a polyfill is available:

- [core-js URLSearchParams polyfill](https://github.com/zloirock/core-js#url-and-urlsearchparams)

## Known Issues

### EdgeHTML Implementation
An implementation bug was reported for EdgeHTML (pre-Chromium Edge) browsers. This is no longer relevant as Microsoft Edge has transitioned to Chromium.

## Fallback for Older Browsers

For Internet Explorer 11 and older browsers without support:

```javascript
// Fallback implementation for parameter parsing
function getQueryParam(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
```

## Resources & References

- [MDN Web Docs - URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [Google Web Updates - Easy URL Manipulation with URLSearchParams](https://developers.google.com/web/updates/2016/01/urlsearchparams?hl=en)
- [WHATWG URL Standard Specification](https://url.spec.whatwg.org/#urlsearchparams)
- [core-js Polyfill](https://github.com/zloirock/core-js#url-and-urlsearchparams)

## Recommendations

### When to Use
- Modern web applications (90%+ browser support required)
- RESTful API client libraries
- Single Page Applications (SPAs)
- Progressive web applications

### When to Use Fallbacks
- Legacy enterprise applications supporting IE 11
- Situations where URLSearchParams is not available
- Environments with strict browser support requirements

### Best Practices
1. Always encode special characters in parameter names and values
2. Handle multiple values for the same parameter using `append()` or `getAll()`
3. Use `toString()` to serialize for URL construction
4. Leverage iteration methods for bulk operations
5. Consider URLSearchParams as part of the URL API, work with it alongside the URL constructor

---

**Last Updated**: 2025-12-13
**Feature Support**: 93.09% global usage
**Recommended For**: Production use in modern applications
