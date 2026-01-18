# MathML (Mathematical Markup Language)

## Overview

**MathML** is a special-purpose XML markup language designed for displaying mathematical formulas and notations on web pages. It provides semantic meaning for mathematical expressions, enabling proper rendering and accessibility for mathematical content across different browsers and devices.

## Description

MathML allows web developers to write mathematical formulas and notations using structured HTML-like tags. Instead of using images or plain text to represent equations, MathML provides native support for proper mathematical rendering, making content more accessible, scalable, and machine-readable.

## Specification Status

- **Status**: W3C Recommendation (REC)
- **Latest Specification**: https://www.w3.org/TR/MathML/
- **Core Implementation**: https://www.w3.org/TR/mathml-core/

## Categories

- Other

## Benefits & Use Cases

### Primary Benefits
- **Accessibility**: Mathematical content is readable by screen readers and assistive technologies
- **Semantic Meaning**: Preserves the mathematical structure and meaning of equations
- **Scalability**: Content scales perfectly at any resolution without pixelation
- **Accessibility Compliance**: Supports WCAG guidelines for mathematical content
- **Search Engine Optimization**: Mathematical expressions are indexable and searchable

### Common Use Cases
- **Educational Content**: Online courses, textbooks, and learning materials
- **Scientific Papers**: Publishing mathematical research and formulas
- **Mathematical Software**: Calculators, equation editors, and computational tools
- **Academic Websites**: Universities and educational institutions
- **Technical Documentation**: Engineering and scientific documentation
- **Chemistry & Physics**: Molecular formulas and complex equations

## Browser Support

### Support Legend
- **y** - Full support
- **a** - Partial support
- **p** - Partial support (limited functionality)
- **d** - Disabled by default (requires flag to enable)
- **#X** - Notes reference (see notes section below)

### Desktop Browsers

| Browser | Version Range | Status | Notes |
|---------|---------------|--------|-------|
| **Firefox** | 2.0+ | Full Support | Complete support since Firefox 2.0 |
| **Firefox** | 2.0-3.6 | Full Support (#1) | Early versions only support XHTML notation |
| **Firefox** | 4.0+ | Full Support | Stable support in all modern versions |
| **Safari** | 3.1-9.1 | Partial Support (#2) | Issues with some MathML features before v10 |
| **Safari** | 10.0+ | Full Support | Complete support from version 10 onwards |
| **Chrome** | 24.0 | Full Support | Initially supported but with instability |
| **Chrome** | 25.0-96.0 | Partial Support | Limited functionality |
| **Chrome** | 97.0-108.0 | Partial Support (#3) | Can be enabled via experimental flag |
| **Chrome** | 109.0+ | Full Support (#4) | Chromium 109+ supports MathML Core |
| **Edge** | 12-78 | No Support | Not supported in older versions |
| **Edge** | 79-96 | Partial Support | Limited MathML support |
| **Edge** | 97-108 | Partial Support (#3) | Experimental flag support |
| **Edge** | 109.0+ | Full Support (#4) | Complete MathML Core support |
| **Opera** | 9.0-12.1 | Partial Support (#5) | Limited to CSS profile of MathML |
| **Opera** | 15.0-82.0 | Partial Support | Partial implementation |
| **Opera** | 83.0-94.0 | Partial Support (#3) | Experimental flag support |
| **Opera** | 95.0+ | Full Support (#4) | MathML Core support |
| **Internet Explorer** | 6-8 | Partial Support | Very limited support |
| **Internet Explorer** | 9-11 | No Support | Not supported |

### Mobile Browsers

| Platform | Version Range | Status | Notes |
|----------|---------------|--------|-------|
| **iOS Safari** | 3.2-4.3 | Partial Support | Basic support only |
| **iOS Safari** | 5.0+ | Full Support | Complete support in iOS 5.0+ |
| **Android Browser** | 2.1-4.4 | Partial Support | Limited functionality |
| **Android Browser** | 4.4.3+ | Partial Support | Partial implementation |
| **Android Chrome** | 142+ | Full Support (#4) | MathML Core support |
| **Android Firefox** | 144+ | Full Support | Complete support |
| **Opera Mobile** | 10-12.1 | Partial Support | Limited support |
| **Opera Mobile** | 80.0+ | Full Support (#4) | MathML Core support |
| **Samsung Internet** | 4.0-20.0 | Partial Support | Partial implementation |
| **Samsung Internet** | 21.0+ | Full Support | Complete support |
| **UC Browser** | 15.5 | Partial Support | Basic support |
| **BlackBerry** | 7.0 | Partial Support | Limited support |
| **BlackBerry** | 10.0 | Full Support | Complete support |
| **Opera Mini** | All versions | Partial Support | Limited functionality |
| **KaiOS** | 2.5-3.1 | Full Support | Complete support |

## Global Browser Support

- **Users with full support**: 91.39%
- **Users with partial support**: 8.61%
- **Users with no support**: 0% (effectively supported across all modern browsers)

## Important Notes

### General Notes
1. **Chrome 24 History**: Support was added in Chrome 24, but temporarily removed afterwards due to instability. It has since been restored with full support in Chrome 109+.

2. **Firefox XHTML Support**: Before version 4, Firefox only supports the XHTML notation of MathML. Modern versions support both XHTML and HTML5 notations.

3. **Safari Rendering Issues**: Before version 10, Safari had issues rendering significant portions of complex MathML content (see MathML torture test link below).

4. **Experimental Flag Support**: Chromium-based browsers (Chrome, Edge, Opera) versions 97-108 support MathML but require enabling the `#enable-experimental-web-platform-features` flag in `chrome://flags`.

5. **MathML Core Standard**: Browsers based on Chromium 109+ specifically support the [MathML Core](https://www.w3.org/TR/mathml-core/) specification. While there is significant support overlap with other MathML implementations, there are some differences. [See technical details](https://groups.google.com/a/chromium.org/g/blink-dev/c/n4zf_3FWmAA/m/oait3tsMAQAJ).

6. **Opera Limited Support**: Opera's support (versions 9.5-12.1) is limited to a CSS profile of MathML and doesn't include full MathML support.

## Recommended Fallback Solutions

For broader compatibility, especially with older browsers, consider these approaches:

### MathJax
MathJax is a popular JavaScript solution that provides cross-browser support for mathematical notation:
- **Website**: https://www.mathjax.org
- **Supports**: LaTeX, MathML, AsciiMath input formats
- **Compatibility**: Works on all browsers including older versions
- **Rendering**: Produces high-quality mathematical typesetting

### Best Practices
1. Use native MathML for modern browsers
2. Provide MathJax as a fallback for older browsers
3. Test mathematical content across target browsers
4. Use the MathML torture test to verify proper rendering

## Relevant Resources

### Official Resources
- **W3C MathML Specification**: https://www.w3.org/TR/MathML/
- **W3C MathML Core**: https://www.w3.org/TR/mathml-core/
- **MDN Web Docs - MathML**: https://developer.mozilla.org/en-US/docs/Web/MathML

### Learning & Tools
- **Wikipedia - MathML**: https://en.wikipedia.org/wiki/MathML
- **MathJax (Cross-browser Support)**: https://www.mathjax.org
- **MathML Torture Test**: https://fred-wang.github.io/MathFonts/mozilla_mathml_test/

### Implementation Status
- **Chromium Project Roadmap**: https://mathml.igalia.com/project/

## Implementation Status Summary

### Current State
- **Full Support**: Firefox (all versions), Safari 10+, Chrome 109+, Edge 109+, iOS Safari 5.0+, Android Firefox, Samsung Internet 21+
- **Partial Support**: Chrome 25-108, Edge 79-108, Opera 15-94, older Safari versions, Android 4.4+, most legacy mobile browsers
- **No Support**: Internet Explorer (9-11)

### Timeline
- **Early Adoption**: Firefox 2.0 (2006)
- **Expansion Phase**: Safari 10 (2016), iOS Safari 5.0 (2011)
- **Modern Era**: Chrome 109+, Edge 109+ (2023) - Full MathML Core support
- **Mobile Growth**: Widespread adoption in Android and iOS browsers

## Conclusion

MathML has evolved from a niche technology with limited browser support to a well-supported standard for mathematical content on the web. With 91.39% of users having full support and the remainder having partial support, MathML is now viable for production use, especially when combined with fallback solutions like MathJax for legacy browser support.

For new projects, MathML should be the primary choice for mathematical content, with appropriate progressive enhancement strategies for maximum compatibility.
