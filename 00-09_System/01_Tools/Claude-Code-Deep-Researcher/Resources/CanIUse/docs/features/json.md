# JSON Parsing

## Overview

**Status:** Widely Supported (93.72% global usage)
**Spec:** [ECMAScript 5.1 - JSON Objects](https://www.ecma-international.org/ecma-262/5.1/#sec-15.12)
**Category:** JavaScript (JS)
**Parent Feature:** ES5

---

## Description

JSON (JavaScript Object Notation) parsing support provides native methods for converting between JavaScript objects and JSON strings. This includes:

- **JSON.stringify()** - Converts JavaScript objects to JSON strings
- **JSON.parse()** - Converts JSON strings back to JavaScript objects

These methods are essential for data serialization, API communication, and data storage in modern web applications.

---

## Current Spec Status

**Status Type:** Other (Established Standard)

JSON was formally standardized as part of ECMAScript 5.1 and is now a fundamental part of JavaScript. The specification defines the JSON format and the native `JSON` object with its associated methods.

---

## Categories

- **JavaScript (JS)**

---

## Benefits & Use Cases

### Data Exchange
- Serialize JavaScript objects for transmission to APIs and servers
- Parse responses from REST APIs and external services
- Communication between frontend and backend systems

### Data Persistence
- Store application state in localStorage or databases
- Serialize complex data structures for caching
- Export data in human-readable format

### Configuration Management
- Store and load application configuration files
- Handle configuration data passed from servers
- Manage settings in structured format

### Interoperability
- Exchange data with non-JavaScript systems
- Standard format for web APIs and webhooks
- Cross-platform data sharing

### Development Workflow
- Debugging and logging complex objects
- Creating fixtures and test data
- Dynamic feature configuration

---

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | v4 (2009) | v146+ ✓ | Fully supported across all versions |
| **Firefox** | v3.5 (2009) | v148+ ✓ | Fully supported across all versions |
| **Safari** | v4 (2009) | v18.5+ ✓ | Fully supported across all versions |
| **Edge** | v12 (2015) | v143+ ✓ | Fully supported across all versions |
| **Opera** | v10.5 (2010) | v122+ ✓ | Fully supported across all versions |
| **Internet Explorer** | v8+ (2009) | v11 ✓ | Supported with note #1 |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | v4.0+ | Fully supported across all versions |
| **Android Browser** | v2.1+ | Fully supported across all versions |
| **Chrome Android** | v142+ | Fully supported |
| **Firefox Android** | v144+ | Fully supported |
| **Samsung Internet** | v4+ | Fully supported across all versions |
| **Opera Mobile** | v10+ | Fully supported across all versions |
| **IE Mobile** | v10+ | Supported on mobile versions |
| **Opera Mini** | All versions | Fully supported |

### Alternative/Legacy Browsers

| Browser | Status |
|---------|--------|
| BlackBerry | v7, v10 - ✓ |
| UC Browser | v15.5+ - ✓ |
| QQ Browser | v14.9+ - ✓ |
| Baidu Browser | v13.52+ - ✓ |
| KaiOS | v2.5+ - ✓ |

---

## Support Timeline

### Historical Support

- **Pre-2008:** No native support, required third-party libraries
- **2009:** Chrome 4, Firefox 3.5, Safari 4, IE 8 introduce JSON support
- **2010:** Opera 10.5, most mobile browsers begin supporting JSON
- **2015+:** Universal support across all modern browsers

### Key Milestones

| Year | Event |
|------|-------|
| 2005 | JSON specification released by Douglas Crockford |
| 2006 | JSON format gains adoption for web APIs |
| 2009 | JSON added to ECMAScript 5 standard |
| 2009 | Major browsers (Chrome, Firefox, Safari, IE8) implement JSON |
| 2010+ | Mobile browsers and alternative browsers adopt JSON |
| 2015+ | Universal support across all actively maintained browsers |

---

## Implementation Examples

### Basic Usage

```javascript
// Convert object to JSON string
const user = {
  name: "John Doe",
  email: "john@example.com",
  age: 30
};

const jsonString = JSON.stringify(user);
console.log(jsonString);
// Output: {"name":"John Doe","email":"john@example.com","age":30}

// Parse JSON string back to object
const parsedUser = JSON.parse(jsonString);
console.log(parsedUser.name); // Output: John Doe
```

### Advanced Usage with Replacer & Reviver

```javascript
// Stringify with replacer function (filter properties)
const filtered = JSON.stringify(user, (key, value) => {
  if (key === 'email') return undefined; // exclude email
  return value;
});

// Parse with reviver function (transform values)
const jsonWithDate = '{"date":"2025-12-13T10:30:00Z","value":42}';
const revived = JSON.parse(jsonWithDate, (key, value) => {
  if (key === 'date') return new Date(value);
  return value;
});
```

### Handling Serialization

```javascript
// Stringify with indentation (pretty print)
const pretty = JSON.stringify(user, null, 2);

// Handle circular references with replacer
const map = new WeakMap();
const circularObj = { a: 1 };
circularObj.self = circularObj;

try {
  JSON.stringify(circularObj); // Throws error
} catch (e) {
  console.log('Circular reference detected');
}

// Solution: use replacer to skip circular references
const safe = JSON.stringify(circularObj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (map.has(value)) return undefined;
    map.set(value, true);
  }
  return value;
});
```

---

## Known Issues & Limitations

### Issue #1: IE8 Standards Mode Requirement

**Affects:** Internet Explorer 8
**Description:** Requires document to be in IE8+ standards mode to work
**Solution:** Ensure proper HTML5 doctype and `<!DOCTYPE html>` declaration

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <!-- IE8 will use JSON in standards mode -->
</body>
</html>
```

### Issue #2: Reviver Recursion Bug

**Affects:** IE9-IE11 (some Windows versions)
**Description:** IE9-IE11 may fail to call the "reviver" argument recursively in certain scenarios
**Workaround:**
- Test thoroughly on targeted IE versions
- Consider polyfills for affected scenarios
- See [GitHub Issue #1653](https://github.com/Fyrd/caniuse/issues/1653) for discussion

### Limitations to Be Aware Of

1. **Functions are not serialized** - Functions become `undefined` in JSON
2. **Undefined values are skipped** - `undefined` is not valid JSON
3. **Symbols are not serialized** - Symbols are excluded from JSON
4. **Circular references cause errors** - Cannot stringify objects with circular references
5. **Date objects become strings** - Dates are converted to ISO string format

```javascript
// Example of limitations
const obj = {
  name: "test",
  method: () => {},      // Will be excluded
  date: new Date(),      // Becomes ISO string
  undef: undefined,      // Will be excluded
  symbol: Symbol("s")    // Will be excluded
};

const str = JSON.stringify(obj);
// Result: {"name":"test","date":"2025-12-13T..."}
```

---

## Polyfills & Fallbacks

For legacy browsers that don't support JSON natively, consider these options:

### Modern Approach (Rarely Needed)

Most production applications no longer need JSON polyfills due to widespread browser support. However, if targeting very old browsers:

1. **json2.js** - Historical polyfill by Douglas Crockford
2. **json3.js** - Comprehensive JSON polyfill for legacy environments
3. **Feature Detection:**

```javascript
if (typeof JSON === 'undefined') {
  // Load polyfill
  console.log('JSON polyfill required');
}
```

### Best Practice

Instead of polyfills, verify your target browser baseline:

```javascript
// Modern baseline check
const supportsJSON = () => {
  try {
    JSON.stringify({});
    JSON.parse('{}');
    return true;
  } catch (e) {
    return false;
  }
};

console.assert(supportsJSON(), 'JSON support required');
```

---

## Performance Considerations

### Serialization Performance

```javascript
// Large object serialization can be expensive
const largeArray = Array(100000).fill({id: 1, value: 'test'});

console.time('stringify');
const serialized = JSON.stringify(largeArray);
console.timeEnd('stringify');
// Typical: 50-200ms for large objects
```

### Optimization Techniques

1. **Use replacer for large objects** - Exclude unnecessary properties
2. **Limit nesting depth** - Deeply nested structures are slower to serialize
3. **Pre-process data** - Clean data before serialization
4. **Cache serialized results** - Store results if serializing same objects repeatedly

---

## Security Considerations

### Risks with JSON.parse()

Always validate and sanitize JSON from untrusted sources:

```javascript
// UNSAFE - Never do this with untrusted data
const userInput = '{"fn":()=>alert("xss")}';
eval('(' + userInput + ')'); // DANGEROUS!

// SAFE - Use JSON.parse() instead
try {
  const parsed = JSON.parse(userInput);
} catch (e) {
  console.error('Invalid JSON:', e);
}
```

### Best Practices

1. **Always validate JSON source** - Only parse from trusted sources
2. **Use JSON.parse() not eval()** - Never use eval for JSON
3. **Validate schema** - Check data structure after parsing
4. **Sanitize output** - Escape strings before displaying in HTML
5. **Handle parsing errors** - Wrap in try-catch blocks

```javascript
function safeJsonParse(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    // Validate schema
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid structure');
    }
    return parsed;
  } catch (error) {
    console.error('JSON parsing failed:', error);
    return null;
  }
}
```

---

## Relevant Resources

### Official Documentation
- [MDN Web Docs - Working with JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) - Comprehensive guide to JSON in JavaScript
- [JSON Official Site](https://www.json.org/) - JSON format specification and examples
- [WebPlatform Docs - JSON API](https://webplatform.github.io/docs/apis/json) - API documentation

### Reference Materials
- [ECMAScript 5.1 Standard - JSON Objects](https://www.ecma-international.org/ecma-262/5.1/#sec-15.12) - Official specification
- [JSON in JavaScript](https://www.json.org/json-en.html) - Includes feature detection script
- [has.js JSON Detection](https://raw.github.com/phiggins42/has.js/master/detect/json.js#json) - Feature detection library

### Related Topics
- [JSON Schema](https://json-schema.org/) - Validation schema for JSON documents
- [JSONP (JSONP)](https://en.wikipedia.org/wiki/JSONP) - Cross-domain JSON communication pattern
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Modern way to handle JSON responses

---

## Related Features

- **ES5** (Parent) - ECMAScript 5 standard
- **Fetch API** - Modern API for JSON responses
- **Web Storage** - Store JSON in localStorage/sessionStorage
- **FormData API** - Alternative data serialization format
- **XMLHttpRequest** - Legacy method for JSON communication

---

## Global Browser Support Statistics

- **Supports JSON:** 93.72%
- **Partial Support:** 0%
- **No Support:** 6.28%

The overwhelming majority of users have full JSON support across all device types and browsers.

---

## Migration Guide for Legacy Code

If you're updating code that used third-party JSON libraries:

```javascript
// OLD: Using json2.js or similar
if (!window.JSON) {
  // Load polyfill
}
const str = JSON.stringify(obj);

// NEW: Direct usage (supported everywhere)
const str = JSON.stringify(obj);

// OLD: Complex feature detection
if (JSON && JSON.parse && JSON.stringify) {
  // Safe to use
}

// NEW: Simple feature detection
if (typeof JSON !== 'undefined') {
  // Safe to use
}
```

---

## Summary

JSON parsing is a fundamental and universally supported feature in modern JavaScript. With 93.72% global browser support and native implementations across all major browsers since 2009, it is safe to use without polyfills or feature detection in contemporary web applications.

The feature provides essential functionality for data serialization, API communication, and data persistence, making it indispensable for modern web development.

**Recommendation:** Use JSON.stringify() and JSON.parse() directly without concern for modern browsers. No polyfill or fallback is necessary for applications targeting modern browser versions.
