# CSS3 image-orientation

## Overview

The `image-orientation` CSS property is used to fix the intended orientation of an image. This property allows developers to rotate images using 90-degree increments or automatically based on the image's EXIF data using the "from-image" value.

## Description

This CSS property provides a standardized way to control image orientation without requiring image manipulation or JavaScript. It supports both:
- **Fixed rotation values**: 90deg, 180deg, 270deg, 0deg increments
- **EXIF-based orientation**: Using the `from-image` keyword to automatically respect embedded orientation metadata

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification URL**: [W3C CSS Images Module Level 3 - image-orientation](https://www.w3.org/TR/css-images-3/#the-image-orientation)

## Categories

- CSS3

## Benefits and Use Cases

### Common Use Cases

1. **EXIF Data Handling**: Automatically correct image orientation based on embedded EXIF metadata from mobile device cameras
2. **Mobile Photography**: Fix images taken in portrait mode on mobile devices without server-side processing
3. **Image Galleries**: Display user-uploaded images in correct orientation without file conversion
4. **Responsive Design**: Apply rotation that adjusts with responsive layouts
5. **Reduce Processing**: Eliminate need for image server-side rotation, saving bandwidth and processing time
6. **SEO Benefits**: Serve original images with correct orientation without duplicating assets

### Performance Benefits

- No need for server-side image processing
- Reduced bandwidth consumption by avoiding duplicate rotated image files
- CSS-only solution with no JavaScript overhead
- Maintains original image metadata

## Browser Support

### Support Summary by Browser

| Browser | First Full Support | Latest Versions |
|---------|-------------------|-----------------|
| Chrome | 89 | ✅ Fully Supported (v146+) |
| Firefox | 26 | ✅ Fully Supported (v148+) |
| Safari | 13.1 | ✅ Fully Supported (18.5+) |
| Edge | 89 | ✅ Fully Supported (v143+) |
| Opera | 77 | ✅ Fully Supported (v122+) |
| Mobile Safari (iOS) | 13.4 | ✅ Fully Supported (18.5+) |

### Detailed Browser Version Support

#### Desktop Browsers

**Chrome**
- ✅ Full support from version 89+
- Versions 81-88: Partial support with known bug (#2)

**Firefox**
- ✅ Full support from version 26+
- Longest-standing support among all browsers

**Safari**
- ✅ Full support from version 13.1+
- Earlier versions (≤13): Not supported

**Edge**
- ✅ Full support from version 89+
- Versions 81-88: Partial support with known bug (#2)

**Opera**
- ✅ Full support from version 77+
- Versions 68-76: Partial support with known bug (#2)

#### Mobile Browsers

**iOS Safari**
- ✅ Full support from version 13.4+
- Versions 3.2-13.3: Partial support (#1) - uses EXIF data by default but doesn't actually support the CSS property

**Android Chrome**
- ✅ Full support from version 142+

**Android Firefox**
- ✅ Full support from version 144+

**Samsung Internet**
- ✅ Full support from version 15.0+
- Versions 13.0-14.0: Partial support with known bug (#2)

**Opera Mobile**
- ✅ Full support from version 80+

#### Limited/No Support

- ❌ **Internet Explorer**: All versions (5.5-11) - Not supported
- ❌ **Opera Mini**: Not supported
- ❌ **UC Browser**: Limited support
- ❌ **BlackBerry**: Not supported
- ❌ **Android UC Browser**: Partial support (v15.5+)
- ❌ **QQ Browser**: Not supported

### Usage Statistics

- **Full Support Coverage**: 92.43% of users
- **Partial Support Coverage**: 0.33% of users

## Known Issues and Bugs

### Issue #1: iOS Partial Support for EXIF Data

**Affected Browsers**: iOS Safari 3.2-13.3

**Description**: Earlier versions of iOS Safari use EXIF orientation data by default, but they do not actually support the CSS `image-orientation` property. The browser's built-in behavior handles EXIF data, not the CSS property.

**Workaround**: For iOS 13.3 and earlier, rely on native EXIF handling or use JavaScript-based solutions.

---

### Issue #2: Bug in Chrome, Edge, Opera, and Samsung Internet

**Affected Browsers**:
- Chrome 81-88
- Edge 81-88
- Opera 68-76
- Samsung Internet 13.0-14.0

**Description**: There is a bug where the browser does not maintain the image's aspect ratio when both `object-fit: cover` and `image-orientation: from-image` are used together.

**Bug Report**: [Chromium Issue #1082669](https://bugs.chromium.org/p/chromium/issues/detail?id=1082669)

**Workaround**:
- Avoid using `image-orientation: from-image` with `object-fit: cover`
- Use alternative cropping methods or explicit dimensions
- Update to newer browser versions (Chrome 89+, Edge 89+, Opera 77+, Samsung 15.0+)

---

### Issue #3: Negative Values Don't Work in Firefox

**Affected Browsers**: Firefox (all versions with support)

**Description**: Negative rotation values do not work in Firefox, though they may work in other browsers.

**Workaround**: Use positive degree values instead. For example:
- Instead of `-90deg`, use `270deg`
- Instead of `-180deg`, use `180deg`

## Syntax and Examples

### Basic Usage

```css
/* Rotate 90 degrees clockwise */
img {
  image-orientation: 90deg;
}

/* Rotate 180 degrees */
img {
  image-orientation: 180deg;
}

/* Use EXIF orientation data */
img {
  image-orientation: from-image;
}

/* Default - no rotation */
img {
  image-orientation: 0deg;
}
```

### Common Pattern: Mobile Photo Gallery

```css
/* Auto-correct mobile photo orientation */
.photo-gallery img {
  image-orientation: from-image;
  max-width: 100%;
  height: auto;
}
```

### Combined with object-fit (Note: Avoid certain combinations)

```css
/* This combination has a known bug in some browsers */
img {
  image-orientation: from-image;
  object-fit: contain;  /* Use instead of 'cover' */
  width: 100%;
  height: auto;
}
```

## Related Features and Links

### Official Documentation
- [MDN Web Docs - CSS image-orientation](https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation)

### Bug Reports and Discussion
- [Chromium Issue #158753: Support for the CSS image-orientation CSS property](https://bugs.chromium.org/p/chromium/issues/detail?id=158753)
- [Chromium Issue #1082669: aspect ratio bug with object-fit](https://bugs.chromium.org/p/chromium/issues/detail?id=1082669)

### Blog Posts and Resources
- [Firefox 26 Release Blog - New CSS image-orientation Support](http://sethfowler.org/blog/2013/09/13/new-in-firefox-26-css-image-orientation/)

### Demos and Examples
- [JSBin Demo (Chinese)](https://jsbin.com/EXUTolo/4)

## Related CSS Properties

- [`object-fit`](https://caniuse.com/object-fit) - Controls how images are fitted to their container
- [`object-position`](https://caniuse.com/object-position) - Determines the alignment of the replaced content
- [`transform: rotate()`](https://caniuse.com/css-transforms) - Alternative for rotating images (but affects layout flow)

## Implementation Notes

### When to Use image-orientation

✅ **Good use cases:**
- Correcting EXIF orientation from mobile device photos
- Rotating images in CSS without layout side effects
- Creating responsive image galleries
- Displaying user-uploaded images without server processing

❌ **Poor use cases:**
- Creating layout-affecting rotations (use `transform: rotate()` instead)
- Rotating text or UI elements
- Decorative rotations (consider CSS transforms)

### Fallback Strategies

For browsers without support (primarily older IE versions), consider:
1. Server-side image rotation
2. JavaScript-based solutions
3. Pre-rotated image assets
4. CSS transforms as an alternative (note: affects layout flow)

### Performance Considerations

- `image-orientation` is hardware-accelerated in modern browsers
- Preferable to JavaScript rotation for performance
- No impact on image file size or bandwidth
- Better than serving multiple rotated asset versions

## Adoption and Future

The `image-orientation` property has reached good browser support levels (>92% coverage). Most modern browsers support it well, though there are some edge cases with specific browser versions and combinations with other CSS properties.

The property is particularly valuable for:
- PWAs handling user-generated content
- Photo-centric web applications
- Responsive image galleries
- Mobile-first web applications

As older browsers (IE, early Safari) fade from usage, adoption will increase further.
