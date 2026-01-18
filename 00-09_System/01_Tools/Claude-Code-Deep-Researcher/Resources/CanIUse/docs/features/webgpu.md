# WebGPU

## Overview

WebGPU is a modern graphics and compute API designed to provide efficient access to graphics processing units (GPUs) for web applications. It enables developers to create complex rendering pipelines and accelerate computational tasks with hardware-level performance.

## Description

WebGPU is an API for complex rendering and compute, using hardware acceleration. Use cases include demanding 3D games and acceleration of scientific calculations. Meant to supersede WebGL.

## Specification Status

- **Status**: Working Draft (WD)
- **Specification**: https://gpuweb.github.io/gpuweb/
- **Category**: JavaScript API

## Use Cases & Benefits

WebGPU is ideal for applications requiring:

- **Advanced 3D Rendering**: Complex games, immersive experiences, and visualization applications
- **Scientific Computing**: Accelerated calculations, data processing, and simulation
- **Graphics Processing**: Image processing, real-time video effects, and computer vision
- **Machine Learning**: GPU-accelerated neural network inference and training
- **Physics Simulation**: Complex particle systems, fluid dynamics, and physics engines

Key advantages include:

- Hardware acceleration through GPU
- Lower-level GPU access compared to WebGL
- Improved performance for compute-intensive tasks
- Modern API design suitable for contemporary graphics hardware
- Support for advanced rendering techniques

## Browser Support

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 113+ | Supported | Not enabled on Linux by default (#5) |
| **Edge** | 113+ | Supported | Not enabled on Linux by default (#5) |
| **Opera** | 99+ | Supported | Not enabled on Linux by default (#5) |
| **Safari** | 26.0+ | Partial | Only enabled by default on macOS 26 Tahoe or later (#7) |
| **Safari on iOS** | 26.0+ | Supported | Full support |
| **Firefox** | 141+ | Partial | Feature flag required; only enabled by default on Windows and macOS 26 Tahoe or later on Apple Silicon (#1, #8) |
| **Android Chrome** | 142+ | Supported | |
| **Samsung Internet** | 24+ | Supported | |

### Partial Support & Feature Flags

**Firefox**: Enable with the `dom.webgpu.enabled` flag

**Safari**: Enable with the `WebGPU` feature flag

**Chromium Browsers** (Chrome, Edge, Opera on Windows, macOS, Linux): Enable with the `enable-unsafe-webgpu` flag

### Platform Support Notes

- **#1**: Firefox - Requires feature flag; default on Windows and macOS 26 Tahoe or later with Apple Silicon
- **#2**: Safari - Requires feature flag; default on macOS 26 Tahoe or later
- **#3**: Chromium browsers - Flag-enabled on Windows, macOS, Linux
- **#4**: Part of an origin trial (Edge 94-112)
- **#5**: Not enabled on Linux by default
- **#7**: Safari - Partial support (default on macOS 26 Tahoe or later)
- **#8**: Firefox - Default on Windows and macOS 26 Tahoe or later on Apple Silicon

### Unsupported Browsers

- Internet Explorer (all versions)
- Opera Mini (all versions)
- Blackberry Browser
- Android UC Browser
- Baidu Browser

## Global Support Coverage

- **Fully Supported**: ~75.68% of users
- **Partial Support**: ~1.84% of users

## Feature Implementation Status

For detailed implementation status and tracking across browsers, see the [Implementation Status on GitHub](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status).

## Resources & Documentation

- **Official Specification**: https://gpuweb.github.io/gpuweb/
- **GitHub Repository**: https://github.com/gpuweb/gpuweb
- **Official Wiki**: https://github.com/gpuweb/gpuweb/wiki
- **Interactive Test Scene**: https://toji.github.io/webgpu-test/

## Implementation Timeline

### Current Status
WebGPU is in active development with most modern browsers implementing support:

- **Chrome**: Stable support since version 113
- **Edge**: Stable support since version 113
- **Opera**: Stable support since version 99
- **Safari**: Experimental support with feature flag (partial default on macOS 26)
- **Firefox**: Experimental support with feature flag (partial default on Windows/Apple Silicon macOS 26)

## Getting Started

To start using WebGPU in your projects:

1. **Check browser support** using this documentation or CanIUse
2. **Enable feature flags** for development (if needed)
3. **Consult the official specification** for API details
4. **Review implementation examples** from the WebGPU repository
5. **Test with WebGPU test scenes** to verify functionality

## Compatibility Considerations

When developing with WebGPU:

- Implement fallbacks for browsers without support (consider WebGL for older browsers)
- Test thoroughly across different platforms and browsers
- Be aware of platform-specific limitations (e.g., Linux support)
- Use feature detection rather than browser detection
- Consider using WebGPU shims or compatibility libraries where available

## Related Technologies

- **WebGL**: Legacy 3D graphics API (predecessor)
- **Metal**: Native graphics API on macOS and iOS
- **Vulkan**: Cross-platform graphics API
- **DirectX 12**: Graphics API on Windows
- **WGSL**: WebGPU Shading Language

---

*Last Updated: December 2025*
*Data Source: CanIUse*
