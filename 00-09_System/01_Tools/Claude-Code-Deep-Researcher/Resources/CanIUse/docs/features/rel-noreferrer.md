# Link type "noreferrer"

## Overview

The `rel="noreferrer"` link type prevents browsers from sending the HTTP `Referrer` header when users click on links. This ensures that the destination website cannot see which URL the user came from, providing privacy protection.

## Description

When you add `rel="noreferrer"` to an anchor tag, the link operates with the following behavior:

- The `Referrer` HTTP header is not sent with the request
- The destination site has no knowledge of the referral source
- Users' browsing history remains private from the destination site
- The browser does not open the link in the same window or tab context (implied window isolation)

### Example Usage

```html
<!-- Basic usage -->
<a href="https://example.com" rel="noreferrer">External Link</a>

<!-- Combined with other rel values -->
<a href="https://example.com" rel="noopener noreferrer">External Link</a>

<!-- Multiple links -->
<a href="https://external-site.com" rel="noreferrer noopener">
  Click here
</a>
```

## Specification Status

- **Specification**: [HTML Living Standard - Link type "noreferrer"](https://html.spec.whatwg.org/multipage/semantics.html#link-type-noreferrer)
- **Status**: Living Standard (ls)
- **Standards Body**: WHATWG (Web Hypertext Application Technology Working Group)

## Categories

- DOM
- HTML5
- Security

## Use Cases & Benefits

### Privacy Protection
- **User Privacy**: Prevents destination sites from tracking referral sources
- **Sensitive Information**: Ensures URLs containing sensitive query parameters aren't exposed
- **Browsing History**: Keeps the user's navigation history private from external sites

### Security
- **Cross-Site Information Leakage**: Reduces risk of exposing sensitive information through referrer headers
- **Third-Party Links**: Safely link to untrusted external sites without exposing context
- **Malicious Sites**: Limits information available to potentially malicious websites

### Compliance & Policy
- **Privacy Regulations**: Helps meet privacy requirements (GDPR, CCPA, etc.)
- **Data Protection**: Supports data minimization principles
- **Security Policy**: Aligns with secure-by-default practices

### Best Practices
- Use when linking to external, untrusted, or sensitive sites
- Combine with `rel="noopener"` when opening links in new windows/tabs
- Particularly important for user-generated content or dynamic links
- Recommended for all external links in privacy-conscious applications

## Browser Support

### Support Legend
- **y** = Supported
- **n** = Not supported
- **u** = Unknown/Partial support
- **a** = Supported with caveats or notes

### Support Table

#### Desktop Browsers

| Browser | Earliest Support | Current Status | Notes |
|---------|------------------|----------------|-------|
| **Chrome** | 16 | ✅ Full support | v16+ fully supported |
| **Edge** | 13 | ✅ Full support | v13+ fully supported |
| **Firefox** | 33 | ✅ Full support | v33+ fully supported |
| **Safari** | 5 | ✅ Full support | v5+ fully supported |
| **Opera** | 15 | ✅ Full support | v15+ fully supported |
| **Internet Explorer** | Not supported | ❌ Limited | IE11 supported with note #1 |

#### Mobile Browsers

| Platform | Earliest Support | Current Status |
|----------|------------------|----------------|
| **iOS Safari** | 4.0 | ✅ Full support |
| **Android Browser** | 2.3 | ✅ Full support |
| **Chrome Android** | Current | ✅ Full support |
| **Firefox Android** | Current | ✅ Full support |
| **Samsung Internet** | 4 | ✅ Full support |
| **Opera Mobile** | 80 | ✅ Full support |
| **Opera Mini** | All versions | ❌ Not supported |

#### Other Platforms

| Platform | Support Status |
|----------|----------------|
| **BlackBerry** | ✅ Supported (v7+) |
| **UC Browser** | ✅ Supported (v15.5+) |
| **QQ Browser** | ✅ Supported (v14.9+) |
| **Baidu Browser** | ✅ Supported (v13.52+) |
| **KaiOS** | ✅ Supported (v2.5+) |

### Global Browser Support Statistics

- **Full Support (Y)**: 93.21% of global browser usage
- **Partial/Caveated Support (A)**: 0.33% of global browser usage
- **No Support (N)**: 6.46% of global browser usage

## Implementation Notes

### Note #1: Internet Explorer 11
`rel="noreferrer"` is only supported in Internet Explorer 11 when running on Windows 10 Creators Update or later versions.

### Best Practices for Implementation

1. **Combined with noopener**: Always use both attributes when opening external links
   ```html
   <a href="https://example.com" rel="noopener noreferrer">Link</a>
   ```

2. **User-Generated Content**: Apply to all user-submitted external links
   ```html
   <a href="user-provided-url" rel="noopener noreferrer">
     User content
   </a>
   ```

3. **Dynamic Links**: Ensure dynamically generated links include the attribute
   ```javascript
   const link = document.createElement('a');
   link.href = externalUrl;
   link.rel = 'noopener noreferrer';
   ```

4. **Security Policy**: Consider enforcing with Content Security Policy
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self'" />
   ```

### Compatibility Considerations

- **Graceful Degradation**: If not supported, links still function normally (just send referrer)
- **No Polyfill Needed**: Feature degrades gracefully; no JavaScript workaround required
- **Safe Default**: Using this attribute won't break functionality in older browsers

## Related Attributes & Standards

- **`rel="noopener"`**: Prevents new window/tab from accessing `window.opener`
- **`target="_blank"`**: Often used with `noreferrer` for security
- **Referrer-Policy Header**: Server-side complement for referrer control
- **`<meta name="referrer">`**: Document-level referrer policy control

## Related Links

- [Lifewire: rel="noreferrer" Explained](https://www.lifewire.com/rel-noreferrer-3468002)
- [MDN Web Docs: rel attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)
- [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/semantics.html#link-type-noreferrer)
- [Web.dev: Links and navigation security](https://web.dev/external-anchors-use-rel-noopener/)

## Conclusion

The `rel="noreferrer"` attribute is a well-established, widely-supported web standard for protecting user privacy when linking to external sites. With support across 93% of global browsers and no known breaking changes, it's recommended for all modern web applications as a privacy and security best practice.
