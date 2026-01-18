# getUserMedia/Stream API

## Overview

The **getUserMedia/Stream API** provides a method of accessing external device data such as webcam video streams and microphone audio streams directly from a web browser. This API was formerly envisioned as the `<device>` element but has evolved into the modern **Media Capture API** specification.

## Description

The getUserMedia API enables web applications to request permission from users to access media input devices (cameras and microphones) and obtain streams of audio and/or video data. This is the foundation for real-time communication features, video conferencing, screen recording, and other media-rich web applications.

The API provides a standardized way to:
- Request user permission to access cameras and microphones
- Obtain media streams from connected devices
- Handle permission denial and device errors gracefully
- Integrate media streams with audio/video elements and WebRTC connections

## Specification Status

**Current Status:** Candidate Recommendation (CR)

- **Specification URL:** [W3C Media Capture Streams](https://www.w3.org/TR/mediacapture-streams/)

## Categories

- JavaScript API

## Use Cases & Benefits

### Primary Use Cases

1. **Video Conferencing & Real-Time Communication**
   - Enable peer-to-peer or multi-party video calls
   - Integrate with WebRTC for browser-based communication

2. **Live Streaming**
   - Capture and stream live video from webcams
   - Create content directly in the browser

3. **Photo & Video Capture**
   - Build web-based photo booth applications
   - Enable screen recording functionality

4. **Accessibility & Assistive Tech**
   - Provide real-time captioning using audio input
   - Enable sign language interpretation capture

5. **Creative & Media Applications**
   - Build audio/video editing tools
   - Create visual effects and filters on live camera feed

6. **Security & Surveillance**
   - Implement browser-based security monitoring
   - Remote inspection and documentation

### Key Benefits

- **Native browser capability** - No plugins or native applications required
- **User-controlled permissions** - Users must explicitly grant access to devices
- **Standards-based** - Consistent API across modern browsers
- **Real-time processing** - Direct access to media streams for low-latency applications
- **Integration with web standards** - Works seamlessly with Web Audio API, WebRTC, Canvas, etc.

## Browser Support

### Support Legend

- **✅ Yes** - Fully supported
- **🔶 Partial** - Supported with limitations (see notes)
- **❌ No** - Not supported

### Desktop Browsers

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 53 | Full support from Chrome 53+. Versions 21-52 had partial support with older spec. Secure contexts only (HTTPS) from Chrome 47+. |
| Firefox | 36 | Partial support (flags required) in Firefox 17-35. Full support from Firefox 36+. |
| Safari | 11 | Full support from Safari 11+. Not supported in earlier versions. |
| Edge | 12 | Full support from Edge 12+. Chromium-based Edge (79+) fully supported. |
| Opera | 40 | Full support from Opera 40+. Partial support in earlier versions (18-39 required flags/extensions). |
| Internet Explorer | None | ❌ Not supported in any version |

### Mobile Browsers

| Platform | Browser | Minimum Version | Notes |
|----------|---------|-----------------|-------|
| iOS Safari | 11.0+ | Full support with limitations. Before iOS 14.3, `getUserMedia` returned no video input devices in UIWebView or WKWebView; only worked in Safari directly. Does not work in standalone ("installed") PWAs before iOS 13.4. |
| Android Chrome | 142+ | Full support. |
| Android Firefox | 144+ | Full support. |
| Samsung Internet | 6.2+ | Partial support (6.2-6.4), Full support from 7.2+. |
| Opera Mobile | 80+ | Full support from Opera Mobile 80+. Partial support in earlier versions. |
| UC Browser | 15.5+ | Full support. |
| Android WebView | Limited | Not supported by default in Android webviews (e.g., Facebook, Snapchat in-app browsers). |

### Legacy & Discontinued Browsers

| Browser | Support |
|---------|---------|
| Opera Mini | ❌ Not supported |
| BlackBerry | Partial support (BB 10) |
| Internet Explorer Mobile | ❌ Not supported |

## API Usage

### Modern API (Recommended)

```javascript
// Request audio and video streams
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: { width: 1280, height: 720 }
})
  .then(stream => {
    // Use the stream
    const video = document.querySelector('video');
    video.srcObject = stream;
  })
  .catch(error => {
    console.error('Error accessing media devices:', error);
  });
```

### Legacy API (Deprecated)

```javascript
// Older navigator.getUserMedia API (deprecated)
navigator.getUserMedia({
  audio: true,
  video: true
}, function(stream) {
  // Legacy code
}, function(error) {
  console.error(error);
});
```

## Important Notes

### Security & HTTPS Requirement

- As of Chrome 47, `getUserMedia` cannot be called from insecure (HTTP) origins
- All modern browsers require HTTPS or localhost for security reasons
- Users must explicitly grant permission via browser prompts

### Browser-Specific Limitations

1. **Older Chromium Browsers** - Blink-based and some other browsers support an older version of the spec that does not use `srcObject`. See [Chromium issue 387740](https://code.google.com/p/chromium/issues/detail?id=387740).

2. **Legacy API Support** - Some browsers support the older `navigator.getUserMedia` API instead of the newer `navigator.mediaDevices.getUserMedia` API. The legacy API is deprecated and should not be used in new code.

3. **iOS Limitations (Pre-14.3)** - Before iOS 14.3, `getUserMedia` returned no video input devices in UIWebView or WKWebView, but only when accessed directly in Safari.

4. **Android WebView** - `getUserMedia()` is not supported by default in Android webviews, such as Facebook or Snapchat in-app browsers. Users must use the native browser application.

5. **Opera Versions** - Until version 12.16, Opera supported video context only, not audio.

## Permissions & User Experience

- **User Consent Required** - Browsers display a permission prompt when the page requests access
- **Persistent Permissions** - Users can grant permanent access to devices
- **Permission Revocation** - Users can revoke access at any time through browser settings
- **Error Handling** - Applications should gracefully handle permission denials and device unavailability

## Related APIs

- **WebRTC** - For peer-to-peer communication using media streams
- **Web Audio API** - For processing and analyzing audio streams
- **Canvas API** - For capturing video frames and applying effects
- **MediaRecorder** - For recording media streams to files
- **Screen Capture API** - For capturing screen content instead of device input

## Progressive Enhancement

For browsers without `getUserMedia` support, consider:
- Providing fallback solutions (uploaded files, external services)
- Using feature detection with proper error handling
- Offering alternative interaction methods

```javascript
// Feature detection
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Use modern API
} else if (navigator.getUserMedia) {
  // Use legacy API with appropriate warnings
} else {
  // Provide fallback
}
```

## References & Resources

### Official Documentation

- [W3C Media Capture Streams Specification](https://www.w3.org/TR/mediacapture-streams/)
- [MDN: getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [WebPlatform Docs](https://webplatform.github.io/docs/dom/Navigator/getUserMedia)

### Articles & Guides

- [Technology Preview from Opera](https://dev.opera.com/blog/webcam-orientation-preview/)
- [Media Capture Functionality in Microsoft Edge](https://blogs.windows.com/msedgedev/2015/05/13/announcing-media-capture-functionality-in-microsoft-edge/)
- [getUserMedia in PWA with Manifest on iOS 11](https://stackoverflow.com/questions/50800696/getusermedia-in-pwa-with-manifest-on-ios-11)
- [getUserMedia Working Again in PWA on iOS 13.4](https://bugs.webkit.org/show_bug.cgi?id=185448#c84)

### Browser Support Data

- **Global Usage:** 93.05% of users have full support
- **Partial Support:** 0.1% of users have partial support
- **No Support:** 6.85% of users

## Implementation Best Practices

1. **Always Request HTTPS** - Ensure your application runs on a secure connection
2. **Check Browser Support** - Use feature detection before calling the API
3. **Handle Errors Gracefully** - Provide meaningful feedback when permissions are denied
4. **Optimize Constraints** - Request only necessary media (audio/video) and resolution
5. **Stop Streams When Done** - Call `stop()` on all tracks to free device resources
6. **Provide User Feedback** - Indicate when the camera/microphone is active
7. **Respect User Privacy** - Be transparent about what data you're capturing

## Version Information

| Format | Value |
|--------|-------|
| Chrome ID | 6067380039974912, 6605041225957376 |
| Keywords | camera, device, getUserMedia, media stream, mediastream, Media Capture API |
| Specification Version | Candidate Recommendation |

---

**Last Updated:** December 2024
**Data Source:** CanIUse.com
