# Signed HTTP Exchanges (SXG)

## Overview

**Signed HTTP Exchanges (SXG)** is a technology that allows a different origin server to provide a resource, which will be treated as if it came from the original server. This innovation enables several important use cases, particularly for content delivery networks (CDNs) and the Accelerated Mobile Pages (AMP) ecosystem.

## Description

Part of the Web Packaging specification, Signed HTTP Exchanges provide cryptographic signatures for HTTP responses. This allows intermediaries like CDNs to serve content while maintaining the original server's origin in the browser's address bar and security model. The server receiving the signed exchange can verify that the content hasn't been tampered with and that it truly comes from the claimed origin.

## Specification Status

- **Spec URL:** [HTTP Origin-Signed Responses](https://tools.ietf.org/html/draft-yasskin-http-origin-signed-responses)
- **Status:** Other
- **Organization:** WICG (Web Incubator Community Group)

## Categories

- Other

## Key Benefits & Use Cases

1. **AMP CDN Integration**
   - Enables Google AMP CDN and other AMP distributors to serve content while preserving the original publisher's URL in the address bar
   - Improves user trust by showing the correct origin

2. **Faster Content Delivery**
   - Allows CDNs to pre-cache and serve signed content at the edge
   - Reduces latency while maintaining security guarantees

3. **Origin Preservation**
   - The original server's URL is displayed in the browser address bar
   - Maintains original server's origin in the security model

4. **Cryptographic Verification**
   - Content integrity is verified through digital signatures
   - Prevents man-in-the-middle tampering

## Browser Support

### Desktop Browsers

| Browser | Support | First Version | Latest Support |
|---------|---------|---------------|-----------------|
| **Chrome** | ✅ Yes | 73* | 146+ |
| **Edge** | ✅ Yes | 79 | 143+ |
| **Firefox** | ❌ No | — | — |
| **Safari** | ❌ No | — | — |
| **Opera** | ✅ Yes | 64 | 122+ |
| **IE** | ❌ No | — | — |

*Chrome 71-72 required a feature flag

### Mobile Browsers

| Platform | Browser | Support | Version |
|----------|---------|---------|---------|
| **Android Chrome** | Chrome | ✅ Yes | 142+ |
| **Samsung Browser** | Samsung Internet | ✅ Yes | 11.1+ |
| **Opera Mobile** | Opera Mobile | ✅ Yes | 80+ |
| **Android UC** | UC Browser | ✅ Yes | 15.5+ |
| **Android QQ** | QQ Browser | ✅ Yes | 14.9+ |
| **Baidu** | Baidu Browser | ✅ Yes | 13.52+ |
| **iOS Safari** | Safari | ❌ No | — |
| **Android Firefox** | Firefox | ❌ No | — |
| **Opera Mini** | Opera Mini | ❌ No | — |

### Global Support Coverage

- **Supported:** ~80.13% of users (based on usage statistics)
- **Partial Support:** ~0% (Chrome 71-72 with feature flag)
- **Unsupported:** ~19.87% of users

## Implementation Notes

### Important Requirements

**Certificate Extension Requirement:** This feature requires the page to be delivered with a certificate that includes the `CanSignHttpExchanges` extension. This is a critical security requirement to prevent unauthorized signing of exchanges.

### Chrome Implementation

- **Initial Release:** Chrome 73 (full support)
- **Trial Period:** Chrome 71-72 (available behind a feature flag: `chrome://flags/#enable-signed-http-exchange`)
- **Current Status:** Fully shipped and supported across all recent Chrome versions

### Browser-Specific Notes

**Chromium-Based Browsers:** Edge, Opera, Samsung Internet, and other Chromium browsers inherit support for SXG from the Chromium project.

**Firefox & Safari:** Neither Firefox nor Safari have implemented support for Signed HTTP Exchanges. Mozilla has published a position statement indicating concerns about the specification.

## Related Resources

### Official Documentation & Status

- [Chrome Platform Status](https://www.chromestatus.com/feature/5745285984681984) - Official Chrome implementation status (Shipped)
- [Microsoft Edge Platform Status](https://developer.microsoft.com/en-us/microsoft-edge/status/originsignedhttpexchanges/) - Edge support information
- [Web Packaging GitHub Repository](https://github.com/WICG/webpackage) - WICG specification repository

### Developer Guides

- [Signed HTTP Exchanges on Google Developers](https://developers.google.com/web/updates/2018/11/signed-exchanges) - Official Google guide
- [AMP URLs in Google Search](https://blog.amp.dev/2018/11/13/developer-preview-of-better-amp-urls-in-google-search/) - Developer preview announcement
- [Implementing SXG for Better AMP URLs](https://medium.com/oyotech/implementing-signed-exchange-for-better-amp-urls-38abd64c6766) - Implementation guide by Oyo Tech

### Standards & Positions

- [Mozilla Standards Position](https://mozilla.github.io/standards-positions/#http-origin-signed-responses) - Mozilla's formal position on SXG (marked as harmful)

## Known Issues

Currently no known issues are documented in the CanIUse database.

## Technical Considerations

### Security

- Requires special certificate extension (`CanSignHttpExchanges`)
- Cryptographic verification prevents tampering
- Origin is preserved in security context

### Performance

- Enables edge caching by CDNs
- Pre-fetching and pre-rendering of signed content
- Reduced latency for end users

### Compatibility

- Limited to Chromium-based browsers
- Not yet implemented in Firefox or Safari
- Consider fallback mechanisms for unsupported browsers

## Keywords

`SXG`, `WebPackage`, `AMP`, `Signed Exchanges`, `Web Packaging`

---

*Last Updated: 2025-12-13*

*Data Source: CanIUse - [Signed HTTP Exchanges](https://caniuse.com/sxg)*
