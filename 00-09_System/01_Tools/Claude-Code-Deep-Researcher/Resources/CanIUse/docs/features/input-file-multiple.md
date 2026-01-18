# Multiple File Selection in File Input

## Overview

Multiple file selection allows users to select multiple files at once in the HTML file picker. This is a foundational HTML5 feature that enhances file upload functionality by enabling batch operations and reducing the number of interactions required for file uploads.

## Description

The `multiple` attribute on `<input type="file">` elements allows users to select more than one file from their file system in a single file picker dialog, rather than being limited to selecting a single file at a time.

### Basic Usage

```html
<input type="file" multiple>
```

### With Additional Attributes

```html
<input type="file" multiple accept=".jpg,.png,.pdf" name="documents">
```

## Specification

- **Official Specification**: [WHATWG HTML Standard - Input Multiple Attribute](https://html.spec.whatwg.org/multipage/forms.html#attr-input-multiple)
- **Specification Status**: Living Standard

## Categories

- **HTML5** - Core HTML5 form element feature

## Benefits & Use Cases

### Key Benefits
- **Improved User Experience**: Users can select multiple files without repeated picker interactions
- **Batch Processing**: Enables batch uploads and document management scenarios
- **Workflow Efficiency**: Reduces friction in file management workflows
- **Standard Compliance**: Part of the HTML5 standard form API

### Common Use Cases
- Document management systems (uploading multiple PDFs or reports)
- Photo gallery uploads (selecting multiple images at once)
- File repository interfaces (batch file uploads)
- Media asset management tools
- Multi-document form submissions

## Browser Support

### Overall Support Coverage
- **Full Support**: 48.62% of users
- **Partial Support**: 43.92% of users
- **Total Coverage**: ~92.54% of tracked user base

### Support by Browser

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 5+ | ✅ Fully Supported | All versions from Chrome 5 onwards |
| **Firefox** | 3.6+ | ✅ Fully Supported | Support since Firefox 3.6 |
| **Safari** | 4+ | ✅ Fully Supported | Support since Safari 4 |
| **Edge** | 12+ | ✅ Fully Supported | All versions fully supported |
| **Opera** | 10.6+ | ✅ Fully Supported | Support since Opera 10.6 |
| **Internet Explorer** | 10+ | ✅ Supported | IE 10 and 11 only; IE 9 and below not supported |

### Mobile Browser Support

| Platform | Browser | Status | Details |
|----------|---------|--------|---------|
| **iOS** | Safari | ✅ Fully Supported | Support from iOS Safari 6.0-6.1+ |
| **Android** | Chrome | ⚠️ Partial Support | Works in Android 5.0+; limited in Android 4.x and below |
| **Android** | Firefox | ✅ Fully Supported | Android Firefox 144+ supported |
| **Android** | UC Browser | ❌ Not Supported | Version 15.5 not supported |
| **BlackBerry** | Native Browser | ❌ Not Supported | Version 7 and 10 not supported |
| **Opera Mobile** | Opera | ✅ Mostly Supported | Supported from Opera Mobile 80+ |
| **Opera Mini** | Opera Mini | ❌ Not Supported | All versions not supported |
| **KaiOS** | KaiOS Browser | ✅ Supported | Support from KaiOS 3.0-3.1+ |
| **Samsung Internet** | Samsung Browser | ⚠️ Partial Support | Marked as partial support (version 5.0+) |

### Known Issues & Limitations

#### Android Platform Limitations
- **Android 4.x and Below**: Not supported - appears to be an OS-level limitation
- **Android 5.x**: Only working reliably with Chrome browser
- See: [Chrome Bug Report for Android](https://code.google.com/p/chromium/issues/detail?id=348912)

#### Browser-Specific Notes
- **Internet Explorer**: Only IE 10 and 11 support this feature
- **Samsung Internet**: Shows partial support across multiple versions (5.0-29.0)
- **Opera Mini**: No support across any version

## Detailed Version History

### Desktop Browsers

**Internet Explorer**:
- Not supported: Versions 5.5 - 9
- Supported: IE 10, 11

**Firefox**:
- First support: Version 3.6
- Full support from 3.6 onwards

**Chrome**:
- First support: Version 5
- Full support from version 5 onwards

**Safari**:
- First support: Version 4
- Full support from version 4 onwards

**Opera**:
- First support: Version 10.6
- Versions 9 through 10.5: Not supported
- Full support from 10.6 onwards

### Mobile Browsers

**iOS Safari**:
- Not supported: Versions 3.2 - 5.1
- Supported: iOS Safari 6.0-6.1+
- Modern versions (16.0+): Full support

**Android**:
- Limited/no support across Android 2.1 - 4.4.4
- Partial support noted with # 1 flag

**Samsung Internet**:
- Partial support (marked with # 1): Versions 5.0-29.0

## Related Resources

### Articles & References
- [Raymond Camden: Working with HTML5's Multiple File Upload Support](https://www.raymondcamden.com/2012/02/28/Working-with-HTML5s-multiple-file-upload-support)

### Bug Reports
- [Chrome Bug Report for Android](https://code.google.com/p/chromium/issues/detail?id=348912) - Documents Android support limitations

## Notes

### Important Implementation Notes

1. **File Selection Mechanism**: The `multiple` attribute uses the native operating system file picker to allow simultaneous selection of multiple files.

2. **Array-Like Access**: When accessed via JavaScript, the `FileList` object from a multiple file input acts like an array but is not a true array:
   ```javascript
   const input = document.querySelector('input[type="file"]');
   const files = input.files; // FileList object

   for (let i = 0; i < files.length; i++) {
     console.log(files[i].name);
   }
   ```

3. **Android Limitations**: The main limitation is on Android devices running Android 4.x and below, where the feature appears to be restricted at the OS level. This has been an issue in Chrome and other browsers on Android.

4. **Fallback Strategy**: For applications requiring broad compatibility with older devices, consider:
   - Progressive enhancement patterns
   - Server-side validation and file handling
   - Clear user messaging about file selection

5. **Accepted File Types**: Combine with the `accept` attribute to restrict file types:
   ```html
   <input type="file" multiple accept="image/*,.pdf">
   ```

## Browser Compatibility Matrix Summary

| Support Level | Coverage |
|---------------|----------|
| ✅ Full Support | ~48.62% |
| ⚠️ Partial Support | ~43.92% |
| ❌ No Support | ~7.46% |

## Recommended Usage

The `multiple` file input attribute is **safe to use in modern web applications**. Given nearly 92.54% coverage across the tracked user base and nearly universal support in modern browsers (Chrome, Firefox, Safari, Edge), this feature should be considered standard practice for file upload interfaces.

### When to Use
- Any modern web application requiring file uploads
- Document management systems
- Media upload interfaces
- File collaboration tools

### When to Provide Fallbacks
- Applications supporting Internet Explorer 9 or older
- Applications targeting Android 4.x devices specifically
- Opera Mini users (though this is a negligible audience)

---

**Last Updated**: Based on CanIUse data
**Specification Status**: Living Standard (WHATWG HTML)
