# ECMAScript 5 Strict Mode

## Overview

Strict mode is a method of placing code in a "strict" operating context, which enforces stricter parsing and error handling on your code. This ECMAScript 5 feature enables developers to write more secure and optimized JavaScript by preventing certain actions from being taken and throwing more exceptions.

## Specification

- **Standard**: ECMAScript 5 (ES5)
- **Specification URL**: [ECMA-262 5.1 Section 14.1](https://www.ecma-international.org/ecma-262/5.1/#sec-14.1)
- **Status**: Finalized (Other - refers to legacy ES5 feature)

## Categories

- **JavaScript (JS)**

## Description

Strict mode can be applied to entire scripts or individual functions. When strict mode is enabled, the JavaScript engine enforces more rigorous rules and restrictions:

- Variables must be declared before use
- Prevents unsafe actions
- Improves performance through better optimization opportunities
- Throws errors for common coding mistakes
- Disables certain features considered problematic or insecure

### Enabling Strict Mode

Strict mode is enabled by adding the directive `"use strict";` at the beginning of a script or function:

```javascript
// Global strict mode
"use strict";

function strictFunction() {
  // All code in this function runs in strict mode
}

// Function-level strict mode
function anotherFunction() {
  "use strict";
  // Only this function runs in strict mode
}
```

## Benefits and Use Cases

### Security Improvements

- Prevents accidental creation of global variables
- Disables the `eval()` function's ability to create variables in the local scope
- Makes `eval()` safer by preventing it from introducing new variables
- Removes the ability to delete plain variables

### Code Quality

- Catches common coding mistakes and "unsafe" actions
- Makes code more optimizable for JavaScript engines
- Improves debugging experience through clearer error messages
- Enforces better variable scoping practices

### Performance

- Enables JavaScript engines to perform more aggressive optimizations
- Removes certain dynamic features that prevent optimization
- Can lead to faster code execution in modern engines

### Development Best Practices

- Encourages better coding habits
- Helps catch errors earlier in development
- Improves code maintainability
- Recommended as a baseline for modern JavaScript development

## Browser Support

### Current Support Summary

**Global Support**: 93.64% of global usage (as of latest data)

Strict mode has nearly universal support across modern browsers and platforms. The feature became widely supported starting with:

- **Internet Explorer**: 10+
- **Chrome**: 13+
- **Firefox**: 4+
- **Safari**: 6+ (partial support in 5.x)
- **Opera**: 11.6+
- **Mobile Browsers**: Widely supported

### Desktop Browsers

| Browser | Supported Since | Current Status | Notes |
|---------|-----------------|-----------------|-------|
| **Chrome** | 13 | Fully Supported | All versions 13+ |
| **Firefox** | 4 | Fully Supported | All versions 4+ |
| **Safari** | 6 | Fully Supported | Partial in 5-5.1, Full in 6+ |
| **Opera** | 11.6 | Fully Supported | All versions 11.6+ |
| **Edge** | 12 | Fully Supported | All versions |
| **Internet Explorer** | 10 | Fully Supported | IE 10-11 only |

### Mobile Browsers

| Browser | Supported Since | Current Status |
|---------|-----------------|-----------------|
| **iOS Safari** | 5.0 | Fully Supported |
| **Android Browser** | 3.0 | Fully Supported |
| **Chrome Mobile** | All | Fully Supported |
| **Firefox Mobile** | All | Fully Supported |
| **Opera Mobile** | 11.5 | Fully Supported |
| **Samsung Internet** | 4.0 | Fully Supported |

### Other Platforms

| Platform | Status |
|----------|--------|
| **Opera Mini** | Fully Supported |
| **BlackBerry** | 7+ (Supported) |
| **UC Browser** | Supported |
| **KaiOS** | 2.5+ (Supported) |

## Important Notes

### Safari 5.x Partial Support

Older versions of Safari (5.0 and 5.1) have partial support for strict mode. The implementation still accepts some JavaScript that should be considered invalid according to the strict mode specification. Websites targeting Safari 5.x should test thoroughly for compatibility.

### No Browser Prefix Required

Unlike many CSS and JavaScript features, strict mode does not require vendor prefixes or polyfills across all browsers.

## Common Strict Mode Restrictions

When strict mode is enabled, the following restrictions apply:

- **Variables must be declared**: Cannot assign to undeclared variables
- **`eval()` limitations**: `eval()` cannot introduce variables into surrounding scope
- **Function parameter names**: Parameter names must be unique
- **Octal syntax**: Octal numeric literals (e.g., `010`) are not allowed
- **Property deletion**: Cannot delete plain properties with `delete`
- **Argument binding**: `arguments` object does not alias function parameters
- **`this` binding**: `this` value is undefined in functions called without a context
- **`with` statement**: The `with` statement is prohibited
- **Reserved keywords**: Additional keywords are reserved (e.g., `implements`, `let`, `private`)

## Implementation Recommendations

### Global Application

```javascript
"use strict";

// All code in the script runs in strict mode
var x = 5;
delete x; // TypeError in strict mode
```

### Function-Level Application

```javascript
function strictFunction() {
  "use strict";
  // Only this function and its inner functions
  var y = 10;
  delete y; // TypeError in strict mode
}

function normalFunction() {
  var z = 15;
  delete z; // Works normally (not in strict mode)
}
```

### Module Systems

Modern modules (ES6+) run in strict mode by default:

```javascript
// ES6 Module - automatically strict mode
export function myFunction() {
  // This runs in strict mode
}
```

## Related Standards and Features

- **ECMAScript 6+ (ES2015+)**: Modern JavaScript features build upon strict mode principles
- **Arrow Functions**: Always execute in strict mode context
- **Classes**: Always execute in strict mode context
- **Modules**: Always execute in strict mode context

## References and Further Reading

### Official Resources

- [ECMA-262 5.1 Specification - Section 14.1](https://www.ecma-international.org/ecma-262/5.1/#sec-14.1) - Official specification document

### Educational Articles

- [ECMAScript 5 Strict Mode, JSON, and More](https://johnresig.com/blog/ecmascript-5-strict-mode-json-and-more/) - John Resig's information page on strict mode features
- [JavaScript Strict Mode with Test Suite](https://javascriptweblog.wordpress.com/2011/05/03/javascript-strict-mode/) - Comprehensive article with test cases and examples

### Additional Resources

- [MDN Web Docs - Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- [Can I Use - use-strict](https://caniuse.com/use-strict)

## Summary

Strict mode is a fundamental feature of modern JavaScript development with nearly universal browser support. Its adoption is recommended for all new code and projects, as it provides significant benefits in terms of code quality, security, and performance. The feature is so important that newer JavaScript constructs like ES6 modules, classes, and arrow functions all operate in strict mode by default.

---

**Last Updated**: 2025
**Data Source**: CanIUse.com
**Feature ID**: use-strict
