# Ruby Annotation

## Overview

Ruby annotation is a method of adding pronunciation or other annotations using ruby elements, primarily used in East Asian typography. The `<ruby>` element allows you to mark up pronunciations, definitions, or translations of text without affecting the document structure.

## Description

Ruby annotations are inline elements that are typically used in Asian typography to display small text above or below the primary text. They are most commonly seen in:

- **Japanese**: Furigana (phonetic annotations)
- **Chinese**: Pinyin and zhuyin annotations
- **Korean**: Hangul annotations for hanja

The ruby annotation feature encompasses the use of `<ruby>`, `<rt>` (ruby text), and `<rp>` (ruby parenthesis) elements, allowing web developers to properly mark up these essential linguistic elements.

## Specification Status

- **Status**: Living Standard
- **Specification**: [WHATWG HTML Standard - Ruby Elements](https://html.spec.whatwg.org/multipage/semantics.html#the-ruby-element)
- **CSS Specification**: [CSS Ruby Layout Module Level 1](https://www.w3.org/TR/css-ruby-1/)

## Categories

- HTML5

## Use Cases & Benefits

### Primary Use Cases

1. **East Asian Typography**
   - Display furigana (small phonetic annotations) in Japanese text
   - Add pinyin annotations to Chinese characters
   - Provide hangul guides for hanja in Korean

2. **Language Learning**
   - Mark pronunciations for language learners
   - Provide definitions or translations inline

3. **Accessibility**
   - Enhance content readability for non-native speakers
   - Support screen readers with proper semantic markup

4. **Educational Content**
   - Annotate difficult or specialized terms
   - Provide contextual information without cluttering the layout

### Key Benefits

- **Semantic Markup**: Properly expresses linguistic relationships in code
- **Accessibility**: Screen readers can correctly interpret and announce annotations
- **Flexible Styling**: Can be styled with CSS to match design requirements
- **Fallback Support**: Browsers without native support can still display content with CSS
- **International Standards Compliance**: Follows established HTML specifications

## Browser Support

**Legend:**
- ✅ Full Support
- ⚠️ Partial Support
- ❌ Not Supported

### Desktop Browsers

| Browser | Versions | Support Status | Notes |
|---------|----------|----------------|-------|
| Chrome | 5+ | ✅ Full Support | Supported since version 5 |
| Firefox | 38+ | ✅ Full Support | Partial support until v37, full from v38 |
| Safari | 5+ | ⚠️ Partial Support | Supported since version 5 |
| Edge | 12+ | ⚠️ Partial Support | Supported since version 12 |
| Opera | 15+ | ⚠️ Partial Support | Partial support v9-12.1, full from v15 |
| Internet Explorer | All | ⚠️ Partial Support | Limited CSS Ruby specification support |

### Mobile Browsers

| Browser | Versions | Support Status | Notes |
|---------|----------|----------------|-------|
| iOS Safari | 5+ | ⚠️ Partial Support | Supported from version 5.0-5.1 |
| Android Browser | 3+ | ⚠️ Partial Support | Supported from version 3 |
| Chrome Mobile | 142+ | ✅ Full Support | Current versions fully supported |
| Firefox Mobile | 144+ | ✅ Full Support | Current versions fully supported |
| Samsung Internet | 4+ | ⚠️ Partial Support | Supported from version 4 |
| Opera Mobile | 80+ | ⚠️ Partial Support | Full support from version 80 |
| UC Browser | 15.5+ | ⚠️ Partial Support | Supported from version 15.5 |
| Opera Mini | All | ⚠️ Partial Support | Limited support across all versions |
| KaiOS | 2.5+ | ✅ Full Support | Supported from version 2.5 |

### Legacy Mobile Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| BlackBerry Browser 7 | ⚠️ Partial | Limited support |
| BlackBerry Browser 10+ | ⚠️ Partial | Supported from version 10 |
| IE Mobile 10+ | ⚠️ Partial | CSS Ruby specification v1 support |
| Baidu Browser 13.52+ | ⚠️ Partial | Supported from version 13.52 |
| QQ Browser 14.9+ | ⚠️ Partial | Supported from version 14.9 |

## Usage Statistics

- **Full Support**: 91.44%
- **Partial Support**: 2.19%
- **No Support**: 6.37%

## Known Issues & Limitations

### Known Bugs

1. **Nested Ruby Structures**
   - Internet Explorer and Firefox do not appear to have full support for nested ruby structures
   - [Test case example](https://jsfiddle.net/tabletguy/49412u7r/)

### Partial Support Limitations

Browsers with partial support may have limitations in the following areas:

- **Writing-mode**: May not fully support vertical text layouts
- **Complex Ruby**: Advanced ruby layout features may not be fully implemented
- **CSS3 Ruby**: Some CSS3 ruby-specific properties may not be supported

### CSS Fallback

Browsers without native support can still simulate ruby support using CSS. This allows for graceful degradation in older browsers.

## HTML Markup Example

```html
<ruby>
  漢字
  <rt>かんじ</rt>
</ruby>

<!-- With parentheses for older browsers -->
<ruby>
  漢字
  <rp>(</rp>
  <rt>かんじ</rt>
  <rp>)</rp>
</ruby>
```

## Related Keywords

- ruby-base
- ruby-text
- ruby-position
- ruby-merge
- ruby-align

## Resources & References

### Official Documentation

- [WHATWG HTML Standard - Ruby Elements](https://html.spec.whatwg.org/multipage/semantics.html#the-ruby-element)
- [CSS Ruby Layout Module Level 1](https://www.w3.org/TR/css-ruby-1/)

### Learning Resources

- [HTML5 Doctor - Ruby, RT, RP Element](https://html5doctor.com/ruby-rt-rp-element/)
- [WebPlatform Docs - Ruby Element](https://webplatform.github.io/docs/html/elements/ruby)

### Additional Notes

**CSS Support for Unsupported Browsers**: Browsers without native ruby support can still display ruby text using CSS styling. This provides a fallback mechanism for older browsers and ensures content remains readable even in browsers without native ruby support.

**IE9+ Compatibility Note**: Internet Explorer versions 9 and above support properties of an older version of the CSS Ruby specification. While full HTML5 ruby support is limited, these browsers can handle ruby text with CSS-based styling approaches.

---

**Last Updated**: 2025
**Source**: [Can I Use - Ruby annotation](https://caniuse.com/ruby)
