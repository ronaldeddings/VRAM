# WebXR Device API

## Overview

The **WebXR Device API** provides web developers with standardized access to virtual reality (VR) and augmented reality (AR) devices, including sensors and head-mounted displays. This enables the creation of immersive web experiences that can interact with extended reality hardware directly from the browser.

## Description

WebXR is a JavaScript API that allows web applications to access and utilize VR and AR capabilities. It provides developers with the ability to:

- Detect and request access to XR devices (VR headsets, AR glasses, mobile AR)
- Create immersive experiences with proper head tracking and motion control
- Access sensor data from HMDs (head-mounted displays)
- Render content optimized for XR display capabilities
- Handle user input from XR controllers

## Specification Status

**Status:** [Candidate Recommendation (CR)](https://www.w3.org/TR/webxr/)

The WebXR Device API is being standardized by the W3C as part of the Immersive Web Working Group. While the specification is mature and actively implemented in browsers, some features are still under development with evolving specs.

## Categories

- **JS API** - Core JavaScript Web API for XR capabilities

## Benefits & Use Cases

### Key Benefits

- **Cross-Platform Immersive Experiences** - Develop VR/AR apps that work across different devices and platforms
- **No Installation Required** - Immersive experiences accessible directly from a web browser
- **Hardware Independence** - Single API works with various XR hardware manufacturers
- **Progressive Enhancement** - Enhance web experiences with XR capabilities when available
- **User Privacy & Security** - Requires explicit user permission before accessing devices
- **Standardized API** - Consistent interface across browsers and devices

### Common Use Cases

- **Virtual Reality Applications**
  - Immersive 3D product visualization
  - Virtual training and educational simulations
  - Collaborative virtual workspaces
  - VR gaming experiences

- **Augmented Reality Applications**
  - Furniture and product placement in real spaces
  - Navigation and wayfinding overlays
  - Industrial maintenance and repair guidance
  - Medical visualization and training

- **Mixed Reality Experiences**
  - Blended physical and digital interactions
  - Real-time data overlays on physical environments
  - Architectural visualization in real locations

## Browser Support

### Support Legend

- **✅ Supported** - Full or partial support with "a" notation
- **🔶 Development** - Behind experimental flag with "d" notation
- **❌ Not Supported** - No support with "n" notation
- **#1** - API is extensive; many features still in development with non-finalized specs
- **#2** - Requires enabling flag: `dom.vr.webxr.enabled`
- **#3** - Requires enabling experimental feature: "WebXR Device API"

### Browser Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 79+ | ✅ Full | Default support (#1) |
| **Edge** | 79+ | ✅ Full | Default support (#1) |
| **Opera** | 66+ | ✅ Full | Default support (#1) |
| **Samsung Internet** | 12+ | ✅ Full | Default support (#1) |
| **Firefox** | 77+ | 🔶 Behind Flag | Requires `dom.vr.webxr.enabled` flag (#2) |
| **Safari** | 13+ | 🔶 Experimental | Requires "WebXR Device API" feature flag (#3) |
| **iOS Safari** | All | ❌ None | No support |
| **Android Chrome** | 142+ | ✅ Full | Default support (#1) |
| **Android Firefox** | 144 | 🔶 Behind Flag | Requires flag (#2) |
| **Opera Mobile** | 80+ | ✅ Full | Default support (#1) |
| **KaiOS** | 3.0+ | 🔶 Behind Flag | Requires flag (#2) |
| **IE** | All | ❌ None | No support |
| **Opera Mini** | All | ❌ None | Not supported |

### Global Support Summary

- **Supported by Default:** Chrome 79+, Edge 79+, Opera 66+, Samsung Internet 12+
- **Behind Experimental Flag:** Firefox 77+, Safari 13+
- **Mobile Support:** Android Chrome, Samsung Internet browser
- **Not Supported:** Internet Explorer, iOS Safari, Opera Mini

## Implementation Notes

### Important Considerations

1. **API Maturity & Stability**
   - The WebXR API is extensive with many features still under development
   - Some features do not have finalized specifications yet (#1)
   - Be prepared for potential API changes as the specification evolves

2. **Feature Detection**
   - Always check for `navigator.xr` before using WebXR
   - Use feature detection to gracefully handle unsupported browsers
   - Request appropriate XR session types when needed

3. **User Permissions**
   - WebXR requires explicit user permission to access devices
   - Requests must be made in response to user interaction
   - Browser will prompt user to select XR device or deny access

4. **Hardware Requirements**
   - VR headsets (e.g., Meta Quest, SteamVR, PlayStation VR)
   - AR-capable mobile devices
   - Controllers and input devices vary by hardware

5. **Flag Requirements**
   - Firefox users must enable `dom.vr.webxr.enabled` flag
   - Safari users must enable the "WebXR Device API" experimental feature
   - End users may need to manually enable these features

### Security & Privacy

- Requires HTTPS for web content
- User consent required before device access
- No implicit tracking or background access
- Careful handling of sensor data

## Relevant Resources

### Official Specifications & Documentation

- [W3C WebXR Device API Specification](https://www.w3.org/TR/webxr/)
- [MDN Web Docs - WebXR Device API](https://developer.mozilla.org/docs/Web/API/WebXR_Device_API)

### Implementation Examples & Samples

- [Immersive Web - WebXR Samples](https://immersive-web.github.io/webxr-samples/) - Official sample code and tutorials

### Browser Implementation Status

- [Safari WebXR Implementation Bug](https://bugs.webkit.org/show_bug.cgi?id=208988) - Track Safari WebXR progress

## Usage Statistics

- **Full Support (Y):** 0%
- **Partial Support (A):** 78.93%
- **Primary Implementation Method:** navigator.xr

## See Also

- [Web XR Device API - MDN](https://developer.mozilla.org/docs/Web/API/WebXR_Device_API)
- [Immersive Web Community Group](https://www.w3.org/community/immersiveweb/)
- [Three.js WebXR Examples](https://threejs.org/examples/?q=webxr)
- [Babylon.js WebXR Support](https://doc.babylonjs.com/features/featuresDeepDive/Babylon.js_and_WebXR)

---

*Last Updated: Based on CanIUse data as of December 2025*

*Note: WebXR support is rapidly evolving. Check browser documentation and https://caniuse.com for the latest compatibility information.*
