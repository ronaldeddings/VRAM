# Server Name Indication (SNI)

## Overview

**Server Name Indication** (SNI) is an extension to the TLS (Transport Layer Security) computer networking protocol by which a client indicates which hostname it is attempting to connect to at the start of the handshaking process. This extension allows a single server with a single IP address to host multiple SSL/TLS certificates for different domains.

## Technical Details

### Specification
- **Current Spec**: [RFC 6066](https://tools.ietf.org/html/rfc6066)
- **Spec Status**: Other (Extension to TLS)
- **Category**: Security

### Description
SNI is a critical extension to TLS that enables multiple SSL/TLS certificates to be hosted on a single server. Without SNI, each SSL certificate required its own dedicated IP address, making HTTPS hosting expensive for shared servers. This feature has become essential for virtual hosting on secure connections.

## Use Cases & Benefits

### Primary Benefits
1. **Cost Reduction**: Multiple domains can share a single IP address with different SSL certificates
2. **Efficient Virtual Hosting**: Enables HTTPS for shared hosting environments
3. **Scalability**: Reduces the need for multiple IP addresses for HTTPS services
4. **Security**: Required for proper TLS handshake with virtual hosting scenarios

### Common Use Cases
- **Shared Hosting Environments**: Multiple customers with different domains on one server
- **Content Delivery Networks (CDNs)**: Managing multiple domains across edge servers
- **API Gateway Services**: Handling multiple API domains on shared infrastructure
- **Enterprise Multi-Tenant Applications**: Hosting multiple customers securely on single infrastructure

## Browser Support

### Support Status Summary
- **Global Support**: 93.69% (as of latest data)
- **Partial Support**: 0.03%
- **Unsupported**: Minimal

### Browser Compatibility Table

#### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **Chrome** | v6 | ✅ Full Support | All versions 6+ |
| **Firefox** | v2 | ✅ Full Support | All versions 2+ |
| **Safari** | v3.1 | ✅ Full Support | All versions 3.1+ |
| **Opera** | v9 | ✅ Full Support | All versions 9+ |
| **Edge** | v12 | ✅ Full Support | All versions 12+ |
| **Internet Explorer** | v9 | ✅ Full Support | IE 9, 10, 11 supported; IE 7-8 with limitations |

#### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---|---|
| **iOS Safari** | v4.0 | ✅ Full Support |
| **Android Browser** | v3 | ✅ Full Support |
| **Samsung Internet** | v4 | ✅ Full Support |
| **Opera Mobile** | v10 | ✅ Full Support |
| **Chrome Android** | v6+ | ✅ Full Support |
| **Firefox Android** | v4+ | ✅ Full Support |

#### Legacy & Feature Browsers

| Browser | Support Status |
|---------|---|
| **Opera Mini** | ✅ Full Support (all versions) |
| **Blackberry Browser** | v10+ ✅ Supported; v7 ❌ Not supported |
| **IE Mobile** | v10, v11 ✅ Supported |

### Special Notes

1. **Internet Explorer 7-8**: Supported with limitations (#1)
   - Only supported on Windows Vista or above (not Windows XP)

2. **Historical Context**: SNI adoption has been nearly universal for over a decade
   - Chrome: Supported since v6 (2010)
   - Firefox: Supported since v2 (2006)
   - Safari: Supported since v3.1 (2008)
   - Opera: Supported since v9 (2008)

## Implementation Considerations

### Advantages
- **Wide Compatibility**: Near-universal browser support across modern and legacy browsers
- **Transparent**: Works automatically in most TLS implementations
- **No Client Configuration**: Clients automatically send hostname during TLS handshake
- **Security Standard**: Universally accepted and recommended practice

### Requirements
- **Server Support**: Web server must support SNI (Apache, Nginx, IIS all support it)
- **TLS Version**: Works with TLS 1.0 and later
- **Certificate Chain**: Proper SSL/TLS certificate installation required

### Compatibility Considerations
- Very few modern systems lack SNI support
- Legacy systems (IE 7-8 on Windows XP) may have limitations
- Mobile browsers have universal support

## Resources

### Additional Reading
- [Wikipedia: Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication)
- [RFC 6066 - TLS Extensions](https://tools.ietf.org/html/rfc6066)

## Usage Statistics

| Metric | Value |
|--------|-------|
| **Supported (%)** | 93.69% |
| **Partial Support (%)** | 0.03% |
| **Unsupported (%)** | <1% |

## Conclusion

Server Name Indication is a mature and universally-supported feature that has become essential to modern web infrastructure. Its adoption across all major browsers and platforms makes it a safe standard to rely on for any HTTPS implementation, with virtually no compatibility concerns for modern web applications.

---

*Last Updated: 2024 | Data Source: CanIUse Database*
