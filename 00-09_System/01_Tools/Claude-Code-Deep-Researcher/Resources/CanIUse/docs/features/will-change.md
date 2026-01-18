# CSS `will-change` Property

## Overview

The `will-change` property is a CSS performance optimization hint that informs the browser about which elements are likely to change and what properties will be modified. This allows the browser to prepare optimizations ahead of time, resulting in smoother animations and transitions.

## Description

The `will-change` property is used to optimize animations by informing the browser which elements will change and what properties will change. Rather than letting the browser discover during animation that properties are changing, developers can declare these changes in advance, allowing the browser to allocate resources appropriately and apply rendering optimizations.

This is particularly useful for complex animations, transforms, and transitions where the browser can prepare rendering layers and optimization strategies ahead of time.

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification URL**: [W3C CSS will-change Module](https://w3c.github.io/csswg-drafts/css-will-change/)

## Categories

- CSS

## Benefits and Use Cases

### Performance Optimization
- **Rendering Acceleration**: Allows browsers to pre-optimize elements that will animate
- **Layer Creation**: Browsers can create new rendering layers for animated elements
- **GPU Acceleration**: Enables hardware acceleration for smoother animations

### When to Use `will-change`

1. **Animations**: Elements with CSS animations
   ```css
   .animated-box {
     will-change: transform, opacity;
     animation: slide 0.5s ease-in-out;
   }
   ```

2. **Transitions**: Elements with CSS transitions
   ```css
   .interactive-button {
     will-change: background-color;
     transition: background-color 0.3s ease;
   }
   ```

3. **Scroll Effects**: Elements affected by scroll position
   ```css
   .parallax-element {
     will-change: transform;
   }
   ```

4. **Complex Transformations**: Elements with 3D transforms
   ```css
   .rotating-cube {
     will-change: transform;
   }
   ```

### Important Considerations

- Use sparingly: `will-change` has memory and performance costs
- Remove when done: Use JavaScript to remove `will-change` when animations complete
- Don't use as default styling: Only apply when changes are expected
- Avoid over-optimization: Test with and without to measure actual performance gains

## Browser Support

| Browser | Supported Since | Current Support |
|---------|-----------------|-----------------|
| **Chrome** | Version 36 | Fully supported |
| **Edge** | Version 79 | Fully supported |
| **Firefox** | Version 36 | Fully supported |
| **Safari** | Version 9.1 | Fully supported |
| **Opera** | Version 24 | Fully supported |
| **iOS Safari** | Version 9.3 | Fully supported |
| **Android Chrome** | Version 142 | Fully supported |
| **Samsung Internet** | Version 4 | Fully supported |

### Desktop Browser Support

| Browser | Unsupported | Supported |
|---------|------------|-----------|
| Internet Explorer | All versions | ❌ |
| Chrome | < 36 | ❌ |
| Chrome | ≥ 36 | ✅ |
| Firefox | < 36 | ❌ |
| Firefox | ≥ 36 | ✅ |
| Safari | < 9.1 | ❌ |
| Safari | ≥ 9.1 | ✅ |
| Opera | < 24 | ❌ |
| Opera | ≥ 24 | ✅ |
| Edge | < 79 | ❌ |
| Edge | ≥ 79 | ✅ |

### Mobile Browser Support

| Browser | Supported Since |
|---------|-----------------|
| iOS Safari | Version 9.3 |
| Android Browser | Version 142 |
| Chrome for Android | Version 142 |
| Firefox for Android | Version 144 |
| Opera Mobile | Version 80 |
| Samsung Internet | Version 4 |
| UC Browser (Android) | Version 15.5 |
| Baidu Browser | Version 13.52 |
| KaiOS | Version 2.5 |

### Unsupported Browsers

- Opera Mini (all versions)
- Older versions of Internet Explorer
- BlackBerry browsers

## Usage Statistics

- **Global Support**: 93.2% of users have browsers that support `will-change`
- **Partial Support**: 0% (no major browsers have partial support)

## Special Notes

### Firefox Implementation
Firefox supports `will-change` starting from version 36. In versions 29-35, the feature can be enabled via the `layout.css.will-change.enabled` flag in about:config.

### Best Practices

1. **Declare Early**: Apply `will-change` before animations start
2. **Remove After**: Use JavaScript to remove the property when done
3. **Limited Use**: Only use for elements that will actually change
4. **Test Performance**: Measure actual performance improvements in your use case
5. **Avoid Global Application**: Don't add to all animated elements by default

## Syntax Examples

### Basic Usage
```css
/* Single property */
.element {
  will-change: transform;
}

/* Multiple properties */
.element {
  will-change: transform, opacity;
}

/* Remove will-change with JavaScript */
element.style.willChange = 'auto';
```

### Advanced Examples
```css
/* Scroll-linked animations */
.parallax {
  will-change: scroll-position;
}

/* Complex animations */
.complex-animation {
  will-change: transform, opacity, filter;
  animation: complexMove 2s infinite;
}

/* Conditional optimization */
.button {
  /* Applied on hover with JS */
  will-change: background-color;
  transition: background-color 0.3s;
}
```

### JavaScript Integration
```javascript
// Add will-change before animation
element.style.willChange = 'transform, opacity';

// Remove after animation completes
element.addEventListener('animationend', () => {
  element.style.willChange = 'auto';
});
```

## Related Resources

- [MDN Web Docs - will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
- [Opera Developer - CSS will-change property](https://dev.opera.com/articles/css-will-change-property/)
- [Blog: Bye Bye Layer Hacks](https://aerotwist.com/blog/bye-bye-layer-hacks/)

## Additional Links

- [CanIUse Feature Page](https://caniuse.com/css-will-change)
- [CSS Will Change Specification](https://w3c.github.io/csswg-drafts/css-will-change/)

---

**Last Updated**: Generated from CanIUse data
**Feature ID**: css-will-change
**Global Support**: 93.2%
