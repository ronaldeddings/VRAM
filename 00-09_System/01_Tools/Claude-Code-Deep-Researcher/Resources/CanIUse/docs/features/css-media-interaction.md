# Media Queries: Interaction Media Features

## Overview

Allows a media query to be set based on the presence and accuracy of the user's pointing device, and whether they have the ability to hover over elements on the page. This includes the `pointer`, `any-pointer`, `hover`, and `any-hover` media features.

**Status Badge:** ![Candidate Recommendation](https://img.shields.io/badge/Status-Candidate%20Recommendation-blue)
**Usage:** 93.12% of users worldwide

## Specification

- **Specification:** [W3C Media Queries Level 4 - Interaction Media Features](https://www.w3.org/TR/mediaqueries-4/#mf-interaction)
- **Status:** Candidate Recommendation (CR)

## Categories

- CSS

## Media Features

This specification includes the following media features:

| Feature | Purpose |
|---------|---------|
| `pointer` | Indicates the user's primary pointing device and its accuracy |
| `any-pointer` | Detects if any pointing device is available |
| `hover` | Indicates whether the user's primary input method can hover over elements |
| `any-hover` | Detects if any input method supports hover |

### Pointer Values

- `fine` - The primary input mechanism includes a device that can accurately target small areas
- `coarse` - The primary input mechanism includes a pointing device of limited accuracy
- `none` - The primary input mechanism doesn't include a pointing device

### Hover Values

- `hover` - The primary input mechanism can conveniently hover over elements
- `none` - The primary input mechanism cannot hover, or hovering is inconvenient

## Benefits and Use Cases

### Responsive Interaction Design

Tailor UI interactions based on device input capabilities rather than screen size alone:

```css
/* Show hover effects only on devices that support hovering */
@media (hover: hover) {
  button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
}

/* Touch-friendly targets for devices without hover support */
@media (hover: none) {
  button {
    padding: 16px 24px;
    font-size: 18px;
  }
}
```

### Pointer Precision Optimization

Optimize interactive elements based on pointing device accuracy:

```css
/* Large, easy-to-tap targets for coarse pointers */
@media (pointer: coarse) {
  button {
    min-height: 48px;
    min-width: 48px;
  }
}

/* Smaller, more precise targets for fine pointers */
@media (pointer: fine) {
  button {
    min-height: 32px;
    min-width: 32px;
  }
}
```

### Combined Input Method Detection

Adapt UI for devices with multiple input methods:

```css
/* Use hover for devices that support it, even if touch is available */
@media (any-hover: hover) {
  .menu-item:hover .submenu {
    display: block;
  }
}

/* Fallback for touch-only devices */
@media (any-hover: none) {
  .menu-item {
    position: relative;
  }
  .menu-toggle {
    display: block;
  }
}
```

### Use Cases

1. **Hover Effects** - Conditionally apply interactive hover states
2. **Touch Optimization** - Increase touch target sizes on touch devices
3. **Context Menu Handling** - Show appropriate menu triggers based on input type
4. **Tooltip Display** - Display tooltips only where hover is supported
5. **Drag-and-Drop UI** - Adjust UI patterns based on input precision
6. **Mobile vs Desktop** - More accurate than viewport-based detection for interaction design
7. **Hybrid Devices** - Properly support devices with both touch and mouse input

## Browser Support

### Summary

- **Full Support:** Chrome 41+, Edge 12+, Firefox 64+, Safari 9+, Opera 28+
- **Limited Support:** IE and Opera Mini do not support these media features
- **High Global Coverage:** 93.12% of worldwide users

### Support Table by Browser

| Browser | First Version | Notes |
|---------|---------------|-------|
| Chrome | 41 | Full support across all versions from 41+ |
| Edge | 12 | Full support from initial release |
| Firefox | 64 | Full support from version 64 onwards |
| Safari | 9 | Full support from version 9 onwards |
| Opera | 28 | Full support from version 28 onwards |
| iOS Safari | 9.0+ | Supported on iOS Safari 9 and later |
| Opera Mini | Not Supported | No support (all versions) |
| Android | 142+ | Recent Android browsers support this feature |
| Samsung Internet | 5.0+ | Supported from version 5.0 onwards |
| IE | Not Supported | No support in any version (5.5-11) |

### Detailed Browser Version History

#### Desktop Browsers

**Chrome**
- Versions 4-40: Not supported
- Versions 41+: Full support

**Firefox**
- Versions 2-63: Not supported
- Versions 64+: Full support

**Safari**
- Versions 3.1-8: Not supported
- Versions 9+: Full support

**Edge (Chromium-based)**
- Version 12+: Full support

**Opera**
- Versions 9-27: Not supported
- Versions 28+: Full support

**Internet Explorer**
- All versions (5.5-11): No support

#### Mobile Browsers

**iOS Safari**
- iOS 3.2-8.4: Not supported
- iOS 9.0+: Full support

**Android**
- Android 2.1-4.4.3: Not supported
- Android Browser 142+: Supported

**Opera Mobile**
- Versions 10-12.1: Not supported
- Version 80+: Supported

**Chrome Mobile (Android)**
- Version 142+: Supported

**Firefox Mobile (Android)**
- Version 144+: Supported

**Samsung Internet**
- Version 4: Not supported
- Versions 5.0+: Full support

**Opera Mini**
- All versions: No support

**UC Browser (Android)**
- Version 15.5+: Supported

**QQ Browser (Android)**
- Version 14.9+: Supported

**Baidu Browser**
- Version 13.52+: Supported

**KaiOS**
- Versions 2.5: Not supported
- Versions 3.0+: Supported

## Implementation Example

### Basic Usage

```css
/* Default styles */
body {
  --interactive-scale: 1;
}

/* Hover support detected */
@media (hover: hover) {
  button {
    transition: all 0.2s ease;
  }

  button:hover {
    --interactive-scale: 1.05;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* No hover support (touch device) */
@media (hover: none) {
  button {
    padding: 14px 20px;
  }

  button:active {
    --interactive-scale: 0.98;
  }
}

/* Fine pointer (mouse) */
@media (pointer: fine) {
  .icon-button {
    width: 24px;
    height: 24px;
  }
}

/* Coarse pointer (touch) */
@media (pointer: coarse) {
  .icon-button {
    width: 44px;
    height: 44px;
    padding: 10px;
  }
}
```

### Advanced Example: Responsive Menu

```css
/* Desktop with hover support */
@media (hover: hover) and (pointer: fine) {
  .nav-submenu {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .nav-item:hover .nav-submenu {
    visibility: visible;
    opacity: 1;
  }
}

/* Touch devices without hover */
@media (hover: none) and (pointer: coarse) {
  .nav-submenu {
    display: none;
  }

  .nav-item.active .nav-submenu {
    display: block;
  }

  .nav-toggle-btn {
    display: inline-block;
  }
}
```

## Known Issues and Bugs

### Chromium Implementation

- **Issue:** Chromium-based browsers initially had limited detection accuracy for pointer type
- **Status:** Resolved in recent versions
- **Tracking:** [Chrome Issue #398943](https://bugs.chromium.org/p/chromium/issues/detail?id=398943)

### General Considerations

- Some browsers may not accurately detect pointer type on hybrid devices (touch + mouse)
- Media feature detection may lag behind actual device capabilities in some edge cases
- Polyfills may be necessary for legacy browser support if required

## Related Resources

### Official Documentation

- [W3C Media Queries Level 4 Specification](https://www.w3.org/TR/mediaqueries-4/#mf-interaction)

### Articles and Guides

- [Potential use cases for script, hover and pointer CSS Level 4 Media Features](https://jordanm.co.uk/2013/11/11/potential-use-cases-for-script-hover-and-pointer.html) - Jordan Moore
- [Interaction Media Features and their potential](https://dev.opera.com/articles/media-features/) - Opera Developer

### Polyfills

- [mq4-hover-shim](https://github.com/twbs/mq4-hover-shim) - Polyfill for the hover media feature

### Related CSS Features

- [@media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Detecting Hover Capability](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)
- [Detecting Pointer Type](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer)

## See Also

- CSS Media Queries Level 4
- CSS Media Queries (parent feature)
- Responsive Design Media Features
- Input Device Detection

---

**Last Updated:** December 2024
**Feature ID:** css-media-interaction
**Parent Feature:** css-mediaqueries
**Keywords:** @media, interaction, hover, any-hover, pointer, any-pointer
