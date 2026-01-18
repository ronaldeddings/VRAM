# CSS3 Text-shadow

## Overview

The CSS3 `text-shadow` property is a method of applying one or more shadow or blur effects to text. This feature allows developers to create visually appealing text effects including drop shadows, glows, and embossed text.

## Specification Status

- **Current Status**: Candidate Recommendation (CR)
- **Specification URL**: [W3C CSS Text Decoration Module Level 3](https://www.w3.org/TR/css-text-decor-3/#text-shadow-property)

## Categories

- CSS3

## What is Text-shadow?

The `text-shadow` property applies shadow effects to text content. It accepts one or more comma-separated shadow values, each consisting of:
- **Horizontal offset**: Distance from the text (can be negative)
- **Vertical offset**: Distance from the text (can be negative)
- **Blur radius**: How blurred the shadow appears
- **Color**: The color of the shadow effect

### Syntax

```css
text-shadow: [color] [x-offset] [y-offset] [blur-radius], /* ... multiple shadows allowed */
             [color] [x-offset] [y-offset] [blur-radius];
```

### Basic Example

```css
/* Simple drop shadow */
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Multiple shadows for a glowing effect */
.glow {
  text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
}

/* Embossed effect */
.emboss {
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #fff;
}
```

## Benefits and Use Cases

### Visual Design Enhancements
- Create drop shadow effects for better text readability over images
- Add depth and dimension to headings and titles
- Implement glowing text for emphasis and visual interest

### Accessibility and Readability
- Improve text contrast when overlaid on complex or light backgrounds
- Enhance readability of text on photographic backgrounds
- Create subtle shadows for better visual hierarchy

### Creative Effects
- Design embossed or engraved text effects
- Create neon glowing text effects
- Build artistic typography elements
- Enhance UI elements with subtle depth

### Performance
- Lightweight alternative to image-based text effects
- CSS-based implementation requires no additional assets
- Can be animated smoothly with CSS transitions

## Browser Support

### Support Matrix

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| **Chrome** | 4+ | Full Support | ✓ |
| **Firefox** | 3.5+ | Full Support | ✓ |
| **Safari** | 4+ | Full Support | ✓ |
| **Edge** | 12+ | Full Support | ✓ |
| **Opera** | 9.5-9.6+ | Full Support | ✓ |
| **Internet Explorer** | 10+ | Partial Support | ⚠️ |
| **iOS Safari** | 3.2+ | Full Support | ✓ |
| **Android Browser** | 2.1+ | Full Support | ✓ |
| **Opera Mini** | All versions | Partial Support | ⚠️ |
| **Samsung Internet** | 4+ | Full Support | ✓ |

### Global Usage Statistics
- **Full Support**: 93.6% of users
- **Partial Support**: 0.04% of users

### Legacy Browser Considerations

#### Internet Explorer
- **IE 9 and below**: Not supported
- **IE 10+**: Supported with a proprietary extension
  - IE 10+ supports a fourth length value for the shadow's "spread radius," which is not part of the W3C specification

#### Safari 3.1-3.2
- **Partial support**: Does not support multiple shadows
- **Workaround**: Use single shadow effects only

#### Opera Mini
- **Partial support**: Ignores the blur-radius value
- **Effect**: No blur effects are visible; only solid shadows render

## Known Issues and Limitations

### Android 2.3 Bug
- **Issue**: Text-shadow doesn't work when `blur-radius` is 0
- **Affected**: Android Browser 2.3 and possibly earlier versions
- **Workaround**: Use a minimal blur radius (e.g., 0.1px) instead of 0

### Internet Explorer 10 Alpha Channel Issue
- **Issue**: IE10 doesn't render `rgba()` colors correctly
- **Problem**: Ignores the alpha channel and treats it as 100% opaque white
- **Example**: `rgba(255, 255, 255, 0.25)` renders as fully white instead of semi-transparent
- **Workaround**: Use solid colors with fallback values or use filter-based shadows

### Safari 5.1 Color Requirement
- **Issue**: Safari 5.1 requires an explicit color value
- **Problem**: May not work if color is not explicitly specified
- **Workaround**: Always explicitly define the color in your shadows

## Practical Implementation Notes

### Fallback Approaches for Older Browsers

For Internet Explorer versions below 10, you can emulate text-shadow using non-standard filters:

```css
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  /* IE 8 fallback using filter (non-standard) */
  filter: progid:DXImageTransform.Microsoft.Shadow(color='#000000', strength=4);
}
```

### Best Practices

1. **Explicit Color Values**: Always explicitly specify the shadow color to ensure compatibility with Safari 5.1
2. **Avoid Zero Blur**: Use at least 1px blur radius to avoid issues on Android 2.3
3. **Multiple Shadows**: Test multiple shadows thoroughly across browsers
4. **Performance**: Be cautious with heavily blurred or multiple shadows on large text areas
5. **Readability**: Ensure sufficient contrast for accessibility; don't rely solely on shadows for critical information

### Progressive Enhancement

```css
/* Basic shadow for all modern browsers */
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Enhanced effect for browsers that support multiple shadows */
@supports (text-shadow: 0 0 0 black, 0 0 0 black) {
  h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3),
                 4px 4px 8px rgba(0, 0, 0, 0.2);
  }
}
```

## Related Resources

### Official Documentation and Articles
- [Mozilla Hacks: Text-shadow Article](https://hacks.mozilla.org/2009/06/text-shadow/)
- [WebPlatform.org: CSS text-shadow Documentation](https://webplatform.github.io/docs/css/properties/text-shadow)
- [Microsoft Learn: CSS Filters (Legacy IE Support)](https://testdrive-archive.azurewebsites.net/Graphics/hands-on-css3/hands-on_text-shadow.htm)

### Additional Learning Resources
- [MDN Web Docs: text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)
- [CSS Tricks: Text-shadow Tricks](https://css-tricks.com/)
- [W3C CSS Text Decoration Module](https://www.w3.org/TR/css-text-decor-3/)

## Conclusion

The `text-shadow` property is a well-established, widely-supported CSS3 feature that provides an excellent way to enhance text styling and readability. With support in 93.6% of browsers globally, it's safe to use in modern web applications. For projects requiring support for legacy browsers, simple fallback strategies using filters or alternative approaches can be implemented.

---

*Last Updated: 2025*
*Data Source: CanIUse.com*
