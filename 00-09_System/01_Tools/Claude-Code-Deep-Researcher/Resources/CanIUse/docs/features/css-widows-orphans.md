# CSS Widows & Orphans

## Overview

**CSS widows & orphans** are CSS properties that control how lines break across pages or columns by defining the minimum number of lines that must appear before or after a break point. These properties are essential for print and paginated layouts, ensuring readable and professionally formatted text.

## Description

The `widows` and `orphans` CSS properties control pagination and column breaks:

- **`orphans`**: Specifies the minimum number of lines in a block container that must appear at the bottom of a page or column before a page/column break
- **`widows`**: Specifies the minimum number of lines in a block container that must appear at the top of a page or column after a page/column break

This prevents awkward single-line breaks, ensuring that text remains readable and properly formatted when printing or rendering paginated content.

## Specification

- **Status**: Recommended (REC)
- **Specification URL**: [CSS Break Module Level 3 - Widows & Orphans](https://w3c.github.io/csswg-drafts/css-break-3/#widows-orphans)

## Categories

- CSS

## Benefits & Use Cases

### Print Design
- Ensure professional-looking printed documents with proper line distribution across pages
- Prevent widow and orphan text at page breaks

### Paginated Content
- Control text flow in multi-column layouts
- Maintain readability in ebooks and digital publications

### Document Generation
- Improve output from CSS-to-PDF converters
- Create more polished automated reports and letters

### Web Publishing
- Enhance pagination in multi-column web layouts
- Better control over content flow in responsive designs with column breaks

## Browser Support

### Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Internet Explorer** | 8+ | Partial | #1 |
| | 10+ | Yes | |
| | 11 | Yes | |
| **Edge** | 12+ | Yes | Full support from version 12 onwards |
| **Firefox** | 2-148 | No | No support across all versions |
| **Chrome** | 25+ | Yes | Supported from version 25 onwards |
| **Safari** | 7+ | Yes | Supported from version 7 onwards |
| **Opera** | 9-11.6 | Partial | #1 |
| | 12+ | Yes | |
| **iOS Safari** | 7.0+ | Yes | Supported from iOS 7 onwards |
| **Android Browser** | 4.4+ | Yes | Supported from version 4.4 onwards |
| **Opera Mobile** | 12.1+ | Yes | Supported from version 12.1 onwards |
| **Chrome Android** | 142+ | Yes | |
| **Firefox Android** | 144 | No | |
| **Samsung Internet** | 4+ | Yes | |

### Global Support

- **Overall Usage**: 91.47% of users have browser support
- **Partial Support**: 0%
- **No Support**: ~8.53%

### Notable Support Patterns

- **Full desktop support**: All modern browsers (Chrome 25+, Safari 7+, Edge 12+, Opera 12+)
- **Mobile support**: Strong across iOS Safari, Android 4.4+, and Opera Mobile
- **Firefox gap**: Notably absent in Firefox across all versions (unfixed since open bug)
- **Legacy IE**: Supported from IE 8, though with limitations on multi-column support (#1)

## Support Notes

### Note #1: Multi-Column Limitation
> "Supports widows & orphans properties, but due to not supporting CSS multi-columns the support is only for page breaks (for print)"

This applies to:
- Internet Explorer 8-9
- Opera 9-11.6

These browsers implement widows and orphans but only for print page breaks, not for multi-column layout breaks.

### General Notes
> "Some older WebKit-based browsers recognize the properties, but do not appear to have actual support"

Older versions of WebKit browsers may parse the properties but don't actually apply the breaking behavior.

## Implementation Examples

### Basic Usage

```css
/* Prevent orphaned lines at bottom of page */
p {
  orphans: 3;
}

/* Prevent widowed lines at top of page */
p {
  widows: 3;
}

/* Combined approach for print-optimized text */
article {
  orphans: 2;
  widows: 2;
}
```

### Print Stylesheet Example

```css
@media print {
  body {
    orphans: 3;
    widows: 3;
  }

  h1, h2, h3 {
    orphans: 1;
    widows: 1;
    page-break-after: avoid;
  }

  p {
    orphans: 2;
    widows: 2;
  }
}
```

### Multi-Column Layout Example

```css
/* For browsers with full multi-column support */
.magazine {
  columns: 3;
  column-gap: 2rem;
  orphans: 2;
  widows: 2;
}
```

## Related CSS Properties

- `page-break-before` / `page-break-after` - Control page breaks
- `page-break-inside` - Prevent page breaks within elements
- `columns` / `column-count` - Multi-column layout
- `break-before` / `break-after` - Modern break control properties
- `break-inside` - Prevent breaks within elements

## Recommendations

### Cross-Browser Compatibility

1. **Test thoroughly in target browsers**, especially Firefox (no support) and older IE versions
2. **Provide fallbacks** for browsers without support
3. **Use in print stylesheets** where support is most reliable
4. **Consider feature detection** or progressive enhancement approaches

### Best Practices

1. **Use moderate values**: Set `orphans: 2` or `widows: 2` for most cases
2. **Combine with related properties**: Use with `page-break-inside: avoid` for headings
3. **Test with real content**: Line counts vary by viewport and font settings
4. **Document print requirements**: Ensure stakeholders understand print behavior

### Browser Considerations

- **Firefox users**: Use server-side solutions (like Python's ReportLab) for print-critical documents
- **Mobile printing**: Test on target devices, as support varies
- **PDF generation**: Test with your specific CSS-to-PDF tool (Chromium-based tools have better support)

## Relevant Links

- [CSS last-line: Controlling Widows & Orphans](https://thenewcode.com/946/CSS-last-line-Controlling-Widows-amp-Orphans)
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=137367)
- [Codrops - Orphans Property Reference](https://tympanus.net/codrops/css_reference/orphans/)
- [Codrops - Widows Property Reference](https://tympanus.net/codrops/css_reference/widows/)

## Caveats & Limitations

1. **Firefox non-support**: As of version 148, Firefox does not support these properties
2. **Multi-column limitations**: Some older browsers only support page breaks, not column breaks
3. **Property parsing vs. implementation**: Some WebKit browsers parse but don't implement the properties
4. **Practical limitations**: May not prevent all undesirable breaks in complex layouts
5. **Performance considerations**: Extensive use may impact rendering performance in complex documents

## Conclusion

CSS widows and orphans properties are well-supported across modern browsers (91.47% global support), making them reliable for print and paginated layouts. However, developers should be aware of Firefox's lack of support and test thoroughly with target browsers. For critical print functionality, consider server-side PDF generation tools as a fallback.
