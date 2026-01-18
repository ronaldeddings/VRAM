# Dataset & Data-* Attributes

## Overview

The `dataset` property and `data-*` attributes provide a standardized method of applying and accessing custom data to HTML elements without relying on non-standard attributes or extra properties.

---

## Description

Custom data attributes (prefixed with `data-`) allow developers to store custom data directly on HTML elements. The `dataset` property provides a convenient JavaScript API to access these attributes, automatically converting kebab-cased attribute names into camelCase properties.

### Two Access Methods

1. **Partial Support**: Using `getAttribute()` with `data-*` attributes
   - Works on older browsers and implementations
   - Requires manual string handling
   - Returns attribute values as strings

2. **Full Support**: Using the `dataset` property
   - Modern JavaScript API
   - Automatic camelCase conversion
   - Type-safe property access
   - Current spec standard

---

## Current Specification Status

- **Status**: Living Standard (ls)
- **Spec URL**: [HTML Standard - Embedding custom non-visible data with the data-* attributes](https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
- **Global Usage**: 93.59% (full support), 0.13% (partial support)

---

## Categories

- **HTML5**

---

## Benefits & Use Cases

### Developer Benefits

1. **Clean Semantic HTML**: Store data directly on elements without cluttering the DOM
2. **Data Association**: Link custom metadata to specific DOM elements
3. **JavaScript Integration**: Easy access to element-associated data via the `dataset` property
4. **No Naming Conflicts**: Standardized naming prevents conflicts with standard HTML attributes
5. **Search Engine Friendly**: Search engines understand and safely ignore data attributes

### Practical Use Cases

- **UI Component Libraries**: Store configuration and state data on component elements
- **Template Data**: Pass data from server to client-side JavaScript for dynamic rendering
- **Analytics**: Associate tracking IDs and metadata with interactive elements
- **Testing**: Store test identifiers and data for automated testing frameworks
- **Accessibility**: Store additional context for assistive technologies
- **Game Development**: Attach entity properties and game data to canvas elements
- **Form Validation**: Link validation rules and error messages to form fields
- **Theming**: Store theme preferences and styling metadata on elements

### Example Usage

```html
<!-- HTML: Define data attributes -->
<article data-article-id="1234" data-author="John Doe" data-published="2023-12-13">
  <h1>Article Title</h1>
</article>

<!-- JavaScript: Access via dataset property -->
<script>
const article = document.querySelector('article');

// Access data attributes
console.log(article.dataset.articleId);  // "1234"
console.log(article.dataset.author);     // "John Doe"
console.log(article.dataset.published);  // "2023-12-13"

// Modify data attributes
article.dataset.views = 150;
// Updates HTML to: data-views="150"

// Delete data attributes
delete article.dataset.author;
// Removes the data-author attribute
</script>
```

---

## Browser Support

### Support Legend
- **y** - Full support (via `dataset` property)
- **a** - Partial support (via `getAttribute()` only)
- **#1** - Footnote 1: SVG/MathML element support

### Desktop Browsers

| Browser | First Support | Latest | Notes |
|---------|---------------|--------|-------|
| **Internet Explorer** | 11 | 11 | Partial support in IE 5.5-10 |
| **Edge** | 12+ | 143 | Full support since v12 |
| **Firefox** | 6+ | 148 | Full support since v6 |
| **Chrome** | 7+ | 146 | Full support since v7 |
| **Safari** | 5.1+ | 18.5-18.6 | Full support since v5.1 |
| **Opera** | 11.1+ | 122 | Full support since v11.1 |

### Mobile & Tablet Browsers

| Browser | Platform | First Support | Latest | Notes |
|---------|----------|----------------|--------|-------|
| **Safari** | iOS | 5.0-5.1+ | 26.1 | Full support since iOS 5.0 |
| **Chrome** | Android | 142+ | 142 | Full support |
| **Firefox** | Android | 144+ | 144 | Full support |
| **Samsung Internet** | Android | 4+ | 29.0 | Full support since v4 |
| **Opera Mobile** | Android | 11.1+ | 80 | Full support since v11.1 |
| **Opera Mini** | All | ✗ No support | - | Partial support only |
| **Android Browser** | Android | 3+ | 4.4.3-4.4.4 | Full support since v3 |
| **Blackberry** | BB OS | 7+ | 10 | Full support since v7 |
| **IE Mobile** | Windows | 10 (partial), 11 (full) | - | Full support in v11 |

### Extended Support

| Browser | Notes |
|---------|-------|
| **UC Browser** | v15.5+ supported |
| **QQ Browser** | v14.9+ supported |
| **Baidu Browser** | v13.52+ supported |
| **KaiOS** | v2.5+ supported |

### SVG & MathML Support

Most modern browsers (marked with #1) also support `dataset` on SVG and MathML elements, exceeding the current HTML specification requirement which only specifies support on HTML elements.

---

## Known Issues & Limitations

### Safari Issues

- **Safari 10 and earlier**: May return `undefined` on `dataset` properties in some cases
  - See: [WebKit Bug #161454](https://bugs.webkit.org/show_bug.cgi?id=161454)
  - Workaround: Use `getAttribute()` as fallback

### Android Issues

- **Android 2.3**: Cannot read `data-*` properties from `<select>` elements
  - Affects partial support browsers
  - Use `getAttribute()` for form element data

### Browser Compatibility Notes

1. **Partial vs Full Support**:
   - Partial support means `data-*` attributes work but only via `getAttribute()`
   - Full support includes the modern `dataset` property API

2. **SVG/MathML Elements**:
   - HTML spec only requires support on HTML elements
   - Most browsers support it on SVG/MathML as well (see note #1)

3. **Type Handling**:
   - `dataset` property values are always strings
   - Must manually convert for other types: `parseInt()`, `JSON.parse()`, etc.

---

## Notes

### Specification Details

**Partial support** refers to being able to use `data-*` attributes and access them using `getAttribute()`.

**"Supported"** (full support) refers to accessing the values using the `dataset` property. The current HTML specification only requires support on HTML elements, though most browsers also have support for SVG/MathML elements.

### SVG & MathML Compliance

While the HTML spec doesn't require it, most modern browsers support `dataset` and `data-*` attributes on SVG elements, in compliance with [current plans for SVG2](https://www.w3.org/2015/01/15-svg-minutes.html#item03).

---

## Additional Resources

### Documentation & Guides

- **[MDN Web Docs - HTMLElement.dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset)** - Complete API reference
- **[MDN Guide - Using data-* attributes](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes)** - Comprehensive usage guide with best practices
- **[HTML5 Doctor - HTML5 Custom Data Attributes](https://html5doctor.com/html5-custom-data-attributes/)** - Best practices and patterns
- **[WebPlatform Docs - data-* attributes](https://webplatform.github.io/docs/html/attributes/data-*)** - Technical reference
- **[has.js detection](https://raw.github.com/phiggins42/has.js/master/detect/dom.js#dom-dataset)** - Feature detection code

### Live Examples

- **[HTML5 Demos - Dataset](https://html5demos.com/dataset)** - Interactive examples and demonstrations

---

## Implementation Examples

### Basic Usage

```html
<!-- Store configuration data -->
<div id="user-profile" data-user-id="42" data-role="admin">
  User Dashboard
</div>

<script>
const profile = document.getElementById('user-profile');
console.log(profile.dataset.userId);  // "42"
console.log(profile.dataset.role);    // "admin"
</script>
```

### Complex Data Storage

```html
<!-- Store JSON data -->
<button data-config='{"theme":"dark","notifications":true}'>Settings</button>

<script>
const button = document.querySelector('button');
const config = JSON.parse(button.dataset.config);
console.log(config.theme);  // "dark"
</script>
```

### Dynamic Data Assignment

```javascript
const element = document.querySelector('.widget');

// Add new data attributes dynamically
element.dataset.status = 'active';
element.dataset.lastUpdate = new Date().toISOString();

// Modify existing data
element.dataset.viewCount = parseInt(element.dataset.viewCount) + 1;

// Remove data attributes
delete element.dataset.temporary;
```

### Browser Compatibility Wrapper

```javascript
function getElementData(element, key) {
  // Modern browsers
  if (element.dataset) {
    return element.dataset[key];
  }
  // Fallback for older browsers
  return element.getAttribute('data-' + key);
}

function setElementData(element, key, value) {
  // Modern browsers
  if (element.dataset) {
    element.dataset[key] = value;
  } else {
    // Fallback for older browsers
    element.setAttribute('data-' + key, value);
  }
}
```

---

## Best Practices

1. **Use Semantic Names**: Choose descriptive names for data attributes (`data-user-id` vs `data-uid`)
2. **Type Conversion**: Remember that `dataset` values are always strings; convert types as needed
3. **Avoid Large Data**: Don't store large amounts of data in attributes; use data attributes for small metadata
4. **Prefer JSON for Complex Data**: Use JSON.stringify/parse for complex objects
5. **Performance Considerations**: Accessing `dataset` is as performant as regular properties
6. **Validation**: Validate data attribute names (must be valid HTML attribute names)
7. **Privacy**: Don't store sensitive information in data attributes (visible in page source)

---

## Standards & Compliance

- **HTML Standard**: Living Standard
- **Standardization Date**: Part of HTML5 specification (2011+)
- **Current Spec Version**: WHATWG Living Standard
- **Keywords**: DOMStringMap

---

*Documentation generated from CanIUse dataset.json*
*Last updated: December 13, 2025*
