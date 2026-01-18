# CSS Logical Properties

## Overview

CSS Logical Properties provide control of layout through logical, rather than physical, direction and dimension mappings. These properties are `writing-mode` relative equivalents of their corresponding physical properties.

Instead of using physical directions (top, right, bottom, left) and physical dimensions (width, height), logical properties use directions relative to the text flow and writing mode (inline, block, start, end).

## Specification

| Property | Value |
|----------|-------|
| **Status** | Working Draft (WD) |
| **Specification** | [CSS Logical Properties and Values Level 1](https://www.w3.org/TR/css-logical-1/) |

## Categories

- CSS
- CSS3

## Key Concepts

### Physical vs. Logical Properties

**Physical Properties** (traditional):
- `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `padding-top`, `padding-right`, `padding-bottom`, `padding-left`
- `border-top`, `border-right`, `border-bottom`, `border-left`
- `width`, `height`

**Logical Properties** (relative to writing mode):
- `margin-block-start`, `margin-inline-end`, `margin-block`, `margin-inline`
- `padding-block-start`, `padding-inline-end`, `padding-block`, `padding-inline`
- `border-block-start`, `border-inline-end`, `border-block`, `border-inline`
- `block-size`, `inline-size`, `min-block-size`, `max-block-size`, etc.

### Writing Mode Directions

- **Inline**: Follows the text direction (left-to-right or right-to-left)
- **Block**: Follows the line progression direction
- **Start/End**: Logical equivalents of beginning and end in a given direction

## Benefits and Use Cases

### 1. **Internationalization Support**
Enable seamless support for different writing systems (left-to-right, right-to-left, vertical writing) without changing CSS values.

```css
/* Works for any writing mode */
.card {
  margin-inline-start: 1rem;  /* Maps to left in LTR, right in RTL */
  padding-block-end: 2rem;     /* Maps to bottom in horizontal, appropriate direction in vertical */
}
```

### 2. **Responsive Design**
Adapt layouts based on content flow rather than fixed physical directions.

### 3. **Simplified RTL Support**
No need for separate RTL stylesheets or direction-aware selectors. A single set of logical properties works across all writing modes.

### 4. **Cleaner Semantics**
Code intent becomes clearer—properties describe relationships to content flow rather than screen edges.

### 5. **Future-Proof Code**
Logical properties align with modern CSS standards and avoid maintenance burdens when supporting new writing systems.

### 6. **Margin and Padding Shorthands**
- `margin-block`: Top/bottom equivalent
- `margin-inline`: Left/right equivalent
- `padding-block`: Top/bottom equivalent
- `padding-inline`: Left/right equivalent
- `inset-block`: Block-level positioning
- `inset-inline`: Inline-level positioning

## Browser Support

### Summary
- **Full Support**: 92.14% of global users (as of latest data)
- **Partial Support**: 1.13% of global users

### Support by Browser

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 89 | Partial support from 69; shorthand properties added in 87 |
| **Edge** | 89 | Aligned with Chrome; partial support from 79 |
| **Firefox** | 66 | Partial support since 3.0 with `-moz-` prefix |
| **Safari** | 15 | Partial support from 12; full support from 15.0 |
| **Opera** | 76 | Partial support from 56; full support from 76 |
| **iOS Safari** | 15.0+ | Full support in iOS Safari 15.0 and later |
| **Android Chrome** | 89+ | Full support in modern Android browsers |
| **Samsung Internet** | 15.0 | Full support in Samsung Internet 15.0+ |

### Detailed Support Matrix

#### Desktop Browsers

```
Chrome:     ✅ 89+  (Partial: 69-88)
Edge:       ✅ 89+  (Partial: 79-88)
Firefox:    ✅ 66+  (Partial: 3-65 with -moz-)
Safari:     ✅ 15+  (Partial: 12-14)
Opera:      ✅ 76+  (Partial: 56-75)
IE:         ❌ No support
```

#### Mobile Browsers

```
iOS Safari:         ✅ 15.0+  (Partial: 12.2-14.8)
Android Chrome:     ✅ 89+
Samsung Internet:   ✅ 15.0+  (Partial: 4-14)
Opera Mobile:       ✅ 80+
UC Browser:         ✅ 15.5+
Firefox Mobile:     ✅ 66+
Baidu:              ✅ 13.52+
KaiOS:              ✅ 3.0-3.1
```

#### Not Supported

```
Internet Explorer:  ❌ No support (any version)
Opera Mini:         ❌ No support
```

## Known Limitations and Notes

### Note #1: Prefix Support (Firefox)
Only supports the `*-start` and `*-end` values for `margin`, `border` and `padding`, not the `inline`/`block` type values as defined in the spec. These required the `-moz-` prefix (e.g., `-moz-margin-start`).

### Note #2: Browser Prefix Heritage (Chrome, Safari, Opera)
Like Note #1, but also supports `*-before` and `*-end` for `*-block-start` and `*-block-end` properties as well as `start` and `end` values for `text-align`.

### Note #3: Shorthand Property Limitations
Does not support the following shorthand properties:
- `margin-block`
- `margin-inline`
- `padding-block`
- `padding-inline`
- `inset` shorthand properties (and related variants)

**Note:** These properties are available in newer Chromium browsers behind the `#enable-experimental-web-platform-features` flag.

### Note #4: Border Radius Limitations
Does not support the logical border-radius properties:
- `border-start-start-radius`
- `border-start-end-radius`
- `border-end-start-radius`
- `border-end-end-radius`

### Note #5: Shorthand with CSS Properties (Safari)
Does not support the `margin-block`, `margin-inline`, `padding-block`, and `padding-inline` shorthand properties when the value is a CSS property. Support exists only when using a length value.

## Practical Examples

### Basic Margin and Padding

```css
/* Instead of margin-top and margin-bottom */
.card {
  margin-block: 1rem;
}

/* Instead of margin-left and margin-right */
.card {
  margin-inline: auto;  /* Centers horizontally in LTR, works in RTL too */
}

/* Combines both */
.card {
  margin: 1rem auto;  /* Traditional way still works */
  /* or */
  margin-block: 1rem;
  margin-inline: auto;
}
```

### Directional Spacing

```css
/* Add space at the start of content (left in LTR, right in RTL) */
.sidebar-item {
  padding-inline-start: 1.5rem;
}

/* Space before content in block direction (top in horizontal) */
.heading {
  margin-block-start: 2rem;
}
```

### Responsive Sizing

```css
/* Width/height equivalents */
.container {
  inline-size: 100%;     /* Equivalent to width in horizontal writing */
  block-size: auto;      /* Equivalent to height */
  max-inline-size: 80ch; /* Max width with character limit */
  min-block-size: 5rem;  /* Min height */
}
```

### Border Properties

```css
.input {
  border-block: 2px solid;
  border-inline-start-color: blue;
  border-inline-end-color: green;
}
```

### Positioning (Inset)

```css
/* Position elements relative to logical directions */
.overlay {
  inset-block-start: 0;      /* Top in horizontal */
  inset-inline-start: 0;     /* Left in LTR, right in RTL */
  inset-block-end: auto;
  inset-inline-end: auto;
}
```

## Migration Guide

### From Physical to Logical

| Physical | Logical |
|----------|---------|
| `margin-top` | `margin-block-start` |
| `margin-right` | `margin-inline-end` |
| `margin-bottom` | `margin-block-end` |
| `margin-left` | `margin-inline-start` |
| `width` | `inline-size` |
| `height` | `block-size` |
| `top` | `inset-block-start` |
| `right` | `inset-inline-end` |
| `bottom` | `inset-block-end` |
| `left` | `inset-inline-start` |

## Related Resources

- [MDN - CSS Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [MDN - Basic Concepts of Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts)
- [MDN - -moz-margin-start](https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-margin-start)
- [MDN - -moz-padding-start](https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-padding-start)
- [W3C CSS Logical Properties and Values Specification](https://www.w3.org/TR/css-logical-1/)

## Support by Feature

### Fully Supported Properties

The following properties have broad support across modern browsers:

- `margin-block-start`, `margin-block-end`, `margin-inline-start`, `margin-inline-end`
- `padding-block-start`, `padding-block-end`, `padding-inline-start`, `padding-inline-end`
- `border-block-start`, `border-block-end`, `border-inline-start`, `border-inline-end`
- `border-block`, `border-inline`
- `inline-size`, `block-size`
- `min-inline-size`, `max-inline-size`, `min-block-size`, `max-block-size`
- `inset-block-start`, `inset-block-end`, `inset-inline-start`, `inset-inline-end`
- `text-align: start` and `text-align: end`

### Partially Supported Properties

The following may have limited support or require fallbacks:

- `margin-block`, `margin-inline`, `padding-block`, `padding-inline` (shorthand forms)
- `inset` shorthand properties
- `border-*-radius` logical variants
- `border-block-color`, `border-block-style`, `border-block-width`
- `border-inline-color`, `border-inline-style`, `border-inline-width`

## Recommendations

### For Modern Projects
Use logical properties as your primary CSS approach for new projects targeting modern browsers (Chrome 89+, Firefox 66+, Safari 15+).

### For Legacy Support
When targeting older browsers, use fallbacks:

```css
.card {
  /* Fallback for older browsers */
  margin: 1rem auto;

  /* Modern logical properties */
  margin-block: 1rem;
  margin-inline: auto;
}
```

### Progressive Enhancement
Layer logical properties on top of traditional properties to ensure compatibility across all user agents.

## Usage Statistics

- **Full Support**: 92.14% global user coverage
- **Partial Support**: 1.13% global user coverage
- **No Support**: 6.73% global user coverage

Modern adoption rates indicate strong real-world usage of CSS logical properties across major web platforms and devices.
