# CSS3 Box-shadow

## Overview

The `box-shadow` CSS property provides a method of displaying inner or outer shadow effects on HTML elements. This is a fundamental CSS3 feature that enables developers to create depth and visual interest without requiring additional image assets.

**Status**: ![Candidate Recommendation Badge](https://img.shields.io/badge/status-CR-blue)

## Specification

- **Official W3C Specification**: [CSS3 Backgrounds and Borders - box-shadow](https://www.w3.org/TR/css3-background/#box-shadow)
- **Specification Status**: Candidate Recommendation (CR)

## Categories

- CSS3

## Description

The `box-shadow` property applies one or more drop or inner shadows to an element's box. It accepts multiple shadow values separated by commas, allowing for complex shadow effects. Each shadow consists of:

- **Offset X & Y**: Horizontal and vertical distance of the shadow
- **Blur Radius**: Optional softness of the shadow edge
- **Spread Radius**: Optional expansion or contraction of the shadow
- **Color**: Shadow color (defaults to currentColor)
- **Inset Keyword**: Optional keyword to create inner shadows instead of outer shadows

### Syntax

```css
box-shadow: [inset]? <length> <length> <length>? <length>? <color>?, ...;
```

## Benefits and Use Cases

### Design & Visual Enhancement
- **Depth Creation**: Create layered interfaces with realistic shadow effects
- **Focus Indicators**: Highlight active or focused elements without images
- **Card Effects**: Give cards and panels a lifted appearance
- **Glow Effects**: Create glowing or highlighted elements for emphasis

### Interactive Elements
- **Button Styling**: Enhance button states with shadow feedback
- **Hover States**: Provide visual feedback on interactive elements
- **Focus States**: Improve accessibility by clearly indicating focused elements
- **Modal Dialogs**: Create depth perception with shadows behind modal overlays

### Modern UI Patterns
- **Material Design**: Core component of Material Design shadows
- **Neumorphism**: Essential for soft UI and neumorphic design patterns
- **Flat Design Enhancement**: Add subtle depth to flat design interfaces

### Performance Advantages
- **Image Replacement**: Eliminate shadow images for faster loading
- **Scalability**: Scale with elements without quality loss
- **Dynamic Effects**: Easy to modify with CSS animations and transitions
- **Responsive Design**: Adapt shadows for different screen sizes

## Browser Support

### Summary by Browser

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **IE** | 9 | ✅ Full support from IE 9+ |
| **Edge** | 12 | ✅ Full support (all versions) |
| **Firefox** | 4 | ✅ Full support from Firefox 4+ |
| **Chrome** | 10 | ✅ Full support from Chrome 10+ |
| **Safari** | 5.1 | ✅ Full support from Safari 5.1+ |
| **Opera** | 10.5 | ✅ Full support from Opera 10.5+ |
| **iOS Safari** | 4.0+ | ✅ Full support from iOS 4.0+ |
| **Android** | 4 | ✅ Full support from Android 4+ |
| **Opera Mobile** | 11 | ✅ Full support from Opera Mobile 11+ |

### Detailed Support Table

#### Desktop Browsers

| Browser | Support Status | Notes |
|---------|---|---|
| **Internet Explorer** | ✅ IE 9-11 | No support in IE 8 and below; can be emulated with IE filters |
| **Microsoft Edge** | ✅ All versions | Full support from Edge 12 onwards |
| **Firefox** | ✅ 3.5+ | Partial `-moz` prefix in 3.5-3.6; full support from 4+ |
| **Chrome** | ✅ 4+ | Partial `-webkit` prefix in Chrome 4-9; full support from 10+ |
| **Safari** | ✅ 5+ | Partial `-webkit` prefix in Safari 5; full support from 5.1+ |
| **Opera** | ✅ 10.5+ | Full support from Opera 10.5 onwards |

#### Mobile Browsers

| Browser | Support Status | Notes |
|---|---|---|
| **iOS Safari** | ✅ 4.0+ | Partial support in iOS 3.2; full support from iOS 4.0+ |
| **Android Browser** | ✅ 4.0+ | Partial support in Android 2.1-2.3; full support from Android 4.0+ |
| **Opera Mobile** | ✅ 11+ | No support in Opera Mobile 10; full support from 11+ |
| **Chrome Mobile** | ✅ Full support | Inherits desktop Chrome support |
| **Firefox Mobile** | ✅ Full support | Inherits desktop Firefox support |
| **Samsung Internet** | ✅ 4.0+ | Full support from Samsung Internet 4.0+ |

### Global Usage Statistics

- **Full Support**: 93.65% of web traffic
- **Partial Support**: 0%
- **No Support**: 6.35% of web traffic (mainly legacy IE and old mobile browsers)

## Known Issues and Bugs

### Edge & Internet Explorer - Table Border Collapse Bug

**Issue**: Edge and IE up to version 11 suppress box shadows on elements within tables that use `border-collapse: collapse`.

**Example**:
```css
table { border-collapse: collapse; }
td { box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); } /* May not display */
```

**Impact**: Shadow effects are hidden when applied to table cells with collapsed borders.

**Workarounds**:
- Use `border-collapse: separate` instead of `collapse`
- Apply shadows to wrapper elements instead of table cells
- See [test case](https://codepen.io/Fyrd/pen/oXVYyq) and [workaround demo](https://codepen.io/ribeirobreno/pen/PopbqKo)

### Safari & Early Mobile - Zero Blur Radius Bug

**Issue**: Safari 6, iOS Safari 6, and Android 2.3 default browser don't work with a 0px value for the blur-radius parameter.

**Example - Fails**:
```css
box-shadow: 5px 1px 0px 1px #f04e29; /* Doesn't work */
```

**Example - Works**:
```css
box-shadow: 5px 1px 1px 1px #f04e29; /* Works correctly */
```

**Impact**: Hard shadows (no blur) may not render correctly on older Safari and Android browsers.

**Workaround**: Use a minimum blur-radius value of at least 1px instead of 0px.

### iOS 8 - Zoom Bug

**Issue**: iOS 8 has a bug where box shadows disappear when zooming in a certain amount.

**Impact**: Shadows may flicker or disappear during pinch-zoom on iOS 8 devices.

**Details**: See [test case](https://jsfiddle.net/b6aaq57z/4/) for reproduction.

## Implementation Notes

### Partial Support Details

Partial support (`a x #1`) in older browsers refers to:
- Missing `inset` keyword support
- Missing blur-radius value support
- Missing multiple shadow support

### Prefix Requirements

- **`-webkit-` prefix**: Required for Chrome 4-9, Safari 5, iOS Safari 4.x-5.x, Android 2.3+
- **`-moz-` prefix**: Required for Firefox 3.5-3.6
- **Standard property**: All modern browsers (as of ~2011-2012)

### Fallback for Legacy IE

For IE 8 and below, box-shadow can be partially emulated using the non-standard `filter` property:

```css
/* For IE 8 and below */
filter: progid:DXImageTransform.Microsoft.Shadow(color='#000000', Direction=135, Strength=3);
```

## Basic Usage Examples

### Simple Drop Shadow

```css
.box {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}
```

### Multiple Shadows

```css
.box {
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.08);
}
```

### Inset Shadow (Inner Shadow)

```css
.box {
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}
```

### Glow Effect

```css
.button:focus {
  box-shadow: 0 0 8px rgba(66, 133, 244, 0.6);
}
```

### Spread Radius Example

```css
.shadow-large {
  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);
}
```

## Related Resources

- **MDN Web Docs**: [box-shadow - Mozilla Developer Network](https://developer.mozilla.org/En/CSS/-moz-box-shadow)
- **Live Editor**: [West Civ Box Shadow Tool](https://westciv.com/tools/boxshadows/index.html)
- **Visual Demo**: [Various Box Shadow Effects Demo](http://tests.themasta.com/blogstuff/boxshadowdemo.html)
- **WebPlatform Docs**: [box-shadow on WebPlatform.org](https://webplatform.github.io/docs/css/properties/box-shadow)

## See Also

- [text-shadow](https://www.w3.org/TR/css-text-decor-3/#text-shadow) - Similar property for text elements
- [filter](https://www.w3.org/TR/filter-effects/) - Modern filter effects as an alternative
- [CSS Transforms](https://www.w3.org/TR/css-transforms-1/) - Often used together with shadows for depth effects

## Keywords

`box-shadows`, `boxshadows`, `box-shadow`, `shadow`, `drop-shadow`, `inner-shadow`
