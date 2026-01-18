# CSS Grid Animation

## Overview

CSS Grid animation allows developers to animate the `grid-template-columns` and `grid-template-rows` properties as defined in the CSS Grid Level 1 specification. This feature enables smooth, dynamic transitions when modifying grid layouts, creating fluid and visually appealing responsive design experiences.

### Description

As defined in CSS Grid level 1, `grid-template-columns` and `grid-template-rows` are properties that can be animated. This enables developers to create transitions and animations that smoothly modify grid structures, column widths, row heights, and other grid-related layout properties over time.

**Global Usage**: 90.52% of browsers support this feature

---

## Specification

- **Specification Status**: ![Candidate Recommendation](https://img.shields.io/badge/Status-Candidate%20Recommendation-blue)
- **W3C Specification**: [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/)

---

## Categories

- CSS Layout
- CSS Animations

---

## Benefits and Use Cases

### Benefits

1. **Smooth Layout Transitions**: Animate grid column and row dimensions for fluid layout changes
2. **Responsive Animations**: Create responsive designs that adapt smoothly to different screen sizes
3. **Enhanced User Experience**: Provide visual continuity during layout reorganizations
4. **Property Animation**: Directly animate grid-template properties without JavaScript manipulation

### Use Cases

- **Collapsible Grid Layouts**: Smoothly expand/collapse grid sections with animated width changes
- **Responsive Dashboard Widgets**: Animate widget repositioning and resizing within grid layouts
- **Interactive Navigation**: Animate menu grid structures with smooth transitions
- **Data Visualization**: Smoothly transition between different grid arrangements for data displays
- **Portfolio Galleries**: Create flowing animations when reorganizing grid items
- **Modal Grid Transitions**: Animate modal layouts entering and exiting the viewport
- **Sidebar Animations**: Smoothly animate sidebar width changes within a grid layout
- **Product Grid Filtering**: Animate grid reorganization when filtering or sorting items

---

## Browser Support

### Support Summary Table

| Browser | First Supported Version | Current Status |
|---------|------------------------|-----------------|
| Chrome | 107 | ✅ Supported |
| Edge | 107 | ✅ Supported |
| Firefox | 66 | ✅ Supported |
| Safari | 16.0 | ✅ Supported |
| Opera | 93 | ✅ Supported |
| iOS Safari | 16.0 | ✅ Supported |
| Android Chrome | 142 | ✅ Supported |
| Android Firefox | 144 | ✅ Supported |
| Samsung Internet | 21 | ✅ Supported |
| Opera Mobile | 80 | ✅ Supported |

### Detailed Browser Support

#### Desktop Browsers

**Chrome**
- ❌ Not supported: Versions 4-106
- ✅ **Fully supported: Version 107+**

**Edge (Chromium-based)**
- ❌ Not supported: Versions 12-106
- ✅ **Fully supported: Version 107+**

**Firefox**
- ❌ Not supported: Versions 2-65
- ✅ **Fully supported: Version 66+**

**Safari**
- ❌ Not supported: Versions 3.1-15.6
- ✅ **Fully supported: Version 16.0+**

**Opera**
- ❌ Not supported: Versions 9-92
- ✅ **Fully supported: Version 93+**

#### Mobile Browsers

**iOS Safari**
- ❌ Not supported: Versions 3.2-15.6
- ✅ **Fully supported: Version 16.0+**

**Android Chrome**
- ✅ **Fully supported: Version 142+**

**Android Firefox**
- ✅ **Fully supported: Version 144+**

**Samsung Internet**
- ❌ Not supported: Versions 4-20
- ✅ **Fully supported: Version 21+**

**Opera Mobile**
- ❌ Not supported: Versions 10-79
- ✅ **Fully supported: Version 80+**

#### Legacy/Unsupported Browsers

- **Internet Explorer**: All versions (5.5-11) ❌
- **Opera Mini**: All versions ❌
- **Blackberry**: All versions ❌
- **Android UC Browser**: Not fully supported ❌
- **Baidu Browser**: Not fully supported ❌
- **Android QQ Browser**: Not fully supported ❌

**KaiOS**
- ❌ Not supported: Versions 2.5
- ✅ **Supported: Version 3.0-3.1+**

---

## Implementation Guide

### Basic Example

```css
/* Animate grid column transitions */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  transition: grid-template-columns 0.3s ease;
}

.grid-container.collapsed {
  grid-template-columns: 1fr;
}
```

### Advanced Example with Row Animation

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-rows: auto 1fr;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.responsive-grid.compact {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto 1fr;
}
```

### Interactive Dashboard Example

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  transition: grid-template-columns 0.3s ease;
}

.dashboard.sidebar-collapsed {
  grid-template-columns: 50px 1fr;
}

.dashboard.fullscreen {
  grid-template-columns: 1fr;
}
```

---

## Known Issues and Notes

- **Empty Notes Section**: The upstream CanIUse data does not contain known issues or specific bugs for this feature
- **Consistent Implementation**: All major modern browsers implement CSS Grid animation consistently
- **Animation Smoothness**: Performance may vary based on grid complexity and the number of animated properties

---

## Fallback Strategies

For browsers that don't support CSS Grid animation (primarily Internet Explorer and Opera Mini), consider these alternatives:

1. **Conditional CSS**: Use feature detection and provide non-animated fallback layouts
2. **JavaScript Animations**: Implement grid changes with JavaScript-based animations
3. **CSS Classes**: Toggle classes without animation for unsupported browsers

```css
/* Fallback for older browsers */
@supports not (animation: test) {
  .grid-container.collapsed {
    grid-template-columns: 1fr;
    /* Instant change instead of animation */
  }
}
```

---

## Related Resources

### W3C Specifications
- [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/) - Official specification
- [CSS Grid Layout Module Level 2](https://www.w3.org/TR/css-grid-2/) - Extended grid features

### Related Features
- [CSS Grid Layout](https://caniuse.com/css-grid) - Base grid support
- [CSS Transitions](https://caniuse.com/css-transitions) - Animation fundamentals
- [CSS Animations](https://caniuse.com/css-animations) - Keyframe-based animations

### Keywords
`grid`, `grids`, `grid-template-rows`, `grid-template-columns`, `grid-template`, `display:grid`, `animation`, `animatable`

---

## Summary

CSS Grid animation is a mature feature with excellent browser support across all modern browsers (Chrome 107+, Edge 107+, Firefox 66+, Safari 16+, Opera 93+). It provides a native way to smoothly transition between grid layout changes, significantly enhancing the user experience in responsive web applications. With 90.52% global browser support, it's safe to use in production for most modern web applications, though fallback strategies should be considered for legacy browser support.
