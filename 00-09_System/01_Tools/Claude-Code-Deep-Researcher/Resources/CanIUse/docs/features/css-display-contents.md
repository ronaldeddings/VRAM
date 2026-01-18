# CSS `display: contents`

## Overview

`display: contents` causes an element's children to appear as if they were direct children of the element's parent, ignoring the element itself. This can be useful when a wrapper element should be ignored when using CSS Grid or similar layout techniques.

**Specification Status:** Candidate Recommendation (CR)
**Last Updated:** 2025
**Global Usage:** 8.05% Full Support + 84.75% Partial Support

---

## Specification

- **Official Spec:** [CSS Display Module Level 3](https://w3c.github.io/csswg-drafts/css-display/)
- **Status:** Candidate Recommendation

---

## Categories

- CSS Layout & Display

---

## Benefits & Use Cases

### Primary Benefits

1. **CSS Grid & Flexbox Simplification**
   - Remove unnecessary wrapper elements from layout calculations
   - Simplify grid item structures without affecting layout behavior
   - Eliminate extra flex container nesting layers

2. **DOM Abstraction**
   - Maintain semantic HTML structure while hiding wrapper elements visually
   - Keep accessibility tree clean without removing elements from the DOM
   - Separate visual presentation from document structure

3. **Component Composition**
   - Unwrap component boundaries in layout contexts
   - Allow child elements to participate in parent grid/flex layouts directly
   - Reduce layout complexity in nested component scenarios

4. **Accessibility Improvements**
   - Avoid nested container overhead in assistive technology announcements
   - Maintain semantic meaning while optimizing visual hierarchy
   - Simplify navigation structure for screen readers

### Common Use Cases

- **Grid Layout Wrappers:** Remove intermediate container elements that interfere with grid item sizing
- **Flex Container Nesting:** Flatten unnecessary flex container hierarchies
- **Dynamic Content Layouts:** Simplify layouts when content structure varies
- **Component Frameworks:** Unwrap component wrapper divs without DOM restructuring
- **Responsive Design:** Handle responsive layouts without extra container elements

---

## Browser Support

### Summary by Browser

| Browser | First Support | Status | Notes |
|---------|--------------|--------|-------|
| Chrome | 65+ | Partial* | Accessibility bugs with buttons and ARIA roles |
| Firefox | 37+ | Partial* | Implementation bugs affecting accessibility |
| Safari | 11.1+ | Partial* | Bugs fixed in Safari 13.4; table/grid accessibility issues |
| Edge | 79+ | Partial* | Chromium-based; same issues as Chrome |
| Opera | 52+ | Partial* | Chromium-based; same issues as Chrome |
| iOS Safari | 11.3+ | Full (17.0+) | Full support from iOS 17.0+ |
| Android Browser | 4.4+ | Partial* | Accessibility issues present |
| Samsung Internet | 9.2+ | Partial* | Accessibility bugs present |
| IE | Never | ✗ Not Supported | No support in any version |
| Opera Mini | All | ✗ Not Supported | Not supported in any version |

*Partial support indicates accessibility limitations with certain element types

### Detailed Support Table

#### Desktop Browsers

| Version | Chrome | Firefox | Safari | Edge | Opera | IE |
|---------|--------|---------|--------|------|-------|-----|
| Current (2024+) | ✓ Partial* | ✓ Partial* | ✓ Full (17+) | ✓ Partial* | ✓ Partial* | ✗ |
| 2 Years Old | ✓ Partial* | ✓ Partial* | ✓ Partial* | ✓ Partial* | ✓ Partial* | ✗ |
| 5 Years Old | ✓ Partial* | ✓ Partial* | ✗ | ✗ | ✓ Partial* | ✗ |

#### Mobile Browsers

| Version | iOS Safari | Android | Chrome | Samsung | Opera |
|---------|-----------|---------|--------|---------|-------|
| Current | ✓ Full | ✓ Partial* | ✓ Partial* | ✓ Partial* | ✓ Partial* |
| 2 Years Old | ✓ Full | ✓ Partial* | ✓ Partial* | ✓ Partial* | ✓ Partial* |
| 5 Years Old | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## Known Bugs & Limitations

### Accessibility Issues

#### Bug #1: Severe Implementation Bugs (Early Implementations)

**Affected Versions:**
- Chrome 65-88
- Firefox 37-61
- Edge 79-88
- Opera 52-75

**Issue:** Partial support refers to [severe implementation bugs](https://hidde.blog/more-accessible-markup-with-display-contents/) that render content inaccessible for many element types.

**Status:** Mostly resolved in later versions, but caution advised

---

#### Bug #2: Button Inaccessibility

**Affected Versions:**
- Chrome (versions with partial support)
- Firefox (versions with partial support)
- Safari/WebKit (all partial support versions)

**Issue:** Buttons are not accessible when `display: contents` is applied

**Tracking:**
- [Chromium Issue #1366037](https://bugs.chromium.org/p/chromium/issues/detail?id=1366037)
- [Firefox Bug #1791648](https://bugzilla.mozilla.org/show_bug.cgi?id=1791648)
- [WebKit Bug #255149](https://bugs.webkit.org/show_bug.cgi?id=255149)

**Workaround:** Avoid using `display: contents` on button elements or their direct parents

---

#### Bug #3: Table & Grid Element Inaccessibility

**Affected Versions:**
- Safari/WebKit (versions with partial support)

**Issue:** HTML tables and elements with ARIA roles `directory`, `grid`, `treegrid`, `table`, `row`, `gridcell`, `cell`, `columnheader`, `tree`, and `treeitem` are not accessible when `display: contents` is applied

**Tracking:**
- [WebKit Bug #239478](https://bugs.webkit.org/show_bug.cgi?id=239478)
- [WebKit Bug #239479](https://bugs.webkit.org/show_bug.cgi?id=239479)
- [WebKit Bug #257458](https://bugs.webkit.org/show_bug.cgi?id=257458)

**Workaround:** Avoid `display: contents` on table-related elements and ARIA grid components

---

#### Bug #4: Safari iOS Initial Implementation (iOS 10-11)

**Affected Versions:**
- Safari iOS 10 and 11
- Safari 11 (macOS)

**Issue:** `display: contents` renders as `display: inline`. Additionally, `@supports` incorrectly reports support.

**Status:** Fixed in Safari 13.4

**Impact:** Limited, as iOS Safari has had proper support since iOS 11.3+

---

#### Bug #5: Safari display:none Toggle & ::before/::after (Fixed)

**Affected Versions:**
- Safari macOS and iOS (versions 11-13.3)

**Issues:**
1. Toggling between `display: none` and `display: contents` caused rendering errors
2. `::before` and `::after` pseudo-elements did not properly fill their grid cells

**Tracking:**
- [WebKit Bug #188259](https://bugs.webkit.org/show_bug.cgi?id=188259)
- [WebKit Bug #193567](https://bugs.webkit.org/show_bug.cgi?id=193567)

**Status:** Fixed in Safari 13.4 (March 2020)

---

## Implementation Recommendations

### Safe Use Patterns

1. **Avoid on Interactive Elements**
   - Do not use on `<button>`, `<input>`, `<select>`, `<textarea>`
   - Avoid on elements with event listeners
   - Test thoroughly with assistive technologies

2. **Avoid on Table Semantics**
   - Do not use on `<table>`, `<tr>`, `<td>`, `<th>`
   - Avoid on elements with table-related ARIA roles
   - Consider alternative layout approaches

3. **Avoid on Aria Grid Components**
   - Do not use on elements with grid, treegrid, or related ARIA roles
   - Test accessibility with screen readers
   - Verify keyboard navigation still works

4. **Safe Use Cases**
   - Generic wrapper divs in grid/flex layouts
   - Non-semantic container elements
   - Presentation-only containers without interactive content

### Feature Detection

```javascript
// Check support
const supportsDisplayContents = CSS.supports('display', 'contents');

// Use @supports in CSS
@supports (display: contents) {
  .wrapper {
    display: contents;
  }
}
```

### Fallback Strategy

```css
.wrapper {
  /* Fallback for older browsers */
  display: block;
}

/* Apply only where supported */
@supports (display: contents) {
  .wrapper {
    display: contents;
  }
}
```

### Testing Requirements

- Test with keyboard navigation
- Verify with screen readers (NVDA, JAWS, VoiceOver)
- Check focus indicators
- Validate semantic structure in accessibility tree
- Test across browsers (especially Safari and Firefox)

---

## Related Resources

### Official Documentation

- [MDN: display - contents](https://developer.mozilla.org/en-US/docs/Web/CSS/display#contents)
- [W3C CSS Display Module Level 3](https://w3c.github.io/csswg-drafts/css-display/)

### Articles & Guides

- [Vanishing boxes with display: contents](https://rachelandrew.co.uk/archives/2016/01/29/vanishing-boxes-with-display-contents/) - Rachel Andrew
- [More accessible markup with display: contents](https://hidde.blog/more-accessible-markup-with-display-contents/) - Hidde de Vries
- [CSS Display: contents at MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/display#none)

### Browser Compatibility

- [Can I use: CSS display: contents](https://caniuse.com/css-display-contents)

---

## Summary

`display: contents` is widely supported across modern browsers but requires careful consideration of accessibility implications. While desktop support is generally available (with partial implementations), iOS Safari provides the only full support. The feature is most useful for layout unwrapping in CSS Grid and Flexbox scenarios, but should be avoided on interactive elements, tables, and ARIA grid components due to accessibility bugs.

**Recommendation:** Use with caution; extensively test with assistive technologies before deploying to production, especially on interactive or table-based content.
