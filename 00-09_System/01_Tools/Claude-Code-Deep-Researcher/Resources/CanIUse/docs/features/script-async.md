# async Attribute for External Scripts

## Overview

The `async` attribute is a boolean HTML attribute that can be applied to `<script>` elements to load and execute external JavaScript files asynchronously, without blocking the page load.

## Description

The `async` attribute allows external JavaScript files to run as soon as they become available, without delaying the initial page load. When the `async` attribute is specified on a script tag that references an external file, the browser will:

1. Download the script in parallel while continuing to parse the HTML
2. Execute the script immediately when it finishes downloading
3. Continue parsing the page without waiting for the script to load

This behavior is particularly useful for non-critical scripts that don't need to execute before the page content is rendered.

## Specification Status

**Status:** Living Standard (LS)
**W3C/WHATWG Specification:** [HTML Living Standard - Script async attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async)

## Categories

- DOM (Document Object Model)
- HTML5

## Benefits & Use Cases

### Performance Optimization
- Improves page load times by allowing scripts to load in parallel with page content
- Prevents render-blocking behavior for non-critical scripts
- Enables faster initial page display and time-to-interactive metrics

### Common Applications

1. **Analytics Scripts** - Load tracking scripts without impacting user experience
2. **Third-party Services** - Load advertisements, social media widgets, and similar resources asynchronously
3. **Non-critical Enhancements** - Load scripts that provide enhanced functionality but aren't essential for core functionality
4. **Background Tasks** - Execute scripts that handle non-urgent operations like error reporting

### Comparison with defer Attribute

The `async` attribute differs from the `defer` attribute:

| Attribute | Execution Time | Execution Order | Best For |
|-----------|---|---|---|
| `async` | As soon as downloaded | Unpredictable | Independent scripts |
| `defer` | After HTML parsing | Preserved | Scripts that depend on DOM |
| None | Immediately (blocking) | Sequential | Critical scripts |

## Basic Usage

```html
<!-- Async script execution -->
<script async src="analytics.js"></script>

<!-- Multiple async scripts - execution order not guaranteed -->
<script async src="script1.js"></script>
<script async src="script2.js"></script>
```

## Browser Support

### Desktop Browsers

| Browser | First Supported | Current Support |
|---------|---|---|
| **Chrome** | 8+ | Full Support (v4-146+) |
| **Firefox** | 3.6+ | Full Support (v3.6+) |
| **Safari** | 5.1+ | Full Support (v5.1+) |
| **Edge** | 12+ | Full Support (v12+) |
| **Opera** | 15+ | Full Support (v15+) |
| **Internet Explorer** | 10+ | Supported (IE10 & IE11 only) |

### Mobile Browsers

| Browser | First Supported | Current Support |
|---------|---|---|
| **iOS Safari** | 5.0-5.1+ | Full Support (v5.0+) |
| **Android Browser** | 3+ | Full Support (v3+) |
| **Samsung Internet** | 4+ | Full Support (v4+) |
| **Opera Mobile** | 80+ | Supported |
| **UC Browser** | 15.5+ | Supported |

### Older Browsers with Limited/No Support

- **Internet Explorer 9 and earlier** - Not supported
- **Opera Mini** - Not supported (all versions)
- **Chrome 7 and earlier** - Not supported
- **Safari 5.0** - Partial/incomplete support
- **Firefox 3.5 and earlier** - Not supported

## Global Support Statistics

- **Full Support:** 93.6% of users worldwide
- **Partial Support:** 0%
- **No Support:** Approximately 6.4% of users

These statistics reflect the widespread adoption of this feature across modern browsers.

## Important Notes

### Safari 5.0 Compatibility Issue

Safari 5.0 has a known limitation with dynamically-added async scripts. Specifically:

> Using `script.async = false;` to maintain execution order for dynamically-added scripts isn't supported in Safari 5.0

If you need to maintain execution order for scripts added dynamically in Safari 5.0, you may need to use the `defer` attribute or load scripts sequentially instead of asynchronously.

### Execution Order Considerations

- **Multiple async scripts do NOT execute in order** - They execute as soon as they are downloaded
- If your scripts have dependencies on each other, use `defer` instead or ensure async scripts are independent
- This unpredictable execution order is the primary tradeoff for improved page load performance

### Dynamic Script Injection

When dynamically creating and injecting script elements via JavaScript:

```javascript
// Dynamically created script with async
const script = document.createElement('script');
script.async = true;  // Enable async execution
script.src = 'path/to/script.js';
document.body.appendChild(script);
```

## Practical Examples

### Analytics and Tracking

```html
<!-- Google Analytics - async is safe here -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Third-party Widgets

```html
<!-- Facebook SDK - uses async for non-blocking load -->
<script async src="https://connect.facebook.net/en_US/sdk.js"></script>
```

### When NOT to use async

```html
<!-- jQuery and dependent library - use defer or order matters -->
<script src="jquery.min.js"></script>
<script src="jquery-plugin.js"></script>

<!-- Alternative: Use module scripts or proper sequencing -->
<script type="module">
  import jQuery from 'jquery';
  import plugin from 'jquery-plugin';
</script>
```

## Related Features

- **defer Attribute** - Similar to async but maintains execution order
- **Preload/Prefetch** - Link relations for resource optimization
- **Module Scripts** - Modern approach using `<script type="module">`
- **Web Workers** - For running JavaScript in background threads

## References & Further Reading

### Official Documentation
- [MDN Web Docs - Script Element Attributes](https://developer.mozilla.org/en/HTML/Element/script#Attributes)
- [WHATWG HTML Standard - Script Element](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async)

### Comparison & Tutorials
- [async vs defer Attributes - Detailed Explanation](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
- [Interactive Demo](https://testdrive-archive.azurewebsites.net/Performance/AsyncScripts/Default.html)

### Feature Detection
- [has.js - Feature detection library](https://raw.github.com/phiggins42/has.js/master/detect/script.js#script-async)

## Browser Compatibility Chart

```
Chrome:     ✓ 8+
Firefox:    ✓ 3.6+
Safari:     ✓ 5.1+ (partial in 5.0)
Edge:       ✓ 12+
Opera:      ✓ 15+
IE:         ✓ 10-11 (not in 9 or earlier)
iOS Safari: ✓ 5.0+
Android:    ✓ 3+
```

## Conclusion

The `async` attribute is a well-established feature with near-universal browser support (93.6% globally). It's essential for performance optimization in modern web development, particularly for loading non-critical resources like analytics, advertisements, and third-party services. However, developers must be aware that async scripts execute in unpredictable order, so they should only be used for scripts that are truly independent.
