# Alternate Stylesheet

## Overview

The **alternate stylesheet** feature enables websites to provide multiple style sheets to users, allowing them to switch between different visual presentations or themes of a page. This is accomplished through the `rel="alternate stylesheet"` attribute on HTML link elements.

## Description

Ability to support alternative styles to an HTML page. Users can select from predefined stylesheets to customize the visual appearance of a website without changing the underlying HTML structure or content.

## Specification

- **Status**: Living Standard (ls)
- **Specification Link**: [HTML Living Standard - Link Type Stylesheet](https://html.spec.whatwg.org/multipage/semantics.html#link-type-stylesheet)
- **Working Group**: WHATWG

## Categories

- HTML5
- HTML5

## Benefits and Use Cases

### Key Benefits

1. **User Personalization**: Allow visitors to choose their preferred visual theme or color scheme
2. **Accessibility**: Enable high-contrast or text-enlargement stylesheets for users with visual impairments
3. **Multiple Design Themes**: Support light/dark mode switching without page reload
4. **Dynamic Styling**: Implement theme selection systems with persistent user preferences
5. **A/B Testing**: Test different visual designs with different user groups
6. **Regional Customization**: Provide locale-specific styling for different markets

### Common Use Cases

- **Dark Mode / Light Mode Toggle**: Allow users to switch between color schemes
- **Accessibility Enhancements**: Provide high-contrast or dyslexia-friendly stylesheets
- **Language-Specific Layouts**: Different stylesheets for RTL vs LTR languages
- **Corporate Theme Switching**: Multiple brand themes for multi-tenant applications
- **Font Size Variations**: User-controlled typography adjustments
- **Print Stylesheets**: Alternative styling optimized for printing

## Browser Support

### Support Status Legend

| Status | Meaning |
|--------|---------|
| ✅ **Yes (y)** | Fully supported |
| ⚠️ **Unknown (u)** | Unknown/Partial support |
| ❌ **No (n)** | Not supported |

### Summary by Browser

| Browser | First Full Support | Current Status |
|---------|-------------------|---|
| **Internet Explorer** | 8 | ✅ IE 8-11 supported |
| **Firefox** | 2 | ✅ Supported from Firefox 2+ |
| **Chrome** | ❌ Not supported | ❌ No support (v4-146) |
| **Safari** | ❌ Not supported | ❌ No support (3.1-26.0) |
| **Opera** | 9 | ✅ 9-12.1 supported; ⚠️ 15+ partially supported |
| **iOS Safari** | ❌ Not supported | ❌ No support (3.2-18.5) |
| **Android Browser** | ❌ Not supported | ❌ No support (2.1-142) |
| **Edge** | ❌ Not supported | ❌ No support (12-143) |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | First Version | Support | Notes |
|---------|---|---|---|
| **IE/Edge (Chromium-based)** | IE 8+ | ✅ IE 8-11 | Full support via HTML parsing |
| | Edge 12-143 | ❌ | Not supported in Chromium-based Edge |
| **Firefox** | 2 | ✅ All versions | Full support since earliest versions |
| **Chrome** | 4-146 | ❌ | No native support; requires extensions |
| **Safari** | 3.1-26.0 | ❌ | Not implemented |
| **Opera** | 9-12.1 | ✅ | Full support in Presto engine |
| | 15+ | ⚠️ | Partial/Unknown support (Blink engine) |

#### Mobile Browsers

| Browser | Support Status | Notes |
|---------|---|---|
| **iOS Safari** | ❌ Not supported | No support across any version |
| **Android Browser** | ❌ Not supported | No support across any version |
| **Chrome (Android)** | ⚠️ Unknown | v142 shows unknown support |
| **Firefox (Android)** | ⚠️ Unknown | v144 shows unknown support |
| **Samsung Internet** | ⚠️ Unknown | Versions 4-29 show unknown support |
| **Opera Mobile** | ⚠️ Unknown | 10-12.1 unknown; v80 not supported |
| **IE Mobile** | ⚠️ Unknown | Versions 10-11 show unknown support |

## Usage Statistics

- **Full Support Usage**: 2.36% of tracked websites
- **Partial Support Usage**: 0% of tracked websites
- **Requires Vendor Prefix**: No

## HTML Syntax

### Basic Implementation

```html
<!-- Define stylesheets with rel="alternate stylesheet" -->
<link rel="stylesheet" href="/styles/default.css" title="Default">
<link rel="alternate stylesheet" href="/styles/dark.css" title="Dark Theme">
<link rel="alternate stylesheet" href="/styles/high-contrast.css" title="High Contrast">
```

### Attributes

- **rel="stylesheet"** - Primary stylesheet (always active)
- **rel="alternate stylesheet"** - Alternative stylesheet (requires user selection)
- **title** - Name of the stylesheet (displayed in browser stylesheet selection menu)
- **href** - URL to the CSS file
- **media** - Optional: CSS media query for conditional loading

### Example with Media Queries

```html
<head>
  <!-- Main stylesheet -->
  <link rel="stylesheet" href="/styles/default.css">

  <!-- Alternative stylesheets -->
  <link rel="alternate stylesheet" href="/styles/dark-mode.css" title="Dark">
  <link rel="alternate stylesheet" href="/styles/light-mode.css" title="Light">
  <link rel="alternate stylesheet" href="/styles/high-contrast.css" title="High Contrast">
  <link rel="alternate stylesheet" href="/styles/dyslexia-friendly.css" title="Dyslexia Friendly">
</head>
```

## Known Limitations

1. **Browser Support Inconsistent**: Chrome and Safari don't support built-in theme switching
2. **No Native UI in Most Browsers**: User interface for stylesheet selection varies by browser
3. **JavaScript Required for Modern Browsers**: Most modern implementations require JavaScript to switch themes
4. **Persistence Not Automatic**: User preferences must be stored manually (localStorage, cookies, server-side)
5. **Opera's Partial Support**: Support varies significantly across Opera browser versions

## Implementation Recommendations

### For Modern Web Development

While native support is limited, developers typically implement theme switching using:

1. **CSS Custom Properties (CSS Variables)**
   ```css
   :root {
     --primary-color: #333;
     --bg-color: #fff;
   }

   [data-theme="dark"] {
     --primary-color: #fff;
     --bg-color: #333;
   }
   ```

2. **JavaScript Theme Switching**
   ```javascript
   function switchTheme(themeName) {
     document.documentElement.setAttribute('data-theme', themeName);
     localStorage.setItem('preferred-theme', themeName);
   }
   ```

3. **Prefers Color Scheme Media Query**
   ```css
   @media (prefers-color-scheme: dark) {
     /* Dark mode styles */
   }
   ```

### Progressive Enhancement

Use alternate stylesheets in conjunction with modern CSS features for maximum compatibility:

```html
<head>
  <!-- Primary stylesheet -->
  <link rel="stylesheet" href="/styles/main.css">

  <!-- Alternate stylesheets for browsers that support it -->
  <link rel="alternate stylesheet" href="/styles/dark.css" title="Dark">

  <!-- Fallback: CSS custom properties for theme switching -->
  <style>
    :root.dark-mode {
      --primary-color: #fff;
    }
  </style>
</head>
```

## Notes

- No known browser bugs reported
- Feature is part of the HTML Living Standard
- Limited practical use due to inconsistent browser support
- Modern websites use CSS-in-JS or CSS custom properties for theme implementation
- Consider using the `prefers-color-scheme` media query for OS-level preference detection

## Related Links

### Official Documentation
- [MDN Web Docs - Alternative Style Sheets](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)
- [W3C CSS Tips & Tricks - Alternative Stylesheets](https://www.w3.org/Style/Examples/007/alternatives.en.html)

### Examples
- [CSS-Tricks - Alternate Stylesheets Demo](https://css-tricks.com/examples/AlternateStyleSheets/)

### Tools
- [Chrome Web Store - Style Chooser Extension](https://chrome.google.com/webstore/detail/style-chooser/daodklicmmjhcacgkjpianadkdkbkbce) - Third-party extension for Chrome support

## See Also

- [CSS Custom Properties (CSS Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Prefers Color Scheme Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Link Element Reference](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element)
