# Node.compareDocumentPosition()

## Overview

The `Node.compareDocumentPosition()` method compares the relative position of two nodes to each other in the DOM tree. It returns a bitmask describing how the two nodes are related in the document structure.

## Specification

| Property | Value |
|----------|-------|
| **Status** | Living Standard |
| **Specification** | [DOM Standard - Node.compareDocumentPosition](https://dom.spec.whatwg.org/#dom-node-comparedocumentposition) |
| **MDN Reference** | [Node.compareDocumentPosition - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition) |

## Categories

- **DOM** - Core DOM API

## Use Cases and Benefits

### Common Use Cases

1. **DOM Tree Navigation**: Determine the positional relationship between any two nodes in the DOM tree without manually traversing parent/child relationships.

2. **Element Comparison**: Check whether one element comes before or after another in document order, useful for sorting elements.

3. **Ancestry Verification**: Verify if one node contains another node or if they share a common parent.

4. **Document Position Analysis**: Determine if nodes are in the same document or disconnected from the DOM structure.

### Benefits

- **Efficient Comparison**: Provides O(1) comparison results instead of traversing the DOM tree
- **Precise Relationship Data**: Returns detailed bitmask indicating the exact relationship between nodes
- **Cross-Document Support**: Can compare nodes across different documents (with caveats)
- **Standardized API**: Part of the DOM specification with consistent behavior across browsers

## Return Value

The method returns an integer bitmask with the following bit flags:

| Constant | Value | Meaning |
|----------|-------|---------|
| `DOCUMENT_POSITION_DISCONNECTED` | 1 | Nodes are disconnected from each other |
| `DOCUMENT_POSITION_PRECEDING` | 2 | The first node precedes the second node |
| `DOCUMENT_POSITION_FOLLOWING` | 4 | The first node follows the second node |
| `DOCUMENT_POSITION_CONTAINS` | 8 | The first node contains the second node |
| `DOCUMENT_POSITION_CONTAINED_BY` | 16 | The first node is contained by the second node |
| `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | 32 | The relationship is implementation-specific |

## Browser Support

### Desktop Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|--------|
| **Chrome** | 30 | ✅ Fully Supported |
| **Edge** | 12 | ✅ Fully Supported |
| **Firefox** | 4 | ✅ Fully Supported |
| **IE** | 9 | ✅ Fully Supported |
| **Opera** | 11.6 | ✅ Fully Supported |
| **Safari** | 10 | ✅ Fully Supported |

### Mobile Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|--------|
| **Android Browser** | 4.4 | ✅ Fully Supported |
| **Chrome Mobile** | 142 | ✅ Fully Supported |
| **Firefox Mobile** | 144 | ✅ Fully Supported |
| **IE Mobile** | 10 | ✅ Fully Supported |
| **Opera Mobile** | 12 | ✅ Fully Supported |
| **Safari iOS** | 10.0 | ✅ Fully Supported |
| **Samsung Internet** | 4 | ✅ Fully Supported |

### Historical Notes

- **Partial/Buggy Support (`a`)**: Chrome 15-29, Opera 15-16, Safari 5.1 and 6.1-9.1, iOS Safari 4.0-9.3, Android 2.3-4.1, BlackBerry 7 and 10
- **Unknown Support (`u`)**: Firefox 2-3.6, Chrome 4-14, Safari 3.1-5, Opera 9-11.5, iOS Safari 3.2, Android 2.1-2.2, Opera Mobile 10-11.5

## Known Issues and Bugs

### Issue #1: Document Position Bits for Disconnected Nodes

**Affected Versions**: Chrome 15-29, Opera 15-16, Safari 6.1-9.1, iOS Safari 4.0-9.3, Android 2.3-4.1, BlackBerry 7 and 10

When comparing nodes in different documents or nodes not in any document, the specification requires that either the `DOCUMENT_POSITION_PRECEDING` or `DOCUMENT_POSITION_FOLLOWING` bit must be set (arbitrarily but consistently). Some browser versions in this range fail to set either bit in certain such cases.

### Issue #2: Disconnected Bit Handling

**Affected Versions**: Safari 5.1, iOS Safari 5.0-5.1

When comparing nodes in different documents or comparing a node that is not in any document, these versions incorrectly omit both the `DOCUMENT_POSITION_DISCONNECTED` bit and the `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` bit.

## Usage Statistics

- **Full Support**: 93.67% of users
- **Partial/Buggy Support**: 0.02% of users
- **Overall**: 93.69% of web users have effective support

## Code Example

```javascript
// Get two elements
const element1 = document.getElementById('element1');
const element2 = document.getElementById('element2');

// Compare their positions
const comparison = element1.compareDocumentPosition(element2);

// Check specific relationships
if (comparison & Node.DOCUMENT_POSITION_CONTAINED_BY) {
  console.log('element1 is contained by element2');
}

if (comparison & Node.DOCUMENT_POSITION_CONTAINS) {
  console.log('element1 contains element2');
}

if (comparison & Node.DOCUMENT_POSITION_PRECEDING) {
  console.log('element1 comes before element2');
}

if (comparison & Node.DOCUMENT_POSITION_FOLLOWING) {
  console.log('element1 comes after element2');
}

if (comparison & Node.DOCUMENT_POSITION_DISCONNECTED) {
  console.log('element1 and element2 are disconnected');
}
```

## Related Features

- [Node.contains()](/features/node-contains.md) - Simpler method to check if one node contains another
- [Node.parentNode](/features/node-parent-node.md) - Access parent node in the DOM tree
- [Node.childNodes](/features/node-child-nodes.md) - Access child nodes
- [Element.offsetParent](/features/offset-parent.md) - Related DOM positioning API

## Browser Compatibility Table Summary

| Era | Status | Notes |
|-----|--------|-------|
| **2011-2012** | Gaining support | Firefox and IE 9+ support; Chrome still experimental |
| **2012-2013** | Widespread adoption | Chrome stabilizes support; Opera fully implements |
| **2013+** | Universal support | All major browsers fully support with minor caveats on older versions |

## Recommendation

**Status**: Safe to Use

The `compareDocumentPosition()` method is widely supported across all modern browsers and can be reliably used in production. For legacy browser support (IE 8 and earlier, older Safari/Chrome), consider using the `contains()` method as a simpler alternative or provide polyfill solutions.

If targeting older browsers, test thoroughly as there may be edge cases with disconnected nodes or cross-document comparisons.
