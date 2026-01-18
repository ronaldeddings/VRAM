# CSS Scroll-Behavior

## Overview

The `scroll-behavior` CSS property specifies the scrolling behavior for a scrolling box when scrolling happens due to navigation or CSSOM scrolling APIs. This feature enables developers to create smooth, animated scrolling experiences in web applications.

## Description

The `scroll-behavior` property provides a standard way to define how scrolling should behave when triggered by:

- Navigation to anchor links (`#hash` navigation)
- CSSOM scrolling APIs like `Element.scrollIntoView()` and `window.scrollTo()`
- JavaScript-based scroll operations

Instead of the traditional instant "jump" to the target position, smooth scrolling animates the scroll motion, creating a more polished user experience.

## Specification Status

**Status:** Working Draft (WD)
**Specification URL:** [W3C CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/#smooth-scrolling)

The feature is currently defined in the CSS Overflow Module Level 3, which is still under development. Despite its working draft status, the feature has achieved broad browser support among modern browsers.

## Categories

- **CSS** - Core CSS feature for visual presentation

## Benefits and Use Cases

### Primary Benefits

- **Enhanced User Experience:** Smooth scrolling provides visual feedback about navigation actions, making the interface feel more responsive and polished
- **Professional Appearance:** Animated scrolling is often associated with modern, well-designed web applications
- **Accessibility Consideration:** Can reduce motion sickness for some users when compared to instant jumps (when `prefers-reduced-motion` is respected)
- **No JavaScript Required:** Provides smooth scrolling with just CSS, reducing dependency on JavaScript for simple scroll effects

### Common Use Cases

1. **Table of Contents Navigation:** Smooth scrolling when users click links in a document outline
2. **Single-Page Applications:** Animated scroll to different sections of long pages
3. **Back-to-Top Buttons:** Smooth scroll animation when returning to the top of a page
4. **Anchor Link Navigation:** Creating smooth transitions when navigating to anchors within the same page
5. **Keyboard Navigation:** Smooth scrolling when using keyboard shortcuts or accessibility features
6. **Long-Form Content:** Improving readability and user engagement in blogs, articles, and documentation

## Browser Support

### Support Legend

- **✅ Yes (y)** - Feature is fully supported
- **⚠️ Partial (d)** - Feature is supported with some limitations or caveats
- **❌ No (n)** - Feature is not supported
- **#1, #2, #3** - Indicates related notes (see Notes section below)

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 61 | ✅ Full Support | Partial: #1 |
| **Edge** | 79 | ✅ Full Support | Partial: #1 |
| **Firefox** | 36 | ✅ Full Support | Full support |
| **Safari** | 15.4 | ✅ Full Support | Previously experimental |
| **Opera** | 48 | ✅ Full Support | Partial: #1 |

### Mobile & Tablet Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Safari (iOS)** | 15.4 | ✅ Full Support | Previously experimental (15.0-15.3) |
| **Chrome Android** | 142 | ✅ Full Support | Partial: #1 |
| **Firefox Android** | 144 | ✅ Full Support | Full support |
| **Samsung Internet** | 8.2 | ✅ Full Support | Partial: #1 |
| **Opera Mobile** | 80 | ✅ Full Support | Partial: #1 |
| **UC Browser** | 15.5 | ✅ Full Support | Partial: #1 |
| **Opera Mini** | All | ❌ Not Supported | No support across all versions |
| **Android UC** | All | ❌ Not Supported | Limited support |
| **Baidu Browser** | 13.52 | ✅ Full Support | Full support |
| **KaiOS** | 3.0-3.1 | ✅ Full Support | Full support |

### Legacy Browsers

| Browser | Status |
|---------|--------|
| **Internet Explorer** | ❌ Not Supported (all versions) |
| **Blackberry Browser** | ❌ Not Supported |

## Usage Statistics

- **Global Support:** 92.56% of users have browsers that support CSS scroll-behavior
- **Alternative/Partial Support:** 0% (minimal partial implementation variation)

## Implementation Notes

### Note #1: Partial Support Limitations

Partial support in Chromium-based browsers (Chrome, Edge, Opera, etc.) indicates that these browsers support everything except:

- [`Element.scrollIntoView()`](https://caniuse.com/scrollintoview) - does not respect the `scroll-behavior` property in all cases
- [Smooth scrolling does not work together with pinch viewport zoom](https://bugs.chromium.org/p/chromium/issues/detail?id=434497)

### Note #2: Experimental Features (Chrome/Opera)

In Chrome and Opera versions 41-60, the feature was available behind experimental feature flags:

- `'Smooth Scrolling'` flag
- `'Enable experimental web platform features'` flag

This flag was enabled by default starting in Chrome 61 and Opera 48.

### Note #3: Safari Experimental Flag

In Safari versions 14.0-15.3, the feature required enabling the **"CSSOM View Smooth Scrolling"** experimental features flag in Safari's developer settings before it could be used.

## Syntax and Usage

### Basic CSS Syntax

```css
/* Instant/auto scrolling (default) */
html {
  scroll-behavior: auto;
}

/* Smooth scrolling animation */
html {
  scroll-behavior: smooth;
}
```

### Practical Examples

#### Example 1: Smooth Scroll for Anchor Links

```css
html {
  scroll-behavior: smooth;
}
```

With this CSS applied, all anchor navigation (e.g., `<a href="#section">`) will smoothly scroll to the target.

#### Example 2: Smooth Scroll with Reduced Motion Preference

```css
html {
  scroll-behavior: smooth;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

This ensures accessibility by respecting the user's system preference for reduced motion.

#### Example 3: Smooth Scroll to Element via JavaScript

```javascript
// JavaScript using scrollIntoView() with smooth behavior
document.getElementById('target').scrollIntoView({ behavior: 'smooth' });

// Note: Limited browser support for scroll-behavior property
// with scrollIntoView() in some Chromium browsers
```

## Fallback Strategies

### Progressive Enhancement

For browsers that don't support `scroll-behavior`, consider implementing JavaScript fallbacks:

```javascript
if (!('scrollBehavior' in document.documentElement.style)) {
  // Fallback: Use jQuery animate or similar library
  // Or implement custom smooth scroll animation
}
```

### Polyfill Consideration

The [smoothscroll](https://www.npmjs.com/package/smoothscroll-polyfill) npm package provides polyfill support for `scrollIntoView()` with smooth behavior, though the CSS `scroll-behavior` property itself may require alternative solutions.

## Performance Considerations

- **Hardware Acceleration:** Smooth scrolling is typically hardware-accelerated in modern browsers
- **Performance Impact:** Minimal impact on page performance; scrolling is handled by the browser engine
- **Battery Life:** May have a slight impact on mobile device battery life due to animation processing
- **Disable for Performance:** Can be disabled via the `prefers-reduced-motion` media query for users who prefer reduced animation

## Accessibility Considerations

### Motion Sensitivity

Always respect the `prefers-reduced-motion` media query to accommodate users with vestibular disorders or motion sensitivity:

```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### Keyboard Navigation

Smooth scrolling applies to:
- Keyboard navigation (Tab, arrow keys, Page Up/Down, Home/End)
- Mouse wheel scrolling
- Touch scrolling (on supported devices)

## Related Features

- [scrollIntoView()](https://caniuse.com/scrollintoview) - JavaScript API for scrolling elements into view
- [CSS Scroll Snap](https://caniuse.com/css-scroll-snap) - Snap points for scrolling containers
- [CSS Scroll Timeline](https://caniuse.com/css-animation-timeline) - Animation timeline based on scroll position
- [prefers-reduced-motion](https://caniuse.com/prefers-reduced-motion) - Media query for motion preferences

## References and Resources

### Official Documentation

- **[MDN Web Docs - CSS scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)** - Comprehensive reference and examples

### Standards and Specifications

- **[W3C CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/#smooth-scrolling)** - Official specification

### Bug Reports and Tracking

- **[Chrome Launch Bug - Issue #243871](https://code.google.com/p/chromium/issues/detail?id=243871)** - Chromium feature implementation tracking
- **[WebKit Bug Report - Issue #188043](https://bugs.webkit.org/show_bug.cgi?id=188043)** - iOS/Safari implementation tracking

### Articles and Tutorials

- **[Native Smooth Scrolling - hospodarets.com](https://hospodarets.com/native_smooth_scrolling)** - Blog post with interactive demo and implementation details

## Recommendation Summary

**CSS scroll-behavior** is a mature, widely-supported feature that can be safely used in modern web applications. With 92.56% global browser support, it's suitable for mainstream use with minimal fallback concerns.

### Recommended Usage Pattern

```css
/* Default smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### When to Use

- ✅ Modern web applications targeting current browser versions
- ✅ Single-page applications with internal navigation
- ✅ Long-form content with table of contents
- ✅ When progressive enhancement is acceptable

### When to Avoid

- ❌ If targeting Internet Explorer or very old browser versions
- ❌ When instant scrolling is a critical requirement
- ❌ For complex, customized scroll animations (use JavaScript instead)

---

**Last Updated:** 2025
**Feature Adoption Rate:** 92.56% of global users
