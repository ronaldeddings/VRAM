# CSS Counter Styles (@counter-style)

## Overview

The `@counter-style` CSS at-rule allows developers to define custom counter styles for ordered lists, headings, and other numbered elements. It enables the conversion of counter values into custom string representations, providing fine-grained control over how numbered content is displayed.

**Current Usage:** 90.45% global support (with partial implementation)

---

## Specification

| Property | Value |
|----------|-------|
| **Specification** | [CSS Counter Styles Module Level 3](https://w3c.github.io/csswg-drafts/css-counter-styles/) |
| **Status** | Candidate Recommendation (CR) |
| **Latest Editor's Draft** | https://w3c.github.io/csswg-drafts/css-counter-styles/ |

---

## Categories

- **CSS3** - Modern CSS specification

---

## What is @counter-style?

The `@counter-style` rule allows you to define how counters are displayed. Instead of being limited to standard numeric formats (decimal, roman numerals, etc.), you can create custom styles for:

- Ordered lists (`<ol>`)
- Heading numbering
- Custom counter properties
- Multi-level numbering schemes
- Language-specific number representations

### Basic Syntax

```css
@counter-style custom-name {
  system: cyclic;
  symbols: "☆" "✭" "✬";
  suffix: " ";
}

ol {
  list-style: custom-name;
}
```

---

## Benefits and Use Cases

### 1. **Custom Visual Representations**
   - Create branded list styles matching your design system
   - Use emoji, icons, or custom symbols for list markers
   - Implement design-specific numbering schemes

### 2. **Multilingual Number Systems**
   - Support alphabetic systems in different scripts
   - Implement language-specific numbering conventions
   - Handle complex numbering patterns (e.g., Korean, Arabic systems)

### 3. **Semantic Numbering**
   - Create hierarchical numbering systems
   - Implement custom index notations
   - Support legal or technical documentation numbering

### 4. **Enhanced Accessibility**
   - Define fallback characters for custom counter styles
   - Ensure screen readers understand counter systems
   - Support inclusive design patterns

### 5. **Typography Control**
   - Match corporate branding guidelines
   - Implement custom chapter or section numbering
   - Create consistent documentation styling across projects

---

## Browser Support

### Summary of First Support

| Browser | First Support | Status | Notes |
|---------|--------------|--------|-------|
| **Chrome** | 91 | Partial | Image symbols not supported |
| **Edge** | 91 | Partial | Image symbols not supported |
| **Firefox** | 33 | Partial | Image symbols not supported |
| **Safari** | 17.0 | Partial | Image symbols not supported |
| **Opera** | 77 | Partial | Image symbols not supported |
| **iOS Safari** | 17.0 | Partial | Image symbols not supported |

### Detailed Browser Support Matrix

#### Desktop Browsers

```
Chrome      : ████████████████████ 91+
Firefox     : ████████████████████ 33+
Safari      : ████░░░░░░░░░░░░░░░ 17.0+
Edge        : ████████████████████ 91+
Opera       : ████████████░░░░░░░░ 77+
IE 11       : ░░░░░░░░░░░░░░░░░░░░ Not supported
```

#### Mobile Browsers

```
iOS Safari  : ████░░░░░░░░░░░░░░░░ 17.0+
Android Chr : ████████████████████ 142+
Android FF  : ████████████████████ 144+
Samsung Int : ████████████░░░░░░░░ 16.0+
Opera Mobile: ████████████░░░░░░░░ 80+
Opera Mini  : ░░░░░░░░░░░░░░░░░░░░ Not supported
```

#### Full Support Status

- **Partial Support**: 90.45% of users (lacking image symbols support)
- **No Support**: 9.55% of users (mainly older devices and IE)
- **Recommended Fallback**: Provide `symbol` property with safe characters

---

## Implementation Examples

### Example 1: Custom Symbol Counter

```css
@counter-style custom-symbols {
  system: cyclic;
  symbols: "★" "✦" "✧";
  suffix: " ";
}

ol.custom {
  list-style: custom-symbols;
}
```

### Example 2: Alphabetic System

```css
@counter-style alphabet-lower {
  system: alphabetic;
  symbols: "a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m"
           "n" "o" "p" "q" "r" "s" "t" "u" "v" "w" "x" "y" "z";
}
```

### Example 3: Numeric System with Fallback

```css
@counter-style my-numeric {
  system: numeric;
  symbols: "①" "②" "③" "④" "⑤" "⑥" "⑦" "⑧" "⑨" "⑩";
  fallback: decimal;
  suffix: ") ";
}
```

### Example 4: Range-Specific Styling

```css
@counter-style range-test {
  system: numeric;
  symbols: "㈀" "㈁" "㈂" "㈃" "㈄" "㈅" "㈆" "㈇" "㈈" "㈉";
  range: 1 9;
  fallback: decimal;
}
```

---

## Key Properties

| Property | Description | Values |
|----------|-------------|--------|
| `system` | Counter system algorithm | `cyclic`, `numeric`, `alphabetic`, `symbolic`, `additive`, `fixed` |
| `symbols` | Character(s) used in the counter | String sequence |
| `additive-symbols` | Used with additive systems | Pairs of symbols and values |
| `range` | Limits where the counter applies | `auto`, min max |
| `prefix` | Text before the counter | Any string |
| `suffix` | Text after the counter | Any string |
| `pad` | Minimum digits with padding | Integer + string |
| `fallback` | Fallback counter-style | Another counter style name |
| `speak-as` | Spoken representation | `auto`, `bullets`, `numbers`, `words`, counter-style |
| `negative` | Symbol for negative numbers | Prefix suffix pair |

---

## Known Limitations and Bugs

### 1. **Image Symbols Not Supported** (Bug #1)

**Affected Browsers**: Chrome, Edge, Firefox, Safari, Opera, and most others

**Issue**: The `symbols` property cannot use `url()` for image-based symbols, only text characters

**Bug Reports**:
- Firefox: [Bug 1024179](https://bugzilla.mozilla.org/show_bug.cgi?id=1024179)
- Chrome: [Issue 1176323](https://bugs.chromium.org/p/chromium/issues/detail?id=1176323)
- WebKit: [Bug 167645](https://bugs.webkit.org/show_bug.cgi?id=167645)

**Workaround**: Use Unicode characters, emoji, or CSS symbols instead of images

```css
/* Works: Using Unicode */
@counter-style emoji {
  system: cyclic;
  symbols: "🌟" "⭐" "✨";
}

/* Doesn't work: Using images */
@counter-style images {
  system: cyclic;
  symbols: url(star.svg) url(star-fill.svg); /* Not supported */
}
```

### 2. **Limited Browser Coverage**

- Internet Explorer 11: No support
- Opera Mini: No support
- Older mobile browsers: Limited support

**Recommendation**: Implement CSS fallback mechanisms for older browsers

```css
ol {
  list-style: custom-counter;
  /* Fallback for unsupporting browsers */
  list-style: decimal;
}
```

### 3. **Partial Support Across Platforms**

Safari implemented support later (17.0), and some mobile browsers still lack full support.

---

## Fallback Strategy

For browsers that don't support `@counter-style`, use the `fallback` property:

```css
@counter-style enhanced-decimal {
  system: numeric;
  symbols: "❶" "❷" "❸" "❹" "❺" "❻" "❼" "❽" "❾";
  fallback: decimal;
  range: 1 9;
}
```

Or use a CSS fallback:

```css
/* Modern browsers */
ol.custom {
  list-style: my-counter-style;
}

/* Fallback for older browsers */
@supports not (--css: variables) {
  ol.custom {
    list-style: decimal;
  }
}
```

---

## Related Features

- [`list-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style) - CSS property that references counter styles
- [`counter-reset`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-reset) - Reset counter values
- [`counter-increment`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment) - Increment counter values
- [`content`](https://developer.mozilla.org/en-US/docs/Web/CSS/content) - Insert generated content using counters

---

## Reference Links

### Official Documentation
- [MDN Web Docs - CSS @counter-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style)
- [W3C CSS Counter Styles Module Level 3](https://w3c.github.io/csswg-drafts/css-counter-styles/)

### Examples and Demos
- [CSS @counter-style Demo](https://mdn.github.io/css-examples/counter-style-demo/)

### Bug Tracking
- [WebKit Bug #167645](https://bugs.webkit.org/show_bug.cgi?id=167645)
- [Firefox Bug #1024179](https://bugzilla.mozilla.org/show_bug.cgi?id=1024179)
- [Chrome Issue #1176323](https://bugs.chromium.org/p/chromium/issues/detail?id=1176323)

### Related Tools
- [Can I Use - @counter-style](https://caniuse.com/css-counter-styles)
- [MDN Compatibility Table](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style#browser_compatibility)

---

## Global Usage Statistics

| Support Type | Percentage | User Impact |
|--------------|-----------|------------|
| Full Support | 0.57% | Users on latest browsers |
| Partial Support (No Images) | 90.45% | Most modern browsers |
| No Support | 9.55% | IE, older mobile, Opera Mini |

---

## Recommendations

### For Development

1. **Use `@counter-style` for custom list styling** when you need branded or unique counter presentations
2. **Always provide a fallback** using the `fallback` property or CSS fallbacks
3. **Test across browsers** especially Safari, which added support later
4. **Avoid image symbols** - they're not supported; use Unicode/emoji instead
5. **Consider progressive enhancement** - don't rely solely on custom counters for critical content

### For Browser Support

- **Modern websites (2024+)**: Safely use `@counter-style` with fallbacks
- **Legacy support required**: Use JavaScript or CSS alternatives
- **Mobile-first**: Test on real devices as support varies

### Best Practices

```css
@counter-style branded-counter {
  system: numeric;
  symbols: "①" "②" "③" "④" "⑤" "⑥" "⑦" "⑧" "⑨" "⑩";
  fallback: decimal;  /* Always provide fallback */
  suffix: ". ";
  range: 1 9;
}

ol.branded {
  list-style: branded-counter;
}

/* CSS fallback for unsupporting browsers */
@supports not (selector(:has(*))) {
  ol.branded {
    list-style: decimal;
  }
}
```

---

**Last Updated**: 2024
**Specification Status**: Candidate Recommendation (CR)
**Global Coverage**: 90.45% (partial support)
