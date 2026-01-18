# Firefox Browser Documentation

## Browser Information

| Property | Value |
|----------|-------|
| **Official Name** | Mozilla Firefox |
| **Short Name** | Firefox |
| **Abbreviation** | FF |
| **Browser Type** | Desktop |
| **Vendor Prefix** | `-moz` |

---

## Overview

Mozilla Firefox is a free and open-source web browser developed by the Mozilla Foundation. It is available across multiple platforms including Windows, macOS, and Linux. Firefox is known for its strong standards compliance, developer tools, and commitment to user privacy.

---

## Vendor Prefix

Firefox uses the `-moz` vendor prefix for experimental and proprietary CSS properties and JavaScript APIs.

### Common Vendor-Prefixed Features

- CSS: `-moz-user-select`, `-moz-appearance`, `-moz-binding`, `-moz-border-radius`
- JavaScript: `MozBrowserFrame`, `MozAppearance`
- Events: `MozBeforePaint`

---

## Version History & Release Timeline

Firefox follows a rapid release schedule with major versions released approximately every 4 weeks. The browser maintains extended support for certain versions through Firefox ESR (Extended Support Release).

### Version Coverage

Firefox has released **148 tracked versions** in the CanIUse database, spanning from version 2 through version 148+.

### Major Version Milestones

| Version Range | Era | Notes |
|---------------|-----|-------|
| 2-4 | Early 2000s | Initial versions, limited CSS3 support |
| 5-10 | 2011-2011 | Rapid versioning period begins |
| 11-20 | 2012 | Improved standards support |
| 21-30 | 2013-2014 | Enhanced CSS and HTML5 features |
| 31-45 | 2014-2015 | Developer tools improvements |
| 46-60 | 2016-2017 | Quantum engine improvements begin |
| 61-100 | 2017-2022 | Continuous feature additions and modernization |
| 101-145 | 2022-2024 | Modern web standards, advanced features |
| 146+ | 2024+ | Latest versions with cutting-edge support |

---

## Current Usage Statistics

Based on global web usage data:

### Active Version Usage

| Version | Global Usage | Status |
|---------|--------------|--------|
| **145** | 0.73% | Current/Near Current |
| **144** | 0.61% | Current |
| **140** | 0.08% | Recent |
| **143** | 0.03% | Recent |
| **142** | 0.01% | Recent |
| **141** | 0.01% | Older |
| **138** | 0.00% | Minimal |
| **137** | 0.00% | Minimal |
| **128** | 0.02% | Legacy |
| **118** | 0.12% | Legacy |
| **115** | 0.15% | Legacy |

### Overall Statistics

- **Top Version**: Firefox 145 with 0.73% global usage
- **Latest Tracked**: Version 148
- **Versions with Measurable Usage**: Primarily versions 100 and above
- **Legacy Support**: Versions 1-114 have minimal to zero usage in current web traffic

### Usage Trends

- Modern versions (140+) represent the vast majority of active Firefox usage
- Users typically update to the latest stable version within a few weeks of release
- Older versions (< v100) are rarely encountered in production analytics
- Firefox ESR versions maintain usage for enterprise environments but are not separately tracked

---

## Browser Capabilities & Features

### Web Standards Support

Firefox has comprehensive support for:

- **HTML5**: Full support for semantic HTML5 elements
- **CSS3/CSS4**: Extensive support for modern CSS features
  - Flexbox and Grid layouts
  - CSS Variables (Custom Properties)
  - Advanced selectors
  - Animations and transitions
  - Modern color spaces
- **JavaScript (ES6+)**: Full support for modern JavaScript standards
  - Async/await
  - Promises
  - Arrow functions
  - Destructuring
  - Classes and modules
- **WebAPIs**:
  - Fetch API
  - Promises
  - Web Workers
  - Service Workers
  - Local Storage & IndexedDB
  - Geolocation API
  - Canvas & WebGL
  - WebRTC

### Notable Features

- **Developer Tools**: Comprehensive built-in developer tools with inspector, debugger, console, network monitor
- **Privacy Focus**: Enhanced Tracking Protection (ETP)
- **Performance**: Responsive engine optimized for modern web applications
- **Accessibility**: Strong support for ARIA and accessibility standards
- **Extensibility**: Support for WebExtensions API

---

## Developer Considerations

### Browser Compatibility Testing

When developing for Firefox, consider:

1. **Vendor Prefixes**: Some experimental features may require `-moz-` prefix
2. **Firefox-Specific Behavior**: Test edge cases specific to Firefox's rendering engine
3. **Developer Tools**: Utilize Firefox Developer Tools for debugging
4. **DevTools Debugging Protocol**: Support for remote debugging via Firefox Debugging Protocol (FDP)

### Known Vendor-Specific Issues

- Some CSS properties may behave slightly differently than in other browsers
- Certain proprietary APIs are specific to Firefox
- Legacy `-moz-` prefixed properties should be tested alongside standard versions

### Testing Recommendations

- Test with at least the current stable version and one previous major version
- Use Firefox ESR for enterprise/long-term support scenarios
- Test responsive design across desktop viewports
- Validate accessibility features with Firefox's accessibility inspector

---

## Support & Resources

### Official Documentation

- **Mozilla Developer Network (MDN)**: https://developer.mozilla.org
- **Firefox Platform Documentation**: https://firefox-source-docs.mozilla.org
- **Bug Tracker**: https://bugzilla.mozilla.org

### Release Schedule

- **Standard Release**: New major version approximately every 4 weeks
- **ESR Release**: Extended support with security and critical updates
- **Beta Channel**: Available for early feature testing
- **Nightly Channel**: Latest development builds for testing

---

## Notes

- Firefox maintains strong backward compatibility with web standards
- The browser is updated frequently with security patches and feature additions
- Users are encouraged to keep their browser updated to the latest stable version
- Enterprise deployments may use Firefox ESR for extended support periods
- Firefox's market share has remained relatively stable, with consistent usage across all demographics
- The browser is particularly popular among developers due to excellent developer tools
- Strong commitment to web standards and open web technologies

---

## Data Source

This documentation is based on CanIUse browser support data. For the most current and detailed browser support information for specific web features, visit [caniuse.com](https://caniuse.com).

**Last Updated**: 2024
**Data Format Version**: CanIUse agents.json structure
