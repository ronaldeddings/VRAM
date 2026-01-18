# Safari Browser Documentation

## Overview

**Browser Name:** Safari
**Full Name:** Safari
**Abbreviation:** Saf.
**Browser Type:** Desktop
**Vendor Prefix:** `-webkit-`

Safari is Apple's web browser bundled with macOS, iPadOS, and other Apple operating systems. It is the primary browser for iOS devices and a major desktop browser for macOS users.

---

## Key Information

| Property | Value |
|----------|-------|
| **Type** | Desktop |
| **Vendor** | Apple |
| **Prefix** | webkit |
| **First Version Tracked** | 3.1 |
| **Latest Version** | 26.2 |
| **TP (Tech Preview)** | Available |

---

## Version History & Global Usage Statistics

The following table shows Safari versions and their global market usage percentages:

| Version | Usage (%) | Status | Notes |
|---------|-----------|--------|-------|
| 3.1 | 0.00 | Obsolete | Initial tracked version |
| 3.2 | 0.00 | Obsolete | |
| 4 | 0.00 | Obsolete | |
| 5 | 0.00 | Obsolete | |
| 5.1 | 0.00 | Obsolete | |
| 6 | 0.00 | Obsolete | |
| 6.1 | 0.00 | Obsolete | |
| 7 | 0.00 | Obsolete | |
| 7.1 | 0.00 | Obsolete | |
| 8 | 0.00 | Obsolete | |
| 9 | 0.00 | Obsolete | |
| 9.1 | 0.00 | Obsolete | |
| 10 | 0.00 | Obsolete | |
| 10.1 | 0.00 | Obsolete | |
| 11 | 0.00 | Obsolete | |
| 11.1 | 0.47 | Legacy | Minor usage |
| 12 | 0.00 | Obsolete | |
| 12.1 | 0.00 | Obsolete | |
| 13 | 0.00 | Obsolete | |
| 13.1 | 1.88 | Legacy | |
| 14 | 0.94 | Legacy | |
| 14.1 | 2.34 | Legacy | |
| 15 | 0.00 | Obsolete | |
| 15.1 | 0.47 | Legacy | |
| 15.2-15.3 | 0.00 | Obsolete | Range version |
| 15.4 | 0.47 | Legacy | |
| 15.5 | 0.94 | Legacy | |
| 15.6 | 8.91 | Legacy | Significant usage |
| 16.0 | 0.47 | Legacy | |
| 16.1 | 0.94 | Legacy | |
| 16.2 | 0.94 | Legacy | |
| 16.3 | 1.88 | Legacy | |
| 16.4 | 0.94 | Legacy | |
| 16.5 | 1.41 | Legacy | |
| 16.6 | 13.13 | Current | High usage |
| 17.0 | 0.47 | Current | |
| 17.1 | 9.38 | Current | High usage |
| 17.2 | 0.94 | Current | |
| 17.3 | 1.41 | Current | |
| 17.4 | 2.34 | Current | |
| 17.5 | 3.75 | Current | |
| 17.6 | 14.06 | Current | High usage |
| 18.0 | 1.41 | Current | |
| 18.1 | 2.34 | Current | |
| 18.2 | 1.41 | Current | |
| 18.3 | 5.16 | Current | |
| 18.4 | 2.81 | Current | |
| 18.5-18.6 | 11.72 | Current | Range version, high usage |
| 26.0 | 20.63 | Latest | Latest stable |
| 26.1 | 22.97 | Latest | **Highest usage** |
| 26.2 | 0.94 | Latest | Most recent version |
| TP (Tech Preview) | 0.00 | Experimental | Technical preview builds |

---

## Usage Trends

### Current Version Distribution

**Top 5 Most Used Versions:**
1. **Safari 26.1** - 22.97% of global Safari users
2. **Safari 26.0** - 20.63% of global Safari users
3. **Safari 18.5-18.6** - 11.72% of global Safari users
4. **Safari 17.6** - 14.06% of global Safari users
5. **Safari 16.6** - 13.13% of global Safari users

### Version Age Grouping

| Category | Combined Usage |
|----------|----------------|
| **Latest (26.x)** | ~44.54% |
| **Current (17.x-18.x)** | ~55.46% |
| **Legacy (15.x-16.x)** | ~0.00% |
| **Obsolete (<15.x)** | ~0.00% |

---

## Vendor Prefix

Safari uses the **`-webkit-`** vendor prefix for CSS properties and JavaScript APIs that are not yet standardized or require vendor-specific implementations.

### Common `-webkit-` Properties

```css
-webkit-appearance
-webkit-backface-visibility
-webkit-background-clip
-webkit-box-shadow
-webkit-box-sizing
-webkit-filter
-webkit-flex
-webkit-transform
-webkit-transition
-webkit-user-select
```

---

## Browser Characteristics

### Strengths

- **Performance:** Highly optimized JavaScript engine (JavaScriptCore)
- **Standards Compliance:** Strong support for modern web standards
- **Battery Efficiency:** Optimized for battery life on Apple devices
- **Security:** Regular security updates through OS releases
- **Apple Ecosystem:** Deep integration with macOS and iOS

### Development Considerations

- **Version Updates:** Tied to OS updates; users must upgrade their operating system to get browser updates
- **Testing:** Critical to test on Safari due to WebKit differences from Blink/Gecko
- **Debugging Tools:** Safari Developer Tools available in modern versions
- **Compatibility:** Some features may behave differently than Chromium-based browsers

---

## Notes

- **Version Numbering:** Safari versions correspond to macOS versions (e.g., Safari 15 with macOS Monterey)
- **iOS Safari:** On iOS, all browsers must use the WebKit engine, making Safari the de facto standard browser engine
- **Release Cycle:** New versions are released with major OS updates (typically once per year)
- **Legacy Versions:** Older Safari versions are only updated via OS security patches, not standalone updates
- **Modern Development:** Safari 15+ provides substantially better support for modern CSS, JavaScript, and web standards

---

## Related Resources

- [Safari Release Notes](https://developer.apple.com/safari/release-notes/)
- [WebKit Technologies](https://webkit.org/)
- [Safari Developer Tools Documentation](https://developer.apple.com/safari/tools/)
- [Can I Use - Safari Support Data](https://caniuse.com)

---

**Last Updated:** 2025
**Data Source:** CanIUse Database
