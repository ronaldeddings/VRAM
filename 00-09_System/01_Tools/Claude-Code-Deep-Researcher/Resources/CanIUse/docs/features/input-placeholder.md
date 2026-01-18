# Input Placeholder Attribute

## Overview

The `placeholder` attribute provides a method for displaying hint text within input fields and textareas. This text suggests the expected format or content that users should enter and automatically disappears when the user begins typing.

## Description

The placeholder attribute is used to set placeholder text for text-like input fields, providing users with a visual hint about the expected inserted information. When a user starts typing in the field, the placeholder text disappears, and reappears when the field is cleared.

## Specification Status

- **Status**: Living Standard (LS)
- **Specification**: [WHATWG HTML Living Standard - Input Placeholder](https://html.spec.whatwg.org/multipage/forms.html#attr-input-placeholder)
- **Category**: HTML5

## Use Cases & Benefits

### Common Use Cases

- **Search Boxes**: Display "Search..." as a hint to users
- **Login Forms**: Show "Username" and "Password" placeholders
- **Contact Forms**: Provide examples like "john@example.com" for email fields
- **Date Inputs**: Display date format examples (e.g., "MM/DD/YYYY")
- **Phone Numbers**: Show format hints (e.g., "(555) 123-4567")
- **Address Forms**: Suggest expected input like "123 Main Street"

### Key Benefits

- **Improved User Experience**: Provides instant visual guidance without cluttering the interface with additional labels
- **Reduced Form Complexity**: Decreases the need for separate label elements in some cases
- **Better Mobile Experience**: Allows more screen space on mobile devices by reducing visible labels
- **International Support**: Helps users understand expected input formats
- **Progressive Enhancement**: Works alongside explicit labels for accessibility

## Syntax

### Basic HTML Syntax

```html
<!-- Text Input -->
<input type="text" placeholder="Enter your name">

<!-- Email Input -->
<input type="email" placeholder="your.email@example.com">

<!-- Password Input -->
<input type="password" placeholder="Enter password">

<!-- Number Input -->
<input type="number" placeholder="Enter a number">

<!-- Textarea -->
<textarea placeholder="Enter your message here..."></textarea>

<!-- Search Input -->
<input type="search" placeholder="Search...">

<!-- URL Input -->
<input type="url" placeholder="https://example.com">

<!-- Telephone Input -->
<input type="tel" placeholder="(555) 123-4567">
```

## Browser Support

### Current Support Summary

- **Overall Support**: 93.64% global usage
- **Partial Support**: 0%
- **No Support**: Minimal (mostly legacy browsers)

### Detailed Browser Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4+ | ✓ Full | Fully supported since version 4 |
| **Firefox** | 4+ | ✓ Full | Fully supported since version 4 |
| **Safari** | 5+ | ✓ Full | Full support from version 5; partial in 3.1-4 |
| **Edge** | 12+ | ✓ Full | Fully supported since version 12 |
| **Opera** | 11.5+ | ✓ Full | Full support from version 11.5; partial in 11-11.1 |
| **Internet Explorer** | 10+ | ⚠ Limited | Partial support in IE 10-11 with known bugs |
| **iOS Safari** | 3.2+ | ✓ Full | Fully supported since version 3.2 |
| **Android Browser** | 2.1+ | ✓ Full | Fully supported; partial in 4.0-4.1 |
| **Opera Mini** | All | ✓ Full | Fully supported in all versions |
| **Samsung Internet** | 4+ | ✓ Full | Fully supported since version 4 |
| **UC Browser** | 15.5+ | ✓ Full | Supported |
| **QQ Browser** | 14.9+ | ✓ Full | Supported |
| **Baidu Browser** | 13.52+ | ✓ Full | Supported |
| **KaiOS** | 2.5+ | ✓ Full | Fully supported |

### Browser Version Ranges

#### Full Support Since
- Chrome: v4 (2009)
- Firefox: v4 (2011)
- Safari: v5 (2010)
- Edge: v12 (2015)
- Opera: v11.5 (2011)
- iOS Safari: v3.2 (2008)

#### Known Limitations
- **Internet Explorer 10-11**: Limited support with bugs (see Known Issues section)
- **Safari 3.1-4**: Partial support (missing textarea support)
- **Opera 11-11.1**: Partial support (missing textarea support)
- **Android 4.0-4.1**: Partial support

## Known Issues & Bugs

### Internet Explorer 10 & 11

#### Issue 1: Placeholder Visibility
**Problem**: Placeholder text does not display when the field is focused, even if the field is empty.

**Impact**: Users may lose the context of what should be entered after clicking on a field.

**Workaround**: Use additional labels or provide form instructions separately.

#### Issue 2: Input Event Firing
**Problem**: IE 10 and 11 fire the `input` event when an input field with a placeholder is focused or on page load when the placeholder contains certain characters (such as Chinese characters).

**Reference**: [Microsoft Connect Issue #885747](https://connect.microsoft.com/IE/feedback/details/885747/ie-11-fires-the-input-event-when-a-input-field-with-placeholder-is-focused)

**Impact**: Can cause unintended JavaScript event handlers to trigger.

**Solution**: Check for actual user input before processing input events on IE.

#### Issue 3: innerHTML Display
**Problem**: IE 10 and 11 accidentally show placeholder attributes on textareas as their actual value when using `innerHTML` or similar DOM manipulation methods.

**Reference**: [Microsoft Edge Issue #101525](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101525/)

**Impact**: Placeholder text may persist as the textarea's content.

**Workaround**: Avoid using innerHTML for textarea content manipulation; use `textContent` instead.

### Safari

#### Issue: Textarea Newlines
**Problem**: Safari does not support newlines for placeholder text in `<textarea>` elements.

**Impact**: Multi-line placeholder text will not display newlines properly in Safari.

**Workaround**: Keep placeholder text for textareas on a single line or use alternative hints.

## Styling Placeholders

### CSS Pseudo-element

You can style placeholder text using the `::placeholder` pseudo-element:

```css
/* Modern browsers */
input::placeholder {
  color: #999;
  font-style: italic;
}

textarea::placeholder {
  color: #aaa;
  opacity: 1; /* Firefox by default shows opacity < 1 */
}

/* Older Firefox syntax (deprecated) */
input:-moz-placeholder {
  color: #999;
}

input::-moz-placeholder {
  color: #999;
}

/* Older IE/Edge syntax (deprecated) */
input:-ms-input-placeholder {
  color: #999;
}
```

### Best Practices for Styling

- Ensure sufficient color contrast (WCAG AA compliance)
- Don't make placeholder text too prominent (it's supplementary, not a label)
- Maintain consistent styling across all input types
- Test across browsers for consistent appearance
- Avoid making placeholder text the only instruction

## Accessibility Considerations

### Important Guidelines

1. **Don't Replace Labels**: Placeholder text should not be used as a substitute for explicit `<label>` elements
2. **Use Both**: Combine placeholder with proper labels for best accessibility
3. **Color Contrast**: Ensure placeholder text has sufficient contrast ratio (WCAG AA: 4.5:1)
4. **Don't Hide Information**: Critical form instructions should not rely solely on placeholder text
5. **Screen Readers**: Placeholder text is not reliably announced by screen readers; use labels instead

### Accessible Form Example

```html
<label for="email">Email Address *</label>
<input
  type="email"
  id="email"
  name="email"
  placeholder="example@domain.com"
  required
  aria-describedby="email-help"
>
<small id="email-help">We'll never share your email address.</small>
```

## JavaScript Interaction

### Checking Placeholder Support

```javascript
// Feature detection
const supportsPlaceholder = 'placeholder' in document.createElement('input');

if (!supportsPlaceholder) {
  // Provide fallback for old browsers
  console.log('Placeholder not supported');
}
```

### Placeholder Polyfill

For browsers without support, use a polyfill like [jquery-placeholder](https://github.com/mathiasbynens/jquery-placeholder).

### Accessing Placeholder Value

```javascript
const input = document.querySelector('input');

// Get placeholder
const placeholderText = input.placeholder; // "Enter your name"

// Set placeholder
input.placeholder = "New placeholder text";

// Remove placeholder
input.removeAttribute('placeholder');
```

## Additional Resources

- **Article on Usage**: [Zach Leat - Placeholder Article](https://www.zachleat.com/web/placeholder/)
- **Polyfill**: [jquery-placeholder on GitHub](https://github.com/mathiasbynens/jquery-placeholder)
- **Feature Detection**: [has.js Placeholder Test](https://raw.github.com/phiggins42/has.js/master/detect/form.js#input-attr-placeholder)
- **WebPlatform Documentation**: [WebPlatform Docs - Placeholder Attribute](https://webplatform.github.io/docs/html/attributes/placeholder)
- **Android Issue Tracker**: [Issue 24626: Placeholder text for input type](https://code.google.com/p/android/issues/detail?id=24626)

## Supported Input Types

The placeholder attribute works with the following input types:

- `text` (default)
- `search`
- `url`
- `tel`
- `email`
- `password`
- `number`
- `month`
- `time`
- `week`
- `date`
- `datetime-local`

The attribute does **not** apply to:

- `button`, `checkbox`, `radio`, `submit`, `reset`, `file`, `hidden`, `image`, `range`, `color`

## Migration & Deprecation

No deprecation is planned. The placeholder attribute is part of the Living Standard and actively maintained.

## Related Features

- HTML5 `<label>` element
- `aria-label` attribute
- `aria-describedby` attribute
- CSS `::placeholder` pseudo-element
- Input validation with `:invalid` pseudo-class

## Notes

### Partial Support Note
Partial support in some older browsers refers to lacking placeholder support on `<textarea>` elements specifically, while `<input>` placeholders are fully supported.

## Summary

The placeholder attribute is a mature, widely-supported HTML5 feature with excellent browser coverage (93.64% global usage). While there are some known issues in Internet Explorer 10-11 and Safari, these are edge cases that can be managed with workarounds. For modern development targeting current browser versions, placeholder is safe to use without fallbacks or polyfills.

For best practices, always combine placeholder text with explicit labels for form accessibility and ensure that critical information is not conveyed through placeholder text alone.

---

**Last Updated**: 2024
**Data Source**: CanIUse
**Feature Status**: Stable & Widely Supported
