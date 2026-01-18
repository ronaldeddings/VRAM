# CSS Variables (Custom Properties)

## Overview

CSS Variables, formally known as CSS Custom Properties, allow developers to declare and use cascading variables in stylesheets. This feature enables dynamic styling, improved maintainability, and reduced code duplication in modern web applications.

## Description

CSS Variables (or Custom Properties) permit the declaration and usage of cascading variables in stylesheets. They allow you to define values once and reuse them throughout your stylesheets, with the ability to update them dynamically at runtime. Variables are inherited and can be scoped to specific elements, making them powerful tools for theming, responsive design, and managing design tokens.

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification URL**: https://www.w3.org/TR/css-variables/
- **Category**: CSS3

## Key Features & Benefits

### Benefits

- **Maintainability**: Define colors, fonts, and spacing values once, update them globally
- **Dynamic Theming**: Change variable values at runtime using JavaScript for dark mode and custom themes
- **Reduced Duplication**: Eliminate repetitive values across your stylesheets
- **Scoped Values**: Variables are inherited and can be scoped to specific elements or pseudo-classes
- **Calculation Support**: Use `calc()` with CSS variables for flexible responsive designs
- **Improved Readability**: Semantic variable names make stylesheets more understandable

### Use Cases

- **Design Systems**: Implement design tokens and maintain consistent branding
- **Theme Switching**: Enable dark mode, light mode, and custom user themes
- **Responsive Design**: Adjust spacing and sizing variables based on media queries
- **Component Styling**: Create flexible, reusable component styling patterns
- **Dynamic Color Schemes**: Programmatically adjust colors based on user preferences or content
- **Gradual Migrations**: Update existing stylesheets gradually with variable support

## Browser Support

CSS Variables have achieved broad browser support across all major platforms. The table below shows detailed version information:

| Browser | Support Status | First Version | Notes |
|---------|---|---|---|
| **Chrome** | Full ✅ | v49 | Enabled by default since v49 |
| **Edge** | Full ✅ | v16 | Partial support in v15 with known bugs |
| **Firefox** | Full ✅ | v31 | Fully supported since v31 |
| **Safari** | Full ✅ | v10 | Partial support in v9.1 with nested calculation bugs |
| **Opera** | Full ✅ | v36 | Enabled by default since v36 |
| **iOS Safari** | Full ✅ | v10.0 | Partial support in v9.3 |
| **Android Browser** | Full ✅ | v5.0+ | Modern versions fully supported |
| **Samsung Internet** | Full ✅ | v5.0 | Supported since v5.0 |
| **Internet Explorer** | Not Supported ❌ | — | No support across all versions |
| **Opera Mini** | Not Supported ❌ | — | Not supported |
| **UC Browser** | Full ✅ | v15.5+ | Supported |
| **Baidu Browser** | Full ✅ | v13.52+ | Supported |
| **KaiOS** | Full ✅ | v2.5+ | Supported |

### Global Usage Statistics

- **Full Support (y)**: 93.12% of users
- **Partial Support (a)**: 0.01% of users
- **Usage Coverage**: 93.13% total coverage

## Known Issues & Limitations

### Documented Bugs

#### Edge v15
- **Pseudo-elements**: CSS variables cannot be used in pseudo-elements
- **Animations**: Animations with CSS variables may cause the webpage to crash
- **Nested Calculations**: Nested calculations with CSS variables are not computed and are ignored

**References**:
- [Pseudo-element issue](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/)
- [Animation crash issue](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11676012/)
- [Nested calculation issue](https://web.archive.org/web/20171216000230/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12143022/)

#### Safari v9.1 to v9.3
- **Nested Calculations**: Nested calculations using intermediate CSS Custom Properties don't work and are ignored

**Reference**: [WebKit Bug Report](https://bugs.webkit.org/show_bug.cgi?id=161002)

### Implementation Notes

- **Chrome v48**: Experimental support available via the "Experimental Web Platform features" flag in `chrome://flags`
- **Opera v35**: Experimental support available
- **IE11 Fallback**: Consider using a polyfill for IE11 support if needed

## Implementation Notes

### Basic Syntax

```css
/* Define variables */
:root {
  --primary-color: #3498db;
  --spacing-unit: 8px;
  --font-size-base: 16px;
}

/* Use variables */
body {
  color: var(--primary-color);
  margin: var(--spacing-unit);
  font-size: var(--font-size-base);
}

/* With fallback values */
.button {
  background-color: var(--button-bg, #3498db);
}
```

### Dynamic Updates with JavaScript

```javascript
// Set variable value
document.documentElement.style.setProperty('--primary-color', '#e74c3c');

// Get variable value
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary-color');
```

### Important Considerations

- **Scope**: Variables defined in `:root` are available globally; define in specific selectors for local scope
- **Inheritance**: CSS variables are inherited like regular properties
- **Fallbacks**: Always provide fallback values when variable support might be missing
- **Calc Support**: Combine with `calc()` for dynamic calculations
- **IE11 Support**: Use polyfills (e.g., css-variables-polyfill) for IE11 compatibility if required

## Resources & References

### Official Documentation

- [MDN Web Docs - Using CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)
- [W3C Specification](https://www.w3.org/TR/css-variables/)
- [Edge Dev Blog - CSS Custom Properties](https://blogs.windows.com/msedgedev/2017/03/24/css-custom-properties/)

### Community Resources

- [Mozilla Hacks - CSS Variables in Firefox Nightly](https://hacks.mozilla.org/2013/12/css-variables-in-firefox-nightly/)

### Polyfills & Fallbacks

- [IE11 Polyfill](https://github.com/nuxodin/ie11CustomProperties) - For Internet Explorer 11 support

## Summary

CSS Variables have become an essential tool for modern web development, with near-universal browser support across all major platforms except Internet Explorer. The feature enables powerful theming capabilities, improved code maintainability, and dynamic styling solutions. With only minor bugs in older versions of Edge and Safari, CSS Variables can be safely adopted in production applications with appropriate fallbacks for IE11 if needed.

---

**Last Updated**: 2025-12-13
**Data Source**: CanIUse CSS Variables Feature Data
