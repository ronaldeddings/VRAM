# document.evaluate & XPath

## Overview

The `document.evaluate()` method and XPath functionality allow nodes in an XML/HTML document to be traversed and selected using XPath expressions. This is a powerful DOM API that enables developers to query documents using the standardized XML Path Language.

## Description

XPath (XML Path Language) is a query language for selecting nodes in an XML document. When combined with the DOM Level 3 XPath specification, it provides a standardized JavaScript API to evaluate XPath expressions against document nodes. The `document.evaluate()` method enables developers to:

- Query DOM elements using XPath expressions
- Navigate document structure using path-based syntax
- Select nodes based on complex criteria
- Work with both XML and HTML documents using a unified syntax

This feature is particularly useful for working with complex document structures, XML processing, and advanced DOM manipulation scenarios.

## Specification Status

**Status:** Unofficial (unoff)
**Specification URL:** [W3C DOM Level 3 XPath - evaluate() method](https://www.w3.org/TR/DOM-Level-3-XPath/xpath.html#XPathEvaluator-evaluate)

## Categories

- **DOM** - Document Object Model APIs
- **JS API** - JavaScript API features

## Benefits & Use Cases

### Benefits

- **Powerful Querying:** XPath is more expressive than CSS selectors for complex queries
- **Standardized Syntax:** Uses widely adopted XML Path Language specification
- **Cross-Platform:** Consistent implementation across modern browsers
- **Advanced Navigation:** Complex node selection based on attributes, text content, and structure
- **XML Support:** Native support for XML document querying

### Use Cases

- **XML Processing:** Querying and extracting data from XML documents
- **Complex DOM Queries:** Selecting elements based on complex criteria (e.g., elements with specific combinations of attributes)
- **Data Extraction:** Parsing structured XML/HTML data in web scraping scenarios
- **Legacy System Integration:** Working with systems that rely on XPath for document querying
- **SOAP/Web Services:** Processing XML responses from SOAP-based web services
- **Configuration Parsing:** Extracting data from XML configuration files

## Browser Support

This feature has **excellent browser support** across modern browsers, with **93.31% global usage**. Note that Internet Explorer and older browser versions lack support.

### Support Legend

- ✓ **Supported** - Feature fully implemented
- ✗ **Not Supported** - Feature not available
- ◐ **Partial/Unlikely** - Limited or experimental support

### Browser Support Table

#### Desktop Browsers

| Browser | First Version | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 4+ | ✓ Full Support | All modern versions |
| **Edge** | 12+ | ✓ Full Support | All versions from launch |
| **Firefox** | 3+ (partial in v2) | ✓ Full Support | Since Firefox 3 |
| **Safari** | 3.1+ | ✓ Full Support | All modern versions |
| **Opera** | 9.5+ (partial in v9) | ✓ Full Support | Since Opera 9.5 |
| **Internet Explorer** | Never | ✗ Not Supported | All versions (5.5-11) |

#### Mobile Browsers

| Browser | First Version | Current Support |
|---------|---------------|-----------------|
| **iOS Safari** | 3.2+ | ✓ Full Support |
| **Android Browser** | 2.1+ | ✓ Full Support |
| **Chrome Mobile** | Latest | ✓ Full Support |
| **Firefox Mobile** | Latest | ✓ Full Support |
| **Opera Mobile** | 10+ | ✓ Full Support |
| **Opera Mini** | All | ✓ Full Support |
| **IE Mobile** | 10, 11 | ✗ Not Supported |
| **BlackBerry** | 7+ | ✓ Full Support |
| **Samsung Internet** | 4+ | ✓ Full Support |

### Version Coverage Summary

- **Chrome:** v4 and above
- **Firefox:** v3 and above (v2 had partial support)
- **Safari:** v3.1 and above
- **Edge:** v12 and above
- **Opera:** v9.5 and above (v9 had partial support)
- **iOS Safari:** v3.2 and above
- **Android:** v2.1 and above

## Technical Details

### Specification Information

- **Type:** DOM API / JavaScript Interface
- **W3C Specification:** [DOM Level 3 XPath](https://www.w3.org/TR/DOM-Level-3-XPath/)
- **Keywords:** dom l3 xpath, dom level 3
- **Usage Percentage:** 93.31% of tracked users
- **Prefix Required:** No (no vendor prefixes needed)

### Basic Usage Example

```javascript
// Simple XPath query
const result = document.evaluate(
  "//div[@class='example']",
  document,
  null,
  XPathResult.FIRST_ORDERED_NODE_TYPE,
  null
);

const element = result.singleNodeValue;

// Query for multiple results
const nodeList = document.evaluate(
  "//p[contains(text(), 'search term')]",
  document,
  null,
  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  null
);

for (let i = 0; i < nodeList.snapshotLength; i++) {
  console.log(nodeList.snapshotItem(i));
}
```

## Notes

- **No Known Issues:** This feature is stable with no reported critical bugs
- **Internet Explorer Incompatibility:** If supporting IE is required, consider using polyfills or fallback selection mechanisms
- **Performance:** XPath evaluation may be slower than native DOM methods in some cases; consider using `querySelectorAll()` for basic CSS selector queries
- **Standards:** While the specification is at the W3C level, it is marked as "unofficial" status, though widely implemented

## Related Resources

### Official Documentation & Specifications

- [W3C DOM Level 3 XPath Specification](https://www.w3.org/TR/DOM-Level-3-XPath/xpath.html#XPathEvaluator-evaluate)
- [MDN Web Docs - Introduction to using XPath in JavaScript](https://developer.mozilla.org/en-US/docs/Introduction_to_using_XPath_in_JavaScript)

### Educational Resources

- [XPath in Javascript: Introduction](https://timkadlec.com/2008/02/xpath-in-javascript-introduction/) - Tim Kadlec's comprehensive guide
- [DOM XPath - WHATWG Wiki](https://wiki.whatwg.org/wiki/DOM_XPath)

### Browser Implementation

- [Improving Interoperability with DOM L3 XPath](https://blogs.windows.com/msedgedev/2015/03/19/improving-interoperability-with-dom-l3-xpath/) - Microsoft Edge team article on implementation

## Migration Notes

For developers transitioning from XPath to modern alternatives:

- **CSS Selectors:** Use `document.querySelectorAll()` for simple CSS-based queries
- **jQuery:** jQuery's selector engine supports most CSS3 selectors
- **Query Libraries:** Consider using libraries like lodash or underscore for complex DOM queries
- **Modern Alternatives:** The Selectors API (CSS selectors) covers most common use cases with better performance

## Global Usage

- **Supported:** 93.31% of tracked users
- **Partial Support:** 0%
- **Unsupported:** ~6.69% (primarily legacy IE users)

This excellent browser support makes XPath a reliable choice for modern web development when XPath-specific functionality is needed.

---

**Last Updated:** 2024
**Feature Name:** document.evaluate & XPath
**Feature ID:** document-evaluate-xpath
