# Screen Wake Lock API

## Overview

The Screen Wake Lock API is a web platform feature that allows web applications to request that a device's screen remain active and not dim, lock, or turn off while the application is running. This is particularly useful for applications that require continuous screen visibility for user interaction.

## Description

The Screen Wake Lock API prevents devices from dimming, locking, or turning off the screen when the application needs to keep running. This is essential for applications such as:

- Navigation apps that display maps and directions
- Video playback applications
- Fitness and workout tracking apps
- Presentation software
- Medical or industrial monitoring applications

## Specification Status

- **Current Status**: Candidate Recommendation (CR)
- **W3C Specification**: [W3C Wake Lock Level 1](https://www.w3.org/TR/wake-lock/)
- **Maturity Level**: Well-established and widely supported across modern browsers

## Categories

- **JavaScript API**

## Benefits and Use Cases

### Primary Benefits

1. **Enhanced User Experience**: Keeps the screen on during activities that require constant visibility, eliminating the need for users to manually prevent screen lock.

2. **Improved Accessibility**: Essential for users with motor disabilities who may have difficulty interacting frequently with devices.

3. **Mission-Critical Applications**: Enables reliable operation for navigation, monitoring, and real-time tracking applications.

4. **Professional Tools**: Supports applications used in medical, industrial, and field service environments where hands-free operation is critical.

### Common Use Cases

- **Navigation Apps**: GPS mapping applications that require constant screen visibility for drivers
- **Video Playback**: Streaming services that need uninterrupted screen display during video content
- **Fitness Tracking**: Workout and exercise apps displaying real-time metrics and guidance
- **Presentation Software**: Full-screen presentations and display applications
- **Industrial/Medical**: Monitoring dashboards and control systems that must remain visible
- **Gaming**: Games requiring prolonged, uninterrupted play sessions

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| Chrome | 85 | Fully Supported ✓ |
| Edge | 90 | Fully Supported ✓ |
| Firefox | 126 | Fully Supported ✓ |
| Safari | 16.4 | Fully Supported ✓ |
| Opera | 73 | Fully Supported ✓ |
| Internet Explorer | Never | Not Supported ✗ |

### Mobile and Tablet Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| iOS Safari | 16.4 | Supported (Browser mode)* |
| Android Browser | 142 | Fully Supported ✓ |
| Chrome Mobile | 142 | Fully Supported ✓ |
| Firefox Mobile | 144 | Fully Supported ✓ |
| Samsung Internet | 14.0 | Fully Supported ✓ |
| Opera Mobile | 80 | Fully Supported ✓ |
| UC Browser | 15.5 | Supported ✓ |
| Baidu | 13.52 | Supported ✓ |
| Opera Mini | All versions | Not Supported ✗ |
| BlackBerry | All versions | Not Supported ✗ |

### Support Legend

- **✓ Fully Supported**: API is available and functional
- **⚠ Partial/Flag Support**: Available behind a feature flag or with limitations
- **✗ Not Supported**: API is not available in this browser

## Implementation Notes

### Important Limitations and Known Issues

1. **iOS PWA Limitation**: On iOS, the Screen Wake Lock API does not work in web app (PWA) mode. It only functions when the application is accessed through the Safari browser directly. This is a known WebKit limitation tracked in [WebKit Bug #254545](https://bugs.webkit.org/show_bug.cgi?id=254545).

2. **Feature Flags**: Earlier versions of some browsers required feature flags to be enabled:
   - **Chrome (versions 71-84)**: Required the `#experimental-web-platform-features` flag
   - **Firefox (versions 124-125)**: Required the `dom.screenwakelock.enabled` flag (only enabled by default in Beta or earlier versions)
   - **Edge (versions 79-89)**: Required the `#experimental-web-platform-features` flag

3. **User Permissions**: Most browsers require explicit user permission or interaction to grant wake lock capabilities for security and battery preservation reasons.

### Browser Compatibility Summary

- **Global Support**: ~91.27% of users have browser support for this feature (as of data collection)
- **Modern Browsers**: All current versions of major desktop and mobile browsers support this API
- **Legacy Support**: Internet Explorer and older versions do not support this API

## Relevant Links

### Official Documentation
- **[Stay awake with the Screen Wake Lock API](https://web.dev/wakelock/)** - Google Web Developers Guide
- **[MDN: Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)** - Mozilla Developer Network comprehensive documentation
- **[W3C Wake Lock Level 1 Specification](https://www.w3.org/TR/wake-lock/)** - Official W3C specification

### Implementation Issues
- **[Firefox Support Tracking](https://bugzilla.mozilla.org/show_bug.cgi?id=1589554)** - Mozilla's official support bug tracker
- **[WebKit Support Tracking](https://bugs.webkit.org/show_bug.cgi?id=205104)** - Apple's official WebKit support bug tracker
- **[iOS PWA Limitation](https://bugs.webkit.org/show_bug.cgi?id=254545)** - Known issue affecting Progressive Web Apps on iOS

## Code Example

### Basic Usage

```javascript
async function requestWakeLock() {
  try {
    // Request a wake lock
    const sentinel = await navigator.wakeLock.request('screen');

    // Handle the release event
    sentinel.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });

    console.log('Wake Lock acquired successfully');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

// Release the wake lock
function releaseWakeLock(sentinel) {
  sentinel.release();
}
```

### With Error Handling and Visibility Detection

```javascript
let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock released');
    });
  } catch (err) {
    console.error(`Wake Lock request failed: ${err.name}`);
  }
}

// Automatically release wake lock when page is hidden
document.addEventListener('visibilitychange', async () => {
  if (document.hidden && wakeLock !== null) {
    await wakeLock.release();
    wakeLock = null;
  } else if (!document.hidden && wakeLock === null) {
    await requestWakeLock();
  }
});
```

## Best Practices

1. **Request Permission on User Interaction**: Always request wake lock in response to user interaction (click, tap) rather than on page load.

2. **Monitor Visibility**: Automatically release the wake lock when the page/app becomes hidden and re-request when visible.

3. **Graceful Fallback**: Implement fallback behavior for browsers that don't support this API.

4. **Battery Awareness**: Inform users about the battery impact and provide controls to release the wake lock.

5. **Release When Done**: Always release the wake lock when it's no longer needed to preserve device battery.

## Feature Detection

```javascript
if ('wakeLock' in navigator) {
  // Screen Wake Lock API is supported
  console.log('Wake Lock API is available');
} else {
  console.log('Wake Lock API is not supported');
  // Implement fallback behavior
}
```

---

**Last Updated**: Based on CanIUse data as of document generation

**Data Source**: [CanIUse - Screen Wake Lock API](https://caniuse.com/wake-lock)
