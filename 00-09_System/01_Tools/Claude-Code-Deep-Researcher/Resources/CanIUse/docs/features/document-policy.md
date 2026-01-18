# Document Policy

## Overview

Document Policy is a mechanism that allows developers to set certain rules and policies for a given site. The rules can change default browser behavior, block certain features, or set limits on resource usage. Document Policy is useful for both security and performance purposes and is similar to [Permissions Policy](/permissions-policy).

## Specification Status

**Status:** Unofficial (Proposed)
**Specification:** [WICG Document Policy](https://wicg.github.io/document-policy/)

The Document Policy specification is currently being developed by the Web Incubator Community Group (WICG) and has not yet reached official standards status.

## Categories

- Security
- Other

## Benefits and Use Cases

Document Policy provides developers with the following advantages:

### Security Benefits
- **Feature Control**: Block or restrict specific browser features that may pose security risks
- **Enforcement Mechanism**: Establish policies that the browser actively enforces, preventing unintended behavior
- **Defense Strategy**: Complement Permissions Policy with performance and security-focused constraints

### Performance Benefits
- **Resource Limiting**: Set limits on resource usage to improve page performance
- **Behavior Control**: Modify default browser behavior to optimize for performance
- **Predictable Execution**: Establish consistent policies across your site

### Practical Applications
- Prevent synchronous scripts from blocking page rendering
- Disable expensive features that drain battery on mobile devices
- Enforce certain coding practices across a site
- Set limits on document characteristics (e.g., unsized media)
- Manage third-party content behavior

## How It Works

Document Policy allows you to declare policies in two ways:

### 1. HTTP Header
```
Document-Policy: unsized-media=(), unsync-script=()
```

### 2. Iframe Attribute
```html
<iframe src="..." policy="unsized-media=(), unsync-script=()"></iframe>
```

**Note:** The HTTP header approach provides comprehensive site-wide policy control, while the iframe attribute is specific to that frame's content.

## Browser Support

### Support Legend
- **Full Support (✓)**: Complete Document Policy implementation
- **Partial Support (△)**: Limited support via HTTP header only (Chromium browsers)
- **No Support (✗)**: Feature not supported

### Browser Support Table

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 85+ | △ | HTTP header only |
| **Edge** | 85+ | △ | HTTP header only |
| **Opera** | 71+ | △ | HTTP header only |
| **Firefox** | All versions | ✗ | Not supported |
| **Safari** | All versions | ✗ | Not supported |
| **iOS Safari** | All versions | ✗ | Not supported |
| **Android Chrome** | 142+ | △ | HTTP header only |
| **Opera Mobile** | 80+ | △ | HTTP header only |
| **Samsung Internet** | All versions | ✗ | Not supported |
| **Baidu Browser** | 13.52+ | △ | HTTP header only |
| **UC Browser** | All versions | ✗ | Not supported |
| **Opera Mini** | All versions | ✗ | Not supported |

### Support Summary

**Chromium-Based Browsers**: Limited support (HTTP header only)
- Chrome 85+
- Edge 85+
- Opera 71+
- Android Chrome 142+
- Opera Mobile 80+
- Baidu Browser 13.52+

**Other Browsers**: No support
- Firefox: No support
- Safari: No support
- Mobile Safari (iOS): No support
- All other browsers: No support

## Important Notes

### Standard Support
Standard support includes:
- The HTTP `Document-Policy` header
- The `policy` attribute on iframes

### Implementation Limitations

**Chromium browsers (79% of users)** only support the HTTP header approach. The iframe `policy` attribute is not yet implemented in these browsers.

This means:
- You can set policies at the server level using HTTP headers
- Iframe-level policy attributes are not yet functional in supported browsers
- Full implementation is still in development

## Related Features

- **Permissions Policy**: Similar feature for controlling browser permissions and APIs
- **Content Security Policy (CSP)**: Related security mechanism for content control
- **Feature Policy**: Predecessor naming convention for Permissions Policy

## Resources and References

### Official Documentation
- [WICG Document Policy Specification](https://wicg.github.io/document-policy/)
- [Document Policy Explainer](https://github.com/WICG/document-policy/blob/main/document-policy-explainer.md)

### Browser Implementation
- [Chromium Tracking Bug for New Policies](https://bugs.chromium.org/p/chromium/issues/detail?id=993790)

### Standards Position
- [Firefox Standards Position: Non-harmful](https://mozilla.github.io/standards-positions/#document-policy)

## Polyfill and Fallback Strategies

Since Document Policy is not widely supported, consider:

1. **Progressive Enhancement**: Use Document Policy where supported; fall back to JavaScript checks for unsupported browsers
2. **Feature Detection**: Check for Document Policy support before relying on it
3. **Server-Side Validation**: Implement validation on the server side to handle all clients
4. **Permissions Policy**: Use Permissions Policy as a complementary approach with broader support

## Example Usage

### HTTP Header Approach
```
Document-Policy: unsized-media=(), unsync-script=(), unsized-images=()
```

### Future Iframe Approach (Not Yet Supported)
```html
<!-- This syntax is standardized but not yet implemented -->
<iframe src="./third-party.html" policy="unsync-script=()"></iframe>
```

## Current Limitations

1. **Limited Browser Support**: Only Chromium-based browsers support it (as of 2024)
2. **HTTP Header Only**: Iframe attribute support is not yet implemented
3. **Experimental Feature**: The specification and browser implementations are still evolving
4. **No Fallback Behavior**: Unsupported browsers simply ignore the policy

## Keywords

feature, security, header, policy, attribute, policy attribute, attribute policy, feature-policy, feature policy, document-policy, force-load-at-top

## Additional Information

- **Total Users Affected**: ~77.33% of global users have access to partial Document Policy support
- **Actual Usage**: 0% (feature is still emerging and not widely deployed)
- **Chrome IDs**: 5645593894453248, 5756689661820928

---

*This documentation is based on Can I Use data and is current as of 2024. For the latest information, check the [official specification](https://wicg.github.io/document-policy/) and browser implementation status.*
