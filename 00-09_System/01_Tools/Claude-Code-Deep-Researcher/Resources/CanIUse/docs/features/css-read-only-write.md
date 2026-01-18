# CSS :read-only and :read-write Selectors

## Overview

The `:read-only` and `:read-write` pseudo-classes are CSS selectors that match HTML elements based on their mutability state. These selectors allow developers to target and style elements that are considered user-alterable or not alterable.

## Description

The `:read-only` pseudo-class matches elements that cannot be edited by the user, while the `:read-write` pseudo-class matches elements that can be edited. This includes form elements like `<input>` and `<textarea>` fields, as well as elements with the `contenteditable` attribute.

These pseudo-classes are part of the HTML and CSS specifications and provide a semantic way to apply styles based on the editability state of elements, enabling developers to create more intuitive and accessible user interfaces.

## Specification Status

**Status:** Living Standard (LS)

**Specification URL:** [HTML Living Standard - The Mutability Pseudo-classes](https://html.spec.whatwg.org/multipage/semantics-other.html#selector-read-only)

## Categories

- CSS

## Use Cases & Benefits

### 1. **Form Styling**
Apply different visual styles to read-only vs. editable form fields, helping users quickly distinguish between the two states.

```css
input:read-only {
  background-color: #f0f0f0;
  border-color: #ccc;
  cursor: not-allowed;
}

input:read-write {
  background-color: white;
  border-color: #999;
  cursor: text;
}
```

### 2. **Accessibility Enhancement**
Improve accessibility by providing clear visual indicators of whether a field can be edited, which benefits users with cognitive disabilities or those using assistive technologies.

### 3. **Dynamic Content Styling**
Style elements with `contenteditable` attributes differently based on their editability state.

### 4. **Form State Management**
Create consistent styling patterns across applications for form states without relying on custom JavaScript classes.

### 5. **Progressive Enhancement**
Use CSS selectors to handle styling concerns, leaving JavaScript free for more complex logic.

## Browser Support

The following table shows browser support for the `:read-only` and `:read-write` pseudo-classes:

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 36+ | ✅ Full | |
| **Edge** | 13+ | ✅ Full | |
| **Firefox** | 3.0+ | ✅ Full | Requires `-moz-` prefix until v78 |
| **Safari** | 9+ | ✅ Full | Partial support (4-8) |
| **Opera** | 23+ | ✅ Full | Partial support (11.5-22) |
| **iOS Safari** | 9.0+ | ✅ Full | Partial support (4.2-8.4) |
| **Chrome (Android)** | 142+ | ✅ Full | |
| **Firefox (Android)** | 144+ | ✅ Full | |
| **Samsung Internet** | 4.0+ | ✅ Full | |
| **Opera Mini** | All | ❌ No | Not supported |
| **Opera Mobile** | 80+ | ✅ Full | Partial support (11.5-12.1) |
| **IE** | All | ❌ No | Not supported |

### Legend
- **✅ Full Support**: The pseudo-classes are fully supported without prefixes
- **Partial Support (marked with #1)**: Supports selector only for `<input>` and `<textarea>` fields, but not for `contenteditable` elements
- **❌ No Support**: The feature is not supported

### Overall Support Statistics
- **Full Support (y):** 93.26% of users
- **Partial Support (a):** 0.01% of users

## Important Notes

### 1. Limitation with contenteditable
Many browsers with partial support (#1) only support the `:read-only` and `:read-write` selectors for `<input>` and `<textarea>` form elements. Support for the `contenteditable` attribute may be limited or missing in older versions of Chrome, Safari, and Opera.

### 2. Vendor Prefixes
Firefox required the `-moz-` prefix for versions up to 77. Since Firefox 78, the standard prefix-free syntax is supported.

### 3. Mobile Browser Support
Most modern mobile browsers (iOS Safari 9.0+, Chrome for Android, Samsung Internet) fully support these pseudo-classes.

### 4. Legacy Browser Support
Internet Explorer and Opera Mini do not support these selectors. For projects requiring IE support, use JavaScript fallbacks or alternative CSS approaches.

## Example Usage

### Basic Form Styling
```css
/* Style read-only input fields */
input:read-only,
textarea:read-only {
  background-color: #f5f5f5;
  color: #666;
  border-color: #ddd;
}

/* Style editable input fields */
input:read-write,
textarea:read-write {
  background-color: white;
  color: #333;
  border-color: #999;
}
```

### With contenteditable (Full Support Browsers)
```css
div:read-only {
  opacity: 0.6;
  pointer-events: none;
}

div:read-write {
  opacity: 1;
  pointer-events: auto;
}
```

### Form Field Combination
```css
/* Highlight editable fields */
input:read-write:focus {
  outline: 2px solid #4CAF50;
  background-color: #fff8dc;
}

/* Desaturate read-only fields */
input:read-only {
  filter: grayscale(50%);
}
```

## Relevant Links

- [CSS Tricks - :read-only and :read-write](https://css-tricks.com/almanac/selectors/r/read-write-read/)
- [MDN - CSS :read-only Pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/%3Aread-only)
- [MDN - CSS :read-write Pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:read-write)
- [Selectors Level 4 Specification](https://drafts.csswg.org/selectors-4/#rw-pseudos)
- [Firefox Feature Request (Bug #312971)](https://bugzilla.mozilla.org/show_bug.cgi?id=312971)

## See Also

- [`:disabled` Pseudo-class](/docs/features/css-disabled.md) - For styling disabled form elements
- [`:enabled` Pseudo-class](/docs/features/css-enabled.md) - For styling enabled form elements
- [`:checked` Pseudo-class](/docs/features/css-checked.md) - For styling checked form elements
- [CSS Pseudo-classes](/docs/css-pseudo-classes.md) - Complete reference of CSS pseudo-classes
