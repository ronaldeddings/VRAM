# HTML Download Attribute

## Overview

The **download attribute** is an HTML5 feature that enables developers to force the browser to download a linked resource instead of navigating to it. When applied to an anchor (`<a>`) element, this attribute transforms the link behavior from navigation to file download.

## Feature Details

### Official Specification

- **Specification**: [WHATWG HTML Standard - Downloading Resources](https://html.spec.whatwg.org/multipage/semantics.html#downloading-resources)
- **Status**: Living Standard (ls)
- **Category**: HTML5

### Description

The `download` attribute, when used on an anchor element, signifies that the browser should download the resource the anchor points to rather than navigate to it. This is particularly useful for:

- Triggering downloads of files that would normally be displayed in the browser (PDFs, images, etc.)
- Specifying a custom filename for the downloaded resource
- Improving user experience for file distribution workflows

### Syntax

```html
<a href="path/to/file.pdf" download>Download PDF</a>
<a href="path/to/file.zip" download="custom-filename.zip">Download Archive</a>
```

**Attribute Values:**
- **No value** (or empty): Browser determines filename from URL
- **With value**: Custom filename for the downloaded file

## Use Cases & Benefits

### Primary Use Cases

1. **Document Downloads**
   - PDFs, Word documents, and other office formats
   - Ensure documents download rather than opening in-browser preview

2. **Media File Distribution**
   - Audio files, videos, images
   - Bypass browser's default media player behavior

3. **Software Distribution**
   - Executable files, compressed archives (ZIP, TAR, etc.)
   - Installers and binary distributions

4. **Data Export**
   - CSV/JSON exports from web applications
   - Report generation and download

5. **Archive Distribution**
   - Multiple file collections packaged for download
   - Backup and data preservation

### Key Benefits

| Benefit | Description |
|---------|------------|
| **User Control** | Users explicitly choose to download rather than accidentally navigating |
| **Custom Filenames** | Specify meaningful names for downloaded files |
| **Improved UX** | Clear download intent without surprise navigation |
| **File Type Handling** | Forces download even for browser-renderable formats (PDF, images) |
| **Accessibility** | Semantic HTML approach superior to JavaScript workarounds |

## Browser Support

### Global Support Status

- **Global Usage**: 92.89% of users have browser support
- **Widely Supported**: Available in all modern browsers
- **Legacy Support**: Limited in older IE and early mobile browsers

### Desktop Browsers

| Browser | Version Range | Support |
|---------|---------------|---------|
| **Chrome** | 14+ | ✅ Full |
| **Firefox** | 20+ | ✅ Full |
| **Safari** | 10.1+ | ✅ Full |
| **Edge** | 13+ | ✅ Full |
| **Opera** | 15+ | ✅ Full |
| **Internet Explorer** | All versions | ❌ Not supported |

### Mobile Browsers

| Browser | Version Range | Support |
|---------|---------------|---------|
| **iOS Safari** | 10.3+ | ✅ Full |
| **Android Browser** | 4.4+ | ✅ Full |
| **Chrome Mobile** | 14+ | ✅ Full |
| **Firefox Mobile** | 20+ | ✅ Full |
| **Samsung Internet** | 4.0+ | ✅ Full |
| **Opera Mobile** | 80+ | ✅ Full |
| **Opera Mini** | All versions | ❌ Not supported |

### Support Timeline

**Desktop Support Adoption:**
- Chrome 14 (2012)
- Firefox 20 (2013)
- Edge 13 (2015)
- Safari 10.1 (2016)
- Opera 15 (2013)

**Mobile Support Adoption:**
- iOS Safari 10.3 (2017)
- Android 4.4 (2013)
- Samsung Internet 4.0 (2015)

## Implementation Notes

### Known Limitations & Bugs

#### Same-Origin Restriction

**Firefox** and **Chrome 65+** only support same-origin download links. Cross-origin downloads are blocked for security reasons.

```html
<!-- ✅ Works in all browsers -->
<a href="/files/document.pdf" download>Download</a>

<!-- ⚠️ May not work in Firefox/Chrome 65+ (cross-origin) -->
<a href="https://example.com/files/document.pdf" download>Download</a>
```

**Workaround**: Use server-side proxy or CORS headers to facilitate cross-origin downloads.

#### Edge Legacy Issue

Edge 13 crashes when attempting to download data URL links. Avoid using `data:` URLs with the download attribute in older Edge versions.

```html
<!-- ⚠️ Crashes in Edge 13 -->
<a href="data:text/plain,content" download>Download</a>
```

#### Filename Limitations

- Some browsers may sanitize or modify the specified filename
- Special characters may be removed or replaced
- Max filename length varies by operating system

### Best Practices

1. **Provide Meaningful Filenames**
   ```html
   <a href="/api/export/data" download="sales-report-2024.csv">
     Download Report
   </a>
   ```

2. **Explicit Link Text**
   - Use clear, descriptive link text indicating download action
   - Include file type when helpful

3. **File Type Considerations**
   - Use `download` for browser-renderable formats (PDF, images)
   - Omit for naturally downloadable formats (executables, archives)

4. **Security Considerations**
   - Validate file access and authentication server-side
   - Don't rely on client-side attribute for security
   - Use CORS headers appropriately for cross-origin downloads

5. **Fallback for Old Browsers**
   ```html
   <a href="/files/document.pdf" download
      onclick="if(!('download' in HTMLAnchorElement.prototype)) {
        window.location = this.href;
      }">
     Download PDF
   </a>
   ```

## Detailed Browser Support Table

### Desktop Browsers (Extended)

**Chrome / Edge (Chromium-based)**
```
Chrome:  14+     (Full support)
Edge:    13+     (Full support from 13, with data URL limitation in 13)
Opera:   15+     (Full support)
```

**Firefox**
```
Firefox: 20-148+ (Full support, same-origin restriction)
```

**Safari**
```
Safari:  10.1+   (Full support)
```

**Internet Explorer**
```
IE:      5.5-11  (Not supported)
```

### Mobile Browsers

**Safari iOS**
```
10.3+            (Full support)
```

**Android Browser**
```
4.4+             (Full support)
```

**Samsung Internet**
```
4.0+             (Full support)
```

**Other Mobile**
```
UC Browser:      15.5+   (Supported)
Opera Mobile:    80+     (Supported)
Opera Mini:      All     (Not supported)
Android UC:      15.5+   (Supported)
Baidu:          13.52+   (Supported)
QQ Browser:     14.9+    (Supported)
KaiOS:          2.5+     (Supported)
```

## Example Code

### Basic Download

```html
<!-- Simple download -->
<a href="document.pdf" download>Download PDF</a>
```

### Custom Filename

```html
<!-- Custom filename for downloaded file -->
<a href="document.pdf" download="my-document.pdf">
  Download My Document
</a>
```

### Multiple File Formats

```html
<div class="download-options">
  <a href="report.pdf" download="2024-report.pdf" class="btn btn-primary">
    Download as PDF
  </a>
  <a href="report.xlsx" download="2024-report.xlsx" class="btn btn-secondary">
    Download as Excel
  </a>
  <a href="report.csv" download="2024-report.csv" class="btn btn-secondary">
    Download as CSV
  </a>
</div>
```

### Progressive Enhancement

```html
<a href="data.json" download="data.json">
  Download Data
  <script>
    // Fallback for older browsers without download support
    if (!('download' in document.createElement('a'))) {
      console.log('Download attribute not supported');
      // Handle fallback logic
    }
  </script>
</a>
```

## Related Resources

### Official Documentation

- [MDN - HTML `<a>` Element - download attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download)

### Educational Articles

- [HTML5Rocks - Downloading Resources in HTML5](https://updates.html5rocks.com/2011/08/Downloading-resources-in-HTML5-a-download)

### Polyfills & Tools

- [IE11 Polyfill for Download Attribute](https://github.com/jelmerdemaat/dwnld-attr-polyfill)
  - Provides fallback support for Internet Explorer 11

## Compatibility Summary

| Category | Status | Details |
|----------|--------|---------|
| Modern Browsers | ✅ Fully Supported | All current versions of major browsers |
| Mobile Browsers | ✅ Mostly Supported | Support varies by OS and browser |
| Legacy Browsers | ❌ Not Supported | IE and very old mobile browsers |
| Recommended Usage | ✅ Safe | 92.89% global user coverage |
| Progressive Enhancement | ✅ Recommended | Include fallbacks for older users |

## Notes

- The download attribute is part of the living HTML specification and continues to be refined
- Same-origin policy restrictions improve security for cross-origin downloads
- Filenames should be URL-safe and free of special characters for maximum compatibility
- Consider user expectations when using the download attribute on links
- Test downloads across target browsers, particularly for cross-origin scenarios

---

**Last Updated**: 2024
**Data Source**: CanIUse.com
