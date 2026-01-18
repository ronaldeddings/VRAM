# CSS3 attr() Function for All Properties

## Overview

The CSS3 `attr()` function extends attribute value access beyond just the `content` property, allowing developers to use HTML attributes as values for any CSS property with support for multiple data types (strings, numbers, colors, dimensions, and more).

## Description

While `attr()` has been supported in effectively all browsers for the `content` property, CSS Values and Units Level 5 expands this capability significantly. The enhanced `attr()` function now allows:

- **Universal Property Support**: Use `attr()` on any CSS property, not just `content`
- **Typed Values**: Support for non-string values including:
  - Numbers and calculations
  - Color values
  - Lengths and dimensions
  - Angles and percentages
  - Custom types

This enhancement provides a more dynamic and flexible approach to styling, reducing the need for JavaScript and enabling true data-driven CSS styling.

## Specification Status

**Current Status**: Unofficial/Proposed
**Specification**: [CSS Values and Units Module Level 5](https://w3c.github.io/csswg-drafts/css-values-5/#attr-notation)
**W3C Status**: Early Draft

## Categories

- **CSS** - Cascading Style Sheets

## Benefits & Use Cases

### Dynamic Styling Benefits

1. **Data-Driven Design**: Style elements directly based on HTML attributes without JavaScript
2. **Reduced JavaScript**: Eliminate boilerplate code for reading attributes and applying styles
3. **Performance**: CSS-based styling is more efficient than JavaScript manipulation
4. **Maintainability**: Keep styling logic in CSS where it belongs

### Common Use Cases

- **Dimension Attributes**: Use data attributes for widths, heights, margins, and padding
  ```css
  .element {
    width: attr(data-width length);
    height: attr(data-height length);
    margin: attr(data-margin length);
  }
  ```

- **Color Theming**: Apply colors from attributes
  ```css
  .component {
    background-color: attr(data-bg-color color);
    color: attr(data-text-color color);
    border-color: attr(data-border-color color);
  }
  ```

- **Numeric Values**: Use counters, opacities, and other numeric properties
  ```css
  .progress-bar {
    width: attr(data-progress %);
    opacity: attr(data-opacity number);
  }
  ```

- **Custom Layouts**: Create flexible spacing and sizing
  ```css
  .card {
    padding: attr(data-padding length);
    gap: attr(data-gap length);
    transform: translateX(attr(data-offset length));
  }
  ```

## Browser Support

| Browser | First Support | Latest Status | Notes |
|---------|---------------|---------------|-------|
| **Chrome** | 133+ | ✅ Supported (v133-146+) | Full support for typed attr() |
| **Edge** | 133+ | ✅ Supported (v133-143+) | Chromium-based, same support as Chrome |
| **Firefox** | Not Yet | ❌ Not Supported | No support in any released version |
| **Safari** | Not Yet | ❌ Not Supported | No support in any released version |
| **Opera** | Not Yet | ❌ Not Supported | Follows Chromium engine |
| **iOS Safari** | Not Yet | ❌ Not Supported | No support in any released version |
| **Android Browser** | 142+ | ✅ Supported (v142+) | Limited support |
| **Android Chrome** | 142+ | ✅ Supported (v142+) | Full support |
| **Android Firefox** | Not Yet | ❌ Not Supported | No support |
| **Samsung Internet** | Not Yet | ❌ Not Supported | No support in any released version |

### Support Summary

- **Global Usage Coverage**: 67.94% (based on users of supporting browsers)
- **Supported Browsers**: Chrome 133+, Edge 133+, Android Chrome 142+, Android Browser 142+
- **Unsupported**: Firefox, Safari, Opera, IE/Mobile IE, most mobile browsers
- **Status**: Early adoption phase, Chromium-based engines leading

## Detailed Browser Support Table

### Desktop Browsers

#### Chrome
- **First Support**: Version 133
- **Current Support**: Versions 133-146+
- **Status**: Fully Supported
- **Implementation**: Complete typed attr() support

#### Edge (Chromium)
- **First Support**: Version 133
- **Current Support**: Versions 133-143+
- **Status**: Fully Supported
- **Implementation**: Inherits Chrome's Chromium engine implementation

#### Firefox
- **Status**: Not Supported
- **Versions Checked**: 2-148
- **Bug Tracker**: [Mozilla Bug #435426](https://bugzilla.mozilla.org/show_bug.cgi?id=435426)
- **Discussion**: Implementation of CSS3 values extensions to attr()

#### Safari
- **Status**: Not Supported
- **Versions Checked**: 3.1-26.2, Technical Preview
- **Bug Tracker**: [WebKit Bug #26609](https://bugs.webkit.org/show_bug.cgi?id=26609)
- **Discussion**: Support for CSS3 attr() function

#### Opera
- **Status**: Not Supported
- **Versions Checked**: 9-122
- **Note**: Follows Chromium; support expected when Chrome reaches 133

### Mobile Browsers

#### Android Chrome
- **First Support**: Version 142
- **Status**: Fully Supported

#### Android Browser
- **First Support**: Version 142
- **Status**: Supported

#### iOS Safari
- **Status**: Not Supported
- **Versions Checked**: 3.2-26.1
- **Note**: Awaiting Safari desktop implementation

#### Samsung Internet
- **Status**: Not Supported
- **Versions Checked**: 4-29

#### Other Mobile Browsers
- **Opera Mobile**: Not Supported
- **Opera Mini**: Not Supported
- **Android Firefox**: Not Supported
- **Internet Explorer Mobile**: Not Supported
- **UC Browser**: Not Supported
- **Baidu Browser**: Not Supported
- **QQ Browser**: Not Supported
- **KaiOS Browser**: Not Supported

## Technical Notes

### Important Considerations

1. **Limited Browser Support**: This is a very new feature with support only in recent Chromium-based browsers. Wide adoption is still years away.

2. **Fallback Strategy Required**: For production use, implement fallback mechanisms using CSS custom properties or JavaScript for unsupported browsers.

3. **Related Feature**: For the `content` property specifically, `attr()` has been supported in all major browsers for years. See the [generated content](/css-gencontent) table for comprehensive support information.

4. **Type Safety**: When using typed attr(), ensure that:
   - The attribute value is a valid representation of the specified type
   - Provide appropriate fallback values
   - Validate data on the server side

5. **Performance**: While CSS-based styling is generally performant, be mindful of:
   - Browser paint and reflow costs
   - Complex calculations with attr()
   - Large numbers of elements using attr()

### Syntax Examples

```css
/* Typed attr() syntax */
.element {
  /* Length type */
  width: attr(data-width length, 100px);

  /* Color type */
  background: attr(data-color color, blue);

  /* Number type */
  opacity: attr(data-opacity number, 1);

  /* Percentage type */
  width: attr(data-width %, 50%);

  /* Angle type */
  transform: rotate(attr(data-angle angle, 0deg));
}
```

### Fallback Values

Always provide fallback values for unsupported browsers:

```css
.component {
  /* Fallback for unsupported browsers */
  width: 200px;
  /* Will override the above if supported */
  width: attr(data-width length, 200px);
}
```

## Relevant Links

### Official Documentation
- [MDN Web Docs - CSS attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/attr)
- [W3C Specification - CSS Values and Units Level 5](https://w3c.github.io/csswg-drafts/css-values-5/#attr-notation)

### Browser Implementation Tracking
- [Mozilla Bug #435426](https://bugzilla.mozilla.org/show_bug.cgi?id=435426) - Firefox: implement css3-values extensions to attr()
- [Chromium Issue #246571](https://bugs.chromium.org/p/chromium/issues/detail?id=246571) - Chrome: Implement CSS3 attribute / attr references
- [WebKit Bug #26609](https://bugs.webkit.org/show_bug.cgi?id=26609) - Safari: Support CSS3 attr() function

### Related Features
- [Generated Content (`content` property)](/css-gencontent) - attr() support for content property (widely supported)
- [CSS Custom Properties](/css-variables) - Recommended alternative for some use cases

## CanIUse Data

- **Feature ID**: css3-attr
- **Usage Percentage**: 67.94% (among users of supporting browsers)
- **Status**: unoff (Unofficial)
- **Prefix Required**: No

---

**Last Updated**: 2025-12-13
**Data Source**: [caniuse.com](https://caniuse.com)
