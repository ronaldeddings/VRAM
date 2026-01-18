# Resource Hints: Lazyload

## Overview

The `lazyload` attribute is a resource hint that signals to browsers to lower the loading priority of a resource. This legacy attribute allows developers to indicate which resources should be deferred during page load, helping optimize perceived performance and bandwidth usage.

## Description

The `lazyload` attribute provides a hint to browsers about the loading priority of resources. This feature enables developers to control which resources are critical for initial page render and which can be loaded later. By marking non-critical resources for lazy loading, developers can improve page load times and prioritize essential content.

**Note:** This is a legacy attribute. For modern implementations, see the [`loading`](/loading-lazy-attr) attribute for the new standardized API.

## Specification Status

- **Status:** Unofficial (unoff)
- **Specification:** [W3C Web Performance - Resource Priorities](https://w3c.github.io/web-performance/specs/ResourcePriorities/Overview.html)
- **Standardization Level:** Not part of an official standard specification

## Categories

- DOM

## Use Cases & Benefits

### Performance Optimization
- Reduce initial page load time by deferring non-critical resource loading
- Improve Time to First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
- Better bandwidth management for users on slower connections

### Resource Management
- Prioritize critical resources (above-the-fold content)
- Load below-the-fold images and content on demand
- Optimize loading order for improved user experience

### Legacy Support
- Maintain backward compatibility for older browser versions
- Provide hints to browsers that respect the attribute for resource optimization

## Browser Support

| Browser | Version(s) | Support |
|---------|-----------|---------|
| **Internet Explorer** | 11 | ✅ Yes |
| **Internet Explorer** | 5.5-10 | ❌ No |
| **Edge (Legacy)** | 12-18 | ✅ Yes |
| **Edge (Chromium)** | 79+ | ❌ No |
| **Firefox** | All versions | ❌ No |
| **Chrome** | All versions | ❌ No |
| **Safari** | All versions | ❌ No |
| **Opera** | All versions | ❌ No |
| **iOS Safari** | All versions | ❌ No |
| **Android Browser** | All versions | ❌ No |
| **IE Mobile** | 11 | ✅ Yes |
| **Samsung Internet** | All versions | ❌ No |

### Support Summary

- **Global Usage:** 0.33% (full support only)
- **Limited Support Browsers:** Internet Explorer 11, IE Mobile 11, Edge 12-18 (Trident/EdgeHTML)
- **No Support:** Modern browsers (Chromium-based Edge, Firefox, Chrome, Safari, Opera)

## Implementation Notes

### Historical Context

The `lazyload` attribute was primarily supported in Internet Explorer and the legacy Edge browser (before the switch to Chromium). As modern browsers and standardized APIs have evolved, support for this attribute has been largely deprecated in favor of:

1. **Native `loading="lazy"` Attribute** - The modern standard for lazy loading images and iframes
2. **Intersection Observer API** - JavaScript-based solution for detecting when elements enter the viewport
3. **JavaScript Libraries** - Various third-party lazy loading libraries

### Migration Considerations

When transitioning from the legacy `lazyload` attribute to modern approaches:

- Use the `loading="lazy"` attribute on `<img>` and `<iframe>` elements (supported in all modern browsers)
- Implement Intersection Observer API for custom lazy loading logic
- Ensure fallbacks are in place for older browsers that don't support modern solutions

## Related Resources

- [MDN - MSDN IE lazyload Documentation](https://msdn.microsoft.com/en-us/ie/dn369270(v=vs.94))
- [GitHub Discussion on Standardization](https://github.com/whatwg/html/issues/2806)
- [Modern `loading` Attribute Documentation](/loading-lazy-attr)
- [Intersection Observer API - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Recommendations

### For New Projects
Use the standardized `loading="lazy"` attribute instead of the legacy `lazyload` attribute:

```html
<!-- Modern approach -->
<img src="image.jpg" loading="lazy" alt="Description" />
<iframe src="content.html" loading="lazy"></iframe>
```

### For Legacy Support
If legacy browser support is required, combine the modern approach with fallbacks:

```html
<!-- Supports modern browsers and provides hint for older browsers -->
<img src="image.jpg" loading="lazy" lazyload alt="Description" />
```

### Best Practices
1. Prioritize the standardized `loading` attribute for all new implementations
2. Use Intersection Observer API for more complex lazy loading scenarios
3. Test across target browsers to ensure proper functionality
4. Consider browser support requirements when choosing implementation method
5. Monitor performance improvements after implementing lazy loading

## Version History

- **IE 11:** First and last version to support `lazyload`
- **Edge 12-18:** Supported in legacy EdgeHTML versions
- **IE Mobile 11:** Limited support in mobile Internet Explorer
- **Modern Browsers:** Deprecated in favor of `loading="lazy"` and Intersection Observer API

## See Also

- [CSS `contain` Property](https://caniuse.com/css-containment)
- [Intersection Observer API](https://caniuse.com/intersectionobserver)
- [Modern Loading Lazy Attribute](https://caniuse.com/loading-lazy-attr)
- [Web Performance APIs](https://caniuse.com/#search=performance)
