# WebAssembly Reference Types

## Overview

**WebAssembly Reference Types** is an extension to the WebAssembly specification that introduces opaque references as first-class types and supports multiple tables. This feature enhances the capabilities of WebAssembly by allowing more flexible data management and improved interoperability with host environments.

## Description

An extension to WebAssembly allowing opaque references as first-class types, and multiple tables. Reference types enable WebAssembly modules to directly reference objects and values from the host environment and maintain references to external data structures without exposing their internal representation.

## Specification Status

- **Status**: Working Draft (WD)
- **Specification**: [WebAssembly Core Specification](https://webassembly.github.io/spec/core/)
- **Proposal Overview**: [Reference Types Proposal](https://github.com/WebAssembly/spec/blob/main/proposals/reference-types/Overview.md)

## Categories

- Other

## Benefits & Use Cases

### Key Benefits

- **Enhanced Type System**: Enables WebAssembly to work with opaque references as first-class types
- **Multiple Tables Support**: Allows WebAssembly modules to manage multiple function tables and reference tables
- **Better Host Integration**: Facilitates safer and more efficient communication between WebAssembly and JavaScript/host environments
- **Flexibility**: Supports external references without exposing internal implementation details
- **Type Safety**: Provides type-safe reference handling without requiring serialization/deserialization

### Common Use Cases

1. **Complex Data Structures**: Managing references to JavaScript objects and DOM elements from WebAssembly
2. **Callback Functions**: Passing function references between WebAssembly and host code
3. **Object-Oriented Design**: Implementing object-oriented patterns within WebAssembly with host object references
4. **Resource Management**: Maintaining safe references to external resources and objects
5. **Interoperability**: Improving the bridge between WebAssembly modules and the broader web ecosystem

## Browser Support

### Support Matrix

| Browser | First Support | Current Status |
|---------|---------------|---|
| **Chrome** | v96 | Supported (v96+) |
| **Edge** | v96 | Supported (v96+) |
| **Firefox** | v79 | Supported (v79+) |
| **Safari** | v15 | Supported (v15+) |
| **Opera** | v82 | Supported (v82+) |
| **iOS Safari** | v15.0-15.1 | Supported (v15.0+) |
| **Chrome Android** | v142 | Supported (v142+) |
| **Firefox Android** | v144 | Supported (v144+) |
| **Samsung Internet** | v17.0 | Supported (v17.0+) |
| **Opera Android** | v80 | Supported (v80+) |
| **Android Browser** | v142 | Supported (v142+) |
| **Internet Explorer** | Not Supported | - |
| **Opera Mini** | Not Supported | - |
| **Blackberry** | Not Supported | - |

### Global Usage

- **Supported**: 92.08% of global browser usage
- **Partial Support**: 0%
- **Unsupported**: 7.92%

### Platform Support Summary

| Platform | Support Status |
|----------|---|
| Desktop (Chrome, Firefox, Safari, Edge, Opera) | Full Support |
| Mobile (iOS Safari, Chrome Android, Firefox Android, Samsung) | Full Support (recent versions) |
| Legacy Browsers (IE, Opera Mini) | Not Supported |
| Older Mobile Versions | Not Supported |

## Notes

No additional notes or known issues are documented at this time.

## Related Information

### Keywords
`webassembly` · `reftypes` · `externref`

### Parent Feature
This feature is part of the broader [WebAssembly (WASM)](https://caniuse.com/wasm) feature set.

### Chrome Feature ID
`5166497248837632`

## Implementation Considerations

### Browser Compatibility

When implementing WebAssembly Reference Types:

1. **Desktop Support**: Universally supported across modern desktop browsers (Chrome 96+, Firefox 79+, Safari 15+, Edge 96+)
2. **Mobile Support**: Well-supported on modern mobile devices and browsers
3. **Legacy Support**: No support in Internet Explorer or very old browser versions
4. **Fallback Strategy**: If targeting older browsers, consider alternative approaches or polyfills where feasible

### Feature Detection

To detect WebAssembly Reference Types support at runtime:

```javascript
// Check for WebAssembly support and reference types
const supportsReferenceTypes = () => {
  try {
    // Try to instantiate a WebAssembly module with reference types
    const wasmCode = new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, // Magic number and version
      0x01, 0x04, 0x01, 0x60, 0x00, 0x00               // Type section with empty function
    ]);
    new WebAssembly.Module(wasmCode);
    return true;
  } catch (e) {
    return false;
  }
};

console.log('Reference Types Supported:', supportsReferenceTypes());
```

## Resources

- **Official Specification**: [WebAssembly Core Spec](https://webassembly.github.io/spec/core/)
- **GitHub Proposal**: [Reference Types Proposal](https://github.com/WebAssembly/spec/blob/main/proposals/reference-types/Overview.md)
- **MDN Web Docs**: Check MDN for detailed WebAssembly documentation
- **WebAssembly Community**: [WebAssembly.org](https://webassembly.org/)

---

*Documentation generated from CanIUse data. Last updated: 2025*
