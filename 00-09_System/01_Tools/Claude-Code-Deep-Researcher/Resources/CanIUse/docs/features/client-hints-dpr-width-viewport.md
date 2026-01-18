# Client Hints: DPR, Width, Viewport-Width

## Overview

**Client Hints: DPR, Width, Viewport-Width** enable proactive content negotiation between client and server, enabling automated delivery of optimized assets - for example, auto-negotiating image Device Pixel Ratio (DPR) resolution.

These HTTP headers allow servers to receive information about the client's display characteristics and viewport dimensions, facilitating intelligent resource selection and delivery optimization without requiring JavaScript intervention.

---

## Specification

- **Status**: Draft/Other
- **Specification**: [HTTP Client-Hints Draft Specification](https://tools.ietf.org/html/draft-grigorik-http-client-hints)

The feature is currently in draft status as part of the broader HTTP Client-Hints specification which aims to standardize how clients communicate their capabilities and context to servers.

---

## Categories

- DOM

---

## Benefits and Use Cases

### Resource Optimization
- **Automatic Image Resolution Selection**: Serve appropriately scaled images based on device pixel ratio without JavaScript
- **Bandwidth Savings**: Reduce unnecessary data transfer by serving optimally sized resources
- **Responsive Images**: Enable true server-side responsive image delivery

### Performance Improvements
- **Faster Content Negotiation**: Eliminate JavaScript-based device capability detection
- **Reduced Round Trips**: Include client information in initial requests
- **Server-Side Optimization**: Allow servers to make intelligent decisions about resource variants

### Common Use Cases

1. **Image Delivery Services**
   - Serve different resolution images based on device DPR (1x, 2x, 3x)
   - Automatically optimize images for high-DPI displays
   - Reduce bandwidth for standard displays

2. **Responsive Web Design**
   - Serve appropriate viewport-specific resources
   - Optimize content based on available display width
   - Improve performance on mobile devices

3. **Content Negotiation**
   - Automatically select best variant from server
   - Implement transparent optimization
   - Reduce client-side complexity

---

## Browser Support

### Summary Table

| Browser | First Version with Full Support |
|---------|--------------------------------|
| Chrome | 46 |
| Edge | 79 |
| Firefox | Not Supported |
| Safari | Not Supported |
| Opera | 33 |
| Android Chrome | 142 |
| Opera Mobile | 80 |
| Samsung Internet | 5.0+ |
| UC Browser | 15.5+ |
| Android UC | 15.5+ |
| Baidu | 13.52+ |
| QQ Browser | 14.9+ |

### Detailed Support Matrix

#### Desktop Browsers

**Chromium-Based**
- Chrome: Supported from version 46 onwards
- Edge: Supported from version 79 onwards
- Opera: Supported from version 33 onwards

**Mozilla Firefox**
- Not currently supported
- Bug filed: [Mozilla Bug 935216 - Implement Client-Hints HTTP header](https://bugzilla.mozilla.org/show_bug.cgi?id=935216)

**Apple Safari**
- Not currently supported
- WebKit Bug filed: [WebKit Bug 145380 - Add Content-DPR header support](https://bugs.webkit.org/show_bug.cgi?id=145380)

#### Mobile & Alternative Browsers

- **iOS Safari**: Not supported
- **Android Browser**: Supported from version 4.4.3+
- **Opera Mobile**: Supported from version 80 onwards
- **Samsung Internet**: Supported from version 5.0 onwards
- **UC Browser**: Supported from version 15.5 onwards
- **Android UC Browser**: Supported from version 15.5 onwards
- **Baidu Browser**: Supported from version 13.52 onwards
- **QQ Browser**: Supported from version 14.9 onwards
- **Opera Mini**: Not supported (all versions)

#### Legacy & Discontinued

- Internet Explorer: No support (all versions 5.5-11)
- BlackBerry Browser: No support
- KaiOS: No support

---

## Global Support Statistics

- **Full Support (Y)**: 80.29% of users
- **Partial/Fallback Support (A)**: 0%
- **No Support**: 19.71% of users

---

## Client Hint Headers

### Supported Headers

1. **DPR**
   - Reports the client's Device Pixel Ratio
   - Values: Numeric (e.g., 1, 1.5, 2, 3)
   - Example: `DPR: 2`

2. **Width**
   - Reports the intrinsic width of the requested resource
   - Values: Numeric pixels
   - Example: `Width: 800`

3. **Viewport-Width**
   - Reports the viewport's width in CSS pixels
   - Values: Numeric pixels
   - Example: `Viewport-Width: 320`

---

## HTTP Header Syntax

```http
GET /image.jpg HTTP/1.1
Host: example.com
DPR: 2
Width: 800
Viewport-Width: 1024
```

### Server-Side Response

Servers can use these hints to:
- Select appropriately sized image variants
- Return Content-DPR header in response
- Optimize asset delivery

```http
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-DPR: 2
```

---

## Implementation Notes

### Feature Requires

- **Accept-CH Header**: Servers must explicitly opt-in to receive client hints
- **HTTPS**: Client hints typically require secure contexts
- **User Privacy**: May require user permission settings in some browsers

### Server Opt-In

Servers advertise support via the Accept-CH (Accept Client Hints) header:

```http
Accept-CH: DPR, Width, Viewport-Width
```

### Example Use Case

**Request**:
```http
GET /products/image.jpg HTTP/1.1
Accept: image/webp,image/png,image/jpeg
DPR: 2
Viewport-Width: 768
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: image/webp
Content-Length: 12845
Content-DPR: 2
```

---

## Known Issues & Limitations

### Current Gaps

1. **Firefox Non-Support**
   - No implementation in Firefox despite being in draft
   - Users with Firefox browsers cannot send these hints
   - Requires fallback mechanisms for Firefox users

2. **Safari Non-Support**
   - No WebKit support for these headers
   - iOS Safari users not included
   - Estimated 20% of global users affected

3. **Requires Explicit Opt-In**
   - Servers must advertise support via Accept-CH
   - Additional HTTP roundtrip may be required
   - Adds complexity to server implementations

4. **Privacy Considerations**
   - Potential fingerprinting concerns
   - Browser privacy modes may limit header transmission
   - Some users may have headers disabled for privacy

### Mitigation Strategies

- **Fallback Content-Type Headers**: Use Accept-Type negotiation as fallback
- **Responsive Image Elements**: Use `<picture>` and `srcset` for progressive enhancement
- **Polyfills**: Use JavaScript polyfills for unsupported browsers
- **Feature Detection**: Server-side detection of Accept-CH support

---

## Testing Client Hints Support

### Verify Support

```javascript
// Check if client hints are supported
const supportsClientHints = 'attributionSourceNonceTransient' in navigator;

// Or via fetch API
fetch('/api/test', {
  headers: {
    'Accept': 'text/plain'
  }
}).then(response => {
  // Check for Content-DPR in response
  const dpr = response.headers.get('Content-DPR');
  console.log('Server received DPR:', dpr);
});
```

### Server Detection

```javascript
// Node.js/Express example
app.get('/image.jpg', (req, res) => {
  const dpr = req.get('DPR') || 1;
  const width = req.get('Width') || 800;
  const viewportWidth = req.get('Viewport-Width') || 1024;

  // Select appropriate variant
  const variant = selectImageVariant(width, dpr);

  res.setHeader('Content-DPR', dpr);
  res.sendFile(variant);
});
```

---

## Related Links

### Documentation & Tutorials
- [Automating resource selection with Client Hints](https://developers.google.com/web/updates/2015/09/automating-resource-selection-with-client-hints) - Google Web Updates

### Bug Reports & Issues
- [Mozilla Bug 935216 - Implement Client-Hints HTTP header](https://bugzilla.mozilla.org/show_bug.cgi?id=935216) - Firefox bug tracker
- [WebKit Bug 145380 - Add Content-DPR header support](https://bugs.webkit.org/show_bug.cgi?id=145380) - WebKit bug tracker

### Related Standards
- [HTTP Client Hints Specification](https://tools.ietf.org/html/draft-grigorik-http-client-hints)
- [Responsive Images (srcset/picture)](https://html.spec.whatwg.org/multipage/images.html)
- [Save-Data Hint](https://tools.ietf.org/html/draft-falaki-httpbis-client-hints-economics)

---

## Alternatives & Fallback Mechanisms

### Responsive Images (Widely Supported)
Instead of relying on client hints, use HTML responsive image syntax:

```html
<picture>
  <source media="(min-width: 1200px)" srcset="image-1200w.jpg 1200w">
  <source media="(min-width: 768px)" srcset="image-768w.jpg 768w">
  <img src="image-480w.jpg" alt="Responsive image">
</picture>

<!-- Or using srcset attribute -->
<img
  srcset="image-320w.jpg 320w, image-768w.jpg 768w, image-1200w.jpg 1200w"
  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 100vw"
  src="image-768w.jpg"
  alt="Responsive image">
```

### JavaScript-Based Detection
```javascript
// Fallback for unsupported browsers
if (!supportsClientHints) {
  const dpr = window.devicePixelRatio;
  const width = window.innerWidth;

  // Implement client-side optimization
}
```

---

## Summary

**Client Hints: DPR, Width, Viewport-Width** provide a standards-based way for servers to automatically deliver optimized content based on client capabilities. Currently supported by 80% of users globally, with strong support in Chromium-based browsers and mobile platforms. However, lack of Firefox and Safari support limits universal adoption. For production use, combine with responsive image techniques for maximum compatibility.

### Key Takeaways
- ✅ Excellent support in Chrome, Edge, and Opera
- ✅ Good mobile support (Android, Samsung, UC Browser)
- ❌ No Firefox or Safari support
- ⚠️ Requires explicit server opt-in
- 🔄 Use progressive enhancement with HTML responsive images

---

*Last Updated: 2025*
*Source: CanIUse Feature Database*