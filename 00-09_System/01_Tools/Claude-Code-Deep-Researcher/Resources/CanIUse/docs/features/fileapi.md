# File API

## Overview

The File API provides a method for web applications to manipulate file objects client-side, as well as programmatically select them and access their data. This enables developers to create richer file handling experiences directly in the browser without requiring server-side uploads for basic file operations.

## Description

The File API allows JavaScript to interact with files selected by users through HTML file input elements or drag-and-drop operations. It provides access to file information and data, enabling features like file validation, preview generation, client-side processing, and more before uploading to a server.

## Specification

- **Status**: Working Draft (WD)
- **Specification**: [W3C File API](https://www.w3.org/TR/FileAPI/)
- **Latest Version**: Active development with ongoing standardization

## Category

- **JavaScript API**

## Use Cases and Benefits

The File API enables developers to:

- **File Validation**: Check file size, type, and properties before upload
- **File Preview**: Generate previews (thumbnails, text content) before uploading
- **Client-side Processing**: Read and manipulate file contents in the browser
- **Drag & Drop**: Handle files dropped from the user's file system
- **Progress Monitoring**: Track file processing and upload progress
- **Batch Operations**: Handle multiple files simultaneously
- **Data Extraction**: Read file contents as text, binary data, or data URLs
- **File Manipulation**: Process files before sending to the server (compression, conversion, etc.)

### Common Applications

- Image upload with thumbnail preview
- Document preview before submission
- CSV/JSON data parsing in the browser
- Large file handling with chunked uploads
- Local file processing without server transfer
- Media file analysis and metadata extraction

## Browser Support

### Support Legend

- **y**: Supported
- **a**: Partial/Alternative support with limitations
- **n**: Not supported

### Desktop Browsers

| Browser | First Full Support | Latest Version Support |
|---------|-------------------|------------------------|
| **Chrome** | 38 | 146+ (all recent versions) |
| **Firefox** | 28 | 148+ (all recent versions) |
| **Safari** | 10 | 26.2+ (all recent versions) |
| **Edge** | 79 | 143+ (all recent versions) |
| **Opera** | 25 | 122+ (all recent versions) |
| **Internet Explorer** | 10* | 11* |

### Mobile Browsers

| Browser | Support Status |
|---------|---|
| **iOS Safari** | 10+ (full support) |
| **Android Chrome** | 142+ (full support) |
| **Android Firefox** | 144+ (full support) |
| **Samsung Internet** | 4+ (full support) |
| **Opera Mobile** | 80+ (full support) |
| **Android UC Browser** | 15.5+ (full support) |
| **Baidu Browser** | 13.52+ (full support) |
| **QQ Browser** | 14.9+ (full support) |
| **KaiOS** | 2.5+ (full support) |
| **Opera Mini** | Not supported |

### Historical Support Timeline

**Chrome**
- Partial support (with limitations): v6-37
- Full support: v38+

**Firefox**
- Partial support (with limitations): v3.6-27
- Full support: v28+

**Safari**
- Partial support (with limitations): v5.1-9
- Full support: v10+

**Edge**
- Partial support (with limitations): v12-18
- Full support: v79+

**Opera**
- Partial support (with limitations): v11.1-24
- Full support: v25+

**Internet Explorer**
- Partial support (with limitations): v10-11
- Full support: Not achieved

## Important Notes

### Limitations and Partial Support Issues

The following limitations apply to partial support ("a" status):

1. **#1 - FileReader Not Supported**: Some older browser versions do not have `FileReader` support, which is essential for reading file contents asynchronously
2. **#2 - File Constructor Not Supported**: Some versions do not support the `File` constructor, limiting the ability to programmatically create File objects

### Affected Browsers (Partial Support)

- Chrome 6-37
- Safari 5.1-9
- Firefox 3.6-27
- Opera 11.1-24
- iOS Safari 5.1-9
- Android 3-4.2
- Android 4.4
- BlackBerry 7 & 10
- IE 10-11
- IE Mobile 11
- Opera Mobile 11-12.1

### Deprecation Note

Internet Explorer and Opera Mini do not provide adequate File API support for production use.

## Global Support Statistics

- **Full Support Coverage**: 93.19% of users
- **Partial Support Coverage**: 0.41% of users
- **Total Support**: 93.6% of users

## Resources and Documentation

### Official Documentation
- [MDN Web Docs - Using Files from Web Applications](https://developer.mozilla.org/en/Using_files_from_web_applications)
- [WebPlatform Docs - File API](https://webplatform.github.io/docs/apis/file)

### Polyfills
- [Moxie - File API Polyfill](https://github.com/moxiecode/moxie)

## Implementation Recommendations

### For New Projects

Since File API has 93.19% global support and full support in all modern browsers, it's safe to use in production applications. However, consider the following:

1. **Target Audience**: Modern browsers cover the vast majority of users
2. **Polyfill Strategy**: Use Moxie or similar polyfills for older browser support if needed
3. **Feature Detection**: Always check for FileReader API support before using
4. **Fallback Handling**: Provide server-side file processing as a fallback

### Code Example (Basic Usage)

```javascript
// Check for File API support
if (typeof FileReader !== 'undefined') {
  const input = document.getElementById('file-input');

  input.addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (file) {
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);

      // Read file contents
      const reader = new FileReader();
      reader.onload = function(event) {
        const contents = event.target.result;
        console.log('File contents:', contents);
      };
      reader.readAsText(file);
    }
  });
}
```

## Migration Notes

If updating from older projects:

- Ensure your target browser list includes at least Chrome 38+, Firefox 28+, Safari 10+
- Test with actual target devices for mobile support
- Consider progressive enhancement for older browsers
- Use feature detection rather than browser detection

## Related APIs

- **FileReader**: Read file contents asynchronously
- **Blob API**: Handle binary data
- **FormData**: Attach files to HTTP requests
- **Fetch API**: Modern file upload alternative to XMLHttpRequest

## Changelog

| Date | Change |
|------|--------|
| 2013+ | Full support achieved in major browsers |
| 2012-2013 | Widespread adoption of full File API support |
| 2009-2012 | Partial implementations across browsers |
| 2008 | Initial File API specification drafts |

---

**Last Updated**: 2025
**Data Source**: CanIUse Database
**Specification Status**: Working Draft (WD)
