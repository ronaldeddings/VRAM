# Object.entries()

## Overview

`Object.entries()` is a JavaScript method that creates a multi-dimensional array of key-value pairs from the given object. This provides a convenient way to iterate over an object's enumerable string-keyed properties and their values in a standardized format.

## Description

The `Object.entries()` method returns an array of a given object's own enumerable string-keyed property `[key, value]` pairs, in the same order as that provided by a `for...in` loop.

### Basic Syntax

```javascript
Object.entries(obj)
```

### Parameters

- **obj**: The object whose enumerable own properties are to be returned.

### Return Value

An array of the given object's own enumerable string-keyed property `[key, value]` pairs.

### Example Usage

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.entries(obj));
// Output: [['a', 1], ['b', 2], ['c', 3]]

// Can be used with destructuring and array methods
Object.entries(obj).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

## Specification Status

- **Specification**: [ECMAScript 2017 (ES8)](https://tc39.es/ecma262/#sec-object.entries)
- **Status**: Standardized (ES2017)
- **Category**: JavaScript (JS)
- **Usage**: 93.04% of users have browser support

## Use Cases & Benefits

### 1. **Object Iteration**
Provides a cleaner, more readable way to iterate over object properties:

```javascript
const settings = { theme: 'dark', lang: 'en', notifications: true };
for (const [key, value] of Object.entries(settings)) {
  console.log(`Setting ${key}: ${value}`);
}
```

### 2. **Object Transformation**
Easily transform objects into new objects or data structures:

```javascript
const original = { a: 1, b: 2, c: 3 };
const transformed = Object.fromEntries(
  Object.entries(original).map(([key, value]) => [key, value * 2])
);
// Result: { a: 2, b: 4, c: 6 }
```

### 3. **Filtering Object Properties**
Selectively extract properties from an object:

```javascript
const user = { name: 'John', age: 30, admin: false };
const filtered = Object.fromEntries(
  Object.entries(user).filter(([_, value]) => typeof value !== 'boolean')
);
// Result: { name: 'John', age: 30 }
```

### 4. **Converting to Map**
Convert objects to Map for specific use cases:

```javascript
const obj = { one: 1, two: 2, three: 3 };
const map = new Map(Object.entries(obj));
```

### 5. **Validation & Processing**
Validate and process object properties systematically:

```javascript
const formData = { email: 'test@example.com', password: '123456' };
Object.entries(formData).forEach(([field, value]) => {
  validateField(field, value);
});
```

## Browser Support

### Current Status

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| **Chrome** | 54+ | Supported |
| **Edge** | 14+ | Supported |
| **Firefox** | 47+ | Supported |
| **Safari** | 10.1+ | Supported |
| **Opera** | 41+ | Supported |
| **iOS Safari** | 10.3+ | Supported |
| **Android Chrome** | 142+ | Supported |
| **Android Firefox** | 144+ | Supported |
| **Samsung Internet** | 6.2+ | Supported |

### Legacy Browser Support

| Browser | Support |
|---------|---------|
| **Internet Explorer** | Not supported (all versions) |
| **Opera Mini** | Not supported |
| **Blackberry Browser 7** | Not supported |
| **Blackberry Browser 10** | Partial/Unknown |

### Mobile Browser Support

| Platform | Status |
|----------|--------|
| **iOS Safari** | 10.3+ |
| **Android Browser** | 4.4.3+ (no), 142+ (yes) |
| **Chrome Mobile** | 142+ |
| **Firefox Mobile** | 144+ |
| **Opera Mobile** | 80+ |
| **Samsung Internet** | 6.2+ |
| **UC Browser** | 15.5+ |
| **Baidu Browser** | 13.52+ |
| **KaiOS** | 2.5+ |

### Global Browser Compatibility

**Overall Support**: 93.04% of global browser usage

This indicates that `Object.entries()` is safe to use without polyfills for modern web applications targeting contemporary browsers.

## Implementation Considerations

### Polyfill/Shim Support

If you need to support older browsers, polyfills are available:

1. **ES2017 spec-compliant shim**: [Object.entries GitHub](https://github.com/es-shims/Object.entries)
2. **core-js library**: [core-js polyfill](https://github.com/zloirock/core-js#ecmascript-object) - Includes `Object.entries()` support

### Usage with Transpilers

Modern build tools (Babel, TypeScript, webpack, Parcel) typically handle `Object.entries()` through appropriate polyfill injection or transpilation depending on your target browser versions.

## Related Methods

- **`Object.keys()`**: Returns only property keys
- **`Object.values()`**: Returns only property values
- **`Object.fromEntries()`**: Creates object from entries (reverse operation)
- **`for...in` loop**: Traditional way to iterate over properties
- **`Object.getOwnPropertyNames()`**: Returns all property names
- **`Map`**: Map object can use entries for key-value pair storage

## Performance Notes

`Object.entries()` creates a new array, so it has memory and CPU overhead:

- For small objects: Negligible performance impact
- For large objects: Consider direct property access patterns if iterating frequently
- Modern engines optimize this heavily, making performance differences minimal in practice

## Best Practices

1. **Use destructuring** for cleaner code:
   ```javascript
   Object.entries(obj).forEach(([key, value]) => { /* ... */ });
   ```

2. **Combine with `Object.fromEntries()`** for transformations:
   ```javascript
   const result = Object.fromEntries(
     Object.entries(obj).map(([k, v]) => [k, transform(v)])
   );
   ```

3. **Check browser support** if targeting legacy browsers - use polyfills as needed

4. **Consider alternative approaches** for very large objects where performance is critical

## Standards & Resources

### Official Documentation

- **[MDN Web Docs - Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)**: Comprehensive reference with examples
- **[ECMAScript Specification](https://tc39.es/ecma262/#sec-object.entries)**: Official TC39 specification

### Related Specifications

- ECMAScript 2017 (ES8) - Where this feature was introduced
- ES2019: Introduced `Object.fromEntries()` (complementary method)

## Notes

No known browser bugs or implementation issues are reported for `Object.entries()`.

---

**Last Updated**: 2025
**Browser Data**: Current as of latest caniuse database
**Feature Category**: JavaScript (Core Language)
