# console.time and console.timeEnd

## Overview

`console.time()` and `console.timeEnd()` are JavaScript functions that provide a simple mechanism for measuring performance. `console.time()` starts a named timer on your page, and `console.timeEnd()` stops it and outputs the elapsed time in milliseconds to the console.

**Category:** JavaScript API

## Description

These functions are essential tools for developers who need to measure the execution time of operations during development and debugging. They allow you to track how long an operation takes without requiring external timing libraries or performance APIs.

## Specification

- **Status:** Living Standard (LS)
- **Specification URL:** [WHATWG Console Standard](https://console.spec.whatwg.org/#time)
- **MDN Documentation:** [Console.time() - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Console/time)

## Features

### Basic Usage

```javascript
// Start a timer
console.time('myTimer');

// ... code to measure ...

// Stop the timer and log the duration
console.timeEnd('myTimer');
// Output: myTimer: 1234.56ms
```

### Key Characteristics

- **Unique Names:** Each timer must have a unique name
- **Max Timers:** Up to 10,000 timers can run simultaneously on a single page
- **Millisecond Precision:** Output is shown in milliseconds
- **Zero-cost if Unused:** No performance impact if not called
- **Console Output:** Results are displayed in the browser's developer console

## Browser Support

### First Full Support by Browser

| Browser | First Version | Status |
|---------|---------------|--------|
| **Chrome** | 4 | ✅ Full Support |
| **Edge** | 12 | ✅ Full Support |
| **Firefox** | 10 | ✅ Full Support |
| **Internet Explorer** | 11 | ✅ Full Support |
| **Safari** | 4 | ✅ Full Support |
| **Opera** | 11.1 | ✅ Full Support |
| **iOS Safari** | 3.2 | ✅ Full Support |
| **Android Browser** | 2.1 | ✅ Full Support |
| **Opera Mobile** | 80 | ✅ Full Support |
| **Samsung Internet** | 4 | ✅ Full Support |

### Global Support Coverage

- **Global Usage:** 93.63% of users have full support
- **Partial/Unknown Support:** 0%
- **No Support:** < 1%

### Notable Support Details

- **IE/Edge:** Internet Explorer 11+ and all Edge versions support this feature
- **Mobile Browsers:** Excellent support across modern mobile browsers
- **Legacy Browsers:** Not supported in Internet Explorer 10 and earlier

## Use Cases

### Performance Debugging

Track the execution time of critical operations:

```javascript
console.time('dataProcessing');
const processedData = processLargeDataset();
console.timeEnd('dataProcessing');
```

### Function Performance Analysis

Measure function execution time during development:

```javascript
console.time('apiCall');
const response = await fetch('/api/data');
console.timeEnd('apiCall');
```

### Loop and Algorithm Analysis

Identify performance bottlenecks:

```javascript
console.time('sorting');
array.sort((a, b) => a - b);
console.timeEnd('sorting');
```

### User Experience Monitoring

Monitor real-world performance during development:

```javascript
console.time('pageRender');
renderComplexComponent();
console.timeEnd('pageRender');
```

## Benefits

1. **Simple API:** Extremely easy to use with minimal syntax
2. **No Dependencies:** Built into all modern browsers
3. **Development-Friendly:** Perfect for debugging and optimization
4. **Multiple Timers:** Can run up to 10,000 simultaneous timers
5. **Millisecond Accuracy:** Sufficient for most performance monitoring
6. **Zero Overhead:** Only affects performance when actively used

## Known Limitations

### Availability in Workers

This API is not universally available in Web Workers:
- **Firefox:** Only available from version 38 onwards in workers
- **Other Browsers:** May have limited or no support in worker contexts

If you need to measure performance in a worker, check browser support or consider using `performance.now()` as an alternative.

### Not for Production Monitoring

While useful for development, these are console APIs intended primarily for debugging:
- Output is only visible in the developer console
- Not suitable for production performance monitoring
- For production metrics, use the [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

### Timer Limits

- Maximum of 10,000 timers per page
- Same name overwrites previous timer with that name
- Calling `timeEnd()` without a corresponding `time()` logs a warning

## Alternatives and Related APIs

### Performance API

For more precise measurements and production use:

```javascript
const start = performance.now();
// ... operation ...
const duration = performance.now() - start;
console.log(`Operation took ${duration}ms`);
```

### console.timeLog() (Added Later)

Log intermediate measurements without stopping the timer:

```javascript
console.time('operation');
// ... some code ...
console.timeLog('operation'); // Logs elapsed time but continues timer
// ... more code ...
console.timeEnd('operation'); // Final elapsed time
```

### Performance Observer API

For monitoring multiple performance metrics:

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

observer.observe({ entryTypes: ['measure'] });
```

## Notes

- On mobile devices, console functionality may have different behavior. See [console-basic support](https://caniuse.com/console) for more information
- These methods are developer tools and should not be relied upon for production functionality
- Always remove or conditionally execute timing code before deploying to production to avoid console spam
- The output format may vary slightly between browsers

## Additional Resources

- [MDN: Console API](https://developer.mozilla.org/en-US/docs/Web/API/Console)
- [MDN: Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [WHATWG Console Standard](https://console.spec.whatwg.org/)
- [CanIUse: console.time](https://caniuse.com/console-time)
- [CanIUse: console-basic](https://caniuse.com/console)

---

**Last Updated:** 2025-12-13
**Feature Status:** Living Standard with excellent browser support
