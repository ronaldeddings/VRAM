# HTTP Public Key Pinning

## Overview

**HTTP Public Key Pinning (HPKP)** is a security feature that allows websites to declare that an HTTPS certificate should only be treated as valid if the public key is contained in a specified list. This mechanism was designed to prevent Man-in-the-Middle (MITM) attacks that exploit valid certificates issued by compromised Certificate Authorities.

## Feature Details

### Title
HTTP Public Key Pinning

### Description
Declare that a website's HTTPS certificate should only be treated as valid if the public key is contained in a list specified over HTTP to prevent MITM attacks that use valid CA-issued certificates.

### Specification
- **Standard**: RFC 7469
- **Link**: https://tools.ietf.org/html/rfc7469
- **Status**: Other (Deprecated/Removed)

## Categories
- **Security**

## Use Cases and Benefits

### Original Intent
- **Certificate Authority Compromise Protection**: Defend against attacks when CAs are compromised and issue fraudulent certificates
- **Enhanced HTTPS Security**: Add an extra layer of validation beyond standard certificate chain verification
- **Domain-Specific Security**: Allow websites to enforce stricter certificate validation policies specific to their infrastructure

### Rationale
HPKP aimed to complement the standard Public Key Infrastructure (PKI) by enabling domain owners to:
1. Specify which certificate authorities are legitimate for their domain
2. Reduce the attack surface for MITM attempts
3. Provide additional protection against rogue certificates

## Current Status

### Important Note
**This feature has been deprecated and removed from all modern browsers.** Public Key Pinning is no longer recommended for new implementations.

### Why It Was Removed
- **Complexity**: The header was overly complicated to configure and maintain correctly
- **Risk of Misconfiguration**: Incorrect implementation could permanently block access to websites for extended periods
- **User Impact**: Misconfigurations caused widespread service disruptions with no easy recovery path
- **Better Alternatives**: Certificate Transparency provides similar security guarantees through different mechanisms

## Browser Support

### Support Summary
- **Never Implemented**: Internet Explorer, Edge, Safari, iOS Safari, Android Browser
- **Previously Supported**: Firefox (35-71), Chrome (38-71), Opera (25-65), Samsung Internet (4-10.1), KaiOS (2.5)
- **Currently Deprecated**: All browsers have removed support

### Detailed Browser Support Table

| Browser | Support | Version Range | Notes |
|---------|---------|---------------|-------|
| **Chrome** | ✗ Removed | 38-71 (Supported), 72+ (Removed) | Removed in Chrome 72 (2019) |
| **Firefox** | ✗ Removed | 35-71 (Supported), 72+ (Removed) | Removed in Firefox 72 (2020) |
| **Safari** | ✗ Never Supported | All versions | Never implemented |
| **Edge** | ✗ Never Supported | All versions | Never implemented |
| **Opera** | ✗ Removed | 25-65 (Supported), 66+ (Removed) | Followed Chrome's timeline |
| **Internet Explorer** | ✗ Never Supported | All versions | Never implemented |
| **iOS Safari** | ✗ Never Supported | All versions | Never implemented |
| **Android Browser** | ✗ Never Supported | All versions | Never implemented |
| **Samsung Internet** | ✗ Removed | 4-10.1 (Supported), 11+ (Removed) | Aligned with Chrome deprecation |
| **KaiOS** | ✗ Removed | 2.5 (Supported), 3.0+ (Removed) | Deprecated in later versions |
| **Opera Mini** | ✗ Never Supported | All versions | Never implemented |

### Legend
- ✓ Fully Supported: The feature works in this browser version
- ✗ Not Supported: The feature does not work in this browser version
- ⚠ Partial Support: The feature has limited or experimental support
- (Removed): Feature was previously supported but has been removed

## Implementation History

### Timeline
- **2014-2016**: HPKP specification (RFC 7469) published and adoption begins
- **Chrome 38+ (2014)**: Initial support added
- **Firefox 35+ (2015)**: Support added
- **2019**: Chrome 72 removes support (February 2019)
- **2019-2020**: Other browsers begin deprecation process
- **2020**: Firefox 72 removes support (January 2020)
- **2021+**: All major browsers have removed support

## Migration and Alternatives

### Recommended Alternatives

#### 1. **Certificate Transparency (CT)**
- **Status**: Modern standard, widely implemented
- **Advantage**: Provides security benefits without the risk of complete domain lockout
- **How It Works**: Requires all certificates to be logged in public CT logs, allowing domain owners to monitor their certificates
- **References**: [MDN: Certificate Transparency](https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency)

#### 2. **Expect-CT Header**
- **Status**: Successor to HPKP with reduced risk
- **Advantage**: Allows enforcing CT validation with reporting capabilities
- **Benefit**: Can report violations without blocking access (report-only mode)

#### 3. **DANE (DNSSEC Authentication of Named Entities)**
- **Status**: Alternative DNS-based approach
- **Advantage**: Certificate validation through DNSSEC
- **Limitation**: Requires DNSSEC support in the resolver

#### 4. **Regular Certificate Authority Monitoring**
- **Advantage**: Monitor and audit issued certificates for your domain
- **Tools**: Use certificate monitoring services and CT logs

## Important Notes

### Critical Information
- **All browsers have removed support** for Public Key Pinning. The header, while well-intentioned, proved problematic in practice.
- **Configuration Risk**: Incorrect HPKP implementation could result in complete inaccessibility of affected domains, with recovery taking weeks or months (depending on the `max-age` value)
- **Pinning Duration**: The `max-age` directive specified how long the pins would persist, making mistakes potentially catastrophic
- **No Graceful Fallback**: Unlike other headers, HPKP could not be easily modified or removed once deployed

### Why This Matters
The deprecation of HPKP is a testament to the importance of designing security mechanisms with careful consideration for real-world deployment scenarios and recovery paths.

## Related Resources

### Official Documentation
- [MDN Web Docs - Public Key Pinning](https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning)
- [RFC 7469 - HTTP Public-Key-Pinning](https://tools.ietf.org/html/rfc7469)

### Analysis and Discussion
- [Scott Helme - "I'm Giving Up On HPKP"](https://scotthelme.co.uk/im-giving-up-on-hpkp/) - Critical analysis of HPKP problems
- [MDN - Certificate Transparency](https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency)

### Related Security Features
- Certificate Transparency
- Expect-CT Header
- HSTS (HTTP Strict-Transport-Security)
- DANE
- CAA (Certificate Authority Authorization) Records

## Data and Statistics

### Global Usage
- **Current Usage**: 0.27% (historical, mostly legacy sites)
- **Partial Support**: 0% (no browser provides partial support)
- **Trend**: Declining as implementations are removed

### Why So Low Usage
- Complex to implement correctly
- High risk of misconfiguration
- Better alternatives (CT) now available
- Browsers actively removing support

## Conclusion

**HTTP Public Key Pinning should not be used in new implementations.** While it represented an innovative approach to preventing MITM attacks, its complexity and potential for catastrophic misconfiguration led to its deprecation across all browsers.

For modern security needs:
- Use **Certificate Transparency** for monitoring
- Implement **HSTS** for transport security
- Monitor **CAA records** to control certificate issuance
- Use **Expect-CT** for certificate validation enforcement with reporting

---

*Last Updated: December 2025*
*Source: CanIUse Data*
