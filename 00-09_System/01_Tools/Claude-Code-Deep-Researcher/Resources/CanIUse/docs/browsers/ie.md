# Internet Explorer (IE)

## Browser Information

| Property | Value |
|----------|-------|
| **Browser Name** | Internet Explorer |
| **Short Name** | IE |
| **Abbreviation** | IE |
| **Browser Type** | Desktop |
| **Vendor Prefix** | `-ms-` |
| **Vendor** | Microsoft |

## Overview

Microsoft Internet Explorer was a graphical web browser developed by Microsoft and included as part of the Windows operating system. Internet Explorer was the dominant web browser from 1995 to 2016, though it has since been succeeded by Microsoft Edge.

## Vendor Prefix

All CSS vendor-specific properties and JavaScript APIs for Internet Explorer use the **`-ms-`** prefix.

### Examples
- `-ms-filter`
- `-ms-transform`
- `-ms-transition`

## Version History

### Supported Versions

Internet Explorer had multiple major releases throughout its lifetime. The following versions are tracked in CanIUse:

| Version | Status | Notes |
|---------|--------|-------|
| 5.5 | End of Life | Legacy version, minimal usage |
| 6 | End of Life | Legacy version, minimal usage |
| 7 | End of Life | Legacy version, minimal usage |
| 8 | End of Life | Limited modern web support |
| 9 | End of Life | Improved HTML5 support |
| 10 | End of Life | Minor release, minimal usage |
| 11 | End of Life | Final major release |

## Usage Statistics

Global usage statistics for Internet Explorer versions (as recorded in CanIUse):

| Version | Global Usage (%) |
|---------|------------------|
| 5.5 | 0.00% |
| 6 | 0.00% |
| 7 | 0.00% |
| 8 | 0.035% |
| 9 | 0.052% |
| 10 | 0.00% |
| 11 | 0.330% |

**Key Observations:**
- Internet Explorer 11 has the highest usage among IE versions at 0.330% global market share
- Versions 5.5, 6, 7, and 10 have negligible or zero measurable usage
- Combined IE usage represents a very small fraction of modern web traffic
- Users are strongly encouraged to migrate to Microsoft Edge or other modern browsers

## Current Status

Internet Explorer is no longer supported by Microsoft:

- **End of Support**: Internet Explorer 11 reached end of support on June 15, 2022
- **Retirement**: Internet Explorer functionality has been removed from Windows 11
- **Successor**: Microsoft Edge is the recommended replacement for Internet Explorer

## Migration Recommendations

### For End Users
Users running Internet Explorer should migrate to:
- **Microsoft Edge** - Modern replacement with Windows integration
- **Google Chrome** - Cross-platform modern browser
- **Firefox** - Privacy-focused modern browser
- **Safari** - Default browser for macOS/iOS

### For Web Developers
Modern web development should **not target Internet Explorer**:
- IE has minimal global usage (< 0.5% combined)
- IE lacks support for modern CSS and JavaScript features
- Maintaining IE compatibility adds significant development overhead
- Focus resources on modern browsers instead

## Feature Support

Internet Explorer's support for modern web standards is limited:

### Poor/Limited Support For:
- CSS Grid Layout
- CSS Flexbox (IE11 partial support)
- CSS Custom Properties (CSS Variables)
- ES6+ JavaScript features
- Modern async/await patterns
- WebGL and Canvas APIs
- Service Workers
- Web Components
- Fetch API

### Better Support In IE 11:
- ES5 JavaScript
- CSS3 (with vendor prefixes)
- HTML5 elements
- Basic DOM manipulation
- AJAX/XMLHttpRequest

## Technical Notes

### Compatibility Mode
- IE included a "Compatibility Mode" feature that allowed websites to be displayed in the rendering engine of previous IE versions
- This feature often caused more problems than it solved for modern web development

### ActiveX Controls
- IE uniquely supported ActiveX controls, a now-obsolete technology
- This was a significant security concern and is not supported in modern browsers

### Conditional Comments
- IE supported conditional comments (e.g., `<!--[if IE 9]>`) for version-specific styling
- This practice is now obsolete and should not be used

## Related Resources

- [Microsoft Edge Documentation](https://docs.microsoft.com/en-us/microsoft-edge/)
- [Internet Explorer End of Support](https://www.microsoft.com/en-us/microsoft-365/windows/end-of-internet-explorer-support)
- [CanIUse Database](https://caniuse.com)

## See Also

- [Microsoft Edge](./edge.md) - The modern successor to Internet Explorer
- [Browser Compatibility Guide](../README.md)

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse Database*
