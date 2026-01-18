# CSS3 Transitions

## Overview

CSS3 Transitions provide a simple method of animating certain properties of an element, with the ability to define the property being animated, duration, delay, and timing function. This creates smooth visual changes between states without requiring JavaScript.

## Description

CSS Transitions enable developers to create smooth animations when CSS property values change. Instead of a property changing instantly, transitions allow the change to occur over a specified duration with a defined timing function. This is achieved through the `transition` family of CSS properties and is fired off by a triggering event (such as a hover, focus, or class change).

## Specification Status

- **Current Status**: Working Draft (WD)
- **W3C Specification**: https://www.w3.org/TR/css3-transitions/

## Categories

- CSS3

## Key Properties

CSS Transitions are controlled through the following CSS properties:

- `transition-property`: Specifies which CSS properties the transition effect applies to
- `transition-duration`: Specifies how long the transition effect takes (in seconds or milliseconds)
- `transition-timing-function`: Specifies the speed curve of the transition effect
- `transition-delay`: Specifies a delay (in seconds or milliseconds) before the transition effect starts
- `transition`: A shorthand property for all of the above

### Supported Timing Functions

- Linear
- Ease
- Ease-in
- Ease-out
- Ease-in-out
- Cubic-bezier()
- Steps() *(limited support)*
- Step-start *(limited support)*
- Step-end *(limited support)*

## Benefits and Use Cases

### Benefits

1. **Smooth User Experience**: Provides visual feedback and makes interactions feel more polished
2. **Performance**: Hardware-accelerated on most modern browsers
3. **Simplicity**: Requires only CSS; no JavaScript needed for basic animations
4. **Accessibility**: Respects user's motion preferences via `prefers-reduced-motion` media query
5. **Reduced Complexity**: Eliminates need for animation libraries for simple state changes

### Use Cases

- **Hover Effects**: Smoothly animate button colors, sizes, or shadows on hover
- **Page Transitions**: Fade or slide elements in/out when navigating
- **Form Interactions**: Smooth focus states and validation feedback
- **Menu Animations**: Dropdown menus and navigation elements
- **Opacity Changes**: Smooth fade effects
- **Position Changes**: Smooth translate transforms
- **Color Changes**: Gradual color shifts (background, text, borders)
- **Size Changes**: Smooth resize effects
- **Loading States**: Animated indicators and progress feedback

## Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| **Internet Explorer** | 10 | IE9 and below: No support |
| **Edge** | 12 | All modern versions supported |
| **Firefox** | 5 | Versions 4: Partial support with `-moz-` prefix<br>Versions 5-15: Requires `-moz-` prefix<br>Version 16+: Full support |
| **Chrome** | 4 | Versions 4-25: Requires `-webkit-` prefix<br>Version 26+: Full support |
| **Safari** | 5.1 | Versions 3.1-5: Partial support with `-webkit-` prefix<br>Version 5.1-6: Requires `-webkit-` prefix<br>Version 6.1+: Full support |
| **Opera** | 12 | Versions 10.5-11.6: Partial support with `-o-` prefix<br>Version 12: Supports with `-webkit-` prefix<br>Version 12.1+: Full support |
| **iOS Safari** | 6.0 | Versions 3.2-5.1: Partial support<br>Version 6.0+: Full support |
| **Android Browser** | 2.1 | Versions 2.1-4.3: Requires `-webkit-` prefix<br>Version 4.4+: Full support |
| **Chrome for Android** | 142 | Full support |
| **Firefox for Android** | 144 | Full support |
| **Samsung Internet** | 4 | Full support |
| **UC Browser** | 15.5 | Full support |
| **Opera Mini** | All | Not supported |
| **BlackBerry** | 10 | Full support |
| **IE Mobile** | 10 | Full support |

### Global Support

- **Full Support (Unprefixed)**: 93.6% of users globally
- **Partial Support**: Less than 0.1% of users
- **No Support**: Less than 0.1% of users

## Compatibility Notes

### Full Support Requirements

Supported in all major modern browsers. Internet Explorer requires version 10 or later.

### Vendor Prefixes

For older browser versions, vendor prefixes are required:
- `-webkit-` for Chrome (4-25), Safari (3.1-6), Android (2.1-4.3), and Opera (10.5-11.6)
- `-moz-` for Firefox (4-15)
- `-o-` for Opera (10.5-11.6)
- `-ms-` for IE10

### Unprefixed Support

- **Chrome**: Version 26+
- **Firefox**: Version 16+
- **Safari**: Version 6.1+
- **Opera**: Version 12.1+
- **IE**: Version 10+

## Known Issues and Limitations

1. **Pseudo-Element Limitation**: Not supported on any pseudo-elements besides `::before` and `::after` for Firefox, Chrome 26+, Opera 16+, and IE10+

2. **calc() Values**: Transitionable properties with `calc()` derived values are not supported in IE11 and below

3. **Internet Explorer Background-Size**: IE does not support transitions of the `background-size` property

4. **IE11 SVG Fill**: IE11 does not support CSS transitions on the SVG `fill` property

5. **Chrome transition-delay Unit**: In Chrome (up to version 43), the unit cannot be omitted for the `transition-delay` property, even if the value is 0 (e.g., use `0ms` not `0`)

6. **IE10-11 column-count**: IE10 and IE11 do not support transitioning the `column-count` property

7. **Safari flex-basis**: Safari 11 does not support CSS transitions on the `flex-basis` property

8. **Step Timing Functions**: Early browser versions do not support `steps()`, `step-start`, and `step-end` timing functions:
   - Safari 3.1-6: No support
   - Firefox 4: No support
   - Chrome 4-25: No support
   - Opera 10.5-11.6: No support

## transitionend Event

CSS Transitions fire the `transitionend` event when a transition has completed. This event can be listened to via JavaScript to trigger further actions after an animation finishes.

```javascript
element.addEventListener('transitionend', function() {
  console.log('Transition completed');
});
```

## Basic Usage Example

```css
/* Single property */
button {
  background-color: blue;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: darkblue;
}

/* Multiple properties */
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  transition: width 0.5s ease, height 0.5s ease, background-color 0.3s ease;
}

.box:hover {
  width: 200px;
  height: 200px;
  background-color: blue;
}

/* With delay */
.menu-item {
  opacity: 0;
  transition: opacity 0.3s ease 0.1s;
}

.menu-item.visible {
  opacity: 1;
}
```

## Browser Prefix Usage (Legacy Support)

For compatibility with older browsers, include vendor prefixes:

```css
.element {
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
```

## Related Resources

- [CSS Transitions 101 - Web Designer Depot](https://www.webdesignerdepot.com/2010/01/css-transitions-101/)
- [CSS Timing Functions - The Art of Web](https://www.the-art-of-web.com/css/timing-function/)
- [WebPlatform Documentation](https://webplatform.github.io/docs/css/properties/transition)
- [MDN - CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions)

## Additional Notes

Support information listed covers both the `transition` properties (`transition-property`, `transition-duration`, `transition-timing-function`, `transition-delay`, and the shorthand `transition`) as well as the `transitionend` event.

CSS Transitions are now widely supported across all modern browsers and are safe to use in production without fallbacks for most use cases. However, consider browser support requirements for your specific audience and add vendor prefixes or fallbacks if targeting older browser versions.

For reduced motion accessibility, always consider user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*Last Updated: 2025*
*Data Source: Can I Use (caniuse.com)*
