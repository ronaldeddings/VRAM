# Speech Synthesis API

## Overview

The Speech Synthesis API is a web API that enables developers to control text-to-speech (TTS) output in web applications. This capability allows web pages to speak text content to users programmatically, opening possibilities for accessibility enhancements, interactive applications, and innovative user experiences.

## Description

The Speech Synthesis API provides a JavaScript interface for generating and controlling synthetic speech from text. It allows web developers to:

- Convert text to spoken audio
- Control speech parameters (rate, pitch, volume)
- Select from available voices and languages
- Manage playback (play, pause, resume, cancel)
- Handle speech events (start, end, error, pause, resume)

## Specification

- **Status:** Unofficial (Editor's Draft)
- **Specification URL:** [W3C Speech API - Text-to-Speech Section](https://w3c.github.io/speech-api/speechapi.html#tts-section)
- **Parent Feature:** [Web Speech API](/features/web-speech)
- **Category:** JavaScript API

## Use Cases & Benefits

### Accessibility Enhancement
- Assist users with visual impairments by providing audio descriptions
- Support dyslexic users with alternative content delivery
- Enable hands-free browsing experiences

### Educational Applications
- Language learning platforms with native pronunciation
- Interactive tutorials with spoken instructions
- Accessibility features for educational content

### Interactive User Experience
- Real-time feedback and confirmations
- Voice-enabled chatbots and virtual assistants
- Immersive storytelling and gaming applications

### Accessibility Compliance
- WCAG 2.1 compliance support
- Alternative content delivery methods
- Inclusive user interfaces

## Browser Support

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | v33 | v146+ ✓ | Pause/resume issues in v55+; stops after ~15 seconds on Windows 7/10, Ubuntu 14.04 |
| **Edge** | v14 | v143+ ✓ | Full support with limitations noted in Chrome (#2) |
| **Firefox** | v49 | v148+ ✓ | Requires `media.webspeech.synth.enabled` flag (v31-48) |
| **Safari** | v7 | v18.5+ ✓ | Full support across macOS and iOS versions |
| **Opera** | v27 | v122+ ✓ | Full support; limitations match Chrome (#2) |
| **iOS Safari** | v7.0-7.1 | v18.5+ ✓ | Full support |
| **Samsung Internet** | v5.0-5.4 | v29+ ✓ | Full support |
| **Android Chrome** | v142+ | v142+ ✓ | Full support |
| **Android Firefox** | v144+ | v144+ ✓ | Full support |
| **Opera Mini** | — | Not Supported | No support |
| **Android Browser** | — | Not Supported | No support |
| **BlackBerry** | — | Not Supported | No support |
| **Opera Mobile** | — | Not Supported | No support |
| **Baidu Browser** | — | Not Supported | No support |
| **UC Browser** | — | Not Supported | No support |
| **KaiOS** | v2.5+ | v3.0+ ✓ | Full support |
| **Android QQ** | v14.9+ | v14.9+ ✓ | Full support |

### Support Summary
- **Global Coverage:** 91.31% of users
- **Major Browsers:** Supported in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile:** Supported on iOS, Samsung Internet, and modern Android browsers
- **Legacy Browsers:** No support in Internet Explorer or older browser versions

## Browser-Specific Notes

### Chrome & Chromium-Based Browsers
**Issue #2:** Speech Synthesis stops playback abruptly after approximately 15 seconds on:
- Windows 7 & 10
- Ubuntu 14.04
- Potentially other platforms

This is a known limitation ([Chrome Issue 679437](https://bugs.chromium.org/p/chromium/issues/detail?id=679437)) that affects pause/resume functionality as well.

### Firefox
**Note #1:** Speech Synthesis is disabled by default in Firefox versions 31-48. Users can enable it by:
1. Navigating to `about:config`
2. Setting `media.webspeech.synth.enabled` to `true`

### Safari & iOS Safari
- Full support with no known limitations
- Works consistently across macOS and iOS versions

### Samsung Internet & GearVR
Samsung Internet for GearVR had Speech Synthesis in development as of the documentation snapshot, with release planned for Q1/2017 based on Chromium m53.

## Implementation Example

```javascript
// Basic Speech Synthesis Example
function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure speech parameters
    utterance.rate = 1.0;     // 0.1 to 10 (default 1)
    utterance.pitch = 1.0;    // 0 to 2 (default 1)
    utterance.volume = 1.0;   // 0 to 1 (default 1)

    // Optional: select specific voice
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    // Add event listeners
    utterance.onstart = () => console.log('Speech started');
    utterance.onend = () => console.log('Speech ended');
    utterance.onerror = (event) => console.error('Speech error:', event.error);

    // Speak the utterance
    speechSynthesis.speak(utterance);
  } else {
    console.log('Speech Synthesis not supported');
  }
}

// Usage
speakText("Hello, world!");
```

## Key Features

### Properties
- `text`: The text to be synthesized
- `voice`: The voice to use for synthesis
- `rate`: Speech rate (0.1 - 10, default 1)
- `pitch`: Speech pitch (0 - 2, default 1)
- `volume`: Speech volume (0 - 1, default 1)
- `lang`: Language code (e.g., "en-US", "fr-FR")

### Methods
- `speak()`: Add utterance to queue and start speaking
- `cancel()`: Remove all utterances from queue
- `pause()`: Pause current utterance
- `resume()`: Resume paused utterance
- `getVoices()`: Get array of available voices

### Events
- `onstart`: Fired when speech starts
- `onend`: Fired when speech ends
- `onpause`: Fired when speech is paused
- `onresume`: Fired when speech resumes
- `onerror`: Fired when an error occurs
- `onboundary`: Fired at word/sentence boundaries

## Known Issues & Limitations

### Chrome Pause/Resume Bug
Speech synthesis in Chrome versions 55+ stops playback after approximately 15 seconds on Windows 7, Windows 10, Ubuntu 14.04, and possibly other platforms. This affects both pause/resume functionality and extended audio playback.

**Workaround:** Consider using alternative audio APIs (Web Audio API) for longer speeches, or implement splitting of text into shorter utterances.

### Firefox Feature Flag
Firefox users need to manually enable Speech Synthesis through the about:config flag, reducing accessibility for general users.

### Voice Availability
Available voices vary by operating system and browser. Desktop systems typically offer more voices than mobile devices.

## Accessibility Considerations

- Provide text alternatives alongside synthesized speech
- Include visible captions or transcripts
- Allow users to control speech rate and volume
- Test with actual screen reader users
- Ensure proper language identification for correct pronunciation
- Consider WCAG 2.1 guidelines for multimedia content

## Related Resources

### Official Documentation
- [MDN - SpeechSynthesis API](https://developer.mozilla.org/docs/Web/API/SpeechSynthesis)
- [Google Developers - Web Apps That Talk](https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API)
- [W3C Speech API Specification](https://w3c.github.io/speech-api/speechapi.html#tts-section)

### Tutorials & Articles
- [SitePoint - Talking Web Pages and the Speech Synthesis API](https://www.sitepoint.com/talking-web-pages-and-the-speech-synthesis-api/)

### Live Demonstrations
- [Audero Speech Synthesis API Demo](https://www.audero.it/demo/speech-synthesis-api-demo.html)
- [Voice Elements - Advanced Demo and Resources](https://zenorocha.github.io/voice-elements/)

## Keywords

`speech`, `synthesis`, `speechSynthesis`, `TTS`, `SpeechSynthesisUtterance`, `text-to-speech`, `accessibility`, `web-speech`

---

**Last Updated:** 2025
**Data Source:** Can I Use - Speech Synthesis API Feature Database
