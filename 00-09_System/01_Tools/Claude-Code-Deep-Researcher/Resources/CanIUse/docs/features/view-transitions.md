# View Transitions API (Single-Document)

## Overview

The View Transitions API provides a mechanism for easily creating animated transitions between different DOM states while updating the DOM contents in a single step. This API is specific to single-document transitions, allowing developers to create smooth, visually appealing state changes in their web applications.

## Description

The View Transitions API enables developers to:

- Create animated transitions when updating the DOM
- Smoothly transition between different visual states
- Perform DOM updates and animations in a coordinated manner
- Enhance user experience with elegant state change animations

This is particularly useful for single-document applications where navigation and state changes don't involve full page reloads.

## Specification Status

**Status:** Working Draft (WD)
**Specification URL:** [W3C CSS View Transitions Level 1](https://www.w3.org/TR/css-view-transitions-1/)

The API is actively being developed and standardized by the W3C CSS Working Group.

## Categories

- CSS
- JavaScript API

## Benefits & Use Cases

### Benefits

- **Smooth User Experience:** Create polished transitions that guide users through state changes
- **DOM Update Coordination:** Update DOM and animate changes in a single, coordinated operation
- **Single-Document Navigation:** Enhance SPA (Single Page Application) navigation without page reloads
- **Native Performance:** Leverage browser rendering engine for optimal animation performance
- **Simple Implementation:** Easy-to-use API for common transition patterns

### Use Cases

- **Single Page Applications (SPAs):** Smooth transitions between different views or pages
- **Modal Dialogs:** Animate the appearance and disappearance of dialogs
- **List Updates:** Animate changes when items are added, removed, or reordered
- **Content Replacements:** Smoothly transition between different content blocks
- **State Changes:** Visually indicate application state transitions
- **Theme Switching:** Animate transitions when changing color themes

## Browser Support

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 111+ | ✅ Full | Supported from Chrome 111 onwards |
| **Edge** | 111+ | ✅ Full | Supported from Edge 111 onwards |
| **Safari** | 18.0+ | ✅ Full | Supported from Safari 18.0 onwards |
| **Firefox** | 144+ | ✅ Full | Supported from Firefox 144 onwards |
| **Opera** | 97+ | ✅ Full | Supported from Opera 97 onwards |
| **iOS Safari** | 18.0+ | ✅ Full | Supported from iOS Safari 18.0 onwards |
| **Samsung Internet** | 23+ | ✅ Full | Supported from Samsung Internet 23 onwards |
| **Android Chrome** | 142+ | ✅ Full | Supported on Android Chrome 142+ |
| **Android Firefox** | 144+ | ✅ Full | Supported on Android Firefox 144+ |
| **Opera Mobile** | 80+ | ✅ Full | Supported from Opera Mobile 80 onwards |
| **Internet Explorer** | All versions | ❌ Not supported | No support |
| **Opera Mini** | All versions | ❌ Not supported | No support |
| **UC Browser** | Tested versions | ❌ Not supported | No support |
| **Baidu** | Tested versions | ❌ Not supported | No support |
| **QQ Browser** | Tested versions | ❌ Not supported | No support |
| **BlackBerry** | All versions | ❌ Not supported | No support |
| **IE Mobile** | All versions | ❌ Not supported | No support |
| **KaiOS** | All versions | ❌ Not supported | No support |

### Support Summary

- **Global Support:** ~87.27% of users (based on usage statistics)
- **Modern Browsers:** Widely supported in all modern browser engines (Chromium, WebKit, Gecko)
- **Legacy Support:** Not supported in Internet Explorer or older browser versions
- **Mobile Support:** Good support on modern mobile platforms (iOS 18+, Android with modern Chrome)

## Implementation Notes

### Firefox Availability

Firefox support is available starting with version 144. In Firefox 143, the feature can be enabled using the `dom.viewTransitions.enabled` flag and is enabled by default in Firefox Nightly builds only.

### Progressive Enhancement

Since browser support varies, consider using feature detection:

```javascript
if (document.startViewTransition) {
  // View Transitions API is supported
  document.startViewTransition(() => {
    // Update DOM
  });
} else {
  // Fallback for unsupported browsers
}
```

## Related Links

- **[W3C Specification](https://www.w3.org/TR/css-view-transitions-1/)** - Official W3C specification
- **[WICG Explainer](https://github.com/WICG/view-transitions/blob/main/explainer.md)** - Technical explainer document from the Web Incubation Community Group
- **[Chrome Developers Documentation](https://developer.chrome.com/docs/web-platform/view-transitions/)** - Comprehensive guide from Chrome DevTools team
- **[Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1823896)** - Firefox implementation tracking
- **[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)** - Mozilla Developer Network documentation

## Additional Resources

### Keywords

- ViewTransition
- startViewTransition

### Chrome Platform Status

- **Chrome ID:** 5193009714954240
- Check status at: [Chrome Platform Status](https://www.chromestatus.com/)

## Getting Started

To use the View Transitions API:

1. Check for browser support using feature detection
2. Wrap DOM updates with `document.startViewTransition()`:

```javascript
document.startViewTransition(() => {
  // Perform your DOM updates here
  document.body.style.backgroundColor = 'blue';
});
```

3. Customize transitions using CSS `view-transition-name` property
4. Test across browsers and provide fallbacks for unsupported browsers

## Current Status

The View Transitions API is a relatively new feature with strong adoption in modern browsers. It's recommended for new projects targeting modern browser versions, but consider progressive enhancement strategies for broader compatibility.

---

*Documentation generated from CanIUse data. Last updated: December 2025*
