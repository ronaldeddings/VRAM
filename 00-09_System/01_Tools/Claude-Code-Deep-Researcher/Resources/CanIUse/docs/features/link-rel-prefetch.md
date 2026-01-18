# Resource Hints: prefetch

## Overview

The `prefetch` resource hint informs browsers to preload a resource that is likely to be needed for future navigation or operations. This allows the browser to fetch the resource in the background during idle time, resulting in faster load times when the resource is eventually needed.

## Description

The `prefetch` hint is specified using the `<link>` element with `rel="prefetch"` attribute:

```html
<link rel="prefetch" href="(url)" />
```

This tells the browser that a given resource should be prefetched so it can be loaded more quickly when accessed. The browser will typically download the resource with low priority during idle time, and the cached resource will be used when the user navigates to a page that requires it.

## Specification Status

- **Status**: Working Draft (WD)
- **Specification**: [W3C Resource Hints - Prefetch](https://www.w3.org/TR/resource-hints/#dfn-prefetch)
- **Usage Prevalence**: 82.9% of tracked browsers

## Categories

- DOM (Document Object Model)

## Benefits and Use Cases

### Performance Optimization
- **Faster Navigation**: Prefetch resources that are likely needed for future page loads
- **Reduced Latency**: Resources are downloaded during idle time, not when they're needed
- **Background Loading**: Non-blocking resource loading that doesn't impact current page performance

### Common Use Cases

1. **Multi-page Applications**: Prefetch the next page in a user journey before they navigate to it
2. **Resource Discovery**: Preload images, stylesheets, or scripts that will be needed on subsequent pages
3. **Bandwidth Optimization**: Take advantage of idle network time to load future resources
4. **Progressive Enhancement**: Improve user experience by reducing wait times on navigation

### Best Practices

- Use prefetch for resources that are **likely** but not guaranteed to be needed
- Prefetch resources with **low-to-medium priority** to avoid blocking critical resources
- Monitor actual usage patterns and only prefetch resources with reasonable probability of use
- Avoid prefetching all possible resources; be selective based on analytics
- Consider user's network conditions when deciding what to prefetch

## Browser Support

| Browser | Supported | Min Version | Current Status |
|---------|-----------|-------------|----------------|
| **Chrome** | ✅ Yes | 8+ | Fully supported |
| **Edge** | ✅ Yes | 12+ | Fully supported |
| **Firefox** | ✅ Yes | 2+ | Fully supported |
| **Safari** | ❌ No | — | Not supported (can be enabled via developer menu) |
| **Opera** | ✅ Yes | 15+ | Fully supported |
| **IE** | ⚠️ Partial | 11 | IE 11 only |
| **iOS Safari** | ❌ No | — | Not supported (can be enabled via developer menu) |
| **Android Browser** | ✅ Yes | 4+ | Fully supported |
| **Samsung Internet** | ✅ Yes | 4+ | Fully supported |
| **Opera Mobile** | ✅ Yes | 80+ | Fully supported |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Versions |
|---------|----------|
| **Chrome** | 8 and above (100% support from v8) |
| **Firefox** | 2 and above (100% support from v2) |
| **Safari** | Not supported (no support through version 26.2) |
| **Opera** | 15 and above (100% support from v15) |
| **Edge** | 12 and above (100% support from v12) |
| **IE** | IE 11 only (versions 5.5-10 not supported) |

#### Mobile Browsers

| Browser | Support |
|---------|---------|
| **Android Browser** | 4.0+, 4.4+ (support varies by version) |
| **iOS Safari** | Not supported (versions 3.2-26.1, but can be manually enabled) |
| **Chrome for Android** | 142+ (fully supported) |
| **Firefox for Android** | 144+ (fully supported) |
| **Samsung Internet** | 4.0 and above (100% support) |
| **Opera Mobile** | 80+ (fully supported) |
| **IE Mobile** | IE 11 only |
| **Android UC Browser** | 15.5+ (supported) |
| **UC Browser** | Supported |
| **Baidu Browser** | 13.52+ (supported) |
| **KaiOS Browser** | 2.5+ (supported) |

#### Not Supported

| Browser |
|---------|
| **Opera Mini** (all versions) |
| **BlackBerry Browser** (versions 7-10) |

## Implementation Example

### Basic Prefetch

```html
<!-- Prefetch a likely next page -->
<link rel="prefetch" href="/next-page.html" />

<!-- Prefetch a stylesheet -->
<link rel="prefetch" href="/styles/theme.css" />

<!-- Prefetch a script -->
<link rel="prefetch" href="/js/analytics.js" />

<!-- Prefetch an image -->
<link rel="prefetch" href="/images/hero-large.jpg" />
```

### Conditional Prefetching (with JavaScript)

```javascript
// Prefetch a resource dynamically based on user context
function prefetchResource(url) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

// Prefetch the next page if user is likely to navigate there
if (navigator.connection && navigator.connection.saveData === false) {
  prefetchResource('/products/page-2.html');
}
```

### Combined with Other Resource Hints

```html
<!-- Prefetch for future navigation -->
<link rel="prefetch" href="/next-page.html" />

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//cdn.example.com" />

<!-- Preconnect for faster connections -->
<link rel="preconnect" href="//api.example.com" />

<!-- Preload critical resources for current page -->
<link rel="preload" href="/critical-font.woff2" as="font" crossorigin />
```

## Important Notes

### Safari and iOS Safari

- **Current Status**: Not supported in Safari or iOS Safari
- **Developer Menu Option**: Can be manually enabled via `LinkPrefetch` setting in the Safari developer menu
- **Practical Impact**: Prefetch hints are safely ignored on unsupported browsers, so including them causes no harm
- **Note #1**: "Can be enabled in Safari as `LinkPrefetch` in the developer menu"

### Fallback Strategy

Since Safari doesn't support prefetch natively, consider using alternative optimization strategies:
- Use Service Workers for manual caching strategies
- Implement JavaScript-based resource loading for critical assets
- Use other resource hints like `preload` or `preconnect` that have better Safari support

## Comparison with Related Resource Hints

| Hint | Purpose | Priority | When to Use |
|------|---------|----------|------------|
| **prefetch** | Fetch for future navigation | Low | Resources for future pages |
| **preload** | Fetch for current page | High | Critical resources for current page |
| **preconnect** | Establish connection | Medium | Third-party domains |
| **dns-prefetch** | Resolve DNS | Low | External domain names |

## Network Considerations

- **Bandwidth Impact**: Minimal if prefetch is done during idle time
- **Data Saver Mode**: Browsers respect user's data saver preferences; prefetch may be disabled if active
- **Conditional Prefetching**: Check `navigator.connection` API to avoid prefetching on slow networks
- **Cache Strategy**: Prefetched resources use the browser's standard HTTP cache

## References and Resources

- [Wikipedia: Link Prefetching](https://en.wikipedia.org/wiki/Link_prefetching)
- [Article on Prefetch and Other Hints](https://medium.com/@luisvieira_gmr/html5-prefetch-1e54f6dda15d)
- [W3C Resource Hints Specification](https://www.w3.org/TR/resource-hints/#dfn-prefetch)
- [MDN Web Docs: link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
- [Can I Use: prefetch](https://caniuse.com/link-rel-prefetch)

## Compatibility Summary

- **Global Support**: 82.9% of tracked browsers support prefetch
- **Desktop Coverage**: Excellent (Chrome, Firefox, Edge, Opera) - Safari is the notable exception
- **Mobile Coverage**: Strong (Android browsers, Samsung Internet, most modern mobile browsers)
- **Recommended**: Safe to implement with fallback strategies for Safari users

---

*Last updated: December 2025*
*Data source: caniuse.com*
