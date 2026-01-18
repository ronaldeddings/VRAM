# HTTP/2 Protocol

## Overview

**HTTP/2** is a modern networking protocol designed for low-latency, high-performance content delivery over the web. It evolved from the SPDY protocol and is now standardized as HTTP version 2 (RFC 7540).

### Description

HTTP/2 is a significant upgrade from HTTP/1.1 that improves web performance through features like multiplexing, header compression, and server push. It maintains backward compatibility while providing substantial performance improvements for modern web applications.

## Specification

- **Official Standard**: [RFC 7540](https://tools.ietf.org/html/rfc7540)
- **Status**: Standardized (RFC)

## Categories

- Other (Networking Protocol)

## Key Benefits & Use Cases

### Performance Improvements
- **Multiplexing**: Handle multiple streams over a single TCP connection
- **Header Compression**: Reduce overhead using HPACK compression
- **Server Push**: Proactively send resources to clients
- **Stream Prioritization**: Improve perceived performance by prioritizing critical resources

### Use Cases
- Modern web applications requiring optimal performance
- Content delivery networks and CDNs
- Real-time applications and APIs
- Progressive web applications (PWAs)

### Typical Performance Gains
- 20-50% reduction in page load times
- Reduced latency for resource-heavy sites
- Better utilization of network bandwidth

## Browser Support

### Support Summary
- **Full Support**: 93.19% of global users
- **Partial Support**: 0.33% of global users
- **No Support**: 6.48% of global users

### Desktop Browsers

| Browser | First Support | Latest Versions | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | v41+ (2015) | v41-146+ | Full support since v41 |
| **Firefox** | v36+ (2015) | v36-148+ | Full support since v36 |
| **Safari** | v11+ (2017) | v11+ | Full support since v11; Partial in v9-10 |
| **Edge** | v12+ (2015) | v12-143+ | Full support since v12 |
| **Opera** | v28+ (2015) | v28-122+ | Full support since v28 |
| **Internet Explorer** | v11 | v11 only | Partial support; Limited to Windows 10 |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **iOS Safari** | v9.0+ (2015) | v9.0+ | Full support since v9 |
| **Android Browser** | v142+ | v142+ | Full support |
| **Chrome Mobile** | v142+ | v142+ | Full support |
| **Firefox Mobile** | v144+ | v144+ | Full support |
| **Samsung Internet** | v4+ (2015) | v4-29+ | Full support since v4 |
| **Opera Mobile** | v80+ | v80+ | Full support |
| **Android UC** | v15.5+ | v15.5+ | Full support |
| **Opera Mini** | None | No support | Not supported |

### Legacy/Discontinued Browsers

| Browser | Support |
|---------|---------|
| **BlackBerry** | Not supported |
| **Windows Phone** | Not supported (IE Mobile) |
| **KaiOS** | v2.5+ (Partial/Full) |

## Important Notes

### TLS/HTTPS Requirement
HTTP/2 is **only supported over TLS (HTTPS)**. Plain HTTP/2 connections are not supported by any major browser. All HTTP/2 traffic must use a secure HTTPS connection.

### Protocol Negotiation (ALPN)
Most browser support (marked with `#3` in the data) requires that the server supports protocol negotiation via **ALPN** (Application-Layer Protocol Negotiation). Without ALPN support on the server, browsers will fall back to HTTP/1.1.

### Partial Support Variations
- **Internet Explorer 11**: Partial support limited to Windows 10
- **Safari 9-10**: Partial support limited to OS X 10.11 El Capitan and newer

### SPDY Deprecation
HTTP/2 has effectively replaced the earlier SPDY protocol. SPDY has been deprecated and removed from most modern browsers in favor of HTTP/2. Sites still using SPDY should migrate to HTTP/2.

## Implementation Considerations

### Server Requirements
- TLS 1.2 or higher certificate
- ALPN support for protocol negotiation
- HTTP/2 module or support (nginx, Apache, etc.)

### Client Compatibility
Due to the widespread browser support (93%+), HTTP/2 can be safely deployed for most web applications targeting modern browsers. For legacy browser support, HTTP/1.1 can be maintained as a fallback.

### HTTP/3 Migration
HTTP/3 (based on QUIC) is the next evolution and is beginning to see wider adoption. HTTP/2 will likely remain a standard fallback for the foreseeable future.

## Related Resources

- [Wikipedia: HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) - Comprehensive overview and technical details
- [Browser Support Test](https://http2.akamai.com/demo) - Interactive HTTP/2 support verification tool
- [MDN Web Docs: HTTP/2](https://developer.mozilla.org/en-US/docs/Glossary/HTTP2) - Mozilla's technical documentation

## Technical References

- **Chrome Issue Tracker**: [5152586365665280](https://bugs.chromium.org/p/chromium/issues/detail?id=5152586365665280)
- **RFC 7540**: Complete protocol specification
- **HPACK Specification**: RFC 7541 (HTTP/2 Header Compression)
- **ALPN Extension**: TLS extension for protocol negotiation

---

*Last Updated: December 2025*
*Based on CanIUse data for HTTP/2 protocol support*
