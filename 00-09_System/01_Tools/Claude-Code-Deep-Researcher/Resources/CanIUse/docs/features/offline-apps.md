# Offline Web Applications (AppCache)

## Overview

**Title:** Offline Web Applications

**Status:** ⚠️ Deprecated (Unfinished Specification)

**Categories:** HTML5

## Description

Offline web applications use a cache manifest file to define which web page files should be cached locally, enabling them to function offline on subsequent visits to the page. This technology allows web applications to work without an active internet connection after an initial visit.

### What is AppCache?

AppCache (Application Cache) is an HTML5 feature that enables web developers to specify which files should be cached in the browser's local storage. Once cached, users can access the web application even when they are offline or experiencing connectivity issues.

## Current Specification Status

- **Spec Link:** [W3C Offline Web Applications Specification](https://www.w3.org/TR/2011/WD-html5-20110525/offline.html#offline)
- **Status:** Unfinished Specification (Last Draft: May 2011)
- **Deprecation Notice:** This technology is being deprecated in favor of [Service Workers](https://caniuse.com/#feat=serviceworkers)

## Benefits & Use Cases

### Use Cases
- **Progressive Web Apps:** Enabling offline functionality for web applications
- **Reduced Bandwidth:** Caching static assets to minimize network requests
- **Improved User Experience:** Fast loading times through cached resources
- **Offline-First Applications:** Building applications that work without internet connectivity

### Key Benefits
- Simple declarative syntax using manifest files
- Automatic cache management by the browser
- Support across major browsers (during its active period)
- Lower bandwidth consumption for returning visitors

## Browser Support

### Support Legend
- ✅ **y** - Supported
- ⚠️ **a** - Partial/Alternate support
- ⚠️ **p** - Partial support
- ❌ **n** - Not supported

### Desktop Browsers

| Browser | First Support | Last Support | Details |
|---------|--------------|--------------|---------|
| **Chrome** | v4 | v84 | Full support through version 84; discontinued in v85+ |
| **Firefox** | v3.5 | v83 | Full support through version 83; discontinued in v84+ |
| **Safari** | v4 | v14.1 | Full support through version 14.1; discontinued in v15+ |
| **Opera** | v10.6 | v72 | Full support through version 72; discontinued in v73+ |
| **Edge** | v12 | v84 | Full support through version 84; discontinued in v85+ |
| **Internet Explorer** | v6-8 (partial) | v11 | Partial support in IE 6-8; full support in IE 10-11 |

### Mobile Browsers

| Browser | Support Status |
|---------|----------------|
| **iOS Safari** | v3.2 - v14.8 (Supported); v15+ (Discontinued) |
| **Android** | v2.1 - v4.4.3 (Supported); v14.2+ (Discontinued) |
| **Opera Mobile** | v11 - v12.1 (Supported); v80+ (Discontinued) |
| **Chrome Mobile** | v4+ through recent versions, following desktop Chrome timeline |
| **Samsung Internet** | v4 - v29 (Supported) |
| **UC Browser** | v15.5 (Supported) |
| **Opera Mini** | Not supported (all versions) |
| **Baidu Browser** | Not supported |
| **KaiOS** | v2.5 (Supported); v3.0+ (Discontinued) |

### Detailed Browser Version Support

#### Chrome
- **Supported:** Versions 4-84
- **Discontinued:** Version 85 and later

#### Firefox
- **Partial:** Version 2 (partial), Version 3 (alternate/partial)
- **Full:** Versions 3.5-83
- **Discontinued:** Version 84 and later
- **Note:** Firefox is the last major browser to fully support AppCache

#### Safari
- **Partial:** Versions 3.1-3.2
- **Full:** Versions 4-14.1
- **Discontinued:** Version 15 and later

#### Opera
- **Partial:** Versions 10.0-10.5
- **Full:** Versions 10.6-72
- **Discontinued:** Version 73 and later

#### Internet Explorer
- **Not Supported:** Versions 5.5, 7, 9
- **Partial:** Versions 6, 8
- **Full:** Versions 10, 11

#### Edge
- **Full:** Versions 12-84
- **Discontinued:** Version 85 and later

## Known Issues & Bugs

### Critical Issues

1. **IE 10 FALLBACK Section Bug**
   - Internet Explorer 10 does not properly handle the AppCache `FALLBACK` section
   - Only handles subresources if they are already present in the cache
   - Impact: Offline fallback functionality may not work as expected

2. **Chrome on Linux Support**
   - Currently not supported in some versions of Chrome on Linux
   - Platform-specific limitation

3. **Android 4.4 WebView Cache Loss**
   - Android 4.4 WebViews lose the cache after closing the application
   - Impact: Users must revisit the site to rebuild the cache on each session

4. **Firefox `prefer-online` Setting**
   - Only Firefox (and Opera 12) support the `prefer-online` option under the `SETTINGS` section
   - Limited browser support for this specific feature

## Migration Guide

### Transition from AppCache to Service Workers

Since AppCache is deprecated, developers should migrate to **Service Workers** for offline functionality. Key advantages of Service Workers:

- ✅ More granular control over caching strategies
- ✅ Better error handling and recovery
- ✅ Programmatic cache management
- ✅ Support for advanced patterns like network-first or cache-first strategies
- ✅ Active development and continued browser support

### Migration Steps

1. Remove AppCache manifest references from HTML
2. Create a Service Worker file
3. Register the Service Worker in your application
4. Implement caching strategies using Cache API
5. Test offline functionality

## Code Examples

### AppCache Manifest (Legacy)

```manifest
CACHE MANIFEST
# Version 1.0

CACHE:
index.html
style.css
script.js
image.png

NETWORK:
api/

FALLBACK:
offline.html
```

### HTML Usage (Legacy)

```html
<!DOCTYPE html>
<html manifest="manifest.appcache">
  <head>
    <title>Offline App</title>
  </head>
  <body>
    <h1>My Offline Application</h1>
  </body>
</html>
```

### Service Worker Alternative (Recommended)

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.log('Service Worker registration failed: ', err);
  });
}
```

```javascript
// sw.js - Service Worker file
const CACHE_NAME = 'v1';
const urls = ['/', '/index.html', '/style.css', '/script.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urls))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

## Notes

### Deprecation Status

- **Current Status:** Deprecated and being phased out across all major browsers
- **Timeline:** Most browsers have discontinued support starting 2020-2021
- **Recommendation:** Use Service Workers for new projects

### Usage Statistics

- **Current Usage:** ~3.9% of websites (mostly legacy applications)
- **Trend:** Declining as developers migrate to Service Workers

## Related Resources

### Official Documentation & Tutorials

1. **Sitepoint Tutorial**
   - URL: https://www.sitepoint.com/offline-web-application-tutorial/
   - Description: Comprehensive tutorial on implementing offline web applications

2. **Dive Into HTML5 Article**
   - URL: http://diveintohtml5.info/offline.html
   - Description: In-depth article with practical examples

3. **Mozilla Hacks Article & Demo**
   - URL: https://hacks.mozilla.org/2010/01/offline-web-applications/
   - Description: Mozilla's explanation with interactive demonstrations

4. **WebPlatform Docs**
   - URL: https://webplatform.github.io/docs/apis/appcache/ApplicationCache
   - Description: Complete API reference documentation

### Related Technologies

- **Service Workers** - Recommended replacement with modern offline capabilities
- **Cache API** - Programmatic cache management for Service Workers
- **IndexedDB** - Client-side database for offline data storage
- **Local Storage** - Simple key-value storage for offline data

## Metadata

| Property | Value |
|----------|-------|
| **Chrome ID** | 6192449487634432 |
| **Keywords** | appcache, applicationcache, app cache, application cache, online |
| **Usage %** | 3.9% (declining) |
| **Prefix Required** | No |

## Summary

Offline Web Applications (AppCache) is a deprecated HTML5 feature that provided a straightforward way to enable offline functionality for web applications. While it achieved widespread browser support historically, it has been superseded by the more flexible and powerful Service Workers API.

### Key Takeaways

- **Deprecated:** No longer recommended for new projects
- **Browser Support:** Available in major browsers through 2019-2021, now discontinued
- **Migration Path:** Migrate to Service Workers for modern offline functionality
- **Legacy Support:** Still supported for legacy applications but should be phased out

For modern web applications requiring offline functionality, **Service Workers** is the recommended approach, offering superior control, better error handling, and active ongoing development.
