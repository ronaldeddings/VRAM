# Drag and Drop

## Overview

Native HTML5 Drag and Drop is a web platform feature that enables users to drag and drop elements on a page with minimal JavaScript code. This feature provides a standardized way to implement drag-and-drop interactions without relying on third-party libraries.

## Description

Method of easily dragging and dropping elements on a page, requiring minimal JavaScript. The HTML5 Drag and Drop API provides a native mechanism for implementing drag-and-drop functionality, allowing web developers to create intuitive user interactions for moving, copying, or organizing content on the page.

## Specification Status

**Status:** Living Standard
**Specification:** [WHATWG HTML Standard - Drag and Drop](https://html.spec.whatwg.org/multipage/interaction.html#dnd)

The Drag and Drop specification is maintained as part of the WHATWG Living Standard, which means it continues to evolve with ongoing refinements and improvements.

## Categories

- HTML5

## Benefits and Use Cases

### Common Use Cases

- **File Uploads**: Allow users to drag files directly onto designated drop zones instead of using file input dialogs
- **Sortable Lists**: Enable reordering of items in lists, task managers, and project planning tools
- **Kanban Boards**: Implement task management interfaces with draggable cards between columns
- **Image Galleries**: Provide intuitive ways to organize and rearrange image collections
- **Shopping Carts**: Create drag-and-drop shopping experiences for e-commerce applications
- **Data Manipulation**: Facilitate moving data between different areas of an application

### Key Benefits

- **Native Browser Support**: No external library dependencies required
- **Accessible**: Built on standard HTML attributes (`draggable`)
- **Performance**: Efficient implementation at the browser level
- **User-Familiar**: Matches native operating system drag-and-drop behavior
- **Rich Feedback**: Visual feedback through drop effects and custom cursor styling

## Browser Support

### Support Legend

- **Yes (y)** - Fully supported
- **Partial (a)** - Partial support with known limitations
- **No (n)** - Not supported
- **Partial (p)** - Partial/experimental support

### Desktop Browsers

| Browser | Support | First Version | Latest Tested |
|---------|---------|---------------|---------------|
| **Chrome** | Yes | 4 | 146 |
| **Edge** | Partial | 12 | 143+ |
| **Firefox** | Yes | 3.5 | 148 |
| **Safari** | Yes | 3.1 | 18.5-18.6 |
| **Opera** | Partial → Yes | 9 (partial) | 122 |
| **IE** | Partial | 5.5 | 11 |

**Edge Chromium Full Support:** Starting with Edge 18

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | Yes | From version 15.0+ |
| **Android Chrome** | Yes | From version 142+ (Android 7+) |
| **Android Firefox** | No | Not supported in latest versions |
| **Samsung Internet** | No | Not supported |
| **Opera Mobile** | Partial → Yes | From version 12.1+ |
| **Opera Mini** | No | Not supported |
| **UC Browser (Android)** | Yes | From version 15.5+ |
| **Android UC** | Yes | From version 15.5+ |
| **IE Mobile** | Yes | Versions 10-11 |
| **BlackBerry** | No | Not supported |
| **Baidu** | No | Not supported |
| **KaiOS** | No | Not supported |

### Global Support Summary

- **Full Support:** 90.64% of global users
- **Partial Support:** 0.42% of global users

## Known Issues and Limitations

### General Limitations

#### DataTransfer API Limitations
- **Chrome**: Strips newlines from `text/uri-list` data format ([Chromium Issue #239745](https://code.google.com/p/chromium/issues/detail?id=239745))
- **IE 9-11**: Using `"text/plain"` format for `dataTransfer.setData()` and `getData()` causes JavaScript errors. Use `"text"` format instead, which works across all major browsers
- **Chrome**: `DataTransfer.addElement` is not implemented. Dynamic drag images that update during drag (e.g., changing color on valid drop target) are not supported

#### Firefox Issues
- Requires `dataTransfer` to be set in `dragstart` handler, even if not retrieved
- Drag and drop doesn't work when page is served as `application/xhtml+xml` ([Mozilla Bug #751778](https://bugzilla.mozilla.org/show_bug.cgi?id=751778), [Mozilla Bug #1106160](https://bugzilla.mozilla.org/show_bug.cgi?id=1106160))
- `dragstart` event doesn't fire on `<button>` elements, effectively disabling drag-and-drop for buttons

#### Safari Issues
- Doesn't implement the `DragEvent` interface; adds `dataTransfer` property to `MouseEvent` instead ([WebKit Bug #103423](https://bugs.webkit.org/show_bug.cgi?id=103423))
- In Safari 8: After setting `event.dataTransfer.dropEffect`, the value in the `drop` event is always `'none'`

#### IE-Specific Issues (IE 9-10)
- The `draggable` attribute only works effectively for `<a>` and `<img>` elements
- For `<div>` and `<span>` elements, you must call `element.dragDrop()` to initiate the drag event

#### Mobile Limitations
- **Android**: Not supported on Android 6 or older (only Chrome 142+ on Android 7+)
- **iOS**: Only supported from iOS 15.0+; earlier versions don't support drag and drop

### Feature Gaps

- **dropzone Attribute**: Currently no browser supports the `dropzone` attribute, which would allow specifying valid drop zones declaratively
- **dataTransfer.items**: Only supported by Chrome browsers (not available in Firefox, Safari, or Edge)

### Implementation Notes

- **Firefox**: Supports any kind of DOM elements for `.setDragImage()`, providing maximum flexibility
- **Chrome**: Requires either an `HTMLImageElement` or any kind of DOM Element that is:
  - Attached to the DOM
  - Within the viewport of the browser window

## Additional Resources

### Documentation and Guides

- [HTML5 Doctor - Native Drag and Drop](https://html5doctor.com/native-drag-and-drop/)
  Comprehensive guide to implementing drag and drop with practical examples

- [Shopping Cart Demo](https://nettutsplus.s3.amazonaws.com/64_html5dragdrop/demo/index.html)
  Interactive example demonstrating drag-and-drop in an e-commerce context

- [WebPlatform Documentation - DragEvent](https://webplatform.github.io/docs/dom/DragEvent)
  Official API documentation and reference

### Polyfills and Shims

- [setDragImage Polyfill for IE](https://github.com/MihaiValentin/setDragImage-IE)
  Polyfill adding `setDragImage` support to Internet Explorer

- [iOS/Android Drag and Drop Shim](https://github.com/timruffles/ios-html5-drag-drop-shim)
  Polyfill extending drag-and-drop support to iOS and Android browsers

## Notes

### DataTransfer Items Support

The `dataTransfer.items` property is only supported by Chrome. If you need cross-browser compatibility, use the `dataTransfer.setData()` and `getData()` methods instead.

### Dropzone Attribute

Currently, no browser implements the `dropzone` HTML attribute, which was designed to allow declarative specification of drop zones. You must use JavaScript event handlers (`dragover` and `drop`) to implement drop zones.

### Custom Drag Images

- **Firefox**: Flexible implementation allowing any DOM element to serve as a drag image
- **Chrome**: Requires `HTMLImageElement` or DOM elements that are attached to the DOM and visible within the browser viewport. Consider using a temporary image element if your custom drag image isn't within the viewport.

## Implementation Recommendation

For modern web applications, HTML5 Drag and Drop is now widely supported across all major browsers (90.64% global coverage). Consider using it directly without polyfills for new projects, while providing fallback behavior for IE9-10 and older mobile browsers as needed.

---

**Last Updated:** 2025
**Data Source:** Can I Use (caniuse.com)
