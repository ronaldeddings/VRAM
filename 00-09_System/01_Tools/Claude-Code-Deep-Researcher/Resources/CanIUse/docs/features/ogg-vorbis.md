# Ogg Vorbis Audio Format

## Overview

**Ogg Vorbis** is a free and open source audio codec most commonly used with the Ogg container format. It provides lossy audio compression comparable to MP3 while remaining entirely free of patent restrictions.

## Specification Status

| Property | Value |
|----------|-------|
| **Specification** | [Vorbis I Specification](https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html) |
| **Status** | Other (non-W3C standard) |
| **Global Usage** | ~90.13% (supported) |
| **Partial Support** | ~1.71% (with limitations) |

## Categories

- Audio Formats
- Other

## Use Cases & Benefits

### Key Advantages

- **Free & Open Source**: No licensing fees or patent restrictions
- **Quality Audio**: High-quality lossy compression with variable bitrates
- **Web Compatible**: Natively supported in HTML5 `<audio>` elements across major browsers
- **Container Flexibility**: Works with Ogg or other containers
- **Streaming**: Suitable for streaming and progressive playback

### Common Applications

- Podcast hosting and distribution
- Game audio and sound effects
- Background music in web applications
- Voice chat and communication applications
- Music streaming services (alternative to proprietary formats)
- Open-source media players and applications

## Browser Support

### Desktop Browsers

| Browser | Support | Details |
|---------|---------|---------|
| **Chrome** | ✅ Yes | Since v4+ (full support) |
| **Firefox** | ✅ Yes | Since v3.5+ (full support) |
| **Safari** | ⚠️ Partial | v18.4+ (full support); v14.1-18.3 (Vorbis codec only, not Ogg container) |
| **Edge** | ✅ Yes | Since v17+ (full support) |
| **Opera** | ✅ Yes | Since v10.5+ (full support) |
| **Internet Explorer** | ❌ No | Not supported (all versions) |

### Mobile & Tablet Browsers

| Browser | Support | Details |
|---------|---------|---------|
| **iOS Safari** | ⚠️ Partial | v18.4+ (full support); v17.4-18.3 (Vorbis codec only); earlier versions not supported |
| **Android Browser** | ✅ Yes | Since v2.3+ (full support); v2.1-2.2 (unknown support) |
| **Chrome Mobile** | ✅ Yes | v142+ (full support) |
| **Firefox Mobile** | ✅ Yes | v144+ (full support) |
| **Samsung Internet** | ✅ Yes | Since v4.0+ (full support) |
| **Opera Mobile** | ✅ Yes | Since v11.0+ (full support) |
| **Opera Mini** | ❌ No | Not supported (all versions) |

### Specialized Browsers

| Browser | Support | Details |
|---------|---------|---------|
| **UC Browser** | ✅ Yes | v15.5+ |
| **QQ Browser** | ✅ Yes | v14.9+ |
| **Baidu Browser** | ✅ Yes | v13.52+ |
| **KaiOS Browser** | ✅ Yes | v2.5+ |
| **BlackBerry Browser** | ⚠️ Partial | v10+ (supported); v7 (not supported) |
| **IE Mobile** | ❌ No | Not supported |

## Implementation Notes

### Important Considerations

- **HTML5 Audio Element**: Support refers specifically to usage with the HTML5 `<audio>` element, not other playback conditions or plugins
- **Container vs. Codec**: Some browsers (particularly Safari) support the Vorbis codec but not the Ogg container format. These browsers cannot play `.ogg` or `.oga` files
- **macOS Requirements**: Safari on macOS requires Big Sur 11.3 or later for full Ogg Vorbis support
- **iOS Requirements**: iOS Safari requires version 18.4 or later for complete Ogg Vorbis support; earlier versions may only support the codec

### Supported MIME Types & File Extensions

- **File Extensions**: `.ogg`, `.oga`
- **MIME Types**:
  - `application/ogg`
  - `audio/ogg`

## Related Resources

- [Wikipedia: Vorbis](https://en.wikipedia.org/wiki/Vorbis) - Comprehensive information about the Vorbis codec
- [Xiph.Org Foundation](https://www.xiph.org/vorbis/) - Official Vorbis documentation and specifications
- [HTML5 Audio Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) - MDN documentation for audio support

## Browser Support Summary

### High Support (Global Coverage)

The vast majority of modern browsers support Ogg Vorbis in the HTML5 `<audio>` element:

- All Chrome/Chromium-based browsers (Chrome, Edge, Opera, Samsung Internet, etc.)
- All Firefox versions from 3.5 onward
- All Android browsers
- Modern Safari (v18.4+)

### Limited Support

- Safari browsers before v18.4 (codec support only)
- iOS Safari before v18.4
- Internet Explorer (all versions)
- Opera Mini

### Recommendations

For maximum compatibility when using Ogg Vorbis audio:

1. **Use Format Detection**: Check browser support before attempting to play Ogg files
2. **Provide Fallbacks**: Include alternative formats (MP3, WebM) for browsers with limited support
3. **Test on Target Platforms**: Verify support on specific browsers and devices you need to support
4. **Consider Apple Platforms**: If targeting Apple devices, be aware of limitations in Safari and iOS Safari versions before 18.4

## Example HTML5 Usage

```html
<audio controls>
  <source src="audio.ogg" type="audio/ogg">
  <source src="audio.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

---

**Last Updated**: December 2025
**Source**: CanIUse browser support data
