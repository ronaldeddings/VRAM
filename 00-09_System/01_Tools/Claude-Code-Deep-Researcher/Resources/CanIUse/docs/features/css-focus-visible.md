# :focus-visible CSS Pseudo-Class

## Overview

The `:focus-visible` CSS pseudo-class applies styles to an element while it matches the `:focus` pseudo-class and the user agent determines via heuristics that the focus should be specially indicated on the element. This is typically rendered as a visible focus ring or similar indicator.

This feature is crucial for **accessibility**, allowing developers to provide keyboard navigation indicators without interfering with mouse or pointer users' experience. Modern browsers use smart heuristics to determine when a focus indicator should be visible based on the input method used (keyboard vs. pointer).

---

## Specification

| Property | Value |
|----------|-------|
| **Status** | Working Draft (WD) |
| **Specification Link** | [W3C CSS Selectors Level 4 - :focus-visible](https://w3c.github.io/csswg-drafts/selectors-4/#the-focus-visible-pseudo) |
| **Category** | CSS |

---

## Benefits & Use Cases

### Accessibility Benefits
- **Keyboard Navigation**: Provides clear visual indicators for keyboard users
- **Context Awareness**: Smart heuristics show focus indicators only when needed
- **Better UX**: Keyboard users get indicators while pointer users get cleaner UI
- **WCAG Compliance**: Helps meet Web Content Accessibility Guidelines requirements

### Practical Use Cases

1. **Custom Focus Styles for Forms**
   - Style form inputs with custom focus indicators visible only for keyboard navigation

2. **Accessible Button Designs**
   - Create buttons with visible focus rings for keyboard accessibility without affecting mouse users

3. **Navigation Components**
   - Highlight navigation items when accessed via keyboard, invisible with mouse interaction

4. **Interactive Widgets**
   - Build accessible dropdowns, menus, and custom controls with smart focus indicators

5. **Progressive Enhancement**
   - Differentiate between `:focus` (always visible) and `:focus-visible` (smart visibility)

### Example Code

```css
/* Show focus ring only for keyboard navigation */
button:focus-visible {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
}

/* Traditional :focus might still be needed for fallback */
button:focus {
    outline: 2px solid #4A90E2;
}

/* Custom style for form inputs */
input:focus-visible {
    border: 2px solid #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}
```

---

## Browser Support

### Desktop Browsers

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 86 | Partial support (behind flag) from v67+ |
| **Edge** | 86 | Partial support (behind flag) from v79+ |
| **Firefox** | 85 | Supported as `:-moz-focusring` since v4 |
| **Safari** | 15.4 | |
| **Opera** | 72 | Partial support (behind flag) from v66+ |

### Mobile & Extended Support

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **iOS Safari** | 15.4 | |
| **Android** | 142 | |
| **Samsung Internet** | 14.0 | |
| **Opera Mobile** | 80 | |
| **Android Chrome** | 142 | |
| **Android Firefox** | 144 | |
| **Baidu** | 13.52 | |
| **Opera Mini** | Not Supported | All versions |
| **UC Browser** | Not Supported | Tested v15.5+ |
| **IE** | Not Supported | All versions |

### Support Notes

- **#1**: Firefox and KaiOS implement this as the `:-moz-focusring` pseudo-class (prefixed variant)
- **#2**: Chrome, Edge, and Opera require enabling "Experimental Web Platform features" flag in `chrome://flags`
- **#3**: Safari versions 15.0-15.3 can enable via ":focus-visible pseudo-class" in the Experimental Features menu

---

## Global Browser Coverage

- **Full Support**: 91.7% of users have browsers with `:focus-visible` support
- **Partial Support**: Limited versions with experimental flags available
- **No Support**: IE (all versions), Opera Mini (all versions), older Safari and mobile browsers

---

## Implementation Notes

### Vendor Prefixes

| Vendor | Status | Implementation |
|--------|--------|-----------------|
| `-webkit-` | Not needed | Webkit uses standard `:focus-visible` |
| `-moz-` | Alternative | Use `:-moz-focusring` for Firefox compatibility before v85 |
| `-ms-` | Not applicable | IE does not support this feature |
| `-o-` | Not needed | Opera uses standard `:focus-visible` |

### Backwards Compatibility Strategy

For maximum compatibility, use both `:focus` and `:focus-visible`:

```css
/* Fallback for browsers without :focus-visible support */
button:focus {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
}

/* Modern browsers will only show this for keyboard users */
button:focus-visible {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
}

/* Firefox compatibility (pre-v85) */
button:-moz-focusring {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
}
```

### Heuristics

Browsers use the following heuristics to determine when to show `:focus-visible`:

1. **Keyboard Navigation**: Focus via Tab key or keyboard shortcuts → visible
2. **Pointer Interaction**: Focus via mouse click or touch → invisible
3. **Script Focus**: Behavior varies by browser
4. **Alternative Input Methods**: Screen readers and assistive technologies → varies by browser

---

## Known Issues & Bugs

No major outstanding bugs are currently documented in the CanIUse database.

### Historical Issues

- Chrome initially required experimental flag for implementation
- Safari required experimental features to be enabled before v15.4
- Firefox used vendor prefix `:-moz-focusring` for many versions before standardization

---

## Related Resources

### Official References
- [GitHub Prototype for :focus-visible](https://github.com/WICG/focus-visible) - Early prototype and discussion repository
- [MDN Documentation - :-moz-focusring](https://developer.mozilla.org/en-US/docs/Web/CSS/:-moz-focusring) - Firefox implementation details

### Browser Issue Trackers
- [Chrome Issue #817199](https://bugs.chromium.org/p/chromium/issues/detail?id=817199) - CSS Selectors 4 :focus-visible support
- [Blink Implementation Intent](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/-wN72ESFsyo) - Chromium implementation proposal
- [Mozilla Bugzilla #1437901](https://bugzilla.mozilla.org/show_bug.cgi?id=1437901) - Add :focus-visible (former :focus-ring)
- [Mozilla Bugzilla #1445482](https://bugzilla.mozilla.org/show_bug.cgi?id=1445482) - Implement :focus-visible pseudo-class
- [WebKit Bug #185859](https://bugs.webkit.org/show_bug.cgi?id=185859) - [selectors] Support for Focus-Indicated Pseudo-class: :focus-visible

---

## Standards & Specifications

### Current Status
- **Specification**: [CSS Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/#the-focus-visible-pseudo)
- **Standards Body**: W3C CSS Working Group
- **Stage**: Working Draft

### Standardization History
- Previously drafted as `:focus-ring` before adoption as `:focus-visible`
- Developed through the Web Incubation Community Group (WICG)
- Now part of the official CSS Selectors Level 4 specification

---

## Best Practices

### For Developers

1. **Always Provide Focus Indicators**
   - Ensure some form of focus indicator is visible (using `:focus` as fallback)

2. **Use :focus-visible First**
   - Target `:focus-visible` for modern browsers
   - Fall back to `:focus` for older browsers

3. **Consider Accessibility**
   - Make focus indicators clearly visible (sufficient contrast)
   - Use colors and patterns, not just color alone
   - Provide adequate outline offset for clarity

4. **Test Keyboard Navigation**
   - Verify focus indicators work with Tab key navigation
   - Test with screen readers and assistive technologies

5. **Remove Outline with Care**
   - Never use `outline: none` on focused elements without providing an alternative

### For Users with Disabilities

- Users relying on keyboard navigation benefit from clear focus indicators
- Screen reader users may benefit from additional ARIA attributes combined with :focus-visible
- High contrast mode users should test that focus indicators are visible

---

## Migration Guide

### From :focus to :focus-visible

If you currently use `:focus`, consider this migration pattern:

**Before (basic focus styling):**
```css
input:focus {
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}
```

**After (smart focus styling):**
```css
/* Fallback for non-supporting browsers */
input:focus {
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Override for browsers with smart focus detection */
input:focus:not(:focus-visible) {
    box-shadow: none; /* Remove for pointer users */
}
```

---

## See Also

- [MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [CSS Tricks: :focus-visible is here](https://css-tricks.com/focus-visible-is-here/)
- [Web.dev: Focus-visible](https://web.dev/articles/focus-visible)
- [WCAG 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)

---

**Last Updated**: December 2024
**Data Source**: CanIUse Browser Support Database
