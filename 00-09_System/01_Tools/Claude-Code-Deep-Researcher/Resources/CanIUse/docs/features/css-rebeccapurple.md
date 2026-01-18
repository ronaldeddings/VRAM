# Rebeccapurple Color

## Overview

The `rebeccapurple` color is a named color value in CSS that represents the hexadecimal color `#663399`. It was added to the CSS Color Module Level 4 specification as a tribute to Rebecca Meyer, the daughter of Cascading Style Sheets creator, Eric Meyer, who passed away in 2014.

## Description

`rebeccapurple` is a medium purple color that can be used anywhere CSS color values are accepted. It provides an alternative to using the hexadecimal notation `#663399`, making stylesheets more semantic and memorable.

### Color Value
- **Hex**: #663399
- **RGB**: rgb(102, 51, 153)
- **Named Color**: rebeccapurple

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/#valdef-color-rebeccapurple)
- **Last Updated**: Continuously maintained as part of CSS Color Level 4

## Categories

- CSS
- Color Properties
- CSS Values

## Usage & Benefits

### Use Cases

1. **Color Naming**: Use semantic names instead of hexadecimal codes for better readability
2. **Tribute**: A meaningful color with historical significance in the web development community
3. **Consistency**: Provides consistency with other named colors in CSS
4. **Memorability**: Easier to remember than arbitrary hexadecimal values

### Benefits

- **Improved Readability**: Color names are more descriptive than hex codes
- **Ease of Use**: No need to reference color charts or hex value lists
- **Community Significance**: Recognized meaningful color in web development
- **Backward Compatible**: Works alongside existing color values

## Browser Support

Support for `rebeccapurple` is excellent across modern browsers, with widespread support since approximately 2013-2014.

### Support Legend
- **y** = Supported
- **n** = Not Supported
- **a** = Supported with Limitations/Partial Support
- **u** = Unknown/Partial Support

### Browser Compatibility Table

| Browser | First Support | Current Status | Notes |
|---------|---------------|---|-------|
| **Chrome** | 38 | Supported | Full support from Chrome 38+ |
| **Firefox** | 33 | Supported | Full support from Firefox 33+ |
| **Safari** | 7 | Supported | Full support from Safari 7+ |
| **Edge** | 12 | Supported | Full support from Edge 12+ |
| **Opera** | 25 | Supported | Full support from Opera 25+ |
| **Internet Explorer** | 11 | Partial | Only works in IE11 for Windows 10, not older versions of Windows |
| **iOS Safari** | 8 | Supported | Full support from iOS 8+ |
| **Android Browser** | 4.4 | Supported | Full support from Android 4.4+ |
| **Samsung Internet** | 4 | Supported | Full support from Samsung Internet 4+ |
| **Opera Mini** | All | Not Supported | No support in Opera Mini |
| **Opera Mobile** | 80+ | Supported | Full support from Opera Mobile 80+ |
| **UC Browser** | 15.5+ | Supported | Full support from UC Browser 15.5+ |
| **QQ Browser** | 14.9+ | Supported | Full support from QQ Browser 14.9+ |
| **Baidu Browser** | 13.52+ | Supported | Full support from Baidu Browser 13.52+ |
| **KaiOS** | 2.5+ | Supported | Full support from KaiOS 2.5+ |

### Coverage Statistics

- **Global Support**: 93.2% of global browser usage supports this feature
- **Partial Support**: 0.33% of global browser usage (IE 11 with limitations)
- **No Support**: 6.47% of global browser usage

## Syntax & Usage

### CSS Syntax

```css
/* Using rebeccapurple with various CSS properties */

/* Foreground color */
color: rebeccapurple;

/* Background color */
background-color: rebeccapurple;

/* Border color */
border-color: rebeccapurple;

/* Box shadow */
box-shadow: 0 0 10px rebeccapurple;

/* Text shadow */
text-shadow: 2px 2px 4px rebeccapurple;

/* Gradient */
background: linear-gradient(to right, rebeccapurple, transparent);
```

## Implementation Examples

### Basic Color Usage

```css
/* Heading with rebeccapurple */
h1 {
  color: rebeccapurple;
}

/* Section with rebeccapurple border */
section {
  border-left: 4px solid rebeccapurple;
  padding-left: 1rem;
}

/* Button with rebeccapurple background */
button {
  background-color: rebeccapurple;
  color: white;
}

/* Link hover state */
a:hover {
  color: rebeccapurple;
  text-decoration: underline;
}
```

### Advanced Usage

```css
/* Gradient with rebeccapurple */
.gradient-bg {
  background: linear-gradient(
    135deg,
    rebeccapurple 0%,
    #666 100%
  );
}

/* Semi-transparent rebeccapurple */
.overlay {
  background-color: rgba(102, 51, 153, 0.7);
  /* Or using hex with alpha (CSS Color Level 4+) */
  background-color: #66339980;
}

/* Animation with rebeccapurple */
@keyframes highlight {
  from {
    background-color: transparent;
  }
  to {
    background-color: rebeccapurple;
  }
}
```

## Browser-Specific Notes

### Internet Explorer
- **IE11 on Windows 10**: Supported with full functionality
- **IE11 on Windows 7, 8**: Not supported; use hexadecimal fallback

### Fallback Strategy for Older Browsers

For applications requiring support for older browsers that don't recognize `rebeccapurple`, use hexadecimal fallback:

```css
.element {
  /* Fallback for older browsers */
  background-color: #663399;
  /* Modern browsers will use rebeccapurple */
  background-color: rebeccapurple;
}
```

## References & Additional Resources

### Official Specifications
- [CSS Color Module Level 4 - rebeccapurple](https://www.w3.org/TR/css-color-4/#valdef-color-rebeccapurple)

### Community Resources
- [Codepen Blog Post: Honoring a Great Man](https://codepen.io/trezy/post/honoring-a-great-man) - Background story about rebeccapurple

### Related Color Features
- [CSS Named Colors](https://www.w3.org/TR/css-color-4/#named-colors)
- [CSS Color Functions](https://www.w3.org/TR/css-color-4/#color-functions)

## Historical Context

The `rebeccapurple` color was added to the CSS Color Module Level 4 specification as a lasting tribute to Rebecca "Becca" Taylor Meyer, the 6-year-old daughter of CSS creator Eric Meyer. Rebecca passed away on June 7, 2014, after a long battle with leukemia. The color was officially added to the CSS specification at Eric Meyer's request, making it a permanent part of web standards and a touching memorial in the web development community.

## Adoption Timeline

| Year | Milestone |
|------|-----------|
| 2014 | Added to CSS Color Level 4; Chrome 38 and Firefox 33 implement |
| 2015 | Support reaches Safari, Edge, and Opera |
| 2016+ | Near-universal support across modern browsers |

## Browser Vendor Prefixes

No vendor prefixes are required for `rebeccapurple`. It is a standard, unprefixed CSS color value.

- **Webkit prefix required**: No
- **Mozilla prefix required**: No
- **MS prefix required**: No
- **Opera prefix required**: No

## Known Issues

None currently documented.

## Compatibility Notes

- **Mobile Browsers**: Excellent support across iOS Safari, Android Browser, and Samsung Internet
- **Legacy Browsers**: Opera Mini does not support rebeccapurple; provides fallback options
- **Accessibility**: As a named color, `rebeccapurple` offers no special accessibility benefits or drawbacks compared to hexadecimal notation

## Best Practices

1. **Use Named Colors When Possible**: Use `rebeccapurple` instead of `#663399` for improved readability
2. **Include Fallbacks for IE**: If supporting older IE versions is necessary, provide hexadecimal fallback
3. **Maintain Contrast**: Ensure sufficient contrast when using rebeccapurple for text (WCAG AAA recommends minimum 4.5:1 ratio)
4. **Document Usage**: Document color usage in design systems for consistency

## Conclusion

`rebeccapurple` is a fully supported, semantically meaningful color value that offers improved readability and maintains a meaningful tribute within web standards. With 93% global browser support and rising, it is safe to use in modern web development with minimal fallback considerations.
