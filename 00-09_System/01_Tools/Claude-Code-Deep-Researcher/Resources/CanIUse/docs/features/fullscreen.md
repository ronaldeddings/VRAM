# Fullscreen API

## Overview

The **Fullscreen API** enables web content such as videos, canvas elements, or any DOM element to occupy the entire screen, providing an immersive viewing experience for users.

## Description

The Fullscreen API allows developers to programmatically request that an element be displayed in fullscreen mode, similar to pressing F11 in most browsers. This is particularly useful for:

- Video players (streaming services)
- Games and interactive applications
- Presentations and slideshows
- Data visualization dashboards
- Image galleries and lightboxes

## Specification Status

- **Status**: Living Standard
- **Spec URL**: [fullscreen.spec.whatwg.org](https://fullscreen.spec.whatwg.org/)
- **Maintainer**: WHATWG (Web Hypertext Application Technology Working Group)

## Categories

- CSS (pseudo-elements and pseudo-classes)
- JavaScript API

## Key Benefits and Use Cases

### User Experience
- **Immersive Viewing**: Display content without browser UI distractions
- **Presentation Mode**: Full-screen slideshows and presentations
- **Gaming**: Full-screen gameplay without UI elements

### Professional Applications
- **Video Streaming**: Enhanced viewing experience for video platforms
- **Data Analysis**: Full-screen dashboards and data visualization
- **Education**: Interactive educational content presentation

### Content Types
- Video players and streaming services
- Web-based games and gaming platforms
- Interactive presentations and whiteboards
- Image galleries and photo viewers
- Data visualization dashboards

## Browser Support

### Support Key

| Symbol | Meaning |
|--------|---------|
| **y** | Fully supported |
| **a** | Partial support (see notes) |
| **n** | Not supported |
| **x** | Vendor prefix required |

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 15-70 | Partial (a) | Requires prefix, earlier draft spec |
| | 71+ | Full (y) | Fully supported |
| **Firefox** | 2-9 | Not supported | — |
| | 10-63 | Partial (a) | Earlier draft spec, no Promise |
| | 64+ | Full (y) | Fully supported |
| **Safari** | 3.1-5 | Not supported | — |
| | 5.1-15.3 | Partial (a) | Missing `::backdrop`, older syntax |
| | 15.4+ | Full (y) | Fully supported |
| **Edge** | 12-18 | Partial (a) | Vendor prefix required |
| | 79+ | Full (y) | Fully supported (Chromium-based) |
| **Opera** | 9-12 | Not supported | — |
| | 12.1 | Full (y) | Fully supported |
| | 15-63 | Partial (a) | Older implementation |
| | 64+ | Full (y) | Fully supported |
| **Internet Explorer** | 5.5-10 | Not supported | — |
| | 11 | Partial (a) | Multiple limitations (see bugs) |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Safari (iOS)** | 3.2-11.2 | Not supported | — |
| | 11.3-15.3 | Partial (a) | iPad only, overlay button |
| | 15.4+ | Full (y) | Fully supported |
| **Chrome Android** | 142 | Full (y) | Fully supported |
| **Firefox Android** | 144 | Full (y) | Fully supported |
| **Samsung Internet** | 4-9.2 | Partial (a) | Older implementation |
| | 10.1+ | Full (y) | Fully supported |
| **Opera Mobile** | 10-12.1 | Not supported | — |
| | 80+ | Full (y) | Fully supported |
| **UC Browser** | 15.5 | Full (y) | Fully supported |
| **Android UC** | 15.5+ | Full (y) | Fully supported |
| **Android Browser** | 2.1-4.4 | Not supported | — |
| **Blackberry** | 7 | Not supported | — |
| | 10 | Partial (a) | Limited support |
| **KaiOS** | 2.5-3.1 | Full (y) | Fully supported |

### Global Support Statistics

- **Full Support (y)**: 82.98% of users
- **Partial Support (a)**: 9.88% of users
- **No Support (n)**: 7.14% of users

## Implementation Notes

### Partial Support Details

**Note #1**: Earlier draft spec implementation
- Refers to supporting an outdated version of the specification
- Affects: Firefox 10-63, Chrome 15-70, Safari 5.1-15.3

**Note #2**: Missing `::backdrop` pseudo-element
- Implementations support older `:full-screen` syntax instead of `:fullscreen`
- No support for the modern `::backdrop` pseudo-element
- Affects: Chrome 15-70, Safari 5.1-15.3, Opera 15-63, Samsung 4-9.2

**Note #3**: No Promise support
- `requestFullscreen()` does not return a Promise as specified in modern spec
- Methods may use older callback-based approaches
- Affects: IE 11, Edge 12-18, Firefox 10-63, Chrome 15-70

**Note #4**: Unprefixed support behind flag
- Firefox 47-63 requires enabling the `full-screen-api.unprefix.enabled` flag
- Allows testing of unprefixed API before full release

**Note #5**: iPad-only support on iOS
- iOS Safari only supports fullscreen on iPad, not iPhone
- Shows an overlay button that cannot be disabled

## Known Issues and Bugs

### Internet Explorer 11
- Cannot request fullscreen from `keydown` or `pointerdown` events (only `keypress` and `click` work)
- Does not allow scrolling when `document.documentElement` is set to fullscreen
- Does not properly support fullscreen when opening from an iframe

### Safari
- Blocks access to keyboard events in fullscreen mode as a security measure
- Does not support element stacking (only one element can be fullscreen at a time)
- Other fullscreen requests are silently ignored with no error event dispatched

### Legacy Opera
- Uses older `::fullscreen-ancestor` pseudo-class instead of modern `::backdrop` pseudo-element

## Basic Usage Example

```javascript
// Request fullscreen for an element
const element = document.getElementById('video-player');

element.requestFullscreen().then(() => {
  console.log('Element is now fullscreen');
}).catch((err) => {
  console.error(`Error requesting fullscreen: ${err.message}`);
});

// Exit fullscreen
document.exitFullscreen();

// Check if fullscreen is active
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    console.log('Currently in fullscreen mode');
  } else {
    console.log('Exited fullscreen mode');
  }
});
```

## CSS Styling

```css
/* Style an element when in fullscreen */
element:fullscreen {
  width: 100%;
  height: 100%;
  background: #000;
}

/* Style the backdrop behind fullscreen element */
element::backdrop {
  background: rgba(0, 0, 0, 0.8);
}
```

## Vendor Prefixes

For older browser support, use vendor prefixes:

```javascript
// Webkit/Chrome
element.webkitRequestFullscreen?.();

// Firefox
element.mozRequestFullScreen?.();

// Legacy Safari
element.webkitRequestFullScreen?.();

// Exit fullscreen with prefixes
document.webkitExitFullscreen?.();
document.mozCancelFullScreen?.();
document.msExitFullscreen?.();
```

## Related APIs

- **Document.exitFullscreen()**: Exit fullscreen mode
- **Document.fullscreenElement**: Current fullscreen element
- **Document.fullscreenEnabled**: Check if fullscreen is available
- **fullscreenchange event**: Fires when entering/exiting fullscreen
- **fullscreenerror event**: Fires when fullscreen request fails

## Browser Compatibility Recommendations

### For Maximum Compatibility
1. Use feature detection before calling fullscreen API
2. Implement fallback UI for browsers without support
3. Include error handling for failed fullscreen requests
4. Test on target devices before deployment

### Modern Development
- Modern browsers (Chrome 71+, Firefox 64+, Safari 16.4+) have full support
- Consider deprecating older browser support if targeting modern audience
- Use Promise-based API exclusively for new implementations

## Related Resources

### Official Documentation
- [MDN Web Docs - Using Full Screen](https://developer.mozilla.org/en/DOM/Using_full-screen_mode)
- [WebPlatform Docs - requestFullscreen](https://webplatform.github.io/docs/dom/Element/requestFullscreen)
- [WHATWG Fullscreen Specification](https://fullscreen.spec.whatwg.org/)

### Additional Resources
- [Mozilla Hacks - Using the Fullscreen API in Web Browsers](https://hacks.mozilla.org/2012/01/using-the-fullscreen-api-in-web-browsers/)

## Security Considerations

- Fullscreen requests must be triggered by user interaction (clicks, key presses)
- Cannot be triggered programmatically without user action
- Browser may display permission prompts or approval messages
- Keyboard events are restricted in fullscreen mode on some browsers (Safari) for security

## Further Reading

For comprehensive information on the Fullscreen API, browser-specific implementations, and best practices, refer to the official WHATWG specification and MDN Web Docs linked above.
