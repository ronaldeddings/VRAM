# Service Workers

## Overview

Service Workers are a foundational web platform feature that enables applications to take advantage of persistent background processing, including hooks to enable bootstrapping of web applications while offline. They act as a proxy between your web application and the network, allowing for sophisticated offline experiences and performance optimizations.

## Description

Service Workers are JavaScript files that run in the background, separate from your main web page. They enable applications to:

- **Offline Functionality**: Cache assets and data to provide full or partial offline experiences
- **Background Processing**: Handle tasks in the background, even when the browser window is closed
- **Network Interception**: Act as a network proxy to optimize performance and implement custom offline strategies
- **Push Notifications**: Receive push messages from a server and display notifications to users
- **Performance Enhancement**: Cache strategies can dramatically improve load times and reduce bandwidth usage

This is particularly valuable for progressive web applications (PWAs) that need to work reliably across varying network conditions.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification URL**: [W3C Service Worker Specification](https://w3c.github.io/ServiceWorker/)

The specification is maintained by the W3C and is actively being refined, with widespread browser support indicating maturity and stability.

## Category

- **JavaScript API**

## Primary Benefits and Use Cases

### 1. **Offline-First Applications**
Create web applications that function seamlessly when the network is unavailable or unreliable. Users can continue using your app even in airplane mode or with poor connectivity.

### 2. **Performance Optimization**
Implement intelligent caching strategies to reduce load times significantly. Service Workers can serve cached assets instantly, reducing server requests and bandwidth usage.

### 3. **Progressive Web Applications (PWAs)**
Build installable web apps that feel like native applications with offline support, app-like navigation, and background synchronization.

### 4. **Push Notifications**
Deliver timely, engaging push notifications to users, even when your website isn't currently open in their browser.

### 5. **Background Synchronization**
Queue user actions (like form submissions) when offline and sync them with the server when connectivity is restored.

### 6. **Smart Caching Strategies**
Implement sophisticated caching patterns like:
- Cache-first for static assets
- Network-first for dynamic content
- Stale-while-revalidate for optimal performance and freshness

## Browser Support Table

| Browser | First Support | Current Status | Notes |
|---------|---------------|---|---|
| **Chrome** | 45 | ✅ Full Support | Since version 45+ |
| **Edge** | 17 | ✅ Full Support | Since version 17+ |
| **Firefox** | 44 | ✅ Full Support | From v44+; v33-43 with flag; v138+ full native support |
| **Safari** | 11.1 | ✅ Full Support | Since version 11.1+ |
| **Opera** | 32 | ✅ Full Support | Since version 32+ |
| **Safari (iOS)** | 11.3 | ✅ Full Support | iOS 11.3+ |
| **Android Browser** | 142 | ⚠️ Partial Support | Version 142 with partial support |
| **Chrome Android** | Latest | ✅ Full Support | Full support in modern versions |
| **Firefox Android** | 144 | ✅ Full Support | Version 144+ |
| **Opera Mobile** | 80 | ✅ Full Support | Version 80+ |
| **Samsung Internet** | 4.0 | ✅ Full Support | Since version 4.0+ |
| **UC Browser** | 15.5 | ✅ Full Support | Version 15.5+ |
| **Opera Mini** | All | ❌ Not Supported | Not available in any version |
| **IE / IE Mobile** | - | ❌ Not Supported | No support in any Internet Explorer version |

### Key Support Timeline

- **Desktop**: Nearly universal support across modern browsers (Chrome 45+, Safari 11.1+, Firefox 44+)
- **Mobile**: Strong support across modern mobile browsers (iOS Safari 11.3+, Android Chrome, Samsung Internet 4+)
- **Legacy Browsers**: No support in Internet Explorer or Opera Mini

### Global Support Coverage

- **Full Support (y)**: 92.4% of users
- **Partial Support (a)**: 0.48% of users
- **Combined Coverage**: 92.88% of active users

## Implementation Notes

### Browser Implementation Details

#### Firefox
- **Status (v44+)**: Fully supported
- **Status (v33-43)**: Available with the `dom.serviceWorkers.enabled` flag
- **Firefox ESR**: Disabled by default, but can be re-enabled with the `dom.serviceWorkers.enabled` flag
- **Private Browsing**: Not supported in Private Browsing mode ([see bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1320796))

#### Edge (Legacy)
- **Status (v15-16)**: Available behind the "Enable service workers" flag
- **Status (v17+)**: Fully supported

#### Chrome
- **Status (v40-44)**: Experimental support (a)
- **Status (v45+)**: Fully supported

#### Opera
- **Status (v27-31)**: Experimental support (a)
- **Status (v32+)**: Fully supported

### General Implementation Considerations

For detailed information about partial support and compatibility considerations, refer to [Is ServiceWorker Ready?](https://jakearchibald.github.io/isserviceworkerready/).

## Registration and Lifecycle

Service Workers follow a specific lifecycle:

1. **Registration**: Your app registers the Service Worker
2. **Installation**: The Service Worker installs and can cache assets
3. **Activation**: Old Service Workers are cleaned up
4. **Fetch Events**: The Service Worker intercepts network requests
5. **Termination**: The browser can terminate inactive Service Workers

## Common Use Cases

### Example: Basic Caching Strategy

```javascript
// Register the Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
```

### Example: Offline Support

Service Workers can cache essential assets during installation and serve them when offline, allowing users to access your app without network connectivity.

### Example: Push Notifications

Service Workers can receive push messages from a server and display notifications even when the browser is closed.

## Resources and References

### Official Documentation
- **[MDN Web Docs - Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker_API)**: Comprehensive reference and tutorials
- **[W3C Service Worker Specification](https://w3c.github.io/ServiceWorker/)**: Official specification document

### Learning Resources
- **[HTML5Rocks Service Worker Introduction](https://www.html5rocks.com/en/tutorials/service-worker/introduction/)**: Excellent introduction and best practices

### Compatibility Resources
- **[Is ServiceWorker Ready?](https://jakearchibald.github.io/isserviceworkerready/resources.html)**: Detailed compatibility information and browser-specific implementation details

## Recommendations

### When to Use Service Workers

✅ **Recommended For:**
- Progressive Web Applications (PWAs)
- Applications requiring offline functionality
- Performance-critical applications needing advanced caching
- Apps that send push notifications
- Applications with background sync requirements

❌ **May Not Be Necessary For:**
- Simple, non-critical web pages
- Applications with users primarily on old browsers
- Projects where standard HTTP caching is sufficient

### Fallback Strategies

For applications that need to support older browsers, consider:

1. **Graceful Degradation**: Detect Service Worker support and provide fallback experiences
2. **Progressive Enhancement**: Build core functionality without Service Workers and enhance with them when available
3. **User Notification**: Inform users of limited offline capabilities in unsupported browsers

## Migration and Compatibility Notes

- **Legacy Internet Explorer Support**: No version of IE supports Service Workers; consider alternative approaches for IE users
- **Private Browsing**: Firefox's Private Browsing mode does not support Service Workers
- **Android Browser**: Support varies; modern Chrome and Firefox on Android provide reliable support
- **Feature Detection**: Always feature-detect using `'serviceWorker' in navigator` before attempting to use Service Workers

## See Also

- [Cache API](./cache-api.md)
- [Web Workers](./webworkers.md)
- [Fetch API](./fetch.md)
- [Push API](./push-api.md)
- [Progressive Web Apps (PWA)](./pwa.md)

---

**Last Updated**: 2024
**Feature ID**: serviceworkers
**Chrome Platform Status**: [6561526227927040](https://chromestatus.com/features/6561526227927040)
