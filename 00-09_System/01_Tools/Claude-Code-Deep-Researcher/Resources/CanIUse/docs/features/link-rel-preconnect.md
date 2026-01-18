# Resource Hints: preconnect

## Overview

The `preconnect` resource hint provides a way to inform the browser to begin establishing connections (DNS resolution, TCP handshake, and TLS negotiation) to specified domains in the background. This optimization technique improves page load performance by eliminating connection setup latency when resources from those domains are later requested.

## Description

The preconnect hint is implemented using the HTML `<link>` element with the `rel="preconnect"` attribute:

```html
<link rel="preconnect" href="https://example-domain.com/">
```

By initiating the connection handshake before the browser actually needs resources from the domain, preconnect reduces the time required for DNS lookups, TCP connection establishment, and TLS certificate negotiation. This is particularly effective for improving performance when loading resources from third-party domains.

## Specification Status

- **Spec URL**: [W3C Resource Hints Specification](https://www.w3.org/TR/resource-hints/#preconnect)
- **Status**: Working Draft (WD)
- **Specification**: Resource Hints Specification

## Categories

- **DOM**: Document Object Model

## Benefits and Use Cases

### Performance Improvements
- **Reduced Latency**: Eliminates connection setup delays for cross-origin resources
- **Background Processing**: Connection establishment happens during page load, before resources are needed
- **Faster Resource Loading**: Subsequent requests to preconnected domains experience faster load times

### Ideal Use Cases
- **Third-party APIs**: Google Fonts, CDNs, analytics services, advertising networks
- **Image Hosting**: Preconnect to domains serving images and media
- **API Endpoints**: Services that will be called via JavaScript or form submissions
- **Multiple Subdomains**: When your site loads resources from different subdomains of the same domain

### Performance Benefits
- DNS lookup time eliminated (typically 20-120ms)
- TCP connection time eliminated (typically 50-300ms)
- TLS negotiation time reduced or eliminated (typically 100-500ms)

## Browser Support

| Browser | Initial Support | Latest Support | Notes |
|---------|-----------------|-----------------|-------|
| **Chrome** | 46 | 146+ | Full support from version 46 onwards |
| **Edge** | 79 | 143+ | Full support from version 79; partial support (HTTP header only) in versions 15-18 |
| **Firefox** | 39* | 148+ | Limited support in v39; full support from v40; regression v71-114 (#1543990); re-enabled from v115 |
| **Safari** | 11.1 | 18.5-18.6+ | Full support from version 11.1 onwards |
| **Opera** | 33 | 122+ | Full support from version 33 onwards |
| **iOS Safari** | 11.3-11.4 | 18.5-18.7+ | Full support from version 11.3-11.4 onwards |
| **Android Browser** | 142 | 142+ | Full support |
| **Opera Mobile** | 80 | 80+ | Full support from version 80 onwards |
| **Opera Mini** | All | All | Not supported |
| **IE Mobile 10-11** | - | - | Not supported |
| **Blackberry** | - | - | Not supported |

### Modern Browser Coverage

As of late 2024, preconnect enjoys excellent cross-browser support:

- **Desktop**: Chrome, Edge, Firefox (v115+), Safari, and Opera all support it
- **Mobile**: Strong support across iOS Safari, Android browsers, Samsung Internet, and modern mobile browsers
- **Global Usage**: **92.91% of users** have browsers that support preconnect

### Partial Support Indicators

- **Edge 15-18** (#2): Supports HTTP header format only, not the `<link rel>` HTML syntax
- **Firefox 39** (#1): Limited support; `crossorigin` attribute not supported and preconnects not processed by preload parser (both fixed in v41)
- **Firefox 71-114** (#3): Regression in support; restored in v115+ (see [bug 1543990](https://bugzilla.mozilla.org/show_bug.cgi?id=1543990))

## Implementation Example

### Basic Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preconnect Example</title>

    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Preconnect to CDN -->
    <link rel="preconnect" href="https://cdn.example.com">

    <!-- Preconnect to API endpoint -->
    <link rel="preconnect" href="https://api.example.com">

    <!-- Import fonts from preconnected domain -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

### With Crossorigin Attribute

When preconnecting to domains that require CORS authentication or credentials:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

The `crossorigin` attribute ensures the preconnection uses the same credentials mode as the actual resource request.

### Multiple Preconnections

```html
<head>
    <!-- Third-party services -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://api.analytics.example.com">
    <link rel="preconnect" href="https://ads.example.com">
</head>
```

## Performance Considerations

### When to Use Preconnect

✅ **Use preconnect when:**
- Loading fonts from external domains
- Connecting to third-party APIs that load synchronously
- Using multiple CDNs for different resource types
- Building critical path resources from different origins
- You have 4+ seconds of network latency

### When NOT to Use Preconnect

❌ **Avoid preconnect when:**
- You're unsure if the domain will actually be used
- Establishing too many connections (more than 6 recommended)
- The domain serves non-critical, lazy-loaded resources
- You haven't measured actual performance impact

### Best Practices

1. **Prioritize Critical Domains**: Preconnect only to domains that serve critical resources
2. **Measure Impact**: Use DevTools and performance metrics to validate improvements
3. **Limit Connections**: Aim for no more than 3-6 preconnect hints per page
4. **Use DNS Prefetch Fallback**: Combine with DNS prefetch for broader browser support:
   ```html
   <link rel="preconnect" href="https://example.com">
   <link rel="dns-prefetch" href="https://example.com">
   ```
5. **Test with Real Users**: Monitor Core Web Vitals and real-world performance metrics

## Related Resource Hints

- **dns-prefetch**: Only performs DNS lookup, lighter weight than preconnect
- **prefetch**: Downloads resources that may be needed on future pages
- **preload**: Downloads resources needed on the current page
- **prerender**: Speculatively renders full pages (deprecated)

## Known Issues and Limitations

### Firefox Regression (Versions 71-114)

Firefox experienced a regression in preconnect support between versions 71 and 114. Support was restored in version 115. If supporting Firefox users is critical, check the [bug report](https://bugzilla.mozilla.org/show_bug.cgi?id=1543990) for details.

### Connection Pool Limits

Browsers have limits on the number of concurrent connections per domain. Excessive preconnect hints may not provide additional benefits and could consume bandwidth unnecessarily.

### Header-Only Support (Edge 15-18)

Early Edge versions only supported the HTTP header format of preconnect, not the HTML `<link>` element format. Consider using fallbacks for very old Edge versions.

## Diagnostics and Testing

### Browser DevTools

1. **Chrome DevTools**:
   - Network tab shows preconnect requests (filtered by type: "preflight")
   - Coverage tab shows unused resource hints
   - Performance tab shows connection timing improvements

2. **Firefox DevTools**:
   - Network tab displays preconnect activity
   - Performance tab measures impact on load times

3. **Safari DevTools**:
   - Network tab shows preconnect requests
   - Develop menu provides performance timeline

### Measurement Approaches

```javascript
// Check preconnect support
const isSupported = () => {
    const link = document.createElement('link');
    return link.relList && link.relList.supports('preconnect');
};

// Measure connection timing
const entries = performance.getEntriesByType('resource');
const preconnectedDomains = entries
    .filter(entry => entry.nextHopProtocol)
    .map(entry => new URL(entry.name).hostname);
```

## References and Resources

- **W3C Specification**: [Resource Hints](https://www.w3.org/TR/resource-hints/#preconnect)
- **Related Article**: [Eliminating Roundtrips with Preconnect](https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/) by Ilya Grigorik

## Fallback Strategy

For maximum browser compatibility, combine preconnect with dns-prefetch:

```html
<link rel="preconnect" href="https://example.com">
<link rel="dns-prefetch" href="https://example.com">
```

This approach ensures that older browsers that don't support preconnect will at least benefit from DNS prefetch, which is more widely supported.

## Summary

The `preconnect` resource hint is a mature, well-supported web performance optimization technique with 92.91% global browser support. It's particularly effective for improving page load performance when using third-party services, CDNs, and APIs. When used strategically and measured carefully, preconnect can provide significant real-world performance improvements with minimal implementation complexity.
