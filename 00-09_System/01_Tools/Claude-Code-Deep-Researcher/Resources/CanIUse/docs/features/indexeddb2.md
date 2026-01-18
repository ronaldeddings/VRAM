# IndexedDB 2.0

## Overview

**IndexedDB 2.0** is a standardized specification that introduces significant improvements to the IndexedDB API, a low-level storage mechanism for storing structured data on the client-side. This version builds upon the IndexedDB standard with powerful new features designed to enhance data retrieval capabilities and storage management.

## Description

IndexedDB 2.0 introduces key enhancements including:

- **getAll() method** - Retrieve multiple values from object stores efficiently
- **Renaming stores and indexes** - Dynamically rename stores and indexes without data loss
- **Binary keys** - Support for binary data as index keys for more flexible data handling

These improvements make IndexedDB more powerful and flexible for complex client-side data management scenarios.

## Specification Details

| Property | Value |
|----------|-------|
| **Specification** | [W3C Recommendation](https://www.w3.org/TR/IndexedDB-2/) |
| **Status** | W3C Recommendation (REC) |
| **Category** | JavaScript API |
| **Current Adoption** | 92.99% (Y), 0.11% (Partial) |

## Categories

- **JS API** - JavaScript Application Programming Interface

## Benefits & Use Cases

### Key Benefits

1. **Improved Data Retrieval**
   - `getAll()` method eliminates the need for manual cursor iteration when fetching multiple records
   - Reduces code complexity and improves performance for bulk operations

2. **Dynamic Store/Index Management**
   - Rename stores and indexes without requiring data migration
   - Simplifies schema evolution and refactoring workflows
   - Reduces downtime for database restructuring

3. **Enhanced Data Type Support**
   - Binary keys enable storage and querying of complex binary data
   - Expands use cases for specialized data structures and encryption keys

### Ideal Use Cases

- **Progressive Web Applications (PWAs)** - Robust offline data persistence
- **Real-time Collaboration Tools** - Efficient management of large datasets
- **Media Management Systems** - Binary data support for multimedia content
- **Complex SPA Architectures** - Advanced data synchronization and caching
- **Offline-First Applications** - Comprehensive local data handling

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| **Y** | Fully Supported |
| **N** | Not Supported |
| **A #1** | Partial Support (Missing: IDBKeyRange includes(), renaming stores/indexes, binary keys, IDBObjectStore getKey(), IDBCursor continuePrimaryKey()) |
| **A #2** | Partial Support (Missing: Renaming stores/indexes, binary keys, IDBObjectStore getKey(), IDBCursor continuePrimaryKey()) |
| **U** | Unknown Support |

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 58 | ✅ Fully Supported (v58+) | Full support from Chrome 58 onwards |
| **Firefox** | 51 | ✅ Fully Supported (v51+) | Earlier versions (44-50) have partial support |
| **Safari** | 10.1 | ✅ Fully Supported (v10.1+) | iPad/macOS supported since 10.1 |
| **Edge** | 79 | ✅ Fully Supported (v79+) | Full Chromium-based support |
| **Opera** | 45 | ✅ Fully Supported (v45+) | Earlier versions (35-44) have partial support |
| **Internet Explorer** | ❌ Not Supported | No support in any version | IE 5.5-11 do not support IndexedDB 2.0 |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **iOS Safari** | 10.3 | ✅ Fully Supported (v10.3+) |
| **Android Chrome** | Latest | ✅ Fully Supported |
| **Android Firefox** | Latest | ✅ Fully Supported |
| **Opera Mini** | ❌ Not Supported | No support (all versions) |
| **Opera Mobile** | 80 | ✅ Fully Supported (v80+) |
| **Samsung Internet** | 7.2-7.4 | ✅ Fully Supported (v7.2+) |
| **Android UC Browser** | 15.5 | ✅ Fully Supported |
| **Android QQ Browser** | 14.9 | ✅ Fully Supported |
| **Baidu Browser** | 13.52 | ✅ Fully Supported |
| **KaiOS** | 3.0-3.1 | ✅ Fully Supported (v3.0+) |
| **BlackBerry** | ❌ Not Supported | No support (v7, v10) |
| **IE Mobile** | ❌ Not Supported | No support (v10, v11) |

### Support Summary

- **Overall Global Support**: 92.99% of users have full support
- **Partial Support**: 0.11% (mostly older versions)
- **No Support**: Primarily Internet Explorer and legacy mobile browsers
- **Optimal Coverage**: Modern versions of all major browsers

## Implementation Notes

### Important Limitations

1. **Firefox Partial Support (v44-50)**
   - Missing: IDBKeyRange includes(), renaming stores/indexes, binary keys, IDBObjectStore getKey(), IDBCursor continuePrimaryKey()

2. **Older Chrome Versions (v48-57)**
   - Missing: Renaming stores/indexes, binary keys, IDBObjectStore getKey(), IDBCursor continuePrimaryKey()

3. **Opera Partial Support (v35-44)**
   - Missing: Renaming stores/indexes, binary keys, IDBObjectStore getKey(), IDBCursor continuePrimaryKey()

4. **Samsung Internet Partial Support (v5.0-6.4)**
   - Missing: Renaming stores/indexes, binary keys, IDBObjectStore getKey(), IDBCursor continuePrimaryKey()

5. **KaiOS Partial Support (v2.5)**
   - Missing: Renaming stores/indexes, binary keys, IDBObjectStore getKey(), IDBCursor continuePrimaryKey()

### Recommended Approach

For maximum compatibility, consider feature detection and fallback strategies:

```javascript
// Feature detection for IndexedDB 2.0
function hasIndexedDB2Support() {
  const dbRequest = indexedDB.open('test');
  dbRequest.onsuccess = () => {
    const db = dbRequest.result;
    // Check for getAll method availability
    const hasGetAll = 'getAll' in db.transaction(['test'], 'readonly').objectStore('test');
    db.close();
    return hasGetAll;
  };
}
```

## Related Links

### Official Documentation

- **W3C IndexedDB 2.0 Specification**: https://www.w3.org/TR/IndexedDB-2/
- **MDN Web Docs - IndexedDB API**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

### Educational Resources

- **Mozilla Hacks**: https://hacks.mozilla.org/2016/10/whats-new-in-indexeddb-2-0/
  - Comprehensive overview of new features and improvements in IndexedDB 2.0

## Polyfills & Alternatives

For environments with limited IndexedDB 2.0 support, consider:

- **localStorage** - Simple key-value storage (limited capacity ~5-10MB)
- **WebSQL** - Alternative database API (deprecated but still available)
- **IndexedDB Wrapper Libraries** - Provide polyfills and convenience functions
- **Service Worker Cache API** - Modern alternative for caching strategies

## Migration Guide

If upgrading from IndexedDB 1.0:

1. **Update version requirements** in your application
2. **Test getAll() usage** for bulk operations
3. **Implement store/index renaming** if needed
4. **Utilize binary keys** for new data structures
5. **Verify browser compatibility** before deployment

## See Also

- [IndexedDB (Original Specification)](./indexeddb.md)
- [Web Storage API](./localstorage.md)
- [Service Worker](./serviceworkers.md)
- [Cache API](./cache.md)
