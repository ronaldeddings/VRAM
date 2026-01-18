# rel=noopener

## Overview

The `rel=noopener` link relation type provides a security mechanism to prevent new browsing contexts from having access to the opener's `window` object through the `window.opener` property. This helps protect users from potential security vulnerabilities when opening external or untrusted links.

## Description

Ensure new browsing contexts are opened without a useful `window.opener`. When a hyperlink is clicked and opens a new tab or window, the newly opened page can potentially access the original page through JavaScript via `window.opener`. This creates a security vulnerability known as "tabnabbing," where a malicious page could redirect the original tab to a phishing site or perform unauthorized actions.

The `rel=noopener` attribute prevents this attack by ensuring that the opened page cannot access `window.opener`.

## Specification Status

**Status:** Living Standard (ls)

**Specification URL:** [WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/semantics.html#link-type-noopener)

The feature is part of the official WHATWG HTML Living Standard, making it a stable and standardized web platform feature.

## Categories

- **DOM** - Document Object Model manipulation
- **HTML5** - HTML5 specifications and elements
- **Security** - Security-related features and protections

## Benefits & Use Cases

### Primary Benefits

1. **Tabnabbing Prevention** - Protects against attacks where opened pages redirect the original tab
2. **Security Isolation** - Ensures proper security boundaries between different browsing contexts
3. **User Protection** - Safeguards users when clicking on external or untrusted links
4. **Best Practice** - Recommended for all external links by security standards (OWASP, MDN)
5. **Performance** - Can improve performance as opened documents don't need to maintain a reference to the opener

### Common Use Cases

- **External Links** - Links to external websites where trust cannot be guaranteed
- **User-Generated Content** - Links posted by users that may be malicious
- **Third-Party Content** - Links from advertisements, comments, or other untrusted sources
- **Social Media Sharing** - When implementing share buttons or link generation
- **Analytics & Tracking** - Links in tracking or analytics systems

## Usage Example

### HTML

```html
<!-- Basic usage with rel=noopener -->
<a href="https://external-site.com" rel="noopener">Visit External Site</a>

<!-- Combined with rel=noreferrer for complete isolation -->
<a href="https://example.com" rel="noopener noreferrer">Open Link</a>

<!-- Target blank with security -->
<a href="https://untrusted.com" target="_blank" rel="noopener">Open in New Tab</a>
```

### JavaScript

```javascript
// Using window.open() with noopener
window.open('https://external-site.com', '_blank', 'noopener=true');

// Note: The noopener behavior is automatically applied in modern browsers
// when using target="_blank" with rel="noopener"
```

## Browser Support

### Overall Support

Global usage: **93.06%** of users have browser support for this feature.

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|---------------|---|
| **Chrome** | 49 (2016) | ✅ Supported (all versions from 49+) |
| **Firefox** | 52 (2017) | ✅ Supported (all versions from 52+) |
| **Safari** | 10.1 (2016) | ✅ Supported (all versions from 10.1+) |
| **Edge** | 79 (2020) | ✅ Supported (all versions from 79+) |
| **Opera** | 36 (2015) | ✅ Supported (all versions from 36+) |
| **Internet Explorer** | ❌ Not Supported | All versions unsupported |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|---|
| **Chrome Mobile (Android)** | 142 | ✅ Supported |
| **Firefox Mobile** | 144 | ✅ Supported |
| **Safari iOS** | 10.3 (2017) | ✅ Supported (all versions from 10.3+) |
| **Opera Mobile** | 80 | ✅ Supported |
| **Samsung Internet** | 5.0 (2017) | ✅ Supported (all versions from 5.0+) |
| **Opera Mini** | ❌ Not Supported | All versions unsupported |
| **Android Browser** | 142 | ✅ Supported |
| **BlackBerry Browser** | ❌ Not Supported | All versions unsupported |
| **UC Browser (Android)** | 15.5 | ✅ Supported |
| **QQ Browser (Android)** | 14.9 | ✅ Supported |
| **Baidu Browser** | 13.52 | ✅ Supported |
| **KaiOS** | 3.0-3.1 | ✅ Supported |

## Known Issues & Notes

### Chromium Bug with window.open()

**Issue:** Chromium 49 and newer [ignores other window.open API features](https://www.ctrl.blog/entry/tabnabbing-window-size-position.html) (like setting dimensions and position) when called with `noopener` or `noreferrer`.

**Impact:** When using `window.open()` with the `noopener` feature, browsers cannot apply window positioning and sizing parameters. This is a trade-off between security and window control functionality.

**Workaround:** If you need both window control and security, consider:
- Using `rel=noreferrer` alone (though `noopener` is recommended)
- Implementing server-side redirects instead of JavaScript window.open()
- Using CSS-based solutions for opening links in new tabs

## Related Features & Best Practices

### Complementary Attributes

- **rel=noreferrer** - Strips referrer information and implies noopener behavior
- **target="_blank"** - Opens link in new tab (when combined with rel=noopener for security)

### Recommended Approach

For maximum security with external links:

```html
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

This combination provides:
- **noopener** - Prevents access to window.opener
- **noreferrer** - Removes referrer information from the request
- **target="_blank"** - Opens in a new tab

## References

### Official Resources

- [WHATWG HTML Specification - rel=noopener](https://html.spec.whatwg.org/multipage/semantics.html#link-type-noopener)
- [Mathias Bynens - Explainer Article](https://mathiasbynens.github.io/rel-noopener/)

### Browser Issues

- [Firefox/Gecko Implementation Issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1222516)
- [Safari/WebKit Implementation Issue](https://bugs.webkit.org/show_bug.cgi?id=155166)
- [Chromium Issue - window.open() Features](https://www.ctrl.blog/entry/tabnabbing-window-size-position.html)

### Security References

- [OWASP - Tabnabbing](https://owasp.org/www-community/attacks/Tabnabbing)
- [MDN - rel=noopener](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#noopener)

## Implementation Checklist

- [ ] Review all external links in your application
- [ ] Add `rel="noopener"` to links with `target="_blank"`
- [ ] Consider combining with `rel="noreferrer"` for complete isolation
- [ ] Update user-generated content links to include the attribute
- [ ] Test in target browsers, especially older versions
- [ ] Update security policies and coding standards
- [ ] Consider automatic rewriting of links in server-side code

## Summary

The `rel=noopener` attribute is a well-supported, essential security feature for modern web applications. With 93% global browser support and backing from all major browser vendors (except Internet Explorer), it should be considered a standard practice for any external links. The feature prevents tabnabbing attacks and protects users from malicious page redirects, making it an important part of a comprehensive web security strategy.
