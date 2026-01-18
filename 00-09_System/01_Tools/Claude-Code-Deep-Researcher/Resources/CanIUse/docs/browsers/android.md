# Android Browser Documentation

## Overview

The **Android Browser** (also known as Android Browser / Webview) is the default mobile web browser for Android devices. This documentation covers its technical specifications, version history, and usage statistics.

---

## Browser Information

### Basic Details

| Property | Value |
|----------|-------|
| **Browser Name** | Android Browser |
| **Full Name** | Android Browser / Webview |
| **Abbreviation** | And. |
| **Type** | Mobile |
| **Vendor Prefix** | `-webkit-` |

### Type Classification

**Mobile Browser** — The Android Browser is a mobile web browser designed for Android operating systems. It serves as both the default browser and the WebView component used by other applications on Android devices.

### Vendor Prefix

The Android Browser uses the **WebKit** vendor prefix (`-webkit-`) for CSS and JavaScript properties. This is consistent with other WebKit-based browsers like Chrome and Safari.

---

## Version History

The Android Browser has evolved through multiple versions, corresponding to Android OS releases. Below is a comprehensive version history with global usage statistics:

### Version Release Timeline

| Version | Android OS | Global Usage | Status |
|---------|-----------|--------------|--------|
| 2.1 | Eclair | 0.0000% | Obsolete |
| 2.2 | Froyo | 0.0000% | Obsolete |
| 2.3 | Gingerbread | 0.0000% | Obsolete |
| 3.x | Honeycomb | 0.0000% | Obsolete |
| 4.x | Ice Cream Sandwich | 0.0000% | Obsolete |
| 4.1 | Jelly Bean | 0.0000% | Obsolete |
| 4.2-4.3 | Jelly Bean (4.2+) | 0.0092% | Legacy |
| 4.4 | KitKat | 0.0000% | Obsolete |
| 4.4.3-4.4.4 | KitKat (Latest) | 0.0231% | Legacy |
| 142 | Chromium-based (Modern) | 46.1543% | Current |

### Key Observations

1. **Legacy Versions**: Versions 2.1 through 4.4 show negligible global usage, indicating they are effectively obsolete in production environments.

2. **Chromium Migration**: Version 142 represents the modernized Android Browser built on the Chromium engine. This version dominates usage with **46.15%** of global Android browser traffic.

3. **Transition Period**: The data shows a clear transition from older WebKit-based versions to the Chromium-based implementation, with very few users remaining on intermediate versions.

---

## Usage Statistics

### Global Usage Breakdown

```
Version 142 (Chromium-based):     46.1543%  ████████████████████████████████████████████
Version 4.4.3-4.4.4:               0.0231%
Version 4.2-4.3:                   0.0092%
All other versions:                0.0000%
```

### Market Share Insights

- **Modern (v142)**: Accounts for nearly half of all Android Browser usage globally
- **Legacy**: Combined usage of pre-4.4 versions is negligible (<0.04%)
- **Conclusion**: The Android Browser ecosystem has largely migrated to modern Chromium-based implementations

---

## Technical Specifications

### Rendering Engine

- **Older Versions (2.1-4.4.4)**: WebKit-based engine
- **Modern Versions (142+)**: Chromium-based engine

### CSS Vendor Prefix

```css
/* WebKit prefix for cross-browser compatibility */
-webkit-appearance: none;
-webkit-box-shadow: 0 0 10px rgba(0,0,0,0.5);
-webkit-transform: rotate(45deg);
```

### JavaScript API Support

The Android Browser supports modern JavaScript APIs including:
- ES6+ features (in modern versions)
- Fetch API
- Web Storage (localStorage, sessionStorage)
- Service Workers (v142+)
- WebGL

---

## Compatibility Notes

### Feature Detection

When developing for Android browsers, consider:

1. **Progressive Enhancement**: Design applications to work across both legacy and modern versions
2. **Vendor Prefixes**: Use `-webkit-` prefixes for maximum compatibility
3. **Feature Checking**: Implement feature detection rather than user-agent sniffing

### Development Recommendations

- **Target Modern Versions**: With v142 holding 46% of usage, focus development on Chromium-based features
- **Legacy Support**: If legacy version support is required, implement graceful degradation
- **Testing**: Test on actual Android devices or use Android emulators with different API levels

---

## Deprecation Timeline

The following versions have been deprecated and receive no security or feature updates:

- **Android 2.1 - 4.3**: Released 2010-2013, completely obsolete
- **Android 4.4 (KitKat)**: Released 2013, legacy status
- **Android 4.4.3-4.4.4**: Released 2014, minimal usage (<0.03%)

---

## Related Resources

- **Android Developer Documentation**: https://developer.android.com/
- **Chrome DevTools for Mobile**: For remote debugging Android devices
- **Can I Use**: Feature compatibility database for Android Browser

---

## Document Metadata

| Property | Value |
|----------|-------|
| **Source** | CanIUse data.json |
| **Last Updated** | Data current as of latest CanIUse update |
| **Data Extraction Date** | 2025-12-13 |

---

## Notes

- The Android Browser / Webview serves dual purposes: as a standalone browser and as the WebView component used by Android applications
- Modern Android devices (v142/Chromium-based) receive updates more frequently and support a wider range of modern web standards
- Developers should prioritize supporting the Chromium-based version (142) while implementing graceful degradation for legacy versions still in use
