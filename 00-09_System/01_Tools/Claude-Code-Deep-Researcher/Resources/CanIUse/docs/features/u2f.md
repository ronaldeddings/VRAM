# FIDO U2F API Documentation

## Overview

The FIDO U2F (Universal Second Factor) API is a JavaScript interface that enables web applications to interact with U2F security devices for two-factor authentication (2FA). It allows users to securely log into websites using a USB dongle or other U2F-compatible hardware device, providing an additional layer of security beyond traditional passwords.

## Description

The U2F API provides secure authentication through hardware security keys, allowing users to authenticate using dedicated physical devices rather than relying solely on passwords or SMS codes. This approach significantly reduces the risk of phishing attacks and credential theft.

**Key Features:**
- Hardware-based authentication using U2F security devices
- JavaScript API for web integration
- Protection against phishing and credential theft
- Two-factor authentication support
- Works with various U2F devices (USB keys, NFC, Bluetooth)

## Current Status

**Specification Status:** Unofficial (unoff)

The U2F API is **currently being deprecated and phased out** in favor of the modern [WebAuthn](https://caniuse.com/webauthn) standard. Developers should migrate to WebAuthn for new implementations.

**Timeline:**
- Chrome (Versions 41-97): Supported via CryptoTokenExtension
- Chrome (Versions 98-105): Deprecated (with warning)
- Chrome (Version 106+): Removed
- Firefox (Versions 67-111): Supported
- Firefox (Versions 112+): Deprecated
- Edge (Versions 79-105): Supported
- Edge (Versions 106+): Removed

## Categories

- **JavaScript API** - Web-based API for authentication
- **Security** - Authentication and security feature

## Benefits and Use Cases

### Primary Use Cases

1. **Enhanced Account Security**
   - Multi-factor authentication for user accounts
   - Reduces risk of account takeover
   - Protection against phishing attacks

2. **Enterprise Authentication**
   - Corporate security key deployment
   - Hardware-based credential management
   - Compliance with security standards

3. **Financial Services**
   - Secure banking login
   - Payment authorization
   - Fraud prevention

4. **Government and High-Security Applications**
   - ID verification
   - Access control
   - Cryptographic authentication

### Key Benefits

- **Phishing Resistant:** Hardware keys cannot be compromised remotely
- **User-Friendly:** Simple one-touch authentication
- **Device Independence:** Works with multiple U2F-compatible devices
- **Open Standard:** Based on FIDO alliance specifications
- **Backward Compatible:** Can be used alongside other 2FA methods

## Browser Support

### Support Summary

| Browser | Support Status | Notes |
|---------|---|---|
| **Chrome** | 41-97 | Via CryptoTokenExtension (Versions 38-40 require extension) |
| **Chrome** | 98-105 | Deprecated with warning |
| **Chrome** | 106+ | Removed |
| **Firefox** | 67-111 | Supported |
| **Firefox** | 112+ | Deprecated |
| **Safari** | 13+ | Supported |
| **Edge** | 79-105 | Via internal CryptoTokenExtension |
| **Edge** | 106+ | Removed |
| **Opera** | 40, 42-122 | Supported via internal CryptoTokenExtension |
| **iOS Safari** | 13.3+ | Supported |
| **Android Firefox** | 144+ | Supported |
| **Internet Explorer** | None | No support across all versions |
| **Opera Mini** | None | No support |
| **Samsung Internet** | None | No support |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Earliest Support | Latest Support | Status |
|---------|---|---|---|
| Chrome | v41 | v105 | Removed in v106 |
| Chrome Extension | v38 | v40 | Required for early versions |
| Firefox | v67 | v111 | Deprecated v112+ |
| Safari | v13 | v18.6+ | Fully Supported |
| Edge | v79 | v105 | Removed in v106 |
| Opera | v40, v42 | v122 | Fully Supported |

#### Mobile Browsers

| Browser | Support | Notes |
|---------|---|---|
| iOS Safari | v13.3+ | Full support on compatible devices |
| Android Firefox | v144+ | Full support |
| Samsung Internet | None | No support across all versions |
| Opera Mobile | None | No support |
| Android Browser | None | No support (up to v142) |

## Implementation Notes

### Important Considerations

1. **Deprecation Status**
   - The U2F API is being decommissioned by major browser vendors
   - Google Chrome removed support starting with version 106
   - Firefox is deprecating the API (versions 112+)
   - **New implementations should use WebAuthn instead**

2. **Browser-Specific Implementation Details**

   **Chrome (v41-97):**
   - Supported via the internal `CryptoTokenExtension`
   - Extension handles low-level U2F protocol communication
   - Higher reliability but browser-dependent

   **Chrome (v38-40):**
   - Requires the "FIDO U2F (Universal 2nd Factor)" Chrome extension
   - Must be installed from Chrome Web Store
   - Extension ID: `pfboblefjcgdjicmnffhdgionmgcdnn`

   **Firefox (v67-111):**
   - Native support via `security.webauth.u2f` flag
   - Requires security preferences configuration
   - Can be enabled in `about:config`

   **Safari (v13+) & iOS (v13.3+):**
   - Full native support
   - Works with MFi-certified security devices
   - Seamless integration with system security

3. **Hardware Device Support**
   - USB HID devices
   - NFC-enabled devices
   - Bluetooth-enabled devices
   - Compatible with FIDO U2F certified hardware

### Migration Path

For developers currently using U2F API:

```javascript
// Old U2F API (Deprecated)
u2f.register(...)

// New WebAuthn API (Recommended)
navigator.credentials.create(...)
```

Migrate to WebAuthn for:
- Better browser support
- Modern cryptographic standards
- Long-term platform support
- Enhanced security features

## Technical Specifications

### Spec Link
- **Official Specification:** [FIDO U2F JavaScript API v1.0 with NFC/BT Amendment](https://fidoalliance.org/specs/fido-u2f-v1.0-nfc-bt-amendment-20150514/fido-u2f-javascript-api.html)

### API Methods

The U2F API provides two main methods:

1. **Registration (`u2f.register`)**
   - Registers a new U2F device
   - Called during account setup or 2FA enrollment
   - Returns device registration data

2. **Authentication (`u2f.sign`)**
   - Authenticates using enrolled U2F device
   - Called during login
   - Cryptographically signs the challenge

## Related Features

- **WebAuthn** - Modern replacement for U2F API
  - Broader device support
  - Better security standards
  - Active development and standardization

- **Web Authentication** - Related standard for FIDO2/U2F

## References and Resources

### Official Links

1. [FIDO Alliance - U2F Specifications](https://fidoalliance.org/specs/fido-u2f-v1.0-nfc-bt-amendment-20150514/fido-u2f-javascript-api.html)

2. [Google Security Blog: Strengthening 2-Step Verification with Security Keys](https://security.googleblog.com/2014/10/strengthening-2-step-verification-with.html)

3. [Chrome Platform Status: U2F API Removal](https://chromestatus.com/feature/5759004926017536)
   - Official Chrome deprecation and removal timeline

4. [Chromium Intent to Deprecate and Remove: U2F API](https://groups.google.com/a/chromium.org/g/blink-dev/c/xHC3AtU_65A/m/yg20tsVFBAAJ)
   - Technical rationale and migration guidance

5. [Yubico Blog: Google Chrome U2F API Decommission](https://www.yubico.com/blog/google-chrome-u2f-api-decommission-what-the-change-means-for-your-users-and-how-to-prepare/)
   - Industry perspective and migration recommendations

### Bug Reports

- **Mozilla Firefox Bug:** [Issue 1065729](https://bugzilla.mozilla.org/show_bug.cgi?id=1065729) - U2F support tracking
- **Mozilla Firefox Bug:** [Issue 1737205](https://bugzilla.mozilla.org/show_bug.cgi?id=1737205) - U2F API removal planning

## Usage Statistics

- **Support Percentage:** 11.55% of users have browsers with U2F support
- **Partial Support:** 0% (no browsers with partial/alternative support)

## Migration Guide

### For Existing Implementations

If you're currently using U2F API:

1. **Assess Current Usage**
   - Identify all U2F API calls in your codebase
   - Check browser support requirements
   - Evaluate user device compatibility

2. **Transition Strategy**
   - Implement WebAuthn alongside existing U2F
   - Provide fallback for users on older browsers
   - Plan deprecation timeline

3. **WebAuthn Implementation**
   - Use `navigator.credentials.create()` for registration
   - Use `navigator.credentials.get()` for authentication
   - Support multiple authenticator types

4. **Testing**
   - Test with modern browser versions
   - Verify on target devices
   - Implement graceful degradation

## Summary

The FIDO U2F API represents an important step in web security by enabling hardware-based authentication. However, it is now superseded by the more comprehensive WebAuthn standard. While U2F devices remain useful for authentication, developers should prioritize migrating to WebAuthn for new projects to ensure long-term browser support and access to enhanced security features.

**Key Takeaway:** U2F API is deprecated and being removed. Use WebAuthn for new implementations.
