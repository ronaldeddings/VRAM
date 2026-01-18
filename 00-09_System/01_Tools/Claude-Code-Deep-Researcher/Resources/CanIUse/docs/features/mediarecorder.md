# MediaRecorder API

## Overview

The **MediaRecorder API** (MediaStream Recording) provides developers with a straightforward mechanism to record media streams from user input devices and use them directly in web applications. This eliminates the need for manual encoding operations on raw PCM data and simplifies the media capture workflow.

## Description

The MediaRecorder API enables web developers to record audio and video from media streams with minimal complexity. Instead of dealing with raw audio data or performing complex encoding operations, developers can use the MediaRecorder interface to:

- Capture audio and video from user devices (microphone, camera)
- Record media streams in real-time
- Generate media files without manual encoding
- Instantly integrate captured content into web applications

This API is part of the MediaStream Recording specification and provides a high-level abstraction over lower-level media capture operations.

## Specification Status

**Status:** Working Draft (WD)

**Specification URL:** https://w3c.github.io/mediacapture-record/MediaRecorder.html

The MediaRecorder API is still in the working draft phase at the W3C, meaning it may continue to evolve before reaching full standardization. However, it has achieved widespread browser support and is suitable for production use.

## Categories

- **DOM** - Document Object Model API
- **JS API** - JavaScript Programming Interface

## Use Cases & Benefits

### Primary Use Cases

1. **Audio Recording**
   - Voice memos and note-taking applications
   - Podcast and audio blog platforms
   - Voice message and communication features
   - Music composition and audio editing

2. **Video Recording**
   - Screen recording and streaming applications
   - Video conferencing and communication tools
   - Content creation platforms
   - Presentation and training materials

3. **WebRTC Applications**
   - Recording video calls and conferences
   - Broadcasting and live streaming
   - Media archival and storage

4. **Interactive Media**
   - User-generated content platforms
   - Interactive tutorials and training
   - Gaming and streaming applications
   - Social media features

### Key Benefits

- **Simplified API** - Easy-to-use JavaScript interface
- **Real-time Processing** - Instant media capture without complex encoding
- **Cross-browser Compatibility** - Excellent support across modern browsers
- **No Manual Encoding** - Automatic handling of media encoding
- **Flexible Format Support** - Records in various audio/video containers
- **Stream-based Architecture** - Works seamlessly with MediaStream API

## Browser Support

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| **Chrome** | 49 (2016) | ✓ Full Support |
| **Edge (Chromium)** | 79 (2020) | ✓ Full Support |
| **Firefox** | 29 (2014) | ✓ Full Support |
| **Safari** | 14.1 (2021) | ✓ Full Support |
| **Opera** | 36 (2015) | ✓ Full Support |
| **iOS Safari** | 14.5 (2021) | ✓ Full Support |
| **Android Browser** | No support | ✗ |
| **Samsung Internet** | 5.0 (2016) | ✓ Full Support |
| **UC Browser** | 15.5 | ✓ Support |
| **Opera Mini** | — | ✗ Not Supported |
| **Internet Explorer** | — | ✗ Not Supported |

### Global Usage

- **Supported:** 91.99% of users worldwide
- **Partial Support:** 0%
- **No Support:** ~8% of users

## Detailed Browser Coverage

### Desktop Browsers

- **Chrome** - Full support from version 49 onwards
- **Edge** - Full support from version 79 onwards (Chromium-based)
- **Firefox** - Full support from version 29 onwards
- **Safari** - Full support from version 14.1 onwards
- **Opera** - Full support from version 36 onwards
- **Internet Explorer** - Not supported

### Mobile Browsers

- **iOS Safari** - Full support from iOS 14.5 onwards
- **Android Chrome** - Full support
- **Samsung Internet** - Full support from version 5.0 onwards
- **Opera Mobile** - Full support from version 80 onwards
- **Opera Mini** - Not supported
- **Android Firefox** - Limited support (v144)
- **UC Browser (Android)** - Supported from version 15.5
- **KaiOS** - Supported from version 2.5 onwards

## Implementation Notes

### Experimental Features & Limitations

**Chrome (47-48)** - Available via experimental Web Platform features flag
- Note: Limited to video recording only; audio recording not supported in these early versions

**Safari (12.1-14)** - Can be enabled via:
- Develop > Experimental Features menu
- Note: Requires enabling experimental features for full functionality

**iOS Safari (12.0-14.4)** - Can be enabled via:
- Advanced > Experimental Features menu
- Note: Requires explicit feature flag enablement

### Format Considerations

The MediaRecorder API supports recording in multiple MIME types depending on browser capabilities:
- Common formats: WebM (VP8/VP9), MP4 (H.264), and others depending on browser
- Audio-only recording is supported on all modern browsers with recent versions
- Video recording support is universal on current browsers

## Related Features

**Related API:** MediaStream API (parent)

The MediaRecorder API builds upon and extends the MediaStream Recording specification for complete media capture capabilities.

## Resources & References

### Official Documentation
- [MDN Web Docs - MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder_API)

### W3C Specifications
- [MediaStream Recording Specification](https://w3c.github.io/mediacapture-record/MediaRecorder.html)

### Related Standards
- MediaStream API (getUserMedia)
- Web Audio API
- WebRTC

## Basic Usage Example

```javascript
// Check browser support
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Request microphone and/or camera access
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(stream => {
      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      // Collect data chunks
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      // Handle stop event
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        // Use the recorded media
      };

      // Start recording
      mediaRecorder.start();

      // Stop recording after 10 seconds
      setTimeout(() => mediaRecorder.stop(), 10000);
    })
    .catch(error => console.error('Error accessing media devices:', error));
} else {
  console.log('MediaRecorder API not supported in this browser');
}
```

## Compatibility Notes

- **Vendor Prefixes:** Not required (native support in modern browsers)
- **Polyfills:** Available for older browsers, though less common
- **Feature Detection:** Use `typeof MediaRecorder !== 'undefined'` to check support
- **Graceful Degradation:** Provide alternative fallbacks for unsupported browsers

## Performance Considerations

- Recording quality and format depend on browser implementation
- Resource usage (CPU, memory) varies based on media codec and quality settings
- Consider implementing quality options to balance file size and quality
- Test performance on target devices, especially mobile platforms

## Security & Privacy

- Requires explicit user permission (getUserMedia permission request)
- Users can control which devices are accessible
- Recorded data remains under application control until explicitly shared
- Consider implementing proper consent and privacy disclosures

---

*Last Updated: 2025*

*Global Browser Support: 91.99%*

*Documentation generated from Can I Use data*
