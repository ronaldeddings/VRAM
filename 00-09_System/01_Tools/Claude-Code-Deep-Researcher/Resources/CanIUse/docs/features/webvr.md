# WebVR API Documentation

## Overview

The **WebVR API** is a web standard that provides access to virtual reality (VR) devices, including sensors and head-mounted displays (HMDs). This API enables developers to create immersive VR experiences directly within web browsers.

**Note:** WebVR has been superseded by the [WebXR Device API](/webxr), which is the modern replacement for VR and AR device access.

## Description

The WebVR API allows web applications to:

- Detect and access VR devices connected to the user's system
- Access sensor data from VR hardware (position, orientation, acceleration)
- Render content to head-mounted displays
- Provide immersive, full-screen VR experiences
- Handle user input from VR controllers and tracked motion devices

## Current Status

- **Specification Status:** Unofficial (`unoff`)
- **W3C Specification:** [WebVR Specification](https://w3c.github.io/webvr/)
- **Status Note:** WebVR is in development and is still changing. Due to this, there may be bugs within the W3C standard.

## Categories

- JavaScript API (`JS API`)

## Benefits and Use Cases

- **Immersive Entertainment:** Create VR games and interactive experiences
- **Virtual Tours:** Build 360-degree walkthroughs of buildings, properties, or locations
- **Training and Simulation:** Develop VR-based training applications for various industries
- **Data Visualization:** Present complex data in immersive 3D environments
- **Social VR:** Create collaborative virtual spaces and social experiences
- **Education:** Build interactive educational content in virtual environments

## Browser Support

### Legend

- **y** = Supported
- **y #** = Supported with notes
- **a** = Partial support with notes
- **n** = Not supported
- **n d** = Not supported (in development)
- **n d #** = Not supported but in development with notes

### Browser Support Table

| Browser | Version Range | Support Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 57-79 | `n d` | In development |
| | 80+ | `n` | Not supported |
| **Firefox** | 54 | `n d #1` | In development |
| | 55-148+ | `y #1` | Supported with notes |
| **Edge** | 15-18 | `y #2` | Supported with notes |
| | 79+ | `n` | Not supported |
| **Safari** | All versions | `n` | Not supported |
| **Opera** | 44-66 | `n d` | In development |
| | 67+ | `n` | Not supported |
| **iOS Safari** | All versions | `n` | Not supported |
| **Samsung Internet** | 4 | `y #3` | Supported with notes |
| | 5.0-29 | `a #3` | Partial support with notes |
| **Android Chrome** | All versions | `n` | Not supported |
| **Android Firefox** | All versions | `n` | Not supported |
| **Opera Mobile** | All versions | `n` | Not supported |
| **Opera Mini** | All versions | `n` | Not supported |
| **Android Browser** | All versions | `n` | Not supported |
| **Blackberry** | All versions | `n` | Not supported |
| **Internet Explorer** | All versions | `n` | Not supported |

## Support Notes

### Note #1: Firefox Support
- Available and enabled by default only on **Windows**
- Enabled in Firefox Nightly for iOS
- Firefox 73+ [requires a secure context using HTTPS](https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API#API_availability)

### Note #2: Edge Support
- [Was in development](https://blogs.windows.com/msedgedev/2016/09/09/webvr-in-development-edge/#3lMW05DTZXbXcK46.97) in the latest Edge builds
- Supported only on [Windows Mixed Reality](https://developer.microsoft.com/en-us/windows/mixed-reality)

### Note #3: Samsung Internet Support
- Supports only **Samsung Galaxy devices** with the Samsung Gear VR
- Limited to specific Samsung hardware ecosystem

## Important Requirements

**Hardware Requirements:** For a WebVR experience, a head-mounted display (VR HMD) is required. The API cannot provide VR experiences without compatible VR hardware.

## Usage Statistics

- **Support (Full):** 1.81%
- **Support (Partial):** 1.92%
- **Total Support:** 3.73%

## Related APIs and Keywords

- **API Methods:** `getVRDevices`, `getVRDisplays`, `getDisplays`
- **Navigator Property:** `navigator.vr`
- **Related Standard:** [WebXR Device API](https://www.w3.org/TR/webxr-device-api/) (recommended replacement)

## Migration Guide

Since WebVR is being superseded, developers are encouraged to migrate to **WebXR Device API**, which provides:

- Better support across modern browsers
- Extended Reality (XR) capabilities including AR
- Improved API design and standards compliance
- Broader hardware compatibility

## Relevant Resources

### Official Documentation
- [MDN Web Docs - WebVR API](https://developer.mozilla.org/en-US/docs/Web/API/WebVR_API) - Comprehensive documentation and tutorials

### Community Resources
- [WebVR Info](https://webvr.info/) - Community information and resources
- [webvr.rocks](https://webvr.rocks/) - Detailed device support information

### Development Tools
- [WebVR Polyfill](https://github.com/googlevr/webvr-polyfill) - Polyfill for WebVR support in browsers that lack native implementation
- [A-Frame](https://aframe.io) - WebVR framework for building immersive web experiences

### Standards
- [Chrome Platform Status](https://www.chromestatus.com/feature/5680169905815552) - Chrome Platform Status for WebXR Device API

## Implementation Considerations

1. **Feature Detection:** Always check for WebVR support before attempting to use the API
2. **HTTPS Required:** Modern implementations require secure contexts (HTTPS)
3. **Hardware Compatibility:** Ensure users have compatible VR hardware
4. **Fallback Options:** Provide non-VR alternatives for users without VR devices
5. **Performance:** Maintain high frame rates (typically 90+ fps) for comfortable VR experiences
6. **Migration Path:** Consider WebXR Device API for new projects

## Summary

WebVR API enables developers to create web-based virtual reality experiences. While it has limited browser support and is being superseded by WebXR, it remains relevant for specific use cases, particularly on devices with native VR support (Firefox on Windows, Samsung devices). Developers should monitor WebXR adoption and plan migration strategies accordingly.
