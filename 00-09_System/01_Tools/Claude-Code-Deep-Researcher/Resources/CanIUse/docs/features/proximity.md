# Proximity API

## Overview

The **Proximity API** is a web standard that provides events containing information about the distance between a device and an object, as measured by a proximity sensor. This API enables web applications to react to proximity events, typically when a user brings a device (such as a smartphone) close to their face.

## Description

Proximity events allow developers to detect when a device is in close proximity to an object. This is primarily useful for:

- Detecting when a device is held to the user's ear (proximity to face)
- Triggering device behavior changes based on proximity state
- Optimizing display and sensor usage when the device is near the user

The API provides a simple event-based interface that fires `deviceproximity` events when proximity to an object changes, allowing developers to handle these events and respond accordingly.

## Specification Status

**Status:** Candidate Recommendation (CR)

**W3C Specification:** [Proximity Events Specification](https://www.w3.org/TR/proximity/)

The specification is actively maintained by the W3C and describes the standardized interface for proximity sensing in web browsers.

## Categories

- JavaScript API
- Device Sensor API
- Hardware Interface

## Use Cases and Benefits

### Primary Use Cases

1. **Call Management**
   - Disable screen during calls when device is near the ear
   - Prevent accidental screen touches while talking
   - Optimize display brightness to save power during calls

2. **Power Optimization**
   - Reduce power consumption by deactivating unnecessary sensors when device is in proximity
   - Optimize vibration and sound output based on proximity state
   - Manage CPU and display resources more efficiently

3. **User Experience Enhancement**
   - Customize application behavior based on proximity state
   - Trigger specific actions when device is held to the ear
   - Improve accessibility features based on device proximity

4. **Security and Privacy**
   - Automatically lock sensitive information when device is brought close to the user
   - Trigger additional authentication when proximity changes

### Benefits

- **Hardware Integration:** Provides standardized access to device proximity sensors
- **Power Efficiency:** Enables applications to optimize power consumption
- **User Experience:** Allows context-aware behavior changes based on physical device state
- **Accessibility:** Supports alternative interaction patterns for users

## Browser Support

### Support Legend
- ✅ **y** – Fully supported
- ❌ **n** – Not supported

### Desktop Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **Firefox** | ✅ Since v15 | Fully supported from Firefox 15 onwards (100% support) |
| **Chrome** | ❌ No support | Not implemented in any version |
| **Safari** | ❌ No support | Not implemented in any version |
| **Opera** | ❌ No support | Not implemented in any version |
| **Edge** | ❌ No support | Not implemented in any version |
| **Internet Explorer** | ❌ No support | Not implemented in any version |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **Firefox Mobile** | ✅ Yes | Supported in Android Firefox (v144+) |
| **Safari iOS** | ❌ No support | Not implemented in any version |
| **Chrome Android** | ❌ No support | Not implemented in any version |
| **Opera Mobile** | ❌ No support | Not implemented in any version |
| **Opera Mini** | ❌ No support | Not supported |
| **Samsung Browser** | ❌ No support | Not implemented in any version |
| **UC Browser** | ❌ No support | Not implemented in any version |
| **Android Browser** | ❌ No support | Not implemented in any version |
| **BlackBerry** | ❌ No support | Not implemented in any version |
| **IE Mobile** | ❌ No support | Not implemented in any version |
| **KaiOS** | ✅ Yes | Supported in KaiOS 2.5+ |

### Overall Browser Market Coverage

**Global Support:** ~2.19% of users have access to this API (primarily Firefox users and KaiOS device users)

## Implementation Notes

### Limited Adoption

The Proximity API has very limited adoption across modern browsers. Only Firefox and a few mobile platforms (KaiOS and Android Firefox) provide support. This makes it unsuitable for production use cases that require broad compatibility.

### Hardware Requirements

Support for the Proximity API depends on:
- Device having a proximity sensor (typically found in smartphones)
- Browser with implemented support for the API
- Operating system exposing the sensor data to the browser

### Fallback Strategies

For applications requiring proximity detection:
1. Feature detection with `'ondeviceproximity' in window`
2. Graceful fallbacks for browsers without support
3. Alternative approaches using accelerometer or orientation sensors
4. Server-side alternatives for critical functionality

### Known Limitations

- Firefox is the only major desktop browser with support
- Safari and Chrome have not prioritized this API
- Desktop devices typically lack proximity sensors, limiting use cases
- Mobile browser support is extremely limited
- No vendor prefixes required for supported implementations

## Technical Reference

### API Interface

The API exposes the following events:

```javascript
// Check if the API is supported
if ('ondeviceproximity' in window) {
  // Listen for proximity events
  window.addEventListener('deviceproximity', (event) => {
    // event.value: distance in centimeters
    // event.min: minimum detection distance
    // event.max: maximum detection distance
  });
}

// For user proximity (typically to face)
window.addEventListener('userproximity', (event) => {
  // event.near: boolean indicating if user is near
});
```

### Event Details

- **deviceproximity**: Provides continuous distance measurements
  - `value`: Current distance in centimeters
  - `min`: Minimum distance the sensor can detect
  - `max`: Maximum distance the sensor can detect

- **userproximity**: Binary proximity indication
  - `near`: Boolean, true when user is near (typically < 5 cm)

## Related Resources

### Official Documentation
- [W3C Proximity Events Specification](https://www.w3.org/TR/proximity/)

### Articles and Tutorials
- [SitePoint: Introducing the Proximity API](https://www.sitepoint.com/introducing-proximity-api/)

### Live Demo
- [Proximity API Demo](https://audero.it/demo/proximity-api-demo.html)

## Recommendations

### When to Use

- Applications specifically targeting Firefox users
- Mobile applications on KaiOS devices
- Proof-of-concept or experimental features
- Educational purposes for learning about sensor APIs

### When to Avoid

- Production applications requiring broad browser compatibility
- Web applications targeting mainstream consumers
- Applications relying on this feature for core functionality
- Cross-browser applications without extensive feature detection

### Alternatives

Consider these alternatives for similar functionality:

1. **Accelerometer/Gyroscope APIs** - For motion-based interactions
2. **Battery API** - For power-aware optimizations (though deprecated)
3. **Ambient Light Sensor** - For light-based adjustments
4. **User Interaction Events** - For UI-based proximity handling
5. **Device Orientation API** - For orientation-based context

## Compatibility Notes

The Proximity API remains a niche feature with minimal real-world usage. Its limited adoption makes it impractical for most web development scenarios. For applications requiring proximity detection, developers should implement robust feature detection and provide meaningful fallbacks.

---

*Documentation last updated: December 2024*

*Data source: CanIUse.com Proximity API feature database*
