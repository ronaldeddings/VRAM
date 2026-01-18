# ES6 Template Literals (Template Strings)

## Overview

Template literals are string literals that allow embedded expressions using backtick characters (`` ` ``). They provide multi-line string support and string interpolation features with a clean, readable syntax. Formerly known as template strings, this feature is part of the ECMAScript 2015 (ES6) specification.

## Description

Template literals use backtick characters (`` ` ``) instead of single or double quotes for string delimiters. They support:

- **Embedded expressions**: Use `${expression}` to embed JavaScript expressions directly in strings
- **Multi-line strings**: No need for escape sequences; strings can span multiple lines naturally
- **String interpolation**: Dynamically insert variable values and computed expressions
- **Tagged template literals**: Advanced feature allowing custom processing of template strings through functions

This is a significant improvement over traditional JavaScript string concatenation and escape sequences.

## Specification Status

- **Status**: Standardized (Part of ECMAScript 2015)
- **Spec URL**: https://tc39.es/ecma262/#sec-template-literals
- **Current Usage**: 93.19% (as of last update)

## Categories

- JavaScript (JS)

## Key Benefits & Use Cases

### String Interpolation
Template literals eliminate the need for string concatenation:

```javascript
// Before (ES5)
const name = "World";
const greeting = "Hello, " + name + "!";

// After (ES6)
const name = "World";
const greeting = `Hello, ${name}!`;
```

### Multi-line Strings
No need for `\n` escape sequences:

```javascript
// Before (ES5)
const text = "Line 1\nLine 2\nLine 3";

// After (ES6)
const text = `Line 1
Line 2
Line 3`;
```

### Expression Evaluation
Evaluate expressions directly within strings:

```javascript
const a = 5;
const b = 10;
console.log(`Sum: ${a + b}`); // Output: Sum: 15
```

### Tagged Template Literals
Advanced use case for custom string processing (e.g., localization, SQL queries, HTML escaping):

```javascript
function tag(strings, ...values) {
  // Custom processing logic
}

const result = tag`Hello ${name}, you are ${age} years old`;
```

## Browser Support

### Support Key
- **y**: Full support
- **n**: No support
- **u**: Unsupported (requires flag or configuration)
- **#1**: See notes section

### Desktop Browsers

| Browser | First Support | Status |
|---------|---------------|--------|
| **Chrome** | v41 (2015) | ✅ Full Support |
| **Firefox** | v34 (2014) | ✅ Full Support |
| **Safari** | v9.1 (2016) | ✅ Full Support |
| **Edge** | v13 (2015) | ✅ Full Support |
| **Opera** | v29 (2015) | ✅ Full Support |
| **Internet Explorer** | Not Supported | ❌ No Support |

### Mobile Browsers

| Browser | First Support | Status |
|---------|---------------|--------|
| **iOS Safari** | 9.0-9.2 | ✅ Full Support |
| **Android Browser** | v4.4+ (limited, v142+) | ✅ Full Support |
| **Chrome Mobile** | v41+ | ✅ Full Support |
| **Firefox Mobile** | v34+ | ✅ Full Support |
| **Opera Mobile** | v29+ | ✅ Full Support |
| **Samsung Internet** | v4.0+ | ✅ Full Support |
| **Opera Mini** | Not Supported | ❌ No Support |

### Version Timeline

**Chrome & Edge**
- Chrome v41+: Full support
- Edge v13+: Full support

**Firefox**
- Firefox v34+: Full support

**Safari & iOS**
- Safari v9.1+: Full support
- iOS Safari v9.0+: Full support

**Internet Explorer**
- All versions (5.5 to 11): Not supported

## Important Notes

### Safari 12 Consideration
⚠️ **Note #1**: Safari 12 [sometimes garbage collects](https://bugs.webkit.org/show_bug.cgi?id=190756) the cached TemplateStrings used by Tagged Template Literals. While the feature is supported, tagged template literal caching may be affected, though this is typically transparent to most use cases.

### Legacy Browser Support
If you need to support Internet Explorer or Opera Mini, you'll need to use a transpiler like Babel to convert template literals to ES5-compatible string concatenation.

## Usage Statistics

- **Global Support**: 93.19% of users
- **Known Issues**: None reported
- **Vendor Prefix Required**: No

## Implementation Guide

### Basic Syntax

```javascript
// Simple interpolation
const name = "Alice";
const message = `Hello, ${name}!`;

// Expression evaluation
const x = 10;
const y = 20;
const result = `The sum is ${x + y}`;

// Multi-line string
const html = `
  <div>
    <p>This is a paragraph</p>
  </div>
`;
```

### Escaping Backticks

Use backslash to escape backticks:

```javascript
const message = `This is a backtick: \``;
```

### Tagged Templates

```javascript
function myTag(strings, ...values) {
  console.log(strings); // Array of string parts
  console.log(values);  // Array of expression values
  return "processed";
}

const name = "Bob";
myTag`Hello ${name}!`;
```

## Related Resources

- **[MDN Web Docs - Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)** - Comprehensive MDN documentation with examples and details
- **[ES6 Template Literals in Depth](https://ponyfoo.com/articles/es6-template-strings-in-depth)** - In-depth article covering advanced use cases and best practices

## Migration & Compatibility

### From ES5 String Concatenation

```javascript
// ES5
var greeting = "Hello, " + firstName + " " + lastName + "!";

// ES6
const greeting = `Hello, ${firstName} ${lastName}!`;
```

### Babel Transpilation

For projects requiring IE11 support or other legacy environments, use Babel:

```bash
npm install --save-dev @babel/core @babel/preset-env
```

Babel will automatically convert template literals to ES5-compatible code.

## Conclusion

Template literals are a mature, widely-supported ES6 feature with excellent browser coverage across modern browsers. They significantly improve code readability and reduce string manipulation complexity. With 93% global support and no significant bugs, they are safe to use in modern web applications. For legacy browser support, transpilation via Babel is readily available.

---

**Last Updated**: 2024
**Feature ID**: template-literals
**Parent Category**: ES6
