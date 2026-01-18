# Content Security Policy (CSP) 1.0

## Overview

Content Security Policy (CSP) is a security standard that allows web developers to mitigate cross-site scripting (XSS), clickjacking, and other content injection attacks by controlling which resources can be loaded and executed on a web page. By declaring allowed sources for scripts, styles, images, fonts, and other resource types, developers can significantly reduce the attack surface and browser support for malicious injections.

## Specification

**Status:** Candidate Recommendation (CR)
**Specification Link:** [W3C Content Security Policy 1.0](https://www.w3.org/TR/2012/CR-CSP-20121115/)

## Category

🔒 **Security**

## Description

CSP mitigates cross-site scripting attacks by only allowing certain sources of script, style, and other resources. Through HTTP headers, developers specify which origins can provide content for various resource types, restricting execution to trusted domains.

## Benefits & Use Cases

### Primary Benefits

- **XSS Prevention**: Prevents inline script execution and restricts script execution to whitelisted domains
- **Data Exfiltration Protection**: Controls where data can be sent, preventing unauthorized data transmission
- **Clickjacking Mitigation**: Restricts frame embedding through `frame-ancestors` directive
- **Injection Attack Prevention**: Blocks content injection attacks by controlling resource sources
- **Plugin Control**: Manages Flash and other plugin execution through object/embed restrictions

### Common Use Cases

- **E-commerce Platforms**: Protect customer payment and personal information from theft
- **Financial Services**: Secure sensitive financial data and transactions
- **Social Networks**: Prevent account takeover and unauthorized data access
- **SaaS Applications**: Protect user data and application integrity
- **Content Management Systems**: Control third-party content and extensions safely
- **APIs**: Restrict where API responses can be loaded
- **Reporting & Monitoring**: Use CSP violation reports to detect attacks in real-time

### Violation Reporting

CSP provides built-in violation reporting capability through the `report-uri` and `report-to` directives, allowing developers to monitor and analyze security violations in real-time.

## Browser Support

### Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 25 | ✅ Fully Supported |
| Firefox | 23 | ✅ Fully Supported |
| Safari | 7 | ✅ Fully Supported |
| Edge | 12 | ✅ Fully Supported |
| Opera | 15 | ✅ Fully Supported |
| Android Chrome | 4.4 | ✅ Fully Supported |
| iOS Safari | 7.0-7.1 | ✅ Fully Supported |

### Detailed Browser Compatibility

#### Desktop Browsers

**Chrome**
- 14-24: Partial support (with `#2` notes)
- 25+: Full support

**Firefox**
- 4-22: Partial support (with `#1` notes)
- 23+: Full support

**Safari**
- 5.1: Partial support (with `#2` notes)
- 6.0-6.1: Partial support (with `#2` notes)
- 7+: Full support

**Edge**
- 12+: Full support

**Opera**
- 15+: Full support

**Internet Explorer**
- 10-11: Partial support using `X-Content-Security-Policy` header only

#### Mobile Browsers

**iOS Safari**
- 5.0-5.1: Partial support (with `#2` notes)
- 6.0-6.1: Partial support (with `#2` notes)
- 7.0-7.1+: Full support

**Android Browser**
- 4.4+: Full support

**Chrome for Android**
- 4.4+: Full support

**Opera Mobile**
- 80+: Full support

**Samsung Internet**
- 4+: Full support

**Other Mobile**
- Opera Mini: Not supported
- UC Browser: 15.5+
- Blackberry: 10+ (with `#2` notes)

### Global Usage

| Support Level | Usage Percentage |
|---------------|------------------|
| Full Support (Y) | **93.27%** |
| Partial Support (A) | **0.33%** |
| Not Supported | ~6.4% |

## Known Issues & Bugs

### Internet Explorer 10-11
**Issue:** Partial support only through `X-Content-Security-Policy` header

Older versions of Internet Explorer (10-11) do not support the standard `Content-Security-Policy` header. Instead, they recognize only the vendor-prefixed `X-Content-Security-Policy` header. Additionally, CSP support is limited, with only the `sandbox` directive being supported.

**Workaround:** Use both headers for IE compatibility, and be aware of limited functionality.

```http
Content-Security-Policy: default-src 'self'
X-Content-Security-Policy: default-src 'self'
```

### iOS Safari 5.0-5.1
**Issue:** Partial support with broken behavior on complex cases

Early versions of iOS Safari recognize the `X-WebKit-CSP` header but fail to handle complex CSP policies correctly, often resulting in broken pages when strict policies are enforced.

**Workaround:** Use simpler policies for older iOS Safari versions, or progressively enhance with more complex policies for newer versions.

### Chrome for iOS
**Issue:** Requires `connect-src 'self'` policy

Chrome for iOS has a quirk where pages may fail to render properly without an explicit `connect-src 'self'` directive in the CSP policy.

**Workaround:** Always include `connect-src 'self'` in your CSP header when targeting Chrome for iOS.

## Header Implementation Notes

### Standard Header

The standard HTTP header is `Content-Security-Policy`. This is the recommended approach for all modern browsers.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://trusted.example.com; style-src 'self' https://fonts.googleapis.com
```

### Vendor-Prefixed Headers

For backward compatibility with older browsers, vendor-specific headers may be used:

- **`X-Content-Security-Policy`** (Internet Explorer 10-11)
- **`X-WebKit-CSP`** (Safari 5.1-6.1, iOS Safari 5.0-6.1, Blackberry 10)

## Related Links & Resources

### Official Documentation
- [MDN Web Docs - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [W3C CSP Specification](https://www.w3.org/TR/CSP/)

### Learning Resources
- [HTML5Rocks: Content Security Policy Tutorial](https://www.html5rocks.com/en/tutorials/security/content-security-policy/)
- [CSP Examples & Quick Reference](https://content-security-policy.com/)

### Tools & Testing
- [CSP Violation Reporter](https://csp-evaluator.withgoogle.com/)
- [Mozilla CSP Evaluator](https://www.mozilla.org/en-US/security/)

## Implementation Guide

### Basic Example

```http
Content-Security-Policy: default-src 'self'
```

This policy allows resources from the same origin only.

### Advanced Example

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.example.com;
  style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'self';
  report-uri /csp-report
```

### Directives Overview

| Directive | Purpose |
|-----------|---------|
| `default-src` | Fallback for all unspecified directives |
| `script-src` | Controls which scripts can be executed |
| `style-src` | Controls which stylesheets can be applied |
| `img-src` | Controls which images can be loaded |
| `font-src` | Controls which fonts can be loaded |
| `connect-src` | Controls which URLs can be connected to (XHR, WebSocket, etc.) |
| `frame-ancestors` | Controls which origins can embed this page in a frame |
| `sandbox` | Applies sandbox restrictions to the document |
| `report-uri` | URL where CSP violations are reported |

## Recommendations

1. **Start with Report-Only Mode**: Use `Content-Security-Policy-Report-Only` header during testing to identify violations without blocking content.

2. **Use `default-src 'self'`**: Establish a restrictive base policy and explicitly allow only necessary sources.

3. **Avoid `unsafe-inline` and `unsafe-eval`**: These significantly reduce security benefits. Use external scripts and styles instead.

4. **Enable Violation Reporting**: Use `report-uri` or `report-to` directives to monitor attacks and policy violations.

5. **Gradually Migrate**: Move from vendor-prefixed headers to the standard `Content-Security-Policy` header.

6. **Test Thoroughly**: Use browser DevTools to identify and fix CSP violations during development.

7. **Update Regularly**: Keep CSP policies current with your application's resource loading patterns.

## Support Status Summary

Content Security Policy has **excellent browser support** with 93.27% of global users having full support. Most modern browsers (Chrome 25+, Firefox 23+, Safari 7+, Edge 12+) fully implement the specification.

**Legacy browsers** (IE, older Safari) have partial or no support, but these represent less than 1% of modern web traffic. For most production applications, CSP can be deployed with confidence, with fallback headers for older browsers as needed.

---

**Last Updated:** December 2024
**Data Source:** CanIUse.com
