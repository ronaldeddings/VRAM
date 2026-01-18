# Ambient Light Sensor API

## Overview

The **Ambient Light Sensor API** provides web applications with access to the device's ambient light sensor, allowing them to detect and respond to changes in the surrounding light level or illuminance. This enables creating adaptive user interfaces that automatically adjust brightness, contrast, or other visual properties based on environmental lighting conditions.

## Specification

| Property | Value |
|----------|-------|
| **Specification** | [W3C Ambient Light](https://www.w3.org/TR/ambient-light/) |
| **Status** | Candidate Recommendation (CR) |
| **Category** | JavaScript API |

## Use Cases & Benefits

The Ambient Light Sensor API enables several valuable applications:

- **Adaptive UI Brightness**: Automatically adjust application interface brightness and contrast based on ambient lighting conditions
- **Accessible Reading**: Optimize text readability by adjusting colors and contrast in well-lit vs. dim environments
- **Energy Efficiency**: Reduce screen brightness in low-light conditions to conserve battery life
- **Automatic Nightmode**: Switch between light and dark themes based on environmental lighting
- **Accessibility Features**: Support users with visual impairments by providing automatic lighting adjustments
- **Smart Lighting Applications**: Control or suggest adjustments to smart home lighting systems
- **Photography & Video Apps**: Assist in automatic exposure and white balance adjustments

## Browser Support

Support for the Ambient Light Sensor API is extremely limited across all major browsers, with most showing no support or only experimental support.

### Summary by Browser

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Chrome** | Not supported | Disabled by default (needs flag) |
| **Edge** | Not supported | Partially supported in legacy versions (14-18), disabled in Chromium-based versions |
| **Firefox** | Not supported | Partially supported (22-59, outdated spec), disabled in newer versions |
| **Safari** | Not supported | No support |
| **Opera** | Not supported | Disabled by default (needs flag) |
| **iOS Safari** | Not supported | No support |
| **Android Browser** | Not supported | No support |

### Detailed Support Table

#### Desktop Browsers

**Chrome**
- Versions 4-57: ❌ Not supported
- Versions 58+: ❌ Not supported (Disabled by default, requires flag #2)

**Firefox**
- Versions 2-21: ❌ Not supported
- Versions 22-59: ⚠️ Partially supported (outdated spec #1)
- Versions 60+: ❌ Not supported (Disabled by default, requires flag #1)

**Safari**
- All versions: ❌ Not supported

**Edge**
- Versions 12-13: ❌ Not supported
- Versions 14-18: ⚠️ Partially supported (outdated spec #1)
- Versions 79+: ❌ Not supported (Disabled by default, requires flag #2)

**Opera**
- Versions 9-72: ❌ Not supported
- Versions 73+: ❌ Not supported (Disabled by default, requires flag #2)

#### Mobile Browsers

| Platform | Support |
|----------|---------|
| iOS Safari | ❌ Not supported |
| Android Browser | ❌ Not supported |
| Chrome for Android | ❌ Not supported (Disabled, requires flag) |
| Firefox Android | ✅ **Supported** (v144) |
| Samsung Internet | ❌ Not supported |
| Opera Mini | ❌ Not supported |
| Opera Mobile | ❌ Not supported |

### Global Usage

- Full Support: **0.3%** of websites
- Partial Support: **0.07%** of websites
- **Overall**: Extremely limited adoption

## Implementation Notes & Known Issues

### Note #1: Outdated Specification Version

Firefox (versions 22-59), Edge (versions 14-18), and KaiOS implement an [outdated version of the specification](https://www.w3.org/TR/2015/WD-ambient-light-20150903/) from September 2015. Code written for the current specification may not be compatible with these implementations.

### Note #2: Experimental Flag Required

Chrome (versions 58+), Edge (Chromium-based versions 79+), and Opera (versions 73+) require enabling the **"Generic Sensor Extra Classes"** experimental flag in `about:flags` to enable support.

## Basic Usage Example

```javascript
// Check for support
if ('AmbientLightSensor' in window) {
  try {
    const sensor = new AmbientLightSensor();

    sensor.addEventListener('reading', () => {
      console.log('Ambient light level:', sensor.illuminance, 'lux');

      // Adjust UI based on light level
      if (sensor.illuminance < 50) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });

    sensor.addEventListener('error', (event) => {
      console.error('Sensor error:', event.error.name);
    });

    sensor.start();
  } catch (error) {
    console.error('AmbientLightSensor not available:', error);
  }
} else {
  console.log('Ambient Light Sensor API not supported');
}
```

## Permissions

The Ambient Light Sensor API requires user permission, similar to other sensor APIs:

```javascript
if (navigator.permissions && navigator.permissions.query) {
  navigator.permissions.query({ name: 'ambient-light-sensor' })
    .then(permissionStatus => {
      console.log('Permission status:', permissionStatus.state);
      // 'granted', 'denied', or 'prompt'
    });
}
```

## Browser-Specific Implementation Notes

### Firefox (Android)
- **Firefox for Android version 144+** has full support for the current Ambient Light Sensor specification
- This is the only browser with complete, modern implementation

### Chrome & Edge (Chromium)
- Support is available behind the "Generic Sensor Extra Classes" flag
- Flag path: `chrome://flags/#enable-generic-sensor-extra-classes`
- Requires explicit user permission

### Legacy Implementations (Firefox <60, Edge Legacy, KaiOS)
- These implementations use an older specification
- Not recommended for new development
- Consider progressive enhancement if targeting these browsers

## Fallback Strategies

Given the limited support, consider these alternatives:

1. **CSS Media Queries**: Use `prefers-color-scheme` for dark mode preferences
   ```css
   @media (prefers-color-scheme: dark) {
     /* Dark mode styles */
   }
   ```

2. **User Preferences**: Allow users to manually select light/dark theme

3. **Time-Based Detection**: Adjust theme based on time of day

4. **Device API**: Use device motion/orientation sensors as indirect indicators

5. **Network Information API**: Adjust quality based on connection speed (indirect proxy)

## Related Technologies

- [Generic Sensor API](https://www.w3.org/TR/generic-sensor/) - Base specification for all sensor APIs
- [Accelerometer API](https://www.w3.org/TR/accelerometer/) - Access device acceleration
- [Gyroscope API](https://www.w3.org/TR/gyroscope/) - Access device rotation
- [Magnetometer API](https://www.w3.org/TR/magnetometer/) - Access device magnetic field
- [Device Light Event](https://www.w3.org/TR/ambient-light/) - Deprecated predecessor
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) - CSS-based dark mode detection

## Resources

### Official Documentation
- [MDN Web Docs - Ambient Light Sensor API](https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Sensor_API)
- [W3C Specification](https://www.w3.org/TR/ambient-light/)

### Articles & Guides
- [Google Web Updates - Sensors for the Web](https://developers.google.com/web/updates/2017/09/sensors-for-the-web)

### Demos
- [Intel Generic Sensor Demos - Ambient Light Map](https://intel.github.io/generic-sensor-demos/ambient-map/build/bundled/)

## Browser Support Chart

```
IE           Not Supported ❌
Edge 12-13   Not Supported ❌
Edge 14-18   Partial (Outdated) ⚠️
Edge 79+     Not Supported ❌
Firefox 2-21 Not Supported ❌
Firefox 22-59  Partial (Outdated) ⚠️
Firefox 60+  Not Supported ❌
Chrome 4-57  Not Supported ❌
Chrome 58+   Not Supported ❌ (Flag Required)
Safari       Not Supported ❌
Opera 9-72   Not Supported ❌
Opera 73+    Not Supported ❌ (Flag Required)
iOS Safari   Not Supported ❌
Android      Not Supported ❌
Firefox Android 144+ Full Support ✅
Samsung Internet Not Supported ❌
```

## Recommendations

### For Production Use
- **Not Recommended**: The Ambient Light Sensor API has minimal browser support and should not be relied upon for critical functionality
- Use as progressive enhancement only
- Provide fallback mechanisms for all browsers

### For New Projects
- Consider using CSS `prefers-color-scheme` media query for dark mode support
- Implement manual theme switching for users
- Reserve Ambient Light Sensor API for specialized applications where the feature adds significant value

### For Existing Implementations
- Ensure graceful degradation when API is unavailable
- Implement feature detection before accessing the API
- Provide alternative ways to achieve the same user experience

---

**Last Updated**: 2024
**Status**: Candidate Recommendation
**Global Support**: 0.37% (Full + Partial Support)
