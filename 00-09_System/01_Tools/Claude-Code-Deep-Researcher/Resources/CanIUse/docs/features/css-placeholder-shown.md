# :placeholder-shown CSS Pseudo-Class

## Overview

The `:placeholder-shown` pseudo-class selector matches an `input` or `textarea` element that is currently displaying placeholder text. This allows developers to style form elements based on whether the placeholder is visible, enabling more sophisticated form UX patterns.

## Description

Input elements can display placeholder text as a hint to the user on what to type. The `:placeholder-shown` CSS pseudo-class selector enables targeting these elements when the placeholder is actively shown. This is particularly useful for:

- Styling form labels that need to reposition when input receives focus or value
- Creating floating label patterns
- Conditionally hiding secondary instructions based on placeholder visibility
- Building accessible form layouts with better visual feedback

## Specification Status

- **W3C Status:** Working Draft (WD)
- **Specification URL:** [W3C Selectors Level 4 - :placeholder](https://www.w3.org/TR/selectors4/#placeholder)
- **Spec Details:** Part of the CSS Selectors Level 4 specification

## Categories

- **CSS** - CSS Selectors and Pseudo-classes

## Use Cases & Benefits

### Primary Use Cases

1. **Floating Labels Pattern**
   - Move labels out of the way when placeholder is shown
   - Animate labels when user starts typing (placeholder hidden)

2. **Dynamic Form Styling**
   - Apply different styles based on placeholder visibility
   - Create visual indicators for empty vs filled form fields

3. **Form Validation UX**
   - Show/hide helper text based on field state
   - Provide context-aware instructions

4. **Accessible Form Layouts**
   - Improve form usability with visual feedback
   - Better visual hierarchy for form elements

### Code Example

```css
/* Basic styling when placeholder is shown */
input:placeholder-shown {
  border-color: #ccc;
  color: #999;
}

/* Style when placeholder is hidden (field has content) */
input:not(:placeholder-shown) {
  border-color: #0066cc;
  color: #000;
}

/* Floating label pattern */
input:placeholder-shown ~ label {
  position: absolute;
  top: 0;
  left: 0;
}

input:not(:placeholder-shown) ~ label {
  position: relative;
  display: none;
}
```

## Browser Support

### Support Key
- **y** = Full Support
- **a** = Partial Support (see notes)
- **n** = No Support

### Desktop Browsers

| Browser | Version | Support | First Version | Status |
|---------|---------|---------|---------------|--------|
| **Chrome** | Current (146) | ✅ | 47 | Full |
| **Firefox** | Current (148) | ✅ | 51 | Full |
| **Safari** | Current (18.5) | ✅ | 9 | Full |
| **Edge** | Current (143) | ✅ | 79 | Full |
| **Opera** | Current (122) | ✅ | 34 | Full |
| **IE** | 11 | ⚠️ | Never | Partial* |

### Mobile Browsers

| Browser | Version | Support | First Version | Status |
|---------|---------|---------|---------------|--------|
| **iOS Safari** | Current (18) | ✅ | 9.0 | Full |
| **Chrome Android** | Current (142) | ✅ | Latest | Full |
| **Firefox Android** | Current (144) | ✅ | Latest | Full |
| **Samsung Internet** | Current (29) | ✅ | 5.0 | Full |
| **Opera Mobile** | Current (80) | ✅ | 80 | Full |
| **Opera Mini** | All | ❌ | Never | None |
| **Android Browser** | 4.4+ | ⚠️ | 142 | Limited |

### Platform Coverage

- **Desktop:** 97.8% of users
- **Mobile:** Excellent support across all major platforms
- **Overall Global Usage:** ~93.1% of users have support

## Browser-Specific Notes

### Firefox (Versions 4-50)
Firefox versions 4 through 50 included **partial support** using the non-standard `-moz-placeholder-shown` prefix rather than the standard `:placeholder-shown` syntax.

```css
/* Firefox 4-50 */
input:-moz-placeholder-shown {
  /* styles */
}

/* Standard (Firefox 51+) */
input:placeholder-shown {
  /* styles */
}
```

### Internet Explorer (10-11)
IE 10 and 11 provided **partial support** using the non-standard `:-ms-input-placeholder` prefix. This is a vendor-specific extension and not equivalent to `:placeholder-shown`.

```css
/* IE 10-11 (non-standard) */
input:-ms-input-placeholder {
  /* limited functionality */
}
```

### Older Browsers
- **Chrome:** Not supported before version 47 (released April 2015)
- **Safari:** Not supported before version 9 (released September 2015)
- **Opera:** Not supported before version 34 (released June 2015)

## Related Features

See also the related `::placeholder` pseudo-element for styling the placeholder text itself:
- [CSS ::placeholder](https://caniuse.com/#feat=css-placeholder)

This feature differs from `:placeholder-shown`:
- `::placeholder` - Styles the placeholder text content
- `:placeholder-shown` - Styles the form element when placeholder is visible

## Migration & Fallbacks

For projects requiring support for older browsers:

### JavaScript Fallback
```javascript
// Detect placeholder support
function supportsPlaceholderShown() {
  const input = document.createElement('input');
  return ':placeholder-shown' in input.style ||
         ':-moz-placeholder-shown' in input.style;
}

if (!supportsPlaceholderShown()) {
  // Use JavaScript to manage placeholder state
  document.querySelectorAll('input[placeholder]').forEach(input => {
    input.addEventListener('input', function() {
      if (this.value) {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });
  });
}
```

### CSS Fallback (with Class-based Approach)
```css
/* CSS approach with fallback */
input:placeholder-shown,
input.placeholder-shown {
  border-color: #ccc;
}

input:not(:placeholder-shown),
input.has-value {
  border-color: #0066cc;
}
```

## Resources & References

### Official Specifications
- [W3C Selectors Level 4 Specification](https://www.w3.org/TR/selectors4/#placeholder)

### Implementation References
- [WebKit Commit](https://trac.webkit.org/changeset/172826)
- [Firefox Bug Tracker](https://bugzilla.mozilla.org/show_bug.cgi?id=1069015)

### Related Documentation
- [MDN Web Docs: :placeholder-shown](https://developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown)
- [CSS-Tricks: Placeholder Shown](https://css-tricks.com/almanac/selectors/p/placeholder-shown/)

## Implementation Status

- **Standardization:** Working Draft (W3C Selectors Level 4)
- **Browser Support:** Excellent (93.1% of global users)
- **Vendor Prefixes:** No longer required for modern browsers
- **Backwards Compatibility:** Consider fallbacks for IE 11 and older browsers

## Summary

The `:placeholder-shown` pseudo-class is a well-supported CSS selector with excellent cross-browser compatibility for modern development. It's safe to use in production for most modern web applications, with graceful degradation available for legacy browser support. The feature enables sophisticated form UX patterns and is an essential tool for modern web development.

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse Database*
