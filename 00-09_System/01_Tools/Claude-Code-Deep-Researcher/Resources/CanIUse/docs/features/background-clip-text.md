# Background-clip: text

## Overview

**`background-clip: text`** allows you to clip a background image to the foreground text of an element, creating a visually striking text effect where the background image is only visible within the characters themselves.

## Description

This CSS property extends the `background-clip` property with a `text` value, enabling developers to create stylish text effects by clipping background images, gradients, and colors to the text content. The text itself becomes transparent with the background showing through only within the character shapes.

## Specification

- **Status**: Unofficial (unstandardized but widely supported)
- **Module**: [CSS Backgrounds and Borders Module Level 4](https://drafts.csswg.org/css-backgrounds-4/#background-clip)
- **Specification Link**: https://drafts.csswg.org/css-backgrounds-4/#background-clip

## Category

- CSS

## Use Cases & Benefits

### Common Applications

1. **Stylized Headings**: Create eye-catching hero section titles with background images or gradients
2. **Gradient Text**: Apply colorful gradients that would normally only work on colored text
3. **Brand Logos**: Display brand imagery within text without compromising readability
4. **Creative Effects**: Design unique visual effects combining text and background imagery
5. **Product Landing Pages**: Enhance marketing materials with visually interesting text treatments

### Key Benefits

- **Visual Impact**: Creates distinctive, professional-looking text effects
- **Flexibility**: Works with any background property (images, gradients, solid colors)
- **No Additional Elements**: Achieve effects without extra DOM elements or pseudo-elements
- **CSS-Only Solution**: Pure CSS approach without JavaScript overhead
- **Modern Web Design**: Supports contemporary design trends and visual storytelling

### Example Use Case

```css
h1 {
  background: url('texture.png') center/cover;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

This creates a headline where the background texture shows through the text characters.

## Syntax

```css
element {
  background: <background-value>;
  background-clip: text;
  color: transparent; /* Required to see the background through the text */
}
```

**Note**: Due to limited standardization, the `-webkit-` prefix should be used alongside the standard property for maximum compatibility.

## Browser Support

| Browser | First Release with Full Support | Prefix Required | Notes |
|---------|--------------------------------|-----------------|-------|
| Chrome | 4 | `-webkit-` | Has limitations with stacking context (see Known Issues) |
| Edge | 15 | None | Versions 79+ have limitations with stacking context |
| Firefox | 49 | `-webkit-` | Full support with `-webkit-` prefix |
| Safari | 15.5 | None | Partial support (as `a`) until 15.5 |
| Opera | 15 | `-webkit-` | Has limitations with stacking context |
| iOS Safari | 15.5 | None | Partial support (as `a`) until 15.5 |

### Overall Support Statistics
- **Full Support**: 92.67% of users
- **Partial Support**: 0.5% of users

## Detailed Browser Support Table

### Desktop Browsers

**Chrome**
- Versions 4-119: Supported with `-webkit-` prefix and limitations (#1)
- Version 120+: Fully supported without limitations (#1)

**Firefox**
- Versions 1-48: Not supported
- Version 49+: Supported with `-webkit-` prefix

**Safari**
- Versions 3.1-15.4: Partial support (`a` - Android/iOS)
- Version 15.5+: Full support

**Edge**
- Versions 12-14: Supported with `-webkit-` prefix
- Version 15-119: Supported with `-webkit-` prefix and limitations (#1)
- Version 120+: Fully supported without limitations (#1)

**Opera**
- Versions 9-14: Not supported
- Version 15-105: Supported with `-webkit-` prefix and limitations (#1)
- Version 106+: Fully supported without limitations (#1)

**Internet Explorer**
- Versions 5.5-11: Not supported

### Mobile Browsers

**iOS Safari**
- Versions 3.2-15.4: Partial support with limitations (#1, #2)
- Version 15.5+: Full support with limitation note (#1)

**Android Chrome**
- Version 4+: Supported with `-webkit-` prefix and limitations (#1)

**Samsung Internet**
- Versions 4-25: Supported with `-webkit-` prefix and limitations (#1)
- Version 25+: Fully supported

**Opera Mobile**
- Versions 10-80: Limited or partial support
- Version 80+: Fully supported

**Android Firefox**
- Version 144+: Fully supported

### Legacy & Minimal Support Browsers

**Opera Mini**: Not supported
**Internet Explorer Mobile**: Not supported
**UC Browser**: Limited support (v15.5+)
**Baidu**: Limited support (v13.52+)
**QQ Browser**: Limited support (v14.9+)
**KaiOS**: Supported (v2.5+)
**BlackBerry**: Supported (v7+)

## Known Issues

### Issue #1: Stacking Context Limitation
Doesn't work with a stacking context (e.g., `position: relative`, `z-index`, etc.)

**Affected Versions**:
- Chrome 4-119
- Edge 12-119
- Opera 15-105
- Safari 3.2-18.5
- iOS Safari 3.2-18.5
- Android Chrome, Samsung Internet, and other Chromium-based browsers

**Workaround**: Avoid using positioning properties that create a new stacking context on elements with `background-clip: text`. Consider restructuring the DOM or using wrapper elements without stacking context properties.

**Status**: Fixed in Chrome 120+ and Edge 120+

**Reference**: [Chromium bug #1500148](https://crbug.com/1500148)

### Issue #2: Flex/Grid Container Incompatibility
Doesn't work with flex or grid container children.

**Affected Versions**:
- Safari 3.2-15.4
- iOS Safari 3.2-15.4

**Workaround**: If using flex or grid layouts, avoid applying `background-clip: text` directly to flex/grid items. Instead, apply it to nested elements or restructure the layout.

**Status**: Resolved in Safari 15.5+

**Reference**: [WebKit bug #169125](https://bugs.webkit.org/show_bug.cgi?id=169125)

## Important Notes

- **Prefix Requirement**: Firefox and legacy Edge require the `-webkit-` prefix to use this feature
- **Color Transparency**: The text color must be set to `transparent` or `rgba(0, 0, 0, 0)` for the background to show through
- **Text Rendering**: Sub-pixel antialiasing may be affected depending on the browser implementation
- **Performance**: Complex background images may impact rendering performance, especially on mobile devices
- **Accessibility**: Consider adding `text-shadow` or alternative styling for improved contrast if needed

## Recommended Implementation Pattern

```css
.background-text {
  background: linear-gradient(45deg, #ff0000, #0000ff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
  font-size: 3rem;
}
```

For maximum compatibility:

```css
.background-text {
  background: url('image.jpg') center/cover;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

## Related Links

- [W3C CSS Backgrounds and Borders Module Level 4](https://drafts.csswg.org/css-backgrounds-4/#background-clip)
- [MDN Web Docs - background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip)
- [W3C Style Mailing List: Standardize 'background-clip: text'](https://lists.w3.org/Archives/Public/www-style/2016Mar/0283.html)
- [Chromium Issue Tracker: Stacking Context Bug](https://crbug.com/1500148)
- [WebKit Bug Tracker: Flex/Grid Container Issue](https://bugs.webkit.org/show_bug.cgi?id=169125)

## Support Summary

`background-clip: text` is widely supported across modern browsers with 92.67% global support. It works best in:
- Modern versions of Chrome, Edge, Firefox, Safari, and Opera
- iOS Safari 15.5 and later
- Android Chrome 4 and later
- Samsung Internet 4 and later

For optimal compatibility, always use the `-webkit-` prefix alongside the standard property, and test thoroughly on your target browsers, especially if using advanced CSS properties that create stacking contexts.
