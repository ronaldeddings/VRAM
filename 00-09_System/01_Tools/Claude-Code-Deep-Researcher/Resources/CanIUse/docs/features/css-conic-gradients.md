# CSS Conical Gradients

## Overview

CSS Conical Gradients provide a method for defining conical (radial angular) or repeating conical color gradients as CSS image values. This feature enables developers to create pie-chart-like, color wheel, or other circular gradient effects without relying on background images or complex SVG implementations.

## Specification

| Property | Value |
|----------|-------|
| **Specification** | [CSS Image Values and Replaced Content Module Level 4](https://www.w3.org/TR/css-images-4/#conic-gradients) |
| **Status** | Working Draft (WD) |
| **Category** | CSS |

## What Are Conic Gradients?

Conic gradients rotate colors around a central point, similar to a color wheel or pie chart. Unlike linear gradients (which flow in one direction) or radial gradients (which radiate outward), conic gradients transition colors in a circular/rotational pattern.

### Basic Syntax

```css
/* Simple conic gradient */
background: conic-gradient(red, yellow, green, blue, red);

/* With position and angles */
background: conic-gradient(from 45deg at 50% 50%, #ff0000, #ffff00, #00ff00);

/* Repeating conic gradient */
background: repeating-conic-gradient(from 0deg, red 0deg 30deg, blue 30deg 60deg);
```

## Use Cases & Benefits

### Common Applications

| Use Case | Description | Example |
|----------|-------------|---------|
| **Color Wheels** | Create HSL color selector wheels and color pickers | Design tools, color adjustment UIs |
| **Pie Charts** | Visualize data proportions without canvas/SVG | Dashboard visualizations, analytics |
| **Donut Charts** | Circular progress indicators and status displays | Loading indicators, completion percentage |
| **Decorative Elements** | Create visually interesting backgrounds and borders | Hero sections, visual separators, accent elements |
| **Sunburst Diagrams** | Display hierarchical data in circular format | Organization charts, skill matrices |

### Key Benefits

- **Pure CSS**: No JavaScript or additional libraries required
- **Performance**: Lighter than images or SVG; renders as native CSS
- **Scalability**: Resolution-independent; scales perfectly to any size
- **Accessibility**: Works with screen readers when combined with semantic HTML
- **Customization**: Easy to animate and modify dynamically
- **Responsive**: Automatically scales with container without additional queries

## Browser Support

### Support Table (First Version with Full Support)

| Browser | First Support | Release Date | Status |
|---------|---------------|--------------|--------|
| Chrome | 69 | Sep 2018 | Full support (with partial support in 69-70) |
| Edge | 79 | Jan 2020 | Full support |
| Firefox | 83 | Nov 2020 | Full support (disabled in 75-82) |
| Safari | 12.1 | Mar 2019 | Full support |
| Opera | 56 | Aug 2018 | Full support (with partial support in 56-57) |
| iOS Safari | 12.2 | Mar 2019 | Full support |
| Chrome Android | 142 | Latest | Full support |
| Firefox Android | 144 | Latest | Full support |
| Samsung Internet | 10.1 | Mar 2019 | Full support |

### Global Support

- **Global Usage**: 92.69% of users have browser support
- **Partial Support**: Available in older versions with flags or limited feature sets

### Browser-Specific Notes

#### Chrome (59-70)
- Status: Partial support (`n d #1 #2`)
- Can be enabled via "Experimental Web Platform Features" flag
- Does not support multi-position color stops
- Full support: Chrome 71+

#### Firefox (75-82)
- Status: Experimental (`n d #3`)
- Can be enabled with `layout.css.conic-gradient.enabled` flag
- Full support: Firefox 83+

#### Opera (46-57)
- Status: Partial support (`n d #1 #2`)
- Can be enabled via "Experimental Web Platform Features" flag
- Does not support multi-position color stops
- Full support: Opera 58+

#### Safari (12.1+)
- Full support with no flags required
- All modern versions (13+) have complete support

### Unsupported Browsers

- **Internet Explorer**: All versions (5.5-11) - No support
- **Opera Mini**: All versions - No support
- **Older Android versions**: No support prior to version 142

## Known Issues & Limitations

### Resolved Issues
- Multi-position color stops: No known current issues in modern browsers

### Partial Support Limitations
- Early Chrome (59-70) and Opera (46-57) implementations don't support multi-position color stops syntax like `conic-gradient(red 0deg 25deg, blue 25deg 50deg)`

### Browser Flags

To enable conic gradients in browsers with experimental support:

- **Chrome/Chromium**: Enable "Experimental Web Platform Features" in `chrome://flags`
- **Firefox**: Set `layout.css.conic-gradient.enabled` to `true` in `about:config`

## Fallback & Polyfill Solutions

### Client-Side Polyfill
For older browsers, a polyfill is available:
- **Project**: [leaverou/conic-gradient](https://leaverou.github.io/conic-gradient/)
- **Method**: Uses JavaScript to detect unsupported browsers and provides fallback rendering
- **Use Case**: When you need support in IE or very old browser versions

### Server-Side Polyfill (PostCSS)
For build-time processing:
- **Project**: [postcss-conic-gradient](https://github.com/jonathantneal/postcss-conic-gradient)
- **Method**: Transforms conic-gradient CSS into compatible alternatives during build
- **Benefit**: No runtime overhead; all processing happens at build time

### Fallback Strategy
```css
/* Fallback for unsupported browsers */
background: linear-gradient(45deg, red, yellow, green, blue);
background: conic-gradient(red, yellow, green, blue, red);
```

## Related Features

### CSS Gradients Family
- [Linear Gradients](/features/css-gradients.md) - Directional color transitions
- [Radial Gradients](/features/css-radial-gradients.md) - Center-point radial color transitions
- [Repeating Gradients](/features/css-repeating-gradients.md) - Repeating linear and radial patterns

### Related CSS Features
- [CSS Transforms](/features/css-transforms.md) - Combine with transforms for advanced effects
- [CSS Animations](/features/css-animations.md) - Animate color stops for dynamic effects
- [CSS Variables](/features/css-variables.md) - Use custom properties for dynamic gradient values

## Code Examples

### Basic Color Wheel

```css
.color-wheel {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    red,
    yellow,
    lime,
    cyan,
    blue,
    magenta,
    red
  );
}
```

### Pie Chart Visualization

```css
.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff6b6b 0deg 90deg,
    #4ecdc4 90deg 180deg,
    #ffe66d 180deg 270deg,
    #a8dadc 270deg 360deg
  );
}
```

### Animated Pie Chart

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animated-gradient {
  width: 200px;
  height: 200px;
  background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
  animation: spin 4s linear infinite;
}
```

### Repeating Conic Pattern

```css
.repeating-pattern {
  width: 300px;
  height: 300px;
  background: repeating-conic-gradient(
    from 45deg at 50% 50%,
    #3498db 0deg 30deg,
    #e74c3c 30deg 60deg
  );
}
```

### HSL Color Picker

```css
.hsl-picker {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  /* Hue wheel */
  background: conic-gradient(
    hsl(0, 100%, 50%),
    hsl(30, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(90, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(150, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(210, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(270, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(330, 100%, 50%),
    hsl(0, 100%, 50%)
  );
}
```

## Debugging & Testing

### Check Support Programmatically

```javascript
// Check if conic gradients are supported
function supportsConicGradient() {
  const el = document.createElement('div');
  const style = el.style;
  style.backgroundImage = 'conic-gradient(red, blue)';
  return style.backgroundImage !== '';
}

if (supportsConicGradient()) {
  console.log('Conic gradients are supported');
} else {
  console.log('Apply fallback');
}
```

### CSS Feature Queries

```css
@supports (background: conic-gradient(red, blue)) {
  /* Use conic gradients */
  .element {
    background: conic-gradient(red, yellow, green, blue, red);
  }
}

@supports not (background: conic-gradient(red, blue)) {
  /* Apply fallback */
  .element {
    background: linear-gradient(45deg, red, green, blue);
  }
}
```

## References & Resources

### Official Specification
- [W3C CSS Image Values and Replaced Content Module Level 4](https://www.w3.org/TR/css-images-4/#conic-gradients)

### Documentation
- [MDN Web Docs - conic-gradient()](https://developer.mozilla.org/docs/Web/CSS/conic-gradient)

### Polyfills & Tools
- [Client-side Polyfill by Lea Verou](https://leaverou.github.io/conic-gradient/)
- [PostCSS Conic Gradient Plugin](https://github.com/jonathantneal/postcss-conic-gradient)

### Bug Reports
- [Mozilla Bug #1175958: Implement conic gradients](https://bugzilla.mozilla.org/show_bug.cgi?id=1175958)

### Tutorials & Guides
- [CSS-Tricks - Conic Gradients](https://css-tricks.com/snippets/css/conic-gradient/)
- [Smashing Magazine - CSS Gradients](https://www.smashingmagazine.com/2017/07/starry-night-css-gradient-animations/)

## Accessibility Considerations

### Best Practices

1. **Use Semantic Colors**: Ensure gradient colors provide sufficient contrast for text
2. **Combine with Content**: Use conic gradients for decoration, not critical information display
3. **Include Text Alternatives**: For charts/diagrams, provide accompanying text descriptions
4. **Test Contrast**: Use color contrast checkers to verify readability
5. **Support Reduced Motion**: Respect `prefers-reduced-motion` for animations

### Example with Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .animated-gradient {
    animation: none;
  }
}

.pie-chart {
  color: #333; /* Ensure text is readable over gradient */
}

.chart-label {
  /* Provide explicit labels for screen readers */
  aria-label: "Pie chart showing distribution";
}
```

## Performance Notes

- **Rendering**: Conic gradients are rendered by the browser engine, offering better performance than image-based alternatives
- **Memory**: Zero additional memory overhead compared to background images
- **Animation**: Smooth 60fps animations possible on modern hardware
- **Mobile**: Well-supported on mobile devices with full support in Chrome Android, Firefox Android, and Safari iOS (12.2+)

## Conclusion

CSS Conic Gradients are a powerful CSS feature with excellent browser support (92.69% globally). With their broad adoption across modern browsers and minimal polyfill requirements for older browsers, they provide a reliable method for creating circular gradient effects. The feature is particularly valuable for creating interactive color pickers, pie charts, and decorative elements without the overhead of images or SVG.

---

*Last Updated: 2025*
*Data Source: CanIUse*
