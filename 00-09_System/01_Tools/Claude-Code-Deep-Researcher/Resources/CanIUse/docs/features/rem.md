# REM (Root EM) Units

## Overview

The `rem` (root em) unit is a CSS length unit that measures relative to the font-size of the root element (`<html>`), rather than the font-size of the parent element like the `em` unit does. This prevents the compounding effect that occurs with `em` units, making `rem` a more predictable and scalable approach for responsive typography and spacing.

## Description

REM units scale relative to the **root element only**, avoiding the compounding issues inherent in `em` units. For example:

- **With `em`**: If a parent has `font-size: 1.5em` (18px on a 16px default), and a child has `font-size: 1.5em`, the child becomes 27px (1.5 × 18px).
- **With `rem`**: The same child would be 24px (1.5 × 16px root size), maintaining a linear relationship to the root.

This makes `rem` units ideal for:
- Consistent spacing and sizing across components
- Simplified responsive design logic
- Easier font-size scaling based on viewport

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification Link**: [W3C CSS Values and Units Module Level 3](https://www.w3.org/TR/css3-values/#font-relative-lengths)

## Category

- CSS3

## Browser Support

### Desktop Browsers

| Browser | Support | Details |
|---------|---------|---------|
| **Chrome** | ✅ Yes | Supported since Chrome 4 (2010) |
| **Firefox** | ✅ Yes | Supported since Firefox 3.6 (2010) |
| **Safari** | ✅ Yes | Supported since Safari 5 (2010) |
| **Edge** | ✅ Yes | Supported since Edge 12 (2015) |
| **Opera** | ✅ Yes | Supported since Opera 11.6 (2011) |
| **Internet Explorer** | ⚠️ Partial | IE 11: Full support; IE 9-10: Partial support with limitations (see Known Issues) |

### Mobile Browsers

| Browser | Support | Details |
|---------|---------|---------|
| **iOS Safari** | ✅ Yes | Supported since iOS 5 (2011), with limitations in iOS 5.0-5.1 with media queries |
| **Android Browser** | ✅ Yes | Supported since Android 2.1 (2010) |
| **Chrome Mobile** | ✅ Yes | Full support |
| **Firefox Mobile** | ✅ Yes | Full support |
| **Opera Mobile** | ✅ Yes | Supported since Opera Mobile 12 (2012) |
| **Samsung Internet** | ✅ Yes | Full support since Samsung Internet 4 |
| **UC Browser** | ✅ Yes | Supported in version 15.5+ |
| **Opera Mini** | ✅ Yes | Full support in all versions |

## Browser Support Summary

| Metric | Value |
|--------|-------|
| **Global Support** | 93.64% |
| **Partial Support** | 0.05% |
| **Unsupported** | 6.31% |

## Key Use Cases

### 1. **Responsive Typography**
Use `rem` to scale all text sizes proportionally based on a root font-size:

```css
html {
  font-size: 16px; /* Base size */
}

h1 {
  font-size: 2rem; /* 32px */
}

p {
  font-size: 1rem; /* 16px */
}

small {
  font-size: 0.875rem; /* 14px */
}
```

### 2. **Mobile-Friendly Scaling**
Adjust the root font-size for different screen sizes:

```css
@media (max-width: 600px) {
  html {
    font-size: 14px; /* All rem-based sizes scale down */
  }
}
```

### 3. **Consistent Component Spacing**
Use `rem` for margins and padding to maintain consistent spacing:

```css
.card {
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
}
```

### 4. **Layout and Grid Systems**
Create flexible layouts with proportional sizing:

```css
.container {
  width: 60rem; /* 960px at 16px root */
  margin: 0 auto;
}
```

## Benefits

✅ **No Compounding**: Unlike `em`, `rem` units don't compound across nested elements
✅ **Predictability**: All calculations reference the same root value
✅ **Maintainability**: Changing the root font-size automatically scales all `rem`-based values
✅ **Responsive Design**: Easy to implement font-size adjustments across breakpoints
✅ **Consistency**: Enforces a consistent spacing and sizing system
✅ **Accessibility**: Works well with user-set font preferences
✅ **Future-Proof**: A modern standard with excellent browser support

## Known Issues and Limitations

### 1. **Internet Explorer 9-10 (Partial Support)**
- ❌ **Issue**: REM units not supported in the `font` shorthand property (entire declaration is ignored)
- ❌ **Issue**: REM units not supported on `:before` and `:after` pseudo-elements, specifically for `line-height`
- 📌 **Workaround**: Use individual font properties instead of shorthand; use alternative units for pseudo-elements

### 2. **Chrome 31-34 (Font Size Bug)**
- ❌ **Issue**: Font size bug when the root element has a percentage-based font-size
- 📌 **Workaround**: Use explicit pixel values for the root font-size instead of percentages

### 3. **Chrome (Border Zoom Issue)**
- ❌ **Issue**: Borders sized in `rem` disappear when the page is zoomed out
- 📌 **Workaround**: Test zoom functionality; consider using pixel values for borders in affected scenarios

### 4. **Android 4.2-4.3 (Samsung Devices)**
- ❌ **Issue**: Does not work reliably on Samsung Note II (Android 4.3) or Samsung Galaxy Tab 2 (Android 4.2)
- 📌 **Workaround**: Provide fallback values in pixels

### 5. **iOS Safari 5.0-5.1**
- ❌ **Issue**: REM units don't work in combination with media queries
- 📌 **Workaround**: Use `em` units in media queries or provide pixel-based fallbacks

### 6. **iPhone 4 (Safari 5.1)**
- ❌ **Issue**: Causes content display and scrolling issues
- 📌 **Workaround**: Test thoroughly on older iOS devices; provide fallback values

## Recommendations

### Best Practices

1. **Set a Root Font-Size**: Establish a base value for easier calculations:
   ```css
   html {
     font-size: 16px; /* Standard default */
   }
   ```

2. **Use `rem` Consistently**: Apply `rem` across typography, spacing, and sizing for a cohesive system

3. **Provide Fallbacks for Old IE**: Use pixel fallbacks before `rem` declarations for IE 9-10:
   ```css
   font-size: 16px;      /* Fallback */
   font-size: 1rem;      /* Modern browsers */
   ```

4. **Test Across Breakpoints**: Verify that scaling works as expected at different viewport sizes

5. **Consider Accessibility**: Test with browser font-size preferences to ensure readability

### When NOT to Use REM

- **Borders and strokes**: Use pixels or `em` for fine-tuning visual elements in IE or older browsers
- **Media queries**: In very old iOS Safari (5.0-5.1), use `em` units instead
- **Legacy IE Support**: For IE 8 and below, fallback entirely to pixels

## Related Resources

- **Snook.ca Article**: [Font-size with rem](https://snook.ca/archives/html_and_css/font-size-with-rem) – Detailed explanation and practical examples
- **REM Polyfill**: [GitHub - REM Unit Polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill) – JavaScript polyfill for unsupported browsers
- **W3C Specification**: [CSS Values and Units Module Level 3](https://www.w3.org/TR/css3-values/#font-relative-lengths)
- **MDN Web Docs**: [rem - CSS | MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#relative_length_units)

## Example Implementation

```css
/* Root font-size establishes the rem baseline */
html {
  font-size: 16px;
}

/* Mobile: scale down the base */
@media (max-width: 600px) {
  html {
    font-size: 14px;
  }
}

/* All elements scale proportionally */
:root {
  --spacing-xs: 0.5rem;    /* 8px / 7px */
  --spacing-sm: 1rem;      /* 16px / 14px */
  --spacing-md: 1.5rem;    /* 24px / 21px */
  --spacing-lg: 2rem;      /* 32px / 28px */
}

body {
  font-size: 1rem;
  line-height: 1.5;
}

h1 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
}

p {
  font-size: 1rem;
  margin-bottom: var(--spacing-sm);
}

.container {
  max-width: 60rem;
  margin: 0 auto;
  padding: var(--spacing-md);
}
```

## Summary

REM (root em) units are a modern CSS standard with broad browser support (93.64% globally) that provides a reliable, maintainable approach to responsive sizing and typography. While there are legacy issues with Internet Explorer 9-10 and some edge cases in older mobile browsers, these can be mitigated with fallbacks and polyfills. For new projects and modern browser support, REM units are a best practice recommendation.

---

*Last Updated: 2025*
*Data Source: Can I Use (caniuse.com)*
