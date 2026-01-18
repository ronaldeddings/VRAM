# Customizable Select Element

## Overview

The Customizable Select Element (`<selectlist>` / `<selectmenu>`) is a proposed enhancement to HTML forms that allows developers to create highly customizable select controls while maintaining native semantics and accessibility features.

## Description

Previously envisioned as separate elements (`<selectlist>` or `<selectmenu>`), this feature is now being developed as a proposal for a more customizable `<select>` element. It aims to bridge the gap between the limited styling capabilities of the native `<select>` element and the complexity of building fully custom dropdowns from scratch.

This proposal enables developers to:
- Customize the appearance and behavior of select controls
- Maintain native functionality and keyboard navigation
- Preserve semantic HTML and accessibility features
- Avoid the need for complex JavaScript workarounds

## Specification Status

**Status:** Unofficial/Proposed
**Spec URL:** [Open UI - Customizable Select](https://open-ui.org/components/customizableselect/)

The feature is currently in active development through the Open UI Community Group, which aims to standardize the design of commonly-used UI components across the web.

## Categories

- HTML5

## Benefits & Use Cases

### Key Benefits

- **Better Styling Control** - Style select elements to match design systems without losing native functionality
- **Improved Accessibility** - Leverage native accessibility features rather than building from scratch
- **Reduced JavaScript** - Minimize custom JavaScript needed for select functionality
- **Keyboard Navigation** - Automatic keyboard support without implementation overhead
- **Mobile Friendly** - Native mobile select pickers work automatically

### Common Use Cases

- Designing branded select dropdowns that match modern UI frameworks
- Creating accessible form controls in design systems
- Building consistent dropdown experiences across web and native apps
- Reducing technical debt in custom select implementations
- Improving performance by avoiding JavaScript-heavy dropdown libraries

## Browser Support

### Current Implementation Status

The feature is currently **not supported** in any browser by default. However, it is under active development:

| Browser | Status | Notes |
|---------|--------|-------|
| **Chrome** | ⚠️ Behind Flag | Available from v97+ behind "Experimental Web Platform features" flag. Implemented as `selectmenu` before v119, renamed to align with spec. |
| **Edge** | ⚠️ Behind Flag | Available from v97+ behind "Experimental Web Platform features" flag. |
| **Safari** | ❌ Not Supported | No support across any Safari version. |
| **Firefox** | ❌ Not Supported | No support across any Firefox version. |
| **Opera** | ⚠️ Behind Flag | Available from v83+ behind "Experimental Web Platform features" flag. |
| **iOS Safari** | ❌ Not Supported | No support. |
| **Android Browser** | ❌ Not Supported | No support. |
| **Samsung Browser** | ❌ Not Supported | No support. |

### Legacy Browser Support

Internet Explorer and older versions of all modern browsers do not support this feature.

### Global Usage

- **Users with support (Y):** 0%
- **Users with partial support (A):** 0%

## Implementation Notes

### Enabling Experimental Support

To use this feature in Chrome, Edge, or Opera:

1. Navigate to `chrome://flags` (or equivalent for your browser)
2. Search for "Experimental Web Platform features"
3. Enable the flag
4. Restart the browser

### API Changes

- **Before Chromium 119:** The feature was implemented as `<selectmenu>`
- **From Chromium 119 onwards:** The element was renamed to better align with the open specification

### Feature Keywords

Related terms and attributes:
- `selectlist`
- `selectmenu` (legacy naming)
- `appearance:base-select`
- `::picker(select)` (pseudo-element)
- `selectedoption` (element part)

## Related Resources

### Official Documentation & Discussions

- **[Chrome's Request for Feedback](https://developer.chrome.com/blog/rfc-customizable-select)** - Chrome's latest proposal and feedback request on the customizable select feature

### Demos & Examples

- **[Open UI's `<selectlist>` Demos](https://microsoftedge.github.io/Demos/selectlist/index.html)** - Interactive demonstrations of the selectlist feature and its capabilities

### Blog Posts & Guides

- **[Two Levels of Customising `<selectlist>`](https://hidde.blog/custom-select-with-selectlist/)** - Blog post exploring customization approaches and best practices

## Tracking & References

- **Chrome Issue ID:** 5737365999976448
- **Specification Repository:** [Open UI on GitHub](https://github.com/WICG/open-ui)

## Known Issues

No confirmed bugs at this time. This is an experimental feature under active development, so behavior may change before standardization.

## Future Timeline

As this feature remains experimental and under development, the following may occur:

- API changes or refinements before standardization
- Broader browser adoption following specification finalization
- Possible name changes (tracking the transition from `<selectmenu>` to align with the specification)
- New styling and customization capabilities as the proposal evolves

## Fallback Recommendations

Until broader browser support is available, developers should:

1. Use the native `<select>` element as the base
2. Progressively enhance with the `<selectlist>` feature when available
3. Maintain custom select implementations for browsers without support
4. Use feature detection to conditionally apply enhancements

```javascript
// Simple feature detection
const supportsSelectmenu = 'selectmenu' in HTMLElement.prototype ||
                           'selectlist' in HTMLElement.prototype;

if (supportsSelectmenu) {
  // Use native selectlist/selectmenu
} else {
  // Use custom implementation
}
```

---

*Last Updated: 2025*
*For the latest browser support information, visit [Can I Use - Customizable Select](https://caniuse.com/mdn-html_elements_selectlist)*
