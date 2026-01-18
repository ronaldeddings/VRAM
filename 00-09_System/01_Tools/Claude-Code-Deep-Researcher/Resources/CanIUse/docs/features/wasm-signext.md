# WebAssembly Sign Extension Operators

## Overview

WebAssembly Sign Extension Operators is an extension to the WebAssembly specification that introduces sign-extension operator instructions to the core language. These operators enable efficient sign-extension operations at the instruction level, providing developers with lower-level control over data manipulation within WebAssembly modules.

## Description

An extension to WebAssembly adding sign-extension operator instructions. These operators allow WebAssembly code to perform sign-extension operations on integer values, which is a common operation in low-level programming and is particularly useful when working with data that needs to be converted between different integer sizes while preserving the sign bit.

## Specification Status

- **Status**: Working Draft (WD)
- **Spec URL**: https://webassembly.github.io/spec/core/
- **Repository**: https://github.com/WebAssembly/sign-extension-ops

## Categories

- Other

## What are Sign Extension Operators?

Sign extension is the process of extending a signed integer value to a larger size while preserving its sign. For example, converting a signed 8-bit value to a 32-bit value by duplicating the sign bit. The sign extension operators provide direct instruction support for these common operations, improving both code efficiency and performance.

Common sign extension operations include:
- `i32.extend8_s` - Extend a signed 8-bit integer to 32-bit
- `i32.extend16_s` - Extend a signed 16-bit integer to 32-bit
- `i64.extend8_s` - Extend a signed 8-bit integer to 64-bit
- `i64.extend16_s` - Extend a signed 16-bit integer to 64-bit
- `i64.extend32_s` - Extend a signed 32-bit integer to 64-bit

## Benefits and Use Cases

### Performance Improvements
- Native instruction support eliminates the need for emulated sign-extension operations
- Reduces code size in WebAssembly modules
- Improves execution speed on target platforms

### Practical Applications
- **Interoperability**: Easier integration with C/C++ code that uses various integer types
- **Data Conversion**: Efficient handling of multi-byte data from external sources
- **Memory Optimization**: Compact storage of smaller integer types with sign-aware operations
- **Numeric Processing**: Support for algorithms that work with variable-width integer types

### Use Cases
- Audio/video processing where different bit depths are common
- Scientific computing with mixed numeric precision
- Game engine development requiring efficient integer operations
- Embedded systems simulation with strict performance requirements
- Network protocol implementation handling various data formats

## Browser Support

| Browser | First Supported | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome** | 74 | ✅ Full Support | Continuous support from v74+ |
| **Edge** | 79 | ✅ Full Support | Continuous support from v79+ |
| **Firefox** | 62 | ✅ Full Support | Continuous support from v62+ |
| **Safari** | 14.1 | ✅ Full Support | Support from v14.1+ |
| **Opera** | 62 | ✅ Full Support | Continuous support from v62+ |
| **iOS Safari** | 14.5 | ✅ Full Support | Support from v14.5+ |
| **Android Chrome** | 142 | ✅ Full Support | Latest available data |
| **Android Firefox** | 144 | ✅ Full Support | Latest available data |
| **Samsung Internet** | 11.1 | ✅ Full Support | Support from v11.1+ |
| **Opera Mini** | — | ❌ No Support | Not supported |
| **Internet Explorer** | — | ❌ No Support | All versions unsupported |

### Mobile Device Support

- **iOS (14.5+)**: Fully supported
- **Android (varies)**: Supported in Chrome, Firefox, and Samsung Internet
- **Opera Mini**: Not supported on any version

### Legacy Browser Support

- **Internet Explorer**: Not supported (versions 5.5-11)
- **Opera Mobile 80**: Supported
- **Opera Mobile (pre-80)**: Not supported

## Global Usage Statistics

- **Global Support**: 92.4% of users have browser support
- **Partial Support**: 0% (either fully supported or not)
- **No Support**: 7.6% of users

## Usage Context

This feature is part of the broader WebAssembly ecosystem and is particularly important for projects that:
- Compile C/C++ code to WebAssembly using Emscripten or similar tools
- Perform low-level bit manipulation
- Require maximum performance for numeric operations
- Target modern browser environments

## Implementation Notes

- The feature requires WebAssembly support in the browser; basic WebAssembly must be supported first
- Sign extension operators are typically used by WebAssembly compilers rather than being written manually in WAT (WebAssembly Text format)
- No special polyfills are available for unsupported browsers; fallback implementations must use alternative instruction sequences

## Recommended Approach

For maximum compatibility when sign-extension operations are required:

1. **For Modern Applications**: Use the native sign extension operators without concern on modern browsers (2020+)
2. **For Legacy Support**: Implement fallback sequences using bit manipulation and shift operations
3. **For Compiled Code**: Use recent versions of Emscripten or other WebAssembly compilers that automatically generate optimal instruction sequences
4. **Testing**: Verify support at runtime using feature detection of WebAssembly capabilities

## Related Resources

### Official Documentation
- [WebAssembly Sign Extension Ops Proposal](https://github.com/WebAssembly/sign-extension-ops/blob/master/proposals/sign-extension-ops/Overview.md)
- [WebAssembly Core Specification](https://webassembly.github.io/spec/core/)

### Related WebAssembly Features
- Core WebAssembly (parent feature)
- WebAssembly Integer Operations
- WebAssembly Type System

## Known Issues and Limitations

No known issues reported for this feature in the canIuse database.

---

**Last Updated**: 2024
**Data Source**: canIuse - [https://caniuse.com](https://caniuse.com)
**Feature ID**: wasm-signext

