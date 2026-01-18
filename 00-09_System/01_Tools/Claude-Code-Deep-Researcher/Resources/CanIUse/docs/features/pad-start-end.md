# String.prototype.padStart() and String.prototype.padEnd()

## Overview

`padStart()` and `padEnd()` are String prototype methods that pad the current string with a given string (repeated if necessary) to reach a specified length. `padStart()` adds padding to the beginning (left) of the string, while `padEnd()` adds padding to the end (right).

## Description

The `padStart()` and `padEnd()` methods provide a convenient way to pad strings to a desired length with a fill string:

- **`padStart(targetLength [, padString])`** - Pads the string from the start (left side) until it reaches the target length
- **`padEnd(targetLength [, padString])`** - Pads the string from the end (right side) until it reaches the target length

These methods are useful for formatting output, aligning text, and ensuring strings meet minimum length requirements without modifying the original string.

### Syntax

```javascript
str.padStart(targetLength [, padString])
str.padEnd(targetLength [, padString])
```

### Parameters

- **`targetLength`** - The length of the resulting string once padding has been applied. If this parameter is less than the string's current length, the string is returned as-is
- **`padString`** (optional) - The string to pad the current string with. If `padString` is too long, it will be truncated. Default value is a space character (`" "`)

### Return Value

A new string of the specified `targetLength` with padding applied.

## Specification Status

- **Status**: Standardized (Part of ECMAScript 2017)
- **Specification**: [ECMAScript 2017 String.prototype.padEnd](https://tc39.es/ecma262/#sec-string.prototype.padend)
- **Category**: JavaScript (ES2017)

## Use Cases & Benefits

### Alignment and Formatting
Format output with consistent column widths:

```javascript
const names = ["Alice", "Bob", "Charlie"];
names.forEach(name => {
  console.log(name.padEnd(10) + "| Value");
});
// Output:
// Alice     | Value
// Bob       | Value
// Charlie   | Value
```

### ID and Code Generation
Pad IDs or codes with zeros or other characters:

```javascript
const orderId = "42".padStart(6, "0");
console.log(orderId); // "000042"
```

### Fixed-Width Display
Format numbers with leading zeros for fixed-width displays:

```javascript
const hours = "9".padStart(2, "0");
const minutes = "5".padStart(2, "0");
console.log(`${hours}:${minutes}`); // "09:05"
```

### Console Output and Logging
Create readable, aligned console tables:

```javascript
const items = {
  "item1": 100,
  "item2": 2500,
  "item3": 45
};

Object.entries(items).forEach(([key, value]) => {
  console.log(key.padEnd(8) + value.toString().padStart(6));
});
```

### String Truncation and Truncation Handling
Ensure strings don't exceed maximum length:

```javascript
const maxLength = 15;
let text = "This is a very long text";
if (text.length > maxLength) {
  text = text.substring(0, maxLength - 3) + "...";
}
console.log(text.padEnd(maxLength));
```

## Browser Support

### Support Summary
- **Global Usage**: ~93% of users have support
- **IE**: Not supported (all versions)
- **Legacy Browsers**: Limited support in older versions

### Desktop Browsers

| Browser | Support | First Version |
|---------|---------|--------------|
| **Chrome** | ✅ Yes | 57+ |
| **Firefox** | ✅ Yes | 48+ |
| **Safari** | ✅ Yes | 10+ |
| **Edge** | ✅ Yes | 15+ |
| **Opera** | ✅ Yes | 44+ |
| **IE** | ❌ No | Never |

### Mobile Browsers

| Browser | Support | First Version |
|---------|---------|--------------|
| **iOS Safari** | ✅ Yes | 10.0+ |
| **Chrome (Android)** | ✅ Yes | 57+ |
| **Firefox (Android)** | ✅ Yes | 48+ |
| **Samsung Internet** | ✅ Yes | 7.2+ |
| **Opera Mobile** | ✅ Yes | 80+ |
| **Android Browser** | ✅ Yes | 57+ |
| **UC Browser (Android)** | ✅ Yes | 15.5+ |
| **Opera Mini** | ❌ No | Never |

### Version Details

**Chrome**: Supported from version 57 onwards (100% modern Chrome)

**Firefox**: Supported from version 48 onwards (100% modern Firefox)

**Safari**: Supported from version 10+ (all modern versions supported)

**Edge**: Supported from version 15+ (all modern Chromium-based Edge supported)

**Opera**: Supported from version 44+ (all modern Opera supported)

## Implementation Examples

### Basic padStart() Examples

```javascript
// Pad with spaces
"5".padStart(3);                    // "  5"
"hello".padStart(10);               // "     hello"

// Pad with specific character
"5".padStart(3, "0");               // "005"
"42".padStart(4, "*");              // "**42"

// Pad with string (repeated if necessary)
"foo".padStart(10, "bar");          // "barbarbfoo"

// No padding needed if already long enough
"hello".padStart(3);                // "hello"
```

### Basic padEnd() Examples

```javascript
// Pad with spaces
"5".padEnd(3);                      // "5  "
"hello".padEnd(10);                 // "hello     "

// Pad with specific character
"5".padEnd(3, "0");                 // "500"
"42".padEnd(4, "*");                // "42**"

// Pad with string (repeated if necessary)
"foo".padEnd(10, "bar");            // "foobarbarb"

// No padding needed if already long enough
"hello".padEnd(3);                  // "hello"
```

### Practical Examples

```javascript
// Format time strings
function formatTime(hours, minutes) {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
console.log(formatTime(9, 5));      // "09:05"

// Format table output
function printTable(data) {
  data.forEach(row => {
    console.log(
      row.name.padEnd(15) +
      row.count.toString().padStart(5) +
      row.price.toFixed(2).padStart(8)
    );
  });
}

// Zero-padded IDs
function formatId(id) {
  return "ID-" + id.toString().padStart(5, "0");
}
console.log(formatId(42));          // "ID-00042"
```

## Notes

- Both methods return a new string and do not modify the original
- If `padString` is omitted, a space character is used by default
- If `padString` is an empty string, the original string is returned unchanged
- The `padString` is repeated and truncated as necessary to reach the target length
- No known bugs or compatibility issues in modern browsers
- A polyfill is available through [core-js](https://github.com/zloirock/core-js#ecmascript-string-and-regexp) for older environments

## Polyfills

For environments that need to support older browsers, a polyfill is available:

```bash
npm install core-js
```

Then import the polyfill:

```javascript
import 'core-js/features/string/pad-start';
import 'core-js/features/string/pad-end';
```

## Related Resources

- [MDN Web Docs - String.prototype.padStart()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
- [MDN Web Docs - String.prototype.padEnd()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)
- [core-js Polyfill Library](https://github.com/zloirock/core-js#ecmascript-string-and-regexp)
- [ECMAScript 2017 Specification](https://tc39.es/ecma262/#sec-string.prototype.padend)

## Migration Guide from Older Approaches

### Before (ES5/ES6)

```javascript
// Using string concatenation
function padStart(str, length, fill = " ") {
  return fill.repeat(Math.max(0, length - str.length)) + str;
}

// Using Array.join()
const padded = new Array(length - str.length + 1).join(fill) + str;
```

### After (ES2017)

```javascript
// Using native padStart()
str.padStart(length, fill);
```

## Conclusion

`padStart()` and `padEnd()` are widely supported modern JavaScript methods that provide a clean, readable way to pad strings. With nearly 93% global browser support and universal support in modern browsers, they are safe to use in contemporary web applications. For legacy browser support, the core-js polyfill provides a reliable fallback.
