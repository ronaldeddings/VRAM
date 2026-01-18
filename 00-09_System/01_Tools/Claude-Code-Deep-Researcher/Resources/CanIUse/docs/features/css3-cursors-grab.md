# CSS Grab & Grabbing Cursors

## Overview

Support for the `grab` and `grabbing` values for the CSS `cursor` property. These cursor values are used to visually indicate that an element can be grabbed (typically to be dragged and moved) or is currently being grabbed by the user.

## Description

The `grab` and `grabbing` cursor values provide semantic visual feedback to users about interactive elements that support dragging operations. This is particularly useful for:

- Map applications where users can pan/drag the view
- Draggable UI components and widgets
- Image galleries and carousels that support drag interactions
- Any interface element that implements grab-to-move functionality

These cursor types give users a clear visual signal about what actions are possible, improving the overall user experience and discoverability of interactive features.

## Specification Status

**Status:** Recommendation (REC)

**W3C Specification:** [CSS Basic User Interface Module Level 3 (CSS3 UI)](https://www.w3.org/TR/css3-ui/#cursor)

The feature is part of the official W3C recommendation for CSS cursor properties.

## Categories

- **CSS3** - Part of the CSS3 User Interface specification

## Benefits & Use Cases

### Primary Use Cases

1. **Map Applications**
   - Pan and zoom operations on interactive maps
   - Drag-to-navigate interfaces

2. **Draggable Components**
   - Visual feedback for draggable elements
   - Improved accessibility and discoverability

3. **Image Galleries**
   - Swipeable/draggable image carousels
   - Photo viewer applications

4. **Data Visualization**
   - Interactive charts and graphs that support panning
   - Canvas-based applications

5. **UI Widgets**
   - Resizable panels and windows
   - Drag-and-drop interfaces

### Benefits

- **User Experience:** Clear visual feedback about draggable elements
- **Accessibility:** Helps users understand interaction possibilities
- **Standard Behavior:** Consistent with native application patterns
- **Cross-Platform:** Works across desktop browsers

## Browser Support

| Browser | First Support | Notes |
|---------|---------------|-------|
| **Chrome** | v4.0+ | Webkit prefix required (v4-67), standard support from v68+ |
| **Firefox** | v2.0+ | Webkit prefix required (v2-26), standard support from v27+ |
| **Safari** | v3.1+ | Webkit prefix required (v3.1-10.1), standard support from v11+ |
| **Edge** | v15+ | Full support from v15+ |
| **Opera** | v11.6+ | Webkit prefix required (v15-54), standard support from v55+ |
| **Internet Explorer** | ❌ Not supported | All versions (5.5-11) lack support |
| **iOS Safari** | ❌ Not supported | No support across all versions |
| **Android Browser** | v4.4.2+ | Limited support, full support in v142+ |
| **Opera Mobile** | v80+ | Full support from v80+ |

### Support Legend

- **y** - Full support
- **y x** - Support with webkit prefix (e.g., `-webkit-grab`, `-webkit-grabbing`)
- **n** - Not supported
- **REC** - W3C Recommendation status

### Browser Support Summary

| Browser Family | Supported | Full Support Version | Notes |
|---|---|---|---|
| Chrome/Chromium | ✅ | v68+ | Webkit prefix needed before v68 |
| Firefox | ✅ | v27+ | Webkit prefix needed before v27 |
| Safari | ✅ | v11+ | Webkit prefix needed before v11 |
| Edge | ✅ | v15+ | Full support from initial version |
| Opera | ✅ | v55+ | Webkit prefix needed before v55 |
| IE | ❌ | Never | Not supported in any version |
| Mobile browsers | ⚠️ | Limited | iOS Safari: Not supported; Android: Varies |

## Global Usage

- **Supported by:** ~81.71% of users globally
- **Not supported:** ~18.29% of users

## Syntax

### Basic Usage

```css
/* Using grab cursor */
.draggable {
  cursor: grab;
}

/* Using grabbing cursor - typically on mousedown or active state */
.draggable:active {
  cursor: grabbing;
}
```

### With Fallback

```css
.draggable {
  cursor: -webkit-grab;  /* Safari, Chrome < 68, Firefox < 27 */
  cursor: grab;          /* Standard */
}

.draggable:active {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}
```

### Advanced Example

```css
/* Map pan control */
.map-canvas {
  cursor: grab;
  user-select: none;
}

.map-canvas:active {
  cursor: grabbing;
}

/* Draggable elements */
[draggable="true"] {
  cursor: grab;
}

[draggable="true"]:active {
  cursor: grabbing;
}
```

## Implementation Recommendations

### Best Practices

1. **Always Provide Fallback**
   ```css
   cursor: -webkit-grab;  /* For older browsers */
   cursor: grab;          /* Standard */
   ```

2. **Use Semantic HTML**
   - Use standard `draggable` attribute for native drag support
   - Pair cursor properties with actual drag functionality

3. **Provide Visual Feedback**
   - Change to `grabbing` cursor while actively dragging
   - Consider adding additional visual states (hover effects, etc.)

4. **Mobile Considerations**
   - Not supported on iOS Safari
   - Consider touch-specific alternatives
   - Use appropriate touch interaction patterns

5. **JavaScript Integration**
   ```javascript
   element.addEventListener('mousedown', () => {
     element.style.cursor = 'grabbing';
   });

   element.addEventListener('mouseup', () => {
     element.style.cursor = 'grab';
   });
   ```

## Notes

- **Webkit Prefix:** Older versions of Chrome, Firefox, Safari, and Opera require the `-webkit-` prefix
- **iOS Limitation:** iOS Safari does not support `grab` or `grabbing` cursors as touch devices don't have traditional cursor semantics
- **No Bugs Reported:** This feature has no known outstanding compatibility issues
- **Recommendation Status:** The feature has been standardized at the W3C Recommendation level

## Fallback Strategies

For applications requiring broader compatibility:

1. **CSS Fallback Chain**
   ```css
   cursor: -webkit-grab;
   cursor: -moz-grab;
   cursor: grab;
   cursor: move;  /* Widely supported alternative */
   ```

2. **Feature Detection**
   ```javascript
   function supportsGrabCursor() {
     const element = document.createElement('div');
     element.style.cursor = 'grab';
     return element.style.cursor === 'grab' ||
            element.style.cursor === '-webkit-grab';
   }
   ```

3. **Custom Cursor Alternative**
   ```css
   cursor: url('grab.png'), auto;
   cursor: url('grab.svg#grab'), auto;
   ```

## Related Resources

- **[MDN Web Docs - CSS cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)** - Comprehensive reference for all cursor values
- **[W3C CSS3 UI Specification](https://www.w3.org/TR/css3-ui/#cursor)** - Official W3C specification
- **[CanIUse.com](https://caniuse.com/css3-cursors-grab)** - Interactive browser support table

## Common Cursor Values Reference

| Value | Purpose | Browser Support |
|-------|---------|---|
| `grab` | Element can be grabbed/dragged | ~82% |
| `grabbing` | Element is being grabbed | ~82% |
| `pointer` | Clickable element | 98%+ |
| `move` | Element can be moved | 98%+ |
| `default` | Default behavior | 99%+ |
| `text` | Text selection | 98%+ |

---

*Last Updated: 2024*
*Data Source: CanIUse.com*
*Global Usage: 81.71% supported*
