# CSS Page-Break Properties

## Overview

CSS page-break properties control how elements are broken across printed pages. These properties are essential for creating print-friendly documents and controlling page layout in print media.

## Description

Properties to control the way elements are broken across (printed) pages. These legacy properties include `page-break-before`, `page-break-after`, and `page-break-inside`, which allow developers to define where page breaks should occur when a document is printed.

## Specification Status

**Status:** Recommendation (REC)

**Official Specification:** [W3C CSS 2.1 Page Module](https://www.w3.org/TR/CSS2/page.html#page-breaks)

### Specification Notes

The CSS page-break properties are part of the CSS 2.1 specification. The newer and more comprehensive specification for fragmentation (including column and region breaks) can be found in the [CSS Fragmentation Module Level 3](https://drafts.csswg.org/css-break-3/#break-between), which includes the modern `break-before`, `break-after`, and `break-inside` properties.

## Categories

- **CSS** - Core CSS styling properties

## Properties

### Core Page-Break Properties

| Property | Values | Description |
|----------|--------|-------------|
| `page-break-before` | `auto`, `always`, `avoid`, `left`, `right` | Specifies page break behavior before an element |
| `page-break-after` | `auto`, `always`, `avoid`, `left`, `right` | Specifies page break behavior after an element |
| `page-break-inside` | `auto`, `avoid` | Prevents page breaks inside an element |

## Use Cases and Benefits

### Primary Use Cases

1. **Print Document Control** - Force page breaks at appropriate locations when printing documents
2. **Report Generation** - Ensure sections start on new pages in generated PDF/print reports
3. **Document Layout** - Control how content flows across printed pages
4. **Prevent Content Splitting** - Keep related content together on the same page

### Benefits

- Simple and intuitive syntax for controlling print behavior
- Wide browser support for basic functionality
- Essential for print stylesheets and print-friendly web applications
- Maintains backward compatibility with older CSS specifications

## Browser Support

### Support Legend

- **y** - Fully supported
- **a** - Supported with some limitations (note the footnotes for details)
- **u** - Unsupported
- **x** - Unknown/Not applicable

### Support Footnotes

1. **Note #1:** Supports the `page-break-*` alias from the CSS 2.1 specification, but not the `break-*` properties from the latest spec.

2. **Note #2:** Partial support due to not supporting `avoid` for `page-break-before` & `page-break-after` (only `page-break-inside` supported).

3. **Note #3:** Treats the `left` and `right` values like `always` (as allowed by specification).

### Desktop Browsers

| Browser | Version Support | Status |
|---------|-----------------|--------|
| **Chrome** | 4.0+ | Full support (v4-107: full, v108+: partial) |
| **Firefox** | 2.0+ | Full support (v2-64: full, v65+: partial) |
| **Safari** | 3.1+ | Full support (mostly with notes) |
| **Edge** | 12.0+ | Full support (v12-107: full, v108+: partial) |
| **Opera** | 10.0+ | Full support (v10+, with evolution from partial) |
| **Internet Explorer** | 5.5-11 | Partial support |

### Mobile Browsers

| Browser | Version Support | Status |
|---------|-----------------|--------|
| **iOS Safari** | 3.2+ | Full support |
| **Android Browser** | 2.1+ | Full support (mostly with notes) |
| **Chrome Mobile** | Latest | Full support |
| **Firefox Mobile** | 144+ | Partial support |
| **Samsung Internet** | 4.0+ | Full support (v21+: partial) |
| **Opera Mini** | All versions | Partial support |
| **UC Browser** | 15.5+ | Full support |

### Coverage Statistics

- **Full Support (y):** 36.68% of users
- **Partial Support (a):** 57.04% of users
- **Combined Coverage:** 93.72% of users

## Known Issues

### Firefox
- **Issue #775617:** Firefox has partial support for `page-break-before/page-break-after: avoid`
  - Link: [Mozilla Bugzilla #775617](https://bugzilla.mozilla.org/show_bug.cgi?id=775617)

### Chromium/Blink
- **Issue #223068:** Chromium has limited support for `break-before`, `break-after`, and `break-inside` properties
  - Link: [Chromium Issue Tracker #223068](https://bugs.chromium.org/p/chromium/issues/detail?id=223068)

## Important Notes

### Print Support Limitation
Not all mobile browsers offer print support. The support listed for mobile browsers is based on browser engine capability, not actual print functionality implementation.

### Modern Alternative
For newer development, consider using the modern `break-before`, `break-after`, and `break-inside` properties from the CSS Fragmentation specification, which provide more comprehensive control over fragmentation across printed pages, columns, and regions.

### CSS 2.1 vs CSS Fragmentation
- **CSS 2.1 properties:** `page-break-before`, `page-break-after`, `page-break-inside`
- **Modern properties:** `break-before`, `break-after`, `break-inside`
- Modern properties provide the same functionality and are part of the latest specification

## Usage Example

```css
/* Force a page break before an element */
.chapter {
  page-break-before: always;
}

/* Prevent page breaks inside an element */
.no-break {
  page-break-inside: avoid;
}

/* Force a page break after an element */
.section-end {
  page-break-after: always;
}

/* Modern alternative syntax */
.chapter-modern {
  break-before: page;
}

.no-break-modern {
  break-inside: avoid;
}

.section-end-modern {
  break-after: page;
}
```

## Related Resources

### Official Documentation
- [W3C CSS 2.1 Page Module Specification](https://www.w3.org/TR/CSS2/page.html#page-breaks)
- [CSS Fragmentation Module Level 3 (Latest Specification)](https://drafts.csswg.org/css-break-3/#break-between)

### Learning Resources
- [CSS Tricks - Page-Break Almanac](https://css-tricks.com/almanac/properties/p/page-break/)

### Related Features
- [CSS Fragmentation](https://caniuse.com/css-break) - Modern break properties for fragmentation control
- [CSS @media Print](https://caniuse.com/css-media-print) - Print media queries
- [@media Print Support](https://caniuse.com/mediaqueries) - Media queries for print styles

## Implementation Recommendations

### For Maximum Compatibility
1. Use `page-break-before: always` and `page-break-after: always` for forcing page breaks (excellent support)
2. Use `page-break-inside: avoid` for keeping elements together (widely supported)
3. Avoid relying on `avoid` values for `page-break-before` and `page-break-after` (Firefox limitation)

### For Modern Projects
1. Prefer `break-before`, `break-after`, and `break-inside` from CSS Fragmentation
2. Provide fallbacks using legacy `page-break-*` properties
3. Test print functionality across target browsers

### Print Stylesheet Best Practice
```css
/* Print stylesheet example */
@media print {
  .no-print {
    display: none;
  }

  .page-break {
    page-break-after: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  h2 {
    page-break-before: avoid;
    page-break-after: avoid;
  }
}
```
