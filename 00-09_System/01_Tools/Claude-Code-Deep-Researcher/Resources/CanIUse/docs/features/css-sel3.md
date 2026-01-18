# CSS3 Selectors

## Overview

CSS3 Selectors (also known as CSS Selectors Level 3) enable advanced element selection in stylesheets, significantly expanding the capabilities beyond basic CSS 2 selectors. This specification has become a foundational feature for modern web styling.

## Description

CSS3 Selectors provide a comprehensive set of advanced selection methods for targeting HTML elements with precision. These selectors enable developers to style elements based on their position in the DOM tree, attribute values, state, and relationship to other elements.

### Key Selectors Included

**Attribute Selectors:**
- `[foo^="bar"]` - Attribute starts with value
- `[foo$="bar"]` - Attribute ends with value
- `[foo*="bar"]` - Attribute contains value

**Pseudo-classes:**
- `:root` - Document root element
- `:nth-child()` - Element by position among siblings
- `:nth-last-child()` - Element by position counting from the end
- `:nth-of-type()` - Element by position among same-type siblings
- `:nth-last-of-type()` - Element by position counting from the end among same-type
- `:last-child` - Last child of parent
- `:first-of-type` - First element of its type
- `:last-of-type` - Last element of its type
- `:only-child` - Element with no siblings
- `:only-of-type` - Element that is the only one of its type
- `:empty` - Element with no children or text
- `:target` - Element matching current URL fragment
- `:enabled` - Enabled form element
- `:disabled` - Disabled form element
- `:checked` - Checked form element

**Negation:**
- `:not()` - Elements not matching selector

**Combinators:**
- `~` (General sibling combinator) - Any sibling element that follows

## Specification

- **W3C Status:** [Recommendation (REC)](https://www.w3.org/TR/css3-selectors/)
- **Specification URL:** https://www.w3.org/TR/css3-selectors/

## Categories

- CSS3

## Use Cases & Benefits

### Benefits

1. **Precise Element Targeting:** Select elements with minimal DOM traversal or class additions
2. **Reduced Markup:** Style elements based on position and state without extra classes
3. **Form Handling:** Target specific form states (`:enabled`, `:disabled`, `:checked`)
4. **Dynamic Styling:** Use `:nth-child()` and similar for pattern-based styling
5. **Cleaner CSS:** Eliminate need for descendant combinators and additional selectors
6. **Accessibility:** Better semantic styling with pseudo-classes like `:target`

### Common Use Cases

- **Navigation menus:** Style alternating items with `:nth-child(odd)` / `:nth-child(even)`
- **Form styling:** Apply styles based on element state (`:enabled`, `:disabled`, `:checked`)
- **List styling:** Target specific list items or every nth item
- **Component styling:** Select elements without adding classes (`:first-of-type`, `:last-of-type`)
- **Empty states:** Hide or style empty containers with `:empty`
- **Dynamic content:** Adjust styling based on sibling relationships with `~`

## Browser Support

### Support Legend

- ✅ **Fully Supported (y)** - Feature works as expected
- ⚠️ **Partial Support (a)** - Limited selector support; see notes
- ❌ **Not Supported (n)** - Feature not implemented

### Current Status Summary

- **Global Support:** 93.69% with full support across major browsers
- **Modern Browsers:** Universally supported
- **Legacy Concerns:** Internet Explorer 6-8 have partial/no support

### Detailed Browser Support Table

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Internet Explorer** |
| IE 5.5 | 5.5 | ❌ Not supported |
| IE 6 | 6 | ⚠️ Partial | Limited support |
| IE 7 | 7 | ⚠️ Partial | Only general siblings and attribute selectors |
| IE 8 | 8 | ⚠️ Partial | Only general siblings and attribute selectors |
| IE 9 | 9 | ✅ Full | Complete support |
| IE 10 | 10 | ✅ Full | Complete support |
| IE 11 | 11 | ✅ Full | Complete support (with known bugs) |
| **Edge** |
| Edge 12 - 143 | All versions | ✅ Full | Complete support across all versions |
| **Firefox** |
| Firefox 2 | 2 | ❌ Not supported |
| Firefox 3 | 3 | ❌ Not supported |
| Firefox 3.5+ | 3.5 and later | ✅ Full | Complete support from version 3.5 onward |
| **Chrome** |
| Chrome 4+ | All versions | ✅ Full | Complete support from launch |
| **Safari** |
| Safari 3.1 | 3.1 | ❌ Not supported |
| Safari 3.2+ | 3.2 and later | ✅ Full | Complete support from version 3.2 onward |
| **Opera** |
| Opera 9 | 9 | ❌ Not supported |
| Opera 9.5+ | 9.5 and later | ✅ Full | Complete support from version 9.5 onward |
| **Mobile Browsers** |
| iOS Safari | 3.2+ | ✅ Full | Complete support |
| Android | 2.1+ | ✅ Full | Complete support |
| Opera Mini | All versions | ✅ Full | Complete support |
| Samsung Internet | 4.0+ | ✅ Full | Complete support |
| Firefox Android | 144 | ✅ Full | Complete support |
| Chrome Android | 142 | ✅ Full | Complete support |

## Known Issues & Bugs

### Browser-Specific Bugs

1. **Android 4.3 and Lower (WebKit)**
   - Issue: Problems when combining pseudo-classes with adjacent or general sibling selectors
   - Affected Browsers: Android 4.3 and older, older WebKit browsers
   - Impact: Selector combinations may not work as expected
   - Reference: [CSS Tricks - WebKit Sibling Bug](https://css-tricks.com/webkit-sibling-bug/)

2. **iOS 8 Safari**
   - Issue: `:nth-child` selectors not functioning correctly after `pushState` navigation
   - Affected Browsers: iOS 8 Safari
   - Impact: Dynamic content updates may not reflect selector styles
   - Reference: [Stack Overflow - iOS 8 nth-child Issue](https://stackoverflow.com/questions/26032513/ios8-safari-after-a-pushstate-the-nth-child-selectors-not-works)

3. **Internet Explorer 9-11 (`:empty`)**
   - Issue: Page will not repaint/relayout if content is added or removed from an element selected with `:empty`
   - Affected Browsers: IE 9, IE 10, IE 11
   - Impact: Dynamic content changes won't visually update
   - Workaround: Manually trigger reflow or avoid `:empty` for dynamic content

4. **iOS 9 WebView**
   - Issue: CSS sibling selector (`~`) doesn't work in WebViews (not Safari browser)
   - Affected Browsers: iOS 9 WebView
   - Impact: General sibling selector may fail in embedded contexts
   - Reference: [Apple Developer Forum - Thread 16449](https://forums.developer.apple.com/thread/16449)

5. **Internet Explorer 11 (`:last-of-type` with Custom Elements)**
   - Issue: `:last-of-type` selector doesn't work correctly with custom elements
   - Affected Browsers: IE 11, Edge (older versions)
   - Impact: Custom element styling limited
   - Reference: [Stack Overflow - last-of-type and Custom Elements](https://stackoverflow.com/questions/38666233/last-of-type-doesnt-work-with-custom-elements-in-ie11-and-edge#38669965)

6. **Internet Explorer (`:disabled` Pseudo-class)**
   - Issue: `:disabled` pseudo-class selector doesn't recognize `<fieldset disabled>` attribute
   - Affected Browsers: Internet Explorer (all versions)
   - Impact: Cannot use `:disabled` to style disabled fieldsets
   - Workaround: Use class-based selectors for disabled fieldsets in IE

## Implementation Notes

### IE7/IE8 Partial Support

Internet Explorer 7 and 8 have limited CSS3 selector support. They only support:
- General siblings combinator: `element1 ~ element2`
- Attribute selectors: `[attr^=val]`, `[attr$=val]`, `[attr*=val]`

All other CSS3 selectors are not supported in these versions.

### Polyfill Support

For older browser support, the **Selectivizr** polyfill can add CSS3 selector support to Internet Explorer 6-8. However, this approach has performance implications and is no longer recommended for modern projects.

### Modern Development

For modern web development, CSS3 Selectors have near-universal support. Concerns should only arise when:
- Supporting Internet Explorer 8 or earlier
- Working with very old mobile browsers (pre-2012)
- Dealing with specific edge cases in older WebKit implementations

## Related Resources

### Official Documentation
- [W3C CSS Selectors Level 3 Specification](https://www.w3.org/TR/css3-selectors/)
- [WebPlatform Docs - CSS Selectors](https://webplatform.github.io/docs/css/selectors)

### Learning & Reference
- [Quirksmode - Detailed Support Information](https://www.quirksmode.org/css/selectors/)
- [CSS3.info - Automated Selector Test](http://www.css3.info/selectors-test/)

### Polyfills & Tools
- [Selectivizr - CSS3 Selector Polyfill for IE6-8](http://selectivizr.com) (legacy)

## Migration Guide

### From CSS 2 Selectors

If you're upgrading from CSS 2 selectors, you can now:

1. **Remove class-based positioning patterns:**
   ```css
   /* Old way */
   .list .item-1 { ... }
   .list .item-2 { ... }
   .list .item-3 { ... }

   /* New way */
   .list li:nth-child(1) { ... }
   .list li:nth-child(2) { ... }
   .list li:nth-child(3) { ... }
   ```

2. **Simplify state-based styling:**
   ```css
   /* Old way */
   <input class="active" />
   input.active { ... }

   /* New way */
   input:checked { ... }
   ```

3. **Use attribute selectors:**
   ```css
   /* Old way */
   <a class="external" href="..." />
   a.external { ... }

   /* New way */
   a[href^="http"] { ... }
   ```

## Summary

CSS3 Selectors are a mature, widely-supported feature that forms the foundation of modern CSS development. With 93.69% global support and universal coverage in all modern browsers, you can safely use these selectors in production code. Legacy browser support concerns are minimal unless you need to support Internet Explorer 8 or earlier.

The feature enables cleaner, more maintainable CSS with reduced reliance on class-based selectors and simpler DOM structures.
