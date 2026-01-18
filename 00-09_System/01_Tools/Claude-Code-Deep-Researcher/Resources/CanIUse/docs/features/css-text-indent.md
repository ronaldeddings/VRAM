# CSS text-indent

## Overview

The `text-indent` property applies indentation to the first line of inline content in a block container. It's a fundamental CSS property for controlling text formatting and spacing in typography.

## Description

The `text-indent` CSS property specifies the indentation of the first line in a block of text. This property can be used to:

- Indent paragraphs for improved readability
- Create hanging indents with negative values
- Implement custom formatting for text blocks
- Hide text for image replacement techniques

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [W3C CSS Text Module Level 3](https://w3c.github.io/csswg-drafts/css-text-3/#text-indent-property)

## Categories

- **Type**: CSS Text Property
- **Module**: CSS Text Module Level 3

## Syntax

```css
text-indent: <length-percentage> || [ hanging ]? || [ each-line ]?
```

### Values

- **`<length>`**: Any valid CSS length (px, em, rem, etc.)
- **`<percentage>`**: Percentage of the containing block width
- **`each-line`** (optional): Indentation applies to each line (advanced feature)
- **`hanging`** (optional): Inverts the indentation so that all lines except the first are indented (advanced feature)

### Examples

```css
/* Basic indentation */
p {
  text-indent: 2em;
}

/* Negative indentation for hanging indent */
li {
  text-indent: -1.5em;
  margin-left: 1.5em;
}

/* Percentage-based indentation */
.article {
  text-indent: 10%;
}

/* Using each-line (experimental) */
.multiline {
  text-indent: 1em each-line;
}

/* Using hanging (experimental) */
.hanging-indent {
  text-indent: 2em hanging;
}
```

## Use Cases & Benefits

### 1. **Paragraph Indentation**
   - Traditional typography style for printed documents
   - Improves readability by visually separating paragraphs
   - Common in academic papers and books

### 2. **Hanging Indents**
   - Useful for lists and bibliographies
   - Creates visual hierarchy
   - Improves navigation through long content

### 3. **Text Replacement**
   - Legacy technique for hiding text while maintaining accessibility
   - Useful for replacing text with background images
   - Important for SEO-friendly image replacement

### 4. **Formatting Control**
   - Control indentation in block-level text
   - Create custom typography styles
   - Precise text layout control

### 5. **Accessibility**
   - Text content remains in the DOM
   - Screen readers still have access to hidden text
   - Better than display: none for content preservation

## Browser Support

### Summary
- **Full Support**: 11.67% of users
- **Partial Support**: 82.05% of users
- **No Support**: 6.28% of users

### Support Legend
- **Y**: Full support (including `each-line` and `hanging` keywords)
- **A #1**: Partial support - `<length>` values supported, but not `each-line` or `hanging` keywords
- **A #2**: Support for `each-line` and `hanging` available behind "Experimental Web Platform features" flag

### Detailed Browser Support Table

| Browser | Version(s) | Status | Notes |
|---------|-----------|--------|-------|
| **Chrome** | 4–37 | Partial (A #1) | Basic length/percentage support |
| | 38–146 | Partial (A #1 + #2) | Experimental keywords behind flag |
| **Firefox** | 2–120 | Partial (A #1) | Basic length/percentage support |
| | 121+ | Full (Y) | Full support including all keywords |
| **Safari** | 3.1–15.6 | Partial (A #1) | Basic length/percentage support |
| | 16.0+ | Full (Y) | Full support including all keywords |
| **Edge** | 12–18 | Partial (A #1) | Basic length/percentage support |
| | 79+ | Partial (A #1 + #2) | Experimental keywords behind flag |
| **Opera** | 9–24 | Partial (A #1) | Basic length/percentage support |
| | 25+ | Partial (A #1 + #2) | Experimental keywords behind flag |
| **iOS Safari** | 3.2–15.6 | Partial (A #1) | Basic length/percentage support |
| | 16.0+ | Full (Y) | Full support including all keywords |
| **Android Browser** | 2.1–4.4.3 | Partial (A #1) | Basic length/percentage support |
| **Opera Mini** | All versions | Partial (A #1) | Basic length/percentage support |

### Mobile & Alternative Browsers

| Browser | Version(s) | Status |
|---------|-----------|--------|
| **Android Firefox** | 144 | Full (Y) |
| **Android Chrome** | 142 | Partial (A #1 + #2) |
| **Samsung Internet** | 4–29 | Partial (A #1 + #2) |
| **UC Browser** | 15.5 | Partial (A #1 + #2) |
| **Baidu Browser** | 13.52 | Partial (A #1 + #2) |
| **QQ Browser** | 14.9 | Partial (A #1 + #2) |
| **Blackberry** | 7, 10 | Partial (A #1) |
| **IE Mobile** | 10–11 | Partial (A #1) |
| **KaiOS** | 2.5–3.1 | Partial (A #1) |

## Important Notes

### 1. **Partial Support Limitations**
Partial support (A #1) means browsers only support the basic `<length>` and `<percentage>` values. The newer keywords (`each-line` and `hanging`) are not supported in these versions.

### 2. **Experimental Features**
Support for `each-line` and `hanging` keywords is currently behind the "Experimental Web Platform features" flag in most browsers. Enable this flag in your browser settings to test these features.

### 3. **Recommendations**
For production use:
- Use basic `<length>` or `<percentage>` values for universal compatibility
- Avoid `each-line` and `hanging` keywords unless targeting modern browsers
- Test thoroughly across your target browsers
- Provide fallbacks for older browsers

### 4. **Negative Values**
Negative `text-indent` values can be used for hanging indents, but this requires additional CSS (like `margin-left` or `padding-left`) to offset the indented content properly.

## Practical Examples

### Example 1: Simple Paragraph Indentation
```css
p {
  text-indent: 1.5em;
  line-height: 1.6;
}
```

### Example 2: Hanging Indent (Traditional Approach)
```css
.quote {
  text-indent: -1.5em;
  margin-left: 1.5em;
  padding-left: 1.5em;
}
```

### Example 3: List Indentation
```css
dl dt {
  text-indent: 0;
  font-weight: bold;
}

dl dd {
  text-indent: 2em;
  margin-left: 0;
}
```

### Example 4: Accessibility-Friendly Text Hiding
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  text-indent: -9999px;
  overflow: hidden;
}
```

## Related Properties

- `margin-left` - Works in combination with negative `text-indent`
- `padding-left` - Additional spacing control
- `line-height` - Controls vertical spacing
- `word-spacing` - Controls space between words
- `letter-spacing` - Controls space between characters
- `white-space` - Controls whitespace handling

## Compatibility Considerations

### When to Use
- ✅ Basic length/percentage values for all modern browsers
- ✅ Progressive enhancement for older browsers
- ⚠️ Test thoroughly across target user base

### When to Avoid
- ❌ Relying on `each-line` and `hanging` without feature detection
- ❌ Using as primary content hiding mechanism (use modern alternatives)
- ❌ Assuming mobile browser support for experimental features

## References & Resources

### Official Documentation
- [MDN Web Docs - CSS text-indent](https://developer.mozilla.org/en-US/docs/Web/CSS/text-indent)
- [W3C CSS Text Module Level 3 Specification](https://w3c.github.io/csswg-drafts/css-text-3/#text-indent-property)

### Related Articles
- [Text Indentation for Image Replacement](https://www.sitepoint.com/css-image-replacement-text-indent-negative-margins-and-more/)

### Browser Bug Tracking
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=784648)
- [WebKit Support Bug](https://bugs.webkit.org/show_bug.cgi?id=112755)

## Browser Implementation Timeline

- **2003–2004**: Basic support introduced in early browsers (IE, Firefox, Safari, Chrome)
- **2024+**: Modern browsers gradually adding support for `each-line` and `hanging` keywords
- **Firefox 121+**: First major browser to fully implement the specification

## Summary Table

| Feature | Support Level | Recommendation |
|---------|---|---|
| Basic `<length>` values | Excellent (95%+) | Safe to use |
| `<percentage>` values | Excellent (95%+) | Safe to use |
| `each-line` keyword | Limited (<15%) | Experimental only |
| `hanging` keyword | Limited (<15%) | Experimental only |

---

*Last Updated: 2024*
*Based on CanIUse Data*
