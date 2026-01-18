# CSS Overflow Property

## Overview

The CSS `overflow` property controls how content is displayed when it overflows the boundaries of its container. Originally a single property for controlling overflowing content in both horizontal and vertical directions, the `overflow` property is now a shorthand for `overflow-x` and `overflow-y`. The latest version of the specification also introduces the `clip` value that blocks programmatic scrolling.

## Specification Status

- **Status**: Working Draft (WD)
- **Specification URL**: [CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/)

## Categories

- CSS

## Description

The `overflow` property determines what happens to content that is too large to fit in its container. It can be used to:

- Control visibility of overflowing content
- Enable scrolling mechanisms
- Hide overflow programmatically
- Prevent user scrolling with the `clip` value

### Key Features

#### Supported Values

- **`visible`** (default): Content is not clipped; it may be rendered outside the element's box
- **`hidden`**: Content is clipped to the padding edge; no scrollbars are provided
- **`scroll`**: Content is clipped to the padding edge; scrollbars are provided whether or not the content overflows
- **`auto`**: Content is clipped to the padding edge; scrollbars appear only when the content overflows
- **`clip`** (CSS Overflow Level 3): Like `hidden`, content is clipped to the padding edge, but programmatic scrolling is blocked

#### Shorthand Syntax

The `overflow` property can accept:
- **Single value**: Applied to both horizontal and vertical overflow
- **Two values**: First value applies to `overflow-x`, second to `overflow-y` (newer specification)

#### Related Properties

- `overflow-x`: Controls horizontal overflow handling
- `overflow-y`: Controls vertical overflow handling

## Browser Support

The following table shows comprehensive browser support for the CSS `overflow` property.

**Legend:**
- ✅ **Fully Supported**: Complete support for all features
- ⚠️ **Partial Support**: Missing support for two-value syntax and/or `clip` value
- ❌ **Not Supported**: Limited or no support

### Desktop Browsers

| Browser | Version Range | Status | Notes |
|---------|---------------|--------|-------|
| **Internet Explorer** | 5.5-11 | ⚠️ | Supports single-value syntax and basic values only |
| **Edge** | 12-89 | ⚠️ | No support for two-value syntax or `clip` value |
| **Edge** | 90+ | ✅ | Full support |
| **Firefox** | 2-60 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Firefox** | 61-80 | ⚠️ | Missing `clip` value support |
| **Firefox** | 81+ | ✅ | Full support |
| **Chrome** | 4-67 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Chrome** | 68-89 | ⚠️ | Missing `clip` value support |
| **Chrome** | 90+ | ✅ | Full support |
| **Safari** | 3.1-13 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Safari** | 13.1-15.6 | ⚠️ | Missing `clip` value support |
| **Safari** | 16.0+ | ✅ | Full support |
| **Opera** | 9-54 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Opera** | 55-75 | ⚠️ | Missing `clip` value support |
| **Opera** | 76+ | ✅ | Full support |

### Mobile Browsers

| Browser | Version Range | Status | Notes |
|---------|---------------|--------|-------|
| **iOS Safari** | 3.2-13.3 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **iOS Safari** | 13.4-15.6 | ⚠️ | Missing `clip` value support |
| **iOS Safari** | 16.0+ | ✅ | Full support |
| **Android Browser** | 2.1-4.4.4 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Android Browser** | 142+ | ✅ | Full support |
| **Android Chrome** | 142+ | ✅ | Full support |
| **Android Firefox** | 144+ | ✅ | Full support |
| **Opera Mobile** | 10-12.1 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Opera Mobile** | 80+ | ✅ | Full support |
| **Opera Mini** | All versions | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Samsung Internet** | 4-14 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **Samsung Internet** | 15+ | ✅ | Full support |
| **Baidu Browser** | 13.52+ | ✅ | Full support |
| **KaiOS** | 2.5 | ⚠️ | Supports single-value syntax; missing two-value syntax and `clip` value |
| **KaiOS** | 3.0-3.1 | ✅ | Full support |

## Usage Statistics

- **Fully Supported**: 91.13% of users
- **Partial Support**: 2.6% of users

## Benefits & Use Cases

### Key Benefits

1. **Content Clipping**: Hide overflow content for cleaner layouts
2. **Scrollable Containers**: Enable scrolling in specific areas without affecting the entire page
3. **Layout Control**: Manage how content behaves when containers are too small
4. **Text Truncation**: Hide excess text in fixed-size containers
5. **Image Handling**: Manage oversized images within containers
6. **Modal Windows**: Create bounded content areas with independent scrolling

### Common Use Cases

- **Dropdown Menus**: Prevent menu items from spilling outside boundaries
- **Card Layouts**: Truncate content in card components
- **Sidebar Navigation**: Create scrollable navigation areas
- **Image Galleries**: Control image display in fixed containers
- **Text Truncation**: Hide overflow text in headings or descriptions
- **Data Tables**: Enable scrolling for wide tables
- **Modal Dialogs**: Manage content overflow in modal windows
- **Chat Applications**: Create scrollable message areas

## Implementation Notes

### General Browser Support

Effectively all browsers support the CSS 2.1 definition for single-value `overflow` as well as `overflow-x` & `overflow-y` and values `visible`, `hidden`, `scroll` & `auto`.

### Known Limitations

1. **Two-Value Syntax Not Supported**
   - Older browsers (IE, early versions of Chrome, Firefox, Safari, Opera, and mobile browsers) do not support the two-value `overflow` shorthand syntax
   - Workaround: Use `overflow-x` and `overflow-y` separately for better compatibility
   - Supported from: Chrome 90+, Firefox 81+, Safari 16+, Edge 90+, Opera 76+

2. **`clip` Value Not Supported**
   - The `clip` value (which blocks programmatic scrolling) is a newer addition to the specification
   - Not supported in older browser versions (see browser support table)
   - Supported from: Chrome 90+, Firefox 81+, Safari 16+, Edge 90+, Opera 76+
   - Useful for: Preventing scrolling in specific containers while maintaining overflow clipping

## Code Examples

### Basic Usage

```css
/* Hide overflow content */
.container {
  overflow: hidden;
}

/* Add scrollbars if needed */
.scrollable {
  overflow: auto;
}

/* Always show scrollbars */
.always-scroll {
  overflow: scroll;
}

/* Block programmatic scrolling (CSS Overflow Level 3) */
.no-scroll {
  overflow: clip;
}
```

### Independent Axis Control

```css
/* Horizontal scroll, vertical hidden */
.horizontal-scroll {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Two-value shorthand (newer browsers) */
.two-value-syntax {
  overflow: auto hidden; /* overflow-x: auto, overflow-y: hidden */
}
```

### Practical Examples

```css
/* Truncated text */
.truncated {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Scrollable sidebar */
.sidebar {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Fixed-size image container */
.image-box {
  width: 300px;
  height: 300px;
  overflow: hidden;
  object-fit: cover;
}
```

## Related Resources

### Official Documentation

- [CSS overflow on MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)

### Browser Issue Tracking

- [WebKit bug on support for two values syntax](https://bugs.webkit.org/show_bug.cgi?id=184691)
- [Edge bug on support for two values syntax](https://web.archive.org/web/20190401105108/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/16993428/)
- [WebKit bug on support for clip value](https://bugs.webkit.org/show_bug.cgi?id=198230)

## Best Practices

1. **Default to Single Value**: For maximum compatibility, use single-value `overflow` syntax
2. **Progressive Enhancement**: Use two-value syntax for modern browsers with feature detection
3. **Combine with Dimension**: Always specify width and/or height when using overflow
4. **Test on Target Devices**: Verify overflow behavior on all target browsers
5. **Consider Mobile**: Mobile browsers handle overflow differently; test on various devices
6. **Alternative Truncation**: Use `text-overflow: ellipsis` for text truncation in combination with `overflow: hidden`
7. **Performance Consideration**: Excessive `overflow: auto` can impact scroll performance; consider `overflow: hidden` where appropriate

## Feature Detection

```javascript
// Check for two-value syntax support
const element = document.createElement('div');
element.style.overflow = 'auto hidden';
const supportsTwo = element.style.overflow === 'auto hidden';

// Check for clip value support
element.style.overflow = 'clip';
const supportsClip = element.style.overflow === 'clip';
```

## Summary

The CSS `overflow` property is nearly universally supported for basic use cases (single-value syntax with `visible`, `hidden`, `scroll`, and `auto` values). Modern features like the two-value syntax and the `clip` value require Chrome 90+, Firefox 81+, Safari 16+, Edge 90+, Opera 76+, or equivalent versions of other browsers. For production applications targeting a broad audience, stick with single-value syntax and `overflow-x`/`overflow-y` for explicit control.
