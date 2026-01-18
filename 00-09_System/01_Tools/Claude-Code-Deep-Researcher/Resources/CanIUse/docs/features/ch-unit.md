# CSS `ch` (Character) Unit

## Overview

The `ch` unit is a CSS length unit that represents the width of the character "0" (zero) in the current font. This is particularly useful when working with monospace fonts where character widths are consistent and predictable.

## Description

The `ch` unit provides a typographic measurement based on the advance width (horizontal space) of the digit "0" in the element's font. This makes it ideal for sizing containers to fit a specific number of characters, ensuring consistent text wrapping behavior regardless of the overall font size changes.

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification URL**: [CSS Values and Units Module Level 3 - ch unit](https://www.w3.org/TR/css3-values/#ch)

## Categories

![CSS3](https://img.shields.io/badge/CSS3-blue)

## Use Cases and Benefits

### Optimal Use Cases

1. **Monospace Text Containers**
   - Setting fixed-width containers for code editors and terminals
   - Sizing code blocks to display a specific number of characters per line (e.g., 80-character limit)

2. **Form Input Fields**
   - Creating input fields that accommodate a predictable number of characters
   - Sizing text inputs based on expected content width (phone numbers, ZIP codes, etc.)

3. **Typography Control**
   - Creating consistent line lengths for better readability
   - Setting margins and padding relative to character width

4. **Responsive Design**
   - Building layouts that scale based on character measurement
   - Creating flexible containers that adapt to content width needs

### Key Benefits

- **Semantic Sizing**: Length measurement tied to actual character dimensions
- **Consistency**: Predictable widths in monospace fonts
- **Readability**: Helps implement optimal line lengths (often 60-80 characters)
- **Accessibility**: Improves text readability by controlling content width
- **Simplicity**: No need for complex calculations or JavaScript

### Example Usage

```css
/* Create a code block that displays 80 characters per line */
.code-block {
  width: 80ch;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
}

/* Size an input for a 10-digit phone number */
.phone-input {
  width: 10ch;
  font-family: monospace;
}

/* Set a comfortable reading line length */
.article {
  max-width: 60ch;
  margin: 0 auto;
}

/* Responsive padding based on character width */
.container {
  padding: 2ch;
}
```

## Browser Support

### Summary by Browser

| Browser | First Version with Full Support | Status |
|---------|--------------------------------|--------|
| **Chrome** | 27 | ✅ Full support |
| **Firefox** | 2 | ✅ Full support |
| **Safari** | 7 | ✅ Full support |
| **Edge** | 12 | ✅ Full support |
| **Opera** | 15 | ✅ Full support |
| **Internet Explorer** | 9+ | ⚠️ Partial support (see notes) |

### Desktop Browsers

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 27+ | ✅ Full |
| Firefox | 2+ | ✅ Full |
| Safari | 7+ | ✅ Full |
| Edge | 12+ | ✅ Full |
| Opera | 15+ | ✅ Full |
| Internet Explorer | 9, 10, 11 | ⚠️ Partial |
| Internet Explorer | 5.5-8 | ❌ None |

### Mobile Browsers

| Browser | First Version | Support |
|---------|---------------|---------|
| **iOS Safari** | 7.0-7.1 | ✅ Full |
| **Android Chrome** | 4.4 | ✅ Full |
| **Firefox Mobile** | 144+ | ✅ Full |
| **Opera Mobile** | 80+ | ✅ Full |
| **Samsung Internet** | 4+ | ✅ Full |
| **UC Browser** | 15.5+ | ✅ Full |
| **Opera Mini** | All | ❌ None |

### Global Support

- **Current Usage**: 93.26% of global browser usage
- **Partial Support**: 0.38% (mainly IE)
- **No Support**: 6.36%

## Known Issues and Limitations

### Internet Explorer Behavior

Internet Explorer (versions 9-11) provides partial support with a **critical caveat**:

> IE supports the `ch` unit, but unlike other browsers its width is that specifically of the "0" glyph, not its surrounding space. As a result, `3ch` for example is shorter than the width of the string "000" in IE.

**Workaround**: If IE support is required, test thoroughly with monospace fonts and consider using fallback values with `ch` units as enhancements rather than primary sizing.

### Opera Mini

Opera Mini does not support the `ch` unit at all. Consider providing fallback sizing for this browser.

### Inconsistencies with Variable Fonts

The `ch` unit measurement may vary when using variable fonts or fonts with different weight variations, as the character "0" width may change.

## Related Links

### Educational Resources

- [Blog Post: Making Sense of `ch` Units](https://johndjameson.com/posts/making-sense-of-ch-units)
- [Eric Meyer: What is the CSS `ch` Unit?](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/)

### W3C Standards

- [CSS Values and Units Module Level 3](https://www.w3.org/TR/css3-values/)

### Additional Resources

- [MDN Web Docs: CSS Units - ch](https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch)
- [Can I use: ch unit](https://caniuse.com/ch-unit)

## Browser Compatibility Table

For detailed browser version information, visit [Can I Use - ch unit](https://caniuse.com/ch-unit)

### Version Coverage

- **Chrome**: Versions 27 through 146+
- **Firefox**: Versions 2 through 148+
- **Safari**: Versions 7 through 18.5-18.6
- **Edge**: Versions 12 through 143+
- **Opera**: Versions 15 through 122+
- **Mobile Safari (iOS)**: Versions 7.0-7.1 through 26.1
- **Android Browser**: Versions 4.4 through 142+
- **Samsung Internet**: Versions 4 through 29

## Implementation Guidelines

### Best Practices

1. **Test with Your Target Fonts**
   - Always test `ch` measurements with the actual fonts you're using
   - Character widths vary between different typefaces

2. **Use Fallbacks for Older Browsers**
   ```css
   .container {
     width: 80ch;
     width: 640px; /* Fallback for browsers without ch support */
   }
   ```

3. **Consider Content Flow**
   - Remember that `ch` is based on the "0" glyph
   - Proportional fonts may have unpredictable results
   - Stick to monospace fonts for most reliable sizing

4. **Accessibility Considerations**
   - Use `ch` units to create optimal reading line lengths (50-75 characters)
   - Improve readability by preventing excessively long lines
   - Enhance user experience on different screen sizes

### Common Patterns

```css
/* Code block with line-length constraint */
pre, code {
  font-family: 'Monaco', 'Menlo', monospace;
  width: 80ch;
  overflow-x: auto;
}

/* Readable article width */
article {
  font-family: Georgia, serif;
  max-width: 60ch;
  margin: 0 auto;
  padding: 2ch;
}

/* Input sizing for specific formats */
input[type="tel"] {
  font-family: monospace;
  width: 12ch; /* +1 for formatting */
}

input[type="date"] {
  font-family: monospace;
  width: 10ch;
}
```

## Summary

The `ch` unit enjoys excellent browser support across modern browsers, with 93.26% global coverage. It's a valuable tool for creating responsive, readable layouts—especially for code and technical content. While Internet Explorer has partial support with caveats, and Opera Mini lacks support entirely, the feature is practical for use in modern web applications with appropriate fallbacks for legacy browsers.
