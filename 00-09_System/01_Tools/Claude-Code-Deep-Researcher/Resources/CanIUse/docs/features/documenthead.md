# document.head

## Overview

`document.head` is a convenient property for accessing the `<head>` element of the document. It provides a direct reference to the document's head element without needing to query the DOM.

## Description

The `document.head` property is a convenience accessor that returns a reference to the `<head>` element in an HTML document. This is equivalent to accessing `document.querySelector('head')` but with more concise and readable syntax.

### Basic Usage

```javascript
// Get the head element
const headElement = document.head;

// Access head element properties
console.log(headElement.childNodes);

// Manipulate head content
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0';
document.head.appendChild(meta);
```

## Specification Status

**Status**: Living Standard (ls)

**Specification URL**: [HTML Living Standard - document.head](https://html.spec.whatwg.org/multipage/#dom-document-head)

The `document.head` property is part of the HTML Living Standard maintained by the WHATWG (Web Hypertext Application Technology Working Group).

## Categories

- **DOM**: Document Object Model API

## Use Cases & Benefits

### Common Use Cases

1. **Dynamic Meta Tag Injection**
   - Add meta tags for Open Graph, social media sharing
   - Inject viewport configuration
   - Add SEO-related metadata

2. **Style Management**
   - Dynamically insert stylesheets
   - Inject inline styles
   - Modify style elements

3. **Script Loading**
   - Insert script tags dynamically
   - Configure script attributes
   - Manage async/defer loading

4. **Document Metadata**
   - Access title element
   - Read existing meta information
   - Modify document charset or language

### Benefits

- **Cleaner Syntax**: More readable than `document.querySelector('head')`
- **Performance**: Direct property access without DOM query overhead
- **Convenience**: Single standardized way to access the head element
- **Reliability**: Guaranteed to exist in valid HTML documents
- **Standards Compliance**: Part of official HTML specification

## Browser Support

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Internet Explorer** | 9 | ✅ Supported (IE 9-11) | Not in IE 5.5-8 |
| **Edge** | 12 | ✅ Fully Supported | All versions from 12+ |
| **Firefox** | 4 | ✅ Fully Supported | All versions from 4+ |
| **Chrome** | 4 | ✅ Fully Supported | All versions from 4+ |
| **Safari** | 5.1 | ✅ Fully Supported | Partial in 5.0 (u), full from 5.1+ |
| **Opera** | 11 | ✅ Fully Supported | Not in versions 9-10.6 |
| **iOS Safari** | 4.0 | ✅ Fully Supported | Partial in 3.2 (u), full from 4.0+ |
| **Android Browser** | 2.3 | ✅ Fully Supported | Partial in 2.1-2.2 (u) |
| **Opera Mobile** | 11 | ✅ Fully Supported | Not in 10 |
| **Chrome Android** | 4 | ✅ Fully Supported | All versions |
| **Firefox Android** | 4 | ✅ Fully Supported | All versions |
| **Samsung Internet** | 4 | ✅ Fully Supported | All versions |
| **UC Browser** | 15.5 | ✅ Supported | |
| **BlackBerry Browser** | 7 | ✅ Supported | |
| **Opera Mini** | All | ✅ Fully Supported | Universal support |

### Support Summary

- **Global Usage**: 93.69% of users worldwide
- **Widely Supported**: Available in all modern browsers and most legacy browsers
- **Enterprise Safe**: Supported in IE 9+ making it suitable for legacy support

## Compatibility Notes

### Legacy Browsers

- **Internet Explorer 8 and earlier**: Not supported. Use fallback method:
  ```javascript
  const head = document.head || document.getElementsByTagName('head')[0];
  ```

- **Safari 5.0**: Partial support (marked as unknown/uncertain)

- **Android 2.1-2.2**: Partial support (marked as unknown/uncertain)

- **iOS Safari 3.2**: Partial support (marked as unknown/uncertain)

### Fallback Pattern

For maximum compatibility with older browsers:

```javascript
// Safely get the head element with fallback
const getHead = () => {
  return document.head || document.getElementsByTagName('head')[0];
};

const head = getHead();
```

### Modern Development

In modern web development (targeting modern browsers), `document.head` can be used directly without fallbacks:

```javascript
// Modern approach - safe for all current browsers
document.head.appendChild(element);
```

## Practical Examples

### Add a Meta Tag Dynamically

```javascript
function addMetaTag(name, content) {
  const meta = document.createElement('meta');
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
}

// Usage
addMetaTag('description', 'My page description');
addMetaTag('keywords', 'javascript, dom, web');
```

### Load a Stylesheet Dynamically

```javascript
function loadStylesheet(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Usage
loadStylesheet('https://example.com/styles.css');
```

### Inject Open Graph Tags

```javascript
function setOpenGraphMetaTags(data) {
  const tags = {
    'og:title': data.title,
    'og:description': data.description,
    'og:image': data.imageUrl,
    'og:url': data.pageUrl,
    'og:type': data.type || 'website'
  };

  Object.entries(tags).forEach(([property, content]) => {
    const meta = document.createElement('meta');
    meta.property = property;
    meta.content = content;
    document.head.appendChild(meta);
  });
}

// Usage
setOpenGraphMetaTags({
  title: 'My Article',
  description: 'This is my article',
  imageUrl: 'https://example.com/image.jpg',
  pageUrl: 'https://example.com/article'
});
```

### Access Existing Head Content

```javascript
// Get all meta tags
const metaTags = document.head.querySelectorAll('meta');

// Get specific meta tag
const viewport = document.head.querySelector('meta[name="viewport"]');

// Get all stylesheets
const stylesheets = document.head.querySelectorAll('link[rel="stylesheet"]');

// Get page title
const pageTitle = document.head.querySelector('title');
console.log(pageTitle.textContent); // Output the current page title
```

## Related APIs

- **`document.body`**: Similar property for accessing the `<body>` element
- **`document.documentElement`**: Reference to the root `<html>` element
- **`document.querySelector()`**: General DOM query method
- **`Element.appendChild()`**: Add child elements
- **`Element.querySelectorAll()`**: Query elements within a container

## References

- [MDN Web Docs - Document.head](https://developer.mozilla.org/en-US/docs/Web/API/Document/head)
- [HTML Living Standard - document.head](https://html.spec.whatwg.org/multipage/#dom-document-head)
- [W3C HTML Specification](https://www.w3.org/TR/html/)

## Additional Resources

### Related Features

- [`document.body`](./documentbody.md) - Direct access to body element
- [Meta Tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) - Metadata in HTML
- [Link Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) - External resources
- [Script Loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) - Dynamic scripts

### Learning Resources

- [DOM Manipulation Guide](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [HTML Head Element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML)
- [Web APIs Reference](https://developer.mozilla.org/en-US/docs/Web/API)

## Notes

- **No Known Bugs**: This is a stable, well-established API with no reported issues
- **Zero Prefixing Required**: No vendor prefixes needed
- **Guaranteed Existence**: In valid HTML documents, `document.head` is always available
- **Read-Only Property**: The property itself is read-only, but you can modify its contents

---

*Last Updated: 2025 | Based on CanIUse Data*
