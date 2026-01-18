# Shared Web Workers

## Overview

**Shared Web Workers** is a JavaScript API that allows multiple scripts within the same origin to communicate with a single web worker instance. Unlike dedicated web workers, which are associated with a single document, shared workers can be accessed from multiple windows, tabs, or iframes simultaneously, enabling efficient resource sharing and inter-document communication patterns.

## Description

Method of allowing multiple scripts to communicate with a single web worker. Shared workers provide a way to create a persistent background worker that can be shared across multiple browser contexts, making them useful for scenarios requiring centralized computation or communication coordination.

## Specification

**Current Status:** Living Standard (ls)

- **Official Specification:** [HTML Living Standard - Shared Workers](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-introduction)

## Categories

- **JavaScript API**

## Key Benefits & Use Cases

### Benefits

- **Resource Efficiency:** Share a single worker instance across multiple document contexts instead of creating separate workers
- **Centralized Communication:** Coordinate communication and data sharing between multiple windows or tabs
- **Persistent Background Processing:** Maintain long-running computations or services accessible from multiple sources
- **Memory Optimization:** Reduce memory overhead compared to dedicated workers per document

### Use Cases

- **Real-time Collaboration:** Synchronize state across multiple tabs/windows of the same application
- **Shared Caching Layer:** Implement a shared cache that multiple windows can access and update
- **Cross-Tab Messaging:** Enable communication between different browser tabs of the same application
- **Background Services:** Maintain persistent background services (analytics, monitoring, notifications) across multiple documents
- **Computation Distribution:** Share expensive computations across multiple document contexts
- **WebSocket Management:** Maintain a single WebSocket connection shared by multiple tabs

## Browser Support

### Support Overview

| Browser | Minimum Version | Current Support | Status |
|---------|-----------------|-----------------|--------|
| Chrome | 4+ | Full support | ✅ Supported |
| Firefox | 29+ | Full support | ✅ Supported |
| Safari | 5-5.1 (partial) | 16+ | ✅ Supported (v16+) |
| Edge | 79+ | Full support | ✅ Supported |
| Opera | 10.6+ | Full support | ✅ Supported |
| iOS Safari | 5.0-6.1 (partial) | 16+ | ✅ Supported (v16+) |
| Opera Mini | All versions | No support | ❌ Not supported |
| Internet Explorer | All versions | No support | ❌ Not supported |
| Android Browser | All versions | Limited support | ⚠️ Partial support |
| Samsung Internet | Limited | No support | ❌ Not supported (v5+) |

### Detailed Browser Version Support

#### Desktop Browsers

**Chrome**
- Supported since version 4 (all versions 4+)
- Full support in all modern versions through 146+

**Firefox**
- Supported since version 29
- Full support in all versions from 29 onwards (current: 148+)

**Safari**
- Initial support in versions 5 and 5.1
- Support dropped in version 6.1 through 15.6
- Re-enabled in version 16.0 and all subsequent versions

**Edge**
- Supported since version 79
- Full support in all versions from 79 onwards (current: 143+)

**Opera**
- Supported since version 10.6
- Full support in version 11+
- All modern versions supported (current: 122+)

**Internet Explorer**
- No support in any version (5.5 through 11)

#### Mobile Browsers

**iOS Safari**
- Initial support in versions 5.0-5.1 and 6.0-6.1
- Support dropped in version 7 through 15.6
- Re-enabled in version 16.0 and all subsequent versions (current: 26.1+)

**Android Browser**
- Limited or no support in available versions

**Android Chrome**
- No support reported

**Android Firefox**
- Supported in version 144+

**Opera Mobile**
- Support varies: version 10 (unknown), 11+ (supported), 80+ (not supported)

**Opera Mini**
- Not supported in any version

**Samsung Internet**
- Supported in version 4
- No support in versions 5.0 onwards

**BlackBerry Browser**
- Supported in versions 7 and 10

**Kaios**
- Supported in versions 2.5 and 3.0-3.1

**UC Browser (Android)**
- Not supported

**Baidu Browser**
- Not supported

**QQ Browser (Android)**
- Not supported

## Global Usage Statistics

- **Full Support (Y):** 46.56% of global browser usage
- **Partial Support (A):** 0%
- **Overall Coverage:** 46.56%

> Note: These statistics represent the percentage of global browser usage that supports the feature.

## Notes

No additional implementation notes available at this time.

## Related Features

- **Parent Feature:** [Web Workers](https://caniuse.com/webworkers) - The foundation API for background threading
- **Related Feature:** Dedicated Workers - Single-document workers alternative
- **Related Feature:** Service Workers - Network-level worker for offline functionality and push notifications

## External Resources

### Articles & Tutorials

1. [Sitepoint: JavaScript Shared Web Workers (HTML5)](https://www.sitepoint.com/javascript-shared-web-workers-html5/)
   - Comprehensive guide to implementing shared workers

2. [Blog Post: Web Workers Part 3 - Shared Workers](https://greenido.wordpress.com/2011/11/03/web-workers-part-3-out-of-3-shared-wrokers/)
   - Detailed tutorial covering shared worker concepts and implementation

### MDN Documentation

- [MDN: SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)
- [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

### Official Specifications

- [WHATWG HTML Living Standard - Shared Workers Section](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-introduction)

## Implementation Considerations

### Browser Compatibility

When implementing shared workers, consider:

- **Fallback Strategies:** Provide graceful fallbacks for Safari versions before 16 and iOS Safari before 16
- **Feature Detection:** Use feature detection rather than browser detection to handle unsupported environments
- **Mobile Limitations:** Note limited support on older Android browsers and Samsung Internet
- **Desktop Availability:** Reliable in Chrome, Firefox, and Edge across all modern versions

### Best Practices

1. **Feature Detection**
   ```javascript
   if (typeof SharedWorker !== 'undefined') {
     // Use shared workers
   } else {
     // Fallback implementation
   }
   ```

2. **Communication Protocol:** Establish a clear message protocol between documents and the shared worker

3. **Resource Management:** Properly handle shared worker lifecycle and cleanup

4. **Testing:** Test across multiple tabs/windows to ensure correct shared state behavior

5. **Security:** Remember that shared workers are same-origin only

---

**Last Updated:** Based on CanIUse data as of 2025

**Keywords:** shared worker, web workers, background threads, inter-document communication, JavaScript API
