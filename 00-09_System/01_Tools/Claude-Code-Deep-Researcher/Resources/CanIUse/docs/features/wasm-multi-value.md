# WebAssembly Multi-Value

## Overview

**WebAssembly Multi-Value** is an extension to the WebAssembly specification that enables instructions, blocks, and functions to produce multiple result values. This enhancement expands the capabilities of WebAssembly beyond single-value returns, providing greater flexibility for complex computations and enabling more efficient implementation of various programming language features.

## Description

The Multi-Value extension allows WebAssembly functions and code blocks to return multiple values simultaneously, rather than being restricted to a single return value. This is particularly useful for:

- Returning multiple values without allocating memory for tuples or structures
- Implementing programming language semantics that naturally support multiple return values
- Improving performance by eliminating the need for workarounds using local variables or memory allocation
- Providing more direct translation of higher-level language constructs to WebAssembly

## Specification Status

- **Status:** Working Draft (WD)
- **Specification URL:** https://webassembly.github.io/spec/core/
- **Feature Type:** WebAssembly Extension

## Categories

- Other

## Benefits & Use Cases

### Performance Improvements
- Eliminate overhead of returning multiple values through memory allocation or single-value workarounds
- Direct compilation of multi-return language constructs
- Reduced memory pressure and improved execution efficiency

### Language Support
- Better support for programming languages that naturally support multiple return values (Python, Go, Rust, etc.)
- More natural compilation of tuple unpacking operations
- Simplified implementation of error handling patterns that return values and status codes together

### Code Clarity
- More readable and maintainable generated WebAssembly code
- Better alignment between source language and compiled output
- Reduced complexity in compiler backends targeting WebAssembly

### Use Cases
- Scientific computing requiring multiple outputs from functions
- Graphics and game development with functions returning multiple components
- Error handling patterns returning result + error information
- Data processing pipelines with multiple outputs

## Browser Support

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Chrome** | 85 | ✅ Supported (v85+) |
| **Edge** | 85 | ✅ Supported (v85+) |
| **Firefox** | 78 | ✅ Supported (v78+) |
| **Safari** | 13.1 | ✅ Supported (v13.1+) |
| **Opera** | 71 | ✅ Supported (v71+) |
| **iOS Safari** | 13.2 | ✅ Supported (v13.2+) |
| **Samsung Internet** | 14.0 | ✅ Supported (v14.0+) |
| **Android Browser** | 142 | ✅ Supported (v142+) |
| **Opera Mobile** | 80 | ✅ Supported (v80+) |
| **Firefox Android** | 144 | ✅ Supported (v144+) |
| **Chrome Android** | 142 | ✅ Supported (v142+) |
| **UC Browser** | 15.5 | ✅ Supported (v15.5+) |
| **Internet Explorer** | — | ❌ Not Supported |
| **Opera Mini** | — | ❌ Not Supported |
| **BlackBerry Browser** | — | ❌ Not Supported |

### Legacy Browser Notes
- Internet Explorer: No support across all versions
- Opera Mini: Not supported
- BlackBerry Browser: Not supported (v7, v10)

### Regional/Mobile Browsers
- **KaiOS:** Partial/Unknown support (v3.0-3.1)
- **QQ Browser (Android):** Partial/Unknown support (v14.9)
- **Baidu Browser:** Partial/Unknown support (v13.52)

## Global Support Statistics

- **Usage Among Browsers:** 92.31% (among browsers that support WebAssembly)
- **Partial Support:** 0%
- **Vendor Prefix Required:** No

## Implementation Notes

### Important Considerations

1. **WebAssembly Core Requirement:** Multi-Value support requires WebAssembly to be available in the target browser. Check for WebAssembly support before attempting to use this feature.

2. **Compiler Support:** Not all WebAssembly compilers or languages may fully support generating multi-value code. Check your specific toolchain documentation.

3. **Fallback Strategies:** For older browsers or those without support, consider:
   - Using single-return functions with workarounds
   - Returning values via memory/shared arrays
   - Using object/struct-based return values

4. **Performance Validation:** While multi-value improves theoretical performance, validate actual performance in your specific use case, as compiler optimizations vary.

## Relevant Links

- **Feature Extension Overview:** https://github.com/WebAssembly/multi-value/blob/master/proposals/multi-value/Overview.md
- **WebAssembly Official Specification:** https://webassembly.github.io/spec/core/
- **WebAssembly Community Group:** https://www.w3.org/community/wasm/

## References

- **caniuse Feature ID:** wasm-multi-value
- **Related Parent Feature:** wasm (WebAssembly)
- **Keywords:** webassembly, multi, value

---

*Last Updated: Based on caniuse.com data*

*Note: Browser version support data reflects the latest information available. For real-time support data, visit [caniuse.com](https://caniuse.com)*
