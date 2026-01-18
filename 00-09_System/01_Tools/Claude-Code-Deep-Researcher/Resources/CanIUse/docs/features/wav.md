# WAV Audio Format

## Overview

WAV (Waveform Audio File Format), also known as WAVE, is a typically uncompressed audio format that has been widely supported across modern web browsers. It provides lossless audio storage, making it ideal for applications where audio quality is paramount.

## Specification

- **Spec URL**: [WAV Format Specification](http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html)
- **Status**: Other (de facto standard)
- **Category**: Audio Formats

## Description

The WAV format is an uncompressed (or lightly compressed) audio format that preserves full audio fidelity. Unlike compressed formats such as MP3 or AAC, WAV files maintain the original audio quality without data loss, resulting in larger file sizes but superior sound quality.

## Current Support

| Metric | Value |
|--------|-------|
| Global Usage | 93.27% |
| Vendor Prefix Required | No |
| Parent Feature | `audio` element |

## Benefits & Use Cases

- **Lossless Quality**: Preserves original audio without compression artifacts
- **Professional Audio**: Suitable for music production, sound design, and mastering
- **Scientific Applications**: Used in acoustic research and audio analysis
- **Broad Compatibility**: Supported across all major browsers and platforms
- **Simple Format**: Standardized, well-documented audio container
- **Audio Editing**: Native support in digital audio workstations (DAWs)
- **Accessibility**: Clear, high-quality audio for narration and voice-over content

## Browser Support Table

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 8 | ✅ Supported (v146+) | Consistent support from early versions |
| **Firefox** | 3.5 | ✅ Supported (v148+) | Consistent support from v3.5 onwards |
| **Safari** | 4 | ✅ Supported (18.5-18.6+) | Full support across all versions |
| **Opera** | 10.5 | ✅ Supported (v122+) | Support from v10.5 onwards |
| **Edge** | 12 | ✅ Supported (v143+) | Full support since inception |
| **Internet Explorer** | 5.5-11 | ❌ Not Supported | No support in any IE version |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **iOS Safari** | 3.2 | ✅ Supported (18.5-18.7+) |
| **Chrome Mobile** | Latest | ✅ Supported (v142+) |
| **Firefox Mobile** | Latest | ✅ Supported (v144+) |
| **Samsung Internet** | 4.0 | ✅ Supported (v29+) |
| **Opera Mobile** | 11 | ✅ Supported (v80+) |
| **Android Browser** | 2.3+ | ✅ Supported (4.2+) |
| **UC Browser** | 15.5+ | ✅ Supported |
| **Baidu Browser** | 13.52+ | ✅ Supported |
| **QQ Browser** | 14.9+ | ✅ Supported |
| **KaiOS** | 2.5+ | ✅ Supported |
| **BlackBerry** | 7.0+ | ✅ Supported |
| **Opera Mini** | All versions | ❌ Not Supported |
| **IE Mobile** | 10-11 | ❌ Not Supported |

## Implementation

### Basic HTML Audio Element

```html
<audio controls>
  <source src="audio.wav" type="audio/wav">
  Your browser does not support the audio element.
</audio>
```

### JavaScript Audio API

```javascript
// Create an audio element
const audio = new Audio('audio.wav');

// Play the audio
audio.play();

// Load and manipulate with Web Audio API
fetch('audio.wav')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    });
  });
```

### Format Detection

```javascript
// Check if browser supports WAV audio
const audio = new Audio();
const canPlayWav = audio.canPlayType('audio/wav') !== '';

if (canPlayWav) {
  console.log('WAV audio is supported');
} else {
  console.log('WAV audio is not supported, use fallback');
}
```

## Important Notes

> **Note**: Support refers to this format's use in the `<audio>` element, not other conditions or applications.

The WAV format support data reflects compatibility with HTML5 audio elements. Some systems may have additional WAV support through other mechanisms (plugins, native applications, etc.).

## Fallback Strategies

For maximum compatibility, consider providing multiple audio formats:

```html
<audio controls>
  <source src="audio.wav" type="audio/wav">
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>
```

This ensures playback across browsers with varying format support.

## Related Resources

- [Wikipedia: WAV Audio Format](https://en.wikipedia.org/wiki/WAV)
- [MDN: HTML Audio Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- [MDN: Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Can I Use: WAV Audio Format](https://caniuse.com/wav)

## Summary

WAV audio format has excellent support across modern browsers (93.27% global usage) and is a reliable choice for web audio applications. With the exception of Internet Explorer and Opera Mini, virtually all browsers support WAV audio playback through the HTML5 `<audio>` element. For projects requiring maximum compatibility, providing fallback formats (MP3, OGG) is recommended.
