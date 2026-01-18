# SameSite Cookie Attribute

## Overview

The `SameSite` cookie attribute is a security feature that allows web servers to mitigate Cross-Site Request Forgery (CSRF) and information leakage attacks by asserting that a particular cookie should only be sent with requests initiated from the same registrable domain.

## Description

Same-site cookies (also referred to as "First-Party-Only" or "First-Party" cookies) provide an additional layer of security for session management and authentication. By restricting when cookies are sent in cross-site contexts, this feature helps prevent unauthorized requests from malicious websites that attempt to use a user's credentials without their knowledge.

## Specification

- **Status**: Other (Draft)
- **Specification URL**: [RFC 6265bis - HTTP State Management Mechanism](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-07)
- **Current Usage**: 91.95% (Y) + 0.44% (A) = 92.39% of users

## Categories

- Security

## Key Benefits & Use Cases

### Security Benefits

1. **CSRF Protection**: Prevents attackers from tricking users into making unwanted requests to other sites
2. **Information Leakage Prevention**: Reduces the risk of sensitive information being leaked across sites
3. **Session Hijacking Mitigation**: Helps protect authentication tokens and session cookies

### Primary Use Cases

- **Authentication Cookies**: Securing login sessions by restricting cookie transmission
- **Session Management**: Ensuring cookies are only sent in legitimate same-site contexts
- **API Requests**: Protecting API endpoints from unauthorized cross-site requests
- **Form Submissions**: Safeguarding state-changing operations from CSRF attacks

## SameSite Attribute Values

### Strict
```
Set-Cookie: sessionid=abc123; SameSite=Strict
```
- Cookies are only sent with same-site requests
- Most restrictive, highest security
- May impact legitimate cross-site navigation

### Lax
```
Set-Cookie: sessionid=abc123; SameSite=Lax
```
- Cookies are sent with same-site requests and top-level navigation (GET requests)
- Default behavior in most modern browsers (as of 2020)
- Balances security with usability

### None
```
Set-Cookie: sessionid=abc123; SameSite=None; Secure
```
- Cookies are sent with all requests, including cross-site
- Requires `Secure` attribute to be set (HTTPS only)
- Used when cross-site cookie transmission is necessary

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Support | Notes |
|---------|---|---|---|
| **Chrome** | 51 | ✅ Full Support (v51+) | Default Lax behavior since v80 (#3) |
| **Firefox** | 60 | ✅ Full Support (v60+) | Enabled by default |
| **Safari** | 15 | ✅ Full Support (v15+) | Partial support in v12-14 (#4, #5) |
| **Edge** | 16 | ✅ Full Support (v16+) | Full support v18+ (#1) |
| **Opera** | 39 | ✅ Full Support (v39+) | Default Lax behavior since v71 (#3) |
| **Internet Explorer** | 11 | ⚠️ Partial (Windows 10 RS3+) | Limited support, requires specific OS version (#1, #2) |

### Mobile Browsers

| Browser | First Support | Current Support | Notes |
|---------|---|---|---|
| **iOS Safari** | 13.0 | ✅ Full Support (v13+) | Partial support in v12.0-12.5 (#5) |
| **Android Chrome** | 51+ | ✅ Full Support | Default Lax behavior since v80 (#3) |
| **Android Firefox** | 60+ | ✅ Full Support | |
| **Samsung Internet** | 5.0 | ✅ Full Support (v5.0+) | |
| **Opera Mobile** | 80+ | ✅ Full Support (v80+) | Default Lax behavior (#3) |
| **Android UC Browser** | <15.5 | ❌ No Support | |
| **Opera Mini** | — | ❌ No Support | |

### Summary Statistics

- **Full Support**: 91.95% of users
- **Partial Support**: 0.44% of users
- **No Support**: 7.61% of users (mainly legacy browsers and Opera Mini)

## Browser Support Notes

### #1: Microsoft Edge (v16-17)
Not shipped with the initial release but was added later with the 2018 June security update (Patch Tuesday) to Windows 10 RS3 (2017 Fall Creators Update) and newer. More information: [GitHub Issue #616](https://github.com/MicrosoftEdge/Status/issues/616)

### #2: Internet Explorer 11 Limited Support
Partial support because SameSite is only supported in IE 11 on Windows 10 RS3 (2017 Fall Creators Update) and newer, but not in IE 11 on other Windows versions (Windows 7, etc.).

### #3: Default Lax Behavior
Cookies without an explicit `SameSite` attribute are treated as `Lax` by default. Additionally, `SameSite=None` cookies without the `Secure` attribute are rejected by the browser.

### #4: Safari macOS Support
Partial support due to limited support in macOS before 10.14 Mojave.

### #5: Safari SameSite=None Bug
Partial support due to [a bug in WebKit](https://bugs.webkit.org/show_bug.cgi?id=198181) that treats `SameSite=None` and invalid values as `Strict` in:
- macOS before 10.15 Catalina
- iOS before 13

## Known Issues & Workarounds

### Issue 1: Safari Authentication Flow Failures (Resolved)

**Affected Browsers:**
- Safari on macOS before 10.14.4
- iOS Safari before 12.2

**Problem**: Some authentication flows with cross-site identity providers might fail when `SameSite=Lax` is used.

**Workaround**: See [explanation and workaround](https://brockallen.com/2019/01/11/same-site-cookies-asp-net-core-and-external-authentication-providers/)

**Reference**: [WebKit Bug #188165](https://bugs.webkit.org/show_bug.cgi?id=188165#c43)

### Issue 2: Safari Manual Redirection Link Bug

**Affected Browsers:**
- Safari before 12.1.1
- iOS Safari before 12.3

**Problem**: When manually visiting a redirection link to a cross-site URL, `Lax` cookies are omitted from the cross-site request.

**Reference**: [WebKit Bug #196375](https://bugs.webkit.org/show_bug.cgi?id=196375)

**Status**: Fixed in Safari 12.1.1+ and iOS 12.3+

## Implementation Guide

### Basic Implementation

```http
Set-Cookie: sessionid=abc123; Path=/; SameSite=Lax
```

### With Additional Security Attributes

```http
Set-Cookie: sessionid=abc123; Path=/; SameSite=Lax; HttpOnly; Secure
```

### For Cross-Site Cookies (Use Cautiously)

```http
Set-Cookie: tracking=xyz789; Path=/; SameSite=None; Secure; Domain=example.com
```

### Common Patterns

**Authentication Cookies:**
```
Set-Cookie: auth_token=...; SameSite=Strict; HttpOnly; Secure; Path=/
```

**Preference Cookies:**
```
Set-Cookie: theme=dark; SameSite=Lax; Secure; Path=/
```

**Tracking Cookies:**
```
Set-Cookie: tracking_id=...; SameSite=None; Secure; Domain=.example.com
```

## Backwards Compatibility

This feature is **fully backwards compatible**. Browsers that do not support the `SameSite` attribute will simply treat the cookie as a regular cookie without any same-site restrictions. There is no need to deliver different cookies to clients based on browser support.

## Related Technologies

- **CSRF Tokens**: Complementary protection mechanism
- **HttpOnly Attribute**: Prevents JavaScript access to cookies
- **Secure Attribute**: Restricts cookies to HTTPS connections
- **Domain Attribute**: Specifies which domains can access the cookie
- **Path Attribute**: Restricts cookies to specific URL paths

## Migration Timeline

- **2016**: Proposal introduced in HTTP state management standards
- **2017**: Chrome (51+) and Edge (16+) implement support
- **2018**: Firefox (60+) implements support
- **2019**: Browsers begin enforcing `SameSite=Lax` by default
- **2020**: Most modern browsers treat cookies as `SameSite=Lax` by default
- **Present**: Standard practice for web security

## References & Additional Resources

### Official Documentation & Proposals
- [SameSite Cookie Attribute at WebKit Bugzilla](https://bugs.webkit.org/show_bug.cgi?id=188165)
- [Mozilla Bug #795346: Add SameSite support for cookies](https://bugzilla.mozilla.org/show_bug.cgi?id=795346)
- [Mozilla Bug #1286861: SameSite support implementation](https://bugzilla.mozilla.org/show_bug.cgi?id=1286861)
- [Mozilla Bug #1551798: Prototype SameSite=Lax by default](https://bugzilla.mozilla.org/show_bug.cgi?id=1551798)

### Browser Status & Tracking
- [Microsoft Edge Browser Status](https://developer.microsoft.com/en-us/microsoft-edge/status/samesitecookies/)
- [MS Edge dev blog: Previewing support for same-site cookies](https://blogs.windows.com/msedgedev/2018/05/17/samesite-cookies-microsoft-edge-internet-explorer/)

### Educational Resources
- [Preventing CSRF with the same-site cookie attribute](https://www.sjoerdlangkemper.nl/2016/04/14/preventing-csrf-with-samesite-cookie-attribute/)
- [Same-site cookies demonstration by Rowan Merewood](https://peaceful-wing.glitch.me)

### Related Standards
- [RFC 6265 - HTTP State Management Mechanism](https://tools.ietf.org/html/rfc6265)
- [OWASP: Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)

## Summary

The `SameSite` cookie attribute is a widely supported, backwards-compatible security feature that should be implemented as part of a comprehensive web security strategy. With 92.39% global browser support, it provides essential protection against CSRF and information leakage attacks. Modern best practices recommend using `SameSite=Lax` as the default for most cookies, with `SameSite=Strict` for sensitive operations and `SameSite=None; Secure` only when cross-site cookies are explicitly required.

---

*Last Updated: 2025*
*Data Source: CanIUse*
