# CSS `:not()` Selector List Argument

## Overview

The `:not()` pseudo-class in CSS Selectors Level 4 now accepts multiple selectors as arguments, allowing developers to exclude multiple conditions in a single selector instead of chaining multiple `:not()` pseudo-classes.

**Feature ID:** `css-not-sel-list`
**Category:** CSS
**Status:** Working Draft (W3C)
**Global Usage:** 92.57%

---

## Description

### What Changed?

**CSS Selectors Level 3** limited the `:not()` pseudo-class to accept only a single simple selector. Complex use cases required chaining multiple negations:

```css
/* Old way - CSS Level 3 */
:not(a):not(.button):not([role="button"])
```

**CSS Selectors Level 4** expands `:not()` to accept a **selector list** (comma-separated selectors), enabling more concise and readable selectors:

```css
/* New way - CSS Level 4 */
:not(a, .button, [role="button"])
```

Both approaches now work and achieve the same result—excluding elements that match any of the specified selectors.

### Key Improvements

| Aspect | Level 3 | Level 4 |
|--------|---------|---------|
| Arguments | Single simple selector | Multiple selectors (list) |
| Chaining required | Yes | No |
| Readability | Lower | Higher |
| Syntax flexibility | Limited | Enhanced |

---

## Specification

- **Official W3C Specification:** [Selectors Level 4 - :not()](https://www.w3.org/TR/selectors4/#negation)
- **Status:** Working Draft
- **Latest Updates:** Actively maintained by the CSS Working Group

---

## Practical Use Cases

### 1. Form Styling
Exclude multiple input types from base styling:

```css
/* Style all inputs except buttons and checkboxes */
input:not([type="button"], [type="checkbox"], [type="radio"]) {
  border: 1px solid #ccc;
  padding: 8px;
}
```

### 2. Navigation Elements
Exclude multiple element types from styles:

```css
/* Style all navigation items except dividers and buttons */
nav > *:not(hr, button, .divider) {
  display: inline-block;
  margin: 0 10px;
}
```

### 3. Interactive Components
Exclude disabled and readonly states:

```css
/* Style interactive buttons except disabled ones */
button:not(:disabled, [aria-disabled="true"], .disabled) {
  cursor: pointer;
  background: #007bff;
}
```

### 4. Content Filtering
Exclude multiple content classes:

```css
/* Style all paragraphs except special formatting classes */
p:not(.highlight, .warning, .error) {
  color: #333;
  line-height: 1.6;
}
```

### 5. Pseudo-class Combinations
Combine multiple conditions:

```css
/* Style links except visited and disabled */
a:not(:visited, :disabled, [data-disabled]) {
  color: #0066cc;
  text-decoration: underline;
}
```

---

## Browser Support

### Latest Release Versions (First Version with Full Support)

| Browser | Version | Release Date | Status |
|---------|---------|--------------|--------|
| **Chrome** | 88 | Jan 2021 | ✅ Supported |
| **Edge** | 88 | Jan 2021 | ✅ Supported |
| **Firefox** | 84 | Dec 2020 | ✅ Supported |
| **Safari** | 9 | Sep 2015 | ✅ Supported |
| **Opera** | 75 | Nov 2020 | ✅ Supported |
| **Safari iOS** | 9.0+ | Sep 2015 | ✅ Supported |

### Mobile Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| **Android Chrome** | 142+ | ✅ Supported |
| **Android Firefox** | 144+ | ✅ Supported |
| **Opera Mobile** | 80+ | ✅ Supported |
| **Samsung Internet** | 15.0+ | ✅ Supported |
| **Opera Mini** | All | ❌ Not Supported |
| **Android UC Browser** | 15.5+ | ✅ Supported |
| **Baidu Browser** | 13.52+ | ✅ Supported |

### Legacy Browser Support

- **Internet Explorer (All versions)** ❌ Not Supported
- **Edge (Legacy, < 88)** ❌ Not Supported
- **Firefox (< 84)** ❌ Not Supported
- **Chrome (< 88)** ❌ Not Supported

### Platform Breakdown

#### Desktop Browsers
- **Chrome/Chromium:** Supported from v88
- **Firefox:** Supported from v84
- **Safari:** Supported from v9 (very early adoption)
- **Opera:** Supported from v75 (based on Chromium)
- **Edge:** Supported from v88

#### Mobile Browsers
- **iOS Safari:** Supported from v9
- **Android Chrome:** Supported from v88
- **Android Firefox:** Supported from v84
- **Opera Mobile:** Supported from v80
- **Samsung Internet:** Supported from v15.0
- **Opera Mini:** Not supported

---

## Detailed Feature Comparison

### CSS Level 3 vs Level 4 Syntax

**Before (Level 3):**
```css
/* Only accepts single selector */
:not(.active) { }
:not(#main) { }

/* Multiple exclusions require chaining */
div:not(.sidebar):not(.footer):not([hidden]) {
  background: white;
}
```

**After (Level 4):**
```css
/* Multiple selectors in single :not() */
:not(.active, .inactive) { }
:not(#main, #secondary) { }

/* Same result with cleaner syntax */
div:not(.sidebar, .footer, [hidden]) {
  background: white;
}
```

### Selector Types Supported in :not()

Since Level 4, `:not()` supports:
- **Class selectors:** `.classname`
- **ID selectors:** `#id`
- **Attribute selectors:** `[attr]`, `[attr="value"]`
- **Type selectors:** `div`, `span`, `p`
- **Pseudo-classes:** `:visited`, `:disabled`, `:nth-child()`
- **Pseudo-elements:** Some restrictions apply
- **Universal selector:** `*`
- **Selector lists:** Comma-separated combinations

---

## Implementation Guide

### Basic Example
```html
<style>
  /* Select all divs except those with class "container" or data-inactive attribute */
  div:not(.container, [data-inactive]) {
    border: 1px solid #ddd;
    padding: 10px;
  }
</style>

<div>Styled - matches :not()</div>
<div class="container">Not styled - has .container</div>
<div data-inactive>Not styled - has [data-inactive]</div>
```

### Advanced Example
```css
/* Style form inputs, excluding buttons and special states */
input:not(
  [type="button"],
  [type="submit"],
  [type="reset"],
  [type="file"],
  :disabled,
  :read-only
) {
  border: 2px solid #0066cc;
  padding: 8px 12px;
  border-radius: 4px;
}

/* Improve readability with comments (CSS 2024+) */
input:not(
  [type="button"],     /* Exclude button inputs */
  :disabled,           /* Exclude disabled inputs */
  :read-only           /* Exclude read-only inputs */
) {
  border: 2px solid #0066cc;
}
```

---

## Progressive Enhancement Strategy

### Graceful Fallback for Older Browsers

```css
/* Fallback for browsers not supporting :not() selector lists */
button:not(.ghost) {
  background: #007bff;
  color: white;
}

/* Fallback for browsers not supporting :not() with multiple selectors */
button:not(.ghost):not(:disabled):not([aria-disabled]) {
  background: #007bff;
  color: white;
}

/* Modern approach - will override fallback in supporting browsers */
button:not(.ghost, :disabled, [aria-disabled]) {
  background: #007bff;
  color: white;
}
```

### Feature Detection

```javascript
// Test support for :not() selector lists
function supportsNotSelectorList() {
  try {
    document.querySelector(':not(.test, .test2)');
    return true;
  } catch (e) {
    return false;
  }
}

const hasSupport = supportsNotSelectorList();
document.documentElement.classList.toggle('supports-not-list', hasSupport);
```

---

## Compatibility Notes

### Known Limitations

1. **Older Browsers:** Internet Explorer and old Edge versions do not support this feature. Use fallback chaining patterns.

2. **Complex Selectors:** While Level 4 allows more flexibility, extremely complex selector lists may impact performance.

3. **Specificity:** The specificity of `:not()` is determined by its most specific argument, which differs from Level 3 behavior.

### Best Practices

1. **Keep It Simple:** Avoid excessively long selector lists for readability
2. **Consistent Ordering:** Group related selectors logically
3. **Consider Specificity:** Remember that specificity impacts cascade
4. **Test Across Browsers:** Verify behavior in target browsers
5. **Use Comments:** Document complex `:not()` expressions

---

## Performance Considerations

### Selector Complexity Impact

```css
/* Simple - Fast */
:not(.sidebar) { }

/* Moderate - Good Performance */
div:not(.container, .wrapper, [hidden]) { }

/* Complex - May impact performance */
article:not(
  .archived,
  .draft,
  [data-status="inactive"],
  :has(> .disabled),
  .deleted
) { }
```

### Recommendations

- Use `:not()` with specific parent selectors to limit scope
- Avoid `:not()` with complex pseudo-classes like `:has()` unless necessary
- Test performance in CSS profilers for critical selectors
- Consider specificity implications in large stylesheets

---

## Related Specifications

### CSS Selectors Level 4
- [Official Specification](https://www.w3.org/TR/selectors4/)
- [Related Pseudo-classes](https://www.w3.org/TR/selectors4/#pseudo-classes)

### Related Features
- `:is()` pseudo-class - Selector matching without specificity increase
- `:where()` pseudo-class - Like `:is()` but with zero specificity
- `:has()` pseudo-class - Parent and ancestor selection (Selectors Level 4)
- Attribute selectors - Common with `:not()`

---

## External Resources

### Official Documentation
- [MDN Web Docs - CSS :not()](https://developer.mozilla.org/en-US/docs/Web/CSS/:not)
- [W3C Selectors Level 4 Specification](https://www.w3.org/TR/selectors4/#negation)

### Browser Issue Tracking
- [Chrome Feature Request (Issue #580628)](https://bugs.chromium.org/p/chromium/issues/detail?id=580628)
- [Firefox Feature Request (Bug #933562)](https://bugzilla.mozilla.org/show_bug.cgi?id=933562)

### Learning Resources
- [CSS-Tricks: `:not()` Pseudo-class](https://css-tricks.com/pseudo-class-selectors/)
- [Web.dev: CSS Selectors](https://web.dev/learn/css/selectors/)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-13 | Initial documentation |
| - | 2021 | Chrome and Edge support (v88) |
| - | 2020 | Firefox support (v84), Opera support (v75) |
| - | 2015 | Safari support (v9) |

---

## Support Status Summary

✅ **Modern browsers:** Full support from 2020 onwards
⚠️ **Mobile browsers:** Excellent coverage; Opera Mini remains unsupported
❌ **Legacy browsers:** No support in IE or pre-2020 Edge versions

**Global coverage:** 92.57% of web traffic

For production use, consider your target audience and use fallback chaining patterns where needed for broader compatibility.
