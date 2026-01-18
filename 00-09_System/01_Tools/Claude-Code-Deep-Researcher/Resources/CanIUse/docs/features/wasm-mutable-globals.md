# WebAssembly Import/Export of Mutable Globals

## Overview

WebAssembly Mutable Globals is a specification extension that enables the import and export of mutable global variables in WebAssembly modules. This feature extends the core WebAssembly specification to allow greater flexibility in managing global state across module boundaries.

## Description

An extension to WebAssembly import and export of mutable global variables, enabling WebAssembly modules to share and modify global state across different contexts and between the host JavaScript environment and the WebAssembly runtime.

## Specification Status

**Current Status:** Working Draft (WD)

- **Specification:** [WebAssembly Core Specification](https://webassembly.github.io/spec/core/)
- **Feature Extension:** [Mutable Global Proposal Overview](https://github.com/WebAssembly/mutable-global/blob/master/proposals/mutable-global/Overview.md)

## Categories

- Other

## Use Cases & Benefits

### Primary Use Cases

1. **Shared State Management** - Enable WebAssembly modules to share mutable global variables with the JavaScript host and other modules
2. **Configuration Management** - Allow dynamic modification of module configuration without reinitialization
3. **Inter-Module Communication** - Facilitate communication between multiple WebAssembly modules through shared mutable globals
4. **Performance Optimization** - Avoid expensive function calls for configuration changes by exposing mutable globals

### Key Benefits

- **Flexible State Sharing** - Modules can export mutable globals for host environment to modify
- **Better Interoperability** - Seamless integration between JavaScript and WebAssembly for dynamic state management
- **Simplified Module Design** - Reduce the need for exported functions dedicated to state modification
- **Runtime Configuration** - Modify module behavior at runtime without recompilation

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Chrome** | 74 | ✅ Supported | v74+ fully supported |
| **Edge** | 79 | ✅ Supported | v79+ fully supported |
| **Firefox** | 61 | ✅ Supported | v61+ fully supported |
| **Safari** | 12 | ✅ Supported | v12+ fully supported |
| **Opera** | 60 | ✅ Supported | v60+ fully supported |
| **Internet Explorer** | Not Supported | ❌ No Support | All versions unsupported |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **iOS Safari** | 12.0 | ✅ Supported | v12.0+ fully supported |
| **Android** | 142 | ✅ Supported | Recent Android versions |
| **Android Chrome** | 142 | ✅ Supported | Recent versions |
| **Android Firefox** | 144 | ✅ Supported | Recent versions |
| **Opera Mobile** | 80 | ✅ Supported | v80+ supported |
| **Samsung Internet** | 11.1 | ✅ Supported | v11.1+ fully supported |
| **Opera Mini** | Not Supported | ❌ No Support | All versions unsupported |

## Support Summary

### Global Coverage

- **Global Usage:** 92.53% of users have browsers that support this feature
- **Full Support:** Major browsers across desktop and mobile have adopted this feature
- **Partial/Unknown:** Some newer and niche browsers show unknown support status

### Key Adoption Timeline

1. **2019-2020** - Initial adoption in Chrome (74), Edge (79), Firefox (61)
2. **2019-2020** - Safari desktop (12) and iOS Safari (12) support
3. **2020+** - Widespread adoption across modern browsers
4. **2024+** - Nearly universal support in modern browser versions

## Technical Details

### Implementation Status by Browser Family

```
✅ Chromium-based: Chrome 74+, Edge 79+, Opera 60+
✅ Mozilla: Firefox 61+
✅ Webkit: Safari 12+, iOS Safari 12+
❌ Legacy: Internet Explorer (all versions)
```

### Platform Coverage

- Desktop: All major modern browsers supported
- Mobile: iOS and Android fully supported on modern versions
- Tablet: Covered under mobile/desktop browser implementations
- Legacy devices: Older Android versions and Opera Mini lack support

## Notes

- This feature has achieved near-universal adoption in modern browsers
- Internet Explorer and Opera Mini represent the only major gaps in support
- No known compatibility issues or bugs documented
- The feature has been stable across all supporting browsers

## Related Resources

### Specifications & Proposals
- [WebAssembly Mutable Global Proposal](https://github.com/WebAssembly/mutable-global/blob/master/proposals/mutable-global/Overview.md) - Official proposal overview and documentation
- [WebAssembly Core Specification](https://webassembly.github.io/spec/core/) - Core WebAssembly specification reference

### Additional Context
- **Parent Feature:** [WebAssembly (WASM)](../wasm.md)
- **Keywords:** webassembly, mutable, globals
- **Chrome Feature ID:** 5754634769530880

## Migration & Polyfill Information

For environments that do not support mutable globals, consider these alternatives:

1. **Feature Detection** - Use feature detection before attempting to import/export mutable globals
2. **Workarounds** - Use exported functions to modify state instead of relying on mutable global exports
3. **Compilation Options** - Configure your WebAssembly compiler to avoid using mutable globals if compatibility is critical

## Conclusion

WebAssembly Import/Export of Mutable Globals is a mature, widely-supported feature with 92.53% global usage coverage. It is safe to rely on this feature for modern web applications, with proper fallbacks for legacy browser support if needed.

---

**Last Updated:** December 2024
**Documentation Version:** 1.0
