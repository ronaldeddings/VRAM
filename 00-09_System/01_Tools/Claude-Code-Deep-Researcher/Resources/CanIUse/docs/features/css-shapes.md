# CSS Shapes Level 1

## Overview

CSS Shapes Level 1 is a W3C specification that allows developers to define geometric shapes in CSS to control how text flows around floated elements. This feature enables more sophisticated and creative layout designs by allowing text to wrap around non-rectangular shapes rather than just the default box model.

## Description

CSS Shapes allow geometric shapes to be set in CSS to define an area for text to flow around. The specification includes three main properties:

- **`shape-outside`** - Defines the shape that content should wrap around
- **`shape-margin`** - Adds space between the shape and the wrapped content
- **`shape-image-threshold`** - Determines the alpha channel threshold for image-based shapes

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Official Spec**: [W3C CSS Shapes Module Level 1](https://www.w3.org/TR/css-shapes/)
- **Last Updated**: Active development

## Categories

- CSS3

## Benefits and Use Cases

### Creative Layouts
- Design text that flows around circular, polygonal, or irregular shapes
- Create magazine-style layouts with sophisticated typography

### Content Flow Control
- Wrap text around images with custom shapes extracted from image alpha channels
- Define precise exclusion areas for content placement

### Visual Design Enhancement
- Enable more natural and organic layouts for editorial content
- Support for design systems that require non-rectangular content regions

### Practical Applications
- Magazine and newspaper layouts
- Image gallery descriptions that follow image contours
- Custom callout boxes and design elements
- Responsive design patterns with shape-based content flow

## Browser Support

| Browser | Support Status | First Version | Notes |
|---------|---|---|---|
| **Chrome** | ✅ Full | v37 | Prefixed support in v34-36 (experimental flag) |
| **Edge** | ✅ Full | v79 | |
| **Firefox** | ✅ Full | v62 | Partial support with `layout.css.shape-outside.enabled` flag in v51-61 |
| **Safari** | ✅ Full | v10.1 | Prefixed support (`-webkit-`) in v7.1-10.0 |
| **Opera** | ✅ Full | v24 | |
| **iOS Safari** | ✅ Full | v10.3 | Prefixed support in v8-10.2 |
| **Android Browser** | ✅ Full | v4.4+ (limited), v142+ (full) | |
| **Samsung Internet** | ✅ Full | v4+ | |
| **Opera Mobile** | ✅ Full | v80+ | |
| **UC Browser** | ✅ Full | v15.5+ | |
| **Chrome Android** | ✅ Full | v142+ | |
| **Firefox Android** | ✅ Full | v144+ | |
| **Opera Mini** | ❌ Not Supported | — | No support |
| **Internet Explorer** | ❌ Not Supported | — | No support in any version |
| **Internet Explorer Mobile** | ❌ Not Supported | — | No support in any version |
| **BlackBerry** | ❌ Not Supported | — | No support |
| **KaiOS** | ✅ Full | v3.0+ | No support in v2.5 |

### Browser Support Summary

**Global Usage**: 93.13% of users have browser support

**Supported Browsers**:
- Modern Chrome/Chromium-based browsers (v37+)
- Firefox (v62+)
- Safari (v10.1+, prefixed in earlier versions)
- Opera (v24+)
- Edge (v79+)

**Not Supported**:
- Internet Explorer (all versions)
- Opera Mini

## Implementation Notes

### Vendor Prefixing

In earlier browser versions, the `-webkit-` prefix was required:

```css
.shape {
  -webkit-shape-outside: circle(50%);
  shape-outside: circle(50%);
}
```

### Feature Detection Flags

- **Chrome (v34-36)**: Requires "experimental Web Platform features" flag in `chrome://flags`
- **Firefox (v51-61)**: Requires `layout.css.shape-outside.enabled` in `about:config` for partial support

### Shape Functions

CSS Shapes support multiple shape values:

```css
/* Circular shape */
shape-outside: circle(100px);

/* Elliptical shape */
shape-outside: ellipse(100px 50px);

/* Polygonal shape */
shape-outside: polygon(0 0, 100% 0, 100% 100%, 0 100%);

/* Inset rectangle */
shape-outside: inset(10px 20px 30px 40px);

/* Image-based shape */
shape-outside: url('image.png');
```

### Margin and Threshold

```css
/* Add space around the shape */
shape-margin: 10px;

/* Set alpha channel threshold for image shapes */
shape-image-threshold: 0.5;
```

## Relevant Links

- [CSS Shapes 101 - A List Apart](https://alistapart.com/article/css-shapes-101/)
- [Firefox Implementation Tracking Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1040714)
- [Official W3C Specification](https://www.w3.org/TR/css-shapes/)

## Related Keywords

circle, ellipse, polygon, inset, shape-outside, shape-margin, shape-image-threshold

## References

- **Chrome ID**: 5163890719588352
- **Usage Percentage (Yes)**: 93.13%
- **Usage Percentage (Partial)**: 0%
- **Requires Vendor Prefix**: No (in modern browsers)
