# Spellcheck Attribute

## Overview

The `spellcheck` attribute is an HTML5 feature that allows developers to explicitly enable or disable the browser's built-in spell checker on `<input>` and `<textarea>` form fields.

## Description

The `spellcheck` attribute provides control over spelling and grammar checking behavior for user input fields. This attribute can take three values:

- **`true`**: Enable spellchecking (default behavior)
- **`false`**: Disable spellchecking
- **`inherit`**: Use the default spellchecking behavior (inherits from parent element)

## Specification Status

**Status**: Living Standard

**Specification URL**: [WHATWG HTML Specification - Spelling and Grammar Checking](https://html.spec.whatwg.org/multipage/interaction.html#spelling-and-grammar-checking)

## Category

- HTML5

## Benefits and Use Cases

### 1. **User Experience Enhancement**
- Provide real-time spelling feedback to users in text input fields
- Reduce typos and spelling errors before form submission
- Improve content quality for user-generated content

### 2. **Field-Specific Control**
- Disable spellchecking on technical fields (code editors, usernames, email addresses)
- Enable spellchecking on narrative content areas (comments, descriptions, messages)
- Customize the experience per form field

### 3. **Professional Applications**
- Content management systems with rich text editors
- Messaging and communication platforms
- Multi-language forms where spell checking may be less relevant

### 4. **Developer Flexibility**
- Reduce noise from false positives in specialized fields
- Maintain consistent spelling feedback across browser implementations
- Create custom spellchecking solutions when needed

## Browser Support

| Browser | First Support | Current Support |
|---------|---------------|-----------------|
| **Chrome** | Version 9 | ✅ Full support (v9+) |
| **Firefox** | Version 2 | ✅ Full support (v2+) |
| **Safari** | Version 5.1 | ✅ Full support (v5.1+) |
| **Edge** | Version 12 | ✅ Full support (v12+) |
| **Opera** | Version 10.5 | ✅ Full support (v10.5+) |
| **IE** | Version 10 | ✅ Partial support (v10-11) |

### Desktop Browser Support

| Browser | Version Range | Support |
|---------|---------------|---------|
| Chrome | 9+ | ✅ Yes |
| Firefox | 2+ | ✅ Yes |
| Safari | 5.1+ | ✅ Yes |
| Edge | 12+ | ✅ Yes |
| Opera | 10.5+ | ✅ Yes |
| Internet Explorer | 10-11 | ✅ Yes |
| Internet Explorer | < 10 | ❌ No |

### Mobile Browser Support

| Browser | Support Level | Notes |
|---------|---------------|-------|
| iOS Safari | ⚠️ Partial | Limited spell checking; behavior depends on OS |
| Android Chrome | ⚠️ Partial | Relies on device OS spell checking |
| Android Firefox | ⚠️ Partial | Limited spell checking support |
| Samsung Internet | ⚠️ Partial | Depends on underlying WebKit implementation |
| Opera Mini | ⚠️ Partial | Limited to basic functionality |
| BlackBerry | ⚠️ Partial | Limited support (BB10: ✅ Full) |

**Usage Statistics:**
- Full Support (Y): 38.32% of tracked browsers
- Partial Support (A): 55.3% of tracked browsers
- No Support (N): ~6.38% of tracked browsers

## Implementation Example

```html
<!-- Enable spellchecking (explicit) -->
<textarea spellcheck="true" placeholder="Enter your message..."></textarea>

<!-- Disable spellchecking -->
<input type="text" spellcheck="false" placeholder="Enter username...">

<!-- Use browser default (inherit) -->
<input type="email" spellcheck="inherit">

<!-- Text area with spellcheck enabled -->
<form>
  <label for="feedback">Your Feedback:</label>
  <textarea
    id="feedback"
    name="feedback"
    spellcheck="true"
    rows="5"
    cols="50">
  </textarea>
</form>

<!-- Disable spellcheck on code input -->
<input
  type="text"
  spellcheck="false"
  placeholder="Enter HTML code..."
  class="code-input">
```

## Important Notes

### Browser Behavior Variations

1. **Timing Differences**: Browsers handle spell checking at different times:
   - Some browsers check immediately as the user types
   - Others only check when the field loses focus
   - Some delay checking until a certain number of characters are entered

2. **Language Handling**: Spell checking behavior varies based on language:
   - Most browsers use the browser's UI language for spell checking
   - The `lang` attribute in HTML may not override the browser's default spell checking language
   - Consider explicitly setting the `lang` attribute for best results

3. **Mobile Device Limitations**:
   - Mobile browsers rely on the device's OS spell checking
   - Setting `spellcheck="false"` may not disable OS-level spell checking
   - iOS and Android may show spell checking UI regardless of the attribute value
   - Some mobile browsers show spell checking suggestions in the system keyboard

### Known Issues

- **Inconsistent `spellcheck="false"` Behavior**: In some mobile browsers, `spellcheck="false"` does not prevent the OS-level spell checking from appearing
- **Language Detection**: Browsers handle language detection differently; spell checking may not work correctly for multilingual content
- **Third-Party Keyboards**: Mobile OS keyboards may override the `spellcheck` attribute behavior

## Compatibility Recommendations

1. **Progressive Enhancement**: Use `spellcheck` as a progressive enhancement; don't rely on it exclusively for validation
2. **Fallback Validation**: Implement server-side or client-side JavaScript validation as a fallback
3. **Mobile Considerations**: Be aware of limitations on mobile platforms when disabling spell checking
4. **Language Specification**: Use the `lang` attribute in combination with `spellcheck` for better results
5. **User Preference**: Consider providing user settings to override default spell checking behavior

## Related Resources

### Official Documentation
- [MDN Web Docs: Controlling spell checking in HTML forms](https://developer.mozilla.org/en-US/docs/Web/HTML/Controlling_spell_checking_in_HTML_forms)
- [WHATWG HTML Specification](https://html.spec.whatwg.org/multipage/interaction.html#spelling-and-grammar-checking)

### Related HTML Attributes
- `lang` - Specifies the language of the element content
- `autocomplete` - Suggests values for form inputs
- `contenteditable` - Makes an element editable by users

### Related Elements
- `<input>` - Text input fields that support `spellcheck`
- `<textarea>` - Multi-line text input that supports `spellcheck`

## Accessibility Considerations

- The `spellcheck` attribute does not affect accessibility features
- Screen readers will continue to read content regardless of spell checking status
- Consider user preferences when disabling spell checking, as it may help users identify typos
- Ensure other validation mechanisms are in place for users who rely on spell checking

## See Also

- [HTML Form Controls Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [Content Editing API](https://developer.mozilla.org/en-US/docs/Web/ContentEditable)
- [Browser Compatibility Reference](https://caniuse.com/spellcheck-attribute)
