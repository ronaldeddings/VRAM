# SVG Fragment Identifiers

## Overview

SVG fragment identifiers enable you to display only a specific portion of an SVG image by referencing a view ID or defining view box dimensions as the file's fragment identifier. This technique is commonly used for SVG sprite sheets and optimized SVG asset management.

## Description

SVG fragment identifiers provide a method to reference and display partial SVG content using the URL fragment syntax. When you append a fragment identifier to an SVG file URL (e.g., `image.svg#view-id`), the browser loads only the specified portion of the SVG, making it an efficient approach for:

- **SVG Sprite Sheets**: Combine multiple SVG icons or graphics into a single file and reference individual elements
- **Responsive SVG**: Define multiple view areas for different screen sizes
- **Asset Optimization**: Reduce the number of HTTP requests by consolidating SVG assets

## Specification Status

- **Current Status**: Candidate Recommendation (CR)
- **W3C Specification**: [SVG Linking - Fragment Identifiers](https://www.w3.org/TR/SVG/linking.html#SVGFragmentIdentifiers)

## Categories

- SVG

## Use Cases & Benefits

### Primary Benefits

1. **Reduced File Requests**: Combine multiple SVG graphics into a single sprite sheet
2. **Improved Performance**: Fewer HTTP requests lead to faster page load times
3. **Easy Asset Management**: Centralized SVG asset management with individual component referencing
4. **Responsive Design**: Define multiple viewport areas for different screen sizes

### Common Use Cases

- **Icon Systems**: Maintain a single SVG file containing all application icons
- **Sprite Sheets**: Similar to CSS sprite sheets but for vector graphics
- **Dynamic SVG Rendering**: Load specific SVG components programmatically
- **Template Reuse**: Define reusable SVG patterns and components
- **Scalable Graphics**: Display vector graphics at any size without quality loss

## Browser Support

### Support Legend

- **y** = Full support
- **a** = Partial support (see notes)
- **u** = Unknown support
- **n** = Not supported

### Desktop Browsers

| Browser | First Full Support | Latest Versions | Notes |
|---------|-------------------|-----------------|-------|
| **Chrome** | 50 | 146+ | Fully supported |
| **Firefox** | 15 | 148+ | Fully supported |
| **Safari** | 11.1 | 18.2+ | Fully supported; Earlier versions (7.1-8) had partial support (#1) |
| **Edge** | 12 | 143+ | Fully supported |
| **Opera** | 37 | 122+ | Fully supported; Partial support from 10.0-12.1 (#1) |
| **Internet Explorer** | Not supported | 11 | Partial support in IE9-11 (#2) |

### Mobile Browsers

| Browser | Support Status | Latest Versions |
|---------|----------------|-----------------|
| **iOS Safari** | 11.3+ | 18.5+ (full support) |
| **Android Browser** | 4.4.3+ | 142+ (full support) |
| **Chrome Mobile** | Yes | 142+ |
| **Firefox Mobile** | Yes | 144+ |
| **Samsung Internet** | 5.0+ | 29+ |
| **Opera Mobile** | 12.1+ | 80+ |
| **UC Browser** | Yes | 15.5+ |
| **Opera Mini** | Yes | All versions |

### Global Support Coverage

- **Full Support**: 92.91% of users
- **Partial Support**: 0.46% of users
- **No Support**: 6.63% of users

## Known Issues & Limitations

### Issue #1: Partial Support with View Element

**Affected Browsers**: Chrome, Opera, and older Safari versions

**Description**: The ID syntax requires the ID to be set on a `view` element in these browsers, rather than on any arbitrary SVG element. This is a limitation when using fragment identifiers with elements other than `<view>`.

**Workaround**: Ensure your SVG uses proper `<view>` elements for maximum compatibility:

```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <view id="icon-home" viewBox="0 0 50 50"/>
  <circle cx="25" cy="25" r="20"/>
</svg>
```

### Issue #2: CSS Background Images

**Affected Browsers**:
- Chrome (Issue: [chromium#128055](https://code.google.com/p/chromium/issues/detail?id=128055))
- Safari (Issue: [webkit#91790](https://bugs.webkit.org/show_bug.cgi?id=91790) - fixed in June 2015)

**Description**: SVG fragments do not work reliably without a `view` element for CSS background images in some browsers. This limitation means background images may not reference the correct fragment.

**Note**: This issue was fixed in the latest WebKit versions, though some older Safari releases may still be affected.

**Workaround**: Use `<img>` tags or `<svg>` embeds instead of CSS background images for maximum compatibility with fragments.

### Issue #3: Inconsistent Background Image Support

**Affected Browsers**: Blink/WebKit browsers (Chrome, Safari, Edge)

**Description**: If a page already includes an SVG fragment referenced inside an `<img>` element, it may also work correctly for CSS `background-image` properties using the same URL. This behavior is unpredictable and not guaranteed.

**Impact**: For a period, CanIUse classified some Blink/WebKit browsers as having full support due to this inconsistency.

## Implementation Notes

### Best Practices

1. **Use View Elements**: Always use proper `<view>` elements in your SVG for maximum browser compatibility
2. **Test in Target Browsers**: Fragment identifier behavior can be inconsistent; test thoroughly
3. **Use IMG Tags**: For CSS background images, prefer `<img>` elements with fragment identifiers
4. **Define ViewBox**: Ensure your SVG has a proper `viewBox` attribute for responsive scaling

### Example Usage

#### SVG Sprite with View Elements

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <view id="icon-home" viewBox="0 0 50 50"/>
    <view id="icon-settings" viewBox="50 0 50 50"/>
  </defs>

  <!-- Home icon -->
  <g>
    <rect x="10" y="15" width="30" height="25"/>
    <polygon points="25,5 35,15 15,15"/>
  </g>

  <!-- Settings icon -->
  <g transform="translate(50, 0)">
    <circle cx="25" cy="25" r="8"/>
    <circle cx="25" cy="25" r="15" fill="none" stroke="black" stroke-width="2"/>
  </g>
</svg>
```

#### Referencing SVG Fragments

**In HTML:**
```html
<img src="icons.svg#icon-home" alt="Home" width="32" height="32"/>
<img src="icons.svg#icon-settings" alt="Settings" width="32" height="32"/>
```

**In CSS:**
```css
.icon-home {
  background-image: url('icons.svg#icon-home');
  background-size: 32px 32px;
}

.icon-settings {
  background-image: url('icons.svg#icon-settings');
  background-size: 32px 32px;
}
```

## Resources & References

### Official Documentation

- [W3C SVG Fragment Identifiers Specification](https://www.w3.org/TR/SVG/linking.html#SVGFragmentIdentifiers)

### External Resources

- [Better SVG Sprites with Fragment Identifiers](http://www.broken-links.com/2012/08/14/better-svg-sprites-with-fragment-identifiers/) - Blog post on implementation techniques

### Browser Support Issues

- [WebKit Support Bug #91791](https://bugs.webkit.org/show_bug.cgi?id=91791) - Fragment identifier support tracking

## Compatibility Summary

SVG fragment identifiers have excellent modern browser support with 92.91% global coverage. While there are known limitations in some older browsers and edge cases with CSS background images, the feature is production-ready for most use cases. The main consideration is testing in your specific target browsers, particularly around the use of `<view>` elements for maximum compatibility.

### Recommendation

For modern web applications, SVG fragments are a safe, performant technique for managing SVG sprite sheets and referenced SVG content. Ensure proper testing in your target browser set, particularly around CSS background image usage if that's part of your implementation.
