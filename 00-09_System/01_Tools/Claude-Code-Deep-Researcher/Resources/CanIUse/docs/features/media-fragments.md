# Media Fragments

## Overview

Media Fragments specification allows only part of a resource (such as a video) to be shown based on the fragment identifier in the URL. This enables developers to link directly to specific points or ranges within media files, rather than always starting from the beginning.

Currently, browser support is primarily limited to video track ranges using the `#t=n,n` syntax.

## Specification Details

- **W3C Spec Status**: Recommendation (REC)
- **Official Specification**: https://www.w3.org/TR/media-frags/
- **Category**: DOM
- **Feature Type**: Media Playback Enhancement

## What Are Media Fragments?

Media fragments allow you to reference specific temporal (time-based) ranges within video and audio resources through URL fragments. The most common use case is specifying start and end times for video playback.

### Supported Syntax

- **Time Range**: `#t=start,end` - Plays video from `start` seconds to `end` seconds
  - Example: `video.mp4#t=10,30` - plays from 10 to 30 seconds
  - Example: `video.mp4#t=10` - plays from 10 seconds to the end
- **Track Selection**: `track=(name)` - Select named audio/video track (limited support)
- **Track ID**: `id=(name)` - Select track by ID (limited support)

**Note**: As of current implementation, browsers primarily support only the `#t=n,n` time range control. The `track` and `id` parameters have not been comprehensively tested across browsers.

## Use Cases & Benefits

### Primary Use Cases

1. **Deep Linking to Specific Moments**
   - Link to a specific moment in a video without requiring custom player UI
   - Share timestamps in video clips with others

2. **Lecture and Tutorial Segments**
   - Link directly to specific topics or chapters within educational videos
   - Jump to relevant sections without viewers needing to scrub through content

3. **Highlight Reels**
   - Extract and share specific moments from longer videos
   - Create compilations by linking to multiple segments

4. **Accessible Media**
   - Allow users to resume playback from specific points
   - Create chapter markers that jump to relevant content

5. **API Integrations**
   - Programmatically generate URLs that start at specific timestamps
   - Create dynamic playlists of specific segments

### Benefits

- **User Experience**: Direct linking to content of interest reduces user friction
- **Sharing**: Share specific moments with timestamps without third-party tools
- **Accessibility**: Better navigation for longer media content
- **SEO**: Improved content indexing and direct relevance
- **Bandwidth**: Can avoid downloading unnecessary content before target time

## Browser Support

Support for Media Fragments is relatively widespread but with important limitations:

### Support Key

- ✅ **Full Support (y)**: Complete implementation
- ⚠️ **Partial Support (a)**: Limited implementation (see notes)
- ❌ **No Support (n)**: Feature not supported

### Browser Support Table

| Browser | Earliest Version | Current Status | Notes |
|---------|------------------|----------------|-------|
| **Chrome** | 18 | ⚠️ Partial (#1) | Supported from v18 onwards |
| **Firefox** | 34 | ⚠️ Partial (#1) | Supported from v34 onwards |
| **Safari** | 6 | ⚠️ Partial (#1) | Supported from v6 onwards |
| **Edge** | 79 | ⚠️ Partial (#1) | Supported from Chromium Edge (v79+) |
| **Opera** | 15 | ⚠️ Partial (#1) | Supported from v15 onwards |
| **Internet Explorer** | — | ❌ No | Not supported in any IE version |
| **Opera Mini** | — | ❌ No | Not supported |
| **Blackberry** | — | ❌ No | Not supported |

### Mobile & Alternative Browsers

| Platform | Browser/Version | Status | Notes |
|----------|-----------------|--------|-------|
| **iOS Safari** | 6.0+ | ⚠️ Partial (#1) | Supported from iOS 6 onwards |
| **Android Browser** | 4.4+ | ⚠️ Partial (#1) | Supported from Android 4.4 onwards |
| **Chrome Mobile** | Current | ⚠️ Partial (#1) | Full support |
| **Firefox Mobile** | 34+ | ⚠️ Partial (#1) | Full support |
| **Samsung Internet** | 6.2+ | ⚠️ Partial (#1) | Supported from v6.2 onwards |
| **UC Browser** | 15.5+ | ⚠️ Partial (#1) | Limited support |
| **QQ Browser** | 14.9+ | ⚠️ Partial (#1) | Limited support |
| **Baidu Browser** | 13.52+ | ⚠️ Partial (#1) | Limited support |
| **KaiOS** | 2.5+ | ⚠️ Partial (#1) | Supported from v2.5 onwards |

### Overall Statistics

- **Full Support (y)**: 0%
- **Partial Support (a)**: 93.2% of global browser usage
- **No Support (n)**: 6.8% of global browser usage

*Statistics based on current global browser market share data*

## Important Notes

### Limitation #1: Time Range Only

The primary implementation limitation across all supporting browsers is:

> Only appears to support the `#t=n,n` control for selecting a range of video, and possibly `track=(name)` & `id=(name)` (not yet tested)

**What This Means**:
- ✅ Time-based ranges (`#t=start,end`) work reliably
- ⚠️ Named track selection may or may not work
- ⚠️ ID-based track selection may or may not work

### Compatibility Considerations

1. **Fallback Handling**: Always provide alternative methods to reach content for browsers without support
2. **Progressive Enhancement**: Use media fragments as an enhancement, not a requirement
3. **User Testing**: Test time-range syntax across your target browsers before relying on it
4. **JavaScript Alternatives**: Consider JavaScript-based solutions for unsupported browsers

## Implementation Examples

### Basic Time Range

```html
<!-- Start playback at 30 seconds -->
<video src="movie.mp4#t=30" controls></video>

<!-- Play from 10 to 60 seconds -->
<video src="movie.mp4#t=10,60" controls></video>

<!-- Link to a specific moment in a video -->
<a href="lecture.mp4#t=245">Jump to Question and Answer Session (4:05)</a>
```

### In JavaScript

```javascript
// Create a link to a specific timestamp
const timestamp = 120; // 2 minutes
const videoUrl = `video.mp4#t=${timestamp}`;

// Listen for hash changes (for navigation)
window.addEventListener('hashchange', () => {
  const time = window.location.hash.match(/#t=(\d+)/)?.[1];
  if (time) {
    videoElement.currentTime = parseInt(time);
    videoElement.play();
  }
});
```

### Responsive Fallback

```javascript
function linkToVideoTime(videoUrl, startTime, endTime = null) {
  let fragment = `#t=${startTime}`;
  if (endTime) {
    fragment += `,${endTime}`;
  }

  const fullUrl = videoUrl + fragment;

  // Check for support
  if (supportsMediaFragments()) {
    return fullUrl;
  } else {
    // Fallback: return URL and handle via JavaScript
    return fullUrl; // Let JavaScript handle it
  }
}

function supportsMediaFragments() {
  const video = document.createElement('video');
  // This is a simplified check
  return 'src' in video;
}
```

## Related Links

- **MDN Documentation**: [Media fragments on MDN - Using HTML5 audio and video](https://developer.mozilla.org/de/docs/Web/HTML/Using_HTML5_audio_and_video#Specifying_playback_range)
- **W3C Specification**: https://www.w3.org/TR/media-frags/
- **Video Element**: [HTML5 `<video>` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- **Audio Element**: [HTML5 `<audio>` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)

## Recommendations

### When to Use Media Fragments

✅ **Good Use Cases**:
- Educational videos with chapters or sections
- Instructional content with multiple topics
- Sports highlights or event replays
- Podcast highlights with specific moments
- User-generated content platforms
- Deep-linking to relevant moments

⚠️ **Use with Caution**:
- Mission-critical features (provide fallbacks)
- International audiences (test with target browsers)
- Mobile-first applications (verify mobile support)

### When to Avoid

❌ **Avoid or Replace With Alternatives**:
- Audio-only content (support is unclear)
- Track selection beyond time ranges (not reliably supported)
- Applications requiring 100% compatibility with older browsers
- Real-time streaming where seeking is restricted

## Browser Testing Checklist

Before implementing media fragments in production:

- [ ] Test on Chrome/Edge (desktop)
- [ ] Test on Firefox (desktop)
- [ ] Test on Safari (desktop and iOS)
- [ ] Test on Android browsers
- [ ] Verify time range accuracy
- [ ] Test edge cases (0 seconds, end of video, invalid values)
- [ ] Test with different video formats (MP4, WebM, etc.)
- [ ] Verify fallback behavior in unsupported browsers
- [ ] Check mobile device behavior
- [ ] Test with video player libraries (if applicable)

## Summary

Media Fragments provide a standardized way to link to specific moments within video content. With nearly universal browser support for the time-range syntax (`#t=n,n`), this feature is safe to implement for most use cases. However, always test thoroughly and provide fallbacks, as partial support across browsers means some advanced features may not work universally.

The feature is particularly valuable for educational, reference, and sharing scenarios where deep-linking to specific content moments improves user experience.

---

*Last Updated: 2025*
*Based on W3C Recommendation specification*
