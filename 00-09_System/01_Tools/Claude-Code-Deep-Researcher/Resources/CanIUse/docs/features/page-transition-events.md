# PageTransitionEvent

## Overview

The **PageTransitionEvent** API provides events that fire when a page's entry in the session history becomes the current entry or stops being the current entry. This is commonly used with back/forward cache functionality to manage page lifecycle and restore application state.

## Description

The PageTransitionEvent fires at the Window object with two key events:

- **`pageshow`**: Fired when a page becomes active in the session history, including when returning from the back/forward cache
- **`pagehide`**: Fired when a page stops being the current page in the session history, including when being stored in the back/forward cache

The `persisted` property on the event indicates whether the page was retrieved from the back/forward cache.

## Specification Status

**Status**: Living Standard (ls)

**Specification**: [HTML Living Standard - PageTransitionEvent](https://html.spec.whatwg.org/multipage/indices.html#event-pageshow)

## Categories

- HTML5
- JavaScript API

## Benefits & Use Cases

### Primary Use Cases

1. **Back/Forward Cache Integration**
   - Detect when a page is restored from the browser's back/forward cache
   - Handle cached vs. fresh page loads differently
   - Restore interactive state for cached pages

2. **Resource Management**
   - Release resources when a page is hidden (pagehide)
   - Resume operations when a page is shown again (pageshow)
   - Optimize performance by pausing background operations

3. **User Session Handling**
   - Restore user preferences and settings from previous visits
   - Manage authentication state across cache boundaries
   - Recover form data for users navigating back to a page

4. **Analytics & Monitoring**
   - Track page visibility state changes
   - Monitor whether pages are accessed from cache
   - Measure user navigation patterns

5. **Application State Restoration**
   - Reinitialize components that don't persist through caching
   - Restore scroll position and form state
   - Re-establish WebSocket or other persistent connections

### Benefits

- **Performance**: Enable aggressive back/forward caching for faster navigation
- **User Experience**: Provide seamless page transitions with proper state restoration
- **Browser Optimization**: Work with browser caching mechanisms efficiently
- **Progressive Enhancement**: Enhance applications that rely on dynamic state

## Browser Support

| Browser | First Supported Version | Current Support |
|---------|------------------------|-----------------|
| **Chrome** | 4 | ✅ Yes (146+) |
| **Edge** | 12 | ✅ Yes (143+) |
| **Firefox** | 2 | ✅ Yes (148+) |
| **Safari** | 5 | ✅ Yes (18.5+) |
| **Opera** | 15 | ✅ Yes (122+) |
| **Internet Explorer** | 11 | ✅ Yes (IE 11 only) |
| **iOS Safari** | 5.0-5.1 | ✅ Yes (26.1+) |
| **Android Browser** | 2.3 | ✅ Yes (142+) |
| **Samsung Internet** | 4 | ✅ Yes (29+) |

### Platform-Specific Support

| Platform | Status | Notes |
|----------|--------|-------|
| **Chrome** | ✅ Full | Supported since v4 |
| **Firefox** | ✅ Full | Supported since v2 |
| **Safari** | ✅ Full | Supported since v5 |
| **Opera** | ✅ Full | Supported since v15 |
| **Edge** | ✅ Full | Supported since v12 |
| **Internet Explorer** | ⚠️ Limited | Only IE 11 |
| **Opera Mini** | ❌ No | Not supported |
| **Mobile Browsers** | ✅ Mostly | Good support across iOS and Android |

### Global Browser Usage

- **Full Support**: 93.6% of browsers
- **Partial Support**: 0%
- **No Support**: 6.4% of browsers

## Usage Examples

### Basic pageshow/pagehide Event Listeners

```javascript
// Listen for pageshow event (includes returning from cache)
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    console.log('Page was restored from back/forward cache');
    // Re-initialize components, restore state, etc.
  } else {
    console.log('Page was freshly loaded');
  }
});

// Listen for pagehide event (including when going to cache)
window.addEventListener('pagehide', function(event) {
  if (event.persisted) {
    console.log('Page is being stored in back/forward cache');
    // Save state that should survive caching
  } else {
    console.log('Page is being unloaded');
  }
});
```

### Handling Back/Forward Cache

```javascript
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // Page was cached - reload critical data
    refreshUserData();
    reinitializeConnections();
  }
});

window.addEventListener('pagehide', function(event) {
  if (event.persisted) {
    // Save important state before caching
    sessionStorage.setItem('appState', JSON.stringify(getAppState()));
  }
});
```

### Managing Resources

```javascript
let videoElement = document.querySelector('video');

window.addEventListener('pagehide', function(event) {
  if (event.persisted) {
    // Pause but don't stop video for faster resume
    videoElement.pause();
  }
});

window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // Resume playback
    videoElement.play();
  }
});
```

### Form State Restoration

```javascript
const form = document.querySelector('form');
const stateKey = 'formState_' + window.location.href;

window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    const savedState = sessionStorage.getItem(stateKey);
    if (savedState) {
      const state = JSON.parse(savedState);
      Object.keys(state).forEach(fieldName => {
        const field = form.elements[fieldName];
        if (field) field.value = state[fieldName];
      });
    }
  }
});

window.addEventListener('pagehide', function(event) {
  if (event.persisted) {
    const formData = new FormData(form);
    const state = Object.fromEntries(formData);
    sessionStorage.setItem(stateKey, JSON.stringify(state));
  }
});
```

## Event Properties

### PageTransitionEvent Interface

```javascript
interface PageTransitionEvent : Event {
  readonly attribute boolean persisted;
}
```

**Properties**:

- **`persisted`** (boolean, read-only)
  - `true`: Page was retrieved from the back/forward cache
  - `false`: Page was freshly loaded from the network
  - Critical for determining appropriate action on page restoration

## Notes

The `persisted` property on the PageTransitionEvent is the key mechanism for handling back/forward cache scenarios. Developers can examine this property to determine whether a page was cached or freshly loaded, and choose to:

- Reload the page entirely if needed
- Restore application state from stored data
- Resume background operations
- Re-establish connections

This enables optimal user experience while working efficiently with browser caching mechanisms.

### Important Considerations

1. **Not all pages are eligible for back/forward caching** - Some conditions prevent caching:
   - Unload handlers attached
   - Service Workers that don't meet certain criteria
   - Active WebSockets or other persistent connections
   - Certain security-sensitive operations

2. **State Restoration** - Applications relying on `pageshow` should ensure they can gracefully handle both cached and non-cached scenarios

3. **Performance** - Back/forward cache can provide up to 10x faster page restoration compared to full reload

4. **Cross-domain Navigation** - Different origins have separate cache entries

## Related Resources

### Official Documentation

- [MDN Web Docs - pageshow Event](https://developer.mozilla.org/en-US/docs/Web/Events/pageshow)
- [HTML5 onpageshow Event Attribute](https://www.w3schools.com/tags/ev_onpageshow.asp)

### In-Depth Guides

- [Web.dev - Back/forward Cache](https://web.dev/bfcache/)
- [Google Docs - Back/forward cache: web-exposed behaviour](https://docs.google.com/document/d/1JtDCN9A_1UBlDuwkjn1HWxdhQ1H2un9K4kyPLgBqJUc)
- [Google Docs - Back-forward cache on Android](https://docs.google.com/document/d/1E7LY4HxkJxIjNt9PJIq5vKtNh6hB0PCTzENGkoYAbgA)

## Related APIs

- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History)
- [Unload Events](https://developer.mozilla.org/en-US/docs/Web/Events/unload)
- [visibilitychange Event](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)
- [pagehide Event](https://developer.mozilla.org/en-US/docs/Web/Events/pagehide)

## Implementation Notes

- Page Transition Events are part of the core web platform and widely supported across browsers
- The `persisted` property is essential for differentiating between cache restoration and fresh page loads
- Modern browsers increasingly implement back/forward cache, making these events more important for optimal UX
- Best practices recommend always checking the `persisted` property in `pageshow` handlers

## Last Updated

Based on CanIUse data with 93.6% global browser support.
