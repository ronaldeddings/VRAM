# Directory Selection from File Input

## Overview

The `webkitdirectory` attribute on the `<input type="file">` element allows entire directories with file contents (and any subdirectories) to be selected and processed by web applications.

## Description

Rather than selecting individual files, the `webkitdirectory` attribute enables users to select an entire directory through the system file picker. When a directory is selected, the browser provides access to all files and subdirectories contained within it, preserving the directory structure.

### Core Functionality

This feature is particularly useful for:
- Batch file uploads
- Directory scanning operations
- File tree processing
- Archive extraction workflows
- Bulk import operations

### Implementation Details

The `webkitdirectory` attribute works with the `<input type="file">` element and can be combined with the `multiple` attribute. Selected files are accessible via the `FileList` API, with additional path information available through the `webkitRelativePath` property.

#### Code Example

```html
<input type="file" webkitdirectory multiple />
```

## Specification Status

**Status:** Unofficial/Non-Standard
**Specification:** [WICG Entries API - webkitdirectory](https://wicg.github.io/entries-api/#dom-htmlinputelement-webkitdirectory)

This is a webkit-originated feature that has achieved widespread support across modern browsers, though it remains outside the official W3C specification standards.

## Categories

- **DOM** - Document Object Model
- **JS API** - JavaScript Application Programming Interface

## Use Cases & Benefits

### Primary Use Cases

1. **Bulk File Operations**
   - Upload entire project folders
   - Batch import operations
   - Directory synchronization

2. **Developer Tools**
   - IDE-like file selection
   - Build process automation
   - Project scaffolding tools

3. **Content Management**
   - Photo gallery uploads
   - Document library imports
   - Media organization tools

4. **Data Processing**
   - Log file collection
   - Configuration directory imports
   - Data migration workflows

### Benefits

- **User Convenience** - Select entire directories instead of individual files
- **Workflow Efficiency** - Reduce repetitive file selection tasks
- **Structural Preservation** - Maintains directory hierarchy for processing
- **Relative Path Access** - Access files with their original path relationships

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|:-------------:|:--------------:|-------|
| **Chrome** | 30 | ✅ Supported | Available since Chrome 30 (2013) |
| **Firefox** | 50 | ✅ Supported | Available since Firefox 50 (2016) |
| **Safari** | 11.1 | ✅ Supported | Available since Safari 11.1 (2018) |
| **Edge** | 14 | ✅ Supported | Available since Edge 14 (2016) |
| **Opera** | 17 | ✅ Supported | Available since Opera 17 (2013) |
| **Internet Explorer** | Never | ❌ Not Supported | No support in any IE version |

### Mobile Browsers

| Browser | Status | Notes |
|---------|:------:|-------|
| **Safari on iOS** | ⚠️ Limited | Support added in iOS 11.3 (Safari 11.1+) |
| **Chrome on Android** | ✅ Supported | Available since Android Chrome 142 |
| **Firefox on Android** | ✅ Supported | Available since Firefox 50+ |
| **Samsung Internet** | ❌ Not Supported | No support currently |
| **Opera Mobile** | ❌ Not Supported | No support available |
| **Opera Mini** | ❌ Not Supported | No support in any version |
| **UC Browser** | ❌ Not Supported | Limited feature support |
| **QQ Browser** | ✅ Supported | Support present in QQ Browser 14.9+ |

### Legacy Browsers

| Browser | Status |
|---------|:------:|
| **IE Mobile** | ❌ Not Supported |
| **Blackberry** | ❌ Not Supported |
| **Baidu** | ❌ Not Supported |
| **KaiOS** | ❌ Not Supported |

## Global Usage Statistics

- **Supported in 87.49%** of browsers worldwide (based on caniuse data)
- **Partial Support:** 0%
- **No Support:** 12.51%

## Implementation Notes

### Related Properties & Attributes

- `mozdirectory` - Firefox-specific alternative attribute name
- `webkitRelativePath` - Property providing file paths relative to the selected directory
- `FileList` API - Used to access selected files and their metadata
- `File` interface - Individual file objects from the selected directory

### Mobile Considerations

**Important:** The lack of support in many mobile browsers (particularly Samsung Internet) may be due to OS-level limitations where the file picker interface does not support directory selection functionality.

### Platform-Specific Notes

- **Windows/macOS/Linux** - Full directory selection support available
- **iOS** - Support available in Safari 11.1+ for standard file selection workflows
- **Android** - Support varies by browser; Chrome and Firefox provide full support
- **Samsung Devices** - Samsung Internet browser does not currently support this feature

## Accessing Selected Files

### JavaScript API Usage

```javascript
const input = document.querySelector('input[webkitdirectory]');

input.addEventListener('change', (event) => {
  const files = event.target.files;

  for (let file of files) {
    const relativePath = file.webkitRelativePath;
    // Process file with its directory path information
    console.log(`${relativePath}: ${file.size} bytes`);
  }
});
```

## Security Considerations

- Directory access is subject to standard web security restrictions
- Users must explicitly grant permission via the file picker dialog
- No automatic directory access without user interaction
- Same-origin policy applies to file handling

## Compatibility Notes

### Feature Detection

```javascript
const isSupported = document.createElement('input').webkitdirectory !== undefined;
```

### Fallback Strategy

For browsers without support, implement fallback mechanisms:
1. Detect support using feature detection
2. Fall back to single-file selection interface
3. Use the `multiple` attribute for multi-file selection
4. Implement manual directory upload workflows

## Related Resources

- [MDN Web Docs - webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)
- [WICG Entries API Specification](https://wicg.github.io/entries-api/#dom-htmlinputelement-webkitdirectory)
- [File and Directory Entries API](https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API)

## Summary

The `webkitdirectory` attribute provides robust support across modern browsers (87.49% global coverage), making it a reliable choice for applications requiring directory-based file selection. While primarily targeting desktop browsers, it offers excellent support in modern mobile Chrome and Firefox. The lack of support in older browsers and some mobile platforms can be addressed through feature detection and graceful fallback mechanisms.

---

**Last Updated:** December 2024
**Data Source:** CanIUse Browser Support Database
