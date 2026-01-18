# Referrer Policy

## Overview

**Referrer Policy** is a security and privacy feature that controls how much information is shared through the HTTP `Referer` header when users navigate between websites or resources. It helps protect user privacy by allowing websites to limit the referral information exposed to external sites.

## Description

The Referrer Policy specification defines a mechanism to control the amount of referrer information (the URL of the page making the request) that is shared with external websites. This is particularly important for privacy and security, as the referrer URL can sometimes leak sensitive information about user behavior or internal URL structures.

By setting an appropriate referrer policy, developers can:
- **Reduce information leakage** when users navigate to external websites
- **Protect user privacy** by limiting the sharing of referrer URLs
- **Improve security** by preventing sensitive URL parameters from being exposed
- **Control behavior** across same-origin and cross-origin requests

## Specification Status

- **Current Status**: Candidate Recommendation (CR)
- **Official Specification**: [W3C Referrer Policy](https://www.w3.org/TR/referrer-policy/)

## Categories

- **Security**

## Use Cases & Benefits

### Privacy Protection
- Prevent referrer URLs containing sensitive information from being exposed to third-party sites
- Hide browsing patterns and URL parameters that could identify users

### Security Enhancement
- Reduce the risk of information leakage through HTTP referer headers
- Control what information external services receive about user navigation

### Cross-Origin Requests
- Manage referrer behavior when making requests across different origins
- Implement different policies for internal and external navigation

### Compliance
- Meet privacy requirements and regulations by controlling data exposure
- Implement privacy-by-default mechanisms in web applications

## Implementation Methods

Referrer Policy can be implemented in three ways:

### 1. HTTP Response Header
```http
Referrer-Policy: strict-origin-when-cross-origin
```

### 2. HTML Meta Tag
```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```

### 3. HTML Attribute
```html
<a href="https://example.com" referrerpolicy="no-referrer">Link</a>
```

## Policy Values

| Policy | Behavior |
|--------|----------|
| `no-referrer` | Never send referrer information |
| `no-referrer-when-downgrade` | Send full referrer for same-security requests, none for downgraded connections |
| `same-origin` | Send referrer only for same-origin requests |
| `origin` | Send only the origin URL as referrer |
| `strict-origin` | Send origin only for same-security requests |
| `origin-when-cross-origin` | Send full referrer for same-origin, origin only for cross-origin |
| `strict-origin-when-cross-origin` | Send full referrer for same-origin/same-security, origin for cross-origin same-security, none for downgraded |
| `unsafe-url` | Always send full referrer (not recommended) |

## Browser Support

### Current Implementation Status

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 61+ | ✅ Full | Basic support from v61; all values supported from v85+ |
| | 21-60 | ⚠️ Partial | Missing `same-origin`, `strict-origin`, `strict-origin-when-cross-origin` |
| **Edge** | 79+ | ✅ Full | Full support from v85+ |
| | 12-78 | ⚠️ Partial | Limited to `origin` value only |
| **Firefox** | 36+ | ✅ Full | Basic support from v36; all values from v87+ |
| | 92+ | ⚠️ Modified | Ignores `unsafe-url`, `no-referrer-when-downgrade`, `origin-when-cross-origin` |
| **Safari** | 11.1+ | ✅ Full | Basic support from v11.1; full from v15+ |
| | 7.1-11 | ⚠️ Partial | Limited to `origin` value only |
| **Opera** | 15+ | ✅ Full | Full support from v73+ |
| **iOS Safari** | 12.0+ | ✅ Full | Basic support from v12.0; full from v15+ |
| **Android** | 4.4.3+ | ✅ Full | Support varies by version |
| **Samsung Internet** | 5.0+ | ✅ Full | Full support from v14+ |
| **Opera Mini** | All | ❌ None | Not supported |

### Support Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully supported |
| ⚠️ | Partially supported / Limited support |
| ❌ | Not supported |

## Implementation Notes

### Note #1: Early Draft Support
Browsers initially supported an [early draft](https://wiki.whatwg.org/wiki/Meta_referrer) of the specification which can only use a meta tag and is only compatible with the `origin` value from the new spec.

**Affected browsers**: IE 11, Edge 12-18, Safari 7.1-11, iOS Safari 8-11.4

### Note #2: Chrome Limited Support (v21-60)
Chrome 21-60 did not support the `same-origin`, `strict-origin`, and `strict-origin-when-cross-origin` values.

**Reference**: [Chromium Issue #627968](https://bugs.chromium.org/p/chromium/issues/detail?id=627968)

### Note #3: Default Policy Changes
Older browsers defaulted to `no-referrer-when-downgrade` which is unsafe. The default has been updated to `strict-origin-when-cross-origin` which is safe for most use cases.

**Reference**: [Revised Specification](https://github.com/w3c/webappsec-referrer-policy/pull/142)

**Affected browsers**: Edge 79-84, Firefox 36-86, Chrome 61-84, Opera 15-72, iOS Safari 11.1-14.4, Android browser, Samsung Internet 5.0-13.0

### Note #4: Safari ITP Behavior
[Safari's ITP](https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/) (Intelligent Tracking Prevention, on by default) downgrades _all_ cross-site subresource requests (not page navigation) `Referer` headers to the page's origin, ignoring the `unsafe-url`, `no-referrer-when-downgrade`, and `origin-when-cross-origin` referrer policies.

**Affected browsers**: Safari 13+, iOS Safari 13.3+

### Note #5: Firefox Policy Restrictions
[Firefox 92+ ignores](https://bugzilla.mozilla.org/show_bug.cgi?id=1720294) the `unsafe-url`, `no-referrer-when-downgrade`, and `origin-when-cross-origin` referrer policies, defaulting to `strict-origin-when-cross-origin`.

**Affected browsers**: Firefox 92+, Android Firefox 144+

## Global Usage Statistics

- **Full Support**: 92.79%
- **Partial Support**: 0.74%
- **Total Awareness**: 93.53%

## Relevant Resources

### Official Documentation
- [W3C Referrer Policy Specification](https://www.w3.org/TR/referrer-policy/)

### Articles & Guides
- [Mozilla Security Blog: Meta Referrer](https://blog.mozilla.org/security/2015/01/21/meta-referrer/)
- [Scott Helme: A new security header: Referrer Policy](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)

### Related Specifications
- [W3C Web Application Security](https://www.w3.org/TR/#security)
- [OWASP Privacy](https://owasp.org/www-project-top-ten/)

## Best Practices

### Recommended Policy

For most websites, **`strict-origin-when-cross-origin`** is the recommended default:
- Sends full referrer for same-origin requests
- Sends only origin for cross-origin requests
- Sends no referrer when protocol downgrades (HTTPS → HTTP)
- Balances privacy and functionality

### Setting the Policy

```html
<!-- Recommended approach using meta tag -->
<meta name="referrer" content="strict-origin-when-cross-origin">

<!-- Or using HTTP header (preferred for production) -->
<!-- Referrer-Policy: strict-origin-when-cross-origin -->
```

### Privacy-First Policy

For applications with high privacy requirements, use **`no-referrer`**:
```html
<meta name="referrer" content="no-referrer">
```

### Per-Link Policy

For specific links requiring different behavior:
```html
<a href="https://external-site.com" referrerpolicy="no-referrer">
  Privacy-protected link
</a>
```

## Compatibility Considerations

### Desktop Browsers
- Modern browsers (Chrome 85+, Firefox 87+, Safari 15+, Edge 85+) have full support
- Older versions have limited support or only support `origin` value

### Mobile Browsers
- iOS Safari 15+ and Android browsers 4.4.3+ have good coverage
- Opera Mini does not support Referrer Policy

### Fallback Strategy

For maximum compatibility, use the HTTP header in combination with meta tag:
1. HTTP header is processed first (recommended approach)
2. Meta tag serves as fallback
3. Per-link attributes override both for individual links

---

**Last Updated**: 2025
**Source**: [Can I Use - Referrer Policy](https://caniuse.com/referrer-policy)
