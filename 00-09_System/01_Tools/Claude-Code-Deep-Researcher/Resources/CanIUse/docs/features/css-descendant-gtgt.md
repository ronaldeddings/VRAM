# CSS Explicit Descendant Combinator `>>`

## Overview

The explicit descendant combinator (`>>`) is an alternative, non-whitespace syntax for selecting descendant elements in CSS. The selector `A >> B` is semantically equivalent to `A B`, making the relationship between parent and descendant more explicit and intentional.

**Current Status:** `Experimental` - Not yet widely implemented across browsers

---

## Specification Details

| Property | Value |
|----------|-------|
| **Specification** | [CSS Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/#descendant-combinators) |
| **Category** | CSS Selectors |
| **Status** | Unofficial / Experimental |
| **Usage** | 0% (as of current data) |

---

## What is the Descendant Combinator?

### Current Syntax (Whitespace)

Currently, descendant relationships in CSS are expressed using whitespace:

```css
/* Select all paragraphs that are descendants of divs */
div p {
  color: blue;
}
```

### Proposed Explicit Syntax

The `>>` combinator makes this relationship more explicit:

```css
/* Same effect, but more intentional */
div >> p {
  color: blue;
}
```

### Advantages of Explicit Syntax

1. **Clarity**: Makes the descendant relationship unambiguous
2. **Distinction**: Clearly differentiates from whitespace-separated selectors
3. **Accessibility**: Easier to read and understand intent
4. **Consistency**: Aligns with other combinators:
   - `>` for child elements
   - `+` for adjacent siblings
   - `~` for general siblings
   - `>>` for descendants (explicit)

---

## Use Cases and Benefits

### 1. Code Clarity and Maintainability

```css
/* Explicit and intentional */
.container >> .item {
  margin: 10px;
}

/* vs. implicit whitespace */
.container .item {
  margin: 10px;
}
```

### 2. Avoiding Accidental Selector Specificity Issues

```css
/* Clear that we're targeting descendants at any level */
.form >> input {
  padding: 8px;
}

/* Clear that we only want direct children */
.form > input {
  padding: 8px;
}
```

### 3. Complex Selector Chains

```css
/* More readable when combining multiple combinators */
article >> .highlight >> strong {
  font-weight: bold;
  color: red;
}
```

### 4. Team Communication

Makes selector intent more obvious to developers reading the code, reducing ambiguity about whether the whitespace was intentional or accidental.

---

## Browser Support

### Desktop Browsers

| Browser | Full Support | First Version | Status Badge |
|---------|-------------|---------------|--------------|
| **Chrome** | Not Supported | — | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **Firefox** | Not Supported | — | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **Safari** | 11.0 (partial) | 11.0 | ![Partial](https://img.shields.io/badge/support-partial-orange) |
| **Edge** | Not Supported | — | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **Opera** | Not Supported | — | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **IE** | Not Supported | — | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |

### Mobile Browsers

| Browser | Full Support | Status Badge |
|---------|-------------|--------------|
| **iOS Safari** | Not Supported | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **Android Chrome** | Not Supported | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **Android Firefox** | Not Supported | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **Opera Mini** | Not Supported | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |
| **Samsung Internet** | Not Supported | ![Not Supported](https://img.shields.io/badge/support-not_supported-red) |

### Support Summary Table

```
Legend: y = Supported | n = Not Supported | u = Unknown | a = Partial/Alternate Implementation
```

| Browser | Status |
|---------|--------|
| Chrome (4-146) | n (Not Supported) |
| Firefox (2-148) | n (Not Supported) |
| Safari 11 | y (Supported) |
| Safari 11.1+ | n (Not Supported) |
| Edge (12-143) | n (Not Supported) |
| Opera (9-122) | n (Not Supported) |
| IE (5.5-11) | n (Not Supported) |
| Android | n (Not Supported) |
| iOS Safari | n (Not Supported) |

---

## Implementation Status

### Active Development

**Chrome**: [Issue #446050 - Implement Descendant Combinator ">>"](https://bugs.chromium.org/p/chromium/issues/detail?id=446050)
- Status: Under Review
- Last Activity: Active discussion in development

**Firefox**: [Bug #1266283 - Implement CSS4 descendant combinator `>>`](https://bugzilla.mozilla.org/show_bug.cgi?id=1266283)
- Status: Under Consideration
- Track progress via Mozilla Bugzilla

### Safari Note

Safari 11.0 shows support (`y` status), though this may represent experimental implementation or partial support during the specification development phase. Later versions reverted to not supporting the syntax, suggesting it was a short-lived experimental feature.

---

## Known Issues and Limitations

### Current Limitations

1. **No Standard Implementation**: The feature is part of the CSS Selectors Level 4 specification, but browsers have not widely implemented it
2. **Parsing Ambiguity**: Potential conflicts with the `>` combinator may affect future implementation
3. **Backward Compatibility**: Not applicable yet due to lack of implementation
4. **Specification Maturity**: Still in development as part of the CSS Selectors Level 4 spec

### Fallback Strategy

Since browser support is effectively zero (except for Safari 11), developers should continue using the whitespace descendant combinator:

```css
/* Use this for maximum compatibility */
div p {
  color: blue;
}

/* Avoid this until broadly supported */
/* div >> p { color: blue; } */
```

---

## Examples

### Basic Usage

```css
/* Target all paragraphs that are descendants of .container */
.container >> p {
  font-size: 14px;
}
```

### Chaining Combinators

```css
/* Mix explicit descendant with direct child combinator */
article >> .section > .highlight {
  background-color: yellow;
}
```

### Complex Selectors

```css
/* Multiple descendant relationships */
body >> .navigation >> ul >> li {
  list-style: none;
}
```

### Comparison

```css
/* Traditional whitespace (currently supported) */
.menu .item .link { color: blue; }

/* Explicit descendant (future) */
.menu >> .item >> .link { color: blue; }

/* Equivalent structure but more explicit intent */
```

---

## Browser Vendor Issues

### Chromium Project

- **Issue**: [#446050](https://bugs.chromium.org/p/chromium/issues/detail?id=446050)
- **Title**: Implement Descendant Combinator ">>"
- **Priority**: Lower priority, awaiting broader adoption signals

### Mozilla

- **Issue**: [#1266283](https://bugzilla.mozilla.org/show_bug.cgi?id=1266283)
- **Title**: Implement CSS4 descendant combinator `>>`
- **Status**: Open for discussion

---

## Related Features

### Other CSS Combinators

- **Child Combinator** (`>`): Selects direct children only
- **Adjacent Sibling Combinator** (`+`): Selects adjacent siblings
- **General Sibling Combinator** (`~`): Selects all following siblings

### Related Selectors

- [Descendant Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors)
- [CSS Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors-4/)
- [CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)

---

## Testing and Resources

### Live Testing

- [JS Bin Test Case](https://jsbin.com/qipekof/edit?html,css,output) - Interactive test of the `>>` combinator

### Reference Documentation

- [MDN - Descendant Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors)
- [W3C CSS Selectors Level 4 Specification](https://w3c.github.io/csswg-drafts/selectors-4/#descendant-combinators)

---

## Recommendations

### For Production Use

**Do not use the `>>` combinator in production code** at this time. Browser support is insufficient for real-world use.

### For Future Planning

Monitor the following for implementation progress:

- [Chrome Issue Tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=446050)
- [Firefox Bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1266283)
- [CSS Selectors Level 4 Specification](https://w3c.github.io/csswg-drafts/selectors-4/#descendant-combinators)

### Current Best Practices

Continue using whitespace-based descendant selectors:

```css
/* Recommended for current use */
.parent .child {
  /* styles */
}

/* When you need explicit direct children */
.parent > .child {
  /* styles */
}
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Feature** | Explicit Descendant Combinator `>>` |
| **Status** | Experimental / Not Implemented |
| **Use Cases** | Code clarity, intentional descendant selection |
| **Current Support** | Safari 11.0 only (partial/experimental) |
| **Recommendation** | Not production-ready; use whitespace syntax |
| **Spec Status** | CSS Selectors Level 4 (W3C) |
| **Global Usage** | 0% |

---

## Changelog

- **Initial Specification**: CSS Selectors Level 4 Working Draft
- **Safari 11.0**: Partial/experimental support
- **Current Status**: Awaiting broader implementation by major browser vendors

---

**Last Updated**: 2024
**Source**: CanIUse Feature Database
