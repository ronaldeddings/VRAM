# focusin & focusout Events

## Overview

The `focusin` and `focusout` events are DOM Level 3 events that fire when an element gains or loses focus. These events provide important distinctions from their counterparts (`focus` and `blur`) and are essential for handling focus-related interactions in modern web applications.

## Description

The `focusin` and `focusout` events fire **just before** the element gains or loses focus, and critically, they **bubble**. By contrast, the `focus` and `blur` events fire **after** the focus has shifted, and **don't bubble**.

### Key Differences

| Aspect | focusin/focusout | focus/blur |
|--------|------------------|-----------|
| **Timing** | Fires before focus change | Fires after focus change |
| **Bubbling** | Bubbles | Does not bubble |
| **Use Case** | Event delegation, capturing phase changes | Direct element focus handling |

This makes `focusin` and `focusout` particularly valuable for:
- Delegated event handling on parent containers
- Tracking focus changes across multiple child elements
- Building custom focus management systems

## Specification

- **Standard**: DOM Level 3 Events
- **Status**: Working Draft (WD)
- **Specification URL**: https://www.w3.org/TR/DOM-Level-3-Events/#event-type-focusin

## Categories

- **DOM** - Document Object Model

## Benefits & Use Cases

### 1. Event Delegation
Since `focusin` and `focusout` bubble, you can listen for focus changes on a parent element instead of attaching listeners to every child:

```javascript
// Single listener handles all focus changes in the form
form.addEventListener('focusin', (event) => {
  console.log('Focus entered:', event.target);
});

form.addEventListener('focusout', (event) => {
  console.log('Focus left:', event.target);
});
```

### 2. Form Validation & Feedback
Provide real-time feedback as users move focus through form fields:

```javascript
form.addEventListener('focusin', (event) => {
  if (event.target.matches('input')) {
    event.target.classList.add('focused');
    // Show help text or validation hints
  }
});

form.addEventListener('focusout', (event) => {
  if (event.target.matches('input')) {
    event.target.classList.remove('focused');
    // Validate field when focus leaves
    validateField(event.target);
  }
});
```

### 3. Complex Focus Management
Build sophisticated focus management systems for modals, dropdowns, and custom UI components that need to track focus across multiple elements.

### 4. Accessibility Enhancement
Improve keyboard navigation and screen reader support by responding to focus changes across your application.

### 5. Custom UI Components
Create custom form controls, autocomplete suggestions, and interactive elements that need to respond to focus state changes across child elements.

## Browser Support

### Support Legend
- ✅ **y** - Fully supported
- ⚠️ **u** - Partial/Unclear support
- ❌ **n** - Not supported

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Chrome** | 15 | ✅ Fully supported (v15+) |
| **Firefox** | 52 | ✅ Fully supported (v52+) |
| **Safari** | 5.1 | ✅ Fully supported (v5.1+) |
| **Edge** | 12 | ✅ Fully supported (v12+) |
| **Opera** | 11.6 | ✅ Fully supported (v11.6+) |
| **IE** | 6 | ✅ Supported (v6-11) |

### Mobile Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| **iOS Safari** | ✅ Fully supported | From v5.0+ |
| **Android Browser** | ✅ Fully supported | From v4+ |
| **Chrome Mobile** | ✅ Fully supported | Modern versions |
| **Firefox Mobile** | ✅ Fully supported | Modern versions |
| **Samsung Internet** | ✅ Fully supported | From v4+ |
| **Opera Mobile** | ✅ Fully supported | From v12+ |
| **IE Mobile** | ✅ Fully supported | v10-11 |
| **Opera Mini** | ❌ Not supported | All versions |

### Support Summary

- **Global Usage**: 93.57% of users have browser support
- **Desktop Support**: Nearly universal (IE 6+, all modern browsers)
- **Mobile Support**: Excellent (iOS 5.0+, Android 4+)
- **Notable Gap**: Opera Mini does not support these events

### Historical Support Timeline

**Chrome**
- Versions 4-14: Partial/Unclear support (u)
- Version 15 onwards: Full support (y)

**Firefox**
- Versions 2-51: No support (n)
- Version 52 onwards: Full support (y)

**Safari**
- Versions 3.1-5: Partial/Unclear support (u)
- Version 5.1 onwards: Full support (y)

**Edge**
- Version 12 onwards: Full support (y)

## Migration Notes

### Fallback for Unsupported Browsers

For the small number of browsers that don't support `focusin` and `focusout`, you can use capture phase event listeners as an alternative:

```javascript
// Modern approach with focusin/focusout
element.addEventListener('focusin', handleFocusIn);
element.addEventListener('focusout', handleFocusOut);

// Fallback for older browsers
if (!('onfocusin' in window)) {
  // Use capture phase for focus/blur instead
  document.addEventListener('focus', handleFocusIn, true);
  document.addEventListener('blur', handleFocusOut, true);
}
```

### Compatibility Detection

```javascript
// Check if focusin/focusout are supported
const supportsFocusEvents = 'onfocusin' in window;

if (supportsFocusEvents) {
  // Use focusin/focusout
} else {
  // Fall back to focus/blur with event capture
}
```

## Implementation Examples

### Example 1: Simple Focus Tracking

```javascript
const container = document.getElementById('form-container');

container.addEventListener('focusin', (event) => {
  console.log('Field focused:', event.target.name);
  event.target.style.borderColor = 'blue';
});

container.addEventListener('focusout', (event) => {
  console.log('Field blurred:', event.target.name);
  event.target.style.borderColor = 'gray';
});
```

### Example 2: Form Validation on Blur

```javascript
const form = document.querySelector('form');

form.addEventListener('focusout', (event) => {
  if (event.target.tagName === 'INPUT') {
    const input = event.target;

    if (input.type === 'email' && !input.value.includes('@')) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
    }
  }
});
```

### Example 3: Custom Focus Styling

```javascript
const fieldset = document.querySelector('fieldset');

fieldset.addEventListener('focusin', (event) => {
  fieldset.classList.add('has-focus');
});

fieldset.addEventListener('focusout', (event) => {
  // Check if focus is moving to another field in the fieldset
  if (!fieldset.contains(event.relatedTarget)) {
    fieldset.classList.remove('has-focus');
  }
});
```

## Resources & References

### Official Documentation
- [MDN Web Docs - focusin Event](https://developer.mozilla.org/en-US/docs/Web/Events/focusin)
- [MDN Web Docs - focusout Event](https://developer.mozilla.org/en-US/docs/Web/Events/focusout)

### Bug Reports & Discussion
- [Mozilla Bug 687787 - Add support for DOM3 focusin/focusout](https://bugzilla.mozilla.org/show_bug.cgi?id=687787)

### Related Events
- `focus` - Non-bubbling focus event
- `blur` - Non-bubbling blur event
- `focusin` - Bubbling focus event
- `focusout` - Bubbling blur event

## Notes

In browsers that don't support these events (primarily Opera Mini and some legacy browsers), one alternative is to use a capture phase event listener for the `focus` and/or `blur` events:

```javascript
// Capture phase approach for older browsers
document.addEventListener('focus', handleFocus, true);  // true = use capture phase
document.addEventListener('blur', handleBlur, true);
```

The capture phase allows you to intercept events at the document level before they reach their target, providing similar (though not identical) functionality to `focusin` and `focusout`.

## Accessibility Considerations

- Use `focusin`/`focusout` to enhance keyboard navigation experience
- Provide visible focus indicators for keyboard users
- Combine with `aria-*` attributes for screen reader support
- Ensure focus management doesn't trap users in custom UI components

## Performance Tips

- Use event delegation with `focusin`/`focusout` on parent containers rather than individual elements
- Avoid heavy processing in focus event handlers
- Consider debouncing validation logic triggered by `focusout`

---

**Last Updated**: 2024
**Usage Coverage**: 93.57% of tracked browsers
**Recommendation**: Safe to use in production with minimal fallback requirements
