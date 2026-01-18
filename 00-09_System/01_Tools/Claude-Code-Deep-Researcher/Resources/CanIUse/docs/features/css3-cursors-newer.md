# CSS3 Cursors: zoom-in & zoom-out

## Overview

This documentation covers support for the `zoom-in` and `zoom-out` cursor values in CSS3. These cursor properties allow developers to provide visual feedback to users about zoomable interface elements.

## Feature Description

The CSS3 `cursor` property extends support to include `zoom-in` and `zoom-out` values. These specialized cursor types visually indicate to users that an element is interactive and can be zoomed in or out, improving user experience on interactive content like maps, image galleries, and data visualizations.

### Syntax

```css
.zoomable-element {
  cursor: zoom-in;  /* Indicates the element can be zoomed in */
}

.zoomed-element {
  cursor: zoom-out; /* Indicates the element can be zoomed out */
}
```

## Specification Status

- **Status:** Recommended (REC)
- **Specification:** [W3C CSS3 UI Module - Cursor Property](https://www.w3.org/TR/css3-ui/#cursor)
- **Maturity:** Stable and well-established

## Categories

- **CSS3**

## Benefits and Use Cases

### Primary Use Cases

1. **Interactive Maps** - Indicates zoomable regions in mapping applications
2. **Image Galleries** - Shows users they can zoom into full-size images
3. **Data Visualizations** - Clarifies interactive chart elements that support zoom
4. **PDF Viewers** - Provides visual cues for zoom-enabled document viewers
5. **Photo Editing Tools** - Indicates zoomable canvas areas

### User Experience Benefits

- **Clear Intent:** Users immediately understand an element's interactive capability
- **Accessibility:** Improves discoverability for interactive features
- **Professional Polish:** Demonstrates attention to UX detail
- **Reduced Confusion:** Users don't need to guess which elements are zoomable
- **Cross-Platform Consistency:** Standardized cursor appearance across browsers

## Browser Support

### Support Legend

- **y** - Supported
- **y x** - Supported with vendor prefix (e.g., `-webkit-`, `-moz-`)
- **n** - Not supported

### Detailed Browser Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4-36 | y x | Requires vendor prefix |
| **Chrome** | 37+ | y | Full support |
| **Firefox** | 2-23 | y x | Requires vendor prefix |
| **Firefox** | 24+ | y | Full support |
| **Safari** | 3.1-8 | y x | Requires vendor prefix |
| **Safari** | 9+ | y | Full support |
| **Edge** | 12+ | y | Full support |
| **Opera** | 9-11.5 | n | Not supported |
| **Opera** | 11.6-23 | y | Full support |
| **Opera** | 15-23 | y x | Requires vendor prefix |
| **Opera** | 24+ | y | Full support |
| **Internet Explorer** | All versions | n | Not supported |
| **iOS Safari** | All versions | n | Not supported on touch devices |
| **Android Browser** | 4.4 and earlier | n | Not supported |
| **Android Browser** | 142+ | y | Full support |
| **Samsung Internet** | All versions | n | Not supported |
| **Opera Mobile** | 10-12.1 | n | Not supported |
| **Opera Mobile** | 80+ | y | Full support |

### Mobile Device Support

- **iOS Safari:** Not supported (no cursor support on touch devices)
- **Android:** Limited support
  - Android Browser 142+: Supported
  - Android Chrome 142+: Supported
  - Android Firefox 144: Not supported
  - Samsung Internet: Not supported

### Desktop Browser Support Summary

#### Fully Supported (No Prefix Required)

- Chrome 37+
- Firefox 24+
- Safari 9+
- Edge 12+ (all versions)
- Opera 24+ (modern versions)
- Chromium-based browsers (recent versions)

#### Vendor Prefix Required

- Chrome 4-36
- Firefox 2-23
- Safari 3.1-8
- Opera 15-23
- Blackberry 7, 10

#### Not Supported

- Internet Explorer (all versions)
- iOS Safari (all versions)
- Opera Mini (all versions)
- Older mobile browsers

## Implementation Notes

### Prefix Requirements (Older Browsers)

For browsers that require vendor prefixes, use the following syntax:

```css
.zoomable {
  cursor: -webkit-zoom-in;  /* Safari, Chrome (older) */
  cursor: zoom-in;          /* Standard */
}

.zoomed {
  cursor: -moz-zoom-out;    /* Firefox (older) */
  cursor: zoom-out;         /* Standard */
}
```

### Fallback Strategies

Since some browsers don't support these cursor values, consider using fallback cursors:

```css
.zoomable {
  cursor: -webkit-zoom-in;
  cursor: zoom-in;
  cursor: pointer; /* Fallback for unsupported browsers */
}
```

### Touch Device Considerations

Since touch devices (iOS, older Android) don't support cursor properties, ensure your UI provides alternative visual feedback:

```css
@media (hover: hover) {
  /* Desktop with cursor support */
  .zoomable {
    cursor: zoom-in;
  }
}

@media (hover: none) {
  /* Touch devices without cursor support */
  .zoomable {
    background-color: rgba(0, 0, 255, 0.1); /* Visual feedback instead */
  }
}
```

### Practical Implementation Example

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .image-gallery {
    cursor: zoom-in;
    transition: transform 0.3s ease;
  }

  .image-gallery.zoomed {
    cursor: zoom-out;
    transform: scale(1.5);
  }
</style>
</head>
<body>
  <img class="image-gallery" src="photo.jpg" alt="Zoomable photo">

  <script>
    const img = document.querySelector('.image-gallery');
    img.addEventListener('click', function() {
      this.classList.toggle('zoomed');
    });
  </script>
</body>
</html>
```

## Global Usage Statistics

- **Usage with Support:** 81.71% of users have browsers that support this feature
- **Usage with Fallback:** 0% (No fallback version tracked)

## Related Resources

### Official Documentation

- [MDN Web Docs - CSS cursor property](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
- [W3C CSS UI Module Level 4](https://www.w3.org/TR/css-ui-4/#cursor)
- [CSS Tricks - Cursor Property](https://css-tricks.com/almanac/properties/c/cursor/)

### Related CSS Features

- `cursor` property (all values)
- `pointer-events` property
- `user-select` property
- `appearance` property

### Browser Compatibility References

- [MDN Browser Compatibility Table](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#browser_compatibility)
- [Can I Use - CSS Cursor Property](https://caniuse.com/css3-cursors)
- [W3C Browser Implementation Status](https://www.w3.org/TR/css-ui-4/#cursor)

## Recommendations

### When to Use

- **Do use** for genuinely zoomable interactive content
- **Do provide** visual feedback through cursor changes
- **Do test** on target devices to ensure proper fallback behavior
- **Do consider** keyboard alternatives for accessibility

### When to Avoid

- **Don't use** on non-interactive elements (avoid user confusion)
- **Don't rely solely** on cursor changes for mobile interfaces
- **Don't forget** that IE and iOS Safari don't support it
- **Don't use** as the only indicator of interactivity

## Browser-Specific Notes

### Internet Explorer

No support for `zoom-in` or `zoom-out` cursor values. Users on IE will see the default cursor instead. This should not significantly impact user experience as IE usage is minimal in modern web development.

### Firefox Older Versions

Firefox versions 2-23 required the `-moz-` vendor prefix. Since Firefox 24, the standard `zoom-in` and `zoom-out` values are fully supported without prefixes.

### Safari

Safari on desktop (version 9+) fully supports `zoom-in` and `zoom-out` without prefixes. However, iOS Safari does not support cursor properties at all since touch interfaces don't use traditional cursors.

### Mobile Browsers

Mobile browsers generally don't support cursor properties as they lack pointer devices. Exception: Android Browser 142+ and Opera Mobile 80+ now support these values.

## Change History

- **Latest Update:** Widely supported across modern browsers
- **Stable Since:** Chrome 37 (2014), Firefox 24 (2013)
- **W3C Status:** Recommendation (stable specification)

## Keywords

cursor, zoom-in, zoom-out, pointers, CSS3, UI interactions, user experience

---

**Documentation Version:** 1.0
**Last Updated:** 2024
**Source Data:** Can I Use Database
