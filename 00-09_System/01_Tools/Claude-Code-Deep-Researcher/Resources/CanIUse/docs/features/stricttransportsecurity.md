# Strict Transport Security (HSTS)

## Overview

**Strict Transport Security** (HSTS) is an HTTP header mechanism that declares a website is only accessible over secure HTTPS connections. Once a browser receives this header, it will automatically upgrade all future HTTP requests to HTTPS for that domain.

## Specification Status

- **Status**: Standardized (RFC 6797)
- **Specification**: [RFC 6797 - HTTP Strict Transport Security](https://tools.ietf.org/html/rfc6797)
- **Category**: Security

## Description

Strict Transport Security protects websites and their users from protocol downgrade attacks and man-in-the-middle (MITM) attacks by forcing browsers to use secure HTTPS connections. The header allows servers to declare that they should only be accessed via secure, authenticated connections.

### Key Benefits

- **Attack Prevention**: Protects against protocol downgrade attacks and man-in-the-middle attacks
- **Automatic HTTPS Enforcement**: Browsers automatically upgrade HTTP requests to HTTPS
- **User Security**: Prevents users from accidentally accessing insecure versions of a website
- **Simple Implementation**: Easy to implement via a single HTTP header
- **Broad Browser Support**: Supported across all modern browsers

## Implementation

### Basic Header Syntax

```http
Strict-Transport-Security: max-age=<seconds>
```

### Header Parameters

- **max-age** (required): Time in seconds the browser should remember this policy (recommended: 31536000 = 1 year)
- **includeSubDomains** (optional): Apply the policy to all subdomains
- **preload** (optional): Allow the domain to be included in the HSTS preload list

### Example Implementations

**Minimum Policy**
```http
Strict-Transport-Security: max-age=31536000
```

**With Subdomains**
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Complete Policy with Preload**
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Browser Support

### Support Summary

HSTS has excellent browser support across modern browsers. The feature is supported in:

- ✅ All versions of Edge (12+)
- ✅ Firefox 4+
- ✅ Chrome 4+
- ✅ Safari 7+
- ✅ Opera 12+
- ✅ iOS Safari 7.0+
- ✅ Android 4.4+
- ⚠️ IE 11 (added in June 2015 update)

### Detailed Browser Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4+ | ✅ Yes | Fully supported since version 4 |
| **Firefox** | 4+ | ✅ Yes | Fully supported since version 4 |
| **Safari** | 7+ | ✅ Yes | Added in version 7 |
| **Edge** | 12+ | ✅ Yes | Full support from initial release |
| **Opera** | 12+ | ✅ Yes | Added in version 12 |
| **IE** | 11 | ✅ Yes | Added via June 2015 update |
| **IE** | 10 and below | ❌ No | Not supported |

### Mobile Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| **iOS Safari** | 7.0+ | ✅ Yes |
| **Android Browser** | 4.4+ | ✅ Yes |
| **Chrome Mobile** | Latest | ✅ Yes |
| **Firefox Mobile** | Latest | ✅ Yes |
| **Samsung Internet** | 4+ | ✅ Yes |
| **UC Browser** | 15.5+ | ✅ Yes |
| **Opera Mobile** | 80+ | ✅ Yes |
| **Opera Mini** | All | ❌ No |

### Global Usage Statistics

- **Global Support**: 93.59% of users have browser support
- **No Partial Support**: Feature is either fully supported or not supported
- **Modern Browser Coverage**: Essentially all modern browsers support HSTS

## Technical Notes

### HTTP Header Name

The HTTP header name for HSTS is `Strict-Transport-Security`.

### Key Behaviors

1. **First-Visit Problem**: HSTS protection doesn't apply on the first visit to a domain since the browser has not yet received the header. Use the HSTS Preload List for first-visit protection.

2. **Preload Lists**: Major browsers maintain HSTS preload lists that include hardcoded domains. Submit your domain at [hstspreload.org](https://hstspreload.org).

3. **Persistent Storage**: Once a browser receives an HSTS header, it stores the policy locally for the specified `max-age` duration.

4. **Subdomain Handling**: Use `includeSubDomains` to ensure all subdomains are protected under the same policy.

5. **Removal Policy**: If `max-age` is set to 0, the browser will remove the HSTS policy.

## Use Cases

### Primary Use Cases

- **E-commerce Websites**: Protect sensitive transactions from downgrade attacks
- **Financial Services**: Ensure secure access to banking and payment systems
- **Social Media Platforms**: Prevent account hijacking via protocol downgrade
- **Email Services**: Protect webmail access and data
- **Any Site with User Authentication**: Protect login pages and user data
- **API Endpoints**: Ensure secure API communication

## Related Resources

### Official Documentation

- [MDN Web Docs - Strict Transport Security](https://developer.mozilla.org/en-US/docs/Security/HTTP_Strict_Transport_Security)
- [OWASP - HTTP Strict Transport Security](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security)
- [Chromium HSTS Documentation](https://www.chromium.org/hsts/)

### Additional Resources

- [HSTS Preload List](https://hstspreload.org) - Submit your domain for hardcoded HSTS protection
- [RFC 6797](https://tools.ietf.org/html/rfc6797) - Official HSTS specification
- [Can I Use - HSTS](https://caniuse.com/stricttransportsecurity) - Real-time browser support data

## Implementation Recommendations

### Best Practices

1. **Start Conservative**: Begin with a small `max-age` value (e.g., 3600 seconds) for testing
2. **Use Subdomains Flag**: Include `includeSubDomains` to protect all subdomains
3. **Enable Preload**: Once confident, apply for HSTS preload inclusion
4. **Server Configuration**: Configure HSTS in your web server (Nginx, Apache, etc.)
5. **HTTPS First**: Ensure your entire site is properly served over HTTPS before enabling HSTS
6. **Test Thoroughly**: Verify all resources load over HTTPS, including external resources
7. **Monitor Removal**: Plan for domain removal if HSTS needs to be disabled

### Server Configuration Examples

**Nginx**
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**Apache**
```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

**Node.js/Express**
```javascript
app.use((req, res, next) => {
  res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});
```

## Security Considerations

### Important Warnings

1. **HTTPS Requirement**: HSTS only works when your site is served over HTTPS
2. **Initial Vulnerability**: The first request is still vulnerable to downgrade attacks; use preload list for first-visit protection
3. **Permanent Decision**: Once enabled with large `max-age`, removing HSTS becomes difficult
4. **Certificate Issues**: Certificate problems will block access; ensure SSL/TLS certificates are properly maintained
5. **Subdomain Coverage**: Be cautious with `includeSubDomains` if any subdomains don't support HTTPS

## Browser Compatibility Notes

- **IE 11**: Support was added via Windows Update on June 9, 2015
- **Legacy Browsers**: Pre-2015 versions of IE and older Opera versions do not support HSTS
- **Opera Mini**: Does not support HSTS due to proxy-based architecture
- **Modern Mobile**: All modern mobile browsers support HSTS

---

**Last Updated**: 2025
**Feature Category**: Security
**Keywords**: HSTS, STS, Security Header, HTTPS
