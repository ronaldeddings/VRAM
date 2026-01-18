# Auxclick Event

## Overview

The **auxclick** event fires when a non-primary button of a pointing device is clicked. This includes middle mouse button clicks, back/forward buttons on some mice, and other auxiliary buttons. It provides developers with a distinct event for handling interactions beyond the standard primary click.

## Specification

| Property | Value |
|----------|-------|
| **Official Name** | Auxclick |
| **Description** | The click event for non-primary buttons of input devices |
| **Specification** | [W3C UI Events - auxclick](https://w3c.github.io/uievents/#event-type-auxclick) |
| **Status** | Working Draft (WD) |
| **Keywords** | `click`, `auxclick`, `non-primary button`, `middle click` |

## Categories

- **DOM** - Document Object Model
- **JS API** - JavaScript Application Programming Interface

## Benefits & Use Cases

### Key Benefits

1. **Distinct Event Handling** - Separates auxiliary button clicks from primary button clicks for more intuitive user interactions
2. **Better Context Menus** - Differentiate between left-click and middle-click behaviors (e.g., open in new tab vs. same tab)
3. **Enhanced UX Control** - Prevent default context menu behavior while allowing custom interactions
4. **Backward Compatibility** - Click events no longer fire for non-primary buttons, reducing confusion and unexpected behaviors

### Common Use Cases

- **Custom Context Menus**: Handle middle-click differently than left-click
- **Tab Navigation**: Open links in new tabs on middle-click
- **Advanced Mouse Gestures**: Implement custom mouse button combinations
- **Accessibility Improvements**: Provide clear, predictable button interaction patterns
- **Content Management Systems**: Different actions for different mouse buttons
- **Web Applications**: Game controls, interactive tools, and desktop-like applications

## Browser Support

### Desktop Browsers

| Browser | First Version | Current Status |
|---------|---------------|---|
| **Chrome** | 55 | ✅ Fully Supported |
| **Edge (Chromium)** | 79 | ✅ Fully Supported |
| **Firefox** | 53 | ✅ Fully Supported (with note) |
| **Opera** | 42 | ✅ Fully Supported |
| **Safari** | 18.2 | ✅ Fully Supported |
| **Internet Explorer** | Not Supported | ❌ No Support |

### Mobile Browsers

| Browser | First Version | Current Status |
|---------|---------------|---|
| **iOS Safari** | 18.2 | ✅ Fully Supported |
| **Android Chrome** | 142 | ✅ Fully Supported |
| **Android Firefox** | 144 | ✅ Fully Supported |
| **Opera Mobile** | 80 | ✅ Fully Supported |
| **Samsung Internet** | 5.0 | ✅ Fully Supported |
| **Opera Mini** | All Versions | ❌ No Support |

### Global Support

- **Global Usage**: 90.25% of browsers globally support this feature
- **IE/Legacy**: Internet Explorer versions 5.5-11 do not support auxclick
- **Modern Browsers**: All modern versions of Chrome, Firefox, Edge, and Safari support this feature

## Technical Notes

### Important Compatibility Notes

- **Firefox Behavior**: As a compatibility measure, Firefox continues to fire the `click` event for document and window level event handlers, even for non-primary buttons. This is a documented exception to the specification.

- **Click Event Change**: With the introduction of the auxclick event, the `click` event is no longer fired for non-primary buttons. This represents a significant behavior change from earlier browser implementations.

- **No Known Bugs**: There are currently no documented bugs for this feature.

## Practical Implementation

### Basic Usage

```javascript
// Listen for auxclick event
element.addEventListener('auxclick', (event) => {
  // event.button identifies which button was clicked
  // 0 = primary (left), 1 = wheel (middle), 2 = secondary (right)

  if (event.button === 1) {
    // Handle middle-click
    console.log('Middle button clicked');
    event.preventDefault();
  }
});
```

### Common Patterns

```javascript
// Open link in new tab on middle-click
document.addEventListener('auxclick', (event) => {
  if (event.target.tagName === 'A' && event.button === 1) {
    window.open(event.target.href, '_blank');
    event.preventDefault();
  }
});

// Custom behavior on right-click button
element.addEventListener('auxclick', (event) => {
  if (event.button === 2) {
    // Handle secondary button (right-click)
    showCustomMenu(event);
  }
});
```

## Browser Compatibility Chart

### Support Matrix by Version

**Desktop Browsers:**
- Chrome 55+ ✅
- Firefox 53+ ✅ (with compatibility note)
- Edge 79+ ✅
- Opera 42+ ✅
- Safari 18.2+ ✅

**Mobile Browsers:**
- iOS Safari 18.2+ ✅
- Android Chrome 142+ ✅
- Android Firefox 144+ ✅
- Samsung Internet 5.0+ ✅

**Unsupported:**
- Internet Explorer (all versions) ❌
- Opera Mini (all versions) ❌
- BlackBerry Browser ❌

## Related Features & Resources

### Official Resources

- [MDN Web Docs - auxclick Event](https://developer.mozilla.org/en-US/docs/Web/Events/auxclick)
- [W3C UI Events Specification](https://w3c.github.io/uievents/#event-type-auxclick)
- [Original WICG Proposal](https://wicg.github.io/auxclick/)

### Implementation References

- [Firefox Implementation Discussion](https://bugzilla.mozilla.org/show_bug.cgi?id=1304044)
- [WebKit Implementation Status](https://bugs.webkit.org/show_bug.cgi?id=22382)

### Related Events

- `click` - Fires when primary button is clicked
- `mousedown` / `mouseup` - Lower-level mouse button events
- `contextmenu` - Fires when context menu is invoked (typically right-click)
- `pointerdown` / `pointerup` - Modern pointer event alternatives

## Migration Guide from `click` Event

If you were previously checking `event.button` in click handlers to filter non-primary clicks:

```javascript
// Old approach (less clear)
element.addEventListener('click', (event) => {
  if (event.button !== 0) return;
  handlePrimaryClick();
});

// New approach (clearer separation)
element.addEventListener('click', (event) => {
  handlePrimaryClick(); // Always primary button
});

element.addEventListener('auxclick', (event) => {
  handleNonPrimaryClick(event.button);
});
```

## Summary

The auxclick event is a well-established feature with excellent browser support across modern platforms. It enables more intuitive mouse button handling by providing a dedicated event for non-primary mouse buttons, improving both user experience and code clarity. With 90% global browser support and adoption across all major rendering engines, it's a reliable feature for implementing sophisticated click-based interactions.

**Recommendation**: Use auxclick for any application requiring distinct handling of auxiliary mouse buttons. Fall back to checking `event.button` in click handlers for legacy browser support if needed.
