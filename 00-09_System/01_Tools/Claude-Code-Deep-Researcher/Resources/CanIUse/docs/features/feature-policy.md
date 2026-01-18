# Feature Policy

## Overview

Feature Policy is a web platform mechanism that allows developers to selectively enable and disable the use of various browser features and APIs. This specification provides fine-grained control over which features are available in documents and embedded frames.

**Status:** Unofficial/Deprecated - This feature has been superseded by newer specifications

## Description

Feature Policy defines a mechanism for web developers to enable and disable specific browser features and APIs. Through Feature Policy, developers can ensure that third-party scripts and iframes cannot use potentially sensitive or performance-impacting features without explicit permission.

**Note:** Feature Policy has been deprecated and replaced by:
- [Permissions Policy](/permissions-policy) - The primary successor
- [Document Policy](/document-policy) - Complementary specification for document-level policies

## Specification

- **W3C Specification:** [Feature Policy Level 1](https://www.w3.org/TR/2019/WD-feature-policy-1-20190416/) (Working Draft)
- **Status:** Unofficial (Unoff)

## Categories

- JavaScript API
- Other
- Security

## Key Features & Benefits

### Use Cases

1. **Third-Party Script Security**
   - Restrict capabilities available to third-party embedded content
   - Prevent ads or widgets from accessing sensitive APIs

2. **API Control**
   - Selectively enable/disable access to geolocation, camera, microphone
   - Control payment request APIs and other sensitive features

3. **Performance Management**
   - Restrict synchronous XHR to improve performance
   - Control layout-forcing operations via iframes

4. **Privacy Protection**
   - Enforce privacy policies by blocking certain APIs
   - Prevent unauthorized feature access by embedded content

### Implementation Methods

Feature Policy can be set in multiple ways:

1. **HTTP Header**
   ```
   Feature-Policy: geolocation 'self'; camera 'none'
   ```

2. **iframe `allow` Attribute**
   ```html
   <iframe allow="geolocation 'self'; camera 'none'" src="..."></iframe>
   ```

3. **JavaScript API**
   ```javascript
   document.featurePolicy.allowedFeatures()
   document.featurePolicy.allowsFeature('geolocation', 'https://example.com')
   ```

## Browser Support

### Desktop Browsers

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **Chrome** | Full | 74+ | Experimental in 60-73; Partial support for Permissions Policy from 88+ |
| **Edge** | Full | 79+ | Partial support for Permissions Policy from 88+ |
| **Firefox** | Partial | 74+ | Supports `allow` attribute on iframes only (#2) |
| **Safari** | Partial | 11.1+ | `allow` attribute only; Limited origin/wildcard support (#2, #3) |
| **Opera** | Full | 62+ | Experimental in 47-61; Partial Permissions Policy from 75+ |
| **Internet Explorer** | No | — | Not supported |

### Mobile Browsers

| Browser | Support | Version | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | Partial | 11.3+ | `allow` attribute only; Limited origin/wildcard support |
| **Android Browser** | Full | 142+ | Limited data; May vary by device |
| **Chrome (Android)** | Full | 142+ | Partial Permissions Policy support |
| **Firefox (Android)** | Partial | 144+ | `allow` attribute only |
| **Samsung Internet** | Full | 11.1+ | Experimental in 8.2-10.1 |
| **Opera (Mobile)** | Full | 80+ | Partial Permissions Policy support |
| **UC Browser (Android)** | Full | 15.5+ | Limited data |
| **Baidu** | Full | 13.52+ | Partial Permissions Policy support |
| **KaiOS** | Partial | 3.0+ | `allow` attribute only |
| **Opera Mini** | No | — | Not supported |
| **Blackberry** | No | — | Not supported |
| **IE Mobile** | No | — | Not supported |

### Support Legend

- **Full Support (y)** - Complete implementation including HTTP header, `allow` attribute, and JS API
- **Partial Support (a)** - Limited implementation, usually `allow` attribute only
- **No Support (n)** - Feature not supported

### Global Usage Statistics

- **Full Support:** 79.98%
- **Partial Support:** 12.74%
- **No Support:** 7.28%

## Implementation Notes

### Standard Support Details

Standard support includes:
1. **HTTP `Feature-Policy` Header** - Server-side policy declaration
2. **`allow` Attribute on iframes** - Per-frame feature control
3. **`document.featurePolicy` JS API** - Runtime feature policy queries

### Browser-Specific Notes

**#1 - Older Chromium Browsers (Chrome 60-73, Opera 47-61)**
- Did not support the JavaScript API (`document.featurePolicy`)
- Only support HTTP header and iframe `allow` attribute

**#2 - Safari & Firefox (Partial Support)**
- Only support the `allow` attribute on iframes
- Do not support HTTP `Feature-Policy` header
- Do not support the `document.featurePolicy` JS API

**#3 - Safari Limitations**
- Does not support [list of origins](https://bugs.webkit.org/show_bug.cgi?id=189901)
- Does not support [wildcard syntax](https://bugs.webkit.org/show_bug.cgi?id=187816)
- Origin specification is limited to single origins

**#4 - Permissions Policy Transition**
- Browsers from Chrome 88+, Edge 88+, Opera 75+, and others support at least partial implementation of [Permissions Policy](/permissions-policy)
- Permissions Policy is the recommended modern replacement
- Feature Policy support is maintained for backward compatibility

## Relevant Resources

### Official Documentation & Tools

- [Feature Policy Kitchen Sink Demos](https://feature-policy-demos.appspot.com/) - Interactive examples of Feature Policy in action
- [Introduction to Feature Policy](https://developers.google.com/web/updates/2018/06/feature-policy) - Google Web Updates article
- [featurepolicy.info](https://featurepolicy.info/) - Feature-Policy Playground for experimentation
- [Feature Policy Tester](https://chrome.google.com/webstore/detail/feature-policy-tester-dev/pchamnkhkeokbpahnocjaeednpbpacop) - Chrome DevTools Extension
- [Known Features List](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md) - Comprehensive list of controllable features

### Implementation Tracking

- [Firefox Implementation Ticket](https://bugzilla.mozilla.org/show_bug.cgi?id=1390801) - Mozilla's tracking for Feature Policy support

### Related Specifications

- [Permissions Policy](/permissions-policy) - Modern replacement with improved syntax and broader browser support
- [Document Policy](/document-policy) - Complementary specification for document-level configuration

## Migration Guide

### From Feature Policy to Permissions Policy

Feature Policy is being replaced by Permissions Policy. If you're implementing this today, consider:

1. **Use Permissions Policy** for new implementations
2. **Maintain Feature Policy** for existing code and backward compatibility
3. **Test** with both specifications during the transition period

### Common Feature Names

Feature Policy allows control over various browser capabilities:
- `accelerometer` - Device accelerometer access
- `ambient-light-sensor` - Ambient light sensor access
- `autoplay` - Autoplay of media files
- `camera` - Video camera access
- `encrypted-media` - Encrypted media playback
- `fullscreen` - Fullscreen API access
- `geolocation` - Geolocation API access
- `gyroscope` - Device gyroscope access
- `magnetometer` - Device magnetometer access
- `microphone` - Audio microphone access
- `midi` - MIDI API access
- `payment` - Payment Request API access
- `sync-xhr` - Synchronous XHR requests
- `usb` - USB API access
- `vr` - WebVR API access
- `xr-spatial-tracking` - WebXR spatial tracking

## Keywords

feature, security, header, allow, attribute, allow attribute, attribute allow, feature-policy, document.featurePolicy, document.policy

## Cross-References

- Chrome Implementation IDs: 5694225681219584, 5190687460950016

---

*Documentation generated from CanIUse Feature Policy data. Last updated based on available browser version support data.*
