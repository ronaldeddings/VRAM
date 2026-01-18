# matches() DOM Method

## Overview

The `matches()` DOM method allows you to test whether a specific DOM element matches a given CSS selector. This is a fundamental API for modern JavaScript development, enabling efficient element matching without querying the entire DOM.

## Description

Method of testing whether or not a DOM element matches a given selector. Formerly known (and largely supported with prefix) as `matchesSelector`.

The `matches()` method returns a boolean value indicating whether the element would be selected by the specified CSS selector string. This is particularly useful for:

- Event delegation patterns
- Conditional logic based on element selectors
- Filtering elements without DOM queries
- Dynamic element matching against selectors

## Specification Status

**Current Status:** Living Standard (ls)

**Official Specification:** [DOM Living Standard - Element.matches](https://dom.spec.whatwg.org/#dom-element-matches)

The `matches()` method is part of the WHATWG DOM specification and is actively maintained as a living standard. It has achieved broad cross-browser standardization and is recommended for production use.

## Categories

- DOM
- JS API

## Use Cases & Benefits

### Event Delegation
Use `matches()` to implement efficient event delegation patterns without hardcoding specific selectors:

```javascript
document.addEventListener('click', (event) => {
  if (event.target.matches('.button')) {
    handleButtonClick(event);
  }
});
```

### Conditional Logic
Test elements against selectors dynamically:

```javascript
const element = document.querySelector('.item');
if (element.matches('[data-active="true"]')) {
  console.log('Element is active');
}
```

### Traversing Up the DOM Tree
Combine with parent traversal to find matching ancestors:

```javascript
let current = event.target;
while (current && !current.matches('.container')) {
  current = current.parentElement;
}
```

### Efficient Filtering
Check element validity without querying the DOM:

```javascript
const elements = document.querySelectorAll('.item');
const filtered = Array.from(elements).filter(el =>
  el.matches(':not([disabled])')
);
```

### Framework-Independent Selectors
Test against complex selectors without library dependencies:

```javascript
if (element.matches('div.card:not(.archived) > .title')) {
  // Element matches the selector
}
```

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| **y** | Full support |
| **a x** | Partial support (with `-webkit-` or `-moz-` prefix as `matchesSelector`) |
| **n** | No support |

### Compatibility Table

#### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 4-33 | Partial (a x) | Requires `-webkit-matchesSelector()` prefix |
| **Chrome** | 34+ | Full (y) | Native `matches()` support |
| **Firefox** | 2-3.6 | None (n) | |
| **Firefox** | 3.6-33 | Partial (a x) | Requires `-moz-matchesSelector()` prefix |
| **Firefox** | 34+ | Full (y) | Native `matches()` support |
| **Safari** | 3.1-4 | None (n) | |
| **Safari** | 5-7 | Partial (a x) | Requires `-webkit-matchesSelector()` prefix |
| **Safari** | 7.1+ | Full (y) | Native `matches()` support |
| **Edge** | 12-14 | Partial (a x) | Requires prefix |
| **Edge** | 15+ | Full (y) | Native `matches()` support |
| **Opera** | 9-11.1 | None (n) | |
| **Opera** | 11.5-20 | Partial (a x) | Requires prefix |
| **Opera** | 21+ | Full (y) | Native `matches()` support |
| **Internet Explorer** | 5.5-8 | None (n) | Not supported |
| **Internet Explorer** | 9-11 | Partial (a x) | Requires prefix |

#### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **iOS Safari** | 3.2-7.1 | Partial (a x) | Requires `-webkit-matchesSelector()` prefix |
| **iOS Safari** | 8+ | Full (y) | Native `matches()` support |
| **Android Browser** | 2.1-4.4.3 | Partial (a x) | Requires prefix |
| **Android Browser** | 4.4.3+ | Full (y) | Native `matches()` support |
| **Chrome Mobile** | 142+ | Full (y) | Native `matches()` support |
| **Firefox Mobile** | 144+ | Full (y) | Native `matches()` support |
| **Samsung Internet** | 4 | Partial (a x) | Requires prefix |
| **Samsung Internet** | 5.0+ | Full (y) | Native `matches()` support |
| **Opera Mobile** | 10-12.1 | None/Partial | Limited or no support |
| **Opera Mobile** | 80+ | Full (y) | Native `matches()` support |
| **Opera Mini** | All | None (n) | Not supported |
| **BlackBerry** | 7-10 | Partial (a x) | Requires prefix |

#### Modern Mobile Coverage

| Browser | Latest Version | Support |
|---------|---|---|
| **Android Chrome** | 142+ | Full (y) |
| **Android Firefox** | 144+ | Full (y) |
| **UC Browser** | 15.5+ | Full (y) |
| **Baidu** | 13.52+ | Full (y) |
| **QQ Browser** | 14.9+ | Full (y) |
| **KaiOS** | 2.5+ | Full (y) |

## Browser Support Summary

### Global Support Statistics
- **Full Support:** 93.2% of global browser usage
- **Partial Support:** 0.45% of global browser usage

### Safe for Production
The `matches()` method is safe for production use. With 93.2% global support, it covers the vast majority of modern browsers. For older browser support, a polyfill or fallback pattern is recommended.

## Implementation Notes

### Partial Support Details

Partial support (`a x`) refers to supporting the **older specification's `matchesSelector` name** rather than just `matches`.

If you need to support older browsers with partial support, you can provide a polyfill:

```javascript
// Polyfill for older browsers
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    function(s) {
      const matches = (this.document || this.ownerDocument)
        .querySelectorAll(s);
      let i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}
```

### Legacy Prefix Support

For backward compatibility with older browsers (Firefox < 34, Chrome < 34, Safari < 7.1), you may need to check for prefixed versions:

```javascript
function elementMatches(element, selector) {
  const fn = element.matches ||
             element.webkitMatchesSelector ||
             element.mozMatchesSelector ||
             element.msMatchesSelector;

  return fn ? fn.call(element, selector) : false;
}
```

### No Prefix Required Today

Modern browsers (released after 2015) require no prefix. The `matches()` method is standardized and widely available.

## Use Cases by Browser Target

### Modern Applications (2016+)
For applications targeting modern browsers, use `matches()` directly without any prefixes or fallbacks:

```javascript
if (element.matches('.active')) {
  // Supported in all modern browsers
}
```

### Enterprise Applications (Supporting IE 11)
For applications needing IE 11 support, provide a polyfill or use an alternative approach:

```javascript
if (element.matches && element.matches('.active')) {
  // Use matches() if available
} else {
  // Fallback for IE
  const matches = element.parentElement.querySelectorAll('.active');
  // Alternative logic
}
```

### Fallback Pattern for Maximum Compatibility
```javascript
const matches = (element, selector) => {
  if (element.matches) return element.matches(selector);
  if (element.webkitMatchesSelector) return element.webkitMatchesSelector(selector);
  if (element.mozMatchesSelector) return element.mozMatchesSelector(selector);
  if (element.msMatchesSelector) return element.msMatchesSelector(selector);

  // Final fallback
  return Array.from(document.querySelectorAll(selector)).includes(element);
};
```

## Related Methods & APIs

### Element.closest()
Similar to `matches()`, but traverses up the DOM tree to find the nearest ancestor matching the selector:

```javascript
element.closest('.parent')
```

### CSS Selectors
The `matches()` method supports all CSS selectors, including:

- Simple selectors: `div`, `.class`, `#id`
- Attribute selectors: `[data-value="test"]`
- Pseudo-selectors: `:hover`, `:not()`, `:first-child`
- Combinators: `div > p`, `div + p`

## Additional Resources

### Official Documentation
- [MDN Web Docs - Element.matches](https://developer.mozilla.org/en/docs/Web/API/Element/matches)
- [WebPlatform Docs](https://webplatform.github.io/docs/dom/HTMLElement/matches)
- [WHATWG DOM Specification](https://dom.spec.whatwg.org/#dom-element-matches)

### Related Reading
- [Event Delegation Patterns](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
- [CSS Selectors Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
- [Element.closest() Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

## Summary

The `matches()` method is a mature, standardized DOM API with excellent browser support (93.2% globally). It's recommended for production use without worries about modern browser compatibility. For legacy browser support, simple polyfills or prefix detection patterns are available. This method is fundamental to modern JavaScript event handling and element filtering patterns.

---

**Last Updated:** 2025

**Status:** Living Standard

**Recommendation:** Safe for production use in modern applications
