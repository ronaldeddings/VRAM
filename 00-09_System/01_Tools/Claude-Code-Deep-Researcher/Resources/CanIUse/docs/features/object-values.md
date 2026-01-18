# Object.values() Method

## Overview

The `Object.values()` method returns an array of a given object's own enumerable property values, providing a convenient way to extract all values from an object without needing to iterate through keys manually.

## Description

`Object.values()` is a built-in JavaScript method that iterates over an object's enumerable properties and returns their values in a new array. This is particularly useful for cases where you only need the values of an object and don't care about the keys.

### Syntax

```javascript
Object.values(obj)
```

**Parameters:**
- `obj` - The object to extract values from

**Returns:**
- An array containing the enumerable property values of the given object

### Example Usage

```javascript
const obj = { name: 'John', age: 30, city: 'New York' };
const values = Object.values(obj);
// Output: ['John', 30, 'New York']

// Works with different data types
const mixed = { a: 1, b: 'hello', c: true, d: null };
console.log(Object.values(mixed));
// Output: [1, 'hello', true, null]

// Non-enumerable properties are not included
const obj2 = {};
Object.defineProperty(obj2, 'hidden', { value: 'secret', enumerable: false });
Object.defineProperty(obj2, 'visible', { value: 'shown', enumerable: true });
console.log(Object.values(obj2));
// Output: ['shown']
```

## Specification Status

**Status:** ES2017 (ES8) Standard
**Spec Link:** [ECMAScript Language Specification - Object.values](https://tc39.es/ecma262/#sec-object.values)

The feature is part of the official ECMAScript specification and is now widely supported across modern browsers.

## Categories

- **JavaScript (JS)** - Core language feature

## Benefits and Use Cases

### 1. **Data Extraction**
   Extract all values from configuration objects, user data objects, or any data structure where you need to work with values exclusively.

### 2. **Array Manipulation**
   Convert object values into an array for use with array methods like `map()`, `filter()`, `reduce()`, etc.

   ```javascript
   const prices = { apple: 1.5, banana: 0.8, orange: 1.2 };
   const total = Object.values(prices).reduce((sum, price) => sum + price, 0);
   // Output: 3.5
   ```

### 3. **Validation and Testing**
   Check multiple values within an object for validation purposes.

   ```javascript
   const formData = { email: 'test@example.com', password: '123', username: 'user' };
   const allFieldsFilled = Object.values(formData).every(val => val !== '');
   ```

### 4. **Functional Programming**
   Compose with other functional patterns for data transformation.

   ```javascript
   const stats = { wins: 5, losses: 3, draws: 2 };
   const total = Object.values(stats).reduce((a, b) => a + b, 0);
   // Output: 10
   ```

### 5. **JSON-like Data Handling**
   Work with API responses, database records, or any objects where you need to process values in sequence.

## Browser Support

| Browser | First Support | Current Version Support |
|---------|---------------|------------------------|
| **Chrome** | 54 | ✅ Full Support (v146+) |
| **Edge** | 14 | ✅ Full Support (v143+) |
| **Firefox** | 47 | ✅ Full Support (v148+) |
| **Safari** | 10.1 | ✅ Full Support (v18.5+) |
| **Opera** | 41 | ✅ Full Support (v122+) |
| **Internet Explorer** | Not Supported | ❌ Requires Polyfill (v5.5-11) |
| **iOS Safari** | 10.3 | ✅ Full Support (v18.5+) |
| **Android Browser** | 4.4.3+ | ✅ Full Support (v142+) |
| **Samsung Internet** | 6.2 | ✅ Full Support (v29+) |

### Mobile Browser Support

| Platform | Support Status | Minimum Version |
|----------|----------------|-----------------|
| iOS Safari | ✅ Supported | 10.3 |
| Android Chrome | ✅ Supported | 4.4.3+ |
| Android Firefox | ✅ Supported | 144+ |
| Opera Mini | ❌ Requires Polyfill | All versions |
| BlackBerry | ❌ Requires Polyfill | 7, 10 |
| IE Mobile | ❌ Not Supported | All versions |

### Support Summary

- **Global Support**: ~93% of users can use `Object.values()` natively
- **Usage Coverage**: 93.04% with no partial implementations
- **Legacy Browser Support**: Required for IE and older Opera Mini versions

## Polyfills

For applications that need to support older browsers, several polyfill options are available:

### Option 1: Simple Polyfill

```javascript
if (!Object.values) {
  Object.values = function(obj) {
    var vals = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        vals.push(obj[key]);
      }
    }
    return vals;
  };
}
```

### Option 2: Community Polyfills

- **[es-shims/Object.values](https://github.com/es-shims/Object.values)** - Comprehensive polyfill package
- **[core-js](https://github.com/zloirock/core-js#ecmascript-object)** - Modular polyfill library with Object methods

## Related Methods

Similar Object methods you might find useful:

| Method | Purpose | Returns |
|--------|---------|---------|
| `Object.keys()` | Get all enumerable property names | Array of keys |
| `Object.entries()` | Get all key-value pairs | Array of `[key, value]` arrays |
| `Object.getOwnPropertyNames()` | Get all property names (including non-enumerable) | Array of property names |
| `for...in` | Loop through enumerable properties | Iteration |

## Notes and Considerations

### 1. **Enumerable Properties Only**
`Object.values()` only returns enumerable properties. Properties defined as non-enumerable (using `Object.defineProperty()` with `enumerable: false`) will not be included.

### 2. **Inherited Properties Excluded**
Only own properties of the object are included; inherited properties from the prototype chain are not returned.

```javascript
const parent = { inherited: 'value' };
const child = Object.create(parent);
child.own = 'property';
console.log(Object.values(child)); // ['property'] - not 'value'
```

### 3. **Symbol Properties Ignored**
Symbol properties are not included in the returned array. Use `Object.getOwnPropertySymbols()` if you need symbol properties.

### 4. **Order of Values**
The order of values in the returned array is the same as the order of keys returned by `Object.keys()` (insertion order for non-integer string keys, ascending order for integer-like keys).

### 5. **Non-Object Arguments**
If you pass a non-object value to `Object.values()`, it will be converted to an object. Strings return an array of characters.

```javascript
Object.values('abc'); // ['a', 'b', 'c']
Object.values(123);   // []
Object.values(null);  // TypeError
```

## Comparison with Other Methods

### `Object.keys()` vs `Object.values()`

```javascript
const user = { name: 'Alice', age: 25, email: 'alice@example.com' };

Object.keys(user);   // ['name', 'age', 'email']
Object.values(user); // ['Alice', 25, 'alice@example.com']
```

### `Object.entries()` - The Complete Alternative

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.values(obj);   // [1, 2, 3]
Object.entries(obj);  // [['a', 1], ['b', 2], ['c', 3]]

// entries gives you both keys and values at once
Object.entries(obj).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

## Performance Considerations

- `Object.values()` creates a new array each time it's called
- For large objects being processed frequently, consider caching the result
- Modern JavaScript engines optimize this operation heavily

```javascript
// Cache if reusing
const obj = { /* large object */ };
const values = Object.values(obj); // Calculate once
// Reuse values multiple times
```

## Practical Examples

### Example 1: Sum All Values in an Object

```javascript
const expenses = {
  groceries: 120,
  utilities: 85,
  entertainment: 50,
  transport: 40
};

const total = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
console.log(total); // 295
```

### Example 2: Find Duplicates

```javascript
function hasDuplicates(obj) {
  const values = Object.values(obj);
  return values.length !== new Set(values).size;
}

console.log(hasDuplicates({ a: 1, b: 2, c: 1 })); // true
console.log(hasDuplicates({ a: 1, b: 2, c: 3 })); // false
```

### Example 3: Average of Numeric Values

```javascript
const scores = { math: 85, english: 92, science: 78 };
const average =
  Object.values(scores).reduce((sum, score) => sum + score, 0) /
  Object.values(scores).length;
console.log(average); // 85
```

### Example 4: String Concatenation

```javascript
const person = { firstName: 'John', lastName: 'Doe', title: 'Engineer' };
const profile = Object.values(person).join(' ');
console.log(profile); // "John Doe Engineer"
```

## References and Links

- **[MDN Web Docs - Object.values()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Object/values)** - Comprehensive documentation with examples
- **[ECMAScript Specification](https://tc39.es/ecma262/#sec-object.values)** - Official language specification
- **[es-shims/Object.values Polyfill](https://github.com/es-shims/Object.values)** - Community polyfill package
- **[core-js Polyfill](https://github.com/zloirock/core-js#ecmascript-object)** - Comprehensive polyfill library

## See Also

- [Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- [Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
- [for...in loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
- [Map Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) - Alternative to object for key-value pairs
