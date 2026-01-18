# BigInt

## Overview

**BigInt** is a JavaScript primitive type that enables working with arbitrary-precision integers, allowing you to safely represent and perform operations on integers larger than the maximum value that the `Number` type can safely represent (2^53 - 1).

In traditional JavaScript, the `Number` type uses IEEE 754 double-precision floating-point format, which limits safe integer operations to values up to `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991). BigInt removes this limitation.

## Specification

- **Official Specification**: [ECMAScript BigInt Objects](https://tc39.es/ecma262/#sec-bigint-objects)
- **Status**: Standardized (ES2020/ES11)

## Category

- **JavaScript** (Core Language Feature)

## Key Features

### Basic Syntax

BigInt literals are created by appending an `n` suffix to an integer literal:

```javascript
const largeNumber = 123456789012345678901234567890n;
const bigZero = 0n;
const bigNegative = -123n;
```

### Constructor

You can also use the `BigInt()` constructor function:

```javascript
const value = BigInt("123456789012345678901234567890");
const fromNumber = BigInt(42);
```

### Supported Operations

- **Arithmetic**: Addition (`+`), subtraction (`-`), multiplication (`*`), division (`/`), modulo (`%`), exponentiation (`**`)
- **Bitwise**: AND (`&`), OR (`|`), XOR (`^`), NOT (`~`), left shift (`<<`), right shift (`>>`)
- **Comparison**: All comparison operators (`<`, `>`, `<=`, `>=`, `==`, `!=`, `===`, `!==`)
- **Logical**: Cannot be used with logical operators; convert to boolean first

### Important Limitations

- Cannot mix BigInt with regular Number types in operations
- BigInt cannot have a decimal point (no `123.45n`)
- Cannot be used with JSON serialization directly
- Math object methods do not accept BigInt arguments
- Bitwise NOT (`~`) operator works differently with BigInt

## Benefits and Use Cases

### Financial and Cryptocurrency Applications
- Handle cryptocurrency amounts with full precision without rounding errors
- Perform accounting calculations that require exact integer arithmetic
- Store and manipulate large transaction IDs and balances

### Scientific Computing
- Work with very large numbers in physics, astronomy, and mathematics
- Perform calculations that don't require floating-point precision
- Handle high-precision iteration counts and data sizes

### Database Operations
- Store and work with large numeric database IDs
- Handle timestamps with nanosecond precision
- Perform large integer database queries

### Cryptography
- Implement cryptographic algorithms requiring large integer arithmetic
- Work with RSA keys and other asymmetric encryption schemes
- Perform modular arithmetic for secure communications

### Game Development
- Track very large scores, currency, or resource quantities
- Implement tile maps and coordinate systems with unlimited scale
- Handle large numeric identifiers for entities

### Data Analysis and Statistics
- Count occurrences in massive datasets without precision loss
- Perform cumulative calculations on large numbers
- Track metrics that exceed Number limits

## Browser Support

The following table shows which browser versions first supported BigInt:

| Browser | First Version | Status |
|---------|--------------|--------|
| Chrome | 67 | ✅ Full Support |
| Firefox | 68 | ✅ Full Support |
| Safari | 14 | ✅ Full Support |
| Edge | 79 | ✅ Full Support |
| Opera | 54 | ✅ Full Support |
| iOS Safari | 14.0 | ✅ Full Support |
| Android Chrome | 67+ | ✅ Full Support |
| Samsung Internet | 9.2 | ✅ Full Support |
| Opera Mobile | 80 | ✅ Full Support |
| Internet Explorer | — | ❌ Not Supported |
| Opera Mini | — | ❌ Not Supported |

### Desktop Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 67+ | ✅ Yes |
| Firefox | 68+ | ✅ Yes |
| Safari | 14+ | ✅ Yes |
| Edge | 79+ | ✅ Yes |
| Opera | 54+ | ✅ Yes |

### Mobile Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| iOS Safari | 14+ | ✅ Yes |
| Android Browser | 67+ | ✅ Yes |
| Samsung Internet | 9.2+ | ✅ Yes |
| Opera Mobile | 80+ | ✅ Yes |

### Legacy Browser Support

BigInt is **not supported** in:
- Internet Explorer (all versions)
- Opera Mini (all versions)
- BlackBerry Browser
- UC Browser (versions < 15.5)

### Support Summary

- **Global Coverage**: ~92.6% of users have full BigInt support
- **Partial Support**: Firefox 65-67 has experimental support (feature flag required)
- **No Support**: Legacy browsers, IE, and Opera Mini

## Known Issues and Firefox Special Cases

### Firefox Versions 65-67

BigInt support in Firefox 65-67 is experimental and disabled by default. Users can enable it by:

1. Opening `about:config` in the address bar
2. Searching for `javascript.options.bigint`
3. Setting the value to `"True"`

Firefox 68 and later have full native support without requiring configuration.

## Practical Examples

### Basic Arithmetic

```javascript
// Safe large number arithmetic
const bigNumber1 = 9007199254740991n; // MAX_SAFE_INTEGER
const bigNumber2 = 9007199254740992n; // Beyond MAX_SAFE_INTEGER

const sum = bigNumber1 + bigNumber2;
console.log(sum); // 18014398509481983n

// Division truncates toward zero
console.log(7n / 2n); // 3n
console.log(-7n / 2n); // -3n
```

### Working with Large Numbers

```javascript
// Cryptocurrency precision (Satoshis to Bitcoin)
const satoshis = 100000000n; // 1 Bitcoin in Satoshis
const bitcoins = satoshis / 100000000n;
console.log(bitcoins); // 1n

// Large transaction ID
const transactionId = 18446744073709551615n; // 2^64 - 1
```

### Type Checking

```javascript
typeof 42n; // "bigint"
typeof 42; // "number"

// Converting between types
const bigInt = BigInt(100);
const regularNumber = Number(100n);

// Checking if a value is BigInt
if (typeof value === "bigint") {
  // Process as BigInt
}
```

### Avoiding Mixed Type Operations

```javascript
// This throws a TypeError
// const result = 10n + 5; // TypeError: Cannot mix BigInt and other types

// Solution: Convert first
const result = 10n + BigInt(5);
console.log(result); // 15n
```

### JSON Serialization Workaround

```javascript
// BigInt values cannot be directly stringified
// const json = JSON.stringify({ value: 123n }); // TypeError

// Workaround 1: Convert to string
const json1 = JSON.stringify({ value: "123" });

// Workaround 2: Use replacer function
const json2 = JSON.stringify({ value: 123n }, (key, value) =>
  typeof value === "bigint" ? value.toString() : value
);

// Workaround 3: Use reviver function to parse back
const parsed = JSON.parse(json2, (key, value) =>
  typeof value === "string" && /^\d+$/.test(value) ? BigInt(value) : value
);
```

### Bitwise Operations

```javascript
// Bitwise AND
console.log(5n & 3n); // 1n (binary: 101 & 011 = 001)

// Bitwise OR
console.log(5n | 3n); // 7n (binary: 101 | 011 = 111)

// Left shift
console.log(1n << 3n); // 8n (multiply by 2^3)

// Right shift
console.log(8n >> 2n); // 2n (divide by 2^2)
```

## Migration from Number

### Detecting Number Overflow

```javascript
const NUMBER_LIMIT = 9007199254740991; // Number.MAX_SAFE_INTEGER

function safeBigInt(value) {
  if (typeof value === "number") {
    if (Math.abs(value) > NUMBER_LIMIT) {
      console.warn("Value exceeds safe integer range");
    }
    return BigInt(value);
  }
  return value;
}
```

### Gradual Migration

```javascript
// Old code
const id = 9007199254740992; // Loses precision

// New code
const id = 9007199254740992n; // Preserves precision

// For external data
function parseId(idString) {
  return BigInt(idString);
}
```

## Performance Considerations

BigInt operations are generally slower than Number operations because they require handling arbitrary precision. For optimal performance:

- Use regular Numbers when precision doesn't require BigInt
- Batch BigInt operations to reduce overhead
- Avoid unnecessary type conversions
- Consider algorithmic improvements before switching to BigInt

## Resources and Further Reading

- **MDN Web Docs**: [BigInt - JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- **GitHub Proposal**: [TC39 BigInt Proposal Repository](https://github.com/tc39/proposal-bigint)
- **Google Developers**: [Introducing BigInt: Arbitrary-precision integers in JavaScript](https://developers.google.com/web/updates/2018/05/bigint)
- **2ality Blog**: [Integer Literals for Large Integers](https://2ality.com/2017/03/es-integer.html)
- **Firefox Implementation**: [Bug Tracking](https://bugzilla.mozilla.org/show_bug.cgi?id=1366287)

## Summary

BigInt is a mature, widely-supported JavaScript feature (92.6% global coverage) that solves the integer precision problem in JavaScript. It's essential for applications dealing with large numbers, cryptocurrency, financial calculations, and scientific computing. With support available in all modern browsers, BigInt can be safely used in production applications targeting current browser versions, though legacy browser support requires fallback strategies or transpilation.
