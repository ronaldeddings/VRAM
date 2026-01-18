# Resource Hints: Preload

## Overview

The `<link rel="preload">` directive enables developers to tell the browser to prefetch resources without executing them, providing fine-grained control over when and how resources are loaded. This is a critical performance optimization technique for modern web applications.

## Description

Using `<link rel="preload">`, browsers can be informed to prefetch resources without having to execute them, allowing fine-grained control over when and how resources are loaded. Only the following `as` attribute values are supported:

- `fetch` - For fetch/XHR requests
- `image` - For images
- `font` - For web fonts
- `script` - For JavaScript files
- `style` - For CSS stylesheets
- `track` - For text tracks (subtitles, captions)

## Specification Status

- **Status:** Candidate Recommendation (CR)
- **Spec URL:** [W3C Preload Specification](https://w3c.github.io/preload/)

## Categories

- **DOM** - Document Object Model

## Benefits and Use Cases

### Performance Optimization

- **Early Resource Loading**: Start fetching resources early in the page load cycle, reducing overall page load time
- **Priority Control**: Explicitly prioritize loading of critical resources ahead of non-critical ones
- **Bandwidth Optimization**: Load resources when the browser is less busy, improving overall performance

### Typical Use Cases

1. **Web Fonts**: Preload custom fonts before they're needed in CSS
   ```html
   <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
   ```

2. **Critical CSS**: Preload critical above-the-fold styling
   ```html
   <link rel="preload" href="/css/critical.css" as="style">
   ```

3. **JavaScript Bundles**: Load critical JS files ahead of time
   ```html
   <link rel="preload" href="/js/app.js" as="script">
   ```

4. **Hero Images**: Preload large hero images on the homepage
   ```html
   <link rel="preload" href="/images/hero.jpg" as="image">
   ```

5. **Video Resources**: Preload video files for better playback performance
   ```html
   <link rel="preload" href="/videos/intro.mp4" as="fetch" type="video/mp4">
   ```

## Browser Support

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 50+ | ✅ Full | Full support from v50 onwards |
| **Edge** | 79+ | ✅ Full | Full support from v79 (Chromium-based) |
| | 17-18 | ⚠️ Partial | HTML `<link rel>` format only, not HTTP header |
| | 12-16 | ❌ None | Not supported |
| **Firefox** | 85+ | ✅ Full | Full support from v85 onwards |
| | 56 | ⚠️ Partial | Limited support |
| | 57-84 | ❌ Disabled | Behind `network.preload` flag |
| | 2-55 | ❌ None | Not supported |
| **Safari** | 11.1+ | ✅ Full | Full support from v11.1 onwards |
| | 11 | ⚠️ Disabled | Can be enabled via Experimental Features |
| | 3.1-10.1 | ❌ None | Not supported |
| **Opera** | 37+ | ✅ Full | Full support from v37 onwards |
| | 9-36 | ❌ None | Not supported |
| **Internet Explorer** | All | ❌ None | Not supported |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 11.3+ | ✅ Full | Full support from v11.3 onwards |
| | 11.0-11.2 | ⚠️ Disabled | Can be enabled via Experimental Features |
| | 3.2-10.3 | ❌ None | Not supported |
| **Android Chrome** | 142+ | ✅ Full | Full support |
| **Android Firefox** | 144+ | ✅ Full | Full support |
| **Samsung Internet** | 5.0+ | ✅ Full | Full support from v5.0 onwards |
| **Opera Mobile** | 80+ | ✅ Full | Full support from v80 onwards |
| **Opera Mini** | All | ❌ None | Not supported |
| **Android Browser** | 142+ | ✅ Full | Full support on Android 12+ |
| **UC Browser** | 15.5+ | ✅ Full | Full support |
| **QQ Browser** | 14.9+ | ✅ Full | Full support |
| **Baidu Browser** | 13.52+ | ✅ Full | Full support |

## Implementation Examples

### Basic Preload

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Preload a stylesheet -->
  <link rel="preload" href="/css/style.css" as="style">
  <link rel="stylesheet" href="/css/style.css">

  <!-- Preload a script -->
  <link rel="preload" href="/js/app.js" as="script">
  <script src="/js/app.js" defer></script>
</head>
<body>
  <!-- Content here -->
</body>
</html>
```

### Preloading Web Fonts

```html
<head>
  <link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/roboto-bold.woff2" as="font" type="font/woff2" crossorigin>

  <style>
    @font-face {
      font-family: "Roboto";
      src: url("/fonts/roboto.woff2") format("woff2");
    }
  </style>
</head>
```

### Preloading with Media Queries

```html
<head>
  <!-- Load large image only on desktop -->
  <link rel="preload" href="/images/hero-desktop.jpg" as="image" media="(min-width: 768px)">
  <!-- Load mobile image on mobile devices -->
  <link rel="preload" href="/images/hero-mobile.jpg" as="image" media="(max-width: 767px)">
</head>
```

### Preloading JSON Data

```html
<head>
  <link rel="preload" href="/api/data.json" as="fetch" crossorigin>
</head>
<script>
  fetch('/api/data.json')
    .then(response => response.json())
    .then(data => console.log(data));
</script>
```

## Important Notes

### Browser Compatibility Notes

1. **Firefox Limitations**:
   - Only cachable resources can be preloaded in Firefox
   - Disabled by default behind the `network.preload` flag in versions 57-84

2. **Safari (macOS)**:
   - Can be enabled via the "Experimental Features" developer menu in version 11

3. **iOS Safari**:
   - Can be enabled via the "Experimental Features" developer menu in version 11.0-11.2

4. **Edge Legacy**:
   - Partial support in Edge 17-18 refers to support for only the HTML `<link rel>` format, not the HTTP header format

### Best Practices

1. **Avoid Overuse**: Only preload resources that are critical to the user's current navigation
2. **Consider Bandwidth**: Be mindful of users on slow connections; preloading consumes bandwidth
3. **Monitor Performance**: Use browser DevTools to verify preloaded resources are being used
4. **Use Crossorigin**: Always include `crossorigin` attribute for cross-origin resources to avoid duplicate downloads
5. **Specify Media Types**: Include `type` attribute to allow browsers to skip unsupported formats
6. **Combine with HTTP/2 Server Push**: For maximum performance, combine preload with server push strategies

## Usage Statistics

- **Full Support**: 92.79% of users
- **Partial/Disabled Support**: 0%
- **No Support**: 7.21% of users

## Related Resources

### Official Documentation
- [MDN Web Docs - Preloading content with rel="preload"](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)
- [W3C Preload Specification](https://w3c.github.io/preload/)

### Articles and Guides
- [Preload: What Is It Good For?](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/) - Smashing Magazine

### Bug Reports
- [Firefox meta support bug](https://bugzilla.mozilla.org/show_bug.cgi?id=Rel%3Dpreload) - Mozilla Bugzilla

## See Also

- [Resource Hints: prefetch](../features/link-rel-prefetch.md)
- [Resource Hints: preconnect](../features/link-rel-preconnect.md)
- [Resource Hints: dns-prefetch](../features/link-rel-dns-prefetch.md)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/Performance)
