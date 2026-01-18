# WebHID API

## Overview

The WebHID API enables raw access to HID (Human Interface Device) commands for all connected HIDs. Previously, HIDs could only be accessed through the browser if the browser had implemented a custom API for the specific device.

## Description

The WebHID API provides a standard interface for web applications to communicate with USB and Bluetooth HID devices. This includes keyboards, mice, joysticks, game controllers, and custom input devices. Rather than requiring browser vendors to implement specific APIs for individual device types, WebHID offers a unified, generic approach to HID communication.

This API is particularly useful for:
- Web-based gaming platforms with custom controller support
- Professional applications requiring specialized input devices
- Hardware development and testing tools
- Accessibility applications
- Industrial control systems

## Specification Status

**Status:** Unofficial (unoff)
**Specification URL:** [WICG WebHID Specification](https://wicg.github.io/webhid/)

The WebHID specification is currently being developed by the Web Incubation Community Group (WICG) and is not yet an official W3C standard.

## Categories

- JavaScript API

## Benefits & Use Cases

### Primary Benefits

1. **Cross-Device Support** - Access any HID device without requiring a custom browser API
2. **Standardized Interface** - Consistent API across all supporting browsers
3. **Security** - User permission model ensures applications cannot access devices without explicit consent
4. **Flexibility** - Support for both USB and Bluetooth HID devices
5. **Custom Hardware** - Enable web applications to work with specialized hardware and input devices

### Common Use Cases

- **Gaming** - Support for racing wheels, flight sticks, arcade cabinets, and custom controllers
- **Input Devices** - Alternative keyboards, mice, and pointing devices
- **Accessibility Tools** - Custom input devices for users with accessibility needs
- **Developer Tools** - Hardware testing and debugging applications
- **Industrial Applications** - Control systems and monitoring equipment
- **Music Production** - MIDI controllers and other audio input devices
- **3D Design** - Space navigation devices and 3D input peripherals

## Browser Support

### Summary

WebHID API support is limited to Chromium-based browsers (Chrome, Edge, Opera) starting from versions 89, 89, and 76 respectively. Firefox and Safari do not currently support this API.

### Detailed Support Table

| Browser | First Support | Latest Status | Notes |
|---------|--------------|---------------|-------|
| Chrome | v89 | ✅ Supported | Supported from version 89 onwards |
| Edge | v89 | ✅ Supported | Supported from version 89 onwards |
| Opera | v76 | ✅ Supported | Supported from version 76 onwards |
| Firefox | - | ❌ Not Supported | No support in any version |
| Safari | - | ❌ Not Supported | No support in any version |
| Internet Explorer | - | ❌ Not Supported | No support |
| iOS Safari | - | ❌ Not Supported | No support on iOS |
| Android Chrome | - | ❌ Not Supported | No support on Android |
| Android Firefox | - | ❌ Not Supported | No support on Android |
| Opera Mini | - | ❌ Not Supported | No support |

### Support Details by Browser

#### Desktop Browsers

**Google Chrome**
- First supported: Version 89 (2021)
- Status: Fully supported in all versions 89+
- Coverage: ~34% of global web traffic (as of latest stats)

**Microsoft Edge**
- First supported: Version 89 (2021)
- Status: Fully supported in all versions 89+
- Full feature parity with Chrome

**Opera**
- First supported: Version 76 (2020)
- Status: Fully supported in all versions 76+
- Based on Chromium, full compatibility with Chrome version equivalents

**Mozilla Firefox**
- Status: Not supported
- No public timeline for implementation

**Apple Safari**
- Status: Not supported
- No public indication of plans to support

#### Mobile Browsers

- iOS Safari: No support
- Android Chrome: No support
- Android Firefox: No support
- Samsung Internet: No support
- All other mobile browsers: No support

### Development Timeline

| Event | Date | Details |
|-------|------|---------|
| Feature Development | 2020+ | Chromium development and testing |
| Chrome Release | v89 | March 2021 |
| Edge Release | v89 | March 2021 |
| Opera Release | v76 | May 2020 |

## Usage Statistics

- **Support Coverage:** 34.13% of global web traffic (Chrome, Edge, Opera combined)
- **Partial Implementation:** 0% (no browsers with partial support)
- **No Support:** 65.87% of global web traffic

## Integration & Resources

### Official Documentation

- **Web.dev Guide:** [Human interface devices on the web: a few quick examples](https://web.dev/hid-examples/)
  - Comprehensive guide with practical examples
  - Best practices for WebHID development
  - Security and permission model explanation

### Chrome Platform Status

- **Chrome Feature ID:** 5172464636133376
- **Platform Status:** Available for review

## Security & Permissions

### User Consent Model

The WebHID API requires explicit user permission before a web application can access any HID device. The user must:

1. Actively grant permission through a browser permission dialog
2. Select which specific device(s) the application can access
3. Permission is granted per-site and per-device

### Privacy Considerations

- No background access to devices without user knowledge
- Users can revoke permissions at any time
- No fingerprinting through device enumeration without permission
- Must be served over HTTPS in production environments

## Implementation Notes

### Development Status

WebHID is a stable API in Chromium-based browsers but remains an unofficial standard. Developers should:

1. **Test thoroughly** in target environments
2. **Implement fallbacks** for non-supporting browsers
3. **Consider alternative input methods** for web applications
4. **Check for API availability** before attempting to use
5. **Monitor specification updates** as it moves toward official standardization

### Feature Detection

```javascript
if ('hid' in navigator) {
  // WebHID API is available
  // Safe to use navigator.hid methods
} else {
  // Fallback for unsupported browsers
}
```

### Known Limitations

- Desktop-only support (no mobile browser support)
- Chromium-based browsers only
- Requires HTTPS in production
- User permission required for each device
- Some operating systems may have restricted HID access

## Compatibility Considerations

### For Web Developers

- Design with progressive enhancement in mind
- Provide graceful degradation for unsupported browsers
- Consider alternative input methods or polyfills
- Test across supported browsers
- Ensure HTTPS deployment for production use

### For Polyfills

- Limited polyfill potential due to platform-level restrictions
- Fallback APIs differ significantly between browsers
- Consider alternative libraries for cross-browser compatibility

## Related Standards & APIs

- **WebUSB API** - Lower-level USB device access
- **Gamepad API** - Standardized game controller input (broader support)
- **Keyboard API** - Low-level keyboard event handling
- **Pointer Events** - Mouse/touch input standardization

## References

- [WebHID Specification (WICG)](https://wicg.github.io/webhid/)
- [web.dev - HID Examples](https://web.dev/hid-examples/)
- [MDN - WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API)
- [Chrome DevTools - WebHID Debugging](https://developers.google.com/web/tools/chrome-devtools)

---

**Last Updated:** December 13, 2025
**Data Source:** CanIUse WebHID Feature Data
**Current Status:** Under active development and standardization
