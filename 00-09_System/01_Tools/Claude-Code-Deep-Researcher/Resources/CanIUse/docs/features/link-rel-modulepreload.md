# Resource Hints: modulepreload

## Overview

The `<link rel="modulepreload">` feature allows developers to hint to the browser that it should prefetch JavaScript module scripts without executing them. This provides fine-grained control over when and how module resources are loaded, enabling better performance optimization and resource management in modern web applications.

## Description

Using `<link rel="modulepreload">`, browsers can be informed to prefetch module scripts without having to execute them, allowing fine-grained control over when and how module resources are loaded. This is particularly useful in applications that:

- Use ES modules extensively
- Need to optimize initial page load performance
- Want to pre-warm the module cache before dependency graphs are traversed
- Require coordinated loading of interdependent modules

### Syntax

```html
<link rel="modulepreload" href="module.js" />
<link rel="modulepreload" href="utils.js" as="script" />
```

## Specification Status

- **Status:** Living Standard (ls)
- **Spec URL:** [HTML Living Standard - Link Type: modulepreload](https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload)
- **Specification Document:** Defined in the WHATWG HTML specification as part of resource hints

## Categories

- **DOM:** Document Object Model (HTML link elements)

## Benefits and Use Cases

### Performance Optimization

- **Parallel Loading:** Begin downloading modules in parallel before the main script executes and discovers dependencies
- **Faster Dependency Resolution:** Pre-populate the module map, reducing latency when modules are imported
- **Reduced Waterfall:** Break the dependency chain that would otherwise cause sequential module loading

### Application Architecture

- **Explicit Module Declaration:** Clearly document which modules are critical to application initialization
- **Dependency Management:** Provide better visibility into application dependency graphs
- **Controlled Loading Sequences:** Orchestrate module loading order for optimal performance

### Practical Scenarios

- **Large Single Page Applications:** Optimize loading of split code bundles
- **Progressive Enhancement:** Load feature modules only when needed
- **Multi-Team Projects:** Share common module preloading strategies across teams
- **Performance-Critical Applications:** Reduce time to interactive (TTI) for users

## Browser Support

### Support Summary

Modulepreload has excellent modern browser support with 91.35% global usage:

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| **Chrome** | 66 | Full (66+) |
| **Edge** | 79 | Full (79+) |
| **Firefox** | 115 | Full (115+) |
| **Safari** | 17.0 | Full (17.0+) |
| **Opera** | 53 | Full (53+) |
| **Internet Explorer** | ✗ Not supported | N/A |

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| Chrome | 66+ | ✓ Yes | Full support |
| Edge | 79+ | ✓ Yes | Full support |
| Firefox | 115+ | ✓ Yes | Added in Firefox 115 |
| Safari | 17.0+ | ✓ Yes | macOS 13.1+ |
| Opera | 53+ | ✓ Yes | Chromium-based |
| Internet Explorer | 5.5-11 | ✗ No | Not supported in any version |

### Mobile Browsers

| Platform | Version | Support | Notes |
|----------|---------|---------|-------|
| **iOS Safari** | 17.0+ | ✓ Yes | iOS 17+ |
| **Android Chrome** | 66+ | ✓ Yes | Android 5.0+ (Chrome 66+) |
| **Android Firefox** | 115+ | ✓ Yes | Recent Firefox versions |
| **Samsung Internet** | 9.2+ | ✓ Yes | Galaxy devices |
| **Opera Mobile** | 80+ | ✓ Yes | Modern versions |
| **Opera Mini** | All | ✗ No | Not supported |

### Regional Availability

- **Global Usage:** 91.35% of users have browser support
- **Well-supported regions:** North America, Europe, East Asia
- **Fallback needed for:** Legacy browsers, Opera Mini users

## Implementation Examples

### Basic Usage

```html
<!-- Preload a single module -->
<link rel="modulepreload" href="/js/utils.js">
<link rel="modulepreload" href="/js/helpers.js">

<!-- Import the modules later -->
<script type="module">
  import { utilFunction } from '/js/utils.js';
  utilFunction();
</script>
```

### With Additional Attributes

```html
<!-- Specify loading attributes -->
<link
  rel="modulepreload"
  href="/js/app.js"
  as="script"
  crossorigin
/>

<link
  rel="modulepreload"
  href="/js/api.js"
  referrerpolicy="no-referrer"
/>
```

### Preloading Dependencies

```html
<!-- Preload a module graph -->
<link rel="modulepreload" href="/js/app.js">
<link rel="modulepreload" href="/js/utils.js">
<link rel="modulepreload" href="/js/api-client.js">

<script type="module">
  // All modules are already in the module map
  import App from '/js/app.js';
  App.initialize();
</script>
```

## Important Notes

### Attribute Changes Don't Trigger Re-fetches

Unlike some other link relations, changing the relevant attributes (such as `as`, `crossorigin`, and `referrerpolicy`) of such a link does not trigger a new fetch. This is because the document's module map has already been populated by a previous fetch, and so re-fetching would be pointless.

**Implication:** The first `<link rel="modulepreload">` for a given URL determines how that module is fetched. Subsequent links with different attributes will not change the fetch behavior.

```html
<!-- First declaration determines fetch behavior -->
<link rel="modulepreload" href="/js/module.js" crossorigin>

<!-- This does NOT re-fetch with different attributes -->
<link rel="modulepreload" href="/js/module.js" referrerpolicy="no-referrer">
```

### Best Practices

1. **Declare modulepreload early** in the `<head>` section for maximum benefit
2. **Use for known dependencies** that will definitely be imported
3. **Avoid over-preloading** - only preload modules you know will be needed
4. **Consider module size** - balance preloading with initial page payload
5. **Monitor performance** - measure actual improvements with real user monitoring

### Comparison with Other Resource Hints

| Hint | Purpose | Use Case |
|------|---------|----------|
| `preload` | High-priority resource for current page | CSS, fonts, critical images |
| `modulepreload` | Module script with dependencies | ES modules, app bundles |
| `prefetch` | Resource for future navigation | Next page resources |
| `dns-prefetch` | DNS lookup optimization | Cross-domain resources |

## Relevant Links

- [Google Developers: Preloading modules](https://developers.google.com/web/updates/2017/12/modulepreload)
- [Jason Format: Modern Script Loading](https://jasonformat.com/modern-script-loading/)
- [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload)
- [Gecko Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1425310)
- [WebKit Implementation Bug](https://bugs.webkit.org/show_bug.cgi?id=180574)

## Browser Implementation Status

### Chromium-Based Browsers (Chrome, Edge, Opera)
- ✓ Well-established support since 2017-2018
- ✓ Fully compliant with specification
- ✓ Handles module graphs correctly

### Firefox
- ✓ Added in version 115 (August 2023)
- ✓ Previously tracking in implementation bug (Gecko Bug #1425310)
- ✓ Now fully compliant

### WebKit (Safari)
- ✓ Added in version 17.0 (September 2023)
- ✓ Implementation tracked in WebKit bug #180574
- ✓ iOS and macOS support aligned

### Internet Explorer
- ✗ No support in any version
- ✗ Use feature detection or polyfills for IE 11 applications

## Migration Guide

### From preload to modulepreload

```html
<!-- Old approach - loading regular scripts -->
<link rel="preload" href="/js/utils.js" as="script">
<script defer src="/js/utils.js"></script>

<!-- New approach - proper module preloading -->
<link rel="modulepreload" href="/js/utils.js">
<script type="module">
  import { utilFunction } from '/js/utils.js';
</script>
```

### From implicit to explicit module loading

```html
<!-- Before: Implicit dependency discovery (waterfall) -->
<script type="module" src="/js/app.js"></script>
<!-- app.js imports utils.js, which imports helpers.js -->

<!-- After: Explicit preloading (parallel) -->
<link rel="modulepreload" href="/js/helpers.js">
<link rel="modulepreload" href="/js/utils.js">
<link rel="modulepreload" href="/js/app.js">
<script type="module" src="/js/app.js"></script>
```

## Fallback Strategies

### For Unsupported Browsers

Since modulepreload is not supported in IE and older browsers, consider:

1. **Progressive Enhancement:** Deploy without modulepreload for older browsers
2. **Bundling Approach:** Use build tools to pre-bundle modules
3. **Polyfill:** Consider link prefetch as lightweight alternative
4. **Feature Detection:** Check browser support before using

```html
<script>
  // Feature detection
  if (!document.createElement('link').relList.supports('modulepreload')) {
    console.log('modulepreload not supported - use alternative strategy');
  }
</script>
```

## Performance Metrics

- **Global Usage:** 91.35% of users
- **Practical Adoption:** High in modern web applications
- **Performance Gain:** Typically 10-50ms reduction in module loading time depending on dependency graph complexity

## See Also

- [Resource Hints Specification](https://html.spec.whatwg.org/multipage/links.html)
- [ES Modules Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Module Script Loading](https://html.spec.whatwg.org/multipage/webappapis.html#module-script)

---

**Last Updated:** 2025
**Documentation Version:** 1.0
