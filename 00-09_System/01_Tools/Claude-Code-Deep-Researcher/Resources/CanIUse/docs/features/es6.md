# ECMAScript 2015 (ES6)

## Overview

ECMAScript 2015, commonly known as ES6, is a major update to the JavaScript language that introduced groundbreaking features and syntax improvements. It represents a significant evolution from ES5, modernizing how developers write and structure JavaScript code across all platforms.

## Description

Support for the ECMAScript 2015 specification includes support for Promises, Modules, Classes, Template Literals, Arrow Functions, Let and Const, Default Parameters, Generators, Destructuring Assignment, Rest & Spread operators, Map/Set & WeakMap/WeakSet and many more.

## Specification Status

- **Status**: Other
- **Official Specification**: [TC39 ECMAScript 2015 Specification](https://tc39.es/ecma262/)
- **Current Support Level**: ES6 is now widely supported across modern browsers, with "Supported" meaning at least 95% of the specification is implemented. "Partial support" indicates at least 10% of the specification is implemented.

## Categories

- JavaScript (JS)

## Key Features & Use Cases

### Core Language Features

- **Classes**: Object-oriented programming with class syntax, constructors, inheritance, and methods
- **Arrow Functions**: Concise function syntax with lexical `this` binding
- **Template Literals**: String interpolation and multi-line string support with backticks
- **Let & Const**: Block-scoped variable declarations replacing `var`
- **Default Parameters**: Function parameters with default values
- **Destructuring Assignment**: Easy extraction of values from arrays and objects
- **Rest & Spread Operators**: Flexible parameter handling and array/object spreading

### Modern APIs

- **Promises**: Asynchronous programming pattern for handling async operations
- **Modules**: Native module system with `import` and `export`
- **Map & Set**: Efficient collection data structures
- **WeakMap & WeakSet**: Memory-efficient variants for garbage collection
- **Typed Arrays**: Native support for binary data operations
- **Generators**: Functions that can be paused and resumed with `function*` and `yield`

### Enhanced Built-in Methods

- `String.prototype.includes()`, `endsWith()`, `repeat()`
- `Array.prototype.find()`, `findIndex()`, `fill()`
- `Object.assign()` for object merging

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| **y** | Fully Supported |
| **a** | Partial Support |
| **n** | Not Supported |

### Desktop Browsers

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| **Chrome** | 51 | ✅ Fully Supported | All versions 51+ fully support ES6 (#2) |
| **Firefox** | 54 | ✅ Fully Supported | Firefox 6-53 had partial support; 54+ fully support ES6 (#2) |
| **Safari** | 10 | ✅ Fully Supported | Safari 7.1-9 had partial support; 10+ fully support ES6 |
| **Edge** | 15 | ✅ Fully Supported | Edge 12-14 had partial support (#2); 15+ fully support ES6 (#2, #3) |
| **Opera** | 38 | ✅ Fully Supported | Opera 15-37 had partial support (#2); 38+ fully support ES6 (#2) |
| **Internet Explorer** | Not Supported | ❌ No Support | IE 11 has notable partial support (#1); IE 5.5-10 not supported |

### Mobile Browsers

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| **iOS Safari** | 10.0 | ✅ Fully Supported | iOS 7.0-9.3 had partial support; 10.0+ fully support ES6 |
| **Android Browser** | 4.4+ | ⚠️ Partial Support | Android 4.4-4.4.4 have partial support (#2); Android 142+ fully support ES6 (#2) |
| **Chrome Android** | 142 | ✅ Fully Supported | Chrome Android 142+ fully support ES6 (#2) |
| **Firefox Android** | 144 | ✅ Fully Supported | Firefox Android 144+ fully support ES6 (#2) |
| **Opera Mobile** | 80 | ✅ Fully Supported | Opera Mobile 10-12.1 not supported; 80+ fully support ES6 (#2) |
| **Samsung Internet** | 5.0 | ✅ Fully Supported | Samsung 4 had partial support (#2); 5.0+ fully support ES6 (#2) |
| **Opera Mini** | All | ❌ No Support | Not supported in any version |
| **UC Browser** | 15.5 | ✅ Fully Supported | UC Browser 15.5+ fully support ES6 (#2) |
| **Baidu Browser** | 13.52 | ✅ Fully Supported | Baidu 13.52+ fully support ES6 (#2) |
| **KaiOS** | 3.0 | ✅ Fully Supported | KaiOS 2.5 had partial support (#2); 3.0+ fully support ES6 (#2) |
| **BlackBerry** | 10 | ⚠️ Partial Support | BlackBerry 10 has partial support |
| **IE Mobile** | 11 | ⚠️ Partial Support | IE Mobile 10 not supported; 11 has partial support (#1, #2) |

## Usage Statistics

- **Fully Supported**: 93.03% of users
- **Partial Support**: 0.55% of users
- **No Support**: 6.42% of users

## Important Notes

### General Notes

As ES6 refers to a huge specification and browsers have various levels of support:

- **"Supported"** means at least 95% of the spec is supported
- **"Partial support"** refers to at least 10% of the spec being supported
- For comprehensive compatibility details, see the [Kangax ES6 Compatibility Table](https://compat-table.github.io/compat-table/es6/)

### Browser-Specific Notes

#### Note #1: Internet Explorer 11
Notable partial support in IE11 includes (at least some) support for:
- `const` and `let` declarations
- Block-level function declarations
- Typed arrays
- `Map`, `Set`, and `WeakMap`

#### Note #2: Tail Call Optimization
Browsers marked with this note do **not** support [tail call optimization](https://compat-table.github.io/compat-table/es6/#test-proper_tail_calls_%28tail_call_optimisation%29), which is important for functional programming patterns and preventing stack overflow in recursive functions.

#### Note #3: Edge 15-18 Limitations
Partial Symbol support and partial support for `RegExp.prototype` properties are available.

## Migration & Recommendations

### For New Projects
- **Recommended**: Safely use ES6 features in all modern browser projects
- **Coverage**: 93%+ of users already support ES6
- **Polyfills**: Available for legacy browser support through [core-js library](https://github.com/zloirock/core-js#ecmascript)

### For Legacy Support
If you need to support IE11 or older browsers:
- Use transpilers like Babel to convert ES6 to ES5
- Apply appropriate polyfills for missing APIs
- Reference the [core-js polyfill library](https://github.com/zloirock/core-js#ecmascript) for comprehensive coverage

### Best Practices

1. **Use Modern Syntax**: Leverage arrow functions, template literals, and destructuring for cleaner code
2. **Block Scoping**: Replace `var` with `let` and `const` to avoid scope confusion
3. **Promises**: Use Promises or async/await (ES2017+) for async operations
4. **Modules**: Adopt module syntax for better code organization
5. **Transpilation**: Use Babel if legacy browser support is required

## Related Resources

### Learning Resources
- [ES6 Features Overview & Comparisons](http://es6-features.org) - Quick reference for ES6 features
- [Exploring ES6 (Book)](https://exploringjs.com/es6/) - Comprehensive guide to ES6 features
- [Kangax ES6 Compatibility Table](https://compat-table.github.io/compat-table/es6/) - Detailed feature-by-feature support table

### Polyfills & Tools
- [core-js Library](https://github.com/zloirock/core-js#ecmascript) - Comprehensive polyfill for all ES2015 features
- [Babel](https://babeljs.io/) - JavaScript transpiler for converting ES6 to ES5

## Conclusion

ES6 has become the de facto standard for JavaScript development and is now widely supported across all major browsers and devices. With over 93% of users supporting ES6 features, most projects can safely adopt modern JavaScript syntax without requiring transpilation or polyfills, unless specifically targeting legacy browsers like Internet Explorer.
