# CSS3 Cursors (Original Values)

## Overview

CSS3 Cursors refers to the expanded set of cursor values introduced in the CSS3 specification (2004). These values provide developers with semantic cursor styles to enhance user interface feedback and improve user experience by indicating element interactivity and state.

## Description

CSS3 cursor values added in the 2004 spec include support for specialized cursor types beyond the basic arrow and pointer. These include:

- **`none`** - Hides the cursor entirely
- **`context-menu`** - Indicates context menu availability (usually right-click)
- **`cell`** - Indicates a cell selection within a table or spreadsheet
- **`vertical-text`** - Indicates vertical text selection capability
- **`alias`** - Indicates that a shortcut or alias will be created
- **`copy`** - Indicates that dragged content will be copied
- **`no-drop`** - Indicates that the dragged content cannot be dropped here
- **`not-allowed`** - Indicates that an action is not permitted
- **`nesw-resize`** - Northeast-southwest resize cursor
- **`nwse-resize`** - Northwest-southeast resize cursor
- **`col-resize`** - Column resize cursor
- **`row-resize`** - Row resize cursor
- **`all-scroll`** - Indicates scrolling in all directions

## Specification

- **Status:** Recommendation (REC)
- **W3C Spec:** [CSS Basic User Interface Module Level 3](https://www.w3.org/TR/css3-ui/#cursor)
- **First Published:** 2004

## Categories

- CSS3

## Use Cases & Benefits

### Enhanced User Feedback
- Provide clear visual feedback about element interactivity
- Help users understand what actions are available
- Reduce confusion about interactive vs. non-interactive elements

### Accessibility Improvements
- Communicate element state and purpose without text labels
- Aid users with limited vision by providing more intuitive feedback
- Standardize cursor behavior across browsers and platforms

### User Experience Optimization
- Indicate resize capabilities on window edges and columns
- Signal copy/drag operations with appropriate cursor styles
- Show when actions are permitted or disabled
- Provide context-aware cursor feedback for different interaction modes

### Application Development
- Create more intuitive spreadsheet and table interfaces
- Enhance drag-and-drop user experiences
- Build rich text editors with semantic cursor states
- Develop desktop-like web applications with appropriate cursor feedback

## Browser Support

### Support Legend
- **y** - Full support
- **a** - Partial support (with notes)
- **n** - Not supported
- **u** - Unknown

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|------------------|---|---|
| **Chrome** | v5 (partial) | v5+ Full | Full support from Chrome 5+ |
| **Edge** | v12 (partial) | v14+ Full | Full support from Edge 14+ |
| **Firefox** | v2 (partial) | v4+ Full | Full support from Firefox 4+ |
| **Safari** | v3.1 (partial) | v5+ Full | Full support from Safari 5+ |
| **Opera** | v9 (partial) | v15+ Full | Full support from Opera 15+ |
| **Internet Explorer** | v5.5 (partial) | v9+ Full | Partial support in IE 5.5-8, full from IE 9+ |

### Mobile Browsers

| Browser | Support Status | Notes |
|---------|---|---|
| **iOS Safari** | Not Supported | No support across all iOS versions (not applicable to touch devices) |
| **Android Browser** | v4.4.3+ (Full) | Partial support in earlier versions, full from Chrome-based versions |
| **Chrome Android** | v142+ (Full) | Recent versions with full support |
| **Firefox Android** | Not Supported (v144) | Touch-based devices don't typically need cursor styling |
| **Samsung Internet** | Not Supported | Not applicable to touch-based platform |
| **Opera Mobile** | v80+ (Full) | Full support from Opera Mobile 80+ |
| **Android UC Browser** | v15.5+ (Full) | Full support from recent versions |
| **Baidu Browser** | v13.52+ (Full) | Full support in recent versions |
| **QQ Browser** | v14.9+ (Full) | Full support in recent versions |

### Legacy/Niche Browsers

| Browser | Support Status |
|---------|---|
| **Opera Mini** | Not Supported |
| **BlackBerry** | Unknown (v10) / Not Supported (v7) |
| **KaiOS** | Not Supported |

## Global Browser Support

- **Full Support (y):** 82.09% of global browser usage
- **Partial Support (a):** 0.03% of global browser usage
- **No Support (n):** 17.88% of global browser usage

## Known Issues & Limitations

### Platform-Specific Bugs

#### Image Format Limitations
- **Firefox/macOS, Safari/macOS, Chrome/macOS:** Do not support PNG and JPG image cursors (tested with 48px cursors)
  - **Workaround:** Use CUR format or inline SVG cursors
- **Internet Explorer & Edge:** Only support CUR (cursor) file format for custom cursors
  - **Workaround:** Convert custom cursors to CUR format before use

#### Data URI Support
- **Internet Explorer:** Does not support Data URIs as cursor values
  - **Workaround:** Use external file references instead of inline Data URIs

### Mobile Considerations
- CSS3 cursors have limited utility on touch devices where cursor concepts don't apply
- Touch devices rely on visual feedback through UI state changes rather than cursor styles
- Most mobile browsers report no support due to hardware limitations, not feature implementation

## Usage Notes

### Fallback Values
Always provide fallback cursor values when using custom cursors to ensure graceful degradation:

```css
.element {
  cursor: url('custom-cursor.cur'), pointer;
}
```

### Performance Considerations
- Load custom cursor files efficiently to avoid performance impacts
- Use optimized image formats (CUR, SVG) for custom cursors
- Minimize the number of custom cursor definitions

### Cross-Browser Testing
When using CSS3 cursor values:
- Test across different operating systems (Windows, macOS, Linux)
- Verify custom cursor rendering with appropriate file formats
- Check Data URI cursor compatibility in target browsers
- Validate touch device behavior if applicable

## Browser Partial Support Details

### Internet Explorer (v5.5-v8)
**Partial Support (#1):** No support for:
- `alias`
- `cell`
- `copy`
- `ew-resize`
- `ns-resize`
- `nesw-resize`
- `nwse-resize`
- `context-menu`

### Edge (v12-v13) & Opera (v9-v12.1)
**Partial Support (#2):** No support for `none` cursor value

## Related Standards

- [CSS Basic User Interface Module Level 3](https://www.w3.org/TR/css3-ui/)
- [MDN Web Docs - CSS cursor Property](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)

## Implementation Examples

### Basic Semantic Cursor Values
```css
/* Context menu indication */
.menu-trigger {
  cursor: context-menu;
}

/* Copy operation feedback */
.draggable-copy {
  cursor: copy;
}

/* Action not allowed */
.disabled-button {
  cursor: not-allowed;
}

/* Resize operations */
.resize-handle-h {
  cursor: ew-resize;
}

.resize-handle-v {
  cursor: ns-resize;
}

.resize-handle-corner {
  cursor: nwse-resize;
}

/* Hidden cursor */
.hide-cursor {
  cursor: none;
}
```

### Custom Cursor with Fallback
```css
.custom-cursor {
  /* Using external CUR file for broad compatibility */
  cursor: url('custom.cur'), auto;

  /* Fallback to semantic value if custom fails */
}
```

## See Also

- [CSS cursor Property - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
- [W3C CSS UI Module Level 3 Specification](https://www.w3.org/TR/css3-ui/#cursor)

## Data Last Updated

This documentation reflects Can I Use data current as of the latest update. Browser version information extends to:
- Chrome: v146+
- Firefox: v148+
- Safari: v18.5+
- Edge: v143+
- Opera: v122+
