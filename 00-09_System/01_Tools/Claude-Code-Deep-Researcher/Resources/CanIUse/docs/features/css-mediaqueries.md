# CSS3 Media Queries

> Method of applying styles based on media information. Includes things like page and device dimensions.

---

## Specification

| Property | Value |
|----------|-------|
| **Status** | Recommended (REC) |
| **Specification** | [CSS Media Queries Level 3 - W3C](https://www.w3.org/TR/css3-mediaqueries/) |
| **Keywords** | `@media` |
| **Global Usage** | 93.69% |

---

## Category

- **CSS3**

---

## Overview

CSS Media Queries enable responsive web design by allowing developers to apply different CSS styles based on various media characteristics. This feature is fundamental to building websites that adapt seamlessly across different devices and viewport sizes.

---

## Benefits & Use Cases

### Primary Benefits

1. **Responsive Design**
   - Adapt layouts automatically based on screen size
   - Provide optimal user experience across all devices
   - Reduce need for separate mobile and desktop versions

2. **Device-Specific Styling**
   - Target specific device capabilities
   - Optimize for touch vs. pointer interfaces
   - Adjust styles based on screen resolution and pixel density

3. **Print Optimization**
   - Define print-specific styles
   - Hide unnecessary elements for printing
   - Optimize typography and spacing for physical output

4. **Accessibility**
   - Respect user preferences (prefers-reduced-motion, prefers-color-scheme)
   - Adapt interfaces for users with specific needs
   - Improve overall usability across contexts

### Common Use Cases

- **Viewport Width Queries** - Change layout based on screen size (mobile, tablet, desktop)
- **Device Orientation** - Adapt designs for portrait vs. landscape viewing
- **Print Styles** - Define how content appears when printed
- **Dark Mode Support** - Respect operating system color scheme preferences
- **Resolution/Density** - Optimize for high-DPI displays
- **Interaction Capabilities** - Detect touch or hover support

---

## Browser Support

### Support Legend

| Badge | Meaning | Implementation Notes |
|-------|---------|----------------------|
| ✅ **Full** | Complete support with no known issues | Fully compliant with specification |
| ⚠️ **Partial** | Limited or conditional support | See notes for details |
| ❌ **None** | No support | Not available in this version |

### Desktop Browsers

| Browser | First Full Support | Current Status | Notes |
|---------|-------------------|-----------------|-------|
| **Chrome** | 26 | ✅ Full | Chrome 4-25 had partial support (#1) |
| **Firefox** | 3.5 | ✅ Full | Versions 2-3 had no support |
| **Safari** | 4 | ✅ Full | Safari 3.1-3.2 had partial support (#1, #2) |
| **Opera** | 9.5 | ✅ Full | Opera 9 had no support |
| **Edge** | 12 | ✅ Full | Chromium-based Edge has full support throughout |
| **Internet Explorer** | 9 | ⚠️ Partial | IE 5.5-8 had no support; IE 9-11 have partial support (#1) |

### Mobile & Device Browsers

| Platform | Version | Status | Notes |
|----------|---------|--------|-------|
| **iOS Safari** | 3.2+ | ✅ Full | Versions 3.2-6.0 had partial support (#1) |
| **Android Browser** | 2.1+ | ✅ Full | Versions 2.1-4.1 had partial support (#1) |
| **Chrome Android** | 142 | ✅ Full | Current versions fully supported |
| **Firefox Android** | 144 | ✅ Full | Current versions fully supported |
| **Samsung Internet** | 4+ | ✅ Full | Consistently supported across versions |
| **Opera Mini** | All | ✅ Full | All versions fully supported |
| **Opera Mobile** | 10+ | ✅ Full | Consistent support since version 10 |
| **BlackBerry** | 7+ | ✅ Full | Supported in modern BlackBerry versions |
| **IE Mobile** | 10+ | ⚠️ Partial | Partial support with limitations (#1) |

### Coverage Summary

- **Global Usage Coverage**: 93.69% of users
- **Modern Desktop**: 100% support across all major browsers
- **Modern Mobile**: Consistently supported across all major platforms
- **Legacy Support**: Limited in Internet Explorer and older Safari/Chrome versions

---

## Known Issues & Limitations

### Issue #1: Nested Media Queries
**Affected Browsers**: Chrome 4-25, IE 9-11, Safari 3.1-6.0, iOS Safari 3.2-6.0, Android 2.1-4.1

Nested media queries are not supported, meaning you cannot nest `@media` rules within other `@media` rules in these browser versions.

**Workaround**:
```css
/* Instead of nested queries (not supported) */
@media screen and (max-width: 600px) {
  @media (prefers-color-scheme: dark) {
    /* This doesn't work in older browsers */
  }
}

/* Use separate media queries (works everywhere) */
@media screen and (max-width: 600px) and (prefers-color-scheme: dark) {
  /* This works in all browsers */
}
```

### Issue #2: Partial Reload Requirement
**Affected Browsers**: Safari 3.1-3.2

In these versions, different media rules are only acknowledged after a page reload. The browser does not dynamically apply media query styles when the viewport is resized.

### Issue #3: Scrollbar Width Calculation
**Affected Browsers**: Opera 12.1, IE 9

These browsers incorrectly include the scrollbar width when calculating window width for media queries based on `max-width`. This can cause styles to not apply at expected breakpoints.

**Workaround**: Account for scrollbar width (typically 15-17px) when setting breakpoints, or test extensively across these specific browsers.

### Issue #4: Firefox min-width Bug
**Affected Browsers**: Firefox 9 and earlier

Firefox has a bug where `min-width` media queries are not recognized initially, but the CSS rules inside those queries are still parsed and applied. This can lead to unpredictable styling behavior.

---

## Technical Details

### Syntax

```css
@media [media-type] and [feature] {
  /* CSS rules applied when conditions are met */
}
```

### Media Types

- `screen` - Computer screens
- `print` - Printed output
- `speech` - Screen readers and speech synthesizers
- `all` - All media types (default)

### Common Media Features

- `width`, `height` - Viewport dimensions
- `min-width`, `max-width` - Width ranges
- `min-height`, `max-height` - Height ranges
- `orientation` - `portrait` or `landscape`
- `device-width`, `device-height` - Device dimensions
- `resolution` - Screen resolution (dpi, dpcm, dppx)
- `prefers-color-scheme` - User preference for light/dark mode
- `prefers-reduced-motion` - User preference for reduced animation
- `hover`, `pointer` - Input device capabilities
- `color` - Color capability (bit depth)

### Example Usage

```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet and larger */
@media (min-width: 768px) {
  .container {
    width: 750px;
    padding: 20px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    width: 960px;
    padding: 30px;
  }
}

/* Print styles */
@media print {
  .navigation {
    display: none;
  }
  body {
    font-size: 12pt;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #ffffff;
  }
}
```

---

## Polyfills & Fallbacks

### For Internet Explorer Support

The [Respond.js](https://github.com/scottjehl/Respond) polyfill provides media query support for Internet Explorer 6-8:

```html
<!-- In the <head> tag -->
<!--[if lt IE 9]>
  <script src="respond.min.js"></script>
<![endif]-->
```

**Note**: Respond.js requires media queries to be in external stylesheets, not inline styles.

---

## Related Resources

### Official Documentation
- [W3C CSS Media Queries Specification](https://www.w3.org/TR/css3-mediaqueries/)
- [WebPlatform Docs - Media Queries](https://webplatform.github.io/docs/css/atrules/media)

### Tutorials & Guides
- [Media Queries Tutorial - Web Designer Wall](https://webdesignerwall.com/tutorials/responsive-design-with-css3-media-queries)
- [Practical Guide to Media Queries - Stack Diary](https://stackdiary.com/css-media-queries/)
- [IE Demo Page with Information](https://testdrive-archive.azurewebsites.net/HTML5/85CSS3_MediaQueries/)

### Tools & Resources
- [Respond.js - IE Polyfill](https://github.com/scottjehl/Respond)
- [Can I Use - Media Queries](https://caniuse.com/css-mediaqueries)
- [MDN Web Docs - Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)

### Related CSS Features
- [CSS Container Queries](../css-container-queries.md) - Query container size instead of viewport
- [CSS @supports Rule](../css-supports.md) - Feature detection for CSS
- [CSS Grid](../css-grid.md) - Responsive layout system
- [CSS Flexbox](../css-flexbox.md) - Flexible box layout

---

## Best Practices

1. **Mobile-First Approach**
   - Start with mobile styles
   - Use `min-width` media queries for larger screens
   - Progressive enhancement ensures better compatibility

2. **Semantic Breakpoints**
   - Choose breakpoints based on content, not device models
   - Common breakpoints: 480px, 768px, 1024px, 1280px
   - Test at various sizes, not just specific devices

3. **Performance Considerations**
   - Keep media query logic simple
   - Avoid excessive use of complex selectors in media queries
   - Consider performance implications of responsive images

4. **Accessibility**
   - Respect `prefers-reduced-motion` preferences
   - Ensure sufficient color contrast in all media queries
   - Test with different color schemes

5. **Cross-Browser Testing**
   - Test on actual devices when possible
   - Pay special attention to IE 9-11 limitations
   - Use feature detection for progressive enhancement

6. **Organization**
   - Group related media queries together
   - Consider using CSS preprocessors (Sass, Less) for organized media queries
   - Document non-obvious breakpoint choices

---

## Summary

CSS Media Queries are a foundational technology for responsive web design with near-universal browser support (93.69% global coverage). While legacy browsers like Internet Explorer have limitations, modern browsers provide full support. By understanding the known limitations and following best practices, developers can create robust, responsive designs that work across all devices and screen sizes.

The feature is stable and recommended by the W3C, making it a safe choice for any modern web project targeting contemporary browsers.
