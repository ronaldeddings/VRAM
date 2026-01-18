# CSS Outline Properties

## Overview

CSS outline properties provide a way to draw a border around elements that does not affect the document layout. This feature is particularly useful for highlighting elements, focusing on interactive components, and creating visual indicators without disrupting the page flow.

## Description

The CSS outline properties draw a border around an element that does not affect layout, making it ideal for highlighting. This covers the `outline` shorthand, as well as `outline-width`, `outline-style`, `outline-color` and `outline-offset`.

Unlike borders, outlines:
- Do not take up space in the layout model
- Can be non-rectangular (following the shape of the element)
- Are typically used for visual feedback and emphasis
- Are commonly used for focus indicators and accessibility features

## Specification Status

| Property | Status |
|----------|--------|
| Specification Status | **Candidate Recommendation (CR)** |
| Spec URL | [CSS Basic User Interface Module Level 3](https://w3c.github.io/csswg-drafts/css-ui/) |

## Properties Covered

This feature includes support for the following CSS outline properties:

- **`outline`** - Shorthand property for width, style, and color
- **`outline-width`** - Specifies the width/thickness of the outline
- **`outline-style`** - Specifies the style (solid, dashed, dotted, etc.)
- **`outline-color`** - Specifies the color of the outline
- **`outline-offset`** - Specifies the space between the element and its outline

## Categories

- **CSS3**

## Use Cases & Benefits

### Accessibility
- Creating visible focus indicators for keyboard navigation
- Highlighting interactive elements for users with visual impairments
- Meeting WCAG compliance requirements for focus visibility

### User Experience
- Providing visual feedback on interactive elements
- Creating emphasis without affecting layout
- Highlighting form validation states
- Drawing attention to important content

### Visual Design
- Creating layered visual effects
- Non-destructive highlighting of elements
- Emphasis and highlighting without altering page structure
- Creating focus states that don't disrupt layout

## Code Examples

### Basic Outline
```css
/* Simple outline on focus */
button:focus {
  outline: 2px solid #0066cc;
}
```

### Outline with Offset
```css
/* Outline with space between element and border */
input:focus {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}
```

### Custom Outline Style
```css
/* Dashed outline with custom color */
.highlight {
  outline: 2px dashed #ff6600;
  outline-offset: 4px;
}
```

### Invert Outline (for dark backgrounds)
```css
/* Invert outline color for visibility on dark backgrounds */
.dark-mode button:focus {
  outline: 2px solid;
  outline-color: invert;
}
```

## Browser Support

### Support Legend
- **Y** - Fully supported
- **A** - Partial support (with notes)
- **N** - Not supported

### Desktop Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| Chrome | 4 | 146+ | Fully supported |
| Firefox | 2 | 148+ | Fully supported |
| Safari | 3.1 | 18.5+ | Fully supported |
| Edge | 15 | 143+ | Fully supported |
| Opera | 11.6 | 122+ | Fully supported (partial support from v9) |
| Internet Explorer | 8 | 11 | Partial support (no `outline-offset`) |

### Mobile Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| iOS Safari | 3.2 | 18.5+ | Fully supported |
| Chrome Mobile | 142 | Latest | Fully supported |
| Firefox Mobile | 144 | Latest | Fully supported |
| Samsung Internet | 4 | 29+ | Fully supported |
| Opera Mobile | 12 | 80+ | Fully supported (partial from v10) |
| Android Browser | 2.1 | 4.4+ | Fully supported |

### Legacy & Alternative Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| Opera Mini | Not Supported | - |
| Opera Mobile | Partial (v10-11.5) | No `outline-offset` support |
| IE Mobile | Partial (v10-11) | No `outline-offset` support |
| BlackBerry | Fully supported | v7, v10 |
| UC Browser | Fully supported | v15.5+ |
| Baidu Browser | Fully supported | v13.52+ |
| QQ Browser | Fully supported | v14.9+ |
| KaiOS | Fully supported | v2.5+ |

## Implementation Notes

### Known Limitations

1. **`outline-offset` not supported in older browsers**
   - Internet Explorer 8-11 does not support the `outline-offset` property
   - Opera 9-11.5 does not support `outline-offset`
   - Opera Mobile versions 10-11.5 do not support `outline-offset`

2. **`outline-color: invert` optional implementation**
   - Some browsers implement the `invert` value for `outline-color` as optional
   - This value is useful for creating outlines visible on any background
   - May not be available in all browsers

### Best Practices

1. **Accessibility First**
   - Always ensure focus states are clearly visible
   - Test with keyboard navigation
   - Consider users with color blindness (use patterns, not just color)

2. **Design Considerations**
   - Avoid using `outline: none` without providing alternative focus indicators
   - Use sufficient contrast for visibility
   - Consider `outline-offset` for spacing when appropriate

3. **Performance**
   - Outlines are performant and don't trigger layout recalculations
   - Safe to use in `:focus`, `:hover`, and animated states

4. **Browser Compatibility**
   - For maximum compatibility, provide fallbacks for `outline-offset`
   - Consider using alternative focus styling for IE11 and older
   - Test across target browsers and devices

### Polyfills & Workarounds

For browsers without `outline-offset` support (IE 11 and older):

```css
/* Fallback using box-shadow for outline offset effect */
button:focus {
  outline: 2px solid #0066cc;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3);
}
```

## Global Usage Statistics

- **Full Support**: 93.27% of global browser usage
- **Partial Support**: 0.42% of global browser usage
- **No Support**: 6.31% of global browser usage

## Related Features

- CSS `border` properties (alternative for layout-affecting borders)
- CSS `box-shadow` (can be used to create outline-like effects)
- CSS `:focus` and `:focus-visible` pseudo-classes
- CSS `outline-radius` (experimental, non-standard property)

## Resources & References

### Official Specifications
- [CSS Basic User Interface Module Level 3 - Outline](https://drafts.csswg.org/css-ui-3/#outline)
- [W3C CSS UI Specification](https://w3c.github.io/csswg-drafts/css-ui/)

### Documentation & Guides
- [MDN Web Docs - CSS outline](https://developer.mozilla.org/en-US/docs/CSS/outline)
- [MDN - outline-width](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-width)
- [MDN - outline-style](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style)
- [MDN - outline-color](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-color)
- [MDN - outline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset)

### Testing & Compatibility
- [Can I Use - CSS outline](https://caniuse.com/outline)
- [Browser Compatibility Table](https://developer.mozilla.org/en-US/docs/Web/CSS/outline#browser_compatibility)

## Keywords

- `-moz-outline`
- `outline-width`
- `outline-style`
- `outline-color`
- `outline-offset`
- `outline-radius`

---

**Last Updated**: December 2024
**Feature Status**: Stable and widely supported across modern browsers
