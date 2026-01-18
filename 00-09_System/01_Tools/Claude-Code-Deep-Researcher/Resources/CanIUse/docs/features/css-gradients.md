# CSS Gradients

## Description

CSS Gradients provide a method of defining linear or radial color gradients as CSS images. This allows developers to create smooth color transitions across elements without requiring external image files, resulting in smaller file sizes, better scalability, and easier maintenance.

## Specification Status

| Property | Value |
|----------|-------|
| **Status** | Candidate Recommendation (CR) |
| **Specification** | [W3C CSS Image Values and Replaced Content Module Level 3](https://www.w3.org/TR/css3-images/) |

## Categories

- CSS3

## Benefits and Use Cases

### Key Benefits
- **Reduced File Size**: No need for external gradient images, reducing HTTP requests and bandwidth
- **Scalability**: Gradients scale perfectly to any screen size without quality loss
- **Flexibility**: Easy to modify gradients with CSS, no image editing required
- **Performance**: Faster rendering than background images, hardware-accelerated in modern browsers
- **Maintainability**: Colors and angles defined in code, easier to update across projects

### Common Use Cases
1. **Background Gradients** - Create visually appealing page and element backgrounds
2. **Button Styling** - Add depth and visual interest to interactive elements
3. **Hero Sections** - Create compelling landing page headers with color gradients
4. **Card Designs** - Add subtle gradients to cards and containers
5. **Text Effects** - Combine with `-webkit-background-clip: text` for gradient text
6. **Loading Animations** - Animate gradients for loading indicators
7. **Design Overlays** - Create semi-transparent gradient overlays on images
8. **UI Accents** - Highlight important areas with gradient accents

## Browser Support

### Support Summary by Browser

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 26 | Prefixed support from 4-25, unprefixed from 26+ |
| **Edge** | 12 | Full support from Edge 12+ |
| **Firefox** | 36 | Partial support (no premultiplied colors) from 3.6-35 |
| **Safari** | 15.4 | Partial support from 4-15.3, full support from 15.4+ |
| **Opera** | 12.1 | Partial support from 11.1-11.5, with `-webkit-` prefix |
| **Internet Explorer** | 10 | Only in IE 10+, no support in IE 9 and below |
| **iOS Safari** | 15.4 | Partial support until 15.4 |
| **Android Browser** | 4.4 | Prefixed support from 2.1-4.3 |

### Detailed Browser Support Matrix

#### Desktop Browsers

| Version | Chrome | Edge | Firefox | Safari | Opera | IE |
|---------|--------|------|---------|--------|-------|-----|
| 4-9 | a (webkit) | - | n | n | n | n |
| 10 | y (webkit) | - | n | - | n | y |
| 10-25 | y (webkit) | - | a | a | a | y |
| 26+ | y | y | y | a (until 15.3) | y | - |
| 12-current | y | y | y | y (15.4+) | y | - |
| Latest | 146+ | 143+ | 148+ | 26+ | 122+ | - |

#### Mobile Browsers

| Platform | Browser | First Full Support |
|----------|---------|-------------------|
| **iOS** | Safari | 15.4 |
| **Android** | Chrome | 142+ |
| **Android** | Firefox | 144+ |
| **Android** | UC Browser | 15.5 |
| **Android** | Samsung Internet | 4.0+ |
| **Opera Mini** | All versions | Not supported (n) |
| **BlackBerry** | - | 10+ (y) |
| **KaiOS** | - | 2.5+ (y) |

#### Support Legend
- **y** = Full support
- **a** = Partial support
- **n** = No support
- **x** = Requires prefix

### Prefixed Support

Developers targeting older browsers should be aware of prefix requirements:

- **Chrome 4-25**: `-webkit-gradient` (older syntax)
- **Safari 4-15.3**: `-webkit-gradient` / `-webkit-linear-gradient` (may use older syntax)
- **Firefox 3.6-35**: `-moz-linear-gradient` / `-moz-radial-gradient`
- **Opera 11.1-11.5**: `-webkit-gradient` (only linear gradients)

## Global Browser Usage

- **Full Support (y)**: 93.06%
- **Partial Support (a)**: 0.53%
- **No Support (n)**: Minimal legacy browsers

This indicates excellent global support, making CSS Gradients safe to use in modern web development with minimal fallbacks needed.

## Known Issues and Notes

### Important Compatibility Notes

1. **Syntax Variations**: Browsers with prefixed support may use incompatible syntax with properly supported versions. Testing across browsers is recommended.

2. **Premultiplied Color Issues**: Safari and older Firefox versions (before Firefox 36) have partial support due to not using premultiplied colors, which results in unexpected behavior when using the `transparent` keyword. This was advised against in the [CSS spec](https://www.w3.org/TR/2012/CR-css3-images-20120417/#color-stop-syntax).

3. **IE Fallback Support**: Support can be somewhat emulated in older IE versions (IE 6-9) using the non-standard `gradient` filter, though this is not recommended for modern projects.

4. **Modern Syntax**: Firefox 10+, Opera 11.6+, Chrome 26+, and IE10+ support the modern "to (side)" syntax, which is the recommended approach for new development.

5. **Prefixed Syntax (Webkit)**: Chrome 4-9 and Safari 4-5.1 implement an earlier prefixed syntax as `-webkit-gradient`, which differs from the modern `-webkit-linear-gradient` syntax.

### Legacy IE Support (IE 6-9)

For applications requiring IE 6-9 support, Microsoft's proprietary gradient filter can be used as a fallback:

```css
/* Modern syntax */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* IE 6-9 fallback */
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#667eea', endColorstr='#764ba2');
```

## Code Examples

### Linear Gradient

```css
/* Basic horizontal gradient */
background: linear-gradient(to right, #ff0000, #0000ff);

/* Diagonal gradient with angle */
background: linear-gradient(45deg, #ff0000 0%, #0000ff 100%);

/* Multiple color stops */
background: linear-gradient(90deg, red 0%, yellow 50%, blue 100%);
```

### Radial Gradient

```css
/* Simple radial gradient */
background: radial-gradient(circle, white, black);

/* Elliptical with position */
background: radial-gradient(ellipse at center, #ffd89b 0%, #19547b 100%);
```

### Gradient Text (with Webkit Prefix)

```css
.gradient-text {
  background: linear-gradient(45deg, #ff0000, #0000ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Related Features and Resources

### External Tools and Resources

- **[ColorZilla Gradient Editor](https://www.colorzilla.com/gradient-editor/)** - Cross-browser gradient editor and CSS generator
- **[CSS3Pie](http://css3pie.com/)** - Tool to emulate CSS3 gradient support in Internet Explorer
- **[WebPlatform Docs](https://webplatform.github.io/docs/css/functions/linear-gradient)** - Comprehensive documentation for CSS linear-gradient function

### Related CSS Features

- `background-image` - Base property for applying gradients
- `background-position` - Controls gradient positioning
- `background-size` - Controls gradient sizing
- `background-clip` - Controls how backgrounds are clipped (useful for gradient text)
- `background-attachment` - Controls gradient scrolling behavior

### Conic and Additional Gradients

Modern browsers also support:
- **Conic gradients** - `conic-gradient()` - Rotates around a point
- **Repeating gradients** - `repeating-linear-gradient()` and `repeating-radial-gradient()`

## Migration Path from Images

### Why Replace Gradient Images?

1. **File Size**: A gradient image might be 5-50 KB, CSS gradients are only bytes
2. **Flexibility**: Easily change colors, angles, or transitions in code
3. **Scalability**: Perfect scaling to any screen size
4. **Performance**: Rendered by GPU, not loaded as external resource
5. **Accessibility**: Colors defined in code can be adjusted for dark mode

### Example Migration

**Before (Image-based):**
```css
background-image: url('gradient.png');
background-size: cover;
```

**After (CSS Gradient):**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Browser Prefixing Strategy (2024 and Beyond)

For modern development (2024+), prefixes are largely optional:

```css
/* Can safely use unprefixed - all modern browsers support */
background: linear-gradient(to right, #ff0000, #0000ff);

/* Only needed if targeting IE 10 specifically */
background: -webkit-linear-gradient(left, #ff0000, #0000ff); /* IE 10 */
background: linear-gradient(to right, #ff0000, #0000ff);
```

Most modern CSS-in-JS tools and PostCSS autoprefixer handle this automatically.

---

**Last Updated**: 2024
**Specification**: [W3C CSS Image Values Module Level 3](https://www.w3.org/TR/css3-images/)
**CanIUse Reference**: [css-gradients](https://caniuse.com/css-gradients)
