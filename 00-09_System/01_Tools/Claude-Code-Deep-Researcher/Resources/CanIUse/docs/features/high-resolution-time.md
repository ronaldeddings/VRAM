# High Resolution Time API

## Overview

The High Resolution Time API provides a method to obtain the current time with sub-millisecond resolution. This precision is not subject to system clock skew or adjustments, making it ideal for accurate performance measurements and timing-sensitive operations.

## Description

The High Resolution Time API is accessed through the `performance.now()` method, which returns a high-precision timestamp measured in milliseconds. Unlike `Date.now()`, which returns wall-clock time and can be adjusted by system clock synchronization, `performance.now()` provides monotonically increasing time that is ideal for measuring intervals and performance metrics.

### Key Characteristics

- **Sub-millisecond precision**: Returns values with microsecond accuracy (microseconds since navigation started)
- **Monotonic**: Values always increase or stay the same, never decrease
- **System-independent**: Not affected by system clock adjustments
- **Navigation timing reference**: Time is measured from the start of navigation in the document

## Specification Status

**Status**: Recommendation (REC)

**Official Specification**: [W3C High Resolution Time Specification](https://www.w3.org/TR/hr-time/)

The High Resolution Time API is a stable, W3C-recommended specification with widespread adoption across all major browsers.

## Categories

- JavaScript API

## Use Cases and Benefits

### Performance Measurement
- Measure the execution time of code blocks with high accuracy
- Create performance benchmarks and profiling tools
- Monitor animation frame timing and frame rate

### Testing and Benchmarking
- Build accurate performance test suites
- Compare algorithm performance with reliable metrics
- Establish performance baselines for continuous monitoring

### Real-Time Applications
- Implement precise timing for game loops and animations
- Build interactive applications requiring accurate timing
- Develop multimedia synchronization features

### Network and Load Testing
- Measure request/response times with precision
- Monitor latency in network operations
- Track resource loading performance

### Debugging and Analysis
- Profile application performance issues
- Identify performance bottlenecks
- Correlate timing with user-perceived performance

## Browser Support

### Desktop Browsers

| Browser | First Supported | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome** | 20 (with `-webkit` prefix) | ✅ Full Support | Full support from version 24+ (unprefixed) |
| **Firefox** | 15 | ✅ Full Support | With privacy considerations (see notes) |
| **Safari** | 8 | ✅ Full Support | Full support since version 8 |
| **Edge** | 12 | ✅ Full Support | Full support from initial release |
| **Internet Explorer** | 10 | ✅ Partial Support | IE 10+, limited support (IE 9 and below: not supported) |
| **Opera** | 15 | ✅ Full Support | Full support since version 15 |

### Mobile Browsers

| Browser | First Supported | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Safari iOS** | 8 | ✅ Full Support | Note: iOS 8.1-8.4 reverted support |
| **Chrome Mobile** | 20+ | ✅ Full Support | Full support on Android 4.4+ |
| **Firefox Mobile** | 15+ | ✅ Full Support | With privacy considerations |
| **Samsung Internet** | 4 | ✅ Full Support | Full support across all versions |
| **Opera Mobile** | 80+ | ✅ Full Support | Full support from version 80+ |
| **UC Browser** | 15.5 | ✅ Full Support | Full support available |
| **Android Browser** | 4.4 | ✅ Full Support | Full support on Android 4.4+ |
| **BlackBerry** | 10 | ✅ Full Support | Full support from version 10 |
| **Opera Mini** | - | ❌ No Support | Not supported |

### Global Usage

- **Supported**: 93.53% of global browser usage
- **Partial/No Support**: 0% (no partial implementations)
- **Unsupported**: 6.47% of global browser usage

## Technical Details

### Basic Usage

```javascript
// Get the current high-resolution timestamp
const startTime = performance.now();

// ... do some work ...

const endTime = performance.now();
const duration = endTime - startTime;

console.log(`Operation took ${duration} milliseconds`);
```

### Measurement Example

```javascript
function measurePerformance(callback) {
  const start = performance.now();
  callback();
  const end = performance.now();
  return end - start;
}

const duration = measurePerformance(() => {
  // Some operation to measure
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
  }
});

console.log(`Calculation took ${duration.toFixed(2)}ms`);
```

## Implementation Notes

### Security Considerations

**Privacy and Precision Reduction**

The timestamp is not truly high-resolution in all browsers. To mitigate security threats such as Spectre and side-channel attacks, browsers currently round the result to varying degrees:

- **Chrome/Edge**: Full microsecond precision
- **Firefox**: Reduced precision with options for further protection
- **Safari**: Moderate precision reduction

### Browser-Specific Notes

#### Firefox (Version 55+)
- The `privacy.resistFingerprinting` preference can be enabled to change precision to 100ms (versions 55-57)
- From version 58+, the `privacy.reduceTimerPrecision` preference is enabled by default:
  - Versions 58-59: Defaults to 20 microseconds
  - Version 60+: Defaults to 2 milliseconds
- Users can customize via `privacy.resistFingerprinting.reduceTimerPrecision.microseconds`

#### Chrome and Opera on Windows
- Older versions have only millisecond precision
- Fractional part is often near the start or end of a millisecond
- Modern versions provide full sub-millisecond precision

### Known Issues

#### Spectre/Side-Channel Vulnerability
The High Resolution Time API can be leveraged in JavaScript-based exploits that use timing measurements to detect CPU cache hits/misses. This is known as the "Spy in the Sandbox" vulnerability class.

- **References**: [Full security research paper](http://arxiv.org/abs/1502.07373)
- **Mitigation**: Browser vendors have implemented timer precision reduction to make this attack more difficult

#### Chrome/Opera Windows Precision Bug
Older versions of Chrome and Opera on Windows exhibit limited millisecond precision with the fractional part clustering at extremes.

- **Tracked Issue**: [Chromium Issue #158234](https://code.google.com/p/chromium/issues/detail?id=158234)
- **Status**: Fixed in modern versions

## Polyfill and Fallback

For environments where `performance.now()` is unavailable, a simple fallback can be implemented:

```javascript
if (!window.performance) {
  window.performance = {};
}

if (!window.performance.now) {
  window.performance.now = function() {
    return Date.now();
  };
}
```

**Note**: This fallback uses `Date.now()`, which has lower precision and may be subject to system clock adjustments.

## Related APIs

- **Performance API**: Broader API including navigation timing, resource timing, and user timing
- **performance.mark()** / **performance.measure()**: Build timing measurements on top of `performance.now()`
- **requestAnimationFrame()**: Complements high-resolution timing for animation loops
- **Date.now()**: Lower-precision alternative with system clock dependency

## Resources and References

### Official Documentation
- [MDN Web Docs - Performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance.now())

### Articles and Guides
- [Google Chrome Blog - When Milliseconds Are Not Enough: performance.now()](https://developer.chrome.com/blog/when-milliseconds-are-not-enough-performance-now/)
- [SitePoint - Discovering the High Resolution Time API](https://www.sitepoint.com/discovering-the-high-resolution-time-api/)

### Interactive Demo
- [High Resolution Time API Demo](https://audero.it/demo/high-resolution-time-api-demo.html)

### W3C Specifications
- [W3C High Resolution Time Specification](https://www.w3.org/TR/hr-time/)

## Compatibility Checklist

- ✅ Chrome 24+: Full support
- ✅ Firefox 15+: Full support (with privacy preferences available)
- ✅ Safari 8+: Full support
- ✅ Edge 12+: Full support
- ✅ Opera 15+: Full support
- ✅ Internet Explorer 10-11: Supported
- ✅ Mobile browsers: Widely supported (iOS 8+, Android 4.4+)

## Conclusion

The High Resolution Time API is a mature, widely-supported feature for high-precision timing measurements. With 93.53% global browser support, it is safe to use in production applications. For applications requiring support on older browsers or Opera Mini, implement a fallback to `Date.now()` with reduced precision expectations.

---

**Last Updated**: December 2024
**Data Source**: CanIUse Feature Database
