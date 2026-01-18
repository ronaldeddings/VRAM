# tabindex Global Attribute

## Overview

The `tabindex` global HTML attribute specifies the focusability of an element and the order in which it should receive focus when "tabbing" through a document using the keyboard.

## Description

The `tabindex` attribute allows developers to:
- **Control Focusability**: Make normally non-focusable elements (like `<div>` or `<span>`) focusable via keyboard navigation
- **Define Tab Order**: Specify a custom order for keyboard navigation through focusable elements
- **Remove from Tab Order**: Exclude interactive elements from the natural tab sequence while keeping them accessible programmatically

### Value Types

- **Positive Integer** (1-32767): Makes the element focusable and prioritizes it in the tab order (1 is highest priority)
- **0**: Makes the element focusable and includes it in the natural tab order
- **-1**: Makes the element focusable only via JavaScript, excludes it from keyboard tab navigation
- **No attribute**: Element follows default focusability rules based on its type

## Specification

- **Status**: Living Standard (ls)
- **Specification URL**: [HTML Living Standard - tabindex](https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex)
- **Category**: HTML5

## Browser Support

### Desktop Browsers

| Browser | Support | First Version | Notes |
|---------|---------|---|-------|
| **Internet Explorer** | Partial | 7 | Supported from IE 7+; IE 5.5-6 unsupported |
| **Edge** | Yes | 12 | Full support across all versions |
| **Chrome** | Yes | 15 | Full support from Chrome 15+ |
| **Firefox** | Yes | 4 | Full support from Firefox 4+ |
| **Safari** | Yes | 5.1 | Full support from Safari 5.1+; platform-specific limitations |
| **Opera** | Yes | 9.5 | Full support from Opera 9.5+ |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | Yes | Supported from iOS 3.2+; keyboard access limitations apply |
| **Android Browser** | Unsupported | Lacks method for tabbing through fields |
| **Chrome Android** | Yes | Full support in modern versions |
| **Firefox Android** | Yes | Full support in modern versions |
| **Opera Mini** | Unsupported | No keyboard access method |
| **Opera Mobile** | Partial | Supported from version 80+ |
| **Samsung Internet** | Unsupported | Limited support for keyboard navigation |

### Overall Browser Support

**91.3%** of users have browsers with full `tabindex` support.

## Usage Recommendations

### When to Use tabindex

#### Positive Values (1+)
- Generally **not recommended** for most use cases
- Creates a confusing custom tab order that breaks natural document flow
- Use only when there's a strong UX rationale and extensive testing
- Example: Complex data entry forms where a specific workflow is optimal

#### Value 0
- **Recommended** for making custom components focusable
- Maintains natural document flow in tab order
- Preferred for interactive custom elements (buttons, toggles, etc.)

```html
<!-- Make a custom element keyboard accessible -->
<div role="button" tabindex="0">Click me</div>
```

#### Value -1
- **Recommended** for managing focus programmatically
- Removes element from keyboard tab order
- Useful for modal dialogs, dropdown menus, or focus management
- Requires JavaScript to manage focus

```html
<!-- Programmatically focusable via JavaScript -->
<div id="popup" tabindex="-1" role="dialog">Modal content</div>
```

### Best Practices

1. **Prefer Semantic HTML**: Use native interactive elements (`<button>`, `<a>`, `<input>`) instead of custom elements with tabindex
2. **Maintain Logical Order**: Don't use positive tabindex values; instead, arrange elements in the correct order in your HTML
3. **Combine with ARIA Roles**: Always pair `tabindex` with appropriate `role` attributes for custom interactive elements
4. **Test Keyboard Navigation**: Verify tab order works intuitively across your application
5. **Consider Mobile Users**: Remember that many mobile browsers don't support keyboard tabbing

## Platform-Specific Notes

### macOS Limitations

#### Firefox
On macOS, `<a>` elements are not keyboard-focusable by default, even with `tabindex="0"`, unless **Full Keyboard Access** is enabled.

**To Enable Full Keyboard Access on macOS**:
- Open System Preferences
- Navigate to: Keyboard → Shortcuts
- Set "Full Keyboard Access" to "All controls"

#### Safari & Webkit-based Browsers
- `<a>` elements are never keyboard-focusable, even with `tabindex="0"`
- Without Full Keyboard Access: `<button>`, radio buttons, and checkboxes are not keyboard-focusable
- This is a browser design choice, not a `tabindex` limitation

### Mobile Device Notes

**iOS Safari Features**:
- Supports `tabindex` for keyboard-accessible form fields
- Virtual keyboard includes "Previous" and "Next" buttons that follow tabindex order
- Tab order is honored when available

**Android & Other Mobile Browsers**:
- Limited support because native keyboard navigation isn't available
- Most mobile devices use touch interaction, not tab navigation
- "Unknown" support indicates lack of tabbing mechanism

## Known Issues

### Edge Bug

**Issue**: [Edge Bug 4355703](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4365703/)

The `tabIndex` attribute getter returns `0` instead of `-1` for elements without an explicit `tabindex` attribute.

**Workaround**: Always explicitly set `tabindex` when you need to distinguish between `-1` and the default value.

```javascript
// Problematic in Edge
const value = element.tabIndex; // Returns 0 for elements without tabindex

// Better approach
const value = element.getAttribute('tabindex'); // Returns null or the actual value
```

## Related Resources

- **[MDN Web Docs - tabindex attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)** - Comprehensive documentation and examples
- **[WCAG 2.1 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)** - Accessibility standards for focus indicators
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)** - Guidelines for accessible custom components

## Summary

The `tabindex` attribute is widely supported across modern browsers (91.3% global usage) and is essential for making custom interactive components keyboard accessible. While generally well-supported, developers should be aware of platform-specific limitations on macOS and reduced functionality on mobile devices. Follow accessibility best practices by using semantic HTML elements when possible and reserving `tabindex` for custom interactive components that genuinely require it.
