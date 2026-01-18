# Trusted Types for DOM Manipulation

## Overview

Trusted Types is a security-focused API that enforces developers to be explicit about their use of powerful DOM-injection APIs. It significantly improves protection against Cross-Site Scripting (XSS) attacks by requiring code to use trusted values when interacting with sensitive DOM elements.

## Description

An API that forces developers to be very explicit about their use of powerful DOM-injection APIs. Can greatly improve security against XSS attacks.

## Specification Status

- **Status**: Unofficial/Draft
- **Specification URL**: [W3C Web Application Security Trusted Types Specification](https://w3c.github.io/webappsec-trusted-types/dist/spec/)

## Categories

- DOM
- JS API
- Other
- Security

## Benefits & Use Cases

### Primary Benefits

1. **XSS Prevention**: Prevents injection of malicious scripts by enforcing type-safe DOM manipulation
2. **Explicit Security**: Forces developers to explicitly declare when they're using potentially dangerous APIs
3. **Content Security Policy Integration**: Works seamlessly with CSP to block unsafe script execution
4. **Built-in Validation**: Provides a mechanism to validate and sanitize data before DOM insertion

### Key Use Cases

- **Large-Scale Applications**: Enterprise applications that need robust security measures
- **High-Security Contexts**: Applications handling sensitive user data (finance, healthcare, etc.)
- **Third-Party Content**: Websites that need to safely embed third-party scripts and content
- **Security Compliance**: Meeting strict security compliance requirements (HIPAA, PCI-DSS, etc.)
- **DOM Sanitization**: Safely rendering user-generated content or markdown

### How It Works

Trusted Types requires developers to create and use special `TrustedHTML`, `TrustedScript`, and `TrustedScriptURL` objects instead of plain strings when using dangerous APIs such as:

- `innerHTML`
- `outerHTML`
- `insertAdjacentHTML()`
- `document.write()`
- `eval()`
- `setTimeout()` / `setInterval()` with string arguments
- `<script>` element `src` attributes

## Browser Support

### Current Support Summary

- **Chromium-based Browsers**: Full support from Chrome 83+, Edge 83+, Opera 69+
- **Safari**: Supported from version 26.0+
- **Firefox**: Currently disabled by default, available in Nightly builds
- **Mobile Browsers**: Support available on modern Android and iOS versions

### Browser Support Table

| Browser | First Support | Current Status | Notes |
|---------|---------------|---|---|
| **Chrome** | 83 | ✅ Fully Supported | All versions 83 and newer |
| **Edge** | 83 | ✅ Fully Supported | All versions 83 and newer |
| **Firefox** | 145* | ⚠️ Behind Flag | Enabled in Nightly only |
| **Safari** | 26.0 | ✅ Fully Supported | Latest versions supported |
| **Safari (iOS)** | 26.0 | ✅ Fully Supported | Latest versions supported |
| **Opera** | 69 | ✅ Fully Supported | All versions 69 and newer |
| **Opera Mini** | — | ❌ Not Supported | No support across all versions |
| **Samsung Internet** | 13.0 | ✅ Fully Supported | All versions 13.0 and newer |
| **Android Browser** | 142 | ✅ Supported | Latest versions supported |
| **Android Chrome** | 142 | ✅ Supported | Latest versions supported |
| **Android Firefox** | — | ❌ Not Supported | Not yet supported (144) |
| **Opera Mobile** | 80 | ✅ Supported | Version 80 and newer |
| **UC Browser** | 15.5 | ✅ Supported | Version 15.5 and newer |
| **Baidu Browser** | 13.52 | ✅ Supported | Version 13.52 and newer |
| **IE / IE Mobile** | — | ❌ Not Supported | No support |
| **Blackberry Browser** | — | ❌ Not Supported | No support |

### Global Usage Statistics

- **Support Rate**: 81.4% of global users
- **Not Supported**: 0% (partial support available)

## Implementation Notes

### Firefox Status

Firefox has a **positive position** on Trusted Types but is still developing support. The feature is currently available in Firefox Nightly builds behind a flag. To enable it:

- Use Firefox Nightly
- Enable the feature through developer settings
- Track progress on [Firefox Meta Bug #1508286](https://bugzilla.mozilla.org/show_bug.cgi?id=1508286)

### Enabling Trusted Types

Trusted Types are enabled through:

1. **HTTP Header**: Set via `Content-Security-Policy` header
   ```
   Content-Security-Policy: require-trusted-types-for 'script'
   ```

2. **Meta Tag**: Can be set via meta tag for testing
   ```html
   <meta http-equiv="Content-Security-Policy" content="require-trusted-types-for 'script'">
   ```

### Defining Trusted Policies

Create a policy to generate trusted values:

```javascript
const policy = trustedTypes.createPolicy('myPolicy', {
  createHTML: (input) => {
    // Sanitize input
    return sanitizedOutput;
  },
  createScript: (input) => {
    // Validate script
    return validatedScript;
  },
  createScriptURL: (input) => {
    // Validate URL
    return validatedURL;
  }
});
```

### Using Trusted Values

Once a policy is created, use it to generate trusted values:

```javascript
// Old way (now rejected with Trusted Types enabled)
element.innerHTML = userInput; // Error!

// New way (with Trusted Types policy)
element.innerHTML = policy.createHTML(userInput); // Works
```

## Related Resources

### Official Resources

1. **[Web.dev Article on Using Trusted Types](https://web.dev/trusted-types/)**
   - Comprehensive guide to implementing Trusted Types
   - Best practices and security considerations
   - Code examples and migration strategies

2. **[W3C Specification](https://w3c.github.io/webappsec-trusted-types/dist/spec/)**
   - Official technical specification
   - API details and behavior definitions
   - Algorithm specifications

### Browser Implementation Status

- **[Firefox Position: Positive](https://mozilla.github.io/standards-positions/#trusted-types)**
  - Mozilla's official support statement
  - Implementation timeline and roadmap

- **[Firefox Meta Bug #1508286](https://bugzilla.mozilla.org/show_bug.cgi?id=1508286)**
  - Track Firefox implementation progress
  - View ongoing development and discussion

## Compatibility Notes

### Polyfill Availability

Consider using a polyfill in environments where Trusted Types is not yet supported:
- Community polyfills may be available via npm
- Check for library-specific polyfills when using DOM manipulation libraries

### Library Support

Many popular libraries are adding Trusted Types support:
- DOMPurify (sanitization library)
- Sanitize-html (HTML sanitization)
- jQuery and modern frameworks continue to improve support

### Migration Strategy

If adding Trusted Types to an existing application:

1. Start with **report-only mode** using `Content-Security-Policy-Report-Only`
2. Identify all DOM manipulation points in your codebase
3. Implement a sanitization policy
4. Gradually migrate code to use trusted values
5. Enable enforcement mode in production

## Security Considerations

### Defense in Depth

Trusted Types should be part of a comprehensive security strategy:

1. **Content Security Policy (CSP)**: Complement with restrictive CSP rules
2. **Input Validation**: Validate all user inputs on both client and server
3. **Output Encoding**: Properly encode output based on context
4. **Regular Security Audits**: Perform regular security assessments
5. **Dependency Management**: Keep libraries and frameworks updated

### Limitations

- Trusted Types prevents client-side XSS attacks but does not protect against server-side vulnerabilities
- Server-side validation and output encoding remain essential
- Policies must be carefully implemented to avoid security bypasses

## See Also

- [Content Security Policy (CSP)](./csp.md)
- [Web Security Best Practices](./web-security.md)
- [DOM Security](./dom-security.md)

---

**Last Updated**: December 2024
**Data Source**: CanIUse
**Specification Status**: Unofficial/Draft (as of last update)
