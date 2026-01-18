# Custom Elements (V1)

## Overview

Custom Elements (V1) is one of the key features of the Web Components system, allowing developers to define new HTML tags with custom behavior and styling capabilities. This feature enables the creation of reusable, encapsulated web components that integrate seamlessly with the standard DOM API.

## Description

Custom Elements enable developers to:
- Create custom HTML tags with custom logic
- Extend existing HTML elements with enhanced functionality
- Define lifecycle hooks for element initialization, updates, and removal
- Encapsulate functionality and styling within custom components
- Build reusable, maintainable, and framework-agnostic web components

The V1 specification provides a standardized way to define custom elements using the `customElements.define()` API and leverages JavaScript classes to manage component lifecycle and behavior.

## Specification Status

**Status:** Living Standard (LS)

**Specification URL:** https://html.spec.whatwg.org/multipage/scripting.html#custom-elements

The Custom Elements specification is actively maintained as part of the WHATWG HTML specification, ensuring ongoing development and refinement based on real-world usage and browser implementation feedback.

## Categories

- **DOM** - Document Object Model
- **HTML5** - HTML5 Standard Features

## Benefits and Use Cases

### Benefits

1. **Code Reusability** - Create once, use anywhere across multiple projects
2. **Encapsulation** - Style and logic are contained within the component
3. **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
4. **Standards-Based** - Built on standardized APIs, not proprietary frameworks
5. **Progressive Enhancement** - Graceful degradation when not supported
6. **Native DOM Integration** - Full access to DOM APIs and events
7. **Lifecycle Management** - Built-in hooks for component initialization and cleanup

### Use Cases

- Building design system components
- Creating cross-framework component libraries
- Developing widget libraries for third-party integration
- Building micro frontends with isolated components
- Simplifying complex UI logic through modular components
- Creating portable components for diverse tech stacks

## Browser Support

### Support Status Legend

- **y** - Yes (Full support)
- **a** - Partial/Alternate (Limited or feature-specific support)
- **p** - Polyfill available (Requires polyfill for support)
- **n** - No (Not supported)

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Chrome** | 67 | ✅ Full support (67+) | Preview support from 54-66 |
| **Firefox** | 63 | ✅ Full support (63+) | Partial support 30-62 with preferences |
| **Safari** | 10.1+ | ⚠️ Partial support | Only "Autonomous custom elements" |
| **Edge** | 79 | ✅ Full support (79+) | Partial support from 12-18 |
| **Opera** | 64 | ✅ Full support (64+) | Preview support from 41-63 |
| **IE** | Not supported | ❌ No support | IE 10-11 show partial support |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **iOS Safari** | 10.3+ | ⚠️ Partial support | Only "Autonomous custom elements" |
| **Android Chrome** | 142 | ✅ Full support | Latest versions |
| **Android Firefox** | 144 | ✅ Full support | Latest versions |
| **Samsung Internet** | 6.2-6.4 | ✅ Full support | Good support since v6.2 |
| **Opera Mobile** | 80 | ✅ Full support | |
| **UC Browser** | 15.5 | ✅ Full support | |
| **Opera Mini** | All versions | ❌ No support | |
| **Blackberry** | Not supported | ❌ No support | |
| **IE Mobile** | 10-11 | ❌ No support | |

### Usage Statistics

- **Full Support (y):** 82.27% of global browser usage
- **Partial/Alternative (a):** 10.74% of global browser usage
- **Combined Coverage:** 92.01% of users can access this feature

## Implementation Details

### Two Types of Custom Elements

1. **Autonomous Custom Elements**
   - Standalone custom elements that don't extend built-in HTML elements
   - Example: `<my-component></my-component>`
   - Most broadly supported across browsers

2. **Customized Built-in Elements**
   - Extend existing HTML elements with custom behavior
   - Example: `<button is="my-button"></button>`
   - Limited support, particularly in Safari/WebKit browsers
   - See WebKit bug #182671 for details

### Firefox Compatibility Notes

- **Firefox 30-62:** Partial support with feature flags
  - Requires enabling `dom.webcomponents.enabled` preference in `about:config` (versions 30-49)
  - Requires enabling `dom.webcomponents.customelements.enabled` preference in `about:config` (versions 50-62)
- **Firefox 63+:** Full native support without preferences

### Safari and WebKit Limitation

Safari and other WebKit-based browsers support "Autonomous custom elements" but not "Customized built-in elements". See [WebKit bug 182671](https://bugs.webkit.org/show_bug.cgi?id=182671) for tracking information.

## Polyfill Support

For environments requiring support in older browsers, a polyfill is available:

- **Custom Elements Polyfill:** https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
- Provides `customElements.define()` functionality for unsupported browsers
- Useful for legacy browser support when building modern web components

## Related Resources

### Official Documentation

- [Google Developers - Custom elements v1: reusable web components](https://developers.google.com/web/fundamentals/primers/customelements/) - Comprehensive guide to building custom elements
- [WebKit Blog: Introducing Custom Elements](https://webkit.org/blog/7027/introducing-custom-elements/) - Apple's perspective on custom elements implementation

### Polyfills and Tools

- [Custom Elements Polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements) - Provides backward compatibility for older browsers

### Related Web Components APIs

When using Custom Elements, developers often combine them with:
- **Shadow DOM** - For style and DOM encapsulation
- **HTML Templates** - For reusable markup structures
- **Slots** - For component composition patterns

## Getting Started

### Basic Example

```javascript
// Define a custom element
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Called when element is inserted into the DOM
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>Hello from My Component!</p>
    `;
  }

  disconnectedCallback() {
    // Called when element is removed from the DOM
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Called when an observed attribute changes
  }

  static get observedAttributes() {
    return ['disabled', 'title'];
  }
}

// Register the custom element
customElements.define('my-component', MyComponent);
```

### Usage in HTML

```html
<my-component></my-component>
<my-component title="Custom Title"></my-component>
```

## Recommendation

Custom Elements (V1) is a mature, widely-supported web standard with excellent coverage across modern browsers (92% combined support). It is production-ready for:

- Modern web applications targeting current browser versions
- Design systems and component libraries
- Projects where framework-agnostic components are beneficial
- Building reusable UI components

For projects requiring support in older browsers (IE, early Edge), implement a polyfill or provide fallback UI experiences.

## See Also

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - MDN guide to Web Components
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) - Encapsulation with Shadow DOM
- [HTML Templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) - Template element for custom content
