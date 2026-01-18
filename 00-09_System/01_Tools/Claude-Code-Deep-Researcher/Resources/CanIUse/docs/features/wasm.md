# WebAssembly (WASM)

## Overview

**WebAssembly** or **"wasm"** is a new portable, size- and load-time-efficient format suitable for compilation to the web. It enables high-performance applications to run in web browsers while maintaining backward compatibility with existing JavaScript ecosystems.

## Specification Status

- **Status**: Other (Core Standard)
- **Official Specification**: [WebAssembly/spec](https://github.com/WebAssembly/spec)
- **Current Implementation**: Widely standardized and broadly supported across modern browsers

## Categories

- Other

## Use Cases & Benefits

### Performance-Critical Applications
- Execute compute-intensive workloads with near-native performance
- Ideal for graphics processing, video encoding/decoding, and complex simulations
- Excellent for scientific computing and data analysis applications

### Cross-Platform Compatibility
- Write code once in languages like C, C++, or Rust and compile to WebAssembly
- Reuse existing code libraries and applications in the web environment
- Leverage decades of existing software without rewriting from scratch

### Resource Efficiency
- Smaller binary footprint compared to JavaScript bundles
- Faster parsing and compilation times
- Reduced memory footprint and improved startup performance

### Real-World Applications
- Game development and interactive 3D graphics
- Audio/video processing and streaming applications
- Cryptocurrency and cryptographic operations
- Machine learning inference in the browser
- Development environment tools (IDEs, compilers)

## Browser Support

### Desktop Browsers

| Browser | Minimum Version | First Supported | Current Status |
|---------|-----------------|-----------------|----------------|
| **Chrome** | 57 | May 2017 | Full Support ✓ |
| **Firefox** | 52 | March 2017 | Full Support ✓ |
| **Safari** | 11 | September 2017 | Full Support ✓ |
| **Edge** | 16 | October 2017 | Full Support ✓ |
| **Opera** | 44 | August 2017 | Full Support ✓ |
| **Internet Explorer** | Never | Not Supported | Not Supported ✗ |

### Mobile Browsers

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| **iOS Safari** | 11.0+ | Full Support ✓ |
| **Chrome for Android** | Latest | Full Support ✓ |
| **Firefox for Android** | 52+ | Full Support ✓ |
| **Samsung Internet** | 7.2+ | Full Support ✓ |
| **Opera Mobile** | 80+ | Full Support ✓ |
| **Android Browser** | 4.4.3+ | Limited Support |
| **UC Browser (Android)** | 15.5+ | Supported ✓ |
| **Opera Mini** | All versions | Not Supported ✗ |
| **Baidu Browser** | 13.52+ | Supported ✓ |
| **QQ Browser (Android)** | 14.9+ | Supported ✓ |
| **KaiOS** | 3.0+ | Full Support ✓ |

## Global Support Statistics

- **Supported**: 92.98% of global browser usage
- **With Fallback**: 0% (no partial implementations)
- **Unsupported**: ~7% of global browser usage

## Browser-Specific Notes

### Firefox
- **Version 47-51**: Disabled by default
  - Enable via `javascript.options.wasm` in `about:config`
- **Version 52 ESR**: Disabled by default
- **Version 52+**: Fully enabled and supported

### Chrome
- **Version 51-56**: Disabled by default
  - Enable via `#enable-webassembly` flag in `chrome://flags`
- **Version 57+**: Fully enabled and supported

### Edge
- **Version 15**: Experimental support
  - Enable via "Experimental JavaScript Features" flag
- **Version 16+**: Fully enabled and supported

## Implementation Details

### Binary Format
- **Encoding**: Binary format (.wasm files)
- **Text Format**: WebAssembly Text (WAT) format for human readability
- **MIME Type**: `application/wasm`

### API Integration
- **JavaScript Binding**: WebAssembly JavaScript API for loading and interacting with modules
- **Memory Access**: Shared linear memory between WebAssembly and JavaScript
- **Import/Export**: Modules can import JavaScript functions and export functions for JS to call

### Compilation & Execution
- **Streaming Compilation**: Browsers can compile .wasm files while downloading
- **JIT Compilation**: Most browsers use Just-In-Time compilation for optimal performance
- **Sandboxing**: Runs in isolated execution environment with limited host access

## Key Advantages

1. **Performance**: Near-native execution speed for performance-critical code
2. **Portability**: Single compiled binary runs across all supporting browsers
3. **Size Efficiency**: Compact binary format, often smaller than equivalent JavaScript
4. **Language Flexibility**: Compile from C, C++, Rust, Go, and other languages
5. **Ecosystem Integration**: Works seamlessly alongside JavaScript
6. **Security**: Runs in sandboxed environment with restricted capabilities

## Limitations & Considerations

1. **Browser Support**: Not supported in Internet Explorer or Opera Mini
2. **Development Complexity**: Requires compilation toolchain; steeper learning curve
3. **Debugging**: Limited debugging tools compared to JavaScript
4. **DOM Access**: Cannot directly access DOM; must communicate through JavaScript
5. **Legacy Browser Support**: Requires fallback strategies for older browsers

## Migration Path & Fallbacks

### Feature Detection
```javascript
function supportsWebAssembly() {
  return typeof WebAssembly === 'object' &&
         typeof WebAssembly.instantiate === 'function';
}
```

### Progressive Enhancement
- Detect WebAssembly support
- Load optimized WASM version for modern browsers
- Fall back to JavaScript implementation for unsupported browsers

## Related Resources

### Official Links
- [WebAssembly Official Site](https://webassembly.org/) - Main repository and documentation
- [WebAssembly on MDN](https://developer.mozilla.org/docs/WebAssembly) - Comprehensive learning resource
- [Roadmap & Feature Support](https://webassembly.org/roadmap/) - Official roadmap and detailed feature support table

### Getting Started
- WebAssembly core specification and proposals
- Development tools and compilers (Emscripten, wasm-bindgen, etc.)
- Community resources and tutorials

## Summary

WebAssembly has achieved near-universal adoption across modern browsers, with support covering 92.98% of global browser usage. It represents a fundamental shift in web development, enabling developers to leverage high-performance compiled code directly in web applications while maintaining full backward compatibility with JavaScript. The technology is mature, standardized, and production-ready for a wide range of applications.

---

*Last Updated: Based on CanIUse data - Current browser versions and support status as of 2024*
