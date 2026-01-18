# CSS Environment Variables env()

## Overview

CSS Environment Variables using the `env()` function provide a standardized way to access system-defined environment variables in CSS. This feature is particularly useful for accessing viewport-safe inset values on devices with notches or other display irregularities, such as the iPhone X and other modern mobile devices.

## Description

The `env()` function allows developers to use environment variables like `safe-area-inset-top`, `safe-area-inset-right`, `safe-area-inset-bottom`, and `safe-area-inset-left` to safely position content within a device's viewport. These variables automatically adjust to account for device-specific display features such as notches, camera housings, or rounded corners.

## Specification

**Status:** Unofficial Draft
**Specification URL:** https://w3c.github.io/csswg-drafts/css-env-1/#env-function

Note: While the specification is still in draft form, browser vendors have implemented this feature with wide support due to its practical importance for responsive design on modern mobile devices.

## Categories

- CSS

## Use Cases & Benefits

### Device-Aware Layout Adaptation
The `env()` function enables automatic adjustment of layouts to accommodate device-specific display features. This is essential for modern mobile design where notches and irregular screen shapes are common.

**Key Benefits:**
- **Automatic Safe Area Calculation**: Eliminates manual calculation of safe zones for notched devices
- **Responsive Viewport Management**: Ensures content is always visible and not obscured by device hardware features
- **Reduced Platform-Specific Code**: Provides a unified approach across different devices and manufacturers
- **Future-Proof Design**: Adapts automatically to new device form factors as they emerge

### Practical Applications
1. **Navigation Bars**: Position header navigation below the notch on iPhone X and similar devices
2. **Bottom Navigation**: Keep bottom navigation bars above the home indicator on notched phones
3. **Fullscreen Content**: Display fullscreen media while respecting safe areas
4. **Immersive Web Apps**: Create mobile web applications that work seamlessly with device hardware
5. **Progressive Web Apps (PWAs)**: Ensure PWAs work well in fullscreen mode on various devices

## Browser Support

### Desktop Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|-----------------|
| **Chrome** | 69 | ✅ Supported |
| **Edge** | 79 | ✅ Supported |
| **Firefox** | 65 | ✅ Supported |
| **Safari** | 11.1 | ✅ Supported |
| **Opera** | 56 | ✅ Supported |
| **Internet Explorer** | Not Supported | ❌ No Support |

### Mobile Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|-----------------|
| **iOS Safari** | 11.3+ | ✅ Supported |
| **Android Browser** | 69+ | ✅ Supported |
| **Chrome Mobile** | 69+ | ✅ Supported |
| **Samsung Internet** | 10.1+ | ✅ Supported |
| **Opera Mobile** | 80+ | ✅ Supported |
| **Firefox Mobile** | 65+ | ✅ Supported |
| **UC Browser** | 15.5+ | ✅ Supported |
| **Opera Mini** | Not Supported | ❌ No Support |

### Support Overview

| Category | Coverage |
|----------|----------|
| **Global Browser Support** | 92.7% of users |
| **Partial/Alternate Support** | 0.22% (using `constant()`) |
| **Legacy/No Support** | 7.08% |

## Syntax & Examples

### Basic Usage

```css
/* Safe area insets */
padding-top: env(safe-area-inset-top);
padding-right: env(safe-area-inset-right);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
```

### With Fallback Values

```css
/* Use fallback if env variable is not available */
padding-top: max(1rem, env(safe-area-inset-top));
```

### Complete Responsive Example

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}

header {
  padding: 1rem;
  padding-top: max(1rem, env(safe-area-inset-top));
}

footer {
  padding: 1rem;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

### Combining with CSS Variables

```css
:root {
  --safe-top: max(1rem, env(safe-area-inset-top));
  --safe-right: max(1rem, env(safe-area-inset-right));
  --safe-bottom: max(1rem, env(safe-area-inset-bottom));
  --safe-left: max(1rem, env(safe-area-inset-left));
}

.container {
  padding: var(--safe-top) var(--safe-right)
           var(--safe-bottom) var(--safe-left);
}
```

## Notable Implementation Details

### Safari's `constant()` Function

Safari 11.0 (and iOS Safari 11.0-11.2) initially implemented this feature using `constant()` instead of `env()`. This is noted in the browser support data as partial support (`a #1`).

**Compatibility Note:**
```css
/* For iOS Safari 11.0 */
padding-top: constant(safe-area-inset-top);

/* For Safari 11.1+ and other browsers */
padding-top: env(safe-area-inset-top);

/* Best practice: support both */
padding-top: max(
  constant(safe-area-inset-top),
  env(safe-area-inset-top)
);
```

## Known Issues & Browser-Specific Notes

### No Critical Bugs Reported

The feature is stable across all supporting browsers with no known critical bugs or implementation issues.

### Implementation Variations

1. **Initial Implementations**: Early Safari versions used `constant()` but have since migrated to `env()`
2. **Viewport-Specific**: Environment variables only apply in fullscreen or standalone contexts on some devices
3. **Default Values**: When not in fullscreen/standalone mode, safe area insets default to 0
4. **Mobile-First**: The feature is most useful on mobile devices; on desktop it has limited application

## Related Resources

### Official Documentation & Specifications
- [MDN: The env() CSS Function](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [CSS Environment Variables Module Level 1 (W3C Draft)](https://w3c.github.io/csswg-drafts/css-env-1/#env-function)

### Implementation Resources
- [Designing Websites for iPhone X - WebKit Blog](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [JSFiddle Test Case](https://jsfiddle.net/mrd3h90w/)

## Best Practices

1. **Always Provide Fallbacks**: Use the `max()` function with fallback values for older browsers
   ```css
   padding-top: max(1rem, env(safe-area-inset-top));
   ```

2. **Test on Real Devices**: The `env()` function behaves differently depending on the device and context (fullscreen vs. normal browsing)

3. **Combine with Media Queries**: Use alongside media queries for comprehensive responsive design

4. **Progressive Enhancement**: Assume safe area insets default to 0 on non-notched devices

5. **Consider User Agent Detection**: For critical layouts, consider using feature detection or user agent checks for older devices

## Browser Compatibility Summary

- **Well Supported:** Chrome 69+, Firefox 65+, Edge 79+, Safari 11.1+
- **Mobile-Ready:** Widely supported across iOS and Android browsers
- **Legacy Support Needed:** Provide fallbacks for IE and Opera Mini
- **Viewport Coverage:** 92.7% of global web users on supporting browsers

## Additional Keywords

css env(), css constant(), css variables, safe-area-inset-top, safe-area-inset-right, safe-area-inset-bottom, safe-area-inset-left, viewport, notch, mobile design, responsive, PWA, fullscreen
