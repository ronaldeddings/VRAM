# Upgrade Insecure Requests

## Overview

Upgrade Insecure Requests is a web security feature that allows developers to declare that browsers should transparently upgrade HTTP resources on a website to HTTPS, enhancing security by ensuring that all content is transmitted over encrypted connections.

## Description

The Upgrade Insecure Requests directive instructs the browser to automatically rewrite HTTP URLs to HTTPS before making requests. This is particularly useful for websites that are transitioning to HTTPS or for protecting users from mixed content issues where some resources are served over insecure HTTP while the page itself uses HTTPS.

When enabled, the browser will:
- Transparently upgrade all HTTP resource requests to HTTPS
- Report any resources that cannot be upgraded
- Prevent the loading of insecure resources that cannot be upgraded (depending on CSP configuration)

## Specification

- **W3C Status**: [Candidate Recommendation (CR)](https://www.w3.org/TR/upgrade-insecure-requests/)
- **Specification URL**: https://www.w3.org/TR/upgrade-insecure-requests/

## Categories

- **Security**

## Implementation Methods

### HTTP Header

The most common method is to use the HTTP `Content-Security-Policy` header:

```
Content-Security-Policy: upgrade-insecure-requests
```

### HTML Meta Tag

Alternatively, you can use an HTML meta tag in the `<head>` section:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

## Benefits & Use Cases

### Primary Benefits

1. **Automatic Security Enhancement**: Eliminates mixed content issues without manual URL updates
2. **Transparent Upgrade**: Users don't see broken resources or security warnings
3. **HTTPS Migration Path**: Simplifies the transition from HTTP to HTTPS
4. **Backwards Compatibility**: Works with existing HTTP resources without code changes
5. **Zero User Impact**: Users experience seamless upgrades without interruption

### Common Use Cases

- **Legacy Application Modernization**: Upgrade security of older applications during HTTPS migration
- **Third-Party Content**: Handle mixed content from external sources gracefully
- **API Migration**: Gradually transition API endpoints from HTTP to HTTPS
- **User Privacy**: Ensure all user data is transmitted over encrypted connections
- **SEO Compliance**: Meet Google's preference for HTTPS-served content

## Browser Support

### Overview Statistics

- **Global Usage**: 93.17% of users have browsers that support this feature
- **Active Support**: Supported by all modern browsers (Chrome 43+, Firefox 42+, Edge 17+, Safari 10.1+)
- **Total Coverage**: Extensive support across desktop, mobile, and tablet browsers

### Detailed Browser Support Table

| Browser | First Supported Version | Current Status |
|---------|------------------------|----------------|
| **Chrome** | 43 | ✅ Supported (v43+) |
| **Edge** | 17 | ✅ Supported (v17+) |
| **Firefox** | 42 | ✅ Supported (v42+) |
| **Safari** | 10.1 | ✅ Supported (v10.1+) |
| **Opera** | 30 | ✅ Supported (v30+) |
| **iOS Safari** | 10.3 | ✅ Supported (v10.3+) |
| **Android Browser** | 142 | ✅ Supported |
| **Samsung Internet** | 4 | ✅ Supported (v4+) |
| **Opera Mobile** | 80 | ✅ Supported (v80+) |
| **Android Chrome** | 142 | ✅ Supported |
| **Android Firefox** | 144 | ✅ Supported |
| **UC Browser (Android)** | 15.5 | ✅ Supported |
| **QQ Browser (Android)** | 14.9 | ✅ Supported |
| **Baidu Browser** | 13.52 | ✅ Supported |
| **KaiOS** | 2.5 | ✅ Supported (v2.5+) |
| **Internet Explorer** | — | ❌ Not Supported |
| **Opera Mini** | — | ❌ Not Supported |
| **BlackBerry** | — | ❌ Not Supported |
| **IE Mobile** | — | ❌ Not Supported |

### Desktop Browsers

- **Chrome**: Supported from version 43 onwards (all recent versions)
- **Firefox**: Supported from version 42 onwards (all recent versions)
- **Safari**: Supported from version 10.1 onwards (all recent versions)
- **Edge**: Supported from version 17 onwards (all recent versions)
- **Opera**: Supported from version 30 onwards (all recent versions)

### Mobile Browsers

- **iOS Safari**: Supported from version 10.3 onwards
- **Android Browser**: Supported from version 142
- **Samsung Internet**: Supported from version 4 onwards
- **Opera Mobile**: Supported from version 80 onwards
- **Android Chrome**: Supported (latest versions)
- **Android Firefox**: Supported (latest versions)

### Not Supported

- Internet Explorer (all versions)
- Opera Mini (all versions)
- BlackBerry Browser
- IE Mobile

## Implementation Notes

### Important Details

- The HTTP header value is: `Content-Security-Policy: upgrade-insecure-requests`
- The HTML meta tag syntax is: `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`
- This directive is part of the Content Security Policy (CSP) specification
- Resources that cannot be upgraded will still be blocked (depending on CSP fallback behavior)
- This does not apply to WebSocket connections (they use `ws://` and `wss://`)

### Best Practices

1. **Use HTTPS by Default**: Combine with a proper HTTPS setup
2. **Implement HSTS**: Use HTTP Strict-Transport-Security header for additional security
3. **Monitor Violations**: Use CSP violation reports to identify insecure resources
4. **Test Thoroughly**: Ensure all third-party resources support HTTPS before deploying
5. **Gradual Rollout**: Consider gradually rolling out to ensure no service disruptions

### Browser Behavior

- Browsers that support this directive will automatically upgrade HTTP requests to HTTPS
- If an HTTPS version of a resource is not available, the request may fail (depending on the CSP configuration and fallback)
- The upgrade happens transparently to JavaScript and does not trigger mixed-content warnings
- Network requests initiated by extensions or scripts are also upgraded

## Related Resources

### Official Documentation
- [MDN Web Docs - Upgrade Insecure Requests](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives#upgrade-insecure-requests)

### Examples & Demos
- [Chrome Upgrade Insecure Requests Demo](https://googlechrome.github.io/samples/csp-upgrade-insecure-requests/index.html)

### Feature Requests
- [WebKit Feature Request Bug](https://bugs.webkit.org/show_bug.cgi?id=143653)

## Keyword Tags

- security
- header
- uir
- upgrade-insecure-requests

## Frequently Asked Questions

### Q: Will this break my website?
A: Only if you have resources that don't support HTTPS. Test thoroughly before deploying.

### Q: Should I use both the header and meta tag?
A: The HTTP header is preferred as it's applied before the HTML is parsed. The meta tag serves as a fallback and is useful for environments where HTTP header modification isn't possible.

### Q: Does this affect WebSocket connections?
A: No, WebSockets have their own secure protocol (wss://) which must be explicitly used.

### Q: What happens if a resource cannot be upgraded?
A: Depending on the CSP configuration, the resource may fail to load. You can use CSP violation reports to identify these cases.

### Q: Is this a replacement for HSTS?
A: No, these are complementary. HTTPS Upgrade Insecure Requests handles mixed content, while HSTS prevents downgrade attacks. Use both together for maximum security.

---

**Last Updated**: 2025

**Global Support**: 93.17% of users have browsers that support this feature

**Chrome ID**: 6534575509471232
