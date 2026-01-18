# MutationObserver API

## Overview

The **MutationObserver** interface provides a method for observing and reacting to changes to the DOM (Document Object Model). It replaces the deprecated `MutationEvents` API, offering a more efficient and performant way to monitor DOM modifications.

## Description

MutationObserver enables developers to execute a callback function whenever specified DOM mutations occur on a target node and its subtree. This includes:

- Changes to child nodes (additions or removals)
- Changes to attributes
- Changes to text content and character data

This API is more efficient than the deprecated MutationEvents because it batches mutations and fires callbacks asynchronously after all mutations have occurred, reducing performance overhead.

## Specification Status

**Status**: Living Standard (LS)

**Specification**: [DOM Specification - Mutation Observers](https://dom.spec.whatwg.org/#mutation-observers)

The MutationObserver API is part of the WHATWG DOM specification and is considered a stable, living standard with broad browser support and continued development.

## Categories

- **DOM** - Core DOM manipulation and observation
- **JS API** - JavaScript Web APIs

## Key Benefits & Use Cases

### Benefits

- **Performance**: Efficient observation of DOM changes without blocking other operations
- **Simplicity**: Cleaner syntax compared to deprecated MutationEvents
- **Flexibility**: Watch for specific mutation types (childList, attributes, characterData)
- **Subtree Monitoring**: Observe changes across entire DOM subtrees
- **Asynchronous**: Batched, asynchronous callbacks prevent performance degradation

### Common Use Cases

- **UI Framework Integration**: Detecting when external code modifies the DOM
- **Dynamic Content Monitoring**: Observing changes to user-generated or loaded content
- **Component Lifecycle Tracking**: Monitoring addition/removal of custom elements
- **Accessibility Updates**: Detecting changes that need accessibility announcements
- **Data Binding**: Implementing reactive systems that respond to DOM mutations
- **Plugin Systems**: Monitoring DOM for third-party plugin additions
- **Testing Frameworks**: Verifying expected DOM changes in automated tests
- **Polyfills & Shims**: Implementing frameworks or libraries that depend on DOM observation

## Browser Support

| Browser | Status | First Support Version | Notes |
|---------|--------|----------------------|-------|
| **Chrome** | ✅ Full Support | v18 (prefixed as `-webkit-`), v27 (unprefixed) | WebKit prefix in v18-25, fully supported from v27+ |
| **Edge** | ✅ Full Support | v12 | Complete support across all versions |
| **Firefox** | ✅ Full Support | v14 | Consistent support from v14+ |
| **Safari** | ✅ Full Support | v6 (prefixed), v6.1 (unprefixed) | WebKit prefix in v6, unprefixed from v6.1+ |
| **Opera** | ✅ Full Support | v15 | Full support from v15+ |
| **IE** | ⚠️ Partial/Limited | IE11 (full), IE9-10 (prefixed) | IE9-10: prefixed as `-ms-`, IE11: full support with bugs |
| **iOS Safari** | ✅ Full Support | v6 (prefixed), v6.1+ (unprefixed) | WebKit prefix in v6, unprefixed from v7+ |
| **Android** | ✅ Full Support | v4.4 | Partial support (prefixed) in v4-4.3, full from v4.4+ |
| **Opera Mini** | ❌ No Support | N/A | Not supported in any version |
| **BlackBerry** | ✅ Full Support | v10 | Full support from v10+ |
| **Samsung Internet** | ✅ Full Support | v4 | Consistent support from v4+ |
| **UC Browser** | ✅ Full Support | v15.5 | Full support from v15.5+ |
| **Android Chrome** | ✅ Full Support | v142 | Full support in current versions |
| **Android Firefox** | ✅ Full Support | v144 | Full support in current versions |

### Global Coverage

- **Usage Percentage (Full Support)**: 93.54% of global users
- **Usage Percentage (Partial Support)**: 0% (no meaningful partial support)
- **Estimated Coverage**: Suitable for production use on modern browsers

### Browser-Specific Notes

- **Chrome/Blink Browsers**: Fully supported without prefix from v27+
- **Safari/WebKit Browsers**: Requires `-webkit-` prefix in Safari v6, fully unprefixed from v6.1+
- **Firefox**: Stable support from v14 onwards with no known issues
- **Internet Explorer**: Limited support (IE11 has full API support with bugs)
- **Opera Mini**: Completely unsupported

## Known Issues & Workarounds

### iOS 6 WebKit Bug
**Browser**: iOS 6 Safari with `WebKitMutationObserver`

**Issue**: The observer doesn't trigger `childList` changes until one of the deprecated mutation events (e.g., `DOMNodeInserted`) is bound to the observed node.

**Workaround**: For iOS 6 specifically, you may need to bind a deprecated mutation event listener as a compatibility measure, though this is only necessary for very old iOS versions.

### Internet Explorer 11 Bug
**Browser**: IE11

**Issue**: When removing child nodes via `innerHTML` modification, removed nodes are not included in the `MutationObserver` callback's `removedNodes` collection.

**Reference**: [Microsoft Connect Feedback](https://connect.microsoft.com/IE/feedback/details/817132/ie-11-childnodes-are-missing-from-mutationobserver-mutations-removednodes-after-setting-innerhtml)

**Workaround**:
- Store references to child nodes before modifying `innerHTML`
- Use alternative DOM manipulation methods like `removeChild()`
- Verify removed node lists when supporting IE11

### WebKit innerHTML Behavior
**Browsers**: Safari and Chrome (WebKit-based)

**Issue**: When replacing `innerHTML` content resulting in a different single `CharacterData` node, WebKit considers it a `characterData` mutation of the child, while other browsers consider it a `childList` mutation of the parent.

**Workaround**: Handle both mutation types in your observer callback when supporting both WebKit and non-WebKit browsers.

## Implementation Notes

### Basic Usage Pattern

```javascript
// Create a MutationObserver instance
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log(mutation.type); // 'attributes', 'childList', 'characterData'
  });
});

// Configure and start observing
const config = {
  attributes: true,           // Watch attribute changes
  childList: true,            // Watch child node additions/removals
  characterData: true,        // Watch text content changes
  subtree: true,              // Watch entire subtree
  attributeFilter: ['data-id'], // Only watch specific attributes
};

observer.observe(targetElement, config);

// Later, stop observing
observer.disconnect();
```

### Prefix Handling

For broader browser compatibility, particularly with older WebKit browsers:

```javascript
const MutationObserverConstructor = window.MutationObserver ||
                                    window.WebKitMutationObserver ||
                                    window.MozMutationObserver;
```

However, this is largely unnecessary for modern development as unprefixed support is ubiquitous.

## Related Resources

### Official Documentation
- [MDN: MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [WHATWG DOM Specification](https://dom.spec.whatwg.org/#mutation-observers)

### Polyfills & Alternatives
- [WebComponents Polyfill](https://github.com/webcomponents/webcomponentsjs) - Includes MutationObserver polyfill support

### Related APIs
- **Deprecated**: `MutationEvents` (use MutationObserver instead)
- **Related**: `ResizeObserver` - For observing element size changes
- **Related**: `IntersectionObserver` - For observing element visibility

## Browser Compatibility Summary

| Support Level | Browser Versions |
|---------------|------------------|
| ✅ Full Support | Chrome 27+, Edge 12+, Firefox 14+, Safari 6.1+, Opera 15+, iOS 7+, Android 4.4+, Samsung 4+ |
| ⚠️ Prefixed Support | Chrome 18-25 (`-webkit-`), Safari 6 (`-webkit-`), iOS 6 (`-webkit-`) |
| ⚠️ Limited/Buggy | IE9-10 (prefixed), IE11 (full but with bugs) |
| ❌ No Support | Opera Mini, IE versions below 9 |

## Recommendation

The MutationObserver API is safe for production use in modern applications targeting current browsers. For applications requiring IE9-10 support, consider using polyfills or feature detection. The high global usage percentage (93.54%) indicates widespread browser support.

If targeting older browsers, ensure adequate fallback strategies or use polyfill libraries like WebComponentsJS to provide MutationObserver functionality.

---

*Last Updated: December 2025*
*Source: Can I Use - MutationObserver Feature*
