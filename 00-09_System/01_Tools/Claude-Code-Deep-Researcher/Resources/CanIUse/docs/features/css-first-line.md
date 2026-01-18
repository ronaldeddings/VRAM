# CSS first-line Pseudo-Element

## Overview

The `::first-line` pseudo-element allows you to apply styling specifically to the first line of text in a block-level element. This is a powerful CSS feature that enables sophisticated typography control without requiring markup changes.

> **Note:** Only a limited set of properties can be applied to the `::first-line` pseudo-element. Not all CSS properties are valid for this pseudo-element.

## Specification

| Property | Value |
|----------|-------|
| **Status** | Recommended (REC) |
| **Specification** | [CSS Selectors Level 3](https://w3c.github.io/csswg-drafts/selectors-3/#first-line) |
| **Current Version** | CSS Selectors Level 3 |

## Categories

- **CSS3** - CSS Selectors and Pseudo-elements

## Syntax

### Double-Colon Syntax (Recommended)
```css
::first-line {
  /* applicable CSS properties */
}
```

### Single-Colon Syntax (Legacy CSS 2.1)
```css
:first-line {
  /* for backward compatibility */
}
```

## Use Cases and Benefits

### 1. **Editorial Typography**
Create magazine or newspaper-style layouts where the first line receives special formatting:
```css
p::first-line {
  font-weight: bold;
  font-size: 1.1em;
  text-transform: uppercase;
}
```

### 2. **Drop Cap Enhancement**
Pair with drop cap designs for classic book-like presentation:
```css
article::first-line {
  font-variant: small-caps;
  color: #8b0000;
}
```

### 3. **Emphasis and Visual Hierarchy**
Guide readers' eyes by styling the opening line differently from body text:
```css
.content::first-line {
  letter-spacing: 0.05em;
  color: #333;
  font-weight: 600;
}
```

### 4. **Responsive Typography**
Adjust opening line styling for different screen sizes:
```css
/* Mobile */
@media (max-width: 640px) {
  p::first-line {
    font-size: 0.95em;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  p::first-line {
    font-size: 1.2em;
  }
}
```

### 5. **Accessibility and Readability**
Improve readability by making the first line more visually distinct:
```css
.article::first-line {
  line-height: 1.6;
  letter-spacing: 0.03em;
}
```

## Supported CSS Properties

Not all CSS properties can be applied to `::first-line`. The following properties are supported:

- **Font properties**: `font`, `font-family`, `font-size`, `font-style`, `font-variant`, `font-weight`
- **Text properties**: `letter-spacing`, `line-height`, `text-decoration`, `text-transform`, `word-spacing`
- **Color properties**: `color`, `background` (and background sub-properties)

## Browser Support

### Summary by Browser

| Browser | First Full Support | Current Status |
|---------|-------------------|-----------------|
| **Internet Explorer** | 9 | Supported (11) |
| **Edge** | 12 | Supported (all versions) |
| **Firefox** | 2 | Supported (all versions) |
| **Chrome** | 4 | Supported (all versions) |
| **Safari** | 3.1 | Supported (all versions) |
| **Opera** | 9 | Supported (all versions) |
| **iOS Safari** | 3.2 | Supported (all versions) |
| **Android Browser** | 2.1 | Supported (all versions) |
| **Opera Mini** | All | Full Support |

### Desktop Browsers

| Browser | Version | Support |
|---------|---------|---------|
| Internet Explorer | 5.5-8 | Partial* |
| Internet Explorer | 9+ | Full |
| Edge | 12+ | Full |
| Firefox | 2+ | Full |
| Chrome | 4+ | Full |
| Safari | 3.1+ | Full |
| Opera | 9+ | Full |

*See known issues section for IE8 limitations.

### Mobile Browsers

| Browser | Version | Support |
|---------|---------|---------|
| iOS Safari | 3.2+ | Full |
| Android Browser | 2.1+ | Full |
| Chrome for Android | 142+ | Full |
| Firefox for Android | 144+ | Full |
| Samsung Internet | 4+ | Full |
| Opera Mobile | 10+ | Full |
| Opera Mini | All | Full |

### Global Browser Support

- **Usage Coverage**: 93.69% of global users
- **With Partial Support**: 93.72% (includes IE8)
- **Unsupported**: 0.28% of global users

## Known Issues and Notes

### Internet Explorer 8 Limitation

**Note #1:** IE8 only supports the single-colon CSS 2.1 syntax (`:first-line`). It does not support the double-colon CSS3 syntax (`::first-line`).

**Workaround:**
```css
/* For IE8 compatibility */
p:first-line {
  text-transform: uppercase;
  font-weight: bold;
}

/* Modern browsers */
p::first-line {
  text-transform: uppercase;
  font-weight: bold;
}
```

### Implementation Considerations

1. **Line Breaking**: The `::first-line` selector applies to the actual first visual line, not the first sentence. Line breaks depend on viewport width and container size.

2. **Nested Elements**: When the first line spans multiple nested elements, the pseudo-element applies to all content on that line.

3. **Block-Level Elements**: `::first-line` works only on block-level elements or inline-block elements.

4. **Property Limitations**: Only specific CSS properties are applicable (see Supported CSS Properties section).

## Practical Examples

### Example 1: Magazine-Style Article

```html
<article class="magazine-article">
  <p>The morning sun cast long shadows across the ancient streets of the old town.
     Every corner seemed to whisper stories of a bygone era...</p>
</article>
```

```css
.magazine-article::first-line {
  font-weight: bold;
  font-size: 1.1em;
  color: #8b0000;
  letter-spacing: 0.05em;
}
```

### Example 2: Responsive First Line

```css
.story::first-line {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .story::first-line {
    font-size: 1em;
  }
}
```

### Example 3: Combination with Other Pseudo-Elements

```css
/* Style first line AND first letter */
p::first-line {
  font-weight: bold;
}

p::first-letter {
  font-size: 2em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 0.1em;
}
```

## Related CSS Features

- [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter) - Style the first letter of text
- [Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements) - Other CSS pseudo-elements
- [`::selection`](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection) - Style user-selected text
- [`::before`](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) and [`::after`](https://developer.mozilla.org/en-US/docs/Web/CSS/::after) - Generate content

## Resources and Further Reading

- [MDN Web Docs - ::first-line](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-line)
- [CSS-Tricks - ::first-line Almanac](https://css-tricks.com/almanac/selectors/f/first-line/)
- [W3C CSS Selectors Level 3 Specification](https://w3c.github.io/csswg-drafts/selectors-3/#first-line)

## Support Status Badge

![CSS first-line Support](https://img.shields.io/badge/CSS%20first--line-93.69%25%20Global%20Support-brightgreen)

---

**Last Updated:** 2025
**Feature Status:** Stable and widely supported across all major browsers
