# CSS text-justify

## Overview

The `text-justify` CSS property defines how text should be justified when `text-align: justify` is set. This property allows developers to control the specific justification algorithm used, determining how space is distributed between words or characters in justified text blocks.

## Description

When text is set to `text-align: justify`, text lines are stretched to fit the width of their container, creating even edges on both left and right sides. The `text-justify` property controls *how* this justification is performed, offering different algorithms for distributing whitespace throughout the justified text.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **W3C Specification**: [CSS Text Module Level 3 - text-justify Property](https://w3c.github.io/csswg-drafts/css-text-3/#text-justify-property)

## Categories

- CSS
- Text Layout
- Typography

## Benefits & Use Cases

### Primary Use Cases

1. **Typography Control**: Achieve consistent and predictable text justification behavior across browsers
2. **Professional Publishing**: Implement desktop publishing-style text layout for documents, e-books, and professional publications
3. **Multilingual Content**: Handle justification differently for different languages (e.g., ideographic spacing for Asian languages)
4. **Document Formatting**: Control how text spacing is distributed in letter-press style layouts
5. **Accessibility**: Ensure justified text doesn't become unreadable on narrow viewports

### Benefits

- Fine-grained control over justified text appearance
- Language-specific justification algorithms (inter-word vs. inter-character)
- Improved typography for long-form content
- Better support for justified text in various writing systems
- Fallback behavior for browsers that don't support specific values

## Property Values

The `text-justify` property accepts the following standard values:

| Value | Description |
|-------|-------------|
| `auto` | Default value; browser determines justification algorithm |
| `none` | Disables text justification |
| `inter-word` | Adjusts spacing between words only (most common) |
| `inter-character` | Adjusts spacing between all characters, including between characters within words |
| `distribute` | Similar to `inter-character`, distributes whitespace evenly |

### Browser-Specific Values

Some browsers support additional non-standard values for specific use cases:

- `distribute-all-lines`: Distribute whitespace on all lines, including the last
- `distribute-center-last`: Distribute whitespace with centering of the last line
- `inter-cluster`: For Han/ideographic text, adjust spacing between clusters
- `inter-ideograph`: Spacing specifically for ideographic (CJK) characters
- `newspaper`: Newspaper-style justification

## Browser Support

The support table below shows implementation status across major browsers and versions:

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 43+ | ❌ Not Supported | Partial support (`inter-word` and `distribute` behind experimental flag) with known bugs in `distribute` support |
| **Edge** | 12-18 | ⚠️ Partial | Supports `inter-word` but not `inter-character` or `none`; supports unofficial values like `distribute`, `distribute-all-lines`, etc. |
| **Edge** | 79+ | ❌ Not Supported | Experimental flag support with known limitations |
| **Firefox** | 2-53 | ❌ Not Supported | Feature disabled by default |
| **Firefox** | 54 | 🔧 Development | Feature behind "layout.css.text-justify.enabled" flag |
| **Firefox** | 55+ | ✅ Fully Supported | Full support for standard values: `auto`, `none`, `inter-word`, `inter-character`, and `distribute` |
| **Safari** | All versions | ❌ Not Supported | No support in any Safari version |
| **iOS Safari** | All versions | ❌ Not Supported | No support |
| **Opera** | 29 | ❌ Not Supported | No support |
| **Opera** | 30+ | ❌ Not Supported | No support even with experimental flag |
| **Android Chrome** | 142 | ❌ Not Supported | Experimental flag support with limitations |
| **Firefox Android** | 144 | ✅ Fully Supported | Full support |
| **Opera Mini** | All versions | ❌ Not Supported | No support |
| **Samsung Internet** | 5.0+ | ❌ Not Supported | No support with experimental flag |
| **KaiOS** | 2.5 | ❌ Not Supported | No support |
| **KaiOS** | 3.0-3.1 | ✅ Fully Supported | Full support |

### Legend

- ✅ **Fully Supported**: Feature works as specified
- ⚠️ **Partial Support**: Feature partially implemented with limitations
- 🔧 **Development**: Feature available behind experimental/developer flags
- ❌ **Not Supported**: Feature not implemented

## Support Summary Statistics

- **Full Support**: 2.12% of users
- **Partial Support**: 0.42% of users
- **No Support**: Remaining users

**Important Note**: Browser support is quite limited. Only Firefox (since version 55) and KaiOS 3.0+ have full support for this feature. Chrome and Edge have experimental support with known limitations.

## Implementation Notes

### Experimental Flag Usage

For browsers with experimental support, enable the feature using developer flags:

- **Chrome/Edge**: Enable "Experimental platform features" flag at `chrome://flags`
- **Firefox**: Toggle `layout.css.text-justify.enabled` in `about:config`

### Browser Limitations

1. **Internet Explorer 8-11**: Supports `inter-word` but not `inter-character` or `none`; includes unofficial values like `distribute` and `inter-ideograph`

2. **Chrome & Opera**: Bug in `distribute` value implementation (see Chromium issue #467406)

3. **Safari**: No support across any version; consider fallback styling

4. **Firefox**: Full support starting from version 55 with consistent behavior across all standard values

### Legacy Support Considerations

- For `text-align: justify` to work without `text-justify`, use progressive enhancement
- Provide fallback styles for browsers without support
- Test across target browsers, as behavior varies significantly

## CSS Example

```css
/* Basic justified text with inter-word spacing */
.justified-text {
  text-align: justify;
  text-justify: inter-word;
}

/* Fine character spacing for narrow columns */
.narrow-justified {
  text-align: justify;
  text-justify: inter-character;
  width: 200px;
}

/* No justification */
.no-justify {
  text-justify: none;
}

/* Auto-detect best method */
.auto-justify {
  text-align: justify;
  text-justify: auto;
}

/* Fallback with vendor prefixes (minimal use) */
.legacy-justify {
  text-align: justify;
  text-justify: inter-word;
}
```

## Accessibility Considerations

- Justified text can reduce readability for people with dyslexia
- Very narrow columns with character-level justification may create irregular spacing that impacts accessibility
- Ensure sufficient line-height when using justified text
- Consider using `text-align: left` for body text in narrow layouts
- Test with screen readers to ensure spacing doesn't affect pronunciation or parsing

## Related Properties

- [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align) - Controls text alignment (including justify)
- [`word-spacing`](https://developer.mozilla.org/en-US/docs/Web/CSS/word-spacing) - Adjusts space between words
- [`letter-spacing`](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing) - Adjusts space between characters
- [`text-align-last`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align-last) - Controls alignment of the last line

## References & Resources

### Official Resources
- [W3C CSS Text Module Level 3](https://w3c.github.io/csswg-drafts/css-text-3/#text-justify-property)
- [MDN Web Docs - text-justify](https://developer.mozilla.org/en-US/docs/Web/CSS/text-justify)

### Bug Reports & Feature Requests
- [Chrome/Chromium Support Issue](https://bugs.chromium.org/p/chromium/issues/detail?id=248894)
- [WebKit Support Issue](https://bugs.webkit.org/show_bug.cgi?id=99945)
- [Firefox Support Issue](https://bugzilla.mozilla.org/show_bug.cgi?id=276079)

### Additional Reading
- [Can I Use: text-justify](https://caniuse.com/text-justify)
- CSS Text Module Level 3 Specification (W3C)

## Browser Support Tracking

Last updated: 2025-12-13

This documentation reflects the current browser support status. For the most up-to-date information, visit [Can I Use - text-justify](https://caniuse.com/text-justify) or the official W3C specification.

---

**Note**: Due to limited browser support, `text-justify` is best used in controlled environments where browser support is guaranteed (e.g., internal tools, specific target browsers) or as a progressive enhancement. For public-facing web applications, implement fallbacks to ensure acceptable rendering across all browsers.
