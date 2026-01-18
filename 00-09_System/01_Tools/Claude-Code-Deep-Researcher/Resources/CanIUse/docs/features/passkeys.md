# Passkeys

## Overview

**Passkeys**, also known as Multi-device FIDO Credentials, provide users with an alternative to passwords that is much easier to use and far more secure. They represent a fundamental shift away from traditional password-based authentication toward a phishing-resistant, hardware-backed authentication method.

## Specification Status

- **Current Status**: Other (Emerging Standard)
- **Specification**: [FIDO Alliance - Multi-device FIDO Credentials](https://fidoalliance.org/multi-device-fido-credentials/)
- **Related Technology**: Based on [WebAuthn](/webauthn) standard

## Categories

- JavaScript API
- Security

## Use Cases & Benefits

### Primary Benefits

- **Enhanced Security**: Eliminates phishing vulnerabilities inherent to password authentication
- **Improved User Experience**: Simple biometric or device-based authentication replaces complex password requirements
- **Cross-Device Support**: Multi-device FIDO credentials sync across user devices seamlessly
- **Reduced Account Takeovers**: Hardware-backed credentials prevent unauthorized access
- **Compliance Ready**: Meets evolving security and compliance standards globally

### Ideal Use Cases

- **User Authentication**: Replace or supplement traditional password login
- **Account Recovery**: Secure alternative account verification mechanism
- **High-Security Applications**: Financial, healthcare, and government services
- **Consumer Services**: E-commerce, social media, and productivity platforms
- **Enterprise Security**: Corporate authentication and access control systems

## Browser Support

### Support Legend
- ✅ **Supported (y)**: Full passkey support available
- ⚠️ **Partial (u)**: Partial or partial rollout support
- ❌ **Not Supported (n)**: No passkey support

### Desktop Browsers

| Browser | First Support | Latest Versions | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 108 | 108+ | Fully supported from v108 onward |
| **Edge** | 108 | 108+ | Aligned with Chromium, supported from v108+ |
| **Firefox** | 122 | 122+ | Support added in v122, actively maintained |
| **Safari** | 16.1 | 16.1+ | macOS Safari support from 16.1 onward |
| **Opera** | 97 | 97+ | Supported from v97 onward |
| **Internet Explorer** | — | N/A | Not supported (EOL) |

### Mobile Browsers

| Browser | Platform | Support Status | Notes |
|---------|----------|---|---|
| **Safari** (iOS) | iOS | 16.0+ | Full support from iOS 16 onward |
| **Chrome** (Android) | Android | 108+ | Full support from Chrome 108+ |
| **Firefox** (Android) | Android | 144+ | Latest versions supported |
| **Samsung Internet** | Android | 21+ | Supported from v21 onward |
| **Opera Mobile** | Android | 80+ | Supported from v80 onward |
| **Opera Mini** | All | ❌ No | Not supported |
| **Android Browser** | Android | Limited | Varies by Android version |
| **UC Browser** | Android | Limited | Limited passkey support |
| **QQ Browser** | Android | ❌ No | Not supported |
| **Baidu Browser** | Android | ❌ No | Not supported |
| **KaiOS** | KaiOS | ❌ No | Not supported |
| **BlackBerry** | BlackBerry | ❌ No | Not supported (EOL) |

### Global Coverage

**Global Support**: ~89.68% of users worldwide have access to passkey-supporting browsers

## Current Adoption Timeline

### 2023-2024 Key Milestones

| Date | Event | Impact |
|------|-------|--------|
| **Early 2023** | Chrome 108 launch | Major milestone - Chromium family support |
| **Mid-2023** | Safari 16.1+ | Apple ecosystem support |
| **Late 2023** | Firefox 122 | Mozilla ecosystem support |
| **2024** | Galaxy S21+ support | Major Android flagship support |
| **Current** | ~90% user coverage | Mainstream adoption achieved |

## Implementation Considerations

### Device & OS Dependencies

Passkey functionality extends beyond browser support—device and operating system capabilities are critical:

- **macOS**: Full support on modern versions with Touch ID or external security keys
- **iOS**: Full support on iOS 16+ with Face ID and Touch ID
- **Android**: Support varies; flagship devices (Samsung Galaxy S21+) fully supported
- **Windows**: Windows 11 and select Windows 10 versions with Windows Hello
- **Linux**: Requires compatible FIDO2 authenticators via hardware security keys

### Fallback Authentication

Browsers without native passkey support can still authenticate at passkey-enabled login systems if they support [WebAuthn](/webauthn), allowing authentication through:
- USB security keys (FIDO2)
- NFC security keys
- Bluetooth authenticators

## Technical Requirements

### Browser API Requirements

- **WebAuthn API**: `navigator.credentials.create()` and `navigator.credentials.get()`
- **Conditional UI**: Optional automatic passkey suggestions in input fields
- **Resident Credentials**: Support for passkeys stored on user devices
- **Attestation**: Server-side verification of authenticator attestation

### Server-Side Implementation

- FIDO2 Server implementation (certificate validation)
- Credential registration and authentication endpoints
- Challenge/nonce management
- Supported authenticator attestation formats

## Notes

### Important Considerations

- **Device-Specific Support**: Passkey functionality depends on both browser support AND device/OS capabilities. For comprehensive device support information, see [passkeys.dev Device Support](https://passkeys.dev/device-support/).

- **WebAuthn Compatibility**: Browsers without native passkey support may still allow authentication at passkey logins through other types of security keys (USB, NFC, Bluetooth) as long as they support the [WebAuthn](/webauthn) standard.

- **Version-Specific Behavior**: While major versions show consistent support, minor versions may have behavioral differences. Always test in target environments.

## Resources & Further Reading

### Official Documentation

- [Passkeys at Apple Developer](https://developer.apple.com/passkeys/) - Apple's comprehensive passkeys documentation
- [Google Passkeys for Developers](https://developers.google.com/identity/passkeys) - Google's implementation guide
- [FIDO Alliance Passkeys Article](https://fidoalliance.org/passkeys/) - FIDO Alliance official resource

### Community & Support

- [Firefox Passkeys Support Discussion](https://bugzilla.mozilla.org/show_bug.cgi?id=1792433) - Mozilla's issue tracker
- [Passkeys.dev](https://passkeys.dev/) - Community resource with device support matrix
- [WebAuthn Specification](https://www.w3.org/TR/webauthn-2/) - W3C standard specification

## Related Standards

- [WebAuthn (Web Authentication API)](/webauthn) - Underlying API standard for passkeys and security keys
- [CTAP/CTAP2 (Client to Authenticator Protocol)](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html) - Protocol for client-authenticator communication
- [FIDO2](https://fidoalliance.org/fido2/) - Complete FIDO2 specification ecosystem

---

**Last Updated**: 2025
**Data Source**: CanIUse Browser Feature Matrix
