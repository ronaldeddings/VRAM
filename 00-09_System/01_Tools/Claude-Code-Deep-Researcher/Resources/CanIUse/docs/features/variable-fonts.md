# Variable Fonts

## Overview

Variable fonts are a revolutionary typography feature that allows a single font file to behave like multiple fonts. Instead of requiring separate files for different weights, widths, slants, and optical sizes, variable fonts consolidate all variations into one optimized file that can be customized on the fly.

## Description

OpenType font settings that allow a single font file to contain all allowed variations in width, weight, slant, optical size, or any other exposed axes of variation as defined by the font designer. Variations can be applied via the `font-variation-settings` CSS property, enabling seamless transitions between font states and reducing the number of font files needed for modern web projects.

## Specification Status

- **Status**: Working Draft (WD)
- **W3C Specification**: [CSS Fonts Module Level 4](https://w3c.github.io/csswg-drafts/css-fonts-4/#font-variation-settings-def)
- **Category**: CSS

## Key Benefits & Use Cases

### Performance Improvements
- Reduce the number of font files needed on a website
- Decrease total bandwidth consumption for typography
- Enable faster font loading and rendering

### Design Flexibility
- Create smooth transitions between font weights and styles
- Implement responsive typography that scales with viewport size
- Respond to user interactions with instant font adjustments
- Access unlimited intermediate variations between predefined weights

### Developer Experience
- Single font file replaces multiple font weights/styles
- Fine-grained control over typography properties
- Support for custom font axes beyond standard options
- Better responsive design possibilities

### Real-World Applications
- Responsive typography systems that adapt to different screen sizes
- Interactive interfaces with dynamic font variations
- Branding and marketing sites with premium typography control
- Data visualization and dashboard applications requiring font flexibility

## Browser Support

### Support Legend
- **Yes (y)**: Full support
- **Partial (a)**: Partial support
- **No (n)**: No support
- **Disabled (d)**: Support but disabled by default
- **Note references**: Additional information available (see notes section)

### Desktop Browsers

| Browser | Earliest Support | Current Status | Notes |
|---------|------------------|----------------|-------|
| **Chrome** | 66+ | Full Support | Chrome 66+ with full support. Earlier versions 62-65 had partial support (#5, #6) |
| **Firefox** | 62+ | Full Support | Firefox 62+ with full support. Disabled in earlier versions; requires macOS 10.13+ or Windows 10 1709+ |
| **Safari** | 11+ | Full Support | Safari 11+ with full support. Requires macOS 10.13+ High Sierra or later |
| **Edge** | 17+ | Full Support | Edge 17+ with full support |
| **Opera** | 53+ | Full Support | Opera 53+ with full support; partial support in versions 49-52 (#5, #6) |
| **Internet Explorer** | - | Not Supported | No variable fonts support in any version |

### Mobile Browsers

| Browser | Earliest Support | Current Status | Notes |
|---------|------------------|----------------|-------|
| **iOS Safari** | 11.0+ | Full Support | iOS Safari 11.0+ with full support; requires macOS 10.13+ |
| **Android Browser** | 142+ | Full Support | Modern Android browser versions support variable fonts |
| **Chrome Mobile** | 142+ | Full Support | Chrome mobile version 142+ |
| **Firefox Mobile** | 144+ | Full Support | Firefox mobile version 144+ with full support (#6) |
| **Opera Mobile** | 80+ | Full Support | Opera mobile version 80+ |
| **Samsung Internet** | 8.2+ | Full Support | Samsung Internet 8.2+ with full support (#6) |
| **Opera Mini** | - | Not Supported | Opera Mini does not support variable fonts |
| **UC Browser** | 15.5+ | Full Support | UC Browser version 15.5+ |
| **QQ Browser** | 14.9+ | Full Support | QQ Browser version 14.9+ |
| **Baidu Browser** | 13.52+ | Full Support | Baidu Browser version 13.52+ |
| **KaiOS** | 3.0+ | Full Support | KaiOS 3.0-3.1+ |

### Global Usage Statistics
- **Full Support (y)**: 92.94% of global browser usage
- **Partial Support (a)**: 0% of global browser usage
- **No Support (n)**: ~7% of global browser usage (primarily legacy browsers)

## Technical Notes

### Implementation Requirements

**Note #1**: Works with Experimental Web Platform features enabled
- Some browsers require enabling experimental features in development settings

**Note #2**: Chrome Format Support
- Chrome supports `format('*-variations')` inside the `@font-face` block starting from version 66
- Earlier versions may not properly recognize variable font format declarations

**Note #3**: Platform Requirements
- Requires macOS 10.13 High Sierra or later
- Windows 10 version 1709 (Fall Creators Update) or later for full support
- Some Firefox versions require these OS updates for functionality

**Note #4**: Property Limitations (Early Implementations)
- Early implementations do not support the `font-weight` and `font-stretch` properties
- These properties are supported in modern versions

**Note #5**: Format Limitations
- Partial implementations do not support:
  - `format('truetype-variations')`
  - `format('woff-variations')`
  - `format('woff2-variations')`

**Note #6**: OpenType-CFF2 Not Supported
- Variable fonts with OpenType-CFF2 font data are not supported in some browsers
- TrueType-based variable fonts are more widely supported

**Note #7**: CFF2 on macOS
- OpenType-CFF2 support requires macOS 10.15 Catalina or later on Safari
- Earlier macOS versions only support TrueType-based variable fonts

## Code Example

```css
/* Define a variable font with @font-face */
@font-face {
  font-family: 'MyVariableFont';
  src: url('myvariablefont.woff2') format('woff2-variations');
  font-weight: 100 900;  /* Define available weight range */
  font-stretch: 75% 125%; /* Define available stretch range (optional) */
}

/* Apply the font and set variations */
body {
  font-family: 'MyVariableFont', sans-serif;
  font-weight: 400;
}

/* Adjust font-variation-settings for fine control */
h1 {
  font-variation-settings: 'wght' 700, 'wdth' 100;
}

/* Responsive typography example */
@media (max-width: 768px) {
  h1 {
    font-variation-settings: 'wght' 600, 'wdth' 85;
  }
}
```

## Known Issues & Limitations

- **Format Support Varies**: Not all font formats are universally supported; WOFF2 variations are most reliable
- **CFF2 Limited**: OpenType-CFF2 fonts have limited support; prefer TrueType-based variable fonts for maximum compatibility
- **OS Dependencies**: Some implementations require specific OS versions for full functionality
- **Feature Detection Required**: Consider using feature detection when implementing variable fonts in production

## Recommendations for Implementation

1. **Use WOFF2 Format**: WOFF2 with variations offers the best browser support and file size
2. **Provide Fallbacks**: Include non-variable font fallbacks for older browsers
3. **Test Across Platforms**: Verify variable fonts work on target browsers and OS versions
4. **Optimize File Size**: Variable fonts reduce file count but ensure individual file sizes are optimized
5. **Feature Detect**: Use CSS feature queries or JavaScript feature detection
6. **Consider Performance**: While reducing files, ensure the variable font file isn't excessively large

## Related Resources

### Official Documentation
- [MDN Web Docs - font-variation-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings)
- [W3C CSS Fonts Module Level 4 Specification](https://w3c.github.io/csswg-drafts/css-fonts-4/#font-variation-settings-def)

### Learning Resources
- [How to use variable fonts in the real world](https://medium.com/clear-left-thinking/how-to-use-variable-fonts-in-the-real-world-e6d73065a604)
- [Getting started with Variable Fonts on the Frontend (2022)](https://evilmartians.com/chronicles/the-joy-of-variable-fonts-getting-started-on-the-frontend)

### Tools & Galleries
- [v-fonts.com - A simple resource for finding and trying variable fonts](https://v-fonts.com)
- [Axis-Praxis - Tool & info on variable fonts](https://www.axis-praxis.org/about)

## Browser Compatibility Matrix Summary

| Group | Support Level | Browsers |
|-------|---------------|----------|
| **Excellent** | 100% Support | Chrome 66+, Firefox 62+, Safari 11+, Edge 17+, Opera 53+ |
| **Good** | 90%+ Support | iOS Safari 11+, Android 142+, Samsung Internet 8.2+ |
| **Limited** | <50% Support | Opera Mini, Internet Explorer, Legacy Android versions |
| **Not Supported** | 0% | Internet Explorer all versions, BlackBerry |

---

**Last Updated**: 2025-12-13
**Data Source**: [Can I Use - Variable fonts](https://caniuse.com/variable-fonts)
