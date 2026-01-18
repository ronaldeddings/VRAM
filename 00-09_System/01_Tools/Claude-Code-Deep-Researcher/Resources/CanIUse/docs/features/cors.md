# Cross-Origin Resource Sharing (CORS)

## Overview

**Cross-Origin Resource Sharing (CORS)** is a security mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. It provides a method of performing XMLHttpRequests across domains in a controlled and secure manner.

## Specification

- **Standard**: Living Standard
- **Specification URL**: [WHATWG Fetch Standard - HTTP CORS Protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)
- **Status**: Living Standard (ls)

## Categories

- JavaScript API
- Security

## What is CORS?

CORS is a critical web security feature that enables safe cross-origin communication. Without CORS, browsers enforce the Same-Origin Policy (SOP), which prevents web pages from making requests to different domains. CORS allows servers to explicitly grant permission to specific origins, methods, and headers, enabling legitimate cross-origin requests while maintaining security.

## Benefits and Use Cases

### Key Benefits

- **Secure Cross-Origin Communication**: Enables safe data exchange between different domains with explicit server consent
- **Fine-Grained Access Control**: Servers can specify which origins, HTTP methods, and headers are allowed
- **API Integration**: Allows frontend applications to safely consume APIs from different domains
- **Microservices Architecture**: Facilitates communication between different services and subdomains
- **Enhanced User Experience**: Enables dynamic resource loading and third-party integrations
- **Standards-Based Security**: Replaces less secure workarounds like JSONP or server proxies

### Common Use Cases

- **REST API Consumption**: Frontend applications consuming APIs hosted on different domains
- **Third-Party Services**: Integrating map services, analytics, payment processors, and other third-party tools
- **Microservices**: Communication between frontend and backend services with different origins
- **Single Page Applications (SPAs)**: Enabling SPAs to load resources from CDNs and API services
- **Widget Embedding**: Embedding interactive widgets on third-party websites
- **Font and Media Loading**: Loading fonts, images, and media from different domains
- **Progressive Web Apps**: Fetching resources from multiple origins for PWA functionality

## How CORS Works

### The CORS Process

1. **Preflight Request**: For complex requests, the browser sends an OPTIONS request with CORS headers
2. **Server Validation**: The server checks the origin against allowed origins
3. **Server Response**: The server responds with CORS headers indicating what's allowed
4. **Actual Request**: If allowed, the browser sends the actual request (GET, POST, etc.)
5. **Response Handling**: The browser allows the JavaScript to access the response if CORS headers are valid

### Key CORS Headers

**Request Headers**:
- `Origin`: The origin of the requesting page
- `Access-Control-Request-Method`: The HTTP method the request will use
- `Access-Control-Request-Headers`: Headers the request will include

**Response Headers**:
- `Access-Control-Allow-Origin`: Specifies which origins can access the resource
- `Access-Control-Allow-Methods`: HTTP methods allowed for cross-origin requests
- `Access-Control-Allow-Headers`: Headers allowed in the actual request
- `Access-Control-Allow-Credentials`: Whether credentials (cookies, auth) can be included
- `Access-Control-Max-Age`: How long preflight results can be cached
- `Access-Control-Expose-Headers`: Headers the browser can expose to the requesting code

## Browser Support

### Desktop Browsers

| Browser | First Full Support | Status | Notes |
|---------|-------------------|--------|-------|
| **Chrome** | 13 | ✅ Full | Partial support in versions 4-12 |
| **Firefox** | 3.5 | ✅ Full | Full support since version 3.5 |
| **Safari** | 6 | ✅ Full | Partial support in versions 4-5.1; Video in canvas limitation exists |
| **Edge** | 12 | ✅ Full | Full support in all versions |
| **Opera** | 12 | ✅ Full | Full support from version 12 onwards |
| **Internet Explorer** | 11 | ⚠️ Limited | IE8-9: Limited support via XDomainRequest; IE10-11: Several known bugs |

### Mobile Browsers

| Browser | First Full Support | Status | Notes |
|---------|-------------------|--------|-------|
| **Android Chrome** | 4.4+ | ✅ Full | Full support in modern versions |
| **iOS Safari** | 6.0 | ✅ Full | Partial support in versions 3.2-5.1; Video in canvas limitation exists |
| **Opera Mobile** | 12 | ✅ Full | Full support from version 12 onwards |
| **Samsung Internet** | 4.0+ | ✅ Full | Full support in modern versions |

### Legacy and Unsupported

- **Opera Mini**: ❌ Not supported
- **Internet Explorer 5.5-7**: ❌ Not supported
- **IE8-9**: ⚠️ Limited support (XDomainRequest only)
- **IE10**: ⚠️ Full support with known bugs

## Support Summary

- **Global Support**: 93.6% of users have full CORS support
- **Partial Support**: 0.09% of users have partial support
- **Universal Support**: Nearly all modern browsers fully support CORS

**Recommendation**: CORS is safe to use for modern web development. Use feature detection or fallbacks for legacy browser support if necessary.

## Known Issues and Bugs

### Critical Issues

1. **IE10+ Credential Handling**
   - IE10 and later do not send cookies when `withCredential=true`
   - **Reference**: [IE Bug #759587](https://web.archive.org/web/20140424050520/https://connect.microsoft.com/IE/feedback/details/759587/ie10-doesnt-support-cookies-on-cross-origin-xmlhttprequest-withcredentials-true)
   - **Workaround**: Use a P3P (Platform for Privacy Preferences) policy
   - **More Info**: [P3P Policy Implementation Guide](https://www.techrepublic.com/blog/software-engineer/craft-a-p3p-policy-to-make-ie-behave/)

2. **IE10+ Port-Only Difference**
   - IE10 and later do not recognize CORS requests when only the port differs between origins
   - **Reference**: [IE Bug #781303](https://web.archive.org/web/20150522040248/https://connect.microsoft.com/IE/feedback/details/781303)
   - **Impact**: Requests to `example.com:8080` and `example.com:8081` may fail

3. **IE11 Canvas Image CORS**
   - IE11 does not support CORS for images in the `<canvas>` element
   - **Impact**: Loading cross-origin images for canvas manipulation fails
   - **Workaround**: Use server proxies or server-side image processing

4. **Chrome and Safari Canvas Image CORS**
   - Versions 4+ (Chrome) and 4-5.1 (Safari) do not support CORS for images in `<canvas>`
   - **Status**: Fixed in later versions

5. **WebKit Video in Canvas CORS**
   - WebKit browsers (Safari, old Android browsers) do not support CORS for `<video>` in `<canvas>`
   - **Reference**: [WebKit Bug #135379](https://bugs.webkit.org/show_bug.cgi?id=135379)
   - **Workaround**: Process video on server side or use alternative approaches

6. **Firefox Redirect Support**
   - Firefox 61-70 does not support CORS for resources that redirect
   - **Reference**: [Firefox Bug #1346749](https://bugzilla.mozilla.org/show_bug.cgi?id=1346749)
   - **Status**: Fixed in Firefox 71+

7. **Android and WebKit Access-Control-Expose-Headers**
   - Android and old WebKit versions (found in various webview implementations) do not support the `Access-Control-Expose-Headers` header
   - **Reference**: [Android Issue #56726](https://code.google.com/p/android/issues/detail?id=56726)
   - **Impact**: Cannot selectively expose headers to client-side code
   - **Workaround**: Ensure required headers are accessible or use alternative methods

### Alternative Implementations

- **IE8-9 XDomainRequest**: Provides limited CORS-like functionality using the XDomainRequest object
  - **Limitations**: Cannot set custom headers, no credentials support, same protocol only
  - **Reference**: [MSDN - XDomainRequest Restrictions](https://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx)

## Implementation Best Practices

### Server-Side Configuration

```
# Allow specific origin
Access-Control-Allow-Origin: https://trusted-origin.com

# Allow multiple origins (requires dynamic configuration)
Access-Control-Allow-Origin: https://trusted-origin.com

# Allow any origin (use with caution)
Access-Control-Allow-Origin: *

# Allow common HTTP methods
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS

# Allow necessary headers
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With

# Allow credentials
Access-Control-Allow-Credentials: true

# Cache preflight for 24 hours
Access-Control-Max-Age: 86400

# Expose additional headers to client
Access-Control-Expose-Headers: X-Total-Count, X-Page-Number
```

### Client-Side Usage

```javascript
// Simple GET request
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// Request with credentials
fetch('https://api.example.com/data', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));

// POST request
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ key: 'value' })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Feature Detection

```javascript
// Check CORS support
function supportsCORS() {
  const xhr = new XMLHttpRequest();
  return 'withCredentials' in xhr;
}

// Using Fetch API (preferred modern approach)
if (typeof fetch !== 'undefined') {
  // Fetch API with CORS support available
}
```

## Migration and Deprecation

CORS replaces several older, less secure approaches:

- **JSONP**: Older workaround that limited requests to GET and had security concerns
- **Server-Side Proxies**: Inefficient approach of proxying all cross-origin requests through your server
- **XDomainRequest (IE8-9)**: Limited predecessor to full CORS support

If your application still uses these approaches, consider migrating to standard CORS implementation.

## Related Resources

### Official Documentation
- [MDN Web Docs - Access Control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
- [WHATWG Fetch Standard - HTTP CORS Protocol](https://fetch.spec.whatwg.org/#http-cors-protocol)

### Articles and Guides
- [Mozilla Hacks: Cross-site XMLHttpRequest with CORS](https://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/)
- [Opera Dev: DOM Access using CORS](https://dev.opera.com/articles/view/dom-access-control-using-cross-origin-resource-sharing/)
- [MSDN: IE8 Alternative Implementation](https://msdn.microsoft.com/en-us/library/cc288060(VS.85).aspx)

### Feature Detection
- [has.js - CORS Detection](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-cors-xhr)

## Summary

CORS is a fundamental modern web platform feature with near-universal browser support (93.6% full support). It provides a secure, standards-based way to enable cross-origin communication. While there are some legacy browser limitations, especially in Internet Explorer, CORS is the recommended approach for building modern, interconnected web applications.

For applications targeting modern browsers, CORS support is essentially guaranteed. For applications requiring IE support, alternative fallback mechanisms or server-side solutions may be needed to handle the documented limitations.

---

*Last Updated: December 2025*
*Based on CanIUse data*
