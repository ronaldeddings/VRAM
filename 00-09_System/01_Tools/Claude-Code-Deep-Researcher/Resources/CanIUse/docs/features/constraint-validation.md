# Constraint Validation API

## Overview

The **Constraint Validation API** provides developers with advanced control over HTML form validation through JavaScript. It enables programmatic checking of form validity, custom validation messages, and detailed validation state reporting across all form elements.

### Description

API for better control over form field validation. Includes support for `checkValidity()`, `setCustomValidity()`, `reportValidity()` and validation states.

---

## Specification

| Detail | Information |
|--------|-------------|
| **Status** | Living Standard |
| **Specification URL** | [WHATWG HTML Living Standard - Constraint Validation API](https://html.spec.whatwg.org/dev/form-control-infrastructure.html#the-constraint-validation-api) |
| **Category** | JS API |

---

## Core Features

The Constraint Validation API provides the following key methods and properties:

### Methods

- **`checkValidity()`** - Returns a boolean indicating whether the element meets all its constraints. Does not display validation error messages.
- **`setCustomValidity(message)`** - Sets a custom validation message for an element. Empty string clears the message.
- **`reportValidity()`** - Returns a boolean AND displays validation error messages to the user. Triggers the invalid event if validation fails.

### Validation States

The API provides access to detailed validation information through the `validity` property:

- `validity.valid` - Element passes all validation constraints
- `validity.valueMissing` - Required element is empty
- `validity.typeMismatch` - Value doesn't match expected type (email, number, etc.)
- `validity.patternMismatch` - Value doesn't match the specified pattern
- `validity.tooLong` - Value exceeds maxlength attribute
- `validity.tooShort` - Value is less than minlength attribute *(limited support)*
- `validity.rangeUnderflow` - Number value is below min
- `validity.rangeOverflow` - Number value exceeds max
- `validity.stepMismatch` - Value doesn't match step increments
- `validity.badInput` - Input cannot be converted to expected type *(limited support)*
- `validity.customError` - Custom validation message is set

### Additional Properties

- **`validationMessage`** - Returns the localized validation error message
- **`willValidate`** - Boolean indicating if element will be validated during form submission

---

## Benefits & Use Cases

### Key Benefits

1. **Enhanced User Experience** - Provide real-time, custom validation feedback before form submission
2. **Fine-Grained Control** - Override default browser validation with custom logic
3. **Accessibility** - Display validation errors in accessible ways for assistive technologies
4. **Flexible Error Messages** - Show context-specific, multilingual, or branded error messages
5. **Progressive Enhancement** - Gracefully enhance HTML5 validation with JavaScript when needed
6. **Client-Side Performance** - Validate before server submission, reducing unnecessary requests

### Common Use Cases

- **Real-Time Validation** - Validate form fields as users type with immediate feedback
- **Conditional Validation** - Enable/disable validation rules based on form state or user selections
- **Cross-Field Validation** - Validate multiple interdependent form fields together
- **Custom Error Messages** - Display branded or localized error messages matching app design
- **Complex Validation Rules** - Implement validation logic beyond HTML5 constraints (async validation, API calls, etc.)
- **Form State Management** - Check validity state to enable/disable submit button dynamically
- **Submission Prevention** - Prevent form submission when validation fails
- **Validation Feedback** - Display custom validation UI/UX (tooltips, inline messages, etc.)

---

## Browser Support

### Support Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Chrome** | 40 | ✅ Full Support |
| **Edge** | 17 | ✅ Full Support |
| **Firefox** | 51 | ✅ Full Support |
| **Safari** | 10 | ✅ Full Support |
| **Opera** | 27 | ✅ Full Support |
| **iOS Safari** | 10.0 | ✅ Full Support |
| **Android Browser** | 4.4.3 | ✅ Full Support |
| **Samsung Internet** | 4 | ✅ Full Support |
| **Opera Mini** | All versions | ❌ No Support |
| **Internet Explorer** | 10-11 | ⚠️ Partial (Notes apply) |

### Global Support Statistics

- **Full Support (y)**: 93.13% of users
- **Partial Support (a)**: 0.47% of users
- **No Support (n)**: 6.4% of users

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Version | Support Level | Notes |
|---------|---------|----------------|-------|
| **Chrome** | 4-39 | Unsupported/Unknown | - |
| | 15-39 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |
| | 40+ | ✅ Full | - |
| **Firefox** | 2-3.6 | ❌ No | - |
| | 4-28 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |
| | 29-50 | ⚠️ Partial | Missing features #1, #2 (see below) |
| | 51+ | ✅ Full | - |
| **Safari** | 3.1-4 | Unsupported/Unknown | - |
| | 5.1-9 | ⚠️ Partial | Missing features #1, #2 (see below) |
| | 10+ | ✅ Full | - |
| **Opera** | 9-11.5 | Unsupported/Unknown | - |
| | 11.6-12.1 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |
| | 15-26 | ⚠️ Partial | Missing features #1, #2 (see below) |
| | 27+ | ✅ Full | - |
| **Edge** | 12-13 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |
| | 14-16 | ⚠️ Partial | Missing features #1, #2 (see below) |
| | 17+ | ✅ Full | - |
| **IE** | 5.5-9 | ❌ No | - |
| | 10-11 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |

#### Mobile & Touch Browsers

| Browser | Version | Support Level | Notes |
|---------|---------|----------------|-------|
| **iOS Safari** | 3.2-4.2 | Unsupported/Unknown | - |
| | 5.0-6.1 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |
| | 7.0-9.3 | ⚠️ Partial | Missing features #1, #2 (see below) |
| | 10.0+ | ✅ Full | - |
| **Android Browser** | 2.1-3 | Unsupported/Unknown | - |
| | 4-4.3 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |
| | 4.4+ | ✅ Full | - |
| **Android Chrome** | 142+ | ✅ Full | - |
| **Android Firefox** | 144+ | ✅ Full | - |
| **Samsung Internet** | 4+ | ✅ Full | - |
| **Opera Mobile** | 10-11.5 | Unsupported/Unknown | - |
| | 12-12.1 | ⚠️ Partial | Missing features #1, #2, #3 (see below) |
| | 80+ | ✅ Full | - |
| **Opera Mini** | All versions | ❌ No | - |
| **BlackBerry** | 7 | Unsupported/Unknown | - |
| | 10 | ⚠️ Partial | Missing features #1, #2 (see below) |
| **UC Browser** | 15.5+ | ✅ Full | - |
| **Android UC** | 15.5+ | ✅ Full | - |
| **QQ Browser** | 14.9+ | ✅ Full | - |
| **Baidu Browser** | 13.52+ | ✅ Full | - |
| **KaiOS** | 2.5 | ⚠️ Partial | Missing features #1, #2 (see below) |
| | 3.0-3.1 | ✅ Full | - |

---

## Known Limitations & Partial Support Notes

### Missing Features in Partial Support Browsers

The following limitations apply to browsers marked with partial support (⚠️):

| Note # | Limitation | Affected Versions |
|--------|-----------|-------------------|
| **#1** | **No `reportValidity()` support** | Earlier versions of Chrome, Firefox, Safari, Opera, Edge, iOS Safari, Android, BlackBerry, Opera Mobile |
| **#2** | **No `validity.tooShort` support** | Earlier versions of Chrome, Firefox, Safari, Opera, iOS Safari, Android, Opera Mobile, KaiOS. See also [minlength input support](https://caniuse.com/#feat=input-minlength) |
| **#3** | **No `validity.badInput` support** | Earlier versions of Chrome, Firefox, Safari, Opera, Edge, Android, Opera Mobile, IE Mobile |

### Migration Path

For browser versions with partial support:

- **`reportValidity()` not available?** - Use `checkValidity()` with manual UI updates to display error messages
- **`validity.tooShort` not available?** - Implement custom length validation using `value.length` checks
- **`validity.badInput` not available?** - Validate input type conversion manually with try/catch blocks

---

## Feature Detection

### Check for Constraint Validation API Support

```javascript
// Check if element has Constraint Validation API
if ('checkValidity' in form) {
  // API is supported
}

// Check for specific methods
const supportsCheckValidity = 'checkValidity' in HTMLFormElement.prototype;
const supportsReportValidity = 'reportValidity' in HTMLFormElement.prototype;
const supportsValidity = 'validity' in HTMLInputElement.prototype;

// Check for specific validity properties
const supportsMinLength = 'tooShort' in ValidityState.prototype;
const supportsBadInput = 'badInput' in ValidityState.prototype;
```

---

## Usage Examples

### Basic Validation Check

```javascript
const form = document.getElementById('myForm');
const input = document.getElementById('email');

// Check if form is valid (doesn't show messages)
if (form.checkValidity() === true) {
  // Form is valid, proceed with submission
} else {
  // Form has errors
}
```

### Custom Validation with setCustomValidity()

```javascript
const passwordInput = document.getElementById('password');

passwordInput.addEventListener('blur', function() {
  if (this.value.length < 8) {
    this.setCustomValidity('Password must be at least 8 characters');
  } else {
    this.setCustomValidity(''); // Clear custom message
  }
});
```

### Display Validation Messages with reportValidity()

```javascript
const form = document.getElementById('myForm');

form.addEventListener('submit', function(event) {
  // Shows validation error messages to user
  if (!form.reportValidity()) {
    event.preventDefault();
    // Form is invalid, don't submit
  }
});
```

### Real-Time Validation Feedback

```javascript
const input = document.getElementById('email');
const feedback = document.getElementById('errorMessage');

input.addEventListener('input', function() {
  // Clear custom validity first
  this.setCustomValidity('');

  if (!this.checkValidity()) {
    // Manually display errors
    if (this.validity.valueMissing) {
      feedback.textContent = 'Email is required';
    } else if (this.validity.typeMismatch) {
      feedback.textContent = 'Please enter a valid email';
    } else if (this.validity.tooShort) {
      feedback.textContent = 'Email is too short';
    }
    feedback.style.display = 'block';
  } else {
    feedback.style.display = 'none';
  }
});
```

### Cross-Field Validation

```javascript
const password = document.getElementById('password');
const confirm = document.getElementById('confirmPassword');

confirm.addEventListener('blur', function() {
  if (this.value !== password.value) {
    this.setCustomValidity('Passwords do not match');
  } else {
    this.setCustomValidity('');
  }
});
```

---

## Polyfill & Fallback

For browsers without `reportValidity()` support, a ponyfill is available:

- **[reportValidity() ponyfill](https://github.com/jelmerdemaat/report-validity)** - Provides `reportValidity()` functionality for older browsers

---

## Related Resources

### Official Documentation
- **[MDN: Constraint Validation API Guide](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)** - Comprehensive guide with examples

### Related Features
- **[HTML5 Form Validation](https://html.spec.whatwg.org/dev/form-control-infrastructure.html)** - HTML attribute-based validation
- **[Input Type Support](https://caniuse.com/#feat=input-type-*)** - Specific input type support (email, number, date, etc.)
- **[minlength Attribute Support](https://caniuse.com/#feat=input-minlength)** - Related to `validity.tooShort`
- **[Form Events](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)** - invalid, submit, and other form events

### Related Specifications
- [WHATWG HTML Form Control Infrastructure](https://html.spec.whatwg.org/dev/form-control-infrastructure.html)
- [Form Submission Specification](https://html.spec.whatwg.org/dev/form-control-infrastructure.html#form-submission-algorithm)
- [ValidityState Interface](https://html.spec.whatwg.org/dev/form-control-infrastructure.html#the-validitystate-interface)

---

## Notes

No documented known bugs or issues at this time.

---

**Last Updated**: Based on Can I Use data
**Support Data Version**: Current as of browser versions listed above
