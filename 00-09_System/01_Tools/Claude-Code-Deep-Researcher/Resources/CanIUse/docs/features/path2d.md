# Path2D

## Overview

**Path2D** is a Canvas API feature that allows path objects to be declared on 2D canvas surfaces. It enables developers to create, manipulate, and reuse path objects independently from the canvas context, providing a more efficient and convenient way to work with complex paths in 2D graphics.

## Description

The Path2D interface represents a path that can be rendered on a 2D canvas surface. It allows you to create path objects that can be reused across multiple canvas draw operations, reducing redundancy and improving performance when rendering the same paths multiple times.

## Specification

- **Status**: Living Standard (ls)
- **Specification URL**: [WHATWG HTML Canvas Standard](https://html.spec.whatwg.org/multipage/canvas.html#path2d-objects)

## Categories

- Canvas
- HTML5

## Use Cases & Benefits

### Benefits
- **Code Reusability**: Create a path once and reuse it multiple times without redrawing
- **Performance Optimization**: Reduce rendering overhead when drawing the same paths repeatedly
- **Cleaner Code**: Separate path definition from drawing logic
- **Path Composition**: Combine multiple paths together using the `addPath()` method
- **Memory Efficiency**: Store complex paths as objects rather than recreating them on each draw

### Use Cases
1. **Complex Graphics**: Games and interactive applications with repeated geometric shapes
2. **Data Visualization**: Charts, graphs, and plotting applications with standardized visual elements
3. **Icon Systems**: Rendering sets of icons efficiently across the application
4. **Animation**: Reusing path objects for smooth, optimized animations
5. **UI Components**: Creating custom graphical components with consistent rendering

## Browser Support

### Support Legend
- **y** - Full support
- **a** - Partial support (see notes)
- **n** - No support
- **u** - Unknown/Untested

### Desktop Browsers

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| Chrome | 68+ | Fully Supported | - |
| Firefox | 48+ | Fully Supported | - |
| Safari | 9.1+ | Fully Supported | - |
| Edge | 79+ | Fully Supported | - |
| Opera | 55+ | Fully Supported | - |
| Internet Explorer | - | Not Supported | No support in any version |

### Mobile Browsers

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| Chrome (Android) | 142+ | Fully Supported | - |
| Firefox (Android) | 144+ | Fully Supported | - |
| Safari (iOS) | 9.1+ | Fully Supported | - |
| Opera (Android) | 80+ | Fully Supported | - |
| Samsung Internet | 10.1+ | Fully Supported | - |
| UC Browser (Android) | 15.5+ | Fully Supported | - |
| QQ Browser (Android) | 14.9+ | Fully Supported | - |
| Baidu Browser | 13.52+ | Fully Supported | - |
| KaiOS | 2.5+ | Fully Supported | - |
| Opera Mini | - | Not Supported | - |
| BlackBerry | 10+ | Fully Supported | - |

### Legacy Support

#### Partial Support (Pre-2015)
Several browsers had partial support ("a") before adding full support:
- **Chrome**: Versions 36-67 (partial)
- **Firefox**: Versions 31-47 (partial)
- **Edge**: Versions 14-18 (partial)
- **Safari**: Versions 7.1-8 (partial)
- **Opera**: Versions 23-54 (partial)
- **Samsung Internet**: Versions 4-9.2 (partial)

## Key Notes

### Important Limitation
**Note #1**: Some browser implementations do not support the `addPath()` method, which allows adding one path to another. This limitation is noted in browsers marked with "#1" in their support status during partial support periods.

### Global Support Statistics
- **Full Support**: 92.99% of global users
- **Partial Support**: 0.21% of global users

## Basic Usage Example

```javascript
// Create a new path
const path = new Path2D();

// Define path operations
path.moveTo(10, 10);
path.lineTo(100, 100);
path.lineTo(100, 10);
path.closePath();

// Get the canvas context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw the path multiple times
ctx.stroke(path);
ctx.fill(path);

// Reuse the path in different transformations
ctx.translate(150, 0);
ctx.stroke(path);
```

## Related Resources

- **MDN Web Docs**: [Path2D - Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/Path2D)
- **Canvas API**: Learn more about the Canvas 2D Context API
- **WHATWG Specification**: Complete technical specification for Path2D

## Implementation Timeline

### Early Adoption (2015-2020)
- Chrome first introduced full support in version 68 (2018)
- Firefox enabled full support in version 48 (2016)
- Safari added full support in version 9.1 (2015)

### Widespread Adoption (2020-Present)
Path2D is now supported in virtually all modern browsers, making it safe to use in production applications targeting modern browser versions.

## Recommendations

### Safe for Production
Path2D can be used in production applications targeting:
- Chrome 68+
- Firefox 48+
- Safari 9.1+
- Edge 79+
- All modern mobile browsers

### Fallback Considerations
If supporting older browsers is required, Path2D operations can be replicated using direct context drawing methods, though this will be less efficient.

---

**Last Updated**: 2024
**Data Source**: CanIUse
