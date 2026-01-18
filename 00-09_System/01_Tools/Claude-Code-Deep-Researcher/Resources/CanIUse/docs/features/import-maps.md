# Import Maps

## Overview

Import maps allow developers to control what URLs get fetched by JavaScript `import` statements and `import()` expressions. This feature provides a mechanism for remapping module specifiers to different URLs, enabling better control over module resolution in the browser.

## Specification Status

**Current Status:** Unofficial / In Development (WICG Proposal)

**Specification URL:** [https://wicg.github.io/import-maps/](https://wicg.github.io/import-maps/)

The feature is being standardized through the Web Incubator Community Group (WICG) and is actively being developed with broad browser support.

## Categories

- **JavaScript (JS)**

## Use Cases & Benefits

Import maps provide several key benefits for modern JavaScript development:

### 1. **Dependency Management**
- Centrally manage module URLs and versions in one configuration
- Update library versions without modifying source code
- Support for URL remapping without build tools

### 2. **Monorepo Support**
- Enable local package resolution within monorepos
- Allow importing from workspaces using simple module names
- Simplify inter-package dependencies

### 3. **Development vs. Production**
- Use different module URLs for development and production environments
- Support development builds for debugging and optimized builds for production
- Enable CDN switching without code changes

### 4. **Legacy Module Migration**
- Gradually migrate from CommonJS to ES modules
- Support named exports from non-module sources
- Bridge old and new module systems

### 5. **Third-Party Library Management**
- Remap third-party package imports
- Support multiple versions of the same package
- Provide fallback URLs for library hosting

### 6. **Scoped Module Imports**
- Create custom import prefixes for organization
- Group related modules under common namespaces
- Improve code organization and maintainability

## Browser Support

| Browser | First Supported Version | Status |
|---------|------------------------|--------|
| **Chrome** | 89 | Fully Supported |
| **Edge** | 89 | Fully Supported |
| **Firefox** | 108 | Fully Supported |
| **Safari** | 16.4 | Fully Supported |
| **Opera** | 76 | Fully Supported |
| **iOS Safari** | 16.4 | Fully Supported |
| **Samsung Internet** | 15.0 | Fully Supported |
| **Android Browser** | 142 | Fully Supported |
| **Opera Mobile** | 80 | Fully Supported |
| **Android Chrome** | 142 | Fully Supported |
| **Android Firefox** | 144 | Fully Supported |
| **UC Browser** | 15.5 | Fully Supported |
| **Baidu Browser** | 13.52 | Fully Supported |
| **Internet Explorer** | Not Supported | ❌ |
| **Opera Mini** | Not Supported | ❌ |

### Browser Support Timeline

- **Early Adoption (with flags):** Chrome 74-88, Edge 79-88, Firefox 102-107, Opera 62-75
- **Full Support (stable):** Starting from Chrome 89 onwards

### Feature Detection Notes

- **Chrome (74-88), Edge (79-88), Opera (62-75):** Requires enabling "Experimental Web Platform features" flag at `about:flags`
- **Firefox (102-107):** Can be enabled via the `dom.importMaps.enabled` preference in `about:config`

## Current Usage Statistics

- **Global Support:** 91.48% of users have browsers with import maps support
- **Partial Support:** 0% (no partial implementation status)

## Implementation Notes

### Basic Usage Example

```html
<script type="importmap">
{
  "imports": {
    "lodash": "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js",
    "@myorg/utils": "/lib/utils.js",
    "@myorg/": "/lib/"
  }
}
</script>

<script type="module">
  import { debounce } from 'lodash'; // Maps to CDN URL
  import { helper } from '@myorg/utils'; // Maps to /lib/utils.js
  import { tool } from '@myorg/tools'; // Maps to /lib/tools
</script>
```

### Key Features

1. **Remapping Imports:** Redirect module specifiers to different URLs
2. **Scoped Imports:** Support both exact matches and prefix matches
3. **URL Resolution:** Resolve relative and absolute paths
4. **Multiple Entries:** Support multiple import map declarations (with merging)

### Important Considerations

- Import maps must be declared in the HTML document before any module scripts that use them
- Only the first import map in a document is used (duplicate entries are ignored)
- Import maps cannot be used with `javascript:` URLs or data URLs
- The feature works with both static imports and dynamic `import()` expressions

## Polyfills & Alternatives

For browsers without native support, the following alternatives are available:

1. **[es-module-shims](https://github.com/guybedford/es-module-shims)** - A JavaScript polyfill for import maps
2. **Build Tools:** Use bundlers like Webpack, Rollup, or Vite with configuration-based module remapping
3. **Module Federation:** Webpack's Module Federation for advanced module sharing

## Related Resources

### Official Documentation
- **[WICG Import Maps Proposal](https://github.com/WICG/import-maps#readme)** - Complete proposal information and discussions
- **[Official Specification](https://wicg.github.io/import-maps/)** - The formal specification document

### Learning Resources
- **[Using ES modules in browsers with import-maps](https://blog.logrocket.com/es-modules-in-browsers-with-import-maps/)** - Comprehensive tutorial on import maps usage

### Browser Issues & Feature Requests
- **[Firefox Feature Request](https://bugzilla.mozilla.org/show_bug.cgi?id=1688879)** - Track Firefox implementation progress
- **[WebKit Feature Request](https://bugs.webkit.org/show_bug.cgi?id=220823)** - Track Safari/WebKit implementation progress

## Compatibility Considerations

### Older Browsers (IE 11 and earlier)
- Not supported; require a build-time bundler solution
- Consider using Webpack or other module bundlers for older browser support
- Use transpilation tools like Babel for broader compatibility

### Gradual Adoption Strategy
1. Start with modern browsers that support import maps
2. Use polyfills (es-module-shims) for broader coverage
3. Implement fallback mechanisms for unsupported environments
4. Consider build-time compilation for older browsers

## See Also

- [ES Modules](./es-modules.md) - Standard JavaScript module syntax
- [Dynamic Import](./dynamic-import.md) - Runtime module loading with `import()`
- [Module Federation](./module-federation.md) - Advanced module sharing patterns

---

**Last Updated:** December 2024

**Data Source:** [Can I Use - Import Maps](https://caniuse.com/import-maps)
