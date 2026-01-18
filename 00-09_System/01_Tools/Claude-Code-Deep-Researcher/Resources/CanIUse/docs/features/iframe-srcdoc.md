# iframe srcdoc Attribute

## Overview

The `srcdoc` attribute for iframes allows you to override the content specified in the `src` attribute (if present) with HTML content directly within the attribute itself. This provides a convenient way to specify inline HTML content for an iframe without requiring a separate document source.

## Specification Status

- **Status:** Living Standard (ls)
- **Specification:** [HTML Living Standard - iframe srcdoc attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-iframe-srcdoc)

## Categories

- HTML5

## Use Cases & Benefits

### Primary Benefits

1. **Inline HTML Content** - Embed HTML content directly in the iframe without needing an external document
2. **Reduced HTTP Requests** - Eliminate additional network requests for iframe content
3. **Dynamic Content** - Generate iframe content dynamically without server-side processing
4. **Sandboxing** - Create sandboxed content environments within the page
5. **Security** - Control iframe content source to prevent external attacks
6. **Third-party Integration** - Embed third-party JavaScript safely with content isolation

### Common Use Cases

- **Code Editors & Playgrounds** - Display live code preview with syntax highlighting
- **Documentation Viewers** - Show embedded documentation without external page loads
- **Form Isolation** - Display isolated form environments to prevent styling conflicts
- **Preview Panes** - Create document previews or WYSIWYG editor previews
- **Widget Embedding** - Embed widgets with restricted sandboxing capabilities
- **Content Sandboxing** - Isolate untrusted HTML/CSS content from the main page

## Browser Support

### Support Key

- **y** = Full Support
- **p** = Partial Support
- **n** = No Support

### Desktop Browsers

| Browser | Versions with Full Support | First Support | Notes |
|---------|---------------------------|---------------|-------|
| **Chrome** | 20+ | v20 (2012) | Partial support from v14-19 |
| **Edge** | 79+ | v79 (2020) | Partial support from v12-18; older versions based on IE |
| **Firefox** | 25+ | v25 (2013) | Partial support from v3-24 |
| **Safari** | 6+ | v6 (2012) | Partial support from v4-5.1 |
| **Opera** | 15+ | v15 (2013) | Partial support from v11.1-12.1 |
| **Internet Explorer** | None | Not supported | No support in any version |

### Mobile Browsers

| Browser | Versions with Full Support | First Support | Notes |
|---------|---------------------------|---------------|-------|
| **iOS Safari** | 6.0+ | iOS 6.0 (2012) | Partial support from iOS 4.0-5.1 |
| **Android Browser** | 4.4+ | Android 4.4 (2013) | Partial support from Android 2.1-4.3 |
| **Samsung Internet** | 4+ | Samsung 4 (2014) | Full support from initial version |
| **Opera Mobile** | 80+ | Opera Mobile 80 (2022) | Partial support from v11.1-12.1 |
| **Chrome Android** | 142+ | Chrome Android 142 (2025) | Full support in current versions |
| **Firefox Android** | 144+ | Firefox Android 144 (2025) | Full support in current versions |
| **Android UC Browser** | 15.5+ | Android UC 15.5 | Full support in recent versions |
| **Opera Mini** | Not supported | N/A | No support in any version |
| **Internet Explorer Mobile** | Not supported | N/A | Partial support (v10-11) |
| **BlackBerry** | 10+ | BB 10 (2013) | Partial support from v7 |
| **KaiOS** | 2.5+ | KaiOS 2.5 (2019) | Full support |
| **Baidu Browser** | 13.52+ | v13.52 | Full support in recent versions |
| **QQ Browser** | 14.9+ | v14.9 | Full support in recent versions |

## HTML Syntax

### Basic Example

```html
<iframe srcdoc="<h1>Hello World</h1>"></iframe>
```

### With CSS Styling

```html
<iframe srcdoc="<h1>Styled Content</h1><style>h1 { color: blue; }</style>"></iframe>
```

### With JavaScript

```html
<iframe srcdoc="<h1>Interactive Content</h1><script>alert('Hello from iframe')</script>"></iframe>
```

### Practical Example: Code Playground

```html
<iframe
  srcdoc="
    <style>
      body { font-family: monospace; }
      .output { background: #f0f0f0; padding: 10px; margin-top: 10px; }
    </style>
    <h2>Output:</h2>
    <div class='output'>
      2 + 2 = <script>document.write(2 + 2)</script>
    </div>
  "
  style="width: 100%; height: 150px; border: 1px solid #ccc;"
></iframe>
```

## Implementation Notes

### Important Considerations

1. **Encoding** - Content within `srcdoc` should be properly HTML-encoded
2. **Escaping Quotes** - Use HTML entities or alternate quote styles for attribute content
3. **Sandbox Restrictions** - The `srcdoc` attribute respects the `sandbox` attribute restrictions
4. **Fallback** - Browsers that don't support `srcdoc` will fall back to `src` attribute if present
5. **Partial Support** - Older versions may have limited or buggy implementations

### Polyfill

For browsers that don't support `srcdoc`, consider using the [Srcdoc Polyfill](https://github.com/jugglinmike/srcdoc-polyfill) available on GitHub.

### Best Practices

- **Use with `sandbox` attribute** for security-sensitive content
- **Escape special characters** properly to avoid injection vulnerabilities
- **Combine with `src`** for better fallback support in older browsers
- **Validate user content** if dynamically generating `srcdoc` content
- **Test across target browsers** as partial support may have limitations

## Browser Compatibility Summary

| Support Level | Coverage | Global Usage |
|---------------|----------|--------------|
| Full Support (y) | ~93% | 93.21% |
| Partial Support (p) | ~5% | 0% |
| No Support (n) | ~2% | 0% |

**Note:** Global usage percentage (93.21%) represents users with browsers that have full support for the feature.

## Related Documentation

### Official Resources

- [MDN Web Docs - iframe Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
- [HTML Living Standard Specification](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-iframe-srcdoc)

### Community Resources

- [Srcdoc Polyfill on GitHub](https://github.com/jugglinmike/srcdoc-polyfill) - Polyfill for older browsers
- [Third-party JavaScript Development Future](https://bocoup.com/weblog/third-party-javascript-development-future/) - Article discussing srcdoc use cases

## Additional Resources

### Related iframe Attributes

- **`src`** - Specifies the URL of the document to embed
- **`sandbox`** - Enables an extra set of restrictions for the content in the iframe
- **`allow`** - Specifies feature policies for the iframe
- **`allowfullscreen`** - Allows the iframe to be displayed in fullscreen mode
- **`loading`** - Specifies how the browser should load the iframe

### Similar Features

- **Data URLs** - Alternative method to embed content inline
- **Blob URLs** - Create object URLs for dynamic content
- **HTML Templates** - Use `<template>` element for template content

## Key Takeaways

1. `srcdoc` is now widely supported across modern browsers (93%+ coverage)
2. It provides a clean way to embed inline HTML content in iframes
3. Full support in all major desktop browsers since 2012-2020
4. Mobile support is strong in modern devices (4.4+ on Android, iOS 6.0+)
5. Older browsers require polyfills for functionality
6. Should be combined with `sandbox` attribute for security
7. Perfect for code editors, previews, and isolated content embedding
