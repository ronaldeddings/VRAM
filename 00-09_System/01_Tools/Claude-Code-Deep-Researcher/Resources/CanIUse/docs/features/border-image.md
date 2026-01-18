# CSS3 Border Images

## Description

Border images enable developers to use image files to create custom border designs around elements, providing a powerful alternative to solid-color borders. Instead of uniform colors, borders can be scaled, tiled, or repeated using images, allowing for more sophisticated and visually appealing design elements.

---

## Specification Status

| Item | Details |
|------|---------|
| **Specification** | [CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css3-background/#border-images) |
| **Status** | Candidate Recommendation (CR) |

---

## Categories

- CSS3

---

## Key Features & Use Cases

### Benefits

- **Custom Design Flexibility**: Create complex border designs without relying on multiple nested elements
- **Responsive Scalability**: Images automatically scale to fit different element sizes
- **Single Image Optimization**: Use a single image sprite to define all border edges and corners
- **Consistent Styling**: Maintain visual consistency across interfaces with reusable border patterns
- **Enhanced Visual Appeal**: Add sophisticated design elements while maintaining clean HTML structure

### Common Use Cases

- Decorative frames around images or content sections
- Custom styled form inputs and buttons
- Creative UI containers with artistic borders
- Media embeds with styled frames
- Themed widgets and component borders
- Gaming or entertainment interfaces with ornate borders

---

## Browser Support

### Summary by Major Browsers

| Browser | First Full Support | Prefix Required | Notes |
|---------|-------------------|-----------------|-------|
| **Chrome** | 56+ | -webkit- (4-55) | Partial support in earlier versions |
| **Firefox** | 50+ | None | Partial support from 3.5-49 |
| **Safari** | 9.1+ | -webkit- (3.1-9) | Partial support in earlier versions |
| **Edge** | 14+ | -webkit- (12-13) | Full support from version 14 |
| **Opera** | 43+ | None | Partial support from 10.5-42 |
| **Internet Explorer** | 11 | None | Full support only in IE 11 |
| **iOS Safari** | 9.3+ | -webkit- (3.2-9.2) | Partial support in earlier versions |
| **Android** | 4.4+ | Partial | Full support in Android 142+ |

### Detailed Browser Version Support

#### Desktop Browsers

**Chrome**
- Versions 4-55: Partial support with `-webkit-` prefix
- Versions 56+: Full support

**Firefox**
- Versions 2-3: No support
- Versions 3.5-49: Partial support (limited properties)
- Versions 50+: Full support

**Safari (macOS)**
- Versions 3.1-5.1: Partial support with `-webkit-` prefix
- Versions 6-9: Partial support (limited features)
- Versions 9.1+: Full support

**Edge**
- Versions 12-13: Partial support with `-webkit-` prefix
- Versions 14+: Full support

**Opera**
- Versions 9-10.1: No support
- Versions 10.5-12.1: Partial support
- Versions 15-42: Partial support
- Versions 43+: Full support

**Internet Explorer**
- Versions 5.5-10: No support
- Version 11: Full support

#### Mobile Browsers

**iOS Safari**
- Versions 3.2-9.2: Partial support with `-webkit-` prefix
- Versions 9.3+: Full support (with limitations)
- Versions 15.4+: Complete full support

**Android Browser**
- Versions 2.1-4.3: Partial support
- Versions 4.4+: Full support (with limitations)
- Version 142+: Complete full support

**Chrome Mobile**
- Version 142+: Full support

**Firefox Mobile**
- Version 144+: Full support

**Opera Mobile**
- Versions 10-12.1: Partial support
- Versions 80+: Full support

**Samsung Internet**
- Versions 4-6.4: Partial support
- Versions 7.2+: Full support

---

## Browser Support Table

```
IE        | 5.5  6   7   8   9   10  11  (Full from 11)
Edge      | 12   13  14  15  ... 143 (Full from 14)
Firefox   | 2   3   3.5 ... 49  50+ (Full from 50)
Chrome    | 4   5  ... 55  56+ (Full from 56)
Safari    | 3.1 3.2 ... 9   9.1+ (Full from 9.1)
Opera     | 9   9.5 ... 42  43+ (Full from 43)
iOS Saf   | 3.2 4.0 ... 9.2 9.3+ (Full from 9.3)
Android   | 2.1 2.2 ... 4.3 4.4+ (Full from 4.4)
```

### Support Legend

- **y** = Full support
- **a** = Partial support (see limitations below)
- **x** = Requires vendor prefix (`-webkit-`)
- **n** = No support

---

## Limitations & Known Issues

### Partial Support Notes

| Note | Description |
|------|-------------|
| **#1** | **Border-style override bug**: `border-image` incorrectly overrides `border-style` in WebKit browsers. See [WebKit bug #99922](https://bugs.webkit.org/show_bug.cgi?id=99922) and [WHATWG compat issue](https://github.com/whatwg/compat/issues/17). Has a test case available on [CodePen](https://codepen.io/Savago/pen/yYrgyK). |
| **#2** | **Missing `border-image-repeat: space`**: Partial support refers to not supporting the `space` value for the `border-image-repeat` property. |
| **#3** | **Shorthand syntax limitation**: Partial support indicates the shorthand syntax is supported, but individual properties (`border-image-source`, `border-image-slice`, `border-image-width`, `border-image-outset`) may not work properly. |
| **#4** | **Missing `border-image-repeat: round`**: Partial support refers to not supporting the `round` value for the `border-image-repeat` property. |

### Known Bugs

#### Firefox
- **SVG Image Stretching**: Firefox is not able to stretch SVG images across elements when used as border images. [Bug report: Mozilla #619500](https://bugzilla.mozilla.org/show_bug.cgi?id=619500)

#### WebKit Browsers (Safari, Chrome, Edge)
- **Round Repeat Rendering**: WebKit browsers render the `round` value differently from other browsers, stretching the border rather than repeating it in certain cases. [WebKit bug #155955](https://bugs.webkit.org/show_bug.cgi?id=155955)

---

## Implementation Notes

### Critical Requirements

Both `border-style` and `border-width` **must** be specified (not set to `none` or 0) for border-images to work properly. This is a common source of confusion when implementing border images.

### Example Implementation

```css
/* Required: border-style and border-width must be set */
.element {
  border-style: solid;
  border-width: 15px;
  border-image-source: url('border-image.png');
  border-image-slice: 30;
  border-image-repeat: stretch;
}

/* With vendor prefix for broader compatibility */
.element {
  border-style: solid;
  border-width: 15px;
  -webkit-border-image: url('border-image.png') 30 stretch;
  border-image: url('border-image.png') 30 stretch;
}
```

### Related CSS Properties

- `border-image-source`: Specifies the image to use for the border
- `border-image-slice`: Divides the image into regions
- `border-image-width`: Specifies the width of the border image
- `border-image-repeat`: Sets how the border image is repeated (stretch, repeat, round, space)
- `border-image-outset`: Extends the border image beyond the border box

---

## Global Usage Statistics

| Metric | Percentage |
|--------|-----------|
| Global Users with Support | **93.35%** |
| Partial Support | **0.29%** |
| **Total Coverage** | **≈93.64%** |

This indicates that the vast majority of users have browsers with at least partial support for CSS3 border images, making it a reliable feature for modern web development.

---

## Additional Resources

### Official Documentation
- [WebPlatform Docs - Border Image](https://webplatform.github.io/docs/css/properties/border-image)
- [MDN Web Docs - CSS Border Image](https://developer.mozilla.org//docs/Web/CSS/border-image)

### Related Specifications
- [W3C CSS Backgrounds and Borders Module Level 3](https://www.w3.org/TR/css3-background/#border-images)

### Testing & Compatibility
- Check compatibility at [Can I Use - Border Image](https://caniuse.com/border-image)
- Test on [CodePen](https://codepen.io/) or similar platforms

---

## Vendor Prefixes

The `-webkit-` prefix should be used for:
- Chrome versions 4-55
- Safari versions 3.1-9
- iOS Safari versions 3.2-9.2
- Android Browser versions 2.1-4.3
- Opera versions 10.5-12.1
- Opera Mobile versions 10-12.1

Modern versions of these browsers support the unprefixed property.

---

## Summary

CSS3 Border Images have excellent browser support across modern browsers (93.35% global coverage) and are safe to use in production environments. However, developers should be aware of:

1. The requirement to set both `border-style` and `border-width`
2. Limitations in WebKit browsers with the `round` repeat value
3. Firefox's inability to stretch SVG images for borders
4. The need for vendor prefixes in older browser versions

For legacy browser support, always include both the `-webkit-` prefixed and unprefixed versions of the property.
