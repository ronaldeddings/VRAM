# ES6 Number

## Overview

ES6 introduced important extensions to the `Number` built-in object, providing new constants and utility methods for working with numeric values. These additions help developers handle edge cases in numeric computation and validate numbers more reliably.

## Description

ES6 Number includes extensions to the `Number` object with the following components:

**Constants:**
- `Number.EPSILON` - The smallest interval between two representable numbers
- `Number.MIN_SAFE_INTEGER` - The smallest integer that can be safely represented (-2^53 + 1)
- `Number.MAX_SAFE_INTEGER` - The largest integer that can be safely represented (2^53 - 1)

**Methods:**
- `Number.isFinite()` - Determines whether a value is a finite number
- `Number.isInteger()` - Determines whether a value is an integer
- `Number.isSafeInteger()` - Determines whether a value is a safe integer (within ±2^53 - 1)
- `Number.isNaN()` - Determines whether a value is NaN

## Specification

- **Status:** Other (included in ECMAScript)
- **Specification URL:** [ECMA-262 Number Objects](https://tc39.es/ecma262/#sec-number-objects)
- **Parent Specification:** ES6 (ECMAScript 2015)

## Categories

- JavaScript (JS)

## Benefits and Use Cases

### Safe Integer Handling
The `MIN_SAFE_INTEGER` and `MAX_SAFE_INTEGER` constants help prevent unintended loss of precision when working with large integers. JavaScript uses 64-bit floating-point numbers (IEEE 754), which can only safely represent integers up to 2^53 - 1.

```javascript
// Safe integer range
console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER);  // -9007199254740991

// Check if integer is safe
const largeNumber = 9007199254740992;
console.log(Number.isSafeInteger(largeNumber)); // false
```

### Precise Floating-Point Comparisons
The `EPSILON` constant allows for accurate comparison of floating-point numbers, addressing the inherent precision limitations of binary floating-point arithmetic.

```javascript
// Floating-point precision issue
console.log(0.1 + 0.2 === 0.3); // false

// Solution with EPSILON
function numsEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
console.log(numsEqual(0.1 + 0.2, 0.3)); // true
```

### Robust Number Validation
The new validation methods provide a more reliable way to check numeric values compared to legacy methods.

```javascript
// Number.isNaN() vs. global isNaN()
console.log(isNaN('hello'));        // true (coerces to number)
console.log(Number.isNaN('hello')); // false (strict check)

// Number.isFinite() vs. global isFinite()
console.log(isFinite('123'));        // true (coerces to number)
console.log(Number.isFinite('123')); // false (strict check)
```

### Input Validation in APIs
These methods are particularly useful for validating API inputs and ensuring data integrity.

```javascript
function processId(id) {
  if (!Number.isInteger(id) || !Number.isSafeInteger(id)) {
    throw new Error('ID must be a safe integer');
  }
  // Process valid ID
}
```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Internet Explorer** | ❌ None | All versions (5.5 - 11) lack support |
| **Edge** | ✅ 12+ | Full support from version 12 onwards |
| **Chrome** | ✅ 34+ | Full support from version 34 onwards |
| **Firefox** | 🟨 16+ | Partial support from v16-31; Full support from v32+ |
| **Safari** | ✅ 9+ | Full support from version 9 onwards |
| **Opera** | 🟨 15-20 | Partial support; Full support from v21+ |
| **iOS Safari** | ✅ 9.0+ | Full support from version 9.0 onwards |
| **Android Browser** | 🟨 4.1-4.4.4 | Partial support; Full support from Android 142+ |
| **Opera Mini** | ❌ None | Not supported in any version |
| **Opera Mobile** | ✅ 80+ | Full support from version 80 onwards |
| **Chrome for Android** | ✅ 142+ | Full support |
| **Firefox for Android** | ✅ 144+ | Full support |
| **UC Browser** | ✅ 15.5+ | Full support |
| **Samsung Internet** | ✅ 4+ | Full support from version 4 onwards |
| **QQ Browser (Android)** | ✅ 14.9+ | Full support |
| **Baidu Browser** | ✅ 13.52+ | Full support |
| **KaiOS** | ✅ 2.5+ | Full support |
| **BlackBerry** | ❌ None | Not supported (versions 7, 10) |

### Support Summary by Major Browser

| Browser Family | Minimum Version | Full Support |
|---|---|---|
| Edge | 12 | ✅ Yes |
| Chrome | 34 | ✅ Yes |
| Firefox | 32 | ✅ Yes (Partial from 16) |
| Safari | 9 | ✅ Yes |
| Opera | 21 | ✅ Yes (Partial from 15) |

### Mobile Support

- **iOS:** Full support from iOS 9+
- **Android:** Full support from Android 142+; Partial support on Android 4.1-4.4.4
- **Other Mobile:** Strong support across most modern mobile browsers

### Global Usage

- **Support Percentage:** 93.2% of global users
- **Partial Support Percentage:** 0%
- **Effectively Universal:** Nearly all modern browsers support this feature

## Implementation Notes

### Partial Support Details

Different browser versions provide partial support with varying levels of functionality:

- **Firefox 16-24 (#1):** Only `isFinite()`, `isInteger()`, and `isNaN()` methods
- **Firefox 25-30 (#2):** Support for #1 methods plus `EPSILON` property
- **Firefox 31 (#3):** Support for all features except `isSafeInteger()` method
- **Chrome 19-33 & Opera 15-20 (#4):** Only `isFinite()` and `isNaN()` methods

Complete support includes all constants and methods.

### Polyfill Availability

A polyfill for ES6 Number features is available in the [core-js](https://github.com/zloirock/core-js#ecmascript-number) library, which can be used for legacy browser support.

### No Vendor Prefix Required

This feature does not require vendor prefixes in any browser.

## Practical Examples

### Validating User Input

```javascript
function validateUserId(id) {
  // Strict validation - must be a safe integer
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Invalid user ID');
  }
  return true;
}
```

### Safe Arithmetic Operations

```javascript
function safeAdd(a, b) {
  const result = a + b;
  if (!Number.isSafeInteger(result)) {
    console.warn('Result may lose precision');
  }
  return result;
}
```

### Floating-Point Comparison

```javascript
const EPSILON = Number.EPSILON;

function almostEqual(a, b, tolerance = EPSILON) {
  return Math.abs(a - b) <= tolerance;
}

const sum = 0.1 + 0.2;
const expected = 0.3;
console.log(almostEqual(sum, expected)); // true
```

### Type-Safe Number Validation

```javascript
function processNumericData(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('Expected a valid number');
  }

  if (!Number.isFinite(value)) {
    throw new RangeError('Expected a finite number');
  }

  return value;
}
```

## Migration from Legacy Methods

### isNaN() Comparison

```javascript
// Legacy global isNaN() - coerces arguments
console.log(isNaN('hello'));        // true
console.log(isNaN(undefined));      // true
console.log(isNaN({}));             // true

// ES6 Number.isNaN() - strict check
console.log(Number.isNaN('hello'));   // false
console.log(Number.isNaN(undefined)); // false
console.log(Number.isNaN({}));        // false
```

### isFinite() Comparison

```javascript
// Legacy global isFinite() - coerces arguments
console.log(isFinite('123'));      // true
console.log(isFinite(null));       // true
console.log(isFinite(undefined));  // false

// ES6 Number.isFinite() - strict check
console.log(Number.isFinite('123'));      // false
console.log(Number.isFinite(null));       // false
console.log(Number.isFinite(undefined));  // false
```

## Related Resources

- [2ality: New number and Math features in ES6](https://2ality.com/2015/04/numbers-math-es6.html) - Comprehensive guide to ES6 numeric improvements
- [core-js Polyfill: ECMAScript Number](https://github.com/zloirock/core-js#ecmascript-number) - Polyfill implementation for legacy environments

## Browser Compatibility Notes

### Legacy Browser Support

For Internet Explorer and older browser versions, consider using:
1. Polyfill approach with core-js
2. Feature detection before use
3. Transpilation with tools like Babel
4. Fallback implementations for critical logic

### Recommendation

Given the 93.2% global support rate and near-universal adoption in modern browsers (2015+), ES6 Number features can be safely used in most production applications. Legacy browser support should be evaluated based on your specific user base and project requirements.

---

*Last Updated: 2025 | Data source: CanIUse*
