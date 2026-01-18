# Server Timing

## Overview

**Server Timing** is a mechanism for web developers to annotate network requests with server timing information. This API allows servers to communicate performance metrics back to clients, enabling developers to analyze how much time was spent in different phases of server-side processing.

## Specification Status

- **Status**: Working Draft (WD)
- **W3C Specification**: [Server Timing Specification](https://www.w3.org/TR/server-timing/)
- **MDN Documentation**: [PerformanceServerTiming API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceServerTiming)

## Categories

- **JavaScript API**

## Use Cases & Benefits

### Performance Monitoring
- Track server-side processing time across different components
- Identify performance bottlenecks in application logic
- Monitor database query execution times
- Measure cache efficiency and hit rates

### Performance Analysis
- Complete end-to-end performance visibility from client to server
- Compare client-side and server-side timing metrics
- Analyze the complete request lifecycle
- Identify opportunities for optimization

### Developer Experience
- Integrate server timing data into browser DevTools
- Display server metrics alongside client-side Performance API data
- Enable more informed debugging and optimization decisions
- Provide actionable performance insights to teams

### Production Monitoring
- Expose real-world performance characteristics
- Monitor performance in production environments
- Track performance metrics across different deployment regions
- Support performance budgeting and alerting

## Browser Support

### Legend
- **✅ Yes** (y) - Feature is fully supported
- **⚠️ Partial** (a) - Feature has partial support or limitations
- **❌ No** (n) - Feature is not supported

### Desktop Browsers

| Browser | First Support | Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 65 | ✅ Yes | Chrome 60-63: Behind experimental flag; Chrome 64: Current API behind experimental flag |
| **Edge** | 79 | ✅ Yes | Full support from Edge 79+ |
| **Firefox** | 61 | ✅ Yes | Secure contexts only |
| **Safari** | 16.4 | ✅ Yes | Safari 12.1+: Supports reporting in Web Inspector Network tab, but not the JavaScript API |
| **Opera** | 52 | ✅ Yes | Full support from Opera 52+ |

### Mobile Browsers

| Platform | Browser | First Support | Status |
|----------|---------|---|---|
| **iOS Safari** | Safari | 16.4 | ✅ Yes |
| **Android Chrome** | Chrome | Latest | ✅ Yes |
| **Android Firefox** | Firefox | 144+ | ✅ Yes |
| **Opera Mobile** | Opera | 80 | ✅ Yes |
| **Opera Mini** | All versions | — | ❌ No |
| **Android WebView** | Default | 142+ | ✅ Yes |
| **Samsung Internet** | Latest | — | ❌ No (as of v29) |
| **UC Browser** | 15.5+ | 15.5+ | ✅ Yes |
| **QQ Browser** | 14.9+ | 14.9+ | ✅ Yes |
| **Baidu Browser** | 13.52+ | 13.52+ | ✅ Yes |
| **KaiOS** | 3.0+ | 3.0+ | ✅ Yes |
| **BlackBerry** | All versions | — | ❌ No |
| **Internet Explorer Mobile** | All versions | — | ❌ No |

### Legacy Desktop

- **Internet Explorer**: ❌ Not supported (all versions)
- **Legacy Edge**: ❌ Not supported (versions 12-18)

## Implementation Notes

### Firefox Limitation
Firefox supports Server-Timing **in secure contexts only** (HTTPS). The feature is not available in non-secure HTTP contexts.

### Safari Implementation
Safari version 12.1 and later includes support for Server Timing reporting in the Web Inspector Network tab within the browser's developer tools. However, the JavaScript API (`PerformanceServerTiming`) is not available - developers cannot programmatically access server timing data. Full support including the JavaScript API is available from Safari 16.4+.

### Chrome Experimental Flag
Early versions of Chrome (60-63) required enabling the "Experimental Web Platform features" flag at `chrome://flags/#enable-experimental-web-platform-features` to use an older version of the API. Chrome 64 required the same flag for the current API implementation. From Chrome 65 onwards, the feature is enabled by default.

## Related Resources

- **[Server Timing Demo](https://server-timing.netlify.com/)** - Interactive demonstration of Server Timing API
- **[Completing Performance Analysis with Server Timing](https://developer.akamai.com/blog/2017/06/07/completing-performance-analysis-server-timing/)** - Akamai blog post on Server Timing implementation
- **[MDN: PerformanceServerTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceServerTiming)** - Complete API documentation

## Global Usage Statistics

- **Full Support (y)**: 89.97%
- **Partial Support (a)**: 0.21%
- **No Support (n)**: 9.82%

## Keywords

`performance`, `performance.timing`, `resource`, `performancenavigation`, `PerformanceServerTiming`

---

*Last updated: December 2025 | Based on CanIUse data*
