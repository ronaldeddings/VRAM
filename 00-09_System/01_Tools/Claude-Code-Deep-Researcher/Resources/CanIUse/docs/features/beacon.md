# Beacon API

## Overview

The **Beacon API** provides a mechanism to asynchronously transmit HTTP requests to a server, even after the user has closed the page or navigated away. It is primarily used for logging analytics data, tracking user interactions, and sending diagnostic information when a user finishes using a web application.

## Description

The Beacon API allows data to be sent asynchronously to a server with `navigator.sendBeacon`, even after a page was closed. This is particularly useful for posting analytics data the moment a user was finished using the page, ensuring that important telemetry is captured without blocking page navigation or unload operations.

### Key Characteristics

- **Asynchronous**: Requests are sent in the background without blocking user interactions
- **Unload-Safe**: Data can be transmitted even during page unload, navigation, or tab closure
- **Low Priority**: Designed to avoid impacting user experience
- **Fire-and-Forget**: No direct callback mechanism; reliability is best-effort

## Specification

| Property | Value |
|----------|-------|
| **Status** | Candidate Recommendation (CR) |
| **Specification Link** | [W3C Beacon API](https://www.w3.org/TR/beacon/) |

## Categories

- JavaScript API

## Use Cases & Benefits

### Analytics & Telemetry
- **Session Tracking**: Record when users leave a page or session ends
- **Error Reporting**: Send crash reports and error logs asynchronously
- **Performance Metrics**: Capture timing data for analysis without blocking interaction

### User Behavior Tracking
- **Page Exit Events**: Log when users navigate away or close tabs
- **Interaction Logging**: Track clicks, scrolls, and other user actions at the moment of navigation
- **Engagement Metrics**: Record time-on-page and other engagement signals

### Data Integrity
- **Best-Effort Delivery**: Transmit critical analytics even when the page is closing
- **Reduces Data Loss**: Captures telemetry that might otherwise be lost during rapid navigation
- **Lightweight**: Minimal overhead compared to traditional XHR or fetch requests

## Browser Support Summary

| Browser | First Full Support | Current Status |
|---------|-------------------|-----------------|
| **Chrome** | 39 | Full Support ✅ |
| **Edge** | 14 | Full Support ✅ |
| **Firefox** | 31 | Full Support ✅ |
| **Safari** | 11.1 | Full Support ✅ (with caveats) |
| **Opera** | 26 | Full Support ✅ |
| **iOS Safari** | 11.3-11.4 | Full Support ✅ (with caveats) |
| **Android Chrome** | 142 | Full Support ✅ |
| **Samsung Internet** | 4 | Full Support ✅ |
| **Internet Explorer** | — | Not Supported ❌ |
| **Opera Mini** | — | Not Supported ❌ |

### Desktop Browser Adoption

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 39+ | ✅ Yes |
| Firefox | 31+ | ✅ Yes |
| Safari | 11.1+ | ✅ Yes |
| Edge | 14+ | ✅ Yes |
| Opera | 26+ | ✅ Yes |
| Internet Explorer | All | ❌ No |

### Mobile Browser Adoption

| Browser | Version | Support |
|---------|---------|---------|
| iOS Safari | 11.3+ | ✅ Yes |
| Android Chrome | 39+ | ✅ Yes |
| Android Firefox | 31+ | ✅ Yes |
| Samsung Internet | 4+ | ✅ Yes |
| Opera Mobile | 80+ | ✅ Yes |
| Opera Mini | All | ❌ No |
| UC Browser | 15.5+ | ✅ Yes |
| QQ Browser | 14.9+ | ✅ Yes |
| Baidu | 13.52+ | ✅ Yes |
| KaiOS | 2.5+ | ✅ Yes |

### Global Coverage

- **Usage Percentage (Full Support)**: 92.95%
- **Usage Percentage (Partial Support)**: 0%

## Known Issues & Bugs

### Safari on macOS & iOS (Versions 11.1 – 12.2)

**Issue**: Sending beacons in a `pagehide` event listener causes incorrect behavior.

**Status**: Fixed in iOS 12.3 and later Safari versions

**Reference**: [WebKit Bug #188329](https://bugs.webkit.org/show_bug.cgi?id=188329)

### Safari on iOS (Versions 11.1 – 12)

**Issue**: Cannot send beacons to unvisited origins (cross-origin restrictions)

**Status**: Fixed in iOS 13 and later

**Reference**: [WebKit Bug #193508](https://bugs.webkit.org/show_bug.cgi?id=193508)

### Safari on iOS (Ongoing)

**Issue**: Won't send beacons from pages that quickly redirect to another location

**Impact**: Analytics data may be lost when pages redirect rapidly before beacon delivery completes

**Workaround**: Implement a slight delay before redirecting, or use alternative tracking methods for critical analytics

**Reference**: [Control Blog: Safari Beacon Issues](https://www.ctrl.blog/entry/safari-beacon-issues.html)

## Implementation Examples

### Basic Usage

```javascript
// Send a simple beacon with form data
navigator.sendBeacon('/api/analytics', new FormData({
  event: 'page_exit',
  duration: 45000,
  timestamp: Date.now()
}));
```

### In Unload Handler

```javascript
// Log analytics when user navigates away
window.addEventListener('pagehide', (event) => {
  const data = new FormData();
  data.append('event', 'page_closed');
  data.append('session_id', sessionId);
  data.append('page_duration', Date.now() - pageStartTime);

  navigator.sendBeacon('/api/log', data);
});
```

### With JSON Data

```javascript
// Send JSON beacon (requires Blob encoding)
const json = JSON.stringify({
  event: 'error_report',
  message: error.message,
  stack: error.stack
});

const blob = new Blob([json], { type: 'application/json' });
navigator.sendBeacon('/api/errors', blob);
```

## Feature Detection

```javascript
if (navigator.sendBeacon) {
  // Beacon API is supported
  navigator.sendBeacon('/api/track', data);
} else {
  // Fallback to traditional methods
  fetch('/api/track', {
    method: 'POST',
    body: data,
    keepalive: true
  });
}
```

## Progressive Enhancement Strategy

For projects targeting older browsers, implement a fallback pattern:

```javascript
function trackAnalytics(data) {
  // Try Beacon API first
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', data);
  }
  // Fall back to fetch with keepalive
  else if (fetch) {
    fetch('/api/analytics', {
      method: 'POST',
      body: data,
      keepalive: true
    }).catch(() => {
      // Silently fail - this is best-effort
    });
  }
  // Last resort: image beacon (fallback for very old browsers)
  else {
    new Image().src = '/api/beacon?data=' + encodeURIComponent(data);
  }
}
```

## Related Resources

### Official Documentation
- [MDN Web Docs - Navigator.sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

### W3C Specifications
- [W3C Beacon API Specification](https://www.w3.org/TR/beacon/)

### Additional Resources
- [WebKit Bug Tracker - Beacon Issues](https://bugs.webkit.org/)
- [Can I Use - Beacon API](https://caniuse.com/beacon)

## Browser Matrix

### Support Status Legend
- ✅ **Yes (y)**: Full support
- ❌ **No (n)**: Not supported
- ⚠️ **Partial**: Limited or buggy support

## Notes for Developers

### When to Use Beacon API
- Sending analytics at the end of a user session
- Logging page performance metrics
- Capturing error reports
- Recording user abandonment
- Submitting form data when user navigates away

### When NOT to Use Beacon API
- When you need reliable callbacks (use Fetch/XHR instead)
- When handling large payloads (size limitations apply)
- When immediate delivery confirmation is critical
- For real-time interactive updates

### Browser Compatibility Summary

The Beacon API enjoys **excellent modern browser support** with 92.95% global usage coverage among supported browsers. The only major unsupported platforms are:
- Internet Explorer (all versions)
- Opera Mini (all versions)
- Very old mobile browsers (pre-2013)

### Performance Considerations

- Beacons are low-priority and may be queued
- The browser makes best-effort to deliver, but delivery is not guaranteed
- Some browsers may defer beacon requests until the page is fully unloaded
- Payload size should be kept reasonable (<64KB recommended)

---

**Last Updated**: 2025-12-13
**Source**: [CanIUse Database](https://caniuse.com/beacon)
