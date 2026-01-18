# Permissions Policy

## Overview

**Permissions Policy** is a security mechanism that allows developers to explicitly enable or disable various powerful browser features for a given site. It provides fine-grained control over which browser capabilities are available to your web application and embedded resources (like iframes).

Similar to [Document Policy](/document-policy), Permissions Policy helps mitigate security risks by limiting access to sensitive APIs and hardware features based on your application's actual needs.

## Description

Permissions Policy (formerly known as Feature Policy) enables developers to selectively activate or deactivate browser capabilities at the HTTP header level, iframe attribute level, and through JavaScript APIs. This provides a robust defense-in-depth security strategy by:

- **Preventing unauthorized feature access**: Restrict powerful APIs to only where they're needed
- **Protecting against third-party vulnerabilities**: Control what capabilities embedded content can access
- **Reducing attack surface**: Disable features your application doesn't use
- **Improving user privacy**: Give users control over sensitive capabilities

## Specification Status

- **Status**: Working Draft (WD)
- **Spec URL**: [https://w3c.github.io/webappsec-permissions-policy/](https://w3c.github.io/webappsec-permissions-policy/)
- **Standardization**: W3C Web Application Security Working Group

## Categories

- **JS API**: JavaScript APIs for querying and managing permissions
- **Security**: Security and privacy control mechanisms
- **Other**: General web platform features

## Features & Use Cases

### Key Benefits

1. **Security Enhancement**: Reduce exposure to browser APIs that could be exploited
2. **Third-Party Risk Management**: Control what embedded iframes and cross-origin resources can access
3. **User Privacy Protection**: Disable access to sensitive hardware features like camera, microphone, or location
4. **Compliance & Governance**: Meet regulatory requirements by limiting data collection capabilities
5. **Performance Optimization**: Disable expensive features you don't use
6. **Legacy Code Isolation**: Safely run untrusted third-party scripts with minimal permissions

### Common Use Cases

- Restrict camera and microphone access to specific embedded elements
- Prevent geolocation tracking by disabling the Geolocation API
- Disable payment request API except where needed
- Control access to accelerometer and gyroscope sensors
- Limit microphone and camera permissions in iframes from third parties
- Restrict USB and Serial APIs to secure contexts only
- Control access to full-screen capabilities

## Implementation Methods

Permissions Policy can be implemented in three ways:

### 1. HTTP Header

```http
Permissions-Policy: geolocation=(), microphone=(self), camera=(self "https://trusted.example.com")
```

### 2. iframe Attribute

```html
<iframe src="https://third-party.example.com" allow="geolocation 'none'; microphone 'self'"></iframe>
```

### 3. JavaScript API

```javascript
// Check if a feature is allowed
if (document.permissionsPolicy.allowsFeature('geolocation')) {
  // Feature is available
}

// Query allowed features for specific origins
const allowedFor = document.permissionsPolicy.allowsFeature('camera', 'https://example.com');
```

## Known Features

Permissions Policy can control access to many browser features including:

- `accelerometer` - Device motion sensors
- `ambient-light-sensor` - Light sensor access
- `autoplay` - Audio autoplay capability
- `camera` - Camera device access
- `document-domain` - Setting document.domain
- `fullscreen` - Full-screen requests
- `geolocation` - Location services
- `gyroscope` - Device rotation sensors
- `magnetometer` - Device compass access
- `microphone` - Audio input devices
- `payment` - Payment Request API
- `picture-in-picture` - Picture-in-Picture mode
- `usb` - USB device access
- `vr` - WebVR API
- `xr-spatial-tracking` - WebXR spatial tracking

For a complete and up-to-date list, see the [List of known features](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md).

## Browser Support

### Support Legend

- **Y** - Fully supported
- **A** - Partially supported (see notes)
- **D** - Supported with flag/disabled by default
- **N** - Not supported
- **#1, #2** - See notes below for implementation details

| Browser | Initial Support | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome** | 88 | Fully Adopted | Supported from Chrome 88+ |
| **Edge** | 88 | Fully Adopted | Chromium-based, supported from Edge 88+ |
| **Firefox** | Not Yet | Under Review | Implementation tracked in [Firefox bug 1531012](https://bugzilla.mozilla.org/show_bug.cgi?id=1531012) |
| **Safari** | Not Yet | Not Supported | Not yet implemented |
| **Opera** | 95 | Fully Adopted | Supported from Opera 95+ |
| **iOS Safari** | Not Yet | Not Supported | Not available on iOS |

### Desktop Browser Support

| Browser | Version | Support | Details |
|---------|---------|---------|---------|
| Chrome | 88+ | Full | Standard HTTP header, iframe allow attribute, document.permissionsPolicy API |
| Chromium | 88+ | Full | All features fully supported |
| Edge | 88+ | Full | Chromium-based implementation |
| Opera | 95+ | Full | Standard implementation |
| Firefox | Not Available | Partial* | Feature Policy predecessor partially supported |
| Safari | Not Available | Partial* | Feature Policy predecessor partially supported |

*Firefox and Safari support the older [Feature Policy](/feature-policy) specification, which is the predecessor to Permissions Policy.

### Mobile Browser Support

| Browser | Version | Support | Details |
|---------|---------|---------|---------|
| Chrome for Android | 88+ | Full | Standard implementation on Android |
| Opera Mobile | 80+ | Full | Standard implementation |
| Samsung Internet | Not Available | Partial* | Feature Policy predecessor partially supported |
| Firefox for Android | Not Available | Partial* | Feature Policy predecessor partially supported |
| iOS Safari | Not Available | Partial* | Feature Policy predecessor partially supported |

### Implementation Status Notes

1. **#1 - Chromium Header Only**: Chromium-based browsers (Chrome, Edge, Opera) currently support the HTTP header format, iframe allow attribute, and JavaScript API.

2. **#2 - Feature Policy Support**: Firefox, Safari, and other browsers that don't yet support Permissions Policy have partial support for [Feature Policy](/feature-policy), the predecessor specification. This provides similar functionality but uses different syntax and API names.

## Global Browser Support Summary

### Overall Support
- **Fully Supported**: ~76.73% of global users (primarily Chromium-based browsers)
- **Partial Support**: Additional users through Feature Policy predecessor
- **No Support**: Older versions and Firefox/Safari browsers

### Browser Adoption Timeline

| Year | Event |
|------|-------|
| 2020 | Chrome 88 - Initial support launched |
| 2021 | Edge 88+ - Full support in Chromium-based browsers |
| 2022 | Opera 95+ - Reaches feature parity with Chrome |
| 2024+ | Waiting for Firefox and Safari implementation |

## Implementation Notes

### Standard Support Coverage

Standard support includes:
1. **HTTP `Permissions-Policy` Header**: Set policies at the server level
2. **iframe `allow` Attribute**: Control permissions for embedded content
3. **`document.permissionsPolicy` JavaScript API**: Query and test feature availability

### Browser-Specific Considerations

#### Chromium Browsers (Chrome, Edge, Opera)
- Full support for all three implementation methods
- Extensive feature coverage
- Regular updates to supported features
- Recommended for modern implementations

#### Firefox
- Not yet implemented for Permissions Policy
- Partial support for predecessor Feature Policy
- Track implementation progress in [Firefox bug 1531012](https://bugzilla.mozilla.org/show_bug.cgi?id=1531012)
- Consider fallback strategies for Firefox users

#### Safari
- Not yet implemented for Permissions Policy
- Partial support for predecessor Feature Policy
- No public timeline for Permissions Policy support
- Use feature detection and progressive enhancement

### Migration from Feature Policy

For applications currently using [Feature Policy](/feature-policy):

1. **Syntax Changes**: Update HTTP header and iframe attributes to new names
2. **API Changes**: Migrate from `document.featurePolicy` to `document.permissionsPolicy`
3. **Feature Names**: Some features have been renamed between the specifications
4. **Backward Compatibility**: Feature Policy will continue to work but is deprecated

## Usage Recommendations

### When to Use Permissions Policy

1. **Security-First Applications**: When security is paramount
2. **Third-Party Content**: When embedding untrusted content (ads, widgets, etc.)
3. **Privacy-Conscious Users**: When your audience values privacy controls
4. **Enterprise Deployments**: For governance and compliance requirements
5. **Multi-Tenant Platforms**: When hosting multiple customer applications

### Best Practices

1. **Default Deny**: Use `none` or empty allowlist by default
2. **Principle of Least Privilege**: Only enable features actually needed
3. **Transparent to Users**: Document your permissions policy
4. **Test Thoroughly**: Ensure legitimate features still work with restrictions
5. **Monitor Usage**: Track feature usage to adjust policies over time
6. **Plan for Evolution**: Design policies that can accommodate new features

### Fallback Strategy

For broader browser support:

```javascript
// Feature detection approach
function canUseGeolocation() {
  if (document.permissionsPolicy?.allowsFeature('geolocation')) {
    return true;
  }
  // Fallback: attempt to use the API directly
  return navigator.geolocation !== undefined;
}
```

## References & Resources

### Official Documentation

- [W3C Permissions Policy Specification](https://w3c.github.io/webappsec-permissions-policy/)
- [Permissions Policy Explainer](https://github.com/w3c/webappsec-feature-policy/blob/main/permissions-policy-explainer.md) - Comprehensive overview and motivation
- [List of Known Features](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md) - Complete feature registry

### Implementation Tracking

- [Firefox Implementation Tracker](https://bugzilla.mozilla.org/show_bug.cgi?id=1531012) - Follow Firefox progress

### Related Technologies

- [Feature Policy](/feature-policy) - Predecessor specification
- [Document Policy](/document-policy) - Complementary security policy
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) - Related security mechanism

## See Also

- [Web Security Policies Overview](https://developer.mozilla.org/en-US/docs/Web/Security)
- [iframe Security](https://developer.mozilla.org/en-US/docs/Web/Security/IFrame_Sandbox)
- [Browser Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)

---

*Last Updated: December 2024*

*For the latest support information, visit [Can I Use - Permissions Policy](https://caniuse.com/permissions-policy)*
