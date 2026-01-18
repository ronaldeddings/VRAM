# CSS Nesting

## Overview

CSS Nesting provides the ability to nest one style rule inside another, with the selector of the child rule relative to the selector of the parent rule. This feature eliminates the need for CSS pre-processors like Sass or Less to achieve nested styling, bringing nesting capabilities directly to native CSS.

**Status:** ![Working Draft](https://img.shields.io/badge/Status-Working%20Draft-blue) | **Global Support:** ~85%+

---

## Specification

- **W3C Spec:** [CSS Nesting Module](https://w3c.github.io/csswg-drafts/css-nesting/)
- **Specification Status:** Working Draft

---

## Categories

- CSS

---

## Benefits and Use Cases

### Key Benefits

1. **Reduced Code Repetition** - Write selectors once with nested child selectors instead of repeating parent selectors
2. **Improved Readability** - Visually organize related styles together, making code structure clearer
3. **Easier Maintenance** - Related styles grouped together make updates and refactoring simpler
4. **Pre-processor Parity** - Replaces the need for Sass/SCSS nesting, enabling pure CSS solutions
5. **Better Organization** - Parent-child relationships are immediately apparent in code structure

### Common Use Cases

- **Component Styling:** Nest related component states and variants
```css
.button {
  padding: 10px 20px;

  &:hover {
    background-color: darkblue;
  }

  &.primary {
    background-color: blue;
  }
}
```

- **BEM Modifiers:** Simplify Block Element Modifier pattern
```css
.card {
  padding: 20px;

  .card__header {
    font-weight: bold;
  }

  &.card--featured {
    border: 2px solid gold;
  }
}
```

- **Pseudo-classes and Pseudo-elements:** Organize state variations
```css
.link {
  color: blue;

  &:visited {
    color: purple;
  }

  &:focus {
    outline: 2px solid blue;
  }
}
```

- **Media Queries:** Keep responsive styles with their base styles
```css
.container {
  width: 100%;

  @media (min-width: 768px) {
    width: 80%;
  }
}
```

---

## Browser Support

CSS Nesting enjoys strong support across modern browsers, with full implementation in all major engines as of late 2024.

### Support Summary Table

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 120 | ![Full Support](https://img.shields.io/badge/Full%20Support-green) |
| Edge | 120 | ![Full Support](https://img.shields.io/badge/Full%20Support-green) |
| Firefox | 117 | ![Full Support](https://img.shields.io/badge/Full%20Support-green) |
| Safari | 17.2 | ![Full Support](https://img.shields.io/badge/Full%20Support-green) |
| Opera | 106 | ![Full Support](https://img.shields.io/badge/Full%20Support-green) |

### Detailed Browser Support

#### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome/Chromium** | 120+ | ✅ Full Support | Partial support from v112 behind flag (#3) |
| **Firefox** | 117+ | ✅ Full Support | Partial support from v115 behind flag (#2) |
| **Safari** | 17.2+ | ✅ Full Support | Partial support from v16.5 (#3) |
| **Edge** | 120+ | ✅ Full Support | Partial support from v112 (#3) |
| **Opera** | 106+ | ✅ Full Support | Partial support from v98 (#3) |
| **Internet Explorer** | All | ❌ No Support | Legacy browser |

#### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **iOS Safari** | 17.2+ | ✅ Full Support | Partial support from v16.5 (#3) |
| **Android Browser** | 142+ | ✅ Full Support | Recent versions only |
| **Chrome Mobile** | 142+ | ✅ Full Support | - |
| **Firefox Mobile** | 144+ | ✅ Full Support | - |
| **Samsung Internet** | 25+ | ✅ Full Support | Partial support from v23 (#3) |
| **Opera Mobile** | 80+ | ✅ Full Support | - |
| **Opera Mini** | All | ❌ No Support | - |

### Global Coverage

- **Full Support:** ~85.23% of users
- **Partial Support:** ~3.7% of users
- **No Support:** ~11% of users

This strong adoption rate makes CSS Nesting safe to use in production for most modern applications.

---

## Known Issues and Limitations

### #1 - Experimental Features Flag

**Browsers:** Chrome/Edge v109-v111
**Description:** CSS Nesting available behind the `chrome://flags/#enable-experimental-web-platform-features` flag
**Status:** Removed in v112+ (moved to partial implementation)

### #2 - Firefox Feature Flag

**Browsers:** Firefox v115-v116
**Description:** CSS Nesting available behind the `layout.css.nesting.enabled` flag
**Status:** Enabled by default from v117+

### #3 - Element Selector Limitations

**Browsers:** Chrome/Edge v112-v119, Safari v16.5-v17.1, iOS Safari v16.5-v17.1, Samsung v23-v24
**Description:** Does not allow nesting of type (element) selectors without starting with a symbol, like the `&` nesting selector.
**Impact:** When nesting element selectors, you must use the `&` combinator. For example:

```css
/* This works in full-support browsers */
.parent {
  p {
    color: blue;
  }
}

/* This is required in partial-support browsers */
.parent {
  & p {
    color: blue;
  }
}
```

**Reference:** [Chromium Issue #1427259](https://bugs.chromium.org/p/chromium/issues/detail?id=1427259)

---

## Implementation Examples

### Basic Nesting with `&`

```css
.button {
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: darkblue;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
}
```

### Combining with Descendant Selectors

```css
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;

  .card-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .card-body {
    font-size: 14px;
    line-height: 1.6;
  }

  .card-footer {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
}
```

### Media Queries with Nesting

```css
.container {
  width: 100%;
  padding: 20px;

  @media (min-width: 768px) {
    width: 750px;
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    width: 960px;
  }
}
```

### Complex Selector Combinations

```css
.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;

    &:focus {
      outline: none;
      border-color: blue;
      box-shadow: 0 0 5px rgba(0, 0, 255, 0.5);
    }
  }

  &.error input {
    border-color: red;
  }
}
```

### Specificity Considerations

The nested selector's specificity is calculated as the sum of the parent and child selectors:

```css
.button {
  color: blue;           /* specificity: 0,1,0 */

  &:hover {
    color: darkblue;     /* specificity: 0,2,0 (0,1,0 from .button + 0,1,0 from :hover) */
  }
}

.btn.primary {
  color: blue;           /* specificity: 0,2,0 */

  &:hover {
    color: darkblue;     /* specificity: 0,3,0 (0,2,0 from .btn.primary + 0,1,0 from :hover) */
  }
}
```

---

## Related Features and Links

### W3C and Specification
- **CSS Nesting Module:** https://w3c.github.io/csswg-drafts/css-nesting/

### Browser Support Issues
- **Chrome Support Tracking:** [Chromium Issue #1095675](https://bugs.chromium.org/p/chromium/issues/detail?id=1095675)
- **Firefox Support Tracking:** [Mozilla Bug #1648037](https://bugzilla.mozilla.org/show_bug.cgi?id=1648037)
- **Safari Support Tracking:** [WebKit Bug #223497](https://bugs.webkit.org/show_bug.cgi?id=223497)

### Learning Resources
- **CSS Nesting, Specificity and You:** [Kilian Valkhof's Blog Post](https://kilianvalkhof.com/2021/css-html/css-nesting-specificity-and-you/) - Excellent deep dive into specificity behavior with CSS Nesting

### Related CSS Features
- CSS Custom Properties (CSS Variables)
- CSS Cascade and Inheritance
- CSS Selectors Module
- CSS Pseudo-classes

---

## Migration Guide from Pre-processors

### From Sass to CSS Nesting

**Before (Sass):**
```scss
.navbar {
  display: flex;

  .logo {
    font-weight: bold;
  }

  &.sticky {
    position: fixed;
    top: 0;
  }
}
```

**After (CSS Nesting):**
```css
.navbar {
  display: flex;

  .logo {
    font-weight: bold;
  }

  &.sticky {
    position: fixed;
    top: 0;
  }
}
```

The syntax is remarkably similar, making migration straightforward!

---

## Browser Compatibility Notes

### For Production Use

Given the ~85% global support rate, CSS Nesting is safe for production use. However, consider:

1. **Graceful Degradation:** Provide fallback styles for unsupported browsers if targeting older devices
2. **Progressive Enhancement:** Use CSS Nesting in modern browsers and provide basic styles for older ones
3. **Testing:** Test in your target browsers, especially Edge and Firefox on older versions
4. **Future-proof:** The feature is widely adopted and unlikely to change significantly

### For Target Audience

If your audience uses:
- **Enterprise/Legacy Systems:** Wait or provide fallbacks (IE11 still has ~1% usage)
- **Modern Users:** Safe to use without fallbacks (~95% coverage)
- **Mobile-first:** Excellent support across iOS Safari and Android Chrome

---

## See Also

- [Can I Use - CSS Nesting](https://caniuse.com/css-nesting)
- [MDN - CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [CSS-Tricks - CSS Nesting](https://css-tricks.com/)
- Pre-processor Alternatives: Sass, Less, Stylus

---

*Last Updated: 2024 | Data Source: CanIUse.com*
