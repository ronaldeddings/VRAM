# Permissions API

## Overview

The **Permissions API** is a high-level JavaScript API that allows web applications to check and request user permissions for access to sensitive browser features and device capabilities.

## Description

The Permissions API provides a standardized mechanism for web applications to:
- **Query** the permission status for specific browser features (geolocation, camera, microphone, etc.)
- **Request** user permission to access restricted capabilities
- **Listen** for permission changes through event listeners

This API enhances the user experience by enabling developers to gracefully handle permission states and provide meaningful feedback to users about what permissions are needed and why.

## Specification

- **Status**: Working Draft (WD)
- **Specification**: [W3C Permissions](https://w3c.github.io/permissions/)

## Categories

- **JS API** - Core JavaScript interface
- **Security** - Security and privacy-related feature

## Use Cases & Benefits

### Key Use Cases

1. **Pre-flight Permission Checks**
   - Determine permission status before attempting to use a feature
   - Avoid unnecessary permission prompts

2. **Better User Experience**
   - Inform users why a permission is needed
   - Provide context before requesting permissions
   - Handle denied permissions gracefully

3. **Feature Detection**
   - Check if a feature and its permission are available
   - Implement fallbacks for unsupported features

4. **Permission Status Monitoring**
   - Track permission changes during app lifetime
   - Update UI based on current permission state

### Permissions You Can Check

- `camera` - Access to device camera
- `microphone` - Access to device microphone
- `geolocation` - Access to location information
- `clipboard-read` - Reading clipboard contents
- `clipboard-write` - Writing to clipboard
- `notifications` - Display notifications
- `payment-handler` - Payment request handler
- And more...

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 43 | Yes | Full support from v43+ |
| **Edge** | 79 | Yes | Full support from v79+ |
| **Firefox** | 46 | Yes | Full support from v46+ |
| **Safari** | 16.0 | Yes | Added in Safari 16.0 and later |
| **Opera** | 30 | Yes | Full support from v30+ |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Safari iOS** | 16.0 | Yes | Added in iOS Safari 16.0 and later |
| **Chrome Android** | 43+ | Yes | Supported in modern versions |
| **Firefox Android** | 46+ | Yes | Supported in modern versions |
| **Opera Mobile** | 80 | Yes | Limited support |
| **Samsung Internet** | 4.0+ | Yes | Full support from v4.0 and later |
| **UC Browser Android** | 15.5+ | Yes | Supported |
| **Opera Mini** | All | No | Not supported |

### Legacy Browsers (Not Supported)

- **Internet Explorer** (all versions) - ❌ No support
- **Android Stock Browser** - ❌ No support
- **Blackberry Browser** - ❌ No support
- **Mobile IE** - ❌ No support

## Implementation

### Basic Usage

#### Check Permission Status

```javascript
// Check if a permission is granted
navigator.permissions.query({ name: 'geolocation' })
  .then(permissionStatus => {
    if (permissionStatus.state === 'granted') {
      // Permission granted, can use geolocation
    } else if (permissionStatus.state === 'prompt') {
      // User needs to be prompted
    } else if (permissionStatus.state === 'denied') {
      // Permission denied, cannot use feature
    }
  })
  .catch(error => {
    console.error('Permission check failed:', error);
  });
```

#### Monitor Permission Changes

```javascript
navigator.permissions.query({ name: 'microphone' })
  .then(permissionStatus => {
    // Log the initial state
    console.log(permissionStatus.state);

    // Listen for changes
    permissionStatus.addEventListener('change', () => {
      console.log('Permission state changed to:', permissionStatus.state);
    });
  });
```

#### Handle Multiple Permissions

```javascript
const permissionsToCheck = [
  { name: 'camera' },
  { name: 'microphone' },
  { name: 'geolocation' }
];

Promise.all(
  permissionsToCheck.map(p => navigator.permissions.query(p))
).then(results => {
  results.forEach((status, index) => {
    console.log(`${permissionsToCheck[index].name}: ${status.state}`);
  });
});
```

## Browser Compatibility Notes

- **Chrome & Edge**: Extensive support for various permissions. Chromium-based browsers have been early adopters.
- **Firefox**: Full support since version 46, comprehensive permission types.
- **Safari**: Added support in Safari 16.0 (December 2022). Earlier versions do not support the API.
- **iOS Safari**: Added in iOS 16.0 and later, mirroring desktop Safari support.
- **Opera**: Full support consistent with Chromium baseline.
- **Samsung Internet**: Strong support across versions due to Chromium base.

## Important Considerations

### Permission Types

Not all permission types are supported across all browsers. The most widely supported permissions include:
- `geolocation`
- `camera`
- `microphone`
- `notifications`

Newer permissions (like `clipboard-read`, `clipboard-write`) may have limited support.

### User Gestures

Most browsers require a user gesture (click, tap) to trigger permission prompts. The Permissions API itself does not show prompts—it only checks status.

### Security Context

The Permissions API is only available in secure contexts (HTTPS). It will not work on HTTP pages.

### Progressive Enhancement

Always use feature detection with fallbacks:

```javascript
if (navigator.permissions) {
  // Use Permissions API
} else {
  // Fallback implementation
}
```

## Resources & References

### Official Documentation
- [W3C Permissions Specification](https://w3c.github.io/permissions/)
- [MDN Web Docs - Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)

### Guides & Examples
- [Permission API samples and examples - Chrome Developers](https://developer.chrome.com/blog/permissions-api-for-the-web/)

### Polyfills & Extensions
- [Extended "polyfill" version of permission API - GitHub](https://github.com/jimmywarting/browser-su)

## Statistics

- **Global Support**: ~91.82% of users have browsers with full support
- **Partial Support**: 0%
- **No Support**: ~8.18% (primarily legacy browsers and older devices)

## Summary

The Permissions API is a modern, standardized approach to checking user permissions in web applications. With support in all major modern browsers (Chrome, Firefox, Safari, Edge, and Opera), it's suitable for use in contemporary web applications, especially when targeting modern desktop and mobile devices. For applications needing to support older browsers like Internet Explorer or older Safari versions, feature detection and fallbacks are essential.
