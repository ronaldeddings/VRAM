# Resource Timing API

## Overview

The Resource Timing API provides web developers with comprehensive timing information related to resources (stylesheets, images, scripts, etc.) on a document. This API enables precise measurement and analysis of network performance metrics for individual resources loaded by a webpage.

## Description

The Resource Timing API is a JavaScript interface that helps developers collect complete timing information about when resources are fetched, including DNS lookup time, TCP connection time, request time, and transfer time. This granular-level performance data is invaluable for performance analysis, optimization, and debugging network-related issues.

## Specification Status

| Property | Value |
|----------|-------|
| **Current Status** | Candidate Recommendation (CR) |
| **W3C Specification** | [Resource Timing - W3C](https://www.w3.org/TR/resource-timing/) |
| **Category** | JavaScript API |

## Categories

- **JavaScript API** - Core web platform API for performance measurement

## Benefits and Use Cases

### Performance Monitoring
- Monitor actual network performance experienced by real users
- Identify slow resources that impact page load time
- Track performance metrics over time and across regions

### Optimization Opportunities
- Pinpoint which resources have the longest load times
- Analyze DNS lookup duration and optimize DNS settings
- Measure TCP connection times and optimize server locations
- Identify opportunities for caching and compression

### Debugging
- Troubleshoot network-related performance issues
- Identify resources that are blocking page rendering
- Analyze resource loading patterns and dependencies
- Detect unexpected behavior in resource fetching

### Real User Monitoring (RUM)
- Collect performance data from actual user sessions
- Build analytics dashboards with granular performance insights
- Compare performance across different browsers and devices
- Track performance improvements after optimization

### Development and Testing
- Validate that performance optimizations are effective
- Test resource loading behavior under various network conditions
- Compare performance of different CDN configurations
- Benchmark different approaches to resource delivery

## Browser Support

### Desktop Browsers

| Browser | First Support | Latest Status |
|---------|---------------|---------------|
| **Chrome** | 25 | Full support (v146) |
| **Firefox** | 35 | Full support (v148) |
| **Safari** | 11.1 | Full support (v18.1-v18.6) |
| **Edge** | 12 | Full support (v143) |
| **Opera** | 15 | Full support (v122) |
| **Internet Explorer** | 10 | Support (IE 10-11) |

### Mobile Browsers

| Browser | First Support | Latest Status |
|---------|---------------|---------------|
| **iOS Safari** | 11.0 | Full support (v18.1-v18.5) |
| **Android Chrome** | 4.4 | Full support (v142) |
| **Android Firefox** | - | Full support (v144) |
| **Samsung Internet** | 4.0 | Full support (v29) |
| **Opera Mobile** | 80 | Full support |
| **UC Browser (Android)** | 15.5 | Full support |
| **Android UC** | 15.5 | Full support |
| **KaiOS** | 2.5 | Full support (v3.0-3.1) |

### Limited/No Support

| Browser | Status |
|---------|--------|
| **Opera Mini** | Not supported |
| **BlackBerry** | Not supported |

## Usage Statistics

- **Full Support Percentage**: 93.5% of browsers globally
- **Partial Support**: 0%
- **No Support**: ~6.5%

This API has excellent global browser coverage, making it reliable for use in production applications with minimal fallback requirements.

## API Methods

The Resource Timing API provides access to timing information through several key methods and properties:

### PerformanceResourceTiming Interface

Resources loaded by a page are accessible through the `performance` object:

```javascript
// Get timing data for all resources
const resources = performance.getEntriesByType('resource');

// Get timing data for specific resources
const images = performance.getEntriesByName('image.jpg');
```

### Key Timing Properties

Each resource timing entry includes:
- `name` - The URL of the resource
- `type` - The type of resource (fetch, xmlhttprequest, etc.)
- `startTime` - When the resource request started
- `duration` - Total time to fetch the resource
- `connectStart` - When TCP connection started
- `connectEnd` - When TCP connection ended
- `domainLookupStart` - When DNS lookup started
- `domainLookupEnd` - When DNS lookup ended
- `fetchStart` - When the browser started fetching the resource
- `requestStart` - When the browser sent the request
- `responseStart` - When the first response bytes arrived
- `responseEnd` - When the response completed

## Notes

### Important Information

1. **Sub-Features**: For newer Resource Timing APIs and specific methods, refer to the [PerformanceResourceTiming API documentation](/mdn-api_performanceresourcetiming) to see available sub-features.

2. **Firefox Implementation**: Firefox support is available but requires enabling the `dom.enable_resource_timing` flag in about:config.

3. **Safari Limitations**: Partial support in Safari 11.0 is limited to macOS 10.12 and later. Full support is available from Safari 11.1 onwards.

## Browser Compatibility Notes

### Internet Explorer
- **IE 10+**: Full support for basic Resource Timing API
- **IE 9 and earlier**: Not supported

### Firefox
- **Firefox 31-34**: No support (though can be enabled via dom.enable_resource_timing flag)
- **Firefox 35+**: Full support

### Chrome
- **Chrome 25+**: Full support

### Safari
- **Safari 11.0**: Partial support (macOS 10.12+ required)
- **Safari 11.1+**: Full support

### Mobile Browsers
- **iOS Safari**: Full support from v11.0-11.2 onwards
- **Android 4.4+**: Full support
- **Most modern mobile browsers**: Good support (Samsung Internet 4.0+, Opera Mobile 80+)

## Related Resources

### Official Links
- [W3C Resource Timing Specification](https://www.w3.org/TR/resource-timing/)
- [MDN Web Docs - Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API)

### External Resources
- [Demo](https://www.audero.it/demo/resource-timing-api-demo.html) - Interactive Resource Timing API demonstration
- [Google Developers Blog Post](https://developers.googleblog.com/2013/12/measuring-network-performance-with.html) - Measuring Network Performance with Resource Timing
- [SitePoint Article](https://www.sitepoint.com/introduction-resource-timing-api/) - Introduction to Resource Timing API

## Practical Example

```javascript
// Get all resource timing entries
function analyzeResourceTiming() {
  const resources = performance.getEntriesByType('resource');

  resources.forEach(resource => {
    console.log(`Resource: ${resource.name}`);
    console.log(`  Duration: ${resource.duration.toFixed(2)}ms`);
    console.log(`  DNS Lookup: ${(resource.domainLookupEnd - resource.domainLookupStart).toFixed(2)}ms`);
    console.log(`  TCP Connection: ${(resource.connectEnd - resource.connectStart).toFixed(2)}ms`);
    console.log(`  Response Time: ${(resource.responseEnd - resource.responseStart).toFixed(2)}ms`);
  });
}

// Send performance data to analytics service
function sendPerformanceMetrics() {
  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(r => r.duration > 1000);

  if (slowResources.length > 0) {
    fetch('/api/performance', {
      method: 'POST',
      body: JSON.stringify({
        slowResources: slowResources.map(r => ({
          name: r.name,
          duration: r.duration
        }))
      })
    });
  }
}
```

## Implementation Recommendations

### When to Use

The Resource Timing API is recommended for:

- **Production applications** requiring real user monitoring
- **Performance-critical applications** where optimization is essential
- **Service-based applications** needing to track external resource performance
- **Content delivery networks** requiring detailed timing analysis
- **Web analytics platforms** providing performance insights to developers

### Considerations

1. **Fallback**: While browser support is excellent, consider a fallback approach for older browsers
2. **Privacy**: The API respects CORS and same-origin policies to prevent information leakage
3. **Performance**: Collecting large amounts of resource timing data can impact memory usage
4. **Filtering**: Use the PerformanceObserver API for efficient, event-driven collection rather than polling

### Best Practices

- Use `PerformanceObserver` for efficient resource monitoring
- Set reasonable buffers to prevent memory overflow
- Filter and aggregate data before sending to analytics services
- Consider user privacy when collecting timing data
- Use the data to identify and address real performance issues

---

**Last Updated**: 2025
**Feature Status**: Candidate Recommendation
**Global Browser Support**: 93.5%
