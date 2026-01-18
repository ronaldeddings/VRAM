# Shadow DOM (V0 Specification)

## Overview

This document covers the **deprecated V0 version** of the Shadow DOM specification. Shadow DOM is a web component technology that allows encapsulation of DOM structures, styling, and behavior within isolated DOM trees.

> **Note:** This is the original V0 version which is no longer recommended. For modern development, refer to [Shadow DOM V1](./shadowdomv1.md) for current specifications and broader browser support.

## Description

Shadow DOM enables developers to create self-contained web components with encapsulated markup, styles, and scripts. The V0 specification was the first iteration of this technology and provided the foundation for web components development, allowing DOM subtrees to be hidden from the light DOM and styled independently.

## Specification Status

- **Status:** Unofficial/Deprecated
- **Specification URL:** https://www.w3.org/TR/shadow-dom/
- **Category:** DOM

## Browser Support

Shadow DOM V0 has limited support in modern browsers due to being deprecated in favor of V1. Below is a comprehensive support table:

### Desktop Browsers

| Browser | Version Range | Status | Notes |
|---------|---------------|--------|-------|
| **Chrome** | 25-34 | ✅ Partial | Requires `-webkit-` prefix |
| **Chrome** | 35-79 | ✅ Full | Full support without prefix |
| **Chrome** | 80+ | ❌ No | Support removed |
| **Firefox** | 29-60 | ✅ Partial | Available behind flag (`n d`) |
| **Firefox** | 61+ | ❌ No | Never fully implemented |
| **Safari** | All versions | ❌ No | No support |
| **Edge** | 12-78 | ❌ No | No support |
| **Edge** | 79 | ✅ Yes | Based on Chromium |
| **Edge** | 80+ | ❌ No | Support removed with V0 |
| **Opera** | 9-14 | ❌ No | No support |
| **Opera** | 15-21 | ✅ Partial | Requires `-webkit-` prefix |
| **Opera** | 22-66 | ✅ Full | Full support without prefix |
| **Opera** | 67+ | ❌ No | Support removed |
| **Internet Explorer** | All versions | ❌ No | No support |

### Mobile & Specialized Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **iOS Safari** | All versions | ❌ No | No support |
| **Android Browser** | 2.1-4.3 | ❌ No | No support |
| **Android Browser** | 4.4-4.4.4 | ✅ Partial | Requires `-webkit-` prefix |
| **Chrome Mobile** | All versions | ❌ No | Not supported in current versions |
| **Firefox Mobile** | All versions | ❌ No | No support |
| **Opera Mobile** | All versions | ❌ No | No support |
| **Opera Mini** | All versions | ❌ No | No support |
| **Samsung Internet** | 4 | ✅ Partial | Requires `-webkit-` prefix |
| **Samsung Internet** | 5.0-12.0 | ✅ Full | Full support |
| **Samsung Internet** | 13.0+ | ❌ No | Support removed with V0 |
| **QQ Browser** | 14.9 | ✅ Yes | Limited support |
| **UC Browser** | All versions | ❌ No | No support |
| **Baidu Browser** | All versions | ❌ No | No support |
| **KaiOS** | 2.5 | ✅ Yes | Limited support |
| **KaiOS** | 3.0-3.1 | ❌ No | No support |
| **Blackberry** | All versions | ❌ No | No support |

## Global Usage Statistics

- **Full Support:** 0.46%
- **Partial Support:** 0%
- **Total Coverage:** ~0.46% of tracked web usage

## Key Benefits & Use Cases

### Benefits (for historical context)

1. **DOM Encapsulation** - Hide internal DOM structures from external manipulation
2. **Style Scoping** - Styles defined within shadow trees don't leak to light DOM
3. **Web Components Foundation** - Core technology for building reusable web components
4. **Behavior Isolation** - JavaScript behavior contained within component boundaries
5. **Reduced Global Namespace Pollution** - Avoid naming conflicts with custom elements

### Use Cases

- Creating reusable UI components
- Building widget libraries
- Component-based applications
- Encapsulating third-party content
- Building design systems

## Important Notes

### Deprecation Warning

The V0 specification is **deprecated and no longer recommended** for new development. The following issues led to its deprecation:

- Limited browser support across the industry
- Significant differences between V0 and V1 specifications
- Breaking changes requiring code migration
- Firefox and Safari opted for V1 instead of V0

### Migration Path

If you're using Shadow DOM V0:

1. **Update to V1** - The modern, stable specification with broader support
2. **Use polyfills** - For older browsers, consider using the Shadow DOM polyfill
3. **Consider alternatives** - Evaluate CSS-in-JS solutions or other encapsulation approaches

### Key Differences: V0 vs V1

| Feature | V0 | V1 |
|---------|----|----|
| Browser Support | Limited | Widespread |
| API Stability | Deprecated | Current Standard |
| Multiple Shadow Roots | Supported | Single per element |
| Insert Points | `<content>` | `<slot>` |
| Shadow Host | ✅ | ✅ |
| CSS Scoping | ✅ | ✅ |

## Related Resources

### Official Documentation
- [W3C Shadow DOM Specification](https://www.w3.org/TR/shadow-dom/)
- [Google Developers - Shadow DOM v1: self-contained web components](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom)
- [HTML5Rocks - Shadow DOM 101 article](https://www.html5rocks.com/tutorials/webcomponents/shadowdom/)

### Browser Implementation Issues
- [Safari Implementation Bug Report](https://bugs.webkit.org/show_bug.cgi?id=148695)
- [Firefox Implementation Bug Report](https://bugzilla.mozilla.org/show_bug.cgi?id=1205323)

### Related Features
- **[Shadow DOM V1](./shadowdomv1.md)** - Modern Shadow DOM specification with better support
- **[HTML Templates](./template.md)** - Template elements often used with Shadow DOM
- **[Custom Elements](./custom-elements.md)** - Complement to Shadow DOM for web components
- **[Slot Element](./slot.md)** - V1 replacement for V0 content insertion

## Browser Compatibility Legend

- ✅ **Full Support** (`y`) - Feature fully implemented and working
- ✅ **Partial Support** (`y x`) - Feature implemented but requires vendor prefix
- ⚠️ **Behind Flag** (`n d`) - Feature available but disabled by default (requires manual enablement)
- ❌ **No Support** (`n`) - Feature not implemented

## When to Use This

### ❌ Don't Use for New Projects

If you're starting a new project, **use Shadow DOM V1 instead**. V0 is deprecated and support continues to decline.

### ✅ Legacy System Maintenance

Use this documentation if you're maintaining an existing system that uses Shadow DOM V0 and need to understand its support matrix or plan a migration strategy.

---

*Last Updated: Based on caniuse data current as of this documentation generation*
