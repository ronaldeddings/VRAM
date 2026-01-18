# CSS line-clamp

![Supported in 93.14% of browsers](https://img.shields.io/badge/support-93.14%25-brightgreen)

## Description

CSS `line-clamp` is a property that truncates text to a specified number of lines when used in combination with `display: -webkit-box`. When combined with `text-overflow: ellipsis`, the truncated text will end with an ellipsis (`...`).

This is particularly useful for creating responsive text layouts where you want to prevent content overflow and maintain visual consistency across different screen sizes.

## Specification

- **Status:** Working Draft (WD)
- **Specification URL:** https://w3c.github.io/csswg-drafts/css-overflow-3/#propdef--webkit-line-clamp

## Categories

- CSS

## Benefits and Use Cases

### Typical Use Cases

1. **Article Previews** - Display truncated article summaries in list views while maintaining visual consistency
2. **Card Components** - Limit description text in card-based layouts to a fixed number of lines
3. **Product Listings** - Show product names and descriptions with predictable heights
4. **Search Results** - Display truncated search result descriptions with ellipsis
5. **User Comments** - Limit comment preview length in feeds and discussion threads
6. **Mobile-Optimized UIs** - Constrain text on small screens to improve layout stability
7. **Dynamic Content** - Handle variable-length user-generated content gracefully

### Key Benefits

- **Better Layout Control** - Prevents unpredictable text heights from breaking layouts
- **Improved Mobile Experience** - Essential for responsive design on smaller devices
- **Visual Consistency** - Creates uniform component heights across different content
- **User Experience** - Subtle truncation is less jarring than overflow or hidden text
- **No JavaScript Needed** - Pure CSS solution reduces script complexity and improves performance

## Syntax

```css
.truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Required Properties

- `display: -webkit-box` - Establishes the layout context
- `-webkit-line-clamp: <integer>` - Specifies the number of lines to display
- `-webkit-box-orient: vertical` - Sets the box orientation
- `overflow: hidden` - Hides overflow content
- `text-overflow: ellipsis` - Adds ellipsis at the end (optional)

## Browser Support

| Browser | First Support | Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 14 | ✅ Full support | With `-webkit-` prefix |
| **Safari** | 5 | ✅ Full support | With `-webkit-` prefix |
| **Firefox** | 68 | ✅ Full support | With `-webkit-` prefix |
| **Edge** | 17 | ✅ Partial support | With `-webkit-` prefix only |
| **Opera** | 15 | ✅ Full support | With `-webkit-` prefix |
| **iOS Safari** | 5.0-5.1 | ✅ Full support | With `-webkit-` prefix |
| **Android Browser** | 2.3 | ✅ Full support | With `-webkit-` prefix |
| **Samsung Internet** | 4 | ✅ Full support | With `-webkit-` prefix |
| **IE** | Not supported | ❌ No support | All versions unsupported |
| **Opera Mini** | Not supported | ❌ No support | All versions unsupported |

### Legacy Support Notes

- **Internet Explorer (5.5-11):** No support across any version
- **Edge (12-16):** No support
- **Firefox (2-67):** No support
- **Opera Mini:** Not supported

### Vendor Prefix Requirements

Currently requires the `-webkit-` vendor prefix across all browsers. The specification defines this as a working draft, and all modern browsers implement it as a webkit-prefixed feature rather than the standard unprefixed version.

## Examples

### Basic Text Truncation

```css
.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Product Card

```html
<div class="product-card">
  <h3>Product Title</h3>
  <p class="description">
    This is a longer product description that might be several
    sentences long and should be truncated to just two lines
    with an ellipsis at the end.
  </p>
  <span class="price">$99.99</span>
</div>
```

```css
.product-card {
  width: 300px;
  border: 1px solid #ccc;
  padding: 16px;
}

.product-card .description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 8px 0;
  color: #666;
}
```

### Responsive Line Clamping

```css
.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .card-text {
    -webkit-line-clamp: 2;
  }
}
```

## Notes and Known Issues

### General Notes

- **Webkit Prefix Requirement:** This property requires the `-webkit-` prefix, even though it's implemented in Firefox and other non-webkit browsers
- **Historical Opera Support:** Older Presto-based versions of Opera also supported similar ellipsis functionality using the proprietary `-o-ellipsis-lastline;` value for the `text-overflow` property
- **Edge Support:** Microsoft Edge supports this feature with the `-webkit-` prefix only (not with `-ms-` prefix as might be expected)

### Implementation Considerations

1. **Fallback for Unsupported Browsers:** Internet Explorer users will not see the ellipsis effect; consider server-side truncation as a fallback
2. **Performance:** Line clamping with `-webkit-box` can impact rendering performance on very large lists; consider virtualization for long lists
3. **Text Selection:** On some browsers, selecting text that is clamped may behave unexpectedly
4. **Dynamic Content:** Changes to content may not immediately update the clamped display; consider forcing a reflow if issues occur

## Related Resources

### Official Documentation
- [MDN Web Docs - line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp)
- [CSS Overflow Module Level 3 Specification](https://w3c.github.io/csswg-drafts/css-overflow-3/#propdef--webkit-line-clamp)

### Community Resources
- [CSS Tricks - Line Clampin'](https://css-tricks.com/line-clampin/)

### Modern Alternative
For projects targeting modern browsers only, consider the newer [CSS `line-clamp` property](https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp) (without the `-webkit-` prefix), which has been gaining browser support.

## Global Usage

This feature has achieved significant adoption:
- **Global Support:** 93.14% of users' browsers support this feature
- **Legacy Browsers:** Only Internet Explorer and Opera Mini users lack support
- **Mobile:** Excellent support across iOS and Android platforms

---

*Last Updated: 2025*
*Browser support data from Can I Use*
