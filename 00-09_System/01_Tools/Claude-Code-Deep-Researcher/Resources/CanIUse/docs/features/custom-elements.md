# Custom Elements (V0 Spec - Deprecated)

## Overview

Custom Elements is a web platform feature that allows developers to define and use custom HTML elements. This documentation covers the **deprecated V0 specification** from 2016. For current development, refer to [Custom Elements V1](./custom-elements-v1.md).

## Description

The Custom Elements V0 specification was the original working draft for creating custom HTML elements. It enabled developers to extend HTML by registering custom element definitions using `document.registerElement()`.

**Status:** This specification is deprecated. The V0 API has been superseded by the V1 specification, which provides a more robust and standardized approach to web components.

## Specification Details

- **Official Spec:** [W3C Custom Elements V0 Working Draft](https://www.w3.org/TR/2016/WD-custom-elements-20160226/)
- **Status:** Unofficial/Deprecated
- **Categories:** DOM, HTML5
- **Keywords:** `document.registerElement`

## Key Information

### Why V0 is Deprecated

The V0 specification has been superseded by the V1 specification, which offers:
- Improved lifecycle hooks and callbacks
- Better integration with ES6 classes
- Enhanced compatibility and standardization
- More predictable behavior across browsers

### Migration Path

If you're currently using Custom Elements V0, you should upgrade to V1. See the [Chrome DevRel blog post](https://developer.chrome.com/blog/web-components-time-to-upgrade/) for detailed migration guidance.

## Browser Support

### Support Status Legend

| Symbol | Meaning |
|--------|---------|
| **y** | Supported |
| **n** | Not supported |
| **p** | Partial support |
| **d** | Disabled by default |
| **p d** | Partial support, disabled by default |

### Browser Support Table

#### Desktop Browsers

| Browser | Support Status | Version Notes |
|---------|---|---|
| **Chrome** | Limited (V0 only) | v33-79: Fully supported (V0); v80+: Not supported |
| **Firefox** | Partial/Disabled | v23-58: Partial support with flag; v59+: Not supported |
| **Safari** | Partial | v6+: Partial support across all versions |
| **Edge** | Limited | v12-18: Partial support; v79: Supported; v80+: Not supported |
| **Internet Explorer** | Partial | v10-11: Partial support |
| **Opera** | Limited (V0 only) | v15-19: Partial with flag; v20-66: Fully supported; v67+: Not supported |

#### Mobile Browsers

| Browser | Support Status | Version Notes |
|---------|---|---|
| **iOS Safari** | Partial | v7+: Partial support across versions |
| **Android Browser** | V0 Support | v4.4.3+: Supported for V0 |
| **Samsung Internet** | V0 Support | v4-12: Fully supported (V0); v13+: Not supported |
| **Android Chrome** | Not supported | Current versions show no support |
| **Android Firefox** | Not supported | Current versions show no support |
| **Opera Mobile** | Not supported | Not supported |
| **UC Browser** | V0 Support | v15.5+: Supported for V0 |
| **QQ Browser** | V0 Support | v14.9+: Supported for V0 |

#### Specialized Browsers

| Browser | Support Status |
|---------|---|
| **Opera Mini** | Not supported |
| **BlackBerry** | Not supported (tested on v7, v10) |
| **Baidu** | Not supported |
| **KaiOS** | Partial with flag (v2.5); Not supported (v3.0+) |

## Support Summary

### Global Usage

- **Partial/Supported:** ~1.01% of tracked web traffic
- **Partial Support Available:** 0%
- **Prefix Required:** No

### Key Takeaways

1. **Minimal Modern Support:** V0 is no longer supported in modern versions of major browsers
2. **Legacy Compatibility:** Some older versions of desktop browsers (Chrome v33-79, Firefox v23-58 with flags) had support
3. **Mobile Considerations:** Limited mobile support; Safari and some Android variants offer partial support
4. **Not Recommended:** This specification should not be used for new projects

## Migration Recommendations

### For Existing V0 Users

If your project currently uses Custom Elements V0:

1. **Assess Current Usage:** Identify all uses of `document.registerElement()` in your codebase
2. **Review V1 Specification:** Familiarize yourself with the V1 API and lifecycle methods
3. **Plan Migration:** Create a phased migration plan, prioritizing high-impact elements
4. **Test Thoroughly:** Ensure compatibility across target browsers after migration
5. **Monitor Performance:** Check that the migration doesn't introduce performance regressions

### Recommended Modern Approach

For new projects, use Custom Elements V1 with proper framework support:

- Modern browsers with native support for the V1 API
- Polyfills available for browsers requiring legacy support
- Better integration with modern JavaScript frameworks (React, Vue, Angular, etc.)
- Enhanced tooling and developer experience

## Benefits & Use Cases (Historical)

While V0 is deprecated, it pioneered the concept of custom elements for:

- Creating reusable, encapsulated UI components
- Extending HTML vocabulary with domain-specific elements
- Building web components that work across different frameworks
- Promoting component-driven development

## Notes

- **No additional notes provided in source data**
- Always refer to the [Custom Elements V1](./custom-elements-v1.md) documentation for current best practices
- For browser compatibility with modern web components, verify V1 support instead

## Relevant Links

- [W3C Custom Elements V0 Specification](https://www.w3.org/TR/2016/WD-custom-elements-20160226/)
- [Upgrade Guide: V0 to V1 (Chrome DevRel)](https://developer.chrome.com/blog/web-components-time-to-upgrade/)
- [MDN Web Docs: Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements V1 Reference](./custom-elements-v1.md)

---

**Last Updated:** Based on CanIUse data snapshot
**Status:** Deprecated - Use Custom Elements V1 for new projects
**Chrome ID:** 4642138092470272
