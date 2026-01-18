# JavaScript ES6 Modules

## Overview

ES6 Modules (ECMAScript 2015 Modules) provide a standardized way to load and organize JavaScript code. This feature enables loading JavaScript module scripts using the `<script type="module">` tag in HTML, along with support for the `nomodule` attribute for fallback compatibility.

## Description

Loading JavaScript module scripts (aka ES6 modules) using `<script type="module">` tag. Includes support for the `nomodule` attribute for specifying fallback scripts that run in browsers that don't support ES6 modules.

**Key Components:**
- `<script type="module">` tag support
- `nomodule` attribute for fallback scripts
- Native module loading and execution

## Specification Status

**Status:** Living Standard (ls)

**Specification:** [HTML Living Standard - Script Type Module](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-type)

**Related Specifications:**
- [ECMAScript 2015 Module Specification](https://tc39.es/ecma262/#sec-modules)
- [HTML Living Standard - nomodule Attribute](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule)

## Categories

- JavaScript (JS)

## Benefits & Use Cases

### Code Organization
- Split large codebases into manageable, logical modules
- Clear dependency graph through explicit imports/exports
- Improved code maintainability and scalability

### Encapsulation
- Automatic strict mode in module scope
- Module-scoped variables and functions (not global)
- Explicit control over what is exposed via exports

### Dependency Management
- Static analysis of dependencies at parse time
- Tree-shaking enabled through static import analysis
- Better tools support for refactoring and optimization

### Progressive Enhancement
- Use `nomodule` attribute for graceful degradation
- Modern browsers run efficient native modules
- Legacy browsers fall back to bundled/transpiled code

### Modern Development
- Native standard module system (no build tools required for simple use)
- Aligns with CommonJS, AMD, and other module systems
- Foundation for modern JavaScript frameworks

## Browser Support

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 61+ | Yes | Partial in v60 (behind flag) |
| **Firefox** | 60+ | Yes | Partial in v54-59 (behind flag) |
| **Safari** | 11+ | Yes | Partial in v10.1 (no `nomodule`) |
| **Edge** | 16+ | Yes | Partial in v15 (behind flag), full from v16 |
| **Opera** | 48+ | Yes | Partial in v47 (behind flag) |
| **iOS Safari** | 11.0+ | Yes | Partial in v10.3 (no `nomodule`) |
| **Android Browser** | 142+ | Yes | |
| **Opera Mobile** | 80+ | Yes | |
| **Samsung Internet** | 8.2+ | Yes | |
| **Internet Explorer** | All | No | Not supported |
| **Opera Mini** | All | No | Not supported |

### Global Support

- **Full Support:** 92.94%
- **Partial Support:** 0.02%
- **No Support:** ~7.04%

### Platform-Specific Notes

**Desktop Browsers:**
- All modern desktop browsers (Chrome, Firefox, Safari, Edge, Opera) have full support
- Internet Explorer has no support and never will (EOL product)

**Mobile Browsers:**
- iOS Safari: Full support from v11.0 (partial in v10.3)
- Android: Full support from Chrome and Firefox on Android
- Samsung Internet: Full support from v8.2
- Opera Mobile: Full support from v80

## Known Issues

### Edge Browser Bugs

1. **`nomodule` Attribute Not Executed (Edge 12-18)**
   - Issue: Scripts with `nomodule` attribute are fetched but not executed
   - Workaround: Use feature detection or UA sniffing for Edge versions prior to v19

2. **Double Fetching (Edge 17+)**
   - Issue: HTML-declared `<script type="module">` files are fetched twice
   - Impact: Potential performance degradation and network overhead
   - Status: Affecting Edge 17 and later versions

### Safari Limitations

1. **No `nomodule` Support (Safari 10.1 and iOS Safari 10.3)**
   - Issue: `nomodule` attribute is not recognized
   - Workaround: [Polyfill available](https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc)
   - Status: Fixed in Safari 11+

### General Considerations

- Feature detection should be used to determine `nomodule` support in Safari 10.1/iOS 10.3
- When targeting older Safari versions, consider using transpilers or polyfills

## Implementation Notes

### Basic Usage

```html
<!-- Modern browser with module support -->
<script type="module">
  import { greeting } from './module.js';
  console.log(greeting());
</script>

<!-- Fallback for older browsers -->
<script nomodule src="bundled.js"></script>
```

### Key Features

- **Automatic Strict Mode:** All module code runs in strict mode
- **Module Scope:** Top-level variables are not global
- **Single Execution:** Modules are executed only once, even if imported multiple times
- **CORS Requirement:** Module scripts are fetched with CORS (unlike classic scripts)
- **Async Loading:** Module scripts load asynchronously by default

### Progressive Enhancement Pattern

Use `type="module"` for modern code and `nomodule` for fallback:

```html
<!-- Modern browsers will load and execute this -->
<script type="module" src="modern.js"></script>

<!-- Older browsers will load this -->
<script nomodule src="legacy.js"></script>
```

## Related Resources

### Official Documentation

- [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Web.dev: ES modules in browsers](https://web.dev/es-modules/)

### Articles & Guides

- [Intro to ES6 modules (StrongLoop)](https://strongloop.com/strongblog/an-introduction-to-javascript-es6-modules/)
- [ES6 Modules and Beyond (MS Edge Blog)](https://blogs.windows.com/msedgedev/2016/05/17/es6-modules-and-beyond/)
- [ES6 In Depth: Modules (Mozilla Hacks)](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)
- [Native ECMAScript Modules: The First Overview](https://blog.hospodarets.com/native-ecmascript-modules-the-first-overview)
- [Using nomodule Attribute](https://hospodarets.com/native-ecmascript-modules-nomodule)

### Technical References

- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=568953)
- [Browser Behavior with module/nomodule Scripts](https://gist.github.com/jakub-g/5fc11af85a061ca29cc84892f1059fec)
- [nomodule Polyfill for Safari 10.1](https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc)

## Migration Guide

### From Global Scripts

```javascript
// Before (global script)
var myModule = {
  greeting: function() { return 'Hello'; }
};

// After (ES6 module)
export function greeting() {
  return 'Hello';
}
```

### From CommonJS

```javascript
// Before (CommonJS)
const utils = require('./utils.js');
module.exports = { greeting: utils.greeting };

// After (ES6 module)
import { greeting } from './utils.js';
export { greeting };
```

## Best Practices

1. **Always Provide Fallback:** Use `nomodule` for older browser support
2. **Use Absolute Paths:** Module imports require explicit paths (relative or absolute)
3. **CORS Consideration:** Module scripts follow CORS rules
4. **Tree-Shaking:** Leverage static imports for bundler optimization
5. **Feature Detection:** Check for module support before attempting advanced features
6. **Async/Defer:** Module scripts are async by default, use `defer` or structure code appropriately

## See Also

- [JavaScript Modules Cheatsheet](https://www.totaltypescript.com/modules-typescript-can-be-confusing)
- [Can I Use: ES6 Modules](https://caniuse.com/es6-module)
- [MDN: Script Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

---

*Last updated: 2025-12-13*
*Feature data sourced from: Can I Use - ES6 Module Support*
