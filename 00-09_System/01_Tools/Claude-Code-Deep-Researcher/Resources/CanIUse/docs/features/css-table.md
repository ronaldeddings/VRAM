# CSS Table Display

## Overview

CSS Table display provides a method of displaying elements as tables, rows, and cells without using HTML table elements. This includes support for all `display: table-*` properties as well as `display: inline-table`.

## Description

CSS Table display allows developers to create table-like layouts using standard block-level and inline elements through CSS. This is particularly useful for semantic HTML structures that don't use HTML table markup but require table-like visual presentation.

### Supported Properties

- `display: table`
- `display: inline-table`
- `display: table-row`
- `display: table-cell`
- `display: table-row-group`
- `display: table-header-group`
- `display: table-footer-group`
- `display: table-column`
- `display: table-column-group`
- `display: table-caption`

## Specification Status

- **Status**: Recommendation (REC)
- **Specification**: [CSS 2.1 - Tables](https://www.w3.org/TR/CSS21/tables.html)
- **Category**: CSS2

## Use Cases and Benefits

### Common Use Cases

- Creating complex layouts without HTML table semantics
- Responsive table-like designs using semantic HTML
- Multi-column layouts with equal height columns
- Vertical centering of content
- Equal width distribution of content
- Building form layouts with proper alignment

### Benefits

- **Semantic HTML**: Use appropriate HTML elements while maintaining table-like layout
- **Flexibility**: Greater control over layout behavior compared to HTML tables
- **Responsive Design**: Easier to adapt to different screen sizes
- **Maintenance**: Cleaner markup structure and easier CSS modifications
- **Accessibility**: Better semantic meaning when used with appropriate HTML elements

## Browser Support

### Desktop Browsers

| Browser | First Support | Latest Support |
|---------|---------------|-----------------|
| **Internet Explorer** | 8.0 | 11 |
| **Edge** | 12 | 143 |
| **Firefox** | 3.0 | 148 |
| **Chrome** | 4 | 146 |
| **Safari** | 3.1 | 18.5-18.6 |
| **Opera** | 9 | 122 |

### Mobile Browsers

| Browser | Support Status | Latest Tested Version |
|---------|----------------|----------------------|
| **iOS Safari** | Yes | 18.5-18.7 |
| **Android Browser** | Yes | 142 |
| **Opera Mobile** | Yes | 80 |
| **Opera Mini** | Yes | All versions |
| **Chrome Android** | Yes | 142 |
| **Firefox Android** | Yes | 144 |
| **Samsung Internet** | Yes | 29 |
| **UC Browser** | Yes | 15.5 |
| **Android UC** | Yes | 15.5 |
| **Baidu Browser** | Yes | 13.52 |
| **QQ Browser** | Yes | 14.9 |
| **KaiOS Browser** | Yes | 3.0-3.1 |
| **BlackBerry** | Yes | 10 |
| **IE Mobile** | Yes | 11 |

## Browser Support Summary

- **Global Support**: 93.72% user base
- **IE 5.5-7**: Not supported
- **IE 8+**: Supported
- **All modern browsers**: Full support
- **Mobile platforms**: Excellent support across all major browsers

## Known Issues and Notes

### Firefox 2
Firefox 2 does not support `inline-table`. This browser is largely obsolete and should not be a concern for modern projects.

### Safari 5.1.17 Bug
Safari 5.1.17 has a bug when using an element with `display: table` that includes padding and width. The browser incorrectly forces the `border-box` model instead of the standard `content-box` model. This was correctly handled by Chrome 21.0 and later versions, making it difficult to resolve with CSS alone in Safari 5.1.17.

### Firefox position: relative Bug
Firefox had a historical bug with `position: relative` in table cells (elements with `display: table-cell`), which was fixed in Firefox version 37. No issues exist in modern Firefox versions.

## Implementation Notes

### CSS Keywords
- `display:table`
- `table-cell`
- `table-row`
- `table-layout`

### No Vendor Prefixes Required
This feature does not require vendor prefixes (`-webkit-`, `-moz-`, etc.) in any modern browser.

### Fallback Considerations

For legacy browser support (IE 7 and below), consider:
1. Using HTML `<table>` elements as fallback
2. Progressive enhancement approach
3. Graceful degradation with alternative layout methods

## Practical Examples

### Basic Table Layout

```css
.table {
  display: table;
  width: 100%;
}

.row {
  display: table-row;
}

.cell {
  display: table-cell;
  padding: 10px;
  border: 1px solid #ddd;
}
```

### Equal Height Columns

```css
.container {
  display: table;
  width: 100%;
}

.column {
  display: table-cell;
  padding: 20px;
  vertical-align: top;
}
```

### Inline Table

```css
.inline-table {
  display: inline-table;
  width: auto;
}
```

## Related Resources

- [Blog Post: Using CSS display:table for Layout](https://www.onenaught.com/posts/201/use-css-displaytable-for-layout)
- [MDN Web Docs: display property](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [CSS Working Group Specification](https://www.w3.org/TR/CSS21/tables.html)

## Migration from HTML Tables

If migrating from HTML tables to CSS table display:

1. Replace `<table>` with a `<div>` or semantic container and apply `display: table`
2. Replace `<tr>` with `<div>` elements and apply `display: table-row`
3. Replace `<td>` or `<th>` with appropriate elements and apply `display: table-cell`
4. Use CSS for table-specific styling (borders, spacing, alignment)
5. Test across target browsers, particularly older versions if needed

## Recommendation

CSS Table display is a mature, widely-supported feature suitable for production use across all modern browsers. It should be preferred over HTML tables for non-tabular data that requires table-like visual presentation, as it provides better semantics and more flexible styling options.

---

**Last Updated**: 2025-12-13
**Data Source**: CanIUse Database
**Usage**: 93.72% of tracked browsers
