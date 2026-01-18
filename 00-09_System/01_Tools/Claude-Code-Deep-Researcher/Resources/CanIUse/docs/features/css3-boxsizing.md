# CSS3 Box-sizing

## Overview

The CSS `box-sizing` property is a fundamental CSS feature that controls how the total width and height of an HTML element is calculated. It determines whether an element's padding and border should be included in its specified width and height dimensions.

## Description

The `box-sizing` property specifies a method for defining how an element's borders and padding should be included in size unit calculations. This property is essential for predictable layout behavior and helps developers avoid unexpected overflow or sizing issues when adding padding or borders to elements.

## Specification

- **Status:** Working Draft (WD)
- **Specification URL:** [W3C CSS Sizing Module Level 3](https://www.w3.org/TR/css-sizing/#box-sizing)
- **Category:** CSS3

## Key Values

The `box-sizing` property accepts the following values:

- **`content-box`** (default) - Width and height only apply to the element's content. Padding and border are added outside.
- **`border-box`** - Width and height include the content, padding, and border.
- **`padding-box`** (deprecated) - Width and height include the content and padding, but not the border. Note: This value was removed from the specification and is no longer supported in modern browsers.

## Use Cases & Benefits

### 1. Predictable Layout

When using `border-box`, you can add padding and borders without changing the element's total size, making layouts more predictable:

```css
.box {
  width: 200px;
  padding: 10px;
  border: 1px solid black;
  box-sizing: border-box; /* Box stays 200px wide */
}
```

### 2. Simplified Grid Systems

Creating responsive grid layouts is easier when all grid items use `border-box`:

```css
* {
  box-sizing: border-box;
}

.grid-item {
  width: 25%;
  padding: 15px;
}
```

### 3. Consistent Component Sizing

Components maintain consistent dimensions regardless of internal padding changes, improving design predictability.

### 4. Reduced Layout Shift

Using `border-box` helps prevent unexpected layout shifts when properties change dynamically.

### 5. Mobile-Friendly Design

Makes responsive design more straightforward by ensuring elements don't overflow their containers unexpectedly.

## Browser Support

Browser support is extensive. The feature is supported in all modern browsers and most legacy browsers with minimal limitations.

### Support Legend

- **y** = Supported
- **y x** = Supported with vendor prefix (-webkit-, -moz-, etc.)
- **p** = Partial support
- **n** = Not supported

### Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Internet Explorer** | 5.5–7 | Partial | Limited support |
| | 8–11 | Yes | Full support |
| **Edge** | 12+ | Yes | Full support across all versions |
| **Firefox** | 2–28 | Yes (prefixed) | Requires -moz- prefix; supported `padding-box` value |
| | 29+ | Yes | Prefix no longer required |
| **Chrome** | 4–9 | Yes (prefixed) | Requires -webkit- prefix |
| | 10+ | Yes | Prefix no longer required |
| **Safari** | 3.1–5 | Yes (prefixed) | Requires -webkit- prefix |
| | 5.1+ | Yes | Prefix no longer required |
| **Opera** | 9 | No | Not supported |
| | 9.5–9.6+ | Yes | Full support |
| **iOS Safari** | 3.2–4.3 | Yes (prefixed) | Requires -webkit- prefix |
| | 5.0+ | Yes | Prefix no longer required |
| **Android Browser** | 2.1–3 | Yes (prefixed) | Requires -webkit- prefix |
| | 4+ | Yes | Full support |
| **Opera Mobile** | 10+ | Yes | Full support |
| **Samsung Internet** | 4+ | Yes | Full support |
| **Opera Mini** | All versions | Yes | Full support |
| **BlackBerry Browser** | 7 | Yes (prefixed) | Requires -webkit- prefix |
| | 10+ | Yes | Full support |
| **UC Browser** | 15.5+ | Yes | Full support |
| **Baidu Browser** | 13.52+ | Yes | Full support |
| **QQ Browser** | 14.9+ | Yes | Full support |
| **KaiOS Browser** | 2.5+ | Yes | Full support |

### Support Summary

- **Global Usage:** 93.72% of browsers globally support this feature
- **Prefixed Support:** Firefox 2–28 and Chrome 4–9 require vendor prefix (`-webkit-`, `-moz-`)
- **Full Support:** Since Firefox 29 and Chrome 10, this feature has been widely supported without prefixes
- **Modern Browsers:** Universally supported in all modern browsers

## Known Issues & Browser Bugs

### 1. Android Browser - Select Element Dimensions

Android browsers do not calculate correctly the dimensions (width and height) of the HTML `select` element when using `box-sizing`.

**Workaround:** Consider using custom select styling solutions or avoid `box-sizing` on `select` elements.

### 2. Safari 6.0.x - Table Display

Safari 6.0.x does not apply `box-sizing` to elements with `display: table;`

**Workaround:** Use alternative display values or avoid `box-sizing` with table display.

### 3. IE9 - Positioned Elements with Scrollbars

IE9 will subtract the width of the scrollbar from the width of the element when set to `position: absolute` or `position: fixed` with `overflow: auto` or `overflow-y: scroll`.

**Workaround:** Test carefully with positioned elements containing scrollbars; use explicit width calculations if needed.

### 4. IE8 - Min/Max Width/Height Properties

IE8 ignores `box-sizing: border-box` if `min-width`, `max-width`, `min-height`, or `max-height` is used.

**Workaround:** Avoid combining these properties in IE8 or use JavaScript fallbacks.

### 5. IE8 - Min-Width Property

In IE8, the `min-width` property applies to `content-box` even if `box-sizing` is set to `border-box`.

**Workaround:** Set explicit widths or use JavaScript for min-width behavior in IE8.

### 6. Chrome - Select Options with Zoom Level < 100%

Chrome has problems selecting options from the `select` element when using `box-sizing: border-box` and browser zoom level is less than 100%.

**Workaround:** Be aware of this issue in Chrome; test with various zoom levels.

### 7. Chrome - Inherit Value with Details Element

In Chrome, the `inherit` value doesn't work on elements inside `<details>`, which could lead to unexpected behavior when `box-sizing: inherit` is used in a universal selector.

**Workaround:** Explicitly set `box-sizing` values rather than relying on inheritance within `<details>` elements, or avoid universal selectors.

See: [Chromium Issue #589475](https://bugs.chromium.org/p/chromium/issues/detail?id=589475)

## Implementation Examples

### Basic Usage

```css
/* Apply border-box sizing to all elements */
* {
  box-sizing: border-box;
}

/* Individual element */
.container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box; /* Total width remains 100% */
}
```

### With Vendor Prefixes (Legacy Support)

```css
.box {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
```

### Responsive Grid Example

```css
* {
  box-sizing: border-box;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-item {
  padding: 15px;
  border: 1px solid #ddd;
  /* Padding doesn't expand item width beyond grid cell */
}
```

## Historical Notes

**Firefox `padding-box` Support:** Firefox versions before 57 also supported the `padding-box` value for `box-sizing`. This value was removed from the specification and is no longer supported in Firefox 57 and later versions.

**Vendor Prefixes:** Early versions of Firefox (pre-29) and Chrome (pre-10) required vendor prefixes (`-moz-box-sizing` and `-webkit-box-sizing` respectively) for this feature to work.

## Related Resources

### Official Documentation

- [MDN Web Docs - CSS box-sizing](https://developer.mozilla.org/En/CSS/Box-sizing)
- [WebPlatform Docs - box-sizing](https://webplatform.github.io/docs/css/properties/box-sizing)

### Tutorials & Articles

- [CSS Tricks - box-sizing](https://css-tricks.com/box-sizing/)
- [456 Berea Street - Controlling Width with CSS3 Box-sizing](https://www.456bereastreet.com/archive/201104/controlling_width_with_css3_box-sizing/)

### Polyfills & Compatibility

- [Box-sizing Polyfill for IE](https://github.com/Schepp/box-sizing-polyfill) - Provides fallback support for older IE versions

## Recommendations

1. **Use border-box globally** - Add `* { box-sizing: border-box; }` at the start of your stylesheets for predictable sizing
2. **Test on target browsers** - While support is excellent, test on IE8-9 if legacy support is required
3. **Avoid mixing values** - Keep consistent `box-sizing` values across your project
4. **Be aware of inheritance** - `box-sizing` is inherited, so setting it on the root element applies to most child elements
5. **Document exceptions** - If you need `content-box` for specific elements, document why

## Keywords

`border-box`, `content-box`, `box model`, `layout`, `sizing`, `CSS3`

## Feature Status

- **Spec Status:** Working Draft
- **Implementation Status:** Widely supported across all modern browsers
- **Global Usage:** 93.72%
- **Recommendation Level:** Safe for production use in all modern projects
