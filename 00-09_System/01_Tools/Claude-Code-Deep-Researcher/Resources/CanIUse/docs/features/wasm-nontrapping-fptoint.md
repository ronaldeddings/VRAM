# WebAssembly Non-trapping float-to-int Conversion

## Overview

The WebAssembly Non-trapping float-to-int Conversion feature extends WebAssembly with new floating-point to integer conversion operators that **saturate instead of trapping** on overflow or invalid conversion operations.

## Description

This WebAssembly extension adds specialized conversion operators that handle edge cases in floating-point to integer conversions gracefully. Instead of throwing traps (errors) when converting out-of-range floating-point values to integers, these operators saturate the result to the nearest valid integer value.

### Key Characteristics

- **Saturating Behavior**: Out-of-range values are clamped to the minimum or maximum representable integer value
- **No Traps**: Eliminates runtime exceptions from conversion overflow
- **Predictable Results**: Provides well-defined behavior for all input values, including NaN and infinity
- **Performance**: Enables more efficient numeric code without explicit bounds checking

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Working Draft (WD) |
| **Spec Link** | [WebAssembly Core Specification](https://webassembly.github.io/spec/core/) |
| **Category** | Other (WebAssembly Extensions) |

## Categories

- **Other** - WebAssembly feature extension

## Benefits & Use Cases

### Primary Benefits

1. **Simplified Code** - Eliminates need for manual bounds checking and error handling around conversions
2. **Performance** - Reduces runtime overhead by avoiding trap exceptions and their associated error paths
3. **Reliability** - Provides deterministic behavior for edge cases without runtime failures
4. **Portability** - Enables WebAssembly modules to write portable numeric code

### Common Use Cases

- **Audio Processing** - Converting floating-point audio samples to integer formats without clipping checks
- **Image Processing** - Color space conversions and pixel value normalization
- **Numeric Calculations** - Scientific computing where bounds checking can be expensive
- **Graphics Rendering** - Coordinate and vertex data conversion
- **Data Serialization** - Converting floating-point data to fixed-point representations

## Browser Support

### Support Summary

- **Global Support**: ~92.36% of users have access to this feature
- **Coverage**: Widespread support in modern browsers (Chrome 75+, Firefox 64+, Safari 15+, Edge 79+)

### Desktop Browsers

| Browser | Earliest Support | Current Status |
|---------|-----------------|----------------|
| **Chrome** | Version 75 (2019) | Fully supported (v75+) |
| **Firefox** | Version 64 (2018) | Fully supported (v64+) |
| **Safari** | Version 15 (2021) | Fully supported (v15+) |
| **Edge** | Version 79 (2020) | Fully supported (v79+) |
| **Opera** | Version 62 (2019) | Fully supported (v62+) |
| **Internet Explorer** | Not supported | ❌ No support |

### Mobile Browsers

| Browser | Platform | Earliest Support | Status |
|---------|----------|-----------------|--------|
| **Safari** (iOS) | iOS | Version 15.0 (2021) | Fully supported |
| **Chrome** (Android) | Android | Version 75+ | Fully supported |
| **Firefox** (Android) | Android | Version 64+ | Fully supported |
| **Samsung Internet** | Android | Version 11.1-11.2 (2019) | Fully supported |
| **Opera Mobile** | Android | Version 80+ | Partially supported |
| **UC Browser** | Android | Version 15.5+ | Supported |

### Older/Legacy Browsers

| Browser | Status |
|---------|--------|
| **Internet Explorer 5.5-11** | ❌ No support |
| **Opera Mini** | ❌ No support |
| **BlackBerry Browser** | ❌ No support |
| **IE Mobile** | ❌ No support |

### Additional Browser Engines

| Engine | Status | Notes |
|--------|--------|-------|
| **Opera Mobile** | Partially supported | v80+ supported |
| **Android Browser** | Supported | v142+ |
| **Android UC** | Supported | v15.5+ |
| **Android QQ** | Unknown | Unsure (marked 'u') |
| **Baidu Browser** | Unknown | Unsure (marked 'u') |
| **KaiOS** | Partially unknown | v3.0-3.1 unsure |

## Technical Details

### Operators Added

The feature introduces conversion operators with saturating semantics:

- `i32.trunc_sat_f32_s` - Truncate f32 to i32 (signed, saturating)
- `i32.trunc_sat_f32_u` - Truncate f32 to i32 (unsigned, saturating)
- `i32.trunc_sat_f64_s` - Truncate f64 to i32 (signed, saturating)
- `i32.trunc_sat_f64_u` - Truncate f64 to i32 (unsigned, saturating)
- `i64.trunc_sat_f32_s` - Truncate f32 to i64 (signed, saturating)
- `i64.trunc_sat_f32_u` - Truncate f32 to i64 (unsigned, saturating)
- `i64.trunc_sat_f64_s` - Truncate f64 to i64 (signed, saturating)
- `i64.trunc_sat_f64_u` - Truncate f64 to i64 (unsigned, saturating)

### Saturation Behavior

| Input | Result |
|-------|--------|
| Valid number within range | Truncated integer value |
| Value too large (positive) | Maximum representable integer |
| Value too small (negative) | Minimum representable integer |
| NaN | 0 |
| Infinity (positive) | Maximum representable integer |
| Infinity (negative) | Minimum representable integer |

## Relevant Links

- **[Feature Extension Overview](https://github.com/WebAssembly/nontrapping-float-to-int-conversions/blob/main/proposals/nontrapping-float-to-int-conversion/Overview.md)** - Detailed specification and proposal overview
- **[WebAssembly Core Specification](https://webassembly.github.io/spec/core/)** - Full WebAssembly specification
- **[WebAssembly Community Group](https://www.w3.org/community/wasm/)** - W3C WebAssembly community resources

## Implementation Notes

### Compatibility Considerations

- **Fallback for Older Browsers**: Detect support and provide JavaScript-based conversion alternatives if needed
- **Feature Detection**: Use try/catch around conversion operations or detect via WebAssembly feature detection
- **Performance Impact**: Minimal overhead compared to standard WebAssembly operators

### When to Use

- Your WebAssembly code performs frequent floating-point to integer conversions
- You need predictable behavior without exception handling
- You want to avoid the performance cost of bounds checking

### When to Avoid

- Strict IEEE 754 compliance is required (trapping on overflow)
- Your code relies on trap exceptions for control flow
- You need exact overflow detection rather than saturation

## Usage Statistics

| Metric | Value |
|--------|-------|
| **Global Usage** | 92.36% |
| **Prefix Required** | No |
| **Parent Feature** | WebAssembly (wasm) |

## Related Features

- **WebAssembly (WASM)** - Base WebAssembly platform support
- **WASM Bulk Operations** - Memory operations optimization
- **WASM SIMD** - Single Instruction Multiple Data support
- **WASM Multi-value** - Functions returning multiple values

## See Also

- [MDN: WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [WebAssembly.org](https://webassembly.org/)
- [Float-to-Int Conversion Proposal](https://github.com/WebAssembly/proposals)
