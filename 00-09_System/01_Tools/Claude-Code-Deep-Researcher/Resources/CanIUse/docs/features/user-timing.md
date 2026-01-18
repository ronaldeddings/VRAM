# User Timing API

## Overview

The **User Timing API** provides web developers with a method to measure the performance of their applications by giving them access to high-precision timestamps. This API is essential for understanding application behavior and identifying performance bottlenecks in real-world scenarios.

## Description

The User Timing API allows developers to create custom performance markers and measures throughout their application. By marking specific points in code execution and measuring the time between these marks, developers can gain detailed insights into application performance without relying on external performance monitoring tools.

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Recommended (REC) |
| **Specification** | [W3C User Timing](https://www.w3.org/TR/user-timing/) |
| **Keywords** | performance, testing, mark, measure |

## Categories

- **JavaScript API**

## Benefits & Use Cases

The User Timing API enables developers to:

- **Monitor Custom Metrics**: Track performance of specific code sections and operations
- **Identify Bottlenecks**: Pinpoint which parts of an application consume the most time
- **Debug Performance Issues**: Correlate timing measurements with other performance data
- **Test Performance**: Validate that performance optimizations are effective
- **Real User Monitoring (RUM)**: Collect performance data from actual users in production
- **Measure Complex Operations**: Track multi-step processes like data loading, rendering, and processing
- **Performance Testing**: Create performance benchmarks for continuous integration pipelines
- **User Experience Analysis**: Understand how application performance impacts user experience

## Browser Support

| Browser | Supported Version(s) | Status |
|---------|----------------------|--------|
| **Chrome** | 25+ | ✅ Full Support |
| **Edge** | 12+ | ✅ Full Support |
| **Firefox** | 38+ | ✅ Full Support |
| **Safari** | 11+ | ✅ Full Support |
| **Opera** | 15+ | ✅ Full Support |
| **Internet Explorer** | 10-11 | ✅ Partial Support (IE10-11 only) |
| **iOS Safari** | 11.0+ | ✅ Full Support |
| **Android** | 4.4+ | ✅ Full Support |
| **Samsung Internet** | 4.0+ | ✅ Full Support |
| **Opera Mobile** | 80+ | ✅ Full Support |
| **Opera Mini** | None | ❌ Not Supported |
| **BlackBerry** | None | ❌ Not Supported |

### Desktop Browser Support Summary

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| Chrome | v25 | v146+ ✅ |
| Firefox | v38 | v148+ ✅ |
| Safari | v11 | v18.5+ ✅ |
| Edge | v12 | v143+ ✅ |
| Opera | v15 | v122+ ✅ |
| IE | v10 | v11 (last version) ✅ |

### Mobile Browser Support Summary

| Platform | First Support | Current Status |
|----------|---------------|----------------|
| iOS Safari | v11.0 | v18.5+ ✅ |
| Android | v4.4 | v142+ ✅ |
| Samsung Internet | v4 | v29+ ✅ |
| Android Chrome | 142 | v142+ ✅ |
| Android Firefox | 144 | v144+ ✅ |

### Global Usage

- **Usage Coverage**: 93.5% of all web traffic has User Timing API support
- **Partial Support**: 0% (no partial implementations that need conditional use)

## Key API Methods

The User Timing API provides the following key methods:

### `performance.mark(name, options?)`
Creates a timestamp at a specific point in an application with an associated name.

### `performance.measure(name, startMark, endMark?)`
Creates a measurement between two marks with a given name.

### `performance.clearMarks(name?)`
Removes one or more marks from the performance timeline.

### `performance.clearMeasures(name?)`
Removes one or more measures from the performance timeline.

### `performance.getEntriesByName(name, type?)`
Retrieves all PerformanceEntry objects with a specific name.

## Notes

No specific compatibility issues or caveats are documented.

## Resources & References

### Articles & Tutorials
- [SitePoint: Discovering the User Timing API](https://www.sitepoint.com/discovering-user-timing-api/) - Comprehensive introduction to the User Timing API
- [HTML5Rocks: High Performance Web Applications](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/) - In-depth tutorial with practical examples

### Implementations
- [UserTiming.js Polyfill](https://github.com/nicjansma/usertiming.js) - Full-featured polyfill for older browser support
- [User Timing Polyfill Gist](https://gist.github.com/pmeenan/5902672) - Basic polyfill implementation

### Demos
- [User Timing API Demo](https://audero.it/demo/user-timing-api-demo.html) - Live demonstration of User Timing API capabilities

## Adoption Notes

The User Timing API has excellent browser support across all modern browsers, with 93.5% global coverage. This makes it a reliable choice for performance monitoring in production applications without requiring fallbacks for most use cases. Only Opera Mini and legacy BlackBerry devices lack support.

For applications requiring IE9 or earlier support, polyfills are available that provide full functionality across these older platforms.

---

**Last Updated**: December 2024
**Data Source**: CanIUse
**Specification**: [W3C User Timing Level 3](https://www.w3.org/TR/user-timing/)
