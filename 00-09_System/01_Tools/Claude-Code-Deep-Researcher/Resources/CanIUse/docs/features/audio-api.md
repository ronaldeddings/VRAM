# Web Audio API

High-level JavaScript API for processing and synthesizing audio with advanced features for real-time audio analysis, synthesis, and effects processing.

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Recommended (REC) |
| **Specification URL** | https://www.w3.org/TR/webaudio/ |
| **Category** | JavaScript API |

## Overview

The Web Audio API provides a powerful and versatile system for controlling audio on the web, allowing developers to choose audio sources, add effects to audio, create audio visualizations, apply spatial effects (such as panning), and much more.

## Use Cases & Benefits

### Real-Time Audio Processing
- Create audio effects and filters
- Perform live audio analysis
- Build custom audio applications without external plugins

### Audio Synthesis
- Synthesize tones and complex waveforms
- Create generative music and procedural audio
- Build music production tools and synthesizers

### Audio Visualization
- Analyze frequency data for visualizations
- Create real-time waveform displays
- Build interactive audio-responsive graphics

### Media Enhancement
- Apply spatial audio and panning
- Add dynamic compression and EQ
- Create immersive audio experiences

### Games & Interactive Media
- Implement advanced game audio
- Create dynamic soundscapes
- Build 3D positional audio experiences

### Accessibility & Education
- Build audio processing demonstrations
- Create educational tools for music theory
- Implement audio analysis and visualization tools

## Categories

- JavaScript API

## Browser Support Summary

The Web Audio API has excellent modern browser support. Below is a summary of the first version with full support for each major browser:

| Browser | First Full Support | Current Status |
|---------|-------------------|---|
| **Chrome** | 34 | ✅ Full support |
| **Firefox** | 25 | ✅ Full support |
| **Safari** | 14.1 | ✅ Full support |
| **Edge** | 12 | ✅ Full support |
| **Opera** | 22 | ✅ Full support |
| **iOS Safari** | 14.5 | ✅ Full support |
| **Android Chrome** | 142 | ✅ Full support |
| **Samsung Internet** | 4 | ✅ Full support |
| **Internet Explorer** | ❌ Not supported | Not supported |
| **Opera Mini** | ❌ Not supported | Not supported |

## Detailed Browser Support Table

### Desktop Browsers

| Browser | Earliest Support | Full Support | Notes |
|---------|-----------------|---|---|
| **Chrome** | 14 (prefixed) | 34 | Prefixed support (`webkit`) from v14-33 |
| **Firefox** | 25 | 25 | Alternative deprecated API in Firefox < 25 |
| **Safari** | 6 (prefixed) | 14.1 | Prefixed support (`webkit`) through v14.0 |
| **Edge** | 12 | 12 | Full support from first release |
| **Opera** | 15 (prefixed) | 22 | Prefixed support (`webkit`) from v15-21 |
| **Internet Explorer** | Not supported | Not supported | No support in any version |

### Mobile Browsers

| Browser | Earliest Support | Full Support | Notes |
|---------|-----------------|---|---|
| **iOS Safari** | 6.0 (prefixed) | 14.5 | Prefixed support through v14.4 |
| **Android Browser** | Not supported | 142 | Support added in recent versions |
| **Samsung Internet** | 4 | 4 | Full support from first release |
| **Opera Mobile** | Not supported | 80 | Support added in version 80+ |
| **Android Firefox** | Not supported | 144 | Support in recent versions |
| **Android Chrome** | Not supported | 142 | Support in recent versions |
| **Opera Mini** | Not supported | Not supported | No support |
| **UC Browser** | Not supported | 15.5 | Limited support |

### Other Browsers

| Browser | Support Status |
|---------|---|
| **Baidu** | 13.52+ |
| **QQ Browser** | 14.9+ |
| **KaiOS** | 2.5+ |
| **BlackBerry** | Not supported |

## Global Support Coverage

- **Global Usage**: 93.21% of users have browsers with full support
- **Partial Support**: 0% (no partial/prefixed-only usage in modern stats)

## Implementation Timeline

### Early Adoption Phase (2011-2014)
- **Chrome 14-33**: Prefixed support with webkit prefix
- **Safari 6-14**: Webkit-prefixed implementation
- **Opera 15-21**: Webkit-prefixed support (following Chromium)

### Standardization Phase (2014-2016)
- **Chrome 34**: Full unprefixed support (July 2014)
- **Firefox 25**: Full support (October 2013)
- **Opera 22**: Full unprefixed support (following Chromium base switch)

### Modern Era (2017+)
- **Safari 14.1**: Full unprefixed support (March 2021)
- All major desktop browsers feature complete support
- Mobile browser support gradually increased

## Known Issues & Notes

### Audio API vs Media Streams
Not all browsers with Web Audio API support also support media streams (e.g., microphone input). For microphone input capabilities, check the **getUserMedia/Streams API** feature separately.

### Firefox Legacy API
Firefox versions earlier than 25 support an alternative, deprecated audio API. Applications should target the modern Web Audio API for compatibility with current browser versions.

### Chrome Implementation Changes
Chrome support underwent significant changes in version 36 (May 2014). Developers should review the [Chrome Web Audio changes documentation](https://developers.google.com/web/updates/2014/07/Web-Audio-Changes-in-m36) for migration guidance if supporting older Chrome versions.

### Prefix Handling
While many browsers have unprefixed support, the webkit prefix was widely used during early implementation. For maximum compatibility with older browsers, feature detection or a polyfill may be beneficial:

```javascript
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
```

## Feature Detection

```javascript
// Basic feature detection
if (typeof (window.AudioContext || window.webkitAudioContext) === 'function') {
  // Web Audio API is supported
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
}

// Check for specific features
if (audioContext.createAnalyser) {
  // Analyser node is available
}

if (audioContext.createMediaStreamSource) {
  // Media stream input is available
}
```

## Related Features & APIs

- **Web Audio API Nodes**: Analyser, OscillatorNode, Gain Node, Filter, etc.
- **getUserMedia API / Media Streams**: For microphone and camera input
- **HTMLMediaElement**: For audio/video element integration
- **AudioWorklet**: Advanced audio processing (modern replacement for ScriptProcessorNode)
- **Spatial Audio**: Panner Node for 3D audio positioning
- **Offline Audio Context**: For offline audio processing

## Resources & Documentation

### Official Documentation
- **[MDN Web Docs - Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Comprehensive MDN documentation and guides
- **[W3C Specification](https://www.w3.org/TR/webaudio/)** - Official W3C Web Audio API specification

### Community Resources
- **[WebPlatform Docs](https://webplatform.github.io/docs/apis/webaudio)** - Community documentation and examples
- **[Polyfill: audionode.js](https://github.com/corbanbrook/audionode.js)** - Polyfill to support Web Audio API in Firefox (legacy)
- **[Polyfill: WAAPISim](https://github.com/g200kg/WAAPISim)** - Polyfill enabling Web Audio API through Firefox Audio Data API or Flash (legacy)

### Chrome Resources
- **[Chrome Developers - Web Audio Changes in v36](https://developers.google.com/web/updates/2014/07/Web-Audio-Changes-in-m36)** - Documentation of breaking changes in Chrome 36

## Implementation Recommendations

### For Maximum Compatibility
1. Use vendor prefixes for webkit-based browsers if supporting older versions:
   ```javascript
   const AudioContext = window.AudioContext || window.webkitAudioContext;
   ```

2. Check for media stream support separately if microphone input is needed
3. Test across target browser versions, particularly around Chrome 36 changes

### For Modern Applications
1. Use unprefixed Web Audio API directly
2. Rely on feature detection for individual node types
3. Use AudioWorklet instead of ScriptProcessorNode for advanced audio processing
4. Consider graceful degradation for unsupported features

### Browser-Specific Considerations

**Safari (macOS/iOS)**
- Full support from Safari 14.1 / iOS 14.5
- Earlier versions require webkit prefix
- Test audio context state management carefully

**Firefox**
- Excellent support since version 25
- No prefix needed in modern versions
- Check for media stream support separately if needed

**Chrome & Edge**
- Excellent and consistent support
- Review version 36 changes if supporting Chrome < 36
- Consider AudioWorklet for audio processing

## Support Statistics

| Metric | Value |
|--------|-------|
| Global Support | 93.21% |
| Prefixed Support | 0% |
| No Support | 6.79% |

---

*Last updated: 2024 | Data source: CanIUse*
