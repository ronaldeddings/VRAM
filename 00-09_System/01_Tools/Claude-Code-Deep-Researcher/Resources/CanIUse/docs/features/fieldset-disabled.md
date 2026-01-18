# Fieldset Disabled Attribute

## Overview

The `disabled` attribute on the `<fieldset>` element provides a convenient way to disable all form control descendants within a fieldset in a single operation.

## Description

The HTML5 `disabled` attribute allows developers to disable all form control descendants of a fieldset element simultaneously. When applied to a fieldset, this attribute disables all nested form controls (input fields, buttons, selects, textareas, etc.) without requiring individual disabling of each element.

**Technical Details:**
- Allows disabling all of the form control descendants of a fieldset via a `disabled` attribute on the fieldset element itself
- Simplifies form management by providing a single control point for groups of related form inputs
- Provides a clean, semantic way to handle form state changes across related controls

## Specification

- **Status:** Living Standard
- **Specification URL:** [HTML Standard - Fieldset disabled attribute](https://html.spec.whatwg.org/multipage/forms.html#attr-fieldset-disabled)

## Categories

- DOM
- HTML5

## Use Cases & Benefits

### Primary Use Cases

1. **Form State Management** - Disable entire form sections based on application state without individual control manipulation
2. **Wizard/Multi-Step Forms** - Lock form sections until previous steps are completed
3. **Conditional Form Fields** - Group related fields and enable/disable them together based on checkbox or radio selections
4. **Fieldset Grouping** - Organize logically related form controls and manage them as a unit
5. **Permission-Based Forms** - Disable entire sections for users with limited permissions

### Benefits

- **Simplified Code** - Single attribute change instead of multiple individual element updates
- **Semantic HTML** - Properly groups related form controls with meaningful structure
- **Reduced JavaScript** - Less scripting needed for form state management
- **Better Accessibility** - Screen readers recognize grouped disabled controls
- **Performance** - Single DOM operation vs. multiple element updates
- **Maintainability** - Clearer intent in HTML markup

## Browser Support

| Browser | First Version | Status | Notes |
|---------|---|---|---|
| **Chrome** | 20 | ✓ Full | Unsupported in versions 16-19 |
| **Edge** | 12 | ✓ Full | Full support from release |
| **Firefox** | 4 | ✓ Full | Full support from Firefox 4 onward |
| **Safari** | 6 | ✓ Full | Full support from Safari 6 onward |
| **Opera** | 10.0 | ✓ Full | Unsupported in 9 and 9.5-9.6 |
| **IE** | 6-11 | ⚠️ Partial | Text and file inputs remain interactive (see notes) |
| **iOS Safari** | 6.0 | ✓ Full | Full support from iOS 6.0 onward |
| **Android Browser** | 4.4 | ✓ Full | Full support from Android 4.4 onward |
| **Opera Mini** | All | ⚠️ Partial | Partial support with known limitations |
| **Samsung Internet** | 4 | ✓ Full | Full support from Samsung Internet 4 onward |

### Support Summary

- **Full Support:** 93.27% of global users
- **Partial Support:** 0.46% of global users
- **Legacy/No Support:** Minimal impact

## Implementation Notes

### Known Issues

**Internet Explorer (All Versions)**

1. **Text Input Issue (Bug #962368):** Text inputs that are descendants of a disabled fieldset appear disabled visually but users can still interact with and edit them. This affects IE 6, 7, 8, 9, and 10.

2. **File Input Issue (Bug #817488):** File inputs that are descendants of a disabled fieldset appear disabled visually but users can still interact with them. This affects IE 6, 7, 8, 9, 10, and 11.

**Opera Mini**

Partial support with the same text and file input limitations as IE.

### Basic Usage

```html
<form>
  <fieldset disabled>
    <legend>User Information</legend>

    <label for="name">Name:</label>
    <input type="text" id="name" name="name">

    <label for="email">Email:</label>
    <input type="email" id="email" name="email">

    <button type="submit">Submit</button>
  </fieldset>
</form>
```

### JavaScript Control

```javascript
// Enable fieldset
document.getElementById('userFieldset').disabled = false;

// Disable fieldset
document.getElementById('userFieldset').disabled = true;

// Toggle fieldset state
document.getElementById('userFieldset').disabled =
  !document.getElementById('userFieldset').disabled;
```

### Conditional Disabling

```javascript
// Disable fieldset based on checkbox
const conditionalCheckbox = document.getElementById('conditional');
const relatedFieldset = document.getElementById('relatedFields');

conditionalCheckbox.addEventListener('change', (e) => {
  relatedFieldset.disabled = !e.target.checked;
});
```

## Testing & Demo

- **Interactive Demo:** [JS Bin Testcase/Demo](https://jsbin.com/bibiqi/1/edit?html,output)

## Fallback Strategies

For projects requiring IE 6+ compatibility where text and file inputs must be disabled:

1. **JavaScript Fallback:**
   ```javascript
   function disableFieldset(fieldset) {
     const inputs = fieldset.querySelectorAll(
       'input, textarea, select, button'
     );
     inputs.forEach(input => {
       input.disabled = true;
     });
   }
   ```

2. **CSS Visual Fallback:**
   ```css
   fieldset[disabled] {
     opacity: 0.5;
     pointer-events: none;
   }
   ```

3. **Combined Approach:** Use the HTML attribute for modern browsers and JavaScript for legacy browsers.

## Migration Guide

If migrating from manual field disabling:

### Before
```javascript
document.getElementById('input1').disabled = true;
document.getElementById('input2').disabled = true;
document.getElementById('input3').disabled = true;
document.getElementById('submit').disabled = true;
```

### After
```html
<fieldset disabled>
  <input id="input1">
  <input id="input2">
  <input id="input3">
  <button type="submit">Submit</button>
</fieldset>
```

## Related Features

- [HTML Form Element](https://html.spec.whatwg.org/multipage/forms.html)
- [Input Element disabled Attribute](https://html.spec.whatwg.org/multipage/input.html#attr-input-disabled)
- [Button Element disabled Attribute](https://html.spec.whatwg.org/multipage/button.html#attr-button-disabled)
- [Form State Management](https://html.spec.whatwg.org/multipage/forms.html#the-form-element)

## References

- **WHATWG HTML Specification:** https://html.spec.whatwg.org/multipage/forms.html#attr-fieldset-disabled
- **MDN Web Docs:** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset#attr-disabled
- **CanIUse:** https://caniuse.com/fieldset-disabled
- **IE Bug #962368:** https://web.archive.org/web/20170306075528/https://connect.microsoft.com/IE/feedbackdetail/view/962368/can-still-edit-input-type-text-within-fieldset-disabled
- **IE Bug #817488:** https://web.archive.org/web/20170306075531/https://connect.microsoft.com/IE/feedbackdetail/view/817488

## Accessibility Considerations

- Assistive technologies properly announce disabled fieldsets and their controls
- Screen readers indicate that all contained controls are disabled
- Proper use of `<legend>` with fieldset improves accessibility
- Consider adding aria-disabled and explanatory text for enhanced UX

## Performance Considerations

- Single fieldset disable operation is more efficient than disabling multiple individual controls
- Reduces DOM manipulation and reflow/repaint cycles
- Minimal performance impact even with large numbers of nested controls

## Version History

- **Firefox 4+** - First major browser to support the feature
- **Opera 10.0+** - Early adopter alongside Firefox
- **Chrome 20+** - Added support with Chromium 20
- **Safari 6+** - Added support to Safari 6
- **Internet Explorer 6-11** - Partial support with noted limitations
- **Modern Browsers** - Universally supported across current versions
