# CSS Animation

## Overview

CSS Animation is a complex and powerful method of animating certain properties of an element without relying on JavaScript. This feature allows developers to create smooth, performant animations directly through CSS, enabling property transitions over specified durations with customizable timing functions and iteration patterns.

**Global Usage**: 93.6% of users have full support

---

## Specification

| Property | Value |
|----------|-------|
| **Status** | Working Draft (WD) |
| **Specification URL** | [W3C CSS Animations Level 3](https://www.w3.org/TR/css3-animations/) |

---

## Categories

- **CSS3** - Part of the CSS3 specification for advanced visual effects

---

## Benefits & Use Cases

### Performance Advantages
- **GPU-Accelerated**: Animations run on the GPU, providing smooth 60fps performance without blocking the main thread
- **Reduced JavaScript**: No need for complex JavaScript animation libraries, reducing bundle size and computational overhead
- **Battery Efficient**: More efficient on mobile devices compared to JavaScript-based animations

### Common Use Cases

| Use Case | Example |
|----------|---------|
| **Loading States** | Spinning loaders, pulsing indicators, progress bar animations |
| **Micro-interactions** | Button hover effects, icon animations, smooth state transitions |
| **Page Transitions** | Fade in/out effects, slide animations, scale transformations |
| **Attention Direction** | Bounce effects, shake animations, highlight sequences |
| **Complex Sequences** | Multi-step animations with keyframes, property chains |
| **Timing Control** | Delayed animations, staggered sequences, infinite loops |

### Key Features
- `@keyframes` rule for defining animation sequences
- `animation-duration` for controlling animation length
- `animation-delay` for staggering animations
- `animation-timing-function` for easing (ease, ease-in-out, cubic-bezier, steps, etc.)
- `animation-iteration-count` for loop control
- `animation-fill-mode` for defining state before/after animation
- Animation events (animationstart, animationend, animationiteration)

---

## Browser Support

### Desktop Browsers

| Browser | First Version | Full Support | Notes |
|---------|---------------|--------------|-------|
| **Chrome** | 4.0 (with prefix) | 43+ | Full unprefixed support since v43 |
| **Firefox** | 5.0 (with prefix) | 16+ | Full unprefixed support since v16 |
| **Safari** | 4.0 (partial) | 5.1+ | Webkit prefix required until v9 |
| **Opera** | 12.0 (with prefix) | 12.1+ | Full support from v12.1 |
| **Edge** | 12.0 | 12+ | Full support from initial release |
| **IE** | 10.0 | 10+ | Support added in IE10 |

### Mobile & Tablet Browsers

| Browser | First Version | Full Support | Notes |
|---------|---------------|--------------|-------|
| **iOS Safari** | 3.2 (partial) | 5.1+ | Webkit prefix required until v9 |
| **Android Browser** | 2.1 (partial) | 4.0+ | Webkit prefix required; animation-fill-mode unsupported below 2.3 |
| **Samsung Internet** | 4.0 | 4.0+ | Full support from v4.0 |
| **Opera Mobile** | 12.1 | 12.1+ | Full support from v12.1 |
| **UC Browser** | 15.5+ | 15.5+ | Full support |
| **Opera Mini** | All versions | ❌ Not Supported | No support across all versions |

### Support Legend

| Badge | Meaning |
|-------|---------|
| **y** | Fully supported |
| **a** | Partially supported with bugs or limitations |
| **n** | Not supported |
| **x** | Vendor prefix required (e.g., `-webkit-`, `-moz-`) |

---

## Known Issues & Bugs

### Critical Issues

#### 1. Animation-fill-mode Property in Android < 2.3
- **Affected**: Android browser below version 2.3
- **Issue**: The `animation-fill-mode` property is not supported
- **Workaround**: Set initial styles using regular CSS for pre-animation states

#### 2. Pseudo-element Animation in iOS
- **Affected**: iOS 6.1 and below, iOS 7+ (buggy)
- **Issue**:
  - iOS 6.1 and below: No animation support on pseudo-elements (::before, ::after)
  - iOS 7 and higher: Buggy behavior when animating pseudo-elements
- **Workaround**: Avoid animating pseudo-elements on iOS; use regular elements instead

#### 3. @keyframes in Inline/Scoped Stylesheets (Firefox)
- **Affected**: Firefox
- **Issue**: `@keyframes` rules are not supported when defined in inline `<style>` tags or scoped stylesheets
- **Bug Reference**: [Firefox Bug #830056](https://bugzilla.mozilla.org/show_bug.cgi?id=830056)
- **Workaround**: Define @keyframes in external stylesheets or document-level stylesheets only

#### 4. Steps Timing Function Backward Fill Mode (Chrome)
- **Affected**: Chrome
- **Issue**: `animation-fill-mode: backwards` produces incorrect results when used with `steps(x, start)` timing function
- **Test Case**: [CodePen Example](https://codepen.io/Fyrd/pen/jPPKpX)
- **Workaround**: Use alternative timing functions or animation-fill-mode values; test thoroughly

#### 5. Keyframes Inside Media Queries (IE10/IE11)
- **Affected**: Internet Explorer 10 and 11
- **Issue**: CSS keyframe blocks are not supported when defined inside `@media` queries
- **Workaround**: Define all `@keyframes` outside of media query definitions
- **Example**: [CodePen - Keyframes in Media Query](https://codepen.io/anon/pen/ZOodVd)

#### 6. Translate Transform in Animations (IE10/IE11 on Windows 7)
- **Affected**: Internet Explorer 10 and 11 on Windows 7
- **Issue**: `translate()` transform values are always interpreted as pixels when used in animations, ignoring percentage values
- **Test Case**: [CodePen - Translate Transform Bug](https://codepen.io/flxsource/pen/jPYWoE)
- **Workaround**: Use `transform: translate(Xpx, Ypx)` with explicit pixel values; avoid percentages

#### 7. Animation Events on Pseudo-elements (IE10/IE11)
- **Affected**: Internet Explorer 10 and 11
- **Issue**: Animation events (animationstart, animationend, animationiteration) are not fired for pseudo-element animations
- **Example**: [CodePen - Animation Events on Pseudo-elements](https://codepen.io/dogoku/pen/JRwbmL)
- **Workaround**: Listen for animation events on regular elements; use alternative detection methods for pseudo-element animations

---

## Vendor Prefix Requirements

### Historical Prefix Support

| Browser | Versions with Prefix | Unprefixed Support |
|---------|----------------------|-------------------|
| **Chrome** | 4-42 | 43+ |
| **Firefox** | 5-15 | 16+ |
| **Safari** | 4-8 | 9+ |
| **Opera** | 12-29 | 30+ |

### Modern Approach

For modern browsers, vendor prefixes are largely unnecessary. However, for legacy browser support, use:

```css
@keyframes slidein {
  from {
    margin-left: 100%;
  }
  to {
    margin-left: 0%;
  }
}

.element {
  /* Unprefixed (modern browsers) */
  animation: slidein 3s ease-in-out;

  /* Legacy prefixes for older browsers */
  -webkit-animation: slidein 3s ease-in-out;
  -moz-animation: slidein 3s ease-in-out;
}
```

---

## Timing Functions & Browser Support

### Standard Timing Functions

All modern browsers support:
- `ease`, `ease-in`, `ease-out`, `ease-in-out`
- `linear`
- `cubic-bezier(x1, y1, x2, y2)`

### Step Timing Functions

| Function | Status | Notes |
|----------|--------|-------|
| `steps(n, start)` | Mostly Supported | Safari 4-5 partial; Chrome <43 partial |
| `steps(n, end)` | Mostly Supported | Safari 4-5 partial; Chrome <43 partial |
| `step-start` | Mostly Supported | Safari 4-5 partial; Chrome <43 partial |
| `step-end` | Mostly Supported | Safari 4-5 partial; Chrome <43 partial |

**Note**: Safari 4-5 and Chrome <43 do not fully support the `steps()`, `step-start`, and `step-end` timing functions.

---

## Partial Support Notes

### Annotation #1: Android Browser Partial Support
The partial support in Android browser (versions below 4.0) refers to **buggy behavior** in different animation scenarios. While animations may work in some cases, they may fail or behave unexpectedly in others. Testing is essential before deploying to older Android browsers.

### Annotation #2: Safari 4-5 Limitation
Safari 4-5 does not support the `steps()`, `step-start`, and `step-end` timing functions, limiting animation timing control to standard easing functions.

---

## Performance Considerations

### Optimization Tips

1. **Use Transform & Opacity**: Animate only `transform` and `opacity` properties for best performance; these don't trigger layout recalculations
   ```css
   /* Good - GPU accelerated */
   @keyframes moveX {
     to { transform: translateX(100px); }
   }

   /* Avoid - Triggers layout */
   @keyframes moveX {
     to { left: 100px; }
   }
   ```

2. **Will-change Property**: Use `will-change` to hint at browsers about animated properties
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

3. **Reduce Keyframe Complexity**: Keep keyframe definitions simple; complex calculations should happen outside animations

4. **Use Hardware Acceleration**: Ensure 3D transforms trigger GPU acceleration
   ```css
   .element {
     transform: translateZ(0); /* Force GPU acceleration */
   }
   ```

---

## Related Resources

### Official Documentation
- [MDN - CSS animation](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [WebPlatform Docs - CSS Animations](https://webplatform.github.io/docs/css/properties/animations)
- [W3C CSS Animations Level 3 Specification](https://www.w3.org/TR/css3-animations/)

### Educational Resources
- [Blog Post on CSS3 Animations Usage](https://robertnyman.com/2010/05/06/css3-animations/)

### Related CSS Features
- **CSS Transitions** - For simpler property changes between states
- **CSS Transforms** - For 2D and 3D transformations
- **CSS Will-change** - For optimization hints to the browser
- **Web Animations API** - For JavaScript-based animation control

---

## Implementation Example

### Basic Animation

```css
@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInSlide 0.6s ease-out 0.2s backwards;
  /* name, duration, timing-function, delay, fill-mode */
}
```

### Complex Keyframe Sequence

```css
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.bouncing-ball {
  animation: bounce 0.5s ease-in-out infinite;
}
```

### Animation with Events

```javascript
const element = document.querySelector('.animated');

element.addEventListener('animationstart', () => {
  console.log('Animation started');
});

element.addEventListener('animationiteration', () => {
  console.log('Animation iteration completed');
});

element.addEventListener('animationend', () => {
  console.log('Animation finished');
});
```

---

## Accessibility Considerations

### Respecting User Preferences

```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Best Practices

1. Don't use animations for critical content visibility
2. Provide alternative content for users with motion sensitivity
3. Ensure animations don't interfere with content readability
4. Use animations to enhance, not replace, user feedback

---

## Summary

CSS Animation provides excellent browser support (93.6% global usage) and is a fundamental feature for modern web development. While older browsers have limitations (particularly IE10/11 with media queries and Safari 4-5 with step timing), modern browser support is comprehensive. The feature is performant when used correctly with GPU-accelerated properties like `transform` and `opacity`, making it the preferred choice for animations over JavaScript in most scenarios.

**Key Takeaway**: CSS Animations are production-ready for modern browsers with excellent support. For legacy browser support, thorough testing and fallbacks are essential.
