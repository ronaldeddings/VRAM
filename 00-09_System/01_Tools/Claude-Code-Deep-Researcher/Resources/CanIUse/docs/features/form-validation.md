# Form Validation

Client-side form validation in HTML5 enables developers to set required fields and field types without requiring JavaScript. This includes preventing forms from being submitted when appropriate, the `checkValidity()` method as well as support for the `:invalid`, `:valid`, and `:required` CSS pseudo-classes.

## Overview

Form validation is a fundamental HTML5 feature that allows developers to validate user input directly in the browser before submission. This reduces the need for JavaScript-based validation and provides immediate user feedback through native browser UI elements.

## Description

Form validation encompasses several key capabilities:

- **Constraint Validation**: Set required fields and define input types (email, number, url, etc.) without JavaScript
- **Form Submission Prevention**: Browsers automatically prevent form submission when validation fails
- **Validation API**: The `checkValidity()` method allows programmatic validation checks
- **CSS Pseudo-classes**: Style invalid, valid, and required fields using `:invalid`, `:valid`, and `:required` CSS selectors
- **Native Error Messages**: Browsers display user-friendly error messages for validation failures

## Specification Status

- **Status**: Living Standard (ls)
- **Specification URL**: [HTML Living Standard - Client-side Form Validation](https://html.spec.whatwg.org/multipage/forms.html#client-side-form-validation)

## Categories

- HTML5

## Benefits & Use Cases

### Primary Benefits

1. **Reduced JavaScript Dependencies**: Eliminates the need for custom validation libraries in many cases
2. **Better User Experience**: Immediate feedback with native error messages and styling
3. **Accessibility**: Browser-native validation is inherently accessible with proper ARIA support
4. **Performance**: Client-side validation provides instant feedback without server round trips
5. **Consistency**: Native implementation ensures consistent behavior across supported browsers
6. **Mobile-Friendly**: Native UI elements adapt to mobile keyboards and input methods

### Common Use Cases

- Email address validation
- Required field enforcement
- Number range validation
- Password confirmation
- URL validation
- Pattern matching (phone numbers, postal codes)
- Custom validation rules with `checkValidity()`

## Browser Support

| Browser | Versions | Status |
|---------|----------|--------|
| Chrome | 10+ | Full Support |
| Firefox | 4+ | Full Support |
| Safari | 10.1+ | Full Support |
| Safari (5-10) | 5-10 | Partial Support (#1) |
| Edge | 12+ | Full Support |
| Opera | 10.0+ | Full Support |
| Opera Mini | All | Partial Support (#3) |
| iOS Safari | 10.3+ | Full Support |
| iOS Safari (4-10.2) | 4-10.2 | Partial Support (#1) |
| Android | 4.4.3+ | Full Support |
| Android (4-4.4.2) | 4-4.4.2 | Partial Support (#1) |
| IE Mobile | 10-11 | Partial Support (#2) |
| Samsung Internet | 4+ | Full Support |
| Opera Mobile | 10+ | Full Support |
| UC Browser | 15.5+ | Full Support |
| BlackBerry | 10+ | Full Support |
| Baidu Browser | 13.52+ | Full Support |
| QQ Browser | 14.9+ | Full Support |
| KaiOS | 3.0-3.1+ | Full Support |

### Global Usage Statistics

- **Full Support**: 93.25% of users
- **Partial Support**: 0.39% of users

## Known Issues & Limitations

### Issue #1: Incomplete Validation Feedback (Safari 5-10, iOS Safari 4-10.2, Android 4-4.4.2, Opera Mini, BlackBerry 7, KaiOS 2.5)

**Description**: Partial support refers to lack of notice when a form with required fields is attempted to be submitted. The browser may not display validation error messages to users.

**Impact**: Users may not receive clear feedback about validation failures.

**Workaround**: Implement custom JavaScript validation for these browsers or use feature detection.

---

### Issue #2: IE Mobile 10-11 Validation Warning Gap

**Description**: Partial support in IE10 Mobile refers to lack of warning when blocking submission. The browser may not clearly indicate why form submission failed.

**Impact**: Mobile users on older IE may not understand why their form didn't submit.

**Workaround**: Provide fallback JavaScript validation with custom error messages.

---

### Issue #3: Number Field Step Attribute (IE10, IE11)

**Description**: IE10 and 11 have a problem validating number fields in combination with the `step` attribute and certain values.

**Affected Versions**: Internet Explorer 10-11

**Example**: A number input with `step="0.01"` may not validate correctly.

**Workaround**: Use JavaScript validation for numeric fields with step attributes in IE10/11, or validate on the server side.

**Reference**: [Stack Overflow Discussion](https://stackoverflow.com/questions/20241415/html5-number-input-field-step-attribute-broken-in-internet-explorer-10-and-inter)

---

### Issue #4: Disabled/Hidden Required Fields (Chrome 45+)

**Description**: Inputs marked as disabled or hidden while also marked as required are incorrectly being considered for constraint validation.

**Affected Browsers**: Chrome (tested in version 45+)

**Impact**: The `checkValidity()` method may incorrectly report invalid state for disabled or hidden required fields.

**Expected Behavior**: Per [HTML specification](https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled), disabled and hidden form elements should not participate in constraint validation.

**Workaround**: Check field disabled/hidden state before relying on validation results, or use custom validation logic.

---

### Issue #5: :valid Pseudo-class on Form Elements (IE, Edge, Firefox <51)

**Description**: IE and Edge do not support `:valid` on `form` elements. Firefox versions prior to 51 only matched `:valid` on forms after child element values changed from invalid to valid state.

**Affected Browsers**:
- Internet Explorer (all versions)
- Edge (all versions tested)
- Firefox <51

**Impact**: Cannot style forms based on overall validity state in these browsers.

**References**:
- [Microsoft Edge Platform Issue #8114184](https://web.archive.org/web/20171210190022/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8114184/)
- [Firefox Bug #1285425](https://bugzilla.mozilla.org/show_bug.cgi?id=1285425)

**Workaround**: Style individual form fields instead, or use JavaScript to apply classes based on form validity.

---

## Implementation Tips

### Basic Required Field

```html
<input type="text" name="username" required>
```

### Email Validation

```html
<input type="email" name="email" required>
```

### Number with Range

```html
<input type="number" name="age" min="0" max="120" required>
```

### Custom Validation

```javascript
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    // Handle validation failure
  }
});
```

### Styling Invalid Fields

```css
input:invalid {
  border-color: red;
  background-color: #ffe6e6;
}

input:valid {
  border-color: green;
}

input:required {
  border-width: 2px;
}
```

## References & Resources

### Official Documentation

- [WebPlatform Docs - Required Attribute](https://webplatform.github.io/docs/html/attributes/required)
- [WebKit Blog - HTML Interactive Form Validation](https://webkit.org/blog/7099/html-interactive-form-validation/)

### Related Links

- [MDN - HTML Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [MDN - Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)
- [HTML Living Standard - Client-side Form Validation](https://html.spec.whatwg.org/multipage/forms.html#client-side-form-validation)

## Compatibility Considerations

When using form validation, consider these compatibility strategies:

1. **Progressive Enhancement**: Use native validation as the first line of defense, with JavaScript fallbacks for older browsers
2. **Server-Side Validation**: Always validate on the server; client-side validation is for user experience only
3. **Feature Detection**: Use `Modernizr` or custom feature detection scripts to identify support
4. **Graceful Degradation**: Ensure forms remain functional without JavaScript validation in unsupported browsers
5. **User Testing**: Test validation feedback across target browsers to ensure clarity

## Summary

Form validation is widely supported across modern browsers (93.25% global support for full implementation) and provides an excellent foundation for user input validation. However, developers should implement server-side validation as a security measure and consider JavaScript fallbacks for older browsers, particularly for critical validation rules.
