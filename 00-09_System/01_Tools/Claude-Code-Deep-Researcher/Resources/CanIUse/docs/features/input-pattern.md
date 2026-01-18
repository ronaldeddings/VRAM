# Pattern Attribute for Input Fields

## Overview

The `pattern` attribute for HTML input fields enables client-side validation of user input against a regular expression pattern. This provides immediate feedback to users when their input doesn't match the specified format.

## Description

The `pattern` attribute allows developers to define a regular expression that an input field's value must match to be considered valid. This is a native HTML5 form validation feature that works without requiring JavaScript, providing a seamless user experience with built-in validation messages.

### Key Features

- **Client-side validation** without JavaScript
- **Native browser validation UI** with helpful error messages
- **Regular expression support** for flexible pattern matching
- **Accessibility compliant** with proper ARIA attributes
- **User-friendly feedback** with real-time validation hints

## Specification Status

**Status:** Living Standard (LS)

- **Official Specification:** [WHATWG HTML Standard - Pattern Attribute](https://html.spec.whatwg.org/multipage/forms.html#the-pattern-attribute)
- **Standardization Level:** Stable and well-established in modern browsers
- **Maintenance:** Actively maintained as part of the HTML Living Standard

## Categories

- **HTML5** - Core HTML5 form validation feature

## Use Cases & Benefits

### Common Use Cases

1. **Phone Numbers** - Validate phone number format (e.g., `\d{3}-\d{3}-\d{4}`)
2. **Email Patterns** - Enforce specific email format requirements
3. **Postal Codes** - Validate country-specific postal code formats
4. **Username Requirements** - Ensure usernames meet specific criteria (alphanumeric, length constraints)
5. **Credit Card Formats** - Basic validation of credit card number patterns
6. **URL Slugs** - Validate URL-friendly identifiers
7. **SKU/Product Codes** - Enforce specific product code formats
8. **License Plates** - Validate license plate formats by region

### Key Benefits

- **Improved User Experience** - Immediate feedback on input validity
- **Reduced Server Load** - Eliminates unnecessary validation requests
- **Accessibility** - Works with assistive technologies for form validation
- **Graceful Degradation** - Browsers that don't support validation still accept the input
- **No Dependencies** - Built-in to HTML5, no JavaScript library needed
- **Progressive Enhancement** - Can be combined with server-side validation
- **Consistency** - Native browser validation UI across platforms

## Browser Support

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | v10 | ✅ Full Support (v10+) | Fully supported since version 10 |
| **Firefox** | v4 | ✅ Full Support (v4+) | Fully supported since version 4 |
| **Safari Desktop** | v10.1 | ✅ Full Support (v10.1+) | Partial support in v5.1-v10.0 |
| **Safari (iOS)** | v10.3 | ✅ Full Support (v10.3+) | Partial support in v5.0-v10.2 |
| **Edge** | v12 | ✅ Full Support (v12+) | Fully supported since launch |
| **Opera** | v9.5 | ✅ Full Support (v9.5+) | Fully supported since version 9.5 |
| **Internet Explorer** | v10 | ✅ Supported (v10-v11) | Partial support in IE 10-11 |
| **Android Browser** | v4.4.3+ | ✅ Full Support | Fully supported from v4.4.3 onwards |
| **Opera Mini** | All versions | ❌ Not Supported | Not supported in Opera Mini |
| **IE Mobile (mobile)** | v10-v11 | ⚠️ Partial Support | Partial support only |

### Support Summary

**Global Support:** 93.58% (with partial support in 0.02% of browsers)

### Detailed Support Table

#### Desktop Browsers

| Browser | Minimum Version | Support Level |
|---------|-----------------|----------------|
| Chrome | v10 | ✅ Full |
| Firefox | v4 | ✅ Full |
| Safari | v10.1 | ✅ Full |
| Edge | v12 | ✅ Full |
| Opera | v9.5 | ✅ Full |
| Internet Explorer | v10 | ⚠️ Partial |

#### Mobile Browsers

| Platform | Minimum Version | Support Level |
|----------|-----------------|----------------|
| iOS Safari | v10.3 | ✅ Full |
| Chrome Mobile (Android) | v4.4.3+ | ✅ Full |
| Firefox Mobile (Android) | v144 | ✅ Full |
| Opera Mobile | v10+ | ✅ Full |
| Samsung Browser | v4+ | ✅ Full |
| UC Browser | v15.5 | ✅ Full |
| Opera Mini | All | ❌ Not Supported |
| Android Browser | v4.4.3+ | ✅ Full |

## Implementation Notes

### Important Considerations

1. **Not Sufficient Alone** - The `pattern` attribute should never be the only validation method:
   - Always use server-side validation for security
   - Client-side validation can be bypassed by malicious users
   - Combine with the `:valid` and `:invalid` CSS pseudo-classes for enhanced UX

2. **Partial Support Issues**:
   - **Safari (v5.1-v10.0)** - Supports the attribute but doesn't display validation error messages
   - **iOS Safari (v5.0-v10.2)** - Supports the attribute but doesn't display validation error messages
   - **IE Mobile (v10-v11)** - Partial support with limited validation messaging
   - **Form Submission** - Safari allows form submission even with invalid patterns; check `form-validation` feature for details

3. **Pattern Syntax**:
   - Uses JavaScript regular expression syntax
   - Must match the entire input value (implicitly anchored)
   - Cannot use forward slashes or line breaks in the pattern
   - Case-sensitive by default

4. **User Experience**:
   - Different browsers may display validation messages differently
   - Some browsers show native tooltips on invalid input
   - Consider providing visible pattern hints to users
   - Test across target browsers for consistency

### Usage Example

```html
<!-- Phone number pattern -->
<input type="text" pattern="\d{3}-\d{3}-\d{4}"
       placeholder="123-456-7890"
       title="Phone number must be formatted as XXX-XXX-XXXX">

<!-- Username pattern (alphanumeric, 3-20 characters) -->
<input type="text" pattern="[A-Za-z0-9]{3,20}"
       title="Username must be 3-20 alphanumeric characters">

<!-- Email-like pattern -->
<input type="email" pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
       title="Please enter a valid email address">

<!-- Postal code (US) -->
<input type="text" pattern="\d{5}(-\d{4})?"
       placeholder="12345 or 12345-6789"
       title="Enter a valid US postal code">
```

### Best Practices

1. **Combine with Server Validation**
   ```html
   <!-- Always validate on the server as well -->
   <input type="text" pattern="[0-9]{10}" required>
   ```

2. **Provide Clear User Guidance**
   ```html
   <label for="phone">Phone Number</label>
   <input id="phone" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          title="Format: 123-456-7890" placeholder="123-456-7890">
   ```

3. **Use Appropriate Input Types**
   ```html
   <!-- Combine pattern with semantic input types -->
   <input type="email" pattern=".*@example\.com" title="Must be an example.com email">
   <input type="tel" pattern="[0-9]{10}" title="10-digit phone number">
   ```

4. **Add CSS Styling for Better UX**
   ```css
   input:invalid {
     border-color: red;
     background-color: #fff0f0;
   }

   input:valid {
     border-color: green;
     background-color: #f0fff0;
   }
   ```

## Related Features

- **[Form Validation](https://caniuse.com/feat/form-validation)** - Parent feature covering overall form validation capabilities
- **[Input Type Email](https://caniuse.com/feat/input-type-email)** - Built-in email validation
- **[Input Type Number](https://caniuse.com/feat/input-type-number)** - Built-in numeric validation
- **[HTML5 Constraint Validation API](https://caniuse.com/feat/constraint-validation)** - JavaScript API for form validation

## Resources

### Official Documentation

- [MDN Web Docs - input element: pattern attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-pattern)
- [WHATWG HTML Standard - Pattern Attribute](https://html.spec.whatwg.org/multipage/forms.html#the-pattern-attribute)
- [Can I Use - Pattern Attribute](https://caniuse.com/input-pattern)

### Pattern Resources

- [HTML5 Pattern - Common Pattern Examples](https://www.html5pattern.com/) - Site with common sample patterns for various input types
- [Regular Expression Testing Tools](https://regexr.com/) - Interactive regex testing and documentation
- [MDN Regular Expressions Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

### Tutorials & Articles

- [HTML5 Form Validation on MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [Progressive Enhancement with HTML5 Forms](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/)

## Summary

The `pattern` attribute is a well-supported HTML5 feature that provides client-side input validation using regular expressions. With 93.58% global support and full implementation in all modern browsers, it's a reliable choice for enhancing form UX. However, it should always be paired with server-side validation for security. The feature works seamlessly with standard HTML5 input types and integrates well with CSS pseudo-classes like `:valid` and `:invalid` for enhanced user feedback.

---

*Last Updated: 2025-12-13*
*Based on CanIUse data and WHATWG HTML Living Standard*
