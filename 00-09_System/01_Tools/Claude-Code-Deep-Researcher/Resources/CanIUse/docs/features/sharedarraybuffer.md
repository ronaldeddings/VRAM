# Shared Array Buffer

## Overview

**Shared Array Buffer** is a JavaScript type that allows you to create ArrayBuffers that can be shared across multiple Workers, enabling efficient multi-threaded communication and data sharing in web applications.

## Description

SharedArrayBuffer is a fixed-length raw binary data buffer that can be shared between the main thread and Worker threads. Unlike regular ArrayBuffers, which are transferred (moved) from one context to another, a SharedArrayBuffer can be accessed simultaneously by multiple workers and the main thread, allowing them to work with the same data without copying.

## Specification Status

- **Status:** Other (Non-standard but widely implemented)
- **Specification:** [ECMA-262 SharedArrayBuffer Objects](https://tc39.es/ecma262/#sec-sharedarraybuffer-objects)

## Categories

- **JavaScript (JS)**

## Use Cases & Benefits

### Primary Use Cases

1. **Multi-threaded Data Processing**
   - Share large datasets between workers without copying overhead
   - Implement true parallel processing for CPU-intensive tasks

2. **Real-time Applications**
   - Low-latency communication between threads
   - Ideal for audio/video processing, scientific computing, and game engines

3. **Performance Optimization**
   - Eliminate serialization overhead of postMessage()
   - Reduce memory footprint for large data structures shared across workers

4. **Concurrent Algorithms**
   - Implement producer-consumer patterns efficiently
   - Support atomic operations with Atomics API

### Key Benefits

- **Zero-copy sharing** of data between threads
- **Atomic operations** available through Atomics API for synchronization
- **Memory efficiency** when working with large datasets
- **Better performance** for parallel computing tasks

## Browser Support

### Current Support Summary

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 68 | Full Support | v91+ requires COEP/COOP headers |
| **Firefox** | 79 | Full Support | v79+ requires COEP/COOP headers |
| **Safari** | 15.2-15.3 | Full Support | v15.2+ requires COEP/COOP headers |
| **Edge** | 79 | Full Support | v91+ requires COEP/COOP headers |
| **Opera** | 55 | Full Support | v78+ requires COEP/COOP headers |
| **iOS Safari** | 15.2-15.3 | Full Support | v15.2+ requires COEP/COOP headers |

### Desktop Browsers

#### Chrome
- Unsupported: v4-67
- Disabled: v60-67 (security concerns)
- Supported: v68+
- Restricted: v91+ (requires COEP/COOP headers)

#### Firefox
- Unsupported: v2-56
- Disabled: v57-78 (security concerns)
- Supported: v79+
- Restricted: v79+ (requires COEP/COOP headers)

#### Safari
- Unsupported: v3.1-15.1
- Disabled: v10.1-15.1 (security concerns)
- Supported: v15.2-15.3+
- Restricted: v15.2+ (requires COEP/COOP headers)

#### Edge
- Unsupported: v12-78
- Disabled: v16-18 (security concerns)
- Supported: v79+
- Restricted: v91+ (requires COEP/COOP headers)

#### Opera
- Unsupported: v9-46
- Disabled: v47-63 (security concerns)
- Supported: v64-77
- Restricted: v78+ (requires COEP/COOP headers)

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | 15.2+ | Requires COEP/COOP headers |
| **Android Chrome** | 142+ | Requires COEP/COOP headers |
| **Android Firefox** | 144+ | Requires COEP/COOP headers |
| **Samsung Internet** | 15.0+ | Requires COEP/COOP headers |
| **Opera Mobile** | 80+ | Requires COEP/COOP headers |
| **KaiOS** | 3.0-3.1+ | Requires COEP/COOP headers |
| **Opera Mini** | Not Supported | — |
| **Baidu** | 13.52+ | Requires COEP/COOP headers |

### Legacy Browsers (No Support)

- Internet Explorer (all versions)
- Android Browser (all versions)
- Blackberry Browser (all versions)
- UC Browser (v15.5+, limited support)

## Important Notes

### Security Considerations (Note #1)
SharedArrayBuffer had support disabled across all browsers in **January 2018** due to **Spectre and Meltdown vulnerabilities**. While the feature was later re-enabled, there are important security restrictions.

### Security Requirements (Note #3)
For modern browser versions, SharedArrayBuffer requires **cross-origin isolation** via HTTP headers:

- **Cross-Origin-Embedder-Policy (COEP)** header must be set
- **Cross-Origin-Opener-Policy (COOP)** header must be set

These headers ensure that your site cannot be framed or opened by third-party sites, preventing certain types of security exploits.

**Example Headers:**
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

### Enabling in Development (Note #2)
In Firefox:
- Nightly builds: Enabled by default
- Beta/Developer/Release: Requires manual enabling or proper headers

## Implementation Requirements

To use SharedArrayBuffer in production:

1. Serve your page with proper CORS headers
2. Set COEP and COOP headers as shown above
3. Test in target browsers to ensure support
4. Provide fallback mechanisms for unsupported browsers

## Example Usage

```javascript
// Create a SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(4 * Int32Array.BYTES_PER_ELEMENT);
const sharedArray = new Int32Array(sharedBuffer);

// Pass to Worker
worker.postMessage({ buffer: sharedBuffer });

// In Worker
self.onmessage = function(e) {
  const sharedArray = new Int32Array(e.data.buffer);
  // Both main thread and worker can access the same data
  Atomics.store(sharedArray, 0, 42);
};
```

## Usage Statistics

- **Global Support:** 91.89% of users have browsers with SharedArrayBuffer support
- **Partial Support:** 0% (no partial support implementations)

## Related Resources

### Documentation
- [MDN: SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
- [ECMA-262 Specification](https://tc39.es/ecma262/#sec-sharedarraybuffer-objects)

### Articles
- [Mozilla Hacks: Safely Reviving Shared Memory](https://hacks.mozilla.org/2020/07/safely-reviving-shared-memory/)

### Related APIs
- [Atomics API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) - For atomic operations on SharedArrayBuffer
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) - For multi-threaded execution

## Browser Compatibility Notes

### Headers Required in Modern Versions
Most modern browsers (Chrome 91+, Firefox 79+, etc.) require the COEP and COOP headers to be set. This is a critical requirement for production use and should be implemented before using SharedArrayBuffer.

### Testing Across Browsers
When implementing SharedArrayBuffer support:
1. Test in Chrome, Firefox, and Safari (all have full support with proper headers)
2. Verify COEP/COOP headers are correctly configured
3. Implement feature detection to handle unsupported browsers
4. Consider providing an alternative code path for browsers without support
