# Resource Hints: prerender

## Overview

The `prerender` resource hint is a performance optimization feature that hints to the browser to render a specified page in the background. This can significantly speed up page load times if the user navigates to the prerendered page.

## Description

The prerender hint is expressed using the following HTML syntax:

```html
<link rel="prerender" href="https://example.com/page">
```

This instructs the browser to proactively render the specified page in the background, preparing it for faster navigation. If the user subsequently visits that page, the browser can display it instantly or with minimal delay, as it has already been processed and rendered.

## Specification Status

- **Status**: Working Draft (WD)
- **Specification**: [W3C Resource Hints](https://www.w3.org/TR/resource-hints/#prerender)
- **Category**: DOM

## Categories

- DOM (Document Object Model)

## Use Cases & Benefits

### Performance Optimization
- **Reduced Navigation Time**: Pages that have been prerendered appear instantaneously when navigated to
- **Improved User Experience**: Smoother transitions between pages
- **Predictive Loading**: Useful when you can anticipate which pages users are likely to visit next

### Practical Applications
- **Checkout Flows**: Prerender the next step in a multi-step process before the user clicks
- **Search Results**: Prerender top result pages while the user is browsing search results
- **Single Page Applications**: Prerender likely destination routes before navigation
- **Content Recommendations**: Prerender suggested articles or products

### Performance Considerations
- Resources are consumed during prerendering, including CPU and memory
- Network bandwidth is used to fetch resources for the prerendered page
- Should be used strategically for high-confidence navigation paths
- Browser may ignore the hint based on user preferences, connectivity, or resource constraints

## Browser Support

| Browser | Initial Support | Current Status | Notes |
|---------|-----------------|---|-------|
| **Chrome** | 13 | Supported (146) | Treats as NoState Prefetch; doesn't execute JavaScript or render page in advance |
| **Edge** | 79 | Supported (143) | Full Chromium-based support |
| **Opera** | 15 | Supported (122) | Full support from Opera 15+ |
| **Firefox** | Not Supported | Not Supported (148) | No implementation; feature request open |
| **Safari** | Not Supported | Not Supported (26.1) | No implementation |
| **iOS Safari** | Not Supported | Not Supported (26.1) | No implementation on iOS |
| **Internet Explorer** | 11 | Supported (11) | Partial support in IE 11 |
| **Opera Mini** | Not Supported | Not Supported | No support across all versions |
| **Android Browser** | Not Supported | Not Supported (142) | No support |
| **Samsung Internet** | 4 | Supported (29) | Full support from version 4+ |

### Mobile Browser Support

- **Android Chrome** (142): Supported
- **Opera Mobile** (80): Supported
- **UC Browser** (15.5): Supported
- **Android UC** (15.5): Supported
- **QQ Browser** (14.9): Supported
- **Baidu Browser** (13.52): Supported
- **IE Mobile** (11): Supported
- **Android Firefox** (144): Not supported
- **KaiOS** (3.0-3.1): Not supported

## Global Usage Statistics

- **Support Coverage**: ~80.19% of global users have browsers that support prerender
- **Unprefixed**: Feature uses standard syntax without vendor prefixes

## Important Notes

### Chrome Implementation Details
Chrome treats the `prerender` hint as a [NoState Prefetch](https://developers.google.com/web/updates/2018/07/nostate-prefetch) instead of a true prerender. Key differences:

- JavaScript is not executed
- The page is not fully rendered in advance
- Resources are fetched and cached
- The browser performs some preparation, but not a complete render

This is a significant limitation for applications that rely on JavaScript execution for page functionality.

### Browser Limitations
- Firefox and Safari do not support this feature and have no announced plans for implementation
- Support is primarily in Chromium-based browsers (Chrome, Edge, Opera)
- Mobile support varies; iOS Safari does not support it
- The hint is non-binding; browsers may choose to ignore it based on:
  - User preferences and privacy settings
  - Available system resources
  - Network conditions (slow connections)
  - Battery life considerations (on mobile devices)

### Best Practices
1. Use for high-confidence navigation paths (e.g., checkout flows, pagination)
2. Monitor actual usage to verify prerendering is beneficial
3. Consider server load impact if prerendering increases requests significantly
4. Combine with other resource hints like `prefetch` and `preconnect`
5. Test across different devices and network conditions
6. Provide fallback experiences for unsupporting browsers

## Related Resource Hints

- **`prefetch`**: Hints the browser to fetch resources that will be needed for future navigation
- **`preconnect`**: Hints the browser to establish a connection to a domain in advance
- **`dns-prefetch`**: Hints the browser to perform DNS resolution for a domain
- **`preload`**: Specifies resources the current page will definitely need

## Implementation Example

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Prerender the checkout page -->
  <link rel="prerender" href="/checkout">

  <!-- Prerender multiple pages -->
  <link rel="prerender" href="/product/featured-item">
  <link rel="prerender" href="/product/recommended-item">
</head>
<body>
  <h1>Shopping Page</h1>
  <a href="/checkout">Proceed to Checkout</a>
</body>
</html>
```

## References & Additional Resources

- [W3C Resource Hints Specification](https://www.w3.org/TR/resource-hints/#prerender)
- [Microsoft: Prerender and prefetch support](https://msdn.microsoft.com/en-us/library/dn265039(v=vs.85).aspx)
- [Firefox Implementation Request](https://bugzilla.mozilla.org/show_bug.cgi?id=730101)
- [Chrome: NoState Prefetch (2018 Update)](https://developers.google.com/web/updates/2018/07/nostate-prefetch)
- [MDN: Link Types - prerender](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#prerender)

## Feature Status Summary

| Aspect | Details |
|--------|---------|
| **Specification** | Working Draft (WD) |
| **Browser Support** | ~80% global coverage |
| **Primary Browsers** | Chrome 13+, Edge 79+, Opera 15+, Samsung 4+ |
| **Mobile Support** | Limited; Android-based browsers mostly supported |
| **Implementation Type** | Chromium: NoState Prefetch; IE: Full prerender |
| **Binding** | No (browsers can ignore) |
| **Prefix Required** | No |

---

*Documentation generated from CanIUse data. Browser support information current as of the latest data update.*
