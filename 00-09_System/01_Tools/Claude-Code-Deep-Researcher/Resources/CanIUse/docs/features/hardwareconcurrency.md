# navigator.hardwareConcurrency

## Overview

`navigator.hardwareConcurrency` is a Web API that returns the number of logical processor cores available on the user's device. This property enables JavaScript applications to detect the computational capacity of the system and optimize workload distribution accordingly.

## Description

Returns the number of logical cores of the user's CPU. The value may be reduced to prevent device fingerprinting or because it exceeds the allowed number of simultaneous web workers.

The property exposes the CPU core count as a positive integer, allowing developers to make informed decisions about parallel processing, worker thread allocation, and task distribution strategies.

## Specification Status

**Status:** Living Standard (ls)

**Official Specification:** [HTML Standard - navigator.hardwareConcurrency](https://html.spec.whatwg.org/multipage/workers.html#navigator.hardwareconcurrency)

The API is part of the WHATWG HTML specification and continues to evolve as part of the living standard.

## Categories

- **JavaScript API**

## Use Cases & Benefits

### Primary Use Cases

1. **Worker Thread Optimization**
   - Determine optimal number of Web Workers to spawn
   - Match worker pool size to CPU core availability
   - Avoid resource exhaustion through smart parallelization

2. **Task Distribution**
   - Distribute computationally expensive tasks across cores
   - Implement efficient load balancing strategies
   - Optimize performance on multi-core systems

3. **Dynamic Workload Scaling**
   - Scale batch processing operations based on available cores
   - Adjust algorithm complexity for system capabilities
   - Improve application responsiveness on low-end devices

4. **Performance Optimization**
   - Detect and leverage modern multi-core processors
   - Avoid performance degradation on single-core devices
   - Implement CPU-aware caching strategies

5. **Capability Detection**
   - Identify system computational capacity
   - Choose appropriate algorithms for available resources
   - Provide fallback implementations for low-core systems

### Development Scenarios

- Data processing applications (image processing, video encoding)
- Scientific computing and heavy mathematical computations
- Real-time data analysis and visualization
- Machine learning inference in the browser
- Game engine physics and AI calculations
- Cryptographic operations and security algorithms

## Browser Support

### Support Status Legend

- **✅ Supported (y):** Full support for the feature
- **❌ Not Supported (n):** Feature not available
- **⚠️ Disabled by Default (d):** Feature requires manual enablement
- **#1, #2:** See notes section for additional information

### Desktop Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 37 | 146+ | Full support from v37 onwards |
| **Edge** | 15 | 143+ | Full support from v15 onwards |
| **Firefox** | 48 | 148+ | Full support from v48 onwards |
| **Safari** | 10.1 | 18.5+ | Limited support with clamping; see notes |
| **Opera** | 24 | 122+ | Full support from v24 onwards |

### Mobile Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome for Android** | 37 | 142+ | Full support from v37 onwards |
| **Firefox for Android** | 48 | 144+ | Full support from v48 onwards |
| **Samsung Internet** | 4 | 29+ | Full support from v4 onwards |
| **Safari on iOS** | 10.3 | 18.5+ | Limited support with clamping; see notes |
| **Opera Mobile** | 80+ | Current | Support from v80 onwards |

### Legacy Browsers

| Browser | Support |
|---------|---------|
| **Internet Explorer** (5.5-11) | ❌ Not supported |
| **Opera Mini** | ❌ Not supported |
| **BlackBerry** | ❌ Not supported |
| **Internet Explorer Mobile** | ❌ Not supported |

### Regional Browser Support

| Browser | Support | Version |
|---------|---------|---------|
| **UC Browser (Android)** | ✅ | 15.5+ |
| **QQ Browser (Android)** | ✅ | 14.9+ |
| **Baidu Browser** | ✅ | 13.52+ |
| **KaiOS** | ✅ | 2.5+ |

## Implementation Notes

### Important Privacy & Security Considerations

#### Note #1: WebKit Clamping (Safari 8-10.1, iOS Safari 8-10.2)

> WebKit browsers clamp the maximum value returned to 2 on iOS devices and 8 on all others. Disabled in Safari behind the ENABLE_NAVIGATOR_HWCONCURRENCY build option.

**Impact:**
- Safari versions 8 through 10.1 limit the reported core count
- iOS devices return a maximum of 2 cores, regardless of actual hardware
- Non-iOS WebKit devices return a maximum of 8 cores
- Feature must be explicitly enabled in WebKit configuration

**Development Guidance:**
- Test with these clamped values to ensure proper fallback behavior
- Consider the limited core count when optimizing for WebKit browsers
- Verify behavior across different Safari versions and iOS releases

#### Note #2: Safari Core Clamping (Safari 10.1+, iOS Safari 15.4+)

> Safari clamps this property to 4 or 8 cores, to prevent device fingerprinting.

**Impact:**
- Modern Safari versions intentionally limit reported core counts
- Values are clamped to prevent accurate device identification
- Protects user privacy by reducing fingerprinting surface area
- Applies across both desktop and iOS Safari versions

**Development Guidance:**
- Design algorithms that perform well with 4-8 core assumptions
- Don't rely on precise core count detection for security-sensitive logic
- Use the API for optimization, not as a fingerprinting vector

### Browser Compatibility Summary

**Universal Support (90%+ Global Coverage):**
- Chrome/Edge: v37+/v15+ (Chromium)
- Firefox: v48+
- Safari: v10.1+ (with privacy considerations)
- Opera: v24+

**No Support:**
- Internet Explorer (all versions)
- Opera Mini
- Legacy mobile browsers (BlackBerry, Windows Phone)

### Feature Detection Pattern

```javascript
if (navigator.hardwareConcurrency !== undefined) {
  const cores = navigator.hardwareConcurrency;
  console.log(`Available logical cores: ${cores}`);
} else {
  console.warn('hardwareConcurrency not supported');
  // Fallback implementation
}
```

## Global Usage Statistics

- **Y (Supported):** 92.71% of global browser usage
- **A (Partial/Unknown):** 0% of global browser usage

## Related Specifications & Resources

### Official Documentation

- **[MDN Web Docs - navigator.hardwareConcurrency](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency)**
  - Comprehensive documentation with examples
  - Browser compatibility matrix
  - Practical implementation guidance

### Specifications & Proposals

- **[Original WHATWG Proposal](https://wiki.whatwg.org/wiki/Navigator_HW_Concurrency)**
  - Original feature proposal and design discussions
  - Rationale for API design decisions

### Implementation References

- **[WebKit Implementation Bug](https://bugs.webkit.org/show_bug.cgi?id=132588)**
  - Original WebKit implementation tracker
  - Technical details of Safari support

- **[WebKit Reinstatement Bug](https://bugs.webkit.org/show_bug.cgi?id=233381)**
  - Later improvements and reinstatement of functionality
  - Evolution of Safari support

## Code Examples

### Basic Usage

```javascript
const cores = navigator.hardwareConcurrency || 1;
console.log(`System has ${cores} logical cores`);
```

### Worker Pool Optimization

```javascript
function createWorkerPool() {
  const coreCount = navigator.hardwareConcurrency || navigator.cpuCount || 1;
  const workerCount = Math.max(1, coreCount - 1); // Reserve one core for main thread

  const workers = [];
  for (let i = 0; i < workerCount; i++) {
    workers.push(new Worker('worker.js'));
  }

  return workers;
}
```

### Task Distribution

```javascript
async function processDataInParallel(data) {
  const coreCount = navigator.hardwareConcurrency || 4;
  const chunkSize = Math.ceil(data.length / coreCount);

  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  // Distribute chunks to worker pool
  return distributeToWorkers(chunks);
}
```

### Graceful Degradation

```javascript
function initializeComputeEngine() {
  const cores = navigator.hardwareConcurrency;

  if (!cores) {
    console.warn('hardwareConcurrency not available, using single-threaded mode');
    return initializeSingleThreaded();
  }

  if (cores < 2) {
    console.info('Single-core system detected');
    return initializeSingleThreaded();
  }

  return initializeMultiThreaded(cores);
}
```

## Browser-Specific Recommendations

### For Chrome/Edge (v37+/v15+)
- Reliable value available
- Can confidently use reported core count
- No special handling needed

### For Firefox (v48+)
- Reliable value available
- Full feature support
- No privacy restrictions

### For Safari (v10.1+)
- Values are clamped for privacy
- Expect maximum of 4-8 cores
- Design algorithms with this assumption
- Early Safari versions (8-10) had additional restrictions

### For iOS Safari (v15.4+)
- Values are clamped to prevent fingerprinting
- Design with conservative core count assumptions
- Test on actual devices for performance

### For Opera (v24+)
- Full support equivalent to Chrome
- Can rely on accurate reporting

## Testing & Validation

### Essential Test Cases

1. **Feature Detection**
   - Verify property exists in supported browsers
   - Confirm graceful fallback in unsupported browsers

2. **Value Range**
   - Test with systems of varying core counts
   - Verify clamping behavior on Safari

3. **Worker Creation**
   - Ensure worker pool creation doesn't exceed available cores
   - Test behavior on single-core systems

4. **Performance Impact**
   - Measure actual performance gains from parallelization
   - Verify no regression on low-core systems

## Security & Privacy Considerations

### Fingerprinting Prevention

The intentional clamping of values in Safari (capped at 4-8 cores) is a privacy protection measure to prevent accurate device identification through core count enumeration.

### Recommendations

- Don't use core count as a sole identifier
- Assume clamped values in privacy-sensitive contexts
- Combine with other capability detection methods
- Respect browser privacy implementations

## Implementation Status

- **Spec Status:** Living Standard
- **Global Support:** 92.71% of users
- **Production Ready:** Yes

## Changelog & Version History

- **Chrome 37:** Initial support
- **Firefox 48:** Initial support
- **Edge 15:** Initial support
- **Safari 10.1:** Initial support (with clamping)
- **Opera 24:** Initial support
- **iOS Safari 15.4:** Re-enabled with clamping (was previously disabled)
- **Safari 15.4:** Re-enabled with clamping (was previously disabled)

## Conclusion

`navigator.hardwareConcurrency` is a well-supported Web API (92.71% global coverage) that enables developers to optimize performance-critical JavaScript applications for the computational capacity of the user's device. While privacy-conscious browsers implement clamping to prevent fingerprinting, the API remains valuable for intelligent worker allocation and parallel task distribution.

The feature has matured from its initial proposal to become a stable part of the WHATWG Living Standard, with strong support across all major browser engines.
