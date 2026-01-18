# Mutation Events

## Overview

Mutation events are a deprecated mechanism for listening to changes made to the DOM. They have been superseded by the modern **Mutation Observer API**, which provides significantly better performance characteristics.

## Description

The Mutation Events API was an older standard for detecting DOM modifications, including node insertions, deletions, attribute changes, and text content modifications. However, due to performance issues and the synchronous nature of event firing, this API has been deprecated and removed from the specification as of September 7, 2024.

## Specification Status

**Status:** Unofficial/Deprecated

- **Spec Document:** [W3C UI Events - Legacy MutationEvent Events](https://www.w3.org/TR/2024/WD-uievents-20240906/#legacy-mutationevent-events)
- **Deprecated:** Yes
- **Removal Status:** Removed from spec (2024-09-07)

## Categories

- **DOM** - Document Object Model APIs

## Key Events (Deprecated)

The following events are part of the deprecated Mutation Events specification:

- `DOMNodeInserted` - Fired when a node is inserted into the DOM
- `DOMNodeRemoved` - Fired when a node is removed from the DOM
- `DOMNodeInsertedIntoDocument` - Fired when a node is inserted into the DOM tree
- `DOMNodeRemovedFromDocument` - Fired when a node is removed from the DOM tree
- `DOMAttrModified` - Fired when an attribute is modified
- `DOMCharacterDataModified` - Fired when character data is modified
- `DOMSubtreeModified` - Fired when the subtree is modified in any way

## Benefits/Use Cases (Historical)

While now deprecated, Mutation Events were historically used for:

- Detecting DOM structural changes
- Monitoring attribute modifications
- Responding to node insertions and deletions
- Implementing auto-updating UIs that react to DOM changes
- Debugging and tracking DOM modifications

**Modern Alternative:** Use [Mutation Observer API](/docs/features/mutationobserver.md) instead, which addresses all these use cases without the performance penalties.

## Current Support Status

Mutation Events are currently being phased out across all major browsers:

- **Usage:** Approximately 20.32% of websites (mostly legacy code)
- **Active Support:** Limited and deprecated in all modern browsers
- **Chrome:** Removed as of version 127 and later (deprecated flag in earlier versions)
- **Firefox:** Removed as of version 140 and later
- **Safari:** Removed as of version 26.0 and later
- **Edge:** Deprecated and being phased out (version 127+)

## Browser Support Table

| Browser | Version Range | Support | Notes |
|---------|---------------|---------|-------|
| **Internet Explorer** | 5.5-8 | ❌ Not Supported | - |
| | 9-11 | ⚠️ Partial | Does not support `DOMNodeInsertedIntoDocument` & `DOMNodeRemovedFromDocument` |
| **Edge** | 12-126 | ⚠️ Partial | Does not support `DOMAttrModified` |
| | 127+ | ❌ Deprecated | Flagged for removal |
| **Firefox** | 2-5 | ❌ Not Supported | - |
| | 6-139 | ⚠️ Partial | Does not support `DOMNodeInsertedIntoDocument` & `DOMNodeRemovedFromDocument` |
| | 140+ | ❌ Removed | - |
| **Chrome** | 4-14 | ⏳ Unknown | - |
| | 15-126 | ⚠️ Partial | Does not support `DOMAttrModified` |
| | 127-134 | ❌ Deprecated | Flagged for removal |
| | 135+ | ❌ Removed | - |
| **Safari** | 3.1-3.2 | ⏳ Unknown | - |
| | 4-18.5 | ⚠️ Partial | Does not support `DOMAttrModified` |
| | 26.0+ | ❌ Removed | - |
| **Opera** | 9-10.6 | ❌ Not Supported | - |
| | 11-12.1 | ✅ Full Support | - |
| | 15-112 | ⚠️ Partial | Does not support `DOMAttrModified` |
| | 113+ | ❌ Deprecated | Flagged for removal |
| **iOS Safari** | 3.2-4.1 | ⏳ Unknown | - |
| | 4.2-18.5 | ⚠️ Partial | Does not support `DOMAttrModified` |
| | 26.0+ | ❌ Removed | - |
| **Android Browser** | 2.1-2.2 | ⏳ Unknown | - |
| | 2.3-4.4.4 | ⚠️ Partial | Does not support `DOMAttrModified` |
| | 142+ | ❌ Removed | - |
| **Samsung Internet** | 4-29 | ⚠️ Partial | Does not support `DOMAttrModified` |

### Legend

- ✅ **Full Support** - All Mutation Events are supported
- ⚠️ **Partial Support** - Some events not supported (see notes)
- ⏳ **Unknown** - Data unavailable
- ❌ **Not Supported/Removed** - Feature is not available or has been removed
- 🚫 **Deprecated** - Feature is deprecated and flagged for removal

## Support Notes

### #1: Missing `DOMAttrModified` Support

The following browsers/versions do not support the `DOMAttrModified` event:

- Chrome 15+
- Safari 4+
- Opera 15+
- iOS Safari 4.2+
- Android Browser 2.3+
- Samsung Internet 4+
- UC Browser 15.5
- Android Chrome 142+
- Baidu Browser 13.52+
- Android QQ Browser 14.9+

### #2: Missing Document Events

The following browsers/versions do not support `DOMNodeInsertedIntoDocument` and `DOMNodeRemovedFromDocument` events:

- Internet Explorer 9-11
- Edge 12-18
- Firefox 6-139
- IE Mobile 10-11
- KaiOS 2.5-3.1

## Important Notes

- **Deprecated as of 2024-09-07:** Mutation Events have been removed from the specification and are no longer recommended for use.
- **Performance Issues:** These events can significantly impact page performance due to their synchronous, blocking nature.
- **Modern Alternative:** The [Mutation Observer API](/docs/features/mutationobserver.md) is the recommended replacement. It provides asynchronous, non-blocking DOM mutation detection with better performance characteristics.
- **Legacy Code:** Support remains in some older browsers primarily for backward compatibility with legacy code.

## Migration Guide

### From Mutation Events to Mutation Observer

**Before (Deprecated):**
```javascript
element.addEventListener('DOMNodeInserted', function(event) {
  console.log('Node inserted:', event.target);
});
```

**After (Modern):**
```javascript
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      console.log('Node inserted or removed');
    }
  });
});

observer.observe(element, {
  childList: true,
  subtree: true
});
```

The Mutation Observer API provides:
- **Better Performance:** Asynchronous observation without blocking the event loop
- **More Control:** Granular configuration of what changes to observe
- **Batched Updates:** Multiple mutations are batched into a single callback
- **Modern Standard:** Actively maintained and universally supported in modern browsers

## References

### Official Documentation
- [MDN Web Docs - MutationEvent](https://developer.mozilla.org/en-US/docs/Web/API/MutationEvent)
- [W3C UI Events Specification](https://www.w3.org/TR/2024/WD-uievents-20240906/#legacy-mutationevent-events)

### Related Features
- [Mutation Observer API](/docs/features/mutationobserver.md) - Modern replacement

### Keywords
`DOMAttrModified`, `DOMCharacterDataModified`, `DOMNodeInserted`, `DOMNodeInsertedIntoDocument`, `DOMNodeRemoved`, `DOMNodeRemovedFromDocument`, `DOMSubtreeModified`

---

**Last Updated:** 2024

**Feature ID:** mutation-events

**Chrome Platform Status:** [5083947249172480](https://chromestatus.com/feature/5083947249172480)
