# Case-Insensitive CSS Attribute Selectors

## Overview

The case-insensitive flag in CSS attribute selectors allows you to match attribute values without regard to their case. By adding an `i` flag before the closing bracket in an attribute selector, you enable ASCII-case-insensitive matching.

### Feature Description

Including an `i` before the `]` in a CSS attribute selector causes the attribute value to be matched in an ASCII-case-insensitive manner. For example:

```css
[b="xyz" i]
```

This selector will match both `<a b="xyz">` and `<a b="XYZ">`, as well as any mixed-case variations of the attribute value.

## Specification & Status

| Property | Value |
|----------|-------|
| **Specification** | [CSS Selectors Level 4](https://www.w3.org/TR/selectors-4/#attribute-case) |
| **Status** | Working Draft (WD) |
| **Global Usage** | 93.1% |

## Categories

- **CSS** - Core CSS feature

## Use Cases & Benefits

### 1. **Language & Locale-Agnostic Matching**
Match HTML attributes that may vary in case across different user inputs or CMS systems:

```css
/* Match any language attribute regardless of case */
[lang="en-US" i]
[lang="en-us" i]
[lang="EN-us" i]
```

### 2. **File Type & MIME Type Selectors**
Select elements with case-insensitive file extensions or MIME types:

```css
/* Match image files regardless of extension case */
[src*=".png" i]
[type="image/JPEG" i]
```

### 3. **Protocol & URL Matching**
Match URLs with various case conventions:

```css
/* Match both http:// and HTTP:// */
[href^="http://" i]
[href^="https://" i]
```

### 4. **Attribute Value Normalization**
Handle HTML attributes that may have inconsistent casing in legacy markup:

```css
/* Match role attribute values case-insensitively */
[role="button" i]
[data-state="active" i]
```

### 5. **Dynamic Content & User-Generated Attributes**
Work with attributes set by JavaScript or user input where case consistency cannot be guaranteed:

```css
/* Match custom data attributes set by multiple scripts */
[data-component-type="Modal" i]
[data-status="ERROR" i]
```

## Browser Support

### Summary

| Browser | First Full Support | Current Status |
|---------|-------------------|-----------------|
| Chrome | 49 | ✅ Full Support |
| Firefox | 47 | ✅ Full Support |
| Safari | 9 | ✅ Full Support |
| Edge | 79 | ✅ Full Support |
| Opera | 36 | ✅ Full Support |
| iOS Safari | 9.0-9.2 | ✅ Full Support |
| Android Chrome | 49+ | ✅ Full Support |
| Samsung Internet | 5.0-5.4 | ✅ Full Support |

### Detailed Support Table

#### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 49+ | ✅ Yes | Full support since v49 |
| **Firefox** | 47+ | ✅ Yes | Full support since v47 |
| **Safari** | 9+ | ✅ Yes | Full support since v9 |
| **Edge** | 79+ | ✅ Yes | Full support since v79 |
| **Opera** | 36+ | ✅ Yes | Full support since v36 |
| **Internet Explorer** | All | ❌ No | No support in any version |

#### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 9.0+ | ✅ Yes | Full support since v9 |
| **Android Chrome** | 49+ | ✅ Yes | Full support since v49 |
| **Android Firefox** | 47+ | ✅ Yes | Full support since v47 |
| **Samsung Internet** | 5.0+ | ✅ Yes | Full support since v5.0 |
| **Opera Mobile** | 80+ | ✅ Yes | Full support since v80 |
| **UC Browser** | 15.5+ | ✅ Yes | Full support since v15.5 |
| **Opera Mini** | All | ❌ No | No support in any version |
| **Android Browser** | 4.4 | ❌ No | Limited support |
| **Baidu** | 13.52+ | ✅ Yes | Full support since v13.52 |
| **KaiOS** | 2.5+ | ✅ Yes | Full support since v2.5 |

### Legacy Browser Support

- **Internet Explorer (5.5-11)**: ❌ Not supported
- **Opera (9-35)**: ❌ Not supported
- **Chrome (4-48)**: ❌ Not supported
- **Firefox (2-46)**: ❌ Not supported
- **Safari (3.1-8)**: ❌ Not supported

## Code Examples

### Basic Case-Insensitive Matching

```css
/* Match input type regardless of case */
input[type="text" i] {
  border: 1px solid blue;
}

/* Matches: <input type="text">
             <input type="TEXT">
             <input type="Text"> */
```

### Practical Example: Language Attributes

```css
/* Style elements with any case variation of language codes */
[lang="en" i],
[lang="fr" i],
[lang="es" i] {
  font-family: Arial, sans-serif;
}

/* Matches both <div lang="EN"> and <div lang="en"> */
```

### File Extension Matching

```css
/* Match image files with various extension cases */
[src$=".png" i],
[src$=".jpg" i],
[src$=".gif" i] {
  max-width: 100%;
  height: auto;
}

/* Matches: image.png, image.PNG, image.Png, etc. */
```

### Protocol Matching

```css
/* Match HTTP and HTTPS links regardless of case */
[href^="http://" i],
[href^="https://" i] {
  color: blue;
  text-decoration: underline;
}
```

### Complex Example: Form Validation

```css
/* Match form inputs with case-insensitive data attributes */
[data-validation="required" i] {
  border-color: red;
}

[data-validation="optional" i] {
  border-color: gray;
}

[data-validation="success" i] {
  border-color: green;
}

/* Works with any case variation: REQUIRED, Required, required */
```

## Syntax & Specification

### Basic Syntax

```css
[attribute="value" i]
```

### With Other Modifiers

The `i` flag can be used alongside other attribute selector patterns:

```css
/* Exact match, case-insensitive */
[type="submit" i]

/* Substring match, case-insensitive */
[class*="button" i]

/* Prefix match, case-insensitive */
[href^="https://" i]

/* Suffix match, case-insensitive */
[src$=".png" i]

/* Hyphen match, case-insensitive */
[lang|="en" i]

/* Space-separated match, case-insensitive */
[class~="active" i]
```

### Important Notes

- The `i` flag only affects the **attribute value**, not the attribute name
- It performs **ASCII-case-insensitive** matching (not full Unicode case folding)
- Attribute names are always case-sensitive
- The flag must appear immediately before the closing bracket `]`

## Known Issues & Compatibility Notes

### No Known Bugs

The current implementation has **no reported bugs** in major browsers that support this feature.

### Limitations

1. **Case-Sensitivity of Attribute Names**: The `i` flag does not affect attribute name matching. Attribute names are always case-sensitive in XML and HTML5.

   ```css
   /* These are NOT equivalent */
   [CLASS="active" i]  /* Matches nothing in HTML5 */
   [class="active" i]  /* Matches as expected */
   ```

2. **ASCII Only**: The matching is ASCII-case-insensitive, not full Unicode case-folding. This means non-ASCII characters are not affected.

3. **Performance Consideration**: While performance impact is minimal, case-insensitive matching requires additional comparison logic compared to case-sensitive matching.

## Migration & Fallback Strategies

### For Older Browsers

If you need to support older browsers without this feature:

```css
/* Primary rule with case-insensitive flag */
[data-state="active" i] {
  color: green;
}

/* Fallback: Use case-sensitive rules for known variations */
[data-state="active"],
[data-state="Active"],
[data-state="ACTIVE"] {
  color: green;
}
```

### JavaScript Polyfill Alternative

For maximum compatibility, consider using JavaScript for older browsers:

```javascript
// Select elements with case-insensitive attribute matching
function queryCaseInsensitive(selector) {
  const regex = /\[([^\]]*?["']([^"']*?)["']\s*i\]/g;
  const elements = [];

  document.querySelectorAll('[data-state]').forEach(el => {
    const value = el.getAttribute('data-state');
    if (value && value.toLowerCase() === 'active') {
      elements.push(el);
    }
  });

  return elements;
}
```

## Related CSS Features

- [CSS Attribute Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
- [CSS Selectors Level 4](https://www.w3.org/TR/selectors-4/)
- [CSS Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
- [CSS Type Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)

## References & Further Reading

### Official Documentation

- [W3C Selectors Level 4 - Attribute Case](https://www.w3.org/TR/selectors-4/#attribute-case)
- [MDN Web Docs - CSS Attribute Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors#case-insensitive)

### Testing & Examples

- [JS Bin Testcase](https://jsbin.com/zutuna/edit?html,css,output) - Interactive example
- [Can I Use - Case-insensitive CSS attribute selectors](https://caniuse.com/css-case-insensitive)

### Related Articles

- [CSS Selectors: A Visual Reference](https://www.w3schools.com/cssref/selectors_attribute.asp)
- [HTML Attribute Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
- [Web Standards & Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/Guide/Browser_compatibility)

## Conclusion

The case-insensitive CSS attribute selector (`i` flag) is a modern, well-supported feature that provides a practical solution for matching attribute values without case sensitivity concerns. With 93.1% global browser usage and support in all major modern browsers, it's a reliable tool for handling inconsistent attribute casing in HTML5 applications.

For new projects and websites targeting modern browsers (Chrome 49+, Firefox 47+, Safari 9+, Edge 79+), this feature can be used without hesitation. For legacy browser support requirements, the fallback strategies outlined above provide viable alternatives.

---

**Last Updated**: 2025-12-13
**Specification Status**: Working Draft (WD)
**Global Support**: 93.1%
