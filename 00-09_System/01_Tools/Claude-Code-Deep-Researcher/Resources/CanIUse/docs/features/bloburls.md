# Blob URLs

## Description

Blob URLs (also known as Object URLs) provide a method of creating URL handles to specified File or Blob objects. This feature enables developers to generate locally-scoped pseudo-URLs that reference data stored as binary large objects (Blobs) in the browser's memory, without needing to upload data to a server.

**Canonical Name:** `createObjectURL` / `revokeObjectURL`

---

## Specification

- **Status:** Working Draft (W3C)
- **Specification URL:** [W3C File API - Blob URLs](https://www.w3.org/TR/FileAPI/#url)
- **Category:** JavaScript API
- **Global Usage:** 93.6%

---

## Overview

The Blob URL API allows you to create a special URL reference to a Blob or File object using `URL.createObjectURL()`. This URL can be used in many contexts where regular URLs are accepted, such as image sources, audio/video elements, links for downloading, and more. When you're done with the URL, you can release the associated resources using `URL.revokeObjectURL()`.

### Key Methods

- **`URL.createObjectURL(blob)`** - Creates a special pseudo-URL string that refers to the Blob object
- **`URL.revokeObjectURL(url)`** - Releases the object reference and allows the browser to garbage collect the associated Blob

---

## Benefits & Use Cases

### 1. **Client-Side File Processing**
- Process images, documents, and files without uploading to a server
- Create thumbnail previews before upload
- Manipulate file data using Canvas or other APIs

### 2. **Download Generation**
- Create downloadable files dynamically (CSV, JSON, ZIP, etc.)
- Generate reports or documents on-the-fly
- No server-side processing required

### 3. **Media Streaming**
- Play audio/video from Blobs (e.g., from recordings, downloaded media)
- Stream user-generated content without uploading
- Create media elements dynamically

### 4. **Offline Functionality**
- Store and serve content from IndexedDB or local cache
- Create functional offline experiences
- Combine with Service Workers for advanced offline support

### 5. **Performance Optimization**
- Avoid server round-trips for temporary data
- Reduce latency for local operations
- Efficient memory usage for large files

### 6. **Data Visualization**
- Display charts, graphs, and diagrams generated client-side
- Render Canvas content as images
- Export visual content to files

---

## Browser Support

| Browser | First Version | Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 23 | ✅ Full Support | Partial support (vendor prefix required) in versions 8-22 |
| **Edge** | 12 | ✅ Full Support | Full support from version 15+ |
| **Firefox** | 4 | ✅ Full Support | Widely supported since early versions |
| **Safari** | 6.1 | ✅ Full Support | Partial support (vendor prefix) in version 6 |
| **Opera** | 15 | ✅ Full Support | Requires Chromium engine (Opera 15+) |
| **iOS Safari** | 6.0-6.1 | ✅ Full Support | Partial support initially, full from 7.0+ |
| **Android Browser** | 4.4 | ✅ Full Support | Partial support in versions 4.0-4.3 |
| **Samsung Internet** | 4.0 | ✅ Full Support |  |
| **IE/IE Mobile** | Not Supported | ❌ No Support | IE 10-11 with limitations (see notes) |
| **Opera Mini** | — | ❌ No Support |  |
| **Blackberry Browser** | 10 | ⚠️ Limited | Only Blackberry 10+ |
| **UC Browser** | 15.5 | ✅ Supported |  |

### Support Summary

- **Modern browsers:** Universally supported (≥95% of global usage)
- **Mobile browsers:** Well-supported across iOS, Android, and Samsung devices
- **Legacy browsers:** Not supported in IE 9 and earlier
- **Limitations:** IE 10-11 have significant limitations

---

## Implementation Example

### Basic Usage

```javascript
// Creating a blob and generating a URL
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
const url = URL.createObjectURL(blob);

// Use the URL
const link = document.createElement('a');
link.href = url;
link.download = 'file.txt';
link.click();

// Clean up resources
URL.revokeObjectURL(url);
```

### Image Preview

```javascript
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);

  const img = document.createElement('img');
  img.src = url;
  document.body.appendChild(img);

  // Revoke when done
  img.onload = () => URL.revokeObjectURL(url);
});
```

### Canvas to Image Download

```javascript
const canvas = document.getElementById('myCanvas');
const blob = await new Promise(resolve => {
  canvas.toBlob(resolve, 'image/png');
});

const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'canvas-image.png';
link.click();

URL.revokeObjectURL(url);
```

---

## Known Issues & Bugs

### 1. **Safari - Binary Data (application/octet-stream)**
**Severity:** High

Safari has a serious issue when handling blobs of type `application/octet-stream`. The blob may not be properly accessible or downloadable.

**Workaround:** Consider using alternative MIME types or encoding binary data as base64 data URIs instead.

**Reference:** [JSFiddle demonstration](https://jsfiddle.net/24FhL/)

---

### 2. **Chrome iOS / Samsung Internet - Cross-Tab Limitations**
**Severity:** Medium

Chrome on iOS and Samsung Internet have an issue when opening Blob URLs in a new tab or window. The blob URL may not load correctly in the new context.

**Workaround:** Keep the blob data in the original tab or use alternative methods for cross-tab communication.

**Reference:** [Stack Overflow discussion](https://stackoverflow.com/questions/24485077/how-to-open-blob-url-on-chrome-ios)

---

### 3. **Internet Explorer - Intermittent Image Loading Failures**
**Severity:** High

Internet Explorer intermittently fails to load images via blob URLs. This is particularly problematic for applications that rely on blob URLs for image display.

**Workaround:** Use data URLs instead, or implement a fallback mechanism. The PDF.js project switched to data URLs to avoid this issue.

**Reference:** [Mozilla PDF.js issue #3977](https://github.com/mozilla/pdf.js/issues/3977)

---

## Browser-Specific Notes

### Internet Explorer 10-11 (Limited Support)

Blob URLs created in IE 10-11 cannot be used as the source (`src`) attribute for object or iframe elements. This significantly limits their usefulness in IE.

**Flag:** Marked with `#1` indicator in support tables

---

### Chrome 8-22 (Vendor Prefix Required)

Early Chrome versions required the `-webkit-` prefix for blob URL support.

**Flag:** Marked with `x` indicator in support tables

---

### iOS Safari 6.0-6.1 (Vendor Prefix Required)

Initial iOS Safari support required vendor prefixing.

**Flag:** Marked with `x` indicator in support tables

---

## Related Technologies

### Related APIs
- **[FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)** - For reading file contents
- **[File API](https://www.w3.org/TR/FileAPI/)** - Core file handling specification
- **[Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)** - For rendering and exporting graphics
- **[Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)** - Alternative approach for embedding data in URLs
- **[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)** - For storing large binary data locally
- **[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)** - For offline functionality

### Related Features
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** - For retrieving data to turn into blobs
- **[FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)** - For working with file uploads
- **[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)** - For handling clipboard images and data

---

## Additional Resources

- **[MDN: URL.createObjectURL()](https://developer.mozilla.org/en/DOM/window.URL.createObjectURL)** - Comprehensive documentation
- **[W3C File API Specification](https://www.w3.org/TR/FileAPI/)** - Official standard
- **[Can I Use - Blob URLs](https://caniuse.com/bloburls)** - Live browser support data

---

## Best Practices

### Memory Management
Always call `URL.revokeObjectURL()` when you're finished with a blob URL to prevent memory leaks:

```javascript
const url = URL.createObjectURL(blob);
// Use the URL...
URL.revokeObjectURL(url); // Clean up
```

### Error Handling
Use try-catch blocks when creating blobs and URLs:

```javascript
try {
  const blob = new Blob(data, { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  // Use the URL...
} catch (error) {
  console.error('Failed to create blob URL:', error);
}
```

### Feature Detection
Check browser support before using blob URLs:

```javascript
if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
  // Blob URLs are supported
}
```

### MIME Type Considerations
Specify the correct MIME type to avoid issues, particularly with Safari:

```javascript
// Good: explicit MIME type
const blob = new Blob(['data'], { type: 'text/plain' });

// Avoid for Safari: generic binary type
// const blob = new Blob(['data'], { type: 'application/octet-stream' });
```

---

## Statistics

- **Global Usage:** 93.6%
- **Categories:** JavaScript API
- **Parent Feature:** [File API](https://caniuse.com/?search=fileapi)
- **Related Keywords:** `createObjectURL`, `revokeObjectURL`
- **Last Updated:** 2024

---

*Documentation generated from CanIUse feature data. Last updated: 2024*
