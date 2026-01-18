# Chrome for Android

## Overview

Chrome for Android is Google's mobile web browser implementation for the Android operating system. It provides full web browsing capabilities optimized for touchscreen devices and mobile networks.

## Browser Information

### Identification

| Property | Value |
|----------|-------|
| **Browser ID** | `and_chr` |
| **Official Name** | Google Chrome for Android |
| **Short Name** | Chrome for Android |
| **Abbreviation** | Chr/And. |
| **Browser Type** | Mobile |

### Technical Details

| Property | Value |
|----------|-------|
| **Vendor Prefix** | `-webkit-` |
| **Engine** | Blink (Chromium-based) |
| **Underlying OS** | Android |
| **Platform** | Mobile/Tablet |

## Version Information

### Current Version

| Property | Value |
|----------|-------|
| **Latest Version** | 142 |
| **Usage (Global)** | 41.86% |

### Version History

Chrome for Android maintains version parity with Chrome desktop, following Google's rapid release cycle. The version numbering system tracks:

- **Version numbers**: Correspond directly to Chrome/Chromium version releases
- **Release frequency**: Approximately every 4 weeks (formerly every 2-3 weeks)
- **Initial release**: Chrome for Android was introduced with Android as a first-class mobile browser

The versions array in the data contains 147 version entries, with the earliest versions set to `null` (as Chrome for Android did not exist in those release cycles). Version 142 is the current tracked version with active usage statistics.

## Usage Statistics

### Global Usage

- **Version 142**: 41.8556% global usage share

This represents Chrome for Android's dominant position in mobile web browsing, making it one of the most important browsers for web developers to support.

## Features & Capabilities

### Rendering Engine

Chrome for Android uses the **Blink** rendering engine (part of the Chromium project), which provides:

- Modern CSS3 support with rapid feature adoption
- JavaScript ES6+ support with continuous improvements
- Performance optimizations for mobile hardware
- Hardware acceleration for graphics and video

### Vendor Prefixes

Chrome for Android supports the `-webkit-` vendor prefix for:

- CSS properties and values
- Media queries
- Experimental features during development

### Mobile-Specific Features

Chrome for Android includes mobile-optimized capabilities:

- Touch event handling
- Responsive viewport management
- Hardware accelerated scrolling
- Optimized memory management for mobile devices
- Battery-efficient rendering
- Native Android integration (share, notifications, etc.)

## Development Considerations

### Compatibility

When developing for Chrome for Android, developers should:

1. **Test on actual devices or emulators**: Mobile browser behavior can differ from desktop
2. **Consider touchscreen input**: Hover states work differently; use touch events appropriately
3. **Optimize for mobile networks**: Account for varying bandwidth and latency
4. **Use responsive design**: Ensure layouts adapt to various screen sizes
5. **Monitor performance**: Mobile devices have limited resources compared to desktops

### Feature Detection

Due to the rapid release cycle and frequent feature additions, use feature detection rather than version checking for capability assessment. Chrome for Android typically receives new web platform features at parity with desktop Chrome.

### Debugging

Chrome for Android includes:

- Remote debugging via Chrome DevTools
- USB debugging for physical devices
- Chrome DevTools emulation in the desktop browser
- Performance profiling tools optimized for mobile scenarios

## Platform Notes

### Android Integration

- **Minimum Android version supported**: Varies by Chrome version; modern versions support Android 5.0+
- **Native features**: Can access Android-specific APIs when appropriate (e.g., through WebAPI bridges)
- **System behaviors**: Respects Android system settings for accessibility, display settings, and battery optimization

### WebView

Chrome for Android's Blink engine is also used in the Android System WebView, which powers web rendering for many Android applications.

## References

- **CanIUse Agent ID**: `and_chr`
- **Official Chrome for Android Site**: https://www.google.com/chrome/
- **Android Developer Documentation**: https://developer.android.com/

## Related Browsers

- **Chrome (Desktop)**: `chrome` - Desktop version with feature parity
- **Android Browser**: `android` - Legacy default browser (deprecated)
- **Firefox for Android**: `and_ff` - Alternative mobile browser
- **Samsung Internet**: `samsung` - Mobile browser alternative

---

*Last Updated*: Based on CanIUse data with Chrome for Android version 142 as current
