# classList (DOMTokenList)

## Overview

`classList` is a method of easily manipulating CSS classes on DOM elements using the `DOMTokenList` object. It provides a clean, modern API for adding, removing, toggling, and checking for the presence of CSS classes on any element, replacing the older string-based approach of manipulating the `className` property.

**Specification Status:** Living Standard
**First Standardized:** ECMAScript 5 / HTML5 era
**Usage Statistics:** 93.2% global browser support

---

## Specification

- **Official Specification:** [WHATWG DOM Specification - Element.classList](https://dom.spec.whatwg.org/#dom-element-classlist)
- **Status:** Living Standard (ls) - Actively maintained as part of the WHATWG DOM Standard

---

## Categories

- **DOM** - DOM manipulation and element interaction
- **HTML5** - Web platform core features

---

## Purpose & Benefits

### Core Benefits

1. **Clean API** - Replaces error-prone string manipulation with explicit methods
2. **Type Safety** - Returns `DOMTokenList` object with predictable behavior
3. **Improved Readability** - Code intent is immediately clear (`add()`, `remove()`, `toggle()`)
4. **Multiple Class Operations** - Modern versions support multiple class names in single calls
5. **Cross-browser Consistency** - Standardized behavior across all modern browsers

### Common Use Cases

- **Dynamic Styling** - Apply theme changes, active states, and validation feedback
- **UI State Management** - Show/hide elements, toggle visibility, animation states
- **Form Validation** - Visual feedback for valid/invalid form fields
- **Interactive Components** - Accordions, modals, tabs, dropdowns with dynamic classes
- **Animation Control** - Add/remove animation classes for transitions
- **Responsive Design** - Apply device-specific classes based on screen size
- **Accessibility** - Toggle aria-related classes for screen reader support
- **Framework Integration** - Underlying mechanism for many CSS-in-JS solutions

### Code Example

```javascript
const element = document.getElementById('myElement');

// Adding classes
element.classList.add('active');
element.classList.add('primary', 'highlighted'); // Modern: multiple classes

// Removing classes
element.classList.remove('inactive');
element.classList.remove('primary', 'highlighted'); // Modern: multiple classes

// Toggling classes
element.classList.toggle('visible');
element.classList.toggle('expanded', true); // Force to true/false

// Checking for class presence
if (element.classList.contains('active')) {
  console.log('Element is active');
}

// Replace a class (modern browsers)
element.classList.replace('oldClass', 'newClass');

// Get all classes
console.log(element.classList); // DOMTokenList

// Iterate through classes
for (const className of element.classList) {
  console.log(className);
}
```

---

## Browser Support

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | v28 | Partial support from v8-27 with limitations |
| **Edge** | v12 | Full support from initial release |
| **Firefox** | v26 | Partial support from v3.6-25 with limitations |
| **Safari** | v7 | Partial support from v5.1-6.1 with limitations |
| **Opera** | v15 | Partial support from v11.5-12.1 with limitations |
| **IE** | Not supported | Only available with limitations in IE 10-11 |
| **iOS Safari** | v7.0 | Partial support from v5.0-6.1 with limitations |
| **Android** | v4.4 | Partial support from v3-4.1 with limitations |

### Detailed Browser Support Table

```
Legend:
✅ = Full Support
⚠️  = Partial Support (with known limitations)
❌ = No Support
```

#### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 4-7 | ❌ | No support |
| Chrome | 8-27 | ⚠️ | Partial - missing SVG/MathML, toggle params, multiple params, assign/replace |
| Chrome | 28+ | ✅ | Full support |
| Edge | 12+ | ✅ | Full support since launch |
| Firefox | 2-3.5 | ❌ | No support |
| Firefox | 3.6-25 | ⚠️ | Partial - missing toggle params, multiple params |
| Firefox | 26+ | ✅ | Full support |
| Safari | 3.1-6.1 | ⚠️ | Partial - missing toggle params, multiple params |
| Safari | 7+ | ✅ | Full support |
| Opera (Presto) | 9-11.1 | ❌ | No support |
| Opera (Presto) | 11.5-12.1 | ⚠️ | Partial - missing toggle params, multiple params |
| Opera (Chromium) | 15+ | ✅ | Full support |
| IE | 5.5-9 | ❌ | No support |
| IE | 10-11 | ⚠️ | Partial - limited support with multiple issues |

#### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| iOS Safari | 3.2-4.3 | ❌ | No support |
| iOS Safari | 5.0-6.1 | ⚠️ | Partial support with limitations |
| iOS Safari | 7.0+ | ✅ | Full support |
| Android Browser | 2.1-2.3 | ❌ | No support |
| Android Browser | 3-4.1 | ⚠️ | Partial support with limitations |
| Android Browser | 4.4+ | ✅ | Full support |
| Android Chrome | Latest | ✅ | Full support |
| Android Firefox | Latest | ✅ | Full support |
| Opera Mobile | 10-12.1 | ⚠️ | Partial support |
| Opera Mobile | 80+ | ✅ | Full support |
| BlackBerry | 7 | ⚠️ | Partial support |
| BlackBerry | 10+ | ✅ | Full support |
| Samsung Internet | 4+ | ✅ | Full support |
| UC Browser | 15.5+ | ✅ | Full support |

---

## Known Issues & Limitations

### #1: SVG and MathML Element Support

**Affected Browsers:** IE 10-11, Chrome 8-27, Firefox 3.6-25, Safari 5.1-6.1, Opera (Presto) 11.5-12.1

**Description:** `classList` does not work on SVG or MathML elements in older browser versions. Only HTML elements support classList in these implementations.

**Workaround:**
```javascript
// For SVG elements in older browsers, use setAttribute
if (element instanceof SVGElement && !element.classList) {
  const currentClasses = element.getAttribute('class') || '';
  element.setAttribute('class', currentClasses + ' newClass');
}
```

### #2: Toggle Method - Second Parameter

**Affected Browsers:** Firefox 3.6-25, Chrome 8-27, Safari 5.1-6.1, Opera (Presto) 11.5-12.1

**Description:** The second parameter for the `toggle()` method (force flag) is not supported. This parameter allows forcing the class to be added or removed regardless of current state.

**Example of unsupported syntax:**
```javascript
// Not supported in older browsers
element.classList.toggle('active', true);  // Force add
element.classList.toggle('active', false); // Force remove
```

**Workaround:**
```javascript
function toggleClass(element, className, force) {
  if (force !== undefined) {
    if (force) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  } else {
    element.classList.toggle(className);
  }
}
```

### #3: Multiple Parameters for add() and remove()

**Affected Browsers:** IE 10-11, Chrome 8-27, Firefox 3.6-25, Safari 5.1-6.1, Opera (Presto) 11.5-12.1

**Description:** The ability to add or remove multiple classes in a single call is not supported. Only single class names work.

**Example of unsupported syntax:**
```javascript
// Not supported in older browsers
element.classList.add('primary', 'highlighted', 'active');
element.classList.remove('primary', 'highlighted');
```

**Workaround:**
```javascript
function addClasses(element, ...classes) {
  classes.forEach(className => {
    element.classList.add(className);
  });
}

function removeClasses(element, ...classes) {
  classes.forEach(className => {
    element.classList.remove(className);
  });
}

// Usage
addClasses(element, 'primary', 'highlighted', 'active');
removeClasses(element, 'primary', 'highlighted');
```

### #4: Assign and Replace Methods

**Affected Browsers:** IE 10-11

**Description:** IE 10-11 does not support:
- Direct assignment: `element.classList = newList`
- The `replace()` method: `element.classList.replace(oldClass, newClass)`

**Workaround for replace:**
```javascript
function replaceClass(element, oldClass, newClass) {
  if (element.classList.replace) {
    element.classList.replace(oldClass, newClass);
  } else {
    if (element.classList.contains(oldClass)) {
      element.classList.remove(oldClass);
      element.classList.add(newClass);
    }
  }
}
```

### Opera (Presto) - SVG/MathML Inconsistency

**Description:** Opera (Presto) has `classList` support on SVG elements but does NOT have support on MathML elements.

---

## DOMTokenList Methods

### Core Methods (Full Support)

#### `.add(...classes)`
Adds one or more tokens to the list.
```javascript
element.classList.add('active');
element.classList.add('primary', 'highlighted'); // Modern
```

#### `.remove(...classes)`
Removes one or more tokens from the list.
```javascript
element.classList.remove('inactive');
element.classList.remove('primary', 'highlighted'); // Modern
```

#### `.toggle(token[, force])`
Toggles a token. If force is provided, acts as add (true) or remove (false).
```javascript
element.classList.toggle('visible');
element.classList.toggle('expanded', isExpanded); // Modern
```

#### `.contains(token)`
Returns true if the token is in the list.
```javascript
if (element.classList.contains('active')) {
  // Element has active class
}
```

#### `.item(index)` / `[index]`
Returns the token at the specified index.
```javascript
const firstClass = element.classList.item(0);
const secondClass = element.classList[1];
```

### Modern Methods (IE 11 and older Chrome/Firefox not supported)

#### `.replace(oldToken, newToken)`
Replaces one token with another.
```javascript
element.classList.replace('oldClass', 'newClass');
```

#### `.supports(token)`
Returns true if the browser can parse the token as a valid class name.
```javascript
if (element.classList.supports('my-class-name')) {
  element.classList.add('my-class-name');
}
```

---

## Related Features & Technologies

### Related Web APIs
- [Element.className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) - Older string-based approach
- [Element.id](https://developer.mozilla.org/en-US/docs/Web/API/Element/id) - ID manipulation
- [Element.setAttribute()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) - General attribute manipulation

### Polyfills & Compatibility
- [classList.js](https://github.com/eligrey/classList.js) - Comprehensive polyfill for older browsers
- [Bootstrap classlist polyfill](https://github.com/jneen/prollyfill/) - Alternative polyfill

### Frameworks Using classList
- React (via `className` prop, maps to classList)
- Vue.js (via `:class` binding)
- Angular (via `[ngClass]` directive)
- jQuery (`.addClass()`, `.removeClass()`, `.toggleClass()` use classList internally)

---

## Resource Links

- [MDN Web Docs - Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element.classList)
- [WHATWG DOM Specification - Element.classList](https://dom.spec.whatwg.org/#dom-element-classlist)
- [Mozilla Hacks - classList in Firefox 3.6](https://hacks.mozilla.org/2010/01/classlist-in-firefox-3-6/)
- [SitePoint - Exploring the classList API](https://www.sitepoint.com/exploring-classlist-api/)
- [WebPlatform Docs - Element.classList](https://webplatform.github.io/docs/dom/Element/classList)
- [classList API Demo](https://www.audero.it/demo/classlist-api-demo.html)
- [Polyfill - classList.js](https://github.com/eligrey/classList.js)

---

## Migration from className

### Before (Legacy String Approach)
```javascript
// Adding a class
const classes = element.className.split(' ');
if (classes.indexOf('active') === -1) {
  classes.push('active');
}
element.className = classes.join(' ');

// Removing a class
element.className = element.className.replace(/\bactive\b/g, '');

// Checking for a class
const hasActive = element.className.includes('active');
```

### After (Modern classList)
```javascript
// Adding a class
element.classList.add('active');

// Removing a class
element.classList.remove('active');

// Checking for a class
const hasActive = element.classList.contains('active');
```

---

## Browser Support Summary

**Global Support:** 93.2%

- **Full Support:** Modern versions of all major browsers (Chrome 28+, Firefox 26+, Safari 7+, Edge 12+, Opera 15+)
- **Partial Support:** 0.43% (older IE versions, legacy mobile browsers)
- **No Support:** Legacy IE versions (5.5-9), older mobile browsers before 2012

**Recommendation:** Safe to use for modern web development. For applications supporting IE 10 or older, use a polyfill or fallback to string-based className manipulation.

---

**Last Updated:** 2025
**CanIUse Reference:** classlist
**Status:** Living Standard (Actively Maintained)
