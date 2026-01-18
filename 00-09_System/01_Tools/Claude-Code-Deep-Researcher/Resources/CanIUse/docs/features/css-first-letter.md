# CSS `::first-letter` Pseudo-Element

## Overview

The `::first-letter` CSS pseudo-element is used to apply styling to only the first "letter" of text within an element. This powerful selector enables sophisticated typographic effects such as drop caps, initial caps, and other first-letter styling techniques commonly used in editorial design and publications.

## Specification

- **Specification**: [CSS Selectors Level 3](https://www.w3.org/TR/css3-selectors/#first-letter)
- **Status**: ✅ **Recommended (REC)** - Stable and standardized

## Category

- **CSS** - Styling and layout

## Benefits and Use Cases

### Drop Caps
Create elegant drop-cap typography commonly seen in magazines and books:

```css
p::first-letter {
  font-size: 2.5em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 0.1em;
  color: #c60;
}
```

### Initial Caps Styling
Highlight the opening letter with distinct styling:

```css
blockquote::first-letter {
  font-size: 1.5em;
  font-weight: 700;
  color: #333;
}
```

### Decorative First Letters
Apply special fonts, colors, or effects to the opening character:

```css
article::first-letter {
  font-family: 'Garamond', serif;
  color: #d4af37;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
```

### Editorial Design
Perfect for creating professional-looking articles, blog posts, and typographic compositions that require visual hierarchy and emphasis.

## Browser Support

| Browser | First Version with Full Support | Badge |
|---------|--------------------------------|-------|
| **Chrome** | 9 | ✅ Fully Supported |
| **Edge** | 12 | ✅ Fully Supported |
| **Firefox** | 3.5 | ✅ Fully Supported |
| **Safari** | 5.1 | ✅ Fully Supported |
| **Opera** | 11.6 | ✅ Fully Supported |
| **iOS Safari** | 5.0+ | ✅ Fully Supported |
| **Android Browser** | 3 | ✅ Fully Supported |
| **Opera Mini** | All versions | ✅ Fully Supported |

### Overall Support
- **Global Support**: 93.69% of users
- **Partial Support**: 0.03% of users
- **No Support**: < 0.1% of users

## Browser Compatibility Details

### Legacy Browser Support

#### Internet Explorer
- **IE 9+**: Full support
- **IE 8**: Partial (recognizes only `:first-letter`, not `::first-letter` pseudo-element syntax)
- **IE 6-7**: Partial (with bugs related to punctuation handling)
- **IE 5.5**: Unsupported

#### Firefox
- **Firefox 3.5+**: Full support
- **Firefox 2-3**: Partial support

#### Chrome
- **Chrome 9+**: Full support
- **Chrome 5-8**: Unsupported

#### Safari
- **Safari 5.1+**: Full support
- **Safari 5**: Unsupported
- **Safari 3.2-4**: Partial support

#### Opera
- **Opera 11.6+**: Full support
- **Opera 10.0-11.5**: Partial (bugs with punctuation handling)
- **Opera 9-9.6**: Unsupported

### Mobile Browsers

- **iOS Safari**: Full support from version 5.0 onwards
- **Android Browser**: Full support from version 3 onwards
- **Samsung Internet**: Full support from version 4 onwards
- **Opera Mobile**: Full support from version 12 onwards
- **UC Browser**: Supported (version 15.5+)
- **Baidu Browser**: Supported (version 13.52+)
- **KaiOS**: Supported (version 2.5+)

## Known Issues and Bugs

### 1. WebKit Selection Bug
**Browser**: Safari, Chrome, and other WebKit-based browsers
**Issue**: The first character of text styled with `::first-letter` is not highlighted when selecting text.
**Impact**: Minor visual issue affecting text selection behavior
**Reference**: [WebKit Bug #6185](https://bugs.webkit.org/show_bug.cgi?id=6185)

### 2. Firefox Rendering Issue
**Browser**: Firefox
**Issue**: Firefox may incorrectly cut off the top and bottom of the `::first-letter` character in certain cases, particularly with specific font combinations or sizing scenarios.
**Impact**: Potential visual clipping of styled first letters
**Reference**: [Firefox Bug #1233271](https://bugzilla.mozilla.org/show_bug.cgi?id=1233271)

## Implementation Notes

### Specification Quirks

The CSS specification defines that `::first-letter` should include surrounding punctuation as part of the match. However, browser implementation varies:

**Spec Requirements**:
- Surrounding punctuation should be included in the pseudo-element match
- Digraphs that are always capitalized together (e.g., "IJ" in Dutch) should both be matched

**Reality**:
- **No browser has implemented digraph matching** as specified
- **Punctuation handling varies**: Most browsers exclude punctuation immediately following the first letter, contrary to the specification

### Supported CSS Properties

Not all CSS properties can be applied to `::first-letter`. Only the following properties are supported:

- **Font Properties**: `font`, `font-size`, `font-style`, `font-weight`, `font-family`, `font-variant`
- **Text Properties**: `text-decoration`, `text-transform`, `text-shadow`, `letter-spacing`, `word-spacing`
- **Color & Background**: `color`, `background` (and related properties)
- **Margin & Padding**: `margin`, `margin-left`, `margin-right`, `margin-top`, `margin-bottom`, `padding`
- **Border**: `border` and related properties
- **Line Height**: `line-height`
- **Float & Clear**: `float`, `clear`
- **Vertical Align**: `vertical-align`

### Best Practices

1. **Test Thoroughly**: Due to browser implementation variations, always test your `::first-letter` styling across target browsers
2. **Handle Punctuation**: Consider how punctuation at the start of text affects styling (e.g., opening quotes, dashes)
3. **Performance**: `::first-letter` is generally performant, but avoid overly complex styling
4. **Accessibility**: Ensure styled first letters don't harm text readability or screen reader functionality
5. **Fallbacks**: Consider graceful degradation for older browsers

## Related Resources

### Documentation
- [MDN Web Docs: `::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter)
- [W3C CSS Selectors Level 3 Specification](https://www.w3.org/TR/css3-selectors/#first-letter)

### Related Pseudo-Elements
- [`::first-line`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-line) - Styles the first line of text
- [`::before`](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) - Insert content before an element
- [`::after`](https://developer.mozilla.org/en-US/docs/Web/CSS/::after) - Insert content after an element

## Example Usage

```css
/* Classic drop cap styling */
article p:first-of-type::first-letter {
  float: left;
  font-size: 3.2em;
  font-weight: bold;
  line-height: 1;
  padding-right: 8px;
  margin-top: 3px;
  color: #c60;
  font-family: Georgia, serif;
}

/* Simple initial cap */
.quote::first-letter {
  font-size: 1.8em;
  font-weight: 700;
  color: #666;
}

/* Decorative styling */
h2::first-letter {
  color: #007bff;
  font-size: 1.2em;
  text-shadow: 1px 1px 2px rgba(0, 123, 255, 0.2);
}
```

## Summary

The `::first-letter` pseudo-element enjoys excellent browser support with 93.69% global coverage. While minor rendering inconsistencies exist in WebKit and Firefox browsers, the feature is stable and suitable for production use. It provides an elegant way to enhance typography with drop caps and initial styling, making it an essential tool for editorial design and professional web typography.
