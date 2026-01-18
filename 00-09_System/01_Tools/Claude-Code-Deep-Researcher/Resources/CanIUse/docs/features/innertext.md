# HTMLElement.innerText

## Overview

`HTMLElement.innerText` is a property that represents the rendered text content within a DOM element and its descendants. As a getter, it approximates the text that a user would see if they highlighted the contents of the element with the cursor and then copied it to the clipboard.

## Description

The `innerText` property provides a way to access the visible text content of an element, accounting for visual rendering and CSS styling. Unlike `textContent`, which returns all text regardless of visibility, `innerText` respects CSS display properties and only returns text that would be visible to the user.

### Key Characteristics

- **Render-aware**: Considers CSS styling and visibility when returning text
- **User-centric**: Returns text as the user would see it
- **Similar to copy-paste**: Approximates the behavior of selecting and copying element content
- **Complementary to textContent**: Offers an alternative to the standard `textContent` property with different behavior

## Specification Status

**Status:** Living Standard (ls)

**Specification URL:** https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute

The `innerText` property is now part of the WHATWG HTML Living Standard, having been standardized after years of de facto browser support.

## Categories

- **DOM** - Document Object Model

## Benefits & Use Cases

### Primary Use Cases

1. **Text Content Extraction**: Retrieve the visible text content from an element without HTML markup
2. **User Experience Simulation**: Get text as users would see it when copying content
3. **Accessibility Implementations**: Extract text for screen readers or accessibility tools
4. **Content Display**: Get rendered text content for display purposes
5. **Form Data Collection**: Extract visible text from dynamic content

### Key Benefits

- **Intuitive Behavior**: Returns text as visually rendered, matching user expectations
- **CSS-Aware**: Respects `display: none` and other visibility properties
- **Wide Support**: Supported across all major browsers with extensive version coverage
- **Practical Alternative**: Provides different semantics than `textContent` for specific use cases

## Browser Support

### Support Legend

- **✅ Yes (y)**: Fully supported
- **⚠️ Partial (a)**: Partially supported
- **❌ No (n)**: Not supported
- **⏱️ Unsupported (u)**: Unsupported

### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Internet Explorer** | 5.5 | ❌ | — |
| | 6-11 | ✅ | Full support |
| **Edge** | 12+ | ✅ | Full support across all versions |
| **Firefox** | 2-44 | ❌ | Not supported |
| | 45+ | ✅ | Full support since Firefox 45 |
| **Chrome** | 4+ | ✅ | Full support since first release |
| **Safari** | 3.1 | ⚠️ | Partial/Unsupported |
| | 3.2+ | ✅ | Full support since Safari 3.2 |
| **Opera** | 9 | ⚠️ | Partial/Unsupported |
| | 9.5+ | ✅ | Full support since Opera 9.5 |

### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 3.2 | ⚠️ | Partial/Unsupported |
| | 4.0+ | ✅ | Full support |
| **Android** | 2.1-2.2 | ⚠️ | Partial/Unsupported |
| | 2.3+ | ✅ | Full support |
| **Chrome Mobile** | 142 | ✅ | Full support |
| **Firefox Mobile** | 144 | ✅ | Full support |
| **Samsung Internet** | 4+ | ✅ | Full support |
| **Opera Mini** | all | ✅ | Full support |
| **Opera Mobile** | 10+ | ✅ | Full support |

### Global Browser Coverage

**Usage Statistics:**
- **Full Support (y):** 93.63% of users
- **Partial/Unsupported (a):** 0%
- **Not Supported (n):** 6.37% of users

## Implementation Notes

### Important Differences from `textContent`

`HTMLElement.innerText` is similar to, but has some important differences from, the standard [`Node.textContent`](https://caniuse.com/#feat=textcontent) property:

- **Visibility Awareness**: `innerText` respects CSS styling and visibility rules, while `textContent` does not
- **Performance**: `textContent` may be faster as it doesn't require layout recalculation
- **Line Breaking**: `innerText` includes line breaks as they appear visually, `textContent` does not

### Testing Coverage

This compatibility data is based on tests that verify:
- Property existence on HTMLElement
- Correct functionality in simple cases
- Proper text content retrieval

### Known Issues & Bugs

#### Internet Explorer 10-11

In IE10 and IE11, when using `innerText` (as well as `innerHTML` or `outerHTML`) on a `<textarea>` element that has a `placeholder` attribute, the returned HTML/text incorrectly includes the `placeholder`'s value as the actual `textarea`'s value.

**Reference:** [Microsoft Edge Platform Issue #101525](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101525/)

**Workaround:** Avoid using `innerText` on textarea elements in IE10/11, or test for this behavior and use alternative methods.

## Migration & History

### Evolution of the Property

For detailed historical context and more detailed cross-browser compatibility information, refer to [Kangax's comprehensive blog post on innerText](http://perfectionkills.com/the-poor-misunderstood-innerText/). This post includes:
- Historical development of the property
- Detailed cross-browser behavior explanations
- Comprehensive specification proposal
- Practical implementation guidance

### Standardization Journey

- **Original:** Introduced by Microsoft in Internet Explorer
- **De Facto Standard:** Became widely supported across browsers before formal standardization
- **Formal Standard:** Now part of the WHATWG HTML Living Standard

## Resources & References

### Official Documentation

- [MDN Web Docs - HTMLElement.innerText](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText) - Comprehensive guide with examples and browser compatibility details

### Standards & Discussions

- [WHATWG Compatibility Standard Issue #5](https://github.com/whatwg/compat/issues/5) - "spec innerText" - Official standardization discussion
- [WICG Discussion: Standardizing innerText](https://discourse.wicg.io/t/standardizing-innertext/799) - Web Incubator Community Group discussion on standardization

### Related Tools & Libraries

- [Rangy](https://github.com/timdown/rangy) - A JavaScript range and selection library that includes an innerText implementation and can serve as a polyfill

## Related Features

- [Node.textContent](https://caniuse.com/#feat=textcontent) - Standard DOM property for text content
- [HTMLElement.innerHTML](https://caniuse.com/#feat=innerhtml) - Related property for getting/setting HTML content
- [HTMLElement.outerHTML](https://caniuse.com/#feat=outerhtml) - Related property for getting/setting HTML including the element itself

## Summary

`HTMLElement.innerText` is a mature, widely-supported web platform API that provides a practical way to extract visible text content from DOM elements. With support exceeding 93% of users globally and availability across all major browsers (with limited legacy IE support being the main exception), it's safe to use in modern web applications. The property has been formally standardized and is the recommended approach for scenarios where CSS-aware text extraction is needed.
