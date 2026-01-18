# DeviceOrientation & DeviceMotion Events

## Overview

The DeviceOrientation and DeviceMotion events API provides a standardized way for web applications to detect and respond to orientation and motion events from the device running the browser. This is particularly useful for mobile and tablet devices with accelerometers, gyroscopes, and magnetometers.

## Description

The DeviceOrientation and DeviceMotion events API allows JavaScript code to access device orientation and motion sensor data. This enables developers to create immersive, responsive web experiences that can adapt to how users are holding their devices, including detecting device rotation, tilt, and movement in 3D space.

## Current Specification Status

- **Status**: Candidate Recommendation (CR)
- **W3C Specification**: [Orientation Event Specification](https://www.w3.org/TR/orientation-event/)

## Categories

- JavaScript API

## Use Cases & Benefits

The DeviceOrientation and DeviceMotion API enables several important web capabilities:

### Interactive Experiences
- **Gesture-Based Controls**: Use device orientation to control games, maps, or interactive visualizations
- **Tilt-Based Navigation**: Navigate interfaces by tilting the device
- **3D Model Rotation**: Rotate 3D objects based on device orientation

### Accessibility & Assistance
- **Shake Detection**: Trigger undo/reset functionality with device shake
- **Motion-Based Interaction**: Enable hands-free control for users with mobility limitations

### Data Collection & Analytics
- **User Behavior Analysis**: Understand how users hold and move their devices
- **Device Capability Detection**: Identify sensors available on user devices

### Gaming & Entertainment
- **Mobile Games**: Use device tilting as primary control mechanism (e.g., racing games, marble maze)
- **Augmented Reality**: Combine with camera to provide location-based AR experiences
- **Virtual Reality**: Support VR headset interactions and tracking

### Location & Navigation
- **Compass Applications**: Build compass or navigation tools
- **Map Rotation**: Rotate maps based on device orientation
- **Point-of-Interest Navigation**: Guide users with device rotation

## Core API Events

### DeviceOrientationEvent
Provides device orientation data with three rotation angles:
- **alpha**: Rotation around the Z-axis (0-360 degrees)
- **beta**: Rotation around the X-axis (-180 to 180 degrees)
- **gamma**: Rotation around the Y-axis (-90 to 90 degrees)

### DeviceMotionEvent
Provides device motion and acceleration data:
- **acceleration**: Device acceleration on X, Y, and Z axes
- **accelerationIncludingGravity**: Acceleration including the effect of gravity
- **rotationRate**: Rate of rotation around each axis
- **interval**: Time between events

## Browser Support

### Support Legend
- **y** = Full support
- **a** = Partial support (see notes below)
- **p** = Partial/Experimental support
- **n** = No support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| Chrome | 7+ | Partial (a) | All versions 7+ support with partial support |
| Firefox | 3.6+ | Partial (a) | Support from 3.6 (non-standard MozOrientation), standardized from 6+ |
| Safari | Not supported | None (n) | No support across all versions |
| Opera | 15+ | Partial (a) | Support from version 15 onwards |
| Edge | 12-18 | Full (y) | Versions 12-18 have full support |
| Edge (Chromium-based) | 79+ | Partial (a) | Partial support from 79+ |
| Internet Explorer | 11 | Partial (a) | Limited support in IE11 with notes |
| Internet Explorer | 5.5-10 | None (n) | No support |

### Mobile Browsers

| Platform | Browser | First Support | Current Status |
|----------|---------|---------------|----------------|
| iOS | Safari | Not supported | No support across all versions (3.2-18.5) |
| iOS | Mobile Safari | 4.2+ | Partial (a) | Partial support from 4.2+ (non-standard implementation) |
| Android | Chrome | All tested | Partial (a) | Support from Android 2.3+ |
| Android | Firefox | All tested | Partial (a) | All tested versions support with partial |
| Android | Native Browser | 3+ | Partial (a) | Support from Android 3 onwards |
| Android | Opera Mobile | 12+ | Full/Partial (y/a) | Full support in 12, partial from 80+ |
| Android | Samsung Internet | 4+ | Partial (a) | Support from version 4 onwards |

### Other Mobile Browsers

| Browser | Support |
|---------|---------|
| Opera Mini | No support (n) |
| Blackberry | Partial (a) from 10+ |
| UC Browser (Android) | Partial (a) from 15.5+ |
| Android QQ | Partial (a) from 14.9+ |
| Baidu Browser | Partial (a) from 13.52+ |
| KaiOS | Partial (a) from 2.5+ |
| IE Mobile | No support (n) for 10; Full support (y) for 11 |

## Implementation Notes

### Partial Support Details

**"Partial support" refers to:**
1. **Missing `compassneedscalibration` Event**: This event is not supported in most browsers
2. **Missing DeviceMotion Event**: Chrome 30 and earlier, and older Opera versions lack DeviceMotion event support
3. **Inconsistent Implementation Details**: See browser-specific quirks below

### Browser-Specific Quirks

#### Firefox vs Safari Coordinate System Differences
There are important differences in how Firefox and Safari implement the specification:

- **Beta Angle Range**:
  - Mobile Safari: -90 to 90 degrees
  - Firefox: -180 to -180 degrees
  - [See Firefox reference](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
  - [See Safari reference](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html#//apple_ref/javascript/instp/DeviceOrientationEvent/beta)

- **Gamma Angle Range**:
  - Mobile Safari: -180 to 180 degrees
  - Firefox: -90 to 90 degrees

#### Safari iOS Implementation Issues
Safari on iOS has notable differences from the specification:

1. **Alpha Orientation**: Alpha is arbitrary instead of being relative to true north, as required by the specification
2. **Compass Heading API**: Safari offers `webkitCompassHeading` as an alternative
   - `webkitCompassHeading` has the opposite sign to standard alpha
   - It measures relative to magnetic north instead of true north
   - [See W3C issue discussion](https://github.com/w3c/deviceorientation/issues/6)

#### Internet Explorer 11 Notes
- `compassneedscalibration` event is only supported on compatible devices running Windows 8.1 or later

### Historical Implementation Notes
- **Firefox 3.6, 4, 5**: Support the non-standard `MozOrientation` event before standardization
- **Opera Mobile 14**: Lost ondevicemotion event support
- **Chrome 30 and earlier**: No DeviceMotion event support

## Usage Statistics

- **Full Support Usage**: 0%
- **Partial Support Usage**: 92.21%
- **No Support**: 7.79%

The vast majority of modern devices that support this API report it as partial support due to implementation variations and missing optional features like the `compassneedscalibration` event.

## Getting Started

### Basic Example: Detecting Device Orientation

```javascript
// Request permission (required on iOS 13+)
if (typeof DeviceOrientationEvent === 'undefined') {
  console.log('DeviceOrientation not supported');
} else if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  // iOS 13+ requires explicit permission
  DeviceOrientationEvent.requestPermission()
    .then(function(permission) {
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    })
    .catch(function() {
      console.log('Permission denied');
    });
} else {
  // Non-iOS 13+
  window.addEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event) {
  const alpha = event.alpha; // 0-360: Z rotation
  const beta = event.beta;   // -180 to 180: X rotation
  const gamma = event.gamma; // -90 to 90: Y rotation

  console.log('Alpha:', alpha, 'Beta:', beta, 'Gamma:', gamma);
}
```

### Basic Example: Detecting Device Motion

```javascript
// Request permission (required on iOS 13+)
if (typeof DeviceMotionEvent === 'undefined') {
  console.log('DeviceMotion not supported');
} else if (typeof DeviceMotionEvent.requestPermission === 'function') {
  // iOS 13+ requires explicit permission
  DeviceMotionEvent.requestPermission()
    .then(function(permission) {
      if (permission === 'granted') {
        window.addEventListener('devicemotion', handleMotion);
      }
    })
    .catch(function() {
      console.log('Permission denied');
    });
} else {
  // Non-iOS 13+
  window.addEventListener('devicemotion', handleMotion);
}

function handleMotion(event) {
  const accel = event.acceleration;
  const accelGravity = event.accelerationIncludingGravity;
  const rotationRate = event.rotationRate;

  console.log('Acceleration:', accel);
  console.log('Acceleration with Gravity:', accelGravity);
  console.log('Rotation Rate:', rotationRate);
}
```

## Compatibility Considerations

### Feature Detection
Always test for support before using the API:

```javascript
function isDeviceOrientationSupported() {
  return 'DeviceOrientationEvent' in window;
}

function isDeviceMotionSupported() {
  return 'DeviceMotionEvent' in window;
}
```

### Permission Handling
iOS 13+ requires explicit user permission via `requestPermission()` method.

### Fallback Strategies
- Provide alternative input methods (buttons, touch gestures) for browsers without support
- Gracefully degrade functionality when the API is unavailable

### Browser Quirks
- Test on target platforms due to implementation inconsistencies
- Be aware of coordinate system differences between Firefox and Safari
- Use Safari's `webkitCompassHeading` for iOS compass functionality if needed

## Security & Privacy Considerations

### Permission Model
- Modern browsers require user permission to access device orientation and motion data
- Users can revoke permissions in settings
- This protects user privacy and security

### HTTPS Requirement
Some browsers may require HTTPS for accessing sensor data (varies by browser and version)

### User Trust
- Request permissions at appropriate times in the user journey
- Clearly communicate why the API is needed
- Respect user's privacy choices

## Related Resources

### Official Documentation
- [W3C Orientation Event Specification](https://www.w3.org/TR/orientation-event/)
- [MDN DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)
- [MDN DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent)

### Tutorials & Guides
- [HTML5 Rocks DeviceOrientation Tutorial](https://www.html5rocks.com/en/tutorials/device/orientation/)
- [Interactive Demo](https://audero.it/demo/device-orientation-api-demo.html)

### Polyfill & Detection
- [has.js DeviceOrientation Detection](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-orientation)

### Historical References
- [IE10 Implementation Prototype](http://html5labs.interoperabilitybridges.com/prototypes/device-orientation-events/device-orientation-events/info)

## Testing Compatibility

To test DeviceOrientation and DeviceMotion:

1. **Mobile Devices**: Physical testing on actual devices with orientation sensors
2. **Desktop Emulation**: Chrome DevTools device emulation with simulated sensor data
3. **Web-based Tools**: Use the interactive demo linked above to verify support

## Summary

The DeviceOrientation and DeviceMotion events API is widely supported across mobile devices (92.21% usage for partial support) and provides essential capabilities for modern mobile web applications. However, developers must be aware of implementation variations, especially between Firefox and Safari, and handle permissions appropriately for iOS 13+.

---

**Last Updated**: 2024
**Feature ID**: deviceorientation
**Chrome ID**: 5874690627207168, 5556931766779904
