# Promises

## Overview

Promises represent the eventual result of an asynchronous operation and its resulting value. They provide a standardized way to handle asynchronous code, allowing developers to chain operations and handle success/failure cases more elegantly than traditional callback-based approaches.

## Description

A promise is an object that serves as a proxy for a value which may not be available yet, but will be resolved at some point in the future. The Promise object represents the eventual (successful or unsuccessful) result and its resulting value of an asynchronous operation.

Promises are a fundamental part of modern JavaScript and have become the basis for many other async patterns, including async/await.

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Other |
| **Spec URL** | [ECMAScript Promise Objects](https://tc39.es/ecma262/#sec-promise-objects) |
| **Category** | JavaScript (JS) |

## Categories

- **JavaScript (JS)** - Core language feature

## Benefits & Use Cases

### Key Benefits

1. **Improved Code Readability** - Promises allow for cleaner, more readable asynchronous code compared to nested callbacks
2. **Better Error Handling** - Centralized error handling through `.catch()` or `.finally()` methods
3. **Composition** - Easy chaining of asynchronous operations using `.then()`
4. **Standardization** - Native implementation across all modern browsers eliminates the need for polyfills in most cases
5. **Foundation for Modern Async** - Provides the basis for async/await syntax

### Common Use Cases

- **HTTP Requests** - Fetching data from APIs and handling responses
- **File Operations** - Reading and writing files asynchronously
- **Database Operations** - Executing queries and processing results
- **Timers & Delays** - Scheduling operations with precise timing control
- **Concurrent Operations** - Managing multiple asynchronous tasks simultaneously

### Example Usage

```javascript
// Basic promise creation
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

// Consuming a promise
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Operation complete'));

// Promise composition
Promise.all([promise1, promise2, promise3])
  .then(results => {
    // All promises resolved
  })
  .catch(error => {
    // At least one promise rejected
  });

// Async/await (built on Promises)
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
```

## Browser Support

### Support Legend

- **y** = Fully Supported
- **a** = Partial/Prefixed Support
- **p** = Requires Polyfill
- (blank) = Not Supported

### Desktop Browsers

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 33 | Polyfill required up to version 31; partial support at version 32 |
| **Firefox** | 29 | Polyfill required up to version 26; partial support at versions 27-28 |
| **Safari** | 7.1 | Polyfill required through version 7; full support from 7.1 onward |
| **Edge** | 12 | Fully supported from initial release |
| **Opera** | 20 | Polyfill required up to version 18; partial support at version 19 |
| **Internet Explorer** | Not Supported | Requires polyfill for all versions (5.5-11) |

### Mobile Browsers

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **iOS Safari** | 8 | Polyfill required through version 7.1 |
| **Android Chrome** | 4.4.3+ | Full support from Android 4.4.3 onward |
| **Android Firefox** | 144 | Modern Android Firefox versions |
| **Samsung Internet** | 4 | Fully supported |
| **UC Browser** | 15.5 | Newer versions supported |
| **Opera Mobile** | 80 | Newer versions supported |

### Deprecated/Legacy Browsers

| Browser | Support |
|---------|---------|
| **Internet Explorer** | Polyfill required (all versions) |
| **Opera Mini** | Polyfill required (all versions) |
| **BlackBerry** | Polyfill required (versions 7-10) |
| **Baidu Browser** | Full support (13.52+) |
| **KaiOS** | Full support (2.5+) |

### Support Summary Statistics

- **Full Support (y)**: 93.2% of global usage
- **Partial/Prefixed (a)**: 0% of global usage
- **Polyfill Needed (p)**: Minimal in modern development

## Technical Notes

### Important Considerations

1. **Polyfill Availability** - Multiple polyfill options available for legacy browser support
2. **Promise Implementation** - Modern implementations follow the [Promises/A+ specification](https://promisesaplus.com/)
3. **Static Methods** - JavaScript includes static helper methods:
   - `Promise.all()` - Wait for all promises
   - `Promise.race()` - First promise to settle
   - `Promise.allSettled()` - All promises settle (including rejections)
   - `Promise.any()` - First promise to fulfill
4. **Microtask Queue** - Promises use the microtask queue for execution, affecting timing
5. **Memory Considerations** - Long promise chains can consume memory; consider breaking them up for large operations

### Browser-Specific Notes

- **Internet Explorer**: Requires a polyfill like core-js or custom implementation
- **Opera**: Full support from version 20 onward; older versions need polyfills
- **Chrome**: Legacy versions (4-31) required polyfills; full support since version 33
- **Firefox**: Legacy versions required polyfills; full support since version 29

## Relevant Links

### Official Documentation & Specifications

- [ECMAScript Promise Objects Specification](https://tc39.es/ecma262/#sec-promise-objects)
- [Promises/A+ Specification](https://promisesaplus.com/)

### Learning Resources

- [JavaScript Promises: There and Back Again - HTML5 Rocks](https://www.html5rocks.com/en/tutorials/es6/promises/)
- [MDN Web Docs - Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Polyfill Options

- [A polyfill for ES6-style Promises](https://github.com/jakearchibald/ES6-Promises) by Jake Archibald
- [Polyfill for this feature available in core-js](https://github.com/zloirock/core-js#ecmascript-promise)

## Migration Guide

### From Callbacks to Promises

```javascript
// Old Callback-based approach
function fetchData(url, onSuccess, onError) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => onSuccess(xhr.responseText);
  xhr.onerror = () => onError(xhr.statusText);
  xhr.send();
}

// New Promise-based approach
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

// Modern Fetch API (Promise-based)
function fetchData(url) {
  return fetch(url).then(response => response.json());
}
```

### From Promises to Async/Await

```javascript
// Promise-based
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => {
      return fetch(`/api/posts/${user.id}`)
        .then(response => response.json())
        .then(posts => ({ user, posts }));
    })
    .catch(error => console.error('Error:', error));
}

// Async/await-based (cleaner, more readable)
async function getUserData(userId) {
  try {
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();

    const postsResponse = await fetch(`/api/posts/${user.id}`);
    const posts = await postsResponse.json();

    return { user, posts };
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Best Practices

1. **Always Chain `.catch()`** - Handle potential rejections in promise chains
2. **Use `async/await`** - For better readability when dealing with multiple sequential promises
3. **Avoid Promise Constructor Antipattern** - Don't wrap already-resolved values in new Promise()
4. **Handle Unhandled Rejections** - Listen for `unhandledrejection` events globally
5. **Use Promise.all() for Concurrent Operations** - When you need multiple promises to complete
6. **Consider Promise.race()** for Timeouts** - Implement request timeouts effectively
7. **Limit Promise Chain Depth** - Deeply nested chains become difficult to maintain
8. **Memory Management** - Clean up references in promise chains to prevent memory leaks

## Related Features

- **Async/Await** - Higher-level syntax built on Promises
- **Fetch API** - Modern HTTP client built on Promises
- **XMLHttpRequest** - Legacy HTTP API (callback-based)

---

*Last Updated: December 2024*
*Data Source: CanIUse.com*
