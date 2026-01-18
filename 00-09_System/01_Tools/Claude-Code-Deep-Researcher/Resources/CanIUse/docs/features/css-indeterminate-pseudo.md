# CSS `:indeterminate` Pseudo-Class

## Overview

The `:indeterminate` CSS pseudo-class matches form elements in an indeterminate state. This includes:

- **Checkboxes** with the `indeterminate` HTML property set to `true`
- **Radio buttons** in a radio button group where no button is currently selected
- **Progress bars** (`<progress>` elements) without a defined value

This pseudo-class enables developers to style form controls when they are in a partial or undefined state, providing better visual feedback to users about the form's current status.

---

## Specification & Status

| Property | Value |
|----------|-------|
| **Status** | Working Draft (WD) |
| **W3C Specification** | [Selectors Level 4 - :indeterminate](https://www.w3.org/TR/selectors-4/#indeterminate) |
| **HTML Living Standard** | [HTML Specification - :indeterminate selector](https://html.spec.whatwg.org/multipage/scripting.html#selector-indeterminate) |

---

## Categories

- **CSS**

---

## Benefits & Use Cases

### 1. **Enhanced User Experience**
- Provide visual distinction for incomplete or uncertain form states
- Improve form clarity when radio button groups have no selection
- Better communicate the state of bulk operations (select-all checkboxes)

### 2. **Accessibility**
- Style form controls consistently across browsers
- Communicate form state more clearly to assistive technologies
- Support better visual feedback for users with different abilities

### 3. **Progressive Enhancement**
- Style checkboxes in tri-state systems (checked, unchecked, indeterminate)
- Create intuitive UI patterns for hierarchical selections
- Support master-detail form interactions

### 4. **Form Validation**
- Distinguish between "no selection made yet" and "selection is invalid"
- Style progress indicators in indeterminate states
- Provide visual feedback during asynchronous form operations

### 5. **Real-World Applications**
- **Multi-select checkboxes**: Parent checkbox shows indeterminate state when some (but not all) children are selected
- **File uploads**: Progress bars in indeterminate mode during upload initialization
- **Survey forms**: Radio button groups awaiting user selection
- **Wizard interfaces**: Indicating incomplete steps or pending status

---

## Syntax

```css
:indeterminate {
  /* CSS properties */
}
```

### Example Usage

```css
/* Style indeterminate checkboxes */
input[type="checkbox"]:indeterminate {
  background-color: #ccc;
  border-color: #999;
}

/* Style indeterminate radio buttons */
input[type="radio"]:indeterminate {
  outline: 2px solid blue;
}

/* Style indeterminate progress bars */
progress:indeterminate {
  background: linear-gradient(90deg, #4CAF50, #FFC107);
}
```

### JavaScript Example

```javascript
// Set a checkbox to indeterminate state
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.indeterminate = true;

// Check if a checkbox is indeterminate
if (checkbox.indeterminate) {
  console.log('Checkbox is in indeterminate state');
}
```

---

## Browser Support

### Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Chrome** | 39 | ✅ Full Support |
| **Firefox** | 51 | ✅ Full Support |
| **Safari** | 10.1 | ✅ Full Support |
| **Edge** | 79 (Chromium) | ✅ Full Support |
| **Opera** | 26 | ✅ Full Support |
| **iOS Safari** | 10.3 | ✅ Full Support |
| **Android** | 4.4 (Partial) | ⚠️ Partial Support |
| **IE 11** | No | ❌ Not Supported |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Version | Checkbox | Radio | Progress | Notes |
|---------|---------|----------|-------|----------|-------|
| **Chrome** | 39+ | ✅ | ✅ | ✅ | Full support since v39 |
| **Firefox** | 51+ | ✅ | ✅ | ✅ | Full support since v51 |
| **Safari** | 10.1+ | ✅ | ✅ | ✅ | Full support since v10.1 |
| **Edge (Chromium)** | 79+ | ✅ | ✅ | ✅ | Full support since v79 |
| **Opera** | 26+ | ✅ | ✅ | ✅ | Full support since v26 |
| **IE 11** | — | ❌ | ❌ | ❌ | No support |
| **IE 10** | — | ⚠️ | ⚠️ | ❌ | Partial support |
| **IE 9** | — | ⚠️ | ⚠️ | ❌ | Partial support |

#### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 10.3+ | ✅ Full | Full support since v10.3 |
| **Android** | 4.4+ | ⚠️ Partial | Partial support for checkboxes; not for progress |
| **Samsung Internet** | 4.0+ | ✅ Full | Full support |
| **UC Browser** | 15.5+ | ✅ Full | Full support |
| **Opera Mini** | All | ⚠️ | Limited support for progress bars |
| **Opera Mobile** | 80+ | ✅ Full | Full support |
| **Firefox Mobile** | 144+ | ✅ Full | Full support |
| **Chrome Mobile** | 142+ | ✅ Full | Full support |

### Global Usage

- **With Full Support**: 93.13%
- **With Partial Support**: 0.55%

---

## Known Issues & Limitations

### 1. **Radio Button Support** (Note #1)
Some older browsers don't match radio buttons whose radio button group lacks a checked radio button. This includes:
- Internet Explorer 9-11
- Firefox (pre-v51)
- Chrome (pre-v39)
- Opera (pre-v26)
- Safari (pre-v10.1)

### 2. **Progress Element Support** (Note #2)
Older browsers don't support styling the `<progress>` element with `:indeterminate`, including:
- Internet Explorer 9-11
- Chrome (pre-v39)
- Firefox (pre-v4)
- Safari (pre-v10.1)

### 3. **Opera Mini Limitation** (Note #3)
Opera Mini doesn't match indeterminate `<progress>` bars, restricting this feature for users on basic mobile devices.

### 4. **Android Browser Limitation**
Android Browser (pre-v4.4) has inconsistent support and doesn't support the `<progress>` element styling.

---

## Cross-Browser Compatibility Notes

### Partial Support Browsers
When a browser shows partial support ("⚠️"), it may:
- Support `:indeterminate` for checkboxes but not radio buttons or progress bars
- Lack support for the `<progress>` element entirely
- Have limited styling capabilities for indeterminate states

### Fallback Strategies

```css
/* Fallback for unsupported browsers */
input[type="checkbox"] {
  /* Base styles */
}

input[type="checkbox"]:indeterminate {
  /* Modern browser styles */
}

/* Alternative approach using classes for older browsers */
input.indeterminate-fallback {
  /* Styles that work everywhere */
}
```

```javascript
// Feature detection
function supportsIndeterminate() {
  const input = document.createElement('input');
  input.type = 'checkbox';
  return 'indeterminate' in input;
}

// Fallback for old browsers
if (!supportsIndeterminate()) {
  // Use class-based approach instead
}
```

---

## Related Features & Links

### Official Specifications
- [CSS Selectors Level 4 - :indeterminate](https://www.w3.org/TR/selectors-4/#indeterminate)
- [HTML Living Standard - :indeterminate selector](https://html.spec.whatwg.org/multipage/scripting.html#selector-indeterminate)

### Documentation & References
- [MDN Web Docs - CSS :indeterminate](https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate)

### Test Cases & Examples
- [JS Bin Interactive Example](https://jsbin.com/zumoqu/edit?html,css,js,output)

### Tracking Issues
- [Mozilla Firefox Bug 885359](https://bugzilla.mozilla.org/show_bug.cgi?id=885359) - Radio groups without a selected radio button should have `:indeterminate` applying
- [WebKit Bug 156270](https://bugs.webkit.org/show_bug.cgi?id=156270) - `:indeterminate` pseudo-class should match radios whose group has no checked radio
- [Microsoft EdgeHTML Issue 7124038](https://web.archive.org/web/20190624214229/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7124038/) - `:indeterminate` pseudo-class doesn't match radio buttons

---

## Implementation Examples

### Example 1: Tri-State Checkbox (Master-Detail)

```html
<label>
  <input type="checkbox" id="selectAll"> Select All
</label>

<fieldset>
  <label><input type="checkbox" class="item"> Item 1</label>
  <label><input type="checkbox" class="item"> Item 2</label>
  <label><input type="checkbox" class="item"> Item 3</label>
</fieldset>
```

```css
#selectAll:indeterminate {
  opacity: 0.6;
  background-color: #f0f0f0;
  border: 2px dashed #999;
}

.item:indeterminate {
  outline: 2px solid orange;
}
```

```javascript
const selectAll = document.getElementById('selectAll');
const items = document.querySelectorAll('.item');

selectAll.addEventListener('change', () => {
  items.forEach(item => {
    item.checked = selectAll.checked;
  });
  selectAll.indeterminate = false;
});

items.forEach(item => {
  item.addEventListener('change', () => {
    const checkedCount = Array.from(items).filter(i => i.checked).length;
    selectAll.checked = checkedCount === items.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < items.length;
  });
});
```

### Example 2: Radio Button Group Status

```html
<fieldset>
  <legend>Select an option:</legend>
  <label><input type="radio" name="option"> Option A</label>
  <label><input type="radio" name="option"> Option B</label>
  <label><input type="radio" name="option"> Option C</label>
</fieldset>
```

```css
input[type="radio"]:indeterminate {
  box-shadow: 0 0 0 2px rgba(0, 100, 200, 0.3);
}
```

### Example 3: Progress Bar Styling

```html
<progress id="fileProgress"></progress>
```

```css
progress:indeterminate {
  background: linear-gradient(
    90deg,
    #3498db 0%,
    #2ecc71 50%,
    #3498db 100%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

```javascript
const progress = document.getElementById('fileProgress');

// Set to indeterminate (no value)
progress.removeAttribute('value');

// Add visual feedback
progress.classList.add('animated');
```

---

## Best Practices

1. **Always Provide Clear Semantics**
   - Use `:indeterminate` to represent actual indeterminate states, not arbitrary styling
   - Document why an element is in an indeterminate state

2. **Ensure Visual Clarity**
   - Make indeterminate states visually distinct from checked/unchecked states
   - Use consistent styling across similar controls

3. **Support Older Browsers**
   - Provide fallbacks using class-based styling or JavaScript
   - Test across target browsers, especially older IE and Android browsers

4. **Accessibility**
   - Ensure indeterminate state is communicated to screen readers
   - Use ARIA attributes if necessary (`aria-checked="mixed"`)

5. **Mobile Consideration**
   - Test on real mobile devices, especially Android browsers
   - Consider touch target sizes for form controls

---

## See Also

- [`:checked` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked)
- [`:disabled` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled)
- [Form element styling](https://developer.mozilla.org/en-US/docs/Learn/Forms/Styling_web_forms)
- [Checkboxes and radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)
- [Progress element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)
