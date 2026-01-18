# document.currentScript

## Overview

`document.currentScript` is a DOM API property that returns the `<script>` element whose script is currently being processed. This property enables developers to reference the currently executing script tag from within the script itself, which is useful for self-referencing and dynamic script behavior.

## Specification

- **Status**: Living Standard (LS)
- **Spec URL**: [WHATWG HTML Standard - document.currentScript](https://html.spec.whatwg.org/multipage/dom.html#dom-document-currentscript)
- **Category**: JavaScript API

## Description

When JavaScript code runs within a script element, `document.currentScript` provides a reference to that specific `<script>` tag. This is particularly useful for:

- Accessing script attributes (e.g., data attributes)
- Determining the script's source location
- Implementing library initialization based on script parameters
- Creating self-contained scripts that modify their own behavior

The property returns `null` when accessed outside of a script execution context or when the executing code is in an event handler, timeout, or other asynchronous callback.

## Use Cases & Benefits

### Primary Use Cases

1. **Self-Referencing Libraries**: Libraries can access their own `<script>` tag to read configuration from data attributes
   ```javascript
   const script = document.currentScript;
   const config = {
     apiKey: script.dataset.apiKey,
     endpoint: script.dataset.endpoint
   };
   ```

2. **Script Parameter Reading**: Extract initialization parameters without requiring a separate configuration object
   ```javascript
   const scriptElement = document.currentScript;
   const options = JSON.parse(scriptElement.dataset.options || '{}');
   ```

3. **Module Identification**: Determine which specific script instance is running when multiple copies of the same library are loaded
   ```javascript
   const scriptId = document.currentScript.id;
   ```

4. **Dynamic Script Behavior**: Implement conditional logic based on script attributes or source URL

### Benefits

- **Cleaner API Design**: Libraries can be configured via HTML attributes without additional script setup
- **Single Entry Point**: No need for separate initialization functions
- **Instance Tracking**: Multiple instances of the same script can be tracked independently
- **Improved Encapsulation**: Self-contained scripts that don't pollute the global namespace
- **Better Developer Experience**: More intuitive configuration for non-technical users

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | ✅ v29+ | Full support from version 29 onward |
| **Firefox** | ✅ v4+ | Early support, available since version 4 |
| **Safari** | ✅ v8+ | Supported from version 8 onward |
| **Edge** | ✅ v12+ | Full support from the first version |
| **Opera** | ✅ v16+ | Supported from version 16 onward |
| **IE** | ❌ Not supported | No support in any IE version (5.5-11) |
| **iOS Safari** | ✅ v8+ | Supported from version 8 onward |
| **Android Browser** | ✅ v4.4+ | Support starts with Android 4.4 |
| **Opera Mini** | ❌ Not supported | Not supported in any version |
| **IE Mobile** | ❌ Not supported | No support in IE Mobile 10-11 |

### Mobile Browser Support

| Platform | Version | Status |
|----------|---------|--------|
| **iOS Safari** | 8.0+ | Fully supported |
| **Android Browser** | 4.4+ | Fully supported |
| **Opera Mini** | all | Not supported |
| **Chrome for Android** | Latest | Fully supported |
| **Firefox for Android** | Latest | Fully supported |
| **Samsung Internet** | 4.0+ | Fully supported |
| **Opera Mobile** | 80+ | Fully supported |

### Global Coverage

- **Global Usage**: 93.26% of users' browsers support `document.currentScript`
- **Older Browser Gap**: Internet Explorer and Opera versions < 16 do not support this feature

## Implementation Notes

### Return Value

- Returns a `<script>` element when accessed during script execution
- Returns `null` in the following scenarios:
  - Accessed from within event handlers
  - Accessed from within promises or async callbacks
  - Accessed from within timers (setTimeout, setInterval)
  - Accessed after the script has finished executing
  - Accessed from outside a script element context

### Browser Compatibility Considerations

```javascript
// Safe pattern with fallback
const script = document.currentScript;
if (!script) {
  // Handle browsers without support or async context
  console.warn('document.currentScript is not available');
}
```

### Important Behavioral Notes

1. **Synchronous Only**: Works only during synchronous script execution
2. **No Async Support**: Not available in async/deferred scripts when accessed after execution completes
3. **Deferred Scripts**: Works in deferred scripts during their execution phase
4. **Module Scripts**: In ES6 modules, `document.currentScript` may behave differently; use `import.meta.url` instead

## Polyfill & Fallback Solutions

For Internet Explorer 6-10 support, a polyfill is available:

- **Project**: [JamesMGreene/document.currentScript](https://github.com/JamesMGreene/document.currentScript)
- **Scope**: Provides polyfill support for IE 6-10 only
- **Limitation**: Full polyfill support is challenging due to IE's script execution model

### Recommended Fallback Strategy

For applications requiring IE support:

```javascript
const currentScript = document.currentScript || (function() {
  const scripts = document.getElementsByTagName('script');
  return scripts[scripts.length - 1];
})();
```

## Example Code

### Basic Usage

```javascript
// In a script file
const script = document.currentScript;
console.log('Current script source:', script.src);
console.log('Script ID:', script.id);
```

### Configuration via Data Attributes

```html
<script
  id="my-lib"
  src="library.js"
  data-api-key="abc123"
  data-mode="production">
</script>
```

```javascript
// Inside library.js
const script = document.currentScript;
const apiKey = script.dataset.apiKey;   // "abc123"
const mode = script.dataset.mode;        // "production"

if (mode === 'production') {
  // Initialize in production mode
} else {
  // Initialize in development mode
}
```

### Multiple Script Instances

```html
<script src="tracker.js" data-site-id="site1"></script>
<script src="tracker.js" data-site-id="site2"></script>
```

```javascript
// Inside tracker.js
const script = document.currentScript;
const siteId = script.dataset.siteId;
initializeTracker(siteId);
```

## Alternatives & Related APIs

### Alternatives

1. **`import.meta.url`** (ES6 Modules): Use in modern module scripts
   ```javascript
   console.log(import.meta.url); // Points to the module URL
   ```

2. **Manual Configuration**: Pass configuration via function calls instead
   ```javascript
   initializeLibrary({ apiKey: 'abc123' });
   ```

3. **Global Variables**: Store configuration in global namespace (less recommended)
   ```javascript
   window.libraryConfig = { apiKey: 'abc123' };
   ```

### Related Properties

- `script.src` - The URL of the script
- `script.dataset` - Custom data attributes
- `script.async` - Whether the script loads asynchronously
- `script.defer` - Whether the script defers execution
- `document.scripts` - Collection of all script elements

## Related Resources

- [WHATWG HTML Specification - document.currentScript](https://html.spec.whatwg.org/multipage/dom.html#dom-document-currentscript)
- [MDN Web Docs - document.currentScript](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript)
- [GitHub Polyfill - document.currentScript](https://github.com/JamesMGreene/document.currentScript)
- [Can I Use - document.currentScript](https://caniuse.com/document-currentscript)

## Summary

`document.currentScript` is a well-supported DOM API available in all modern browsers (93.26% global coverage) since around 2011-2013, with the notable exception of Internet Explorer. It provides a clean, elegant solution for scripts to reference themselves and access configuration data via HTML attributes. This feature is particularly valuable for creating self-contained, reusable libraries that can be configured inline without additional setup code.
