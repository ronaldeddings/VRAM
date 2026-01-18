# Hashchange Event

## Overview

The `hashchange` event is a JavaScript event that fires whenever the URL hash fragment (the portion after the `#` symbol) changes. This allows developers to respond to navigation changes within a single-page application (SPA) without a full page reload.

## Description

Event triggered in JavaScript when the URL's hash has changed (for example: `page.html#foo` to `page.html#bar`). This is particularly useful for:

- Single-page applications (SPAs) that use hash-based routing
- Dynamic content loading without page refresh
- Browser history management
- Creating bookmarkable states within your application

## Current Spec Status

| Status | Living Standard |
|--------|-----------------|
| Specification | [HTML Living Standard - HashChangeEvent Interface](https://html.spec.whatwg.org/multipage/browsers.html#the-hashchangeevent-interface) |

## Categories

- HTML5
- JavaScript API

## Benefits & Use Cases

### Primary Use Cases

1. **Single-Page Application (SPA) Routing**
   - Implement client-side routing without server-side navigation
   - Change application views based on URL hash
   - Maintain application state across hash changes

2. **Browser History Management**
   - Create a browsable history within your application
   - Support browser back/forward buttons for in-app navigation
   - Provide bookmarkable states for users

3. **Dynamic Content Loading**
   - Load different content sections based on URL hash
   - Implement lazy-loaded components triggered by navigation
   - Update UI without full page reloads

4. **User State Preservation**
   - Maintain user position in multi-section applications
   - Save view state in URL for sharing and bookmarking
   - Enable users to jump directly to specific sections

### Code Example

```javascript
// Listen for hash changes
window.addEventListener('hashchange', (event) => {
  console.log('Previous URL:', event.oldURL);
  console.log('New URL:', event.newURL);
  console.log('New hash:', window.location.hash);

  // Update application based on new hash
  handleRouting(window.location.hash);
});

// Programmatically change hash
window.location.hash = '#section1';

// Or using the older onhashchange property
window.onhashchange = function() {
  console.log('Hash changed to:', window.location.hash);
};
```

## Browser Support

### Support Legend
- **Y** = Fully supported
- **P** = Partially supported
- **N** = Not supported

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Internet Explorer** | 8 | ✅ IE 8+ | Partial support in IE 5.5-7 (no oldURL/newURL) |
| **Edge** | 12 | ✅ All versions | Fully supported |
| **Firefox** | 3.6 | ✅ All versions | Partial in Firefox 2-3.5 |
| **Chrome** | 5 | ✅ All versions | Partial in Chrome 4 |
| **Safari** | 5 | ✅ All versions | Partial in Safari 3.1-4 |
| **Opera** | 10.6 | ✅ All versions | Partial in Opera 9-10.5 |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **iOS Safari** | 4.0 | ✅ iOS 4.0+ | Not supported in iOS 3.2 |
| **Android Browser** | 2.2 | ✅ Android 2.2+ | Not supported in Android 2.1 |
| **Opera Mobile** | 11 | ✅ Opera Mobile 11+ | Partial in Opera Mobile 10 |
| **Chrome Android** | Latest | ✅ Supported | |
| **Firefox Android** | Latest | ✅ Supported | |
| **Samsung Internet** | 4.0+ | ✅ Supported | |
| **Opera Mini** | - | ❌ Not supported | No support in any version |
| **UC Browser** | 15.5+ | ✅ Supported | |
| **Baidu** | 13.52+ | ✅ Supported | |
| **Blackberry** | 7+ | ✅ Supported | |
| **KaiOS** | 2.5+ | ✅ Supported | |
| **QQ Browser** | 14.9+ | ✅ Supported | |
| **IE Mobile** | 10+ | ✅ Supported | |

### Support Summary

```
Global Usage: 93.68% of users have full support
Partial Support: Minimal (only in older IE versions)
No Support: Only Opera Mini and iOS 3.2
```

## Important Notes & Limitations

### IE Limitations
Internet Explorer does not support the `oldURL` and `newURL` attributes on the HashChangeEvent. You must rely on `window.location.hash` to determine the current hash value instead.

```javascript
// Cross-browser compatible approach
window.addEventListener('hashchange', function(e) {
  // Don't rely on e.oldURL and e.newURL in IE
  const currentHash = window.location.hash;

  // Better approach: store previous hash
  const previousHash = window._lastHash;
  window._lastHash = currentHash;
});
```

### Modern Alternatives

Consider using the **History API** for more robust routing in modern applications:

```javascript
// History API (more powerful, requires server support)
window.addEventListener('popstate', (event) => {
  // Handle history state changes
});

// Push new state
history.pushState(state, title, url);
```

## Relevant Resources

- [MDN Web Docs - Window.onhashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)
- [Simple Demo](https://www.quirksmode.org/dom/events/tests/hashchange.html)
- [WebPlatform Docs - hashchange](https://webplatform.github.io/docs/dom/Element/hashchange)
- [jUri.js Polyfill](https://github.com/3nr1c/jUri.js)

## Best Practices

1. **Use Modern Routing Libraries**: For production applications, consider using established routing libraries like React Router, Vue Router, or Next.js that handle hash changes internally.

2. **Support History API**: Modern browsers prefer the History API for better control over navigation state.

3. **Handle Old Browsers**: If you must support IE versions below 8 or older browsers, implement feature detection and fallbacks.

4. **Store State Carefully**: Don't store sensitive data in URL hashes as they are easily visible and shareable.

5. **Test Cross-Browser**: Always test your hash-based routing across target browsers, especially for `oldURL`/`newURL` support.

## Related Features

- [History API](https://caniuse.com/history) - More powerful navigation control
- [Window.location](https://developer.mozilla.org/en-US/docs/Web/API/Location)
- [pushState / replaceState](https://caniuse.com/history)

---

**Last Updated**: December 2024
**Data Source**: CanIUse Database
