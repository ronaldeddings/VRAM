# Credential Management API

## Overview

The **Credential Management API** provides a programmatic interface to the browser's credential manager. This API enables websites to request user credentials for sign-in purposes or allow the browser to save credentials on behalf of the user. Both requests are user-mediated and security-conscious, putting the user in control of their credentials.

This API represents a modern approach to authentication, moving away from traditional form-based login methods to leverage the browser's native credential storage capabilities.

---

## Specification

- **Status**: Working Draft (WD)
- **Specification Link**: [W3C Credential Management Level 1](https://www.w3.org/TR/credential-management-1/)
- **Last Updated**: Actively maintained by W3C WebAppSec Working Group

---

## Categories

- **JavaScript API** - Core web platform API
- **Security** - Enhances security of authentication workflows

---

## Overview & Description

The Credential Management API provides two primary capabilities:

### 1. **Credential Retrieval**
An origin can request a user's credentials from the browser's credential manager to automatically sign them in. The browser handles the user interaction, ensuring credentials are only shared when the user explicitly allows it.

### 2. **Credential Storage**
A website can ask the browser to save a user's credentials after successful authentication. This allows the browser to manage credentials and offer them for future sign-ins, reducing friction in the authentication process.

### Key Benefits

- **Enhanced Security**: Credentials are managed by the browser rather than stored in plain text
- **Reduced Friction**: Users can sign in with a single click using saved credentials
- **User Control**: All credential access requires explicit user permission
- **Password Manager Integration**: Works seamlessly with browser password managers
- **Auto-fill Support**: Enables browsers to suggest saved credentials at appropriate moments

---

## Use Cases

### User Authentication
- **Seamless Sign-In**: Allow users to sign in with one click using saved credentials
- **Password Recovery**: Simplify recovery flows by suggesting saved credentials
- **Multi-Account Support**: Enable easy switching between multiple user accounts

### Credential Management
- **Auto-Save Credentials**: Offer to save login credentials after successful authentication
- **Selective Storage**: Allow users to decide whether to save credentials for future use
- **Secure Deletion**: Provide mechanisms to remove saved credentials when accounts are deleted

### Federated Identity
- **Social Login Integration**: Work with browser-managed identity providers
- **Enterprise SSO**: Integrate with organizational credential systems
- **Third-Party Authentication**: Support federated identity scenarios

### Security Improvements
- **Phishing Prevention**: Browser credential manager can detect phishing attempts
- **Credential Encryption**: Browser handles secure storage and encryption
- **API-Based Authentication**: Replace insecure form-based approaches

---

## Browser Support

### Desktop Browsers

| Browser | First Full Support | Current Support |
|---------|-------------------|-----------------|
| **Chrome** | 51¹ | ✅ Yes (v146+) |
| **Edge** | 79 | ✅ Yes (v143+) |
| **Firefox** | ❌ Not Supported | ❌ No (v148) |
| **Safari** | ❌ Not Supported | ❌ No (v18.x) |
| **Opera** | 45 | ✅ Yes (v122+) |

¹ Chrome 51-56 had limited support: Public Suffix List (PSL) matched credentials were not supported, meaning credentials set on `a.example.com` could not be used in `b.example.com`. Full support including PSL-matched credentials was introduced in Chrome 57.

### Mobile Browsers

| Browser | First Full Support | Current Support |
|---------|-------------------|-----------------|
| **iOS Safari** | 14.0 | ✅ Yes (v26.1+) |
| **Android Chrome** | — | ✅ Yes (v142+) |
| **Android Firefox** | ❌ Not Supported | ❌ No (v144) |
| **Samsung Internet** | 7.2-7.4 | ✅ Yes (v29+) |
| **Opera Mobile** | 80 | ✅ Yes |
| **UC Browser** | 15.5 | ✅ Yes |

### Feature Support Matrix

```
✅ Supported   |  ❌ Not Supported  |  ⚠️  Partial Support
━━━━━━━━━━━━━━┼───────────────────┼──────────────────
Chrome        |  Firefox          |  Chrome 51-56¹
Edge          |  Safari (desktop) |  (PSL limitation)
Opera         |  Internet Explorer|
iOS Safari    |  BlackBerry       |
Android       |  Opera Mini       |
Samsung       |                   |
```

### Global Support Statistics

- **Global Usage**: ~89.21% of users have browsers with full support
- **No Partial Support**: Feature is either fully supported or not available
- **Wide Coverage**: Supported in all major modern browsers except Firefox and Safari

---

## Implementation Notes

### Public Suffix List (PSL) Credentials

In Chrome versions 51 through 56, there was a limitation with Public Suffix List (PSL) matched credentials:

- **Limitation**: Credentials saved on `a.example.com` could not be automatically filled in `b.example.com`, despite both being under the same parent domain
- **Resolution**: Chrome 57+ added full PSL matching support
- **Impact**: Low for most modern deployments, as Chrome 51-56 were released in 2016

### Known Limitations

- **Firefox Support**: Firefox does not currently support the Credential Management API
- **Safari Support**: Apple's Safari browser (desktop version) does not support this API, though iOS Safari does
- **Opera Mini**: No support; affects limited subset of users in some regions

---

## JavaScript API Basics

### Core Methods

```javascript
// Request credentials from browser
navigator.credentials.get({
  password: true,
  federated: {
    providers: ['https://accounts.google.com']
  }
});

// Store credentials after successful login
navigator.credentials.store(credential);
```

### Credential Types

1. **PasswordCredential**: For username/password combinations
2. **FederatedCredential**: For federated identity providers
3. **PublicKeyCredential**: For WebAuthn (related but separate spec)

---

## Related Links & Resources

### Official Documentation
- **[MDN Web Docs - Credential Management API](https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API)** - Comprehensive Mozilla documentation
- **[W3C Specification](https://www.w3.org/TR/credential-management-1/)** - Official W3C working draft
- **[W3C Spec Discussion](https://github.com/w3c/webappsec-credential-management)** - GitHub repository for spec discussions

### Learning Resources
- **[Google Tutorial - Credential Management API](https://developers.google.com/web/updates/2016/04/credential-management-api)** - Official Google tutorial and best practices
- **[Live Demo](https://credential-management-sample.appspot.com/)** - Interactive example application
- **[Sample Code](https://github.com/GoogleChrome/credential-management-sample)** - Reference implementation with example code

---

## Fallback & Progressive Enhancement

For maximum compatibility, consider these approaches:

1. **Graceful Degradation**: Check for API support before attempting to use it
2. **Traditional Forms**: Keep traditional login forms as fallback for unsupported browsers
3. **Polyfills**: Consider polyfills for non-supporting browsers
4. **Feature Detection**:
   ```javascript
   if (window.PasswordCredential || window.FederatedCredential) {
     // Use Credential Management API
   } else {
     // Fallback to traditional login
   }
   ```

---

## Security Considerations

### Best Practices

1. **HTTPS Only**: The API is only available on secure (HTTPS) origins
2. **User Consent**: Always respect user consent for credential access
3. **Origin Validation**: Credentials are origin-specific and cannot be shared cross-origin
4. **Encryption**: Browser handles secure encryption of stored credentials
5. **Phishing Protection**: Browser can apply additional security checks

### Recommendations

- Use in conjunction with other security measures (CSRF tokens, rate limiting)
- Implement proper server-side validation of credentials
- Monitor for suspicious credential access patterns
- Consider combining with WebAuthn for passwordless authentication

---

## Browser Release Timeline

### First Support

- **Chrome**: v51 (May 2016)
- **Edge**: v79 (January 2020)
- **Opera**: v45 (March 2017)
- **iOS Safari**: v14.0 (September 2020)
- **Samsung Internet**: v7.2-7.4 (2018)

### Recent Milestones

- Chrome 57+ (March 2017): Full PSL matching support
- Edge consistently maintains support since v79
- iOS Safari adoption accelerated from v14.0 onward

---

## Summary

The Credential Management API represents a significant advancement in web authentication security and user experience. With support across most modern browsers (89.21% global coverage), it's ready for production use with appropriate fallbacks for unsupported browsers like Firefox and Safari desktop.

The API shifts credential management responsibility from individual websites to the browser, leveraging built-in security features and credential storage mechanisms that users already trust and use daily.
