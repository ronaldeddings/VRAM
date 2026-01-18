# EOT - Embedded OpenType Fonts

## Overview

**Embedded OpenType (EOT)** is a font format developed by Microsoft that allows web developers to embed high-quality fonts on websites. The format was designed to provide a mechanism for embedding fonts while protecting the intellectual property rights of font creators through file encryption and domain-binding.

## Description

Type of font that can be derived from a regular font, allowing small files and legal use of high-quality fonts. Usage is restricted by the file being tied to the website. EOT fonts are specifically bound to the domain from which they are served, providing a measure of font piracy protection through embedded metadata that links the font to a specific domain.

## Specification Status

- **Status**: Unofficial (W3C Submission)
- **Specification URL**: https://www.w3.org/Submission/EOT/
- **Note**: Proposal by Microsoft, being considered for W3C standardization

## Categories

- **Other** - Web fonts and typography features

## Key Benefits & Use Cases

### Benefits
- **Domain Binding**: Fonts are cryptographically tied to specific domains, preventing unauthorized redistribution
- **File Size Reduction**: EOT fonts typically compress standard TrueType and OpenType fonts for smaller file sizes
- **Legal Protection**: Designed to protect font licensing by preventing easy theft of proprietary typefaces
- **Legacy Support**: Wide support in older Internet Explorer versions for enterprises requiring IE support

### Use Cases
- Embedding premium, licensed fonts on corporate websites (particularly in enterprise environments)
- Protecting proprietary or high-value typefaces from redistribution
- Projects with strict font licensing requirements where domain-binding is beneficial
- Legacy applications targeting Internet Explorer 6-11 users

## Browser Support

The following table shows browser support across major desktop and mobile browsers:

### Desktop Browsers

| Browser | Support | Versions |
|---------|---------|----------|
| **Internet Explorer** | ✅ Full Support | 6, 7, 8, 9, 10, 11 |
| **Edge** | ❌ No Support | All versions (12+) |
| **Firefox** | ❌ No Support | All versions |
| **Chrome** | ❌ No Support | All versions |
| **Safari** | ❌ No Support | All versions |
| **Opera** | ❌ No Support | All versions |

### Mobile Browsers

| Browser | Support | Versions |
|---------|---------|----------|
| **iOS Safari** | ❌ No Support | All versions |
| **Android Browser** | ❌ No Support | All versions |
| **Chrome Mobile** | ❌ No Support | All versions |
| **Firefox Mobile** | ❌ No Support | All versions |
| **Opera Mini** | ❌ No Support | All versions |
| **Opera Mobile** | ❌ No Support | All versions |
| **Samsung Internet** | ❌ No Support | All versions |

### Usage Statistics

- **Full Support (Y)**: 0.42% of global usage
- **Partial Support (A)**: 0% of global usage
- **Parent Feature**: `@font-face` (for broader font embedding support)

## Important Notes

- **Limited Modern Support**: EOT support is essentially limited to Internet Explorer 6-11. All modern browsers have discontinued support
- **Modern Alternative**: The standard `@font-face` CSS rule with WOFF/WOFF2 formats is the recommended approach for all modern web projects
- **Legacy Only**: Only consider EOT if you have specific requirements to support legacy Internet Explorer users
- **Format Obsolescence**: This format should not be used in new projects as it provides no advantages over standard web font formats (WOFF/WOFF2)

## Technical Details

### Binding Mechanism
EOT fonts include metadata that binds the font file to specific domain(s). The browser verifies this binding before rendering the font, preventing the font from being reused on different domains without authorization.

### File Format
EOT is based on TrueType and OpenType font formats, with additional wrapper structures and encryption to implement the domain-binding protection mechanism.

## Migration & Recommendations

### For New Projects
Use standard `@font-face` with WOFF2 format (fallback to WOFF):

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
}
```

### For Legacy Projects
If you currently use EOT:
1. Evaluate your user base's browser requirements
2. Consider migrating to WOFF/WOFF2 formats
3. Only maintain EOT support if you have >5% IE6-10 traffic
4. Gradually phase out EOT as your IE user base declines

## Related Resources

### Official Documentation
- [W3C EOT Submission](https://www.w3.org/Submission/EOT/)
- [Microsoft Typography - Web Embedding](https://www.microsoft.com/typography/web/embedding/default.aspx)

### External References
- [Wikipedia - Embedded OpenType](https://en.wikipedia.org/wiki/Embedded_OpenType)

### Related Features
- `@font-face` - Standard CSS rule for embedding web fonts
- WOFF (Web Open Font Format) - Modern, W3C standardized web font format
- WOFF2 - Improved compression over WOFF, recommended for modern browsers
- TrueType/OpenType - Base font formats that EOT is derived from

## Summary

Embedded OpenType (EOT) is a legacy font format developed by Microsoft with strong support in Internet Explorer but no support in modern browsers. While it provided domain-based protection for font licensing, modern web projects should use standard `@font-face` with WOFF/WOFF2 formats instead. EOT should only be considered for maintaining support in enterprise environments with legacy IE requirements.
