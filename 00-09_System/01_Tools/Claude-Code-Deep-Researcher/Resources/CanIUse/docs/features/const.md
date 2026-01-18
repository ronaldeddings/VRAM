# JavaScript `const` Declaration

## Overview

The `const` keyword declares a block-scoped variable that cannot be reassigned after initialization. It was introduced as part of ECMAScript 2015 (ES6) and has become a fundamental part of modern JavaScript development.

**Quick Facts:**
- Declares a constant with block level scope
- Cannot be reassigned after declaration
- Global usage: **93.1%** (as of latest tracking data)

## Specification

- **Status:** Other (Standard)
- **Specification URL:** [ECMAScript 2015 - Let and Const Declarations](https://tc39.es/ecma262/#sec-let-and-const-declarations)
- **TC39 Process:** Standardized in ECMAScript 2015 (ES6)

## Categories

- **JavaScript** (Core Language Feature)

## Use Cases & Benefits

### 1. **Preventing Accidental Reassignment**
```javascript
const API_KEY = "secret123";
// API_KEY = "newkey"; // TypeError: Assignment to constant variable
```
Using `const` prevents accidentally reassigning important values, catching bugs at runtime.

### 2. **Clear Intent & Code Readability**
```javascript
const MAX_RETRIES = 3;        // Intent: This won't change
const userName = getUserName(); // Intent: This won't be reassigned

let attempt = 0;  // Intent: This will be modified
```
Signals to other developers that a variable's value is final.

### 3. **Block Scope**
```javascript
if (condition) {
  const message = "Inside block";
}
// console.log(message); // ReferenceError - not accessible here
```
Prevents variable pollution in global or function scopes.

### 4. **Immutability for Complex Objects**
```javascript
const config = { apiUrl: "https://api.example.com" };
// Can modify properties:
config.apiUrl = "https://api.new.com"; // OK

// But cannot reassign:
// config = {}; // TypeError
```
Ensures object references don't change while properties remain mutable.

### 5. **Default Choice in Modern Development**
Best practice: Use `const` by default, `let` for reassignable variables, and avoid `var`.

## Browser Support

### Support Status Legend
- ✅ **Full Support** - `y` - Correctly implemented with block scope
- ⚠️ **Partial Support** - `a` - Recognized but with limitations
- ❌ **No Support** - `n` - Not supported
- ❓ **Unknown** - `u` - Unknown support status

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 49+ | ✅ Full | Complete support with block scoping |
| **Firefox** | 36+ | ✅ Full | Full support with correct block scoping |
| **Safari** | 11+ | ✅ Full | Complete implementation |
| **Edge** | 12+ | ✅ Full | Supported from first version |
| **Opera** | 36+ | ✅ Full | Full support in modern versions |
| **Internet Explorer** | 11 | ⚠️ Partial | Recognized but with limitations (#5) |
| **Internet Explorer** | 10 & below | ❌ None | Not supported |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Safari iOS** | 11+ | ✅ Full | Complete support |
| **Chrome Android** | 142+ | ✅ Full | Full support |
| **Firefox Android** | 144+ | ✅ Full | Full support |
| **Samsung Internet** | 5.0+ | ✅ Full | Full support |
| **IE Mobile** | 11 | ✅ Full | Supported |
| **IE Mobile** | 10 | ❌ None | Not supported |
| **Opera Mini** | All | ⚠️ Partial | Partial support with limitations |
| **Android Browser** | 4.4+ | ⚠️ Partial | Partial in older versions |

## Known Issues & Limitations

The following notes are documented for specific browser versions:

### Issue #1: Basic Recognition Without Block Scope
**Affected Browsers:** Internet Explorer 11, Opera 10.0-12.1, Opera Mobile 10-12.1, Opera Mini (all)

```javascript
// In non-compliant browsers:
if (true) {
  const x = 1;
}
console.log(x); // x may be accessible (should throw ReferenceError)
```
**Impact:** const is recognized as a keyword but doesn't have proper block scope. Variables leak to outer scope.

### Issue #2: No Block Scope Implementation
**Affected Browsers:** Firefox 2-35, Chrome 4-48, Safari 3.1-10.1, Opera 10.0-27, Opera Mobile, iOS Safari 3.2-10.3, Android Browser 2.3-4.4.3, BlackBerry, Opera Mini

```javascript
// In non-compliant versions:
for (const i = 0; i < 10; i++) {
  // const does not properly scope within loop
}
```
**Impact:** Block scope not properly implemented. Variables behave more like function-scoped `var`.

### Issue #3: Strict Mode Requirement
**Affected Browsers:** Chrome 21-40, Safari 5.1-10.1, Opera 11.6-27, Opera Mobile 12-12.1, iOS Safari 5.0-10.3, Android Browser 3-4.4.3, BlackBerry, Samsung Internet 4

```javascript
// In older versions, only recognized in strict mode:
"use strict";
const x = 1; // Works in strict mode

// Without strict mode:
const y = 2; // May not work properly
```
**Impact:** Only works when strict mode is explicitly enabled.

### Issue #4: Strict Mode Behavior Differences
**Affected Browsers:** Chrome 41-48, Opera 28-35, Samsung Internet 4

```javascript
// Supported correctly in strict mode:
"use strict";
const x = 1; // Works

// Without strict mode: works without block scope
const y = 2; // Treated more like var
```
**Impact:** Full support in strict mode, but degraded behavior in non-strict mode.

### Issue #5: For-In and For-Of Loops
**Affected Browsers:** Internet Explorer 11

```javascript
// Not supported in for-in loops:
for (const key in obj) { // May not work properly
  console.log(key);
}

// Not supported in for-of loops:
for (const item of array) { // May not work properly
  console.log(item);
}
```
**Impact:** const works in basic block scope but not in loop iterations.

## Migration & Fallback Strategies

### For Legacy IE Support
```javascript
// Instead of:
const API_KEY = "secret123";

// Use (for IE 10 and below):
var API_KEY = "secret123";

// Or use an IIFE for block-like scope:
(function() {
  var API_KEY = "secret123"; // Scoped to this function
})();
```

### Transpilation with Babel
For projects needing to support older browsers, use Babel to transpile ES6 `const` to ES5:

```bash
npm install --save-dev @babel/core @babel/preset-env
```

**.babelrc:**
```json
{
  "presets": ["@babel/preset-env"]
}
```

Babel will convert:
```javascript
const x = 1;
```

To:
```javascript
var x = 1;
```

### Feature Detection
```javascript
function supportsConstProperScoping() {
  try {
    // Test block scope
    eval("if (true) { const x = 1; } return typeof x === 'undefined'");
    return true;
  } catch (e) {
    return false;
  }
}
```

## Statistics

- **Global Support:** 93.1% (Full support)
- **Partial Support:** 0.53%
- **No Support:** Remaining percentage

## Related Resources

### Official Documentation
- [MDN Web Docs - const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
  - Comprehensive reference with examples and browser compatibility details

### Educational Resources
- [Variables and Constants in ES6](https://generatedcontent.org/post/54444832868/variables-and-const-declarations)
  - In-depth explanation of const behavior and best practices

### Best Practices
- **Use const by default** - Declare variables as const first
- **Use let for reassignable variables** - Only when you need to reassign
- **Avoid var** - Use const and let instead (block scoped, clearer intent)
- **Remember: const prevents reassignment, not mutation** - Object properties can still change

### Related Features
- [let Declaration](let.md) - Block-scoped variable that can be reassigned
- [var Declaration](var.md) - Function-scoped variable (legacy)
- [Block Scope](block-scope.md) - Lexical scoping rules
- [Strict Mode](strict-mode.md) - Opt-in to stricter JavaScript semantics

## Practical Examples

### Example 1: Configuration Constants
```javascript
const API_BASE_URL = "https://api.example.com";
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

function makeRequest(endpoint) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    // Use constants
  }
}
```

### Example 2: Object Configuration
```javascript
const config = {
  debug: true,
  port: 3000,
  database: {
    host: "localhost",
    port: 5432
  }
};

// Modify properties - allowed
config.debug = false;
config.database.host = "prod-db.example.com";

// Reassign const - not allowed
// config = {}; // TypeError!
```

### Example 3: Array Handling
```javascript
const users = ["Alice", "Bob"];

// Modify array contents - allowed
users.push("Charlie");
users[0] = "Alicia";

// Reassign array - not allowed
// users = []; // TypeError!
```

### Example 4: Function Constants
```javascript
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

const handleClick = (event) => {
  console.log("Clicked:", event.target);
};
```

## Summary

The `const` keyword is now widely supported across modern browsers and is considered best practice for JavaScript development. With 93.1% global support, it's safe to use in production for most use cases. For applications needing to support Internet Explorer, transpilation with Babel or fallback to `var` is recommended.

---

**Last Updated:** 2025-12-13
**Data Source:** CanIUse
**Feature ID:** const (JS)
