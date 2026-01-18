# Resource Hints: dns-prefetch

## Overview

DNS prefetch is a resource hint that tells the browser to perform a Domain Name System (DNS) lookup in the background, improving page load performance by resolving domain names ahead of time.

## Description

The `dns-prefetch` link relation hints to the browser that it should preemptively perform a DNS lookup for a specified domain. This is particularly useful for third-party domains that will be requested later on the page, such as analytics services, CDN domains, or external APIs.

### Basic Syntax

```html
<link rel="dns-prefetch" href="https://example.com/">
```

### How It Works

1. Browser encounters the `dns-prefetch` link in the document
2. Browser performs DNS lookup for the specified domain in the background
3. When the browser needs to connect to that domain later (for images, scripts, stylesheets, etc.), the DNS lookup is already cached
4. This reduces connection latency and improves overall page performance

## Specification

**Status:** Working Draft (WD)
**Specification URL:** [W3C Resource Hints - dns-prefetch](https://www.w3.org/TR/resource-hints/#dns-prefetch)

## Categories

- DOM

## Benefits and Use Cases

### Performance Improvements

- **Reduced DNS Lookup Latency:** DNS lookups typically take 20-120ms. Prefetching eliminates this latency for critical third-party domains
- **Parallel Processing:** DNS lookups happen in the background without blocking page rendering
- **Better User Experience:** Faster connections mean quicker load times and smoother interactions

### Common Use Cases

1. **Third-Party Analytics:** Google Analytics, Mixpanel, Segment
   ```html
   <link rel="dns-prefetch" href="https://www.google-analytics.com">
   <link rel="dns-prefetch" href="https://api.example-analytics.com">
   ```

2. **Content Delivery Networks (CDNs):** For serving images, fonts, or assets
   ```html
   <link rel="dns-prefetch" href="https://cdn.example.com">
   <link rel="dns-prefetch" href="https://fonts.googleapis.com">
   ```

3. **External APIs:** For dynamic content or data fetching
   ```html
   <link rel="dns-prefetch" href="https://api.external-service.com">
   ```

4. **Font Services:** Google Fonts, custom font providers
   ```html
   <link rel="dns-prefetch" href="https://fonts.gstatic.com">
   ```

### When to Use dns-prefetch vs. preconnect

- **dns-prefetch:** Lighter weight, performs only DNS lookup. Best for many domains where you want minimal resource overhead
- **preconnect:** Performs DNS lookup + TCP handshake + TLS negotiation. Best for critical domains where you want maximum optimization

```html
<!-- For third-party scripts that are not critical -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- For critical third-party domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://secondary-domain.com">
```

## Browser Support

### Support Key
- **y** = Full support
- **a** = Partial/Alternate support
- **n** = No support
- **u** = Unknown support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 4 | ✅ Supported (v4+) | Full support since Chrome 4 |
| **Firefox** | 3.5 | ✅ Supported (v127+) | Partial support on HTTP before v127; Full support on HTTPS from v127 onwards |
| **Safari** | 5 | ✅ Supported (v5+) | Full support since Safari 5 |
| **Edge** | 12 | ✅ Supported (v12+) | Full support since Edge 12 |
| **Opera** | 15 | ✅ Supported (v15+) | Full support since Opera 15 |
| **Internet Explorer** | 10 | ⚠️ Limited support | IE9 supported via `prefetch`; IE10+ has full support |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|--------|
| **Safari iOS** | 5.0 | ✅ Supported (v5+) |
| **Android Chrome** | Early versions | ✅ Supported (v142+) |
| **Android Firefox** | Early versions | ✅ Supported (v144+) |
| **Samsung Internet** | 5.0 | ✅ Supported (v5+) |
| **Opera Mobile** | 80 | ✅ Supported (v80+) |
| **Opera Mini** | - | ❌ Not supported |
| **UC Browser** | - | ✅ Supported (v15.5+) |

### Usage Statistics

- **Full Support (y):** 84.52% of global browser usage
- **Partial Support (a):** 0.43% of global browser usage
- **Total Coverage:** ~85% of modern browsers

## Known Issues and Limitations

### Firefox HTTPS Limitation (Before v127)

Firefox versions prior to 127 have limited support for `dns-prefetch`:

- ✅ **HTTP origins:** `dns-prefetch` works correctly
- ❌ **HTTPS origins:** `dns-prefetch` is disabled by default

**Workaround:** Upgrade to Firefox 127 or later for full HTTPS support.

**Reference:** [Firefox Bug #1596935](https://bugzilla.mozilla.org/show_bug.cgi?id=1596935)

### Internet Explorer 9

IE9 supported DNS prefetching using the `prefetch` relation before the standard `dns-prefetch` was defined:

```html
<!-- IE9 syntax (legacy) -->
<link rel="prefetch" href="https://example.com">

<!-- Standard syntax -->
<link rel="dns-prefetch" href="https://example.com">
```

Modern browsers prefer the standard `dns-prefetch` syntax.

## Best Practices

### 1. Prioritize Critical Domains

Only prefetch DNS for domains that will be requested during page load:

```html
<!-- Good: Domains that will definitely be used -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://analytics.google.com">

<!-- Avoid: Domains only used on conditional interactions -->
<!-- <link rel="dns-prefetch" href="https://lazy-loaded-service.com"> -->
```

### 2. Use preconnect for Critical Third-Party Resources

For critical domains, use `preconnect` instead:

```html
<!-- For critical font service -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">

<!-- For critical API endpoint -->
<link rel="preconnect" href="https://api.critical-service.com">
```

### 3. Control DNS Prefetching with Meta Tags

Control browser behavior globally using the `x-dns-prefetch-control` meta tag:

```html
<!-- Disable automatic DNS prefetching -->
<meta http-equiv="x-dns-prefetch-control" content="off">

<!-- Re-enable for specific links -->
<link rel="dns-prefetch" href="https://example.com">
```

### 4. Limit the Number of Prefetches

Too many DNS prefetch hints can be counterproductive:

```html
<!-- Good: 3-5 critical domains -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<link rel="dns-prefetch" href="https://analytics.google.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
<link rel="dns-prefetch" href="https://api.example.com">

<!-- Avoid: Too many prefetch hints -->
<!-- <link rel="dns-prefetch" href="..."> (10+ domains) -->
```

### 5. Place in the Document Head

Put DNS prefetch hints in the `<head>` as early as possible:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- DNS prefetch hints early in head -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://analytics.google.com">

  <title>Page Title</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Content -->
</body>
</html>
```

## Performance Considerations

### When It Helps Most

- **High-latency networks:** Slow connections (3G, 4G) benefit more
- **Multiple third-party domains:** Pages with 4+ external domains see measurable improvements
- **Low-bandwidth scenarios:** Mobile users experience more noticeable improvements

### Minimal Impact Scenarios

- **Same-origin requests:** No benefit (already resolved)
- **Local network:** Minimal improvement on fast local networks
- **Single domain:** Limited benefit if only requesting from one external domain

### Measurement

Use the Navigation Timing API to measure DNS lookup time:

```javascript
// Check DNS lookup duration
const perfData = window.performance.timing;
const dnsDuration = perfData.domainLookupEnd - perfData.domainLookupStart;
console.log('DNS lookup time:', dnsDuration, 'ms');
```

## Related Resource Hints

The `dns-prefetch` is part of a family of resource hints:

1. **dns-prefetch:** DNS lookup only (~DNS query time savings)
2. **preconnect:** DNS + TCP + TLS (~100-300ms savings)
3. **prefetch:** Download resource in background (~full resource load)
4. **preload:** Load resource needed for current page (~dependency resolution)
5. **prerender:** Render entire page in background (heavyweight)

## References and Resources

### Official Documentation

- [W3C Resource Hints Specification](https://www.w3.org/TR/resource-hints/#dns-prefetch)
- [MDN: Controlling DNS Prefetching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Controlling_DNS_prefetching)

### Articles and Guides

- [What to use: dns-prefetch vs preconnect](https://www.ctrl.blog/entry/dns-prefetch-preconnect.html) - Comprehensive comparison
- [MSDN: Prerender and Prefetch Support](https://msdn.microsoft.com/en-us/library/dn265039(v=vs.85).aspx) - Internet Explorer documentation

### Tools and Services

- [Can I Use: dns-prefetch](https://caniuse.com/link-dns-prefetch) - Live browser support data
- [WebPageTest](https://webpagetest.org/) - Performance testing with DNS metrics
- [Chrome DevTools Network Tab](https://developer.chrome.com/docs/devtools/) - Monitor DNS lookups

## Code Examples

### Basic Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DNS Prefetch Example</title>

  <!-- DNS Prefetch for common third-party services -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">

  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <style>
    body { font-family: Roboto, sans-serif; }
  </style>
</head>
<body>
  <h1>DNS Prefetch Example</h1>
  <p>External resources will load faster thanks to DNS prefetching.</p>

  <script async src="https://www.google-analytics.com/analytics.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
</body>
</html>
```

### Progressive Enhancement with preconnect

```html
<head>
  <!-- Critical third-party: use preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">

  <!-- Secondary third-party: use dns-prefetch -->
  <link rel="dns-prefetch" href="https://analytics.google.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
  <link rel="dns-prefetch" href="https://api.example.com">

  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</head>
```

### Conditional DNS Prefetch

```html
<head>
  <script>
    // Enable DNS prefetch only for modern browsers
    if ('link' in document && 'href' in document.createElement('link')) {
      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = 'https://api.example.com';
      document.head.appendChild(dnsLink);
    }
  </script>
</head>
```

## Conclusion

DNS prefetch is a lightweight, low-risk performance optimization that works across virtually all modern browsers. By prefetching DNS lookups for critical third-party domains, you can provide a measurable improvement to page load times, especially for users on slower networks. Use it as part of a comprehensive performance optimization strategy alongside other resource hints like `preconnect` and `preload`.

---

**Last Updated:** 2025
**Browser Support:** 85%+ of global usage
**Specification Status:** Working Draft
