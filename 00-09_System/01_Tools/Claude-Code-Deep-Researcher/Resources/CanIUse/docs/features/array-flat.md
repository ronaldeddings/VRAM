# Array.flat() & Array.flatMap()

## Overview

`Array.prototype.flat()` and `Array.prototype.flatMap()` are ES2019 methods that provide convenient ways to work with nested arrays in JavaScript. These methods enable developers to flatten arrays and apply mapping operations in a single step without complex recursion or helper functions.

## Description

These methods flatten any sub-arrays found in an array by concatenating their elements into a single array. `flat()` recursively flattens an array to a specified depth, while `flatMap()` applies a mapping function and then flattens the result by one level.

## Specification

- **Status**: ES2019 Standard (Finalized)
- **Specification Link**: [Array.prototype.flat - ECMAScript 262](https://tc39.es/ecma262/#sec-array.prototype.flat)

## Categories

- **JavaScript (ES2019)**

## Benefits & Use Cases

### Primary Benefits

1. **Simplified Array Flattening**: Eliminates the need for recursive functions or complex reduce patterns to flatten nested arrays
2. **Cleaner Syntax**: More readable alternative to traditional flattening approaches
3. **Built-in Performance**: Native implementation is optimized compared to polyfills
4. **Chainable Operations**: `flatMap()` combines map and flatten in a single method call

### Common Use Cases

- **Data Transformation**: Flattening hierarchical data structures from APIs or databases
- **Matrix Operations**: Transforming multi-dimensional arrays into single-dimensional arrays
- **Cleaning Sparse Arrays**: Removing empty slots when flattening with `flat(1)`
- **Combining Results**: Merging multiple arrays or results from parallel operations
- **Search Results Processing**: Flattening nested search results or grouped data
- **Tree Traversal**: Converting tree structures into flat lists

### Example Usage

```javascript
// Array.flat() - basic flattening
const nested = [1, [2, [3, [4]]]];
nested.flat();        // [1, 2, [3, [4]]]
nested.flat(2);       // [1, 2, 3, [4]]
nested.flat(Infinity); // [1, 2, 3, 4]

// Removing empty slots
const withHoles = [1, 2, , 4];
withHoles.flat();     // [1, 2, 4]

// Array.flatMap() - map and flatten
const numbers = [1, 2, 3];
numbers.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]

// Practical example: extracting nested data
const users = [
  { name: "Alice", skills: ["JS", "React"] },
  { name: "Bob", skills: ["Python", "Django"] }
];
users.flatMap(user => user.skills);
// ["JS", "React", "Python", "Django"]
```

## Browser Support

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Chrome** | 69 (June 2018) | ✅ Supported |
| **Edge** | 79 (January 2020) | ✅ Supported |
| **Firefox** | 62 (September 2018) | ✅ Supported |
| **Safari** | 12 (September 2018) | ✅ Supported |
| **Opera** | 56 (August 2018) | ✅ Supported |
| **iOS Safari** | 12 (September 2018) | ✅ Supported |
| **Android Chrome** | 69+ | ✅ Supported |
| **Samsung Internet** | 10.1 (2019) | ✅ Supported |
| **Internet Explorer** | ❌ Never | Not Supported |
| **Opera Mini** | ❌ Never | Not Supported |

### Desktop Browser Support Summary

```
Chrome   ████████████████████ v69+
Edge     ████████████████████ v79+
Firefox  ████████████████████ v62+
Safari   ████████████████████ v12+
Opera    ████████████████████ v56+
IE       ❌ No support
```

### Mobile Browser Support Summary

```
iOS Safari       ████████████████████ v12+
Android Browser  ████████████████████ v69+
Samsung Internet ████████████████████ v10.1+
Chrome Mobile    ████████████████████ v69+
Firefox Mobile   ████████████████████ v62+
Opera Mobile     ████████████████████ v80+
```

## Compatibility Notes

### Strong Browser Support

With 92.69% global usage coverage, `flat()` and `flatMap()` have excellent browser support across modern browsers. The methods are now safe to use in production without transpilation for most modern web applications.

### Legacy Browser Considerations

- **Internet Explorer**: No support - requires polyfill
- **Opera Mini**: No support - consider polyfill for users on older devices
- **Older Mobile Devices**: Support begins with iOS Safari 12 and Android 69+

### Known Limitations

1. **Internet Explorer**: Complete lack of support requires polyfills for IE11 and earlier
2. **Very Old Mobile Browsers**: Some older Android devices and feature phones need fallbacks
3. **No Vendor Prefixes**: The feature uses standard naming without webkit/moz variants

## Polyfills & Fallbacks

### Available Polyfills

If you need to support older browsers, the following polyfills are available:

1. **[array-flat-polyfill](https://github.com/jonathantneal/array-flat-polyfill)** - Dedicated polyfill for `flat()` and `flatMap()`
2. **[core-js](https://github.com/zloirock/core-js#ecmascript-array)** - Comprehensive polyfill library with `Array.prototype.flat` and `flatMap` support

### Manual Implementation (No Polyfill)

If you prefer not to use a polyfill, a basic fallback implementation:

```javascript
// Polyfill for Array.prototype.flat
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    return this.reduce((flat, item) =>
      flat.concat(depth > 1 && Array.isArray(item) ? item.flat(depth - 1) : item),
      []
    );
  };
}

// Polyfill for Array.prototype.flatMap
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    return this.map((item, index) => callback.call(thisArg, item, index, this)).flat();
  };
}
```

## Syntax Reference

### Array.prototype.flat()

```javascript
array.flat([depth])
```

**Parameters:**
- `depth` (optional): Integer specifying how deep a nested array structure should be flattened. Default: 1. Use `Infinity` for complete flattening.

**Returns:** A new array with sub-array elements concatenated into it.

### Array.prototype.flatMap()

```javascript
array.flatMap(callback, thisArg)
```

**Parameters:**
- `callback`: Function that produces an element of the new array
- `thisArg` (optional): Value to use as `this` when executing callback

**Returns:** A new array with each element mapped and flattened once.

## Related Links

- [MDN - Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
- [MDN - Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [History of the `flat` Methods - "Smooshgate"](https://developers.google.com/web/updates/2018/03/smooshgate) - Interesting article about the naming controversy
- [array-flat-polyfill on GitHub](https://github.com/jonathantneal/array-flat-polyfill)
- [core-js Polyfills](https://github.com/zloirock/core-js#ecmascript-array)

## Migration Guide

### From Recursive Function

**Before:**
```javascript
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}
```

**After:**
```javascript
const flatten = (arr) => arr.flat(Infinity);
```

### From Reduce Pattern

**Before:**
```javascript
const flattened = nested.reduce(
  (acc, val) => acc.concat(val),
  []
);
```

**After:**
```javascript
const flattened = nested.flat();
```

## Performance Considerations

- **Native Implementation**: Modern browsers have optimized implementations that are typically faster than polyfills
- **Depth Parameter**: For most use cases, default depth of 1 is sufficient and faster than `Infinity`
- **Memory**: Creates new arrays rather than mutating originals, which is safer but uses more memory
- **Large Arrays**: For extremely large arrays, consider streaming or generator approaches

## See Also

- [Array.prototype.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
- [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [ES2019 Features Overview](https://tc39.es/ecma262/#sec-array.prototype.flat)

---

**Last Updated**: December 2025
**Data Source**: Can I Use Database
**Global Usage**: 92.69% of browsers support this feature
