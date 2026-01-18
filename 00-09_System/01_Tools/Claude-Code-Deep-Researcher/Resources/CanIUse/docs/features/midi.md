# Web MIDI API

## Overview

The **Web MIDI API** specification defines a means for web developers to enumerate, manipulate and access MIDI (Musical Instrument Digital Interface) devices through a web browser. This enables rich web-based music creation, performance, and interactive music applications.

## Description

The Web MIDI API allows web applications to:

- **Enumerate MIDI devices** - Discover connected MIDI input and output devices
- **Access MIDI devices** - Establish connections to MIDI input and output ports
- **Send and receive MIDI messages** - Communicate with MIDI instruments and controllers in real-time
- **Build interactive music applications** - Create web-based sequencers, synthesizers, controllers, and DAW-like interfaces

## Specification Status

**Status**: Working Draft (WD)

**Specification URL**: https://webaudio.github.io/web-midi-api/

The Web MIDI API is maintained as part of the Web Audio API specification by the W3C, ensuring integration with modern web audio processing capabilities.

## Categories

- **JS API** - JavaScript-based web platform API

## Benefits & Use Cases

### Music Production & Creation
- Build web-based Digital Audio Workstations (DAWs)
- Create online music sequencers and loop stations
- Develop interactive synthesizer interfaces
- Enable hardware MIDI controller support in web apps

### Live Performance
- Real-time MIDI device control from web browsers
- Interactive music performance applications
- Live DJ mixing and control
- Musical notation and composition tools

### Education & Learning
- Interactive music theory lessons
- Piano/keyboard learning applications
- Music production tutorials and courses
- MIDI instrument exploration tools

### Accessibility
- Create adaptive music interfaces for users with physical limitations
- Enable alternative input methods for musical expression
- Support assistive technology integration with music applications

### Professional Audio
- Remote MIDI control capabilities
- Studio software interfaces accessible from web
- Collaborative music production platforms
- MIDI hardware support without native applications

## Browser Support

### Support Status Legend
- ✅ **Supported** (y) - Feature is fully supported
- ❌ **Not Supported** (n) - Feature is not supported

### Desktop Browsers

| Browser | First Version | Status | Latest Version |
|---------|---------------|--------|-----------------|
| **Chrome** | 43 | ✅ Supported | 146+ |
| **Edge** | 79 | ✅ Supported | 143+ |
| **Firefox** | 108 | ✅ Supported | 148+ |
| **Opera** | 30 | ✅ Supported | 122+ |
| **Safari** | — | ❌ Not Supported | 26.1 |
| **Internet Explorer** | — | ❌ Not Supported | 11 |

### Mobile Browsers

| Browser | Support Status | Notes |
|---------|---|---|
| **Android Chrome** | ✅ Supported | Version 142+ |
| **Android Firefox** | ❌ Not Supported | Version 144 |
| **Opera Mobile** | ✅ Supported | Version 80+ |
| **Samsung Internet** | ✅ Supported | Version 4+ |
| **Opera Mini** | ❌ Not Supported | All versions |
| **iOS Safari** | ❌ Not Supported | All versions |
| **UC Browser** | ✅ Supported | Version 15.5+ |
| **QQ Browser** | ✅ Supported | Version 14.9+ |
| **Baidu Browser** | ✅ Supported | Version 13.52+ |
| **KaiOS** | ❌ Not Supported | All versions |
| **BlackBerry** | ❌ Not Supported | All versions |
| **IE Mobile** | ❌ Not Supported | All versions |

### Support Summary

**Global Coverage**: 82.12% of users have Web MIDI API support

**Supported Platforms**:
- Chrome/Chromium-based browsers (desktop and mobile)
- Firefox (desktop only)
- Opera (desktop and mobile)
- Edge (desktop)
- Samsung Internet
- Select Android browsers

**Unsupported Platforms**:
- Safari (desktop and iOS)
- Internet Explorer
- iOS/macOS (Apple ecosystem)
- Opera Mini
- Legacy and feature phones

## Implementation Notes

### Browser Feature Detection

```javascript
if (navigator.requestMIDIAccess) {
  console.log('Web MIDI API is supported');
  navigator.requestMIDIAccess()
    .then(success, failure);
} else {
  console.log('Web MIDI API is not supported');
}
```

### Permissions & Security

- **User Permission Required**: Browsers require explicit user permission to access MIDI devices
- **HTTPS Recommended**: Modern implementations recommend secure context (HTTPS)
- **Device Enumeration**: Applications can discover available devices without explicit permission in some browsers

### Platform Limitations

- **Apple Ecosystem**: Safari and iOS do not support Web MIDI API; developers must use native applications
- **Fallback Strategy**: Use polyfills or graceful degradation for unsupported browsers
- **Mobile Considerations**: Mobile MIDI support is limited; consider alternative input methods

## Related Resources

### Documentation & Specification
- [Web MIDI API Specification](https://webaudio.github.io/web-midi-api/)
- [MDN Web MIDI API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)

### Polyfills & Shims
- [Web MIDI API Shim/Polyfill](https://github.com/cwilso/WebMIDIAPIShim) - Community polyfill for unsupported browsers

### Testing & Demos
- [Web MIDI API Test/Demo Page](https://www.onlinemusictools.com/webmiditest/) - Interactive test tool for Web MIDI functionality

### Implementation References
- [Firefox Support Issue](https://bugzilla.mozilla.org/show_bug.cgi?id=836897) - Firefox MIDI API implementation tracking
- [WebKit Support Issue](https://bugs.webkit.org/show_bug.cgi?id=107250) - Apple WebKit implementation tracking

## Development Considerations

### Browser Compatibility Strategy

For maximum compatibility, consider:

1. **Feature Detection**: Always check for API availability before use
2. **Polyfill Integration**: Use available polyfills for older browsers
3. **Graceful Degradation**: Provide fallback functionality for unsupported browsers
4. **User Communication**: Inform users when MIDI features are unavailable
5. **Alternative Input**: Implement keyboard or touchscreen alternatives for MIDI control

### Performance & Best Practices

- **Asynchronous Access**: `requestMIDIAccess()` is asynchronous; handle promises appropriately
- **Resource Management**: Properly close MIDI ports when finished
- **Event Handling**: Use efficient event listeners for MIDI input
- **Error Handling**: Implement comprehensive error handling for device disconnections

### Testing Recommendations

- Test across supported platforms (Chrome, Firefox, Edge, Opera)
- Use the Web MIDI API test page to verify local MIDI device detection
- Test with various MIDI controllers and instruments
- Consider platform-specific behaviors in mobile environments

---

**Last Updated**: 2025
**Feature Support**: 82.12% of global users
**Specification Status**: Working Draft
