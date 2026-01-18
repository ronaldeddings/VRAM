# CSS Anchor Positioning

## Overview

CSS Anchor Positioning is a CSS specification that allows developers to position elements anywhere on a page relative to an "anchor element", without regard to the layout of other elements besides their containing block. This powerful feature enables more flexible and intuitive positioning patterns for tooltips, dropdowns, popovers, and other UI components that need to be anchored to specific elements.

## Specification

- **Status**: Working Draft (WD)
- **W3C Specification**: [CSS Anchor Position 1 Specification](https://www.w3.org/TR/css-anchor-position-1/)
- **Keywords**: anchor, position, anchor-element, anchor-name, anchor-default, anchor-scroll, position-fallback, position-fallback-bounds

## Categories

- CSS

## Benefits and Use Cases

### Key Benefits

1. **Decoupled Positioning**: Position elements relative to anchors without nested DOM structures
2. **Automatic Fallback**: Automatically adjust positioning when elements would overflow
3. **Responsive Behavior**: Position adapts as anchors move through the viewport
4. **Simplified JavaScript**: Reduces need for JavaScript-based positioning calculations
5. **Maintainable Code**: Cleaner HTML structure without nested positioning containers

### Common Use Cases

- **Tooltips**: Position tooltips relative to hovered elements with automatic fallback
- **Dropdowns**: Anchor dropdown menus to button triggers
- **Popovers**: Create popovers and popups that follow their anchor elements
- **Context Menus**: Position context menus relative to trigger points
- **Floating UI**: Build floating interface elements with intelligent positioning
- **Notifications**: Anchor notification elements to their source components
- **Accessible Components**: Create more accessible UI patterns with predictable positioning

## Browser Support

### Current Support Summary

| Browser | First Version with Full Support | Status |
|---------|--------------------------------|--------|
| **Chrome** | 125 | ✅ Full Support |
| **Edge** | 125 | ✅ Full Support |
| **Firefox** | 147 | ✅ Full Support |
| **Safari** | 26.0 | ✅ Full Support |
| **Opera** | 111 | ✅ Full Support |
| **iOS Safari** | 26.0 | ✅ Full Support |
| **Android Chrome** | 142 | ✅ Full Support |
| **Samsung Internet** | 27 | ✅ Full Support |

### Detailed Browser Version Support

#### Chrome/Edge (Chromium-based)

- **Chrome 125+**: Full support
- **Chrome 117-124**: Behind `#enable-experimental-web-platform-features` flag
- **Edge 125+**: Full support
- **Edge 117-124**: Behind `#enable-experimental-web-platform-features` flag
- **Opera 111+**: Full support
- **Opera 103-110**: Behind experimental features flag

#### Firefox

- **Firefox 147+**: Full support
- **Firefox 145-146**: Behind `layout.css.anchor-positioning.enabled` flag (Nightly builds)
- **Earlier versions**: No support

#### Safari

- **Safari 26.0+**: Full support
- **iOS Safari 26.0+**: Full support
- **Earlier versions**: No support

#### Mobile Browsers

- **Android Chrome 142+**: Full support
- **Samsung Internet 27+**: Full support
- **Opera Mini**: No support
- **Android Firefox**: No support (as of version 144)

### Global Usage

- **Global Usage (Y)**: 74.35% of users
- **Partial Support (A)**: 0%
- **No Support**: 25.65% of users

## Implementation Notes

### Feature Flags

**Chrome/Edge (Versions 117-124)**:
```
chrome://flags/#enable-experimental-web-platform-features
```

**Firefox (Nightly)**:
```
about:config - layout.css.anchor-positioning.enabled
```

### Key Properties

The CSS Anchor Positioning specification introduces the following CSS properties:

- `anchor-name`: Names an element as an anchor
- `position-anchor`: References an anchor by name
- `anchor-default`: Specifies default positioning relative to anchor
- `anchor-scroll`: Controls scroll behavior for anchored elements
- `position-fallback`: Defines fallback positioning strategies
- `position-fallback-bounds`: Controls fallback bounds checking

### Polyfill Availability

A polyfill is available from OddBird for browsers without native support:
- [CSS Anchor Positioning Polyfill](https://github.com/oddbird/css-anchor-positioning)

## Known Issues and Limitations

### Status

- **No known critical bugs** reported at this time
- Feature is still in Working Draft status, so API details may change
- Not all browser engines have implemented it yet

### Browser-Specific Notes

1. **Firefox**: Limited to Nightly builds; not yet in stable releases (as of Firefox 144)
2. **Safari**: Recently implemented; ensure testing on latest versions
3. **Older Browsers**: Consider polyfill or fallback positioning strategies
4. **Mobile**: Support varies; test thoroughly on target mobile browsers

## Basic Syntax Example

```css
/* Define an anchor */
.trigger {
  anchor-name: --my-anchor;
}

/* Position element relative to anchor */
.tooltip {
  position: absolute;
  position-anchor: --my-anchor;
  top: anchor(bottom);
  left: anchor(center);
}
```

## Related Resources

### Official References
- [W3C CSS Anchor Position 1 Specification](https://www.w3.org/TR/css-anchor-position-1/)
- [WebKit Standards Position on Anchor Positioning](https://github.com/WebKit/standards-positions/issues/167)

### Guides and Articles
- [Chrome Blog: Tether Elements to Each Other with CSS Anchor Positioning](https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning/)
- [12 Days of Web: Anchor Positioning Guide](https://12daysofweb.dev/2023/anchor-positioning/)

### Implementation Tracking
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1838746)
- [OddBird CSS Anchor Positioning Polyfill](https://github.com/oddbird/css-anchor-positioning)

### Tools and Libraries
- **Polyfill**: [@oddbird/css-anchor-positioning](https://github.com/oddbird/css-anchor-positioning)
- **Feature Detection**: Check for `anchor-name` CSS support in stylesheet or computed styles

## Migration Guide

### From JavaScript-based Positioning

If you're currently using JavaScript libraries for positioning:

1. **Identify anchor relationships** in your current code
2. **Define anchor names** using `anchor-name` property
3. **Update positioning logic** to use CSS anchor positioning
4. **Test fallback behavior** with `position-fallback`
5. **Remove JavaScript dependencies** where possible

### Fallback Strategy for Unsupported Browsers

1. **Primary**: Use CSS Anchor Positioning
2. **Fallback**: Implement absolute positioning with calculated offsets
3. **Detection**: Use feature detection in JavaScript:

```javascript
const supportsAnchorPositioning = CSS.supports('anchor-name', 'test');
if (!supportsAnchorPositioning) {
  // Use fallback positioning logic
}
```

## Accessibility Considerations

- Ensure anchored elements maintain proper focus management
- Test screen reader announcements for anchored UI components
- Verify keyboard navigation works with dynamically positioned elements
- Keep anchored elements semantically meaningful in the DOM

## Performance Notes

- CSS Anchor Positioning is GPU-accelerated in most browsers
- No significant performance impact on modern devices
- Reduces JavaScript computation for positioning calculations
- Better rendering performance than JavaScript-based solutions

## Future Updates

As CSS Anchor Positioning moves from Working Draft to recommendation:
- More browsers will implement full support
- Additional features and refinements may be added
- API details may change; monitor the W3C spec for updates
- Polyfill may become less necessary as browser support increases

---

**Last Updated**: December 2025

**Documentation Status**: Based on CanIUse data and W3C specifications. Browser support versions current as of December 2025.
