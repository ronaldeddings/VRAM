# HTML Templates

## Overview

HTML templates provide a method of declaring a portion of reusable markup that is parsed but not rendered until cloned. This is a fundamental component of modern web development, particularly for building dynamic applications and web components.

## Description

The HTML `<template>` element allows developers to declare fragments of HTML that can be stored for later use in JavaScript. The content inside a `<template>` element is inert—it won't be rendered, images won't load, and scripts won't execute. This makes it ideal for:

- Defining reusable UI components
- Creating dynamic content generators
- Building web component templates
- Managing client-side templating without third-party libraries

## Specification Status

**Status:** Living Standard (LS)

**Specification:** [HTML Living Standard - The template Element](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)

The `<template>` element is a stable, standardized feature of the HTML specification maintained by the WHATWG (Web Hypertext Application Technology Working Group).

## Categories

- DOM
- HTML5

## Benefits & Use Cases

### Key Benefits

1. **Performance**: Markup is parsed but not rendered, improving page load times
2. **Reusability**: Define once, clone many times for consistent markup
3. **Dynamic Content**: Programmatically create elements from templates using JavaScript
4. **Web Components**: Essential building block for modern web component patterns
5. **Clean Code**: Separates template markup from JavaScript logic
6. **No Dependencies**: Built-in browser API, no third-party libraries needed

### Common Use Cases

- Building dynamic lists and tables
- Creating reusable UI components
- Implementing web component base classes
- Generating modal dialogs dynamically
- Managing form templates
- Creating SVG graphics programmatically
- Storing alternate content for different scenarios

## Browser Support

### Support Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 26-34 | Partial | Missing Document.importNode and Node.cloneNode support (#1, #2) |
| **Chrome** | 35+ | Full | Complete support |
| **Edge** | 12 | Not Supported | — |
| **Edge** | 13-14 | Partial | Missing Document.importNode and Node.cloneNode support (#1, #2) |
| **Edge** | 15+ | Full | Complete support |
| **Firefox** | 2-21 | Not Supported | — |
| **Firefox** | 22+ | Full | Complete support |
| **Safari** | 3.1-8 | Not Supported | — |
| **Safari** | 7.1-8 | Partial | Missing Document.importNode and Node.cloneNode support (#1, #2) |
| **Safari** | 9+ | Full | Complete support |
| **Opera** | 9-20 | Not Supported | — |
| **Opera** | 15-21 | Partial | Missing Document.importNode and Node.cloneNode support (#1) |
| **Opera** | 22+ | Full | Complete support |
| **iOS Safari** | 3.2-7.1 | Not Supported | — |
| **iOS Safari** | 8-8.4 | Partial | Missing Document.importNode and Node.cloneNode support (#1, #2) |
| **iOS Safari** | 9+ | Full | Complete support |
| **Android Browser** | 2.1-4.3 | Not Supported | — |
| **Android Browser** | 4.4+ | Full | Complete support |
| **Opera Mobile** | 10-79 | Not Supported | — |
| **Opera Mobile** | 80+ | Full | Complete support |
| **Chrome Android** | 142+ | Full | Complete support |
| **Firefox Android** | 144+ | Full | Complete support |
| **UC Browser** | 15.5+ | Full | Complete support |
| **Samsung Internet** | 4+ | Full | Complete support |
| **QQ Browser** | 14.9+ | Full | Complete support |
| **Baidu Browser** | 13.52+ | Full | Complete support |
| **KaiOS** | 2.5+ | Full | Complete support |
| **Opera Mini** | All | Not Supported | — |
| **Blackberry** | 7-10 | Not Supported | — |
| **Internet Explorer** | 5.5-11 | Not Supported | — |
| **IE Mobile** | 10-11 | Not Supported | — |

### Usage Statistics

- **Full Support:** 93.2% of users
- **Partial Support:** 0%
- **No Support:** 6.8% of users

### Global Support Status

Modern browsers have near-universal support for HTML templates. Only Internet Explorer and Opera Mini lack support entirely. If supporting legacy browsers is necessary, polyfills are available.

## Known Issues & Limitations

### Firefox Preloading Bug
Firefox may preload images inside `<template>` elements when it should not. This is tracked in [Bugzilla issue #1441044](https://bugzilla.mozilla.org/show_bug.cgi?id=1441044).

**Workaround:** Consider this behavior when placing image URLs or resource-heavy content in templates destined for Firefox users.

### Partial Support Limitations

Browsers with partial support (marked with #1 and #2) do not support:

1. **#1 - Document.importNode on templates:** Cannot use `document.importNode()` to import template content. Use `template.content.cloneNode(true)` instead.
2. **#2 - Node.cloneNode on templates:** Cannot directly clone template nodes or elements containing templates using `cloneNode()`.
3. **#3 - Safari 6.1 partial support:** Safari 6.1 has the same partial support level as Safari 7.1.

## Code Examples

### Basic Template Usage

```html
<template id="my-template">
  <div class="card">
    <h2 class="title"></h2>
    <p class="description"></p>
  </div>
</template>

<script>
const template = document.getElementById('my-template');
const clone = template.content.cloneNode(true);
clone.querySelector('.title').textContent = 'Hello World';
document.body.appendChild(clone);
</script>
```

### Web Component Pattern

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    const template = document.getElementById('my-component');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('my-component', MyComponent);
```

### Creating Multiple Instances

```javascript
const template = document.querySelector('template');
const container = document.getElementById('content');

const data = ['Item 1', 'Item 2', 'Item 3'];

data.forEach(item => {
  const clone = template.content.cloneNode(true);
  clone.querySelector('[data-item]').textContent = item;
  container.appendChild(clone);
});
```

## Useful Resources

### Documentation & Guides

- **[web.dev - HTML's New template Tag](https://web.dev/webcomponents-template/)** - Comprehensive guide to using templates with web components
- **[MDN - Template Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)** - Complete MDN documentation with examples
- **[WHATWG Specification](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)** - Official specification

### Polyfills & Tools

- **[Template Polyfill](https://github.com/manubb/template)** - Polyfill script for browsers with incomplete support

## Browser Compatibility Notes

### Recommended Approach

For modern applications targeting current browsers, `<template>` elements have excellent support. Consider the following:

1. **No Fallback Needed:** If your target audience is modern browsers (last 2 years), no polyfill is required.
2. **Legacy Support:** If you need to support Internet Explorer, use a polyfill or implement server-side rendering.
3. **Partial Support Workaround:** Avoid `document.importNode()` and `Node.cloneNode()` on templates. Always use `template.content.cloneNode(true)` for reliable cross-browser compatibility.

### Migration Path

If upgrading from older templating libraries (like Handlebars or Underscore.js), native `<template>` elements are now a viable replacement for most use cases, eliminating external dependencies.

---

**Last Updated:** December 2024

**Data Source:** CanIUse Feature Database
