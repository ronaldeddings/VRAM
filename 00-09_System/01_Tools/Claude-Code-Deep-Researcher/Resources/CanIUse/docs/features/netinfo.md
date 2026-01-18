# Network Information API

## Overview

The Network Information API enables web applications to access detailed information about the network connection currently in use by the device. This API provides real-time insight into connection type, speed, and latency, allowing developers to optimize application performance and user experience based on network conditions.

## Description

The Network Information API is accessed via the `navigator.connection` (or `navigator.mozConnection` in older Firefox) object and provides applications with the ability to:

- Detect the type of network connection (4g, 3g, 2g, slow-2g)
- Monitor effective connection speed (downlink)
- Track round-trip time (rtt) for latency measurement
- Respond to connection changes in real-time
- Optimize content delivery and feature availability based on network quality

This is particularly valuable for:
- **Progressive web applications** that need to adapt to varying network conditions
- **Media-heavy applications** that can adjust streaming quality dynamically
- **Service workers** that can implement intelligent caching strategies
- **Real-time applications** that must balance responsiveness with bandwidth usage

## Specification

- **Status**: Unofficial (Editor's Draft)
- **Specification URL**: [WICG Network Information API](https://wicg.github.io/netinfo/)
- **Standards Body**: Web Incubator Community Group (WICG)

The API remains in an unofficial/draft status, meaning it may still undergo significant changes before standardization. Browser vendors continue to implement it under the assumption that the specification will eventually be finalized.

## Categories

- **DOM** - Core Document Object Model integration
- **JS API** - JavaScript API for network information access

## Key Features & Use Cases

### Primary Use Cases

1. **Adaptive Content Delivery**
   - Serve lower-quality images on slow connections
   - Adjust video streaming quality in real-time
   - Defer non-critical resource loading

2. **Performance Optimization**
   - Implement connection-aware lazy loading
   - Preload resources more aggressively on fast connections
   - Adjust polling intervals based on network reliability

3. **Data Usage Management**
   - Warn users before consuming large amounts of data
   - Provide "lite" versions of applications on slow networks
   - Implement bandwidth throttling for metered connections

4. **Service Worker Strategies**
   - Implement intelligent caching based on connection type
   - Handle offline scenarios gracefully
   - Prefetch resources when high-speed connection is available

5. **User Experience Enhancement**
   - Display connection status and speed to users
   - Provide feedback during network changes
   - Enable/disable features based on connectivity

### Benefits

- **Improved User Experience**: Users on slow connections receive optimized content
- **Reduced Data Consumption**: Lower bandwidth usage on metered connections
- **Better Performance**: Applications can prioritize critical content
- **Reduced Server Load**: Smart client-side optimization reduces unnecessary requests
- **Better Offline Support**: Service workers can make smarter caching decisions
- **Enhanced Analytics**: Understand how network conditions affect user behavior

## Browser Support

### Support Legend

- **y** - Full support
- **a** - Partial support (see notes for specific limitations)
- **n** - No support

### Desktop Browsers

| Browser | Minimum Version | Status | Notes |
|---------|----------------|--------|-------|
| **Chrome** | 61+ | Partial (a) | Supports `downlink`, `effectiveType` & `rtt` values (#4) |
| **Edge** | 79+ | Partial (a) | Supports `downlink`, `effectiveType` & `rtt` values (#4) |
| **Firefox** | None | Not supported | No support in any version |
| **Safari** | None | Not supported | No support in any version |
| **Opera** | 48+ | Partial (a) | Supports `downlink`, `effectiveType` & `rtt` values (#4) |

### Mobile Browsers

| Browser | Minimum Version | Status | Notes |
|---------|----------------|--------|-------|
| **Chrome Android** | 142+ | Full (y) | Fully supported |
| **Firefox Android** | 144 | Not supported | No support |
| **Opera Mobile** | 80+ | Full (y) | Fully supported |
| **Samsung Internet** | 8.2+ | Full (y) | Fully supported (8.2+), Partial earlier versions |
| **Safari iOS** | None | Not supported | No support in any version |
| **UC Browser** | 15.5+ | Full (y) | Fully supported |
| **Android Browser** | 4.2+ | Partial (a) | Early support with limitations (2.2-4.1) |
| **Opera Mini** | All versions | Not supported | No support |
| **BlackBerry** | 7, 10 | Not supported | No support |

### Tablet/Other

| Browser | Minimum Version | Status | Notes |
|---------|----------------|--------|-------|
| **Baidu Browser** | 13.52+ | Full (y) | Fully supported |
| **QQ Browser** | 14.9+ | Full (y) | Fully supported |
| **KaiOS** | 2.5 | Partial (a) | Only supports `type` value (#2) |

## Global Coverage

- **Supported (y + a)**: ~80.19% of global browser usage
- **Full Support (y)**: ~45.78% of global browser usage
- **Partial Support (a)**: ~34.41% of global browser usage
- **Not Supported (n)**: ~19.81% of global browser usage

**Note**: Statistics based on browser usage data. Coverage varies by region and platform.

## Implementation Notes

### Partial Support Details

The API has multiple levels of implementation completeness across browsers:

#### Note #1: Early Android Implementation
Older Android browsers (2.2-4.1) support only the `navigator.connection.type` value, which doesn't match the latest specification format. This early implementation provided basic network type detection but lacks modern properties like `effectiveType` and `rtt`.

**Reference**: [Optimizing Based on Connection Speed Using navigator.connection on Android 2.2](https://www.davidbcalhoun.com/2010/optimizing-based-on-connection-speed-using-navigator.connection-on-android-2-2-/)

#### Note #2: KaiOS Limited Support
KaiOS 2.5 provides minimal support, implementing only the `type` property, which returns basic connection type information (4g, 3g, 2g, slow-2g).

#### Note #3: Samsung Internet Limited Support
Samsung Internet browsers before version 8.2 support only `type` and `downlinkMax` properties. Full support was achieved in version 8.2 and later.

#### Note #4: Modern Implementation
Chrome, Edge, Opera, and other Chromium-based browsers support `downlink` (connection speed in Mbps), `effectiveType` (connection quality: 4g, 3g, 2g, slow-2g), and `rtt` (round-trip time in milliseconds).

### Progressive Enhancement Strategy

Given partial support across browsers, implement features with progressive enhancement:

```javascript
// Check for API availability
if ('connection' in navigator) {
  const connection = navigator.connection;

  // Check for specific property support
  if ('effectiveType' in connection) {
    // Modern implementation - use effectiveType
    switch(connection.effectiveType) {
      case '4g':
        // Load high-quality content
        break;
      case '3g':
        // Load medium-quality content
        break;
      case '2g':
      case 'slow-2g':
        // Load low-quality content or show message
        break;
    }
  } else if ('type' in connection) {
    // Fallback to older type property
    // Provides basic network type detection
  }

  // Listen for connection changes
  connection.addEventListener('change', handleConnectionChange);
}
```

### Vendor Prefixes

The API uses standard `navigator.connection` in most browsers. Some older implementations may use:
- `navigator.mozConnection` (Firefox, deprecated)
- `navigator.webkitConnection` (Safari, if supported)

## Related Resources

### Reference Articles
- [Capability reporting with ServiceWorker](https://www.igvita.com/2014/12/15/capability-reporting-with-service-worker/) - Best practices for using NetInfo with Service Workers

### Official Specification
- [WICG Network Information API Specification](https://wicg.github.io/netinfo/)

### Related Web APIs
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - Use NetInfo for intelligent caching
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Combine with NetInfo for adaptive requests
- [Device Memory API](https://developer.mozilla.org/en-US/docs/Web/API/Device_Memory_API) - Complementary API for device capability detection
- [User Agent Client Hints](https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints) - Modern approach to device/browser capability detection

## Compatibility Notes

### Important Considerations

1. **No Firefox Support**: Firefox has not implemented the Network Information API. Alternative approaches needed for Firefox users.

2. **No Safari Support**: Neither desktop Safari nor iOS Safari support this API. Must provide fallbacks for Apple device users.

3. **Specification Instability**: The API remains in draft status. Properties and methods may change, and breaking changes are possible.

4. **Connection Change Events**: Not all browsers that support the API implement the `change` event reliably. Test carefully when relying on real-time connection monitoring.

5. **Privacy Considerations**: Some browsers may restrict or disable this API due to privacy concerns about exposing network information to websites.

6. **Limited Properties in Some Browsers**: Only parts of the specification are implemented in some browsers. Always feature-detect specific properties before use.

## Implementation Checklist

- [ ] Feature detect with `navigator.connection` check
- [ ] Handle missing API gracefully with fallback behavior
- [ ] Test specific property support (`effectiveType`, `rtt`, `downlink`)
- [ ] Implement change event listener with fallback
- [ ] Design content strategy for slow and fast connections
- [ ] Test on real devices, not just desktop
- [ ] Consider privacy implications of collection
- [ ] Provide user controls to override optimizations
- [ ] Monitor for specification changes
- [ ] Test cross-browser implementation thoroughly

## See Also

- [CanIUse - Network Information API](https://caniuse.com/netinfo)
- [MDN - Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
- [Chrome DevTools - Network Throttling](https://developer.chrome.com/docs/devtools/network-conditions/)
