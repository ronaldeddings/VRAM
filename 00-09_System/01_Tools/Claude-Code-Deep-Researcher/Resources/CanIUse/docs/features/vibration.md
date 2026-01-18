# Vibration API

## Overview

The **Vibration API** provides a standard method for web applications to access and control the vibration mechanism of the hosting device. This allows developers to create haptic feedback experiences that enhance user interaction and engagement on mobile and other devices equipped with vibration hardware.

## Description

The Vibration API enables developers to trigger vibrations on supporting devices through JavaScript. This is particularly useful for providing tactile feedback to users during interactions, notifications, games, and other experiences. The API standardizes how vibration patterns are requested and handled across different devices and browsers.

## Specification Status

**Status:** [Recommendation (REC)](https://www.w3.org/TR/vibration/)

The Vibration API is an official W3C Recommendation, indicating it has achieved consensus and is stable for implementation.

### Specification Details
- **Official Spec:** [W3C Vibration API](https://www.w3.org/TR/vibration/)
- **Standardization Level:** Final Recommendation
- **Stability:** Stable

## Categories

- **JavaScript API**

## Benefits & Use Cases

### Primary Benefits
- **Enhanced User Feedback:** Provides tactile feedback to reinforce user actions
- **Improved Accessibility:** Offers alternative sensory feedback for notifications
- **Engaging Experiences:** Enables haptic effects in games and interactive applications
- **Consistent API:** Standard approach across browsers reduces implementation complexity

### Common Use Cases
1. **Mobile Gaming** - Provide haptic feedback for collisions, achievements, or actions
2. **Notifications** - Alert users through vibration patterns without sound
3. **Form Validation** - Tactile feedback for successful submissions or errors
4. **Accessibility Features** - Alternative feedback mechanism for users with hearing impairments
5. **Interactive Applications** - Enhance immersive experiences with haptic responses
6. **Mobile Applications** - Create native app-like experiences in web applications

## Browser Support

### Support Legend
- **✅ Supported** - Feature is fully supported
- **⚠️ Partial Support** - Feature has limited or experimental support
- **❌ Not Supported** - Feature is not supported

### Desktop Browsers

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Chrome** | ✅ Supported | 30+ | Full support across all modern versions |
| **Edge** | ✅ Supported | 79+ | Full support from Edge Chromium onwards |
| **Firefox** | ✅ Supported (⚠️ Partial) | 11-128 | Support with `-moz` prefix in v11-15; full support v16+ |
| **Safari** | ❌ Not Supported | — | No support across all versions tested |
| **Opera** | ✅ Supported | 17+ | Full support from version 17 onwards |
| **Internet Explorer** | ❌ Not Supported | — | Not supported in any version |

### Mobile Browsers & Platforms

| Browser/Platform | Support | Version | Notes |
|------------------|---------|---------|-------|
| **Chrome (Android)** | ✅ Supported | 142+ | Full support on Android devices |
| **Firefox (Android)** | ❌ Not Supported | 144 | Currently not supported on Android |
| **Samsung Internet** | ✅ Supported | 4+ | Full support across all versions |
| **Opera Mobile** | ✅ Supported | 80+ | Full support from version 80 onwards |
| **Android Browser** | ✅ Supported | 4.4+ | Full support from Android 4.4 onwards |
| **Opera Mini** | ❌ Not Supported | — | Not supported |
| **UC Browser (Android)** | ✅ Supported | 15.5+ | Supported from version 15.5 |
| **QQ Browser (Android)** | ✅ Supported | 14.9+ | Supported from version 14.9 |
| **Baidu Browser** | ✅ Supported | 13.52+ | Supported from version 13.52 |
| **Blackberry Browser** | ✅ Supported | 10+ | Supported from Blackberry 10 |
| **KaiOS Browser** | ✅ Supported | 2.5+ | Supported from KaiOS 2.5 and later |
| **iOS Safari** | ❌ Not Supported | — | Not supported in any tested version |
| **IE Mobile** | ❌ Not Supported | — | Not supported in any version |

### Global Browser Support
- **Usage Coverage:** ~80.74% of users
- **Widely Adopted:** Supported by major mobile browsers and Chromium-based browsers
- **Limited Desktop:** Desktop support is primarily limited to Chrome, Edge, Firefox, and Opera

## Implementation Guide

### Basic Usage

```javascript
// Simple vibration (in milliseconds)
navigator.vibrate(200);

// Pattern vibration (vibrate, pause, vibrate)
navigator.vibrate([200, 100, 200]);

// Cancel vibration
navigator.vibrate(0);
```

### Feature Detection

```javascript
// Check if vibration is supported
if ('vibrate' in navigator) {
  console.log('Vibration API is supported');
} else {
  console.log('Vibration API is not supported');
}
```

### Practical Examples

```javascript
// Provide feedback on button click
document.getElementById('button').addEventListener('click', () => {
  navigator.vibrate(100);
  // Handle click action
});

// Game collision effect
function onCollision() {
  navigator.vibrate([50, 30, 50]);
}

// Notification pattern
function notifyUser() {
  navigator.vibrate([200, 100, 200, 100, 200]);
}

// Accessibility-friendly alert
function accessibleAlert(message) {
  alert(message);
  if (navigator.vibrate) {
    navigator.vibrate([150, 75, 150]);
  }
}
```

## Important Notes

### Device Requirements
- Only works on devices with vibration hardware (primarily mobile phones)
- Desktop browsers may support the API but cannot produce vibrations without hardware
- Tablet devices may or may not have vibration capability depending on hardware

### Best Practices
1. **Always Feature Detect** - Check for support before using the API
2. **Provide Alternatives** - Don't rely solely on vibration for critical feedback
3. **Respect User Settings** - Device vibration may be disabled by the user
4. **Use Sparingly** - Excessive vibration can be annoying and drain battery
5. **Pattern Design** - Create recognizable patterns for different types of feedback

### Performance Considerations
- Vibration requests execute immediately without queuing
- Multiple rapid vibration calls may result in unexpected behavior
- Battery consumption increases with frequent vibration use
- Some devices may have vibration duration limits

### Browser-Specific Considerations
- **Firefox:** Required `-moz` prefix for versions 11-15
- **Safari/iOS:** Not supported; consider alternatives for iOS web apps
- **Android:** Generally well-supported; check specific device capabilities
- **Chrome:** Consistent support across versions

## Related Resources

### Official Documentation
- [MDN Web Docs - Vibration API](https://developer.mozilla.org/en-US/docs/Web/Guide/API/Vibration)

### Tutorials & Examples
- [Vibration API Sample Code & Demo](https://davidwalsh.name/vibration-api) - David Walsh's comprehensive guide with code examples
- [HTML5 Vibration API Tutorial](https://code.tutsplus.com/tutorials/html5-vibration-api--mobile-22585) - Tuts+ detailed tutorial
- [Interactive Demo](https://audero.it/demo/vibration-api-demo.html) - Live demo to test vibration patterns
- [Article and Usage Examples](https://www.illyism.com/journal/vibrate-mobile-phone-web-vibration-api/) - Real-world usage patterns and examples

### Official Specification
- [W3C Vibration API Specification](https://www.w3.org/TR/vibration/)

## Compatibility Table Summary

| Platform Category | Support Level | Key Points |
|-------------------|---------------|-----------|
| **Chromium Browsers** | ✅ Excellent | Chrome, Edge, Opera, and variants all supported |
| **Firefox** | ✅ Good | Supported on desktop and Android with historical `-moz` prefix support |
| **Safari** | ❌ Not Available | Not supported on iOS Safari or macOS Safari |
| **Mobile Browsers** | ✅ Very Good | Excellent support across Android browsers and platforms |
| **Legacy Browsers** | ❌ None | IE, older Opera/Firefox not supported |

## Recommendation

The Vibration API is **production-ready** for applications targeting:
- Android devices and Android-based mobile browsers
- Modern Chromium-based browsers (Chrome, Edge, Opera)
- Firefox on supported platforms
- Devices with vibration hardware

For applications requiring broad iOS support, consider alternative approaches or progressive enhancement strategies. Always implement feature detection to gracefully handle unsupported browsers.
