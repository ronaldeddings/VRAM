# WebCodecs API

## Overview

The **WebCodecs API** provides developers with low-level access to media encoding and decoding operations in the browser. It enables fine-grained control over the encoding and decoding of audio, video, and images, allowing for advanced media processing scenarios without relying solely on platform-level implementations.

## Description

The WebCodecs API is a set of Web APIs that allow JavaScript code to encode and decode audio, video, and image data with direct control over codec parameters and data flow. This API exposes the underlying media codecs available on the user's system, enabling sophisticated media applications to:

- Encode raw audio and video frames
- Decode compressed media streams
- Process audio and video frame-by-frame
- Build custom media pipelines
- Implement advanced streaming applications
- Create video transcoding solutions
- Develop screen recording tools

## Specification Status

**Status:** Working Draft (WD)
**Specification:** [W3C WebCodecs](https://w3c.github.io/webcodecs/)

The WebCodecs API is currently in the Working Draft stage of the W3C standardization process. This means the specification is still under development and may be subject to change before final standardization.

## Categories

- **JavaScript API**: Core web platform feature exposed through JavaScript interfaces

## API Components

The WebCodecs API includes several key interfaces:

- **VideoDecoder**: Decode compressed video frames
- **AudioDecoder**: Decode compressed audio samples
- **VideoEncoder**: Encode raw video frames
- **AudioEncoder**: Encode raw audio samples
- **EncodedAudioChunk**: Represents encoded audio data
- **EncodedVideoChunk**: Represents encoded video data
- **AudioData**: Represents decoded audio samples
- **VideoFrame**: Represents decoded video frames
- **VideoColorSpace**: Specifies color space properties
- **ImageDecoder**: Decode image data
- **ImageTrackList**: Manage multiple image tracks
- **ImageTrack**: Individual image track information

## Benefits & Use Cases

### Key Benefits

1. **Fine-Grained Control**: Direct control over encoding/decoding parameters rather than relying on `<video>` or `<audio>` elements
2. **Codec Flexibility**: Access to multiple codecs available on the platform
3. **Performance**: Hardware-accelerated encoding/decoding where available
4. **Custom Pipelines**: Build specialized media processing workflows
5. **Real-Time Processing**: Handle audio and video streams in real-time
6. **Advanced Scenarios**: Enable use cases not possible with standard media elements

### Practical Applications

- **Video Conferencing**: Custom audio/video processing for improved quality
- **Live Streaming**: Server-side and client-side transcoding
- **Screen Recording**: Capture and encode screen content
- **Media Editing**: Frame-by-frame video processing
- **Game Development**: Real-time video/audio capture and processing
- **Accessibility**: Custom audio/video processing for users with specific needs
- **Content Protection**: Custom encryption and processing pipelines
- **Analytics**: Analyzing audio/video streams for metadata extraction
- **Machine Learning**: Preprocessing media data for ML models
- **Recording Applications**: Creating sophisticated recording tools with custom codecs

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|------------------|---|---------|
| **Chrome/Chromium** | v94 (Oct 2021) | ✅ Supported (v94+) | Full support in modern versions |
| **Edge** | v94 (Oct 2021) | ✅ Supported (v94+) | Same as Chrome (Chromium-based) |
| **Firefox** | v130 (Oct 2024) | ✅ Supported (v130+) | Recently added support |
| **Safari** | v16.4 (Mar 2023) | ⚠️ Partial (a #1) | Video-only support in v16.4-18.5 |
| **Safari** | v26.0+ | ✅ Supported | Full support in latest versions |
| **Opera** | v80 (Dec 2021) | ✅ Supported (v80+) | Follows Chromium implementation |

### Mobile Browsers

| Platform | Browser | Support | First Version |
|----------|---------|---------|---|
| **iOS** | Safari | ⚠️ Partial (v16.4-18.5) | Video-only support |
| **iOS** | Safari | ✅ Full (v26.0+) | Complete support |
| **Android** | Chrome | ✅ Full | v142+ |
| **Android** | Firefox | ❌ Not supported | Not available |
| **Android** | Opera | ✅ Full | v80+ |
| **Android** | Samsung Internet | ✅ Full | v17.0+ |
| **Android** | UC Browser | ✅ Full | v15.5+ |
| **Android** | Baidu | ✅ Full | v13.52+ |

### Deprecated/No Support

- **Internet Explorer**: ❌ Never supported
- **Opera Mini**: ❌ Not supported
- **Older Safari versions**: ❌ Not supported (before v16.4)
- **Older Firefox versions**: ❌ Not supported (before v130)
- **BlackBerry Browser**: ❌ Not supported

## Global Support Statistics

- **Full Support**: 82.75% of users
- **Partial Support**: 8.08% of users (Safari video-only)
- **No Support**: ~9% of users

## Implementation Notes

### Note #1: Video-Only Support (Safari v16.4-18.5, iOS Safari v16.4-18.5)

Safari versions between 16.4 and 18.5 provide **video-only support** for the WebCodecs API. This means:

- VideoDecoder: ✅ Available
- VideoEncoder: ✅ Available
- VideoFrame: ✅ Available
- AudioDecoder: ❌ Not available
- AudioEncoder: ❌ Not available
- AudioData: ❌ Not available
- ImageDecoder: ❌ Not available
- ImageTrackList: ❌ Not available
- ImageTrack: ❌ Not available

Applications targeting these Safari versions should feature-detect audio codec support or provide fallbacks.

## Feature Detection

```javascript
// Check if WebCodecs API is available
if (typeof VideoEncoder !== 'undefined') {
  console.log('WebCodecs API supported');
}

// Check for specific codec support
VideoEncoder.isConfigSupported({
  codec: 'vp09.00.41.08',
  width: 1920,
  height: 1080,
  bitrate: 5000000,
  framerate: 30
}).then(config => {
  if (config.supported) {
    console.log('VP9 encoding supported');
  }
});

// Check for audio codec support
if (typeof AudioEncoder !== 'undefined') {
  console.log('Audio encoding supported');
}
```

## Security & Performance Considerations

- **Hardware Acceleration**: Codecs leverage hardware encoders/decoders when available
- **Security**: Media data is processed in secure system components
- **Privacy**: User consent may be required for accessing media resources
- **Performance**: Use with caution in performance-critical applications
- **Codec Availability**: Codec support varies by platform and browser

## Related APIs

- **MediaRecorder API**: Higher-level recording API
- **Media Capabilities API**: Query codec support and characteristics
- **Canvas API**: Video frame processing and rendering
- **WebGL**: Advanced video processing and rendering
- **MediaSource Extensions**: Adaptive bitrate streaming
- **HTMLMediaElement**: Standard media playback elements

## References

### Official Documentation

- [W3C WebCodecs Specification](https://w3c.github.io/webcodecs/)
- [WebCodecs API on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- [Web.dev: Video Processing with WebCodecs](https://web.dev/webcodecs/)

### Resources & Samples

- [W3C WebCodecs Samples](https://w3c.github.io/webcodecs/samples/)
- [W3C WebCodecs Explainer Document](https://github.com/w3c/webcodecs/blob/main/explainer.md)
- [Firefox WebCodecs Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=WebCodecs)

## Implementation Checklist

When implementing WebCodecs in your project:

- [ ] Check for API availability using feature detection
- [ ] Query codec support using `isConfigSupported()`
- [ ] Handle platform-specific codec differences
- [ ] Implement fallbacks for unsupported browsers
- [ ] Test on target browsers and devices
- [ ] Monitor browser compatibility as implementations mature
- [ ] Consider performance impact on lower-end devices
- [ ] Handle hardware acceleration availability

## Browser Version Reference

| Browser | Supported Versions | First Support |
|---------|------------------|---|
| Chrome | 94+ | Oct 2021 |
| Edge | 94+ | Oct 2021 |
| Firefox | 130+ | Oct 2024 |
| Safari | 16.4+ (partial), 26.0+ (full) | Mar 2023 |
| Opera | 80+ | Dec 2021 |
| iOS Safari | 16.4+ (partial), 26.0+ (full) | Mar 2023 |
| Android Chrome | 142+ | 2024 |
| Samsung Internet | 17.0+ | 2024 |

---

**Last Updated:** 2024
**Specification Status:** Working Draft
**Global Support:** 82.75% (full support)
