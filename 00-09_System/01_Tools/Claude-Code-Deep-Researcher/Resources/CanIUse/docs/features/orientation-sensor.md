# Orientation Sensor

## Description

The Orientation Sensor API defines a base orientation sensor interface and concrete sensor subclasses to monitor the device's physical orientation in relation to a stationary three dimensional Cartesian coordinate system. This API provides web developers with access to device orientation data through a standardized interface, enabling applications to respond to changes in how users hold or position their devices.

## Current Specification Status

**Status**: Candidate Recommendation (CR)

**Official Specification**: [W3C Orientation Sensor Specification](https://www.w3.org/TR/orientation-sensor/)

The Orientation Sensor API is actively maintained by the W3C and is moving toward standardization across browsers. As a Candidate Recommendation, the specification is relatively stable, though implementations may still vary.

## Category

- **JavaScript API**

## Benefits & Use Cases

### Key Benefits

1. **Device Orientation Detection** - Detect how users hold their devices (portrait, landscape, or tilted)
2. **Motion-Based Interactions** - Enable gesture recognition and motion-based controls
3. **Immersive Experiences** - Create interactive and game-like applications
4. **Accessibility** - Support alternative interaction methods for users
5. **Responsive Behavior** - Adapt application layout and functionality based on device orientation

### Common Use Cases

- **Mobile Games** - Tilt-based game controls and motion tracking
- **Augmented Reality** - VR/AR applications requiring accurate device orientation
- **Immersive Web Apps** - Web applications that respond to device movement
- **Accessibility Tools** - Voice control and motion-based interfaces
- **Data Visualization** - Interactive 3D visualizations that respond to device rotation
- **Photography Apps** - Orientation-aware image capture and display
- **Fitness Applications** - Motion tracking and activity monitoring
- **Virtual Tours** - Panoramic view navigation based on device orientation

## Browser Support Table

| Browser | Support | Version Range | Notes |
|---------|---------|---------------|-------|
| **Chrome** | ✓ Yes | 67+ | Full support from Chrome 67 onwards |
| **Edge** | ✓ Yes | 79+ | Full support from Edge 79 onwards |
| **Firefox** | ✗ No | All versions | No support; flag behind experimental feature in some versions |
| **Safari** | ✗ No | All versions | No support for desktop or iOS Safari |
| **Opera** | ✓ Yes | 54+ | Full support from Opera 54 onwards |
| **iOS Safari** | ✗ No | All versions | Not supported |
| **Opera Mobile** | ✓ Yes | 80+ | Limited support starting at version 80 |
| **Opera Mini** | ✗ No | All versions | No support |
| **Samsung Internet** | ✗ No | All versions | No support |
| **UC Browser** | ✓ Yes | 15.5+ | Limited support |
| **Android Browser** | ✓ Yes | 142+ | Limited support on newer versions |
| **Android Chrome** | ✓ Yes | 142+ | Full support on current Android versions |
| **Android Firefox** | ✗ No | All versions | No support |
| **Chrome (Chromium-based)** | ✓ Yes | QQ 14.9+, Baidu 13.52+ | Support in Chromium-based browsers |

### Support Summary

**Global Usage**: ~78.23% of users have browsers with support

**Tier 1 Support** (Full & Stable):
- Chrome 67+
- Edge 79+
- Opera 54+
- Chromium-based browsers

**Limited/Partial Support**:
- Opera Mobile 80+
- UC Browser 15.5+
- Android Browser 142+
- Chinese browsers (QQ, Baidu)

**No Support**:
- Firefox (all versions)
- Safari (desktop and iOS)
- Opera Mini
- Samsung Internet
- Internet Explorer
- BlackBerry

## Technical Notes

### Chrome Implementation Detail

In **Chrome 58-66**, the Orientation Sensor API is available by enabling the "Generic Sensor" experimental flag in `about:flags`. This feature became standard and enabled by default starting with Chrome 67.

### Compatibility Considerations

1. **Firefox**: No support currently. The feature is not on Firefox's roadmap for the near term.
2. **Safari/iOS**: Apple has not implemented support for the Orientation Sensor API. Developers should consider using the older DeviceOrientation API as a fallback for iOS devices.
3. **Mobile Platforms**: Support varies significantly across mobile browsers. Android Chrome and Opera Mobile have good support, but iOS Safari remains unsupported.

### Feature Detection

```javascript
if ('RelativeOrientationSensor' in window) {
  // Orientation Sensor API is supported
  const sensor = new RelativeOrientationSensor({frequency: 60});
  // Use the sensor
} else {
  // Fallback to older API or show warning
}
```

### Alternatives & Fallbacks

For browsers without support, consider using:
- **DeviceOrientation Event** - Older, non-standardized API available on more browsers
- **Accelerometer Sensor** - Part of the same Generic Sensor family
- **Gyroscope Sensor** - For angular velocity data

## Relevant Links

- **Live Demo**: [Intel Generic Sensor Demos - Orientation Phone](https://intel.github.io/generic-sensor-demos/orientation-phone/)
- **Google Web Updates**: [Sensors for the Web - Orientation Sensors](https://developers.google.com/web/updates/2017/09/sensors-for-the-web#orientation-sensors)
- **Official Specification**: [W3C Orientation Sensor](https://www.w3.org/TR/orientation-sensor/)
- **Generic Sensor API**: [W3C Generic Sensor API](https://www.w3.org/TR/generic-sensor/)

## Implementation Recommendations

### Progressive Enhancement

Always implement progressive enhancement when using the Orientation Sensor API:

1. **Feature Detection** - Check if the API is available before using it
2. **Fallback Strategy** - Have alternative functionality for unsupported browsers
3. **User Consent** - Request appropriate permissions where required
4. **Graceful Degradation** - Ensure core functionality works without sensor data

### Best Practices

- Use feature detection rather than browser detection
- Request sensors with appropriate frequency settings to manage battery usage
- Handle sensor permission denials gracefully
- Test on real devices, as emulators may not accurately simulate sensor behavior
- Consider battery impact on mobile devices
- Provide visual feedback to users when sensor data is being used

### Sample Code

```javascript
// Feature detection
if ('RelativeOrientationSensor' in window) {
  try {
    const sensor = new RelativeOrientationSensor({frequency: 60});

    sensor.addEventListener('reading', () => {
      // Handle orientation data
      const [x, y, z, w] = sensor.quaternion;
      console.log(`Quaternion: [${x}, ${y}, ${z}, ${w}]`);
    });

    sensor.addEventListener('error', (event) => {
      console.error(`Sensor error: ${event.error.name}`);
    });

    sensor.start();
  } catch (error) {
    console.error('Failed to initialize sensor:', error);
  }
} else {
  console.log('Orientation Sensor API not supported');
}
```

## See Also

- [Generic Sensor API](../generic-sensor/) - Base API for all sensor implementations
- [Accelerometer API](../accelerometer/) - Linear acceleration measurement
- [Gyroscope API](../gyroscope/) - Angular velocity measurement
- [DeviceOrientation Event](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent) - Older orientation API (for legacy support)
