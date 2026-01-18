# ::placeholder CSS Pseudo-Element

## Overview

The `::placeholder` CSS pseudo-element represents placeholder text in an input field. It provides a way to style the hint text that appears in form inputs to guide users on how to fill out the form correctly.

## Description

The placeholder text is a visual hint that displays when an input field is empty and provides guidance to users on what content should be entered. For example, a date-input field might display `YYYY-MM-DD` to clarify that numeric dates should be entered in year-month-day order.

The `::placeholder` pseudo-element allows developers to style this placeholder text independently of the input field itself, enabling control over:
- Text color
- Font size and style
- Opacity
- Font family
- Any other CSS text properties

## Specification

**Status:** Working Draft (WD)

**Spec URL:** https://w3c.github.io/csswg-drafts/css-pseudo-4/#placeholder-pseudo

## Categories

- CSS

## Benefits & Use Cases

### Key Use Cases

1. **Visual Consistency**
   - Match placeholder text styling with overall design system
   - Ensure placeholder text is accessible and readable
   - Create a unified form appearance across the application

2. **Improved User Experience**
   - Reduce visual clutter by using lighter/muted placeholder text
   - Provide clear guidance on expected input format
   - Better distinguish placeholder text from user-entered text

3. **Accessibility**
   - Control contrast ratio to meet WCAG standards
   - Ensure placeholder text remains visible to users with low vision
   - Distinguish between placeholder text and actual input values

4. **Form Enhancement**
   - Style placeholders to match form field designs
   - Create custom branded input experiences
   - Improve form usability through visual feedback

## Browser Support

### Support Status Legend

- **y** = Full support
- **a** = Partial support (requires vendor prefix)
- **n** = No support
- **x** = Requires vendor prefix

### Support Table

| Browser | Support | First Version | Notes |
|---------|---------|---------------|-------|
| **Chrome** | Full | 57 | Prefixed support from v4-56 |
| **Edge** | Full | 79 | Prefixed support from v12-78 |
| **Firefox** | Full | 51 | Prefixed support from v19-50 |
| **Safari** | Full | 10.1 | Prefixed support from v5-10.0 |
| **Opera** | Full | 44 | Prefixed support from v15-43 |
| **iOS Safari** | Full | 10.3 | Prefixed support from v4.2-10.2 |
| **Android** | Full | 142 | Prefixed support from v2.1-4.4.4 |
| **Samsung Internet** | Full | 7.2 | Prefixed support from v4-7.1 |
| **Opera Mobile** | Full | 80 | No support before v80 |
| **Opera Mini** | Not Supported | — | No support in any version |
| **Internet Explorer** | Not Supported | — | No support in any version |

### Global Browser Usage

- **Full Support:** 93.06%
- **Partial Support:** 0.15%
- **No Support:** ~6.79%

## Implementation

### Basic Syntax

```css
::placeholder {
  color: #888;
  font-size: 14px;
  opacity: 1;
}
```

### Vendor Prefixes

Due to early implementation variations, vendor prefixes are still required for some browsers:

```css
/* Standard (Firefox 51+, Chrome 57+, Safari 10.1+, Edge 79+) */
::placeholder {
  color: #999;
  opacity: 1;
}

/* WebKit browsers (Chrome, Safari, Edge, Opera - older versions) */
::-webkit-input-placeholder {
  color: #999;
  opacity: 1;
}

/* Firefox (versions 19-50) */
::-moz-placeholder {
  color: #999;
  opacity: 1;
}

/* Edge (older versions) */
::-ms-input-placeholder {
  color: #999;
  opacity: 1;
}
```

### Cross-Browser Compatible Example

```css
/* Use all variants for maximum compatibility */
input::placeholder,
input::-webkit-input-placeholder,
input::-moz-placeholder,
input::-ms-input-placeholder {
  color: #bbb;
  font-style: italic;
  opacity: 1;
}
```

## Notes

### Partial Support

Partial support refers to using alternate names:

- `::-webkit-input-placeholder` for Chrome/Safari/Opera (see [Chrome issue #623345](https://bugs.chromium.org/p/chromium/issues/detail?id=623345))
- `::-ms-input-placeholder` for Edge (also supports webkit prefix)

### Firefox Historical Note

Firefox 18 and below supported the `:-moz-placeholder` pseudo-class (with single colon) rather than the `::-moz-placeholder` pseudo-element (with double colon). Modern Firefox versions use the standard `::placeholder` syntax.

## Accessibility Considerations

1. **Contrast Ratios**
   - Ensure placeholder text meets WCAG contrast requirements
   - Avoid low opacity or very light colors
   - Test contrast with background colors

2. **Not a Replacement for Labels**
   - Placeholder text should not be the only form label
   - Always pair with visible `<label>` elements
   - Never rely on placeholder text alone for form instructions

3. **Mobile Considerations**
   - Placeholder text may disappear on focus on some mobile browsers
   - Provide additional context through labels or helper text
   - Test on actual mobile devices for accessibility

## Related Resources

- [CSS-Tricks: Style Placeholder Text](https://css-tricks.com/snippets/css/style-placeholder-text/)
- [MDN Web Docs: ::placeholder](https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder)
- [MDN Web Docs: ::-moz-placeholder](https://developer.mozilla.org/en-US/docs/Web/CSS/::-moz-placeholder)
- [CSSWG Discussion](https://wiki.csswg.org/ideas/placeholder-styling)
- [Mozilla Bug #1069012](https://bugzilla.mozilla.org/show_bug.cgi?id=1069012)

## See Also

- [`:placeholder-shown` Pseudo-Class](https://developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown)
- [HTML Placeholder Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/placeholder)
- [Form Input Styling](https://developer.mozilla.org/en-US/docs/Learn/Forms)

---

*Last Updated: 2025*
*Data Source: CanIUse.com*
