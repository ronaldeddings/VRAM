# IndexedDB

## Overview

IndexedDB is a client-side storage API that enables web applications to store structured data locally in the browser. It provides a powerful JavaScript API for storing and retrieving large amounts of data with the ability to perform complex queries using indexes.

## Description

Method of storing data client-side, allows indexed database queries. IndexedDB is a low-level JavaScript API that provides a way to store and retrieve structured data on the client side, similar to a database management system. Unlike simpler storage mechanisms like localStorage, IndexedDB supports transactions, indexes, and queries on large datasets.

## Specification Status

- **Status**: Recommendation (REC)
- **Specification URL**: [W3C IndexedDB Specification](https://www.w3.org/TR/IndexedDB/)

## Categories

- JavaScript API

## Benefits & Use Cases

### Key Benefits

- **Large Storage Capacity**: Store significantly more data compared to localStorage or sessionStorage (typically hundreds of megabytes)
- **Indexed Queries**: Perform fast lookups and range queries using indexes
- **Transactions**: Atomic operations ensuring data integrity
- **Asynchronous Operations**: Non-blocking API using promises/callbacks to prevent UI freezing
- **Complex Data Storage**: Store objects, arrays, and structured data with type preservation
- **Offline Functionality**: Enable progressive web applications (PWAs) to work offline

### Common Use Cases

- **Progressive Web Applications (PWAs)**: Cache application data and assets for offline use
- **Data Synchronization**: Store data locally before syncing with a backend server
- **Rich Applications**: Store large datasets for desktop-like web application experiences
- **Search & Analytics**: Index and query client-side data for instant search capabilities
- **Media Applications**: Cache media files, metadata, and playlists
- **Collaborative Applications**: Store draft data and synchronization state
- **E-Commerce**: Cache product catalogs and shopping cart data

## Browser Support

### Support Legend

- **y** - Fully Supported
- **a** - Partially Supported (with known limitations)
- **p** - Supported with Prefix (requires browser-specific prefix)
- **x** - Requires enabling via flag or preference
- **n** - Not Supported

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| Chrome | 23 | ✅ Fully Supported (v24+) | Partial support (prefix) in v11-22 |
| Firefox | 10 | ✅ Fully Supported | Partial support with prefix in v4-9 |
| Safari | 10 | ✅ Fully Supported | Partial support in v7.1-9.3 |
| Edge | 79 | ✅ Fully Supported | Partial support in v12-18 |
| Opera | 15 | ✅ Fully Supported | Partial support in v10.5-12.1 |
| Internet Explorer | - | ❌ Not Supported | Partial support in IE 10-11 |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| iOS Safari | 10.0 | ✅ Fully Supported | Partial support in v7.1-9.3 |
| Android Browser | 4.4 | ✅ Fully Supported | Partial support in v2.1-4.3 |
| Android Chrome | 23 | ✅ Fully Supported | Same as desktop Chrome |
| Android Firefox | Latest | ✅ Fully Supported | Same as desktop Firefox |
| Samsung Internet | 4 | ✅ Fully Supported | |
| Opera Mobile | 80 | ✅ Fully Supported | Partial support in v11-12.1 |

### Overall Support

- **Global Support**: 93.2% of global traffic (as of latest data)
- **Modern Browsers**: Universally supported in all modern browsers
- **Legacy Support**: IE 10-11 have partial support with significant limitations

## Known Issues & Limitations

### Firefox

- **Web Worker Support**: Firefox versions prior to 37 do not support IndexedDB inside web workers
- **Private Browsing**: Firefox prior to version 115 did not support IndexedDB in private browsing mode

### Safari & iOS

- **Web Worker Support**: Safari does not support IndexedDB inside web workers
- **Previous iOS Versions**: Safari 7.1-9.3 have seriously buggy behavior and lack support in WebViews
- **iOS 14.1**: Partial support due to a bug that causes IndexedDB to not load when the browser is initially opened

### Chrome & Chromium

- **Blob Support**: Chrome 36 and below did not support Blob objects as IndexedDB values
- **iOS WebView**: Chrome 47 for iOS and below, or older iOS WebViews using UIWebView instead of WKWebView, do not support IndexedDB

### Microsoft Edge

- **Blob Web Workers**: Edge does not support IndexedDB inside blob web workers

### Internet Explorer

- **Partial Support**: IE 10 & 11 have partial support with a number of subfeatures not being supported
- **Limitations**: Cannot be relied upon for full IndexedDB functionality

## Implementation Considerations

### Feature Detection

Always check for IndexedDB support before use:

```javascript
if ('indexedDB' in window) {
  // IndexedDB is available
} else {
  // Fallback to other storage mechanisms
}
```

### Vendor Prefixes

Older browsers may require vendor prefixes:

```javascript
const IDB = window.indexedDB ||
            window.webkitIndexedDB ||
            window.mozIndexedDB ||
            window.msIndexedDB;
```

### Polyfills

For browsers supporting WebSQL, polyfills are available to provide IndexedDB compatibility.

### Private Browsing Mode

Be aware that some browsers (particularly Firefox before v115) disable IndexedDB in private browsing mode. Always provide graceful fallbacks.

## Related Resources

### Official Documentation

- [WebPlatform Docs - IndexedDB API](https://webplatform.github.io/docs/apis/indexeddb)
- [W3C IndexedDB Specification](https://www.w3.org/TR/IndexedDB/)

### Articles & Guides

- [Mozilla Hacks: Comparing IndexedDB and WebDatabase](https://hacks.mozilla.org/2010/06/comparing-indexeddb-and-webdatabase/)

### Tools & Libraries

- [IndexedDB Shim - Polyfill for browsers supporting WebSQL](https://github.com/axemclion/IndexedDBShim)
- [has.js - Native IndexedDB Feature Detection](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-indexeddb)

## See Also

- LocalStorage API
- SessionStorage API
- Web Workers
- Progressive Web Applications (PWAs)
- Service Workers
