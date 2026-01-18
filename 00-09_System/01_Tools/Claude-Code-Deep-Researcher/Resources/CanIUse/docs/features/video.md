# HTML5 Video Element

## Overview

The HTML5 `<video>` element provides a standardized method of playing videos on webpages without requiring a plug-in. This is one of the most significant additions to HTML5, enabling native video playback across all modern browsers.

## Description

The `<video>` element allows developers to embed video content directly into web pages with a simple, declarative markup approach. It includes comprehensive support for essential media properties and controls:

**Supported Properties:**
- `currentSrc` - Current video source URL
- `currentTime` - Current playback position (seconds)
- `paused` - Boolean indicating if video is paused
- `playbackRate` - Playback speed multiplier
- `buffered` - TimeRanges of buffered content
- `duration` - Total video duration (seconds)
- `played` - TimeRanges of played content
- `seekable` - TimeRanges that can be seeked to
- `ended` - Boolean indicating if video has finished playing
- `autoplay` - Auto-start playback when page loads
- `loop` - Repeat video when it ends
- `controls` - Display browser's default media controls
- `volume` - Audio volume (0-1)
- `muted` - Mute audio output

## Specification

- **Standard:** WHATWG HTML Living Standard
- **URL:** https://html.spec.whatwg.org/multipage/embedded-content.html#the-video-element
- **Status:** Living Standard (LS)

## Categories

- HTML5

## Use Cases & Benefits

### Primary Use Cases

1. **Background Videos** - Full-width hero videos on landing pages
2. **Tutorial & Instructional Content** - Step-by-step video guides
3. **Product Demonstrations** - Showcase product features and functionality
4. **Marketing & Advertising** - Embedded promotional videos
5. **Testimonials & Case Studies** - Customer video testimonials
6. **Online Learning** - Course video content
7. **News & Media** - Online video journalism and broadcasting
8. **Social Media Integration** - Embedded social video content

### Key Benefits

- **No Plugin Required** - Eliminates Flash and other plugin dependencies
- **Native Browser Support** - Optimized performance and security
- **Accessibility** - Built-in support for captions and accessibility features
- **Responsive Design** - Scales naturally with CSS
- **Full Programmatic Control** - JavaScript API for custom controls and interactions
- **Mobile Friendly** - Native mobile browser support
- **SEO Benefits** - Search engines can index video metadata

## Browser Support

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Internet Explorer** | 9+ | ✅ Full | Support from IE9 onwards |
| **Edge** | 12+ | ✅ Full | Full support across all versions |
| **Firefox** | 3.5-19 | ⚠️ Partial | Missing some properties (#2) |
| **Firefox** | 20+ | ✅ Full | Complete support |
| **Chrome** | 4+ | ✅ Full | Full support from Chrome 4 |
| **Safari** | 3.1+ | ✅ Full | Full support (with notes #3) |
| **Opera** | 10.5+ | ✅ Full | Support from Opera 10.5 |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 3.2+ | ✅ Full | Full support (with notes #3, #4) |
| **Android Browser** | 2.1-2.2 | ⚠️ Partial | Requires specific handling (#1) |
| **Android Browser** | 2.3+ | ✅ Full | Full support |
| **Opera Mini** | All | ❌ No | Not supported |
| **Opera Mobile** | 10 | ❌ No | Not supported |
| **Opera Mobile** | 11+ | ✅ Full | Full support from v11 |
| **Samsung Internet** | 4+ | ✅ Full | Full support |
| **UC Browser** | 15.5+ | ✅ Full | Full support |
| **Android Chrome** | 142+ | ✅ Full | Full support |
| **Android Firefox** | 144+ | ✅ Full | Full support |
| **KaiOS** | 2.5+ | ✅ Full | Full support |

### Support Summary

- **Global Usage:** 93.59% (with full support "y")
- **Partial Support:** 0.06% (with partial support "a")
- **Overall Coverage:** ~93.65%

## Important Notes

### Note #1: Android Browser Legacy Handling
The Android browser (before version 2.3) requires specific handling to run the video element. Developers targeting older Android devices should implement feature detection and fallback solutions.

**Reference:** [Making HTML5 Video Work on Android Phones](http://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/)

### Note #2: Firefox Property Support Evolution
Older Firefox versions (3.5-19) were missing support for some properties:
- `loop` property added in Firefox v11
- `played` property added in Firefox v15
- `playbackRate` property added in Firefox v20

### Note #3: Safari & iOS Autoplay Policy
Safari browsers (macOS and iOS) ignore the `autoplay` attribute by default. However, autoplay behavior can be enabled by users through browser settings and policies. This is part of a deliberate policy to prevent auto-playing media from consuming bandwidth and battery life.

**Learn More:** [WebKit Auto-Play Policy Changes](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)

### Note #4: iOS Volume Property Limitation
On iOS Safari, the `volume` property is read-only. The volume cannot be programmatically controlled; users must adjust volume using device controls.

### Compatibility Bug: Safari Content-Security-Policy Issue
The default media playback controls are not displayed in Safari 11 and 12 when a strict Content-Security-Policy is in place, unless you allow loading images from data URIs by including `img-src data:` in your CSP (similar to `unsafe-inline`).

**Reference:** [Safari CSP Media Controls Issue](https://www.ctrl.blog/entry/safari-csp-media-controls)

## Video Format Support

Different browsers have support for different video formats (H.264/AVC, VP8/VP9, Theora, etc.). See sub-features for detailed format support information.

Recommended approach:
- Include multiple video formats in `<source>` elements
- Provide fallback content for browsers without support
- Use modern formats (H.264 and VP9) for broad compatibility

## Example Usage

```html
<video width="320" height="240" controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
```

## Related Resources

1. **[Detailed Article on Video/Audio Elements](https://dev.opera.com/articles/everything-you-need-to-know-html5-video-audio/)** - Comprehensive guide covering both audio and video
2. **[WebM Format Information](https://www.webmproject.org)** - Details about the WebM video format
3. **[Video for Everybody](http://camendesign.co.uk/code/video_for_everybody)** - Fallback patterns for maximum compatibility
4. **[Video on the Web](http://diveintohtml5.info/video.html)** - Deep dive including Android support details
5. **[has.js Video Detection](https://raw.github.com/phiggins42/has.js/master/detect/video.js#video)** - Feature detection test utility
6. **[WebPlatform Docs](https://webplatform.github.io/docs/html/elements/video)** - Comprehensive technical documentation

## Implementation Considerations

### Feature Detection

```javascript
function supportsVideo() {
  return !!document.createElement('video').canPlayType;
}

// Check for specific codec support
var video = document.createElement('video');
if (video.canPlayType('video/mp4; codecs="avc1.42E01E"')) {
  // H.264 supported
}
```

### Fallback Strategies

- Use `<source>` elements with multiple formats
- Provide `<track>` elements for captions
- Implement JavaScript fallback player for unsupported browsers
- Consider Flash fallback for very old browsers (if still required)

### Performance Optimization

- Use appropriate video formats and codecs
- Optimize file size for web delivery
- Implement lazy loading for off-screen videos
- Use `poster` attribute to display preview image
- Consider serving different quality versions based on device capability

### Accessibility

- Include captions with `<track>` elements
- Provide transcripts for video content
- Use descriptive title and aria-label attributes
- Ensure controls are keyboard accessible

## Browser Version Details

### Chrome
Full support from version 4 (February 2010) through current versions

### Firefox
- Versions 3.5-19: Partial support (missing some properties)
- Version 20+: Full support

### Safari
- Version 3.1+: Full support
- Note: Autoplay ignored by default; volume read-only on iOS

### Opera
- Versions 9-10.1: Not supported
- Version 10.5+: Full support

### Internet Explorer
- Versions 5.5-8: Not supported
- Versions 9-11: Full support

---

**Last Updated:** December 2025
**Living Standard:** Regular updates and improvements continue as part of the WHATWG Living Standard
