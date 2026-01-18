# Audio Tracks

## Overview

**Audio Tracks** is an HTML5 feature that enables methods for specifying and selecting between multiple audio tracks within a single media element. This allows developers to provide alternative audio experiences including audio descriptions, director's commentary, additional languages, alternative takes, and more.

## Specification

- **Status**: Living Standard (Last Spec Update)
- **Specification**: [WHATWG HTML - AudioTrackList and VideoTrackList Objects](https://html.spec.whatwg.org/multipage/embedded-content.html#audiotracklist-and-videotracklist-objects)
- **Category**: HTML5
- **Usage**: 11.02% of global websites

## Key Features

The Audio Tracks API provides:

- **Multiple Audio Track Support**: Embed several audio tracks in a single media element
- **Track Enumeration**: Access all available tracks via the `audioTracks` property
- **Track Selection**: Enable/disable specific tracks dynamically
- **Track Properties**: Access metadata about each track (kind, label, language)
- **Event Handling**: Listen to track change events

## Benefits and Use Cases

### Accessibility
- **Audio Descriptions**: Provide descriptive audio for visually impaired users
- **Multiple Languages**: Offer audio in different languages without multiple video files
- **Adaptive Audio**: Switch between clear and background-music-included versions

### Content Enhancement
- **Director's Commentary**: Include alternate audio narration or commentary
- **Alternative Takes**: Provide different performance versions or edits
- **Dubbed Content**: Support multiple language dubs in a single player

### Educational Applications
- **Lecture Recordings**: Switch between lecture audio and background music tracks
- **Multilingual Learning**: Combine original audio with translations
- **Audio Tracks**: Provide primary and secondary audio channels for learning

### Streaming and Broadcasting
- **Live Events**: Support commentary in multiple languages simultaneously
- **Sports Coverage**: Switch between home and away team broadcasts
- **Podcast Variants**: Serve different versions (edited, unedited, extended)

## Browser Support

| Browser | First Support | Status |
|---------|:-------------:|--------|
| **Internet Explorer** | IE 10 | ![Supported](https://img.shields.io/badge/status-supported-brightgreen) |
| **Edge** | Edge 12-18 | ![Partial Support](https://img.shields.io/badge/status-disabled_by_default-yellow) (19+) |
| **Firefox** | 33+ | ![Partial Support](https://img.shields.io/badge/status-disabled_by_default-yellow) |
| **Chrome** | 45+ | ![Partial Support](https://img.shields.io/badge/status-disabled_by_default-yellow) |
| **Safari** | Safari 6.1 | ![Supported](https://img.shields.io/badge/status-supported-brightgreen) |
| **Opera** | 32+ | ![Partial Support](https://img.shields.io/badge/status-disabled_by_default-yellow) |
| **iOS Safari** | iOS 7.0+ | ![Supported](https://img.shields.io/badge/status-supported-brightgreen) |
| **Samsung Internet** | No support | ![Not Supported](https://img.shields.io/badge/status-not_supported-red) |
| **Android Browser** | No support | ![Not Supported](https://img.shields.io/badge/status-not_supported-red) |

### Support Legend

- **Supported** (green): Full native support without flags or configuration
- **Partial/Disabled by Default** (yellow): Feature available but requires enabling via browser flags
- **Not Supported** (red): Feature not available in this browser

## Detailed Browser Matrix

### Full Support Browsers
- **Safari**: 6.1 and later
- **iOS Safari**: 7.0+ and later
- **IE Mobile**: 10 and 11

### Partial Support (Requires Enabling)

#### Firefox
- Versions 33+: Supported via `media.track.enabled` setting
- How to enable: Navigate to `about:config` and set `media.track.enabled` to `true`

#### Chrome and Opera
- Chrome 45+, Opera 32+: Supported via experimental features flag
- How to enable: Visit `chrome://flags` or `opera://flags` and enable "enable-experimental-web-platform-features"

#### Edge
- Versions 12-18: Full support
- Versions 19+: Disabled by default via experimental features flag

### No Support
- Android Stock Browser
- BlackBerry Browser
- Opera Mini
- Samsung Internet Browser

## Usage

### Basic Implementation

```html
<!-- Define audio element with multiple tracks -->
<audio controls id="media">
  <source src="audio.mp3" type="audio/mpeg">
  <track kind="main" src="en-main.vtt" srclang="en" label="English">
  <track kind="alternative" src="en-alt.vtt" srclang="en" label="English (Alternative)">
  <track kind="descriptions" src="en-desc.vtt" srclang="en" label="English (Descriptive)">
</audio>
```

### JavaScript Access

```javascript
// Access audio tracks from media element
const media = document.getElementById('media');
const audioTracks = media.audioTracks;

// Get track information
console.log(audioTracks.length); // Number of available tracks

// Iterate through all tracks
for (let i = 0; i < audioTracks.length; i++) {
  const track = audioTracks[i];
  console.log(track.kind);     // Track type
  console.log(track.label);    // User-visible label
  console.log(track.language); // Language code
  console.log(track.enabled);  // Whether track is active
}

// Enable specific track
audioTracks[1].enabled = true;

// Listen for track change events
audioTracks.addEventListener('change', function() {
  console.log('Audio track changed');
});
```

### Practical Example: Language Switcher

```javascript
function switchAudioLanguage(languageCode) {
  const audioTracks = document.getElementById('media').audioTracks;

  for (let i = 0; i < audioTracks.length; i++) {
    if (audioTracks[i].language === languageCode) {
      audioTracks[i].enabled = true;
    } else {
      audioTracks[i].enabled = false;
    }
  }
}

// Usage
switchAudioLanguage('es'); // Switch to Spanish
```

## Known Issues and Limitations

### Browser Inconsistencies
- **Chrome/Opera**: Feature is behind an experimental flag, not suitable for production without user knowledge
- **Firefox**: Requires manual configuration, not enabled by default
- **Mobile Support**: Limited support on Android devices despite HTML5 audio support

### Implementation Gaps
- Some browsers may not properly fire track change events
- The `enabled` property behavior varies across browsers
- Not all browsers expose all track metadata properties equally

### Workarounds
When targeting browsers without native support:
- Use the Media Source Extensions API
- Implement client-side audio switching via Web Audio API
- Host separate video files for different audio tracks
- Consider using HLS or DASH with audio variant streams

## Related Features

- **[Video Tracks](https://html.spec.whatwg.org/multipage/embedded-content.html#videotracklist-and-videotracklist-objects)**: Similar API for video track selection
- **[TextTracks API](https://html.spec.whatwg.org/multipage/media.html#texttracklist)**: For subtitle and caption tracks
- **[Web Audio API](https://www.w3.org/TR/webaudio/)**: For advanced audio processing
- **[Media Source Extensions](https://www.w3.org/TR/media-source/)**: For adaptive bitrate streaming
- **[HTMLMediaElement](https://html.spec.whatwg.org/multipage/media.html#htmlmediaelement)**: Base interface for audio/video elements

## Resources

### Official Documentation
- [MDN Web Docs - HTMLMediaElement.audioTracks](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/audioTracks)
- [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/embedded-content.html#audiotracklist-and-videotracklist-objects)

### Related APIs
- [AudioTrackList API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/AudioTrackList)
- [AudioTrack API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/AudioTrack)
- [HTMLMediaElement API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)

### Polyfills and Libraries
- Consider feature detection before using:
  ```javascript
  if (media.audioTracks) {
    // Use native API
  } else {
    // Implement fallback
  }
  ```

## Recommendations

### For Production Use
1. **Feature Detection**: Always check browser support before using the API
2. **Graceful Degradation**: Provide alternative audio options for unsupported browsers
3. **User Control**: Make track selection easily accessible in your player UI
4. **Testing**: Test across browsers and devices, especially mobile
5. **Accessibility**: Ensure audio descriptions are available and properly labeled

### Best Practices
- Use clear, descriptive labels for each audio track
- Set appropriate language codes for track identification
- Provide a way to enable audio descriptions for accessibility
- Consider bandwidth implications when offering multiple high-quality tracks
- Test in both desktop and mobile environments

---

**Last Updated**: December 2025
**Data Source**: Can I Use (caniuse.com)
