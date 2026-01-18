# Details & Summary Elements

## Overview

The `<details>` element generates a simple, no-JavaScript widget to show/hide element contents. Content is optionally revealed by clicking on its child `<summary>` element.

## Description

The HTML5 `<details>` and `<summary>` elements provide a native mechanism for creating expandable disclosure widgets without requiring JavaScript. The `<details>` element serves as a container, while the `<summary>` element acts as the toggle button. Users can click on the summary to expand or collapse the details content. This is particularly useful for frequently asked questions (FAQs), collapsible content sections, and progressive disclosure of information.

### Key Features

- **Native browser support** - No JavaScript required for basic functionality
- **Semantic HTML** - Proper HTML5 semantics for accessibility
- **Keyboard accessible** - Can be navigated using keyboard (with some caveats)
- **Lightweight** - Minimal performance overhead
- **Progressive enhancement** - Works with or without CSS styling

## Specification

- **Status**: Living Standard (LS)
- **Specification URL**: https://html.spec.whatwg.org/multipage/forms.html#the-details-element

## Categories

- HTML5

## Benefits & Use Cases

### Primary Use Cases

1. **Frequently Asked Questions (FAQs)**
   - Display questions with expandable answers
   - Improves page readability by hiding lengthy content initially

2. **Collapsible Content Sections**
   - Hide advanced options or additional information
   - Simplify interfaces without removing functionality

3. **Documentation & Help Content**
   - Progressive disclosure of complex topics
   - Improve user experience by showing relevant information on demand

4. **Progressive Disclosure Pattern**
   - Present essential information first
   - Allow users to reveal additional details as needed

5. **Search & Filter Results**
   - Display filtered results with expandable details
   - Reduce initial page clutter

### Benefits

- **Improved User Experience**: Users see essential content immediately
- **Semantic Markup**: Proper HTML structure for accessibility
- **Performance**: No JavaScript overhead for basic functionality
- **Accessibility**: Built-in support for assistive technologies
- **Mobile-Friendly**: Works well on all screen sizes
- **SEO-Friendly**: Content remains in HTML for search engines

## Browser Support

### Support Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ **y** | Fully supported |
| ⚠️ **p** | Partial support |
| ❌ **n** | Not supported |
| 🚩 **d** | Disabled by default |

### Desktop Browsers

| Browser | Support | Version Range | Notes |
|---------|---------|---------------|-------|
| **Chrome** | ✅ Fully supported | 12+ | `toggle` event not supported in versions 12-35; `<summary>` not keyboard accessible in versions 12-18 |
| **Firefox** | ✅ Fully supported | 49+ | Partially supported (partial) in 3.0-46; Disabled by default in 47-48 (enable via `dom.details_element.enabled` flag) |
| **Safari** | ✅ Fully supported | 6.0+ | Partial support in 3.1-5.1; Some versions display smaller font-size with `rem` units and system fonts (versions 10.1-11.1, 10.3, 11.0-11.2) |
| **Edge** | ✅ Fully supported | 79+ | Not supported in versions 12-78 |
| **Opera** | ✅ Fully supported | 15+ | Partial support in 9.0-10.6; Not supported in 11.0-12.1 |
| **Internet Explorer** | ❌ Not supported | — | No support in any version (5.5-11) |

### Mobile Browsers

| Browser | Support | Version Range | Notes |
|---------|---------|---------------|-------|
| **iOS Safari** | ✅ Fully supported | 6.0+ | Partial support in 3.2-5.0-5.1; Font-size issue in some versions (10.0-10.2, 10.3, 11.0-11.2) |
| **Android Browser** | ✅ Fully supported | 4.0+ | Partial support in 2.1-3 |
| **Android Chrome** | ✅ Fully supported | 142+ | |
| **Android Firefox** | ✅ Fully supported | 144+ | |
| **Samsung Internet** | ✅ Fully supported | 4.0+ | |
| **Opera Mobile** | ✅ Fully supported | 80+ | Partial support in 10-12.1 |
| **Opera Mini** | ⚠️ Partial | All versions | |
| **BlackBerry Browser** | ✅ Fully supported | 10+ | Partial support in 7 |
| **UC Browser** | ✅ Fully supported | 15.5+ | |
| **QQ Browser** | ✅ Fully supported | 14.9+ | |
| **Baidu Browser** | ✅ Fully supported | 13.52+ | |
| **KaiOS Browser** | ✅ Fully supported | 2.5+ | |

### Global Support Summary

- **Full Support (y)**: 93.17% of global usage
- **Partial Support (p)**: 0%
- **No Support (n)**: Minimal

## Known Issues & Limitations

### Issue #1: `<select>` Element Bug on Samsung Devices

**Affected Devices**: Samsung Galaxy Note 3, Galaxy S5, and most Samsung devices
**Browser**: Android browser shipped with Samsung devices
**Description**: When a `<select>` element is placed within a `<details>` element, selecting an option in the picker does not update the `<select>` value or trigger change events.
**Workaround**: Consider using alternative dropdown implementations or test thoroughly with target devices.

### Issue #2: `box-sizing` Conflict in Chrome

**Affected Browsers**: Chrome (specific versions with common CSS reset patterns)
**Description**: When using the common CSS reset for `box-sizing` (from Paul Irish's box-sizing fix), children of `<details>` elements may render as if they had `box-sizing: content-box;` instead of inheriting the parent setting.
**Reference**: https://codepen.io/jochemnabuurs/pen/yYzYqM
**Workaround**: Explicitly set `box-sizing` on children of `<details>` elements, or test layout thoroughly after implementing this CSS pattern.

## Important Notes

### Feature Limitations by Version

1. **`toggle` Event Support**
   - Not supported in Chrome 12-35, Safari 6-11.0, and some other early implementations
   - Modern browsers (Chrome 36+, Safari 12+, Firefox 49+) support the `toggle` event

2. **Keyboard Accessibility**
   - `<summary>` elements are not keyboard accessible in Chrome 12-18
   - Modern implementations provide full keyboard support

3. **Font-Size Issue with `rem` Units**
   - Safari 10.1, 10.3, 11.0-11.2 may display smaller font-size than intended when using `rem` units with system fonts
   - Use absolute units or test thoroughly on affected devices

### Polyfill & Fallback Resources

For legacy browser support, several polyfills and fallback scripts are available:

- **Details Element Polyfill**: https://github.com/javan/details-element-polyfill
- **jQuery Fallback**: https://mathiasbynens.be/notes/html5-details-jquery
- **Generic Fallback Script**: https://gist.github.com/370590
- **Feature Detection (has.js)**: https://raw.github.com/phiggins42/has.js/master/detect/features.js#native-details

## Resources & Further Reading

### Official Documentation

- **HTML Living Standard**: https://html.spec.whatwg.org/multipage/forms.html#the-details-element
- **WebPlatform Docs**: https://webplatform.github.io/docs/html/elements/details

### Articles & Tutorials

- **HTML5 Doctor Article**: https://html5doctor.com/summary-figcaption-element/
- **jQuery Fallback Script**: https://mathiasbynens.be/notes/html5-details-jquery

### Bug Tracking

- **Firefox Support Bug**: https://bugzilla.mozilla.org/show_bug.cgi?id=591737

## Implementation Example

```html
<details>
  <summary>Click to reveal more information</summary>
  <p>This content is hidden by default and revealed when the summary is clicked.</p>
</details>
```

### With Initial State (Open)

```html
<details open>
  <summary>This section is expanded by default</summary>
  <p>Content that is visible when the page loads.</p>
</details>
```

## CSS Styling

```css
/* Custom styling for details element */
details {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px;
  margin: 12px 0;
}

summary {
  cursor: pointer;
  font-weight: bold;
  padding: 8px;
  user-select: none;
}

summary:hover {
  background-color: #f0f0f0;
}

details[open] summary {
  border-bottom: 1px solid #ccc;
  margin-bottom: 8px;
  padding-bottom: 8px;
}
```

## JavaScript Integration

```javascript
// Detect support
const detailsSupported =
  'open' in document.createElement('details');

// Listen for toggle event (modern browsers)
details.addEventListener('toggle', (event) => {
  if (event.target.open) {
    console.log('Details opened');
  } else {
    console.log('Details closed');
  }
});

// Programmatic control
const details = document.querySelector('details');
details.open = true;  // Open the details
details.open = false; // Close the details
```

## Recommendations

### When to Use

- Content that is optional or supplementary to the main content
- FAQs and help documentation
- Configuration options and advanced settings
- Reducing initial page length without hiding important content

### Best Practices

1. **Use Semantic Markup**: Always include a `<summary>` element
2. **Clear Summary Text**: Make the summary descriptive and actionable
3. **Progressive Enhancement**: Ensure content is accessible without JavaScript
4. **Keyboard Navigation**: Test thoroughly with keyboard-only navigation
5. **Mobile Considerations**: Ensure touch targets are appropriately sized
6. **Styling**: Use CSS to enhance visual feedback on hover and open states
7. **Accessibility**: Include proper ARIA labels if necessary for complex patterns

### Fallback Strategy for Legacy Browsers

For projects requiring Internet Explorer support or other legacy browsers:

1. Use the Details Element Polyfill library
2. Implement a custom JavaScript fallback
3. Consider alternative patterns (tabs, accordion components)
4. Progressive enhancement: let legacy browsers display all content

## Related Features

- `<summary>` element (child of `<details>`)
- HTML5 Semantic Elements
- Disclosure patterns in web design
- ARIA attributes for enhanced accessibility

---

**Last Updated**: December 2024
**Data Source**: Can I Use Browser Support Database
