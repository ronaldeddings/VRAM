# SVG vector-effect: non-scaling-stroke

## Overview

The `vector-effect` SVG attribute and CSS property allows you to control how strokes and other vector effects behave during transformations. The `non-scaling-stroke` value is the most widely supported, making strokes appear as the same width regardless of any transformations (scaling, rotation, skewing) applied to the element.

## Description

The `non-scaling-stroke` value for the `vector-effect` SVG attribute/CSS property makes strokes appear as the same width regardless of any transformations applied. This is particularly useful when you have scaled SVG elements and want the stroke to maintain a consistent visual thickness rather than scaling with the element.

### Use Case Example
When you scale an SVG group containing stroked paths, normally the stroke width scales proportionally. With `vector-effect: non-scaling-stroke`, the stroke maintains its original pixel width even though the shape itself is scaled.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [W3C SVG 2.0 - Vector Effect Property](https://www.w3.org/TR/SVG2/coords.html#VectorEffectProperty)

## Categories

- SVG

## Benefits & Use Cases

### Benefits
1. **Consistent Stroke Appearance**: Maintain uniform stroke width across different zoom levels and transformations
2. **Better Visual Control**: Keep border/outline thickness independent of element scaling
3. **Improved UX**: Particularly valuable for interactive diagrams, maps, and scaled visualizations where line width consistency is important
4. **Simpler Styling**: Reduces need for complex scaling calculations in JavaScript

### Common Use Cases
- **Interactive Maps**: Keep map borders and lines readable at all zoom levels
- **Scaled Diagrams**: Maintain consistent connector line thickness in flowcharts and architecture diagrams
- **Data Visualizations**: Preserve axis thickness and gridline width in scaled charts
- **Icon Systems**: Ensure stroke consistency when icons are scaled up or down
- **Technical Drawings**: Maintain precise line widths in scaled blueprints and schematics

## Browser Support

| Browser | Minimum Version | Latest Version | Support Status |
|---------|-----------------|-----------------|---|
| Chrome | 15 | 146+ | ✅ Full Support |
| Edge | 79 | 143+ | ✅ Full Support |
| Firefox | 15 | 148+ | ✅ Full Support |
| Safari | 5.1 | 18.5-18.6+ | ✅ Full Support |
| Opera | 11.6 | 122+ | ✅ Full Support |
| iOS Safari | 5.0-5.1 | 18.5-18.7+ | ✅ Full Support |
| Android Browser | 4.4+ | 142+ | ✅ Full Support |
| Opera Mini | All versions | All | ✅ Full Support |
| Samsung Internet | 4+ | 29+ | ✅ Full Support |

### Browser Notes

- **Internet Explorer**: No support (versions 5.5-11)
- **Chrome**: Supported since version 15 (with early uncertainty in versions 4-14)
- **Firefox**: Supported since version 15
- **Safari**: Supported since version 5.1
- **Mobile Browsers**: Widely supported across modern iOS, Android, and other mobile platforms
- **Legacy Mobile**: Early versions of iOS Safari (3.2-4.2.3) and Android (2.1-3) show uncertain support

### Global Usage

- **Positive Support**: 93.25% of users have browsers with support
- **Partial/Uncertain Support**: 0%
- **No Support**: 6.75% of users

## Implementation Details

### CSS/SVG Syntax

```svg
<!-- SVG Attribute -->
<path d="M10,10 L100,100" stroke="black" stroke-width="2" vector-effect="non-scaling-stroke"/>

<!-- Or as SVG style attribute -->
<path d="M10,10 L100,100" style="stroke: black; stroke-width: 2; vector-effect: non-scaling-stroke;"/>

<!-- Or as CSS -->
<style>
  path {
    vector-effect: non-scaling-stroke;
  }
</style>
```

### Example Usage

```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="scale(2)">
    <!-- Without vector-effect: stroke scales with the group -->
    <path d="M10,10 L40,40" stroke="red" stroke-width="1"/>

    <!-- With vector-effect: stroke maintains original width -->
    <path d="M50,50 L80,80" stroke="blue" stroke-width="1" vector-effect="non-scaling-stroke"/>
  </g>
</svg>
```

## Important Notes

**Other vector-effect Values at Risk**: Other values for the `vector-effect` attribute/property are currently at risk of being removed from the specification as they are not being developed by browser vendors. Only `non-scaling-stroke` has stable, consistent browser support.

### Recommended Values
- `non-scaling-stroke` - Fully supported, recommended for production use
- `none` - Default value, restores normal behavior

## Related Resources & References

### Official Documentation
- [MDN: vector-effect Attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/vector-effect)
- [W3C SVG 2.0 Specification](https://www.w3.org/TR/SVG2/coords.html#VectorEffectProperty)

### Implementation Tracking
- [Firefox Implementation Bug (Other Values)](https://bugzilla.mozilla.org/show_bug.cgi?id=1318208)
- [Chromium Implementation Bug (Other Values)](https://bugs.chromium.org/p/chromium/issues/detail?id=691398)

## Summary

The `vector-effect: non-scaling-stroke` feature has excellent browser support across all modern browsers, making it safe for production use. It's particularly valuable for SVG-based applications where maintaining consistent stroke width during transformations is important. With 93.25% global usage coverage, you can confidently use this feature in most projects targeting modern browsers.
