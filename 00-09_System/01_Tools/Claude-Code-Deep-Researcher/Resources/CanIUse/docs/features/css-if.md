# CSS if() Function

## Overview

The `if()` CSS function is a conditional value function that allows different values to be set for a property depending on the result of a conditional test. The test can be based on a style query, a media query, or a feature query.

## Specification

- **Status**: Working Draft (WD)
- **Specification URL**: [CSS Values Module Level 5 - if() Notation](https://drafts.csswg.org/css-values-5/#if-notation)
- **Specification Status**: Under active development by the CSS Working Group

## Category

CSS

## Description

The `if()` function provides a native CSS mechanism for conditional logic at the property value level. This feature enables developers to write responsive and adaptive stylesheets without relying on JavaScript or media queries for simple conditional value selection.

### Syntax

```css
if(<condition>, <value-if-true>, <value-if-false>)
```

### How It Works

The function evaluates a condition and returns one of two values based on the result:

1. **Condition Types**:
   - Style queries: Check if a style property has a specific value
   - Media queries: Evaluate media query conditions
   - Feature queries: Check for feature support using `@supports`

2. **Value Resolution**:
   - If the condition is true, returns the first value argument
   - If the condition is false, returns the second value argument

## Benefits and Use Cases

### Dynamic Property Values
- Switch between different color schemes based on system preferences
- Adjust layout values based on viewport size without media queries
- Apply responsive font sizes conditionally

### Feature-Based Styling
- Use different values depending on supported CSS features
- Gracefully degrade styling for older browsers
- Implement progressive enhancement patterns

### Style Queries
- Adjust properties based on the state of other styles
- Create dependent styling relationships
- Simplify complex conditional styling logic

### Examples

```css
/* Based on media query */
div {
  font-size: if(screen and (max-width: 600px), 14px, 18px);
}

/* Based on style query */
.button {
  background-color: if(style(--theme: dark), #333, #fff);
}

/* Based on feature support */
.container {
  display: if(supports(display: grid), grid, flex);
}
```

## Browser Support

| Browser | First Version | Status |
|---------|--------------|--------|
| Chrome | 137 | ✅ Supported |
| Edge | 137 | ✅ Supported |
| Firefox | Not yet | ❌ Not supported |
| Safari | Not yet | ❌ Not supported |
| Opera | 123+ | ✅ Supported |
| Android Chrome | 142 | ✅ Supported |
| Android | 142 | ✅ Supported |

### Global Support Estimate

**66.61%** of users have support for this feature based on current browser usage statistics.

### Detailed Browser Matrix

#### Desktop Browsers

**Chrome**
- Support starts at version 137
- All versions from 137 onwards have full support

**Edge**
- Support starts at version 137
- All versions from 137 onwards have full support

**Firefox**
- No support as of version 148
- Feature under consideration

**Safari**
- No support as of version 26.1
- Not yet implemented

**Opera**
- Supported in version 121
- Version 122 status pending

#### Mobile Browsers

**Android Chrome (and_chr)**
- Supported at version 142

**Android WebView (android)**
- Supported at version 142

**Firefox Mobile (and_ff)**
- Not supported as of version 144

**iOS Safari (ios_saf)**
- No support as of version 26.1

**Opera Mobile (op_mob)**
- Not supported as of version 12.1

**Samsung Internet**
- No support as of version 29.0

## Related Resources

### Documentation
- [MDN Web Docs - if() Function](https://developer.mozilla.org/en-US/docs/Web/CSS/if)

### Standards Positions
- [Firefox Standards Position](https://github.com/mozilla/standards-positions/issues/1167)
- [WebKit Standards Position](https://github.com/WebKit/standards-positions/issues/453)

### Implementation & Polyfills
- [CSS if() Polyfill](https://github.com/mfranzke/css-if-polyfill) - Minimal vanilla JavaScript polyfill and PostCSS plugin for older browsers

### Bug Reports
- [Firefox Support Bug #1981485](https://bugzilla.mozilla.org/show_bug.cgi?id=1981485)

## Implementation Status

### Currently Supported Platforms
- Chromium-based browsers (Chrome, Edge, Opera)
- Android platform with Chrome/WebView

### In Development
- Firefox - Under investigation and discussion
- WebKit/Safari - Standards position requested

### Migration Path

For developers targeting broader browser compatibility, consider:

1. **Progressive Enhancement**: Use `if()` for modern browsers with fallback styles
2. **CSS Custom Properties**: Combine with CSS variables for broader compatibility
3. **Media Queries**: Traditional media queries still work across all browsers
4. **PostCSS Plugin**: Use the polyfill for preprocessing in older projects

## Notes

- No known critical bugs currently documented
- Feature is still in Working Draft status and may change
- Polyfill support available for projects requiring broader compatibility
- Consider progressive enhancement strategies for production use

## Keywords

condition, media, supports, style, conditional, responsive

---

*Last Updated: 2025*

For the latest support information, visit [Can I use - CSS if()](https://caniuse.com/css-if)
