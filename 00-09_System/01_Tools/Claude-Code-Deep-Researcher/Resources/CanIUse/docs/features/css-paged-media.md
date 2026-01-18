# CSS Paged Media (@page)

## Overview

CSS Paged Media provides an at-rule (`@page`) to define page-specific rules when printing web pages, such as margins per page and page dimensions. This specification allows developers to control how content is rendered when printed or converted to paged formats (PDF, etc.).

## Description

The `@page` at-rule is part of the CSS Paged Media specification and enables developers to:

- Define page-specific styling rules for print media
- Set custom margins for printed pages
- Configure page dimensions and orientation
- Control page breaks and page numbering
- Apply different styles to first, left, and right pages

This is particularly useful for creating print-friendly stylesheets and generating properly formatted documents from web content.

## Specification Status

**Status:** Working Draft (WD)

**Official Specification:** [W3C CSS Paged Media Module Level 3](https://w3c.github.io/csswg-drafts/css-page-3/)

## Categories

- Other

## Use Cases & Benefits

### Print-Friendly Documents
Generate professional-looking printed pages with custom margins, headers, and footers

### Document Generation
Create PDFs and other paged output from web content with precise layout control

### Report Generation
Format reports, invoices, and other documents with page-specific styling

### Publishing Workflows
Support sophisticated publishing workflows with custom page rules for different page types

### Professional Documents
Create business documents with controlled page breaks and formatting

## Browser Support

### Support Legend

- **✓ (y)** - Fully supported
- **◐ (a)** - Partially supported (see notes)
- **✗ (n)** - Not supported
- **? (u)** - Unknown/Untested

### Desktop Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | ✓ 15+ | Fully supported from v15 onwards |
| **Edge** | ✓ 79+ | Fully supported from v79 onwards |
| **Firefox** | ◐ 19–94, ✓ 95+ | Partial support until v94; Full support from v95 |
| **Safari** | ◐ (Pre-18.2), ✓ 18.2+ | Partial support; Full support from v18.2 onwards |
| **Opera** | ◐ 9–12.1, ✓ 15+ | Partial support until v12.1; Full support from v15 onwards |
| **Internet Explorer** | ◐ 8–11 | Only partial support; `size` property not supported |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome Mobile** | ✓ 142+ | Fully supported |
| **Firefox Mobile** | ✓ 144+ | Fully supported |
| **Safari iOS** | ◐ (Pre-18.2), ✓ 18.2+ | Partial support; Full support from v18.2 onwards |
| **Opera Mobile** | ◐ 10–12.1, ✓ 80+ | Partial support until v12.1; Full support from v80 onwards |
| **Samsung Browser** | ✓ 4+ | Fully supported |
| **Opera Mini** | ? | Unknown/Untested |
| **UC Browser** | ✓ 15.5+ | Fully supported from v15.5 onwards |
| **QQ Browser** | ✓ 14.9+ | Fully supported from v14.9 onwards |
| **Baidu Browser** | ✓ 13.52+ | Fully supported from v13.52 onwards |
| **Kaios** | ◐ 2.5–3.1 | Partial support |

### Global Usage

- **Full Support (y):** 89.9% of global users
- **Partial Support (a):** 0.49% of global users
- **Combined Support:** 90.39% of global users

## Known Limitations & Notes

### Partial Support (#1)
Browsers with partial support (marked with `#1` in the table) have the following limitation:
- **Does not support the `size` property** - This property is critical for controlling page dimensions

### Additional Limitations

**Presto-based Opera (≤ 12.1)**
- Recognizes the `size` property but has buggy behavior in interpreting the dimensions
- Users should test carefully when targeting this browser

**Latest Specification Features**
- No browsers currently support the `marks` and `bleed` properties from the latest version of the specification
- These properties are part of the CSS Page Module Level 3 specification but remain experimental

### Mobile Device Support
- Most mobile browsers have unknown or untested support for paged media features
- iOS Safari gained full support relatively recently (v18.2)
- Android and older browsers typically show unknown support, making print functionality unpredictable

## Example Usage

```css
/* Define default page styles */
@page {
  margin: 2cm;
  size: A4;
}

/* Style first page differently */
@page :first {
  margin-top: 10cm;
}

/* Different styles for left and right pages */
@page :left {
  margin-left: 3cm;
  margin-right: 2cm;
}

@page :right {
  margin-left: 2cm;
  margin-right: 3cm;
}
```

## Related Resources

### Documentation & Guides
- [MDN Web Docs - CSS @page](https://developer.mozilla.org/en-US/docs/Web/CSS/@page) - Comprehensive MDN documentation on the @page at-rule
- [TutorialsPoint - CSS Paged Media](https://www.tutorialspoint.com/css/css_paged_media.htm) - Introduction to CSS paged media concepts

### Browser Implementation Issues
- [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=85062) - Track Safari/WebKit implementation status
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=286443) - Track Firefox implementation status

## Implementation Recommendations

### For Full Compatibility (90% Coverage)
Use `@page` for print styling with fallback support, as most modern browsers provide good coverage through Chrome, Edge, Firefox 95+, Safari 18.2+, and Opera 15+.

### Browser-Specific Considerations

**IE 8-11 & Edge 12-18**
- Avoid using the `size` property
- Focus on margin-based styling only
- Test extensively with print preview

**Firefox < 95**
- Provide fallback print stylesheets
- Consider using print media queries as alternative
- Test thoroughly before deployment

**Safari < 18.2 & iOS Safari < 18.2**
- Recently gained full support; still recommend testing
- Older Safari versions require print-specific alternatives
- Consider PDF generation libraries for older devices

**Mobile Browsers**
- Assume support is limited or unknown
- Provide mobile-friendly print stylesheets
- Test on actual devices when possible

### Best Practices
1. Always include fallback print styles using `@media print`
2. Test printed output in actual browser print dialogs
3. Avoid using unsupported properties like `marks` and `bleed`
4. Use feature detection instead of browser detection
5. Provide PDF download alternatives for critical documents

## See Also

- [CSS @media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)
- [CSS Print Styles](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Paged_Media)
- [Print CSS Guide](https://www.smashingmagazine.com/2011/11/how-to-set-up-a-print-style-sheet/)

---

**Last Updated:** December 2025
**Data Source:** CanIUse

