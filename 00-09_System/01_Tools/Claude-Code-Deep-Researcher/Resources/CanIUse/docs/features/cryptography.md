# Web Cryptography API

## Overview

The **Web Cryptography API** provides a standardized JavaScript interface for performing basic cryptographic operations in web applications. This API enables developers to perform secure operations like generating random values, hashing data, encrypting/decrypting content, signing data, and managing cryptographic keys directly from the browser without relying on external server-side libraries.

## Specification

- **Status**: ![Recommendation](https://img.shields.io/badge/status-Recommendation-brightgreen)
- **Specification URL**: [W3C Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)
- **MDN Documentation**: [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## Categories

- ![JavaScript API](https://img.shields.io/badge/category-JS%20API-blue)
- ![Security](https://img.shields.io/badge/category-Security-red)

## Usage Statistics

- **Full Support**: 93.2%
- **Partial Support**: 0.33%
- **No Support**: 6.47%

## Key Features & Benefits

### Cryptographic Operations

The Web Cryptography API enables the following operations through the `crypto.subtle` interface:

- **Hashing**: Compute secure hash digests (SHA-1, SHA-256, SHA-384, SHA-512)
- **Encryption & Decryption**: Symmetric key operations (AES-GCM, AES-CBC, AES-KW)
- **Digital Signatures**: Sign and verify data with public key cryptography (RSA, ECDSA, HMAC)
- **Key Generation**: Generate cryptographic keys for various algorithms
- **Key Derivation**: Derive keys from passwords or other material (PBKDF2, HKDF)
- **Random Value Generation**: Cryptographically secure random number generation via `crypto.getRandomValues()`

### Use Cases

1. **Client-Side Data Protection**
   - Encrypt sensitive data before transmission to server
   - Secure local data storage in IndexedDB or localStorage
   - Implement end-to-end encryption scenarios

2. **Authentication & Digital Signatures**
   - Sign API requests for integrity verification
   - Implement public key authentication mechanisms
   - Verify digital signatures from servers

3. **Key Management**
   - Generate and manage cryptographic keys in the browser
   - Implement client-side key derivation from passwords
   - Support hardware security key integration

4. **Compliance & Security**
   - Reduce reliance on server-side encryption
   - Support GDPR and data protection requirements
   - Implement zero-knowledge proof patterns

### Benefits

- **Native Browser Support**: No need for JavaScript polyfills or external libraries
- **Performance**: Leverages hardware acceleration and OS-level cryptography
- **Security**: Uses battle-tested cryptographic algorithms
- **Standards Compliance**: Implements W3C standardized cryptography API
- **Flexibility**: Supports multiple algorithms and key management patterns

## Browser Support Summary

### Desktop Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|----------------|
| ![Chrome](https://img.shields.io/badge/Chrome-37+-green) | Chrome 37 (2014) | ✅ Full Support |
| ![Firefox](https://img.shields.io/badge/Firefox-34+-green) | Firefox 34 (2014) | ✅ Full Support |
| ![Safari](https://img.shields.io/badge/Safari-11+-green) | Safari 11 (2017) | ✅ Full Support |
| ![Edge](https://img.shields.io/badge/Edge-79+-green) | Edge 79 (2020) | ✅ Full Support |
| ![Opera](https://img.shields.io/badge/Opera-24+-green) | Opera 24 (2014) | ✅ Full Support |
| ![Internet Explorer](https://img.shields.io/badge/IE-11-orange) | Never (IE 11: Partial) | ⚠️ Partial/Unsupported |

### Mobile Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|----------------|
| ![iOS Safari](https://img.shields.io/badge/iOS%20Safari-11+-green) | iOS Safari 11 (2017) | ✅ Full Support |
| ![Android Chrome](https://img.shields.io/badge/Chrome%20Android-142+-green) | Chrome Android 37+ | ✅ Full Support |
| ![Firefox Android](https://img.shields.io/badge/Firefox%20Android-144+-green) | Firefox Android 34+ | ✅ Full Support |
| ![Samsung Internet](https://img.shields.io/badge/Samsung%20Internet-4+-green) | Samsung Internet 4 (2015) | ✅ Full Support |
| ![Opera Mobile](https://img.shields.io/badge/Opera%20Mobile-80+-green) | Opera Mobile 24+ | ✅ Full Support |
| ![Opera Mini](https://img.shields.io/badge/Opera%20Mini-All-red) | Never | ❌ Not Supported |

### Legacy Browser Support

| Browser | Support Status |
|---------|----------------|
| IE 6-10 | ❌ No Support |
| IE 11 | ⚠️ Partial (older spec version) |
| Chrome 4-36 | ⚠️ Partial |
| Firefox 2-33 | ⚠️ Partial |
| Safari 3.1-7 | ⚠️ Partial |
| Opera 9-23 | ⚠️ Partial |

## Detailed Support Matrix

### Full Support (y)
- Chrome 37+
- Firefox 34+
- Safari 11+ (without prefix)
- Edge 79+
- Opera 24+
- iOS Safari 11+
- Android Chrome 37+
- Samsung Internet 4+
- UC Browser 15.5+

### Partial Support (p)
- Chrome 4-36: Early draft implementation
- Firefox 2-33: Early draft implementation
- Safari 3.1-7: Early draft implementation
- IE 6-10: Limited or draft implementations
- Opera 9-23: Early draft implementation

### With Prefix/Notes (x)
- Safari 7.1-10: Used `crypto.webkitSubtle` prefix
- iOS Safari 8-10.3: Used `crypto.webkitSubtle` prefix
- IE 11 (#1): Based on older specification version

### Experimental/Limited
- Opera Mini: ❌ No support (all versions)
- Blackberry Browser 7-10: Partial support

## Important Notes & Known Issues

### General Notes

**Important**: Many browsers support the `crypto.getRandomValues()` method, but not actual cryptography functionality under `crypto.subtle`. Always check for feature detection before using cryptographic operations.

### Browser-Specific Notes

#### Note #1: Internet Explorer 11
Support in IE 11 is based on an older version of the specification. Code written for modern browsers may not be fully compatible with IE 11's implementation. Use feature detection and polyfills when IE 11 support is required.

#### Note #2: Safari Webkit Prefix (Pre-11.0)
Support in Safari before version 11 was using the `crypto.webkitSubtle` prefix. For older Safari versions, access the API via:
```javascript
// For Safari 7.1-10
const subtle = crypto.webkitSubtle || crypto.subtle;
```

#### Note #3: Edge Service Worker Limitation (12-18)
In Edge 12-18, Web Crypto was not supported in Web Workers and Service Workers. This limitation was resolved in Edge 79+ (Chromium-based).

## Implementation Considerations

### Feature Detection

```javascript
// Check for Web Crypto API availability
if (typeof crypto !== 'undefined' &&
    (crypto.subtle || crypto.webkitSubtle)) {
  // Web Crypto is available
  const subtle = crypto.subtle || crypto.webkitSubtle;
}
```

### Polyfill Recommendations

For legacy browser support, several third-party solutions are available:
- [webcrypto-shim](https://github.com/vibornoff/webcrypto-shim): Polyfill for IE11 and Safari
- [SJCL](https://bitwiseshiftleft.github.io/sjcl/): Cross-browser cryptography library
- [Netflix NfWebCrypto](https://github.com/Netflix/NfWebCrypto): Polyfill with partial support

### Best Practices

1. **Always use feature detection** - Don't assume availability
2. **Handle prefix variations** - Support older Safari versions with `webkitSubtle`
3. **Use HTTPS only** - Web Crypto is restricted to secure contexts
4. **Plan for fallbacks** - Have fallback strategies for unsupported browsers
5. **Monitor algorithm support** - Different browsers may support different algorithms

## Common Algorithms Supported

### Hashing
- SHA-1 (deprecated for new code)
- SHA-256
- SHA-384
- SHA-512

### Symmetric Encryption
- AES-GCM
- AES-CBC
- AES-KW

### Asymmetric Cryptography
- RSA-PSS (signing)
- RSA-OAEP (encryption)
- ECDSA
- ECDH

### Key Derivation
- PBKDF2
- HKDF

### Key Wrapping
- AES-KW

## Related Resources

### Official Documentation & Specifications
- [W3C Web Cryptography API Specification](https://www.w3.org/TR/WebCryptoAPI/)
- [MDN Web Docs - Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### Educational Resources
- [The History and Status of Web Crypto API](https://www.slideshare.net/Channy/the-history-and-status-of-web-crypto-api) - SlideShare presentation on Web Crypto API evolution

### Third-Party Libraries & Polyfills
- [Microsoft Research JavaScript Cryptography Library](https://github.com/microsoft/MSR-JavaScript-Crypto) - Research-backed cryptography implementation
- [SJCL (Stanford JavaScript Crypto Library)](https://bitwiseshiftleft.github.io/sjcl/) - Cross-browser cryptography library
- [Netflix NfWebCrypto](https://github.com/Netflix/NfWebCrypto) - Polyfill by Netflix with partial support
- [PKI.js](https://github.com/GlobalSign/PKI.js) - Crypto library for Public Key Infrastructure applications
- [webcrypto-shim](https://github.com/vibornoff/webcrypto-shim) - Polyfill for IE11 and Safari with bugfixes and workarounds

### Testing & Examples
- [Web Crypto Examples Test Suite](https://diafygi.github.io/webcrypto-examples/) - Comprehensive test suite for various algorithms and methods

## Compatibility Recommendations

### For Modern Applications (2017+)
- Safely use Web Crypto API without polyfills
- Target Chrome 37+, Firefox 34+, Safari 11+, Edge 79+
- Mobile support is widespread across all major browsers

### For Enterprise Applications
- Consider IE 11 polyfill if IE support is required
- Use feature detection and graceful degradation
- Test across target browser versions

### For Legacy Support
- Implement server-side cryptographic operations
- Use JavaScript polyfills from trusted sources
- Consider browser requirements vs. security benefits

## Summary

The Web Cryptography API has achieved excellent browser support, with 93.2% of users having access to full functionality. It's now the recommended standard for client-side cryptographic operations in modern web applications. Legacy browser support requires careful consideration of polyfills and fallback mechanisms, but for contemporary browsers, the API is production-ready and widely supported.
