# String.prototype.includes

## Overview

The `String.prototype.includes()` method determines whether one string may be found within another string, returning `true` or `false` as appropriate. This method provides a cleaner and more intuitive way to check if a substring exists within a string compared to using `indexOf()` or `lastIndexOf()`.

## Description

`includes()` performs a case-sensitive search to determine whether a given string can be found within another string. It returns a boolean value (`true` if the string is found, `false` otherwise) and is part of the ES6 (ECMAScript 2015) specification.

**Syntax:**
```javascript
string.includes(searchString, position)
```

**Parameters:**
- `searchString` (required): The string to search for
- `position` (optional): The position within the string at which to begin searching (default is 0)

**Return Value:**
- `true` if the string contains the specified substring
- `false` otherwise

## Specification

- **Status**: ECMAScript Standard (ES6/ES2015)
- **Official Specification**: [TC39 ECMAScript Specification](https://tc39.es/ecma262/#sec-string.prototype.includes)
- **Feature Category**: JavaScript (JS)

## Usage Examples

### Basic String Search
```javascript
const message = "Hello, World!";

console.log(message.includes("World"));      // true
console.log(message.includes("world"));      // false (case-sensitive)
console.log(message.includes("Hello"));      // true
console.log(message.includes("Goodbye"));    // false
```

### Search from Specific Position
```javascript
const text = "JavaScript is great. JavaScript is fun.";

console.log(text.includes("JavaScript"));        // true
console.log(text.includes("JavaScript", 15));    // true (found after position 15)
console.log(text.includes("JavaScript", 30));    // false (not found after position 30)
```

### Practical Use Cases
```javascript
// Email validation
const isValidEmail = (email) => {
  return email.includes("@");
};

// Check for required keywords
const containsRequiredTags = (text) => {
  return text.includes("#important") || text.includes("#urgent");
};

// Filter array of strings
const urls = ["https://example.com", "http://test.org", "ftp://files.net"];
const httpsOnly = urls.filter(url => url.includes("https://"));
```

## Benefits and Use Cases

### Advantages over indexOf()
- **Clarity**: More readable and explicit intent (searching, not finding position)
- **Simplicity**: No need to check against `-1` return value
- **Boolean Return**: Direct boolean result without type coercion

### Common Use Cases

1. **String Validation**
   - Check if user input contains specific keywords or patterns
   - Validate email addresses or URLs for required components
   - Verify required fields in form data

2. **Content Filtering**
   - Filter array of strings based on substring presence
   - Search within large text blocks
   - Identify specific patterns in logs or data

3. **Conditional Logic**
   - Build cleaner conditional statements
   - Improve code readability in filtering operations
   - Simplify string-based decision trees

4. **Search Functionality**
   - Implement autocomplete features
   - Build search filters
   - Check for forbidden or required content

## Browser Support

### Desktop Browsers

| Browser | First Supported Version | Status |
|---------|------------------------|--------|
| **Chrome** | 41+ | ✅ Fully Supported |
| **Firefox** | 40+ | ✅ Fully Supported |
| **Safari** | 9+ | ✅ Fully Supported |
| **Edge** | 12+ | ✅ Fully Supported |
| **Opera** | 28+ | ✅ Fully Supported |
| **Internet Explorer** | ❌ Not Supported | Never Implemented |

### Mobile and Alternative Browsers

| Browser | First Supported Version | Status |
|---------|------------------------|--------|
| **iOS Safari** | 9.0+ | ✅ Fully Supported |
| **Android Browser** | 4.4+ | ✅ Fully Supported |
| **Android Chrome** | 142+ | ✅ Fully Supported |
| **Android Firefox** | 144+ | ✅ Fully Supported |
| **Opera Mobile** | 80+ | ✅ Fully Supported |
| **Samsung Internet** | 4+ | ✅ Fully Supported |
| **Opera Mini** | ❌ Not Supported | Never Implemented |
| **Baidu Browser** | 13.52+ | ✅ Fully Supported |
| **UC Browser** | 15.5+ | ✅ Fully Supported |
| **Blackberry Browser** | ❌ Not Supported | Never Implemented |

### Support Summary
- **Global Usage**: 93.19% of browsers support `String.prototype.includes()`
- **Modern Browsers**: Universally supported in all current versions
- **Legacy Support**: Not available in Internet Explorer or Opera Mini

## Implementation Notes

### Historical Note: Firefox Method Rename
In Firefox 18-39, this method was called `contains()` instead of `includes()`. It was renamed to align with the ECMAScript standard in [Firefox bug 1102219](https://bugzilla.mozilla.org/show_bug.cgi?id=1102219). If you need to support very old Firefox versions, ensure you're testing with updated browser versions.

### Case Sensitivity
The method is **case-sensitive**:
```javascript
"Hello".includes("hello")  // false
"Hello".includes("Hello")  // true
```

### Starting Position Parameter
The optional `position` parameter is useful for limiting searches:
```javascript
const str = "Blue Whale";
str.includes("blue")        // false
str.includes("Blue")        // true
str.includes("Whale", 5)    // true (search starts from index 5)
```

## Polyfill and Legacy Support

For projects requiring support for Internet Explorer or other legacy browsers that don't support `includes()`, a polyfill is available:

**Core-JS Library**: [ECMAScript String and RegExp Polyfills](https://github.com/zloirock/core-js#ecmascript-string-and-regexp)

### Polyfill Implementation
```javascript
// Simple polyfill for legacy browsers
if (!String.prototype.includes) {
  String.prototype.includes = function(searchString, position) {
    if (typeof searchString !== 'string') {
      searchString = String(searchString);
    }
    position = position || 0;
    return this.indexOf(searchString, position) !== -1;
  };
}
```

## Resources and References

### Official Documentation
- [MDN: String.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)
- [TC39 ECMAScript Specification](https://tc39.es/ecma262/#sec-string.prototype.includes)

### Polyfill
- [Core-JS Polyfill Library](https://github.com/zloirock/core-js#ecmascript-string-and-regexp)

### Related Methods
- `String.prototype.indexOf()` - Returns the index of the first occurrence
- `String.prototype.lastIndexOf()` - Returns the index of the last occurrence
- `String.prototype.startsWith()` - Checks if string starts with specified substring
- `String.prototype.endsWith()` - Checks if string ends with specified substring
- `String.prototype.search()` - Searches for a pattern and returns the index

## Browser Compatibility Note

If you're developing for modern web applications (targeting browsers from 2018 and later), you can safely use `String.prototype.includes()` without any polyfills or fallbacks. However, if you need to support Internet Explorer or older mobile browsers, consider either using a polyfill or falling back to the `indexOf()` method.
