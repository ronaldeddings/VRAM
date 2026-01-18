# Indeterminate Checkbox

## Overview

The indeterminate checkbox is a web platform feature that allows checkboxes to display in a third visual state—distinct from both checked and unchecked states. This feature is commonly used in hierarchical checkbox interfaces to indicate that only some of a checkbox's descendants are checked.

## Description

Indeterminate checkboxes are displayed in a state which is distinct both from being checked or being unchecked. They are commonly used in hierarchical checkboxes to indicate that only some of the checkbox's descendants are checked.

## Specification

**Current Status:** Living Standard (ls)

**Specification URL:** [HTML Standard - DOM Input Indeterminate](https://html.spec.whatwg.org/#dom-input-indeterminate)

## Categories

- DOM
- HTML5

## Benefits & Use Cases

### Primary Use Cases

1. **Hierarchical Selection Lists**
   - Parent checkboxes that contain multiple child checkboxes
   - Visually indicates partial selection of child items
   - Improves user experience in tree-like interfaces

2. **Multi-Select Forms**
   - Data tables with row selection
   - List filters and options
   - Menu systems with grouped items

3. **User Interface Clarity**
   - Provides clear visual feedback about selection state
   - Distinguishes between "all selected," "none selected," and "some selected"
   - Reduces ambiguity in complex selection interfaces

### Key Benefits

- **Visual Clarity:** Distinct appearance makes selection state immediately obvious
- **User Experience:** Reduces confusion in multi-level selection scenarios
- **Accessibility:** Supports proper semantic markup and screen reader interpretation
- **DOM Control:** Can be set programmatically via JavaScript's `indeterminate` property
- **Styling:** Can be styled with CSS using the `:indeterminate` pseudo-class

## Implementation

### Setting Indeterminate State

```javascript
// Set indeterminate state
const checkbox = document.getElementById('parent-checkbox');
checkbox.indeterminate = true;

// Check indeterminate state
if (checkbox.indeterminate) {
  console.log('Checkbox is in indeterminate state');
}
```

### CSS Styling

```css
/* Style indeterminate checkboxes */
input[type="checkbox"]:indeterminate {
  background-color: #0066cc;
  border-color: #0066cc;
}
```

### Important Note

**Indeterminacy does not affect a checkbox's checkedness state.** It merely affects how the checkbox is displayed. The `checked` property remains independent of the indeterminate state.

## Browser Support

### Summary

- **Global Usage:** 93.42%
- **Status:** Excellent support across modern browsers
- **Main Limitation:** iOS Safari versions below 12.2

### Detailed Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 28+ | ✅ Full Support | All modern versions supported |
| **Firefox** | 3.6+ | ✅ Full Support | Supported since 3.6 |
| **Safari** | 6+ | ✅ Full Support | Supported since version 6 |
| **Edge** | 12+ | ✅ Full Support | All versions supported |
| **Opera** | 11.6+ | ✅ Full Support | Supported since 11.6 |
| **IE** | 6+ | ✅ Full Support | Supported since IE 6 |
| **iOS Safari** | 12.2+ | ✅ Full Support | **Not supported in versions below 12.2** |
| **Android Browser** | 4.4+ | ✅ Full Support | Supported since 4.4 |
| **Opera Mobile** | 80+ | ✅ Full Support | Supported in recent versions |
| **Samsung Internet** | 4+ | ✅ Full Support | All versions supported |

### Platform-Specific Support

#### Desktop Browsers
- **Windows:** All major browsers fully supported (IE 6+, Edge, Chrome, Firefox)
- **macOS:** All major browsers fully supported (Safari 6+, Chrome, Firefox, Edge)
- **Linux:** Chrome, Firefox, Edge, Opera fully supported

#### Mobile Browsers
- **iOS:** Supported in iOS Safari 12.2 and later (WebKit limitation in earlier versions)
- **Android:** Supported in Android Browser 4.4+ and modern Chrome/Firefox
- **Opera Mobile:** Supported in version 80+

#### Known Issues
- **Opera Mini:** Not supported (all versions)
- **Blackberry Browser:** Not supported
- **Legacy Android Versions:** Requires Android 4.4+

## Usage Statistics

- **Full Support (y):** 93.42%
- **Partial Support (a):** 0%
- **No Support (n):** Remaining percentage

This indicates widespread, reliable support across the global web platform.

## Related Resources

### Official Documentation
- [CSS-Tricks: Indeterminate Checkboxes](https://css-tricks.com/indeterminate-checkboxes/) - Comprehensive guide on implementation and styling

### Known Issues
- [WebKit Bug #160484](https://bugs.webkit.org/show_bug.cgi?id=160484) - iOS versions below 12 don't support indeterminate checkboxes

## Key Technical Notes

### Styling Considerations

The indeterminate state can be styled using CSS:

```css
/* Checkbox in indeterminate state */
input[type="checkbox"]:indeterminate {
  /* Custom styling */
}
```

### DOM API

Access the indeterminate property:

```javascript
// Read indeterminate state
const isIndeterminate = checkboxElement.indeterminate;

// Set indeterminate state
checkboxElement.indeterminate = true;
```

### Checkedness Independence

The indeterminate property is independent of the `checked` property:

```javascript
const checkbox = document.getElementById('my-checkbox');

// These can be set independently
checkbox.checked = false;          // Actual checked state
checkbox.indeterminate = true;     // Visual display state
```

## Implementation Best Practices

1. **Parent-Child Relationships:** Use indeterminate state for parent checkboxes when children have mixed selection states
2. **Clear State Management:** Implement logic to sync parent and child checkbox states
3. **Accessibility:** Ensure proper ARIA labels and semantic markup for screen readers
4. **Visual Feedback:** Provide clear CSS styling to differentiate indeterminate from checked states
5. **User Testing:** Verify that users understand the three-state checkbox interface
6. **Fallback Styling:** Ensure the interface remains usable in browsers with basic checkbox styling

## Migration Guide

### For Older Projects

If you're using legacy browsers that don't support indeterminate checkboxes, consider:

1. **Feature Detection:** Check for `indeterminate` property support
2. **Polyfills:** Implement custom styling with CSS classes as fallback
3. **Graceful Degradation:** Fall back to regular checkbox styling for unsupported browsers

```javascript
// Feature detection
if ('indeterminate' in HTMLInputElement.prototype) {
  // Use native indeterminate state
  checkbox.indeterminate = true;
} else {
  // Fallback to custom class-based styling
  checkbox.classList.add('indeterminate');
}
```

## Conclusion

The indeterminate checkbox is a well-supported, mature web platform feature with excellent browser compatibility (93.42% global usage). It provides significant user experience improvements for hierarchical selection interfaces and is recommended for modern web applications.

The primary consideration is iOS Safari support below version 12.2, which can be addressed with feature detection and fallback styling for older iOS devices.

---

**Last Updated:** 2025-12-13
**Data Source:** CanIUse Feature Database
