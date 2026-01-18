# XHTML served as application/xhtml+xml

## Overview

**XHTML** (eXtensible HyperText Markup Language) is a stricter, XML-based formulation of HTML that allows embedding of other XML languages. When served with the proper MIME type `application/xhtml+xml`, it enforces strict XML compliance and enables more powerful document processing capabilities.

## Description

A strict form of HTML that allows embedding of other XML languages. XHTML brings the power and flexibility of XML to web documents while maintaining compatibility with HTML semantics.

## Specification Status

- **Status**: Living Standard (ls)
- **Specification**: [XHTML Syntax - WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/xhtml.html#the-xhtml-syntax)

## Categories

- Other

## Benefits and Use Cases

### Key Benefits

1. **Strict Validation**: XHTML enforces well-formed XML rules, ensuring cleaner, more predictable markup
2. **XML Integration**: Ability to embed other XML-based languages (SVG, MathML, etc.) directly in documents
3. **Better Parsing**: XML parsers can process XHTML documents more reliably
4. **Interoperability**: Enables seamless integration with XML-based tools and technologies
5. **Semantic Clarity**: Stricter rules promote more semantic and accessible markup

### Common Use Cases

- Technical and scientific documentation requiring embedded MathML
- SVG-heavy applications with mixed XML content
- Legacy systems designed for XML processing
- Projects requiring strict XHTML validation
- Documents requiring true polyglot capabilities

## Browser Support

XHTML served as `application/xhtml+xml` has exceptional browser support across modern browsers, with some limitations in older Internet Explorer versions.

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|--------------|---|
| **Internet Explorer** | IE 9+ | Supported (IE 5.5-8: Not supported) |
| **Edge** | 12+ | Fully Supported (all versions) |
| **Firefox** | 2.0+ | Fully Supported (all versions) |
| **Chrome** | 4.0+ | Fully Supported (all versions) |
| **Safari** | 3.1+ | Fully Supported (all versions) |
| **Opera** | 9.0+ | Fully Supported (all versions) |

### Mobile Browsers

| Browser | Support Status |
|---------|---|
| **iOS Safari** | All versions (3.2+) |
| **Android Browser** | All versions (2.1+) |
| **Chrome Mobile** | All versions (4.0+) |
| **Firefox Mobile** | All versions (1.0+) |
| **Samsung Internet** | All versions (4.0+) |
| **Opera Mobile** | All versions (10+) |
| **UC Browser** | Supported (15.5+) |
| **QQ Browser** | Supported (14.9+) |
| **Baidu Browser** | Supported (13.52+) |
| **KaiOS Browser** | Supported (2.5+) |
| **Opera Mini** | All versions |
| **Blackberry Browser** | All versions (7+) |
| **IE Mobile** | Supported (10+) |

### Support Summary

- **Current Usage**: 93.69% of tracked browsers
- **Partial Support**: 0%
- **No Support**: Limited to older IE versions (5.5-8)

## Detailed Browser Support Table

### IE and Edge

| Version | IE 5.5-8 | IE 9-11 | Edge 12+ |
|---------|----------|---------|----------|
| Support | ✗ | ✓ | ✓ |

### Mozilla Firefox

Firefox has supported XHTML since version 2.0, with consistent support across all subsequent versions.

| Version Range | Support |
|---|---|
| 2.0 - 148.0 | ✓ Full Support |

### Google Chrome

Chrome has supported XHTML since version 4.0, with full coverage across all modern versions.

| Version Range | Support |
|---|---|
| 4.0 - 146.0 | ✓ Full Support |

### Apple Safari

Safari has supported XHTML since version 3.1, with consistent support across all versions.

| Version Range | Support |
|---|---|
| 3.1 - 18.5-18.6 | ✓ Full Support |
| Tech Preview | ✓ Full Support |

### Opera

Opera has supported XHTML since version 9.0, with full coverage across all modern versions.

| Version Range | Support |
|---|---|
| 9.0 - 122.0 | ✓ Full Support |

## Important Notes

### MIME Type Considerations

**Critical Implementation Note**: The XHTML syntax is very close to HTML, and is almost always (often incorrectly) served as `text/html` on the web rather than with the proper `application/xhtml+xml` MIME type.

### Key Points

1. **Proper MIME Type Required**: To take advantage of XHTML features, documents must be served with `application/xhtml+xml` MIME type, not `text/html`

2. **Common Misconception**: Many documents using XHTML syntax are incorrectly served as HTML, which means they don't receive the benefits of XHTML's strict XML processing

3. **Legacy Approach**: The XHTML 1.0 "polyglot" approach attempted to create documents that worked as both HTML and XHTML, but this practice is becoming less common

4. **Browser Fallback**: Browsers receiving `text/html` will treat the content as HTML, not as strict XML, regardless of the DOCTYPE declaration

5. **Modern Perspective**: The living HTML standard now includes native support for inline SVG and MathML, reducing the need for XHTML in many cases

## Related Resources

- **Wikipedia**: [XHTML](https://en.wikipedia.org/wiki/XHTML)
- **Information on XHTML5**: [XHTML5 Polyglot Documents](http://www.xmlplease.com/xhtml/xhtml5polyglot/)
- **WHATWG HTML Spec**: [XHTML Syntax](https://html.spec.whatwg.org/multipage/xhtml.html#the-xhtml-syntax)

## See Also

- SVG (Scalable Vector Graphics)
- MathML (Mathematical Markup Language)
- XML (eXtensible Markup Language)
- HTML5 Living Standard
- MIME Types and Content Type Headers

---

**Last Updated**: December 2025
**Source**: [Can I Use XHTML](https://caniuse.com/xhtml)
