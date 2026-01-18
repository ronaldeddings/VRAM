# DOM Manipulation Convenience Methods

## Overview

DOM manipulation convenience methods provide jQuery-like syntax for inserting, replacing, and appending DOM nodes. These methods simplify common DOM operations that previously required verbose native API calls.

## Description

These convenience methods accept any number of DOM nodes or HTML strings as arguments, making DOM manipulation more intuitive and readable. The specification includes:

- **`ChildNode.before()`** - Insert nodes before the element
- **`ChildNode.after()`** - Insert nodes after the element
- **`ChildNode.replaceWith()`** - Replace the element with other nodes
- **`ParentNode.prepend()`** - Insert nodes at the beginning of the element
- **`ParentNode.append()`** - Insert nodes at the end of the element

## Specification Status

**Status:** Living Standard (ls)

**Specification URLs:**
- [WHATWG DOM Specification - ChildNode Interface](https://dom.spec.whatwg.org/#interface-childnode)
- [WHATWG DOM Specification - ParentNode Interface](https://dom.spec.whatwg.org/#interface-parentnode)

## Categories

- DOM

## Use Cases & Benefits

### Simplified DOM Insertion
Replace verbose `insertBefore()` and `appendChild()` calls with cleaner, more readable methods.

```javascript
// Traditional approach
element.parentNode.insertBefore(newNode, element);

// Modern convenience method
element.before(newNode);
```

### Multiple Arguments
Insert multiple nodes or HTML strings in a single method call:

```javascript
element.before(node1, node2, '<span>HTML string</span>');
element.after(node1, node2, node3);
```

### Improved Readability
Code intent is immediately clear without understanding the nuances of the older API.

```javascript
// Clear and intentional
parent.prepend(firstChild);
parent.append(lastChild);
```

### Consistency with Popular Libraries
Developers familiar with jQuery find the syntax immediately recognizable and intuitive.

## Browser Support

### Desktop Browsers

| Browser | Supported Since | Status |
|---------|-----------------|--------|
| Chrome | 54 | Full support |
| Firefox | 49 | Full support |
| Safari | 10 | Full support |
| Edge | 17 (Chromium) | Full support |
| Opera | 41 | Full support |
| Internet Explorer | Never | Not supported |

### Mobile Browsers

| Browser | Supported Since | Status |
|---------|-----------------|--------|
| iOS Safari | 10.0 | Full support |
| Android Chrome | 54+ | Full support |
| Android Firefox | 49+ | Full support |
| Samsung Internet | 6.2 | Full support |
| Opera Mobile | 80+ | Full support |
| Android UC Browser | 15.5+ | Full support |

### Legacy Browsers

| Browser | Support |
|---------|---------|
| Internet Explorer 11 | Not supported |
| IE Mobile 10-11 | Not supported |
| Opera Mini | Not supported |
| BlackBerry Browser | Not supported |

## Global Usage

- **Supported by:** 93.02% of users globally
- **Partial support:** 0%
- **No support:** 6.98% of users

## Implementation Notes

### Feature Detection

```javascript
if (Element.prototype.before && Element.prototype.after) {
  // DOM convenience methods are supported
}
```

### Polyfill

For browsers that don't support these methods, the [DOM4 polyfill](https://github.com/WebReflection/dom4) can be used.

### Chrome Flag Requirement

Chrome versions 52-53 require the "Enable Experimental Web Platform Features" flag to be enabled in `chrome://flags`.

## Code Examples

### Basic Usage

```javascript
// Insert before
const element = document.getElementById('target');
element.before(document.createElement('div'));

// Insert after
element.after(document.createElement('span'));

// Replace element
element.replaceWith(document.createElement('article'));

// Prepend children
const parent = document.getElementById('container');
parent.prepend(document.createElement('header'));

// Append children
parent.append(document.createElement('footer'));
```

### Multiple Arguments

```javascript
const elem = document.getElementById('main');
const node1 = document.createElement('div');
const node2 = document.createElement('p');

// Insert multiple nodes
elem.before(node1, node2, '<span>Text node</span>');
```

### Replacing Content

```javascript
const oldContent = document.getElementById('content');
const newContent = document.createElement('section');

oldContent.replaceWith(newContent);
```

## Related Resources

- [WHATWG DOM Specification for ChildNode](https://dom.spec.whatwg.org/#interface-childnode)
- [WHATWG DOM Specification for ParentNode](https://dom.spec.whatwg.org/#interface-parentnode)
- [JS Bin Interactive Testcase](https://jsbin.com/fiqacod/edit?html,js,output)
- [DOM4 Polyfill](https://github.com/WebReflection/dom4)

## Compatibility Summary

### Widely Supported
These methods have excellent browser support with near-universal coverage in modern browsers. Chrome, Firefox, Safari, Edge, and Opera all have full support.

### Legacy Browser Handling
For projects requiring IE11 or older mobile browser support, use the DOM4 polyfill or implement fallback code using traditional DOM methods (`insertBefore`, `appendChild`, `removeChild`).

### Safe to Use
For modern web applications targeting browsers from 2016 onwards, these methods can be used without concern. The 93% global usage coverage makes this a safe choice for most projects.

## Notes

No known issues or bugs reported in the latest specification.
