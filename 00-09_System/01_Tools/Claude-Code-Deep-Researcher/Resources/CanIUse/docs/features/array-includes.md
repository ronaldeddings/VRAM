# Array.prototype.includes

## Description

Determines whether or not an array includes the given value, returning a boolean value (unlike `indexOf`). This method provides a more intuitive and readable way to check array membership compared to traditional approaches.

## Specification

- **Status:** Standardized (ES2016/ES7)
- **Specification Link:** [TC39 - Array.prototype.includes](https://tc39.es/ecma262/#sec-array.prototype.includes)

## Categories

- JavaScript (JS)

## Benefits and Use Cases

### Key Advantages

1. **Semantic Clarity:** Returns a boolean directly, eliminating the need for mental translation of index values
2. **NaN Handling:** Unlike `indexOf()`, properly handles NaN values in comparisons
3. **Readability:** More intuitive than checking if `indexOf()` result is not `-1`
4. **Negative Indexing:** Supports `fromIndex` parameter for starting search position

### Common Use Cases

- **Membership Testing:** Check if an array contains a specific value
  ```javascript
  const fruits = ['apple', 'banana', 'orange'];
  fruits.includes('apple'); // true
  fruits.includes('grape');  // false
  ```

- **Validation:** Validate against whitelists or predefined sets
  ```javascript
  const allowedStatuses = ['pending', 'approved', 'rejected'];
  if (allowedStatuses.includes(status)) {
    // process
  }
  ```

- **Conditional Logic:** Simplify array membership conditions
  ```javascript
  // Before: if (arr.indexOf(val) !== -1)
  // After:
  if (arr.includes(val)) {
    // cleaner and more readable
  }
  ```

- **NaN Detection:** Reliable NaN checking
  ```javascript
  const data = [1, 2, NaN, 4];
  data.includes(NaN); // true
  ```

## Browser Support

### Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 47 | ✅ Full support |
| Firefox | 43 | ✅ Full support |
| Safari | 9 | ✅ Full support |
| Edge | 14 | ✅ Full support |
| Opera | 34 | ✅ Full support |
| Internet Explorer | None | ❌ No support |

### Detailed Support Table

#### Desktop Browsers

| Browser | Version Range | Support | Note |
|---------|---------------|---------|------|
| **Chrome** | 47+ | ✅ Yes | All modern versions supported |
| **Firefox** | 43+ | ✅ Yes | All modern versions supported |
| **Safari** | 9+ | ✅ Yes | Available since Safari 9 |
| **Edge** | 14+ | ✅ Yes | Chromium Edge (79+) fully supported |
| **Opera** | 34+ | ✅ Yes | All modern versions supported |
| **Internet Explorer** | All | ❌ No | Never supported (IE 11 included) |

#### Mobile Browsers

| Browser | First Support | Status |
|---------|---------------|--------|
| **iOS Safari** | 9.0-9.2 | ✅ Yes |
| **Android Browser** | 5.1+ (via Chrome) | ✅ Yes |
| **Chrome for Android** | Modern | ✅ Yes |
| **Firefox for Android** | Modern | ✅ Yes |
| **Samsung Internet** | 5.0+ | ✅ Yes |
| **Opera Mini** | All | ❌ No |
| **Opera Mobile** | 80+ | ✅ Yes |
| **UC Browser** | 15.5+ | ✅ Yes |
| **Android UC Browser** | 15.5+ | ✅ Yes |
| **Baidu Browser** | 13.52+ | ✅ Yes |
| **KaiOS** | 2.5+ | ✅ Yes |

### Global Usage Statistics

- **Global Support:** 93.16% of users have `Array.prototype.includes` available
- **Partial Support:** 0%
- **Unsupported:** ~6.84% (primarily older browsers and IE)

## Browser Compatibility Notes

### Unsupported Browsers

- **Internet Explorer 11 and earlier:** No support whatsoever
- **Opera Mini:** Not supported (uses older rendering engine)
- **BlackBerry Browser:** Not supported

### Fully Supported Modern Browsers

The feature has been widely adopted across all modern browsers since approximately 2016-2017. All actively maintained browser versions support this feature.

## Known Issues and Bugs

No known bugs reported. The implementation is stable and consistent across all supporting browsers.

## Syntax Reference

```javascript
array.includes(searchElement)
array.includes(searchElement, fromIndex)
```

### Parameters

- **searchElement:** The element to search for in the array
- **fromIndex** (optional): The position to start searching from. Default is 0. Can be negative.

### Return Value

- **Boolean:** `true` if the element is found, `false` otherwise

### Examples

```javascript
// Basic usage
const array = [1, 2, 3];
array.includes(2); // true
array.includes(4); // false

// With fromIndex
array.includes(2, 1); // true
array.includes(2, 3); // false (starts search at index 3)

// NaN handling (key difference from indexOf)
const arr = [1, 2, NaN, 4];
arr.includes(NaN); // true
arr.indexOf(NaN);  // -1 (indexOf cannot find NaN)

// Case-sensitive string search
const items = ['Apple', 'Banana'];
items.includes('apple'); // false
items.includes('Apple'); // true

// Negative index
const nums = [1, 2, 3, 4, 5];
nums.includes(4, -2); // true (search from index -2, which is index 3)
```

## Polyfill Support

A polyfill is available through the [core-js library](https://github.com/zloirock/core-js#ecmascript-array) for environments that need to support older browsers.

### Installation

```bash
npm install core-js
```

### Usage

```javascript
import 'core-js/features/array/includes';
// Now Array.prototype.includes is available everywhere
```

## Related Features and Methods

- **Array.prototype.indexOf():** Traditional method to find element index (returns -1 if not found)
- **Array.prototype.find():** Returns the first element that satisfies a condition
- **Array.prototype.some():** Tests if at least one element satisfies a condition
- **Array.prototype.every():** Tests if all elements satisfy a condition
- **Array.prototype.filter():** Returns a new array with elements that satisfy a condition
- **Set.prototype.has():** Alternative for membership testing with O(1) performance

## Comparison with Alternatives

### vs. indexOf()

| Feature | includes() | indexOf() |
|---------|-----------|-----------|
| Returns | Boolean | Number (index or -1) |
| NaN Support | ✅ Yes | ❌ No |
| Readability | ✅ Better | ⚠️ Requires -1 check |
| Performance | Equivalent | Equivalent |

### vs. some()

```javascript
// Using includes()
array.includes(value); // Simple

// Using some()
array.some(item => item === value); // More verbose
```

## Resources

### Documentation

- [MDN Web Docs - Array.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Browser_compatibility)

### Polyfills

- [core-js - ECMAScript Array](https://github.com/zloirock/core-js#ecmascript-array)

### Related Standards

- [ECMAScript 2016 (ES7) Specification](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)
- [TC39 Proposals](https://github.com/tc39/proposals)

## Recommendations

### When to Use

- Always use `Array.prototype.includes()` for membership testing in modern applications
- It's more readable and intuitive than `indexOf()`
- Preferred over `some()` when simple equality checking is needed

### Browser Support Considerations

- **For modern applications:** No fallback needed; 93% global support
- **For legacy support:** Implement the core-js polyfill or use `indexOf()` with -1 check
- **For IE11 support:** Must use polyfill or alternative method

### Performance Notes

- Performance is equivalent to `indexOf()` for most use cases
- For frequent membership testing with large datasets, consider using `Set` instead (O(1) lookup)
- For complex condition checking, use `some()` or `find()` with custom logic

---

**Last Updated:** 2025-12-13
**Data Source:** CanIUse Browser Compatibility Data
