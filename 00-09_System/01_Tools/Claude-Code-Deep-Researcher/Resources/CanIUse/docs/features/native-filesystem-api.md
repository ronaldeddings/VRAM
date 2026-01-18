# File System Access API

## Overview

The **File System Access API** provides web applications with the ability to read, write, and manage files and folders on the device's local file system with explicit user permission. Unlike sandboxed file access, this API grants direct access to the user's file system outside of the browser's sandbox environment.

## Description

This API enables developers to create web applications that can:
- Open and read files from the user's device
- Save and modify files directly on the file system
- Create and manage directories
- Access file metadata
- Work with files in a more native, desktop-like manner

The API requires explicit user permission through file picker dialogs, ensuring security and user privacy.

## Specification Status

**Status:** Unofficial / Community Group Draft
**Specification URL:** https://wicg.github.io/file-system-access/
**Standards Body:** Web Incubator Community Group (WICG)

The API is currently in development and refinement. While no longer in experimental stages in supporting browsers, it remains unofficial as a W3C standard.

## Categories

- JavaScript API

## Key Features & Use Cases

### Benefits

- **Native Desktop Experience:** Create web applications that feel like native desktop applications with full file system access
- **Improved Productivity:** Enable professional workflows where users can work with their existing file organization
- **Better Integration:** Allow web apps to work seamlessly with other applications and workflows
- **User Control:** File picker interfaces ensure users explicitly grant access to specific files or directories
- **Performance:** Direct file access eliminates the need for round-trip uploads/downloads for some workflows

### Use Cases

- **Code Editors:** IDEs and text editors that work with project files directly
- **Image & Media Editors:** Creative applications that save directly to user's file system
- **File Managers:** Enhanced file management utilities with web-based interfaces
- **Development Tools:** Build tools, compilers, and other developer utilities
- **Document Applications:** Office-like applications (word processors, spreadsheets)
- **Data Analysis Tools:** Applications that work with large datasets and need efficient file access

## Browser Support

### Support Legend
- **y** - Fully supported
- **a** - Supported with limitations (partial implementation)
- **n** - Not supported
- **d** - Disabled by default (requires flag/preference)

### Desktop Browsers

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 105 | 105+ | Full support from version 105 onwards |
| **Edge** | 105 | 105+ | Chromium-based; full support from version 105 |
| **Firefox** | Not supported | — | Marked as harmful by Mozilla standards position |
| **Safari** | Not supported | — | No implementation or timeline announced |
| **Opera** | 91 | 91+ | Chromium-based; support from version 91 onwards |
| **IE/IE Mobile** | Not supported | — | No support in any version |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | Not supported | No support in any version |
| **Android Chrome** | Not supported | Desktop-only API |
| **Android Firefox** | Not supported | No desktop or mobile support |
| **Opera Mini** | Not supported | — |
| **Samsung Internet** | Not supported | — |
| **UC Browser** | Not supported | — |
| **Android Stock Browser** | Not supported | — |

### Summary Statistics

- **Full Support:** ~33.88% of users (as of data collection)
- **Partial Support:** ~0.3% of users (implementations with limitations)
- **No Support:** ~65.82% of users

## Implementation Notes

### Partial Implementation (Note #2)

Parts of the API are still missing in some implementations. When using supporting browsers, verify that all required features are available:

- `FileSystemHandle` - Base interface for file and directory handles
- `FileSystemFileHandle` - Interface for file operations
- `FileSystemDirectoryHandle` - Interface for directory operations
- `window.showOpenFilePicker()` - Open file dialog
- `window.showSaveFilePicker()` - Save file dialog
- `window.showDirectoryPicker()` - Directory picker dialog

### Experimental Support (Chromium browsers)

In Chromium-based browsers (versions 74-85), the API can be enabled with the `#native-file-system-api` flag:

1. Navigate to `chrome://flags`
2. Search for "native-file-system-api"
3. Enable the flag
4. Restart the browser

## Security & Permissions

- **User Permission Required:** Users must explicitly grant access via file/directory picker dialogs
- **No Automatic Access:** Web pages cannot access the file system without user interaction
- **Sandboxed by Default:** Applications must request specific files or directories
- **Platform Security:** Respects operating system file permissions and access controls

## Browser Implementation Timeline

### Chrome/Chromium
- **v74-85:** Behind experimental flag (#native-file-system-api)
- **v86-104:** Available but with API differences (#2)
- **v105+:** Full standard implementation

### Edge (Chromium-based)
- **v79-85:** Behind experimental flag
- **v86-104:** Available with limitations (#2)
- **v105+:** Full support

### Opera (Chromium-based)
- **v62-90:** Behind experimental flag / partial support
- **v91+:** Full support

## Firefox Position

Mozilla's standards position on the File System Access API is listed as **"harmful"**. The primary concerns cited include:

- Security and privacy implications
- Potential for abuse and user exploitation
- Preference for more constrained alternatives

Firefox has no timeline for implementation.

## Polyfills & Alternatives

Since support is limited to Chromium-based browsers, consider these alternatives:

- **For file uploads/downloads:** Use the standard `<input type="file">` and download APIs
- **For directory access:** Use `webkitdirectory` attribute (limited support)
- **For IndexedDB:** Use the IndexedDB API for persistent client-side storage
- **For local storage:** Use localStorage or SessionStorage for smaller data
- **For cloud integration:** Use cloud storage APIs (Dropbox, Google Drive, OneDrive)

## Basic Usage Example

```javascript
// Open a file picker and read a file
async function readFile() {
  try {
    const fileHandles = await window.showOpenFilePicker();
    const file = await fileHandles[0].getFile();
    const contents = await file.text();
    console.log(contents);
  } catch (err) {
    console.error('File access failed:', err);
  }
}

// Save a file
async function saveFile(text) {
  try {
    const handle = await window.showSaveFilePicker({
      types: [{
        description: 'Text files',
        accept: { 'text/plain': ['.txt'] }
      }]
    });
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();
  } catch (err) {
    console.error('Save failed:', err);
  }
}

// Access a directory
async function readDirectory() {
  try {
    const dirHandle = await window.showDirectoryPicker();
    for await (const entry of dirHandle.values()) {
      console.log(entry.name, entry.kind);
    }
  } catch (err) {
    console.error('Directory access failed:', err);
  }
}
```

## Helpful Resources

- **WICG Explainer:** https://github.com/WICG/file-system-access/blob/master/EXPLAINER.md
  - Comprehensive overview and use case examples

- **Web.dev Guide:** https://web.dev/file-system-access/
  - Detailed tutorial and best practices

- **Chrome Blog Post:** https://developers.google.com/web/updates/2019/08/native-file-system
  - Introduction and feature announcement

- **Mozilla Standards Position:** https://mozilla.github.io/standards-positions/#file-system-access
  - Firefox's official position on the API

## Related APIs

- **HTML File Input:** `<input type="file">` for basic file uploads
- **Fetch API:** For downloading files
- **IndexedDB:** For client-side data persistence
- **Web Storage:** For smaller persistent data
- **Blob API:** For working with binary data

## Considerations for Developers

### Before Using This API

- **Caniuse Check:** Verify browser support is acceptable for your use case (Chromium only)
- **Progressive Enhancement:** Provide fallback mechanisms for unsupported browsers
- **User Education:** Inform users about the permissions being requested
- **Permission Handling:** Gracefully handle permission denials

### Testing

Test your implementation across:
- Chrome/Chromium (various versions)
- Edge (latest versions)
- Opera (latest versions)
- Unsupported browsers (for fallback behavior)

### Security Best Practices

- Validate file types and sizes
- Implement proper error handling
- Avoid storing sensitive file paths
- Respect file system permissions
- Clear sensitive data from memory after use

---

**Last Updated:** Based on CanIUse data
**API Status:** Emerging Standard (Unofficial)
