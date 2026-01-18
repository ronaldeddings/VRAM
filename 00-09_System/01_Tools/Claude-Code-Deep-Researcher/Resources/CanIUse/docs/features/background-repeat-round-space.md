# CSS `background-repeat` `round` and `space` Values

## Overview

The `background-repeat` property's `round` and `space` values allow CSS background images to be repeated without clipping, providing flexible tiling options for background patterns.

## Description

While the basic `background-repeat` values (`repeat`, `repeat-x`, `repeat-y`, `no-repeat`) have been supported for years, the `round` and `space` values provide more sophisticated control over background image tiling:

- **`round`**: Scales the background image to fit the container an integer number of times
- **`space`**: Repeats the background image without scaling, distributing equal spacing between tiles

This allows designers to create responsive background patterns that adapt to container dimensions without distortion or clipping.

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification**: [CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css3-background/#the-background-repeat)
- **W3C Link**: https://www.w3.org/TR/css3-background/#the-background-repeat

## Categories

- CSS3

## Browser Support Summary

| Browser | First Full Support |
|---------|-------------------|
| Chrome | 32 |
| Firefox | 49 |
| Safari | 7 |
| Edge | 12 |
| Opera | 10.5 |
| Internet Explorer | 10 |

## Detailed Browser Support Table

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 32+ | Supported | Fully supported |
| Firefox | 49+ | Supported | Fully supported |
| Safari | 7+ | Supported | Fully supported |
| Edge | 12+ | Supported | Fully supported |
| Opera | 10.5+ | Supported | Fully supported (with version 15-18 exceptions) |
| Internet Explorer | 10-11 | Supported | IE 9 has partial support with rendering issues |

### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| iOS Safari | 7.0+ | Supported | Fully supported |
| Android Browser | 4.4+ | Supported | Fully supported |
| Chrome Android | 142+ | Supported | Fully supported |
| Firefox Android | 144+ | Supported | Fully supported |
| Opera Mobile | 11+ | Supported | Fully supported |
| Samsung Internet | 4+ | Supported | Fully supported |

### Other Browsers

| Browser | Status |
|---------|--------|
| Opera Mini | Supported (all versions) |
| UC Browser | 15.5+ |
| Blackberry | 10+ |
| KaiOS | 3.0+ |
| Baidu | 13.52+ |
| QQ Browser | 14.9+ |

## Benefits and Use Cases

### Round Value Benefits
- **Responsive Patterns**: Automatically scales background images to fit container dimensions
- **No Clipping**: Images are scaled proportionally to avoid partial tiles
- **Professional Appearance**: Creates seamless, polished background patterns
- **Adaptive Design**: Works well with fluid layouts that change dimensions

### Space Value Benefits
- **Even Distribution**: Distributes background images evenly with equal spacing
- **Predictable Layout**: Maintains original image dimensions while controlling spacing
- **Edge Cases Handling**: Gracefully handles containers that don't divide evenly by image dimensions
- **Consistency**: Useful for decorative elements that need uniform spacing

### Common Use Cases
- **Decorative Backgrounds**: Polka dots, patterns, or textures that need responsive scaling
- **Tileable Patterns**: Seamless patterns that should adapt to container size
- **Icon Patterns**: Repeating icon sequences with controlled spacing
- **Texture Backgrounds**: Photo textures that maintain quality while filling space
- **Responsive Design**: Backgrounds that look good across all device sizes

## Technical Details

### Syntax

```css
background-repeat: round;
background-repeat: space;

/* Can be combined with x/y axis control */
background-repeat: repeat-x space;
background-repeat: space repeat-y;
background-repeat: space round;
```

### Behavior Differences

#### `round` Value
- Scales the background image to an integer number of repetitions
- Maintains aspect ratio of the image
- Fills the entire background area without clipping
- Image size may be slightly larger or smaller than original

#### `space` Value
- Repeats image without scaling (maintains original dimensions)
- Distributes equal spacing between repeated images
- May leave gaps at container edges if dimensions don't align perfectly
- Useful when exact image dimensions must be preserved

## Known Issues and Limitations

### IE9 Rendering Bug
**Status**: Partial Support (marked as "a" with note #1)

Internet Explorer 9 does not render `background-repeat: round` correctly. Consider:
- Providing fallback patterns for IE9
- Using JavaScript-based solutions for IE9 support
- Testing thoroughly in IE9 if supporting legacy browsers

### Opera Version-Specific Issues
Opera versions 15-18 show no support despite support in versions 10.5-12.1 and 19+. This appears to be a regression during the Chromium transition period.

## Related Resources

- [MDN Web Docs - background-repeat](https://developer.mozilla.org/docs/Web/CSS/background-repeat)
- [CSS-Tricks article on background-repeat](https://css-tricks.com/almanac/properties/b/background-repeat/)

## Global Usage Statistics

- **Full Support**: 93.52% of global users
- **Partial Support**: 0.05% of global users
- **No Support**: ~6.43% of global users (primarily outdated browsers)

## Related CSS Properties

- `background` - CSS background shorthand property
- `background-image` - Sets one or more background images
- `background-position` - Sets background image position
- `background-size` - Sets background image size
- `background-attachment` - Sets background attachment behavior

## Migration Guide

### From `repeat` to `round`

**Before:**
```css
.container {
  background-image: url('pattern.png');
  background-repeat: repeat;
}
```

**After (for responsive scaling):**
```css
.container {
  background-image: url('pattern.png');
  background-repeat: round;
  background-size: auto;
}
```

### From `repeat` to `space`

**Before:**
```css
.container {
  background-image: url('icon.png');
  background-repeat: repeat;
}
```

**After (for controlled spacing):**
```css
.container {
  background-image: url('icon.png');
  background-repeat: space;
}
```

## Browser-Specific Considerations

### Safari
Fully supported since version 7 (2013), making it one of the earliest adopters of this feature.

### Chrome
Supported since version 32 (2014), with consistent support across all modern versions and Android variants.

### Firefox
Support started with version 49 (2016), relatively later than Chrome but now fully supported.

### Edge
Full support since the initial release (version 12), demonstrating strong CSS3 support from the start.

### Internet Explorer
Limited support with IE9 having rendering issues with `round` value. IE10+ have full support, though IE is deprecated.

## Fallback Strategies

For older browsers that don't support these values:

```css
.container {
  /* Fallback for browsers without round/space support */
  background-repeat: repeat;

  /* Modern browsers */
  background-repeat: round;
}
```

Or use CSS feature queries:

```css
@supports (background-repeat: round) {
  .container {
    background-repeat: round;
  }
}
```

## Notes

- This feature is widely supported in modern browsers (93.52% global usage)
- Primary consideration is legacy IE9 support if required
- No browser prefix needed for any supported browser
- Feature is stable and not subject to vendor extensions
