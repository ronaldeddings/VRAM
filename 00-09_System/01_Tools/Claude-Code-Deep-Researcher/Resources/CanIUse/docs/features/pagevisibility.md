# Page Visibility API

## Overview

The **Page Visibility API** is a JavaScript API that allows developers to determine whether a document is visible on the display. This API enables web applications to optimize their performance and resource usage based on whether the page is currently visible to the user.

## Description

The Page Visibility API provides a way to detect when a user has switched away from a webpage or tab. This is useful for reducing unnecessary resource consumption when the page is not being viewed, such as pausing video playback, stopping animations, or reducing the frequency of background requests.

## Specification Status

- **Status**: W3C Recommendation (REC)
- **Specification**: [W3C Page Visibility Specification](https://www.w3.org/TR/page-visibility/)

## Categories

- **JavaScript API**

## Benefits & Use Cases

### Performance Optimization
- Pause resource-intensive operations (animations, timers) when the page is hidden
- Resume operations when the page becomes visible again
- Reduce server load by decreasing request frequency for hidden tabs

### Resource Management
- Stop video or audio playback when the user switches tabs
- Suspend background synchronization tasks
- Decrease CPU and battery consumption on mobile devices

### User Experience
- Detect when users have navigated away from your application
- Implement smart idle detection mechanisms
- Display notifications only when the page is visible

### Analytics & Monitoring
- Track user engagement more accurately
- Understand when users are actively viewing your content
- Implement session management logic

## API Properties and Events

### Properties
- `document.hidden` - Boolean indicating if the document is hidden
- `document.visibilityState` - String indicating the visibility state
  - `"visible"` - Page is visible
  - `"hidden"` - Page is hidden
  - `"prerender"` - Page is being prerendered (may not be used in all browsers)

### Events
- `visibilitychange` - Fired when the visibility state changes
- `document.onvisibilitychange` - Event handler for visibility changes

## Browser Support

### Support Legend
- ✅ **Fully Supported** - Feature works without prefix
- ⚠️ **Prefixed** - Feature requires vendor prefix (e.g., `-webkit-`, `-moz-`)
- ❌ **Not Supported** - Feature is not available

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Internet Explorer** | IE 10 | ✅ Supported (IE 10+) | IE 9 and earlier not supported |
| **Edge** | 12 | ✅ Supported | Full support since launch |
| **Chrome** | 14 | ✅ Supported | Prefixed until v33, full support from v33+ |
| **Firefox** | 10 | ✅ Supported | Prefixed (with `-moz-`) until v18, fully unprefixed from v18+ |
| **Safari** | 6.1 | ✅ Supported | Available since Safari 6.1+ |
| **Opera** | 12.1 | ✅ Supported | Prefixed until v19, fully unprefixed from v20+ |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|--------------|----------------|
| **iOS Safari** | 7.0 | ✅ Supported (7.0+) |
| **Android Browser** | 4.4 | ✅ Supported (4.4+, prefixed; full support in later versions) |
| **Samsung Internet** | 4.0 | ✅ Supported (4.0+, prefixed; full support from 5.0+) |
| **Opera Mobile** | 12.1 | ✅ Supported (12.1+, prefixed; full support from v20+) |
| **Firefox Mobile** | 10 | ✅ Supported (full support) |
| **IE Mobile** | 10 | ✅ Supported (IE Mobile 10+) |
| **Opera Mini** | N/A | ❌ Not Supported |
| **UC Browser** | 15.5 | ✅ Supported |
| **Chrome Mobile** | 14+ | ✅ Supported |

### Global Coverage
- **Global usage**: 93.59% (as of the last data update)
- **Overall support**: Widely supported across modern browsers

## Known Issues & Bugs

### Chrome Issue (v38 Desktop)
In Chrome 38 desktop, the `visibilitychange` event is fired twice. This was a known bug in that specific version. [Chrome bug report](https://bugs.chromium.org/p/chromium/issues/detail?id=422163)

**Workaround**: If targeting Chrome 38, consider implementing debouncing logic for the `visibilitychange` event listener.

## Prefix Requirements

### Vendor Prefixes (Historical)
Some older browser versions require vendor prefixes:

- **Firefox 10-17**: Use `-moz-` prefix (`document.mozHidden`, `mozvisibilitychange`)
- **Chrome 14-32**: Use `-webkit-` prefix (`document.webkitHidden`, `webkitvisibilitychange`)
- **Opera 15-19**: Use `-webkit-` prefix (`document.webkitHidden`, `webkitvisibilitychange`)
- **Android 4.4 - 4.4.3**: Use `-webkit-` prefix
- **Samsung 4.0**: Use `-webkit-` prefix

Modern browsers no longer require prefixes.

## Feature Keywords

- `visibilitystate`
- `visibilitychange`
- `onvisibilitychange`

## Basic Usage Example

```javascript
// Check if document is hidden
if (document.hidden) {
  console.log('Page is hidden');
} else {
  console.log('Page is visible');
}

// Check visibility state
console.log(document.visibilityState); // "visible", "hidden", or "prerender"

// Listen for visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Page is now hidden - pause non-essential operations
    pauseVideo();
    stopAnimations();
  } else {
    // Page is now visible - resume operations
    resumeVideo();
    startAnimations();
  }
});
```

## Polyfill Consideration

For applications that need to support very old browsers (pre-IE 10, pre-Chrome 14), consider implementing a polyfill or fallback behavior. However, given 93.59% global coverage, this is rarely necessary for modern web applications.

## Related Resources

### Official Documentation
- [MDN Web Docs - Page Visibility API](https://developer.mozilla.org/en-US/docs/DOM/Using_the_Page_Visibility_API)

### Learning Resources
- [SitePoint - Introduction to Page Visibility API](https://www.sitepoint.com/introduction-to-page-visibility-api/)
- [Live Demo](https://audero.it/demo/page-visibility-api-demo.html)

### W3C Specification
- [W3C Page Visibility Specification](https://www.w3.org/TR/page-visibility/)

## References

- **Specification**: W3C Recommendation
- **Usage Percentage**: 93.59% of websites
- **Status**: Stable and widely adopted

---

*Last updated based on CanIUse data. Browser support statistics and version information reflect current compatibility data.*
