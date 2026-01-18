# JavaScript Modules: Dynamic Import()

## Overview

**Dynamic import()** is a JavaScript feature that enables loading modules asynchronously at runtime using the `import()` syntax. Unlike static `import` statements, dynamic imports allow you to load modules conditionally based on application logic, improving code splitting and lazy loading capabilities.

## Feature Description

The `import()` function provides a way to dynamically load JavaScript modules as needed. This differs from traditional static imports that must be declared at the top of a file. Dynamic imports return a Promise that resolves to the module namespace object, allowing you to load modules on-demand and handle loading asynchronously.

### Key Characteristics

- **Asynchronous Loading**: Returns a Promise for non-blocking module loading
- **Runtime Flexibility**: Load modules conditionally based on user actions or application state
- **Code Splitting**: Enable automatic code splitting in bundlers
- **Error Handling**: Proper error handling through Promise rejection
- **Module Namespace**: Access exported values through the resolved module object

## Specification Status

- **Status**: Other (Recommended for implementation)
- **ECMAScript Specification**: [TC39 Import Calls](https://tc39.es/ecma262/#sec-import-calls)
- **Standards**: Defined in ECMAScript and integrated with HTML module system

## Categories

- **JavaScript (JS)**

## Benefits and Use Cases

### Code Splitting and Performance
- Split large applications into smaller chunks loaded on-demand
- Reduce initial page load time by deferring non-critical module loading
- Improve perceived performance through progressive loading

### Conditional Module Loading
- Load modules based on user capabilities or device features
- Implement feature flags and A/B testing
- Load polyfills only when required by the browser

### Dynamic Configuration
- Load locale-specific modules based on user language
- Load theme variants dynamically
- Configure application behavior at runtime

### Plugin Systems
- Implement extensible plugin architectures
- Enable third-party modules to be loaded dynamically
- Support modular applications with optional features

### Lazy Loading
- Delay loading of heavy libraries until needed
- Load route-specific modules in single-page applications
- Optimize memory usage by loading resources on-demand

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 63+ | Full Support | Widely supported across current versions |
| **Firefox** | 67+ | Full Support | Flag required for v66 (javascript.options.dynamicImport) |
| **Safari** | 11.1+ | Full Support | Supported with known base element bug in inline scripts |
| **Edge** | 79+ | Full Support | Supported since Chromium migration |
| **Opera** | 50+ | Full Support | Supported across modern versions |
| **Internet Explorer** | Not Supported | ❌ | No support in any IE version |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **iOS Safari** | 11.0+ | Full Support |
| **Android Chrome** | 63+ | Full Support |
| **Android Firefox** | 67+ | Full Support |
| **Samsung Internet** | 8.2+ | Full Support |
| **Opera Mobile** | 50+ | Full Support |
| **Opera Mini** | Never | ❌ Not Supported |
| **Android UC Browser** | 15.5+ | Full Support |
| **Android QQ Browser** | 14.9+ | Full Support |
| **Baidu Browser** | 13.52+ | Full Support |
| **KaiOS** | 3.0+ | Full Support (3.0-3.1) |

### Global Browser Support Statistics

- **Supported**: 92.94% of global web traffic
- **Partial Support**: 0%
- **No Support**: 7.06% (primarily older browsers)

## Implementation Notes

### Browser-Specific Considerations

#### Firefox v66
Support in Firefox 66 requires enabling the `javascript.options.dynamicImport` flag in about:config. The feature is enabled by default from Firefox 67 onwards.

**Reference**: [Firefox Bug #1517546](https://bugzil.la/1517546)

#### Safari Base Element Bug
Safari has a known issue where it does not properly honor the `<base>` element when the module specifier (moduleName) is relative and starts with `./` in inline scripts.

**Bug Report**: [WebKit Bug #201692](https://bugs.webkit.org/show_bug.cgi?id=201692)

**Workaround**: Avoid relative module paths starting with `./` in inline script contexts, or use absolute paths when possible.

## Code Examples

### Basic Usage

```javascript
// Load a module dynamically
import('./module.js')
  .then((module) => {
    // Use the module
    module.someFunction();
  })
  .catch((error) => {
    console.error('Failed to load module:', error);
  });
```

### With Async/Await

```javascript
async function loadModule() {
  try {
    const module = await import('./module.js');
    module.someFunction();
  } catch (error) {
    console.error('Failed to load module:', error);
  }
}
```

### Conditional Loading

```javascript
async function loadTheme(isDarkMode) {
  const themePath = isDarkMode ? './themes/dark.js' : './themes/light.js';
  const theme = await import(themePath);
  return theme;
}
```

### Lazy Loading in Single Page Applications

```javascript
const router = {
  async navigateTo(page) {
    const module = await import(`./pages/${page}.js`);
    module.render();
  }
};
```

### Feature Detection and Polyfills

```javascript
async function loadPolyfills() {
  if (!window.Promise) {
    await import('./polyfills/promise.js');
  }
  if (!window.fetch) {
    await import('./polyfills/fetch.js');
  }
}
```

## Related Standards and Specifications

### ECMAScript Integration
- [ECMAScript 2020 (ES11) - Import Calls Specification](https://tc39.es/ecma262/#sec-import-calls)

### HTML Integration
- [WHATWG HTML Specification - Integration with JavaScript Module System](https://html.spec.whatwg.org/multipage/webappapis.html#integration-with-the-javascript-module-system)

### Related Features
- **Parent Feature**: [ES6 Module Support](https://caniuse.com/es6-module)
- **Static Import**: ES6 `import` statement
- **Module Namespace**: ECMAScript module namespace objects

## Helpful Resources

### Official Documentation
- [TC39 ECMAScript Specification](https://tc39.es/ecma262/#sec-import-calls) - Complete technical specification
- [MDN Web Docs - Dynamic Import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) - Comprehensive developer guide

### Educational Articles
- [Native ECMAScript Modules - Dynamic Import](https://hospodarets.com/native-ecmascript-modules-dynamic-import) - In-depth blog post covering dynamic import features
- [Google Web Updates - Dynamic import()](https://developers.google.com/web/updates/2017/11/dynamic-import) - Best practices and real-world examples

### Browser Implementation References
- [Firefox Implementation Bug #1342012](https://bugzilla.mozilla.org/show_bug.cgi?id=1342012) - Firefox development discussion

### Standards Integration
- [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/webappapis.html#integration-with-the-javascript-module-system) - HTML/JavaScript integration details

## Compatibility Summary

Dynamic import() has become widely supported across modern browsers since 2018, with excellent coverage across desktop and mobile platforms. The feature is suitable for production use with consideration for:

- **No IE Support**: Provide fallbacks or separate bundles for Internet Explorer
- **Older Mobile**: Test on older Android and iOS versions if legacy support is required
- **Firefox v66**: Use feature detection or require explicit opt-in for Firefox 66 users
- **Safari Base Element**: Avoid problematic relative path patterns in inline scripts

## Keywords

JavaScript, ES6, ES2020, modules, import, export, dynamic loading, code splitting, asynchronous, lazy loading

---

*Generated from CanIUse feature data. Last updated: 2025*
