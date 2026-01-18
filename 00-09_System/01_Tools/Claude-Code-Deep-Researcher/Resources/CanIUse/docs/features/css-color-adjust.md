# CSS print-color-adjust

## Description

The `print-color-adjust` (also known as `-webkit-print-color-adjust` in WebKit/Blink browsers) is a CSS property that controls whether the browser should respect or override color and background settings when printing a document. This property allows developers to force printing of background colors and images, ensuring that the printed output matches the intended visual design.

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification Link**: [CSS Color Adjust Module Level 1 - print-color-adjust](https://w3c.github.io/csswg-drafts/css-color-adjust-1/#propdef-print-color-adjust)

## Categories

- **CSS**

## Use Cases & Benefits

### Primary Use Cases

1. **Print-Friendly Designs**: Ensure background colors and images are printed as intended, not stripped by browser defaults
2. **Business Documents**: Maintain color schemes in printed reports, invoices, and official documents
3. **Educational Materials**: Preserve visual hierarchy and color coding in printed educational content
4. **Design Control**: Override browser print settings that hide background colors to save ink
5. **Brand Consistency**: Guarantee that printed materials match brand colors and visual identity
6. **Chart and Data Visualization**: Preserve colors in printed graphs, charts, and data visualizations
7. **Web Applications**: Control color output in print layouts for SaaS and web applications

### Key Benefits

- **Enhanced Print Quality**: Full control over how colors render when printing
- **Visual Consistency**: Maintain design integrity between screen and print
- **Better Document Presentation**: Create professional-looking printed documents
- **User Control Override**: Force printing of design-critical colors regardless of user print settings
- **Improved Brand Presentation**: Ensure corporate colors appear correctly in printed materials

## Browser Support

### Support Summary by Browser

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Chrome** | 19 | ✅ Supported (with prefix) |
| **Firefox** | 48 | ✅ Fully Supported |
| **Safari** | 6 | ✅ Supported (with prefix) |
| **Edge** | 79 | ✅ Supported (with prefix) |
| **Opera** | 15 | ✅ Supported (with prefix) |
| **Internet Explorer** | Not Supported | ❌ No Support |
| **Opera Mini** | Not Supported | ❌ No Support |

### Desktop Browsers

#### Chrome/Chromium
- **Partial Support**: Chrome 4-18 (marked as "u" - unknown/partial)
- **Full Support with Prefix**: Chrome 19+
- **Current Status**: Fully supported with `-webkit-print-color-adjust` prefix

#### Firefox
- **Partial Support**: Firefox 2-47
- **Full Support**: Firefox 48+
- **Current Status**: Fully supported without prefix

#### Safari
- **Partial Support with Prefix**: Safari 6-15.3 (marked as "y x")
- **Full Support**: Safari 15.4+
- **Current Status**: Fully supported without prefix (as of Safari 15.4)

#### Edge
- **No Support**: Edge 12-78
- **Partial Support with Prefix**: Edge 79+
- **Current Status**: Supported with `-webkit-print-color-adjust` prefix

#### Opera
- **No Support**: Opera 9-12.1
- **Partial Support with Prefix**: Opera 15+
- **Current Status**: Supported with `-webkit-print-color-adjust` prefix

#### Internet Explorer
- **No Support**: IE 5.5-11
- **Status**: Not supported in any version

### Mobile Browsers

#### iOS Safari
- **Partial Support with Prefix**: iOS Safari 3.2-15.3 (marked as "u x")
- **Full Support**: iOS Safari 15.4+
- **Current Status**: Fully supported without prefix (as of iOS Safari 15.4)

#### Android Browser
- **Partial Support with Prefix**: Android 4.4.3-4.4.4 and older versions (marked as "u")
- **Full Support**: Android 142+ (marked as "y x")

#### Opera Mobile
- **No Support**: Opera Mobile 10-12.1
- **Full Support with Prefix**: Opera Mobile 80+

#### Firefox for Android
- **Full Support**: Firefox Android 144+

#### Samsung Internet
- **Partial Support**: Samsung Internet 4-29 (marked as "u")

#### Other Mobile Browsers
- **Android Chrome**: Partial support (Android 142 marked as "u")
- **Android UC Browser**: Partial support (15.5 marked as "u")
- **BlackBerry**: Partial support (marked as "u")
- **Opera Mini**: Not supported
- **KaiOS**: Fully supported (KaiOS 2.5+)

### Global Usage

- **Full Support Usage**: 48.41%
- **Partial/Prefixed Support**: Additional coverage with vendor prefixes
- **Unsupported**: Legacy browsers and some mobile platforms

## Code Examples

### Basic Usage

```css
/* Force printing of background colors */
body {
  background-color: #003366;
  color: white;
  print-color-adjust: exact;
}

/* Ensure images print */
.hero-image {
  background-image: url('hero.jpg');
  background-size: cover;
  print-color-adjust: exact;
}
```

### With Vendor Prefixes (for broader compatibility)

```css
/* Maximum compatibility across browsers */
.print-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* Standard property */
  print-color-adjust: exact;

  /* Webkit/Blink browsers (Chrome, Safari, Edge, Opera) */
  -webkit-print-color-adjust: exact;
}
```

### Property Values

```css
/* Default - browser may optimize for printing */
print-color-adjust: economy;

/* Force exact rendering as on screen */
print-color-adjust: exact;

/* Inherit from parent */
print-color-adjust: inherit;
```

## Known Issues & Bugs

### Chrome and Safari Body Background Limitation

⚠️ **Issue**: Chrome and Safari do not print backgrounds of the `<body>` element. If `print-color-adjust: exact` is set on the `<body>` element, it will apply only to its descendants, not to the body itself.

**Workaround**: Apply background colors to child elements instead of the body, or use a wrapper div:

```css
/* Instead of */
body {
  background-color: #333;
  print-color-adjust: exact;
}

/* Use */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  z-index: -1;
  print-color-adjust: exact;
}
```

**Reference**: [JSFiddle test case](https://jsfiddle.net/soul_wish/8tw09dd0/)

## Related Links

### Official Documentation
- [MDN Web Docs - print-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust)

### Browser Issue Trackers
- [Edge Issue #12399195](https://web.archive.org/web/20190624214232/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12399195/) - Edge issue tracking
- [Chromium Bug #131054](https://bugs.chromium.org/p/chromium/issues/detail?id=131054) - Chromium print-color-adjust property issue

### Related CSS Properties
- [`color-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-adjust) - Controls color rendering in general
- [`@media print`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/print) - Print media queries
- [`@page`](https://developer.mozilla.org/en-US/docs/Web/CSS/@page) - CSS page rules

## Testing & Compatibility

### How to Test

1. Open the web page in a modern browser
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac) to open print preview
3. Check if background colors and images render correctly
4. Try printing to PDF to see the output

### Fallback Strategies

For older browsers without support:

```css
.printable-section {
  background-color: #f0f0f0;

  /* Will work in modern browsers */
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;

  /* Fallback: ensure good contrast even in economy mode */
  color: #333;
}
```

## Implementation Notes

- **Prefix Required**: Use `-webkit-print-color-adjust` for Chrome, Safari, Edge, and Opera
- **No Prefix**: Firefox and modern Safari/iOS Safari don't require the prefix
- **Body Element Limitation**: Avoid setting this property on the body element; use child elements instead
- **Performance**: No performance impact; this is a rendering hint to the browser
- **Specificity**: Can be overridden by more specific selectors or inline styles
- **Inheritance**: Not inherited, must be set on each element requiring exact color printing

## Browser Vendor Prefix Reference

| Browser Engine | Prefix | Example |
|---|---|---|
| Webkit/Blink (Chrome, Safari, Edge, Opera) | `-webkit-` | `-webkit-print-color-adjust: exact;` |
| Firefox | None | `print-color-adjust: exact;` |

## Summary

`print-color-adjust` provides essential control over color rendering in printed documents. With 48.41% global support and coverage across all major modern browsers, it's a reliable property for ensuring print quality. However, developers should be aware of the limitation with the `<body>` element in Chrome and Safari, and should use vendor prefixes for maximum compatibility with legacy versions of Chromium-based browsers.

For projects requiring print-friendly designs, it's recommended to:
1. Use both standard and `-webkit-` prefixed versions
2. Avoid setting the property directly on the body element
3. Test thoroughly in print preview before deployment
4. Provide fallback styles for older browsers
