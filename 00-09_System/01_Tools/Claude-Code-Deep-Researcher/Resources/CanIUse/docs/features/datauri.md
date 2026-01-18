# Data URIs

## Overview

Data URIs provide a method of embedding images and other files directly into webpages as a string of text, generally using base64 encoding. This allows you to include external resources inline without requiring separate HTTP requests.

## Description

Data URIs (also known as data URLs) enable developers to encode binary data such as images, fonts, and other resources as Base64 text strings that can be embedded directly into HTML, CSS, or JavaScript. This approach eliminates the need for additional HTTP requests to retrieve these resources, potentially improving page load performance for small assets.

The data URI format follows the specification outlined in RFC 2397, allowing for flexible encoding of various MIME types and content.

## Specification Status

**Status:** Other (Non-standard, but widely implemented)
**Specification:** [RFC 2397](https://tools.ietf.org/html/rfc2397)

## Categories

- Other

## Benefits and Use Cases

Data URIs offer several advantages for web development:

### Performance Optimization
- Reduces the number of HTTP requests required to load a page
- Particularly beneficial for small images (icons, logos, small graphics)
- Eliminates additional round trips for referenced resources

### Development Convenience
- Allows inline embedding of resources without separate file management
- Useful for generating dynamic images or icons programmatically
- Simplifies distribution of self-contained HTML documents

### Common Applications
- Embedding small PNG, GIF, or JPEG images in HTML or CSS
- Encoding icon fonts and web fonts
- Embedding SVG graphics inline
- CSS background images for UI elements
- Dynamic image generation via JavaScript canvas

### Limitations and Considerations
- Size constraints due to browser limitations
- Increased HTML/CSS file size if used extensively
- Not ideal for large binary files
- Can impact cacheability of stylesheets
- May reduce readability of source code

## Browser Support

Data URI support is nearly universal across modern browsers, with some limitations in older Internet Explorer versions and partial support for certain edge cases.

### Support Legend

- **y** = Fully supported
- **a** = Partially supported (with limitations noted below)
- **n** = Not supported

### Desktop Browsers

| Browser | Supported Versions | Status |
|---------|-------------------|--------|
| **Internet Explorer** | IE 8+ | IE 8-10: Partial (images/CSS only, 32KB max) |
| | | IE 11: Partial (images/CSS, 4GB max) |
| **Edge** | 12-18 | Partial (images/CSS/JS, 4GB max) |
| | 79+ | Fully Supported |
| **Firefox** | 2+ | Fully Supported |
| **Chrome** | 4+ | Fully Supported |
| **Safari** | 3.1+ | Fully Supported |
| **Opera** | 9+ | Fully Supported |

### Mobile Browsers

| Browser | Supported Versions | Status |
|---------|-------------------|--------|
| **iOS Safari** | 3.2+ | Fully Supported |
| **Android Browser** | 2.1+ | Fully Supported |
| **Chrome Mobile** | Latest | Fully Supported |
| **Firefox Mobile** | Latest | Fully Supported |
| **Opera Mobile** | 10+ | Fully Supported |
| **Samsung Internet** | 4+ | Fully Supported |
| **Opera Mini** | All versions | Fully Supported |

### Global Usage Statistics

- **Full Support (y):** 93.31% of users
- **Partial Support (a):** 0.42% of users
- **No Support (n):** 6.27% of users

## Important Notes and Limitations

### Note #1: Legacy IE Support (IE 8)
Support in IE 8 is limited to images and linked resources like CSS files, not HTML or JavaScript files. The maximum URI length is restricted to 32KB.

### Note #2: Legacy Browser Support (IE 9-11, Edge 12-18)
Support is limited to images and linked resources like CSS or JavaScript files, but not HTML files. The maximum size limit is 4GB.

### Note #3: SVG XML Declaration Issue (Edge 18)
SVGs with XML declarations are not displayed when used in data URLs. Additionally, Edge 18 requires encoding of special characters: `'`, `^`, `` ` ``, `|`, and ASCII `x7F`.

### URI Encoding Considerations
Non-base64-encoded SVG data URIs need to be URI-encoded to work properly in IE, Edge, and Firefox < 4 according to the specification. This is particularly important when embedding SVG content directly.

## Example Usage

### Base64 Encoded PNG Image
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." alt="Example" />
```

### Inline SVG
```html
<img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%2F%3E%3C%2Fsvg%3E" alt="Circle" />
```

### CSS Background Image
```css
.icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
}
```

### JavaScript Usage
```javascript
const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...';
const img = new Image();
img.src = imageData;
document.body.appendChild(img);
```

## Recommendations

### When to Use Data URIs
- Small images under 10KB (especially icons and logos)
- UI elements that are frequently used
- Resources that don't require separate caching
- Self-contained documents without external dependencies

### When to Avoid Data URIs
- Large images that benefit from browser caching
- Resources that need to be updated independently
- Performance-critical stylesheets (increases their size)
- When users need to cache resources separately

## Related Resources

- [CSS-Tricks: Data URIs](https://css-tricks.com/data-uris/) - Comprehensive information page
- [Wikipedia: Data URI Scheme](https://en.wikipedia.org/wiki/data_URI_scheme) - Background and technical details
- [Website Optimization: Data URL Converter](https://www.websiteoptimization.com/speed/tweak/inline-images/) - Tools and utilities
- [Security Considerations](https://klevjers.com/papers/phishing.pdf) - Information on potential security issues

## Security Considerations

While data URIs are widely supported and useful, developers should be aware of potential security implications:

- Data URIs can be used in phishing attacks by embedding content inline
- Avoid exposing sensitive information in data URIs as they cannot be easily cached or removed
- Be cautious with user-generated content embedded as data URIs
- Review security best practices when implementing data URI solutions

---

**Last Updated:** 2025
**Can I Use Feature ID:** datauri
**Keywords:** data url, datauris, data uri, dataurl, dataurls, base64
