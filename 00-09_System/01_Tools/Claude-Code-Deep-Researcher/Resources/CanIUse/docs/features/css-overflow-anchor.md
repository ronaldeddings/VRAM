# CSS Overflow Anchor (Scroll Anchoring)

## Overview

**CSS Overflow Anchor**, also known as **Scroll Anchoring**, is a web platform feature that improves user experience by preventing unwanted page shifts during scrolling. The `overflow-anchor` CSS property allows developers to stabilize the scroll position when DOM content changes above the visible area of a scrolling container.

By default, `overflow-anchor: auto` automatically tracks the position of an anchor node and adjusts the scroll offset accordingly, eliminating the jarring experience of content jumping while users are reading.

## Specification

- **Status**: Working Draft (WD)
- **Spec URL**: [W3C CSS Scroll Anchoring Specification](https://w3c.github.io/csswg-drafts/css-scroll-anchoring/)
- **Category**: CSS3

## Key Concepts

### What is Scroll Anchoring?

Scroll anchoring addresses a common problem: when DOM elements above the visible viewport are inserted, removed, or resized, the browser's scroll position remains anchored to the same pixel coordinate rather than the same content. This causes the visible content to shift unexpectedly, disrupting the user's reading or interaction flow.

### How It Works

When `overflow-anchor` is set to `auto` (the default):

1. The browser selects an anchor node within the scrolling container
2. As content changes above the anchor, the browser calculates the offset adjustment
3. The scroll position is automatically adjusted to keep the anchor node in view
4. Users remain focused on their intended content without jarring jumps

### Property Values

- **`auto`** (default): Enables automatic scroll anchoring to stabilize the scroll position
- **`none`**: Disables scroll anchoring for the element and its descendants

## Benefits and Use Cases

### User Experience Improvements

- **Prevents Content Jump**: Eliminates the disorienting scroll jumps when ads, notifications, or dynamic content loads above the fold
- **Maintains Reading Flow**: Users can continue reading without having to re-locate their position on the page
- **Reduces Cognitive Load**: Eliminates the mental effort required to track where you were after a layout shift
- **Improves Accessibility**: Benefits users with vestibular disorders who are sensitive to sudden motion

### Common Use Cases

1. **News Feeds & Social Media**: Prevents scroll position shifts when new posts load at the top
2. **Live Updating Content**: Maintains scroll position when real-time updates inject content above the viewport
3. **Lazy-Loaded Images**: Keeps users focused on content when images above load and push content down
4. **Dynamic Ads & Notifications**: Stabilizes scroll when advertisement or notification UI elements appear
5. **Progressive Content Loading**: Ensures smooth experience when content progressively renders above the fold

## Browser Support

### First Version with Full Support by Browser

| Browser | First Support | Version | Support Status |
|---------|---------------|---------|---|
| **Chrome** | Chrome 56 | ✅ Supported | Full support since 2017 |
| **Edge** | Edge 79 (Chromium) | ✅ Supported | Full support since 2020 |
| **Firefox** | Firefox 66 | ✅ Supported | Full support since 2019 |
| **Opera** | Opera 43 | ✅ Supported | Full support since 2016 |
| **Safari** | Not Supported | ❌ No support | WebKit bug #171099 tracking support |
| **iOS Safari** | Not Supported | ❌ No support | Pending WebKit implementation |

### Mobile Browser Support

| Browser | Status | First Version |
|---------|--------|---|
| **Android Browser** | ✅ Supported | 142+ |
| **Chrome Android** | ✅ Supported | 142+ |
| **Firefox Android** | ✅ Supported | 144+ |
| **Samsung Internet** | ✅ Supported | 5.0+ |
| **Opera Mobile** | ✅ Supported | 80+ |
| **Opera Mini** | ❌ Not Supported | All versions |
| **UC Browser** | ✅ Supported | 15.5+ |
| **Baidu Browser** | ✅ Supported | 13.52+ |
| **QQ Browser** | ✅ Supported | 14.9+ |
| **KaiOS** | ✅ Supported | 3.0-3.1 |

### Global Usage Statistics

- **Users with Support**: 82.32%
- **Partial Support**: 0%
- **No Support**: 17.68%

## Current Implementation Status

### Well Supported

- Chromium-based browsers (Chrome, Edge, Opera, Samsung Internet)
- Firefox
- Most Android browsers
- Alternative browsers (UC, Baidu, QQ)

### Not Yet Supported

- Safari (desktop and iOS)
  - Tracked in WebKit bug [#171099](https://bugs.webkit.org/show_bug.cgi?id=171099)
  - Safari and iOS Safari are the primary gaps in browser coverage

### Recommended Approach

Since Safari does not support scroll anchoring, developers should:

1. **Use as Progressive Enhancement**: Implement scroll anchoring for browsers that support it
2. **Fallback Strategy**: Ensure graceful degradation for unsupported browsers
3. **Monitor WebKit Support**: Track the WebKit bug for future Safari implementation
4. **Alternative Solutions**: Consider JavaScript-based scroll restoration for full cross-browser support

## CSS Property Reference

### Basic Usage

```css
/* Enable automatic scroll anchoring (default) */
.scrollable-container {
  overflow-anchor: auto;
}

/* Disable scroll anchoring for an element */
.scrollable-container {
  overflow-anchor: none;
}

/* Disable for specific children */
.scrollable-container > .dynamic-content {
  overflow-anchor: none;
}
```

### Practical Example

```html
<style>
  body {
    overflow-anchor: auto; /* Default - enables scroll anchoring */
  }

  /* Prevent ads from being anchor nodes */
  .advertisement {
    overflow-anchor: none;
  }

  /* Disable anchoring in real-time feeds to maintain scroll */
  .live-feed {
    overflow-anchor: none;
  }

  /* Enable for stable content areas */
  .article-content {
    overflow-anchor: auto;
  }
</style>

<main class="article-content">
  <h1>Article Title</h1>
  <p>User reads this content...</p>
</main>

<aside class="advertisement">
  <!-- Ad loads here without shifting content -->
</aside>
```

## Known Issues and Limitations

- **No known bugs** reported in the current implementation
- WebKit/Safari support is still in development
- Some JavaScript libraries may interfere with scroll anchoring behavior

## Related Features and Resources

### Official Resources

- **[W3C Scroll Anchoring Specification](https://w3c.github.io/csswg-drafts/css-scroll-anchoring/)** - Official standard document
- **[WICG Explainer Document](https://github.com/WICG/ScrollAnchoring/blob/master/explainer.md)** - Technical overview and design rationale
- **[Google Developers Article](https://developers.google.com/web/updates/2016/04/scroll-anchoring)** - Implementation guide and best practices

### Related CSS Properties

- `overflow` - Controls scrollable content display
- `scroll-behavior` - Defines smooth vs. instant scrolling animation
- `scroll-margin` - Adjusts the optimal viewing region
- `scroll-snap-*` - Snap scrolling to specific positions

### Related Web APIs

- `Element.scrollTop` / `Element.scrollLeft` - JavaScript scroll position control
- `Element.scrollIntoView()` - Scroll element into view
- `ScrollRestoration` - History API for scroll position management

## Related Specifications

- [CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/)
- [CSSOM View Module](https://www.w3.org/TR/cssom-view-1/) - Scroll position APIs
- [History API](https://html.spec.whatwg.org/multipage/history.html) - Scroll restoration

## Testing and Feature Detection

### Check Browser Support

```javascript
// Feature detection
const supportsScrollAnchoring = () => {
  const element = document.createElement('div');
  return 'overflowAnchor' in element.style;
};

if (supportsScrollAnchoring()) {
  console.log('Scroll anchoring is supported');
} else {
  console.log('Use fallback scroll restoration');
}
```

### Progressive Enhancement

```javascript
// Graceful fallback for browsers without scroll anchoring
if (!supportsScrollAnchoring()) {
  // Implement JavaScript-based scroll position tracking
  const scrollPositions = new Map();

  const saveScrollPosition = (id) => {
    scrollPositions.set(id, window.scrollY);
  };

  const restoreScrollPosition = (id) => {
    const pos = scrollPositions.get(id);
    if (pos !== undefined) {
      window.scrollTo(0, pos);
    }
  };
}
```

## Performance Considerations

- **Zero Runtime Overhead**: Scroll anchoring is handled natively by the browser
- **Automatic**: Requires no JavaScript or manual management
- **Efficient**: Uses minimal CPU and memory resources
- **Battery Friendly**: No impact on mobile device battery life

## Accessibility Impact

- **Positive**: Helps users with vestibular disorders who experience motion sickness from unexpected layout shifts
- **Assistive Technology**: Screen readers and navigation utilities benefit from stable scroll positions
- **Cognitive Load**: Reduces mental effort for users with cognitive disabilities tracking content position

## Browser Vendor Status

### Chrome/Chromium
- **Status**: Fully Implemented
- **Since**: Version 56 (October 2016)
- **Platform**: Desktop and Android

### Firefox
- **Status**: Fully Implemented
- **Since**: Version 66 (February 2019)
- **Platform**: Desktop and Android

### Edge (Chromium)
- **Status**: Fully Implemented
- **Since**: Version 79 (January 2020)
- **Platform**: Desktop and Android

### Opera
- **Status**: Fully Implemented
- **Since**: Version 43 (December 2016)
- **Platform**: Desktop and Android

### Safari
- **Status**: Under Development
- **Tracking**: [WebKit Bug #171099](https://bugs.webkit.org/show_bug.cgi?id=171099)
- **Platform**: macOS and iOS awaiting implementation

## Migration and Adoption

### For Web Developers

1. **Default Behavior**: No action required - `overflow-anchor: auto` is the default
2. **Opt-Out**: Use `overflow-anchor: none` only when scroll anchoring causes issues
3. **Testing**: Verify scroll behavior when content dynamically loads
4. **Fallback**: For critical applications, implement JavaScript scroll restoration for Safari support

### Best Practices

- Use `overflow-anchor: auto` on main scrolling containers
- Apply `overflow-anchor: none` to dynamic content that shouldn't trigger anchoring
- Test with real content loading patterns (ads, notifications, images)
- Provide JavaScript fallback for content critical to your audience

## Conclusion

CSS Overflow Anchor (Scroll Anchoring) is a mature, well-supported feature that significantly improves user experience by preventing disorienting scroll shifts. With support from all major browsers except Safari, it should be the default choice for modern web applications. The feature works transparently without requiring any JavaScript, making it an efficient and accessible solution for stabilizing scroll positions in dynamic content environments.

For applications that need to support Safari users, implement JavaScript-based scroll position restoration as a fallback while monitoring progress on WebKit support.
