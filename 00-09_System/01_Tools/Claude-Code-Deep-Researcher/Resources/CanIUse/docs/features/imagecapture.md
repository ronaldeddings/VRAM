# ImageCapture API

## Overview

The **Image Capture API** provides web developers with access to the video camera to capture photos while allowing detailed configuration of picture-specific settings such as zoom level and auto-focus metering area.

## Description

This API enables applications to:
- Take photos from the device's video camera
- Configure advanced capture settings including zoom, focus metering, and exposure control
- Access low-level camera capabilities for professional photography applications
- Build camera-based web applications without relying on native code

## Specification Status

- **Current Status**: Working Draft (WD)
- **Specification URL**: [W3C Media Capture Image](https://w3c.github.io/mediacapture-image/#imagecaptureapi)

## Categories

- DOM
- JS API

## Benefits and Use Cases

### Primary Benefits
- **Advanced Camera Control**: Direct access to camera settings and capabilities
- **High-Quality Image Capture**: Configure settings for optimal photo quality
- **Professional Photography Apps**: Enable web-based photography tools
- **Camera-Centric Applications**: Build specialized camera-based web experiences
- **Standard API**: Works across modern browsers with consistent interface

### Common Use Cases
- Photo editing web applications
- Document scanning applications
- Real-time image processing
- Social media photo capture interfaces
- Healthcare imaging systems
- E-commerce product photography tools
- Security camera monitoring systems
- Augmented reality applications requiring photo capture

## Browser Support

### Support Legend
- **Y** - Supported
- **N** - Not supported
- **N D** - Not supported, disabled by default (can be enabled)
- **A** - Partial support

### Desktop Browsers

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| Chrome | 59 | 146+ ✅ |
| Edge | 79 | 143+ ✅ |
| Firefox | — | Disabled by default (flag) |
| Safari | — | Technology Preview (partial) |
| Opera | 46 | 122+ ✅ |
| Internet Explorer | — | Not supported |

### Mobile Browsers

| Browser | Support Status |
|---------|----------------|
| Chrome for Android | 142+ ✅ |
| Samsung Internet | 5.0+ ✅ |
| Opera Mobile | 80+ ✅ |
| UC Browser | 15.5+ ✅ |
| Baidu Browser | 13.52+ ✅ |
| QQ Browser | 14.9+ ✅ |
| iOS Safari | Not supported |
| Firefox for Android | Not supported |
| Opera Mini | Not supported |
| Android Browser | 142+ ✅ |

### Overall Support Coverage
- **Global Support**: 80.18% (based on usage statistics)
- **Partial Support**: 0%

## Implementation Notes

### Firefox
Firefox supports only the `takePhoto()` method, and it must be enabled via the `about:config` entry `dom.imagecapture.enabled`.

### Chrome/Opera
Versions 53-58 (Chrome) and 40-45 (Opera) require enabling the Experimental Web Platform Features flag.

### Safari
Safari Technology Preview includes partial support that does not support the `grabFrame()` method.

### KaiOS
Early versions of KaiOS (2.5-3.1) have disabled-by-default support.

## Resources and Examples

### Demos and Examples
- **Minimal Code Example**: [Codepen Demo](https://codepen.io/miguelao/pen/ZOkOQw)
- **Extended Demo**: [Full Feature Demo](https://rawgit.com/Miguelao/demos/master/imagecapture.html)

### Tracking and References
- **Firefox Implementation Tracking**: [Mozilla Bugzilla #888177](https://bugzilla.mozilla.org/show_bug.cgi?id=888177)

## Technical Details

### API Methods
- **`takePhoto()`** - Captures a single photo with current settings
- **`grabFrame()`** - Captures the current frame from the video stream
- Configuration methods for camera settings (zoom, focus, exposure, etc.)

### Key Features
- Integration with MediaStream API
- Promise-based asynchronous interface
- Configurable photo capture settings
- Access to camera capabilities and constraints

## Getting Started

### Basic Implementation Example

```javascript
// Get video stream from camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    // Take a photo
    return imageCapture.takePhoto();
  })
  .then(blob => {
    // Use the captured photo
    const url = URL.createObjectURL(blob);
    console.log('Photo captured:', url);
  })
  .catch(err => console.error('Error:', err));
```

### Feature Detection

```javascript
if ('ImageCapture' in window) {
  console.log('ImageCapture API is supported');
} else {
  console.log('ImageCapture API is not supported');
}
```

## Compatibility Considerations

### When to Use
- When targeting modern Chromium-based browsers (Chrome, Edge, Opera)
- For applications requiring advanced camera controls
- When building progressive web apps with camera capabilities

### Fallbacks
- Consider polyfills for Firefox (with limited `takePhoto()` support)
- Provide alternative camera capture methods for unsupported browsers
- Use feature detection to gracefully degrade functionality

### Permission Requirements
- Requires user permission via `getUserMedia()`
- User must explicitly grant camera access
- HTTPS is required (except for localhost)

## Related APIs

- [MediaStream API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
- [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

## References

- [W3C Media Capture Image Specification](https://w3c.github.io/mediacapture-image/#imagecaptureapi)
- [MDN Web Docs - ImageCapture API](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture)
- [Can I Use - ImageCapture](https://caniuse.com/imagecapture)

---

*Last Updated: December 2024*
*Source: CanIUse.com Feature Database*
