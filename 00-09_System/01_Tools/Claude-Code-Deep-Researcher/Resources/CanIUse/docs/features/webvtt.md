# WebVTT - Web Video Text Tracks

## Overview

WebVTT (Web Video Text Tracks) is a W3C format for marking up external text tracks for multimedia resources, such as videos. It provides a standardized way to add captions, subtitles, descriptions, chapters, and metadata to video and audio content on the web.

## Description

WebVTT is used to display synchronized text content alongside video or audio playback. It must be used with the [HTML `<track>` element](/mdn-html_elements_track) to associate VTT files with media elements. The format is human-readable, easy to create and edit, and supports styling through CSS (via the `::cue` pseudo-element).

### Common Use Cases

- **Captions**: Display dialogue and sound descriptions for deaf and hard-of-hearing users
- **Subtitles**: Translate dialogue and important audio information to other languages
- **Descriptions**: Provide detailed audio descriptions of visual content
- **Chapters**: Mark sections within a video for navigation and structure
- **Metadata**: Embed additional information synchronized with video playback

## Specification Status

**Current Status**: Candidate Recommendation (CR)
- **Specification URL**: [W3C WebVTT Specification](https://w3c.github.io/webvtt/)

The WebVTT specification is maintained by the W3C and continues to evolve. As a Candidate Recommendation, it has completed a significant review phase and is approaching standardization.

## Categories

- Other

## Benefits & Use Cases

### Accessibility
- Ensures video and audio content is accessible to deaf and hard-of-hearing users
- Supports users in noisy environments or who prefer subtitles
- Improves SEO through searchable caption text

### Localization & Internationalization
- Easy to translate content to multiple languages
- Support for bidirectional text (right-to-left languages)
- Multiple subtitle tracks can be provided for different languages

### User Experience
- Users can enable/disable captions and subtitles as needed
- Support for styling and positioning of text tracks
- Simple, plain-text format that's easy to create and maintain

### Content Organization
- Chapter markers for long-form video content
- Timestamps for accurate synchronization with media
- Flexible metadata for custom applications

## Browser Support

| Browser | First Support | Current Support | Notes |
|---------|---|---|---|
| **Chrome** | 23 | Full Support | Fully supported from v23+ |
| **Edge** | 12 | Full Support | All versions (12+) supported |
| **Firefox** | 31 | Full Support* | See notes below |
| **Safari** | 6 | Full Support | Supported from v6+ |
| **Opera** | 15 | Full Support | All versions (15+) supported |
| **iOS Safari** | 7 | Full Support | Supported from v7.0+ |
| **Android Browser** | 4.4 | Full Support | Supported from v4.4+ |
| **Samsung Internet** | 4 | Full Support | All versions (4+) supported |
| **IE** | 10 | Supported | IE 10-11 have support |
| **Opera Mini** | - | **Not Supported** | Not supported in any version |

### Desktop Browser Coverage
- Chrome: 100% (v23+)
- Firefox: 100% (v31+) with caveats
- Safari: 100% (v6+)
- Opera: 100% (v15+)
- Edge: 100% (v12+)
- IE: Partial (v10-11 only)

### Mobile Browser Coverage
- iOS Safari: 100% (v7.0+)
- Android Browser: 100% (v4.4+)
- Samsung Internet: 100% (v4+)
- Opera Mobile: Supported (v80+)
- Android Chrome: 100% (all versions)
- Android Firefox: 100% (all versions)

### Overall Adoption
**Global Usage**: 93.54% of users have browser support

## Implementation Notes

### Firefox-Specific Notes

**Note #1: `::cue` Pseudo-element Support**
- Firefox 31 - 54: Lacks support for the `::cue` pseudo-element
- Affects custom styling of captions
- [See Firefox Bug #865395](https://bugzilla.mozilla.org/show_bug.cgi?id=865395)

**Note #2: `::cue()` Selector Support**
- Firefox 55+: Implements `::cue` but lacks support for `::cue(<selector>)` with selector argument
- Limits advanced styling capabilities with selector filters
- [See Firefox Bug #1321489](https://bugzilla.mozilla.org/show_bug.cgi?id=1321489)

### Known Issues

#### Firefox 49 and Below
- Captions are not visible for audio-only files in the `<video>` tag
- Use audio files via the `<audio>` tag instead for better compatibility
- [See Firefox Bug #992664](https://bugzilla.mozilla.org/show_bug.cgi?id=992664)

#### Firefox 46 and Below
- The `textTrack.onCueChange()` event is not supported
- Use alternative event handling methods for older Firefox versions
- [Reference: Stack Overflow Discussion](https://stackoverflow.com/questions/28144668/html5-audio-texttrack-kind-subtitles-cuechange-event-not-working-in-firefox)

### Basic Usage Example

```html
<video controls width="640" height="360">
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
  <track kind="subtitles" src="spanish.vtt" srclang="es" label="Español">
  Your browser doesn't support HTML5 video.
</video>
```

### VTT File Format

WebVTT files have a `.vtt` extension and use the following basic structure:

```
WEBVTT

00:00:00.000 --> 00:00:05.000
This is the first caption

00:00:05.000 --> 00:00:10.000
This is the second caption
```

## Related Resources

### Learning Resources
- [Getting Started With the Track Element](https://www.html5rocks.com/en/tutorials/track/basics/) - HTML5 Rocks comprehensive introduction
- [An Introduction to WebVTT and track](https://dev.opera.com/articles/view/an-introduction-to-webvtt-and-track/) - Opera Developer guide
- [MDN Web Docs - WebVTT API](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) - Mozilla's comprehensive documentation

### Additional References
- [W3C WebVTT Specification](https://w3c.github.io/webvtt/) - Official W3C specification
- [HTML `<track>` Element Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)
- [CSS `::cue` Pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/::cue)

## Important Requirements

**Required Element**: WebVTT must be used with the HTML [`<track>` element](/mdn-html_elements_track). Simply creating a `.vtt` file is not sufficient; it must be properly referenced and associated with a media element (`<video>` or `<audio>`) using the `<track>` element.

## Summary

WebVTT is a mature, widely-supported standard for adding captions, subtitles, and other text tracks to multimedia content. With support in 93.54% of browsers globally and full coverage in all modern browsers, it should be your default choice for video accessibility and localization. Minor limitations in older Firefox versions regarding `::cue` styling shouldn't prevent adoption, as graceful fallbacks are available.
