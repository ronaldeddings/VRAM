# Web SQL Database

## Overview

Web SQL Database is a deprecated client-side data storage method that allows developers to perform SQLite database queries for accessing and manipulating data directly within web browsers.

## Feature Details

| Property | Value |
|----------|-------|
| **Specification** | [W3C Web Database](https://www.w3.org/TR/webdatabase/) |
| **Status** | Unofficial (Deprecated) |
| **Category** | JavaScript API |
| **Global Usage** | ~9.54% of users |

## Description

Web SQL Database provides a method for storing data on the client-side using a SQLite database engine. It enables developers to create databases, tables, and execute SQL queries directly from JavaScript, providing a more structured alternative to simple key-value storage mechanisms.

## Specification Status

The Web SQL Database specification is **no longer being actively maintained** by the W3C. This feature is considered deprecated, and browser vendors have committed to removing support in future versions. **New projects should not rely on this technology.**

## Recommended Alternatives

For new development, consider migrating to:
- **Web Storage** - For simple key-value storage needs
- **IndexedDB** - For more complex client-side data storage with better future support
- **Cache API** - For offline-first applications and service worker scenarios

## Use Cases & Benefits

While Web SQL Database is now deprecated, it was historically used for:

- Client-side database operations without server communication
- Structured data management in web applications
- Offline-capable applications that required complex queries
- Progressive web apps with local data persistence
- Building more sophisticated client-side caching mechanisms

## Browser Support

### Desktop Browsers

| Browser | Supported? | Min Version | Max Version | Notes |
|---------|-----------|------------|------------|-------|
| **Chrome** | Partial | 4 | 123 | Deprecated starting v105; requires secure context from v105; no support from v124+ |
| **Edge** | Partial | 79 | 123 | Requires secure context from v105; no third-party context support from v110+; removed v124+ |
| **Firefox** | No | — | — | Never supported |
| **Safari** | Partial | 3.1 | 12.1 | Last supported in Safari 12.1 (2018); removed in Safari 13+ |
| **Opera** | Partial | 10.5 | 109 | Deprecated support; requires secure context from v91+; removed from v110+ |
| **IE** | No | — | — | Never supported |

### Mobile Browsers

| Browser | Supported? | Details |
|---------|-----------|---------|
| **iOS Safari** | Partial | Supported up to iOS 12.5; removed in iOS 13+ |
| **Android Browser** | Partial | Supported up to Android 4.4.3-4.4.4; removed in later versions |
| **Chrome Mobile** | No | Removed from Chrome 124+ on Android |
| **Firefox Mobile** | No | Never supported |
| **Samsung Internet** | Partial | Supported up to version 29; requires secure context from v91+ |
| **Opera Mobile** | Partial | Supported up to version 109; removed from v110+ |
| **UC Browser** | Yes | Limited support in v15.5 |
| **Opera Mini** | No | Not supported |
| **IE Mobile** | No | Not supported |
| **Blackberry** | Yes | Supported in v7 and v10 |
| **KaiOS** | No | Not supported |

### Support Summary by Browser Family

```
Modern Desktop:
✓ Chrome/Edge: v4-123 (deprecated, removed v124+)
✓ Safari: v3.1-12.1 (removed v13+)
✗ Firefox: Never supported
✓ Opera: v10.5-109 (removed v110+)

Modern Mobile:
✓ iOS Safari: up to v12.5 (removed v13+)
✓ Android: up to 4.4.3-4.4.4
✓ Samsung Internet: up to v29
✗ Android Chrome: Removed v124+
```

## Important Notes & Restrictions

### General Notes
1. **Web SQL is deprecated** - The specification is no longer maintained, and browser support is being actively removed across all major browsers.

### Chrome-Specific Limitations
- **Web Workers** - Not supported in Web Workers context
- **Third-Party Contexts** - Not supported in third-party iframes from Chrome v97+
- **Secure Contexts** - Requires HTTPS (secure context) starting with Chrome v105+
- **Deprecation Timeline** - Fully removed from Chrome v124+

### Safari/WebKit Limitations
- **iOS Removal** - Completely removed starting with iOS 13 (2019)
- **macOS Removal** - Completely removed starting with Safari 13 (2019)

### Opera Limitations
- **Secure Context** - Requires HTTPS from Opera v91+
- **Deprecation** - Support ending; fully removed from v110+

### Chrome Deprecation Notes (marked as #1, #2, #3)
- **#1** - Not available in third-party contexts
- **#2** - Requires a secure context (HTTPS)
- **#3** - Requires a deprecation Origin Trial token (Chrome v119+)

## Known Issues

### Cross-Browser Compatibility
- **Samsung Android 4.x** - Reported to not be supported on Samsung-based Android 4 devices, despite general Android 4 support in other browsers

### Feature Gaps
- No support in Firefox across all versions
- Inconsistent support across mobile platforms
- Removal timeline varies by browser

## Historical Context

- **First Support** - Chrome 4 (2009)
- **Peak Support** - 2010-2018 across most browsers
- **Deprecation Started** - 2019-2020 (Safari 13, Firefox never supported)
- **Recent Removal** - Chrome 124+ (2024), Edge 124+ (2024)
- **Current Status** - Legacy technology with limited remaining support

## References & Resources

### Official Resources
- [W3C Web Database Specification](https://www.w3.org/TR/webdatabase/)
- [Chrome Platform Status: Deprecate and remove WebSQL](https://chromestatus.com/feature/5175124599767040)

### Educational Resources
- [HTML5 Doctor: Introducing Web SQL Databases](https://html5doctor.com/introducing-web-sql-databases/)

### Detection & Testing
- [has.js Feature Detection](https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-sql-db)

### Related Features
- [Web Storage (namevalue-storage)](/?search=Web+Storage)
- [IndexedDB](/?search=IndexedDB)
- [Cache API](/?search=Cache+API)

## Migration Guide

If you're currently using Web SQL Database, consider:

1. **For Simple Data** → Migrate to Web Storage (localStorage/sessionStorage)
2. **For Complex Queries** → Migrate to IndexedDB with a wrapper library
3. **For Offline Support** → Consider Cache API + Service Workers
4. **For Full Compatibility** → Use a polyfill library or server-side storage

### Common Libraries for Migration
- **Dexie.js** - A minimal wrapper around IndexedDB
- **idb** - Tiny wrapper for IndexedDB promises
- **PouchDB** - Database that syncs with IndexedDB

## Security Considerations

- **Secure Context Requirement** - From Chrome 105+, Web SQL requires HTTPS
- **Same-Origin Policy** - Applies to Web SQL databases
- **Third-Party Context Restrictions** - Not available in cross-origin embedded content (Chrome 97+)
- **No User Consent** - Unlike cookies, users have limited privacy controls over Web SQL data

## Summary

Web SQL Database remains technically functional in some modern browsers (Chrome up to v123, Safari up to v12.1, Opera up to v109) but is considered a legacy technology with **active removal ongoing**. The W3C specification is no longer maintained, and all major browser vendors have committed to discontinuing support.

**For any new projects, use IndexedDB or Web Storage instead.** Web SQL Database should only be used for maintaining legacy applications, with plans to migrate to modern alternatives.
