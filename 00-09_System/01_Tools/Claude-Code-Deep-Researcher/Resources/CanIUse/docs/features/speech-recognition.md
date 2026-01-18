# Speech Recognition API

## Overview

The **Speech Recognition API** provides a method to enable voice input in web browsers, allowing developers to capture and process spoken audio from users. This API is part of the larger Web Speech API specification and enables voice-driven applications and accessibility features.

## Description

The Speech Recognition API allows web applications to accept voice input from users and convert speech to text. This facilitates the creation of voice-controlled interfaces, voice commands, and enhanced accessibility features for web applications.

## Specification Status

**Status:** Unofficial (Proposed)

- **W3C Specification:** [Web Speech API - Speech Recognition](https://w3c.github.io/speech-api/speechapi.html#speechreco-section)
- The API is a work-in-progress specification and has not reached full standardization across all browsers.

## Categories

- JavaScript API

## Use Cases & Benefits

The Speech Recognition API enables several powerful use cases:

### Accessibility
- Voice control for users with motor impairments
- Alternative input method for accessibility-focused applications
- Screen reader integration for voice-driven navigation

### User Experience
- Hands-free operation for mobile and touch devices
- Natural language interface for web applications
- Voice-activated search and form filling

### Applications
- Voice command interfaces for smart home controls
- Dictation and note-taking applications
- Multilingual voice input and transcription
- Customer service chatbots with voice capability
- Voice-controlled gaming and interactive experiences

### Productivity
- Voice-based document creation
- Voice memo and recording applications
- Transcription services and tools

## Browser Support

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 25+ | Partial (a x #1) | Vendor prefix required; some attributes missing |
| **Safari** | 14.1+ | Partial (a x #4) | WebKit prefix (`webkitSpeechRecognition`); no SpeechGrammar/SpeechGrammarList support; requires Siri enabled; not available in SafariViewController or web apps on Home Screen |
| **Safari (iOS)** | 14.5+ | Partial (a x #4) | Same limitations as desktop Safari with WebKit prefix |
| **Samsung Internet** | 4.0+ | Partial (a x #1) | Vendor prefix required; some attributes missing |
| **Opera Mobile** | 80+ | Partial (a x #1) | Vendor prefix required; some attributes missing |
| **Opera** | 27+ | Not supported (#3) | API present but events do not fire |
| **Edge** | 79+ | Not supported (#3) | API present but events do not fire |
| **Firefox** | 22+ | Disabled by default (#2) | Requires `media.webspeech.recognition.enable` flag in about:config; waiting for permissions model |
| **Internet Explorer** | All versions | Not supported | - |
| **Opera Mini** | All versions | Not supported | - |
| **Android Browser** | All versions | Not supported | - |
| **Android Chrome** | 142+ | Partial (a x #1) | Vendor prefix required |
| **Android Firefox** | 144 | Not supported | - |
| **UC Browser** | 15.5+ | Partial (a x #1) | Vendor prefix required |
| **QQ Browser** | 14.9+ | Partial (a x #1) | Vendor prefix required |
| **Baidu Browser** | 13.52+ | Partial (a x #1) | Vendor prefix required |
| **KaiOS** | 2.5+ | Not supported (#2) | Waiting for permissions model |

### Legend

- **y** = Fully supported
- **a** = Partial support
- **x** = Requires vendor prefix
- **d** = Disabled by default
- **n** = Not supported

## Important Notes

### Note #1: Partial Support (Chrome, Samsung, Opera Mobile, UC Browser, QQ Browser, Baidu)
Partial support refers to some attributes or functionality missing from the specification. The core speech recognition functionality works, but not all API features are implemented.

### Note #2: Firefox & KaiOS - Permissions Model
Firefox currently has a `media.webspeech.recognition.enable` flag in about:config, but full support is waiting for the permissions model to be sorted out. KaiOS has the same limitation.

### Note #3: Edge & Opera - Event Firing Issues
Edge and Opera appear to have support for the `SpeechRecognition` API implementation, but events do not fire properly, making the API non-functional in practice.

### Note #4: Safari - Webkit Prefix & Limitations
- Safari 14.1 and Technology Preview 119+ include prefixed support using `webkitSpeechRecognition`
- Does not support `SpeechGrammar` or `SpeechGrammarList`
- Requires Siri to be enabled on the device
- Not available in SafariViewController
- Not available in web apps added to Home Screen
- See [WebKit Bug #225298](https://bugs.webkit.org/show_bug.cgi?id=225298#c3)

## Implementation Recommendations

### Vendor Prefixes
When implementing the Speech Recognition API, use vendor prefixes for broader browser support:

```javascript
// Use webkit prefix for Safari and other WebKit-based browsers
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.warn('Speech Recognition API not supported in this browser');
}
```

### Cross-Browser Considerations
- **Chrome/Android Chrome:** Requires vendor prefix but most complete implementation
- **Safari/iOS Safari:** Requires `webkitSpeechRecognition` prefix and has limited grammar support
- **Firefox:** Requires manual flag enablement; not recommended for production
- **Edge/Opera:** API present but non-functional; provide fallback

### Feature Detection
Always check for browser support before using the API:

```javascript
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  // API is supported
} else {
  // Provide alternative input method
}
```

## Relevant Links

- [HTML5Rocks: Voice-Driven Web Apps Introduction to Web Speech API](https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api/)
- [SitePoint: Introducing the Web Speech API](https://www.sitepoint.com/introducing-web-speech-api/)
- [Web Speech API Demo](https://www.audero.it/demo/web-speech-api-demo.html)
- [Advanced Demo and Resource](https://zenorocha.github.io/voice-elements/#recognition-element)
- [Chromium Bug: Unprefix the Speech Recognition API](https://bugs.chromium.org/p/chromium/issues/detail?id=570968)
- [W3C Speech API Specification](https://w3c.github.io/speech-api/speechapi.html#speechreco-section)

## Current Browser Statistics

- **Fully Supported (y):** 0%
- **Partial Support (a):** 85.13%
- **No Support (n):** 14.87%

## Summary

The Speech Recognition API offers significant potential for voice-enabled web applications, particularly in Chrome and Safari (with vendor prefixes). However, the lack of standardization and incomplete implementation across browsers means careful feature detection and fallback strategies are essential. Developers should test thoroughly on target platforms and provide alternative input methods for users on unsupported browsers.

The API is particularly valuable for accessibility features and mobile applications where voice input can enhance the user experience. As browser support and standardization improve, adoption is expected to increase.

---

*Documentation generated from CanIUse feature data. Last updated: 2025*
