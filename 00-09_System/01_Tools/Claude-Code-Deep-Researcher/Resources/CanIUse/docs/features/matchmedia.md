# matchMedia

## Overview

**matchMedia** is a JavaScript API that allows developers to programmatically test whether a CSS media query applies to the document at runtime. It returns a `MediaQueryList` object that can be used to determine and monitor CSS media query conditions dynamically.

## Description

The `window.matchMedia()` method evaluates a media query string and returns a `MediaQueryList` object that represents the results of the media query. This enables responsive web design logic to be implemented in JavaScript, allowing developers to execute code based on media query conditions and respond to changes when viewport conditions are updated.

## Specification Status

**Status**: Working Draft (WD)
**Specification**: [W3C CSSOM View Module - matchMedia](https://www.w3.org/TR/cssom-view/#dom-window-matchmedia)

## Categories

- DOM
- JavaScript API

## Use Cases & Benefits

### Primary Use Cases

1. **Responsive JavaScript Logic**: Execute different JavaScript behavior based on viewport size or media characteristics
2. **Responsive Images & Media**: Dynamically load or swap images and media based on screen resolution and capabilities
3. **Layout Adjustments**: Conditionally apply JavaScript-based layout modifications in response to media query changes
4. **Device Capability Detection**: Detect device features like touch support, color capabilities, or orientation changes
5. **Performance Optimization**: Load or unload features based on device capabilities (e.g., animations on mobile vs desktop)

### Key Benefits

- **Programmatic Media Query Testing**: Test CSS media queries directly in JavaScript without relying on CSS-only media queries
- **Real-time Monitoring**: Use event listeners to respond immediately to media query changes (e.g., window resize, orientation change)
- **Progressive Enhancement**: Build responsive applications that adapt behavior without page reload
- **Accessibility & Performance**: Optimize user experience by adapting to device capabilities
- **Framework Integration**: Essential for modern reactive frameworks to build responsive components

### Common Examples

```javascript
// Test if document matches a media query
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
console.log(darkModeQuery.matches); // true or false

// Listen for changes to media query
const mediaQuery = window.matchMedia('(max-width: 768px)');
mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    console.log('Now in mobile view');
  } else {
    console.log('Now in desktop view');
  }
});

// Test multiple conditions
const largeScreen = window.matchMedia('(min-width: 1200px)');
if (largeScreen.matches) {
  // Initialize desktop-specific features
}
```

## Browser Support

### Global Support Summary

**Overall Support**: 93.63% of users worldwide (as of data collection)

### Support by Browser

| Browser | First Support | Current Status |
|---------|---------------|---|
| **Chrome** | 9 | Full Support (v9+) |
| **Edge** | 12 | Full Support (v12+) |
| **Firefox** | 6 | Full Support (v6+) |
| **Safari** | 5.1 | Full Support (v5.1+) |
| **Opera** | 12.1 | Full Support (v12.1+) |
| **IE** | 10 | Partial Support (v10-11) |

### Mobile & Alternative Browsers

| Browser/Platform | First Support | Notes |
|--------|---|---|
| **iOS Safari** | 5.0-5.1 | Full support |
| **Android Browser** | 3 | Full support from Android 3.0+ |
| **Chrome for Android** | 142 | Full support |
| **Firefox for Android** | 144 | Full support |
| **Samsung Internet** | 4 | Full support |
| **Opera Mobile** | 12.1 | Full support |
| **Opera Mini** | All versions | Full support |
| **UC Browser (Android)** | 15.5 | Full support |
| **Baidu Browser** | 13.52 | Full support |
| **QQ Browser (Android)** | 14.9 | Full support |
| **KaiOS** | 2.5 | Full support |
| **Blackberry** | 10 | Full support |
| **IE Mobile** | 10-11 | Partial support |

### Legacy Browser Support

Internet Explorer has limited support:
- IE 5.5 through IE 9: Not supported
- IE 10-11: Supported

All modern browsers released in the past 10+ years have full support.

## Known Issues & Caveats

### addEventListener Limitations

There is a known issue where `MediaQueryList.addEventListener()` doesn't work properly in Safari and older versions of Internet Explorer.

**Workaround**: Use the `onchange` property as an alternative for older browsers:

```javascript
const mediaQuery = window.matchMedia('(max-width: 768px)');

// Preferred (modern browsers)
mediaQuery.addEventListener('change', (e) => {
  // ...
});

// Fallback for older Safari/IE
mediaQuery.onchange = (e) => {
  // ...
};
```

## API Reference

### window.matchMedia(mediaQueryString)

**Parameters**:
- `mediaQueryString` (string): A valid CSS media query string (e.g., `'(max-width: 768px)'`, `'(prefers-color-scheme: dark)'`)

**Returns**: `MediaQueryList` object

**MediaQueryList Properties**:
- `matches` (boolean): Whether the document matches the media query
- `media` (string): The serialized media query string
- `onchange` (callback): Handler for media query changes

**MediaQueryList Methods**:
- `addEventListener('change', callback)`: Add a listener for media query changes
- `removeEventListener('change', callback)`: Remove a listener
- `addListener(callback)` (deprecated): Old API for adding listeners
- `removeListener(callback)` (deprecated): Old API for removing listeners

## Implementation Notes

### Best Practices

1. **Feature Detection**: Always check if `window.matchMedia` exists before using it
2. **Listener Cleanup**: Remove event listeners when components are destroyed to prevent memory leaks
3. **Performance**: Cache `matchMedia` results instead of calling repeatedly
4. **Testing**: Test media query changes by simulating viewport changes in your tests

### Example Implementation

```javascript
// Feature detection
if (window.matchMedia) {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

  function handleDarkModeChange(e) {
    if (e.matches) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  // Set initial state
  handleDarkModeChange(darkMode);

  // Listen for changes
  darkMode.addEventListener('change', handleDarkModeChange);
}
```

### Complementary Technologies

- **CSS Media Queries**: Define styles that respond to media queries
- **Responsive Web Design**: Use alongside viewport meta tags and responsive layouts
- **CSS Custom Properties**: Dynamically update CSS variables based on media query conditions
- **ResizeObserver API**: For element-level responsive behavior instead of viewport-based

## Polyfills & Fallbacks

For older browsers that don't support `matchMedia`:

- [matchMedia.js Polyfill](https://github.com/paulirish/matchMedia.js/) - Provides basic matchMedia support
- Fallback to CSS-only media queries for critical styles
- Feature detection to gracefully degrade functionality

## Related Resources

### Official Documentation

- [W3C CSSOM View Module Specification](https://www.w3.org/TR/cssom-view/#dom-window-matchmedia)
- [MDN Web Docs - window.matchMedia](https://developer.mozilla.org/en/DOM/window.matchMedia)
- [MDN Web Docs - Using matchMedia in Code](https://developer.mozilla.org/en/CSS/Using_media_queries_from_code)
- [WebPlatform.org - matchMedia](https://webplatform.github.io/docs/css/media_queries/apis/matchMedia)

### Polyfills & Tools

- [matchMedia.js Polyfill on GitHub](https://github.com/paulirish/matchMedia.js/) - Backwards compatibility for older browsers

### Related MDN Articles

- [CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Window Object](https://developer.mozilla.org/en-US/docs/Web/API/Window)

## Summary

The `matchMedia` API is a mature, well-supported feature available in modern browsers since 2009-2012 depending on the browser. With over 93% global support and universal support in all current browser versions, it's a reliable way to implement JavaScript-based responsive design. The API is essential for building modern web applications that need to respond to viewport changes and device capabilities programmatically.

---

*Last Updated: 2025*
*Data Source: CanIUse*
