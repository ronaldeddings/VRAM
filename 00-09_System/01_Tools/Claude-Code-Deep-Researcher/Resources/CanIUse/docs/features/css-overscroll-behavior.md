# CSS overscroll-behavior

## Overview

The `overscroll-behavior` CSS property controls the behavior that occurs when a user scrolls past the edges of a scroll container. This property allows developers to define how scrolling should behave at scroll container boundaries, providing fine-grained control over scroll chaining and overscroll effects.

## Description

The `overscroll-behavior` property specifies how an element should behave when it reaches a scrollport edge. This is particularly useful for preventing the default browser behaviors like "rubber-banding" on iOS or scroll chaining, where scrolling one element causes parent elements to scroll.

**Common use cases include:**
- Modal dialogs that shouldn't propagate scroll to the page behind them
- Custom scroll containers that need independent scroll behavior
- Improving scroll performance by preventing unnecessary scroll event propagation

## Specification Status

- **Status**: Working Draft (WD)
- **Spec URL**: https://drafts.csswg.org/css-overscroll/#overscroll-behavior-properties
- **Category**: CSS

## CSS Properties

The `overscroll-behavior` property is a shorthand for:
- `overscroll-behavior-x` - Controls horizontal overscroll behavior
- `overscroll-behavior-y` - Controls vertical overscroll behavior

**Property Values:**
- `auto` (default) - Enables scroll chaining and overscroll effects
- `contain` - Scrolls the element, but prevents scroll chaining to parent elements
- `none` - Disables scroll chaining and prevents overscroll effects

## Benefits and Use Cases

### Primary Benefits

1. **Prevents Scroll Chaining**
   - Stops scrolling from propagating to parent containers
   - Useful for isolated scroll areas like modal dialogs or sidebars

2. **Improves User Experience**
   - Eliminates unexpected scroll behavior in complex layouts
   - Provides predictable scrolling interactions

3. **Enhances Performance**
   - Reduces unnecessary scroll event propagation
   - Prevents redundant re-renders in nested scroll containers

4. **Better Mobile Experience**
   - Eliminates rubber-banding effects when scrolling past edges
   - Provides consistent behavior across different devices

### Practical Use Cases

- **Modal Dialogs**: Prevent scrolling the page behind the modal
- **Fixed Navigation Bars**: Prevent nav bar scrolling from affecting page scroll
- **Chat/Message Applications**: Control scroll behavior in message lists
- **Carousel Components**: Manage scroll behavior in carousel containers
- **Web Applications**: Create smoother interactions in complex UIs
- **Embedded Content**: Control scrolling in iframes and embedded elements

## Browser Support

### Support Legend

- **y** = Supported
- **n** = Not supported
- **a** = Partial/Alternative support
- **d** = Development/Experimental support

### Desktop Browsers

| Browser | Version(s) | Status | Notes |
|---------|-----------|--------|-------|
| **Chrome** | 65+ | ✅ Full Support | |
| **Chrome** | 63-64 | ⚠️ Partial (#2) | Does not support `none` on body element |
| **Firefox** | 59+ | ✅ Full Support | |
| **Safari** | 16+ | ✅ Full Support | |
| **Safari** | 14.1-15.6 | 🔬 Experimental (#4) | Available in Experimental Features menu |
| **Edge** | 79+ | ✅ Full Support | |
| **Edge** | 12-17 | ⚠️ Partial (#1) | Uses `-ms-scroll-chaining` prefix |
| **Edge** | 18 | ⚠️ Partial (#3) | Treats `none` as `contain` |
| **Opera** | 52+ | ✅ Full Support | |
| **Opera** | 50-51 | ⚠️ Partial (#2) | Does not support `none` on body element |
| **IE** | 10-11 | ⚠️ Partial (#1) | Uses `-ms-scroll-chaining` prefix |

### Mobile Browsers

| Browser | Version(s) | Status | Notes |
|---------|-----------|--------|-------|
| **iOS Safari** | 16+ | ✅ Full Support | |
| **iOS Safari** | 14.5-15.6 | 🔬 Experimental (#4) | Available in Experimental Features menu |
| **Android Chrome** | 142+ | ✅ Full Support | |
| **Android Firefox** | 144+ | ✅ Full Support | |
| **Samsung Internet** | 8.2+ | ✅ Full Support | |
| **Opera Mobile** | 80+ | ✅ Full Support | |
| **Opera Mini** | All versions | ❌ Not Supported | |
| **UC Browser** | 15.5+ | ✅ Full Support | |
| **Baidu** | 13.52+ | ✅ Full Support | |
| **Android Browser** | 142+ | ✅ Full Support | |
| **KaiOS** | 3.0-3.1 | ✅ Full Support | |

### Overall Browser Support Statistics

- **Supported (y)**: 92.11% of users
- **Partial Support (a)**: 0.33% of users
- **Not Supported (n)**: 7.56% of users

## Fallback and Legacy Support

### Microsoft Internet Explorer & Legacy Edge

For browsers that don't support `overscroll-behavior`, you can use the `-ms-scroll-chaining` property as a fallback:

```css
/* Modern browsers */
.modal-content {
  overscroll-behavior: contain;
}

/* Internet Explorer 10+ */
.modal-content {
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
}
```

**Note**: IE support is limited to Windows 8 and above.

### Experimental Features

Safari versions 14.1-15.6 require enabling experimental features:
1. Open Safari preferences
2. Go to "Advanced" tab
3. Enable "Experimental Features"
4. Search for `overscroll-behavior`

The same applies to iOS Safari on these versions.

## Implementation Notes

### Note #1: `-ms-scroll-chaining` Prefix
Internet Explorer 10-11 and older Edge versions (12-17) support a precursor property called `-ms-scroll-chaining` that provides similar functionality. This property is limited to Windows 8 and above.

### Note #2: Body Element Limitation
Chrome 63-64 and Opera 50-51 do not fully support `overscroll-behavior: none;` when applied to the body element. This means the overscroll glow and rubberbanding effects may still occur on the page itself, though nested elements will respect the property.

### Note #3: Edge 18 Quirk
Edge version 18 incorrectly treats the `none` value as if it were `contain`. Users should upgrade to Edge 79+ for correct behavior.

### Note #4: Safari Experimental Status
Safari and iOS Safari (versions 14.1-15.6) require enabling this feature through the experimental features menu during the development stage. Full support was added in Safari 16.0 and iOS Safari 16.0.

## Code Examples

### Prevent Scroll Chaining in Modal Dialog

```css
.modal {
  /* Prevent scrolling the page when modal is open */
  overscroll-behavior: contain;
}

body.modal-open {
  /* Prevent scrolling the page itself */
  overscroll-behavior: none;
}
```

### Individual Axis Control

```css
.horizontal-scroll-container {
  /* Allow vertical scroll chaining, prevent horizontal */
  overscroll-behavior-x: contain;
  overscroll-behavior-y: auto;
}

.vertical-scroll-container {
  /* Allow horizontal scroll chaining, prevent vertical */
  overscroll-behavior-x: auto;
  overscroll-behavior-y: contain;
}
```

### Chat Application Example

```css
.message-list {
  /* Isolated scroll behavior for message list */
  overscroll-behavior: contain;
  max-height: 500px;
  overflow-y: auto;
}

/* When loading more messages */
.message-list.loading {
  /* Still maintains contained scroll behavior */
  overscroll-behavior: contain;
}
```

### Complete Modal Implementation

```html
<style>
  body.modal-open {
    /* Prevent page scroll when modal is open */
    overflow: hidden;
    overscroll-behavior: none;
  }

  .modal {
    /* Modal container with independent scroll */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    overscroll-behavior: contain;
  }

  .modal-content {
    /* Scrollable modal content */
    max-height: 80vh;
    overflow-y: auto;
    background: white;
    border-radius: 8px;
    padding: 20px;
    overscroll-behavior: contain;
  }
</style>
```

## JavaScript Detection

You can detect support for `overscroll-behavior` using JavaScript:

```javascript
// Feature detection
function supportsOverscrollBehavior() {
  const element = document.createElement('div');
  return 'overscrollBehavior' in element.style ||
         'overscrollBehaviorY' in element.style;
}

if (supportsOverscrollBehavior()) {
  console.log('overscroll-behavior is supported');
} else {
  console.log('Using fallback approach');
}
```

## Polyfill and Workarounds

For browsers without support, consider:

1. **JavaScript-based scroll prevention**:
```javascript
document.addEventListener('scroll', (e) => {
  if (isModalOpen) {
    window.scrollTo(0, lastScrollPosition);
  }
}, { passive: false });
```

2. **Overflow prevention**:
```javascript
// Disable body scroll when modal opens
if (!supportsOverscrollBehavior()) {
  document.body.style.overflow = 'hidden';
}
```

## Related Resources

### Official Documentation
- [MDN: CSS overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
- [CSS Overscroll Behavior Specification](https://drafts.csswg.org/css-overscroll/#overscroll-behavior-properties)

### Blog Posts & Tutorials
- [Google Developers: Overscroll Behavior](https://developers.google.com/web/updates/2017/11/overscroll-behavior)

### Live Demos
- [Interactive Demo](https://ebidel.github.io/demos/chatbox.html)

### Browser Implementation Tracking
- [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=951793#c11)
- [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=176454)

## Browser Compatibility Summary

| Browser Family | Desktop | Mobile |
|---|---|---|
| **Chromium** (Chrome, Edge, Opera) | ✅ 65+ | ✅ Android 142+, Samsung 8.2+ |
| **Firefox** | ✅ 59+ | ✅ Android 144+ |
| **Safari/WebKit** | ✅ 16+* | ✅ iOS 16+* |
| **Internet Explorer** | ⚠️ 10-11 (legacy) | ⚠️ Mobile 10-11 (legacy) |

*Experimental in 14.1-15.6

## Testing Recommendations

When implementing `overscroll-behavior`:

1. Test on mobile devices to verify scroll chaining prevention
2. Test with nested scrollable elements
3. Test with keyboard navigation (Tab key)
4. Verify touch scrolling behavior on iOS
5. Test on lower-end devices to ensure performance
6. Validate with automated accessibility checkers

## Migration Guide

If upgrading from legacy approaches:

### Before (Old Approach)
```css
.modal {
  /* Using overflow + JavaScript workarounds */
  overflow: hidden;
  /* Relying on JavaScript to prevent scroll */
}
```

### After (Modern Approach)
```css
.modal {
  /* Simple CSS solution */
  overscroll-behavior: contain;
  overflow: auto;
}
```

---

**Last Updated**: 2025
**Data Source**: Can I Use - CSS Features Database
**Specification Version**: Working Draft
