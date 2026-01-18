# SVG (Scalable Vector Graphics)

## Overview

SVG (Scalable Vector Graphics) is a method of displaying vector graphics features using the `<embed>` or `<object>` elements. This documentation covers basic SVG support as defined in the SVG 1.1 specification.

## Feature Details

**Title:** SVG (basic support)

**Specification Status:** Candidate Recommendation (CR)

**Specification Link:** [W3C SVG Specification](https://www.w3.org/TR/SVG/)

## Description

Scalable Vector Graphics (SVG) provides a standardized format for representing two-dimensional graphics using XML. Unlike raster images, SVG graphics scale without quality loss and offer superior performance for logos, icons, diagrams, and interactive graphics.

### Key Characteristics

- **Resolution-Independent:** SVG graphics maintain crisp quality at any size or resolution
- **Compact File Size:** Vector format typically produces smaller files than raster equivalents
- **Animatable & Interactive:** SVG elements can be manipulated with CSS and JavaScript
- **Accessibility:** Text content in SVG is indexable and screen-reader friendly
- **DOM Integration:** SVG elements are part of the document DOM

## Categories

- SVG

## Common Use Cases & Benefits

### Recommended Use Cases

1. **Logos & Brand Graphics**
   - Perfect for responsive branding across all device sizes
   - Maintains quality on any resolution display

2. **Icons & Icon Systems**
   - Efficient icon fonts alternative
   - Easy color manipulation and animation
   - Reduced HTTP requests with icon sprites

3. **Data Visualization**
   - Interactive charts and graphs
   - Real-time data representation
   - Integration with D3.js and similar libraries

4. **Responsive Illustrations**
   - Web-based illustrations that adapt to viewport
   - Interactive infographics
   - Animated diagrams

5. **Interface Elements**
   - Buttons and decorative elements
   - Custom UI components
   - Visual effects and animations

### Key Benefits

- **Scalability:** Single SVG works perfectly at any size
- **Performance:** Smaller file sizes compared to PNG/JPG alternatives
- **Manipulability:** Easy to style with CSS and control with JavaScript
- **Accessibility:** Provides semantic structure and alt text support
- **Animation:** Native support for CSS and SVG animations
- **SEO Friendly:** Text content is readable to search engines

## Browser Support

### Support Legend

- **y** = Supported
- **a** = Partial support (see notes)
- **n** = Not supported
- **#** = Refers to numbered notes below

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 4.0 | Full (v4-v146) | All versions fully supported |
| **Firefox** | 3.0 | Full (v3-v148) | Partial in v2, full from v3+ |
| **Safari** | 3.2 | Full (v3.2+) | Partial in v3.1 |
| **Opera** | 9.0 | Full (v9+) | Consistent support across versions |
| **Edge** | 12.0 | Full (v12-v143) | Partial support v12-v18 (#3), full from v79+ |
| **IE 5.5-11** | 6.0 | Partial (#2, #3) | Versions 6-8: Not supported (p), v9-11: Partial |

### Mobile Browsers

| Platform | Browser | Support | Notes |
|----------|---------|---------|-------|
| **iOS** | Safari | Full | From v3.2+ (latest: 26.1+) |
| **iOS** | Safari (iPadOS) | Full | From v3.2+ (latest: 26.0+) |
| **Android** | Chrome | Full | v142+ supported |
| **Android** | Firefox | Full | v144+ supported |
| **Android** | Stock Browser | Partial | v3-4.1 partial (#1), v4.4+ full |
| **Android** | UC Browser | Full | v15.5+ supported |
| **Android** | Opera Mobile | Full | v10+ supported |
| **Android** | Samsung Internet | Full | v4+ supported |
| **Android** | QQ Browser | Full | v14.9+ supported |
| **Android** | Baidu | Full | v13.52+ supported |
| **Opera Mini** | All versions | Full | Full support across all versions |
| **BlackBerry** | v7, v10 | Full | Full support |
| **KaiOS** | v2.5, v3.0-3.1 | Full | Full support |

### Global Usage Statistics

- **Full Support (y):** 93.31%
- **Partial Support (a):** 0.38%
- **No Support (n):** 6.31%

## Known Issues & Limitations

### 1. Chrome 26 - preserveAspectRatio Bug

**Issue:** Chrome 26 doesn't support the `preserveAspectRatio="none"` attribute.

**Workaround:** Use alternative aspect ratio values or upgrade Chrome.

### 2. Opera Mini/Mobile - Pixelation on Zoom

**Issue:** SVG graphics appear pixelated when zooming in or using scaled up images in Opera Mini and Opera Mobile 12.1 and earlier.

**Workaround:** Test rendering quality; consider alternative SVG attributes for scaling.

### 3. External File References

**Issue:** IE9-Edge12, Safari 5.1-6, and UCWeb 11 do not support referencing external files via `<use xlink:href>`.

**Workaround Options:**
- Server-side inlining + snippet ([CodePen example](https://codepen.io/hexalys/pen/epErZj/))
- [svg4everybody polyfill](https://github.com/jonathantneal/svg4everybody)

### 4. SVGPathSeg Interface Removal

**Issue:** Chrome 48+ no longer supports the `SVGPathSeg` interface.

**Polyfills Available:**
- [Original pathseg.js](https://github.com/progers/pathseg/blob/master/pathseg.js)
- [SVG 2 draft-based path-data-polyfill.js](https://github.com/jarek-foksa/path-data-polyfill.js)

### 5. IE9-11 & Edge Scaling Issues

**Issue:** IE9-11 and Edge don't properly scale SVG files.

**Workaround:** Add height, width, viewBox, and CSS rules to SVG ([CodePen example](https://codepen.io/tomByrer/pen/qEBbzw?editors=110)).

### Partial Support Notes

**Note #1 (Android 3-4):** Partial support refers to not supporting masking operations.

**Note #2 (IE9-11):** Partial support refers to not supporting animations.

**Note #3 (IE9-11, Edge 12-18):** IE9-11 and Edge don't properly scale SVG files.

## Related SVG Elements & Attributes

SVG supports the following commonly used elements and attributes:

### Core Elements
- `<svg>` - Root SVG container
- `<rect>` - Rectangle shape
- `<circle>` - Circle shape
- `<ellipse>` - Ellipse shape
- `<line>` - Line element
- `<polyline>` - Connected lines
- `<polygon>` - Closed polygon shape
- `<defs>` - Definition container for reusable elements
- `<symbol>` - Reusable symbol definition
- `<use>` - Reference to defined symbol or graphic
- `<tspan>` - Text segment
- `<tref>` - Text reference
- `<textpath>` - Text along a path

### Key Attributes
- `stroke-dasharray` - Dashed stroke pattern
- `stroke-dashoffset` - Offset for dashed pattern
- `stroke-opacity` - Stroke transparency

## Implementation Examples

### Basic Inline SVG

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="red" />
</svg>
```

### SVG as Image

```html
<img src="image.svg" alt="SVG Image">
```

### SVG in CSS Background

```css
.element {
  background-image: url('image.svg');
  background-size: cover;
}
```

### SVG with Styling

```html
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .circle { fill: blue; }
      .circle:hover { fill: red; }
    </style>
  </defs>
  <circle class="circle" cx="100" cy="100" r="50" />
</svg>
```

## Recommended Resources

### Learning & Reference

- [Wikipedia: Scalable Vector Graphics](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)
- [A List Apart: Using SVG for Flexible, Scalable, and Fun Backgrounds Part I](https://alistapart.com/article/using-svg-for-flexible-scalable-and-fun-backgrounds-part-i/)
- [SVG Showcase Site](http://svg-wow.org/)

### Tools

- [Web-based SVG Editor (SVG-Edit)](https://github.com/SVG-Edit/svgedit)
- [has.js SVG Detection](https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#svg)

## Accessibility Considerations

- Include descriptive `<title>` and `<desc>` elements within SVG
- Use proper ARIA labels for interactive SVG elements
- Ensure sufficient color contrast in SVG graphics
- Provide text alternatives when SVG contains critical information
- Make interactive SVG elements keyboard accessible

## Performance Tips

1. **Optimize SVG Files:** Use tools like SVGO to reduce file size
2. **Use SVG Sprites:** Combine multiple SVGs for fewer HTTP requests
3. **Lazy Load:** Load SVGs only when visible in viewport
4. **Caching:** Set proper cache headers for SVG assets
5. **Compression:** Enable gzip compression for SVG files

## Browser Support Conclusion

SVG has excellent browser support across modern and legacy browsers. With 93.31% full support globally, SVG is a reliable choice for most projects. For older browsers, consider the documented workarounds and polyfills for specific issues.

---

**Last Updated:** 2025

**Data Source:** Can I Use - SVG (basic support) Feature Data
