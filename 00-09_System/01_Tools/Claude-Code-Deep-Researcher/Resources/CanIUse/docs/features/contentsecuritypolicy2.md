# Content Security Policy Level 2 (CSP2)

## Overview

Content Security Policy Level 2 (CSP2) is a powerful security mechanism that helps mitigate cross-site scripting (XSS) attacks and other code injection vulnerabilities. CSP2 extends the original CSP specification by introducing hash-based and nonce-based source validation, along with five additional directives for more granular control over resource loading policies.

### What is Content Security Policy?

CSP is an HTTP response header that allows web developers to control which resources can be loaded and executed in a web page. By restricting resource loading to only trusted sources, developers can significantly reduce the attack surface for malicious script injection attacks.

### Key Features of CSP2

CSP2 introduces important enhancements over CSP Level 1:

- **Nonce Support**: Allow inline scripts/styles by providing a unique nonce token
- **Hash Support**: Permit specific inline scripts/styles by their cryptographic hash
- **Additional Directives**: Five new directives for enhanced control:
  - `child-src` - Controls embedded browsing contexts (frames, embeds, objects)
  - `form-action` - Restricts where forms can submit
  - `frame-ancestors` - Prevents clickjacking by controlling frame embedding
  - `base-uri` - Restricts the `<base>` element URL
  - `plugin-types` - Controls plugin loading (deprecated in CSP3)

---

## Specification & Standards

| Property | Details |
|----------|---------|
| **Status** | ![Recommended Badge](https://img.shields.io/badge/Status-Recommended%20(REC)-blue) |
| **Specification** | [W3C Content Security Policy Level 2](https://www.w3.org/TR/CSP2/) |
| **Release Date** | 2016 |
| **Latest Version** | [CSP Level 3](https://w3c.github.io/webappsec-csp/) (in development) |

---

## Categories

- **Security** - Enables secure web application development practices

---

## Use Cases & Benefits

### Primary Use Cases

1. **XSS Attack Prevention**
   - Restrict script execution to trusted sources only
   - Prevent inline script injection attacks
   - Use nonces or hashes to allow necessary inline scripts

2. **Data Exfiltration Protection**
   - Control where form data can be submitted
   - Restrict connections to specific domains via `connect-src`
   - Monitor or block unexpected data transfers

3. **Clickjacking Mitigation**
   - Use `frame-ancestors` directive to control frame embedding
   - Prevent attacks where your site is framed in malicious pages

4. **Framing Control**
   - Restrict embedded content with `child-src`
   - Control third-party embed security policies

5. **Content Security Monitoring**
   - Report violations via `report-uri` or `report-to`
   - Monitor for policy violations in production
   - Identify and respond to security threats

### Business Benefits

- **Reduced Security Risk**: Minimizes impact of XSS vulnerabilities
- **Compliance Support**: Helps meet security compliance requirements
- **User Trust**: Demonstrates commitment to security
- **Attack Surface Reduction**: Limits attacker capabilities

### Technical Benefits

- **Defense in Depth**: Adds security layer beyond input validation
- **Namespace Isolation**: Prevents scripts from accessing certain APIs
- **Sandbox Effects**: Can be used to limit script capabilities
- **Violation Reporting**: Real-time security monitoring and alerting

---

## Basic Implementation Examples

### Simple Policy (Allow Same-Origin Only)

```http
Content-Security-Policy: default-src 'self'
```

This policy:
- Allows all resources from the same origin
- Blocks all inline scripts and styles
- Blocks third-party resources

### Using Nonces for Inline Scripts

```html
Content-Security-Policy: script-src 'nonce-random-base64-value'
```

```html
<script nonce="random-base64-value">
  console.log('This inline script is allowed');
</script>

<!-- This will be blocked -->
<script>
  console.log('This inline script is blocked');
</script>
```

### Using Hashes for Inline Styles

```http
Content-Security-Policy: style-src 'sha256-hash-of-css-content'
```

```html
<style>
  body { color: red; }
</style>
```

The hash is calculated as: `sha256(body { color: red; })`

### Multi-Directive Policy

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://trusted.example.com;
  style-src 'self' https://fonts.googleapis.com;
  img-src 'self' https: data:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  form-action 'self';
  frame-ancestors 'none'
```

---

## Browser Support

### Summary

CSP2 has excellent modern browser support with over 93% global usage coverage. Legacy browsers and Internet Explorer have no support.

### Detailed Browser Support Table

| Browser | First Full Support | Partial Support | Notes |
|---------|-------------------|-----------------|-------|
| **Chrome** | 40 | 36-39 | Earlier versions missing some directives |
| **Firefox** | 45 | 31-44 | Progressive directive support additions |
| **Safari** | 10 | None | Full support from version 10 onwards |
| **Edge** | 79 | 15-18 | **Broken nonce support in older versions** ⚠️ |
| **Opera** | 27 | 23-26 | Earlier versions missing some directives |
| **iOS Safari** | 10.0 | None | Parallels desktop Safari support |
| **Android** | 142 | None | Limited support in older Android browsers |
| **Samsung Internet** | 4 | None | Full support from version 4 onwards |
| **Internet Explorer** | ❌ None | None | No support in any IE version |
| **Opera Mini** | ❌ All Versions | None | No support |

### Version-by-Version: Major Browsers

#### Chrome & Chromium-based

```
✓ Full Support: Chrome 40+
△ Partial: Chrome 36-39 (missing child-src, frame-ancestors, base-uri, form-action)
△ Partial: Chrome 39 (missing child-src, base-uri, form-action)
```

#### Firefox

```
✓ Full Support: Firefox 45+
△ Partial: Firefox 31-34 (missing child-src, frame-ancestors, base-uri, form-action)
△ Partial: Firefox 35 (missing child-src, frame-ancestors, form-action)
△ Partial: Firefox 36-44 (missing child-src)
```

#### Safari & iOS Safari

```
✓ Full Support: Safari 10+
✓ Full Support: iOS Safari 10.0+
```

#### Microsoft Edge

```
✓ Full Support: Edge 79+
△ Partial: Edge 15-18 (broken nonce support)
```

#### Opera

```
✓ Full Support: Opera 27+
△ Partial: Opera 23-26 (similar directive restrictions as Chrome)
```

### Global Usage Coverage

- **Full Support**: 93.15% of tracked browsers
- **Partial Support**: 0.04% of tracked browsers
- **No Support**: 6.81% of tracked browsers

---

## Known Issues & Bugs

### Edge Nonce Support Bug (Critical)

**Severity**: Medium | **Status**: Documented Issue

Edge versions 15-18 have broken nonce support:

> Partial support in Edge refers to [broken nonce support](https://web.archive.org/web/20171203124125/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/13246371/) which will lead to breakages since sourced script tags with a valid nonce will get blocked.

**Impact**:
- Valid nonces on inline scripts are ignored
- Scripts with valid nonces may be unexpectedly blocked
- Workarounds needed for Edge 15-18 deployments

**Workaround**:
- Use `'unsafe-inline'` for Edge 15-18 if nonces are critical
- Target feature detection and fallback policies
- Update to Edge 79+ (full support)

### Early Version Directive Limitations

Earlier browser versions have incomplete directive support:

| Version Range | Missing Directives |
|---|---|
| Chrome 36-38, Opera 23-25 | `child-src`, `frame-ancestors`, `base-uri`, `form-action` |
| Chrome 39, Opera 26 | `child-src`, `base-uri`, `form-action` |
| Firefox 31-34 | `child-src`, `frame-ancestors`, `base-uri`, `form-action` |
| Firefox 35 | `child-src`, `frame-ancestors`, `form-action` |
| Firefox 36-44 | `child-src` |

**Recommendation**: Use `default-src` as fallback for newer directives in older browsers.

---

## Migration & Compatibility

### From CSP Level 1

If upgrading from CSP Level 1, you can now leverage:

1. **Nonces** - Easier inline script management without `'unsafe-inline'`
2. **Hashes** - Hash-based inline style/script validation
3. **Frame Ancestors** - More specific clickjacking protection
4. **Form Action** - Explicit form submission control
5. **Base URI** - Control over document base URL

### Implementation Strategy

```http
/* Maintain Level 1 compatibility while adding Level 2 features */
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://trusted.com;  /* L1 fallback */
  script-src 'self' 'nonce-abc123' https://trusted.com;   /* L2 enhanced */
  style-src 'self' 'unsafe-inline';                        /* L1 fallback */
  style-src 'self' 'sha256-hash...';                       /* L2 enhanced */
```

---

## Best Practices

### 1. Start Strict, Relax Cautiously

```http
/* Start with maximum restriction */
Content-Security-Policy: default-src 'none'
```

Then add necessary exceptions only after testing:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' https:;
  font-src 'self';
```

### 2. Use Nonces for Critical Inline Scripts

Instead of `'unsafe-inline'`:

```html
<script nonce="random-unique-value">
  /* Application initialization code */
</script>
```

Generate a new random nonce for each page load to prevent nonce reuse attacks.

### 3. Hash Styles with Care

```http
Content-Security-Policy:
  style-src 'sha256-abcdef123456...' 'sha256-xyz789...'
```

Benefits:
- No nonce expiration
- Better caching
- Explicit style control

### 4. Report Violations

```http
Content-Security-Policy:
  default-src 'self';
  report-uri https://your-domain.com/csp-report
```

Monitor violations to:
- Identify policy issues
- Detect attempted attacks
- Refine your policy over time

### 5. Test Before Deployment

Use `Content-Security-Policy-Report-Only` header first:

```http
Content-Security-Policy-Report-Only:
  /* Your policy here */
```

This mode:
- Reports violations without blocking
- Helps identify compatibility issues
- Zero user impact

### 6. Avoid `'unsafe-eval'` and `'unsafe-inline'`

These directives significantly weaken security:

```http
/* ❌ AVOID */
script-src 'self' 'unsafe-inline' 'unsafe-eval'

/* ✓ PREFER */
script-src 'self' 'nonce-...'
```

### 7. Use Frame Ancestors for Clickjacking

```http
/* Prevent any framing */
frame-ancestors 'none'

/* Allow specific parent frames */
frame-ancestors https://trusted-parent.com

/* Allow same-origin framing only */
frame-ancestors 'self'
```

---

## Advanced Features

### Directive Reference Summary

| Directive | Purpose | Example |
|-----------|---------|---------|
| `default-src` | Fallback for all other directives | `'self'` |
| `script-src` | Inline and external scripts | `'self' 'nonce-...'` |
| `style-src` | Inline and external styles | `'self' 'sha256-...'` |
| `img-src` | Image resources | `https: data:` |
| `font-src` | Font resources | `'self' https://fonts.googleapis.com` |
| `child-src` | Embedded frames, embeds, objects | `'none'` |
| `form-action` | Form submission targets | `'self'` |
| `frame-ancestors` | Document framing | `'none'` |
| `base-uri` | Base URL for document | `'self'` |
| `plugin-types` | Allowed plugin MIME types | `application/pdf` |
| `connect-src` | XHR, WebSocket, fetch targets | `'self' https://api.example.com` |
| `report-uri` | Violation reporting endpoint | `https://example.com/csp-report` |

### Nonce vs Hash Comparison

| Feature | Nonce | Hash |
|---------|-------|------|
| **Expiration** | Per request | Never |
| **Content Change** | Can reuse on same content | Hash changes with content |
| **Caching** | More complex | Cached reliably |
| **Flexibility** | Highly flexible | Static content only |
| **Performance** | Slight overhead | No overhead |
| **Use Case** | Inline scripts, dynamic content | Inline styles, static content |

---

## Testing & Validation

### Check CSP Headers

```bash
# Check if site has CSP headers
curl -I https://example.com | grep -i "content-security-policy"
```

### Browser DevTools Testing

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for CSP violation messages
4. Check Network tab for blocked resources

### Online CSP Validators

- [CSP Evaluator](https://csp-evaluator.withgoogle.com/) - Google's CSP policy analyzer
- [CSP Validator](https://github.com/cure53/XSSChallengeWiki/wiki) - Security analysis tool

### Testing Policy Changes

Always use `Content-Security-Policy-Report-Only` first:

```http
/* Test your policy without blocking */
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'nonce-...';
  report-uri https://example.com/csp-report
```

Once satisfied, switch to enforcement mode:

```http
/* Now enforce the policy */
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-...';
  report-uri https://example.com/csp-report
```

---

## Common Implementation Patterns

### Static Site with CDN

```http
Content-Security-Policy:
  default-src 'self' https://cdn.example.com;
  script-src 'self' https://cdn.example.com https://analytics.example.com;
  style-src 'self' https://cdn.example.com https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' https: data:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  form-action 'self'
```

### Single Page Application (SPA)

```http
Content-Security-Policy:
  default-src 'none';
  script-src 'self' 'nonce-{random-token}' https://analytics.example.com;
  style-src 'self' 'nonce-{random-token}';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.example.com wss://realtime.example.com;
  form-action 'self';
  frame-ancestors 'none';
  base-uri 'self';
  report-uri https://example.com/csp-report
```

### Third-Party Widget Embedding

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://widget-provider.com;
  style-src 'self' 'unsafe-inline' https://widget-provider.com;
  frame-src https://widget-provider.com;
  connect-src 'self' https://widget-provider.com;
  form-action 'self'
```

---

## Related Resources

### Official Documentation

- [W3C Content Security Policy Level 2 Specification](https://www.w3.org/TR/CSP2/)
- [MDN Web Docs - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HTML5Rocks CSP Tutorial](https://www.html5rocks.com/en/tutorials/security/content-security-policy/)

### Learning Resources

- [OWASP: Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Content Security Policy Quick Reference](https://content-security-policy.com/)
- [CSP Evaluator Tool](https://csp-evaluator.withgoogle.com/)

### Related Web Platform Features

- [CSP Level 3 (Next Generation)](https://w3c.github.io/webappsec-csp/) - In development with additional features
- [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) - Hash-based resource validation
- [Feature Policy / Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy) - Granular feature control

### Security Standards

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - A03:2021 Injection (XSS prevention)
- [CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')](https://cwe.mitre.org/data/definitions/79.html)

---

## See Also

- **CSP Level 1** - Original Content Security Policy specification
- **CSP Level 3** - Next-generation CSP with additional features
- **Subresource Integrity** - Cryptographic validation of external resources
- **Feature Policy** - Control over browser features and APIs
- **X-Frame-Options** - Legacy clickjacking prevention (superseded by frame-ancestors)

---

## Metadata

| Property | Value |
|----------|-------|
| **Last Updated** | 2024 |
| **Usage Coverage** | 93.19% |
| **Can I Use ID** | 4957003285790720 |
| **Keywords** | csp, header, nonce, hash, security, xss-prevention |
| **Category** | Security |

---

> This documentation is based on [Can I Use](https://caniuse.com/) data and W3C specifications. For the most current support information, please refer to the official sources.
