# CSS Text 4 text-spacing

## Overview

The `text-spacing` property is part of the CSS Text Module Level 4 specification. It controls spacing between adjacent characters on the same line within the same inline formatting context using a set of character-class-based rules. This property provides developers with fine-grained control over character spacing behavior in text rendering.

## Description

This property controls spacing between adjacent characters on the same line within the same inline formatting context using a set of character-class-based rules. It allows developers to apply sophisticated spacing rules based on the character types being rendered, enabling better typography control in multilingual and complex text scenarios.

## Specification Status

- **Current Status:** Working Draft (WD)
- **Specification URL:** [CSS Text Module Level 4 - text-spacing](https://w3c.github.io/csswg-drafts/css-text-4/#text-spacing-property)

## Categories

- CSS

## Benefits and Use Cases

The `text-spacing` property provides several benefits for web typography:

- **Multilingual Typography:** Better spacing control for languages with specific spacing rules between different character types
- **Asian Language Support:** Improved handling of spacing between Latin characters and Asian characters (CJK)
- **Professional Typography:** Fine-grained control over character spacing for publications and design-heavy applications
- **Text Rendering Consistency:** Standardized behavior across browsers for character spacing rules
- **Improved Readability:** Better control over spacing between punctuation and regular characters

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Supported |
| ⚠️ | Partial/Alternative Implementation |
| ❌ | Not Supported |

### Desktop Browsers

| Browser | First Support | Status | Notes |
|---------|---------------|--------|-------|
| Internet Explorer | 8.0 | ⚠️ Partial | Supports `-ms-text-autospace` property |
| Edge (Legacy) | 12-18 | ⚠️ Partial | Supports `-ms-text-autospace` property |
| Edge (Chromium) | 79+ | ❌ Not Supported | No support in current versions |
| Firefox | 2.0+ | ❌ Not Supported | No support across all versions |
| Chrome | 4.0+ | ❌ Not Supported | No support across all versions |
| Safari | 3.1+ | ❌ Not Supported | No support across all versions |
| Opera | 9.0+ | ❌ Not Supported | No support across all versions |

### Mobile Browsers

| Browser | Status |
|---------|--------|
| iOS Safari | ❌ Not Supported |
| Android Browser | ❌ Not Supported |
| Opera Mobile | ❌ Not Supported |
| Opera Mini | ❌ Not Supported |
| Samsung Internet | ❌ Not Supported |
| Android Chrome | ❌ Not Supported |
| Android Firefox | ❌ Not Supported |
| UC Browser | ❌ Not Supported |
| QQ Browser | ❌ Not Supported |
| Baidu Browser | ❌ Not Supported |
| KaiOS Browser | ❌ Not Supported |
| IE Mobile | ⚠️ Unknown | Partial support status |

## Implementation Notes

### IE/Edge Legacy Implementation

Internet Explorer 8.0 through 11.0 and Edge Legacy 12-18 provide support through the vendor-prefixed `-ms-text-autospace` property rather than the standard `text-spacing` property name. This is a Microsoft-specific implementation that predates the CSS Text Module Level 4 specification.

**Note #1:** IE accepts the `-ms-text-autospace` property

### Current Support Status

- **Global Usage:** 0.42% of users (supported browsers only)
- **Alternative Implementation:** 0% of users
- **Total Coverage:** Less than 1% of web users have browser support

## Compatibility Considerations

### Fallback Strategies

Since browser support for the standard `text-spacing` property is minimal, web developers should:

1. **Avoid relying on this property** for critical text layout in production applications
2. **Use vendor-prefixed alternatives** for older Internet Explorer/Edge versions if character spacing is essential
3. **Consider feature detection** before applying this property
4. **Test thoroughly** across target browsers before implementing in production

### Progressive Enhancement

For browsers that support the property, it can be used as a progressive enhancement to improve text rendering in specific scenarios. However, text should remain readable and properly formatted without this property.

## Relevant Links

- [MSDN - CSS Selectors: Spacing (Internet Explorer)](https://msdn.microsoft.com/library/ms531164(v=vs.85).aspx)
- [W3C CSS Text Module Level 4 Specification](https://w3c.github.io/csswg-drafts/css-text-4/#text-spacing-property)

## Implementation Status Summary

| Aspect | Status |
|--------|--------|
| Spec Status | Working Draft |
| Browser Support | < 1% global coverage |
| Mobile Support | Limited to IE Mobile (partial) |
| Production Ready | No - Limited browser support |
| Polyfill Available | No standard polyfill |
| Vendor Prefix | `-ms-text-autospace` (IE/Edge Legacy) |

## See Also

- [CSS Text Module Level 4](https://w3c.github.io/csswg-drafts/css-text-4/)
- Related CSS properties: `letter-spacing`, `word-spacing`, `text-align`, `text-justify`
- [Character Class Support in CSS](https://www.w3.org/TR/css-text-4/#text-spacing)

---

*Last Updated: 2025-12-13*
*Data Source: CanIUse Feature Database*
