# asm.js

## Overview

asm.js is an extraordinarily optimizable, low-level subset of JavaScript intended as a compile target from languages like C++. It enables developers to write high-performance JavaScript applications by restricting the language to a subset that can be analyzed and optimized by JavaScript engines.

## Specification

- **Status:** Other (non-standard but widely documented)
- **Specification URL:** http://asmjs.org/spec/latest/

## Categories

- JavaScript (JS)
- JavaScript API (JS API)
- Other

## Key Characteristics

asm.js allows C/C++ code to be compiled to JavaScript while maintaining near-native performance. The language subset is restrictive but predictable, allowing engines to apply aggressive optimizations such as ahead-of-time (AOT) compilation.

## Benefits and Use Cases

### Primary Use Cases

- **Porting Desktop Applications:** Converting C/C++ applications to run in the browser
- **Game Development:** Running compiled games in web browsers with near-native performance
- **Scientific Computing:** Executing computationally intensive algorithms in JavaScript
- **Audio/Video Processing:** Running specialized multimedia libraries compiled to asm.js
- **Legacy Code Migration:** Bringing existing C/C++ codebases to web platforms

### Key Advantages

- **Performance:** Near-native execution speed through aggressive optimizations
- **Compatibility:** Fallback to JavaScript execution in non-optimizing engines
- **Portability:** Single compiled binary targets multiple browser architectures
- **Memory Safety:** Safer than raw JavaScript for critical operations
- **Deterministic Behavior:** Predictable execution patterns enable optimization

## Browser Support

| Browser | First Version with Support | Status | Notes |
|---------|----------------------------|--------|-------|
| Chrome | 28+ | Partial (a) | No ahead-of-time compilation, but performance doubled in Chrome 28 |
| Firefox | 22+ | Full (y) | Complete support with optimizations |
| Edge | 13+ | Full (y) | Versions 13-18 have full support; versions 79+ have partial support (a) |
| Safari | None | No Support (n) | Not supported in any version |
| Opera | 15+ | Partial (a) | Partial support from version 15 onwards |
| IE | None | No Support (n) | Not supported in any version |
| iOS Safari | None | No Support (n) | Not supported in any version |
| Android Browser | 4.4+ | Partial (a) | Limited support on newer Android versions |
| Opera Mini | None | No Support (n) | Not supported |

### Desktop Browsers Summary

- **Full Support (y):** Firefox 22+, Edge 13-18
- **Partial Support (a):** Chrome 28+, Edge 79+, Opera 15+
- **No Support (n):** Safari, IE

### Mobile Browsers Summary

- **Full Support (y):** Android Firefox, KaiOS 2.5+
- **Partial Support (a):** Android Chrome, Samsung Internet, Opera Mobile
- **No Support (n):** iOS Safari, Android 4.4 and earlier, Opera Mini

## Usage Statistics

- **Full Support (y):** 2.19% of web traffic
- **Partial Support (a):** 80.32% of web traffic
- **Combined:** 82.51% of users can utilize asm.js

## Important Notes

### Deprecation Status

**asm.js is mostly rendered obsolete with the introduction of [WebAssembly](/wasm) and is therefore [no longer recommended](https://developer.mozilla.org/en-US/docs/Games/Tools/asm.js)** for new projects.

### Implementation Details

**Note #1:** Chromium does not support ahead-of-time (AOT) compilation. However, performance was significantly improved in Chrome 28, roughly doubling for asm.js workloads. See [Wikipedia: Asm.js Implementations](https://en.wikipedia.org/wiki/Asm.js#Implementations) for more details.

**Note #2:** Microsoft Edge support requires enabling the "Enable experimental JavaScript features" flag in versions prior to 13.

## Known Issues and Limitations

### Technical Limitations

1. **No Safari Support:** Apple has not implemented asm.js optimizations in WebKit
2. **IE Incompatibility:** Internet Explorer provides no asm.js support
3. **iOS Restrictions:** No asm.js support on iOS Safari limits mobile reach
4. **Chromium Limitations:** Lack of AOT compilation reduces potential performance gains

### Practical Considerations

- asm.js requires careful code generation from C/C++ compilers
- Debugging asm.js is significantly harder than debugging source C++
- Not all JavaScript engines optimize asm.js equally
- File sizes can be large compared to native binaries

## Migration Path

Given the deprecation of asm.js, projects should consider:

1. **WebAssembly (wasm):** The modern successor to asm.js with better performance and broader support
2. **Emscripten Updates:** Update toolchain to compile to WebAssembly instead of asm.js
3. **Feature Detection:** Use feature detection to serve WebAssembly to supported browsers and asm.js as fallback

## Related Links

- [asm.js Homepage](http://asmjs.org/) - Official project website
- [GitHub Repository](https://github.com/dherman/asm.js/) - Source code and specification
- [MDN: asm.js Documentation](https://developer.mozilla.org/en-US/docs/Games/Tools/asm.js) - Comprehensive MDN guide
- [Wikipedia: asm.js](https://en.wikipedia.org/wiki/Asm.js) - Historical and technical overview
- [Microsoft Edge Implementation](https://blogs.windows.com/msedgedev/2015/05/07/bringing-asm-js-to-chakra-microsoft-edge/) - Edge browser support details
- [WebAssembly Alternative](https://developer.mozilla.org/en-US/docs/WebAssembly) - Recommended modern alternative

## Tooling and Compilers

### Emscripten

The primary tool for compiling C/C++ to asm.js is [Emscripten](https://emscripten.org/). Modern versions of Emscripten prioritize WebAssembly output but can still generate asm.js when needed.

## Historical Context

asm.js emerged around 2013 as a way to bring compiled code to the web before WebAssembly was standardized. Multiple browser vendors invested in optimizations for asm.js, with Firefox and Edge providing the best implementations. The specification was finalized in 2014, but with WebAssembly's introduction in 2017, asm.js was effectively superseded.

## Conclusion

While asm.js represented an important milestone in enabling high-performance computing on the web, it should not be used for new projects. WebAssembly is the modern standard with better performance, broader browser support, and active development. Existing asm.js codebases should be evaluated for migration to WebAssembly using tools like Emscripten's modern output targets.
