# Document Object Model Range (DOM Range)

## Overview

The **DOM Range** API provides a contiguous range of content within a Document, DocumentFragment, or Attr node. This powerful API enables developers to work with arbitrary selections of content and perform operations on them programmatically.

## Description

DOM Range represents a contiguous sequence of content in the DOM tree. It allows you to:

- Select and manipulate arbitrary portions of a document
- Work with text, elements, and node hierarchies
- Perform text operations like extraction, deletion, and replacement
- Enable features like text editors, spell checkers, and search/replace functionality
- Support rich text editing capabilities

## Specification Status

- **Status**: Living Standard (LS)
- **Specification**: [WHATWG DOM Specification - Ranges](https://dom.spec.whatwg.org/#ranges)
- **Current Version**: Continuously updated as part of the living standard

## Categories

- **DOM** - Document Object Model
- **JS API** - JavaScript Application Programming Interface

## Benefits & Use Cases

### Core Benefits
- **Programmatic Selection**: Select document content without user interaction
- **Text Extraction**: Retrieve text from specific document ranges
- **Content Manipulation**: Modify, delete, or replace content within ranges
- **Rich Text Editing**: Foundation for implementing text editors and WYSIWYG editors
- **Search & Replace**: Implement find-and-replace functionality
- **Content Analysis**: Analyze and process document structure
- **Accessibility**: Support assistive technologies and screen readers

### Common Use Cases
1. **Text Editors**: WYSIWYG and rich text editing applications
2. **Search Functionality**: Highlighting search results in documents
3. **Spell Checking**: Identifying and marking misspelled words
4. **Content Management**: Programmatic document manipulation
5. **Copy/Paste Operations**: Controlling clipboard interactions
6. **Code Editors**: Syntax highlighting and code manipulation
7. **Document Processing**: Converting documents to different formats
8. **Accessibility Features**: Supporting keyboard navigation and selection

## API Overview

### Creating Ranges

```javascript
// Create a new range
const range = document.createRange();

// Get the current selection's range
const selection = window.getSelection();
const range = selection.getRangeAt(0);
```

### Common Methods

- `setStart(node, offset)` - Set the start position of the range
- `setEnd(node, offset)` - Set the end position of the range
- `selectNode(node)` - Select an entire node
- `selectNodeContents(node)` - Select the contents of a node
- `collapse(toStart)` - Collapse the range to a single point
- `cloneRange()` - Create a copy of the range
- `extractContents()` - Remove and return range contents
- `deleteContents()` - Delete range contents from the document
- `insertNode(node)` - Insert a node at the start of the range
- `compareBoundaryPoints()` - Compare boundary points of two ranges
- `toString()` - Get the text content of the range

### Common Properties

- `startContainer` - Node containing the range start
- `startOffset` - Offset within the start container
- `endContainer` - Node containing the range end
- `endOffset` - Offset within the end container
- `collapsed` - Whether the range is collapsed to a single point

## Browser Support

| Browser | Support | First Version | Current Status |
|---------|---------|---------------|----------------|
| **Chrome** | ✅ Full | v4 | All versions |
| **Firefox** | ✅ Full | v2 | All versions |
| **Safari** | ✅ Full | v3.1 | All versions |
| **Edge** | ✅ Full | v12 | All versions |
| **Opera** | ✅ Full | v9 | All versions |
| **Internet Explorer** | ⚠️ Partial | v6 (partial) | v9+ (full) |

### Mobile Browsers

| Browser | Support | Status |
|---------|---------|--------|
| **iOS Safari** | ✅ Full | v3.2+ |
| **Android Chrome** | ✅ Full | All versions |
| **Android Firefox** | ✅ Full | All versions |
| **Samsung Internet** | ✅ Full | All versions |
| **Opera Mobile** | ✅ Full | All versions |
| **UC Browser** | ✅ Full | v15.5+ |

### Legacy Browser Notes

- **IE 5.5**: Not supported (n)
- **IE 6-8**: Partial support (p) - Limited Range API functionality
- **IE 9+**: Full support (y)

### Overall Support Statistics

- **Global Support**: 93.69% of users have full support
- **Partial Support**: 0% (counted as no support)
- **No Support**: 6.31% (primarily legacy browsers)

## Implementation Notes

### Important Considerations

1. **Range Scope**: Ranges must be contained within a single document
2. **Text Nodes**: Ranges work with text nodes and element boundaries
3. **Dynamic Content**: Ranges don't automatically update when DOM changes
4. **Performance**: Creating many ranges can impact performance
5. **Browser Differences**: Implementation details may vary slightly between browsers

### Compatibility Polyfills

For supporting older browsers (particularly IE versions before 9), the **Rangy** library provides comprehensive Range API polyfills with fallbacks.

### Best Practices

1. **Always validate ranges** before using them
2. **Clean up ranges** when no longer needed to avoid memory leaks
3. **Use Selection API** for user-initiated selections
4. **Test in target browsers** as behavior may vary subtly
5. **Consider modern alternatives** like `Selection.setBaseAndExtent()` for newer projects

### Common Pitfalls

- Forgetting that offset represents character position, not node index
- Not accounting for DOM changes after range creation
- Assuming ranges persist across DOM modifications
- Not properly handling text nodes with whitespace

## Example Usage

### Basic Range Selection

```javascript
// Get the first paragraph
const paragraph = document.querySelector('p');

// Create a range that selects the entire paragraph
const range = document.createRange();
range.selectNode(paragraph);

// Get the text content of the range
console.log(range.toString());
```

### Text Extraction from Range

```javascript
// Create a range and select specific content
const range = document.createRange();
const startNode = document.getElementById('start');
const endNode = document.getElementById('end');

range.setStart(startNode.firstChild, 0);
range.setEnd(endNode.firstChild, 5);

// Extract the text
const selectedText = range.toString();
```

### Highlighting Search Results

```javascript
function highlightSearchTerm(searchTerm) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    const text = node.textContent;
    if (text.includes(searchTerm)) {
      const range = document.createRange();
      const index = text.indexOf(searchTerm);
      range.setStart(node, index);
      range.setEnd(node, index + searchTerm.length);

      // Apply highlighting
      const highlight = document.createElement('mark');
      range.surroundContents(highlight);
    }
  }
}
```

## Related APIs

- **[Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)** - User selection management
- **[TreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)** - DOM traversal
- **[NodeIterator](https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator)** - DOM iteration
- **[Mutation Observers](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)** - Monitor DOM changes

## Resources & References

### Official Documentation
- [MDN Web Docs - Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range) - Comprehensive reference with examples
- [WHATWG DOM Specification - Ranges](https://dom.spec.whatwg.org/#ranges) - Official specification

### Learning Resources
- [QuirksMode - DOM Range Introduction](https://www.quirksmode.org/dom/range_intro.html) - Historical reference and explanation
- [Rangy Library](https://github.com/timdown/rangy) - Polyfill with IE support for older browser compatibility

### Related Specifications
- [WHATWG DOM Specification](https://dom.spec.whatwg.org/)
- [Selection API Specification](https://w3c.github.io/selection-api/)

## Notes

- Comprehensive feature support details and browser-specific behavior can be found in the [MDN Web Docs - Range API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Range)
- The Range API is a cornerstone feature for any rich text editing implementation
- Most modern web applications requiring text selection or manipulation depend on this API
- IE support improvements from version 9 onwards make this API safe to use in most production scenarios
- For legacy browser support, the Rangy polyfill provides comprehensive fallbacks

## Support Matrix Summary

**Highly Supported**: DOM Range is one of the most widely supported DOM APIs with 93.69% global support across all browsers.

**Modern Browsers**: All modern browsers (Chrome, Firefox, Safari, Edge) have complete support from their earliest versions in active use.

**Mobile**: Excellent support across all mobile platforms ensures consistent behavior in mobile web applications.

**Legacy Consideration**: Only IE versions 5.5-8 have significant limitations or no support; IE9+ and all modern browsers fully support this API.

---

*Last Updated: 2024*
*Data Source: CanIUse - DOM Range Feature Support*
