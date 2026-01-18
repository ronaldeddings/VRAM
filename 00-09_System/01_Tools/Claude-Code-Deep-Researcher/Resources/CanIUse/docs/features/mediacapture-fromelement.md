# Media Capture from DOM Elements API

## Overview

The **Media Capture from DOM Elements API** provides a way to capture real-time video and audio from DOM elements in the form of a `MediaStream`. This allows developers to access and process media content from `<video>`, `<audio>`, and `<canvas>` elements programmatically.

## Description

This API enables you to capture Real-Time video and audio from a DOM element, such as a `<video>`, `<audio>`, or `<canvas>` element via the `captureStream` method, in the form of a `MediaStream`. This is useful for scenarios like:

- Recording canvas animations
- Processing live video streams
- Creating composite media streams
- Building interactive media applications

## Specification Status

**Status:** Working Draft (WD)

**Specification URL:** [W3C Media Capture from DOM Elements](https://w3c.github.io/mediacapture-fromelement/)

The specification is actively being developed by the W3C and continues to evolve as browser implementations mature.

## Categories

- **DOM** - Part of the DOM API ecosystem
- **JS API** - JavaScript API for web developers

## Key Features and Use Cases

### Benefits

- **Canvas Recording**: Capture animations and graphics rendered on canvas elements
- **Media Processing**: Access and process video/audio streams programmatically
- **Stream Composition**: Create composite media streams from multiple sources
- **Real-time Processing**: Process media in real-time with access to raw frames
- **WebRTC Integration**: Easily integrate with WebRTC for peer-to-peer communication
- **Media Manipulation**: Apply filters, effects, and transformations to media

### Common Use Cases

1. **Video Recording**: Record canvas animations, screen sharing, or video compositions
2. **Live Streaming**: Capture and stream canvas content or video elements
3. **Media Analysis**: Process video frames for computer vision or analysis tasks
4. **Interactive Applications**: Build games, creative tools, and multimedia experiences
5. **Accessibility**: Process media content for captioning or accessibility features

## Browser Support

### Support Legend

- **Y** - Full support
- **A** - Partial support (see notes for details)
- **N** - Not supported
- **D** - Disabled by default

### Desktop Browsers

| Browser | First Support | Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 62 | ✅ Full Support | Full implementation |
| **Edge** | 79 | ✅ Full Support | Full implementation |
| **Firefox** | 43+ | ⚠️ Partial Support | Requires experimental flag |
| **Safari** | 11 | ⚠️ Partial Support | No video/audio capture support |
| **Opera** | 48 | ✅ Full Support | Full implementation |
| **Internet Explorer** | — | ❌ Not Supported | No support |

### Mobile Browsers

| Browser | First Support | Status | Notes |
|---------|---------------|--------|-------|
| **Android Chrome** | 142 | ✅ Full Support | Full implementation |
| **Android Firefox** | 144 | ⚠️ Partial Support | Requires experimental flag |
| **iOS Safari** | — | ❌ Not Supported | No support |
| **Samsung Internet** | 8.2 | ✅ Full Support | Full implementation (5.0+ partial) |
| **Opera Mobile** | 80 | ✅ Full Support | Full implementation (36-47 partial) |
| **UC Browser** | 15.5 | ✅ Full Support | Full implementation |
| **QQ Browser** | 14.9 | ✅ Full Support | Full implementation |
| **Baidu Browser** | 13.52 | ✅ Full Support | Full implementation |

### Other Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| **Opera Mini** | ❌ Not Supported | No support in any version |
| **IE Mobile** | ❌ Not Supported | No support |
| **BlackBerry** | ❌ Not Supported | No support |
| **Kaios** | ⚠️ Partial Support | Requires experimental flag |

### Overall Support Statistics

- **Full Support (Y):** 80.17% of users
- **Partial Support (A):** 3.64% of users
- **No Support (N):** 16.19% of users

## Important Notes

### Note #1: Video/Audio Capture Limitations in Safari

> Does not support capture from `<video>`/`<audio>`

Safari's implementation only supports capturing from `<canvas>` elements. You cannot capture streams from video or audio elements in Safari. Consider alternative approaches or progressive enhancement strategies for better cross-browser compatibility.

### Note #2: Experimental Features Flag

> Capture from `<video>`/`<audio>` can be enabled via the Experimental Web Platform Features flag.

In Firefox, Opera (versions 36-47), and other browsers, video and audio capture may require enabling experimental features through browser flags. Users need to enable this feature in their browser settings:

- **Firefox:** Enable `dom.streams.enabled` and related flags
- **Chrome (51-61):** Enable via flag in older versions
- **Opera:** Enable experimental features

## Usage Examples

### Capturing from Canvas

```javascript
const canvas = document.getElementById('myCanvas');
const stream = canvas.captureStream(30); // 30 FPS

// Use the stream with MediaRecorder
const recorder = new MediaRecorder(stream);
recorder.start();
```

### Capturing from Video Element

```javascript
const video = document.getElementById('myVideo');
const stream = video.captureStream();

// Process or send the stream to a peer connection
const peerConnection = new RTCPeerConnection();
peerConnection.addTrack(stream.getTracks()[0]);
```

### Capturing from Audio Element

```javascript
const audio = document.getElementById('myAudio');
const stream = audio.captureStream();

// Use the audio stream for processing
const audioContext = new AudioContext();
const source = audioContext.createMediaStreamAudioSourceNode(stream);
```

## Related Resources

### Official Documentation

- [**MDN Web Docs - HTMLCanvasElement.captureStream()**](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream)
  - Comprehensive guide to capturing from canvas elements

- [**MDN Web Docs - HTMLMediaElement.captureStream()**](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream)
  - Documentation for capturing from video and audio elements

### Guides and Articles

- [**Google Developers - Capture Stream**](https://developers.google.com/web/updates/2016/10/capture-stream)
  - Google's article and guide to using the API

## Implementation Considerations

### Browser Compatibility Strategy

For production applications, consider these approaches:

1. **Feature Detection**: Check for the `captureStream` method before using it
2. **Progressive Enhancement**: Provide fallback experiences for unsupported browsers
3. **Polyfills**: Evaluate available polyfills for broader support
4. **Platform-Specific Solutions**: Consider native implementations for mobile browsers without support

### Example Feature Detection

```javascript
function supportsCanvasCaptureStream() {
  const canvas = document.createElement('canvas');
  return typeof canvas.captureStream === 'function';
}

if (supportsCanvasCaptureStream()) {
  // Use captureStream API
} else {
  // Fallback implementation
}
```

### Performance Considerations

- Canvas capture is CPU-intensive; consider frame rate adjustments
- Audio capture requires proper handling of sample rates and channels
- Test on target devices, especially mobile platforms
- Monitor memory usage when working with streams

## Keywords

canvas, mediastream, capturestream, canvas.capturestream

## Last Updated

This documentation was generated from CanIUse feature data. Browser support information reflects the latest available data.
