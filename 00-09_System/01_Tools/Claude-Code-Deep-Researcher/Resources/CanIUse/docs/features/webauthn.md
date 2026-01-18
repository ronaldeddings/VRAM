# Web Authentication API (WebAuthn)

## Overview

The **Web Authentication API** is an extension of the Credential Management API that enables strong authentication with public key cryptography, enabling passwordless authentication and/or secure second-factor authentication without SMS texts.

## Specification

- **Spec Status**: Recommendation (REC)
- **W3C Specification**: https://www.w3.org/TR/webauthn/
- **Approval**: The WebAuthn specification has been formally recommended by the W3C

## Category

**Security**

## Use Cases & Benefits

### Primary Use Cases

- **Passwordless Authentication**: Replace traditional passwords with cryptographic key-based authentication
- **Multi-Factor Authentication (MFA)**: Implement secure second-factor authentication using hardware or platform authenticators
- **Enhanced Security**: Leverage biometric or PIN-based verification for access control
- **Phishing Prevention**: Eliminate vulnerability to phishing attacks through cryptographic origin binding

### Key Benefits

1. **Strong Cryptographic Security**: Uses public key cryptography instead of shared secrets
2. **Phishing-Resistant**: Authentication is origin-bound, preventing attacks on similar-looking domains
3. **No Password Management**: Eliminates password database breaches and weak password issues
4. **User Convenience**: Supports biometric and platform authenticators for frictionless authentication
5. **Regulatory Compliance**: Meets strong authentication requirements in various compliance frameworks
6. **Hardware Security**: Supports external security keys (FIDO2 devices) and platform authenticators

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|---|---|
| **Chrome** | 67 | ✅ Full Support (v67+) | Comprehensive support across all versions 67 and later |
| **Edge** | 18 | ✅ Full Support (v18+) | Full support from Edge 18 (Chromium-based) |
| **Firefox** | 60 | 🟠 Partial Support (v60+) | Supported with limitations (#4, #6); see notes below |
| **Safari** | 13 | ✅ Full Support (v13+) | Full support starting with Safari 13 |
| **Opera** | 54 | ✅ Full Support (v54+) | Chromium-based, full support from v54 onwards |
| **Internet Explorer** | N/A | ❌ Not Supported | No support in any version |

### Mobile & Tablet Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|---|---|
| **iOS Safari** | 14.5 | ✅ Full Support (v14.5+) | Partial support from v13.3-14.4; full from v14.5 |
| **Chrome (Android)** | 142+ | ✅ Full Support | Full support in v142+ |
| **Firefox (Android)** | 144 | 🟠 Partial Support (v144) | Partial support in v144; see notes |
| **Opera Mobile** | 80 | ✅ Full Support (v80+) | Chromium-based, full support from v80 |
| **Samsung Internet** | 17 | ✅ Full Support (v17+) | Full support from v17 onwards |
| **UC Browser** | 15.5 | ✅ Full Support | Supported in v15.5+ |
| **Opera Mini** | N/A | ❌ Not Supported | No support in any version |
| **Baidu Browser** | 13.52 | ✅ Full Support | Supported in v13.52+ |
| **QQ Browser** | 14.9 | ✅ Full Support | Supported in v14.9+ |
| **KaiOS** | 3.0-3.1 | ✅ Full Support | Full support from v3.0-3.1 |
| **Android Browser** | 142+ | ✅ Full Support | Supported in v142+ |
| **BlackBerry** | N/A | ❌ Not Supported | No support in any version |
| **IE Mobile** | N/A | ❌ Not Supported | No support in any version |

## Support Legend

- ✅ **Full Support (`y`)**: Complete implementation of WebAuthn API
- 🟠 **Partial Support (`a`)**: Implementation with limitations or flags required
- ⏳ **Development (`d x`)**: Available via experimental features or flags
- ❌ **Not Supported (`n`)**: Feature not implemented

## Detailed Browser Notes

### Firefox
- **Versions 60-113 (Partial)**: Supports FIDO2 devices but with limitations
  - Issue #4: Partial support refers to FIDO2 devices not working in all operating systems if a PIN is set
  - Issue #6: Partial support refers to TouchID not being supported
- **Versions 114+ (Partial)**: TouchID not supported (Issue #6 only)

### Safari
- **Version 12.1**: Available via Experimental Features menu (Development mode `d #2`)
  - Currently supports USB-based CTAP & CTAP2 HID devices
- **Version 13+**: Full support available

### iOS Safari
- **Version 13.2**: Available in Experimental Features (Development mode `d #3`)
- **Version 13.3-13.7**: Partial support (`a`) with limitations (#4, #5)
  - Issue #5: Experimental feature not yet enabled in WKWebView-based browsers including Chrome for iOS
- **Version 14.0-14.4**: Partial support (`a`) with issue #5 only
- **Version 14.5+**: Full support

### Edge (Legacy)
- **Version 13-17**: Available via flags (Development mode `d x #1`)
  - Earlier draft syntax used in Edge 13
  - Implementation prefixed and based on FIDO 2.0 Web APIs as of Edge 14
- **Version 18+**: Full support

### Android Firefox
- **Version 144**: Partial support
  - Issue #7: Does not support direct attestations

## Implementation Notes

### Authenticator Types Supported

1. **Platform Authenticators**: Built-in device authenticators (Windows Hello, Touch ID, Face ID)
2. **Cross-platform Authenticators**: External security keys (FIDO2 USB keys, NFC keys)
3. **Biometric Authenticators**: Fingerprint, facial recognition where available

### Attestation Limitations

- Some implementations have limited attestation support
- Android Firefox (v144) does not support direct attestations
- Platform-specific limitations may apply to PIN-protected devices

### Operating System Considerations

- FIDO2 device support varies by operating system
- Some PIN-protected devices may not work on all platforms
- Platform authenticators have platform-specific availability

## Global Support Statistics

- **Full Support**: 90.48% of users
- **Partial Support**: 2.15% of users
- **Combined Coverage**: 92.63% of tracked browser usage

## Recommended Fallback Strategy

For maximum compatibility:

1. **Primary**: Use WebAuthn for modern browsers (2019+)
2. **Secondary**: Provide traditional authentication as fallback
3. **Progressive Enhancement**: Implement WebAuthn alongside existing authentication methods

## Related Resources

- [Web Authentication API on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [Web Authentication and Windows Hello (Microsoft Edge)](https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/device/web-authentication)
- [WebAuthn Guide](https://webauthn.guide)
- [W3C WebAuthn Specification](https://www.w3.org/TR/webauthn/)

## Implementation Considerations

### When to Use WebAuthn

- **High-security applications** requiring passwordless or MFA
- **Enterprise environments** with security key infrastructure
- **Consumer applications** targeting modern device support
- **Regulatory compliance** scenarios requiring strong authentication

### When to Provide Fallbacks

- **Legacy browser support** (IE, older Safari/Firefox)
- **Cross-platform compatibility** with iOS Chrome or Firefox on Android
- **User device limitations** (devices without biometric support)
- **Gradual adoption** alongside existing authentication methods

### Platform Considerations

- Ensure origin is served over HTTPS (required by specification)
- Test across target platforms and authenticator types
- Account for attestation limitations on some platforms
- Provide clear user guidance for device-specific limitations

## Browser Support Summary

| Browser Family | Minimum Version | Status |
|---|---|---|
| Chrome/Chromium | 67 | ✅ Full |
| Safari | 13 | ✅ Full |
| Firefox | 60 | 🟠 Partial |
| Edge | 18 | ✅ Full |
| Opera | 54 | ✅ Full |
| IE | Never | ❌ Not Supported |

