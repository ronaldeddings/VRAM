# CSS `unset` Value

## Overview

The CSS `unset` value is a powerful reset mechanism that allows developers to remove all declarations (both inherited and non-inherited) for a given property on an element. It serves as a unified way to reset styles without needing to know whether a property is inherited or not.

## Description

The `unset` value works intelligently by automatically selecting the appropriate reset behavior:
- **For inherited properties**: Acts like `inherit`, using the parent element's value
- **For non-inherited properties**: Acts like `initial`, using the property's default value

This eliminates the need to remember which CSS properties are inherited and which aren't, making it a versatile tool for style resets.

## Specification Status

**Status**: Recommendation (REC)
**Specification**: [W3C CSS Cascading and Inheritance Level 3](https://www.w3.org/TR/css-cascade-3/#inherit-initial)

The `unset` value is part of the official W3C CSS specification and is considered stable for use in production.

## Categories

- CSS

## Use Cases & Benefits

### Primary Benefits

- **Style Reset**: Quickly remove all custom styling from an element and revert to defaults
- **Clean Inheritance Control**: Simplified way to handle both inherited and non-inherited properties uniformly
- **CSS Reset Utilities**: Excellent for building utility classes in design systems and CSS frameworks
- **Responsive Design**: Useful for resetting styles at different breakpoints without tracking property inheritance
- **Component Isolation**: Helps create self-contained components by resetting inherited styles

### Common Use Cases

1. **Resetting Form Elements**
   ```css
   button {
     all: unset;
     /* Now manually define button styles without fighting inheritance */
   }
   ```

2. **Creating Reset Utilities**
   ```css
   .reset {
     all: unset;
   }
   ```

3. **Responsive Adjustments**
   ```css
   @media (max-width: 768px) {
     .sidebar {
       display: unset; /* Reset display property to default */
     }
   }
   ```

4. **Component Scoping**
   ```css
   .component {
     font-size: unset; /* Remove any inherited font sizing */
   }
   ```

## Browser Support

| Browser | First Version | Current Status |
|---------|---------------|----------------|
| Chrome | 41+ | ✅ Full Support |
| Edge | 13+ | ✅ Full Support |
| Firefox | 27+ | ✅ Full Support |
| Safari | 9.1+ | ✅ Full Support |
| Opera | 28+ | ✅ Full Support |
| iOS Safari | 9.3+ | ✅ Full Support |
| Android Browser | 142+ | ✅ Full Support |
| Android Chrome | 142+ | ✅ Full Support |
| Android Firefox | 144+ | ✅ Full Support |

### Legacy Browser Support

- **Internet Explorer**: ❌ Not supported (all versions)
- **Opera Mini**: ❌ Not supported
- **BlackBerry**: ❌ Not supported
- **IE Mobile**: ❌ Not supported

### Global Support Statistics

- **Supported**: 93.19% of users
- **Partial Support**: 0%
- **No Support**: 6.81% of users

## Syntax

### Basic Usage

```css
/* Reset a single property */
element {
  property: unset;
}

/* Example: Reset color property */
button {
  color: unset;
}

/* Reset all properties at once using the 'all' shorthand */
element {
  all: unset;
}
```

### Practical Examples

```css
/* Remove all custom styles from a link */
a.unstyled {
  all: unset;
  color: inherit; /* Explicitly set color if needed */
}

/* Reset a specific inherited property */
span {
  font-weight: unset; /* Will use parent's font-weight */
}

/* Reset a non-inherited property */
div {
  width: unset; /* Will use the default width (auto) */
}

/* Useful in form resets */
input[type="button"],
button {
  all: unset;
  /* Now define custom button styles */
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border-radius: 0.25rem;
}
```

## Notes & Considerations

- **Comprehensive Support**: The `unset` keyword enjoys excellent cross-browser support in modern browsers
- **Legacy Browser Strategy**: For projects requiring Internet Explorer support, consider using a polyfill or maintaining fallback styles
- **Performance**: Using `unset` can be slightly more efficient than maintaining separate values for both inherited and non-inherited properties
- **All Shorthand**: The `all` shorthand property paired with `unset` provides the most powerful reset mechanism (`all: unset`)
- **Specificity**: Values set with `unset` have no impact on specificity calculations

## Related CSS Features

- `initial` - Sets property to its default value
- `inherit` - Inherits value from parent element
- `revert` - Reverts to browser default (CSS Cascade Level 4)
- `all` - Shorthand for resetting all CSS properties

## External Resources

### Official Documentation
- [MDN Web Docs - CSS unset](https://developer.mozilla.org/en-US/docs/Web/CSS/unset) - Comprehensive reference and examples

### Articles & Guides
- [Resetting styles using `all: unset`](https://mcc.id.au/blog/2013/10/all-unset) - Deep dive into the `all` shorthand with `unset`

### Bug Reports & Tracking
- [WebKit Bug 148614](https://bugs.webkit.org/show_bug.cgi?id=148614) - Historical WebKit implementation tracking

## Browser Implementation Timeline

- **Q1 2015**: Chrome 41 introduces support
- **Q1 2015**: Edge 13 introduces support
- **Q1 2014**: Firefox 27 introduces support
- **Q4 2015**: Safari 9.1 introduces support
- **Q3 2015**: Opera 28 introduces support

---

*Last Updated: 2025*
*CanIUse Data Version: Current*
*Feature Status: Stable and Recommended for Production Use*
