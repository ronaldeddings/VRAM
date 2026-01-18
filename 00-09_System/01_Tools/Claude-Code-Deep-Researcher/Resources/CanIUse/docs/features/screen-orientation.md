# Screen Orientation API

## Overview

The **Screen Orientation API** provides the ability to read the screen orientation state, receive notifications when the orientation changes, and programmatically lock the screen orientation to a specific state. This is particularly useful for mobile and responsive web applications that need to adapt their layout or behavior based on device orientation.

## Specification Details

- **Official Specification**: [W3C Screen Orientation Specification](https://www.w3.org/TR/screen-orientation/)
- **Specification Status**: Working Draft (WD)
- **Category**: JavaScript API

## Description

The Screen Orientation API enables developers to:

1. **Read the current orientation**: Determine whether the device is in portrait, landscape, or other orientation modes
2. **Listen for orientation changes**: Respond to user-initiated or system-driven orientation changes
3. **Lock orientation**: Programmatically restrict the screen to a specific orientation (when permitted by the user/system)
4. **Unlock orientation**: Allow the device to return to its default orientation behavior

## Key Use Cases

- **Responsive Web Applications**: Adapt layout and user experience based on device orientation
- **Full-Screen Media Players**: Lock orientation for video playback
- **Games**: Maintain specific orientation during gameplay
- **Forms and Data Entry**: Optimize form layouts for the current orientation
- **Web-Based Presentations**: Control screen orientation during slideshow mode
- **Immersive Web Experiences**: Maintain orientation lock for AR/VR-like experiences

## Browser Support

### Desktop Browsers

| Browser | Support Status | Version Details |
|---------|---|---|
| **Chrome** | ✅ Full Support | 38+ |
| **Edge** | ✅ Full Support | 79+ |
| **Firefox** | ✅ Full Support | 44+ |
| **Safari** | ✅ Full Support | 16.4+ |
| **Opera** | ✅ Full Support | 25+ |
| **Internet Explorer** | ❌ Not Supported | - |

### Mobile Browsers

| Browser | Support Status | Version Details |
|---------|---|---|
| **Chrome for Android** | ✅ Full Support | 142+ |
| **Firefox for Android** | ✅ Full Support | 144+ |
| **Safari on iOS** | ✅ Full Support | 16.4+ |
| **Samsung Internet** | ✅ Full Support | 5.0+ |
| **Opera Mobile** | ✅ Full Support | 80+ |
| **Opera Mini** | ❌ Not Supported | - |
| **Android Browser** | ❌ Not Supported | - |
| **UC Browser** | ✅ Full Support | 15.5+ |
| **Baidu Browser** | ✅ Full Support | 13.52+ |
| **QQ Browser (Android)** | ✅ Full Support | 14.9+ |
| **KaiOS** | ✅ Full Support | 2.5+ |

### Overall Coverage

- **Full Support (y)**: 91.62% of global browser usage
- **Partial Support (a)**: 0.37% of global browser usage

## Implementation Notes

### Important Distinctions

The specification has undergone significant changes since earlier drafts. When reviewing documentation or examples, be aware of:

- **Older Draft**: Used `screen.lockOrientation()` and `screen.unlockOrientation()` methods
- **Current Specification**: Uses `screen.orientation.lock()` method instead

Partial support in older browsers typically refers to implementations based on earlier versions of the draft specification.

### Platform-Specific Notes

- **Internet Explorer 11**: No support on Windows 7 (IE 11 on Windows 8+ has partial support using older API)
- **iOS Safari**: Minimum version 16.4 required for full support
- **Firefox**: Minimum version 44 required for full support

## Basic Usage Example

```javascript
// Check current orientation
console.log(screen.orientation.type); // "landscape" or "portrait"

// Listen for orientation changes
window.addEventListener('orientationchange', () => {
  console.log('Orientation changed to:', screen.orientation.type);
});

// Lock to landscape orientation
screen.orientation.lock('landscape').then(() => {
  console.log('Orientation locked to landscape');
}).catch((error) => {
  console.error('Failed to lock orientation:', error);
});

// Lock to portrait orientation
screen.orientation.lock('portrait').then(() => {
  console.log('Orientation locked to portrait');
}).catch((error) => {
  console.error('Failed to lock orientation:', error);
});

// Unlock orientation (allow device rotation)
screen.orientation.unlock();
```

## Feature Detection

```javascript
if (screen.orientation && screen.orientation.lock) {
  // Screen Orientation API is supported
  console.log('Screen Orientation API available');
} else {
  // Fallback for unsupported browsers
  console.log('Screen Orientation API not available');
}
```

## Related Resources

- **[MDN Web Docs - Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Screen.orientation)** - Comprehensive documentation and examples
- **[Screen Orientation API Demo](https://www.audero.it/demo/screen-orientation-api-demo.html)** - Interactive demonstration
- **[SitePoint Article - Introducing Screen Orientation API](https://www.sitepoint.com/introducing-screen-orientation-api/)** - Introduction and best practices

## Compatibility Considerations

### High Compatibility Browsers

The following browsers provide excellent support for the Screen Orientation API:
- All modern versions of Chrome (38+)
- All modern versions of Firefox (44+)
- All modern versions of Edge (79+)
- All modern versions of Safari (16.4+)
- All modern versions of Opera (25+)

### Lower Support Areas

- Older desktop browsers (IE, legacy Firefox/Chrome versions)
- Feature phones and legacy mobile devices
- Opera Mini (no support)

### Recommendation

For applications targeting modern browsers, the Screen Orientation API is safe to use with feature detection as a fallback mechanism for older browsers. Always provide graceful degradation for unsupported environments.

## Security and Permissions

- Orientation locking typically requires user interaction or explicit permission
- Fullscreen APIs may need to be engaged before orientation locking is permitted
- Mobile operating systems may have additional restrictions on orientation changes

## See Also

- [MDN: Screen API](https://developer.mozilla.org/en-US/docs/Web/API/Screen)
- [W3C Working Drafts](https://www.w3.org/TR/)
- [Can I Use - Screen Orientation](https://caniuse.com/screen-orientation)

---

**Last Updated**: Based on canIuse data
**Data Source**: CanIUse.com
