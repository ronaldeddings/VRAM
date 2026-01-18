# HTML Media Capture

## Overview

HTML Media Capture provides a standardized way to facilitate user access to a device's media capture mechanisms—such as a camera or microphone—directly from within a file upload control. This feature enables web applications to offer native media capture capabilities without requiring users to navigate through their device's file system.

## Description

The HTML Media Capture specification extends the file input element with a `capture` attribute, allowing developers to indicate that the user should be prompted to use the device's camera, microphone, or other media capture hardware instead of selecting from existing files. This is particularly useful for mobile applications that need to capture photos, videos, or audio recordings directly from the user's device.

## Specification Status

**Status:** Recommendation (REC)
**Specification URL:** [W3C HTML Media Capture](https://w3c.github.io/html-media-capture/)

The HTML Media Capture specification has achieved W3C Recommendation status, indicating that it is a stable standard suitable for implementation in web browsers.

## Categories

- **HTML5**

## Benefits & Use Cases

### Primary Benefits

- **Native Integration:** Direct access to device camera/microphone without third-party plugins
- **Improved UX:** Streamlined media capture flow reduces user friction
- **Mobile-Friendly:** Particularly valuable for mobile and tablet applications
- **Progressive Enhancement:** Gracefully degrades in unsupported browsers
- **Accessibility:** Provides alternative to file system navigation for media input

### Common Use Cases

1. **Photo Upload Applications**
   - Social media platforms with photo sharing
   - Document scanning applications
   - Real estate listing platforms

2. **Video Recording**
   - Interview or testimonial recording
   - User-generated video content
   - Live streaming applications

3. **Audio Capture**
   - Voice message recording
   - Audio note applications
   - Voice-to-text transcription interfaces

4. **Identity Verification**
   - Document capture for verification
   - Video proof of identity
   - Selfie-based authentication

5. **Mobile-First Applications**
   - Fitness tracking apps
   - Delivery and logistics apps
   - Field inspection tools

## Browser Support

### Support Summary

HTML Media Capture has **strong mobile support** with excellent coverage across iOS Safari and Android browsers, but **very limited desktop browser support**. Support is most widespread on mobile devices where media capture is most practical.

### Detailed Browser Support Table

| Browser | Version(s) | Support | Notes |
|---------|-----------|---------|-------|
| **Chrome** | All versions | ❌ Not supported | No support across all tested versions |
| **Firefox** | All versions | ❌ Not supported | No support across all tested versions |
| **Safari** | All versions | ❌ Not supported | No support on desktop Safari |
| **Edge** | All versions | ❌ Not supported | No support across all tested versions |
| **Opera** | All versions | ❌ Not supported | No support across all tested versions |
| **Internet Explorer** | 5.5-11 | ❌ Not supported | Not supported |
| **iOS Safari** | 6.0+ | ✅ **Supported*** | Supported from iOS 6 onwards with limitations |
| **Android Browser** | 2.2+ | ✅ **Supported*** | Supported from Android 2.2 onwards with limitations |
| **Android Chrome** | 142+ | ✅ Supported | Full support in current versions |
| **Android Firefox** | 144+ | ✅ Supported | Full support in current versions |
| **Samsung Internet** | 4.0+ | ✅ Supported | Supported across all versions tested |
| **Opera Mobile** | 80+ | ✅ Supported | Support added in version 80 |
| **Opera Mini** | All versions | ❌ Not supported | Not supported |
| **Baidu Browser** | 13.52+ | ✅ Supported | Supported in current versions |
| **UC Browser** | 15.5+ | ⚠️ Partial | Limited support with capture button for file inputs |
| **BlackBerry** | 10+ | ✅ Supported | Supported from BB10 onwards |
| **IE Mobile** | 10-11 | ❌ Not supported | Not supported |

### Legend

- ✅ **Fully Supported** - Complete HTML Media Capture support
- ⚠️ **Partial Support** - Limited or partial implementation
- ❌ **Not Supported** - No support

**\* with limitations** - See notes below for details

## Implementation Notes

### Important Limitations

#### iOS Safari (Note #1)
- **Does not support the `capture` attribute** for forcing direct capture from device camera or microphone
- Users must manually select "Take Photo/Video" from the file picker interface
- Default video dimensions are 480×320 pixels (4:3 aspect ratio)
- Works with standard `<input type="file">` elements but requires user to explicitly choose capture mode

#### Android 2.2-2.3 (Note #2)
- Early Android versions do **not support the `capture` attribute**
- Later versions (3.0+) support the attribute fully
- Recommend feature detection for applications targeting older Android versions

#### UC Browser (Note #3)
- Provides a "capture" button for any `<input type="file">` field
- Works regardless of whether the `capture` attribute is explicitly used
- Implementation differs from standard specification but provides functional media capture

### Basic Syntax

```html
<!-- Capture image from camera -->
<input type="file" accept="image/*" capture="environment">

<!-- Capture video from camera -->
<input type="file" accept="video/*" capture="environment">

<!-- Capture audio from microphone -->
<input type="file" accept="audio/*" capture="user">

<!-- Capture from front-facing camera -->
<input type="file" accept="image/*" capture="user">

<!-- Capture without specifying source (browser choice) -->
<input type="file" accept="image/*" capture>
```

### Capture Attribute Values

- `capture="user"` - Use the front-facing/user-facing camera
- `capture="environment"` - Use the rear/environment-facing camera
- `capture` (no value) - Accept any suitable capture device
- Omit attribute - Fall back to file picker behavior

### Usage Statistics

- **Global Support:** ~54.68% of users (full support)
- **Partial Support:** ~0.57% of users (limited features)
- **No Support:** ~44.75% of users

## Code Examples

### Basic Image Capture

```html
<form>
  <label for="photo">Take a Photo:</label>
  <input type="file" id="photo" accept="image/*" capture="environment">
  <button type="submit">Submit</button>
</form>
```

### Video Capture

```html
<form>
  <label for="video">Record a Video:</label>
  <input type="file" id="video" accept="video/*" capture="environment">
  <button type="submit">Submit</button>
</form>
```

### Progressive Enhancement

```html
<!-- With fallback for unsupported browsers -->
<input type="file"
       id="media"
       accept="image/*,video/*"
       capture="environment"
       title="Take a photo or video, or select from files">
```

### JavaScript Feature Detection

```javascript
// Check if HTML Media Capture is supported
function supportsMediaCapture() {
  const input = document.createElement('input');
  return 'capture' in input;
}

if (supportsMediaCapture()) {
  console.log('HTML Media Capture is supported');
} else {
  console.log('HTML Media Capture is not supported');
}
```

## Related Standards

- [File API](https://w3c.github.io/FileAPI/) - Underlying file handling
- [HTML Living Standard](https://html.spec.whatwg.org/) - HTML input element specification
- [Media Capture and Streams API](https://w3c.github.io/mediacapture-main/) - More advanced media access
- [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) - Real-time media access alternative

## Resources & Links

### Official Documentation

- [W3C HTML Media Capture Specification](https://w3c.github.io/html-media-capture/)

### Tutorials & Guides

- [Correct Syntax for HTML Media Capture](https://addpipe.com/blog/correct-syntax-html-media-capture/) - Detailed syntax guide and best practices
- [HTML Media Capture Test Bench](https://addpipe.com/html-media-capture-demo/) - Interactive testing tool

### References

- [Programming the Mobile Web: File Upload Compatibility](https://books.google.com.au/books?id=gswdarRZVUoC&pg=PA263&dq=%22file+upload+compatibility+table%22) - Reference material on file upload compatibility

### MDN Web Docs

- [MDN: HTML Media Capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture)

## Recommendations

### When to Use HTML Media Capture

✅ **Recommended For:**
- Mobile-first applications where media capture is a primary feature
- iOS Safari applications requiring simple photo/video capture
- Android applications targeting modern devices
- Progressive web apps that need basic media capture
- Applications where users can accept file picker as fallback

❌ **Not Recommended For:**
- Desktop-only applications (very limited support)
- Applications requiring cross-browser desktop support
- Advanced media processing (use WebRTC/getUserMedia instead)
- Complex video editing workflows
- Real-time audio/video streams

### Best Practices

1. **Feature Detection:** Always check for support before relying on the feature
2. **Graceful Degradation:** Provide file picker as fallback for unsupported browsers
3. **Clear Labels:** Indicate to users that they can capture media or choose files
4. **Accept Attributes:** Always specify `accept` attribute to filter file types
5. **Mobile Testing:** Test extensively on actual mobile devices and browsers
6. **Accessibility:** Provide clear instructions and keyboard alternatives
7. **Permissions:** Be aware that users may need to grant camera/microphone permissions
8. **Privacy:** Transparently communicate how captured media will be used

### Alternative Solutions

For more control or desktop support, consider these alternatives:

- **WebRTC/getUserMedia API** - Direct media stream access with real-time processing
- **File Input Fallback** - Simple `<input type="file">` without capture attribute
- **Custom Native Apps** - For maximum control and features
- **Canvas API** - For image manipulation after capture

## Compatibility Notes

### Desktop Browsers

Desktop browser support remains minimal across all major browsers (Chrome, Firefox, Safari, Edge, Opera). If desktop capture is required, implement fallback mechanisms using the standard file input or consider WebRTC-based solutions.

### Mobile Browsers

Mobile support is significantly better, with comprehensive coverage across:
- iOS Safari (with limitations on forced capture)
- Android default browser and Chrome
- Samsung Internet
- Modern Opera Mobile builds

### Legacy Devices

- Android 2.2-2.3: Support present but without `capture` attribute
- Older iOS versions: May not support the feature
- Always implement progressive enhancement and feature detection

## Last Updated

This documentation is based on CanIUse data as of December 2025. Browser support is continuously evolving, so check the official CanIUse page and W3C specification for the latest information.

---

**See Also:** [CanIUse HTML Media Capture](https://caniuse.com/html-media-capture)
