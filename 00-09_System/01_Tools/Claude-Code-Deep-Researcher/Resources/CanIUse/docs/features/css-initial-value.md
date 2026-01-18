# CSS `initial` Value

## Overview

The CSS `initial` keyword applies a property's default value as specified in the CSS specification that defines that property. This is a fundamental CSS value that allows developers to reset any inherited or previously set CSS property to its browser default.

### Quick Summary
- **Specification**: [CSS Values and Units Module Level 3](https://www.w3.org/TR/css-values/#common-keywords)
- **Status**: Candidate Recommendation (CR)
- **Browser Support**: 93.27% of users globally
- **First Supported**: Chrome 4, Firefox 3.5, Safari 3.2

---

## Description

The `initial` CSS keyword sets a CSS property to its initial value as defined in the CSS specification. This is useful for overriding any previously applied styles, whether they are inherited from parent elements or set directly on the element itself.

Every CSS property has an initial value defined in its specification. Using `initial` provides a reliable way to reset properties to their standard defaults across all browsers that support the feature.

---

## Specification

- **W3C Specification**: [CSS Values and Units Module Level 3 - Common Keywords](https://www.w3.org/TR/css-values/#common-keywords)
- **Status**: Candidate Recommendation
- **Latest Draft**: Living Standard

---

## Categories

- CSS

---

## Benefits and Use Cases

### Resetting Inherited Properties
Reset properties that inherit from parent elements to their default values without affecting other siblings.

```css
/* Reset text color to browser default */
.special-element {
  color: initial;
}
```

### Overriding Cascading Styles
Remove previously applied styles more explicitly than using alternative approaches.

```css
.button {
  padding: 10px;
  border: 1px solid #ccc;
  background: #fff;
}

.button.reset {
  padding: initial;  /* Removes padding */
  border: initial;   /* Removes border */
  background: initial; /* Resets to default */
}
```

### Creating Consistent Reset Behaviors
Establish predictable baseline styles across your application.

```css
.form-input {
  border: initial;
  padding: initial;
  font: initial;
}
```

### Component Isolation
Ensure components don't inherit unwanted styles from parent containers.

```css
.card {
  font-size: initial;  /* Reset inherited font size */
  line-height: initial; /* Reset inherited line height */
  color: initial;      /* Reset inherited color */
}
```

### Scoped Style Management
Provide a clear, semantic way to reset styles within specific contexts.

```css
.modal-content {
  all: initial; /* Reset all properties using initial */
}
```

---

## Browser Support

### Summary by Browser

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Chrome** | 4+ | Fully Supported |
| **Edge** | 12+ | Fully Supported |
| **Firefox** | 3.5+ | Fully Supported |
| **Safari** | 3.2+ | Fully Supported |
| **Opera** | 15+ | Fully Supported |
| **iOS Safari** | 4.0+ | Fully Supported |
| **Android Browser** | 2.3+ | Fully Supported |
| **Samsung Internet** | 4+ | Fully Supported |
| **Opera Mini** | All versions | **Not Supported** |
| **IE 11** | - | **Not Supported** |

### Desktop Browsers

| Browser | First Full Support |
|---------|-------------------|
| Chrome | Version 4 |
| Firefox | Version 3.5 (with `-moz-` prefix), Version 19+ (unprefixed) |
| Safari | Version 3.2 |
| Edge | Version 12 |
| Opera | Version 15 |
| Internet Explorer | Not supported (versions 5.5-11) |

### Mobile Browsers

| Platform | First Full Support |
|----------|-------------------|
| iOS Safari | Version 4.0-4.1 |
| Android | Version 2.3+ |
| Samsung Internet | Version 4+ |
| Chrome Android | Fully supported |
| Firefox Android | Fully supported |
| Opera Mobile | Version 80+ |

### Browser Notes

- **Firefox 2-18**: Supported with `-moz-` vendor prefix; unprefixed support started in Firefox 19
- **Safari 3.1**: Partial support ("u" status) - limited functionality
- **Opera Mini**: Not supported across all versions
- **Internet Explorer**: No support in any version including IE 11
- **iOS Safari 3.2**: Partial support ("u" status)
- **Android 2.1-2.2**: Partial support ("u" status)
- **Opera Mobile (versions 10-12)**: Not supported; support added in version 80+

---

## Known Issues and Limitations

### Quotes Property
As noted in the CanIUse database, the `initial` value is **not supported** on the `quotes` property in some browsers. When resetting `quotes`, use alternative approaches or test thoroughly in your target browsers.

```css
/* This may not work reliably on quotes property */
.element {
  quotes: initial; /* See note #1 below */
}
```

### Partial Support in Older Versions
Early versions of Safari (3.1) and iOS Safari (3.2) had limited/partial support. If supporting these legacy versions is necessary, conduct thorough testing.

---

## Practical Examples

### Basic Reset

```html
<style>
  body {
    font-size: 16px;
    color: #333;
  }

  .reset-text {
    color: initial; /* Resets to black (default) */
    font-size: initial; /* Resets to 16px (browser default) */
  }
</style>

<p style="color: red; font-size: 20px;">
  <span class="reset-text">This text is reset to initial values</span>
</p>
```

### Form Input Reset

```css
input {
  border: 1px solid #ccc;
  padding: 8px;
  font-family: system-ui;
}

input.minimal {
  border: initial; /* Remove border */
  padding: initial; /* Remove padding */
  font-family: initial; /* Use browser default font */
}
```

### Component Isolation

```css
.article {
  font-size: 18px;
  color: #222;
  line-height: 1.6;
}

.article .code-snippet {
  font-size: initial; /* Reset to browser default */
  color: initial;     /* Reset to browser default */
  line-height: initial; /* Reset to browser default */
  font-family: monospace;
}
```

### Global Reset with Initial

```css
/* Reset specific element for fresh styling */
.component-container {
  all: initial; /* Reset all properties to initial */
  /* Then apply new styles */
  font-size: 14px;
  color: #666;
}
```

---

## Global Browser Coverage

### Modern Browser Support
- **97%+ support** in modern evergreen browsers
- **93.27%** global user coverage according to CanIUse

### When to Use
- Safe to use for modern web applications
- Consider fallbacks only for IE 11 or Opera Mini
- Recommended for all new projects

### When to Avoid
- Legacy support for IE 11 and older
- Opera Mini users (if your target audience includes them)

---

## Related CSS Keywords

The `initial` keyword is part of a family of CSS reset keywords:

- **`revert`**: Resets property to browser default or user agent stylesheet value (newer browsers)
- **`revert-layer`**: Resets to the next lower cascade layer (CSS Cascade Layers)
- **`inherit`**: Explicitly inherits a property from the parent element
- **`unset`**: Resets to inherited value if property is inherited, or initial if not
- **`all`**: Shorthand property that can be set to any of these values to reset all properties

---

## Related Links

- [MDN Web Docs - CSS `initial` Keyword](https://developer.mozilla.org/en-US/docs/Web/CSS/initial)
- [CSS Tricks - Getting Acquainted with `initial`](https://css-tricks.com/getting-acquainted-with-initial/)
- [W3C CSS Values and Units Module Level 3](https://www.w3.org/TR/css-values/#common-keywords)
- [MDN - CSS Cascade and Inheritance](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
- [MDN - `revert` vs `initial`](https://developer.mozilla.org/en-US/docs/Web/CSS/revert)

---

## Implementation Notes

### Vendor Prefixes

The `initial` keyword does **not** require vendor prefixes in modern browsers. Historical note: Firefox 2-18 required the `-moz-` prefix, but this is no longer necessary in any modern browser.

### Browser Compatibility Checking

For production code targeting wide browser support, use feature detection or fallback styles:

```css
/* Standard syntax (widely supported) */
.element {
  color: initial;
}

/* Fallback for older browsers */
.element {
  color: inherit; /* Fallback strategy */
}
```

### CSS `@supports` Query

```css
@supports (color: initial) {
  .element {
    color: initial;
  }
}
```

---

## References

| Source | Link |
|--------|------|
| CanIUse Database | https://caniuse.com/css-initial-value |
| W3C Specification | https://www.w3.org/TR/css-values/#common-keywords |
| MDN Web Docs | https://developer.mozilla.org/en-US/docs/Web/CSS/initial |
| CSS Tricks | https://css-tricks.com/getting-acquainted-with-initial/ |

---

**Last Updated**: 2025-12-13
**Documentation Version**: 1.0
**Global Browser Support**: 93.27% of users
