# Gyroscope API

## Overview

The Gyroscope API provides web developers with access to device rotational motion data through a standardized JavaScript interface. This sensor API measures the rate of rotation around the device's three primary axes (X, Y, and Z), enabling innovative motion-responsive web applications.

## Description

Defines a concrete sensor interface to monitor the rate of rotation around the device's local three primary axes. The Gyroscope API is part of the Generic Sensor specification and allows web applications to detect and respond to device rotational movements with high precision.

## Specification Status

- **Current Status**: Candidate Recommendation (CR)
- **W3C Specification**: [https://www.w3.org/TR/gyroscope/](https://www.w3.org/TR/gyroscope/)

## Category

- **JavaScript API**

## Use Cases & Benefits

The Gyroscope API enables a variety of innovative applications and experiences:

### Entertainment & Gaming
- Immersive game controls using device rotation
- Virtual reality (VR) and augmented reality (AR) experiences
- Motion-controlled interactive content

### User Interface Enhancements
- Tilt-based navigation and menu interactions
- Gesture-driven interfaces
- Device orientation-aware layouts

### Physical Sensors & Monitoring
- Device orientation detection
- Motion-based analytics and tracking
- Fitness and activity monitoring applications

### Accessibility
- Alternative input methods for users with limited mobility
- Motion-based gesture controls for navigation

### Web Applications
- 3D object manipulation through device rotation
- Immersive viewing experiences
- Motion parallax effects

## Browser Support

| Browser | Support | First Version | Latest Version |
|---------|---------|---------------|----------------|
| **Chrome** | ✅ Yes | 67 | 146+ |
| **Edge** | ✅ Yes | 79 | 143+ |
| **Opera** | ✅ Yes | 54 | 122+ |
| **Firefox** | ❌ No | N/A | 148 |
| **Safari** | ❌ No | N/A | 26.2 |
| **iOS Safari** | ❌ No | N/A | 26.1 |
| **Android Browser** | ✅ Yes | 4.4 | 142+ |
| **Samsung Internet** | ❌ No | N/A | 29 |
| **Opera Mobile** | ✅ Yes | 80 | 80+ |
| **Android Chrome** | ✅ Yes | — | 142+ |
| **Android Firefox** | ❌ No | N/A | 144 |
| **UC Browser (Android)** | ✅ Yes | — | 15.5+ |
| **QQ Browser (Android)** | ✅ Yes | — | 14.9+ |
| **Baidu Browser (Android)** | ✅ Yes | — | 13.52+ |
| **Opera Mini** | ❌ No | N/A | All versions |
| **BlackBerry** | ❌ No | N/A | — |
| **Internet Explorer** | ❌ No | N/A | 11 |
| **KaiOS** | ❌ No | N/A | 3.1 |

### Support Summary

- **Global Usage**: 78.23% of users have browser support
- **Major Support**: Desktop (Chrome, Edge, Opera) and Android (Chrome, native browser)
- **No Support**: Firefox (desktop), Safari, iOS, and older browsers

## Implementation Notes

### Chrome Implementation Status

Chrome versions 58-66 required enabling the "Generic Sensor" experimental flag via `about:flags`. Full support without flags began with **Chrome 67**.

### Firefox

Firefox does not currently support the Gyroscope API. The feature is not available even with experimental flags enabled.

### Mobile Considerations

- **iOS**: Not supported in Safari or WebView environments
- **Android**: Well-supported across Chrome, Firefox-based, and Chromium-based browsers
- **Device Hardware**: Requires devices with actual gyroscope hardware sensors

## Related Links

### Official Resources
- [W3C Gyroscope Specification](https://www.w3.org/TR/gyroscope/)
- [Generic Sensor Specification](https://www.w3.org/TR/generic-sensor/)

### Demos & Examples
- [Intel Generic Sensor Demos](https://intel.github.io/generic-sensor-demos/)

### Articles & Guides
- [Google Developers: Sensors for the Web](https://developers.google.com/web/updates/2017/09/sensors-for-the-web#gyroscope-sensor)

## Basic Usage Example

```javascript
// Check for Gyroscope support
if ('Gyroscope' in window) {
  try {
    const gyroscope = new Gyroscope();

    gyroscope.addEventListener('reading', () => {
      console.log('X-axis rotation rate:', gyroscope.x);
      console.log('Y-axis rotation rate:', gyroscope.y);
      console.log('Z-axis rotation rate:', gyroscope.z);
    });

    gyroscope.addEventListener('error', (event) => {
      console.error('Gyroscope error:', event.error.name);
    });

    gyroscope.start();
  } catch (error) {
    console.error('Gyroscope initialization failed:', error);
  }
} else {
  console.log('Gyroscope not supported');
}
```

## Permissions & Security

The Gyroscope API requires user permission before accessing device motion data. Browsers will prompt users to grant permission when the API is first used on a page.

### HTTPS Requirement

The Gyroscope API is only available in secure contexts (HTTPS). It cannot be used over unsecured HTTP connections.

### Permission Prompt

Users must explicitly grant permission for web applications to access gyroscope data. This ensures privacy and security of device motion information.

## Known Limitations

1. **Firefox Desktop**: No native support; feature has not been prioritized
2. **iOS/Safari**: Not supported due to platform limitations
3. **Hardware Dependency**: Requires physical gyroscope sensor on the device
4. **Performance**: May impact battery life on mobile devices
5. **Accuracy**: Sensor accuracy varies by device and manufacturer

## Migration & Polyfills

There are no official polyfills for the Gyroscope API, as it requires hardware-level sensor access that cannot be emulated in JavaScript alone. For applications requiring broad compatibility, consider:

1. Progressive enhancement - provide fallback experiences for unsupported browsers
2. Use `DeviceOrientationEvent` as a less precise alternative for some use cases
3. Graceful degradation - ensure core functionality works without motion sensing

## Best Practices

- Always check for browser support before using the API
- Request user permission explicitly
- Handle permission denied scenarios gracefully
- Test on actual devices with gyroscope hardware
- Consider battery impact when continuously sampling
- Use appropriate sensor frequency to balance responsiveness and performance
- Provide alternative input methods for users without gyroscope support

## Future Development

The Gyroscope API is part of the broader Generic Sensor specification initiative, which aims to provide standardized access to device sensors. As browser support continues to expand, particularly with Firefox adoption, the API's utility and reach will increase significantly.

---

**Last Updated**: 2024
**Based on CanIUse Data**: December 2025
