# Email, Telephone & URL Input Types

## Overview

The `email`, `tel`, and `url` input types are specialized HTML5 form controls designed to capture specific categories of user input. These semantic input types provide built-in validation and enhanced user experiences across modern browsers.

## Description

Text input fields intended for email addresses, telephone numbers, or URLs. These input types are particularly useful in combination with [form validation](https://caniuse.com/#feat=form-validation), as browsers provide native validation against the appropriate format for each type.

**Key Features:**
- Native format validation
- Automatic keyboard presentation on mobile devices
- Improved accessibility with semantic HTML
- Fallback to text input in unsupported browsers

## Specification

**Status:** Living Standard (LS)

**Spec Link:** [WHATWG HTML Standard - Telephone State (type=tel)](https://html.spec.whatwg.org/multipage/forms.html#telephone-state-(type=tel))

The specification also covers the email and URL input types within the same form controls section.

## Categories

- **HTML5**

## Benefits & Use Cases

### Email Input (`<input type="email">`)
- **Automatic validation** of email format
- **Mobile keyboard** displays `@` and `.com` keys by default
- **Spell-check** often disabled
- Perfect for login and registration forms
- Works seamlessly with `required` and `pattern` attributes

### Telephone Input (`<input type="tel">`)
- **Mobile keyboard** displays numeric pad with special characters
- **No automatic validation** (format varies by country/region)
- Ideal for international phone number capture
- Can be combined with JavaScript validation for specific formats
- Works with `tel:` links for click-to-call functionality

### URL Input (`<input type="url">`)
- **Automatic validation** of URL format
- **Mobile keyboard** displays URL-friendly characters (`:`, `/`, `.`)
- Built-in format checking before form submission
- Prevents common URL typos
- Enhances security by ensuring valid URLs

## Browser Support

| Browser | Support | Minimum Version | Notes |
|---------|---------|-----------------|-------|
| **Chrome** | ✅ Full | 5+ | All versions from 5 onwards |
| **Firefox** | ✅ Full | 4+ | All versions from 4 onwards |
| **Safari** | ✅ Full | 5+ | All versions from 5 onwards |
| **Edge** | ✅ Full | 12+ | All versions from 12 onwards |
| **Opera** | ✅ Full | 9.5+ | All versions from 9.5 onwards |
| **iOS Safari** | ✅ Full | 3.2+ | All versions from 3.2 onwards |
| **Android Browser** | ⚠️ Partial | 2.1+ | Versions 2.1-2.3 with limitations (note #1) |
| **Internet Explorer** | ✅ Full | 10+ | IE9 and below not supported |
| **Opera Mini** | ❌ None | N/A | No support across all versions |
| **Samsung Internet** | ✅ Full | 4+ | All versions from 4 onwards |

### Mobile Browser Support

| Platform | Support | Details |
|----------|---------|---------|
| **iOS Safari** | ✅ Full | All versions supported |
| **Android Browser** | ✅ Full | Android 3.0+ fully supported |
| **Chrome Mobile** | ✅ Full | All versions supported |
| **Firefox Mobile** | ✅ Full | All versions supported |
| **Samsung Internet** | ✅ Full | All versions supported |
| **Opera Mobile** | ✅ Full | All versions supported |
| **UC Browser** | ✅ Partial | Version 15.5+ supported |
| **BlackBerry** | ⚠️ Partial | BB7 with limitations; BB10+ fully supported |

### Global Support

- **Global Usage:** 93.6% (users with support)
- **Partial Support:** 0% (with limitations)
- **No Support:** 6.4%

## Implementation

### Basic Usage

```html
<!-- Email Input -->
<label for="email">Email Address:</label>
<input type="email" id="email" name="email" required>

<!-- Telephone Input -->
<label for="phone">Phone Number:</label>
<input type="tel" id="phone" name="phone" placeholder="(123) 456-7890">

<!-- URL Input -->
<label for="website">Website:</label>
<input type="url" id="website" name="website" placeholder="https://example.com">
```

### Advanced Attributes

```html
<!-- Email with validation -->
<input type="email" name="email" required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$">

<!-- Tel with pattern for specific format -->
<input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">

<!-- URL with additional validation -->
<input type="url" name="website" required title="Enter a valid URL (e.g., https://example.com)">
```

## Keyboard Behavior by Device

### Mobile Keyboard Presentation

| Input Type | iOS Keyboard | Android Keyboard |
|-----------|--------------|------------------|
| `type="email"` | Email keyboard with `@` and `.` | Email keyboard with `@` and `.com` |
| `type="tel"` | Numeric keypad with `+` and `*` | Numeric keypad with `+` and `*` |
| `type="url"` | URL keyboard with `:`, `/`, `.` | URL keyboard with `:`, `/`, `.` |

## Browser Fallback Behavior

Browsers without support for these input types will fall back to using the `text` type. This means:

- No automatic validation is performed
- No special keyboard is presented on mobile
- The input behaves like a standard text field
- You should implement JavaScript validation for full compatibility

**Example Fallback Strategy:**

```javascript
// Check for browser support
function supportsInputType(type) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    return input.type !== 'text';
}

// Implement fallback validation if needed
if (!supportsInputType('email')) {
    // Add JavaScript email validation
}
```

## Notes & Limitations

### General Notes
- Browsers without support for these types will fall back to using the `text` type
- Combine with CSS `:valid` and `:invalid` pseudo-classes for visual feedback
- Use `pattern` attribute for additional validation constraints
- HTML5 validation is client-side only; always validate server-side as well

### Platform-Specific Notes

1. **Android Browsers (versions 2.1-2.3):** Does not provide an email-specific or tel-specific keyboard for email addresses and phone numbers. Users receive a standard text keyboard instead, though the input type is recognized.

### Validation

These input types provide automatic browser validation:

- **Email:** Must follow valid email format
- **Tel:** No format checking (by design, due to international variations)
- **URL:** Must follow valid URL format

Use the Constraint Validation API for enhanced control:

```javascript
const emailInput = document.querySelector('input[type="email"]');

if (emailInput.validity.valid) {
    console.log('Email is valid');
} else if (emailInput.validity.typeMismatch) {
    console.log('Invalid email format');
}
```

## Related Features

- [HTML5 Form Validation](https://caniuse.com/#feat=form-validation) - Comprehensive form validation support
- [Constraint Validation API](https://caniuse.com/#feat=constraint-validation-api) - JavaScript API for form validation
- [`:valid` and `:invalid` pseudo-classes](https://caniuse.com/#feat=css-validity-pseudo-selectors) - CSS styling for validation states

## References

### External Resources
- [Article on usage](https://www.htmlgoodies.com/guides/html5-forms-how-to-use-the-new-email-url-and-telephone-input-types/#fbid=c9PEy7_9RZb) - HTMLGoodies guide to email, URL, and telephone input types

### W3C/WHATWG Documentation
- [WHATWG HTML Standard - Form Controls](https://html.spec.whatwg.org/multipage/forms.html)
- [MDN Web Docs - input type=email](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email)
- [MDN Web Docs - input type=tel](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel)
- [MDN Web Docs - input type=url](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url)

## Browser Statistics

| Category | Percentage |
|----------|-----------|
| Full Support | 93.6% |
| Partial Support | 0% |
| No Support | 6.4% |

These statistics represent global web usage across all browsers.

---

**Last Updated:** 2025

**Feature Status:** Living Standard - Actively maintained and widely supported

**Recommendation:** Safe to use in production with appropriate fallbacks for older browsers or additional JavaScript validation for enhanced UX.
