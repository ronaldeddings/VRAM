# Array.prototype.findIndex

## Overview

The `Array.prototype.findIndex()` method returns the **index** of the first element in an array that satisfies the provided testing function. If no element satisfies the condition, it returns `-1`.

This is complementary to the `Array.prototype.find()` method, which returns the value itself rather than the index.

## Specification

- **Status:** ES2015 Standard
- **Specification:** [ECMAScript 2015 Language Specification](https://tc39.es/ecma262/#sec-array.prototype.findindex)
- **Category:** JavaScript / ES6

## Syntax

```javascript
array.findIndex((element, index, array) => {
  // Return true if element matches condition
});

// With optional thisArg parameter
array.findIndex(callback, thisArg);
```

### Parameters

- **callback** (required): A function to execute for each element in the array
  - **element**: The current element being processed
  - **index** (optional): The index of the current element
  - **array** (optional): The array `findIndex()` is being called on
- **thisArg** (optional): Value to use as `this` when executing the callback

### Return Value

- Returns the **index** (as an integer) of the first element that passes the test
- Returns `-1` if no element passes the test

## Use Cases & Benefits

### Primary Use Cases

1. **Finding Element Index**
   - Locate the position of an element matching specific criteria
   - More efficient than using `indexOf()` for complex conditions

2. **Conditional Search**
   - Search with complex logic beyond simple equality
   - Example: Find first user with a specific role or status

3. **Existence Checking with Index**
   - Determine if an element exists AND get its position
   - Useful for array manipulation at a specific index

### Code Examples

#### Basic Usage
```javascript
const numbers = [10, 20, 30, 40, 50];

// Find index of first number greater than 25
const index = numbers.findIndex(num => num > 25);
console.log(index); // 2 (value is 30)
```

#### Object Array Search
```javascript
const users = [
  { id: 1, name: 'Alice', active: false },
  { id: 2, name: 'Bob', active: true },
  { id: 3, name: 'Charlie', active: false }
];

// Find index of first active user
const activeIndex = users.findIndex(user => user.active);
console.log(activeIndex); // 1 (Bob's index)
```

#### With Complex Condition
```javascript
const items = [
  { id: 1, price: 15, inStock: false },
  { id: 2, price: 25, inStock: true },
  { id: 3, price: 35, inStock: true }
];

// Find first item in stock with price under 30
const index = items.findIndex(item => item.inStock && item.price < 30);
console.log(index); // 1
```

#### String Array Search
```javascript
const fruits = ['apple', 'banana', 'cherry', 'date'];

const index = fruits.findIndex(fruit => fruit.startsWith('c'));
console.log(index); // 2 (cherry)
```

## Browser Support

### First Version Support by Browser

| Browser | First Support | Status |
|---------|---------------|--------|
| Chrome | 45 | ✅ Supported |
| Firefox | 25 | ✅ Supported |
| Safari | 7.1 | ✅ Supported |
| Edge | 12 | ✅ Supported |
| Opera | 32 | ✅ Supported |
| IE | - | ❌ Not Supported |

### Mobile & Device Support

| Platform | First Support | Status |
|----------|---------------|--------|
| iOS Safari | 8 | ✅ Supported |
| Android Browser | 45+ | ✅ Supported |
| Chrome Mobile | 45+ | ✅ Supported |
| Firefox Mobile | 25+ | ✅ Supported |
| Samsung Internet | 5.0+ | ✅ Supported |
| Opera Mobile | 80+ | ✅ Supported |
| Opera Mini | - | ❌ Not Supported |

### Legacy Browser Notes

- **Internet Explorer:** Not supported in any version (IE 11 or earlier)
- **Opera Mini:** Not supported (uses older JS engine)
- **Older Android Browsers:** Limited support before Android 4.4

### Global Support Coverage

- **Supported Worldwide:** 93.17% of users
- **Widespread Adoption:** Most modern browsers from ES2015 adoption era

## Feature Comparison

### findIndex() vs. find()

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// find() returns the element
const user = users.find(u => u.id === 2);
// { id: 2, name: 'Bob' }

// findIndex() returns the index
const index = users.findIndex(u => u.id === 2);
// 1
```

### findIndex() vs. indexOf()

```javascript
const items = [10, 20, 30];

// indexOf() works only with primitive values
const idx1 = items.indexOf(20);
// 1

// findIndex() works with complex conditions
const idx2 = items.findIndex(item => item > 15);
// 1
```

### findIndex() vs. lastIndexOf()

```javascript
const values = [1, 2, 3, 2, 1];

// lastIndexOf() finds the last occurrence
const lastIdx = values.lastIndexOf(2);
// 3

// findIndex() finds the first occurrence matching a condition
const firstIdx = values.findIndex(val => val === 2);
// 1
```

## Known Issues & Quirks

### None

This feature has no documented bugs or known issues. It's a stable, well-implemented part of the ES2015 specification with consistent behavior across browsers.

### Potential Gotchas

1. **Empty Array Returns -1**
   ```javascript
   [].findIndex(x => true); // -1
   ```

2. **Callback Execution**
   - The callback is only called for indices with assigned values
   - Not called for deleted or never-assigned indices in sparse arrays

3. **No Break Mechanism**
   - Once a match is found, the iteration stops
   - Unlike `filter()` which processes all elements

## Polyfill Support

For legacy browser support, polyfills are available:

- **[core-js](https://github.com/zloirock/core-js#ecmascript-array)** - Comprehensive ECMAScript polyfills
  - Provides ES2015 `Array.prototype.findIndex` for older environments
  - Widely used and well-maintained

## Related Features

- **[Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)** - Returns the value instead of index
- **[Array.prototype.indexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)** - Strict equality search
- **[Array.prototype.lastIndexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)** - Find last matching index
- **[Array.prototype.findLast()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast)** - ES2023 method, finds last matching value
- **[Array.prototype.findLastIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex)** - ES2023 method, finds last matching index

## Best Practices

### When to Use findIndex()

✅ Use when you need:
- The position of an element in an array
- To search with complex conditions
- To chain the result with array manipulation
- To avoid iterating twice (once to find, once to get index)

### When to Use Alternatives

- Use **indexOf()** for simple value searches
- Use **find()** when you need the value, not the index
- Use **some()** when you only need a boolean (true/false)
- Use **filter()** when you need all matching elements

### Performance Considerations

```javascript
// Good: Stops at first match
const index = users.findIndex(u => u.active);

// Less efficient: Continues checking all items
const index = users.map((u, i) => u.active ? i : -1).find(i => i !== -1);
```

## Resources

- **[MDN Web Docs - Array.prototype.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)** - Complete reference with examples
- **[core-js Polyfill Library](https://github.com/zloirock/core-js#ecmascript-array)** - Polyfill for legacy browsers
- **[ECMAScript Specification](https://tc39.es/ecma262/#sec-array.prototype.findindex)** - Official specification

## Summary

`Array.prototype.findIndex()` is a fundamental ES2015 method for searching arrays with custom conditions. With 93%+ global browser support and no known issues, it's safe to use in modern web development. For older browser support, polyfills via core-js are readily available.

---

**Last Updated:** 2025-12-13
**Feature Status:** ES2015 Standard (Widely Supported)
