# Picture-in-Picture API

## Overview

The Picture-in-Picture (PiP) API allows websites to create a floating video window that remains on top of other windows, enabling users to continue consuming media while interacting with other sites or applications on their device.

## Description

Picture-in-Picture provides a standardized web API for video elements to be displayed in a floating window. This feature is particularly useful for video streaming platforms, allowing users to watch videos while browsing, working, or using other applications without needing to keep the video tab in focus.

## Specification Status

**Status:** Working Draft (WD)

**Specification URL:** [WICG Picture-in-Picture](https://wicg.github.io/picture-in-picture/)

The specification is currently being developed by the Web Incubation Community Group (WICG) as a working draft, indicating ongoing refinement and implementation across browsers.

## Categories

- **JS API** - JavaScript API for web applications

## Benefits & Use Cases

### Primary Benefits

1. **Multitasking Support** - Users can watch videos while simultaneously:
   - Browsing other websites
   - Reading documentation
   - Taking notes
   - Using other applications

2. **Improved User Experience** - Provides native, standardized functionality that was previously only available through proprietary implementations

3. **Cross-Browser Compatibility** - Single API works across multiple browsers instead of requiring vendor-specific solutions

4. **Accessibility** - Allows better video consumption experiences for users with accessibility needs

### Common Use Cases

- **Video Streaming Platforms** - YouTube, Netflix, Twitch, etc.
- **Educational Content** - Online courses and tutorial videos
- **Video Conferencing** - Maintaining video calls while accessing other content
- **Live Streaming** - Watching live streams while viewing chat or other content
- **Video Editing** - Preview videos while working on projects

## Browser Support

### Support Legend

- **y** = Fully supported
- **a** = Partial support (see notes for details)
- **n** = Not supported
- **d** = Disabled by default (requires flag or setting)

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 70 | Fully supported | |
| **Edge** | 79 | Fully supported | |
| **Firefox** | 68 | Partial support | Partial support via proprietary API; enabled by default on Windows from v71+ (#1) |
| **Safari** | 13.1 | Fully supported | Partial support in v10-13 via proprietary API (#6) |
| **Opera** | 73 | Fully supported | Partial support in v37-72 via "Video Pop Out" feature (#7) |
| **Internet Explorer** | - | Not supported | |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **iOS Safari** | 14 | Fully supported | Partial support in v9-13 via proprietary API (#6) |
| **Chrome Mobile** | 80 | Partial support | Partial support via intent-based behavior (#8) |
| **Firefox Mobile** | - | Partial support | Currently partial support (#8) |
| **Opera Mobile** | 80 | Fully supported | |
| **Samsung Internet** | - | Not supported | |
| **Android Browser** | - | Not supported | |
| **Opera Mini** | - | Not supported | |

### Global Support Statistics

- **Fully Supported:** 45.53% of global browser usage
- **Partial Support:** 44.31% of global browser usage
- **Not Supported:** 10.16% of global browser usage

## Implementation Notes

### Browser-Specific Notes

#### #1 - Firefox Proprietary Implementation
Firefox provides an equivalent proprietary feature that allows users to use Picture-in-Picture mode for all playing videos. Mozilla's implementation predates the standard API.

**Timeline:**
- v67: Can be enabled via `media.videocontrols.picture-in-picture.enabled` in `about:config`
- v68-70: Enabled by default in Firefox pre-release channels for Windows only
- v71+: Enabled by default for Windows users
- v72+: Fully enabled across all versions

#### #2 - Firefox 71 Windows Limitation
Partial support in Firefox 71 refers to the feature being enabled by default only for Windows users, with other platforms having it available but not default.

#### #3 & #4 - Firefox Experimental Features
Firefox 68-70 had Picture-in-Picture available through experimental features that could be manually enabled. The feature is controlled via the `media.videocontrols.picture-in-picture.enabled` preference in `about:config`.

#### #5 - Chrome Feature Flag
Can be enabled in Chrome via flags at `chrome://flags`:
- `#enable-picture-in-picture`
- `#enable-surfaces-for-videos`

#### #6 - Safari Proprietary API
Apple provides an equivalent proprietary API for Picture-in-Picture support:
- **Requirement:** macOS 10.12 Sierra or iOS 9 and newer
- **API:** Different from the standard WICG API
- **Reference:** [Apple WebKit Documentation](https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls)

#### #7 - Opera Video Pop Out
Opera provides an equivalent proprietary feature named "Video Pop Out" that allows Picture-in-Picture functionality for all playing videos. This was available before standard API support.

**Reference:** [Opera Blog - Video Pop Out Feature](https://blogs.opera.com/desktop/2016/04/opera-beta-update-video-pop/)

#### #8 - Android Mobile Behavior
Automatically plays fullscreen videos in Picture-in-Picture mode after user hits Home Screen button. This functionality requires:
- **Android 8.0 Oreo or newer** - These versions provide the necessary Android API for Picture-in-Picture
- **Automatic behavior** - No explicit JavaScript API call needed; happens through intent-based system behavior

## Usage Statistics

As of the latest data:
- **45.53%** of global web traffic uses browsers with full PiP support
- **44.31%** of global web traffic uses browsers with partial/proprietary PiP support
- **Combined coverage:** 89.84% of users can access Picture-in-Picture functionality (either standard or proprietary)

## Implementation Guidance

### Feature Detection

Check for Picture-in-Picture support before using the API:

```javascript
if (document.pictureInPictureEnabled) {
  // Feature is supported
  video.requestPictureInPicture();
}
```

### Fallback Strategies

For maximum compatibility:

1. **Check for Standard API** - Use the standard PiP API if available
2. **Check for Proprietary APIs** - For Safari and Firefox, consider their proprietary implementations
3. **Graceful Degradation** - Disable PiP button if not supported in the current browser
4. **Browser Detection** - Implement vendor-specific code paths for partial support

### Best Practices

- Always check `document.pictureInPictureEnabled` before calling `requestPictureInPicture()`
- Provide a fallback experience for browsers without support
- Test across all major browsers due to implementation variations
- Be aware of platform-specific limitations (Windows-only for Firefox v71, macOS/iOS for Safari)

## Related Resources

### Official Documentation & Samples

- [Chrome Picture-in-Picture Sample](https://googlechrome.github.io/samples/picture-in-picture/) - Official Chrome implementation example
- [WICG Implementation Status](https://github.com/WICG/picture-in-picture/blob/master/implementation-status.md) - Implementation tracking across browsers

### Browser-Specific Guides

- [Safari Picture-in-Picture API](https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls) - Apple's WebKit documentation
- [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1519885) - Mozilla's implementation tracking

### Additional References

- [Opera Video Pop Out Feature](https://blogs.opera.com/desktop/2016/04/opera-beta-update-video-pop/) - Opera's proprietary implementation

## Specification Details

**WICG Specification:** The Picture-in-Picture specification is maintained by the Web Incubation Community Group and can be found at https://wicg.github.io/picture-in-picture/

The API primarily consists of:
- `requestPictureInPicture()` method on HTMLVideoElement
- `exitPictureInPicture()` method on Document
- `pictureInPictureEnabled` property on Document
- PictureInPictureWindow interface and events

## Version History

- **Chrome 69:** Feature disabled by default (flag-enabled)
- **Chrome 70:** Fully supported
- **Edge 79:** Fully supported
- **Safari 10-13:** Partial support via proprietary API
- **Safari 13.1:** Fully supported
- **Firefox 67:** Disabled by default (can be enabled)
- **Firefox 71+:** Enabled by default (Windows, v71 only)
- **Firefox 72+:** Fully enabled across all versions

---

**Last Updated:** Based on CanIUse data as of the latest update
**Data Source:** CanIUse - caniuse.com
