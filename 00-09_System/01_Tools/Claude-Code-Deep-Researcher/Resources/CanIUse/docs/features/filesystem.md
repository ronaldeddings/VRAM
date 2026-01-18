# Filesystem & FileWriter API

## Overview

The Filesystem & FileWriter API provides a method for reading and writing files to a sandboxed file system from within web browsers. This API enables web applications to interact with the user's file system in a controlled and secure manner.

## Description

The Filesystem & FileWriter API allows developers to:

- Request access to a sandboxed file system
- Create, read, and write files within that sandbox
- Manage directories and file hierarchies
- Persist data locally on the user's device
- Provide offline functionality and data caching capabilities

This API provides methods of reading and writing files to a sandboxed file system, giving web applications capabilities similar to traditional desktop applications while maintaining security boundaries.

## Specification Status

**Status:** Unofficial (Not on W3C standards track)

**Specification URL:** [W3C File System API](https://www.w3.org/TR/file-system-api/)

### Important Note

The File API: Directories and System specification is no longer being maintained and support may be dropped in future versions. This specification has been superseded by newer approaches to file system access, and developers are encouraged to consider alternative solutions for future projects.

## Categories

- JavaScript API

## Use Cases & Benefits

### Ideal Use Cases

- **Offline Applications:** Build web apps that work seamlessly without internet connectivity
- **Data Persistence:** Store application data, cache files, and user-generated content locally
- **File Management:** Create tools for file organization, batch processing, and management
- **Media Applications:** Handle large media files, video editors, and audio processing tools
- **Development Tools:** Create IDE-like environments and code editors in the browser
- **Gaming:** Store game saves, assets, and persistent user data

### Key Benefits

- **Sandboxed Security:** Protected access to file system without exposing entire device
- **Offline Capability:** Enable applications to function without network connectivity
- **Performance:** Local data access is faster than network-based storage
- **User Control:** Users maintain control over which data is stored and accessed
- **Rich Applications:** Enable web apps to provide desktop-like experiences

## Browser Support

### Support Key

- **y x** — Supported with vendor prefix (e.g., `webkit`, `moz`)
- **a x** — Partial or experimental support with vendor prefix
- **n** — Not supported

### Desktop Browsers

| Browser | Support Status | First Version | Current Status |
|---------|---|---|---|
| **Chrome** | ✅ Full Support | 13.0+ | Supported with prefix |
| **Edge** | ✅ Full Support | 79.0+ | Supported with prefix |
| **Firefox** | ❌ Not Supported | All versions | No support |
| **Safari** | ❌ Not Supported | All versions | No support |
| **Opera** | ✅ Full Support | 15.0+ | Supported with prefix |
| **Internet Explorer** | ❌ Not Supported | All versions | No support |

### Mobile Browsers

| Browser | Support Status | First Version | Current Status |
|---------|---|---|---|
| **Chrome (Android)** | ✅ Full Support | 142+ | Supported with prefix |
| **Opera Mobile** | ✅ Full Support | 80+ | Supported with prefix |
| **Samsung Internet** | ✅ Full Support | 5.0+ | Supported with prefix |
| **UC Browser (Android)** | ✅ Full Support | 15.5+ | Supported with prefix |
| **Baidu Browser** | ✅ Full Support | 13.52+ | Supported with prefix |
| **Firefox (Mobile)** | ❌ Not Supported | All versions | No support |
| **Safari (iOS)** | ❌ Not Supported | All versions | No support |
| **Opera Mini** | ❌ Not Supported | All versions | No support |
| **Android Browser** | ❌ Not Supported | All versions | No support |
| **BlackBerry** | ⚠️ Partial Support | 10+ | Supported with prefix |

### Global Usage

- **Supported (with prefix):** 79.71% of users
- **Partial Support:** 0%
- **Not Supported:** 20.29% of users

## Implementation Notes

### Vendor Prefixes

Due to the non-standard nature of this API, implementations require vendor-specific prefixes:

- **WebKit-based:** `webkit` prefix
- **Google Chrome:** Uses WebKit implementation
- **Microsoft Edge:** Uses Chromium/WebKit implementation

### Typical Usage Pattern

```javascript
// Requires vendor prefix support
const requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

if (requestFileSystem) {
  requestFileSystem(window.TEMPORARY, 1024 * 1024, onFileSystemSuccess, onFileSystemError);
}
```

### Quota Types

- **TEMPORARY:** Storage that can be cleared by the browser
- **PERSISTENT:** Storage that persists but may require user permission

### Important Considerations

1. **Deprecation Risk:** This API is no longer maintained by W3C and may be deprecated in future browser versions
2. **Security Context:** Must be used within secure contexts (HTTPS)
3. **Quota Limitations:** Browser-enforced limits on available storage space
4. **Cross-Origin Restrictions:** Subject to same-origin policy restrictions
5. **User Permission:** May require explicit user permission for persistent storage

## Modern Alternatives

Developers should consider these modern alternatives:

- **File System Access API:** Modern standard for accessing user-selected files and directories
- **IndexedDB:** For structured data storage with larger quotas
- **Cache API:** For caching network responses
- **Web Storage:** For small amounts of persistent data (localStorage, sessionStorage)
- **ServiceWorker + Cache API:** For comprehensive offline capabilities

## Resources & References

### Official Documentation

- [HTML5 Rocks Tutorial](https://www.html5rocks.com/en/tutorials/file/filesystem/) - Comprehensive introduction and examples
- [WebPlatform Docs](https://webplatform.github.io/docs/apis/filesystem) - API reference documentation

### Issue Tracking

- [Firefox Tracking Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=997471) - Mozilla's status on implementation

### Keywords

`filewriter`, `requestFileSystem`

## Compatibility Checklist

Before using this API, ensure:

- ✓ Feature detection for vendor-specific implementation
- ✓ Fallback strategy for unsupported browsers
- ✓ Storage quota management
- ✓ Error handling for quota exceeded scenarios
- ✓ User permission handling where required
- ✓ Testing across target browser versions
- ✓ Security context verification (HTTPS)

## Summary

The Filesystem & FileWriter API provides powerful file system access capabilities for web applications, with broad support in Chromium-based browsers. However, the API's non-standard status and lack of Mozilla/Apple support make it important to consider modern alternatives for new projects. The high global usage percentage reflects the dominance of Chrome-based browsers, but developers should implement careful feature detection and fallback strategies when targeting diverse audiences.
