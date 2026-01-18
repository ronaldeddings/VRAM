# WebGL - 3D Canvas Graphics

## Overview

WebGL is a JavaScript API that enables the generation of dynamic 3D graphics with hardware acceleration. It allows developers to create interactive 3D visualizations and applications directly in web browsers without requiring plugins or external applications.

## Description

WebGL provides a method of generating dynamic 3D graphics using JavaScript, accelerated through hardware. It's built on top of the HTML5 Canvas element and provides a low-level graphics API for rendering 2D and 3D graphics. WebGL is based on OpenGL ES, making it a standardized and powerful tool for web-based graphics applications.

## Specification Status

**Status:** Stable Standard (W3C Recommendation)

**Current Version:** WebGL 1.0
**Latest Version:** WebGL 2.0+

**Specification URL:** https://www.khronos.org/registry/webgl/specs/1.0/

**Standards Organization:** Khronos Group (note: WebGL is part of the Khronos Group, not the W3C, though it is a widely adopted web standard)

## Categories

- Canvas

## Benefits and Use Cases

### Graphics Applications
- Real-time 3D visualization and rendering
- Interactive data visualization
- 3D games and gaming engines
- Scientific and engineering simulations
- Architectural visualization and walkthroughs

### Performance Advantages
- Hardware-accelerated rendering through GPU acceleration
- Smooth, high-performance animation at 60fps+
- Efficient handling of complex 3D scenes
- Direct access to GPU resources for intensive computations

### Business Applications
- 3D product visualization for e-commerce
- Interactive modeling and design tools
- Virtual showrooms and immersive experiences
- Educational simulations and interactive learning
- Data analysis and statistical visualization in 3D

### Creative Use Cases
- Digital art and generative graphics
- Immersive storytelling experiences
- Music and audio visualization
- Creative coding and experimental projects

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 8 | Full (v146+) | Marked with #1 until v32 |
| **Firefox** | 4 | Full (v148+) | Marked with #1 until v23 |
| **Safari** | 5.1 | Full (v18.5+) | Marked with #1 until v7.1 |
| **Edge** | 12 | Full (v143+) | Marked with #1 until v78 |
| **Opera** | 12 | Full (v122+) | Marked with #1 until v18 |
| **Internet Explorer** | 11 | Partial (IE 11) | Only IE 11 with limitations; versions 5.5-10 not supported |

### Mobile Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **iOS Safari** | 8 | Full (v18.5+) | Not supported in iOS versions 3.2-7.1 |
| **Android Browser** | 142+ | Full | Limited support in older Android versions |
| **Chrome for Android** | 142+ | Full | |
| **Firefox for Android** | 144+ | Full | |
| **Samsung Internet** | 4+ | Full (v29+) | Strong support across versions |
| **Opera Mobile** | 12+ | Full (v80+) | Not supported in versions 10-11.5 |

### Other Mobile Platforms

| Platform | Status | Notes |
|----------|--------|-------|
| **Opera Mini** | Not Supported | No WebGL support |
| **BlackBerry** | Partial (v10+) | Limited support |
| **UC Browser** | Supported (v15.5+) | Mobile browser support |
| **KaiOS** | Partial (v2.5+) | Partial support in v2.5; full in v3.0+ |

### Global Browser Support

**Overall Support Coverage:** 93.59% of global users (as of latest data)

## Implementation Notes

### Context Access Methods

Note #1 applies to earlier versions of several browsers:
- **Older browsers:** WebGL context must be accessed using `"experimental-webgl"` instead of `"webgl"`
- **Modern browsers:** Direct `"webgl"` context access is standardized

To handle both cases, developers should attempt both context names:

```javascript
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl') ||
           canvas.getContext('experimental-webgl');
```

### Hardware and Driver Requirements

WebGL support is dependent on GPU support and may not be available on older devices. This is due to the additional requirement for users to have up-to-date video drivers. Khronos maintains blacklists and whitelists of compatible GPUs and driver versions.

More information: [Khronos WebGL Blacklists and Whitelists](http://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists)

### Internet Explorer Notes

Older versions of IE 11 have only partial support of the WebGL specification, failing more than half of the official WebGL conformance test suite. However, support has improved significantly with recent updates to IE 11. Users should ensure they have the latest IE 11 updates installed for better compatibility.

### Standard Body

It's important to note that WebGL is part of the **Khronos Group**, not the W3C (World Wide Web Consortium), though it has become a de facto web standard with widespread browser adoption.

## Resources and References

### Official Documentation and Tutorials
- **WebGL Official Website:** https://www.khronos.org/webgl/
- **Getting WebGL:** https://get.webgl.org/get-a-webgl-implementation/
- **Khronos WebGL Tutorial:** https://www.khronos.org/webgl/wiki/Tutorial

### Community Resources
- **Mozilla Firefox WebGL Blog:** https://hacks.mozilla.org/2009/12/webgl-draft-released-today/

### Polyfills and Compatibility
- **Polyfill for Internet Explorer:** https://github.com/iewebgl/iewebgl
  - Enables basic WebGL functionality in older IE versions

## Quick Facts

- **Usage by Global Users:** 93.59%
- **Vendor Prefixing:** Not required (no `webkit-`, `moz-` prefixes needed)
- **Parent Technology:** Built on top of Canvas API
- **Keywords:** web, gl, 3D, graphics, rendering
- **Chrome Platform ID:** 6049512976023552

## Getting Started

### Basic Example

```javascript
// Get the WebGL context
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

// Check for support
if (!gl) {
  console.error('WebGL not supported');
}

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set the viewport
gl.viewport(0, 0, canvas.width, canvas.height);

// Clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
```

### Recommended Libraries

While WebGL is powerful, many developers use higher-level libraries that abstract away complexity:
- **Three.js** - Popular 3D graphics library
- **Babylon.js** - Full-featured WebGL engine
- **PlayCanvas** - Cloud-based WebGL game engine
- **Cesium.js** - For 3D geospatial visualization

## Compatibility Considerations

### Graceful Degradation

When WebGL is not available, consider providing:
- Canvas 2D fallback
- Static image alternatives
- Progressive enhancement strategies

### Feature Detection

Always detect WebGL support before using it:

```javascript
function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
```

## See Also

- [Canvas API](/docs/features/canvas.md)
- [WebGL 2.0 Specification](https://www.khronos.org/registry/webgl/specs/latest/2.0/)
- [MDN WebGL Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

---

*Last Updated: 2024 | Based on CanIUse data*
