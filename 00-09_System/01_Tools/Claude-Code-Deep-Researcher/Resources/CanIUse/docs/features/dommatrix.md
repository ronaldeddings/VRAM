# DOMMatrix

## Overview

The `DOMMatrix` interface represents 4x4 matrices, suitable for both 2D and 3D operations. It supersedes the legacy `WebKitCSSMatrix` and `SVGMatrix` interfaces, providing a standardized way to perform complex mathematical transformations across web applications.

## Description

`DOMMatrix` provides a unified interface for matrix operations in web browsers. It allows developers to create, manipulate, and perform mathematical operations on matrices without relying on vendor-specific implementations. The interface is particularly useful for graphics programming, animations, and complex geometric transformations.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [FXTF Geometry Module Level 1](https://drafts.fxtf.org/geometry/#dommatrix)

## Categories

- DOM

## Benefits & Use Cases

### Key Benefits

1. **Unified API**: Single standardized interface replacing multiple vendor-specific implementations
2. **2D and 3D Support**: Handle both two-dimensional and three-dimensional transformations
3. **Mathematical Operations**: Perform matrix multiplication, inversion, and other operations
4. **Legacy Compatibility**: Gradual migration path from `WebKitCSSMatrix` and `SVGMatrix`
5. **Web Graphics**: Essential for canvas graphics, WebGL, and SVG transformations

### Common Use Cases

- **Graphics Programming**: Complex transformations in canvas and WebGL contexts
- **Animation Libraries**: Building sophisticated animation systems with precise control
- **SVG Manipulation**: Applying complex transformations to SVG elements
- **3D Visualization**: Matrix-based 3D rendering and transformations
- **Interactive Graphics**: Responding to user input with mathematical precision
- **Game Development**: Building the mathematical foundation for game engines
- **Data Visualization**: Creating complex visual representations with accurate positioning

## Browser Support

### Support Legend

- **y**: Full support
- **a**: Partial support (with notes)
- **u**: Unknown/Not tested
- **n**: No support
- **x**: Prefix required
- **#**: Note reference (see notes section)

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 8-60 | Partial (a) | WebKitCSSMatrix only (#1) |
| | 61+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Firefox** | 2-32 | None (n) | Not supported |
| | 33-48 | Partial (a) | DOMMatrix only (#3, #5) |
| | 49+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Safari** | 3.1-4 | Unknown (u) | Not tested |
| | 5-10.1 | Partial (a) | WebKitCSSMatrix only (#1) |
| | 11+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Edge** | 12-18 | Partial (a) | WebKitCSSMatrix only (#1) |
| | 79+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Opera** | 9-14.1 | None (n) | Not supported |
| | 15-47 | Partial (a) | WebKitCSSMatrix only (#1) |
| | 48+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 3.2-4.3 | Unknown (u) | Not tested |
| | 5.0-10.3 | Partial (a) | WebKitCSSMatrix only (#1) |
| | 11+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Android Browser** | 2.1-3 | Partial (a x) | WebKitCSSMatrix with prefix (#1, #2) |
| | 4+ | Partial (a) | WebKitCSSMatrix only (#1) |
| **Android Chrome** | 142+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Android Firefox** | 144+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Opera Mobile** | 10-12.1 | None (n) | Not supported |
| | 80+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Samsung Internet** | 4-29 | Partial (a) | WebKitCSSMatrix only (#1) |
| **UC Browser (Android)** | 15.5+ | Partial (a) | Replaced WebkitCSSMatrix (#4) |
| **Opera Mini** | All | None (n) | Not supported |
| **BlackBerry** | 7 | Unknown (u) | Not tested |
| | 10+ | Partial (a) | WebKitCSSMatrix only (#1) |

### Support Summary

| Browser Tier | Coverage |
|--------------|----------|
| Modern Browsers | ~93.54% user support (partial) |
| Legacy/Niche | Limited to no support |

## Implementation Notes

### Note #1: WebKitCSSMatrix Only
Early implementations only support the `WebKitCSSMatrix` version of the interface, not the standardized `DOMMatrix`. Code must account for this vendor-specific implementation.

### Note #2: Missing Methods
In early Chrome (v8), the `WebKitCSSMatrix#skewX` and `WebKitCSSMatrix#skewY` methods are not supported. Use alternative transformation methods if available.

### Note #3: DOMMatrix Only
Firefox (versions 33-48) only supports the standardized `DOMMatrix` interface and not the legacy `WebKitCSSMatrix`. This represents a forward-looking implementation.

### Note #4: WebkitCSSMatrix Replacement
Modern browsers no longer use `WebKitCSSMatrix` directly but instead provide standards-compliant `DOMMatrix` as the replacement. The old interface name is deprecated.

### Note #5: Missing Methods
Some implementations do not support the following methods:
- `fromMatrix()`
- `fromFloat32Array()`
- `fromFloat64Array()`
- `toJSON()`

These limitations are present in Firefox 33-48 and some other browsers. Test your target platforms.

## Recommendations

### For New Development

1. **Use DOMMatrix API**: Always use the standardized `DOMMatrix` interface for new code
2. **Feature Detection**: Check for method availability before using newer methods like `fromFloat32Array()`
3. **Fallback Strategies**: Implement fallbacks for unsupported methods on older platforms
4. **Browser Testing**: Test across your target browser versions, particularly for advanced methods

### For Legacy Support

1. **WebKitCSSMatrix Detection**: Detect and handle `WebKitCSSMatrix` in older browsers
2. **Graceful Degradation**: Provide alternative transformation methods if DOMMatrix is unavailable
3. **Polyfills**: Consider using polyfills for older browsers that need full DOMMatrix support

### Compatibility Code Example

```javascript
// Check for DOMMatrix support
const hasDOMMatrix = 'DOMMatrix' in window;
const hasWebKitCSSMatrix = 'WebKitCSSMatrix' in window;

// Feature detection for specific methods
const hasFromFloat32Array = hasDOMMatrix &&
  'fromFloat32Array' in window.DOMMatrix;

// Usage
let matrix;
if (hasDOMMatrix) {
  matrix = new DOMMatrix();
} else if (hasWebKitCSSMatrix) {
  matrix = new window.WebKitCSSMatrix();
} else {
  // Fallback to manual matrix implementation
}
```

## Usage Statistics

- **Partial Support**: 93.54% of users
- **No Support**: 0%
- **Unknown/Other**: 6.46%

## Related Links

- [WebKitCSSMatrix API Reference](https://developer.apple.com/reference/webkitjs/webkitcssmatrix)
- [WebKitCSSMatrix in Compatibility Standard](https://compat.spec.whatwg.org/#webkitcssmatrix-interface)
- [MDN Web Docs - DOMMatrix](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix)
- [Chrome Implementation Bug Tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=581955)

## Additional Resources

### Official Specification
- [FXTF Geometry Module Level 1 - DOMMatrix](https://drafts.fxtf.org/geometry/#dommatrix)

### Learning Materials
- MDN Web Docs provides comprehensive documentation with examples
- Browser vendor documentation for implementation-specific details

## See Also

- `DOMMatrixReadOnly` - Read-only variant of DOMMatrix
- `WebKitCSSMatrix` - Legacy vendor-specific interface
- `SVGMatrix` - Legacy SVG transformation interface
- CSS Transforms - Related CSS transformation features
- WebGL - 3D graphics context that uses matrices internally
