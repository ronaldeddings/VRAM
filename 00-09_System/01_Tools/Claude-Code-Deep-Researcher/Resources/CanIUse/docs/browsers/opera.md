# Opera Browser

## Overview

**Browser Name:** Opera
**Display Name:** Op.
**Browser Type:** Desktop
**Vendor Prefix:** `-webkit-` (primary), `-o-` (legacy versions)

---

## Browser Information

### Basic Details

| Field | Value |
|-------|-------|
| **Official Name** | Opera |
| **Short Name** | Op. |
| **Classification** | Desktop Browser |
| **Primary Vendor Prefix** | `-webkit-` |
| **Legacy Vendor Prefix** | `-o-` |

### Vendor Prefix Details

Opera uses different vendor prefixes depending on the version:

- **Modern Opera (v12.1+):** Uses `-webkit-` prefix, following the WebKit/Chromium engine standards
- **Legacy Opera (v9-v12.1):** Uses `-o-` prefix from the Presto rendering engine era

#### Legacy Prefix Exceptions

The following Opera versions use the `-o-` vendor prefix:

| Version Range | Prefix |
|---------------|--------|
| 9             | -o-    |
| 9.5-9.6       | -o-    |
| 10.0-10.1     | -o-    |
| 10.5          | -o-    |
| 10.6          | -o-    |
| 11            | -o-    |
| 11.1          | -o-    |
| 11.5          | -o-    |
| 11.6          | -o-    |
| 12            | -o-    |
| 12.1          | -o-    |

---

## Version History

Opera has released numerous versions since the beginning of browser tracking in this dataset. The supported versions range from early versions through the latest releases.

### Version Timeline

The following versions are documented in the compatibility database:

**Early Versions (9-12.1):** Presto engine era
- 9, 9.5-9.6, 10.0-10.1, 10.5, 10.6, 11, 11.1, 11.5, 11.6, 12, 12.1

**Modern Versions (15-122):** WebKit/Chromium engine era
- 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122

---

## Usage Statistics

### Global Market Share by Version

As of the latest data collection, the following Opera versions have measurable global market usage:

| Version | Market Share (%) | Notes |
|---------|-----------------|-------|
| 122     | 0.290656%       | Latest stable release (current) |
| 92      | 0.075008%       | Older version still in use |
| 95      | 0.028128%       | Minor version presence |
| 120     | 0.009376%       | Previous version |
| 93      | 0.009376%       | Older version |

**Total Opera Market Share:** ~0.41% globally

### Usage Notes

- **Modern Versions:** Opera 92 and later show measurable market presence
- **Latest Version:** Version 122 represents the largest user base among tracked versions
- **Historical Versions:** Versions prior to v92 show negligible or zero market usage
- **Market Position:** Opera maintains a small but consistent market share in the browser ecosystem

---

## Rendering Engine History

### Engine Evolution

1. **Presto Era (v9-v12.1)**
   - Custom rendering engine developed by Opera Software
   - Used proprietary `-o-` vendor prefix
   - Known for high performance and standards compliance

2. **WebKit/Chromium Era (v15-present)**
   - Switched to WebKit-based engine (later Chromium/Blink)
   - Adoption of `-webkit-` vendor prefix
   - Better alignment with modern web standards
   - Improved compatibility with major web applications

### Important Version Notes

- **Version 13-14:** Not documented in this dataset (likely skipped or internal versions)
- **Version Numbering:** Beginning with v15, Opera followed Chromium versioning more closely
- **Ongoing Updates:** Modern Opera continues rapid version releases aligned with Chromium schedule

---

## Vendor Prefix Implementation

### CSS Vendor Prefix Usage

When implementing CSS features in Opera, developers should use:

**For Modern Opera (v12.1+):**
```css
.element {
  display: -webkit-flex;      /* Opera 12.1+ */
  display: flex;
}
```

**For Legacy Opera (v9-v12.1):**
```css
.element {
  display: -o-flex;           /* Opera 9-12.1 */
  display: -webkit-flex;      /* Opera 12.1+ (fallback) */
  display: flex;
}
```

### JavaScript Vendor Prefix Usage

**Detecting Opera vendor prefix:**
```javascript
const vendorPrefix = 'webkit'; // Modern Opera
// or
const vendorPrefix = 'o';      // Legacy Opera
```

---

## Platform Availability

- **Desktop:** Yes (Windows, macOS, Linux)
- **Mobile:** Android (separate tracking, not in this dataset)
- **Classification:** Desktop browser

---

## Feature Support Considerations

### Compatibility Strategy

When developing for Opera:

1. **Modern Sites (2012+):** Focus on `-webkit-` prefix
2. **Legacy Support:** Include `-o-` prefix for versions 9-12.1 if necessary
3. **Progressive Enhancement:** Use unprefixed properties as fallback
4. **Feature Detection:** Use tools like Modernizr for capability testing

### Version Cutoff

- Most modern web standards are best supported in Opera 92+
- Older versions (pre-v15) have significantly limited feature support
- Consider dropping support for versions before v15 in new projects

---

## Additional Resources

- **Browser Statistics:** Based on CanIUse usage data
- **Update Frequency:** Opera updates approximately every 3-4 weeks in the modern era
- **Version Support:** Opera typically supports the current and recent previous versions

---

## Notes

- Opera's transition from Presto (v9-v12.1) to WebKit/Chromium (v15+) marked a significant shift in rendering capabilities
- The `-o-` prefix era represents historical web development; modern development primarily uses `-webkit-`
- Opera maintains a consistent but small share of the global browser market
- Version numbering post-v15 follows Chromium's rapid release schedule
- Data last updated: December 2025

