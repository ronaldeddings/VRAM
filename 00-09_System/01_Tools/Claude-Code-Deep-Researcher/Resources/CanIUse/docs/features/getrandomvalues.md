# crypto.getRandomValues()

## Overview

`crypto.getRandomValues()` is a method that provides cryptographically secure random value generation in web applications. It is part of the Web Crypto API and is essential for security-sensitive operations requiring unpredictable random data.

## Description

This API method generates cryptographically random values suitable for security-critical operations such as generating tokens, cryptographic keys, salts, and nonces. Unlike `Math.random()`, which produces pseudo-random numbers unsuitable for security purposes, `crypto.getRandomValues()` uses the underlying operating system's entropy source to produce genuinely random data.

## Specification Status

- **Status**: Recommendation (REC)
- **Specification**: [W3C Web Crypto API - getRandomValues](https://www.w3.org/TR/WebCryptoAPI/#Crypto-method-getRandomValues)

## Categories

- JavaScript API
- Security

## Use Cases & Benefits

### Primary Use Cases

1. **Security Token Generation**
   - Creating authentication tokens
   - Generating session IDs
   - Producing CSRF tokens

2. **Cryptographic Operations**
   - Generating initialization vectors (IVs)
   - Creating random salts for password hashing
   - Producing nonces for cryptographic protocols

3. **Secure Random Values**
   - Lottery/raffle number generation with security requirements
   - Random ID generation for sensitive applications
   - Generating cryptographic key material

### Key Benefits

- **Cryptographically Secure**: Uses OS-level entropy sources instead of pseudo-random algorithms
- **Performance**: Fast generation of random values directly in the browser
- **No External Dependencies**: Built-in to modern browsers, no library needed
- **Standards-Based**: Part of the official W3C Web Crypto API specification
- **Wide Support**: Available across all major browsers and platforms

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| **Chrome** | 11+ | Full support (v4-146+) |
| **Firefox** | 21+ | Full support (v21-148+) |
| **Safari** | 6.1+ | Full support (v6.1+) |
| **Edge** | 12+ | Full support (v12-143+) |
| **Opera** | 15+ | Full support (v15+) |
| **Internet Explorer** | 11* | Partial support (prefixed as `x`) |

*IE 11 support is partial/prefixed

### Mobile & Tablet Browsers

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| **iOS Safari** | 7.0-7.1+ | Full support |
| **Android Browser** | 4.4+ | Full support |
| **Chrome Mobile** | v142+ | Full support |
| **Firefox Mobile** | v144+ | Full support |
| **Samsung Internet** | 4+ | Full support |
| **Opera Mobile** | 80+ | Full support |
| **Opera Mini** | — | Not supported |
| **UC Browser** | 15.5+ | Full support |
| **Android UC** | — | Full support |
| **Baidu Browser** | 13.52+ | Full support |
| **QQ Browser** | 14.9+ | Full support |
| **Blackberry Browser** | 10+ | Full support |
| **KaiOS** | 2.5+ | Full support |

## Implementation Notes

### Basic Usage

```javascript
// Generate random bytes
const array = new Uint8Array(16);
crypto.getRandomValues(array);
// array now contains 16 random bytes

// Generate random integers
const values = new Uint32Array(10);
crypto.getRandomValues(values);
// values now contains 10 random 32-bit unsigned integers
```

### Important Considerations

1. **Supported TypedArray Types**
   - `Int8Array`
   - `Uint8Array`
   - `Uint8ClampedArray`
   - `Int16Array`
   - `Uint16Array`
   - `Int32Array`
   - `Uint32Array`
   - `BigInt64Array`
   - `BigUint64Array`

2. **Security Context**
   - Available in secure contexts (HTTPS)
   - Not available in insecure contexts (HTTP) except for localhost
   - Requires proper HTTPS setup in production

3. **Performance**
   - Synchronous operation
   - No external network calls
   - Suitable for high-frequency random value generation

4. **Maximum Array Length**
   - Limited to 65,536 bytes per call
   - Larger amounts require multiple calls

## Global Support

- **Usage Percentage**: 93.54% of global web traffic supports this feature
- **Fallback Required**: No fallback for older browsers - use detection or polyfills

## Related Resources

- [MDN Web Docs - crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues)
- [W3C Web Crypto API Specification](https://www.w3.org/TR/WebCryptoAPI/)
- [Web Crypto API MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## Support Summary

The `crypto.getRandomValues()` API has achieved excellent browser support across modern platforms with 93.54% of global traffic able to use this feature. While Internet Explorer offers only partial support, all modern browsers including Chrome (v11+), Firefox (v21+), Safari (v6.1+), and Edge (v12+) provide full support. For mobile platforms, support is comprehensive across iOS Safari, Android, and major mobile browsers.

---

*Last Updated: December 2025*
*Data Source: CanIUse*
