# Navigation Timing API

## Overview

The **Navigation Timing API** provides precise timing information related to page navigation and resource loading. It allows developers to measure how long various stages of page load take, from initial navigation through complete resource loading.

## Description

The Navigation Timing API is a JavaScript API that provides access to detailed timing measurements for web page navigation and performance. It exposes millisecond-accurate timestamps for various points in the page navigation and resource loading timeline, enabling developers to:

- Measure page load performance metrics
- Identify bottlenecks in the loading process
- Track performance across different browsers and network conditions
- Optimize web applications based on real-world performance data

This API is particularly useful for performance monitoring and analytics, allowing developers to gather data on how fast pages are loading for their users.

## Specification Status

**Status:** Recommendation (REC)

The Navigation Timing API has reached the W3C Recommendation stage, indicating it is a stable and widely-supported standard that browsers are committed to implementing consistently.

**Specification URL:** [W3C Navigation Timing Specification](https://www.w3.org/TR/navigation-timing/)

## Categories

- **DOM** - Document Object Model related
- **JS API** - JavaScript API

## Use Cases & Benefits

### Performance Monitoring
Monitor real-time user experience and page load performance metrics across your user base. Identify performance regressions before they impact production users.

### Load Time Analysis
Break down the page loading process into specific phases:
- DNS lookup time
- TCP connection time
- Request/response time
- DOM processing time
- Resource loading time
- Page rendering time

### Performance Optimization
Identify which specific stages of page loading are slowest and prioritize optimization efforts accordingly. Use historical data to track improvements over time.

### Analytics & Reporting
Send performance metrics to analytics services for aggregate analysis. Create performance dashboards and reports to monitor application health.

### Network Condition Testing
Understand how your application performs under different network conditions and devices. Identify performance issues specific to slow networks or older devices.

### Third-Party Script Impact
Measure the impact of third-party scripts (ads, analytics, widgets) on page load performance and identify slow external resources.

## Browser Support

| Browser | Support Status | First Version | Notes |
|---------|---|---|---|
| **Chrome** | ✅ Full | v6 (partial)* | v13+ full support without prefix |
| **Edge** | ✅ Full | v12 | Full support across all versions |
| **Firefox** | ✅ Full | v7 | Consistent support since Firefox 7 |
| **Safari** | ✅ Full | v8 | Supported from Safari 8 onwards |
| **Opera** | ✅ Full | v15 | Full support from Opera 15+ |
| **iOS Safari** | ✅ Full | 8.0 | Removed briefly in 8.1, restored in 9.0+ |
| **Android** | ✅ Full | 4.0 | Supported on Android 4.0+ browsers |
| **Samsung Internet** | ✅ Full | v4 | Supported across all versions |
| **IE** | ⚠️ Partial | 9 | IE 9-11 support available |
| **Opera Mini** | ❌ Not Supported | - | Not supported on all Opera Mini versions |

### Support Details by Browser Family

#### Desktop Browsers
- **Chrome/Chromium-based**: Full support from v6 with partial implementation (`y x`), complete from v13
- **Firefox**: Complete support from v7 onwards, including all current versions (up to v148+)
- **Safari**: Full support from v8, continues through latest versions (18.5+)
- **Edge**: Universal support across all versions from v12
- **Opera**: Full support from v15, consistent across all recent versions

#### Mobile Browsers
- **iOS Safari**: Support from v8, with a brief removal in v8.1 due to performance issues, restored in v9.0+
- **Android Browser**: Full support from v4.0 onwards
- **Samsung Internet**: Full support across all versions (v4+)
- **Opera Mobile**: Support from v80 onwards
- **Chrome Mobile**: Full support on current versions
- **Firefox Mobile**: Full support on current versions

### Legacy Browser Notes
- **Internet Explorer 9-11**: Partial to full support available
- **Opera (pre-v15)**: No support
- **iOS Safari 7.1 and earlier**: No support
- **Android 3.x and earlier**: No support

## Key Features

### Timing Attributes

The `performance.timing` object provides access to several key timing properties:

| Property | Description |
|----------|---|
| `navigationStart` | Time when navigation started |
| `fetchStart` | Time when fetch began (before any redirect) |
| `redirectStart` | Time when the first HTTP redirect started |
| `redirectEnd` | Time when the last HTTP redirect completed |
| `domainLookupStart` | Time when DNS lookup began |
| `domainLookupEnd` | Time when DNS lookup completed |
| `connectStart` | Time when TCP connection started |
| `secureConnectionStart` | Time when HTTPS negotiation started |
| `connectEnd` | Time when TCP connection completed |
| `requestStart` | Time when HTTP request was sent |
| `responseStart` | Time when first byte of response arrived |
| `responseEnd` | Time when last byte of response arrived |
| `domLoading` | Time when `document.readyState` became "loading" |
| `domInteractive` | Time when `document.readyState` became "interactive" |
| `domContentLoaded` | Time when DOMContentLoaded event fires |
| `domComplete` | Time when `document.readyState` became "complete" |
| `loadEventStart` | Time when load event started |
| `loadEventEnd` | Time when load event completed |

### Common Metrics

Calculate useful performance metrics from timing data:

```javascript
// Page load time
const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;

// DOM interactive time
const domInteractiveTime = performance.timing.domInteractive - performance.timing.navigationStart;

// Resource loading time
const resourceLoadTime = performance.timing.responseEnd - performance.timing.fetchStart;

// Time to first byte
const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
```

### Performance Navigation

The `performance.navigation` object provides information about the navigation method:

| Property | Value | Meaning |
|----------|-------|---------|
| `type` | 0 | Navigation (normal navigation) |
| `type` | 1 | Reload (page reloaded) |
| `type` | 2 | Back-forward (came from history) |
| `redirectCount` | number | Number of redirects that occurred |

## Code Examples

### Basic Usage

```javascript
// Get the performance object
const perf = performance.timing;

// Calculate page load time
const pageLoadTime = perf.loadEventEnd - perf.navigationStart;
console.log(`Page loaded in ${pageLoadTime}ms`);

// Calculate DOM ready time
const domReadyTime = perf.domContentLoaded - perf.navigationStart;
console.log(`DOM ready in ${domReadyTime}ms`);
```

### Sending Data to Analytics

```javascript
// Collect performance data
function sendPerformanceMetrics() {
  const perf = performance.timing;

  const metrics = {
    pageLoadTime: perf.loadEventEnd - perf.navigationStart,
    domInteractiveTime: perf.domInteractive - perf.navigationStart,
    resourceLoadTime: perf.responseEnd - perf.fetchStart,
    ttfb: perf.responseStart - perf.navigationStart,
    connectTime: perf.connectEnd - perf.connectStart,
    dnsTime: perf.domainLookupEnd - perf.domainLookupStart,
  };

  // Send to analytics service
  fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metrics)
  });
}

// Send data when page has fully loaded
window.addEventListener('load', sendPerformanceMetrics);
```

### Identifying Slow Resources

```javascript
// Find the slowest phase of page load
function identifySlowPhase() {
  const perf = performance.timing;

  const phases = {
    dns: perf.domainLookupEnd - perf.domainLookupStart,
    tcp: perf.connectEnd - perf.connectStart,
    ttfb: perf.responseStart - perf.requestStart,
    download: perf.responseEnd - perf.responseStart,
    dom: perf.domComplete - perf.domLoading,
  };

  const slowestPhase = Object.entries(phases)
    .sort(([,a], [,b]) => b - a)[0];

  console.log(`Slowest phase: ${slowestPhase[0]} (${slowestPhase[1]}ms)`);
}
```

## Important Notes

### iOS Safari Consideration
The Navigation Timing API was **removed in iOS Safari 8.1** due to poor performance concerns. It was restored in iOS 9.0 and remains available in current versions. If you need to support iOS 8.1, ensure proper fallback handling.

### Modern Alternative: Performance Observer API
For new projects, consider using the **Performance Observer API** and **Resource Timing API** (newer standards that build upon Navigation Timing) for more detailed and comprehensive performance metrics.

### Timing Resolution
All timing values are in milliseconds and represent the number of milliseconds elapsed since the start of navigation. Some browsers may have different timing precision (e.g., 1ms vs 100ms granularity).

### Cross-Origin Requests
Timing information for cross-origin resources may be limited due to security restrictions. Use the Resource Timing API for more detailed cross-origin timing information.

## Usage Statistics

- **Supported by:** 93.64% of global users
- **No support:** 6.36% of global users
- **Partial support:** 0% of global users

The high adoption rate indicates this is a mature, widely-available feature suitable for production use without significant fallback requirements.

## Related Resources

### Official Documentation
- [MDN Web Docs - Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API)
- [W3C Navigation Timing Specification](https://www.w3.org/TR/navigation-timing/)
- [WebPlatform Docs - Navigation Timing](https://webplatform.github.io/docs/apis/navigation_timing)

### Learning Resources
- [HTML5 Rocks - Web Performance Basics](https://www.html5rocks.com/en/tutorials/webperformance/basics/)

### Related APIs
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API)
- [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)
- [Performance Observer API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

## Browser Implementation Status

### Full Support (Recommended for Use)
All major modern browsers fully support the Navigation Timing API, making it safe to use without feature detection for most web applications targeting recent browser versions.

### Considerations for Older Browsers
If you need to support Internet Explorer 8 or earlier versions of Safari (< 8), iOS (< 8), or Android (< 4), implement feature detection:

```javascript
if (performance && performance.timing) {
  // Navigation Timing API is supported
  // Use the API
} else {
  // Fallback behavior or use alternative method
}
```

---

**Last Updated:** 2025
**Source:** CanIUse Feature Database
