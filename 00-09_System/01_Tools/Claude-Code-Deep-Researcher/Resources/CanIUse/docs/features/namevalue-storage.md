# Web Storage - Name/Value Pairs

## Overview

Web Storage provides a client-side mechanism for storing name/value pairs locally in the browser, similar to cookies but with significantly larger storage capacity. This API enables persistent or session-based data storage on the client side without requiring server involvement.

## Description

Web Storage comprises two mechanisms:

- **localStorage**: Persists data indefinitely until explicitly cleared by the user or application
- **sessionStorage**: Stores data only for the duration of the page session (cleared when the tab/window is closed)

These APIs were originally part of the HTML5 specification and are now covered under the Web Storage standard. They provide a more robust alternative to cookies for storing larger amounts of data (typically 5-10 MB per origin, depending on the browser).

## Specification

**Current Status**: Living Standard
**Specification URL**: [Web Storage Living Standard](https://html.spec.whatwg.org/multipage/webstorage.html#storage)

## Categories

- JavaScript API

## Browser Support

### Support Legend
- **y** = Full support
- **p** = Partial support
- **a** = Alternate name/implementation
- **n** = No support
- **TP** = Tech Preview/Experimental

### Desktop Browsers

| Browser | Earliest Support | Current Support |
|---------|------------------|-----------------|
| **Chrome** | 4+ | Full (v4 - v146+) |
| **Edge** | 12+ | Full (v12 - v143+) |
| **Firefox** | 3.5+ | Full (v3.5 - v148+) |
| **Safari** | 4+ | Full (v4 - v18.5+) |
| **Opera** | 10.5+ | Full (v10.5 - v122+) |
| **Internet Explorer** | 8 | Full (IE 8-11) |

### Mobile Browsers

| Browser | Earliest Support | Current Support |
|---------|------------------|-----------------|
| **iOS Safari** | 3.2+ | Full (3.2 - v18.5+) |
| **Android Browser** | 2.1+ | Full (2.1+) |
| **Chrome for Android** | Current | Full (v142+) |
| **Firefox for Android** | Current | Full (v144+) |
| **Opera Mobile** | 11+ | Full (11 - 80+) |
| **Samsung Internet** | 4+ | Full (4 - v29+) |
| **UC Browser** | 15.5+ | Supported (v15.5+) |

### Other Platforms

- **BlackBerry Browser**: Supported (v7, v10)
- **Opera Mini**: Not supported (all versions)
- **IE Mobile**: Supported (IE Mobile 10-11)
- **Baidu Browser**: Supported (v13.52+)
- **QQ Browser**: Supported (v14.9+)
- **KaiOS**: Supported (v2.5+)

## Usage Statistics

- **Full Support**: 93.68%
- **Partial/Alternate Support**: 0%
- **No Support**: ~6.32%

## Benefits & Use Cases

### Common Use Cases

1. **User Preferences**: Store theme settings, language preferences, layout configurations
2. **Form Data**: Cache form inputs to provide auto-fill and recovery from page reloads
3. **Session Management**: Maintain temporary session state without server-side storage
4. **Application State**: Store application configuration and state locally
5. **Offline Support**: Enable offline functionality by caching data locally
6. **Performance**: Reduce server requests by caching frequently accessed data
7. **Multi-Tab Communication**: Coordinate data between multiple browser tabs (via storage events)

### Key Benefits

- **Larger Capacity**: Typically 5-10 MB per origin (vs. 4 KB for cookies)
- **No Server Round-trip**: Immediate local access without HTTP requests
- **Persistent Storage**: Data survives browser sessions (localStorage)
- **Easy API**: Simple key-value interface with `getItem()`, `setItem()`, `removeItem()`
- **Storage Events**: Listen for changes across tabs/windows via `storage` events
- **No Cookie Headers**: Data not automatically sent with HTTP requests

## Key Features

### localStorage

```javascript
// Store data persistently
localStorage.setItem('key', 'value');

// Retrieve data
const value = localStorage.getItem('key');

// Remove specific key
localStorage.removeItem('key');

// Clear all storage
localStorage.clear();

// Get number of stored items
const length = localStorage.length;

// Access key by index
const key = localStorage.key(0);
```

### sessionStorage

```javascript
// Store data for current session
sessionStorage.setItem('tempKey', 'tempValue');

// Data persists until tab/window closes
// Same API as localStorage
```

### Storage Events

```javascript
// Listen for storage changes from other tabs/windows
window.addEventListener('storage', (event) => {
  console.log('Storage changed:', event.key, event.newValue);
});
```

## Known Issues & Limitations

### Internet Explorer Issues

1. **IE 8-9 (Hostname-only)**: Store data based only on hostname, ignoring the scheme (http vs https) and port number as required by specification.

2. **IE File System Access**: Attempting to access localStorage on HTML files served from the file system results in `undefined` localStorage object.

3. **IE Character Support**: Does not support storing most ASCII characters with codes under 0x20.

4. **IE 10 Storage Event**: The storage event is fired even on the originating document where it occurred, causing problems with multiple windows and iframes.

5. **IE 11 Storage Event**: The storage event's `oldValue` and `newValue` are identical; `newValue` should contain the updated value.

6. **IE 11 Synchronization**: Does not properly synchronize localStorage between different windows.

7. **IE 10 Windows 8 Access Denial**: Can fail with "SCRIPT5: Access is denied" error if "integrity" settings are not set correctly.

### Safari Issues

1. **iOS 5-6 Data Clearing**: localStorage data may occasionally be cleared by the OS from its storage location.

2. **Private Browsing Mode**: Safari and iOS Safari (up to v10.x) and Android Browser do not support setting localStorage/sessionStorage in private browsing mode.

3. **Large Data Storage**: Storing large amounts of data in Safari (OSX & iOS) can freeze the browser.

### Android Issues

- Android Browser in private browsing mode does not support localStorage/sessionStorage (Chrome for Android is not affected).

## Workarounds

### Storage Event Reliability (IE 10-11)

For applications requiring reliable cross-window storage synchronization, implement a polling mechanism:

```javascript
let lastValue = localStorage.getItem('myKey');

// Regularly poll and compare value
setInterval(() => {
  const currentValue = localStorage.getItem('myKey');
  if (currentValue !== lastValue) {
    // Value changed, handle update
    lastValue = currentValue;
    handleStorageChange(currentValue);
  }
}, 100);
```

### Feature Detection

```javascript
function supportsLocalStorage() {
  try {
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function supportsSessionStorage() {
  try {
    const test = '__sessionStorage_test__';
    window.sessionStorage.setItem(test, test);
    window.sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
```

### Quota Handling

```javascript
function setItemSafely(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      // Storage quota exceeded
      console.warn('localStorage quota exceeded');
      // Implement cleanup or fallback strategy
    }
  }
}
```

## Recommendations

### When to Use Web Storage

- Storing user preferences and settings
- Caching form data temporarily
- Maintaining application state
- Storing session tokens (consider security implications)
- Implementing offline-first applications

### When NOT to Use Web Storage

- Storing sensitive information (passwords, tokens, PII)
- Sensitive data should use httpOnly cookies with proper security headers
- Do not rely solely on client-side storage for security-critical data
- Large files should consider IndexedDB instead (up to 50+ MB)

### Best Practices

1. **Always check availability**: Test support before using
2. **Handle quota errors**: Implement graceful degradation when storage is full
3. **Encrypt sensitive data**: If storing sensitive information, encrypt it first
4. **Use appropriate storage type**: sessionStorage for temporary, localStorage for persistent
5. **Clear old data**: Implement cleanup routines to manage storage size
6. **Security**: Never trust client-side storage for security-critical operations
7. **Cross-tab sync**: Implement polling for IE 10-11 if cross-window sync is critical

## Related Resources

### Official Documentation

- [MDN Web Docs - Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [WebPlatform Docs - localStorage](https://webplatform.github.io/docs/apis/web-storage/Storage/localStorage)
- [WHATWG Web Storage Specification](https://html.spec.whatwg.org/multipage/webstorage.html#storage)

### Tools & Libraries

- [Support Library](https://code.google.com/archive/p/sessionstorage/downloads)
- [has.js Feature Detection](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-localstorage;native-sessionstorage)
- [Simple Demo](https://html5demos.com/storage)

### Alternative APIs

- **IndexedDB**: For larger storage capacity (50+ MB) and complex data structures
- **Cache API**: For service worker caching strategies
- **Cookies**: For data that needs to be sent with HTTP requests
- **SessionStorage**: For temporary session-only data

## See Also

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

**Last Updated**: 2025
**Specification Status**: Living Standard
**Browser Support**: 93.68% of users (global)
