# CSS Hyphenation (`hyphens` property)

## Overview

The `hyphens` CSS property provides a standardized method for controlling automatic word hyphenation at line breaks. This property enables developers to improve text layout and readability in justified or constrained text containers by allowing words to be hyphenated according to language-specific rules.

## Description

CSS Hyphenation is a method of controlling when words at the end of lines should be hyphenated using the `hyphens` property. This feature allows for more sophisticated text handling, particularly in justified text layouts and narrow containers where word breaking can significantly impact readability.

The property accepts three main values:
- **`auto`** - Automatically hyphenates words where appropriate
- **`manual`** - Only hyphenates where hyphenation hints are present (e.g., soft hyphens)
- **`none`** - Disables hyphenation entirely

## Specification

| Property | Value |
|----------|-------|
| **Specification** | [CSS Text Module Level 3 (W3C Candidate Recommendation)](https://www.w3.org/TR/css3-text/#hyphenation) |
| **Status** | Candidate Recommendation (CR) |
| **First Published** | 2012 |

## Categories

- CSS3 Text Layout

## Benefits and Use Cases

### Improved Typography
- Better text justification by reducing excessive word spacing
- More professional appearance in multi-column layouts
- Enhanced readability in narrow viewports and mobile devices

### Use Cases
1. **Justified Text** - Essential for justified text alignment where hyphenation prevents large gaps between words
2. **Multi-Column Layouts** - Improves text flow in newspaper-style columns
3. **Responsive Design** - Maintains readable line lengths on narrow screens
4. **Print-Like Layouts** - Achieves magazine or book-quality typography on the web
5. **Internationalization** - Language-specific hyphenation rules for multilingual content
6. **Accessibility** - Properly hyphenated text can improve readability for certain users when combined with appropriate language attributes

## Browser Support Summary

| Browser | Unprefixed Support | First Full Support |
|---------|:------------------:|:------------------:|
| **Chrome** | 88 | Chrome 88+ |
| **Firefox** | 43 | Firefox 43+ |
| **Safari** | 17.0 | Safari 17.0+ |
| **Edge** | 105 | Edge 105+ |
| **Opera** | 91 | Opera 91+ |
| **iOS Safari** | 17.0 | iOS Safari 17.0+ |

### Support Details

#### Desktop Browsers

**Chrome**
- ✅ Full support: v88+
- 🚫 Limited support (prefixed): v55-87 (`-webkit-` prefix, `auto` value only on Android & macOS)
- ❌ No support: v4-54

**Firefox**
- ✅ Full support: v43+
- 🚫 Limited support (prefixed): v6-42 (`-moz-` prefix)
- ❌ No support: v2-5

**Safari**
- ✅ Full support: v17.0+
- 🚫 Limited support (prefixed): v5.1-16.6 (`-webkit-` prefix)
- ❌ No support: v3.1-5

**Edge**
- ✅ Full support: v105+
- 🚫 Limited support (prefixed): v12-104 (`-webkit-` prefix)
- ❌ No support: v10-11 (Internet Explorer)

**Opera**
- ✅ Full support: v91+
- 🚫 Limited support (prefixed): v42-90 (`-webkit-` prefix)
- ❌ No support: v9-41

**Internet Explorer**
- 🚫 Partial support (prefixed): IE 10-11 (`-ms-` prefix)
- ❌ No support: IE 5.5-9

#### Mobile Browsers

| Browser | Support Status | Notes |
|---------|:--:|---------|
| **iOS Safari** | ✅ v17.0+ | Full support from iOS 17 onwards |
| **Chrome Android** | ✅ v142+ | Full support in latest versions |
| **Firefox Android** | ✅ v144+ | Full support in latest versions |
| **Opera Mobile** | ✅ v80+ | Full support from v80+ |
| **Samsung Internet** | ✅ v6.2+ | Full support; partial from v5.0-5.4 |
| **Android Browser** | ✅ v142+ | Limited in older versions |
| **UC Browser** | ✅ v15.5+ | Full support |

## Global Usage Statistics

| Metric | Value |
|--------|-------|
| **Full Support** | 93.18% of global users |
| **Partial Support** | 0.3% of global users |
| **No Support** | ~6.5% of global users |

## Prefix Requirements

### Historical Prefixes
Most modern browsers now support the unprefixed `hyphens` property. Legacy support requires vendor prefixes:

```css
/* Modern browsers (no prefix needed) */
.text {
  hyphens: auto;
}

/* For older browsers, include prefixed versions */
.text {
  -webkit-hyphens: auto; /* Safari 5.1-16.6, Chrome 55-87, iOS 4.2-16.6 */
  -moz-hyphens: auto;    /* Firefox 6-42 */
  -ms-hyphens: auto;     /* IE 10-11 */
  hyphens: auto;         /* Standard (IE 10+ with prefix, Chrome 88+, Firefox 43+, etc.) */
}
```

### Prefix Status
`ucprefix`: false - No vendor-specific prefixes are actively tracked in CanIUse

## Important Considerations

### Language Declaration
For the `auto` value to work properly, you **must** set the `lang` attribute on the HTML element:

```html
<html lang="en">
  <!-- Content here will be hyphenated according to English rules -->
</html>
```

Setting the language attribute is essential for:
- Correct hyphenation based on language-specific rules
- Improved accessibility for screen readers
- Proper handling of internationalized content

### Platform Limitations

**Chrome & Edge Limited Support (v55-87 / v12-104)**
- Only the `auto` value is supported
- Limited to Android and macOS platforms
- Windows support is incomplete
- Full support was added in later versions

**Webkit Browsers (Safari, iOS Safari)**
- Required `-webkit-` prefix for Safari 5.1-16.6
- iOS Safari had the same limitation through iOS 16.6
- Full unprefixed support from Safari 17.0 and iOS 17.0 onwards

### Progressive Enhancement
If supporting older browsers is necessary:

```css
.article {
  word-wrap: break-word; /* Fallback for very old browsers */
  overflow-wrap: break-word; /* Better fallback */
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
```

## Known Issues and Bugs

### Chrome Implementation Notes
- Chrome versions < 55 support `-webkit-hyphens: none`, but not the `auto` property
- The full `auto` value support was limited to Android & macOS platforms until Chrome 88
- See [Chrome Bug #652964](https://bugs.chromium.org/p/chromium/issues/detail?id=652964) for implementation details

### WebKit Prefix Removal
- Safari continues to use the `-webkit-` prefix for versions 5.1-16.6
- See [WebKit Bug #193002](https://bugs.webkit.org/show_bug.cgi?id=193002) for unprefixing efforts

## Code Examples

### Basic Usage

```css
/* Enable automatic hyphenation */
p {
  hyphens: auto;
  lang: en; /* Important: declare language */
}
```

```html
<!-- Always set lang attribute for proper hyphenation -->
<html lang="en">
<head>
  <style>
    p {
      hyphens: auto;
      width: 200px; /* Narrow width to demonstrate hyphenation */
      text-align: justify;
    }
  </style>
</head>
<body>
  <p>
    This is a paragraph with a very long word like "supercalifragilisticexpialidocious"
    that would normally break the layout.
  </p>
</body>
</html>
```

### Multilingual Example

```html
<html>
<head>
  <style>
    p {
      hyphens: auto;
      width: 250px;
      justify-content: justify;
    }
  </style>
</head>
<body>
  <p lang="en">
    This is English text with automatic hyphenation enabled.
  </p>

  <p lang="de">
    Das ist deutscher Text mit automatischer Silbentrennung.
  </p>

  <p lang="fr">
    Ceci est un texte français avec coupure automatique syllabique.
  </p>
</body>
</html>
```

### Soft Hyphen with Manual Mode

```css
p {
  hyphens: manual; /* Only hyphenate at soft hyphens */
}
```

```html
<p>
  This is a long word: sup­er­cal­i­frag­i­lis­tic­ex­pi­al­i­do­cious
</p>
```

The `­` entity represents a soft hyphen (U+00AD), which only shows when actually breaking at that point.

## Related Features and Properties

- **[`lang` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)** - Essential for correct hyphenation
- **[`word-break`](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break)** - Controls word breaking behavior
- **[`word-wrap` / `overflow-wrap`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)** - Handles overflow text
- **[`text-align: justify`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)** - Often used with hyphenation
- **[`column-count`](https://developer.mozilla.org/en-US/docs/Web/CSS/column-count)** - Multi-column layouts benefit from hyphenation
- **[`hyphenate-character`](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphenate-character)** - CSS Text Level 4 (defines the hyphen character used)
- **[`hyphenate-limit-chars`](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphenate-limit-chars)** - CSS Text Level 4 (limits hyphenation)

## References and Resources

### Official Documentation
- [MDN Web Docs - CSS hyphens Property](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens)
- [W3C CSS Text Module Level 3 Specification](https://www.w3.org/TR/css3-text/#hyphenation)
- [WebPlatform Docs](https://webplatform.github.io/docs/css/properties/hyphens)

### Blog Posts and Articles
- [Adrian Roselli: On the use of lang attribute](https://blog.adrianroselli.com/2015/01/on-use-of-lang-attribute.html) - Best practices for language declarations
- [Hyphenation Blog Post](https://clagnut.com/blog/2394)

### Bug Tracking
- [Chromium Bug #652964](https://bugs.chromium.org/p/chromium/issues/detail?id=652964) - Chrome hyphenation implementation tracker
- [WebKit Bug #193002](https://bugs.webkit.org/show_bug.cgi?id=193002) - Webkit `-webkit-hyphens` unprefixing efforts

## Summary

CSS Hyphenation (`hyphens` property) has mature support across modern browsers, with over 93% global user coverage for full support. While older browsers required vendor prefixes, modern versions of all major browsers now support the unprefixed property.

For best results:
1. Always include the `lang` attribute on your HTML element
2. Consider including vendor prefixes for legacy browser support
3. Test thoroughly with your target language's hyphenation rules
4. Use in conjunction with justified text or multi-column layouts for maximum benefit

The feature is particularly valuable for internationalized content and responsive designs where maintaining readable line lengths across devices is critical.
