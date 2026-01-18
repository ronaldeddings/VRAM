# Firefox for Android

## Browser Information

| Property | Value |
|----------|-------|
| **Browser ID** | `and_ff` |
| **Full Name** | Mozilla Firefox for Android |
| **Short Name** | Firefox for Android |
| **Abbreviation** | FF/And. |
| **Platform Type** | Mobile |
| **Vendor Prefix** | `-moz-` |

## Overview

Firefox for Android is Mozilla's implementation of the Firefox web browser for Android devices. It provides a full-featured browsing experience on mobile platforms, inheriting the rendering engine and JavaScript capabilities from the desktop Firefox browser while being optimized for touch interaction and mobile constraints.

## Technical Details

### Engine & Platform
- **Rendering Engine**: Gecko (same as desktop Firefox)
- **JavaScript Engine**: SpiderMonkey
- **Platform**: Android
- **Vendor Prefix**: `-moz-`
- **Synchronization**: Firefox for Android versions typically align with desktop Firefox release cycles

### Type Classification
Mobile browser - specifically designed for Android devices with touch input optimization and mobile-specific features.

## Current Version Support

### Latest Tracked Version
**Version 144** - Current tracked version with usage data

### Usage Statistics
- **Version 144**: 0.30% global usage

The usage data indicates that Firefox for Android has a relatively modest but consistent user base among global web traffic.

## Version History

Firefox for Android follows the same versioning scheme as desktop Firefox, with version numbers synchronizing across platforms. The browser was first introduced as "Firefox Mobile" and has evolved to become a fully-featured mobile browser.

### Release Timeline Notes
- Firefox for Android releases occur on the same schedule as desktop Firefox
- Desktop Firefox currently tracks versions through 148, with version 144 and higher representing recent releases
- Version 144 represents a relatively recent release with active user adoption

### Version Tracking Scope
Currently, the caniuse data tracks **version 144** for Firefox for Android with measurable market share data. Earlier versions are not included in current usage statistics, indicating a focus on more recent browser versions.

## Vendor Prefix

### Primary Prefix
`-moz-`

This prefix is used for Mozilla-specific CSS properties and JavaScript APIs. Examples include:
- `-moz-transform`
- `-moz-user-select`
- `-moz-appearance`
- `-moz-box-shadow`

### Prefix Coverage
The `-moz-` prefix maintains broad compatibility with CSS3 features, though many modern properties are now supported without vendor prefixes due to standardization efforts.

## Browser Capabilities

### Standards Support
Firefox for Android inherits feature support from the Gecko rendering engine, which includes:

- **HTML5**: Comprehensive support for modern HTML5 elements and APIs
- **CSS3**: Wide support for CSS3 specifications including transforms, animations, gradients, and flexbox
- **JavaScript (ES6+)**: Full support for modern ECMAScript standards
- **Web APIs**: Support for Fetch API, WebSocket, WebWorkers, Service Workers, and other modern web standards
- **Media Formats**: Support for multiple audio/video codecs (MP3, AAC, Theora, WebM, etc.)

### Mobile-Specific Features
- Touch event handling
- Responsive viewport configuration
- Mobile performance optimizations
- Battery-aware power management

## Notes

### Market Position
Firefox for Android maintains a stable but niche position in the mobile browser market. While not dominating market share like Chrome for Android, it provides an important alternative for privacy-conscious users and developers who prefer Mozilla's approach to web standards.

### Privacy & Security
Mozilla positions Firefox for Android as a privacy-focused browser with features including:
- Enhanced Tracking Protection (ETP)
- Private Browsing mode
- Support for DoH (DNS over HTTPS)
- Strong security update cycles

### Developer Considerations
- Developers should test on Firefox for Android to ensure cross-browser compatibility
- The `-moz-` prefix may still be required for certain advanced CSS features
- Bug reports and feature requests can be submitted to Mozilla's Firefox bug tracking system

### Compatibility Testing
When testing web applications:
- Use Firefox for Android through emulation in Firefox Developer Tools
- Test on actual Android devices for accurate touch behavior and performance
- Monitor Firefox for Android specific rendering differences, particularly with CSS transforms and animations
- Verify compatibility with mobile viewport requirements

## Related Resources

- **Mozilla Firefox for Android**: https://www.mozilla.org/en-US/firefox/mobile/
- **Mozilla Developer Network (MDN)**: https://developer.mozilla.org/
- **Firefox for Android Release Notes**: https://www.mozilla.org/en-US/firefox/mobile/notes/
- **Firefox Bug Tracking**: https://bugzilla.mozilla.org/

## Data Source

Browser data extracted from the [CanIUse](https://caniuse.com) database, which provides comprehensive web feature compatibility information across browsers and platforms.

---

**Last Updated**: 2025-12-13
**Data Source**: caniuse/data.json
**Browser ID**: `and_ff`
