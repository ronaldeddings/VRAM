# CSS.supports() API

## Overview

The `CSS.supports()` static method is a JavaScript API that returns a Boolean value indicating whether the browser supports a given CSS feature. This provides developers with a programmatic way to detect CSS feature support at runtime.

## Description

The `CSS.supports()` API allows you to check if a browser implements a specific CSS property or value before using it in your application. This is particularly useful for:

- Progressive enhancement strategies
- Feature detection for CSS capabilities
- Conditional feature loading
- Graceful degradation

Unlike feature detection libraries that infer support through DOM manipulation, `CSS.supports()` provides direct feedback from the browser about what it can parse and understand.

## Specification

- **Spec Status**: Candidate Recommendation (CR)
- **Official Specification**: [W3C CSS Conditional Module Level 3](https://w3c.github.io/csswg-drafts/css-conditional/#the-css-interface)
- **Standards Body**: W3C CSS Working Group

## Categories

- **DOM**: Document Object Model interface for CSS feature detection
- **JS API**: JavaScript runtime API for feature detection

## Benefits & Use Cases

### Primary Benefits

1. **Runtime Feature Detection**: Check CSS support without guessing or pre-loading polyfills
2. **Performance Optimization**: Avoid unnecessary polyfills for features already supported
3. **Progressive Enhancement**: Build layered experiences that enhance for capable browsers
4. **Future-Proof Code**: Safely use new CSS features as browser support improves

### Common Use Cases

- **Browser Capability Testing**: Determine which CSS features are available before use
- **Fallback Strategy**: Switch between CSS approaches based on what the browser supports
- **Polyfill Management**: Only load polyfills when the feature isn't natively supported
- **Feature-Specific UI**: Enable advanced visual features only where supported
- **CSS Grid/Flexbox Detection**: Check for modern layout features before using them
- **CSS Custom Properties**: Verify CSS variable support before relying on them
- **Animation Support**: Check for specific animation or transform features

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Full support |
| ⚠️ | Partial support |
| ❌ | No support |
| ☒ | Disabled by default |

### Desktop Browsers

| Browser | First Support | Current Support | Notes |
|---------|--------------|-----------------|-------|
| **Chrome** | 28 | ✅ Chrome 61+ | ⚠️ Chrome 28-60: Partial (see notes) |
| **Firefox** | 22 | ✅ Firefox 55+ | ⚠️ Firefox 22-54: Partial (see notes) |
| **Safari** | 9 | ✅ Safari 9+ | Full support since Safari 9 |
| **Edge** | 79 | ✅ Edge 79+ | ⚠️ Edge 12-78: Partial (see notes) |
| **Opera** | 15 | ✅ Opera 15+ | Full support since Opera 15 |
| **Internet Explorer** | — | ❌ Never supported | No support in any IE version |

### Mobile Browsers

| Browser | First Support | Current Support | Notes |
|---------|--------------|-----------------|-------|
| **iOS Safari** | 9.0 | ✅ iOS 9.0+ | Full support since iOS 9 |
| **Android Chrome** | 4.4 | ✅ Android 4.4+ | Full support since Android 4.4 |
| **Android Firefox** | — | ✅ Current versions | Full support |
| **Samsung Internet** | 4 | ✅ Samsung 4+ | Full support since version 4 |
| **Opera Mini** | — | ⚠️ All versions | Partial support |
| **Opera Mobile** | 12.1+ | ✅ Opera Mobile 80+ | ⚠️ Opera 12.1: Partial (see notes) |

### Other Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **UC Browser (Android)** | ✅ 15.5+ | Full support from version 15.5 |
| **Baidu Browser** | ✅ 13.52+ | Full support from version 13.52 |
| **QQ Browser (Android)** | ✅ 14.9+ | Full support from version 14.9 |
| **KaiOS** | ✅ 2.5+ | Full support from version 2.5 |
| **BlackBerry Browser** | ❌ | No support in versions 7 or 10 |

## Implementation Notes

### Important Limitations

#### Note #1: Presto-Based Opera Legacy API
Partial support in older Presto-based Opera browsers (Opera 12.1 and Opera Mini) refers to using an older, non-standard API:
- Old API: `window.supportsCSS()`
- New API: `CSS.supports()` (standardized version)
- The older API is not compatible with the modern standard

#### Note #2: Missing Parentheses Syntax
Many browsers do not support the parentheses-less single-argument version of `CSS.supports()`:

```javascript
// Supported (standard syntax)
CSS.supports('display: flex');
CSS.supports('display', 'flex');

// NOT widely supported (parentheses-less version)
CSS.supports display: flex;
```

Always use parentheses to ensure broad compatibility.

### Usage Statistics

- **Full Support**: 92.99% of users
- **Partial Support**: 0.25% of users
- **No Support**: 6.76% of users (primarily older browsers)

## Syntax & Examples

### Basic Syntax

```javascript
// Single argument: property and value combined
CSS.supports('display: flex');

// Two arguments: separate property and value
CSS.supports('display', 'flex');
```

### Practical Examples

#### Check for CSS Grid Support
```javascript
if (CSS.supports('display', 'grid')) {
  // Use CSS Grid
  document.body.classList.add('has-grid');
} else {
  // Fall back to flexbox or floats
  document.body.classList.add('no-grid');
}
```

#### Check for CSS Custom Properties
```javascript
if (CSS.supports('--test: 0')) {
  // CSS variables are supported
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color');
} else {
  // Fall back to predefined colors
}
```

#### Conditional Feature Loading
```javascript
function supportsFeature(property, value) {
  return CSS.supports(property, value);
}

if (supportsFeature('backdrop-filter', 'blur(10px)')) {
  // Load advanced blur effects
  applyBlurEffects();
} else {
  // Use simpler alternative styling
  applyFallbackStyles();
}
```

#### Complex Feature Detection
```javascript
// Check for calc() function support
if (CSS.supports('width', 'calc(100% - 2rem)')) {
  // Use calc() in stylesheets
}

// Check for CSS filters
if (CSS.supports('filter', 'hue-rotate(180deg)')) {
  // Use CSS filters
}

// Check for transform-origin
if (CSS.supports('transform-origin', '50% 50% 0')) {
  // Use 3D transforms
}
```

## Related APIs & Standards

### Companion Feature: @supports Rule
The CSS `@supports` rule is the CSS-level equivalent that works in stylesheets:

```css
@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
    flex-wrap: wrap;
  }
}
```

Both `CSS.supports()` and `@supports` can be used together for comprehensive feature detection.

## Resources & References

### Official Documentation
- [MDN Web Docs - CSS.supports()](https://developer.mozilla.org/en-US/docs/Web/API/CSS.supports)
- [W3C CSS Conditional Module Level 3](https://w3c.github.io/csswg-drafts/css-conditional/#the-css-interface)

### Learning Resources
- [Opera Developer Articles - Native CSS Feature Detection](https://dev.opera.com/articles/native-css-feature-detection/)
- [David Walsh - CSS @supports](https://davidwalsh.name/css-supports)
- [Interactive Demo](https://jsbin.com/rimevilotari/1/edit?html,output)

### Related Features
- [CSS @supports Rule (Feature Queries)](css-featurequeries)
- [CSS Variables (Custom Properties)](css-variables)
- [CSS Grid Layout](css-grid)
- [Flexbox Layout](flexbox)

## Global Browser Coverage

Based on current data:
- **Excellent Support**: 92.99% global coverage
- **Widely Available**: Supported in all modern browsers (Chrome 61+, Firefox 55+, Safari 9+, Edge 79+, Opera 15+)
- **Legacy Browsers**: Full support on iOS 9+, Android 4.4+, and most modern mobile browsers
- **Legacy Desktop**: Internet Explorer does not support this API; consider polyfills or fallbacks

## Recommendations

1. **Use Standard Syntax**: Always use the two-argument form `CSS.supports(property, value)` for maximum compatibility
2. **Progressive Enhancement**: Pair with `@supports` CSS rules for consistent behavior
3. **Avoid Polyfills**: This is a native API in all modern browsers; polyfills are generally unnecessary
4. **Feature Detection over UA Sniffing**: Always prefer capability detection over user agent detection
5. **Testing**: Test support detection in target browsers before deployment

## Notes

- See also [@supports in CSS](css-featurequeries) for the CSS-level equivalent
- This API provides the most accurate method for detecting CSS feature support
- Modern browsers (released in the last 3-5 years) have excellent support
- If you need to support Internet Explorer, implement appropriate fallbacks or consider feature-specific CSS approaches
