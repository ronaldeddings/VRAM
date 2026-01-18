# SPDY Protocol

## Overview

**SPDY** is a networking protocol designed for low-latency transport of content over the web. It was developed as an experimental protocol to improve upon HTTP/1.1 by reducing latency and overhead while maintaining compatibility with existing web infrastructure.

## Description

SPDY (pronounced "speedy") was an experimental protocol that introduced several performance enhancements:

- **Multiplexing**: Multiple concurrent streams over a single connection
- **Header compression**: Reduced protocol overhead
- **Server push**: Proactive content delivery
- **Binary framing**: More efficient than text-based HTTP/1.1

However, SPDY has been **superseded by HTTP/2**, which standardizes and improves upon many of SPDY's concepts. HTTP/2 is the recommended modern successor.

## Specification Status

**Status**: Unofficial
**Spec URL**: [chromium.org/spdy](https://www.chromium.org/spdy/)

> Note: SPDY is no longer maintained as a living standard. HTTP/2 is the official successor and should be used for all new implementations.

## Categories

- Other

## Benefits & Use Cases

While SPDY itself is deprecated, understanding its design principles offers historical context:

### Performance Improvements
- **Connection multiplexing**: Eliminate the need for multiple TCP connections per domain
- **Header compression**: Reduce protocol overhead significantly
- **Server push**: Optimize resource delivery timing
- **Reduced latency**: Especially beneficial on high-latency connections

### Historical Significance
- Served as the foundation for HTTP/2 development
- Demonstrated the viability of protocol improvements beyond HTTP/1.1
- Influenced modern web protocol design

### Modern Alternative
Use **HTTP/2** instead, which provides standardized versions of SPDY's benefits with better compatibility and officially standardized implementation.

## Browser Support

### Support Summary

| Browser | Support | Version Range | Notes |
|---------|---------|---------------|-------|
| Chrome | Yes | 4–50 | Discontinued after v50 (2016) |
| Firefox | Yes | 13–50 | Discontinued after v50 (2016) |
| Safari | Yes | 8+ | Deprecated as of macOS Mojave 10.14.4 (#1) |
| Opera | Partial | 12.1–39, 42, 44 | Inconsistent support; discontinued in v45+ |
| Internet Explorer | Limited | 11 only | Minimal support |
| Edge | No | Never supported | — |
| iOS Safari | Yes | 8+ | Deprecated as of iOS 12.2 (#2) |
| Android | Yes | 3.0–4.4.3 | Discontinued in modern versions |
| Opera Mobile | Partial | 12.1, mixed | Inconsistent support |
| Samsung Internet | Limited | 4.0 | Minimal support |
| KaiOS | Limited | 2.5 | Very limited support |

### Detailed Browser Compatibility

#### Desktop Browsers

**Chrome**
- Support: Yes (v4–v50)
- Status: Fully supported from Chrome 4 through Chrome 50 (March 2016)
- Discontinued: Removed in Chrome 51 as HTTP/2 became standard

**Firefox**
- Support: Yes (v13–v50)
- Status: Fully supported from Firefox 13 through Firefox 50 (November 2016)
- Discontinued: Removed in Firefox 51 as HTTP/2 became standard

**Safari**
- Support: Yes (v8+)
- Status: Supported from Safari 8 onwards
- Note #1: Deprecated as of macOS Mojave 10.14.4; planned for future removal
- Current Status: Still present but deprecated

**Internet Explorer**
- Support: Yes (IE 11 only)
- Status: Limited support in IE 11
- No support in earlier versions (IE 5.5–10)

**Edge**
- Support: No
- Status: Never supported SPDY

**Opera**
- Support: Partial (v12.1–v39, v42, v44)
- Status: Inconsistent support with gaps in later versions
- Discontinued: Not supported from v45 onwards

#### Mobile Browsers

**iOS Safari**
- Support: Yes (v8+)
- Status: Supported from iOS Safari 8
- Note #2: Deprecated as of iOS 12.2; planned for future removal
- Current Status: Still present but deprecated

**Android Browser**
- Support: Yes (v3.0–v4.4.3)
- Status: Supported in Android 3.0 through 4.4.3
- Discontinued: Not supported in modern Android versions

**Opera Mobile**
- Support: Partial (v12.1, with gaps)
- Status: Inconsistent support
- Discontinued: Not supported from v80 onwards

**Samsung Internet**
- Support: Limited (v4.0 only)
- Status: Minimal support

**Internet Explorer Mobile**
- Support: Yes (IE Mobile 11 only)
- Status: Limited support

**KaiOS**
- Support: Limited (v2.5 only)
- Status: Minimal support

### Usage Statistics

- **Global Usage**: 11.16% of all users (Note: This may include fallback to HTTP/2)
- **Alternative Support (HTTPS)**: 0% explicit SPDY-only usage
- **Vendor Prefix**: Not required (unprefixed)

## Important Notes

### Deprecation Status

SPDY is a **deprecated protocol** and should not be used for new implementations. The following timeline applies:

1. **Chrome & Firefox**: Removed support in 2016 (v51+/v51+)
2. **Safari & iOS Safari**: Deprecated as of macOS Mojave and iOS 12.2; planned complete removal
3. **Opera**: Support dropped in v45
4. **Android**: Not supported in modern versions

### Reasons for Deprecation

1. **HTTP/2 Standardization**: HTTP/2 officially standardizes SPDY concepts with improvements
2. **Better Performance**: HTTP/2 provides similar benefits with official standardization
3. **Security Improvements**: HTTP/2 includes additional security enhancements
4. **Maintenance Burden**: Supporting SPDY alongside HTTP/2 adds unnecessary complexity

### Migration Path

To modernize your infrastructure:

1. **Verify HTTP/2 support** on your server and CDN
2. **Enable HTTPS** (required for HTTP/2)
3. **Update server configuration** to prefer HTTP/2 over SPDY
4. **Test with modern browsers** to ensure optimal performance
5. **Monitor access logs** for any remaining SPDY requests
6. **Consider HTTP/3** for cutting-edge performance on high-latency connections

## Related Features

- **[HTTP/2](https://caniuse.com/feat=http2)** - The official successor to SPDY with standardized implementation
- **[HTTP/3](https://caniuse.com/feat=http3)** - Latest HTTP protocol built on QUIC for improved performance
- **HTTPS** - Required for modern protocol negotiation

## References

- [SPDY Specification - Chromium Project](https://www.chromium.org/spdy/)
- [SPDY Whitepaper - Chromium Dev](https://dev.chromium.org/spdy/spdy-whitepaper)
- [HTTP/2 Overview - Wikipedia](https://en.wikipedia.org/wiki/HTTP/2)

## See Also

For current protocol adoption and recommendations, refer to:
- **[HTTP/2 Support](https://caniuse.com/feat=http2)** - Modern successor with full standardization
- **Modern TLS/SSL** - Essential for HTTP/2 and beyond
- **Server Configuration Guides** - For enabling HTTP/2 on your platform

---

*Last Updated: 2025*
*Status: Deprecated - Use HTTP/2 for new implementations*
