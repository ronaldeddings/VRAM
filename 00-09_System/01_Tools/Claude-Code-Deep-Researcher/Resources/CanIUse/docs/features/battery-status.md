# Battery Status API

## Overview

The **Battery Status API** provides information about the battery level, charging status, and related data of the hosting device. This enables web applications to adapt their behavior based on device battery state, optimize power consumption, and provide better user experience on battery-powered devices.

**Official Title:** Battery Status API

**Description:** Method to provide information about the battery status of the hosting device.

---

## Specification

| Property | Details |
|----------|---------|
| **Specification** | [W3C Battery Status](https://www.w3.org/TR/battery-status/) |
| **Status** | Candidate Recommendation (CR) |
| **Current Version** | Latest W3C Specification |

---

## Categories

- **JavaScript API** — Access via `navigator` interface

---

## Use Cases & Benefits

### Benefits

- **Power-Aware Optimization** — Reduce resource usage (animations, video quality, polling rates) on low battery
- **User Experience Improvement** — Adjust application behavior to battery status
- **Better Mobile Support** — Provide appropriate performance levels based on device power state
- **Charging Detection** — Detect when device is plugged in to enable resource-intensive operations
- **Battery Time Estimation** — Estimate time until battery depletion for display to users
- **User Transparency** — Show users why certain features may be unavailable or throttled

### Common Use Cases

1. **Video Streaming** — Lower quality on battery, higher when charging
2. **Real-time Synchronization** — Increase sync frequency when charging, decrease on battery
3. **Animations & Effects** — Disable animations, reduce frame rate on low battery
4. **Data Transmission** — Defer non-critical data uploads until device is charging
5. **Gaming** — Reduce graphics quality and frame rate to extend battery life
6. **Web Applications** — Adapt feature availability based on power availability
7. **Progressive Web Apps** — Optimize performance for battery-constrained devices

---

## Browser Support

### Support Status Legend

| Badge | Meaning |
|-------|---------|
| ![Full Support](https://img.shields.io/badge/Support-Full-brightgreen) | Full support for Battery Status API |
| ![Partial Support](https://img.shields.io/badge/Support-Partial-yellow) | Older specification variant (`navigator.battery`) |
| ![No Support](https://img.shields.io/badge/Support-None-red) | Not supported |

### Desktop Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|-----------------|
| **Chrome** | 38 | ![Full Support](https://img.shields.io/badge/38+-brightgreen?label=Chrome) |
| **Edge** | 79 | ![Full Support](https://img.shields.io/badge/79+-brightgreen?label=Edge) |
| **Firefox** | 43 | ![Full Support](https://img.shields.io/badge/43--51-brightgreen?label=Firefox) |
| **Opera** | 25 | ![Full Support](https://img.shields.io/badge/25+-brightgreen?label=Opera) |
| **Safari** | Not supported | ![No Support](https://img.shields.io/badge/None-red?label=Safari) |
| **Internet Explorer** | Not supported | ![No Support](https://img.shields.io/badge/None-red?label=IE) |

### Mobile Browsers

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Android Chrome** | 142 | ![Full Support](https://img.shields.io/badge/142+-brightgreen?label=And.%20Chrome) |
| **Opera Mobile** | 80 | ![Full Support](https://img.shields.io/badge/80+-brightgreen?label=Opera%20Mobile) |
| **Samsung Internet** | 4.0 | ![Full Support](https://img.shields.io/badge/4.0+-brightgreen?label=Samsung) |
| **Android UC Browser** | 15.5 | ![Full Support](https://img.shields.io/badge/15.5+-brightgreen?label=UC%20Browser) |
| **Baidu Browser** | 13.52 | ![Full Support](https://img.shields.io/badge/13.52+-brightgreen?label=Baidu) |
| **Android QQ** | 14.9 | ![Full Support](https://img.shields.io/badge/14.9+-brightgreen?label=QQ) |
| **iOS Safari** | Not supported | ![No Support](https://img.shields.io/badge/None-red?label=iOS%20Safari) |
| **Android Firefox** | Not supported | ![No Support](https://img.shields.io/badge/None-red?label=And.%20Firefox) |
| **Blackberry** | Not supported | ![No Support](https://img.shields.io/badge/None-red?label=BB) |
| **Opera Mini** | Not supported | ![No Support](https://img.shields.io/badge/None-red?label=Opera%20Mini) |

### Overall Support

- **Supported in 80.38%** of measured traffic
- **Partial support in 0.05%** of measured traffic

---

## API Overview

### Basic Usage

The Battery Status API is accessed through the `navigator` object:

```javascript
// Get battery manager
navigator.getBattery().then(function(battery) {
  // Battery object contains:
  // - level: 0-1 (0% to 100%)
  // - charging: boolean
  // - chargingTime: seconds to full charge (Infinity if unknown)
  // - dischargingTime: seconds until empty (Infinity if unknown)

  console.log('Battery level:', battery.level * 100 + '%');
  console.log('Charging:', battery.charging);
  console.log('Charging time:', battery.chargingTime + ' seconds');
  console.log('Discharging time:', battery.dischargingTime + ' seconds');
});
```

### Event Monitoring

```javascript
navigator.getBattery().then(function(battery) {
  // Monitor battery level changes
  battery.addEventListener('levelchange', function() {
    console.log('Battery level changed to:', this.level * 100 + '%');
  });

  // Monitor charging status
  battery.addEventListener('chargingchange', function() {
    console.log('Charging status changed to:', this.charging);
  });

  // Monitor charging time
  battery.addEventListener('chargingtimechange', function() {
    console.log('Charging time changed to:', this.chargingTime);
  });

  // Monitor discharging time
  battery.addEventListener('dischargingtimechange', function() {
    console.log('Discharging time changed to:', this.dischargingTime);
  });
});
```

### Practical Example: Power-Aware Optimization

```javascript
async function adaptToPowerState() {
  try {
    const battery = await navigator.getBattery();

    function updatePowerState() {
      const isCritical = battery.level < 0.15;
      const isLowPower = battery.level < 0.25;
      const isCharging = battery.charging;

      if (isCritical) {
        // Disable non-essential features
        disableAnimations();
        disableVideoStreaming();
        enableMinimalMode();
      } else if (isLowPower && !isCharging) {
        // Reduce resource usage
        reduceAnimationFrameRate();
        lowerVideoQuality();
        increaseDataCompressionLevel();
      } else if (isCharging) {
        // Enable full features when charging
        enableAllFeatures();
        enableHighQualityMode();
        performDeferredTasks();
      }
    }

    // Update on battery changes
    battery.addEventListener('levelchange', updatePowerState);
    battery.addEventListener('chargingchange', updatePowerState);

    // Initial update
    updatePowerState();
  } catch (error) {
    console.log('Battery API not available');
  }
}
```

---

## Important Notes

### Privacy & Security Concerns

**Firefox 52 and later** removed access to the Battery Status API due to privacy concerns. The API could be used to fingerprint users and track browsing patterns based on battery patterns. Read the full discussion: [Firefox Bug #1313580](https://bugzilla.mozilla.org/show_bug.cgi?id=1313580)

### Historical Implementation Variants

Firefox 10-42 and Chrome 37 supported an older specification variant using `navigator.battery` directly instead of the promise-based `navigator.getBattery()` method. This older approach is marked as "partial support" in compatibility data.

### Current Status

- Some browsers have deprecated this API
- Check for availability before using
- Consider fallback strategies for browsers without support
- Always wrap in try-catch or check availability first

---

## Feature Detection

### Check for API Support

```javascript
// Check if Battery Status API is available
if ('getBattery' in navigator) {
  // API is available
  navigator.getBattery().then(function(battery) {
    // Use the API
  });
} else {
  // Fallback to default behavior
  console.log('Battery Status API not supported');
}
```

### Progressive Enhancement Pattern

```javascript
// Safe approach with feature detection
function initBatteryMonitoring() {
  if (!('getBattery' in navigator)) {
    // Continue with default behavior
    return defaultBehavior();
  }

  navigator.getBattery()
    .then(setupBatteryListeners)
    .catch(error => {
      console.error('Battery API error:', error);
      defaultBehavior();
    });
}

function setupBatteryListeners(battery) {
  // Setup event listeners
  battery.addEventListener('levelchange', handleBatteryChange);
  battery.addEventListener('chargingchange', handleChargingChange);
}

function defaultBehavior() {
  // Assume normal operation mode
  // Don't throttle or optimize
}
```

---

## Performance Considerations

### Optimization Benefits

- **Battery Life Extension** — Reduce power consumption during critical battery states
- **Improved Responsiveness** — Align performance expectations with battery capacity
- **Better User Control** — Users understand why features behave differently

### Implementation Tips

1. **Check early and cache** — Get battery state at app initialization
2. **Debounce events** — Avoid excessive event handler calls
3. **Graceful degradation** — Apps work without the API
4. **Transparent communication** — Inform users why features are limited
5. **Testing** — Test on actual battery-powered devices when possible

---

## Related Links

- [MDN Web Docs - Battery Status API](https://developer.mozilla.org/en-US/docs/WebAPI/Battery_Status)
- [W3C Battery Status Specification](https://www.w3.org/TR/battery-status/)
- [Simple Battery API Demo](https://pazguille.github.io/demo-battery-api/)
- [Firefox Bug Discussion - Privacy Removal](https://bugzilla.mozilla.org/show_bug.cgi?id=1313580)

---

## See Also

- [Device Orientation API](./deviceorientation.md) — Detect device physical orientation
- [Network Information API](./netinfo.md) — Detect network connection type
- [Vibration API](./vibration.md) — Trigger device vibration
- [Ambient Light API](./ambient-light.md) — Detect ambient light level
- [Proximity API](./proximity.md) — Detect device proximity

---

**Last Updated:** 2025-12-13

**Data Source:** [Can I Use - Battery Status API](https://caniuse.com/battery-status)
