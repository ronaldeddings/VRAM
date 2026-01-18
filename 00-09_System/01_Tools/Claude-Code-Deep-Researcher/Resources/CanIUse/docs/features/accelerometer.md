# Accelerometer API

## Overview

The **Accelerometer API** provides JavaScript interfaces for accessing device acceleration sensor data along the X, Y, and Z axes. This API is part of the Generic Sensor Framework and enables web applications to detect and respond to device motion, including acceleration due to gravity.

## Description

The Accelerometer API defines three main interfaces:

- **`Accelerometer`** - Provides total acceleration including gravity
- **`LinearAccelerationSensor`** - Provides acceleration without gravity
- **`GravitySensor`** - Provides gravity-only acceleration

These interfaces follow the Generic Sensor specification and provide a unified, standardized way to access device motion data across different platforms and browsers.

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Candidate Recommendation (CR) |
| **Specification** | [W3C Accelerometer Specification](https://www.w3.org/TR/accelerometer/) |
| **Category** | JavaScript API |
| **Latest Data** | Updated with 78.23% global usage |

## Categories

- **JavaScript API** - DOM API for sensor access

## Benefits and Use Cases

The Accelerometer API enables a variety of innovative web applications:

### User Experience Enhancements
- **Device Orientation Detection** - Adapt UI based on device orientation changes
- **Motion-Based Navigation** - Tilt-based scrolling and menu navigation
- **Gesture Recognition** - Detect shake, tilt, and other motion patterns

### Gaming and Interactive Apps
- **Game Controls** - Motion-based game controls for immersive experiences
- **Virtual Reality** - Support for VR/AR applications on the web
- **Fitness Tracking** - Step counting and activity detection

### Accessibility
- **Motion-Based Accessibility** - Alternative input methods for users with limited mobility
- **Adaptive Interfaces** - Dynamic UI adjustments based on device motion

### Data Collection and Analytics
- **User Behavior Analysis** - Understanding how users interact with devices
- **Performance Monitoring** - Detecting and analyzing device motion patterns

## Browser Support

### Summary of First Full Support

| Browser | First Full Support | Current Status |
|---------|-------------------|----------------|
| **Chrome** | Version 67 | Full support (v67+) |
| **Edge** | Version 79 | Full support (v79+) |
| **Firefox** | Not supported | No support (as of v148) |
| **Safari** | Not supported | No support (as of v18.2) |
| **iOS Safari** | Not supported | No support (as of v18.5) |
| **Opera** | Version 54 | Full support (v54+) |
| **Android Browser** | Version 142+ | Full support |
| **Opera Mobile** | Version 80+ | Full support |

### Detailed Browser Support

#### Desktop Browsers

**Chrome**: Full support starting from version 67
- Chrome 58-66: Available with experimental flag (`#1`)
- Chrome 67+: Full support

**Edge**: Full support starting from version 79
- Edge 12-78: No support
- Edge 79+: Full support

**Firefox**: No support across all versions (up to 148)
- Not yet implemented
- Implementation tracked in specification

**Safari**: No support across all versions (up to 18.2)
- No implementation planned

**Opera**: Full support starting from version 54
- Opera 9-53: No support
- Opera 54+: Full support

#### Mobile Browsers

**iOS Safari**: No support across all versions (up to 18.5)
- Not available on iOS platform

**Android Browser**: Full support from version 142
- Earlier versions: No support
- Version 142+: Full support

**Android Chrome**: Full support from version 142
- Consistent with Android browser

**Opera Mobile**: Full support starting from version 80
- Opera Mobile 10-79: No support
- Version 80+: Full support

**Samsung Internet**: No support across all tested versions (up to 29)

**UC Browser**: Full support from version 15.5

**Android Firefox**: No support (tested up to v144)

**BlackBerry Browser**: No support

**Opera Mini**: No support across all versions

**Baidu Browser**: Full support from version 13.52

**QQ Browser**: Full support from version 14.9

**KaiOS**: No support (versions 2.5-3.1)

## Feature Details

### Availability Notes

The Accelerometer API is available through the Generic Sensor framework. In some browsers:

- **Chrome 58-66**: Available by enabling the "Generic Sensor" experimental flag in `about:flags`

### API Interfaces

```javascript
// Accelerometer - includes gravity
const accelerometer = new Accelerometer({ frequency: 60 });

// LinearAccelerationSensor - excludes gravity
const linearAccel = new LinearAccelerationSensor({ frequency: 60 });

// GravitySensor - gravity only
const gravity = new GravitySensor({ frequency: 60 });

// Common event listener
accelerometer.addEventListener('reading', () => {
  console.log(`X: ${accelerometer.x}`);
  console.log(`Y: ${accelerometer.y}`);
  console.log(`Z: ${accelerometer.z}`);
});

accelerometer.start();
```

### Permissions

The API requires user permission on most platforms:

```javascript
// Feature detection and permission handling
if ('Accelerometer' in window) {
  try {
    // Request permission on platforms that require it
    const permissionStatus = await navigator.permissions.query(
      { name: 'accelerometer' }
    );

    if (permissionStatus.state === 'granted') {
      // Permission already granted
    }
  } catch (e) {
    // Permission API not available
  }
}
```

## Known Issues and Notes

### General Notes

There are no documented bugs or known issues with the Accelerometer API at this time.

### Implementation Notes

- **Permission Handling**: May differ across platforms and browsers
- **Frequency Handling**: The `frequency` option is available but actual sampling rate depends on device capabilities
- **Security**: Requires secure context (HTTPS)

## Related Links

### Resources

- **[W3C Accelerometer Specification](https://www.w3.org/TR/accelerometer/)** - Official specification document
- **[Google Developers: Sensors for the Web](https://developers.google.com/web/updates/2017/09/sensors-for-the-web#acceleration-and-linear-accelerometer-sensor)** - Implementation guide and best practices
- **[Intel Generic Sensor Demos - PunchMeter](https://intel.github.io/generic-sensor-demos/punchmeter/)** - Interactive demo showing accelerometer usage

### Related APIs

- [Gyroscope API](https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope) - Rotational velocity sensor
- [Magnetometer API](https://developer.mozilla.org/en-US/docs/Web/API/Magnetometer) - Magnetic field sensor
- [Generic Sensor API](https://www.w3.org/TR/generic-sensor/) - Base framework for sensor access
- [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) - Legacy motion API

## Usage Statistics

- **Global Support**: 78.23% of users can access the Accelerometer API
- **Partial Support**: 0% (no partial implementations)

## Fallback Strategies

For browsers without Accelerometer API support, consider:

1. **Legacy APIs**: Use `DeviceOrientationEvent` and `DevicMotionEvent` where available
2. **User Input**: Provide touch-based or keyboard alternatives
3. **Progressive Enhancement**: Gracefully degrade to standard UI controls
4. **Polyfills**: Limited polyfill options available; primarily browser-dependent

## Development Recommendations

### When to Use

- Modern web applications targeting desktop and Android platforms
- Gaming and interactive experiences requiring motion input
- Fitness and health applications
- Immersive web experiences (AR/VR)

### When to Avoid

- Applications targeting iOS exclusively (no support)
- Firefox users (no support)
- Safari users (no support)
- Require universal browser compatibility

### Best Practices

1. **Always feature-detect** before using the API
2. **Provide fallback interactions** for unsupported browsers
3. **Request permissions gracefully** with clear user explanations
4. **Respect user privacy** and explain data usage
5. **Use appropriate frequency values** to balance responsiveness and battery life
6. **Handle errors** when sensors are unavailable or permission is denied
7. **Test on real devices** for accurate behavior

---

**Last Updated**: 2025
**Data Source**: CanIUse Database
**Spec Version**: W3C Candidate Recommendation
