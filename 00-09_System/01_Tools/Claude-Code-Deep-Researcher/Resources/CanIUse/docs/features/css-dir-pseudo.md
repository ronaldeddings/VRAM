# CSS `:dir()` Pseudo-Class

## Overview

The `:dir()` CSS pseudo-class matches HTML elements based on their text directionality. It provides a standardized way to apply styles to elements depending on whether they render left-to-right (LTR) or right-to-left (RTL) content.

**Description:** Matches elements based on their directionality. `:dir(ltr)` matches elements which are Left-to-Right. `:dir(rtl)` matches elements which are Right-to-Left.

---

## Specification Status

| Aspect | Details |
|--------|---------|
| **Specification** | [W3C Selectors Level 4](https://www.w3.org/TR/selectors4/#the-dir-pseudo) |
| **Status** | Working Draft (WD) |
| **Global Support** | 86.15% |

---

## Categories

- **CSS** - CSS Selectors & Pseudo-Classes

---

## Syntax

```css
/* Match left-to-right elements */
:dir(ltr) {
  /* styles */
}

/* Match right-to-left elements */
:dir(rtl) {
  /* styles */
}
```

## Use Cases & Benefits

The `:dir()` pseudo-class is invaluable for building truly responsive, multi-directional web applications:

### Primary Use Cases

1. **Internationalization (i18n)**
   - Style content based on language script direction
   - Support Arabic, Hebrew, Persian, Urdu and other RTL languages
   - Support Chinese, Japanese, Korean and other complex scripts

2. **Dynamic Layout Adaptation**
   - Adjust spacing, alignment, and padding based on text direction
   - Flip margins and padding without repeating selectors
   - Apply direction-specific borders and backgrounds

3. **Navigation & UI Components**
   - Direction-aware navigation menus
   - RTL-optimized form layouts
   - Language-agnostic component libraries

4. **Typography & Content**
   - Direction-appropriate text alignment
   - Proper punctuation placement for different languages
   - Contextual font selection

### Benefits Over Alternatives

- **Better than `[dir]` attribute selectors**: Works with inherited directionality, not just explicit attributes
- **More semantic**: Directly represents directional intent rather than markup attributes
- **Cleaner code**: Eliminates need for separate stylesheets or verbose attribute selectors
- **Future-proof**: Follows W3C standards for directional styling

---

## Code Examples

### Basic LTR/RTL Styling

```css
/* Apply to any element based on direction */
:dir(ltr) {
  margin-right: 1rem;
  text-align: left;
}

:dir(rtl) {
  margin-left: 1rem;
  text-align: right;
}
```

### Component-Specific Styling

```css
/* Button styling for both directions */
button:dir(ltr) {
  padding-right: 1rem;
  border-radius: 0 4px 4px 0;
}

button:dir(rtl) {
  padding-left: 1rem;
  border-radius: 4px 0 0 4px;
}
```

### List & Navigation

```css
/* Navigation menu that works in both directions */
nav ul:dir(ltr) {
  flex-direction: row;
  margin-right: auto;
}

nav ul:dir(rtl) {
  flex-direction: row-reverse;
  margin-left: auto;
}
```

### Icon Positioning

```css
/* Icons that flip based on direction */
.icon-button:dir(ltr)::after {
  content: '→';
  margin-left: 0.5rem;
}

.icon-button:dir(rtl)::after {
  content: '←';
  margin-right: 0.5rem;
}
```

---

## Browser Support

### Summary by Browser

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| **Chrome** | 120 | ![Supported](https://img.shields.io/badge/Supported-green) |
| **Edge** | 120 | ![Supported](https://img.shields.io/badge/Supported-green) |
| **Firefox** | 49 | ![Supported](https://img.shields.io/badge/Supported-green) |
| **Safari** | 16.4 | ![Supported](https://img.shields.io/badge/Supported-green) |
| **Opera** | 106 | ![Supported](https://img.shields.io/badge/Supported-green) |
| **iOS Safari** | 16.4 | ![Supported](https://img.shields.io/badge/Supported-green) |
| **Android Browser** | 142 | ![Supported](https://img.shields.io/badge/Supported-green) |
| **Samsung Internet** | 25 | ![Supported](https://img.shields.io/badge/Supported-green) |

### Detailed Browser Timeline

#### Chrome & Edge (Chromium)
- **Status**: Full support from version 120 onwards
- **Timeline**:
  - Versions 91-119: Available behind `#enable-experimental-web-platform-features` flag
  - Version 120+: Fully enabled by default

#### Firefox
- **Status**: Full support from version 49 onwards
- **Timeline**:
  - Versions 17-48: Available with `-moz-` prefix (experimental)
  - Version 49+: Fully unprefixed and stable

#### Safari & iOS Safari
- **Status**: Full support from version 16.4 onwards
- **Timeline**:
  - Version 16.3 and earlier: Not supported
  - Version 16.4+: Full support available

#### Opera
- **Status**: Full support from version 106 onwards
- **Timeline**:
  - Versions 91-105: Available behind experimental features flag
  - Version 106+: Fully supported

#### Mobile Browsers
- **Opera Mobile**: Version 80+
- **Firefox Android**: Version 144+
- **Chrome Android**: Version 142+
- **Samsung Internet**: Version 25+

#### Legacy Support
- **IE/IE Mobile**: ❌ Not supported
- **Opera Mini**: ❌ Not supported
- **Blackberry**: ❌ Not supported

---

## Known Issues & Notes

### Current Issues

1. **Limited browser support in older versions**: Older Safari versions (pre-16.4) do not support `:dir()`
2. **Incomplete Chrome support prior to v120**: Earlier Chrome versions require feature flag
3. **Experimental status in some browsers**: Feature flags needed in versions 91-119 of Chromium-based browsers

### Notes

- Can be enabled via the `#enable-experimental-web-platform-features` flag in experimental versions
- Works with inherited directionality from parent elements
- Recommended to pair with explicit `dir` attributes on root elements for best compatibility
- CSS logical properties (e.g., `margin-inline`, `padding-block`) provide complementary RTL support

---

## Polyfills & Fallbacks

### Attribute Selector Fallback

While not identical (doesn't inherit directionality), you can use attribute selectors as a fallback:

```css
/* Modern approach */
:dir(ltr) { /* styles */ }

/* Fallback for older browsers */
[dir="ltr"],
:not([dir="rtl"]) { /* same styles */ }
```

### JavaScript Fallback

For browsers that don't support `:dir()`, use JavaScript to apply direction-based classes:

```javascript
function applyDirectionStyles() {
  const direction = document.documentElement.dir || 'ltr';
  document.documentElement.classList.add(`dir-${direction}`);
}

applyDirectionStyles();
```

Then use CSS classes:

```css
.dir-ltr { /* LTR styles */ }
.dir-rtl { /* RTL styles */ }
```

---

## Complementary Technologies

### CSS Logical Properties (Recommended with `:dir()`)

Instead of using `margin-left`/`margin-right` repeatedly, use logical properties:

```css
/* Modern approach - works automatically with :dir() */
margin-inline-start: 1rem;  /* Adapts to direction automatically */
margin-inline-end: 1rem;
padding-inline-start: 0.5rem;
padding-inline-end: 0.5rem;
inset-inline-start: 0;
```

### HTML `dir` Attribute

Ensure your HTML has proper `dir` attributes:

```html
<!-- English (LTR) -->
<html dir="ltr">

<!-- Arabic (RTL) -->
<html dir="rtl">

<!-- Or with language subtag -->
<html dir="ltr" lang="en">
<html dir="rtl" lang="ar">
```

### The `:lang()` Pseudo-Class

Combine with language matching for more specific styling:

```css
:dir(rtl):lang(ar) {
  font-family: 'Arabic Font', serif;
}

:dir(ltr):lang(en) {
  font-family: 'English Font', sans-serif;
}
```

---

## Related Links

- **W3C Specification**: [Selectors Level 4 - The `:dir()` pseudo-class](https://www.w3.org/TR/selectors4/#the-dir-pseudo)
- **HTML Spec**: [HTML specification for `:dir()`](https://html.spec.whatwg.org/multipage/scripting.html#selector-ltr)
- **MDN Documentation**: [CSS :dir](https://developer.mozilla.org/en-US/docs/Web/CSS/:dir)
- **Chrome Bug Tracker**: [Issue #576815: CSS4 pseudo-class :dir()](https://bugs.chromium.org/p/chromium/issues/detail?id=576815)
- **WebKit Bug Tracker**: [Bug #64861: Need support for :dir() pseudo-class](https://bugs.webkit.org/show_bug.cgi?id=64861)
- **Interactive Demo**: [JS Bin testcase](https://jsbin.com/celuye/edit?html,css,output)

---

## Best Practices

1. **Use with CSS logical properties**: Combine `:dir()` with `margin-inline`, `padding-block`, etc. for cleaner code
2. **Provide explicit `dir` attributes**: Always set `dir="ltr"` or `dir="rtl"` on the root element
3. **Test in multiple languages**: Verify styling works correctly for both LTR and RTL content
4. **Consider fallbacks**: Provide attribute selector fallbacks for older browsers if needed
5. **Document language support**: Clearly indicate which languages and directions your site supports
6. **Use `:lang()` for typography**: Combine with language selectors for script-appropriate fonts
7. **Avoid hardcoded directions**: Never hardcode `left`/`right` in margin/padding when direction varies

---

## Browser Compatibility Chart

```
✅ = Full Support
🚩 = Partial/Experimental (requires flag)
❌ = Not Supported

                Chrome  Firefox  Safari  Edge   Opera  IE
2024 (Latest)    ✅      ✅       ✅      ✅     ✅    ❌
2023             ✅      ✅       ✅      ✅     ✅    ❌
2022             🚩      ✅       ✅      🚩     🚩    ❌
2021             ❌      ✅       ❌      ❌     ❌    ❌
2020             ❌      ✅       ❌      ❌     ❌    ❌
```

---

## See Also

- [CSS `:lang()` pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:lang)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [HTML `dir` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
- [Internationalization (i18n) Guide](https://www.w3.org/International/)
- [ARIA `aria-label` for Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
