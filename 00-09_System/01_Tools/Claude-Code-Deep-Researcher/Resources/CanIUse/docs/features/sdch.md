# SDCH Accept-Encoding/Content-Encoding

## Overview

**SDCH** (Shared Dictionary Compression over HTTP) is a content encoding mechanism that allows HTTP clients and servers to negotiate the use of shared dictionaries for compression. This technique can significantly reduce bandwidth usage by leveraging common patterns in web content.

## Description

Shared Dictionary Compression over HTTP (SDCH) is an HTTP compression standard that enables more efficient data transfer by allowing a client and server to share a common compression dictionary. The dictionary contains frequently occurring patterns and phrases that can be referenced by both parties, resulting in smaller compressed payloads compared to standard gzip compression alone.

## Specification Status

**Status:** Other (Deprecated/Limited Adoption)

- **Spec Document:** [SDCH Specification](https://docs.google.com/viewer?a=v&pid=forums&srcid=MDIwOTgxNDMwMTgyMjkzMTI2ODcBMDQ2MzU5NDU2MDA0MTg5NDE1MTkBTDZmaENoSG9BZ0FKATAuMQEBdjI)
- **Status Note:** SDCH has not achieved widespread standardization and remains largely experimental or vendor-specific

## Categories

- **HTTP & Networking**
- **Content Encoding & Compression**
- **Performance Optimization**

## Benefits & Use Cases

### Potential Benefits

1. **Enhanced Compression Ratios**
   - Dictionary-based compression can achieve 30-50% better compression than standard gzip for certain content types
   - Particularly effective for text-heavy content with repeated patterns

2. **Bandwidth Reduction**
   - Reduces overall data transfer, especially beneficial for users on limited bandwidth connections
   - Improved load times for large documents and resources

3. **Server-Client Optimization**
   - Allows servers to customize dictionaries for specific content types or domains
   - Clients can cache dictionaries across multiple requests

4. **Strategic Content Delivery**
   - Useful for optimizing specific content categories (HTML, JavaScript, CSS)
   - Can be combined with other compression techniques

### Use Cases

- High-volume data transfer scenarios
- Content delivery networks (CDNs) with uniform content patterns
- Mobile applications with bandwidth constraints
- Web services serving similar content repeatedly

## Browser Support

### Support Matrix

| Browser | Support Status | Version Range | Notes |
|---------|---|---|---|
| **Chrome** | Limited (Deprecated) | 4–58 | Supported from Chrome 4 to 58, removed from Chrome 59+ |
| **Opera** | Limited (Deprecated) | 15–72 | Supported from Opera 15 to 72, removed from Opera 73+ |
| **Safari** | Not Supported | All versions | Never implemented in Safari |
| **Firefox** | Not Supported | All versions | Never implemented in Firefox |
| **Edge** | Not Supported | All versions | Never implemented in Edge |
| **Internet Explorer** | Not Supported | All versions | Never implemented in IE |
| **iOS Safari** | Not Supported | All versions | Never implemented on iOS |
| **Android Browser** | Partially Supported | 4.2+ (limited), 142+ | Limited support in older versions; newer Chrome-based versions do not support |
| **Samsung Internet** | Supported | 5.0–29.0 | Full support in Samsung Internet throughout its history |

### Support Summary

**Global Usage:** ~2.52% of users

- **Full Support:** Chrome (versions 4-58), Opera (versions 15-72), Samsung Internet (all versions), Android Browser (limited)
- **No Support:** Firefox, Safari, Edge, Internet Explorer, and all other modern browsers
- **Deprecated:** Removed from Chrome 59+ and Opera 73+; effectively obsolete in modern web development

## Historical Context

### Timeline

- **Chrome 4–58 (2010–2018):** Initial support and widest implementation
- **Opera 15–72 (2013–2020):** Piggyback on Chromium (Blink) engine support
- **Samsung Internet:** Maintained support for longer due to historical patterns
- **Chrome 59+ (2017 onwards):** Removed due to lack of standardization and security concerns
- **Current Status:** Effectively deprecated; no major browsers support it

### Why SDCH Was Discontinued

1. **Lack of Standardization**
   - Not adopted as an official IETF standard
   - Remained largely experimental and vendor-specific

2. **Security Concerns**
   - Potential for dictionary-based attacks and information leakage
   - Complexity in managing dictionary distribution and validation

3. **Complexity**
   - Increased implementation complexity for minimal real-world gains
   - Maintenance burden without clear standardization path

4. **Alternative Solutions**
   - Brotli and other modern compression algorithms provided better improvements
   - HTTP/2 and HTTP/3 reduced the relative benefits of dictionary compression
   - Improved standard compression methods made SDCH less relevant

## Implementation Details

### HTTP Headers

**Request (Client → Server):**
```
Accept-Encoding: sdch
```

**Response (Server → Client):**
```
Content-Encoding: sdch
X-Dictionary-URI: https://example.com/dictionary
```

### Dictionary Management

- Servers would advertise dictionary URLs via headers
- Clients would download and cache dictionaries
- Compression would reference dictionary entries rather than transmitting full patterns
- Dictionary versioning and validation mechanisms were required

## Notes

- **Status:** This feature is effectively deprecated in all modern browsers
- **Migration Path:** Use standard compression algorithms (gzip, Brotli, Deflate) instead
- **Legacy Support:** Only necessary if explicitly supporting extremely old Chrome or Opera versions
- **Not Recommended:** Do not implement new SDCH support for production systems

## Migration & Alternatives

### Recommended Modern Alternatives

1. **Brotli Compression**
   - Better compression ratios than gzip
   - Widely supported in modern browsers
   - No dictionary complexity

2. **Gzip Compression**
   - Universal browser support
   - Simple to implement and maintain
   - Suitable for most use cases

3. **HTTP/2 & HTTP/3**
   - Built-in header compression
   - Reduced multiplexing overhead
   - Modern protocol features

4. **Efficient Content Delivery**
   - Minification of assets (JavaScript, CSS, HTML)
   - Image optimization and modern formats (WebP, AVIF)
   - Strategic caching strategies

## Relevant Links

- [SDCH Google Group](https://groups.google.com/forum/#!forum/sdch) - Community discussion and documentation
- [Mozilla Bugzilla #641069](https://bugzilla.mozilla.org/show_bug.cgi?id=641069) - Firefox implementation request (closed)
- [Wikipedia - SDCH](https://en.wikipedia.org/wiki/SDCH) - Historical information and technical overview
- [LinkedIn Engineering Blog](https://engineering.linkedin.com/shared-dictionary-compression-http-linkedin) - Real-world implementation experience

## See Also

- [Compression Algorithms](../compression/)
- [HTTP Content Encoding](../http-features/)
- [Brotli Compression](../brotli/)
- [Gzip Compression](../gzip/)
- [HTTP/2](../http2/)
