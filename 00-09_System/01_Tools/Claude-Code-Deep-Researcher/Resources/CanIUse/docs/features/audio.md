# HTML5 Audio Element

## Description

The HTML5 `<audio>` element provides a standardized method for playing sound on webpages without requiring plugins or external software. It offers full control over audio playback through a comprehensive set of properties, methods, and events.

**Supported Media Properties:**
- `currentSrc` - The currently playing audio source
- `currentTime` - Current playback position
- `paused` - Whether playback is paused
- `playbackRate` - Speed of playback
- `buffered` - Buffered time ranges
- `duration` - Total audio duration
- `played` - Played time ranges
- `seekable` - Seekable time ranges
- `ended` - Whether playback has finished
- `autoplay` - Auto-play on page load
- `loop` - Repeat playback
- `controls` - Display native controls
- `volume` - Playback volume level
- `muted` - Mute state

## Specification

**Status:** Living Standard (Candidate Recommendation)

**Specification URL:** [HTML Living Standard - Audio Element](https://html.spec.whatwg.org/multipage/embedded-content.html#the-audio-element)

## Categories

- HTML5

## Benefits and Use Cases

### Benefits
- **No Plugin Required** - Works natively in all modern browsers
- **Full Programmable Control** - Complete API for custom player development
- **Accessibility** - Built-in support for native controls
- **Standardized** - Part of the HTML5 specification across all browsers
- **Performance** - Direct browser support with optimized playback

### Common Use Cases
1. **Music and Podcast Players** - Custom audio player interfaces
2. **Sound Effects** - Game audio and interactive content
3. **Background Music** - Ambient audio for websites
4. **Accessibility Features** - Screen readers and audio transcripts
5. **Web Applications** - Voice chat, recording, and real-time audio
6. **Educational Content** - Language learning, tutorials with audio
7. **Media Websites** - News sites, streaming platforms

## Browser Support

### Current Status Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 4 | ✅ Full Support |
| Firefox | 20 | ✅ Full Support |
| Safari | 3.1 | ✅ Full Support |
| Edge | 12 | ✅ Full Support |
| Opera | 10.5 | ✅ Full Support |
| IE | 9 | ✅ Full Support |
| Android Browser | 2.3 | ✅ Full Support |
| iOS Safari | 3.2 | ⚠️ Partial Support |
| Opera Mini | All | ❌ Not Supported |

### Desktop Browser Support

#### Chrome
- **First Support:** Chrome 4 (2009)
- **Current Status:** Fully supported in all modern versions (4+)

#### Firefox
- **Partial Support:** Firefox 3.5-19
  - Missing properties in earlier versions
  - `loop` property added in Firefox 11
  - `played` property added in Firefox 15
  - `playbackRate` property added in Firefox 20
- **Full Support:** Firefox 20+

#### Safari
- **Full Support:** Safari 3.1+
- **Consistent Support:** All modern versions (3.1+)

#### Edge
- **Full Support:** Edge 12+
- **Consistent Support:** All versions (12+)

#### Opera
- **Partial Support:** Opera 9.5-10.1 (limited features)
- **Full Support:** Opera 10.5+

#### Internet Explorer
- **Full Support:** IE 9+
- **Not Supported:** IE 6-8

### Mobile Browser Support

| Platform | Browser | Support |
|----------|---------|---------|
| Android | Android Browser | ✅ Full (2.3+) |
| Android | Chrome | ✅ Full |
| Android | Firefox | ✅ Full |
| Android | Opera Mobile | ✅ Full (11+) |
| iOS | Safari | ⚠️ Partial |
| iOS | Chrome | ⚠️ Partial |
| BlackBerry | BB Browser | ✅ Full |
| Samsung | Samsung Internet | ✅ Full |

### Global Support Statistics

- **Full Support:** 84.28% of global web traffic
- **Partial Support:** 9.37% of global web traffic (primarily iOS)
- **No Support:** 6.35% of global web traffic

## Known Bugs and Limitations

### iOS/Safari Limitations

⚠️ **iOS Autoplay Restriction**
- iOS and Chrome on Android do not support autoplay as specified in the HTML5 specification
- Apple restricts autoplay for user experience and data consumption reasons
- **Workaround:** Provide explicit user interaction to start playback

⚠️ **iOS `ended` Event Bug**
- The `ended` event is not fired on iOS when the screen is off or the browser is in the background
- This prevents automatic advancement to the next track or changing the `src` attribute
- **Issue Reference:** [WebKit Bug 173332](https://bugs.webkit.org/show_bug.cgi?id=173332)
- **Workaround:** Use timer-based detection or implement explicit playlist management

### iOS Volume Control

⚠️ **Volume Property Read-Only on iOS**
- The `volume` property is read-only on iOS
- Volume control must be handled by the system settings
- **Impact:** Custom volume controls will appear non-functional on iOS devices
- **Workaround:** Disable custom volume UI on iOS or use feature detection

## Implementation Notes

### Basic HTML Example

```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>
```

### Recommended Codec Support

For maximum compatibility across browsers and devices:
- **MP3** - Universal support (most browsers and devices)
- **Ogg Vorbis** - Open format, good browser support
- **WebM** - Modern format for newer browsers
- **AAC** - Good for iOS and modern browsers

### JavaScript Control Example

```javascript
const audio = document.querySelector('audio');

// Play/pause control
audio.play();
audio.pause();

// Seek to position
audio.currentTime = 30;

// Adjust volume
audio.volume = 0.5;

// Check duration
console.log(audio.duration);

// Event listeners
audio.addEventListener('play', () => console.log('Playing'));
audio.addEventListener('pause', () => console.log('Paused'));
audio.addEventListener('ended', () => console.log('Finished'));
audio.addEventListener('timeupdate', () => console.log(audio.currentTime));
```

### Feature Detection

```javascript
function supportsAudio() {
  return !!document.createElement('audio').canPlayType;
}

// Detect specific codec support
const audio = document.createElement('audio');
const canPlayMP3 = audio.canPlayType('audio/mpeg') !== '';
const canPlayOgg = audio.canPlayType('audio/ogg') !== '';
const canPlayWebM = audio.canPlayType('audio/webm') !== '';
```

## Progressive Enhancement

For maximum compatibility:

1. **Always use multiple source formats** with `<source>` tags
2. **Provide fallback content** for browsers without support
3. **Test autoplay carefully** - not supported on iOS and Android
4. **Use feature detection** for dynamic codec selection
5. **Implement keyboard controls** for accessibility
6. **Consider mobile volume limitations** on iOS

## Related Resources

- [HTML5 Doctor: Native Audio in the Browser](https://html5doctor.com/native-audio-in-the-browser/)
- [Opera Dev: HTML5 Video and Audio Elements](https://dev.opera.com/articles/everything-you-need-to-know-html5-video-audio/)
- [jPlayer Demos](https://www.jplayer.org/latest/demos/)
- [The State of HTML5 Audio (2010)](https://24ways.org/2010/the-state-of-html5-audio)
- [has.js Audio Detection](https://raw.github.com/phiggins42/has.js/master/detect/audio.js#audio)
- [WebPlatform Docs: Audio Element](https://webplatform.github.io/docs/html/elements/audio)
- [The State of HTML5 Audio (2011)](https://www.phoboslab.org/log/2011/03/the-state-of-html5-audio)

## Specification Compliance

The audio element implementation follows the HTML Living Standard specification, which is maintained by WHATWG (Web Hypertext Application Technology Working Group). All major browsers work to comply with this specification for consistent cross-browser behavior.

---

*Last Updated: 2024*

**Data Source:** [CanIUse - Audio Element](https://caniuse.com/audio)
