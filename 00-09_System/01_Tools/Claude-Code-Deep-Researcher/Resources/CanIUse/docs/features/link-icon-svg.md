# SVG Favicons

## Overview

SVG favicons provide an icon used by browsers to identify a webpage or site. While all browsers support the `.ico` format, the SVG format can be preferable to more easily support higher resolutions or larger icons, offering better scalability and smaller file sizes compared to traditional formats.

## Description

SVG favicons leverage the scalable vector graphics format for website icons displayed in browser tabs, bookmarks, and address bars. This approach allows designers to create icons that scale perfectly to any size without quality loss, making them ideal for modern web applications supporting a wide range of devices and screen densities.

## Specification Status

**Status:** Living Standard (ls)

**Specification URL:** [HTML Standard - rel-icon](https://html.spec.whatwg.org/multipage/semantics.html#rel-icon)

## Categories

- HTML5
- SVG

## Benefits and Use Cases

### Key Benefits

- **Resolution Independence**: SVG icons scale perfectly from tiny 16×16px icons to large high-resolution displays
- **Smaller File Sizes**: Vector format typically results in smaller file sizes compared to raster alternatives
- **Simplified Asset Management**: Single icon file instead of multiple sizes (.ico, .png, .gif variants)
- **Future-Proof**: SVG format continues to evolve with web standards
- **Styling Flexibility**: SVG elements can potentially be styled with CSS in supported browsers

### Ideal Use Cases

- Modern web applications prioritizing performance and scalability
- Projects supporting diverse device sizes (mobile, tablet, desktop)
- High-DPI displays and retina screens
- Responsive design implementations
- Progressive enhancement scenarios

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| y | Full support |
| a | Partial support |
| n | No support |
| #N | See note N |

### Desktop Browsers

| Browser | First Support | Version | Status | Notes |
|---------|---|---|---|---|
| Chrome | 80+ | All current | y | #3, #4 |
| Edge | 80+ | All current | y | #3, #4 |
| Firefox | 41+ | All current | y | #3 |
| Firefox | 4-40 | Earlier versions | a | #2 |
| Opera | 67+ | All current | y | #3, #4 |
| Opera | 44-53 | Earlier versions | y | No notes |
| Safari | 26.0+ | All current | y | Full support |

### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---|---|---|
| iOS Safari | 26.0+ | y | Full support |
| Android Chrome | 142+ | y | #3, #4 |
| Android Firefox | 144 | n | No support |
| Samsung Internet | 13.0+ | y | #3, #4 |
| Opera Mobile | 80+ | y | #3, #4 |
| KaiOS | 2.5+ | y | #3 |

### Unsupported Browsers

The following browsers do not support SVG favicons:

- Internet Explorer (all versions: 5.5-11)
- Opera Mini (all versions)
- Android Browser (all tested versions)
- BlackBerry Browser (all versions)
- UC Browser (15.5)
- QQ Browser (14.9)
- Android Firefox (144)

## Support Notes

### Note #1: No Favicon Support
Does not use favicons at all (but may have alternative for bookmarks, etc.).

### Note #2: Partial Support in Firefox
Partial support in Firefox before version 41 refers to only loading the SVG favicon the first time, but not [on subsequent loads](https://bugzilla.mozilla.org/show_bug.cgi?id=366324#c14).

### Note #3: MIME Type Requirement
Requires the served mime-type to be `image/svg+xml`.

**Important:** Ensure your web server is configured to serve SVG files with the correct MIME type. In Apache, you can add this to your `.htaccess` file:

```apache
AddType image/svg+xml svg svgz
```

For Nginx, add to your server configuration:

```nginx
types {
    image/svg+xml svg svgz;
}
```

### Note #4: SMIL Animation Handling
Chromium browsers serve the SVG in [secure static mode](https://svgwg.org/svg2-draft/conform.html#secure-static-mode), but apply SMIL animations using the document start time (0).

**Consideration:** While SMIL animations technically work in Chromium-based browsers, they start at time 0 and may not function as expected. For animated favicons, consider using CSS animations instead.

## Implementation Guide

### Basic HTML Usage

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

### Fallback for Older Browsers

Include a fallback to PNG or ICO format for broader compatibility:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### Complete Favicon Setup Example

```html
<!-- SVG Favicon (modern browsers) -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<!-- PNG Fallback (for older browsers) -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon for iOS -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Manifest for Android -->
<link rel="manifest" href="/site.webmanifest">
```

## Usage Statistics

- **Full Support (y):** 82.27% of global browser usage
- **Partial Support (a):** 0.06% of global browser usage
- **No Support (n):** Remaining percentage

## Related Features

- [PNG Favicons](/link-icon-png) - PNG format alternative to SVG

## References and Further Reading

### Bug Reports and Tracking

- [Chrome Bug Tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=294179) - Chromium implementation tracking
- [Firefox Bug Report](https://bugzilla.mozilla.org/show_bug.cgi?id=366324#c50) - Firefox implementation with notes on partial support history
- [WebKit Feature Request](https://bugs.webkit.org/show_bug.cgi?id=136059) - Safari/WebKit implementation status

### Standards and Positions

- [WebKit Standards Position 2024: Support](https://github.com/WebKit/standards-positions/issues/367) - Official WebKit position on SVG favicon support

### Educational Resources

- [How to favicon in 2021](https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7) - Comprehensive guide to favicon implementation in modern web development

## Additional Notes

Favicon support is a complicated topic with many historical quirks and edge cases across different browsers and platforms. The linked guide [How to favicon in 2021](https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7) provides extensive practical advice for implementing favicons comprehensively across modern browsers.

**Key Considerations:**

1. Ensure your web server sends the correct `image/svg+xml` MIME type for SVG files
2. Test favicon rendering across different browsers and devices
3. Provide fallback formats (PNG, ICO) for maximum compatibility
4. Consider iOS and Android-specific favicon requirements
5. SMIL animations may not work as expected in all browsers; prefer CSS animations if animation is needed

## Summary

SVG favicons represent a modern approach to website branding, offering scalability and efficiency advantages over traditional bitmap formats. With 82%+ global support across modern browsers, they are suitable for contemporary web projects. Always provide fallback formats for users on older browsers, and ensure proper MIME type configuration on your server.

---

**Last Updated:** December 13, 2025
**Data Source:** CanIUse Database
**Chrome ID:** 5180316371124224
