# WebAssembly BigInt to i64 Conversion in JS API

## Overview

WebAssembly BigInt to i64 conversion is an extension to the WebAssembly JavaScript API that enables bidirectional conversion between JavaScript's `BigInt` values and 64-bit WebAssembly integer values. This feature allows developers to work seamlessly with large integer values when interfacing between JavaScript and WebAssembly modules.

## Description

An extension to the WebAssembly JS API for bidirectionally converting BigInts and 64-bit WebAssembly integer values, enabling seamless interoperability between JavaScript's BigInt type and WebAssembly's i64 and u64 types.

## Specification Status

| Aspect | Information |
|--------|-------------|
| **Status** | Working Draft (WD) |
| **Spec URL** | [WebAssembly JS API Specification](https://webassembly.github.io/spec/js-api/) |
| **Category** | Other |

## Categories

- Other

## Key Benefits & Use Cases

- **Large Integer Handling**: Work with 64-bit integers that exceed JavaScript's safe integer range (beyond ±2^53)
- **Cryptography**: Support for cryptographic operations requiring 64-bit arithmetic
- **High-Precision Calculations**: Numerical computing and financial applications requiring precise large integer handling
- **C/C++ Interop**: Better compatibility when wrapping C/C++ code with WebAssembly, especially for code using `long long` or `uint64_t`
- **Game Development**: Physics engines and game logic that depend on 64-bit integer calculations
- **Scientific Computing**: Applications requiring arbitrary precision arithmetic
- **Emscripten Compatibility**: Enhanced support for code compiled with Emscripten, particularly for BigInt-dependent operations

## Browser Support

### Support Summary

This feature has widespread adoption across modern browsers, with support beginning in 2020-2021 across major engines.

| Browser | First Supported Version | Current Support |
|---------|------------------------|-----------------|
| **Chrome** | v85 (2020) | v85+ ✅ |
| **Firefox** | v78 (2020) | v78+ ✅ |
| **Safari** | v14.1 (2021) | v14.1+ ✅ |
| **Edge** | v85 (2020) | v85+ ✅ |
| **Opera** | v71 (2020) | v71+ ✅ |
| **iOS Safari** | 14.5 (2021) | 14.5+ ✅ |
| **Android Chrome** | v85 (2020) | v85+ ✅ |
| **Android Firefox** | v144 (recent) | v144+ ✅ |
| **Samsung Internet** | v14.0 (2020) | v14.0+ ✅ |

### Detailed Version Support

#### Desktop Browsers

**Chrome**
- Support begins: Version 85
- Current support: All versions from 85 onwards

**Firefox**
- Support begins: Version 78
- Current support: All versions from 78 onwards

**Safari**
- Support begins: Version 14.1
- Current support: All versions from 14.1 onwards
- Note: BigInt64Array support required for full Emscripten compatibility

**Edge (Chromium-based)**
- Support begins: Version 85
- Current support: All versions from 85 onwards

**Opera**
- Support begins: Version 71
- Current support: All versions from 71 onwards

#### Mobile Browsers

**iOS Safari**
- Support begins: Version 14.5
- Current support: All versions from 14.5 onwards
- Note: Aligned with desktop Safari support

**Android Chrome**
- Support begins: Version 85 (synchronized with desktop Chrome)
- Current support: All versions from 85 onwards

**Android Firefox**
- Support begins: Version 144
- Current support: Version 144 and later

**Samsung Internet**
- Support begins: Version 14.0
- Current support: All versions from 14.0 onwards

**Opera Mobile**
- Support begins: Version 80
- Current support: Version 80 and later

#### Limited/Partial Support

- **UC Browser (Android)**: Version 15.5+
- **QQ Browser**: Unknown (marked as U - unknown/untested)
- **Baidu Browser**: Unknown (marked as U - unknown/untested)
- **Kaios**: Version 3.0+ (marked as U - unknown/untested)

#### Not Supported

- Internet Explorer (all versions)
- Opera Mini (all versions)
- BlackBerry (all versions)

## Global Usage Statistics

- **Full Support**: 92.24% of global browser usage
- **Partial/Unknown Support**: 0%
- **No Support**: Minimal legacy browser usage

## Important Notes

### Safari BigInt64Array Compatibility

Safari supported BigInt in version 14.1 but did not support `BigInt64Array` (which is also required for Emscripten's BigInt support) until version 15. When using WebAssembly code compiled with Emscripten that relies on BigInt features, ensure Safari version 15 or later is available, not just 14.1.

### Implementation Considerations

- This feature requires WebAssembly support, which is broadly available across modern browsers
- The feature is particularly important for porting C/C++ code to WebAssembly using Emscripten
- Full support typically requires both the JS API extension and the corresponding WebAssembly runtime capability

## Related Resources

### Official Documentation

- [WebAssembly JS-BigInt Integration Repository](https://github.com/WebAssembly/JS-BigInt-integration) - Feature extension overview and development discussions
- [WebAssembly JS API Specification](https://webassembly.github.io/spec/js-api/) - Official specification

### Standards

- Maintains compatibility with the core WebAssembly specification
- Part of the broader WebAssembly ecosystem enhancement efforts
- Parent feature: [WebAssembly (WASM)](../wasm.md)

## Code Examples

### Basic Usage

```javascript
// Create a WebAssembly module that exports a function returning i64
const wasmCode = new Uint8Array([
  // WebAssembly binary with i64 return type
  // ... module bytes ...
]);

const wasmModule = await WebAssembly.instantiate(wasmCode);

// The returned i64 value is now accessible as a BigInt in JavaScript
const result = wasmModule.instance.exports.myFunction(BigInt(123456789));
console.log(result); // BigInt value
```

### Working with BigInt64Array

```javascript
// Create a WebAssembly memory with BigInt64Array support
const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
const buffer = memory.buffer;

// Create a BigInt64Array view for 64-bit signed integers
const int64View = new BigInt64Array(buffer);

// Create a BigUint64Array view for 64-bit unsigned integers
const uint64View = new BigUint64Array(buffer);

// Set values
int64View[0] = BigInt("9223372036854775807"); // max int64
uint64View[1] = BigInt("18446744073709551615"); // max uint64
```

### Emscripten Integration

When using Emscripten, BigInt support is typically enabled through compiler flags:

```bash
emcripten++ -o mymodule.js mymodule.cpp -s WASM_BIGINT=1
```

This enables automatic marshalling of 64-bit integers between C/C++ and JavaScript.

## Compatibility Considerations

### For Library Authors

- Check browser support before relying on this feature in production code
- Provide fallbacks or polyfills for legacy browser support when necessary
- Test BigInt operations thoroughly across target browsers
- Be aware of the Safari BigInt64Array timing considerations

### For Web Developers

- Safe to use for modern web applications targeting modern browsers
- Highly recommended when working with WebAssembly modules that use 64-bit operations
- No special polyfills typically needed due to high adoption rates
- Consider graceful degradation for applications supporting Internet Explorer

## See Also

- [WebAssembly (WASM) Support](../wasm.md)
- [JavaScript BigInt Support](../bigint.md)
- [WebAssembly Memory](../webassembly-memory.md)
- [JavaScript TypedArray](../typedarrays.md)

---

**Last Updated**: 2024
**Data Source**: CanIUse Feature Database
**Usage Data**: 92.24% of global browser usage supports this feature
