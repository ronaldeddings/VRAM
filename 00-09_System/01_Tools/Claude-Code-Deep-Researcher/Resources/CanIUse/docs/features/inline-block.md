# CSS inline-block

## Overview

**CSS inline-block** is a CSS display property value that allows elements to be rendered as block-level boxes while maintaining inline flow with surrounding text. This creates a hybrid behavior where an element respects margins and padding like a block element, but flows inline with text like an inline element.

## Description

The `display: inline-block` property combines the best of both worlds: an element is displayed as an inline element (flows with text) while maintaining block-level characteristics such as width, height, margins, and padding. This eliminates the whitespace issue that occurs with inline elements and provides precise control over element dimensions while maintaining text flow.

## Specification Status

**Status:** Recommended (REC)
**W3C Specification:** [CSS 2.1 Visual Rendering](https://www.w3.org/TR/CSS21/visuren.html#fixed-positioning)
**Category:** CSS2

## Categories

- CSS2
- Display Properties
- Layout

## Benefits and Use Cases

### Key Benefits

- **Responsive Layouts:** Create flexible multi-column layouts without floats
- **Precise Control:** Apply width, height, margins, and padding to inline elements
- **Text Flow:** Maintain inline text flow while styling elements as blocks
- **Eliminates Whitespace:** Avoid whitespace issues caused by inline elements
- **Simple Alternative:** Simpler than float-based layouts for certain scenarios
- **Element Alignment:** Easy vertical and horizontal alignment with inline-block elements

### Common Use Cases

1. **Navigation Menus:** Create horizontal navigation bars with proper spacing and sizing
2. **Thumbnail Galleries:** Display images or thumbnails in a grid layout
3. **Form Layouts:** Arrange form elements (inputs, labels) horizontally
4. **Buttons and Controls:** Position buttons side-by-side with consistent sizing
5. **Icon Collections:** Display icons inline with proper dimensions
6. **Product Listings:** Create product grids that respect responsive design
7. **List Items:** Style list items as block-like elements while maintaining inline layout

### Modern Alternatives

Modern CSS provides several alternatives that may be more appropriate depending on your use case:

- **Flexbox (`display: flex`):** Recommended for flexible layouts with better control over alignment and distribution
- **CSS Grid (`display: grid`):** Ideal for complex multi-row, multi-column layouts
- **Floats:** Traditional approach for text wrapping around floated elements

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| **y** | Fully supported |
| **a** | Partially supported with limitations |
| **x** | Prefix required |
| **#n** | See notes section |

### Desktop Browsers

| Browser | Supported Versions |
|---------|-------------------|
| **Chrome** | 4+ (All modern versions) |
| **Firefox** | 3+ (All modern versions) |
| **Safari** | 3.1+ (All modern versions) |
| **Edge** | 12+ (All modern versions) |
| **Opera** | 9+ (All modern versions) |
| **Internet Explorer** | 5.5+ (IE 6-7 with limitations, IE 8+ fully supported) |

### Mobile Browsers

| Browser | Supported Versions |
|---------|-------------------|
| **iOS Safari** | 3.2+ (All modern versions) |
| **Android** | 2.1+ (All modern versions) |
| **Chrome for Android** | 142+ |
| **Firefox for Android** | 144+ |
| **Opera Mobile** | 10+ (All modern versions) |
| **Samsung Internet** | 4+ (All modern versions) |

### Other Browsers

| Browser | Support |
|---------|---------|
| **Opera Mini** | All versions |
| **UC Browser (Android)** | 15.5+ |
| **Baidu Browser** | 13.52+ |
| **QQ Browser** | 14.9+ |
| **KaiOS** | 2.5+ |
| **Blackberry** | 7+ |
| **IE Mobile** | 10+ |

## Overall Compatibility

**Usage Percentage:** 93.72% of all browsers
**Full Support:** 93.72%
**Partial Support:** 0%

With this exceptional coverage, `inline-block` is safe to use in virtually all production environments without fallbacks.

## Important Notes

### IE 6 and IE 7 Limitations

Only supported in IE6 and IE7 on elements with a `display` of "inline" by default. For complete cross-browser support in older IE versions, [alternative properties](http://blog.mozilla.org/webdev/2009/02/20/cross-browser-inline-block/) are available.

### IE 8 Resize Bug

Internet Explorer 8 has a known [resize issue with display: inline-block](http://blog.caplin.com/2013/06/07/developing-for-ie8-inline-block-resize-bug/). This affects how the browser handles resizing of inline-block elements with certain property combinations.

### Whitespace Handling

Whitespace in HTML markup between inline-block elements can create unwanted gaps in the rendered layout. Common solutions include:

- Removing whitespace in HTML source code
- Using HTML comments to collapse whitespace
- Applying negative margins
- Using font-size manipulation on the parent
- Using flexbox or grid as a modern alternative

### Vertical Alignment

Inline-block elements are affected by the `vertical-align` property. By default, they align to the baseline of the text, which may create unexpected gaps below elements. Use `vertical-align: top`, `vertical-align: middle`, or `display: flex` to adjust alignment.

## Syntax

```css
/* Basic usage */
.element {
  display: inline-block;
}

/* With sizing */
.element {
  display: inline-block;
  width: 200px;
  height: 100px;
  margin: 10px;
  padding: 15px;
}

/* Common pattern for buttons */
.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

/* Navigation example */
.nav-item {
  display: inline-block;
  margin-right: 20px;
  padding: 10px 0;
}
```

## Code Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-size: 16px; /* Control whitespace */
    }

    .box {
      display: inline-block;
      width: 150px;
      height: 100px;
      margin: 10px;
      padding: 20px;
      background-color: #3498db;
      color: white;
      text-align: center;
      vertical-align: top;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
    <div class="box">Box 3</div>
  </div>
</body>
</html>
```

## Related Resources

- **Blog Post:** [CSS display: inline-block - why it rocks and why it sucks](https://robertnyman.com/2010/02/24/css-display-inline-block-why-it-rocks-and-why-it-sucks/)
- **Cross-Browser Support:** [Mozilla WebDev - Cross-browser inline-block](https://blog.mozilla.org/webdev/2009/02/20/cross-browser-inline-block/)
- **Documentation:** [WebPlatform Docs - CSS Display Property](https://webplatform.github.io/docs/css/properties/display)

## See Also

- [CSS Display Property](./display.md)
- [CSS Flexbox](./flexbox.md)
- [CSS Grid](./grid.md)
- [CSS Floats](./floats.md)
- [CSS Positioning](./positioning.md)

---

**Last Updated:** 2025-12-13
**Data Source:** [caniuse.com](https://caniuse.com)
