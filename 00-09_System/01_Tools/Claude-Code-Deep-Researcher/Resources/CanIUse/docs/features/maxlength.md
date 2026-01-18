# maxlength Attribute

## Overview

The `maxlength` attribute declares an upper bound on the number of characters a user can input into `<input>` and `<textarea>` elements. Modern browsers prevent users from typing additional characters beyond this limit through UI constraints.

## Description

The `maxlength` attribute is a fundamental HTML form validation feature that restricts the number of characters users can enter into text input fields and text areas. When a user reaches the character limit, the browser UI typically prevents further input. This attribute works in conjunction with the Constraint Validation API and related properties.

## Specification

- **Status**: Living Standard (LS)
- **Specification URL**: [HTML Standard - maxlength attribute](https://html.spec.whatwg.org/multipage/forms.html#attr-input-maxlength)

## Categories

- DOM
- HTML5
- JS API

## Use Cases & Benefits

### Primary Use Cases

1. **Username/Email Validation**: Enforce reasonable length limits for usernames and email inputs
2. **Phone Number Fields**: Restrict input to valid phone number lengths
3. **ZIP/Postal Codes**: Limit input to standard code formats
4. **Character Count Restrictions**: Enforce limits on comment sections, text areas, or description fields
5. **SMS/Text Message Input**: Restrict character count for message composition
6. **Search Queries**: Prevent excessively long search terms

### Benefits

- **Improved User Experience**: Provides immediate feedback when character limits are reached
- **Data Integrity**: Ensures data stored matches intended specifications
- **Client-Side Validation**: Reduces invalid form submissions before server processing
- **Accessibility**: Declarative approach easier for screen readers and assistive technologies
- **Progressive Enhancement**: Works without JavaScript for basic validation
- **API Integration**: Works with HTML5 Constraint Validation API (`ValidityState.tooLong`)

## Browser Support

### Support Matrix

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4+ | ✅ Full | Complete support across all modern versions |
| **Firefox** | 4+ | ✅ Full | Full support from version 4 onwards; Note #4 applies to older versions |
| **Edge** | 12+ | ✅ Full | Complete support; Note #4 applies to versions 12-18 |
| **Safari** | 5.1+ | ✅ Full | Support from Safari 5.1 and later |
| **Opera** | 15+ | ✅ Full | Complete support from version 15 onwards |
| **Internet Explorer** | 10+ | ✅ Full | IE 10 and 11 have full support; earlier versions had limitations |
| **iOS Safari** | 4.0+ | ✅ Full | Supported from iOS 4.0 (with Note #5 in v8) |
| **Android** | 2.3+ | ✅ Full | Full support from Android 2.3 (with Note #6 in v142) |
| **Opera Mini** | All | ⚠️ Partial | Limited support (Note #1) |
| **Samsung Internet** | 4+ | ✅ Full | Full support across versions; Note #6 applies |
| **Firefox Mobile** | 144+ | ✅ Full | Full support in modern versions |
| **Chrome Mobile** | 142+ | ✅ Full | Full support in modern versions |

### Support Legend

- ✅ **Full (y)** - Complete browser support
- ⚠️ **Partial (a)** - Partial/limited support with known issues
- ❌ **None (u)** - No support

### Overall Support Statistics

- **Full Support (y)**: 93.6% of browser market share
- **Partial Support (a)**: 0.13% of browser market share

## Known Issues & Limitations

### Note #1: Textarea UI Limitation
**Affected**: Internet Explorer 6-9, Firefox 2-3.6, Opera 9-12.1, Opera Mini (all versions)

The `<textarea>` UI does not prevent users from typing additional characters beyond the `maxlength` limit. Although the attribute is recognized, the browser does not enforce it visually.

**Workaround**: Use JavaScript to manually enforce the character limit on textarea elements when supporting older browsers.

### Note #2: Missing DOM Property
**Affected**: Internet Explorer 6-9

Does not support the `HTMLTextAreaElement.maxLength` DOM property, preventing JavaScript access to the maxlength value on textarea elements.

**Workaround**: Use `getAttribute()` to retrieve the maxlength value directly.

### Note #3: Missing ValidityState Support
**Affected**: Internet Explorer 6-9, Firefox 2-3.6, Opera 9-12.1

Does not support the `ValidityState.tooLong` property. In some cases, this is because the `.validity` API is not supported at all.

**Workaround**: Implement custom validation logic using JavaScript to check character counts.

### Note #4: ValidityState Edge Case Bug
**Affected**: Firefox 4-50, Edge 12-18, KaiOS 2.5-3.1

Does not handle the `ValidityState.tooLong` correctly in the edge case where:
1. The initial value exceeds the `maxlength` limit
2. The user edits the value but it remains invalid

**References**:
- [Firefox Bug Report](https://bugzilla.mozilla.org/show_bug.cgi?id=1203844)
- [MS Edge Bug Report](https://web.archive.org/web/20171210191653/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4678527/)

### Note #5: Input UI Limitation (iOS)
**Affected**: iOS Safari 8-8.4

The `<input>` element's UI does not prevent users from typing additional characters when inserted between existing string characters, only at the end.

**Workaround**: Use JavaScript for strict client-side validation on iOS 8.x devices.

### Note #6: Delayed Enforcement
**Affected**: Android 4.4.3+, Samsung Internet, Opera Mobile, Android Chrome, Android Firefox

Allows text beyond `maxlength` to be entered initially, but removes all excess characters beyond the limit when the input loses focus.

**Impact**: Minor UX difference - users can temporarily exceed the limit while typing.

## Basic Usage

### Input Element

```html
<!-- Limit username to 20 characters -->
<input
  type="text"
  id="username"
  maxlength="20"
  placeholder="Enter username (max 20 chars)"
/>
```

### Textarea Element

```html
<!-- Limit comment to 500 characters -->
<textarea
  id="comment"
  maxlength="500"
  placeholder="Enter comment (max 500 chars)">
</textarea>
```

### With Character Counter

```html
<label for="bio">Biography (max 150 characters):</label>
<textarea id="bio" maxlength="150"></textarea>
<div id="charCount">0 / 150</div>

<script>
  const textarea = document.getElementById('bio');
  const charCount = document.getElementById('charCount');

  textarea.addEventListener('input', () => {
    const current = textarea.value.length;
    const max = textarea.getAttribute('maxlength');
    charCount.textContent = `${current} / ${max}`;
  });
</script>
```

### Constraint Validation API

```javascript
const input = document.getElementById('username');

// Check if value exceeds maxlength
if (input.validity.tooLong) {
  console.log('Input exceeds maximum length');
}

// Access maxlength value
const maxLength = input.maxLength;
console.log(`Maximum allowed: ${maxLength} characters`);

// Validate the input
if (!input.checkValidity()) {
  console.log('Input is invalid');
}
```

## Technical Details

### Applicable Elements

- `<input>` (all text-based types: text, email, password, search, tel, url)
- `<textarea>`

### Value Format

- Accepts a non-negative integer value
- Specifies the maximum number of characters allowed

### Default Behavior

- No limit if attribute is not specified or invalid
- Invalid values are ignored
- Attribute applies regardless of input type or value

## Browser Compatibility Summary

### Desktop Browsers

- **Chrome/Edge (Chromium)**: Full support since v4/v12
- **Firefox**: Full support since v4
- **Safari**: Full support since v5.1
- **Opera**: Full support since v15
- **Internet Explorer**: Full support in IE10+, partial in IE6-9

### Mobile Browsers

- **iOS Safari**: Full support since 4.0
- **Android Browser**: Full support since 2.3
- **Chrome Mobile**: Full support
- **Firefox Mobile**: Full support

### Legacy Considerations

- Internet Explorer 6-9: Limited support; avoid relying on ValidityState API
- Firefox 2-3.6: Limited support for textarea
- Opera 9-12: Limited support for textarea
- Safari 3.1-5: No support

## Recommendations

### For Modern Development

1. **Use the `maxlength` attribute** as a standard form validation feature
2. **Combine with server-side validation** - never rely solely on client-side restrictions
3. **Consider ValidityState API** for enhanced validation workflows
4. **Provide visual feedback** - display character counts in real-time
5. **Test on target devices** - verify behavior on specific browsers your users employ

### For Legacy Support (IE6-9)

1. **Implement JavaScript fallback** for textarea enforcement
2. **Use `getAttribute()`** instead of the `.maxLength` property
3. **Implement custom validation** for `ValidityState.tooLong` checks
4. **Always validate on the server** - don't assume client-side enforcement

### Best Practices

```html
<!-- Semantic form structure -->
<form>
  <div>
    <label for="comment">Comment (max 500 characters):</label>
    <textarea
      id="comment"
      name="comment"
      maxlength="500"
      required
      aria-describedby="commentHelp">
    </textarea>
    <small id="commentHelp">You can enter up to 500 characters.</small>
    <div id="charCounter" aria-live="polite" aria-atomic="true">
      0 / 500 characters
    </div>
  </div>
  <button type="submit">Submit</button>
</form>
```

## Related Features

- **Constraint Validation API**: `ValidityState.tooLong` property
- **minlength Attribute**: Sets a minimum character requirement
- **Pattern Attribute**: Restricts input format using regular expressions
- **maxlength DOM Property**: `HTMLInputElement.maxLength` and `HTMLTextAreaElement.maxLength`

## References & Further Reading

- [MDN Web Docs - maxlength Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-maxlength)
- [HTML Living Standard Specification](https://html.spec.whatwg.org/multipage/forms.html#attr-input-maxlength)
- [HTML5 Form Validation](https://html.form-validation.spec.whatwg.org/)
- [ValidityState Interface](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)

## Version History

- **HTML5**: Standardized with modern semantics
- **Living Standard**: Continuously updated with clarifications and edge case handling

---

**Last Updated**: December 2025
**Status**: Living Standard (LS)
**Browser Support**: 93.6% of global market share
