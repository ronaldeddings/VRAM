# display: run-in

## Overview

The `display: run-in` CSS property is a layout value that defines how a box interacts with its surrounding content. It creates adaptive layout behavior where a box can flow differently depending on what content follows it.

## Description

If the run-in box contains a block box, it is treated the same as block. If a block box follows the run-in box, the run-in box becomes the first inline box of the block box. If an inline box follows, the run-in box becomes a block box.

## Specification

- **Status**: Candidate Recommendation (CR)
- **W3C Spec**: [CSS Display Module Level 3](https://w3c.github.io/csswg-drafts/css-display-3/#valdef-display-run-in)
- **Categories**: CSS, CSS2

## Use Cases & Benefits

### Adaptive Layout
- Creating flexible layout systems that respond to content flow
- Enabling elements to integrate naturally with surrounding inline or block content
- Reducing the need for complex layout workarounds

### Semantic Styling
- Allowing styled elements (like labels or headers) to blend with following content
- Creating contextual layout without additional markup changes
- Supporting responsive design patterns with minimal CSS rules

### Advanced Typography
- Enabling sophisticated text and heading arrangements
- Creating run-in headers or labels that flow with paragraph text
- Building complex document layouts programmatically

## Browser Support

### Legend
- **Y** - Supported
- **N** - Not supported
- **U** - Unknown/Partial support
- **#1** - See notes for details

### Desktop Browsers

| Browser | Status | Supported Versions |
|---------|--------|-------------------|
| **Internet Explorer** | Partial | 8-11 |
| **Edge** | Not Supported | All versions |
| **Firefox** | Not Supported | All versions |
| **Chrome** | Deprecated | 4-31 |
| **Safari** | Legacy | 3.1-6, Partial in 6.1 |
| **Opera** | Deprecated | 9-18 |

### Mobile Browsers

| Browser | Status | Details |
|---------|--------|---------|
| **iOS Safari** | Legacy | Supported in 3.2-7.1, not supported in 8+ |
| **Android Browser** | Deprecated | Supported in 2.1-4.4, not supported in 4.4.3+ |
| **Opera Mobile** | Deprecated | Supported in 10-12.1, not supported in 80+ |
| **Opera Mini** | Supported | All versions |
| **IE Mobile** | Supported | 10-11 |
| **BlackBerry** | Supported | 7, 10 |
| **Samsung Internet** | Not Supported | All versions |
| **Android Chrome** | Not Supported | Version 142+ |
| **Android Firefox** | Not Supported | Version 144+ |
| **UC Browser** | Not Supported | 15.5+ |
| **QQ Browser** | Not Supported | 14.9+ |
| **Baidu Browser** | Not Supported | 13.52+ |
| **KaiOS** | Not Supported | 2.5-3.1 |

## Implementation Details

### Browser Transition Timeline

**Early Support (2000s)**
- Safari: 3.1-6 (with limitations noted in 3.1-4)
- Chrome: 4-31
- Opera: 9-18

**IE Support**
- Internet Explorer 8-11 provided support
- IE Mobile versions 10-11 supported the feature

**Discontinuation**
- Most modern browsers dropped support after the mid-2010s
- Only Opera Mini and legacy mobile browsers maintain support
- The feature was likely removed due to complexity and low adoption

### Current Usage Statistics
- **Global Usage**: ~0.47% of websites
- **Prefix Required**: No
- **Legacy Only**: Yes

## Important Notes

### Note #1: Inline Element Limitation
The `run-in` value does not function correctly when it contains block-level elements that are not inline elements. Support varies across browsers, particularly in Safari versions 3.1-4.

### Browser-Specific Behaviors

**Legacy Browsers**
- Chrome versions 4-31 had full support but removed it in version 32
- Safari support was inconsistent across versions, with version 6.1 showing partial support
- Opera supported the feature up to version 18

**Mobile Considerations**
- iOS Safari discontinued support after version 7.1
- Android Browser support was similarly limited and discontinued
- Modern mobile browsers do not support this feature

## Recommendations

### Use Cases to Avoid
Given minimal modern browser support, `display: run-in` should not be used for new projects targeting current browsers. It is primarily of historical interest.

### Modern Alternatives

For adaptive layout needs, consider these modern approaches:
- **Flexbox** (`display: flex`) - For flexible one-dimensional layouts
- **CSS Grid** (`display: grid`) - For two-dimensional layouts with precise control
- **Inline-Flex/Inline-Grid** - For inline containers with flex/grid capabilities
- **Flow Layout** (`display: inline-block`, `display: inline`) - For basic inline/block mixing

### Backwards Compatibility

If maintaining support for legacy browsers is necessary:
- Provide fallback CSS rules using standard layout properties
- Use feature detection rather than browser detection
- Test thoroughly across targeted browser versions
- Consider progressive enhancement strategies

## Related Resources

### References
- [Mozilla Bug Report - Firefox Support](https://bugzilla.mozilla.org/show_bug.cgi?id=2056)
- [CSS Tricks: Understanding display: run-in](https://css-tricks.com/run-in/)

### Further Reading
- [W3C CSS Display Module Level 3 Specification](https://w3c.github.io/csswg-drafts/css-display-3/)
- [MDN Web Docs - display property](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [Can I use - display: run-in](https://caniuse.com/run-in)

## Summary

The `display: run-in` value is a legacy CSS feature that has been deprecated and is no longer supported in modern browsers. While it provided interesting layout capabilities, modern CSS layout methods (Flexbox, Grid) offer more powerful, flexible, and well-supported alternatives. This feature should only be considered when maintaining legacy codebases targeting older browsers from the 2000s-2010s era.

---

**Last Updated**: 2025
**Feature Status**: Candidate Recommendation (Deprecated in practice)
**Global Browser Support**: ~0.47% of websites
