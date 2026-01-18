# WebAssembly Tail Calls

## Overview

WebAssembly Tail Calls is an extension to the WebAssembly specification that adds tail call instructions (`return_call`) to the WebAssembly instruction set. This feature enables more efficient function calls in WebAssembly modules by allowing a function to tail-call another function without allocating additional stack frames.

## Description

Tail calls are a programming language feature where a function returns the result of calling another function directly, without adding a new stack frame. This optimization is crucial for functional programming languages, language implementations that rely on tail call optimization (TCO), and algorithms that use tail recursion.

The WebAssembly Tail Calls extension introduces new instructions (`return_call` and `return_call_indirect`) that allow WebAssembly code to perform tail calls natively. This eliminates the need for compiler workarounds and enables more efficient translation of languages with tail-recursive patterns.

## Specification Status

- **Status**: Working Draft (WD)
- **Spec URL**: [WebAssembly Core Specification](https://webassembly.github.io/spec/core/)
- **Feature Proposal**: [Tail Call Extension Overview](https://github.com/WebAssembly/tail-call/blob/master/proposals/tail-call/Overview.md)

## Categories

- Other
- WebAssembly Extensions

## Benefits & Use Cases

### Functional Programming Languages
Tail calls are essential for functional programming languages like Scheme, Lisp, and Scala that rely heavily on tail recursion as a primary control flow mechanism. This feature enables these languages to compile to WebAssembly with optimal performance.

### Language Runtime Efficiency
Implementing language runtimes in WebAssembly becomes significantly more efficient with tail call support, as runtimes can implement tail-recursive algorithms without stack overflow concerns or performance penalties.

### Stack Safety
Tail calls prevent stack overflow issues in recursive algorithms by reusing the current stack frame rather than creating new frames for each function call. This is particularly important in WebAssembly where the stack size can be limited.

### Compiler Optimizations
Compilers targeting WebAssembly can now generate more efficient code by using native tail call instructions instead of implementing complex workarounds or trampoline patterns.

## Browser Support

### Desktop Browsers

| Browser | First Support | Status | Latest Versions |
|---------|---------------|--------|-----------------|
| **Chrome** | 112 | ✅ Supported | 112+ |
| **Edge** | 112 | ✅ Supported | 112+ |
| **Firefox** | 121 | ✅ Supported | 121+ |
| **Safari** | Not Supported | ❌ | All versions |
| **Opera** | 98 | ✅ Supported | 98+ |

### Mobile Browsers

| Browser | First Support | Status |
|---------|---------------|--------|
| **Chrome Android** | 142 | ✅ Supported |
| **Firefox Android** | 144 | ✅ Supported |
| **Safari iOS** | Not Supported | ❌ |
| **Samsung Internet** | 23 | ✅ Supported |
| **UC Browser Android** | 15.5 | ✅ Supported |

### Legacy & Other

| Browser | Status |
|---------|--------|
| Internet Explorer | ❌ Not Supported |
| Opera Mini | ❌ Not Supported |
| BlackBerry | ❌ Not Supported |

### Summary Statistics

- **Global Usage**: 78.98% of users have support
- **Partial Support**: 0%
- **Vendor Prefix Required**: No

## Implementation Timeline

### Chromium-Based Browsers
- **Initial Support**: Chrome 112 (February 2024)
- **Current Status**: Supported in all versions 112+
- **Mobile Support**: Chrome Android 142+

### Firefox
- **Initial Support**: Firefox 121 (January 2024)
- **Current Status**: Supported in all versions 121+
- **Mobile Support**: Firefox Android 144+

### Webkit
- **Safari Desktop**: No support in any version
- **Safari iOS**: No support in any version

### Opera
- **Initial Support**: Opera 98 (September 2024)
- **Current Status**: Supported in all versions 98+

### Samsung Internet
- **Initial Support**: Samsung Internet 23 (2024)
- **Current Status**: Supported in versions 23+

## Notes

- This is a relatively new WebAssembly proposal that is still in the working draft stage
- Support is currently limited to modern browsers that have implemented the proposal
- Safari does not yet support this feature in any of its versions
- The feature has good coverage across Chromium-based browsers and Firefox
- Mobile browser support is expanding with newer versions

## Related Links

- [Feature Extension Overview](https://github.com/WebAssembly/tail-call/blob/master/proposals/tail-call/Overview.md) - Official proposal documentation
- [WebAssembly Core Specification](https://webassembly.github.io/spec/core/) - Main WebAssembly specification
- [WebAssembly Community Group](https://www.w3.org/wasm/) - W3C WebAssembly Community Group

## See Also

- [WebAssembly (General Support)](./wasm.md)
- [WebAssembly SIMD](./wasm-simd.md)
- [WebAssembly Bulk Memory Operations](./wasm-bulk-memory.md)
