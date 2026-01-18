# Encrypted Media Extensions (EME)

## Overview

**Encrypted Media Extensions** (EME) is a web API that provides interfaces for controlling the playback of content protected by Digital Rights Management (DRM) schemes. This API is essential for streaming services that need to protect copyrighted content while delivering it through web browsers.

## Description

The EncryptedMediaExtensions API enables web applications to play encrypted media content by establishing communication between the browser and a Content Decryption Module (CDM). This allows legitimate content providers to distribute their protected media while maintaining content security and preventing unauthorized copying.

## Specification Status

- **Status**: W3C Recommendation (REC)
- **Current Spec**: [W3C Encrypted Media Extensions](https://www.w3.org/TR/encrypted-media/)

## Categories

- JavaScript API
- Security

## Use Cases & Benefits

### Primary Use Cases

1. **Streaming Services**: Netflix, Disney+, and other video streaming platforms rely on EME to protect their content from unauthorized distribution.

2. **Music Streaming**: Services like Spotify and Apple Music use EME to protect premium audio content.

3. **Live Events**: Broadcasting services for sports, concerts, and other live content can use EME to protect their streams.

4. **Premium Web Content**: Publishers can distribute high-value digital content through the web with protection against piracy.

### Key Benefits

- **Content Protection**: Prevents unauthorized copying and distribution of protected media
- **DRM Support**: Enables compatibility with industry-standard DRM systems
- **Legal Compliance**: Helps content providers meet licensing and regulatory requirements
- **Seamless User Experience**: Integrates directly into the browser without requiring external plugins
- **Multiple DRM Systems**: Supports various content decryption modules across different platforms

## Browser Support

### Key Support Notes

- **y**: Fully supported
- **a**: Partially supported (uses older event-based specification)
- **x**: Requires prefixed vendor implementation
- **n**: Not supported

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | v42 (2015) | ✅ Full Support | Fully supported from v42 onwards |
| **Firefox** | v38 (2015) | ✅ Full Support | Fully supported from v38 onwards |
| **Safari** | v12 (2018) | ✅ Full Support | Full support from v12; v7-v11 had partial support |
| **Edge** | v12 (2015) | ✅ Full Support | Fully supported since launch |
| **Opera** | v29 (2015) | ✅ Full Support | Full support from v29 onwards; v22-v28 had partial support |
| **Internet Explorer** | v11 | ⚠️ Partial Support | IE 11 only supports the older event-based specification |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Safari on iOS** | v11.3-v11.4 (2018) | ✅ Full Support | Full support from iOS 11.3 onwards |
| **Chrome on Android** | v142+ | ✅ Full Support | Recent versions fully supported |
| **Firefox on Android** | v144+ | ✅ Full Support | Recent versions fully supported |
| **Opera Mobile** | v80+ | ✅ Full Support | Full support from v80 onwards |
| **Samsung Internet** | v5.0+ (2016) | ✅ Full Support | Fully supported from v5.0 onwards |
| **Opera Mini** | All versions | ❌ Not Supported | Not available |

### Global Usage Statistics

- **Full Support (y)**: 92.93% of global browser usage
- **Partial Support (a)**: 0.35% of global browser usage
- **No Support (n)**: ~6.72% of global browser usage

## Implementation Details

### Key Concepts

**Content Decryption Module (CDM)**
: A component (either built into the browser or provided by the operating system) that handles decryption of protected media

**Key System**
: The DRM system used to protect the content (e.g., Widevine, PlayReady, FairPlay)

**License**
: Authorization from the license server to decrypt and play protected content

### API Keywords

- `requestMediaKeySystemAccess`: Method to request access to a specific DRM key system
- `createMediaKeys`: Method to create a MediaKeys object for a specific key system

## Important Notes

### Compatibility Notes

**Note #1 - Partial Support**: Internet Explorer 11 and certain older versions of Safari, Chrome, and Opera only support the older event-based specification. If targeting these browsers, developers should implement fallback code or upgrade user agents.

### Browser Version Ranges

- **Chrome**: Full support from v42 (March 2015) to present
- **Firefox**: Full support from v38 (May 2015) to present
- **Safari**: Full support from v12 (2018) to present
- **Safari iOS**: Full support from v11.3 (2018) to present
- **Edge**: Full support from v12 (2015) to present
- **Opera**: Full support from v29 (2015) to present

## Limitations & Considerations

1. **DRM Dependency**: EME itself doesn't provide DRM; it depends on platform-provided CDMs
2. **License Requirements**: Content must be properly licensed through a DRM license server
3. **Content-Specific**: Support varies based on audio/video codecs and DRM systems
4. **Platform Variations**: Different operating systems may provide different CDM implementations
5. **HTTPS Requirement**: EME typically requires secure HTTPS connections for license exchanges

## Related Resources

### Documentation & Tutorials

- [HTML5Rocks - EME Basics](https://www.html5rocks.com/en/tutorials/eme/basics/): Comprehensive tutorial on implementing EME
- [MDN - Encrypted Media Extensions API](https://developer.mozilla.org/en-US/docs/Web/API/Encrypted_Media_Extensions_API): Official Mozilla documentation with examples
- [Wikipedia - Encrypted Media Extensions](https://en.wikipedia.org/wiki/Encrypted_Media_Extensions): Overview and background information

### Standards & Specifications

- [W3C Encrypted Media Extensions Specification](https://www.w3.org/TR/encrypted-media/): Official W3C recommendation

## Implementation Checklist

When implementing EME in your application:

- [ ] Check browser support using feature detection
- [ ] Implement fallback behavior for unsupported browsers
- [ ] Configure appropriate DRM key systems for your target platforms
- [ ] Implement proper license server communication
- [ ] Test across target browsers and devices
- [ ] Ensure HTTPS is enabled for license requests
- [ ] Handle license expiration and renewal
- [ ] Test video codec and container format support

---

**Last Updated**: 2024
**Source**: CanIUse Feature Database
**Spec Status**: W3C Recommendation
