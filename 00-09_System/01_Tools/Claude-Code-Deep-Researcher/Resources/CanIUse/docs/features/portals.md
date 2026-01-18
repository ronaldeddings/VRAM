# Portals

## Overview

The Portals API enables seamless navigation between different sites or pages on the web. It introduces a new `<portal>` element (similar to an iframe) that allows a new page to be loaded as an inset component, which can then be seamlessly transitioned to when "activated."

## Description

Portals provide a powerful way to create smooth, integrated navigation experiences. Instead of traditional page navigation that requires a full reload, portals allow you to load and preview another page within the current page context, then transition to it seamlessly when the user is ready.

### Key Capabilities

- **Seamless Navigation**: Transition from one page to another without jarring page reloads
- **Portal Element**: Use the `<portal>` element to embed another page similar to an iframe
- **Activation**: Activate a loaded portal to make it the main browsing context
- **HTML5 Integration**: Fully integrated with modern HTML and JavaScript APIs

## Specification Status

**Status**: Unofficial/Incubating (WICG)

The Portals API is currently in the Web Incubation Community Group (WICG) phase and is not yet an official W3C standard. This means the specification is still under active development and subject to change.

- **Specification URL**: [WICG Portals](https://wicg.github.io/portals/)

## Categories

- HTML5
- JS API

## Benefits and Use Cases

### Enhanced User Experience
- **Seamless Page Transitions**: Create smooth, app-like navigation experiences
- **Faster Perceived Performance**: Preview and pre-render content before navigation
- **Reduced Visual Disruption**: Eliminate the visual "flash" of traditional page reloads

### Practical Applications
- **Single Page Application (SPA) Enhancement**: Improved navigation within SPAs
- **Portal-Based Navigation**: Build navigation UI that shows previews before committing to navigation
- **Progressive Enhancement**: Layer portals on top of traditional navigation for better UX
- **Content Previews**: Show a preview of the next page before full navigation
- **Search Result Pages**: Display previews of search results as the user explores

## Browser Support

| Browser | Support Status | Version(s) | Notes |
|---------|---|---|---|
| **Chrome** | Experimental | 75+ | Behind flag (`#enable-portals`) and origin trial (Chrome 85+) |
| **Edge** | Experimental | 85+ | Behind flag (`#edge://flags/#enable-portals`) and origin trial |
| **Firefox** | Not Supported | N/A | Not implemented |
| **Safari** | Not Supported | N/A | Not implemented |
| **Opera** | Experimental | 62+ | Behind flag, similar to Chrome |
| **iOS Safari** | Not Supported | N/A | Not implemented |
| **Android Chrome** | Experimental | 142 | Behind flag and origin trial |
| **Android Firefox** | Not Supported | 144 | Not implemented |
| **Samsung Internet** | Not Supported | N/A | Not implemented |

### Implementation Status Legend

- **n** - Not supported
- **n d** - Not supported but available through experimental features
- **#1** - Available when registered for [origin trial](https://web.dev/hands-on-portals/#register-for-ot)
- **#2** - Available by enabling the `#enable-portals` flag

## Enabling Portals

### For Chrome/Chromium-Based Browsers

1. **Using the Experimental Flag**:
   - Navigate to `chrome://flags/`
   - Search for "enable-portals"
   - Set the flag to "Enabled"
   - Restart your browser

2. **Using Origin Trial** (For Registered Origins):
   - Register your origin at the [Chrome Origin Trials](https://developer.chrome.google.com/origintrials/)
   - Add the provided token to your page's `<head>`

### For Edge

1. Navigate to `edge://flags/`
2. Search for "enable-portals"
3. Set the flag to "Enabled"
4. Restart your browser

### For Opera

1. Navigate to `opera://flags/`
2. Search for "enable-portals"
3. Set the flag to "Enabled"
4. Restart your browser

## Usage Example

```html
<!-- HTML -->
<portal id="next-page" src="/next-page.html"></portal>

<button onclick="activatePortal()">Go to Next Page</button>

<script>
  function activatePortal() {
    const portal = document.querySelector('#next-page');

    if (portal) {
      // Activate the portal - this transitions the portal to become
      // the main browsing context
      portal.activate();
    } else {
      // Fallback for browsers without portal support
      window.location.href = '/next-page.html';
    }
  }

  // Listen for portal activation events
  window.addEventListener('portalactivate', (event) => {
    // Handle page restoration after being activated
    // This is called when the page is activated from a portal
  });
</script>
```

### JavaScript API

```javascript
// Get a portal element
const portal = document.querySelector('portal');

// Check if portals are supported
if ('HTMLPortalElement' in window) {
  console.log('Portals are supported');
}

// Activate a portal
portal.activate();

// Post message to portal
portal.postMessage({ greeting: 'Hello from parent' }, '*');

// Listen to messages from portal
window.addEventListener('message', (e) => {
  console.log('Message from portal:', e.data);
});
```

## Technical Notes

### Current Implementation Status

- **Very Limited Support**: Only Chromium-based browsers have experimental support
- **Not Production Ready**: The specification and implementation are still evolving
- **Feature Flags Required**: Users must explicitly enable the feature in browser settings
- **Zero Adoption in Production**: No major websites are currently using this feature

### Considerations

- **No Safari Support**: This is a significant limitation for iOS and macOS users
- **No Firefox Support**: Limits reach to a substantial portion of the user base
- **Experimental Nature**: The API is subject to change without notice
- **Polyfill Not Feasible**: No practical way to polyfill this functionality

### Browser Differences

- **Chrome/Edge/Opera**: Implement most of the specification behind flags
- **Firefox/Safari**: No implementation or public roadmap for implementation

## Related Resources

### Official Documentation
- [Hands-on with Portals: seamless navigation on the Web](https://web.dev/hands-on-portals/)
- [WICG Portals Specification](https://wicg.github.io/portals/)

### Articles and Guides
- Web.dev's comprehensive guide on using Portals for seamless navigation
- MDN Web Docs (when available in your browser)

## Implementation Recommendations

### When to Use Portals

1. **Single Page Applications**: Enhance SPA navigation with portal transitions
2. **Progressive Enhancement**: Layer portals on traditional navigation
3. **Experimental Features**: For progressive web apps willing to use experimental APIs
4. **Chromium-First Audiences**: When your user base primarily uses Chrome/Edge

### When NOT to Use Portals

1. **Production Critical Features**: Too unstable for core functionality
2. **Cross-Browser Requirement**: Needed for Safari or Firefox support
3. **Mobile-First Applications**: Limited mobile support
4. **Requiring iOS Support**: No iOS Safari implementation

### Progressive Enhancement Strategy

```javascript
// Always include a fallback mechanism
function navigate(url) {
  const portal = document.querySelector('portal');

  if (portal && 'activate' in portal) {
    portal.src = url;
    portal.activate();
  } else {
    // Fallback to traditional navigation
    window.location.href = url;
  }
}
```

## Standards and Compliance

- **Standards Status**: Unofficial specification (WICG incubation phase)
- **Standards Body**: Web Incubation Community Group (WICG)
- **Specification Version**: Latest at [wicg.github.io/portals/](https://wicg.github.io/portals/)

## Accessibility Considerations

When using portals, ensure:
- Keyboard navigation is fully supported
- Screen reader announcements include portal content
- Focus management is properly handled during activation
- ARIA attributes are used appropriately for portal state

## Performance Characteristics

- **Pre-rendering**: Pages can be pre-rendered within portals
- **Memory Impact**: Portals maintain separate DOM trees, increasing memory usage
- **CPU Usage**: Running parallel contexts may increase CPU usage
- **Network**: Resources for portaled pages are downloaded separately

## Future Outlook

The Portals API shows promise for improving web navigation UX, but widespread adoption depends on:

1. **Multi-Browser Implementation**: Especially Firefox and Safari adoption
2. **Standardization**: Moving from WICG to official W3C status
3. **Stability**: API maturation and reduced breaking changes
4. **Use Case Validation**: Real-world success stories demonstrating value

---

**Last Updated**: 2025
**Feature Maturity**: Experimental
**Production Ready**: No
**Recommended**: For experimental/progressive enhancement only
