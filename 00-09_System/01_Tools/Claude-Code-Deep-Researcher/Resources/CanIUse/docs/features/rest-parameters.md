# Rest Parameters

## Overview

Rest parameters allow functions to accept an indefinite number of arguments as an array. Instead of using the `arguments` object, rest parameters provide a cleaner, more modern syntax for handling variable-length argument lists.

## Description

Rest parameters allow representation of an indefinite number of arguments as an array. This ES6 feature enables developers to write more flexible and readable function definitions by capturing all remaining arguments in a single named parameter using the `...` operator.

## Specification Status

- **Status**: ES2015 (ES6) Standard
- **Specification URL**: [ECMAScript Function Definitions](https://tc39.es/ecma262/#sec-function-definitions)
- **Standards Body**: TC39 (ECMAScript Technical Committee)

## Categories

- **JavaScript (JS)**

## Benefits & Use Cases

### Code Clarity and Readability
- Rest parameters make it immediately clear that a function accepts a variable number of arguments
- Eliminates the need to reference the implicit `arguments` object
- Function signature is more self-documenting

### Modern Alternatives to `arguments`
- Replace the array-like `arguments` object with a true array
- Avoid confusion and unexpected behaviors associated with the legacy `arguments` object
- Enable use of array methods directly without conversion

### Flexible Function Design
- **Variable-length parameter lists**: Create functions that accept any number of arguments
- **Mixed parameters**: Combine named parameters with rest parameters for greater flexibility
- **Cleaner APIs**: Design functions that accept a variable number of options or values

### Practical Applications
```javascript
// Concatenating arrays
function concat(separator, ...items) {
  return items.join(separator);
}

// Function decorators
function logArguments(fn, ...args) {
  console.log('Arguments:', args);
  return fn(...args);
}

// Variadic functions
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

## Browser Support

### Summary
- **Modern Browsers**: Widely supported across all major browsers
- **Legacy Support**: Not supported in Internet Explorer
- **Overall Usage**: 93.15% global browser market coverage

### Detailed Browser Support Table

| Browser | Minimum Version | Support Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome** | 47 | ✅ Full Support | Enabled by default from v47+ |
| **Edge** | 12 | ✅ Full Support | All versions supported |
| **Firefox** | 15 | ✅ Full Support | Enabled by default from v15+ |
| **Safari** | 10 | ✅ Full Support | All versions from v10+ supported |
| **Opera** | 34 | ✅ Full Support | Enabled by default from v34+ |
| **Internet Explorer** | — | ❌ Not Supported | No version supports rest parameters |

### Mobile Browser Support

| Browser | Minimum Version | Support Status |
|---------|-----------------|----------------|
| **iOS Safari** | 10.0 | ✅ Full Support |
| **Android Browser** | 142 | ✅ Full Support |
| **Android Chrome** | 142 | ✅ Full Support |
| **Android Firefox** | 144 | ✅ Full Support |
| **Samsung Internet** | 5.0-5.4 | ✅ Full Support |
| **Opera Mobile** | 80 | ✅ Full Support |
| **UC Browser** | 15.5+ | ✅ Full Support |
| **Baidu Browser** | 13.52+ | ✅ Full Support |
| **KaiOS** | 2.5+ | ✅ Full Support |
| **Opera Mini** | All | ❌ Not Supported |
| **Blackberry** | — | ❌ Not Supported |
| **IE Mobile** | — | ❌ Not Supported |

### Notes

1. **Flag Requirements for Older Versions**:
   - Chrome 44-46 requires the "Experimental JavaScript features" flag to be enabled
   - Opera 31-33 requires the "Experimental JavaScript features" flag to be enabled

2. **Transpilation**:
   - For projects requiring support in older browsers (particularly IE), rest parameters can be transpiled using Babel or similar tools
   - The transpiled code will use the `arguments` object internally

## Usage Statistics

- **Global Market Coverage**: 93.15% of users have browsers that support rest parameters
- **No Partial Support**: All supporting browsers provide full, complete support
- **Prefix Required**: No vendor prefix needed

## Key Features

### Syntax
```javascript
function functionName(param1, param2, ...restParam) {
  // restParam is an array containing all remaining arguments
}
```

### Characteristics
- **Position**: Must be the last parameter in a function
- **Return Type**: Returns a true Array
- **Array Methods**: Supports all native array methods (`.map()`, `.filter()`, `.reduce()`, etc.)
- **No `arguments` Object**: When rest parameters are used, the `arguments` object is not automatically populated

### Comparison with `arguments`

| Feature | `arguments` | Rest Parameters |
|---------|----------|------------------|
| Type | Array-like object | True Array |
| Includes named params | Yes | No (only remaining args) |
| Array methods | Requires conversion | Directly available |
| Readability | Less clear | Self-documenting |
| Modern ES6+ | Legacy | Recommended |

## Related Features

- **Spread Operator** (`...`): Complements rest parameters for unpacking arrays
- **Default Parameters**: Often used together with rest parameters for flexible function signatures
- **Arrow Functions**: Rest parameters work the same way in arrow functions

## References & Resources

- [Rest parameters and defaults - Mozilla Hacks](https://hacks.mozilla.org/2015/05/es6-in-depth-rest-parameters-and-defaults/)
- [MDN Web Docs - Rest Parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- [ECMAScript Specification - Function Definitions](https://tc39.es/ecma262/#sec-function-definitions)

## Recommendations

### Safe to Use
Rest parameters are safe to use in modern web applications targeting current browser versions. With 93.15% global browser support, they're suitable for:
- Modern single-page applications
- Progressive web applications
- Projects with evergreen browser requirements

### Backward Compatibility
For applications requiring IE support:
- Use a transpiler like Babel to convert rest parameters to ES5-compatible code
- Consider feature detection or graceful degradation strategies
- Test thoroughly with transpiled output in target browsers

### Best Practices
1. Use rest parameters instead of the `arguments` object in modern code
2. Place rest parameters as the last parameter in function signatures
3. Combine with default parameters for flexible APIs
4. Use meaningful names for rest parameters to clarify their purpose
5. Leverage array methods directly on rest parameters without conversion

---

*Last Updated: 2025*
*Data Source: CanIUse Browser Support Database*
