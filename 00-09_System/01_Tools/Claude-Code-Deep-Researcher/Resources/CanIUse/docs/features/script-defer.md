# Script Defer Attribute

## Overview

The `defer` attribute on script elements is a boolean attribute that allows external JavaScript files to execute after the DOM has finished loading, without blocking page load. This is a critical HTML5 feature for optimizing page performance.

## Description

The `defer` attribute tells the browser to:
- Download the script file in parallel while the page continues parsing
- Execute the script only after the DOM has been fully parsed
- Maintain script execution order (scripts execute in the order they appear in the HTML)

This differs from the `async` attribute, which executes scripts as soon as they're available without regard to DOM parsing or execution order.

## Specification Status

**Status**: Living Standard (ls)

**Official Specification**: [WHATWG HTML Standard - Script Defer Attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer)

## Categories

- DOM
- HTML5

## Benefits & Use Cases

### Performance Optimization
- **Non-blocking page load**: Scripts download in the background without delaying initial page rendering
- **Faster time to interactive**: Users see content sooner even while scripts are downloading

### Execution Order Guarantee
- **Predictable script execution**: Scripts execute in the order they appear in the HTML
- **Dependency management**: Ensures scripts that depend on each other run in the correct order
- **Library loading**: Useful for loading framework code before application code

### Best Practices
- **Better UX**: Deferred scripts improve perceived page speed
- **SEO friendly**: Content renders quickly for search engine crawlers
- **Mobile optimization**: Reduces impact on mobile device performance
- **Modern development**: Recommended for all external scripts that don't need to run immediately

## Browser Support

### Support Key
- **y** = Full support
- **a** = Partial/buggy support
- **n** = No support
- **#1, #2** = See notes below

### Desktop Browsers

| Browser | Supported Versions |
|---------|-------------------|
| **Chrome** | 8+ |
| **Edge** | 12+ (all versions) |
| **Firefox** | 3.5+ (#2), full support from 31+ |
| **IE** | 5.5-9 (buggy #1), 10+ |
| **Opera** | 15+ |
| **Safari** | 5+ |

### Mobile Browsers

| Browser | Supported Versions |
|---------|-------------------|
| **iOS Safari** | 5.0+ |
| **Android Browser** | 3+ |
| **Android Chrome** | 142+ |
| **Android Firefox** | 144+ |
| **Opera Mobile** | 11.5-12.1 (no support), 80+ |
| **Opera Mini** | Not supported (all versions) |
| **Samsung Internet** | 4+ |
| **BlackBerry** | 7+ |
| **UC Browser** | 15.5+ |
| **QQ Browser** | 14.9+ |
| **Baidu Browser** | 13.52+ |
| **KaiOS** | 2.5+ |

### Support Summary

- **Global support**: 93.6% (usage_perc_y)
- **Partial support**: 0.09% (usage_perc_a)
- **Overall adoption**: Nearly universal support in modern browsers

## Known Issues & Notes

### Note #1: Internet Explorer Buggy Behavior
Partial support in IE versions 5.5-9 refers to a buggy implementation. Scripts may not defer reliably in these versions.

**Reference**: [lazyweb-requests issue #42](https://github.com/h5bp/lazyweb-requests/issues/42)

### Note #2: Firefox Implementation Quirk
In Firefox versions 3.5-30, deferred scripts may run after the `DOMContentLoaded` event, rather than before it. This behavior was corrected in Firefox 31+.

**Reference**: [Firefox Bug 688580](https://bugzilla.mozilla.org/show_bug.cgi?id=688580)

### Chrome XHTML Issue
Google Chrome does not defer scripts when the page is served as XHTML (`application/xhtml+xml` content type). This is a known limitation.

**References**:
- [Chromium Issue #611136](https://bugs.chromium.org/p/chromium/issues/detail?id=611136)
- [Chromium Issue #874749](https://bugs.chromium.org/p/chromium/issues/detail?id=874749)

## Usage Example

```html
<!-- Deferred script - executes after DOM is loaded -->
<script src="analytics.js" defer></script>

<!-- Deferred script - executes in order -->
<script src="library.js" defer></script>
<script src="app.js" defer></script>

<!-- Comparison: Async script - executes as soon as available -->
<script src="tracking.js" async></script>

<!-- Inline script - executes immediately (blocking) -->
<script>
  console.log('This runs immediately');
</script>
```

## Comparison with Async

| Aspect | Defer | Async | None |
|--------|-------|-------|------|
| **Execution Timing** | After DOM parsing | Immediately when available | Blocks DOM parsing |
| **Execution Order** | Maintained | Not guaranteed | N/A |
| **Use Case** | Normal scripts | Analytics, ads, tracking | Inline code |
| **Performance** | Good | Good | Poor (blocking) |

## Related Links

- [MDN Web Docs - Script Attributes](https://developer.mozilla.org/en/HTML/Element/script#Attributes)
- [WebPlatform Docs - Defer Attribute](https://webplatform.github.io/docs/html/attributes/defer)
- [Comparing Async vs Defer Attributes](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
- [has.js Script Defer Test](https://raw.github.com/phiggins42/has.js/master/detect/script.js#script-defer)

## Recommendations

1. **Use `defer` by default**: For all non-critical external scripts
2. **Avoid inline scripts**: Move inline scripts to deferred external files when possible
3. **Be cautious with IE9 and below**: Test thoroughly if you need to support older IE versions
4. **Avoid XHTML**: If using Chrome, avoid serving pages as XHTML if you need deferred scripts
5. **Consider `async` for independent scripts**: Use `async` for scripts that don't depend on the DOM or other scripts

## Browser Version Matrix (Complete)

### Chrome
- **No support**: 4-7
- **Full support**: 8+

### Firefox
- **No support**: 2-3
- **Partial support**: 3.5-30
- **Full support**: 31+

### Safari
- **No support**: 3.1-4
- **Full support**: 5+

### Internet Explorer
- **Buggy support**: 5.5-9
- **Full support**: 10+

### Edge
- **Full support**: 12+ (all versions)

### Opera
- **No support**: 9-12.1
- **Full support**: 15+

---

*Last updated: 2024 | Data source: CanIUse* | *Usage globally: 93.6%*
