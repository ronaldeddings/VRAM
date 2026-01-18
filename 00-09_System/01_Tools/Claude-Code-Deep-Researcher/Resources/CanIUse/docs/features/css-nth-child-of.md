# CSS `:nth-child()` and `:nth-last-child()` with Selector List (of S)

## Overview

The `:nth-child(An+B of S)` and `:nth-last-child(An+B of S)` pseudo-classes allow developers to select the Nth element among a filtered set of children matching a specific selector list. This represents a significant evolution of the classic `:nth-child()` and `:nth-last-child()` pseudo-classes, adding powerful filtering capabilities.

### Feature Description

The newest versions of `:nth-child()` and `:nth-last-child()` accept an optional `of S` clause which filters the children to only those matching the selector list `S`. For example:

```css
/* Select the first child with the 'foo' class */
:nth-child(1 of .foo)

/* Select every even child that has the 'highlight' class */
:nth-child(2n of .highlight)

/* Select the last matching element */
:nth-last-child(1 of .active)
```

This is similar to `:nth-of-type()`, but with the flexibility to match arbitrary selectors instead of only type selectors.

---

## Specification & Status

| Property | Value |
|----------|-------|
| **Specification** | [CSS Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors/#the-nth-child-pseudo) |
| **Status** | Working Draft (WD) |
| **Category** | CSS |
| **Global Usage** | 90.28% of tracked users |

---

## Benefits & Use Cases

### Enhanced Selectivity
- **Reduce DOM Complexity**: No need to add extra wrapper elements or classes to achieve complex selection patterns
- **Dynamic Filtering**: Select nth elements from dynamically filtered DOM nodes without JavaScript

### Common Scenarios

#### 1. **Styling List Items by Type**
```css
/* Style only the first active tab */
.tabs > :nth-child(1 of .active) {
  border-bottom: 2px solid blue;
}
```

#### 2. **Highlighting Every Other Relevant Element**
```css
/* Alternate colors for only visible/important items */
.card-list > :nth-child(2n of [data-important="true"]) {
  background: #f0f0f0;
}
```

#### 3. **Form Field Styling**
```css
/* Style the 3rd required field */
form > :nth-child(3 of [required]) {
  border-color: red;
}
```

#### 4. **Complex Component Layouts**
```css
/* Select specific children matching multiple conditions */
.grid > :nth-child(3n of .featured:not(.archived)) {
  grid-column: span 2;
}
```

### Advantages Over Alternatives

- **vs. JavaScript**: No runtime computation overhead
- **vs. `:nth-of-type()`**: Works with any selector, not just element types
- **vs. Multiple Classes**: Cleaner CSS without cascading specificity issues
- **vs. `:has()`**: More efficient for simple nth-based filtering

---

## Browser Support

### Desktop Browsers

| Browser | First Version | Current Support |
|---------|---------------|-----------------|
| **Chrome** | 111+ | ✅ Full Support |
| **Edge** | 111+ | ✅ Full Support |
| **Firefox** | 113+ | ✅ Full Support |
| **Safari** | 9+ | ✅ Full Support |
| **Opera** | 98+ | ✅ Full Support |
| **IE** | Not Supported | ❌ No Support |

### Mobile Browsers

| Browser | First Version | Current Support |
|---------|---------------|-----------------|
| **Safari iOS** | 9.0+ | ✅ Full Support |
| **Chrome Android** | 142+ | ✅ Full Support |
| **Firefox Android** | 144+ | ✅ Full Support |
| **Samsung Internet** | 22+ | ✅ Full Support |
| **Opera Mobile** | 80+ | ✅ Full Support |
| **Opera Mini** | Not Supported | ❌ No Support |
| **UC Browser** | Not Supported | ❌ No Support |

### Support Summary

**Global Coverage**: 90.28% of users have support via their primary browser

**Fully Supported**: Chrome, Edge, Firefox, Safari, Opera, and most modern mobile browsers

**Not Supported**: Internet Explorer, Opera Mini, UC Browser

---

## Implementation Details

### Syntax

```css
:nth-child(An+B [of S])
:nth-last-child(An+B [of S])
```

**Parameters**:
- `An+B` - Standard nth-child formula (e.g., `2n+1`, `3n`, `odd`, `even`, `1`)
- `of S` - Optional selector list to filter which children are counted

### Examples

```css
/* Basic usage - first matching element */
li:nth-child(1 of .active) {
  font-weight: bold;
}

/* Every second matching element */
tr:nth-child(2n of .data-row) {
  background: #f9f9f9;
}

/* Complex selector list */
article:nth-child(3 of [data-status="published"]:not(.draft)) {
  display: block;
}

/* Using nth-last-child */
.item:nth-last-child(1 of .pinned) {
  position: sticky;
  bottom: 0;
}

/* Functional equivalent to nth-of-type for elements */
p:nth-child(n of p) {
  margin: 1em 0;
}
```

---

## Known Issues & Limitations

### Current Limitations

1. **Selector List Restrictions**: The `of S` clause only accepts a valid selector list; some complex selectors may not be allowed
2. **Performance**: Calculating nth positions with complex selectors can be computationally expensive for large DOMs
3. **Pseudo-element Interaction**: Cannot select pseudo-elements with this feature

### Browser-Specific Notes

- **Safari**: Full support since version 9, consistently implemented
- **Firefox**: Added in version 113; earlier versions require fallbacks
- **Chrome/Edge**: Added in version 111+
- **Opera**: Added in version 98+

---

## Migration & Fallback Strategies

### For Legacy Browser Support

Use feature detection or progressive enhancement:

```css
/* Fallback for older browsers */
.item:nth-child(1) {
  /* Basic styling for all first children */
}

/* Enhanced styling with new feature */
@supports (selector(:nth-child(1 of .active))) {
  .item:nth-child(1 of .active) {
    /* Specific styling for first active item */
  }
}
```

### JavaScript Polyfill Approach

For critical projects requiring IE support, consider using JavaScript:

```javascript
// Polyfill approach for older browsers
document.querySelectorAll('.parent > :nth-child(1 of .active)')
  .forEach(el => {
    el.classList.add('first-active');
  });
```

---

## Related Features & Resources

### Related CSS Selectors

- [`:nth-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child) - Standard nth-child selector
- [`:nth-last-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-last-child) - Count from the end
- [`:nth-of-type()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-of-type) - Select nth element of specific type
- [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) - Parent selector (complements this feature)
- [`:is()` and `:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:is) - Selector list matching

### External References

- **W3C Specification**: [CSS Selectors Level 4 - :nth-child](https://w3c.github.io/csswg-drafts/selectors/#the-nth-child-pseudo)
- **MDN Documentation**: [:nth-child() - CSS | MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child)
- **CanIUse**: [CSS nth-child selector list argument](https://caniuse.com/css-nth-child-of)

### Implementation Tracking

- **Mozilla Bug Tracker**: [Bug 854148 - Support for :nth-child(An+B of sel), :nth-last-child(An+B of sel) pseudo-classes](https://bugzilla.mozilla.org/show_bug.cgi?id=854148)
- **Chromium Issue Tracker**: [Issue 304163: Implement :nth-child(an+b of S) and :nth-last-child(an+b of S) pseudo-classes](https://bugs.chromium.org/p/chromium/issues/detail?id=304163)
- **MS Edge Status**: [CSS Selectors Level 4](https://web.archive.org/web/20190401105447if_/https://developer.microsoft.com/en-us/microsoft-edge/platform/status/cssselectorslevel4/)

---

## See Also

- [CSS Selectors Level 3 Support](https://caniuse.com/feat=css-sel3) - For information on standard `:nth-child()` support
- [CSS Selectors Level 4](https://caniuse.com/feat=css-sel4) - For other Selectors Level 4 features

---

## Adoption Recommendation

**Status**: Ready for Production Use (90.28% global support)

With modern browser support reaching 90%+ of users and a clear upgrade path via progressive enhancement, `:nth-child(An+B of S)` is safe for production use in most projects. Consider fallbacks or polyfills only if legacy browser support is a critical requirement.

**Timeline**:
- Modern browsers (Chrome, Firefox, Safari, Edge 111+): Full support
- Mobile browsers: Excellent support (iOS Safari 9+, Android Chrome 142+)
- Legacy browsers: Not supported (IE, older Opera/Samsung)
