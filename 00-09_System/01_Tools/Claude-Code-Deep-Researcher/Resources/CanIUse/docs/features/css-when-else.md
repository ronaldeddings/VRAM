# CSS @when / @else Conditional Rules

## Overview

The `@when` and `@else` at-rules provide a simplified syntax for writing CSS conditional statements. This feature allows developers to write media queries, support queries, and other CSS conditions in a more readable and maintainable way, while also enabling the creation of mutually exclusive rule sets using `@else` blocks.

## Specification

- **Current Status:** Working Draft (WD)
- **W3C Specification:** [CSS Conditional Rules Module Level 5](https://www.w3.org/TR/css-conditional-5/#when-rule)

## Description

CSS `@when` / `@else` conditional rules provide a modern syntax for handling conditional CSS. Instead of nesting multiple media queries or feature detection statements, developers can chain conditions together with `@else` blocks for mutually exclusive rule sets. This simplifies complex conditional logic and makes stylesheets more readable.

### Key Features

- Simplified syntax for CSS conditions
- Support for media queries, feature queries, and other conditional logic
- Ability to write mutually exclusive rules using `@else` statements
- Improved code organization and maintainability
- Cleaner alternative to traditional conditional rule nesting

## Categories

- CSS

## Benefits and Use Cases

### 1. **Improved Readability**
   - Cleaner, more intuitive syntax compared to nested media queries
   - Easier to understand the logical flow of conditions

### 2. **Mutual Exclusivity**
   - Use `@else` blocks to define fallback styles
   - Guarantee only one condition block applies
   - Reduce CSS specificity conflicts

### 3. **Maintainability**
   - Centralized conditional logic
   - Easier to update or refactor conditions
   - Better code organization for complex stylesheets

### 4. **Future Compatibility**
   - Enables advanced conditional patterns as the specification evolves
   - Foundation for more sophisticated CSS logic

### 5. **Progressive Enhancement**
   - Define fallback styles with `@else`
   - Ensure graceful degradation across browsers

## Browser Support

As of December 2025, **no major browser has implemented support** for CSS `@when` / `@else` conditional rules. The feature remains in the Working Draft stage of the W3C specification.

### Support Table

| Browser | Support Status | Latest Version |
|---------|---|---|
| Chrome | ❌ Not Supported | v146 |
| Firefox | ❌ Not Supported | v148 |
| Safari | ❌ Not Supported | v18.6 |
| Edge | ❌ Not Supported | v143 |
| Opera | ❌ Not Supported | v122 |
| iOS Safari | ❌ Not Supported | v18.5-18.7 |
| Android Chrome | ❌ Not Supported | v142 |
| Android Firefox | ❌ Not Supported | v144 |

**Global Usage:** 0% (as of the most recent measurement)

## Usage and Syntax

While not yet supported in production browsers, the proposed syntax would look like this:

```css
@when (media-query) {
  /* Styles apply when condition is true */
  body {
    color: blue;
  }
}
@else (media-query) {
  /* Styles apply when first condition is false */
  body {
    color: red;
  }
}
@else {
  /* Fallback styles */
  body {
    color: green;
  }
}
```

Example with feature queries:

```css
@when (supports: display: grid) {
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@else {
  .layout {
    display: flex;
    flex-wrap: wrap;
  }
}
```

## Implementation Status

### Development Progress

- **Specification Stage:** Working Draft
- **Standardization Status:** Early stage, actively discussed in W3C CSS Working Group
- **Implementation Status:** No production implementations available

### Tracking Implementation

The following links track ongoing development and support efforts:

- **[Chrome Support Bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1282896)** - Track Chromium/Chrome implementation status
- **[Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1747727)** - Track Mozilla Firefox implementation status
- **[WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=234701)** - Track Apple Safari/WebKit implementation status

## Related Resources

### Documentation and Articles

- **[Extending CSS when/else chains: A first look](https://blog.logrocket.com/extending-css-when-else-chains-first-look/)** - LogRocket blog post providing an introduction to the feature and its capabilities

## Migration Notes

Currently, developers should use the existing CSS conditional mechanisms:

### Current Alternatives

1. **Media Queries** - For responsive design conditions
   ```css
   @media (max-width: 768px) {
     /* Mobile styles */
   }
   ```

2. **Feature Queries** - For feature detection
   ```css
   @supports (display: grid) {
     /* Grid-enabled styles */
   }
   ```

3. **Nesting** - For organizing related conditions (CSS Nesting support dependent)
   ```css
   @media (max-width: 768px) {
     body {
       @supports (display: grid) {
         /* Combined conditions */
       }
     }
   }
   ```

## Future Outlook

The CSS `@when` / `@else` feature is expected to:

1. Progress through the W3C standardization process
2. Receive browser implementations once the specification stabilizes
3. Become a standard tool for conditional CSS styling
4. Potentially expand to support additional condition types

Monitor the browser support links above for updates on implementation progress.

## See Also

- [CSS Conditional Rules Module Level 5 Specification](https://www.w3.org/TR/css-conditional-5/)
- [CSS Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/)
- [@supports (CSS Feature Queries)](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)
- [CSS Nesting Module](https://www.w3.org/TR/css-nesting-1/)

---

*Last Updated: December 2025*
*Browser support data and specification information current as of December 2025*
