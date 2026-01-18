# Decorators

## Overview

ECMAScript Decorators are an in-progress proposal for extending JavaScript classes. Decorators use a special syntax, prefixed with an `@` symbol and placed immediately before the code being extended.

## Specification Status

- **Status**: Stage 3 Proposal (Unofficial - Not Yet Standardized)
- **Official Specification**: [TC39 Decorators Proposal](https://github.com/tc39/proposal-decorators)
- **Current Stage**: In-progress proposal for extending JavaScript class declarations

## Categories

- **JavaScript (JS)** - Core language feature

## Benefits and Use Cases

Decorators provide a declarative way to annotate and modify classes and properties. Common use cases include:

### Class Decorators
- Marking classes with metadata
- Registering classes in dependency injection containers
- Adding logging or monitoring capabilities
- Applying middleware or cross-cutting concerns

### Method Decorators
- Validating input parameters
- Memoizing expensive computations
- Adding authentication/authorization checks
- Implementing access control
- Automatic error handling and retry logic

### Property Decorators
- Marking properties for serialization (ORM mapping)
- Validation constraints
- Change tracking and reactive programming
- Lazy loading and computed properties

### Parameter Decorators
- Type validation
- Dependency injection
- Parameter parsing and transformation

### Practical Examples

Decorators enable cleaner, more readable code:

```javascript
// Without decorators - imperative approach
class UserService {
  getAllUsers() {
    // authentication check
    // logging
    // actual logic
  }
}

// With decorators - declarative approach
class UserService {
  @Authenticate
  @Logged
  getAllUsers() {
    // just the actual logic
  }
}
```

## Browser Support

Currently, **Decorators have zero native browser support** across all major browsers. This is because the proposal is still in the standardization process.

### Desktop Browsers

| Browser | Support | Latest Checked Version |
|---------|---------|----------------------|
| **Chrome/Chromium** | ❌ Not Supported | 146 |
| **Firefox** | ❌ Not Supported | 148 |
| **Safari** | ❌ Not Supported | 18.x |
| **Edge** | ❌ Not Supported | 143 |
| **Opera** | ❌ Not Supported | 122 |
| **Internet Explorer** | ❌ Not Supported | 11 |

### Mobile Browsers

| Browser | Support | Latest Checked Version |
|---------|---------|----------------------|
| **iOS Safari** | ❌ Not Supported | 26.1 |
| **Android Chrome** | ❌ Not Supported | 142 |
| **Android Firefox** | ❌ Not Supported | 144 |
| **Samsung Internet** | ❌ Not Supported | 29 |
| **Opera Mini** | ❌ Not Supported | All versions |

## Current Implementation Status

### Native Browser Support
Zero percent (0%) of users have native browser support for decorators.

### Transpiler Support
While not yet supported natively in browsers, decorators are supported by a number of transpiler tools:

- **TypeScript** - Full support with `experimentalDecorators` flag
- **Babel** - Via `@babel/plugin-proposal-decorators`
- **SWC** - Experimental support
- **esbuild** - Decorator parsing (limited support)

### Current Implementations

**TypeScript** has been the primary way developers use decorators since TypeScript 1.5. TypeScript's decorator implementation is based on an earlier version of the TC39 proposal and has served as a proof of concept.

## Important Notes

- **TypeScript vs. JavaScript Decorators**: TypeScript's implementation predates the current TC39 proposal and differs in some aspects. When decorators are standardized, there may be breaking changes for TypeScript users.
- **Transpiler Required**: Production use requires a build step with transpilation.
- **Proposal Evolution**: The TC39 proposal has gone through multiple iterations. Different versions (legacy vs. current) have different semantics.
- **Metadata Reflection**: Some transpilers support the `reflect-metadata` library for runtime reflection of decorator metadata.

## Getting Started

### Using TypeScript

```typescript
// Enable experimentalDecorators in tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "target": "ES2020",
    "module": "commonjs"
  }
}

// Define a decorator
function Logged(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey}...`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// Use the decorator
class User {
  @Logged
  getName() {
    return "John";
  }
}
```

### Using Babel

```javascript
// .babelrc or babel.config.js
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "version": "2023-11" }]
  ]
}

// Then use decorators in your code
@Component
class MyComponent {}
```

## References and Further Reading

### Official Resources
- [TC39 Decorators Proposal](https://github.com/tc39/proposal-decorators) - Official standards proposal
- [TypeScript Decorators Documentation](https://www.typescriptlang.org/docs/handbook/decorators.html) - TypeScript's implementation guide

### Learning Resources
- [JavaScript Decorators: What They Are and When to Use Them](https://www.sitepoint.com/javascript-decorators-what-they-are/) - SitePoint article
- [A Minimal Guide to ECMAScript Decorators](https://medium.com/jspoint/a-minimal-guide-to-ecmascript-decorators-55b70338215e) - Medium tutorial

### Implementation Tools
- [Babel Plugin for Decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) - Babel transpiler support

### Issue Tracking
- [Firefox Support for Decorators](https://bugzilla.mozilla.org/show_bug.cgi?id=1781212) - Firefox bug tracker

## Timeline and Standardization

The Decorators proposal has been in active development for several years:

- **2014**: Initial proposal introduced
- **2015-2017**: Design iteration (Stage 1-2)
- **2018-2021**: Multiple proposal revisions
- **2021-Present**: Current iteration under discussion (Stage 3 approaches)

The community expects decorators to eventually become a standard JavaScript feature, but the timeline remains uncertain as the proposal continues to be refined.

## Alternatives and Workarounds

Until decorators are standardized, consider these alternatives:

### 1. Higher-Order Functions (Closures)
```javascript
const logged = (fn) => {
  return function(...args) {
    console.log(`Calling ${fn.name}...`);
    return fn.apply(this, args);
  };
};

const getName = logged(() => "John");
```

### 2. Middleware Pattern
```javascript
class UserService {
  middlewares = [authenticate, log];

  async getAllUsers() {
    let fn = () => { /* actual logic */ };
    for (const middleware of this.middlewares) {
      fn = middleware(fn);
    }
    return fn();
  }
}
```

### 3. Descriptor Pattern
```javascript
Object.defineProperty(obj, 'method', {
  value: function() { /* ... */ },
  writable: true,
  enumerable: true
});
```

## Summary

Decorators represent a powerful way to write more declarative and maintainable code by separating cross-cutting concerns from business logic. While native support is not yet available in any browser, developers can use them today through TypeScript or Babel transpilation. As the TC39 proposal moves forward, we can expect broader adoption and eventual native browser support.
