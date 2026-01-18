# CSS text-size-adjust

## Overview

The `text-size-adjust` CSS property allows web authors to control if and how the text-inflating algorithm is applied to the textual content of elements on mobile devices. This property is particularly important for optimizing text readability on small screens without unwanted automatic size adjustments.

## Description

On mobile devices, browsers often implement a text-inflating algorithm to improve readability by automatically enlarging small text when the viewport is narrower than the page width. The `text-size-adjust` property provides developers with control over this behavior, allowing them to:

- Disable automatic text inflation entirely
- Preserve user-intended text sizes
- Implement custom responsive text scaling strategies

The property accepts the following values:
- `auto` - Allows the browser to apply its text-inflating algorithm (default)
- `none` - Disables the text-inflating algorithm
- `<percentage>` - Specifies a specific text adjustment percentage

## Specification Status

**Status:** Unofficial (Editor's Draft)

The `text-size-adjust` property is currently part of the CSS Size Adjust specification, which is still in development and not yet a formal W3C recommendation.

- **W3C Specification:** [CSS Size Adjust Draft](https://w3c.github.io/csswg-drafts/css-size-adjust/)

## Categories

- CSS3

## Use Cases & Benefits

### Mobile Optimization
- **Fine-grained Control:** Manage text rendering on mobile devices without relying on browser defaults
- **Responsive Design:** Ensure text scales appropriately across different viewport sizes
- **User Experience:** Prevent unexpected text enlargement that disrupts layout

### Accessibility
- **Reading Experience:** Maintain consistent and intentional text sizing for better readability
- **Layout Stability:** Prevent text inflation from causing unexpected layout shifts or content overflow

### Development Workflow
- **Mobile Testing:** Simplify debugging of text rendering issues on mobile browsers
- **Cross-browser Consistency:** Achieve more predictable text rendering across different mobile platforms

## Browser Support

### Current Support Summary
- **Widely Supported:** Modern Chrome, Edge, Opera, and Samsung browsers
- **Mobile Support:** iOS Safari and Android browsers with `-webkit-` prefix
- **Limited Support:** No support in Firefox or classic Safari (desktop)

### Detailed Browser Support Table

| Browser | First Support | Current Status | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 54 | ✅ Full Support | Versions 54+ fully supported |
| **Edge** | 79 | ✅ Full Support | Versions 79+ fully supported (unprefixed); 12-78 require `-webkit-` prefix |
| **Firefox** | Not Supported | ❌ No Support | No implementation in any version |
| **Safari** | Not Supported | ❌ No Support | Desktop Safari has no support; requires `-webkit-` prefix on iOS |
| **Opera** | 43 | ✅ Full Support | Starting from version 43 (with version 44 as an exception) |
| **iOS Safari** | 5.0 | ⚠️ Prefixed Support | Requires `-webkit-text-size-adjust`; supported from iOS 5.0+ |
| **Android** | 4.4+ | ⚠️ Prefixed Support | Partial support; Chrome Android (142+) has full support |
| **Samsung Internet** | 5.0 | ✅ Full Support | Versions 5.0+ fully supported |

### Support by Prefix

| Implementation | Prefix | Status |
|---|---|---|
| Standard (unprefixed) | — | Chrome 54+, Edge 79+, Opera 43+, Samsung 5.0+ |
| WebKit Prefix | `-webkit-` | iOS Safari 5.0+, Android 4.4+, older Chrome/Edge/Opera |

### Desktop Browser Coverage
```
Chrome: 54+ (100%)
Edge: 79+ (100%)
Firefox: Not supported (0%)
Safari: Not supported (0%)
Opera: 43+, excluding v44 (near 100%)
```

### Mobile Browser Coverage
```
iOS Safari: 5.0+ with -webkit- prefix (100%)
Chrome Android: 54+ (100%)
Samsung Internet: 5.0+ (100%)
Opera Mobile: 80+
Android Browser: 4.4+
```

### Global Usage
- **Supported:** ~89.83% of global browser usage
- **With Prefix Required:** ~0% (minimal legacy support needed)
- **Not Supported:** ~10.17% (primarily Firefox users)

## Important Notes

### Note 1: IE Mobile Viewport Meta Tag Behavior
If the viewport size is set using a `<meta>` element in Internet Explorer Mobile, the `-ms-text-size-adjust` property is ignored. This is a specific IE Mobile limitation that developers should be aware of when targeting legacy mobile browsers.

**Reference:** [MDN - text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)

### Note 2: WebKit Bug with `none` Value
Older versions of WebKit-based desktop browsers (Chrome < 27, Safari < 6) suffer from a significant bug where explicitly setting `-webkit-text-size-adjust` to `none` prevents users from zooming in or out on the webpage, rather than simply ignoring the property as intended.

**Workaround:** Use percentage values instead of `none` in legacy WebKit versions, or use feature detection to conditionally apply the property.

**Reference:** [WebKit Bug #56543](https://bugs.webkit.org/show_bug.cgi?id=56543)

## Implementation Guidelines

### Basic Usage
```css
/* Standard unprefixed syntax (modern browsers) */
body {
  text-size-adjust: none;
}

/* With WebKit prefix for iOS and older mobile browsers */
body {
  -webkit-text-size-adjust: none;
}

/* Cross-browser compatible approach */
body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```

### Recommended Practice
For maximum compatibility across mobile browsers, use both the unprefixed and `-webkit-` prefixed versions:

```css
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```

### Avoiding the WebKit Bug
Instead of using `none`, use a specific percentage for legacy WebKit compatibility:

```css
/* Better for legacy WebKit browsers */
body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```

## Related Resources

- **[MDN Web Docs - text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)** - Comprehensive documentation with examples
- **[Mozilla Bug #1226116](https://bugzilla.mozilla.org/show_bug.cgi?id=1226116)** - Firefox ticket for unprefixed implementation
- **[W3C CSS Size Adjust Specification](https://w3c.github.io/csswg-drafts/css-size-adjust/)** - Official specification draft
- **[WebKit Bug #56543](https://bugs.webkit.org/show_bug.cgi?id=56543)** - WebKit limitation documentation

## Summary

The `text-size-adjust` property provides essential control over mobile text rendering behavior. With support in ~90% of global browsers, it's a reliable tool for modern mobile web development. While Firefox and desktop Safari lack support, the property is widely implemented in Chrome, Edge, Opera, and mobile browsers. For the best cross-browser experience, use both the standard and `-webkit-` prefixed versions in your stylesheets.
