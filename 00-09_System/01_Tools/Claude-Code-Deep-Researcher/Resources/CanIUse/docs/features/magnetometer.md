# Magnetometer

## Overview

The **Magnetometer** API provides a concrete sensor interface to measure the magnetic field along the X, Y, and Z axes. This is part of the broader Generic Sensor API and enables web applications to access device magnetometer hardware.

## Description

The Magnetometer interface exposes the magnetic field measurements from a device's built-in magnetic field sensor. This allows developers to create web applications that can respond to magnetic field changes, useful for applications such as compass functionality, navigation, augmented reality, and motion-based interactions.

## Current Specification Status

- **Status**: Candidate Recommendation (CR)
- **Official Specification**: [W3C Magnetometer Specification](https://www.w3.org/TR/magnetometer/)
- **Last Updated**: As per W3C standards

## Categories

- **JavaScript API**

## Key Features & Benefits

### Use Cases

1. **Compass Applications**: Build web-based compass tools that utilize device magnetometer data
2. **Navigation**: Enhance location-based navigation applications with magnetic field awareness
3. **Augmented Reality (AR)**: Create AR applications that align virtual content based on magnetic orientation
4. **Motion Detection**: Detect and respond to magnetic field changes in interactive applications
5. **Sensor Fusion**: Combine with accelerometer and gyroscope data for comprehensive motion tracking

### Technical Benefits

- **Hardware Access**: Direct access to device magnetometer sensor data
- **Standardized Interface**: Consistent API across platforms following W3C specifications
- **Multi-Axis Data**: Access to X, Y, and Z axis magnetic field measurements
- **Low-Level Sensor Access**: Enables advanced sensor-based applications previously unavailable to web

## Browser Support

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 58+ | No (Behind flag) | Requires "Generic Sensor Extra Classes" experimental flag enabled via `about:flags` |
| **Edge** | All versions | Not Supported | No support in current versions |
| **Firefox** | All versions | Not Supported | No support in current versions |
| **Safari** | All versions | Not Supported | No support in current versions |
| **Opera** | 44+ | No (Behind flag) | Requires "Generic Sensor Extra Classes" experimental flag enabled |
| **IE** | All versions | Not Supported | No support |
| **iOS Safari** | All versions | Not Supported | No support |
| **Android Chrome** | 142+ | No (Behind flag) | Requires experimental flag enabled |
| **Android Firefox** | 144 | Not Supported | No support |

### Status Legend

- **Supported (✓)**: Fully supported without flags
- **No (Behind flag)**: Not supported by default; requires enabling experimental features
- **Not Supported (✗)**: No support in this browser

## Implementation Notes

### Current Limitations

1. **Limited Browser Support**: Currently available only in Chrome and Opera (and their Android variants) with an experimental flag
2. **Experimental Status**: Not standardized for production use due to limited vendor adoption
3. **Feature Flag Required**: Users must manually enable the "Generic Sensor Extra Classes" feature flag to use this API

### Enablement Instructions

**For Chrome/Chromium-based browsers (Desktop):**
1. Navigate to `chrome://flags` or `about:flags` in the address bar
2. Search for "Generic Sensor Extra Classes"
3. Set it to "Enabled"
4. Restart the browser

**For Android Chrome:**
1. Navigate to `chrome://flags`
2. Search for "Generic Sensor Extra Classes"
3. Set it to "Enabled"
4. Restart the browser

### Browser Compatibility Checking

When using the Magnetometer API in production, always include feature detection:

```javascript
if ('Magnetometer' in window) {
  // Magnetometer is supported
  const sensor = new Magnetometer();
  // Handle sensor data...
} else {
  console.warn('Magnetometer API is not supported in this browser');
  // Provide fallback functionality
}
```

## Related Resources & Links

- **Live Demo**: [Generic Sensor VR Button Demo](https://intel.github.io/generic-sensor-demos/vr-button/build/bundled/)
- **Learning Article**: [Sensors for the Web - Google Developers](https://developers.google.com/web/updates/2017/09/sensors-for-the-web)
- **W3C Specification**: [W3C Magnetometer Specification](https://www.w3.org/TR/magnetometer/)
- **Generic Sensor API**: [W3C Generic Sensor API](https://www.w3.org/TR/generic-sensor/)

## Industry Context

The Magnetometer API is part of the broader **Generic Sensor API** initiative, which aims to provide standardized access to device sensors. Alongside APIs like Accelerometer, Gyroscope, and Ambient Light Sensor, the Magnetometer enables rich sensor-based web applications.

## Conclusion

While the Magnetometer API shows promise for enabling innovative sensor-based web applications, its current availability is limited to a few browsers with experimental flag requirements. Developers interested in using this API should implement proper feature detection and provide fallback mechanisms until broader standardization and adoption occurs.
