# WBR (Word Break Opportunity) Element

## Overview

The `<wbr>` element represents an extra place where a line of text may optionally be broken. It provides a hint to the browser about where text can wrap to the next line without affecting the semantic meaning of the content.

## Specification Status

**Status:** Living Standard (LS)
**Specification:** [WHATWG HTML Standard - The wbr element](https://html.spec.whatwg.org/multipage/semantics.html#the-wbr-element)

## Categories

- HTML5

## Description

The `<wbr>` element is a self-closing (void) element that suggests to the browser where a line of text may be broken. This is particularly useful for long words, URLs, or other text that might overflow its container on narrow viewports or smaller screens.

Unlike the `<br>` element, which forces a line break, `<wbr>` only suggests a break point. The browser will only break the line at this position if necessary to prevent overflow.

## Use Cases & Benefits

### Primary Use Cases

1. **Long URLs**
   - Break long URLs at logical points without affecting clickability
   - Improves readability on narrow screens

2. **Long Words or Compound Words**
   - German compound words, technical terms, or domain-specific vocabulary
   - Maintains readability without hyphenation

3. **Email Addresses**
   - Allow wrapping in long email addresses without breaking functionality
   - Improves layout on mobile devices

4. **Code or Technical Terms**
   - Break long code snippets or variable names at sensible points
   - Preserves semantic integrity while improving formatting

5. **Multilingual Content**
   - Support languages with long words or complex morphology
   - Allows breaking at culturally appropriate points

### Key Benefits

- **Responsive Design:** Improves text flow on narrow viewports without CSS hacks
- **Semantic Preservation:** Unlike `<br>`, doesn't enforce a break, allowing content to reflow naturally
- **Accessibility:** Screen readers ignore `<wbr>` elements, treating content as continuous
- **Backward Compatible:** Modern browsers ignore it gracefully if not needed
- **No Extra Markup:** Self-closing element keeps HTML clean

## Example Usage

```html
<!-- Long URL -->
<p>Visit our documentation at:
  https://example.com<wbr>/very/long<wbr>/path<wbr>/to<wbr>/documentation</p>

<!-- Compound word -->
<p>The word Donaudampfschifffahrtsgesellschaftskapitän<wbr>
   (an Austrian river steamship company captain) is quite long.</p>

<!-- Email address -->
<p>Contact us at: support<wbr>@example<wbr>.com</p>

<!-- Code snippet -->
<code>some_very_long_variable_name<wbr>=<wbr>another_very_long_variable_name</code>
```

## Browser Support

The `<wbr>` element has excellent and widespread support across all modern browsers. Below is a comprehensive browser support table:

### Desktop Browsers

| Browser | Initial Support | Current Support (Latest) | Notes |
|---------|-----------------|--------------------------|-------|
| **Chrome** | 4+ | ✅ Supported (v146+) | Fully supported since early versions |
| **Firefox** | 2+ | ✅ Supported (v148+) | Fully supported since Firefox 2 |
| **Safari** | 3.2+ | ✅ Supported (26.2+) | Supported from Safari 3.2 onward; Safari 3.1 had unknown support |
| **Edge** | 12+ | ✅ Supported (v143+) | Supported since initial release |
| **Opera** | 9.5+ | ✅ Supported (v122+) | Initial support from Opera 9.5; Opera 9 had unknown support |
| **Internet Explorer** | 5.5-7 | ❌ Not Supported (IE 8-11) | Supported in IE 5.5-7, dropped in IE 8+ |

### Mobile Browsers

| Browser | Initial Support | Current Support | Notes |
|---------|-----------------|-----------------|-------|
| **iOS Safari** | 5.0+ | ✅ Supported (26.1+) | Supported from iOS 5.0; earlier versions (3.2-4.3) had unknown support |
| **Android Browser** | 2.3+ | ✅ Supported (4.4.3+) | Supported from Android 2.3; Android 2.1-2.2 had unknown support |
| **Chrome Mobile** | Latest | ✅ Supported (142+) | Fully supported |
| **Firefox Mobile** | Latest | ✅ Supported (144+) | Fully supported |
| **Opera Mobile** | 11+ | ✅ Supported (v80+) | Supported from Opera Mobile 11; v10 not supported |
| **Samsung Browser** | 4+ | ✅ Supported (29+) | Fully supported |
| **UC Browser** | 15.5+ | ✅ Supported | Supported in latest versions |
| **BlackBerry** | 7+ | ✅ Supported | Limited browser usage |
| **Opera Mini** | All versions | ✅ Supported | Universal support |
| **IE Mobile** | Not supported (10, 11) | ❌ Not Supported | Not available in IE Mobile |

### Other Browsers

| Browser | Support |
|---------|---------|
| **KaiOS** | ✅ Supported (2.5+) |
| **Baidu** | ✅ Supported (13.52+) |
| **Android QQ** | ✅ Supported (14.9+) |

## Support Summary

**Global Usage Coverage:** 93.31% of global browser usage supports `<wbr>`

- **Supported:** All modern versions of Chrome, Firefox, Edge, Safari, and Opera
- **Not Supported:** Internet Explorer 8 and later versions
- **Partial Support:** Early Safari versions (3.1) and early Opera (9) had unknown support

## Notes

- The `<wbr>` element has no closing tag (it's a void element)
- It has no attributes
- It does not add visible content or spacing—only suggests break points
- Screen readers completely ignore the element, reading text as continuous
- CSS `word-break` or `overflow-wrap` properties provide alternative approaches
- The element is especially valuable for responsive design on mobile devices

## Practical Considerations

### When to Use `<wbr>`

- You have long URLs or email addresses in content
- You're dealing with languages that have long compound words
- You need fine-grained control over break points
- You want semantic meaning preserved (unlike `<br>`)

### When NOT to Use `<wbr>`

- You need a guaranteed line break (use `<br>` instead)
- You can solve the problem with CSS (`word-break`, `overflow-wrap`)
- You're breaking words with hyphens (use soft hyphens `&shy;` or CSS)
- The text is inside a pre-formatted block that should preserve formatting

### CSS Alternatives

For similar functionality, consider CSS properties:

```css
/* Allow breaking long words */
word-break: break-word;

/* Break overflow words (modern approach) */
overflow-wrap: break-word;

/* Break at hyphens */
hyphens: auto;
```

## Related Resources

- **MDN Web Docs:** [Element wbr](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr)
- **Related Elements:** `<br>`, `<nobr>`, `<soft hyphen>` (&shy;)
- **Related CSS:** `word-break`, `overflow-wrap`, `hyphens`, `white-space`

## References

- WHATWG HTML Standard: https://html.spec.whatwg.org/multipage/semantics.html#the-wbr-element
- MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr
