# JavaScript Regular Expression Lookbehind Assertions

## Overview

Lookbehind assertions are zero-width assertions in JavaScript regular expressions that allow you to match patterns that are preceded by another pattern. This feature enables more sophisticated and precise regex matching without consuming the preceding characters.

## Description

The positive lookbehind (`(?<= )`) and negative lookbehind (`(?<! )`) zero-width assertions in JavaScript regular expressions can be used to ensure a pattern is preceded by another pattern.

- **Positive Lookbehind** (`(?<=pattern)`): Asserts that what immediately precedes the current position matches the pattern
- **Negative Lookbehind** (`(?<!pattern)`): Asserts that what immediately precedes the current position does NOT match the pattern

Unlike lookahead assertions, which have been available for longer, lookbehind assertions allow matching from right-to-left, enabling more complete regex-based text processing.

## Specification

- **Official Spec**: [ECMAScript 2018 Specification - Assertions](https://tc39.es/ecma262/#sec-assertion)
- **Status**: ES2018 (ECMAScript 9th edition)

## Categories

- **Language**: JavaScript
- **Type**: Regular Expression Feature
- **Feature Class**: Pattern Assertions

## Benefits & Use Cases

### 1. **Currency and Number Formatting**
Extract numbers with currency context without including the currency symbol:
```javascript
// Extract dollar amounts
const text = "$100, $250, €300";
const amounts = text.match(/(?<=\$)\d+/g); // ["100", "250"]
```

### 2. **Password Validation**
Validate that certain characters are not preceded by escape characters:
```javascript
// Match quotes not preceded by backslash
const regex = /(?<!\\)"/g;
const text = 'He said "Hello" and \\"escaped\\"';
```

### 3. **File Extension Processing**
Extract content before specific file extensions:
```javascript
// Match text before .jpg extension
const filename = "photo_2024.jpg";
const name = filename.match(/(?<=^).+(?=\.jpg$)/); // ["photo_2024"]
```

### 4. **Log Parsing**
Extract values that follow specific keywords:
```javascript
// Extract values after "ERROR: "
const log = "ERROR: Database connection failed";
const error = log.match(/(?<=ERROR: ).+/); // ["Database connection failed"]
```

### 5. **Markup and Data Extraction**
Extract content based on surrounding context:
```javascript
// Match numbers after "price: "
const data = "The price: $99.99 is final";
const price = data.match(/(?<=price: )\$[\d.]+/); // ["$99.99"]
```

### 6. **URL Parameter Parsing**
Match query parameters without the parameter name:
```javascript
// Extract value after "id="
const url = "?id=12345&name=john";
const id = url.match(/(?<=id=)\d+/); // ["12345"]
```

### 7. **Replacing Selective Occurrences**
Replace only occurrences that follow specific context:
```javascript
// Replace "cat" only when preceded by "the "
const text = "the cat and a cat";
const result = text.replace(/(?<=the )cat/, "dog"); // "the dog and a cat"
```

## Browser Support

### Support Summary
- **Global Coverage**: 91.89% of users have support
- **Modern Browsers**: Widely supported in current versions
- **Legacy Browsers**: No support in Internet Explorer or older versions

### Detailed Browser Support Table

| Browser | Support Added | Current Status |
|---------|--------------|---|
| **Chrome** | 62 | ✅ Full support (v62+) |
| **Edge** | 79 | ✅ Full support (v79+) |
| **Firefox** | 78 | ✅ Full support (v78+) |
| **Safari** | 16.4 | ✅ Full support (v16.4+) |
| **Opera** | 49 | ✅ Full support (v49+) |
| **iOS Safari** | 16.4 | ✅ Full support (v16.4+) |
| **Android Browser** | 142 | ✅ Full support (v142+) |
| **Samsung Internet** | 8.2 | ✅ Full support (v8.2+) |
| **Opera Mobile** | 80 | ✅ Full support (v80+) |
| **Android Chrome** | 142 | ✅ Full support (v142+) |
| **Android Firefox** | 144 | ✅ Full support (v144+) |
| **Internet Explorer** | Never | ❌ Not supported |
| **Opera Mini** | Never | ❌ Not supported |

### Platform-Specific Notes

#### Desktop Browsers
- **Chrome/Edge**: Available since mid-2018 (Chromium 62/79)
- **Firefox**: Available since September 2019 (v78)
- **Safari**: Available since March 2024 (v16.4)

#### Mobile Browsers
- **iOS Safari**: Parity with desktop Safari (v16.4+)
- **Android Chrome**: Current versions fully supported
- **Android Firefox**: Fully supported in recent versions
- **Samsung Internet**: Fully supported since v8.2 (2019)

#### Legacy Support
- **Internet Explorer 11 and earlier**: Not supported
- **Opera Mini**: Not supported (uses older JavaScript engine)
- **Blackberry**: Not supported

## Usage Examples

### Basic Positive Lookbehind
```javascript
// Match digits that come after a dollar sign
const regex = /(?<=\$)\d+/;
const text = "Price: $100";
const match = text.match(regex);
console.log(match[0]); // "100"
```

### Basic Negative Lookbehind
```javascript
// Match digits NOT preceded by a dollar sign
const regex = /(?<!\$)\d+/;
const text = "Price: $100, Quantity: 5";
const matches = text.match(new RegExp(regex.source, 'g'));
console.log(matches); // ["5"]
```

### Complex Example: Email Domain Extraction
```javascript
// Extract domain name without "@"
const regex = /(?<=@)[\w.]+/;
const email = "user@example.com";
const domain = email.match(regex)[0];
console.log(domain); // "example.com"
```

### Replace with Lookbehind
```javascript
// Add commas to numbers, but only after digits not preceded by comma
const text = "123456789";
const formatted = text.replace(/(?<=\d)(?=(\d{3})+(?!\d))/g, ',');
console.log(formatted); // "123,456,789"
```

## Feature Comparison

### Lookbehind vs. Lookahead

| Feature | Lookbehind | Lookahead |
|---------|-----------|----------|
| Direction | Right-to-left | Left-to-right |
| Pattern | `(?<=pattern)` / `(?<!pattern)` | `(?=pattern)` / `(?!pattern)` |
| Availability | ES2018 | ES2015 (older) |
| Use Case | Match after context | Match before context |

## Performance Considerations

- Lookbehind assertions may have slightly different performance characteristics than lookahead, depending on engine optimization
- Complex lookbehind patterns with backtracking can be slower than equivalent alternatives
- For best performance, keep lookbehind patterns simple and specific
- Modern browsers have optimized these assertions well, so performance impact is minimal in most use cases

## Backward Compatibility & Polyfills

### Polyfill Strategies
Since lookbehind cannot be polyfilled (it requires language-level support), consider:

1. **Feature Detection**:
```javascript
function supportsLookbehind() {
  try {
    return /(?<=a)b/.test('ab');
  } catch (e) {
    return false;
  }
}
```

2. **Fallback Patterns**:
For simple cases, you may use `String.match()` with post-processing:
```javascript
// Instead of: /(?<=\$)\d+/
const regex = /\$(\d+)/;
const matches = text.match(regex);
const value = matches ? matches[1] : null;
```

3. **Build-Time Transpilation**:
Some transpilers cannot convert lookbehind to compatible syntax, so check your toolchain support

## Related Features

- **Lookahead Assertions** (`(?=)` / `(?!)`)
- **Named Capture Groups** - Often used together with lookbehind
- **Unicode Flag** - Can be combined for Unicode-aware matching
- **Flags**: `g` (global), `i` (case-insensitive), `m` (multiline), `s` (dotAll), `u` (unicode), `y` (sticky)

## Known Issues & Limitations

- **Safari Implementation**: Added relatively recently (v16.4), so may have had early implementation issues
- **Complexity**: Complex lookbehind patterns can be harder to read and maintain
- **Performance**: Variable-length lookbehind not supported; patterns must have fixed width
- **No Backreferences**: Cannot use backreferences within lookbehind assertions

## Resources & References

### Official Documentation
- [MDN: Regular Expressions - Assertions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions)
- [ECMAScript Specification](https://tc39.es/ecma262/#sec-assertion)

### Implementation Tracking
- [Firefox Bug Tracker - Implementation](https://bugzilla.mozilla.org/show_bug.cgi?id=1225665)
- [Safari/WebKit Bug Tracker - Implementation](https://bugs.webkit.org/show_bug.cgi?id=174931)

### Learning Resources
- [2ality.com - Blog post on lookbehind assertions](https://2ality.com/2017/05/regexp-lookbehind-assertions.html)

### Related Topics
- [MDN: Regular Expressions Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [MDN: RegExp Constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

## Notes

- This feature was initially expected in ES2016 but was delayed to ES2018
- The feature went through significant discussion in the TC39 committee regarding implementation complexity
- Support became widespread relatively quickly once browser vendors started implementing
- As of 2024, lookbehind has excellent coverage across all modern browsers
- Safari's addition in 2024 (v16.4) brings support to essentially 100% of modern browser usage

## Status Summary

**Status**: Finalized & Standardized
**Specification**: [ECMAScript 2018 (ES9)](https://tc39.es/ecma262/#sec-assertion)
**Global Support**: 91.89% (December 2024)
**Recommended**: Safe to use in modern applications with appropriate fallbacks for legacy support

---

*Last Updated: 2024*
*Data Source: caniuse.com*
