# CSS position:fixed

## Overview

`position:fixed` is a CSS property that positions an element relative to the viewport, keeping it in a fixed location on the screen regardless of scroll position. This is useful for creating persistent UI elements like navigation bars, modals, and sticky headers.

## Description

Method of keeping an element in a fixed location regardless of scroll position. Fixed positioning removes an element from the normal document flow and positions it relative to the browser viewport. This means the element will maintain its position even when the user scrolls the page.

## Specification Status

- **Status**: ![Recommendation](https://img.shields.io/badge/Status-Recommendation%20(REC)-brightgreen)
- **Specification**: [CSS 2.1 Visual Formatting Model](https://www.w3.org/TR/CSS21/visuren.html#fixed-positioning)
- **W3C Level**: CSS 2.1 (stable, well-established standard)

## Categories

- **CSS**

## Benefits & Use Cases

### Common Use Cases

1. **Navigation Bars** - Keep site navigation visible while scrolling
2. **Sticky Headers** - Maintain column headers or page titles in view
3. **Floating Action Buttons (FAB)** - Present persistent action buttons
4. **Modal Dialogs** - Display overlays and modal windows
5. **Chat Widgets** - Keep messaging interfaces visible
6. **Cookie/Notification Banners** - Display persistent notifications
7. **Scroll-to-Top Buttons** - Provide persistent page navigation aids
8. **Side Navigation Menus** - Create collapsible persistent sidebars

### Key Benefits

- **Improved UX**: Keep important UI elements accessible without scrolling
- **Better Navigation**: Persistent navigation reduces interaction friction
- **Mobile-Friendly**: Excellent for mobile-first designs when used carefully
- **Accessibility**: Can improve navigation for users with motor difficulties
- **Persistent Toolbars**: Maintain tool palettes and command interfaces

## Browser Support

### Support Summary

| Browser | First Full Support | Current Support | Notes |
|---------|-------------------|-----------------|-------|
| **Chrome** | 4 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Full support since v4 |
| **Firefox** | 2 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Full support since v2 |
| **Safari** | 3.1 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Full support since v3.1 |
| **Edge** | 12 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Full support since v12 |
| **Opera** | 9 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Full support since v9 |
| **Internet Explorer** | 7 | ![Partial](https://img.shields.io/badge/▲-Partial-orange) (IE 6) | IE 6 has partial support; IE 7+ full |
| **iOS Safari** | 8 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Known bugs in iOS 5-7 (see bugs below) |
| **Android Browser** | 3 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Buggy in 4.0-4.3 (see bugs below) |
| **Opera Mini** | - | ![Not Supported](https://img.shields.io/badge/✗-Not%20Supported-red) | Not supported in Opera Mini |
| **Samsung Internet** | 4 | ![Supported](https://img.shields.io/badge/✓-Supported-brightgreen) | Full support |

### Global Usage

- **Full Support**: 93.67% of users
- **Partial Support**: 0.01% of users
- **No Support**: 6.32% of users

### Detailed Browser Versions

#### Desktop Browsers

**Google Chrome**: Full support from v4 onwards (2010+)
**Mozilla Firefox**: Full support from v2 onwards (2006+)
**Safari**: Full support from v3.1 onwards (2008+)
**Microsoft Edge**: Full support from v12 onwards (2015+)
**Opera**: Full support from v9 onwards (2007+)
**Internet Explorer**:
- IE 5.5: Not supported
- IE 6: Partial support
- IE 7+: Full support

#### Mobile Browsers

**iOS Safari**:
- 3.2-4.1: Not supported
- 5.0-7.1: Partial support (bugs present)
- 8.0+: Full support

**Android Browser**:
- 2.1-2.3: Partial support (requires specific viewport meta tag)
- 3.0+: Full support
- 4.0-4.3: Full support but with bugs regarding transforms and margin:auto

**Chrome for Android**: Full support (v142+)
**Firefox for Android**: Full support (v144+)
**Samsung Internet**: Full support from v4 onwards

## Known Issues & Bugs

### Bug #1: iOS Safari 5-7 Focus Behavior
**Affected Versions**: iOS Safari 5.0-5.1, 6.0-6.1, 7.0-7.1
**Description**: `position:fixed` elements move to center of window when focus event occurs on a child text input field.
**Status**: Fixed in iOS 8.0+
**Reference**: [Detailed analysis of iOS fixed positioning issues](http://remysharp.com/2012/05/24/issues-with-position-fixed-scrolling-on-ios/)

### Bug #2: Android 2.1-2.3 Viewport Requirement
**Affected Versions**: Android 2.1, 2.2, 2.3
**Description**: `position:fixed` only works when using the following viewport meta tag:
```html
<meta name="viewport" content="width=device-width, user-scalable=no">
```
**Workaround**: Include the meta tag if supporting these older versions
**Status**: Fixed in Android 3.0+

### Bug #3: Android 4.0-4.3 Transform & Margin Issues
**Affected Versions**: Android 4.0, 4.1, 4.2-4.3
**Description**: Fixed positioned elements ignore CSS transforms and `margin:auto` properties
**Impact**: Visual layout may not match intended design
**Reference**: [CodePen demonstration](https://codepen.io/mattiacci/pen/mPRKZY)
**Status**: Fixed in Android 4.4+

### Bug #4: Safari 9.1 Animation Bug
**Affected Versions**: Safari 9.1
**Description**: Having a `position:fixed` element inside an animated element may cause the fixed element to not appear or appear incorrectly
**Reference**: [JSBin example](https://jsbin.com/fuxipax)
**Status**: Fixed in Safari 10+

## Implementation Notes

### Best Practices

1. **Consider Mobile Experience**
   - Fixed elements consume screen space on mobile devices
   - Use fixed positioning judiciously on small screens
   - Consider alternative approaches (sticky positioning) for better mobile support

2. **z-index Management**
   - Manage z-index carefully to avoid layering issues
   - Fixed elements create new stacking context
   - Ensure fixed elements don't obstruct important content

3. **Performance Considerations**
   - Fixed positioning can impact scroll performance in some cases
   - Use `will-change: transform` sparingly to optimize rendering
   - Consider using `contain: layout` for better performance

4. **Accessibility**
   - Ensure fixed navigation doesn't trap keyboard focus
   - Provide skip links to bypass fixed content
   - Test keyboard navigation thoroughly

5. **Fallbacks**
   - Internet Explorer 6 has only partial support
   - Consider fallback positioning strategies for older browsers
   - Use feature detection (e.g., Modernizr) if supporting legacy browsers

### Common Patterns

```css
/* Sticky Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
}

/* Floating Action Button */
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}
```

## Related Properties

- **`position: absolute`** - Position relative to nearest positioned ancestor
- **`position: relative`** - Position relative to normal flow position
- **`position: sticky`** - Hybrid of relative and fixed positioning (modern alternative)
- **`position: static`** - Default positioning
- **`z-index`** - Control stacking order
- **`top`, `right`, `bottom`, `left`** - Offset properties used with fixed positioning

## Additional Resources

### Official Documentation
- [MDN: position: fixed](https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed)
- [W3C CSS 2.1 Specification](https://www.w3.org/TR/CSS21/visuren.html#fixed-positioning)

### Articles & Guides
- [Brad Frost - Article on Mobile Support](https://bradfrost.com/blog/post/fixed-position/)

## Browser Compatibility Code

### Feature Detection

```javascript
// Check if position:fixed is supported
function supportsFixedPositioning() {
  const element = document.createElement('div');
  element.style.position = 'fixed';
  return element.style.position === 'fixed';
}
```

### CSS Feature Query

```css
@supports (position: fixed) {
  /* Use fixed positioning */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}
```

## Summary

`position: fixed` is a well-supported CSS feature with near-universal browser support (93.67% global usage). It's stable in all modern browsers and has been supported since very early versions. The main considerations are:

1. **Desktop**: Fully supported in all major browsers
2. **Mobile**: Fully supported in modern versions, but with some historical bugs
3. **Legacy**: IE 6 has partial support; consider alternatives if supporting very old browsers
4. **Known Issues**: Primarily affected older versions (iOS 5-7, Android 4.0-4.3)

For modern web development, `position: fixed` is safe to use without polyfills or fallbacks in most cases. When supporting mobile, test thoroughly on your target devices and consider `position: sticky` as a modern alternative for some use cases.
