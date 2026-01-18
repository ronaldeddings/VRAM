# WebAssembly Garbage Collection (Wasm GC)

## Overview

WebAssembly Garbage Collection (Wasm GC) is an extension to the WebAssembly specification that adds garbage collection capabilities to WebAssembly modules. This feature introduces GC types, allocation mechanisms, and typed function references, enabling more efficient compilation of languages with automatic memory management.

## Description

An extension to WebAssembly adding GC types, allocation, and typed function references. This proposal enables WebAssembly to efficiently support languages that rely on garbage collection, such as Java, Python, and JavaScript, by providing native support for GC operations at the VM level rather than requiring GC implementation within the module itself.

## Specification Status

- **Status**: Working Draft (WD)
- **Spec URL**: [WebAssembly Core Specification](https://webassembly.github.io/spec/core/)
- **Proposal**: [GC Proposal MVP](https://github.com/WebAssembly/gc/blob/main/proposals/gc/MVP.md)

## Categories

- Other (Web Standards)
- Other (Languages & Runtimes)

## Benefits & Use Cases

### Primary Benefits

- **Reduced Overhead**: Eliminates the need to implement garbage collection within WebAssembly modules
- **Better Performance**: Native GC support in the VM allows for optimized collection algorithms
- **Language Support**: Enables efficient compilation of GC-heavy languages to WebAssembly
- **Memory Efficiency**: Reduces module size by removing embedded GC runtime code
- **Type Safety**: Provides typed references that can be efficiently tracked by the runtime

### Ideal Use Cases

1. **Java on WebAssembly**: Compiling Java applications to run in the browser
2. **Python Runtimes**: Enabling Python execution through WebAssembly
3. **JavaScript Implementations**: Running JS engines and interpreters on Wasm
4. **Managed Languages**: Any language with automatic memory management (C#, Go, etc.)
5. **Language Interoperability**: Building polyglot applications with multiple languages
6. **Cloud Computing**: Serverless and edge computing with WebAssembly

## Browser Support

### Support Summary

- **Chrome**: Full support from version 119+
- **Edge**: Full support from version 119+
- **Firefox**: Full support from version 120+
- **Safari**: No support (as of version 18.5)
- **Opera**: Full support from version 105+
- **Overall Usage**: 74.15% (based on usage statistics)

### Desktop Browsers

| Browser | First Support | Current Status | Version Range |
|---------|---|---|---|
| **Chrome** | v119 | Supported | 119 - 146+ |
| **Edge** | v119 | Supported | 119 - 143+ |
| **Firefox** | v120 | Supported | 120 - 148+ |
| **Safari** | Not Supported | Not Supported | — |
| **Opera** | v105 | Supported | 105 - 122+ |

### Mobile Browsers

| Browser | Support Status | Notes |
|---------|---|---|
| **iOS Safari** | Not Supported | No WebAssembly GC support in any version |
| **Android Chrome** | Supported (v142+) | Full support in latest Android versions |
| **Android Firefox** | Supported (v144+) | Full support in latest Android versions |
| **Samsung Internet** | Not Supported | No support in any version tested |
| **Opera Mini** | Not Supported | No support |
| **UC Browser** | Partial (v15.5+) | Limited support reported |

### Emerging Markets & Alternative Browsers

| Browser | Support Status | Version |
|---------|---|---|
| **QQ Browser** | Unknown | v14.9 (marked as 'u') |
| **Baidu Browser** | Unknown | v13.52 (marked as 'u') |
| **KaiOS** | Partial | v3.0-3.1 (marked as 'u') |

## Implementation Details

### Key Features

1. **Struct Types**: Ability to define structured data with typed fields
2. **Array Types**: Support for arrays of managed objects
3. **Function References**: Typed references to functions with specific signatures
4. **Type Hierarchies**: Support for subtyping and type casting
5. **Object Allocation**: Native allocation of managed objects
6. **Automatic Collection**: Runtime-managed garbage collection

### Supported Operations

- Creating GC objects and arrays
- Field access with type safety
- Function reference calls
- Type checking and casting
- Array bounds checking

## Usage Statistics

- **Supported by 74.15%** of users (global usage percentage)
- **Partially supported/Unknown**: 0%
- **Not supported**: ~26% (primarily Safari users and older browser versions)

## Compatibility Notes

### Important Considerations

- **Not a Polyfill**: This feature requires native browser support and cannot be polyfilled
- **Safari Gap**: Safari does not yet support this feature, which is important for iOS development
- **Gradual Rollout**: Firefox adoption lagged slightly behind Chrome and Edge
- **Mobile Support**: Better Android support than iOS currently
- **Fallback Strategy**: Applications must provide fallback mechanisms for unsupported browsers

### Recommended Approach

For maximum compatibility:

1. Use feature detection at runtime
2. Provide a JavaScript fallback for unsupported browsers
3. Bundle pre-compiled alternatives for older browser versions
4. Consider user base geography and browser distribution

## Related Technologies

- **WebAssembly (Core)**: Base WebAssembly specification
- **WebAssembly Reference Types**: Related proposal for reference handling
- **WebAssembly Exception Handling**: Complementary feature for error management
- **WebAssembly Multi-Value**: Feature for handling multiple return values

## References & Resources

### Official Documentation

- [WebAssembly Core Specification](https://webassembly.github.io/spec/core/)
- [GC Proposal MVP Documentation](https://github.com/WebAssembly/gc/blob/main/proposals/gc/MVP.md)
- [WebAssembly Proposals Repository](https://github.com/WebAssembly/proposals)

### Implementation & Testing

- [Can I Use: WebAssembly GC](https://caniuse.com/wasm-gc)
- [WebAssembly Community Group](https://www.w3.org/community/wasm/)

### Related Articles

- WebAssembly Garbage Collection Proposal
- Compiling Languages to WebAssembly
- Performance Considerations for Wasm GC

## Notes

None currently documented.

---

**Last Updated**: 2025-12-13
**Data Source**: Can I Use WebAssembly Database
