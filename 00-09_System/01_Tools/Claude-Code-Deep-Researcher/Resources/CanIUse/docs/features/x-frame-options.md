# X-Frame-Options HTTP Header

## Overview

The **X-Frame-Options** HTTP header is a security mechanism that indicates whether a webpage can be displayed within a frame or iframe on another webpage. It serves as a primary defense against **clickjacking attacks**, a type of security vulnerability where an attacker tricks users into interacting with hidden or disguised elements.

## Description

An HTTP header which indicates whether the browser should allow the webpage to be displayed in a frame within another webpage. Used as a defense against clickjacking attacks.

## Specification Status

- **Status:** Other (RFC Standard)
- **Specification:** [RFC 7034](https://tools.ietf.org/html/rfc7034)

### Standards Evolution

The `X-Frame-Options` header was originally introduced as a vendor-specific security header but has since been standardized. It has been obsoleted by the `frame-ancestors` directive from Content Security Policy (CSP) Level 2, which provides more flexible and powerful framing controls.

## Categories

- **Security**

## Benefits & Use Cases

### Protection Against Clickjacking

The primary benefit of X-Frame-Options is preventing clickjacking attacks where malicious websites frame your site to trick users into performing unintended actions.

### Key Use Cases

1. **Financial Institutions** - Protect login pages and transaction pages from being framed by malicious sites
2. **Social Media Platforms** - Prevent framing of user profiles and sensitive account pages
3. **E-commerce Sites** - Protect checkout and payment pages from clickjacking attacks
4. **Email Services** - Secure login and account management interfaces
5. **Admin Panels** - Protect administrative dashboards from being embedded in unauthorized contexts

### Recommended Implementation

The header supports three directive options:

| Directive | Behavior |
|-----------|----------|
| `DENY` | Page cannot be displayed in a frame, regardless of which site is framing it |
| `SAMEORIGIN` | Page can only be displayed in a frame on the same origin as the page itself |
| `ALLOW-FROM uri` | Page can only be displayed in a frame on the specified origin (deprecated) |

**Note:** The `ALLOW-FROM` directive has limited browser support and is deprecated in favor of CSP's `frame-ancestors` directive.

## Browser Support

### Support Legend

- **y** - Full support
- **a** - Partial support (typically excludes `ALLOW-FROM` directive)
- **u** - Unsupported
- **n** - Not supported

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Internet Explorer** | 8-11 | y | Full support starting from IE8 |
| **Edge** | 12-18 | y | Full support in legacy Edge |
| **Edge (Chromium)** | 79+ | a | Partial support (no `ALLOW-FROM`) |
| **Firefox** | 4-17 | a | Partial support (no `ALLOW-FROM`) |
| **Firefox** | 18+ | y | Full support from Firefox 18 onwards |
| **Firefox** | 70+ | a | Partial support in recent versions |
| **Chrome** | 26+ | a | Partial support (no `ALLOW-FROM`) |
| **Safari** | 5.1+ | a | Partial support (no `ALLOW-FROM`) |
| **Opera** | 11.6+ | a | Partial support (no `ALLOW-FROM`) |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 7.0+ | a | Partial support |
| **Android Browser** | 4+ | a | Partial support |
| **Opera Mini** | All | n | Not supported |
| **Opera Mobile** | 12.1+ | a | Partial support |
| **Samsung Internet** | 4+ | a | Partial support |
| **Chrome (Android)** | 142+ | a | Partial support |
| **Firefox (Android)** | 144+ | a | Partial support |
| **IE Mobile** | 10-11 | y | Full support |
| **UC Browser** | 15.5+ | a | Partial support |
| **KaiOS Browser** | 2.5+ | y | Full support |
| **Baidu Browser** | 13.52+ | a | Partial support |
| **QQ Browser (Android)** | 14.9+ | a | Partial support |
| **BlackBerry** | 7+ | a | Partial support |

### Support Summary

- **Global Support:** Approximately 93.19% of browsers have partial or full support
- **Full Support:** ~0.49% of users have browsers with complete support
- **Partial Support:** ~93.19% have partial support (typically lacking `ALLOW-FROM` directive)

## Implementation Examples

### Basic DENY Example

```
X-Frame-Options: DENY
```

Prevents the page from being framed on any website.

### SAMEORIGIN Example

```
X-Frame-Options: SAMEORIGIN
```

Allows the page to be framed only by pages on the same origin.

### Server Implementation Examples

#### Apache/httpd

```apache
Header always set X-Frame-Options "SAMEORIGIN"
```

#### Nginx

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
```

#### Express.js (Node.js)

```javascript
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});
```

#### Python Flask

```python
@app.after_request
def set_security_headers(response):
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    return response
```

## Important Notes

### Partial Support

**Partial support** refers to browsers that support the `DENY` and `SAMEORIGIN` options but **do not support the `ALLOW-FROM` option**. The `ALLOW-FROM` directive is deprecated and should not be relied upon for new implementations.

### Modern Alternative: Content Security Policy

The `X-Frame-Options` header has been **obsoleted by the `frame-ancestors` directive** from [Content Security Policy (CSP) Level 2](https://www.w3.org/TR/CSP2/#directive-frame-ancestors).

**CSP Alternative:**

```
Content-Security-Policy: frame-ancestors 'self';
```

This CSP directive provides:
- More flexible framing controls
- Better browser support across modern browsers
- Unified security policy framework
- Enhanced reporting capabilities

### Recommended Approach

For maximum compatibility and future-proofing, use **both headers** in your responses:

```
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: frame-ancestors 'self';
```

This ensures protection for:
- Legacy browsers that don't support CSP
- Modern browsers that prefer CSP
- Defense-in-depth security posture

## Relevant Links

- [X-Frame-Options Compatibility Test Tool](https://erlend.oftedal.no/blog/tools/xframeoptions/)
- [MDN Web Docs - X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [OWASP Clickjacking Defense Cheat Sheet](https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet)
- [Combating ClickJacking With X-Frame-Options - IEInternals Blog](https://blogs.msdn.microsoft.com/ieinternals/2010/03/30/combating-clickjacking-with-x-frame-options/)
- [IE8 Security Part VII: ClickJacking Defenses - IEBlog](https://blogs.msdn.microsoft.com/ie/2009/01/27/ie8-security-part-vii-clickjacking-defenses/)

## Browser Support by Release

### First Support Dates

- **Internet Explorer:** Version 8 (2009)
- **Firefox:** Version 18 (2013) - full support
- **Chrome:** Version 26 (2013) - partial support
- **Safari:** Version 5.1 (2011) - partial support
- **Opera:** Version 11.6 (2011) - partial support
- **iOS Safari:** Version 7.0 (2013) - partial support

---

*Documentation generated from Can I Use data. Last updated based on feature statistics showing 93.19% global support.*
