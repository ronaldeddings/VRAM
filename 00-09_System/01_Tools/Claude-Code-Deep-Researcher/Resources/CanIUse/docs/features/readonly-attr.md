# readonly Attribute Documentation

## Overview

The `readonly` attribute is an HTML form control attribute that makes input and textarea elements non-editable while preserving their functionality in form submissions.

## Description

The `readonly` attribute makes form controls non-editable. Unlike the `disabled` attribute, readonly form controls are still included in form submissions and the user can still select (but not edit) their value text.

**Key Differences from `disabled` attribute:**
- Form controls remain enabled in form submissions
- Users can still select and copy the value text
- The control retains focus capability and remains interactive

## Specification Status

**Status:** Living Standard (ls)
**Specification URL:** [WHATWG HTML Specification - readonly attribute](https://html.spec.whatwg.org/multipage/input.html#the-readonly-attribute)

## Categories

- DOM
- HTML5

## Use Cases & Benefits

### Common Use Cases

1. **Display-Only Form Fields**
   - Show calculated values that shouldn't be edited
   - Display read-only summaries or totals in forms

2. **Data Preservation**
   - Maintain immutable data in form submissions
   - Preserve values that shouldn't be modified by users

3. **Conditional Editing**
   - Toggle fields between editable and read-only states
   - Implement approval workflows where certain fields are locked

4. **Accessibility**
   - Users can still select text for accessibility tools
   - Screen readers can read the value
   - Tab navigation still includes the field

### Benefits

- ✓ Values are still submitted with form data
- ✓ Better semantic meaning than disabled attributes
- ✓ Users can select and copy text
- ✓ Fully accessible to assistive technologies
- ✓ No need for JavaScript workarounds
- ✓ Lighter than alternative JavaScript-based solutions

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Internet Explorer** | 6 | Supported (11) |
| **Edge** | 12 | Fully Supported (143) |
| **Firefox** | 4 | Fully Supported (148) |
| **Chrome** | 26 | Fully Supported (146) |
| **Safari** | 5.1 | Fully Supported (18.6) |
| **Opera** | 15 | Fully Supported (122) |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **iOS Safari** | 7.0 | Fully Supported (26.1) |
| **Android Browser** | 2.3 | Fully Supported (142) |
| **Opera Mobile** | 80 | Fully Supported (80) |
| **Samsung Internet** | 4 | Fully Supported (29) |
| **Opera Mini** | All versions | Fully Supported |

### Legacy/Partial Support

- **IE 5.5:** Unsupported
- **Firefox 2-3.6:** Unsupported
- **Chrome 4-25:** Unsupported
- **Safari 3.1-5:** Unsupported
- **Opera 9-9.6:** Unsupported
- **Opera 10.0-12.1:** Partially supported (with limitations - see notes)
- **Opera Mobile 10-12.1:** Partially supported
- **iOS Safari 3.2-6.1:** Unsupported

### Global Support

**Current Usage:** 93.72% of browsers support the readonly attribute

## Supported Elements

The `readonly` attribute can be applied to:
- `<input>` elements (except for `button`, `checkbox`, `file`, `hidden`, `image`, `radio`, `reset`, and `submit` types)
- `<textarea>` elements

## Notes & Limitations

### Note #1: Input Type Limitations (Opera 10.0-12.1)

Readonly inputs of type `datetime-local`, `date`, `month`, and `week` can still be edited by pressing the Up or Down arrow keys on the keyboard while the input is focused.

**Affected Browsers:** Opera 10.0-12.1

### Note #2: Text Selection (IE Mobile 10-11)

Text cannot be selected directly, but is possible by first selecting any text around the field.

**Affected Browsers:** Internet Explorer Mobile 10-11

## HTML Examples

### Basic Usage

```html
<!-- Readonly text input -->
<input type="text" value="Cannot be edited" readonly>

<!-- Readonly textarea -->
<textarea readonly>This content cannot be modified by the user.</textarea>
```

### Practical Example: Order Summary

```html
<form>
  <fieldset>
    <legend>Order Details</legend>

    <label for="subtotal">Subtotal:</label>
    <input type="number" id="subtotal" value="99.99" readonly>

    <label for="tax">Tax:</label>
    <input type="number" id="tax" value="8.50" readonly>

    <label for="total">Total:</label>
    <input type="number" id="total" value="108.49" readonly>

    <label for="notes">Order Notes:</label>
    <textarea id="notes" readonly>This is a read-only summary of your order. You cannot modify these fields.</textarea>
  </fieldset>
</form>
```

### Dynamic Readonly State

```html
<input type="email" id="email" value="user@example.com">
<button onclick="document.getElementById('email').readonly = !document.getElementById('email').readonly">
  Toggle Edit
</button>
```

## CSS Styling

Readonly inputs can be styled differently using the `:read-only` CSS pseudo-class:

```css
input:read-only {
  background-color: #f0f0f0;
  color: #666;
  cursor: not-allowed;
}

textarea:read-only {
  opacity: 0.8;
  border-color: #ddd;
}
```

## Related Links

- [WHATWG HTML Specification - readonly attribute (textarea)](https://html.spec.whatwg.org/multipage/forms.html#attr-textarea-readonly)
- [MDN Web Docs - readonly attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-readonly)
- [Can I Use - readonly attribute](https://caniuse.com/readonly-attr)

## Browser Compatibility Summary

### Excellent Support (93.72% global usage)
This feature has excellent browser support across all modern browsers and can be safely used without fallbacks for most use cases.

### Recommended Approach
1. Use `readonly` natively for standard form controls
2. For older browsers (IE 5.5-11), consider providing server-side validation
3. Use JavaScript to enhance functionality if needed (toggle readonly state)
4. Always validate on the server side regardless of readonly status

## See Also

- [`disabled` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-disabled) - For completely disabled inputs
- [`:read-only` CSS pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:read-only)
- [`:read-write` CSS pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:read-write)
- [HTML Forms Documentation](https://html.spec.whatwg.org/multipage/forms.html)
