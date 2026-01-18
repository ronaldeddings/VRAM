# CSS Box Decoration Break

## Overview

The `box-decoration-break` CSS property controls how an element's margins, borders, padding, and other decorations are rendered when the box is split across multiple fragments. This occurs when content breaks across page boundaries, column layouts, or inline line breaks.

**Spec Status:** Candidate Recommendation (CR)

**W3C Specification:** [CSS Fragmentation Module Level 3 - Break Decoration](https://www.w3.org/TR/css3-break/#break-decoration)

**Categories:** CSS3

## Description

When an element is fragmented across breaks (page breaks, column breaks, region breaks, or line breaks), the `box-decoration-break` property determines the visual behavior:

- **`slice` (default):** Box decorations (borders, padding, margins) are clipped at each break point, as if each fragment is independent
- **`clone`:** Box decorations are repeated/applied to each fragment, creating the visual appearance of a continuous box across breaks

This property is particularly important for:
- Multi-column layouts
- Printed documents with page breaks
- Inline elements spanning multiple lines
- Complex layout scenarios requiring consistent visual styling across breaks

## Syntax

```css
box-decoration-break: slice | clone;
```

### Values

| Value | Description |
|-------|-------------|
| `slice` | Default behavior. The box is broken as if the break did not exist - margins, borders, padding, and other decorations are clipped at the break edge |
| `clone` | The box decorations are cloned on each fragment, appearing as though the break line passes through the middle of the decoration |

## Use Cases & Benefits

### 1. **Multi-Column Layouts**
When text flows across multiple columns with border or padding styling, `clone` ensures decorative elements appear on both sides of the column break.

**Example:**
```css
.multi-column-text {
  columns: 3;
  column-gap: 20px;
  box-decoration-break: clone;
  border: 2px solid #333;
  padding: 10px;
}
```

### 2. **Inline Elements Across Lines**
Style inline elements (like `<span>` tags) that wrap to multiple lines with consistent decoration on each line fragment.

**Example:**
```css
.highlighted-text {
  background-color: yellow;
  padding: 4px 8px;
  box-decoration-break: clone;
  border-radius: 4px;
}
```

### 3. **Print Stylesheets**
Create visually appealing printed documents where elements with borders or backgrounds maintain consistent appearance across page breaks.

**Example:**
```css
@media print {
  .section-header {
    box-decoration-break: clone;
    border-bottom: 3px solid #000;
    margin-bottom: 10px;
  }
}
```

### 4. **Responsive Design with Overflow Text**
Handle long text blocks with borders and padding that gracefully wrap across lines or containers.

### 5. **Design System Components**
Create reusable styled components (badges, tags, highlighted text) that maintain visual consistency when they break across layout boundaries.

## Browser Support

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 130+ | ✅ Full Support | Partial support via `-webkit-` prefix in v22-129 |
| **Firefox** | 32+ | ✅ Full Support | Unprefixed support since Firefox 32 |
| **Safari** | 6.1+ | ⚠️ Partial Support | Requires `-webkit-box-decoration-break` prefix |
| **Edge** | 130+ | ✅ Full Support | Partial support via `-webkit-` prefix in v79-129 |
| **Opera** | 11+ | ⚠️ Partial Support | With `-webkit-` prefix; full support in v116+ |
| **iOS Safari** | 7+ | ⚠️ Partial Support | Requires `-webkit-` prefix |
| **Android Browser** | 4.4+ | ⚠️ Partial Support | Requires `-webkit-` prefix |
| **Opera Mobile** | 11+ | ⚠️ Partial Support | Requires `-webkit-` prefix |

### Global Support Statistics
- **Full Support:** 71.75% of users
- **Partial Support:** 21.5% of users (works for inline elements only)

## Implementation & Compatibility

### Unprefixed Support (Recommended for Modern Browsers)
```css
.element {
  box-decoration-break: clone;
}
```

### Cross-Browser Compatibility with Prefixes
For maximum browser compatibility, include the `-webkit-` prefix:

```css
.element {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
```

### Practical Example: Multi-Line Highlighted Text
```css
.highlight {
  background-color: #ffeb3b;
  padding: 2px 6px;
  border-radius: 3px;
  margin: 0 2px;

  /* Ensure decoration is cloned on line breaks */
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
```

### Fallback Strategy
If browser support is a concern, use feature detection:

```javascript
const supportsBoxDecorationBreak = () => {
  const element = document.createElement('div');
  const styles = ['boxDecorationBreak', 'WebkitBoxDecorationBreak'];

  return styles.some(style => style in element.style);
};

if (!supportsBoxDecorationBreak()) {
  // Apply alternative styling or layout approach
}
```

## Important Limitations

### Partial Support Caveat
Many browsers show "partial support" with the `#1` note:

> **Partial support refers to working for inline elements but not across column or page breaks.**

**What This Means:**
- ✅ Works well for inline elements that wrap to multiple lines
- ❌ May not work consistently across CSS columns
- ❌ Page break behavior may be limited or inconsistent
- ⚠️ Region breaks may not be fully supported

### Browser-Specific Notes

**Chrome (v22-129):**
- Requires `-webkit-box-decoration-break` prefix
- Full unprefixed support from v130 onwards

**Safari & iOS Safari:**
- Partial support with `-webkit-` prefix
- Primarily works for inline elements
- Limited support for page/column breaks

**Firefox:**
- Solid support since v32
- No prefix required

**Opera:**
- Early versions (11-12) had basic support
- v15+ requires prefix
- Full support from v116+

## Related Links

### Official Resources
- [MDN Web Docs - CSS box-decoration-break](https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break)
- [W3C CSS Fragmentation Module](https://www.w3.org/TR/css3-break/)

### Tools & References
- [Interactive Demo - JSBin](https://jsbin.com/xojoro/edit?css,output) - See the effect on box borders in real-time
- [MDN Reference Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break) - Comprehensive property documentation

### Issue Tracking
- [Chromium Issue Tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=682224) - Request to unprefix `-webkit-box-decoration-break` in Chrome
- [WebKit Standards Position](https://github.com/WebKit/standards-positions/issues/366) - WebKit's position on supporting box-decoration-break without prefix

## Summary Table

| Aspect | Details |
|--------|---------|
| **CSS Property** | `box-decoration-break` |
| **Spec Status** | Candidate Recommendation (CR) |
| **Values** | `slice` (default), `clone` |
| **Initial Value** | `slice` |
| **Applies To** | All elements |
| **Inherited** | No |
| **Percentages** | N/A |
| **Media** | Visual |
| **Global Support** | 71.75% (full) + 21.5% (partial) = 93.25% total |

## Testing & Validation

### Recommended Testing Scenarios

1. **Inline Element Wrapping**
   - Test inline elements with borders/backgrounds that wrap across lines
   - Verify decoration behavior on each line fragment

2. **Multi-Column Layouts**
   - Create a multi-column container with bordered/padded content
   - Test with both `slice` and `clone` values

3. **Print Context**
   - Use print preview to test page breaks
   - Ensure decorations remain consistent across page boundaries

4. **Cross-Browser Testing**
   - Test in Chrome, Firefox, Safari, and Edge
   - Verify both prefixed and unprefixed implementations

## Migration & Deprecation Notes

- No deprecation is planned for `box-decoration-break`
- The property remains stable in the CSS Fragmentation specification
- No known migration path issues from other CSS properties

---

**Last Updated:** 2025
**Specification Version:** CSS Fragmentation Module Level 3
**Global Usage:** 93.25% of users (71.75% full + 21.5% partial support)
