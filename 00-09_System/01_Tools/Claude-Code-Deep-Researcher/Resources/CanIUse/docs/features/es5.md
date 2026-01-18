# ECMAScript 5

## Overview

**ECMAScript 5** (ES5) is the fifth edition of the ECMAScript standard, standardized as ECMA-262 5.1. It represents a major milestone in JavaScript language evolution, introducing essential features that form the foundation of modern JavaScript development.

## Description

Full support for the ECMAScript 5 specification includes a comprehensive set of JavaScript enhancements:

- **Function Methods**: `Function.prototype.bind` for function binding and context management
- **Array Methods**: `indexOf`, `forEach`, `map`, `filter`, `reduce`, `reduceRight`, `every`, `some`, and `lastIndexOf`
- **Object Methods**: `Object.defineProperty`, `Object.create`, `Object.keys`, `Object.freeze`, `Object.seal`, `Object.preventExtensions`, and property descriptor support
- **String Methods**: `trim()` method for whitespace removal
- **JSON Support**: `JSON.parse` and `JSON.stringify`
- **Property Descriptors**: Fine-grained control over object properties with getters and setters
- **Strict Mode**: Optional strict mode for safer JavaScript execution
- **Date Methods**: `Date.now()` for current timestamp
- **Array Static Methods**: `Array.isArray()` for type checking

## Specification

- **Official Specification**: [ECMA-262 5.1](https://www.ecma-international.org/ecma-262/5.1/)
- **Status**: Final Release (December 2011)
- **Category**: JavaScript (JS)

## Use Cases & Benefits

### Array Processing
ES5 introduced functional programming capabilities with array methods like `map`, `filter`, and `reduce`, enabling cleaner, more expressive code for data transformation:

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const filtered = numbers.filter(n => n > 2);
```

### Object Manipulation
`Object.keys`, `Object.create`, and property descriptors enable robust object-oriented programming patterns:

```javascript
const obj = { a: 1, b: 2, c: 3 };
const keys = Object.keys(obj); // ['a', 'b', 'c']
```

### Function Context Management
`Function.prototype.bind` provides reliable context binding without performance overhead:

```javascript
const boundFunc = myFunction.bind(context, arg1, arg2);
```

### JSON Data Exchange
Native `JSON.parse` and `JSON.stringify` support eliminates the need for external libraries:

```javascript
const jsonString = JSON.stringify(data);
const parsedData = JSON.parse(jsonString);
```

### Strict Mode
Enables safer, optimized JavaScript execution:

```javascript
'use strict';
// Stricter parsing and error handling
```

## Browser Support

### Support Key
- **y** = Full support
- **a** = Partial support
- **n** = No support
- **#** = Notes available (see Notes section)

### Desktop Browsers

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Internet Explorer** | 10 | Full support from IE 10+ |
| **Edge** | 12 | Full support (all versions) |
| **Chrome** | 23 | Full support from v23+ |
| **Firefox** | 21 | Full support from v21+ |
| **Safari** | 6 | Full support from v6+ |
| **Opera** | 15 | Full support from v15+ |

#### Detailed Desktop Support

**Internet Explorer**
- IE 5.5 - 8: Not supported or partial support only
- IE 8: Partial support (#4) - see notes
- IE 9: Partial support (#2) - Strict mode not supported
- IE 10+: Full support

**Firefox**
- 2.0 - 20: Partial support (#1) - `parseInt()` edge cases
- 21+: Full support

**Chrome**
- 4 - 22: Partial support (#1)
- 23+: Full support

**Safari**
- 3.1 - 5.1: Partial support
- 6.0+: Full support

**Opera**
- 9 - 12.1: Partial support (#1)
- 15+: Full support

### Mobile & Tablet Browsers

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **iOS Safari** | 6.0-6.1 | Full support from iOS 6+ |
| **Android Browser** | 4.4 | Full support from Android 4.4+ |
| **Chrome Android** | Latest | Full support |
| **Firefox Android** | Latest | Full support |
| **Opera Mobile** | 80 | Full support from v80+ |
| **Samsung Internet** | 4.0 | Full support |
| **UC Browser** | 15.5+ | Full support |
| **Baidu Browser** | 13.52+ | Full support |
| **KaiOS** | 2.5+ | Full support |

#### Older Mobile Platforms

**iOS Safari**
- 3.2 - 5.0-5.1: Partial support
- 6.0-6.1+: Full support

**Android Browser**
- 2.1 - 4.3: Partial support (#1, #2, #3)
- 4.4+: Full support

**Opera Mobile**
- 10 - 12.1: Partial support (#1)
- 80+: Full support

**BlackBerry Browser**
- 7: Partial support
- 10+: Full support

## Browser Coverage

**Global Usage Statistics** (as of latest data):
- **Full Support (y)**: 93.54% of global usage
- **Partial Support (a)**: 0.15% of global usage
- **No Support (n)**: Negligible percentage

ES5 has achieved near-universal browser support, making it safe for use in virtually all modern web applications.

## Implementation Notes

### Partial Support Details

**Note #1: `parseInt()` Edge Cases**
Some browsers with partial support do not properly handle leading zeros in `parseInt()`, where a leading zero should not automatically indicate an octal number.

```javascript
parseInt("08")  // Should be 8, not 0 in some older browsers
parseInt("09")  // Should be 9, not 0 in some older browsers
```

**Note #2: Strict Mode**
Internet Explorer 9 and some older Firefox versions (4-20) do not support strict mode (`'use strict'`), though they support most other ES5 features.

**Note #3: Identifiers & Immutable Undefined**
Chrome 4-22 and earlier versions of other browsers did not support zero-width characters in identifiers and did not implement immutable `undefined`.

**Note #4: Internet Explorer 8 Limited Support**
IE8 has virtually no ES5 support overall, but does support:
- `Object.defineProperty`
- `Object.getOwnPropertyDescriptor`
- JSON parsing
- Property access on strings

### Opera Mini Limitation

Opera Mini has partial support (#1) across all versions due to its proxy-based architecture and server-side code transformation.

### General Implementation Notes

As the ES5 specification encompasses many individual JavaScript features, partial support varies widely across different features and browser versions. For detailed feature-by-feature compatibility information, refer to the comprehensive compatibility tables listed in the Resources section.

## Resources

### Official References
- **ECMA-262 5.1 Specification**: [https://www.ecma-international.org/ecma-262/5.1/](https://www.ecma-international.org/ecma-262/5.1/)

### Compatibility & Testing
- **Detailed Compatibility Tables**: [https://compat-table.github.io/compat-table/es5/](https://compat-table.github.io/compat-table/es5/)
  - Feature-by-feature compatibility information with interactive tests
  - Detailed breakdown of each ES5 feature across all browsers

### Educational Resources
- **ECMAScript 5 Objects & Properties Overview**: [https://johnresig.com/blog/ecmascript-5-objects-and-properties/](https://johnresig.com/blog/ecmascript-5-objects-and-properties/)
  - Comprehensive guide to ES5 object and property features by John Resig

### Polyfills & Compatibility Libraries
- **ES5 Shim**: [https://github.com/es-shims/es5-shim](https://github.com/es-shims/es5-shim)
  - JavaScript polyfill for ES5 features in older browsers
  - Provides fallback implementations for missing features

- **core-js**: [https://github.com/zloirock/core-js#ecmascript](https://github.com/zloirock/core-js#ecmascript)
  - Comprehensive polyfill library supporting all ES5 features
  - Widely used in production applications for broad compatibility

## Legacy Browser Support Strategy

### For Internet Explorer 8 & Earlier

If targeting IE8 or earlier browsers, consider:

1. **Polyfills**: Use es5-shim or core-js to polyfill missing features
2. **Conditional Compilation**: Use IE conditional comments for IE-specific code (deprecated)
3. **Feature Detection**: Use libraries like Modernizr for runtime feature detection
4. **Graceful Degradation**: Ensure basic functionality works without ES5 features

### Example Polyfill Implementation

```html
<!-- Polyfill ES5 features for older browsers -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.15/es5-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.15/es5-sham.min.js"></script>
```

## Migration & Adoption

### From ES3 to ES5

Key improvements when upgrading from ES3:

- **Array Methods**: Replace manual loops with `map`, `filter`, `reduce`
- **Object Manipulation**: Use `Object.keys` instead of `for...in` loops
- **Property Control**: Use `Object.defineProperty` for getters/setters
- **String Handling**: Use `trim()` instead of regex-based trimming
- **JSON**: Native JSON support replaces eval-based parsing

### Modern Development

ES5 is considered the baseline for modern JavaScript development. All contemporary frameworks (React, Vue, Angular) and tools target ES5 compatibility at minimum. For newer features, consider ES6+ (ES2015 and later).

## Related Standards

- **ECMAScript 6 (ES2015)**: Successor with classes, arrow functions, promises, modules, and more
- **ECMAScript 3**: Predecessor, widely supported but with limited capabilities
- **ECMA-262**: The official standard that defines the JavaScript language

## Summary

ECMAScript 5 represents a critical evolution in JavaScript history, introducing essential features that enable modern, maintainable code. With over 93% global browser support and universal support in modern browsers, ES5 is the de facto standard for JavaScript development. The widespread adoption of polyfills like es5-shim makes it feasible to support even older browsers while leveraging ES5 features.

For new projects, ES5 is recommended as the baseline target, with ES6+ features progressively enhanced for modern browsers through transpilation or conditional feature loading.
