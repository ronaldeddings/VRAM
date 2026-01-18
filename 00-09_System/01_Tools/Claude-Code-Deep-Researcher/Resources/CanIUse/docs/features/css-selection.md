# ::selection CSS Pseudo-Element

## Overview

The `::selection` CSS pseudo-element applies styling rules to the portion of a document that has been highlighted (e.g., selected with the mouse or another pointing device) by the user. This feature allows developers to customize the appearance of text and element selections to match their design system.

## Description

When users select content in a webpage, the `::selection` pseudo-element provides control over how that selected content is styled. This includes the background color, text color, and other text properties of the selection highlight.

### Typical Use Cases

- Customize selection colors to match brand identity
- Improve readability by adjusting contrast of selection highlights
- Create cohesive visual experiences with selection styling
- Enhance accessibility by providing high-contrast selection indicators

## Specification Status

- **Status**: Working Draft (WD)
- **W3C Specification**: [CSS Pseudo-Elements Module Level 4](https://www.w3.org/TR/css-pseudo-4/#selectordef-selection)
- **Maturity**: Stable in implementation, though still in working draft status

## Categories

- CSS

## Browser Support

### Desktop Browsers

| Browser | Supported Since | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome** | v4 | ✅ Full Support | All versions from 4 onwards |
| **Firefox** | v2 | ✅ Full Support (v62+) | Supported since v2 with `-moz-` prefix; unprefixed from v62 |
| **Safari** | v3.1 | ✅ Full Support | All versions from 3.1 onwards |
| **Edge** | v12 | ✅ Full Support | All versions from 12 onwards |
| **Opera** | v9.5 | ✅ Full Support | Supported from v9.5; not in v9 |
| **Internet Explorer** | v9 | ✅ Partial Support | IE 9-11 supported; no support in IE 5.5-8 |

### Mobile Browsers

| Platform | Browser | Support Status | Notes |
|----------|---------|----------------|-------|
| **iOS Safari** | All versions | ❌ Not Supported | Not available on any iOS Safari version |
| **Android Browser** | v4.4+ | ✅ Supported | Supported from Android 4.4 onwards |
| **Chrome Android** | Latest | ✅ Supported | Full support on Android Chrome |
| **Firefox Android** | Latest | ✅ Supported | Full support on Android Firefox |
| **Samsung Internet** | v4+ | ✅ Supported | Supported from v4 onwards |
| **Opera Mini** | All versions | ❌ Not Supported | Not available in Opera Mini |
| **Opera Mobile** | v11.5+ | ✅ Supported | Supported from v11.5 onwards (uncertain in v10-11.1) |
| **IE Mobile** | v10-11 | ✅ Supported | Available in IE Mobile 10 and 11 |
| **UC Browser** | v15.5+ | ✅ Supported | Supported from v15.5 onwards |
| **Blackberry Browser** | v10+ | ✅ Supported | Supported from v10; not in v7 |
| **KaiOS** | v3.0+ | ✅ Supported | Full support from v3.0 onwards; v2.5 has prefix support |
| **Baidu Browser** | v13.52+ | ✅ Supported | Available in recent versions |
| **QQ Browser** | v14.9+ | ✅ Supported | Available in recent versions |

### Support Summary

- **Global Support**: 84.33% of users
- **Universally Available**: Desktop and modern mobile browsers
- **Notable Limitation**: iOS Safari does not support `::selection`
- **Legacy Support**: Full support since IE 9 on desktop

## Syntax & Implementation

```css
::selection {
  background-color: #3498db;
  color: #ffffff;
}

/* With vendor prefix for older Firefox versions */
::-moz-selection {
  background-color: #3498db;
  color: #ffffff;
}
```

### Supported CSS Properties

When styling with `::selection`, you can apply the following CSS properties:
- `background-color`
- `color` (text color)
- `text-shadow`
- `stroke` (in SVG)
- `fill` (in SVG)

## Known Issues & Limitations

### Safari Multi-Column Layout Bug

In Safari, `::selection` styles do not work correctly when used in combination with CSS multi-column layouts. When content is displayed in multiple columns using `column-count` or `column-width`, the selection styling may not be applied as expected.

**Workaround**: Avoid using `::selection` styling with multi-column layouts in Safari, or test thoroughly before deployment.

## Usage & Examples

### Basic Example

```css
/* Style selected text */
::selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### Darker Selection Highlight

```css
::selection {
  background-color: #2196f3;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}
```

### Element-Specific Selection

```css
/* Custom selection for paragraphs */
p::selection {
  background-color: #4caf50;
  color: white;
}

/* Different color for links */
a::selection {
  background-color: #ff9800;
  color: white;
}
```

### High-Contrast Selection for Accessibility

```css
::selection {
  background-color: #000;
  color: #ffff00;
}
```

## Benefits & Use Cases

### Brand Consistency
Customize selection colors to align with your brand's color palette, creating a more cohesive visual experience throughout your application.

### Improved Accessibility
Provide high-contrast selection highlights to improve visibility for users with low vision or color vision deficiency.

### Enhanced User Experience
Create intuitive visual feedback that helps users understand what content they've selected.

### Professional Polish
Small details like custom selection styling contribute to a polished, professional appearance.

### Readability
Adjust selection colors to maintain good contrast and readability between the selected text and its background.

## Considerations & Best Practices

1. **Maintain Contrast**: Always ensure sufficient color contrast between the selection background and text color for readability
2. **Test Across Browsers**: Test your selection styling in all target browsers, especially noting iOS Safari limitations
3. **Consider Mobile**: Remember that selection styling may appear differently on touch devices
4. **Accessibility**: Use colors that work for colorblind users; don't rely on color alone to convey information
5. **Avoid Extreme Styles**: Subtle customization is usually better than radical changes to selection appearance
6. **CSS Only**: Selection styling cannot be animated or use pseudo-elements within the `::selection` pseudo-element

## Related Features

- [`::target-text` pseudo-element](https://caniuse.com/css-target-text) - Styles text matched by URL fragments
- [`::marker` pseudo-element](https://caniuse.com/css-marker) - Styles list markers
- [`::first-line` pseudo-element](https://caniuse.com/css-first-line) - Styles the first line of text
- [CSS Colors Module](https://www.w3.org/TR/css-color-4/) - Complete color specification

## Resources & References

- **MDN Web Docs**: [::selection - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection)
- **Quirksmode Test**: [::selection test](https://quirksmode.org/css/selectors/selection.html)
- **W3C Specification**: [CSS Pseudo-Elements Module Level 4 - Selection](https://www.w3.org/TR/css-pseudo-4/#selectordef-selection)

## Quick Reference

| Property | Status | Support |
|----------|--------|---------|
| `::selection` pseudo-element | Working Draft | 84.33% of users |
| Desktop Support | ✅ Universal | Chrome, Firefox, Safari, Edge, Opera, IE9+ |
| Mobile Support | ⚠️ Limited | No iOS Safari; available on Android browsers |
| Vendor Prefix | `::-moz-selection` | Firefox < 62 |
| Important Limitation | Safari Multi-Column | Selection doesn't work with CSS columns |

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse.com*
